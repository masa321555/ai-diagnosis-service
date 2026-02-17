import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
  }

  const db = client.db();
  const diagnosis = await db
    .collection('diagnoses')
    .findOne({ _id: new ObjectId(id) });

  if (!diagnosis) {
    return NextResponse.json({ error: '診断結果が見つかりません' }, { status: 404 });
  }

  // 所有者チェック
  if (diagnosis.userId !== session.user.id) {
    return NextResponse.json({ error: 'アクセス権限がありません' }, { status: 403 });
  }

  return NextResponse.json(diagnosis);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
  }

  const { memo } = await request.json();

  if (typeof memo !== 'string') {
    return NextResponse.json({ error: 'メモは文字列で入力してください' }, { status: 400 });
  }

  const db = client.db();
  const diagnosis = await db
    .collection('diagnoses')
    .findOne({ _id: new ObjectId(id) });

  if (!diagnosis) {
    return NextResponse.json({ error: '診断結果が見つかりません' }, { status: 404 });
  }

  if (diagnosis.userId !== session.user.id) {
    return NextResponse.json({ error: 'アクセス権限がありません' }, { status: 403 });
  }

  await db.collection('diagnoses').updateOne(
    { _id: new ObjectId(id) },
    { $set: { memo, updatedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: '無効なIDです' }, { status: 400 });
  }

  const db = client.db();
  const diagnosis = await db
    .collection('diagnoses')
    .findOne({ _id: new ObjectId(id) });

  if (!diagnosis) {
    return NextResponse.json({ error: '診断結果が見つかりません' }, { status: 404 });
  }

  if (diagnosis.userId !== session.user.id) {
    return NextResponse.json({ error: 'アクセス権限がありません' }, { status: 403 });
  }

  await db.collection('diagnoses').deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
