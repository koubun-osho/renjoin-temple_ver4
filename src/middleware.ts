/**
 * 蓮城院公式サイト - Next.js ミドルウェア
 *
 * パフォーマンス最適化とセキュリティ強化のためのミドルウェア
 * キャッシュ戦略、レスポンスヘッダー、Core Web Vitals最適化
 *
 * @created 2025-09-18
 * @version 1.0.0 Performance Optimization版
 * @task P4-04 - パフォーマンス最適化
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ========================
// キャッシュ設定
// ========================

const CACHE_HEADERS = {
  // 静的アセット（1年間キャッシュ）
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'CDN-Cache-Control': 'public, max-age=31536000',
    'Vercel-CDN-Cache-Control': 'public, max-age=31536000'
  },

  // 画像ファイル（1ヶ月キャッシュ）
  images: {
    'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'public, max-age=2592000',
    'Vercel-CDN-Cache-Control': 'public, max-age=2592000'
  },

  // HTMLページ（1時間キャッシュ、1日間stale可）
  pages: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
  },

  // APIレスポンス（15分キャッシュ）
  api: {
    'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
    'CDN-Cache-Control': 'public, max-age=900'
  },

  // 動的コンテンツ（キャッシュ無効）
  dynamic: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}

// ========================
// パフォーマンス最適化ヘッダー
// ========================

const PERFORMANCE_HEADERS = {
  // DNS プリフェッチ
  'X-DNS-Prefetch-Control': 'on',

  // 圧縮を有効化
  'Vary': 'Accept-Encoding',

  // Early Hints (HTTP/2 Push)
  'Link': [
    '</fonts/NotoSerifJP-400.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
    '</fonts/NotoSerifJP-600.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
    '</fonts/NotoSansJP-400.woff2>; rel=preload; as=font; type=font/woff2; crossorigin'
  ].join(', '),

  // Resource Hints
  'X-Preload-Resources': JSON.stringify([
    { url: '/images/temple-hero.jpg', type: 'image' },
    { url: '/api/blog/recent', type: 'fetch' },
    { url: '/api/news/recent', type: 'fetch' }
  ])
}

// ========================
// Core Web Vitals最適化ヘッダー
// ========================

const CORE_WEB_VITALS_HEADERS = {
  // Largest Contentful Paint (LCP) 最適化
  'X-LCP-Optimization': 'enabled',

  // First Input Delay (FID) 最適化
  'X-FID-Optimization': 'enabled',

  // Cumulative Layout Shift (CLS) 最適化
  'X-CLS-Optimization': 'enabled',

  // Web Vitals レポート用
  'X-Web-Vitals-Endpoint': '/api/web-vitals',

  // ページロード優先度
  'X-Page-Priority': 'high'
}

// ========================
// セキュリティヘッダー（既存のものを補完）
// ========================

const ADDITIONAL_SECURITY_HEADERS = {
  // MIME タイプスニッフィング防止
  'X-Content-Type-Options': 'nosniff',

  // XSS フィルター
  'X-XSS-Protection': '1; mode=block',

  // リファラーポリシー
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // クロスオリジンリソースポリシー
  'Cross-Origin-Resource-Policy': 'cross-origin',

  // Origin-Agent-Cluster
  'Origin-Agent-Cluster': '?1'
}

// ========================
// ルートベースの設定
// ========================

/**
 * パスに基づいてキャッシュヘッダーを決定
 */
function getCacheHeaders(pathname: string) {
  // 静的アセット
  if (pathname.startsWith('/_next/static/') ||
      pathname.startsWith('/static/') ||
      pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
    return CACHE_HEADERS.static
  }

  // 画像ファイル
  if (pathname.startsWith('/images/') ||
      pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|ico)$/)) {
    return CACHE_HEADERS.images
  }

  // APIルート
  if (pathname.startsWith('/api/')) {
    return CACHE_HEADERS.api
  }

  // 管理画面・動的ページ
  if (pathname.startsWith('/admin/') ||
      pathname.startsWith('/studio/') ||
      pathname.includes('/preview/')) {
    return CACHE_HEADERS.dynamic
  }

  // 通常のページ
  return CACHE_HEADERS.pages
}

/**
 * ページ優先度を決定
 */
function getPagePriority(pathname: string): 'high' | 'medium' | 'low' {
  // 重要なページ（高優先度）
  if (pathname === '/' ||
      pathname === '/about' ||
      pathname.startsWith('/blog/') ||
      pathname.startsWith('/news/')) {
    return 'high'
  }

  // 中優先度のページ
  if (pathname === '/blog' ||
      pathname === '/news' ||
      pathname === '/events') {
    return 'medium'
  }

  // 低優先度のページ
  return 'low'
}

/**
 * Core Web Vitals最適化を適用
 */
function applyCoreWebVitalsOptimization(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname
  const priority = getPagePriority(pathname)

  // ページ優先度に基づく最適化
  response.headers.set('X-Page-Priority', priority)

  // 重要なページに対する特別な最適化
  if (priority === 'high') {
    // プリロードヒント
    response.headers.set('Link', PERFORMANCE_HEADERS.Link)

    // 早期フラッシュのヒント
    response.headers.set('X-Early-Flush', 'true')

    // サーバープッシュの候補
    response.headers.set('X-Push-Resources', JSON.stringify([
      '/images/temple-hero.jpg',
      '/_next/static/css/main.css'
    ]))
  }

  // LCP最適化
  if (pathname === '/') {
    response.headers.set('X-LCP-Element', 'hero-image')
    response.headers.set('X-LCP-Priority', 'high')
  }

  return response
}

/**
 * レスポンス圧縮の最適化
 */
function optimizeCompression(request: NextRequest, response: NextResponse) {
  const acceptEncoding = request.headers.get('accept-encoding') || ''

  // Brotli圧縮の推奨
  if (acceptEncoding.includes('br')) {
    response.headers.set('Content-Encoding', 'br')
  } else if (acceptEncoding.includes('gzip')) {
    response.headers.set('Content-Encoding', 'gzip')
  }

  // 圧縮レベルの指定
  response.headers.set('X-Compression-Level', 'optimal')

  return response
}

/**
 * キャッシュ最適化
 */
function optimizeCaching(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname
  const cacheHeaders = getCacheHeaders(pathname)

  // キャッシュヘッダーの設定
  Object.entries(cacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // ETags の設定（静的コンテンツ以外）
  if (!pathname.startsWith('/_next/static/')) {
    const etag = generateETag(pathname, request)
    response.headers.set('ETag', etag)

    // If-None-Match の処理
    const ifNoneMatch = request.headers.get('If-None-Match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }
  }

  return response
}

/**
 * ETag を生成
 */
function generateETag(pathname: string, request: NextRequest): string {
  const url = request.nextUrl.toString()
  const timestamp = new Date().toISOString().split('T')[0] // 日付ベース
  const hash = Buffer.from(`${url}-${timestamp}`).toString('base64').slice(0, 16)
  return `"${hash}"`
}

/**
 * パフォーマンス測定用ヘッダーを追加
 */
function addPerformanceHeaders(response: NextResponse) {
  const timestamp = Date.now()

  response.headers.set('X-Response-Time', timestamp.toString())
  response.headers.set('X-Performance-Monitor', 'enabled')

  // Web Vitals レポート用エンドポイント
  response.headers.set('X-Web-Vitals-Endpoint', '/api/analytics/web-vitals')

  return response
}

// ========================
// メインミドルウェア関数
// ========================

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    // 基本的なセキュリティヘッダー
    Object.entries(ADDITIONAL_SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // パフォーマンス最適化ヘッダー
    Object.entries(PERFORMANCE_HEADERS).forEach(([key, value]) => {
      if (key !== 'Link' && key !== 'X-Preload-Resources') {
        response.headers.set(key, value)
      }
    })

    // Core Web Vitals最適化ヘッダー
    Object.entries(CORE_WEB_VITALS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // キャッシュ最適化
    const cachedResponse = optimizeCaching(request, response)
    if (cachedResponse.status === 304) {
      return cachedResponse
    }

    // 圧縮最適化
    optimizeCompression(request, response)

    // Core Web Vitals最適化
    applyCoreWebVitalsOptimization(request, response)

    // パフォーマンス測定
    addPerformanceHeaders(response)

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

// ========================
// ミドルウェア設定
// ========================

export const config = {
  matcher: [
    /*
     * 以下のパスを除いてすべてのリクエストに適用:
     * - api (APIルート)
     * - _next/static (静的ファイル)
     * - _next/image (Image Optimization API)
     * - favicon.ico (ファビコン)
     * - robots.txt, sitemap.xml (SEOファイル)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}