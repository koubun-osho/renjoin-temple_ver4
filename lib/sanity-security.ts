/**
 * 蓮城院公式サイト Sanityセキュリティ統合設定
 *
 * Sanityクライアントのセキュリティ強化のための追加設定
 * 設計書のセキュリティ要件に完全準拠
 *
 * @created 2025-09-17
 * @version 1.0.0 MVP版
 * @security high
 */

import { validateSecurityConfig, sanitizeText, sanitizeSlug, SECURITY_HEADERS } from '../sanity/lib/security'
import { validateSanityConfig, sanityConfig } from './sanity'
import type { SanityError } from '../types/sanity'

// ========================
// セキュリティ初期化
// ========================

/**
 * Sanityクライアントセキュリティの初期化
 * アプリケーション起動時に実行される
 */
export const initializeSanitySecurity = () => {
  // 基本設定の検証
  try {
    validateSanityConfig()
    console.log('✅ Sanity基本設定の検証完了')
  } catch (error) {
    console.error('❌ Sanity基本設定エラー:', error)
    throw error
  }

  // セキュリティ設定の検証
  const securityValidation = validateSecurityConfig()

  if (!securityValidation.isValid) {
    console.error('❌ セキュリティ設定エラー:', securityValidation.errors)
    throw new Error(`セキュリティ設定に問題があります: ${securityValidation.errors.join(', ')}`)
  }

  if (securityValidation.warnings.length > 0) {
    console.warn('⚠️  セキュリティ設定警告:', securityValidation.warnings)
  }

  console.log('✅ Sanityセキュリティ設定の検証完了')
}

// ========================
// データサニタイゼーション
// ========================

/**
 * ブログ記事データのサニタイゼーション
 */
export const sanitizeBlogPostData = (data: Record<string, unknown> | null) => {
  if (!data) return null

  return {
    ...data,
    title: typeof data.title === 'string' ? sanitizeText(data.title) : '',
    excerpt: typeof data.excerpt === 'string' ? sanitizeText(data.excerpt) : undefined,
    slug: data.slug && typeof data.slug === 'object' && data.slug !== null && 'current' in data.slug && typeof (data.slug as { current?: string }).current === 'string' ? {
      ...data.slug,
      current: sanitizeSlug((data.slug as { current: string }).current)
    } : undefined,
  }
}

/**
 * お知らせデータのサニタイゼーション
 */
export const sanitizeNewsData = (data: Record<string, unknown> | null) => {
  if (!data) return null

  return {
    ...data,
    title: typeof data.title === 'string' ? sanitizeText(data.title) : '',
    slug: data.slug && typeof data.slug === 'object' && data.slug !== null && 'current' in data.slug && typeof (data.slug as { current?: string }).current === 'string' ? {
      ...data.slug,
      current: sanitizeSlug((data.slug as { current: string }).current)
    } : undefined,
  }
}

/**
 * 固定ページデータのサニタイゼーション
 */
export const sanitizePageData = (data: Record<string, unknown> | null) => {
  if (!data) return null

  return {
    ...data,
    title: typeof data.title === 'string' ? sanitizeText(data.title) : '',
    metaDescription: typeof data.metaDescription === 'string' ? sanitizeText(data.metaDescription) : undefined,
    slug: data.slug && typeof data.slug === 'object' && data.slug !== null && 'current' in data.slug && typeof (data.slug as { current?: string }).current === 'string' ? {
      ...data.slug,
      current: sanitizeSlug((data.slug as { current: string }).current)
    } : undefined,
  }
}

// ========================
// エラーハンドリング強化
// ========================

/**
 * Sanityエラーのセキュアなハンドリング
 * 本番環境では詳細なエラー情報を隠蔽
 */
export const handleSanityError = (error: unknown, context: string): SanityError => {
  console.error(`Sanity Error in ${context}:`, error)

  // 本番環境では詳細なエラー情報を隠蔽
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'データの取得に失敗しました。しばらくしてから再度お試しください。',
      statusCode: 500,
      details: undefined
    }
  }

  // 開発環境では詳細を返す
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      details: error
    }
  }

  return {
    message: 'Unknown error occurred',
    statusCode: 500,
    details: error
  }
}

// ========================
// API セキュリティヘルパー
// ========================

/**
 * Sanity API レスポンスの検証
 */
export const validateApiResponse = <T>(response: T, expectedFields: string[]): T => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format')
  }

  const responseObj = response as Record<string, unknown>

  // 必須フィールドの確認
  for (const field of expectedFields) {
    if (!(field in responseObj)) {
      console.warn(`Missing expected field: ${field}`)
    }
  }

  return response
}

/**
 * GROQ クエリパラメータの検証
 */
export const validateQueryParams = (params: Record<string, unknown>): Record<string, unknown> => {
  const sanitizedParams: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(params)) {
    // 文字列パラメータのサニタイズ
    if (typeof value === 'string') {
      sanitizedParams[key] = sanitizeText(value)
    }
    // 数値パラメータの検証
    else if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value)) {
        throw new Error(`Invalid number parameter: ${key}`)
      }
      sanitizedParams[key] = value
    }
    // その他の安全な値
    else if (typeof value === 'boolean' || value === null || value === undefined) {
      sanitizedParams[key] = value
    }
    else {
      console.warn(`Skipping potentially unsafe parameter: ${key}`)
    }
  }

  return sanitizedParams
}

// ========================
// セキュリティ情報取得
// ========================

/**
 * 現在のセキュリティ設定状態を取得
 */
export const getSecurityStatus = () => {
  const validation = validateSecurityConfig()

  return {
    configStatus: {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
    },
    sanityConfig: {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      hasToken: sanityConfig.hasToken,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * セキュリティヘッダーの取得
 * Next.js のミドルウェアで使用
 */
export const getSecurityHeaders = () => {
  return SECURITY_HEADERS
}

// ========================
// 初期化実行
// ========================

// モジュール読み込み時にセキュリティ設定を初期化
try {
  initializeSanitySecurity()
} catch (error) {
  console.error('Sanityセキュリティ初期化に失敗しました:', error)
  // 本番環境では処理を続行（フォールバック）
  if (process.env.NODE_ENV === 'production') {
    console.warn('セキュリティ設定の問題を無視して続行します（本番環境）')
  } else {
    // 開発環境では停止
    throw error
  }
}

// ========================
// エクスポート
// ========================

export {
  validateSecurityConfig,
  sanitizeText,
  sanitizeSlug,
  SECURITY_HEADERS,
} from '../sanity/lib/security'