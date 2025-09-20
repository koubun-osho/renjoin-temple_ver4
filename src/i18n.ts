/**
 * 蓮城院公式サイト - 国際化設定
 *
 * next-intlライブラリを使用したNext.js 15対応の多言語システム
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// サポートする言語
export const locales = ['ja', 'en'] as const
export type Locale = typeof locales[number]

// デフォルトの言語
export const defaultLocale: Locale = 'ja'

// 言語の表示名
export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English'
} as const

// 言語の表示名（英語）
export const localeNamesEn: Record<Locale, string> = {
  ja: 'Japanese',
  en: 'English'
} as const

// ロケールが有効かどうかをチェック
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

// next-intlの設定
export default getRequestConfig(async ({ locale }) => {
  // 有効なロケールかチェック
  if (!locale || !isValidLocale(locale)) {
    notFound()
  }

  try {
    // 翻訳ファイルを動的インポート
    const messages = (await import(`../messages/${locale}.json`)).default

    return {
      locale,
      messages,
      // タイムゾーン設定（日本標準時をデフォルト）
      timeZone: locale === 'ja' ? 'Asia/Tokyo' : 'UTC',
      // 日付フォーマット設定
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          },
          long: {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }
        }
      }
    }
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error)
    notFound()
  }
})

// SEO用のhreflang設定
export const hrefLangConfig = {
  ja: 'ja-JP',
  en: 'en-US'
} as const

// ロケール別のパス設定
export const pathnames = {
  '/': '/',
  '/about': {
    ja: '/about',
    en: '/about'
  },
  '/news': {
    ja: '/news',
    en: '/news'
  },
  '/blog': {
    ja: '/blog',
    en: '/blog'
  },
  '/events': {
    ja: '/events',
    en: '/events'
  },
  '/contact': {
    ja: '/contact',
    en: '/contact'
  },
  '/privacy': {
    ja: '/privacy',
    en: '/privacy'
  },
  '/terms': {
    ja: '/terms',
    en: '/terms'
  }
} as const

export type Pathnames = typeof pathnames
export type PathKeys = keyof Pathnames