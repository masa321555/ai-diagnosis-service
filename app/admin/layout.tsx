'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'ダッシュボード', href: '/admin', icon: <DashboardIcon /> },
  { label: 'ユーザー管理', href: '/admin/users', icon: <PeopleIcon /> },
  { label: '分析レポート', href: '/admin/analytics', icon: <BarChartIcon /> },
  { label: 'エラーログ', href: '/admin/errors', icon: <ErrorIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#667eea' }}>
          管理画面
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                  '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.12)' },
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#667eea' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#667eea' : 'inherit',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ mt: 2, px: 2 }}>
        <ListItemButton
          component={Link}
          href="/dashboard"
          sx={{ borderRadius: 1, color: 'text.secondary' }}
        >
          <ListItemIcon><ArrowBackIcon /></ListItemIcon>
          <ListItemText primary="ダッシュボードへ戻る" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* モバイルAppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#fff',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#667eea' }}>
              管理画面
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* サイドバー */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0,0,0,0.08)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? 8 : 0,
          backgroundColor: '#f8f9ff',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
