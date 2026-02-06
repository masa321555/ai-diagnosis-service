'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const steps = [
  {
    number: 1,
    image: '/step-1.jpg',
    title: '5つの質問に回答',
    description: 'スマホで3分。直感的に\n答えるだけ。',
  },
  {
    number: 2,
    image: '/step-2.jpg',
    title: 'AIが即座に分析',
    description: '独自のデータと照合。\nあなたの強みを発見。',
  },
  {
    number: 3,
    image: '/step-3.jpg',
    title: 'キャリアマップ表示',
    description: 'あなただけのロードマップ\nが完成。',
  },
];

export default function StepSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8f9fa',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
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
          診断の流れ
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: '1.4rem',
            fontWeight: 700,
            textAlign: 'center',
            mb: { xs: 5, md: 8 },
            color: '#1a73e8',
          }}
        >
          3ステップで、あなたの可能性を診断
        </Typography>

        {/* Steps Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'center',
            gap: { xs: 4, md: 0 },
          }}
        >
          {steps.map((step, index) => (
            <Box key={step.number} sx={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* Step Card */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: { xs: '280px', md: '300px' },
                  px: 2,
                }}
              >
                {/* Step Number Circle */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: '#4a5568',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {step.number}
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  component="h3"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    mb: 1.5,
                    color: '#1a73e8',
                  }}
                >
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    mb: 3,
                  }}
                >
                  {step.description}
                </Typography>

                {/* Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={step.image}
                    alt={step.title}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </Box>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 8,
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      color: '#9ca3af',
                    }}
                  >
                    →
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
