/**
 * 蓮城院公式サイト - グローバル型定義
 *
 * next-intlとその他のグローバル型定義
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import type en from '../../messages/en.json'

// next-intlの型定義
type Messages = typeof en

declare global {
  // Using type safe message keys with `next-intl`
  interface IntlMessages extends Messages {
    // 追加のメッセージプロパティがある場合はここで定義
    [key: string]: unknown
  }
}

export {}