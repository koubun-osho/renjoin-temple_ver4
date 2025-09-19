/**
 * 蓮城院公式サイト Sanity クライアント設定
 * 
 * Next.jsプロジェクトでSanity CMSを使用するためのクライアント設定ファイル。
 * GROQ クエリの実行とデータフェッチを担当します。
 * 
 * @created 2025-09-16
 * @version 1.0.0 MVP版
 */

import { createClient } from '@sanity/client'

// 環境変数の型安全性を確保
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vbwerzmy'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-16'

// Sanity設定が不完全かどうかをチェック
const isSanityConfigured = !!(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET
)

/**
 * 本番用 Sanity クライアント
 * 公開データの取得に使用（APIトークン不要）
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDNを使用してパフォーマンスを向上
})

/**
 * プレビュー用 Sanity クライアント
 * ドラフトデータの取得に使用（要APIトークン）
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // プレビューではCDNを無効化
  token: process.env.SANITY_API_TOKEN,
})

/**
 * 動的なクライアント取得関数
 * プレビューモードに応じて適切なクライアントを返却
 */
export const getClient = (preview?: boolean) => (preview ? previewClient : client)

/**
 * Sanity設定状況のエクスポート
 */
export { isSanityConfigured }

/**
 * 設定値の確認
 * 開発時のデバッグ用
 */
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  hasToken: !!process.env.SANITY_API_TOKEN,
} as const

// ========================
// GROQクエリ定義（設計書準拠）
// ========================

/**
 * ブログ記事関連クエリ
 */
export const blogQueries = {
  // ブログ記事一覧取得（ページネーション対応）
  list: `
    *[_type == "blog"] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset,
        hotspot,
        crop,
        alt
      }
    }
  `,

  // ブログ記事詳細取得
  detail: `
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      mainImage {
        asset,
        hotspot,
        crop,
        alt
      }
    }
  `,

  // トップページ用ブログ記事（最新3件）
  recent: `
    *[_type == "blog"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset,
        hotspot,
        crop,
        alt
      }
    }
  `,

  // ブログ記事総数取得
  count: `count(*[_type == "blog"])`,

  // 静的パス生成用スラッグ一覧
  slugs: `*[_type == "blog"]{slug}`,

  // サイトマップ用データ取得
  sitemap: `
    *[_type == "blog"] | order(publishedAt desc) {
      slug,
      publishedAt,
      _updatedAt
    }
  `
} as const

/**
 * お知らせ関連クエリ
 */
export const newsQueries = {
  // お知らせ一覧取得（ページネーション対応）
  list: `
    *[_type == "news"] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,

  // お知らせ詳細取得
  detail: `
    *[_type == "news" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      category,
      content
    }
  `,

  // トップページ用お知らせ（最新3件）
  recent: `
    *[_type == "news"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,

  // カテゴリ別お知らせ取得
  byCategory: `
    *[_type == "news" && category == $category] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,

  // お知らせ総数取得
  count: `count(*[_type == "news"])`,

  // カテゴリ別総数取得
  countByCategory: `count(*[_type == "news" && category == $category])`,

  // 静的パス生成用スラッグ一覧
  slugs: `*[_type == "news"]{slug}`,

  // サイトマップ用データ取得
  sitemap: `
    *[_type == "news"] | order(publishedAt desc) {
      slug,
      publishedAt,
      _updatedAt
    }
  `
} as const

/**
 * 固定ページ関連クエリ
 */
export const pageQueries = {
  // 固定ページ詳細取得
  detail: `
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      body,
      metaDescription
    }
  `,

  // 全固定ページ一覧
  list: `
    *[_type == "page"] | order(title asc) {
      _id,
      title,
      slug,
      metaDescription
    }
  `,

  // 静的パス生成用スラッグ一覧
  slugs: `*[_type == "page"]{slug}`
} as const

/**
 * トップページ用統合クエリ
 */
export const homeQueries = {
  // トップページに必要なデータを一括取得
  homeData: `{
    "recentNews": *[_type == "news"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      category
    },
    "recentBlogs": *[_type == "blog"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage {
        asset,
        hotspot,
        crop,
        alt
      }
    }
  }`
} as const

// ========================
// 型安全なデータ取得関数
// ========================

// 型定義のインポート
import type {
  BlogPost,
  BlogPostPreview,
  NewsItem,
  NewsItemPreview,
  Page,
  HomePageData,
  NewsCategory
} from '../types/sanity'

/**
 * ブログ記事データ取得関数群
 */
export const fetchBlogPosts = {
  /**
   * ブログ記事一覧を取得（ページネーション対応）
   */
  async list(params: { start?: number; end?: number; preview?: boolean } = {}): Promise<BlogPostPreview[]> {
    const { start = 0, end = 10, preview = false } = params
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(blogQueries.list, { start, end })
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      throw new Error('ブログ記事の取得に失敗しました')
    }
  },

  /**
   * ブログ記事詳細を取得
   */
  async detail(slug: string, preview: boolean = false): Promise<BlogPost | null> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(blogQueries.detail, { slug })
    } catch (error) {
      console.error(`Failed to fetch blog post with slug: ${slug}`, error)
      throw new Error('ブログ記事の詳細取得に失敗しました')
    }
  },

  /**
   * 最新ブログ記事を取得（トップページ用）
   */
  async recent(preview: boolean = false): Promise<BlogPostPreview[]> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(blogQueries.recent)
    } catch (error) {
      console.error('Failed to fetch recent blog posts:', error)
      throw new Error('最新ブログ記事の取得に失敗しました')
    }
  },

  /**
   * ブログ記事総数を取得
   */
  async count(preview: boolean = false): Promise<number> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(blogQueries.count)
    } catch (error) {
      console.error('Failed to fetch blog posts count:', error)
      throw new Error('ブログ記事数の取得に失敗しました')
    }
  },

  /**
   * 静的パス生成用のスラッグ一覧を取得
   */
  async slugs(): Promise<Array<{ slug: { current: string } }>> {
    try {
      return await client.fetch(blogQueries.slugs)
    } catch (error) {
      console.error('Failed to fetch blog post slugs:', error)
      throw new Error('ブログ記事スラッグの取得に失敗しました')
    }
  },

  /**
   * サイトマップ用のブログ記事データを取得
   */
  async sitemap(): Promise<Array<{ slug: { current: string }; publishedAt: string; _updatedAt: string }>> {
    try {
      return await client.fetch(blogQueries.sitemap)
    } catch (error) {
      console.error('Failed to fetch blog posts for sitemap:', error)
      return []
    }
  }
}

/**
 * お知らせデータ取得関数群
 */
export const fetchNews = {
  /**
   * お知らせ一覧を取得（ページネーション対応）
   */
  async list(params: { start?: number; end?: number; category?: NewsCategory; preview?: boolean } = {}): Promise<NewsItemPreview[]> {
    const { start = 0, end = 10, category, preview = false } = params
    const queryClient = getClient(preview)

    try {
      if (category) {
        return await queryClient.fetch(newsQueries.byCategory, { start, end, category })
      }
      return await queryClient.fetch(newsQueries.list, { start, end })
    } catch (error) {
      console.error('Failed to fetch news items:', error)
      throw new Error('お知らせの取得に失敗しました')
    }
  },

  /**
   * お知らせ詳細を取得
   */
  async detail(slug: string, preview: boolean = false): Promise<NewsItem | null> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(newsQueries.detail, { slug })
    } catch (error) {
      console.error(`Failed to fetch news item with slug: ${slug}`, error)
      throw new Error('お知らせの詳細取得に失敗しました')
    }
  },

  /**
   * 最新お知らせを取得（トップページ用）
   */
  async recent(preview: boolean = false): Promise<NewsItemPreview[]> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(newsQueries.recent)
    } catch (error) {
      console.error('Failed to fetch recent news:', error)
      throw new Error('最新お知らせの取得に失敗しました')
    }
  },

  /**
   * お知らせ総数を取得
   */
  async count(category?: NewsCategory, preview: boolean = false): Promise<number> {
    const queryClient = getClient(preview)

    try {
      if (category) {
        return await queryClient.fetch(newsQueries.countByCategory, { category })
      }
      return await queryClient.fetch(newsQueries.count)
    } catch (error) {
      console.error('Failed to fetch news count:', error)
      throw new Error('お知らせ数の取得に失敗しました')
    }
  },

  /**
   * 静的パス生成用のスラッグ一覧を取得
   */
  async slugs(): Promise<Array<{ slug: { current: string } }>> {
    try {
      return await client.fetch(newsQueries.slugs)
    } catch (error) {
      console.error('Failed to fetch news slugs:', error)
      throw new Error('お知らせスラッグの取得に失敗しました')
    }
  },

  /**
   * サイトマップ用のお知らせデータを取得
   */
  async sitemap(): Promise<Array<{ slug: { current: string }; publishedAt: string; _updatedAt: string }>> {
    try {
      return await client.fetch(newsQueries.sitemap)
    } catch (error) {
      console.error('Failed to fetch news for sitemap:', error)
      return []
    }
  }
}

/**
 * 固定ページデータ取得関数群
 */
export const fetchPages = {
  /**
   * 固定ページ詳細を取得
   */
  async detail(slug: string, preview: boolean = false): Promise<Page | null> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(pageQueries.detail, { slug })
    } catch (error) {
      console.error(`Failed to fetch page with slug: ${slug}`, error)
      throw new Error('ページの取得に失敗しました')
    }
  },

  /**
   * 全固定ページ一覧を取得
   */
  async list(preview: boolean = false): Promise<Page[]> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(pageQueries.list)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
      throw new Error('ページ一覧の取得に失敗しました')
    }
  },

  /**
   * 静的パス生成用のスラッグ一覧を取得
   */
  async slugs(): Promise<Array<{ slug: { current: string } }>> {
    try {
      return await client.fetch(pageQueries.slugs)
    } catch (error) {
      console.error('Failed to fetch page slugs:', error)
      throw new Error('ページスラッグの取得に失敗しました')
    }
  }
}

/**
 * トップページ用データ取得関数
 */
export const fetchHomePageData = {
  /**
   * トップページに必要なデータを一括取得
   */
  async all(preview: boolean = false): Promise<HomePageData> {
    const queryClient = getClient(preview)

    try {
      return await queryClient.fetch(homeQueries.homeData)
    } catch (error) {
      console.error('Failed to fetch home page data:', error)
      throw new Error('トップページデータの取得に失敗しました')
    }
  }
}

// ========================
// ユーティリティ関数
// ========================

/**
 * ページネーション計算ユーティリティ
 */
export const createPagination = (currentPage: number, totalItems: number, itemsPerPage: number) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage

  return {
    start,
    end,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    currentPage,
    totalItems
  }
}

/**
 * 環境変数の検証
 */
export const validateSanityConfig = () => {
  if (!projectId || !dataset) {
    throw new Error(
      'Sanity設定が不完全です。環境変数を確認してください。\n' +
      'NEXT_PUBLIC_SANITY_PROJECT_ID と NEXT_PUBLIC_SANITY_DATASET が必要です。'
    )
  }

  return true
}

// 初期化時の設定検証
validateSanityConfig()