/**
 * 蓮城院公式サイト - プライバシーポリシー（多言語対応）
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import type { Locale } from '@/i18n'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return {
    title: locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy',
    description: locale === 'ja'
      ? '蓮城院のプライバシーポリシーについて'
      : 'Renjoin Temple Privacy Policy',
  }
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary-700 mb-6">
            {locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
        </div>

        <div className="prose prose-lg max-w-none">
          {locale === 'ja' ? (
            <div className="space-y-6 text-text-secondary">
              <p>蓮城院（以下「当寺院」）では、お客様の個人情報の保護に努めております。</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                個人情報の収集について
              </h2>
              <p>当寺院では、お問い合わせの際に必要最小限の個人情報をお聞きする場合があります。</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                個人情報の利用目的
              </h2>
              <p>収集した個人情報は、お問い合わせへの回答および寺院運営に関する連絡のみに使用いたします。</p>
            </div>
          ) : (
            <div className="space-y-6 text-text-secondary">
              <p>Renjoin Temple (&quot;we&quot; or &quot;our temple&quot;) is committed to protecting your personal information.</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                Collection of Personal Information
              </h2>
              <p>We may collect minimal personal information when you contact us through our inquiry form.</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                Use of Personal Information
              </h2>
              <p>Personal information collected is used solely for responding to inquiries and temple-related communications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}