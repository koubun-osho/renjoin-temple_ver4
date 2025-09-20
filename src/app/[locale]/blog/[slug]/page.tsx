/**
 * 蓮城院公式サイト - ブログ記事詳細（多言語対応）
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Locale } from '@/i18n'

interface BlogPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: `${t('title')} - ${slug}`,
    description: t('subtitle'),
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params // eslint-disable-line @typescript-eslint/no-unused-vars

  // TODO: Sanityからブログ記事を取得
  // 現在は404を返す
  notFound()

  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          <header className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-primary-700 mb-6">
              ブログ記事タイトル
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
          </header>

          <div className="prose prose-lg max-w-none">
            <p>ブログ記事の内容がここに表示されます。</p>
          </div>
        </article>
      </div>
    </div>
  )
}