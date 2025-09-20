/**
 * 蓮城院公式サイト - 寺院について（多言語対応）
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
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params // eslint-disable-line @typescript-eslint/no-unused-vars
  const t = await getTranslations('about')

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

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-600 mb-4">
              {t('history')}
            </h3>
            <p className="text-text-secondary">
              蓮城院の長い歴史と伝統について
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-600 mb-4">
              {t('teachings')}
            </h3>
            <p className="text-text-secondary">
              曹洞宗の教えと日々の実践について
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-600 mb-4">
              {t('facilities')}
            </h3>
            <p className="text-text-secondary">
              境内の施設と設備のご案内
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}