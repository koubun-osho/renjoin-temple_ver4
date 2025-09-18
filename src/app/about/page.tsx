/**
 * 蓮城院公式サイト - 由緒・歴史ページ
 *
 * Sanity CMSから固定ページデータを取得し、和モダンなデザインで表示
 * XSS対策としてDOMPurifyでサニタイゼーション実装
 *
 * @path /about
 * @created 2025-09-18
 * @version 1.0.0 Phase 3実装
 */

import { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPages } from '../../../lib/sanity'
import { sanitizeText } from '../../../lib/sanitize'
import { generateSEOMetadata, StructuredData, generateBreadcrumbData } from '../../components/common/SEO'
import type { Page } from '../../../types/sanity'

// ISR設定：由緒ページは1日ごとに再生成（あまり変更しないため）
export const revalidate = 86400 // 1日（24時間）

// 静的生成の設定
export const dynamic = 'force-static'

// ページスラッグの定数
const PAGE_SLUG = 'about'

/**
 * フォールバック用のページデータ
 */
const fallbackPageData: Page = {
  _id: 'fallback-about',
  _type: 'page',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  title: '由緒・歴史',
  slug: { current: 'about', _type: 'slug' },
  body: [
    {
      _key: 'fallback-h2-1',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 'fallback-span-1', _type: 'span', text: '蓮城院の由緒' }]
    },
    {
      _key: 'fallback-normal-1',
      _type: 'block',
      style: 'normal',
      children: [{ _key: 'fallback-span-2', _type: 'span', text: '蓮城院は長い歴史を持つ由緒正しい寺院です。詳細な歴史については、現在データを準備中です。' }]
    },
    {
      _key: 'fallback-h2-2',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 'fallback-span-3', _type: 'span', text: '寺院の沿革' }]
    },
    {
      _key: 'fallback-normal-2',
      _type: 'block',
      style: 'normal',
      children: [{ _key: 'fallback-span-4', _type: 'span', text: '代々受け継がれてきた伝統と歴史を大切にし、地域の皆様とともに歩んでまいりました。' }]
    }
  ],
  metaDescription: '蓮城院の由緒と歴史についてご紹介します。'
}

/**
 * メタデータ生成関数（SEO対策）
 */
export async function generateMetadata(): Promise<Metadata> {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to generate metadata for about page:', error)
  }

  // フォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: メタデータもサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)
  const sanitizedDescription = finalPageData.metaDescription
    ? sanitizeText(finalPageData.metaDescription)
    : '蓮城院の由緒と歴史についてご紹介します。'

  return generateSEOMetadata({
    title: sanitizedTitle,
    description: sanitizedDescription,
    url: '/about',
    type: 'website',
    keywords: ['蓮城院', '由緒', '歴史', '曹洞宗', '寺院', '沿革'],
    canonical: '/about'
  })
}

/**
 * PortableTextのカスタムコンポーネント（セキュリティ強化）
 */
interface ImageValue {
  asset: { _ref: string }
  alt?: string
  caption?: string
}

interface LinkValue {
  href?: string
}

interface PortableTextComponentProps {
  children?: React.ReactNode
}

interface PortableTextLinkProps {
  children: React.ReactNode
  value?: LinkValue
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null

      const alt = value.alt ? sanitizeText(value.alt) : ''
      const caption = value.caption ? sanitizeText(value.caption) : ''

      return (
        <figure className="my-8">
          <Image
            src={`${value.asset._ref}`}
            alt={alt}
            width={800}
            height={600}
            className="w-full rounded-lg shadow-md"
            loading="lazy"
          />
          {caption && (
            <figcaption className="mt-2 text-sm text-gray-600 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }: PortableTextLinkProps) => {
      const href = value?.href
      if (!href) return <span>{children}</span>

      // URL安全性チェック
      const isExternal = href.startsWith('http')
      const isSecure = href.startsWith('https://') || href.startsWith('/')

      if (!isSecure && isExternal) {
        console.warn('Insecure external link blocked:', href)
        return <span>{children}</span>
      }

      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-amber-700 hover:text-amber-800 underline decoration-amber-200 hover:decoration-amber-300 transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps) => (
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6 border-b-2 border-amber-200 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }: PortableTextComponentProps) => (
      <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-800 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextComponentProps) => (
      <h3 className="text-xl md:text-2xl font-serif font-medium text-gray-700 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }: PortableTextComponentProps) => (
      <h4 className="text-lg md:text-xl font-serif font-medium text-gray-700 mb-2 mt-4">
        {children}
      </h4>
    ),
    normal: ({ children }: PortableTextComponentProps) => (
      <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }: PortableTextComponentProps) => (
      <blockquote className="border-l-4 border-amber-300 pl-6 py-2 my-6 italic text-gray-600 bg-amber-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: PortableTextComponentProps) => <li className="ml-4">{children}</li>,
    number: ({ children }: PortableTextComponentProps) => <li className="ml-4">{children}</li>,
  },
}

/**
 * パンくずリスト生成関数
 */
function generateBreadcrumbs() {
  return [
    { name: 'ホーム', url: '/' },
    { name: '由緒・歴史', url: '/about' }
  ]
}

/**
 * 由緒・歴史ページコンポーネント
 */
export default async function AboutPage() {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to fetch about page data:', error)
    // エラーの場合はフォールバックデータを使用
    pageData = null
  }

  // ページが見つからない場合はフォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: コンテンツをサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)

  return (
    <>
      {/* 構造化データ - パンくずリスト */}
      <StructuredData
        type="BreadcrumbList"
        data={generateBreadcrumbData(generateBreadcrumbs())}
      />

      <div className="min-h-screen bg-white">
      {/* ヘッダー部分 */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-4">
              {sanitizedTitle}
            </h1>
            <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            {/* PortableTextでコンテンツを安全に表示 */}
            <PortableText
              value={finalPageData.body}
              components={portableTextComponents}
            />
          </div>
        </div>

        {/* 装飾的な区切り */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-px bg-amber-300"></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <div className="w-12 h-px bg-amber-300"></div>
          </div>
        </div>

        {/* 関連リンク */}
        <div className="text-center">
          <div className="inline-flex space-x-6">
            <a
              href="/events"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 border-b border-transparent hover:border-amber-300"
            >
              年間行事
            </a>
            <a
              href="/contact"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 border-b border-transparent hover:border-amber-300"
            >
              お問い合わせ
            </a>
            <Link
              href="/blog"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 border-b border-transparent hover:border-amber-300"
            >
              副住職ブログ
            </Link>
          </div>
        </div>
      </main>
      </div>
    </>
  )
}