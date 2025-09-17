import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { fetchHomePageData } from '../../lib/sanity'
import { sanitizeHtml } from '../../lib/sanitize'

// コンポーネントのインポート
import { HeroSection } from '../components/sections/HeroSection'
import { AboutSection } from '../components/sections/AboutSection'
import { AccessSection } from '../components/sections/AccessSection'
import { BlogCard, NewsCard, CardGrid, CardSkeleton } from '../components/ui/Card'

// 型定義のインポート
import type { HomePageData } from '../../types/sanity'

// ========================
// SEOメタデータ
// ========================

export const metadata: Metadata = {
  title: '蓮城院 - 曹洞宗の寺院 | 千年の祈り、永遠の安らぎ',
  description: '蓮城院は曹洞宗の寺院として、地域の皆様と共に歩み続けています。只管打坐の教えを基に、心の安らぎを求める方々をお迎えしています。副住職・荒木弘文のブログも掲載しております。',
  keywords: '蓮城院,曹洞宗,寺院,仏教,禅,只管打坐,副住職,荒木弘文,ブログ,お知らせ,法要,地域',
  openGraph: {
    title: '蓮城院 - 曹洞宗の寺院',
    description: '千年の祈り、永遠の安らぎ。曹洞宗の教えのもと、地域の皆様と共に歩み続ける寺院です。',
    url: 'https://renjoin.jp',
    siteName: '蓮城院公式サイト',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '蓮城院境内の風景'
      }
    ],
    locale: 'ja_JP',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '蓮城院 - 曹洞宗の寺院',
    description: '千年の祈り、永遠の安らぎ。曹洞宗の教えのもと、地域の皆様と共に歩み続ける寺院です。',
    images: ['/images/og-image.jpg']
  },
  alternates: {
    canonical: 'https://renjoin.jp'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

// ========================
// メインコンポーネント
// ========================

export default async function HomePage() {
  return (
    <div className="bg-bg-primary">
      {/* JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "@id": "https://renjoin.jp/#place",
            "name": "蓮城院",
            "description": "曹洞宗の寺院として、地域の皆様と共に歩み続けています。",
            "url": "https://renjoin.jp",
            "telephone": "+81-12-345-6789",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "JP",
              "addressRegion": "○○県",
              "addressLocality": "○○市",
              "streetAddress": "○○町1-2-3",
              "postalCode": "123-4567"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 35.6812362,
              "longitude": 139.7670516
            },
            "openingHours": "Mo-Su 06:00-18:00",
            "religion": "Buddhism",
            "denomination": "曹洞宗",
            "sameAs": [
              "https://renjoin.jp/about",
              "https://renjoin.jp/blog"
            ]
          }))
        }}
      />

      {/* ヒーローセクション */}
      <HeroSection />

      {/* お知らせセクション */}
      <section className="py-12 sm:py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-primary-700 mb-4 sm:mb-6">
              お知らせ
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-6 sm:mb-8" />
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-2 sm:px-0">
              最新のお知らせや行事案内をご覧いただけます。
            </p>
          </div>

          <Suspense fallback={<NewsLoadingSkeleton />}>
            <NewsSection />
          </Suspense>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/news"
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 touch-manipulation"
            >
              すべてのお知らせを見る
              <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ブログセクション */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-primary-700 mb-4 sm:mb-6">
              副住職ブログ
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-6 sm:mb-8" />
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-2 sm:px-0">
              副住職・荒木弘文による日々の気づきや仏教の教えについての記事をお読みいただけます。
            </p>
          </div>

          <Suspense fallback={<BlogLoadingSkeleton />}>
            <BlogSection />
          </Suspense>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 touch-manipulation"
            >
              すべての記事を見る
              <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 由緒セクション */}
      <AboutSection />

      {/* アクセスセクション */}
      <AccessSection />
    </div>
  )
}

// ========================
// データ取得コンポーネント
// ========================

/**
 * お知らせセクション
 */
async function NewsSection() {
  try {
    const data: HomePageData = await fetchHomePageData.all()
    const recentNews = data.recentNews || []

    if (recentNews.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-text-muted">現在、表示できるお知らせがありません。</p>
        </div>
      )
    }

    return (
      <CardGrid columns={3}>
        {recentNews.map((news) => (
          <NewsCard key={news._id} news={news} />
        ))}
      </CardGrid>
    )
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">お知らせの読み込みに失敗しました。</p>
      </div>
    )
  }
}

/**
 * ブログセクション
 */
async function BlogSection() {
  try {
    const data: HomePageData = await fetchHomePageData.all()
    const recentBlogs = data.recentBlogs || []

    if (recentBlogs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-text-muted">現在、表示できる記事がありません。</p>
        </div>
      )
    }

    return (
      <CardGrid columns={3}>
        {recentBlogs.map((blog) => (
          <BlogCard key={blog._id} post={blog} />
        ))}
      </CardGrid>
    )
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">ブログ記事の読み込みに失敗しました。</p>
      </div>
    )
  }
}

// ========================
// ローディングコンポーネント
// ========================

/**
 * お知らせローディングスケルトン
 */
function NewsLoadingSkeleton() {
  return (
    <CardGrid columns={3}>
      {[...Array(3)].map((_, index) => (
        <CardSkeleton key={index} showImage={false} />
      ))}
    </CardGrid>
  )
}

/**
 * ブログローディングスケルトン
 */
function BlogLoadingSkeleton() {
  return (
    <CardGrid columns={3}>
      {[...Array(3)].map((_, index) => (
        <CardSkeleton key={index} showImage={true} />
      ))}
    </CardGrid>
  )
}
