'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TodayIcon from '@mui/icons-material/Today';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Grid from '@mui/material/Grid2';
import ErrorIcon from '@mui/icons-material/Error';

interface Stats {
  todayDiagnoses: number;
  totalDiagnoses: number;
  activeUsers: number;
  recentDiagnoses: {
    _id: string;
    userName: string;
    careerType: string;
    createdAt: string;
  }[];
  dbStatus: 'connected' | 'error';
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography color="error">データの取得に失敗しました</Typography>;
  }

  const statCards = [
    {
      label: '本日の診断数',
      value: stats.todayDiagnoses,
      icon: <TodayIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      color: '#667eea',
    },
    {
      label: '総診断数',
      value: stats.totalDiagnoses,
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
      color: '#764ba2',
    },
    {
      label: 'アクティブユーザー数',
      value: stats.activeUsers,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
      color: '#f093fb',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        ダッシュボード
      </Typography>

      {/* 統計カード */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 4 }} key={card.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {card.icon}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: card.color }}>
                    {card.value.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* システムステータス */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            システムステータス
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={stats.dbStatus === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
              label={`MongoDB: ${stats.dbStatus === 'connected' ? '接続中' : 'エラー'}`}
              color={stats.dbStatus === 'connected' ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* 最近の診断 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            最近の診断結果
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ユーザー</TableCell>
                  <TableCell>キャリアタイプ</TableCell>
                  <TableCell>診断日時</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentDiagnoses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">診断データがありません</TableCell>
                  </TableRow>
                ) : (
                  stats.recentDiagnoses.map((d) => (
                    <TableRow key={d._id}>
                      <TableCell>{d.userName}</TableCell>
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

      {/* クイックアクション */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            クイックアクション
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button component={Link} href="/admin/users" variant="outlined">
              ユーザー管理
            </Button>
            <Button component={Link} href="/admin/analytics" variant="outlined">
              分析レポート
            </Button>
            <Button component={Link} href="/admin/errors" variant="outlined">
              エラーログ
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
