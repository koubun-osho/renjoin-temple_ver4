/**
 * 蓮城院公式サイト - 利用規約（多言語対応）
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
    title: locale === 'ja' ? '利用規約' : 'Terms of Service',
    description: locale === 'ja'
      ? '蓮城院サイトの利用規約について'
      : 'Renjoin Temple website terms of service',
  }
}

export default async function TermsPage({
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
            {locale === 'ja' ? '利用規約' : 'Terms of Service'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
        </div>

        <div className="prose prose-lg max-w-none">
          {locale === 'ja' ? (
            <div className="space-y-6 text-text-secondary">
              <p>蓮城院公式サイト（以下「当サイト」）をご利用いただき、ありがとうございます。</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                サイトの利用について
              </h2>
              <p>当サイトの情報は、正確性を期すよう努めておりますが、内容について保証するものではありません。</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                著作権について
              </h2>
              <p>当サイトに掲載されている文章、画像等の著作権は蓮城院に帰属します。</p>
            </div>
          ) : (
            <div className="space-y-6 text-text-secondary">
              <p>Thank you for visiting the official website of Renjoin Temple (&quot;this site&quot;).</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                Use of This Site
              </h2>
              <p>While we strive for accuracy, we do not guarantee the content of this site.</p>

              <h2 className="text-2xl font-semibold text-primary-600 mt-8 mb-4">
                Copyright
              </h2>
              <p>All content including text and images on this site are copyrighted by Renjoin Temple.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}