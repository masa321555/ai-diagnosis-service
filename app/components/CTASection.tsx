'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CTAButton from './CTAButton';

export default function CTASection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 40%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 2,
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          さあ、あなたのキャリアを
          <br />
          見つけよう
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            mb: 5,
            opacity: 0.9,
          }}
        >
          たった3分で、新しい可能性が見えてきます
        </Typography>

        <CTAButton variant="primary" />
      </Container>
    </Box>
  );
}
