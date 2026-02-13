import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import ThemeProvider from './providers/ThemeProvider';
import SessionProvider from './providers/SessionProvider';
import './globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: '5問でわかる、あなたのキャリア | AIキャリア診断',
  description:
    'たった5問・3分で、AIがあなたに最適なキャリアロードマップを提案。就活・転職・キャリアに悩む方へ。登録不要・完全無料。',
  keywords: 'キャリア診断, AI診断, 適職診断, 就活, 転職, キャリアマップ',
  openGraph: {
    title: '5問でわかる、あなたのキャリア',
    description: 'AIが3分であなただけのキャリアを診断',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5問でわかる、あなたのキャリア',
    description: 'AIが3分であなただけのキャリアを診断',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.variable}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
