'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const features = [
  {
    image: '/feature-1.jpg',
    title: '約3分で、キャリアの「現在地」を可視化',
    description:
      '「何から始めればいいかわからない」をゼロに。独自のアルゴリズムが、あなたの経験とスキルを多角的に分析し、今のあなたが市場でどう評価されるかを数値化します。',
  },
  {
    image: '/feature-2.jpg',
    title: 'AIによる「忖度なし」の客観的な診断',
    description:
      '転職エージェントではないからこそ、中立で客観的なアドバイスが可能。最新のAI分析により、あなたも気づいていない「意外な適職」や「キャリアの選択肢」を導き出します。',
  },
  {
    image: '/feature-3.jpg',
    title: '5年後までの具体的なロードマップ',
    description:
      '単なる職業紹介ではありません。理想の年収・ライフスタイルを叶えるために、今どのスキルを磨くべきか、次の一手はどうすべきか。5年後から逆算した「最短ルート」を提示します。',
  },
];

export default function FeatureSection() {
  return (
    <Box
      component="section"
      sx={{
        pt: '60px',
        pb: { xs: 8, md: 12 },
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        {/* PC表示用 */}
        <Typography
          component="h2"
          sx={{
            display: { xs: 'none', md: 'block' },
            fontSize: '2rem',
            fontWeight: 700,
            textAlign: 'center',
            mb: 8,
            color: '#1a1a2e',
            lineHeight: 1.6,
          }}
        >
          たった約3分で、忖度なしの客観的診断。
          <br />
          あなたの可能性をデータで広げる 最新AIのキャリア分析
        </Typography>

        {/* SP表示用 */}
        <Typography
          component="h2"
          sx={{
            display: { xs: 'block', md: 'none' },
            fontSize: '1.25rem',
            fontWeight: 700,
            textAlign: 'center',
            mb: 5,
            color: '#1a1a2e',
            lineHeight: 1.6,
          }}
        >
          たった約3分で、
          <br />
          忖度なしの客観的診断。
          <br />
          あなたの可能性を
          <br />
          データで広げる
          <br />
          最新AIのキャリア分析
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 280,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    p: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={feature.image}
                    alt={feature.title}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 700,
                      mb: 2,
                      color: 'text.primary',
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      color: 'text.secondary',
                      lineHeight: 1.8,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
