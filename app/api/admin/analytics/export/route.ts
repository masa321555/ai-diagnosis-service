import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const db = client.db();

    // 全診断データを取得
    const diagnoses = await db.collection('diagnoses')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // ユーザー名マップ
    const userIds = [...new Set(diagnoses.map((d) => d.userId))];
    const users = await db.collection('users')
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .project({ name: 1, email: 1 })
      .toArray();
    const userMap = Object.fromEntries(
      users.map((u) => [u._id.toString(), { name: u.name, email: u.email }])
    );

    // CSV構築
    const BOM = '\uFEFF'; // Excel対応のBOM
    const headers = ['診断ID', 'ユーザー名', 'メール', 'キャリアタイプ', 'キャッチフレーズ', '診断日時'];
    const rows = diagnoses.map((d) => {
      const user = userMap[d.userId] ?? { name: '不明', email: '—' };
      return [
        d._id.toString(),
        `"${(user.name ?? '').replace(/"/g, '""')}"`,
        user.email ?? '—',
        `"${(d.result?.careerType ?? '').replace(/"/g, '""')}"`,
        `"${(d.result?.catchphrase ?? '').replace(/"/g, '""')}"`,
        d.createdAt ? new Date(d.createdAt).toISOString() : '—',
      ].join(',');
    });

    const csv = BOM + [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="diagnoses_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error('CSV export error:', err);
    return NextResponse.json({ error: 'CSVエクスポートに失敗しました' }, { status: 500 });
  }
}
