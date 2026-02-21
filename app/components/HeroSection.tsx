'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CTAButton from './CTAButton';

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: { xs: 'auto', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        py: { xs: 10, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 3,
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          10問でわかる、
          <br />
          あなたのキャリア
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            lineHeight: 1.7,
            mb: 5,
            opacity: 0.95,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          AIがあなたに最適なキャリアロードマップを提案します
        </Typography>

        <CTAButton variant="primary" />

        <Typography
          component="p"
          sx={{
            mt: 3,
            fontSize: '0.875rem',
            opacity: 0.8,
          }}
        >
          登録不要・3分で完了
        </Typography>
      </Container>
    </Box>
  );
}
