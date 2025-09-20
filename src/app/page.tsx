/**
 * 蓮城院公式サイト - ルートページ（リダイレクト専用）
 *
 * next-intl + Next.js 15対応版
 * デフォルトロケール(/ja)へのリダイレクト処理
 *
 * @created 2025-09-20
 * @version 2.0.0
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  // ルートアクセス時はデフォルトロケールにリダイレクト
  redirect('/ja')
}
