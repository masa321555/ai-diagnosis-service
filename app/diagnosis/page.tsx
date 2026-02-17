'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { QUESTIONS, SKILL_LEVELS } from './_data/questions';
import type { SkillLevel } from './_data/questions';

type SkillLevelMap = Record<string, SkillLevel>;
type Answers = Record<string, string | string[] | SkillLevelMap>;

export default function DiagnosisPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQuestion = QUESTIONS[activeStep];

  const handleSingleChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultipleChange = (value: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[currentQuestion.id] as string[]) || [];
      if (checked) {
        return { ...prev, [currentQuestion.id]: [...current, value] };
      }
      return { ...prev, [currentQuestion.id]: current.filter((v) => v !== value) };
    });
  };

  const handleTextChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSkillLevelChange = (skill: string, level: SkillLevel) => {
    setAnswers((prev) => {
      const current = (prev[currentQuestion.id] as SkillLevelMap) || {};
      const updated = { ...current };
      if (updated[skill] === level) {
        delete updated[skill];
      } else {
        updated[skill] = level;
      }
      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  const isCurrentAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'text') {
      if (!currentQuestion.required) return true;
      return typeof answer === 'string' && answer.trim().length > 0;
    }
    if (!answer) return false;
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (currentQuestion.type === 'skill-level') {
      return typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length > 0;
    }
    return typeof answer === 'string' && answer.length > 0;
  };

  const handleNext = () => {
    if (activeStep < QUESTIONS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '診断に失敗しました');
      }
      const data = await res.json();
      router.push(`/diagnosis/result?id=${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '診断に失敗しました');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
        <Typography variant="h6" color="text.secondary">
          AIが分析中...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          あなたに最適なキャリアを診断しています
        </Typography>
      </Box>
    );
  }

  const skillLevelColors: Record<SkillLevel, string> = {
    '実務経験あり': '#667eea',
    '勉強中': '#f093fb',
    '興味あり': '#999',
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
          AIキャリア診断
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {QUESTIONS.map((q, index) => (
            <Step key={q.id}>
              <StepLabel>問{index + 1}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            {currentQuestion.text}
          </Typography>

          {currentQuestion.type === 'single' && currentQuestion.options && (
            <RadioGroup
              value={(answers[currentQuestion.id] as string) || ''}
              onChange={(e) => handleSingleChange(e.target.value)}
            >
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <Box>
              {currentQuestion.options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={((answers[currentQuestion.id] as string[]) || []).includes(option)}
                      onChange={(e) => handleMultipleChange(option, e.target.checked)}
                    />
                  }
                  label={option}
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </Box>
          )}

          {currentQuestion.type === 'text' && (
            <Box>
              <TextField
                multiline
                minRows={3}
                fullWidth
                placeholder={currentQuestion.placeholder}
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={(e) => handleTextChange(e.target.value)}
              />
              {!currentQuestion.required && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  ※ スキップしても診断できます
                </Typography>
              )}
            </Box>
          )}

          {currentQuestion.type === 'skill-level' && currentQuestion.options && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                該当するスキルのレベルを選んでください（1つ以上）
              </Typography>
              {currentQuestion.options.map((skill) => {
                const currentSkillLevel = ((answers[currentQuestion.id] as SkillLevelMap) || {})[skill];
                return (
                  <Box key={skill} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                      {skill}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {SKILL_LEVELS.map((level) => (
                        <Chip
                          key={level}
                          label={level}
                          size="small"
                          variant={currentSkillLevel === level ? 'filled' : 'outlined'}
                          onClick={() => handleSkillLevelChange(skill, level)}
                          sx={{
                            cursor: 'pointer',
                            ...(currentSkillLevel === level
                              ? {
                                  bgcolor: skillLevelColors[level],
                                  color: 'white',
                                  borderColor: skillLevelColors[level],
                                }
                              : {
                                  borderColor: '#ddd',
                                  color: 'text.secondary',
                                }),
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ flex: 1, py: 1.5 }}
          >
            戻る
          </Button>
          {activeStep < QUESTIONS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isCurrentAnswered()}
              sx={{
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              次へ
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isCurrentAnswered()}
              sx={{
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              診断する
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
