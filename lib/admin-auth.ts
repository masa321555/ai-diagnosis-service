import { auth } from '@/auth';

/**
 * 管理者認証ヘルパー
 * API Route内でadminロールを検証する
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: '未認証', status: 401 as const, session: null };
  }

  if (session.user.role !== 'admin') {
    return { error: '権限がありません', status: 403 as const, session: null };
  }

  return { error: null, status: 200 as const, session };
}
