import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// 日本語フォントの設定（設計書に基づく）
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// メタデータ設定（設計書のSEO要件に基づく）
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'),
  title: {
    default: '蓮城院 | 曹洞宗の寺院',
    template: '%s | 蓮城院'
  },
  description: '蓮城院の公式サイト。副住職・荒木弘文のブログも掲載。曹洞宗の教えと共に、地域に根ざした寺院活動をご紹介いたします。',
  keywords: ['蓮城院', '曹洞宗', '寺院', '副住職', '荒木弘文', 'ブログ', '仏教', '法要'],
  authors: [{ name: '蓮城院' }],
  creator: '蓮城院',
  publisher: '蓮城院',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '蓮城院',
    description: '曹洞宗の寺院。副住職・荒木弘文のブログも掲載。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '蓮城院',
  },
  twitter: {
    card: 'summary_large_image',
    title: '蓮城院',
    description: '曹洞宗の寺院。副住職・荒木弘文のブログも掲載。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification (実装時に追加)
    // google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <body className="font-sans antialiased bg-bg-primary text-text-primary min-h-screen flex flex-col">
        {/* ヘッダー */}
        <Header />

        {/* メインコンテンツ */}
        <main className="flex-grow">
          {children}
        </main>

        {/* フッター */}
        <Footer />
      </body>
    </html>
  );
}
