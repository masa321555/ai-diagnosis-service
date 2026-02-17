'use client';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

type DiagnosisData = {
  result: {
    careerType: string;
    catchphrase?: string;
    summary: string;
    strengths: string[];
    gapAnalysis?: string;
    recommendations: string[];
    roadmap: {
      shortTerm: string;
      midTerm: string;
      longTerm: string;
    };
  };
  memo?: string;
  createdAt: string;
};

export default function DiagnosisResultView({ data }: { data: DiagnosisData }) {
  const { result } = data;

  return (
    <>
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        sx={{
          mb: 1,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        診断結果
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        {new Date(data.createdAt).toLocaleDateString('ja-JP')}
      </Typography>

      {/* キャリアタイプ */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            あなたに最適なキャリアタイプ
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {result.careerType}
          </Typography>
        </CardContent>
      </Card>

      {/* キャッチコピー */}
      {result.catchphrase && (
        <Card sx={{ mb: 3, bgcolor: '#faf8ff' }}>
          <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <FormatQuoteIcon sx={{ color: '#764ba2', mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                あなたのキャッチコピー
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#1a1a2e', fontStyle: 'italic' }}>
                {result.catchphrase}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 概要 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            診断概要
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {result.summary}
          </Typography>
        </CardContent>
      </Card>

      {/* 強み */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            あなたの強み
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {result.strengths.map((s) => (
              <Chip
                key={s}
                label={s}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ギャップ分析 */}
      {result.gapAnalysis && (
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'rgba(118, 75, 162, 0.2)' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Will × Can ギャップ分析
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {result.gapAnalysis}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* おすすめ職種 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            おすすめの職種
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {result.recommendations.map((r) => (
              <Chip
                key={r}
                label={r}
                variant="outlined"
                sx={{ borderColor: '#764ba2', color: '#764ba2' }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ロードマップ */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            キャリアロードマップ
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} color="primary" sx={{ mb: 0.5 }}>
              短期（0〜6ヶ月）
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {result.roadmap.shortTerm}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} color="primary" sx={{ mb: 0.5 }}>
              中期（6ヶ月〜2年）
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {result.roadmap.midTerm}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} color="primary" sx={{ mb: 0.5 }}>
              長期（2年〜5年）
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {result.roadmap.longTerm}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* メモ */}
      {data.memo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              メモ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {data.memo}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}
