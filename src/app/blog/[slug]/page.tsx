/**
 * 蓮城院公式サイト - ブログ記事詳細ページ
 *
 * Sanityから個別ブログ記事を取得し、XSS対策を施して表示する
 * 和モダンなデザインでレスポンシブ対応済み
 *
 * Phase 2 Task P2-04: 個別記事ページ実装
 * Phase 2 Task P2-07: DOMPurify実装
 *
 * @created 2025-09-17
 * @version 1.0.0
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'
import { fetchBlogPosts } from '../../../../lib/sanity'
import BlogAnalytics from '@/components/blog/BlogAnalytics'
import { sanitizeText, sanitizeUrl, sanitizeImageUrl, sanitizePortableText } from '../../../../lib/sanitize'
import { generateSEOMetadata, StructuredData, generateBlogPostData, generateBreadcrumbData } from '../../../components/common/SEO'
import type { BlogPost } from '../../../../types/sanity'

// ISR設定：ブログ記事は1時間ごとに再生成
export const revalidate = 3600 // 1時間（3600秒）

// 動的ルートの設定
export const dynamic = 'force-static'
export const dynamicParams = true

// 静的パス生成（パフォーマンス最適化版）
export async function generateStaticParams() {
  try {
    const slugs = await fetchBlogPosts.slugs()

    // 本番環境では最初の20件のみビルド時に生成（パフォーマンス最適化）
    const limitedSlugs = process.env.NODE_ENV === 'production'
      ? slugs.slice(0, 20)
      : slugs

    return limitedSlugs.map((item) => ({
      slug: item.slug.current
    }))
  } catch (error) {
    console.error('Failed to generate static paths:', error)
    return []
  }
}

// メタデータ生成
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await fetchBlogPosts.detail(slug)

    if (!post) {
      return generateSEOMetadata({
        title: 'ページが見つかりません',
        description: '指定されたブログ記事が見つかりませんでした。',
        noindex: true
      })
    }

    const title = sanitizeText(post.title)
    const description = post.excerpt ? sanitizeText(post.excerpt) : '副住職・荒木弘文によるブログ記事'
    const ogImage = post.mainImage?.asset ?
      sanitizeImageUrl(`${post.mainImage.asset._ref}`) :
      '/images/og-image.jpg'

    return generateSEOMetadata({
      title,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      author: '荒木弘文',
      ogImage,
      ogImageAlt: post.mainImage?.alt ? sanitizeText(post.mainImage.alt) : title,
      keywords: ['蓮城院', 'ブログ', '副住職', '荒木弘文', '仏教', '曹洞宗', title.split(' ').slice(0, 3)].flat()
    })
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return generateSEOMetadata({
      title: 'エラーが発生しました',
      description: 'ページの読み込み中にエラーが発生しました。',
      noindex: true
    })
  }
}

// PortableText用カスタムコンポーネント
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-gray-700 leading-relaxed text-base md:text-lg">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 border-b-2 border-amber-200 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 mt-12">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base md:text-lg font-bold text-gray-900 mb-4 mt-6">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-300 pl-6 py-4 my-8 bg-amber-50 italic text-gray-800">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    number: ({ children }) => (
      <li className="ml-4">{children}</li>
    )
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = value?.href ? sanitizeUrl(value.href) : '#'

      // 無効なURLの場合はテキストのみ表示
      if (!href || href === '#') {
        return <span className="text-gray-600">{children}</span>
      }

      return href.startsWith('http') ? (
        <a
          href={href}
          className="text-amber-600 hover:text-amber-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-amber-600 hover:text-amber-700 underline decoration-2 underline-offset-2 transition-colors duration-200">
          {children}
        </Link>
      )
    }
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const imageUrl = sanitizeImageUrl(`${value.asset._ref}`)
      const alt = value.alt ? sanitizeText(value.alt) : '記事内画像'

      if (!imageUrl) return null

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-gray-600 text-center">
              {sanitizeText(value.caption)}
            </figcaption>
          )}
        </figure>
      )
    }
  }
}

// 日付フォーマット関数
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

// パンくずリスト生成関数
function generateBreadcrumbs(post: BlogPost) {
  return [
    { name: 'ホーム', url: '/' },
    { name: 'ブログ', url: '/blog' },
    { name: sanitizeText(post.title), url: `/blog/${post.slug.current}` }
  ]
}

// エラーフォールバック用コンポーネント
function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            記事の読み込みに失敗しました
          </h1>
          <p className="text-gray-600 mb-8">
            申し訳ございません。記事の読み込み中にエラーが発生しました。
          </p>
          <Link
            href="/blog"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

// メインページコンポーネント
export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const post = await fetchBlogPosts.detail(slug)

    if (!post) {
      notFound()
    }

    // サニタイゼーション処理
    const sanitizedPost = {
      ...post,
      title: sanitizeText(post.title),
      excerpt: post.excerpt ? sanitizeText(post.excerpt) : undefined,
      body: sanitizePortableText(post.body),
      mainImage: post.mainImage ? {
        ...post.mainImage,
        alt: post.mainImage.alt ? sanitizeText(post.mainImage.alt) : undefined
      } : undefined
    }

    return (
      <>
        {/* Google Analytics ブログ追跡 */}
        <BlogAnalytics
          postSlug={post.slug.current}
          postTitle={sanitizedPost.title}
          wordCount={post.body ? post.body.length * 2 : 0} // 概算文字数
        />

        {/* 構造化データ - ブログ記事 */}
        <StructuredData
          type="BlogPosting"
          data={generateBlogPostData({
            title: sanitizedPost.title,
            description: sanitizedPost.excerpt || '',
            publishedAt: post.publishedAt,
            slug: post.slug.current,
            author: '荒木弘文',
            mainImage: post.mainImage?.asset ? sanitizeImageUrl(`${post.mainImage.asset._ref}`) : undefined
          })}
        />

        {/* 構造化データ - パンくずリスト */}
        <StructuredData
          type="BreadcrumbList"
          data={generateBreadcrumbData(generateBreadcrumbs(post))}
        />

        <article className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
          {/* ヘッダー画像 */}
          {sanitizedPost.mainImage?.asset && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <Image
                src={sanitizeImageUrl(`${sanitizedPost.mainImage.asset._ref}`)}
                alt={sanitizedPost.mainImage.alt || sanitizedPost.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>
          )}

          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-4xl mx-auto">
              {/* パンくずナビ */}
              <nav className="mb-8 text-sm text-gray-600">
                <Link href="/" className="hover:text-amber-600 transition-colors">
                  ホーム
                </Link>
                <span className="mx-2">›</span>
                <Link href="/blog" className="hover:text-amber-600 transition-colors">
                  ブログ
                </Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900">
                  {sanitizedPost.title}
                </span>
              </nav>

              {/* 記事ヘッダー */}
              <header className="mb-12">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {sanitizedPost.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <time
                    dateTime={post.publishedAt}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                {/* 記事概要 */}
                {sanitizedPost.excerpt && (
                  <div className="bg-white bg-opacity-60 rounded-lg p-6 mb-8">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {sanitizedPost.excerpt}
                    </p>
                  </div>
                )}
              </header>

              {/* 記事本文 */}
              <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-6 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <PortableText
                    value={sanitizedPost.body as TypedObject[]}
                    components={portableTextComponents}
                  />
                </div>
              </div>

              {/* 記事フッター */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ブログ一覧に戻る
                  </Link>

                  {/* シェアボタン */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: sanitizedPost.title,
                            url: window.location.href
                          })
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
                      aria-label="記事をシェア"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </>
    )
  } catch (error) {
    console.error('Blog post rendering error:', error)
    return <ErrorFallback />
  }
}