/**
 * 蓮城院公式サイト - カードコンポーネント
 *
 * ブログ記事やお知らせ表示用のカードUI。
 * 和モダンなデザインでホバーエフェクトとリンク機能を提供。
 *
 * @created 2025-09-17
 * @version 1.0.0 MVP版
 * @task P2-06 - カードコンポーネント作成
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPostPreview, NewsItemPreview } from '../../../types/sanity'
import { getBlogImageUrl, isValidImage } from '../../../lib/sanity-image'

// ========================
// 基本カードコンポーネント
// ========================

interface BaseCardProps {
  title: string
  href: string
  date: string
  excerpt?: string
  category?: string
  image?: {
    src: string
    alt: string
  }
  className?: string
  children?: ReactNode
}

/**
 * 基本カードコンポーネント
 * 再利用可能なカード構造を提供
 */
export const Card = ({
  title,
  href,
  date,
  excerpt,
  category,
  image,
  className = '',
  children
}: BaseCardProps) => {
  return (
    <article className={`group relative overflow-hidden ${className}`}>
      <Link
        href={href}
        className="block transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
        aria-label={`「${title}」の詳細を読む`}
      >
        {/* 背景とボーダー */}
        <div className="relative h-full bg-white border border-gray-200 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300 min-h-[300px] flex flex-col">

          {/* 画像セクション */}
          {image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* 画像オーバーレイ（グラデーション） */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* コンテンツセクション */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            {/* カテゴリーと日付 */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-2 xs:gap-0 text-sm">
              {category && (
                <span className="inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 self-start">
                  {category}
                </span>
              )}
              <time
                dateTime={date}
                className={`text-gray-600 font-medium text-xs sm:text-sm ${category ? '' : 'ml-auto'}`}
              >
                {new Date(date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            {/* タイトル */}
            <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-900 mb-3 leading-tight group-hover:text-amber-800 transition-colors duration-200 line-clamp-2">
              {title}
            </h3>

            {/* 概要文 */}
            {excerpt && (
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3 flex-1">
                {excerpt}
              </p>
            )}

            {/* カスタムコンテンツ */}
            {children}

            {/* 続きを読むインディケーター */}
            <div className="mt-auto pt-3 flex items-center text-amber-700 text-xs sm:text-sm font-medium">
              <span>続きを読む</span>
              <svg
                className="ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* ホバー時の装飾線 */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:w-full transition-all duration-300" />
        </div>
      </Link>
    </article>
  )
}

// ========================
// ブログカード専用コンポーネント
// ========================

interface BlogCardProps {
  post: BlogPostPreview
  className?: string
}

/**
 * ブログ記事カード
 * BlogPostPreview型を受け取り、ブログ記事用にカスタマイズされたカードを表示
 */
export const BlogCard = ({ post, className = '' }: BlogCardProps) => {
  const imageData = (post.mainImage && isValidImage(post.mainImage)) ? {
    src: getBlogImageUrl(post.mainImage, 'medium'),
    alt: post.mainImage.alt || post.title
  } : undefined

  return (
    <Card
      title={post.title}
      href={`/blog/${post.slug.current}`}
      date={post.publishedAt}
      excerpt={post.excerpt}
      image={imageData}
      className={className}
    />
  )
}

// ========================
// お知らせカード専用コンポーネント
// ========================

interface NewsCardProps {
  news: NewsItemPreview
  className?: string
}

/**
 * お知らせカード
 * NewsItemPreview型を受け取り、お知らせ用にカスタマイズされたカードを表示
 */
export const NewsCard = ({ news, className = '' }: NewsCardProps) => {
  // カテゴリーのラベル変換
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'event': '行事案内',
      'notice': 'お知らせ',
      'service': '法要'
    }
    return categoryMap[category] || category
  }

  return (
    <Card
      title={news.title}
      href={`/news/${news.slug.current}`}
      date={news.publishedAt}
      category={getCategoryLabel(news.category)}
      className={className}
    />
  )
}

// ========================
// カードコンテナ（グリッド）
// ========================

interface CardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * カードグリッドコンテナ
 * レスポンシブなカードレイアウトを提供
 */
export const CardGrid = ({
  children,
  columns = 3,
  gap = 'md',
  className = ''
}: CardGridProps) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} auto-rows-fr ${className}`}>
      {children}
    </div>
  )
}

// ========================
// 特殊用途カード（拡張）
// ========================

interface FeatureCardProps {
  title: string
  description: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

/**
 * フィーチャーカード
 * 特別なコンテンツやアクション用のカード
 */
export const FeatureCard = ({
  title,
  description,
  icon,
  href,
  onClick,
  className = ''
}: FeatureCardProps) => {
  const content = (
    <div className={`group relative p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${className}`}>
      {/* アイコン */}
      {icon && (
        <div className="mb-3 sm:mb-4 text-amber-600">
          {icon}
        </div>
      )}

      {/* タイトル */}
      <h3 className="font-serif text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-amber-800 transition-colors duration-200">
        {title}
      </h3>

      {/* 説明文 */}
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* ホバー時の装飾線 */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:w-full transition-all duration-300" />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2">
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
      >
        {content}
      </button>
    )
  }

  return content
}

// ========================
// カードスケルトン（ローディング状態）
// ========================

interface CardSkeletonProps {
  showImage?: boolean
  className?: string
}

/**
 * カードスケルトン
 * データ読み込み中の表示用
 */
export const CardSkeleton = ({ showImage = true, className = '' }: CardSkeletonProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* 画像スケルトン */}
        {showImage && (
          <div className="aspect-[16/9] w-full bg-gray-300 rounded-t-lg" />
        )}

        {/* コンテンツスケルトン */}
        <div className="p-6">
          {/* カテゴリーと日付 */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 bg-gray-300 rounded-full w-16" />
            <div className="h-4 bg-gray-300 rounded w-20" />
          </div>

          {/* タイトル */}
          <div className="h-6 bg-gray-300 rounded mb-3 w-4/5" />

          {/* 概要文 */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </div>

          {/* 続きを読むリンク */}
          <div className="mt-4 h-4 bg-gray-300 rounded w-24" />
        </div>
      </div>
    </div>
  )
}