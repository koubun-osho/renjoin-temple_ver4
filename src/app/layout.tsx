/**
 * 蓮城院公式サイト - ルートレイアウト（Next.js 15 + next-intl対応版）
 *
 * next-intlのミドルウェアによる自動リダイレクトに依存
 * ルートレイアウトでは何も処理しない
 *
 * @created 2025-09-20
 * @version 2.2.0 - ミドルウェア依存版
 */

import { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

// ミドルウェアでリダイレクトが処理されるため
// このレイアウトが直接レンダリングされることはない想定
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
