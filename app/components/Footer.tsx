'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: '#1a1a2e',
        color: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
            }}
          >
            © 2026 Career AI. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              プライバシーポリシー
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              利用規約
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
