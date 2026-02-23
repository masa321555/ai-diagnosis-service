import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    // ミドルウェアでもroleを参照できるようJWT→sessionに伝播
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ['/dashboard', '/profile', '/diagnosis', '/admin'];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return false; // /auth/signin にリダイレクト
      }

      // /admin配下はadminロールのみアクセス可能
      if (nextUrl.pathname.startsWith('/admin')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const role = (auth as any)?.user?.role;
        if (role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // auth.ts で設定
} satisfies NextAuthConfig;
