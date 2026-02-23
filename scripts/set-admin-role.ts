/**
 * 管理者ロール設定スクリプト
 * 使用方法: npx tsx scripts/set-admin-role.ts <メールアドレス>
 *
 * 例: npx tsx scripts/set-admin-role.ts admin@example.com
 */

import { MongoClient } from 'mongodb';

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('使用方法: npx tsx scripts/set-admin-role.ts <メールアドレス>');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI 環境変数が設定されていません');
    console.error('.env.local ファイルを確認してください');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const result = await db.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.error(`ユーザーが見つかりません: ${email}`);
      console.error('先にGoogleログインでアカウントを作成してください');
      process.exit(1);
    }

    console.log(`✓ ${email} を管理者に設定しました`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
