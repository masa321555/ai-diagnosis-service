'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  birthday: string | null;
  gender: string | null;
  createdAt: string;
  diagnoses: {
    _id: string;
    careerType: string;
    createdAt: string;
  }[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography color="error">ユーザーが見つかりません</Typography>;
  }

  const genderLabels: Record<string, string> = {
    male: '男性',
    female: '女性',
    other: 'その他',
    prefer_not_to_say: '回答なし',
  };

  return (
    <Box>
      <Button component={Link} href="/admin/users" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        ユーザー一覧へ戻る
      </Button>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        ユーザー詳細
      </Typography>

      {/* プロフィール */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Avatar src={user.image ?? undefined} sx={{ width: 80, height: 80 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" fontWeight={600}>{user.name}</Typography>
              <Chip
                label={user.role}
                size="small"
                color={user.role === 'admin' ? 'primary' : 'default'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            {user.birthday && (
              <Typography variant="body2" color="text.secondary">
                生年月日: {new Date(user.birthday).toLocaleDateString('ja-JP')}
              </Typography>
            )}
            {user.gender && (
              <Typography variant="body2" color="text.secondary">
                性別: {genderLabels[user.gender] ?? user.gender}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              登録日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 診断履歴 */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            診断履歴 ({user.diagnoses.length}件)
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>キャリアタイプ</TableCell>
                  <TableCell>診断日時</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.diagnoses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">診断履歴がありません</TableCell>
                  </TableRow>
                ) : (
                  user.diagnoses.map((d) => (
                    <TableRow key={d._id}>
                      <TableCell>{d.careerType}</TableCell>
                      <TableCell>{new Date(d.createdAt).toLocaleString('ja-JP')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
