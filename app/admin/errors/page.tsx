'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: string;
  count: number;
}

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentryConfigured, setSentryConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/admin/errors')
      .then((res) => res.json())
      .then((data) => {
        setErrors(data.errors ?? []);
        setSentryConfigured(data.sentryConfigured ?? false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const levelConfig = {
    error: { color: 'error' as const, icon: <ErrorIcon fontSize="small" /> },
    warning: { color: 'warning' as const, icon: <WarningIcon fontSize="small" /> },
    info: { color: 'info' as const, icon: <InfoIcon fontSize="small" /> },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        エラーログ
      </Typography>

      {!sentryConfigured && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Sentryが未設定です。.env.localに <code>SENTRY_DSN</code> と <code>NEXT_PUBLIC_SENTRY_DSN</code> を設定すると、リアルタイムのエラー監視が有効になります。
          現在はアプリケーション内のエラーログを表示しています。
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>レベル</TableCell>
                  <TableCell>メッセージ</TableCell>
                  <TableCell>ソース</TableCell>
                  <TableCell>発生回数</TableCell>
                  <TableCell>最終発生</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">エラーログはありません</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  errors.map((err) => (
                    <TableRow key={err.id}>
                      <TableCell>
                        <Chip
                          icon={levelConfig[err.level].icon}
                          label={err.level}
                          color={levelConfig[err.level].color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {err.message}
                      </TableCell>
                      <TableCell>{err.source}</TableCell>
                      <TableCell>{err.count}</TableCell>
                      <TableCell>{new Date(err.timestamp).toLocaleString('ja-JP')}</TableCell>
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
