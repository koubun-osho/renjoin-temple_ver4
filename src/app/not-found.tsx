/**
 * 蓮城院公式サイト - グローバル404ページ
 *
 * ルートレベルのnot-foundページ（多言語対応）
 * Next.js Linkコンポーネントを使用
 *
 * @created 2025-09-20
 * @version 1.2.0 - Next.js Link対応版
 */

'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalNotFound() {
  // CSSを動的に挿入してスタイリングを確実に適用
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', sans-serif !important;
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important;
        color: #1f2937 !important;
        min-height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .not-found-container {
        text-align: center;
        max-width: 480px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }

      .not-found-error-code {
        font-size: 4rem;
        font-weight: bold;
        color: #dc2626;
        margin-bottom: 1rem;
      }

      .not-found-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #1f2937;
      }

      .not-found-description {
        color: #6b7280;
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .not-found-links {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .not-found-link {
        display: inline-block !important;
        background: #1e40af !important;
        color: white !important;
        padding: 12px 24px !important;
        border-radius: 8px !important;
        text-decoration: none !important;
        font-weight: 500 !important;
        transition: background-color 0.2s ease !important;
      }

      .not-found-link:hover {
        background: #1d4ed8 !important;
        color: white !important;
      }

      .not-found-link:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 - ページが見つかりません | 蓮城院</title>
      </head>
      <body>
        <div className="not-found-container">
          <h1 className="not-found-error-code">404</h1>
          <h2 className="not-found-title">ページが見つかりません</h2>
          <p className="not-found-description">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <div className="not-found-links">
            <Link href="/ja" className="not-found-link">
              日本語サイトへ
            </Link>
            <Link href="/en" className="not-found-link">
              English Site
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}