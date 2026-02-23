'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  diagnosesCount: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');

  // ロール変更ダイアログ
  const [roleDialog, setRoleDialog] = useState<{ userId: string; name: string; newRole: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(pageSize),
        ...(search && { search }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async () => {
    if (!roleDialog) return;
    try {
      const res = await fetch(`/api/admin/users/${roleDialog.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleDialog.newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setRoleDialog(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ロール変更に失敗しました');
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: '名前', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'メール', flex: 1.5, minWidth: 200 },
    {
      field: 'role',
      headerName: 'ロール',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ fontWeight: params.value === 'admin' ? 700 : 400, color: params.value === 'admin' ? '#667eea' : 'inherit' }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'diagnosesCount', headerName: '診断数', width: 100, type: 'number' },
    {
      field: 'createdAt',
      headerName: '登録日',
      width: 140,
      valueFormatter: (value: string) => value ? new Date(value).toLocaleDateString('ja-JP') : '—',
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            component={Link}
            href={`/admin/users/${params.row.id}`}
          >
            詳細
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setRoleDialog({
                userId: params.row.id,
                name: params.row.name,
                newRole: params.row.role === 'admin' ? 'user' : 'admin',
              })
            }
          >
            {params.row.role === 'admin' ? 'user化' : 'admin化'}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        ユーザー管理
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* フィルター */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="名前・メールで検索"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>ロール</InputLabel>
          <Select
            value={roleFilter}
            label="ロール"
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="user">user</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          rowCount={total}
          loading={loading}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* ロール変更確認ダイアログ */}
      <Dialog open={!!roleDialog} onClose={() => setRoleDialog(null)}>
        <DialogTitle>ロール変更の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {roleDialog?.name} のロールを <strong>{roleDialog?.newRole}</strong> に変更しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog(null)}>キャンセル</Button>
          <Button onClick={handleRoleChange} variant="contained">変更する</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
