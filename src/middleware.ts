/**
 * 蓮城院公式サイト - Next.js ミドルウェア
 *
 * セキュリティヘッダーとキャッシュ最適化（Next.js 15対応版）
 *
 * @created 2025-09-18
 * @version 2.0.0 Next.js 15 Compatible版
 * @task P4-04 - パフォーマンス最適化
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
// メインミドルウェア関数
// ========================

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const pathname = request.nextUrl.pathname

    // セキュリティヘッダーを設定
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // キャッシュコントロールを設定
    const cacheControl = getCacheControl(pathname)
    response.headers.set('Cache-Control', cacheControl)

    // Vary ヘッダーを設定（圧縮対応）
    response.headers.set('Vary', 'Accept-Encoding')

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
     * 重要なページとAPIに限定してミドルウェアを適用
     * Next.js 15対応のため、範囲を限定
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}