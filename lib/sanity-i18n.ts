/**
 * 蓮城院公式サイト Sanity多言語対応クライアント
 *
 * @sanity/document-internationalizationプラグインと連携し、
 * 多言語コンテンツの取得を提供します。
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { client, getClient } from './sanity'
import type { LanguageId } from '../sanity/schemas/helpers/i18n'

/**
 * 多言語対応の型定義
 */
export type LocaleParam = LanguageId
export type LocalizedContent<T> = T & {
  language: LocaleParam
}

/**
 * 多言語対応のGROQクエリビルダー
 */
export class I18nQueryBuilder {
  private locale: LocaleParam
  private fallbackLocale: LocaleParam = 'ja'

  constructor(locale: LocaleParam = 'ja') {
    this.locale = locale
  }

  /**
   * フォールバック言語を設定
   */
  setFallbackLocale(locale: LocaleParam): this {
    this.fallbackLocale = locale
    return this
  }

  /**
   * 多言語対応のフィールド取得クエリを生成
   * 指定言語が存在しない場合はフォールバック言語を使用
   */
  private buildLocalizedFieldQuery(fieldName: string): string {
    return `
      "${fieldName}": coalesce(
        ${fieldName}[_key == "${this.locale}"][0].value,
        ${fieldName}[_key == "${this.fallbackLocale}"][0].value,
        ${fieldName}
      )
    `
  }

  /**
   * 画像フィールド用の多言語対応クエリ
   */
  private buildLocalizedImageQuery(fieldName: string): string {
    return `
      "${fieldName}": {
        asset,
        hotspot,
        crop,
        "alt": coalesce(
          ${fieldName}.alt[_key == "${this.locale}"][0].value,
          ${fieldName}.alt[_key == "${this.fallbackLocale}"][0].value,
          ${fieldName}.alt
        )
      }
    `
  }

  /**
   * ブログ記事一覧用の多言語対応クエリ
   */
  getBlogListQuery(): string {
    return `
      *[_type == "blog"] | order(publishedAt desc) [$start...$end] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        ${this.buildLocalizedFieldQuery('excerpt')},
        ${this.buildLocalizedImageQuery('mainImage')},
        language
      }
    `
  }

  /**
   * ブログ記事詳細用の多言語対応クエリ
   */
  getBlogDetailQuery(): string {
    return `
      *[_type == "blog" && slug.current == $slug][0] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        ${this.buildLocalizedFieldQuery('excerpt')},
        "body": coalesce(
          body[_key == "${this.locale}"][0].value,
          body[_key == "${this.fallbackLocale}"][0].value,
          body
        ),
        ${this.buildLocalizedImageQuery('mainImage')},
        language
      }
    `
  }

  /**
   * お知らせ一覧用の多言語対応クエリ
   */
  getNewsListQuery(): string {
    return `
      *[_type == "news"] | order(publishedAt desc) [$start...$end] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        category,
        language
      }
    `
  }

  /**
   * お知らせ詳細用の多言語対応クエリ
   */
  getNewsDetailQuery(): string {
    return `
      *[_type == "news" && slug.current == $slug][0] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        category,
        "content": coalesce(
          content[_key == "${this.locale}"][0].value,
          content[_key == "${this.fallbackLocale}"][0].value,
          content
        ),
        language
      }
    `
  }

  /**
   * 固定ページ詳細用の多言語対応クエリ
   */
  getPageDetailQuery(): string {
    return `
      *[_type == "page" && slug.current == $slug][0] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        "body": coalesce(
          body[_key == "${this.locale}"][0].value,
          body[_key == "${this.fallbackLocale}"][0].value,
          body
        ),
        ${this.buildLocalizedFieldQuery('metaDescription')},
        language
      }
    `
  }

  /**
   * トップページ用統合クエリ（多言語対応）
   */
  getHomeDataQuery(): string {
    return `{
      "recentNews": *[_type == "news"] | order(publishedAt desc) [0...3] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        category,
        language
      },
      "recentBlogs": *[_type == "blog"] | order(publishedAt desc) [0...3] {
        _id,
        ${this.buildLocalizedFieldQuery('title')},
        slug,
        publishedAt,
        ${this.buildLocalizedFieldQuery('excerpt')},
        ${this.buildLocalizedImageQuery('mainImage')},
        language
      }
    }`
  }

  /**
   * 静的パス生成用のスラッグ一覧（言語別）
   */
  getSlugsByLanguageQuery(docType: string): string {
    return `*[_type == "${docType}" && language == "${this.locale}"]{slug}`
  }
}

/**
 * 多言語対応データ取得関数群
 */
export const fetchLocalizedContent = {
  /**
   * 多言語対応ブログ記事一覧を取得
   */
  async getBlogPosts(
    locale: LocaleParam,
    params: { start?: number; end?: number; preview?: boolean } = {}
  ) {
    const { start = 0, end = 10, preview = false } = params
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      const query = queryBuilder.getBlogListQuery()
      return await queryClient.fetch(query, { start, end })
    } catch (error) {
      console.error('Failed to fetch localized blog posts:', error)
      throw new Error(`ブログ記事の取得に失敗しました (${locale})`)
    }
  },

  /**
   * 多言語対応ブログ記事詳細を取得
   */
  async getBlogPost(locale: LocaleParam, slug: string, preview: boolean = false) {
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      const query = queryBuilder.getBlogDetailQuery()
      return await queryClient.fetch(query, { slug })
    } catch (error) {
      console.error(`Failed to fetch localized blog post: ${slug}`, error)
      throw new Error(`ブログ記事の詳細取得に失敗しました (${locale})`)
    }
  },

  /**
   * 多言語対応お知らせ一覧を取得
   */
  async getNews(
    locale: LocaleParam,
    params: { start?: number; end?: number; category?: string; preview?: boolean } = {}
  ) {
    const { start = 0, end = 10, category, preview = false } = params
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      let query = queryBuilder.getNewsListQuery()

      // カテゴリフィルタを追加
      if (category) {
        query = query.replace(
          '*[_type == "news"]',
          `*[_type == "news" && category == "${category}"]`
        )
      }

      return await queryClient.fetch(query, { start, end })
    } catch (error) {
      console.error('Failed to fetch localized news:', error)
      throw new Error(`お知らせの取得に失敗しました (${locale})`)
    }
  },

  /**
   * 多言語対応お知らせ詳細を取得
   */
  async getNewsItem(locale: LocaleParam, slug: string, preview: boolean = false) {
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      const query = queryBuilder.getNewsDetailQuery()
      return await queryClient.fetch(query, { slug })
    } catch (error) {
      console.error(`Failed to fetch localized news item: ${slug}`, error)
      throw new Error(`お知らせの詳細取得に失敗しました (${locale})`)
    }
  },

  /**
   * 多言語対応固定ページを取得
   */
  async getPage(locale: LocaleParam, slug: string, preview: boolean = false) {
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      const query = queryBuilder.getPageDetailQuery()
      return await queryClient.fetch(query, { slug })
    } catch (error) {
      console.error(`Failed to fetch localized page: ${slug}`, error)
      throw new Error(`ページの取得に失敗しました (${locale})`)
    }
  },

  /**
   * 多言語対応トップページデータを取得
   */
  async getHomeData(locale: LocaleParam, preview: boolean = false) {
    const queryBuilder = new I18nQueryBuilder(locale)
    const queryClient = getClient(preview)

    try {
      const query = queryBuilder.getHomeDataQuery()
      return await queryClient.fetch(query)
    } catch (error) {
      console.error('Failed to fetch localized home data:', error)
      throw new Error(`トップページデータの取得に失敗しました (${locale})`)
    }
  },

  /**
   * 言語別の静的パス生成用スラッグ一覧を取得
   */
  async getSlugsByLanguage(locale: LocaleParam, docType: 'blog' | 'news' | 'page') {
    const queryBuilder = new I18nQueryBuilder(locale)

    try {
      const query = queryBuilder.getSlugsByLanguageQuery(docType)
      return await client.fetch(query)
    } catch (error) {
      console.error(`Failed to fetch ${docType} slugs for ${locale}:`, error)
      throw new Error(`${docType}スラッグの取得に失敗しました (${locale})`)
    }
  }
}

/**
 * 多言語対応ユーティリティ関数
 */
export const i18nUtils = {
  /**
   * 有効な言語かどうかをチェック
   */
  isValidLocale(locale: string): locale is LocaleParam {
    return ['ja', 'en'].includes(locale as LocaleParam)
  },

  /**
   * デフォルト言語を取得
   */
  getDefaultLocale(): LocaleParam {
    return 'ja'
  },

  /**
   * 言語コードの正規化
   */
  normalizeLocale(locale: string | undefined): LocaleParam {
    if (!locale || !this.isValidLocale(locale)) {
      return this.getDefaultLocale()
    }
    return locale
  },

  /**
   * 言語別のURL生成
   */
  createLocalizedPath(locale: LocaleParam, path: string): string {
    // 日本語はデフォルトなので、パスに含めない
    if (locale === 'ja') {
      return path
    }
    return `/${locale}${path}`
  },

  /**
   * 翻訳が利用可能かどうかをチェック
   */
  hasTranslation<T extends Record<string, unknown>>(
    content: T,
    locale: LocaleParam,
    fieldName: keyof T
  ): boolean {
    const field = content[fieldName]
    if (Array.isArray(field)) {
      return field.some(item => item._key === locale)
    }
    return false
  },

  /**
   * フォールバック付きで翻訳されたテキストを取得
   */
  getLocalizedText(
    content: Record<string, unknown>,
    fieldName: string,
    locale: LocaleParam,
    fallback: LocaleParam = 'ja'
  ): string | null {
    const field = content[fieldName]

    if (typeof field === 'string') {
      return field
    }

    if (Array.isArray(field)) {
      // 指定言語を探す
      const localizedItem = field.find(item => item._key === locale)
      if (localizedItem?.value) {
        return localizedItem.value
      }

      // フォールバック言語を探す
      const fallbackItem = field.find(item => item._key === fallback)
      if (fallbackItem?.value) {
        return fallbackItem.value
      }
    }

    return null
  }
}

/**
 * 型安全な多言語対応フック関数
 */
export const useLocalizedQueries = (locale: LocaleParam) => {
  const queryBuilder = new I18nQueryBuilder(locale)

  return {
    queryBuilder,
    fetchBlogPosts: (params?: { start?: number; end?: number; preview?: boolean }) =>
      fetchLocalizedContent.getBlogPosts(locale, params),
    fetchBlogPost: (slug: string, preview?: boolean) =>
      fetchLocalizedContent.getBlogPost(locale, slug, preview),
    fetchNews: (params?: { start?: number; end?: number; category?: string; preview?: boolean }) =>
      fetchLocalizedContent.getNews(locale, params),
    fetchNewsItem: (slug: string, preview?: boolean) =>
      fetchLocalizedContent.getNewsItem(locale, slug, preview),
    fetchPage: (slug: string, preview?: boolean) =>
      fetchLocalizedContent.getPage(locale, slug, preview),
    fetchHomeData: (preview?: boolean) =>
      fetchLocalizedContent.getHomeData(locale, preview)
  }
}