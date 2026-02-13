import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import client from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const db = client.db();
  const user = await db.collection('users').findOne({ _id: session.user.id as unknown as import('mongodb').ObjectId });

  if (!user) {
    return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: user.image,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: '名前は必須です' }, { status: 400 });
  }

  const db = client.db();
  await db
    .collection('users')
    .updateOne(
      { _id: session.user.id as unknown as import('mongodb').ObjectId },
      { $set: { name: name.trim() } }
    );

  return NextResponse.json({ success: true });
}
