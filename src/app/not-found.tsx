/**
 * 蓮城院公式サイト - グローバル404ページ
 *
 * ルートレベルのnot-foundページ（多言語対応）
 * Server Component（完全HTML版）
 *
 * @created 2025-09-20
 * @version 2.0.0 - Server Component版（JavaScript不要）
 */

/* eslint-disable @next/next/no-html-link-for-pages */
export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 - ページが見つかりません | 蓮城院</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', sans-serif;
              background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .container {
              text-align: center;
              max-width: 480px;
              margin: 0 auto;
              padding: 2rem;
              background: white;
              border-radius: 16px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }

            .error-code {
              font-size: 4rem;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 1rem;
            }

            .title {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: #1f2937;
            }

            .description {
              color: #6b7280;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .links {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .link {
              background: #1e40af;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              display: block;
              text-align: center;
              font-weight: 500;
              transition: background-color 0.2s ease;
            }

            .link:hover {
              background: #1d4ed8;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <h1 className="error-code">404</h1>
          <h2 className="title">ページが見つかりません</h2>
          <p className="description">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <div className="links">
            <a href="/ja" className="link">
              日本語サイトへ
            </a>
            <a href="/en" className="link">
              English Site
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}