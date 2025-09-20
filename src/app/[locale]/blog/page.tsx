/**
 * 蓮城院公式サイト - ブログ（多言語対応）
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params // eslint-disable-line @typescript-eslint/no-unused-vars
  const t = await getTranslations('blog')

  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary-700 mb-6">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="text-center py-20">
          <p className="text-text-muted text-lg">
            {t('noBlog')}
          </p>
        </div>
      </div>
    </div>
  )
}