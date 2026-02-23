import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

// ユーザー詳細取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const { id } = await params;
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // ユーザーの診断履歴
    const diagnoses = await db.collection('diagnoses')
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .project({ 'result.careerType': 1, createdAt: 1 })
      .toArray();

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role ?? 'user',
      birthday: user.birthday ?? null,
      gender: user.gender ?? null,
      createdAt: user.createdAt,
      diagnoses: diagnoses.map((d) => ({
        _id: d._id.toString(),
        careerType: d.result?.careerType ?? '—',
        createdAt: d.createdAt,
      })),
    });
  } catch (err) {
    console.error('User detail API error:', err);
    return NextResponse.json({ error: 'ユーザー情報の取得に失敗しました' }, { status: 500 });
  }
}

// ロール変更
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: '無効なロールです' }, { status: 400 });
    }

    const db = client.db();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Role update API error:', err);
    return NextResponse.json({ error: 'ロール変更に失敗しました' }, { status: 500 });
  }
}
