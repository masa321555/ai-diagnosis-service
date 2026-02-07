'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Terms() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="md">
        <Typography
          component="h1"
          sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 700, mb: 2, color: '#1a1a2e' }}
        >
          利用規約
        </Typography>
        <Typography sx={{ mb: 6, color: 'text.secondary' }}>最終更新日: 2026年2月7日</Typography>

        <Section title="第1条（適用）">
          本規約は、Career AI（以下「当サービス」）の利用に関する条件を定めるものです。ユーザーは、本規約に同意の上、当サービスを利用するものとします。
        </Section>

        <Section title="第2条（サービス内容）">
          当サービスは、AIを活用したキャリア診断サービスを提供します。診断結果はAIによる分析に基づくものであり、特定のキャリアや転職を保証するものではありません。
        </Section>

        <Section title="第3条（アカウント）">
          当サービスの一部機能を利用するにあたり、Googleアカウントによるログインが必要です。ユーザーは、自己の責任においてアカウントを管理するものとします。
        </Section>

        <Section title="第4条（禁止事項）">
          ユーザーは、以下の行為を行ってはならないものとします。
          {'\n\n'}
          ・法令または公序良俗に反する行為{'\n'}
          ・当サービスの運営を妨害する行為{'\n'}
          ・他のユーザーまたは第三者の権利を侵害する行為{'\n'}
          ・不正アクセスまたはそれを試みる行為{'\n'}
          ・当サービスの情報を無断で商用利用する行為{'\n'}
          ・その他、当サービスが不適切と判断する行為
        </Section>

        <Section title="第5条（免責事項）">
          当サービスは、診断結果の正確性、完全性、有用性等について一切の保証をいたしません。診断結果に基づくキャリア上の判断は、ユーザー自身の責任において行うものとします。当サービスの利用により生じた損害について、当サービスは一切の責任を負いません。
        </Section>

        <Section title="第6条（サービスの変更・停止）">
          当サービスは、事前の通知なく、サービス内容の変更、一時停止または終了を行うことがあります。これによりユーザーに生じた損害について、当サービスは一切の責任を負いません。
        </Section>

        <Section title="第7条（知的財産権）">
          当サービスに関する知的財産権は、当サービスまたはそのライセンサーに帰属します。ユーザーは、当サービスのコンテンツを無断で複製、転載、改変してはならないものとします。
        </Section>

        <Section title="第8条（規約の変更）">
          当サービスは、必要に応じて本規約を変更することがあります。変更後の規約は、サービス上に掲載した時点で効力を生じるものとします。
        </Section>

        <Section title="第9条（準拠法・管轄裁判所）">
          本規約の解釈および適用は、日本法に準拠するものとします。当サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
