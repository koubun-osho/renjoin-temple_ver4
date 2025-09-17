/**
 * 蓮城院公式サイト - 利用規約ページ
 *
 * Sanity CMSから固定ページデータを取得し、和モダンなデザインで表示
 * XSS対策としてDOMPurifyでサニタイゼーション実装
 *
 * @path /terms
 * @created 2025-09-18
 * @version 1.0.0 Phase 3実装
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPages } from '../../../lib/sanity'
import { sanitizeText } from '../../../lib/sanitize'
import type { Page } from '../../../types/sanity'

// ページスラッグの定数
const PAGE_SLUG = 'terms'

/**
 * フォールバック用のページデータ
 */
const fallbackPageData = {
  title: '利用規約',
  body: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'サイトの利用について' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: '蓮城院公式サイトをご利用いただく際は、以下の利用規約を遵守していただくようお願いいたします。' }]
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: '著作権について' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: '本サイトのコンテンツは著作権法により保護されています。無断転載、複製は禁止されています。' }]
    }
  ],
  metaDescription: '蓮城院公式サイトの利用規約です。'
}

/**
 * メタデータ生成関数（SEO対策）
 */
export async function generateMetadata(): Promise<Metadata> {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to generate metadata for terms page:', error)
  }

  // フォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: メタデータもサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)
  const sanitizedDescription = finalPageData.metaDescription
    ? sanitizeText(finalPageData.metaDescription)
    : '蓮城院公式サイトの利用規約です。'

  return {
    title: `${sanitizedTitle} | 蓮城院`,
    description: sanitizedDescription,
    robots: 'noindex, follow', // 利用規約は検索結果に表示しない
    openGraph: {
      title: `${sanitizedTitle} | 蓮城院`,
      description: sanitizedDescription,
      type: 'website',
      locale: 'ja_JP',
    },
  }
}

/**
 * PortableTextのカスタムコンポーネント（法的文書用）
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
        <figure className="my-6">
          <Image
            src={`${value.asset._ref}`}
            alt={alt}
            width={800}
            height={600}
            className="w-full rounded-lg shadow-sm border border-gray-200"
            loading="lazy"
          />
          {caption && (
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
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
          className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-300 transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps) => (
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: PortableTextComponentProps) => (
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextComponentProps) => (
      <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }: PortableTextComponentProps) => (
      <h4 className="text-base md:text-lg font-medium text-gray-700 mb-2 mt-4">
        {children}
      </h4>
    ),
    normal: ({ children }: PortableTextComponentProps) => (
      <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
        {children}
      </p>
    ),
    blockquote: ({ children }: PortableTextComponentProps) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-600 bg-gray-50 rounded-r">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 text-sm md:text-base">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 text-sm md:text-base">
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
 * 利用規約ページコンポーネント
 */
export default async function TermsPage() {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to fetch terms page data:', error)
    // エラーの場合はフォールバックデータを使用
    pageData = null
  }

  // ページが見つからない場合はフォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: コンテンツをサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー部分 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {sanitizedTitle}
            </h1>
            <p className="text-gray-600 text-sm">
              最終更新日: {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {/* 注意書き */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  重要事項
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    本サイトをご利用いただく前に、以下の利用規約を必ずお読みください。
                    本サイトをご利用いただいた時点で、これらの規約に同意したものとみなします。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="prose prose-sm md:prose-base max-w-none">
            {/* PortableTextでコンテンツを安全に表示 */}
            <PortableText
              value={finalPageData.body}
              components={portableTextComponents}
            />
          </div>

          {/* 連絡先情報 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              お問い合わせ
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              本利用規約に関するご質問やお問い合わせは、以下よりご連絡ください。
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              お問い合わせページへ
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* 関連リンク */}
        <div className="text-center mt-8">
          <div className="inline-flex space-x-6 text-sm">
            <a
              href="/privacy"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 border-b border-transparent hover:border-gray-300"
            >
              プライバシーポリシー
            </a>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200 border-b border-transparent hover:border-gray-300"
            >
              トップページ
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}