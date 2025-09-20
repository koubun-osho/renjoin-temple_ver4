/**
 * 蓮城院公式サイト - 多言語対応ホームページ
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { fetchHomePageData } from '../../../lib/sanity'
import { generateSEOMetadata, StructuredData, generateOrganizationData } from '../../components/common/SEO'

// コンポーネントのインポート
import { HeroSection } from '../../components/sections/HeroSection'
import { BlogCard, NewsCard, CardGrid, CardSkeleton } from '../../components/ui/Card'

// パフォーマンス最適化：ファーストビューでないコンポーネントを遅延読み込み
import { AccessSection } from '../../components/sections/AccessSection'
import { AboutSection } from '../../components/sections/AboutSection'

// 型定義のインポート
import type { HomePageData } from '../../../types/sanity'
import type { Locale } from '@/i18n'

// ISR設定：トップページは15分ごとに再生成（頻繁な更新があるため）
export const revalidate = 900 // 15分（900秒）

// 静的生成の設定
export const dynamic = 'force-static'

// ========================
// SEOメタデータ
// ========================

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    url: `/${locale}`,
    type: 'website',
    keywords: t('keywords').split(', '),
    ogImage: '/images/og-image.jpg',
    ogImageAlt: locale === 'ja' ? '蓮城院境内の風景' : 'Renjoin Temple grounds',
    canonical: `/${locale}`,
  });
}

// ========================
// メインコンポーネント
// ========================

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="bg-bg-primary">
      {/* JSON-LD構造化データ - 組織情報 */}
      <StructuredData
        type="Organization"
        data={generateOrganizationData()}
      />

      {/* ヒーローセクション（Phase 5-04改善版） */}
      <HeroSection
        language={locale}
        poeticContent={{
          japanese: [
            '七百年の時を超えて',
            '変わらぬ祈りがここにある',
            '蓮の花が静かに咲く庭で',
            '心の安らぎを見つけてください'
          ],
          english: [
            'Beyond seven centuries of time',
            'Eternal prayers reside here',
            'In gardens where lotus flowers bloom',
            'Find peace within your heart'
          ]
        }}
      />

      {/* お知らせセクション */}
      <section className="py-12 sm:py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-serif font-bold text-primary-700 mb-4 sm:mb-6">
              {t('news.title')}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-6 sm:mb-8" />
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-2 sm:px-0">
              {t('news.subtitle')}
            </p>
          </div>

          <Suspense fallback={<NewsLoadingSkeleton />}>
            <NewsSection />
          </Suspense>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 touch-manipulation"
            >
              {t('common.readMore')}
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
              {t('blog.title')}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-6 sm:mb-8" />
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-2 sm:px-0">
              {t('blog.subtitle')}
            </p>
          </div>

          <Suspense fallback={<BlogLoadingSkeleton />}>
            <BlogSection />
          </Suspense>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 touch-manipulation"
            >
              {t('common.readMore')}
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
      <AccessSection
        address={{
          postal: '〒321-4502',
          prefecture: locale === 'ja' ? '栃木県' : 'Tochigi Prefecture',
          city: locale === 'ja' ? '真岡市' : 'Moka City',
          street: locale === 'ja' ? '物井102' : '102 Monoi',
        }}
        phone="0285-75-0401"
        email="koubun0218@gmail.com"
        transportation={[
          {
            type: 'train',
            description: locale === 'ja'
              ? 'JR宇都宮線「石橋駅」より車で約15分'
              : 'About 15 minutes by car from Ishibashi Station on the JR Utsunomiya Line',
            time: locale === 'ja' ? '車で15分' : '15 min by car'
          },
          {
            type: 'car',
            description: locale === 'ja'
              ? '北関東自動車道「真岡IC」より約10分'
              : 'About 10 minutes from Moka IC on the Kita-Kanto Expressway',
            time: locale === 'ja' ? '車で10分' : '10 min by car'
          }
        ]}
        parkingInfo={locale === 'ja'
          ? '境内に無料駐車場をご用意しております。'
          : 'Free parking is available on the temple grounds.'
        }
      />
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
  const t = await getTranslations('news');

  try {
    const data: HomePageData = await fetchHomePageData.all()
    const recentNews = data.recentNews || []

    if (recentNews.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-text-muted">{t('noNews')}</p>
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
        <p className="text-red-600">{t('error')}</p>
      </div>
    )
  }
}

/**
 * ブログセクション
 */
async function BlogSection() {
  const t = await getTranslations('blog');

  try {
    const data: HomePageData = await fetchHomePageData.all()
    const recentBlogs = data.recentBlogs || []

    if (recentBlogs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-text-muted">{t('noBlog')}</p>
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
        <p className="text-red-600">{t('error')}</p>
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