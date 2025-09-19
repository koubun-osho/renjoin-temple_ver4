/**
 * 蓮城院公式サイト - お知らせ詳細ページ
 *
 * Sanityから個別お知らせを取得し、XSS対策を施して表示する
 * 和モダンなデザインでレスポンシブ対応済み
 *
 * @created 2025-09-18
 * @version 1.0.0 MVP版
 * @task P3-02 - お知らせ詳細ページ実装
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'
import { fetchNews } from '../../../../lib/sanity'
import ShareButton from '@/components/blog/ShareButton'
import { sanitizeText, sanitizeUrl } from '../../../../lib/sanitize'
import { generateSEOMetadata, StructuredData, generateBreadcrumbData } from '../../../components/common/SEO'
import type { NewsItem } from '../../../../types/sanity'

// ISR設定：お知らせは30分ごとに再生成（更新頻度が高いため）
export const revalidate = 1800 // 30分（1800秒）

// 動的ルートの設定
export const dynamic = 'force-static'
export const dynamicParams = true

// 静的パス生成（パフォーマンス最適化版）
export async function generateStaticParams() {
  try {
    const slugs = await fetchNews.slugs()

    // 本番環境では最初の30件のみビルド時に生成（お知らせは更新が多いため）
    const limitedSlugs = process.env.NODE_ENV === 'production'
      ? slugs.slice(0, 30)
      : slugs

    return limitedSlugs.map((item) => ({
      slug: item.slug.current
    }))
  } catch (error) {
    console.error('Failed to generate static paths:', error)
    return []
  }
}

// メタデータ生成
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const news = await fetchNews.detail(slug)

    if (!news) {
      return generateSEOMetadata({
        title: 'ページが見つかりません',
        description: '指定されたお知らせが見つかりませんでした。',
        noindex: true
      })
    }

    const title = sanitizeText(news.title)
    const description = `蓮城院からのお知らせ: ${title}`
    const categoryLabel = getCategoryLabel(news.category)

    return generateSEOMetadata({
      title,
      description,
      url: `/news/${slug}`,
      type: 'article',
      publishedTime: news.publishedAt,
      modifiedTime: news._updatedAt,
      keywords: ['蓮城院', 'お知らせ', categoryLabel, title.split(' ').slice(0, 3)].flat(),
      canonical: `/news/${slug}`
    })
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return generateSEOMetadata({
      title: 'エラーが発生しました',
      description: 'ページの読み込み中にエラーが発生しました。',
      noindex: true
    })
  }
}

// PortableText用カスタムコンポーネント
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-gray-700 leading-relaxed text-base md:text-lg">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 border-b-2 border-amber-200 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 mt-12">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4 mt-6">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-300 pl-6 py-4 my-8 bg-amber-50 italic text-gray-800">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    number: ({ children }) => (
      <li className="ml-4">{children}</li>
    )
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = value?.href ? sanitizeUrl(value.href) : '#'

      // 無効なURLの場合はテキストのみ表示
      if (!href || href === '#') {
        return <span className="text-gray-600">{children}</span>
      }

      return href.startsWith('http') ? (
        <a
          href={href}
          className="text-amber-600 hover:text-amber-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-amber-600 hover:text-amber-700 underline decoration-2 underline-offset-2 transition-colors duration-200">
          {children}
        </Link>
      )
    }
  }
}

// 日付フォーマット関数
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

// カテゴリーのラベル変換
function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    'event': '行事案内',
    'notice': 'お知らせ',
    'service': '法要'
  }
  return categoryMap[category] || category
}

// パンくずリスト生成関数
function generateBreadcrumbs(news: NewsItem) {
  return [
    { name: 'ホーム', url: '/' },
    { name: 'お知らせ', url: '/news' },
    { name: sanitizeText(news.title), url: `/news/${news.slug.current}` }
  ]
}

// 記事構造化データ生成関数
function generateArticleData(news: NewsItem) {
  return {
    headline: sanitizeText(news.title),
    author: {
      '@type': 'Organization',
      name: '蓮城院'
    },
    publisher: {
      '@type': 'Organization',
      name: '蓮城院',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/images/og-image.jpg`
      }
    },
    datePublished: news.publishedAt,
    dateModified: news._updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/news/${news.slug.current}`
    },
    articleSection: getCategoryLabel(news.category),
    inLanguage: 'ja-JP'
  }
}

// エラーフォールバック用コンポーネント
function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            お知らせの読み込みに失敗しました
          </h1>
          <p className="text-gray-600 mb-8">
            申し訳ございません。お知らせの読み込み中にエラーが発生しました。
          </p>
          <Link
            href="/news"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            お知らせ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

// メインページコンポーネント
export default async function NewsDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const news = await fetchNews.detail(slug)

    if (!news) {
      notFound()
    }

    // サニタイゼーション処理
    const sanitizedNews = {
      ...news,
      title: sanitizeText(news.title),
      content: news.content // PortableTextはそのまま使用（コンポーネント内でサニタイズ）
    }

    return (
      <>
        {/* 構造化データ - 記事 */}
        <StructuredData
          type="Article"
          data={generateArticleData(news)}
        />

        {/* 構造化データ - パンくずリスト */}
        <StructuredData
          type="BreadcrumbList"
          data={generateBreadcrumbData(generateBreadcrumbs(news))}
        />

        <article className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-4xl mx-auto">
              {/* パンくずナビ */}
              <nav className="mb-8 text-sm text-gray-600">
                <Link href="/" className="hover:text-amber-600 transition-colors">
                  ホーム
                </Link>
                <span className="mx-2">›</span>
                <Link href="/news" className="hover:text-amber-600 transition-colors">
                  お知らせ
                </Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900">
                  {sanitizedNews.title}
                </span>
              </nav>

              {/* お知らせヘッダー */}
              <header className="mb-12">
                <div className="bg-white bg-opacity-80 rounded-lg shadow-sm p-6 md:p-8">
                  {/* カテゴリーバッジ */}
                  <div className="mb-4">
                    <span className="inline-flex px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                      {getCategoryLabel(news.category)}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {sanitizedNews.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <time
                      dateTime={news.publishedAt}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(news.publishedAt)}
                    </time>
                  </div>
                </div>
              </header>

              {/* お知らせ本文 */}
              <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <PortableText
                    value={sanitizedNews.content as TypedObject[]}
                    components={portableTextComponents}
                  />
                </div>
              </div>

              {/* お知らせフッター */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    お知らせ一覧に戻る
                  </Link>

                  {/* シェアボタン */}
                  <div className="flex gap-3">
                    <ShareButton title={sanitizedNews.title} />
                  </div>
                </div>

                {/* 重要なお知らせの場合の注意書き */}
                {news.category === 'notice' && (
                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-amber-800 font-medium">
                          ご質問やお問い合わせがございましたら、お気軽に寺院までご連絡ください。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </footer>
            </div>
          </div>
        </article>
      </>
    )
  } catch (error) {
    console.error('News detail rendering error:', error)
    return <ErrorFallback />
  }
}