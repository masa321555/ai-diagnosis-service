'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { QUESTIONS } from '@/app/diagnosis/_data/questions';

type RecommendationObj = {
  jobTitle: string;
  salaryRange: string;
  fit: string;
};

type DiagnosisData = {
  result: {
    careerType: string;
    catchphrase?: string;
    summary: string;
    strengths: string[];
    gapAnalysis?: string;
    recommendations: string[] | RecommendationObj[];
    riskAnalysis?: string;
    roadmap: {
      shortTerm: string;
      midTerm: string;
      longTerm: string;
    };
  };
  answers?: Record<string, string | string[] | Record<string, string>>;
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {result.strengths.map((s) => (
              <Box
                key={s}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 500, lineHeight: 1.6 }}>
                  {s}
                </Typography>
              </Box>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {result.recommendations.map((r, i) => {
              const isObj = typeof r === 'object' && r !== null && 'jobTitle' in r;
              return (
                <Box
                  key={isObj ? (r as RecommendationObj).jobTitle : (r as string)}
                  sx={{
                    border: '1px solid #764ba2',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  {isObj ? (
                    <>
                      <Typography variant="body2" sx={{ color: '#764ba2', fontWeight: 700, mb: 0.5 }}>
                        {(r as RecommendationObj).jobTitle}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        {(r as RecommendationObj).salaryRange}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {(r as RecommendationObj).fit}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#764ba2', fontWeight: 500, lineHeight: 1.6 }}>
                      {r as string}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* リスク分析 */}
      {result.riskAnalysis && (
        <Card sx={{ mb: 3, border: '1px solid', borderColor: 'rgba(255, 152, 0, 0.3)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WarningAmberIcon sx={{ color: '#f57c00', fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                リスク分析と対策
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {result.riskAnalysis}
            </Typography>
          </CardContent>
        </Card>
      )}

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

      {/* 回答内容 */}
      {data.answers && Object.keys(data.answers).length > 0 && (
        <Card sx={{ mb: 3, bgcolor: '#fafafa' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <QuestionAnswerIcon sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                あなたの回答内容
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {QUESTIONS.map((q) => {
                const answer = data.answers?.[q.id];
                if (!answer) return null;

                let displayAnswer: string;
                if (q.type === 'skill-level' && typeof answer === 'object' && !Array.isArray(answer)) {
                  displayAnswer = Object.entries(answer as Record<string, string>)
                    .map(([skill, level]) => `${skill}：${level}`)
                    .join('、');
                } else if (Array.isArray(answer)) {
                  displayAnswer = answer.join('、');
                } else {
                  displayAnswer = answer as string;
                }

                return (
                  <Box key={q.id}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {q.text}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                      {displayAnswer}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
}
