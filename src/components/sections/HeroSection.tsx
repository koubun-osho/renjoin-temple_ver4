/**
 * 蓮城院公式サイト - ヒーローセクション
 *
 * トップページのメインビジュアルセクション。
 * 境内写真を背景に縦書きキャッチコピーを配置した和モダンなデザイン。
 *
 * @created 2025-09-18
 * @version 1.0.0 MVP版
 * @task P3-03 - ヒーローセクション実装
 */

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ========================
// 型定義
// ========================

interface HeroSectionProps {
  backgroundImage?: {
    src: string
    alt: string
  }
  title?: string
  subtitle?: string
  description?: string
  children?: ReactNode
  className?: string
}

// ========================
// メインコンポーネント
// ========================

/**
 * ヒーローセクション
 * 境内写真を背景に和モダンなレイアウトでキャッチコピーを表示
 */
export const HeroSection = ({
  backgroundImage = {
    src: '/images/temple-hero.jpg',
    alt: '蓮城院境内の風景'
  },
  title = '蓮城院',
  subtitle = '千年の祈り、永遠の安らぎ',
  description = '曹洞宗の寺院として、地域の皆様と共に歩み続けています。\n副住職・荒木弘文のブログも掲載しております。',
  children,
  className = ''
}: HeroSectionProps) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        {/* オーバーレイグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        {/* 和風パターンオーバーレイ */}
        <div className="absolute inset-0 bg-[url('/images/pattern-seigaiha.svg')] opacity-10" />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 寺院名 */}
          <h1 className="mb-6 sm:mb-8 animate-fade-in">
            {/* デスクトップ版：縦書き */}
            <span className="hidden md:block text-6xl lg:text-8xl xl:text-9xl font-serif font-bold text-white drop-shadow-2xl writing-mode-vertical text-orientation-mixed leading-loose tracking-wider">
              {title}
            </span>
            {/* タブレット版：横書き大 */}
            <span className="hidden sm:block md:hidden text-6xl lg:text-7xl font-serif font-bold text-white drop-shadow-2xl">
              {title}
            </span>
            {/* モバイル版：横書き */}
            <span className="block sm:hidden text-4xl xs:text-5xl font-serif font-bold text-white drop-shadow-2xl">
              {title}
            </span>
          </h1>

          {/* キャッチコピー */}
          <div className="mb-8 sm:mb-12 animate-fade-in-delay-1">
            {/* デスクトップ版：縦書き */}
            <p className="hidden md:block text-xl lg:text-2xl xl:text-3xl font-serif text-white/90 drop-shadow-lg writing-mode-vertical text-orientation-mixed leading-relaxed tracking-wide mx-auto max-w-md">
              {subtitle}
            </p>
            {/* タブレット版：横書き大 */}
            <p className="hidden sm:block md:hidden text-xl font-serif text-white/90 drop-shadow-lg leading-relaxed">
              {subtitle}
            </p>
            {/* モバイル版：横書き */}
            <p className="block sm:hidden text-base xs:text-lg font-serif text-white/90 drop-shadow-lg leading-relaxed px-2">
              {subtitle}
            </p>
          </div>

          {/* 説明文 */}
          <div className="mb-12 sm:mb-16 animate-fade-in-delay-2">
            <div className="max-w-2xl mx-auto px-2 sm:px-0">
              {description.split('\n').map((line, index) => (
                <p
                  key={index}
                  className="text-sm xs:text-base sm:text-lg text-white/80 drop-shadow-md leading-relaxed mb-2 sm:mb-3 last:mb-0"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* カスタムコンテンツ */}
          {children && (
            <div className="animate-fade-in-delay-3">
              {children}
            </div>
          )}

          {/* スクロールインジケーター */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white/70">
              <span className="text-xs mb-1 sm:mb-2 font-medium">下にスクロール</span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 装飾要素 */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {/* 上部装飾 */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent" />
        {/* 下部装飾 */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />

        {/* 左右の装飾線 */}
        <div className="absolute top-1/4 left-4 sm:left-8 w-px h-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden md:block" />
        <div className="absolute top-1/4 right-4 sm:right-8 w-px h-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden md:block" />
      </div>
    </section>
  )
}

// ========================
// ヒーロー内コンテンツ用コンポーネント
// ========================

interface HeroButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

/**
 * ヒーロー内で使用するボタンコンポーネント
 */
export const HeroButton = ({
  href,
  children,
  variant = 'primary',
  className = ''
}: HeroButtonProps) => {
  const baseClasses = "inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation"

  const variantClasses = {
    primary: "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 text-white border border-white/30 hover:bg-white/20 focus:ring-white backdrop-blur-sm"
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}

// ========================
// アニメーション用CSS（globals.cssに追加する必要あり）
// ========================

export const heroAnimationCSS = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out;
  }

  .animate-fade-in-delay-1 {
    animation: fade-in 1s ease-out 0.3s both;
  }

  .animate-fade-in-delay-2 {
    animation: fade-in 1s ease-out 0.6s both;
  }

  .animate-fade-in-delay-3 {
    animation: fade-in 1s ease-out 0.9s both;
  }
`