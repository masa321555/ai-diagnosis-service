import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import client from '@/lib/db';

export async function GET(request: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const period = request.nextUrl.searchParams.get('period') || 'daily';
    const db = client.db();

    // 期間に応じた日付フォーマット
    let dateFormat: string;
    let daysBack: number;
    switch (period) {
      case 'monthly':
        dateFormat = '%Y-%m';
        daysBack = 365;
        break;
      case 'weekly':
        dateFormat = '%Y-W%V';
        daysBack = 90;
        break;
      default: // daily
        dateFormat = '%Y-%m-%d';
        daysBack = 30;
    }

    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    // 診断数の推移
    const trendPipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 as const } },
    ];
    const trendData = await db.collection('diagnoses').aggregate(trendPipeline).toArray();
    const diagnosisTrend = trendData.map((d) => ({ date: d._id, count: d.count }));

    // 人気キャリアパスTOP10
    const careerPipeline = [
      { $match: { 'result.careerType': { $exists: true } } },
      { $group: { _id: '$result.careerType', count: { $sum: 1 } } },
      { $sort: { count: -1 as const } },
      { $limit: 10 },
    ];
    const careerData = await db.collection('diagnoses').aggregate(careerPipeline).toArray();
    const topCareers = careerData.map((d) => ({ name: d._id, count: d.count }));

    // 診断完了率（診断があるユーザー vs ないユーザー）
    const [totalUsers, usersWithDiagnosis] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('diagnoses').aggregate([
        { $group: { _id: '$userId' } },
        { $count: 'count' },
      ]).toArray(),
    ]);
    const withDiag = usersWithDiagnosis[0]?.count ?? 0;
    const completionRate = [
      { name: '診断済み', value: withDiag },
      { name: '未診断', value: totalUsers - withDiag },
    ];

    return NextResponse.json({
      diagnosisTrend,
      topCareers,
      completionRate,
    });
  } catch (err) {
    console.error('Analytics API error:', err);
    return NextResponse.json({ error: '分析データの取得に失敗しました' }, { status: 500 });
  }
}
