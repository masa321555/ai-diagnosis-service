'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: '本当に無料で利用できますか？',
    answer:
      'はい、完全無料でご利用いただけます。診断からキャリアロードマップの表示まで、一切費用はかかりません。',
  },
  {
    question: '診断にはどのくらい時間がかかりますか？',
    answer:
      '10問の質問に答えるだけなので、約3分で完了します。通勤時間や休憩時間など、スキマ時間に気軽にお試しいただけます。',
  },
  {
    question: '個人情報の登録は必要ですか？',
    answer:
      'Gmailアドレスの登録が必要となります。診断結果の保存やキャリアロードマップの閲覧にGoogleアカウントを使用します。それ以外の個人情報の入力は不要です。',
  },
  {
    question: '診断結果はどの程度信頼できますか？',
    answer:
      '最新のAI技術と膨大なキャリアデータをもとに分析しています。転職エージェントではないため、中立で客観的な診断結果をお届けします。ただし、あくまで参考情報としてご活用ください。',
  },
  {
    question: 'スマートフォンからでも利用できますか？',
    answer:
      'はい、スマートフォン・タブレット・PCなど、すべてのデバイスに対応しています。ブラウザからアクセスするだけで、アプリのインストールは不要です。',
  },
];

export default function FAQSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            color: 'text.primary',
          }}
        >
          よくあるご質問
        </Typography>

        <Typography
          sx={{
            fontSize: '1.1rem',
            textAlign: 'center',
            mb: { xs: 5, md: 8 },
            color: 'text.secondary',
          }}
        >
          ご利用前の疑問にお答えします
        </Typography>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px !important',
                mb: 2,
                '&::before': { display: 'none' },
                '&:hover': {
                  borderColor: '#667eea',
                },
                transition: 'border-color 0.3s ease',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  px: 3,
                  py: 1,
                  '& .MuiAccordionSummary-content': { my: 2 },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    color: '#1a1a2e',
                  }}
                >
                  Q. {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: 'text.secondary',
                    lineHeight: 1.8,
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
