/**
 * 蓮城院公式サイト - 由緒セクション
 *
 * 蓮城院の歴史と教えを紹介するセクション。
 * 和モダンなレイアウトで寺院の由緒と教えを簡潔に説明。
 *
 * @created 2025-09-18
 * @version 1.0.0 MVP版
 * @task P3-04 - 由緒セクション実装
 */

import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ========================
// 型定義
// ========================

interface AboutSectionProps {
  title?: string
  introduction?: string
  history?: string
  teaching?: string
  detailsHref?: string
  image?: {
    src: string
    alt: string
  }
  className?: string
  children?: ReactNode
}

// ========================
// メインコンポーネント
// ========================

/**
 * 由緒セクション
 * 蓮城院の歴史と教えを和モダンなデザインで紹介
 */
export const AboutSection = ({
  title = '蓮城院について',
  introduction = '曹洞宗の教えのもと、地域の皆様と共に歩み続ける寺院です。',
  history = '蓮城院は古くからこの地に根ざし、地域の信仰の中心として多くの方々に親しまれてまいりました。歴代住職により受け継がれてきた伝統を大切にしながら、現代に生きる私たちに寄り添う仏教の教えを伝えています。',
  teaching = '曹洞宗の「只管打坐」の教えを基に、日々の生活の中で心の平安を見つけることの大切さをお伝えしています。どなたでもお気軽にお参りいただき、静寂の中で心を落ち着けていただけます。',
  detailsHref = '/about',
  image = {
    src: '/images/temple-main-hall.jpg',
    alt: '蓮城院本堂'
  },
  className = '',
  children
}: AboutSectionProps) => {
  return (
    <section className={`py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-amber-50/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-700 mb-6">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {introduction}
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 左側：テキストコンテンツ */}
          <div className="space-y-8">
            {/* 歴史について */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-primary-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
                歴史と伝統
              </h3>
              <p className="text-text-primary leading-relaxed text-sm sm:text-base">
                {history}
              </p>
            </div>

            {/* 教えについて */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-primary-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                教えと実践
              </h3>
              <p className="text-text-primary leading-relaxed text-sm sm:text-base">
                {teaching}
              </p>
            </div>

            {/* カスタムコンテンツ */}
            {children}

            {/* 詳細ページへのリンク */}
            <div className="pt-4">
              <Link
                href={detailsHref}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
              >
                <span>詳しい由緒を見る</span>
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* 右側：画像 */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* 画像オーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* 装飾要素 */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-60 -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-100 rounded-full opacity-40 -z-10" />

            {/* 和風装飾パターン */}
            <div className="absolute top-4 right-4 w-16 h-16 opacity-30">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>

        {/* 特徴ポイント */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeaturePoint
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            }
            title="曹洞宗の教え"
            description="只管打坐を基にした禅の実践を大切にしています"
          />
          <FeaturePoint
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            }
            title="地域との絆"
            description="古くから地域の皆様と共に歩んでまいりました"
          />
          <FeaturePoint
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            title="心の安らぎ"
            description="静寂の中で心を落ち着ける場所を提供しています"
          />
        </div>
      </div>
    </section>
  )
}

// ========================
// 特徴ポイントコンポーネント
// ========================

interface FeaturePointProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

/**
 * 特徴ポイント表示用コンポーネント
 */
const FeaturePoint = ({ icon, title, description, className = '' }: FeaturePointProps) => {
  return (
    <div className={`text-center group ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-lg mb-4 group-hover:bg-amber-200 transition-colors duration-200">
        {icon}
      </div>
      <h4 className="text-lg font-serif font-semibold text-primary-700 mb-2">
        {title}
      </h4>
      <p className="text-text-secondary text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}