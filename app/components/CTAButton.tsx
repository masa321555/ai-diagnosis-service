'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { SxProps, Theme } from '@mui/material/styles';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary';
  sx?: SxProps<Theme>;
}

export default function CTAButton({ variant = 'primary', sx }: CTAButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isPrimary = variant === 'primary';

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          Coming Soon! 診断機能は近日公開予定です。
        </Alert>
      </Snackbar>
    </>
  );
}
