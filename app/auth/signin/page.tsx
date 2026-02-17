'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignInPage() {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    // 既存セッションがある場合は一度サインアウトしてからGoogleログイン
    if (session) {
      await signOut({ redirect: false });
    }
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          p: { xs: 3, sm: 4 },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 1,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AIキャリア診断
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            ログインして診断結果を保存・管理しましょう
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            sx={{
              width: '100%',
              py: 1.5,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd6, #6a4292)',
              },
            }}
          >
            Googleでログイン
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, fontSize: '0.75rem' }}
          >
            ログインすることで、
            <Box component="a" href="/terms" sx={{ color: 'primary.main' }}>
              利用規約
            </Box>
            と
            <Box component="a" href="/privacy" sx={{ color: 'primary.main' }}>
              プライバシーポリシー
            </Box>
            に同意したものとみなされます。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
