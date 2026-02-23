'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  diagnosisTrend: { date: string; count: number }[];
  topCareers: { name: string; count: number }[];
  completionRate: { name: string; value: number }[];
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#a18cd1'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetch(`/api/admin/analytics?period=${period}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/analytics/export');
      if (!res.ok) throw new Error('エクスポートに失敗しました');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnoses_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('CSVエクスポートに失敗しました');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Typography color="error">データの取得に失敗しました</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          分析レポート
        </Typography>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
          CSVエクスポート
        </Button>
      </Box>

      {/* 診断数推移 */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              診断数の推移
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={period}
              exclusive
              onChange={(_, v) => v && setPeriod(v)}
            >
              <ToggleButton value="daily">日別</ToggleButton>
              <ToggleButton value="weekly">週別</ToggleButton>
              <ToggleButton value="monthly">月別</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.diagnosisTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="診断数" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        {/* 人気キャリアパスTOP10 */}
        <Card sx={{ flex: '1 1 400px' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              人気キャリアパス TOP10
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.topCareers} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="count" name="診断数" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 診断完了率 */}
        <Card sx={{ flex: '1 1 300px' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              診断完了率
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data.completionRate}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {data.completionRate.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
