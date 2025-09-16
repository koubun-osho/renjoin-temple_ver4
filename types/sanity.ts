/**
 * 蓮城院公式サイト Sanity TypeScript型定義
 *
 * SanityスキーマのTypeScript型定義ファイル。
 * Next.js アプリケーションで型安全性を確保します。
 *
 * @created 2025-09-17
 * @version 1.0.0 MVP版
 */

// ========================
// 基本的なSanityオブジェクト型
// ========================

/** Sanityのスラッグ型 */
export interface SanitySlug {
  current: string
  _type: 'slug'
}

/** Sanityの画像型 */
export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
  caption?: string
  _type: 'image'
}

/** Sanityのリンク注釈型 */
export interface SanityLinkAnnotation {
  _key: string
  _type: 'link'
  href: string
  blank?: boolean
}

/** Sanityのブロックコンテンツ型 */
export interface SanityBlockContent {
  _key: string
  _type: 'block'
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children: Array<{
    _key: string
    _type: 'span'
    text: string
    marks?: string[]
  }>
  markDefs?: SanityLinkAnnotation[]
  listItem?: 'bullet' | 'number'
}

/** Sanityのコンテンツ配列型（ブロック+画像） */
export type SanityPortableText = Array<SanityBlockContent | SanityImage>

// ========================
// ブログスキーマ型定義
// ========================

/** ブログ記事の基本型 */
export interface BlogPost {
  _id: string
  _type: 'blog'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
  body: SanityPortableText
}

/** ブログ記事一覧表示用の軽量版型 */
export interface BlogPostPreview {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImage
}

// ========================
// お知らせスキーマ型定義
// ========================

/** お知らせのカテゴリー型 */
export type NewsCategory = 'event' | 'notice' | 'service'

/** お知らせの基本型 */
export interface NewsItem {
  _id: string
  _type: 'news'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: SanitySlug
  publishedAt: string
  category: NewsCategory
  content: SanityPortableText
}

/** お知らせ一覧表示用の軽量版型 */
export interface NewsItemPreview {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  category: NewsCategory
}

// ========================
// 固定ページスキーマ型定義
// ========================

/** 固定ページの基本型 */
export interface Page {
  _id: string
  _type: 'page'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: SanitySlug
  body: SanityPortableText
  metaDescription?: string
}

// ========================
// トップページ用統合型
// ========================

/** トップページ用のデータ統合型 */
export interface HomePageData {
  recentNews: NewsItemPreview[]
  recentBlogs: BlogPostPreview[]
}

// ========================
// SEO・メタデータ型
// ========================

/** SEOメタデータ型 */
export interface SeoMetadata {
  title: string
  description: string
  ogImage?: string
  canonical?: string
}

// ========================
// ユーティリティ型
// ========================

/** ページネーション結果型 */
export interface PaginatedResult<T> {
  items: T[]
  totalItems: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/** クエリ結果の配列型 */
export type QueryResult<T> = T[]

/** 単一ドキュメントのクエリ結果型 */
export type SingleQueryResult<T> = T | null

// ========================
// Sanityクライアント関連型
// ========================

/** Sanityクエリパラメータ型 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined
}

/** Next.js静的パス生成用型 */
export interface StaticPath {
  params: {
    slug: string
  }
}

/** 日付フォーマット用型 */
export interface FormattedDate {
  short: string    // YYYY/MM/DD
  long: string     // YYYY年MM月DD日
  iso: string      // ISO 8601形式
}

// ========================
// エラーハンドリング型
// ========================

/** Sanityエラー型 */
export interface SanityError {
  message: string
  statusCode?: number
  details?: unknown
}

// ========================
// 型ガード関数用型
// ========================

/** 型ガード関数の戻り値型 */
export type TypeGuard<T> = (value: unknown) => value is T

// ========================
// カテゴリー関連定数
// ========================

/** お知らせカテゴリーのラベルマップ */
export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  event: '行事案内',
  notice: 'お知らせ',
  service: '法要'
} as const

/** カテゴリーの表示順序 */
export const NEWS_CATEGORY_ORDER: NewsCategory[] = ['event', 'service', 'notice'] as const

// ========================
// デフォルト値用型
// ========================

/** デフォルトのメタデータ */
export interface DefaultMetadata {
  siteName: string
  siteDescription: string
  siteUrl: string
  twitterHandle?: string
  ogImage: string
}