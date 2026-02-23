import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status });
  }

  const sentryConfigured = !!process.env.SENTRY_DSN;

  // Sentry未設定時はプレースホルダーとして空配列を返す
  // Sentry設定後は、Sentryダッシュボードで直接確認するか、
  // Sentry API経由でエラーを取得する拡張が可能
  const errors: unknown[] = [];

  return NextResponse.json({
    sentryConfigured,
    errors,
  });
}
