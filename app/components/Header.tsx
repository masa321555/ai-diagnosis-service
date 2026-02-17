'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            minHeight: { xs: 56, md: 64 },
          }}
        >
          {/* ロゴ */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo.png"
              alt="AIキャリア診断"
              width={400}
              height={100}
              style={{ height: '44px', width: 'auto' }}
              priority
            />
          </Link>

          {/* PC: ボタン表示 */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              href="/auth/signin"
              sx={{
                color: '#1a1a2e',
                fontWeight: 500,
                fontSize: '0.9rem',
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                },
              }}
            >
              新規登録/ログイン
            </Button>
            <Button
              component={Link}
              href="/diagnosis"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 3,
                py: 1,
                borderRadius: '50px',
                boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              無料診断を始める
            </Button>
          </Box>

          {/* SP: ハンバーガーメニュー */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: '#1a1a2e',
            }}
            aria-label="メニューを開く"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* SP: ドロワーメニュー */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="メニューを閉じる">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/auth/signin"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="新規登録/ログイン"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/diagnosis"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText
                primary="無料診断を始める"
                primaryTypographyProps={{
                  fontWeight: 600,
                  sx: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* fixed ヘッダー分の余白 */}
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />

    </>
  );
}
