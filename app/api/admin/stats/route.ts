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

    // 本日の開始時刻
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 並列でデータ取得
    const [todayDiagnoses, totalDiagnoses, activeUsers, recentDiagnosesRaw] = await Promise.all([
      db.collection('diagnoses').countDocuments({ createdAt: { $gte: todayStart } }),
      db.collection('diagnoses').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('diagnoses')
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    // 最近の診断にユーザー名を付与
    const userIds = [...new Set(recentDiagnosesRaw.map((d) => d.userId))];
    const users = await db.collection('users')
      .find({ _id: { $in: userIds.map((id) => new ObjectId(id)) } })
      .project({ name: 1 })
      .toArray();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u.name]));

    const recentDiagnoses = recentDiagnosesRaw.map((d) => ({
      _id: d._id.toString(),
      userName: userMap[d.userId] ?? '不明',
      careerType: d.result?.careerType ?? '—',
      createdAt: d.createdAt,
    }));

    // DB接続状態チェック
    let dbStatus: 'connected' | 'error' = 'connected';
    try {
      await db.command({ ping: 1 });
    } catch {
      dbStatus = 'error';
    }

    return NextResponse.json({
      todayDiagnoses,
      totalDiagnoses,
      activeUsers,
      recentDiagnoses,
      dbStatus,
    });
  } catch (err) {
    console.error('Stats API error:', err);
    return NextResponse.json({ error: '統計データの取得に失敗しました' }, { status: 500 });
  }
}
