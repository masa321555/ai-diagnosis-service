import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';
import Link from 'next/link';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary';
  sx?: SxProps<Theme>;
}

export default function CTAButton({ variant = 'primary', sx }: CTAButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Button
      component={Link}
      href="/diagnosis"
      variant="contained"
      size="large"
      sx={{
        background: isPrimary
          ? '#ffffff'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: isPrimary ? '#667eea' : '#ffffff',
        fontWeight: 600,
        fontSize: '1.125rem',
        padding: '16px 48px',
        borderRadius: '50px',
        boxShadow: isPrimary
          ? '0 4px 20px rgba(255, 255, 255, 0.3)'
          : '0 4px 20px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: isPrimary
            ? '0 8px 30px rgba(255, 255, 255, 0.4)'
            : '0 8px 30px rgba(102, 126, 234, 0.5)',
          background: isPrimary
            ? '#ffffff'
            : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        ...sx,
      }}
    >
      無料で診断を始める
    </Button>
  );
}
