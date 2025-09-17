/**
 * 蓮城院公式サイト - Sanity画像処理ユーティリティ
 *
 * Sanityの画像アセットからURLを生成し、最適化された画像を提供します。
 * Next.js Image コンポーネントとの連携もサポートします。
 *
 * @created 2025-09-17
 * @version 1.0.0 MVP版
 */

import imageUrlBuilder from '@sanity/image-url'
import { SanityImage } from '../types/sanity'
import { client } from './sanity'

// ========================
// 画像URLビルダーの初期化
// ========================

/**
 * Sanity画像URLビルダー
 * プロジェクトIDとデータセットを使用してビルダーを初期化
 */
const builder = imageUrlBuilder(client)

/**
 * 画像アセットからURLを生成する基本関数
 */
export function urlFor(source: SanityImage) {
  return builder.image(source)
}

// ========================
// 最適化されたURL生成関数
// ========================

/**
 * レスポンシブ画像用のURL生成オプション
 */
interface ResponsiveImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  fit?: 'crop' | 'clip' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  dpr?: number
}

/**
 * 最適化された画像URLを生成
 */
export function getOptimizedImageUrl(
  source: SanityImage,
  options: ResponsiveImageOptions = {}
): string {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'crop',
    dpr = 1
  } = options

  let url = urlFor(source)
    .quality(quality)
    .format(format)
    .fit(fit)
    .dpr(dpr)

  if (width) url = url.width(width)
  if (height) url = url.height(height)

  return url.url()
}

/**
 * ブログ記事のメイン画像用URL生成
 */
export function getBlogImageUrl(source: SanityImage, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
  const sizeConfig = {
    thumbnail: { width: 320, height: 180 },
    medium: { width: 640, height: 360 },
    large: { width: 1200, height: 675 }
  }

  const { width, height } = sizeConfig[size]

  return getOptimizedImageUrl(source, {
    width,
    height,
    quality: 90,
    format: 'webp',
    fit: 'crop'
  })
}

/**
 * アイキャッチ画像（OGP用）のURL生成
 */
export function getOgImageUrl(source: SanityImage): string {
  return getOptimizedImageUrl(source, {
    width: 1200,
    height: 630,
    quality: 90,
    format: 'jpg', // OGPはjpgが推奨
    fit: 'crop'
  })
}

/**
 * 画像のalt属性を安全に取得
 */
export function getImageAlt(source: SanityImage, fallback: string = ''): string {
  return source.alt || source.caption || fallback
}

// ========================
// Next.js Image用のユーティリティ
// ========================

/**
 * Next.js Imageコンポーネント用の画像データを生成
 */
export interface NextImageData {
  src: string
  alt: string
  blurDataURL?: string
}

/**
 * Next.js Image用のデータを生成
 */
export function getNextImageData(
  source: SanityImage,
  options: ResponsiveImageOptions & { alt?: string } = {}
): NextImageData {
  const { alt, ...urlOptions } = options

  return {
    src: getOptimizedImageUrl(source, urlOptions),
    alt: alt || getImageAlt(source),
    // 小さなblur用画像を生成（プレースホルダー用）
    blurDataURL: getOptimizedImageUrl(source, {
      width: 20,
      height: 20,
      quality: 20,
      format: 'webp'
    })
  }
}

// ========================
// レスポンシブ画像セット生成
// ========================

/**
 * srcsetで使用する画像URLセットを生成
 */
export function generateSrcSet(
  source: SanityImage,
  baseWidth: number = 640,
  options: Omit<ResponsiveImageOptions, 'width'> = {}
): string {
  const widths = [baseWidth * 0.5, baseWidth, baseWidth * 1.5, baseWidth * 2]

  return widths
    .map(width => {
      const url = getOptimizedImageUrl(source, { ...options, width: Math.round(width) })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * sizes属性用の文字列を生成
 */
export function generateSizesString(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => {
      if (breakpoint === 'default') return size
      return `(${breakpoint}) ${size}`
    })
    .join(', ')
}

// ========================
// 画像の存在チェック
// ========================

/**
 * 画像アセットが有効かどうかをチェック
 */
export function isValidImage(source: unknown): source is SanityImage {
  if (typeof source !== 'object' || source === null) {
    return false
  }

  const sourceObj = source as Record<string, unknown>

  return (
    'asset' in sourceObj &&
    typeof sourceObj.asset === 'object' &&
    sourceObj.asset !== null &&
    '_ref' in (sourceObj.asset as Record<string, unknown>) &&
    typeof (sourceObj.asset as Record<string, unknown>)._ref === 'string'
  )
}

/**
 * 画像URLが生成可能かどうかをチェック
 */
export function canGenerateImageUrl(source: unknown): boolean {
  try {
    if (!isValidImage(source)) return false
    const url = urlFor(source).url()
    return typeof url === 'string' && url.length > 0
  } catch (error) {
    console.warn('Failed to generate image URL:', error)
    return false
  }
}

// ========================
// エラーハンドリング付きURL生成
// ========================

/**
 * エラーハンドリング付きの安全な画像URL生成
 */
export function safeImageUrl(
  source: unknown,
  options: ResponsiveImageOptions = {},
  fallbackUrl: string = '/images/placeholder.svg'
): string {
  try {
    if (!isValidImage(source)) return fallbackUrl
    return getOptimizedImageUrl(source, options)
  } catch (error) {
    console.warn('画像URL生成に失敗しました:', error)
    return fallbackUrl
  }
}

// ========================
// デフォルト設定
// ========================

/**
 * デフォルトの画像最適化設定
 */
export const DEFAULT_IMAGE_OPTIONS: ResponsiveImageOptions = {
  quality: 85,
  format: 'webp',
  fit: 'crop'
} as const

/**
 * 一般的なブレークポイント設定
 */
export const RESPONSIVE_BREAKPOINTS = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)'
} as const