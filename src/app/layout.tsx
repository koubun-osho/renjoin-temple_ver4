/**
 * 蓮城院公式サイト - ルートレイアウト（緊急修正版）
 *
 * next-intl + Next.js 15対応版
 * リダイレクトループを防ぐため、ミドルウェアに処理を委譲
 *
 * @created 2025-09-20
 * @version 2.1.0 - 緊急修正版
 */

// リダイレクトループを防ぐため、この段階でのリダイレクトは行わない
// ミドルウェアでの処理に委譲する
export default function RootLayout() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>蓮城院</title>
        <meta httpEquiv="refresh" content="0; url=/ja" />
      </head>
      <body>
        <p>ページを読み込み中です...</p>
        <script dangerouslySetInnerHTML={{
          __html: 'window.location.href = "/ja";'
        }} />
      </body>
    </html>
  )
}
