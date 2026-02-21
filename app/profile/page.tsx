'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.birthday) setBirthday(data.birthday);
          if (data.gender) setGender(data.gender);
        }
      } catch {
        // プロフィール取得失敗は無視
      }
    };
    if (session?.user) fetchProfile();
  }, [session?.user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthday: birthday || null, gender: gender || null }),
      });

      if (!res.ok) throw new Error('更新に失敗しました');

      await update({ name });
      setToast({
        open: true,
        message: 'プロフィールを更新しました',
        severity: 'success',
      });
    } catch {
      setToast({
        open: true,
        message: '更新に失敗しました',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Button
          component={Link}
          href="/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          ダッシュボードに戻る
        </Button>

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
          プロフィール
        </Typography>

        {/* アバター */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar
            src={session?.user?.image ?? undefined}
            alt={session?.user?.name ?? 'ユーザー'}
            sx={{ width: 96, height: 96 }}
          />
        </Box>

        {/* プロフィール情報 */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              メールアドレス
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {session?.user?.email}
            </Typography>

            <TextField
              label="名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />

            <TextField
              label="生年月日"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 3 }}
            />

            <FormControl sx={{ mb: 3 }}>
              <FormLabel>性別</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio />} label="男性" />
                <FormControlLabel value="female" control={<Radio />} label="女性" />
                <FormControlLabel value="other" control={<Radio />} label="その他" />
                <FormControlLabel value="prefer_not_to_say" control={<Radio />} label="回答しない" />
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              disabled={saving || !name.trim()}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd6, #6a4292)',
                },
              }}
            >
              {saving ? '保存中...' : '保存'}
            </Button>
          </CardContent>
        </Card>

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
