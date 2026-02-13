'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ダッシュボード
        </Typography>

        {/* ユーザー情報カード */}
        <Card sx={{ mb: 3 }}>
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3,
            }}
          >
            <Avatar
              src={session?.user?.image ?? undefined}
              alt={session?.user?.name ?? 'ユーザー'}
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {session?.user?.name ?? 'ユーザー'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session?.user?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Button
              component={Link}
              href="/profile"
              fullWidth
              startIcon={<PersonIcon />}
              sx={{
                justifyContent: 'flex-start',
                px: 3,
                py: 2,
                fontSize: '1rem',
                color: 'text.primary',
              }}
            >
              プロフィール設定
            </Button>
          </CardContent>
        </Card>

        {/* ログアウト */}
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={() => signOut({ callbackUrl: '/' })}
          sx={{ py: 1.5 }}
        >
          ログアウト
        </Button>
      </Container>
    </Box>
  );
}
