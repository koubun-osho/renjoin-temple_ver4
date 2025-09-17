/**
 * 蓮城院公式サイト - お知らせ一覧ページ
 *
 * 寺院からのお知らせ・行事案内・法要情報を表示。
 * Sanity CMSからデータを取得し、時系列で表示。
 * シンプルなページネーション機能を提供。
 *
 * @created 2025-09-18
 * @version 1.0.0 MVP版
 * @task P3-02 - お知らせ一覧ページ作成
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsCard, CardGrid } from '../../components/ui/Card'
import { fetchNews, createPagination } from '../../../lib/sanity'
import { NewsItemPreview } from '../../../types/sanity'

// ========================
// ページ設定
// ========================

/**
 * 1ページあたりのお知らせ数
 */
const NEWS_PER_PAGE = 10

/**
 * SEOメタデータ
 */
export const metadata: Metadata = {
  title: 'お知らせ一覧',
  description: '蓮城院からの最新のお知らせ、行事案内、法要情報をご確認いただけます。重要なお知らせや季節の行事について随時更新しています。',
  openGraph: {
    title: 'お知らせ一覧 | 蓮城院',
    description: '蓮城院からの最新のお知らせ、行事案内、法要情報をご確認いただけます。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'お知らせ一覧 | 蓮城院',
    description: '蓮城院からの最新のお知らせ、行事案内、法要情報をご確認いただけます。',
  },
  alternates: {
    canonical: '/news',
  }
}

// ========================
// ページコンポーネント
// ========================

interface NewsPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

/**
 * お知らせ一覧ページメインコンポーネント
 */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { page } = await searchParams
  // ページ番号の取得と検証
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  try {
    // お知らせデータの取得
    const paginationData = createPagination(currentPage, 0, NEWS_PER_PAGE)
    const [news, totalCount] = await Promise.all([
      fetchNews.list({
        start: paginationData.start,
        end: paginationData.end
      }),
      fetchNews.count()
    ])

    // ページネーション情報の再計算
    const pagination = createPagination(currentPage, totalCount, NEWS_PER_PAGE)

    // 無効なページ番号の場合は404
    if (currentPage > pagination.totalPages && totalCount > 0) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* ページヘッダー */}
        <NewsHeader />

        {/* メインコンテンツ */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {news.length > 0 ? (
            <>
              {/* お知らせ一覧 */}
              <NewsList news={news} />

              {/* ページネーション */}
              {pagination.totalPages > 1 && (
                <Pagination pagination={pagination} />
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error('お知らせ一覧の取得に失敗しました:', error)
    return <ErrorState />
  }
}

// ========================
// ページヘッダーコンポーネント
// ========================

function NewsHeader() {
  return (
    <section className="relative bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            お知らせ
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            蓮城院からの最新のお知らせ、行事案内、法要情報をご確認いただけます。
            <br />
            重要なお知らせや季節の行事について随時更新しています。
          </p>
        </div>
      </div>

      {/* 装飾的な下線 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400" />
    </section>
  )
}

// ========================
// お知らせ一覧コンポーネント
// ========================

interface NewsListProps {
  news: NewsItemPreview[]
}

function NewsList({ news }: NewsListProps) {
  return (
    <section className="mb-16" aria-label="お知らせ一覧">
      <CardGrid columns={3} gap="lg">
        {news.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}
      </CardGrid>
    </section>
  )
}

// ========================
// ページネーションコンポーネント
// ========================

interface PaginationProps {
  pagination: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

function Pagination({ pagination }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination

  // ページ番号のリンクを生成
  const getPageUrl = (page: number): string => {
    return page === 1 ? '/news' : `/news?page=${page}`
  }

  // 表示するページ番号を計算
  const getVisiblePages = (): number[] => {
    const delta = 2 // 現在ページの前後に表示するページ数
    const pages: number[] = []

    // 常に最初のページを表示
    if (totalPages > 0) pages.push(1)

    // 中間ページの計算
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // 省略記号が必要かチェック
    if (start > 2) pages.push(-1) // -1は省略記号のマーカー

    // 中間ページを追加
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // 省略記号が必要かチェック
    if (end < totalPages - 1) pages.push(-2) // -2は省略記号のマーカー

    // 最後のページを表示
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav
      className="flex justify-center items-center space-x-2"
      aria-label="お知らせのページネーション"
    >
      {/* 前のページボタン */}
      {hasPreviousPage ? (
        <a
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label="前のページ"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前のページ
        </a>
      ) : (
        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前のページ
        </span>
      )}

      {/* ページ番号 */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page < 0) {
            // 省略記号
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                …
              </span>
            )
          }

          const isCurrentPage = page === currentPage

          return (
            <a
              key={page}
              href={getPageUrl(page)}
              className={`
                inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                ${
                  isCurrentPage
                    ? 'bg-amber-600 text-white border border-amber-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }
              `}
              aria-current={isCurrentPage ? 'page' : undefined}
              aria-label={`${page}ページ目へ移動`}
            >
              {page}
            </a>
          )
        })}
      </div>

      {/* 次のページボタン */}
      {hasNextPage ? (
        <a
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label="次のページ"
        >
          次のページ
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ) : (
        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          次のページ
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  )
}

// ========================
// 空状態コンポーネント
// ========================

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* アイコン */}
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        </div>

        {/* メッセージ */}
        <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
          お知らせがありません
        </h3>
        <p className="text-gray-600 leading-relaxed">
          現在、公開されているお知らせがありません。
          <br />
          新しいお知らせをお待ちください。
        </p>
      </div>
    </div>
  )
}

// ========================
// エラー状態コンポーネント
// ========================

function ErrorState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* アイコン */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* メッセージ */}
        <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
          読み込みに失敗しました
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          お知らせの取得中にエラーが発生しました。
          <br />
          しばらく時間をおいてから再度お試しください。
        </p>

        {/* 再読み込みボタン */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          ページを再読み込み
        </button>
      </div>
    </div>
  )
}