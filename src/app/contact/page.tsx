/**
 * 蓮城院公式サイト - お問い合わせページ
 *
 * メールアドレスと電話番号の記載のみのシンプルなお問い合わせページ
 * Sanity CMSから固定ページデータを取得し、和モダンなデザインで表示
 * XSS対策としてDOMPurifyでサニタイゼーション実装
 *
 * @path /contact
 * @created 2025-09-18
 * @version 1.0.0 Phase 3実装
 */

import { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPages } from '../../../lib/sanity'
import { sanitizeText } from '../../../lib/sanitize'
import type { Page } from '../../../types/sanity'

// ISR設定：お問い合わせページは1日ごとに再生成
export const revalidate = 86400 // 1日（24時間）

// 静的生成の設定
export const dynamic = 'force-static'

// ページスラッグの定数
const PAGE_SLUG = 'contact'

/**
 * フォールバック用のページデータ
 */
const fallbackPageData: Page = {
  _id: 'fallback-contact',
  _type: 'page',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  title: 'お問い合わせ',
  slug: { current: 'contact', _type: 'slug' },
  body: [
    {
      _key: 'fallback-h2-1',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 'fallback-span-1', _type: 'span', text: 'お問い合わせについて' }]
    },
    {
      _key: 'fallback-normal-1',
      _type: 'block',
      style: 'normal',
      children: [{ _key: 'fallback-span-2', _type: 'span', text: 'ご不明な点やご相談がございましたら、お気軽にお問い合わせください。法要や行事に関するご質問も承っております。' }]
    },
    {
      _key: 'fallback-h2-2',
      _type: 'block',
      style: 'h2',
      children: [{ _key: 'fallback-span-3', _type: 'span', text: 'お急ぎの場合' }]
    },
    {
      _key: 'fallback-normal-2',
      _type: 'block',
      style: 'normal',
      children: [{ _key: 'fallback-span-4', _type: 'span', text: 'お急ぎの場合は、お電話でのご連絡をお願いいたします。' }]
    }
  ],
  metaDescription: '蓮城院へのお問い合わせ方法をご案内します。'
}

/**
 * メタデータ生成関数（SEO対策）
 */
export async function generateMetadata(): Promise<Metadata> {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to generate metadata for contact page:', error)
  }

  // フォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: メタデータもサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)
  const sanitizedDescription = finalPageData.metaDescription
    ? sanitizeText(finalPageData.metaDescription)
    : '蓮城院へのお問い合わせ方法をご案内します。'

  return {
    title: `${sanitizedTitle} | 蓮城院`,
    description: sanitizedDescription,
    openGraph: {
      title: `${sanitizedTitle} | 蓮城院`,
      description: sanitizedDescription,
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary',
      title: `${sanitizedTitle} | 蓮城院`,
      description: sanitizedDescription,
    },
  }
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
      const isSecure = href.startsWith('https://') || href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:')

      if (!isSecure && isExternal) {
        console.warn('Insecure external link blocked:', href)
        return <span>{children}</span>
      }

      return (
        <a
          href={href}
          target={isExternal && !href.startsWith('mailto:') && !href.startsWith('tel:') ? '_blank' : undefined}
          rel={isExternal && !href.startsWith('mailto:') && !href.startsWith('tel:') ? 'noopener noreferrer' : undefined}
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
 * お問い合わせページコンポーネント
 */
export default async function ContactPage() {
  let pageData: Page | null = null

  try {
    pageData = await fetchPages.detail(PAGE_SLUG)
  } catch (error) {
    console.error('Failed to fetch contact page data:', error)
    // エラーの場合はフォールバックデータを使用
    pageData = null
  }

  // ページが見つからない場合はフォールバックデータを使用
  const finalPageData = pageData || fallbackPageData

  // XSS対策: コンテンツをサニタイズ
  const sanitizedTitle = sanitizeText(finalPageData.title)

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー部分 */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-4">
              {sanitizedTitle}
            </h1>
            <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ご不明な点やご相談がございましたら、お気軽にお問い合わせください
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 連絡先情報 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 電話でのお問い合わせ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">
                お電話でのお問い合わせ
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-amber-700 mb-1">
                    <a href="tel:0285-75-0401" className="hover:text-amber-800 transition-colors">
                      0285-75-0401
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    受付時間: 9:00 - 17:00（年中無休）
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* メールでのお問い合わせ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3">
                メールでのお問い合わせ
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-medium text-amber-700 mb-1">
                    <a href="mailto:koubun0218@gmail.com" className="hover:text-amber-800 transition-colors">
                      koubun0218@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    お返事まで2-3営業日いただく場合があります
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CMSコンテンツ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            {/* PortableTextでコンテンツを安全に表示 */}
            <PortableText
              value={finalPageData.body}
              components={portableTextComponents}
            />
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                お問い合わせの際のお願い
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>法要や行事に関するお問い合わせは、お電話でご連絡いただくと迅速に対応できます</li>
                  <li>メールでのお問い合わせの場合、お名前とご連絡先を必ずご記載ください</li>
                  <li>お急ぎの場合は、お電話でのご連絡をお願いいたします</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 装飾的な区切り */}
        <div className="flex justify-center mb-8">
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
              href="/about"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 border-b border-transparent hover:border-amber-300"
            >
              由緒・歴史
            </a>
            <a
              href="/events"
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200 border-b border-transparent hover:border-amber-300"
            >
              年間行事
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
  )
}