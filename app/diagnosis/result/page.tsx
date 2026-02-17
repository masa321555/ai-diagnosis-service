'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ReplayIcon from '@mui/icons-material/Replay';
import Link from 'next/link';
import DiagnosisResultView from '../_components/DiagnosisResultView';

type DiagnosisResult = {
  _id: string;
  result: {
    careerType: string;
    catchphrase?: string;
    summary: string;
    strengths: string[];
    gapAnalysis?: string;
    recommendations: string[];
    roadmap: { shortTerm: string; midTerm: string; longTerm: string };
  };
  createdAt: string;
};

function DiagnosisResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('診断IDが指定されていません');
      setLoading(false);
      return;
    }
    fetch(`/api/diagnosis/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('診断結果の取得に失敗しました');
        return res.json();
      })
      .then((data) => setDiagnosis(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (error || !diagnosis) {
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
        <Typography color="error">{error || 'データが見つかりません'}</Typography>
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
        <DiagnosisResultView data={diagnosis} />

        {/* アクションボタン */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            href="/diagnosis/history"
            variant="outlined"
            startIcon={<HistoryIcon />}
            sx={{ flex: 1, py: 1.5 }}
          >
            診断履歴
          </Button>
          <Button
            component={Link}
            href="/diagnosis"
            variant="contained"
            startIcon={<ReplayIcon />}
            sx={{
              flex: 1,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            もう一度診断
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function DiagnosisResultPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <DiagnosisResultContent />
    </Suspense>
  );
}
