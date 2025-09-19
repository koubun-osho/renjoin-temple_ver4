/**
 * 蓮城院公式サイト - ブログ一覧ページ
 *
 * 副住職のブログ記事一覧を表示。
 * Sanity CMSからデータを取得し、時系列で表示。
 * シンプルなページネーション機能を提供。
 *
 * @created 2025-09-17
 * @version 1.0.0 MVP版
 * @task P2-05 - ブログ一覧ページ作成
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogCard, CardGrid } from '../../components/ui/Card'
import ReloadButton from '../../components/ui/ReloadButton'
import { fetchBlogPosts, createPagination } from '../../../lib/sanity'
import { BlogPostPreview } from '../../../types/sanity'

// ISR設定：ブログ一覧は30分ごとに再生成
export const revalidate = 1800 // 30分（1800秒）

// 静的生成の設定
export const dynamic = 'force-static'

// ========================
// ページ設定
// ========================

/**
 * 1ページあたりの記事数
 */
const POSTS_PER_PAGE = 10

/**
 * SEOメタデータ
 */
export const metadata: Metadata = {
  title: '副住職ブログ一覧',
  description: '蓮城院の副住職が日々の思いや寺院での出来事をつづります。仏教の教えや季節の行事について分かりやすくお伝えします。',
  openGraph: {
    title: '副住職ブログ一覧 | 蓮城院',
    description: '蓮城院の副住職が日々の思いや寺院での出来事をつづります。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: '副住職ブログ一覧 | 蓮城院',
    description: '蓮城院の副住職が日々の思いや寺院での出来事をつづります。',
  },
  alternates: {
    canonical: '/blog',
  }
}

// ========================
// ページコンポーネント
// ========================

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

/**
 * ブログ一覧ページメインコンポーネント
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  // ページ番号の取得と検証
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  try {
    // ブログ記事データの取得
    const paginationData = createPagination(currentPage, 0, POSTS_PER_PAGE)
    const [posts, totalCount] = await Promise.all([
      fetchBlogPosts.list({
        start: paginationData.start,
        end: paginationData.end
      }),
      fetchBlogPosts.count()
    ])

    // ページネーション情報の再計算
    const pagination = createPagination(currentPage, totalCount, POSTS_PER_PAGE)

    // 無効なページ番号の場合は404
    if (currentPage > pagination.totalPages && totalCount > 0) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* ページヘッダー */}
        <BlogHeader />

        {/* メインコンテンツ */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {posts.length > 0 ? (
            <>
              {/* ブログ記事一覧 */}
              <BlogList posts={posts} />

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
    console.error('ブログ一覧の取得に失敗しました:', error)
    return <ErrorState />
  }
}

// ========================
// ページヘッダーコンポーネント
// ========================

function BlogHeader() {
  return (
    <section className="relative bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            副住職ブログ
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            蓮城院の副住職・荒木弘文が、日々の思いや寺院での出来事をつづります。
            <br />
            仏教の教えや季節の行事について、分かりやすくお伝えします。
          </p>
        </div>
      </div>

      {/* 装飾的な下線 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400" />
    </section>
  )
}

// ========================
// ブログ記事一覧コンポーネント
// ========================

interface BlogListProps {
  posts: BlogPostPreview[]
}

function BlogList({ posts }: BlogListProps) {
  return (
    <section className="mb-16" aria-label="ブログ記事一覧">
      <CardGrid columns={3} gap="lg">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
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
    return page === 1 ? '/blog' : `/blog?page=${page}`
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
      aria-label="ブログ記事のページネーション"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* メッセージ */}
        <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
          ブログ記事がありません
        </h3>
        <p className="text-gray-600 leading-relaxed">
          現在、公開されているブログ記事がありません。
          <br />
          新しい記事をお待ちください。
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
          ブログ記事の取得中にエラーが発生しました。
          <br />
          しばらく時間をおいてから再度お試しください。
        </p>

        {/* 再読み込みボタン */}
        <ReloadButton
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          ページを再読み込み
        </ReloadButton>
      </div>
    </div>
  )
}

