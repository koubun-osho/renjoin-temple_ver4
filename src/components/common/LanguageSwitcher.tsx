/**
 * 蓮城院公式サイト - 言語切り替えコンポーネント
 *
 * 多言語対応のための言語切り替え機能
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { locales, localeNames, localeNamesEn, type Locale } from '@/i18n'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'dropdown' | 'buttons'
}

export default function LanguageSwitcher({
  className = '',
  variant = 'dropdown'
}: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale
  const t = useTranslations('language')
  const [isOpen, setIsOpen] = useState(false)

  // 現在のパスからロケールを除いたパスを取得
  const getPathWithoutLocale = (path: string): string => {
    const segments = path.split('/')
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      return '/' + segments.slice(2).join('/')
    }
    return path
  }

  // 言語を切り替える
  const switchLanguage = (newLocale: Locale) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname)
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  // 現在の言語以外の言語を取得
  const otherLocales = locales.filter(locale => locale !== currentLocale)

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
              ${currentLocale === locale
                ? 'bg-primary-600 text-white'
                : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'
              }
            `}
            aria-label={`${t('switchTo')} ${localeNames[locale]}`}
            disabled={currentLocale === locale}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('switchTo')}
      >
        {/* 言語アイコン */}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>

        {/* 現在の言語表示 */}
        <span className="hidden sm:inline">
          {currentLocale === 'ja' ? localeNames[currentLocale] : localeNamesEn[currentLocale]}
        </span>
        <span className="sm:hidden">
          {currentLocale.toUpperCase()}
        </span>

        {/* ドロップダウンアイコン */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* メニュー */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {otherLocales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => switchLanguage(locale)}
                  className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  role="menuitem"
                  aria-label={`${t('switchTo')} ${localeNames[locale]}`}
                >
                  {/* 言語フラグ風のアイコン */}
                  <span className="mr-3 text-xs font-bold text-gray-400">
                    {locale.toUpperCase()}
                  </span>

                  {/* 言語名 */}
                  <span>
                    {currentLocale === 'ja' ? localeNames[locale] : localeNamesEn[locale]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Lightweight version for mobile menu
export function MobileLanguageSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale() as Locale
  const t = useTranslations('language')

  const getPathWithoutLocale = (path: string): string => {
    const segments = path.split('/')
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      return '/' + segments.slice(2).join('/')
    }
    return path
  }

  const switchLanguage = (newLocale: Locale) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname)
    const newPath = `/${newLocale}${pathWithoutLocale}`
    router.push(newPath)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-text-secondary px-4">
        {t('switchTo')}
      </p>
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLanguage(locale)}
          className={`
            flex items-center w-full px-4 py-3 text-left transition-colors duration-200
            ${currentLocale === locale
              ? 'bg-primary-50 text-primary-600 font-medium'
              : 'text-text-secondary hover:bg-gray-50 hover:text-primary-600'
            }
          `}
          disabled={currentLocale === locale}
        >
          <span className="mr-3 text-sm font-bold">
            {locale.toUpperCase()}
          </span>
          <span>
            {currentLocale === 'ja' ? localeNames[locale] : localeNamesEn[locale]}
          </span>
          {currentLocale === locale && (
            <svg
              className="ml-auto w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}