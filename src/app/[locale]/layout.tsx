/**
 * 蓮城院公式サイト - 多言語対応レイアウト
 *
 * next-intlを使用した国際化対応のレイアウトコンポーネント
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Preloader from "@/components/common/Preloader";
import { locales, type Locale, hrefLangConfig } from '@/i18n';

// 日本語フォントの最適化設定（パフォーマンス強化版）
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"], // 日本語サブセットは必要に応じて遅延読み込み
  weight: ["400", "600"], // 使用するウェイトのみを指定してファイルサイズを削減
  display: "swap", // フォント読み込み中はシステムフォントを表示
  preload: true, // プリロードを有効化
  fallback: ['serif', 'メイリオ', 'ヒラギノ明朝', 'Hiragino Mincho ProN'], // フォールバックフォントを指定
  adjustFontFallback: true, // フォールバックフォントの調整を有効化
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["400", "600"], // 使用するウェイトのみを指定
  display: "swap",
  preload: true,
  fallback: ['sans-serif', 'メイリオ', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN'],
  adjustFontFallback: true,
});

// 動的メタデータ生成
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  // 有効なロケールかチェック
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const messages = await getMessages();
  const seoMessages = messages.seo as Record<string, string>;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seoMessages?.title || '蓮城院 | 曹洞宗の寺院',
      template: locale === 'ja' ? '%s | 蓮城院' : '%s | Renjoin Temple'
    },
    description: seoMessages?.description || '蓮城院の公式サイト。曹洞宗の教えと共に、地域に根ざした寺院活動をご紹介いたします。',
    keywords: seoMessages?.keywords?.split(', ') || ['蓮城院', '曹洞宗', '寺院', '仏教'],
    authors: [{ name: '蓮城院' }],
    creator: '蓮城院',
    publisher: '蓮城院',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: seoMessages?.title || '蓮城院',
      description: seoMessages?.description || '曹洞宗の寺院。',
      type: 'website',
      locale: hrefLangConfig[locale as Locale],
      siteName: locale === 'ja' ? '蓮城院' : 'Renjoin Temple',
      alternateLocale: Object.values(hrefLangConfig).filter(l => l !== hrefLangConfig[locale as Locale])
    },
    twitter: {
      card: 'summary_large_image',
      title: seoMessages?.title || '蓮城院',
      description: seoMessages?.description || '曹洞宗の寺院。',
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
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'ja-JP': `${baseUrl}/ja`,
        'en-US': `${baseUrl}/en`,
        'x-default': `${baseUrl}/ja`
      }
    },
    verification: {
      // Google Search Console verification (実装時に追加)
      // google: 'google-site-verification-code',
    },
  };
}

// 静的パラメータ生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 有効なロケールかチェック
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error('Failed to load messages:', error);
    notFound();
  }

  return (
    <html lang={locale} className={`${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <head>
        {/* hreflang設定 */}
        {locales.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={hrefLangConfig[loc]}
            href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/${loc}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/ja`}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                    custom_map: {custom_parameter_1: 'locale'},
                    locale: '${locale}'
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased bg-bg-primary text-text-primary min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {/* プリローダー */}
          <Preloader />

          {/* ヘッダー */}
          <Header />

          {/* メインコンテンツ */}
          <main className="flex-grow">
            {children}
          </main>

          {/* フッター */}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}