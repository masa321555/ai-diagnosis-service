'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

type DiagnosisSummary = {
  _id: string;
  result: {
    careerType: string;
    summary: string;
  };
  createdAt: string;
};

export default function DiagnosisHistoryPage() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDiagnoses = () => {
    setLoading(true);
    fetch('/api/diagnosis')
      .then((res) => res.json())
      .then((data) => setDiagnoses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/diagnosis/${deleteTarget}`, { method: 'DELETE' });
      if (res.ok) {
        setDiagnoses((prev) => prev.filter((d) => d._id !== deleteTarget));
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

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
          診断履歴
        </Typography>

        {diagnoses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              まだ診断履歴がありません
            </Typography>
            <Button
              component={Link}
              href="/diagnosis"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              診断を始める
            </Button>
          </Box>
        ) : (
          <>
            {diagnoses.map((d) => (
              <Card key={d._id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                  <CardActionArea
                    component={Link}
                    href={`/diagnosis/${d._id}`}
                    sx={{ flex: 1 }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {d.result.careerType}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {d.result.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {new Date(d.createdAt).toLocaleDateString('ja-JP')}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                    <IconButton
                      onClick={() => setDeleteTarget(d._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))}

            <Button
              component={Link}
              href="/diagnosis"
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              新しい診断を始める
            </Button>
          </>
        )}

        {/* 削除確認ダイアログ */}
        <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
          <DialogTitle>診断結果を削除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              この診断結果を削除してもよろしいですか？この操作は取り消せません。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
              キャンセル
            </Button>
            <Button onClick={handleDelete} color="error" disabled={deleting}>
              {deleting ? '削除中...' : '削除'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
