import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import client from '@/lib/db';

export async function GET(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const db = client.db();

    // フィルタ条件を構築
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && role !== 'all') {
      filter.role = role === 'admin' ? 'admin' : { $ne: 'admin' };
    }

    const [users, total] = await Promise.all([
      db.collection('users')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      db.collection('users').countDocuments(filter),
    ]);

    // 各ユーザーの診断数を取得
    const userIds = users.map((u) => u._id.toString());
    const diagCounts = await db.collection('diagnoses').aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]).toArray();
    const countMap = Object.fromEntries(diagCounts.map((d) => [d._id, d.count]));

    const result = users.map((u) => ({
      id: u._id.toString(),
      name: u.name ?? '—',
      email: u.email ?? '—',
      role: u.role ?? 'user',
      diagnosesCount: countMap[u._id.toString()] ?? 0,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: result, total });
  } catch (err) {
    console.error('Users API error:', err);
    return NextResponse.json({ error: 'ユーザー一覧の取得に失敗しました' }, { status: 500 });
  }
}
