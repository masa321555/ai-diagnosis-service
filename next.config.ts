import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry組織・プロジェクト設定（SENTRY_ORG, SENTRY_PROJECT環境変数で上書き可能）
  org: process.env.SENTRY_ORG ?? "",
  project: process.env.SENTRY_PROJECT ?? "",

  // ソースマップアップロードを無効化（DSN未設定時）
  silent: !process.env.SENTRY_AUTH_TOKEN,

  // Sentryのバンドルサイズ最適化
  widenClientFileUpload: true,
  disableLogger: true,
});
