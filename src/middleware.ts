/**
 * 蓮城院公式サイト - Next.js ミドルウェア
 *
 * セキュリティヘッダー、キャッシュ最適化、多言語対応（Next.js 15対応版）
 *
 * @created 2025-09-18
 * @updated 2025-09-20
 * @version 3.0.0 - i18n対応版
 * @task P4-04 - パフォーマンス最適化 + 多言語対応
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

// ========================
// セキュリティヘッダー設定
// ========================

const SECURITY_HEADERS = {
  // MIME タイプスニッフィング防止
  'X-Content-Type-Options': 'nosniff',

  // XSS フィルター
  'X-XSS-Protection': '1; mode=block',

  // リファラーポリシー
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // DNS プリフェッチ
  'X-DNS-Prefetch-Control': 'on',

  // フレーム保護（next.configのCSPと重複しないもののみ）
  'X-Frame-Options': 'DENY'
}

// ========================
// キャッシュ設定
// ========================

function getCacheControl(pathname: string): string {
  // 静的アセット
  if (pathname.startsWith('/_next/static/') ||
      pathname.match(/\.(js|css|woff|woff2)$/)) {
    return 'public, max-age=31536000, immutable'
  }

  // 画像ファイル
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|ico)$/)) {
    return 'public, max-age=2592000, stale-while-revalidate=86400'
  }

  // APIルート
  if (pathname.startsWith('/api/')) {
    return 'public, max-age=900, stale-while-revalidate=1800'
  }

  // 通常のページ
  return 'public, max-age=3600, stale-while-revalidate=86400'
}

// ========================
// 国際化ミドルウェアの設定
// ========================

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // リダイレクトループを防ぐため一時的に'always'に変更
  localeDetection: true
})

// ========================
// メインミドルウェア関数
// ========================

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  try {
    // 静的ファイルやAPI以外のパスに対して国際化ミドルウェアを適用
    if (
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.includes('.') &&
      !pathname.startsWith('/favicon.ico')
    ) {
      // 国際化ミドルウェアを適用
      const intlResponse = intlMiddleware(request)

      if (intlResponse) {
        // 国際化によるリダイレクトまたはレスポンスがある場合
        // セキュリティヘッダーを追加
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
          intlResponse.headers.set(key, value)
        })

        // キャッシュコントロールを設定
        const cacheControl = getCacheControl(pathname)
        intlResponse.headers.set('Cache-Control', cacheControl)

        // Vary ヘッダーを設定
        intlResponse.headers.set('Vary', 'Accept-Encoding, Accept-Language')

        return intlResponse
      }
    }

    // 通常のレスポンス処理
    const response = NextResponse.next()

    // セキュリティヘッダーを設定
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // キャッシュコントロールを設定
    const cacheControl = getCacheControl(pathname)
    response.headers.set('Cache-Control', cacheControl)

    // Vary ヘッダーを設定（多言語対応）
    response.headers.set('Vary', 'Accept-Encoding, Accept-Language')

    return response

  } catch (error) {
    console.error('Middleware error:', error)

    // エラー時も基本的なセキュリティヘッダーは設定
    const response = NextResponse.next()
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }
}

// ========================
// ミドルウェア設定
// ========================

export const config = {
  matcher: [
    /*
     * 国際化とセキュリティヘッダーを適用するパス
     * Next.js 15 + next-intl対応（緊急修正版）
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ],
}