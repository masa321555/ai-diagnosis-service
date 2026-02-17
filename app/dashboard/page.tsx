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
import HistoryIcon from '@mui/icons-material/History';
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

        {/* キャリア診断ボタン */}
        <Button
          component={Link}
          href="/diagnosis"
          variant="contained"
          fullWidth
          sx={{
            mb: 2,
            py: 2,
            fontSize: '1.125rem',
            fontWeight: 600,
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)',
              transform: 'scale(1.02)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          キャリア診断を始める
        </Button>

        {/* 診断履歴リンク */}
        <Button
          component={Link}
          href="/diagnosis/history"
          variant="text"
          fullWidth
          startIcon={<HistoryIcon />}
          sx={{
            mb: 3,
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          診断履歴を見る
        </Button>

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
