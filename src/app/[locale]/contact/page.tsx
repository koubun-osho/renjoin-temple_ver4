/**
 * 蓮城院公式サイト - お問い合わせ（多言語対応）
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
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params // eslint-disable-line @typescript-eslint/no-unused-vars
  const t = await getTranslations('contact')

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

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-primary-600 mb-6">
              {t('info.address')}
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>〒321-4502</p>
              <p>栃木県真岡市物井102</p>
              <p>{t('info.phone')}: 0285-75-0401</p>
              <p>{t('info.email')}: koubun0218@gmail.com</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-primary-600 mb-6">
              {t('form.message')}
            </h2>
            <p className="text-text-secondary">
              お問い合わせフォームは準備中です。
              お急ぎの場合は直接お電話またはメールでご連絡ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}