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
    birthday: user.birthday ?? null,
    gender: user.gender ?? null,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { name, birthday, gender } = await request.json();

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: '名前は必須です' }, { status: 400 });
  }

  const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
  if (gender !== undefined && gender !== null && !validGenders.includes(gender)) {
    return NextResponse.json({ error: '不正な性別の値です' }, { status: 400 });
  }

  const updateFields: Record<string, unknown> = { name: name.trim() };
  if (birthday !== undefined) updateFields.birthday = birthday || null;
  if (gender !== undefined) updateFields.gender = gender || null;

  const db = client.db();
  await db
    .collection('users')
    .updateOne(
      { _id: session.user.id as unknown as import('mongodb').ObjectId },
      { $set: updateFields }
    );

  return NextResponse.json({ success: true });
}
