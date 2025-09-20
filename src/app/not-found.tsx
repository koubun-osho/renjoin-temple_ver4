/**
 * 蓮城院公式サイト - グローバル404ページ
 *
 * ルートレベルのnot-foundページ（多言語対応）
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body className="font-sans antialiased bg-bg-primary text-text-primary min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">ページが見つかりません</h2>
            <p className="text-text-secondary mb-8">
              お探しのページは存在しないか、移動された可能性があります。
            </p>
            <div className="space-y-4">
              <Link
                href="/ja"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                日本語サイトへ
              </Link>
              <br />
              <Link
                href="/en"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                English Site
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}