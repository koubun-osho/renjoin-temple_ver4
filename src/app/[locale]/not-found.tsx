/**
 * 蓮城院公式サイト - ローカライズ404ページ
 *
 * 多言語対応の404ページ
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function LocaleNotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {t('title')}
        </h2>
        <p className="text-text-secondary mb-8">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  )
}