import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import client from '@/lib/db';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session: updateData }) {
      // サインイン時: ユーザー情報でトークンを全て更新
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;

        // ロールを判定: ADMIN_EMAILS環境変数 or MongoDBのroleフィールド
        const adminEmails = (process.env.ADMIN_EMAILS ?? '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
        const isEnvAdmin = !!user.email && adminEmails.includes(user.email.toLowerCase());

        try {
          const db = client.db();
          const dbUser = await db.collection('users').findOne(
            { _id: new ObjectId(user.id) },
            { projection: { role: 1 } }
          );

          if (isEnvAdmin && dbUser?.role !== 'admin') {
            // 環境変数で指定されているがDBにまだ反映されていない場合、DBも更新
            await db.collection('users').updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { role: 'admin' } }
            );
            token.role = 'admin';
          } else {
            token.role = dbUser?.role ?? (isEnvAdmin ? 'admin' : 'user');
          }
        } catch {
          token.role = isEnvAdmin ? 'admin' : 'user';
        }
      }
      // クライアントから update({ name }) が呼ばれた際にトークンを更新
      if (trigger === 'update' && updateData?.name) {
        token.name = updateData.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.picture) {
        session.user.image = token.picture as string;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});
