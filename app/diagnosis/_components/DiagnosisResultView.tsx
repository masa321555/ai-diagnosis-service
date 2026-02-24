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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
    salaryProjection?: {
      current: number;
      shortTerm: number;
      midTerm: number;
      longTerm: number;
    };
  };
  answers?: Record<string, string | string[] | Record<string, string>>;
  memo?: string;
  createdAt: string;
};

function parseRoadmapText(text: string): { heading?: string; steps: string[] } {
  // 【...】部分を見出しとして抽出
  const headingMatch = text.match(/【(.+?)】/);
  const heading = headingMatch ? headingMatch[1] : undefined;

  // 見出し部分を除去してステップ解析
  const body = text.replace(/【.+?】\s*/, '');

  // 丸数字（①②③...）で分割
  const circledPattern = /[①②③④⑤⑥⑦⑧⑨⑩]/;
  if (circledPattern.test(body)) {
    const steps = body
      .split(/[①②③④⑤⑥⑦⑧⑨⑩]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (steps.length > 0) return { heading, steps };
  }

  // 番号付きステップを分割（1. 2. 3. ...）
  const stepPattern = /(?:^|\s)(\d+)\.\s+/;
  if (stepPattern.test(body)) {
    const steps = body
      .split(/(?:^|\s)\d+\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (steps.length > 0) return { heading, steps };
  }

  // フォールバック: テキスト全体を1ステップとして返す
  return { heading, steps: [body.trim()] };
}

const PHASE_CONFIG = [
  { key: 'shortTerm' as const, label: '短期（0〜6ヶ月）', dot: '#43a047', bg: 'rgba(67,160,71,0.06)' },
  { key: 'midTerm' as const, label: '中期（6ヶ月〜2年）', dot: '#1e88e5', bg: 'rgba(30,136,229,0.06)' },
  { key: 'longTerm' as const, label: '長期（2年〜5年）', dot: '#8e24aa', bg: 'rgba(142,36,170,0.06)' },
] as const;

const STEP_CIRCLES = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

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

      {/* ロードマップ（縦タイムライン） */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
            キャリアロードマップ
          </Typography>

          <Box sx={{ position: 'relative', pl: 4 }}>
            {PHASE_CONFIG.map((phase, phaseIdx) => {
              const parsed = parseRoadmapText(result.roadmap[phase.key]);
              const isLast = phaseIdx === PHASE_CONFIG.length - 1;

              return (
                <Box key={phase.key} sx={{ position: 'relative', pb: isLast ? 0 : 4 }}>
                  {/* 縦線 */}
                  {!isLast && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -20,
                        top: 14,
                        bottom: 0,
                        width: 2,
                        bgcolor: phase.dot,
                        opacity: 0.3,
                      }}
                    />
                  )}

                  {/* ドット */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -26,
                      top: 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: phase.dot,
                      border: '3px solid white',
                      boxShadow: `0 0 0 2px ${phase.dot}`,
                    }}
                  />

                  {/* フェーズラベル */}
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ color: phase.dot, mb: 1.5 }}
                  >
                    {phase.label}
                  </Typography>

                  {/* 見出し */}
                  {parsed.heading && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ mb: 1, color: 'text.primary' }}
                    >
                      {parsed.heading}
                    </Typography>
                  )}

                  {/* ステップカード */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {parsed.steps.map((step, stepIdx) => (
                      <Box
                        key={stepIdx}
                        sx={{
                          bgcolor: phase.bg,
                          borderRadius: 2,
                          px: 2,
                          py: 1.5,
                          borderLeft: `3px solid ${phase.dot}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                          <Box
                            component="span"
                            sx={{ color: phase.dot, fontWeight: 700, mr: 0.5 }}
                          >
                            {STEP_CIRCLES[stepIdx] || `${stepIdx + 1}.`}
                          </Box>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}

            {/* ゴールマーカー */}
            <Box sx={{ position: 'relative', pt: 3 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: -28,
                  top: 14,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  boxShadow: '0 0 0 2px #ffd700',
                }}
              >
                ⭐
              </Box>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: '#f9a825' }}
              >
                ゴール
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 想定年収推移グラフ */}
      {result.salaryProjection && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              想定年収推移
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={[
                  { phase: '現在', salary: result.salaryProjection.current },
                  { phase: '短期', salary: result.salaryProjection.shortTerm },
                  { phase: '中期', salary: result.salaryProjection.midTerm },
                  { phase: '長期', salary: result.salaryProjection.longTerm },
                ]}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="phase"
                  tick={{ fontSize: 13, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#999' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}万`}
                  width={50}
                />
                <Tooltip
                  formatter={(value) => [`${value}万円`, '想定年収']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Area
                  type="monotone"
                  dataKey="salary"
                  stroke="#667eea"
                  strokeWidth={3}
                  fill="url(#salaryGradient)"
                  dot={{ r: 5, fill: '#764ba2', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#667eea', stroke: '#fff', strokeWidth: 2 }}
                  label={(props) => {
                    const { x, y, value } = props as { x?: number; y?: number; value?: number };
                    if (x == null || y == null || value == null) return null;
                    return (
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fill="#764ba2"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {value}万円
                      </text>
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

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
