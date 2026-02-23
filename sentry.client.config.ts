import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // パフォーマンス監視のサンプリングレート（0.0〜1.0）
  tracesSampleRate: 1.0,

  // 開発環境では無効化
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // デバッグモード（本番ではfalse）
  debug: false,
});
