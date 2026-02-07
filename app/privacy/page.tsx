'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function PrivacyPolicy() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="md">
        <Typography
          component="h1"
          sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 700, mb: 2, color: '#1a1a2e' }}
        >
          プライバシーポリシー
        </Typography>
        <Typography sx={{ mb: 6, color: 'text.secondary' }}>最終更新日: 2026年2月7日</Typography>

        <Section title="1. はじめに">
          Career AI（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーは、当サービスにおける個人情報の取り扱いについて説明するものです。
        </Section>

        <Section title="2. 収集する情報">
          当サービスでは、以下の情報を収集する場合があります。
          {'\n\n'}
          ・Googleアカウント情報（Gmailアドレス、表示名）{'\n'}
          ・診断結果および回答データ{'\n'}
          ・アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）{'\n'}
          ・Cookieおよび類似技術による情報
        </Section>

        <Section title="3. 情報の利用目的">
          収集した情報は、以下の目的で利用します。
          {'\n\n'}
          ・キャリア診断サービスの提供および改善{'\n'}
          ・診断結果の保存・表示{'\n'}
          ・サービスの利用状況の分析{'\n'}
          ・ユーザーサポートへの対応{'\n'}
          ・サービスに関するお知らせの送信
        </Section>

        <Section title="4. 情報の第三者提供">
          当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          {'\n\n'}
          ・ユーザーの同意がある場合{'\n'}
          ・法令に基づく場合{'\n'}
          ・人の生命、身体または財産の保護のために必要な場合
        </Section>

        <Section title="5. 情報の管理">
          当サービスは、収集した個人情報の漏洩、紛失、改ざんを防止するため、適切なセキュリティ対策を講じます。
        </Section>

        <Section title="6. Cookieの使用">
          当サービスでは、ユーザー体験の向上やアクセス解析のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることが可能ですが、一部機能が利用できなくなる場合があります。
        </Section>

        <Section title="7. プライバシーポリシーの変更">
          当サービスは、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、サービス上でお知らせします。
        </Section>

        <Section title="8. お問い合わせ">
          本ポリシーに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。
        </Section>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Link href="/" sx={{ color: '#667eea', fontWeight: 600 }}>
            トップページに戻る
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        component="h2"
        sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, fontWeight: 700, mb: 2, color: '#1a1a2e' }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
        {children}
      </Typography>
    </Box>
  );
}
