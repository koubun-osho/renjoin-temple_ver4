/**
 * 蓮城院公式サイト - アクセスセクション
 *
 * 地図表示と交通案内を含むアクセス情報セクション。
 * Google Mapsの埋め込み、住所、電話番号、交通手段を表示。
 *
 * @created 2025-09-18
 * @version 1.0.0 MVP版
 * @task P3-06 - アクセスセクション実装
 */

import { ReactNode } from 'react'
import Link from 'next/link'

// ========================
// 型定義
// ========================

interface AccessSectionProps {
  title?: string
  address?: {
    postal: string
    prefecture: string
    city: string
    street: string
    building?: string
  }
  phone?: string
  email?: string
  mapEmbedUrl?: string
  transportation?: TransportationItem[]
  parkingInfo?: string
  className?: string
  children?: ReactNode
}

interface TransportationItem {
  type: 'train' | 'bus' | 'car'
  description: string
  time?: string
  icon?: ReactNode
}

interface ContactItemProps {
  icon: ReactNode
  label: string
  value: string
  href?: string
  className?: string
}

// ========================
// メインコンポーネント
// ========================

/**
 * アクセスセクション
 * Google Maps埋め込み、住所、交通案内を和モダンなデザインで表示
 */
export const AccessSection = ({
  title = 'アクセス',
  address = {
    postal: '〒123-4567',
    prefecture: '○○県',
    city: '○○市',
    street: '○○町1-2-3',
    building: ''
  },
  phone = '012-345-6789',
  email = 'info@renjoin.jp',
  mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8281839316845!2d139.7670516!3d35.6812362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQwJzUyLjQiTiAxMznCsDQ2JzAxLjQiRQ!5e0!3m2!1sja!2sjp!4v1609459200000!5m2!1sja!2sjp',
  transportation = [
    {
      type: 'train',
      description: 'JR○○線「○○駅」より徒歩10分',
      time: '徒歩10分'
    },
    {
      type: 'bus',
      description: '市営バス「○○寺前」バス停より徒歩3分',
      time: '徒歩3分'
    },
    {
      type: 'car',
      description: '○○インターチェンジより車で15分',
      time: '車で15分'
    }
  ],
  parkingInfo = '境内に無料駐車場（10台）をご用意しております。',
  className = '',
  children
}: AccessSectionProps) => {
  // 完全な住所文字列を生成
  const fullAddress = `${address.postal} ${address.prefecture}${address.city}${address.street}${address.building ? ' ' + address.building : ''}`

  return (
    <section className={`py-16 lg:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-700 mb-6">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            蓮城院へのアクセスのご案内です。お気軽にお越しください。
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* 左側：地図 */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="aspect-[4/3] w-full">
                <iframe
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="蓮城院の地図"
                />
              </div>
              {/* 地図オーバーレイ */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                <p className="text-sm font-medium text-gray-800">蓮城院</p>
              </div>
            </div>

            {/* 駐車場情報 */}
            {parkingInfo && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800">駐車場のご案内</h4>
                    <p className="mt-1 text-sm text-amber-700">{parkingInfo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右側：アクセス情報 */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* 基本情報 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-primary-700 mb-6">
                基本情報
              </h3>
              <div className="space-y-4">
                <ContactItem
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  }
                  label="所在地"
                  value={fullAddress}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                />
                <ContactItem
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  }
                  label="電話番号"
                  value={phone}
                  href={`tel:${phone.replace(/-/g, '')}`}
                />
                <ContactItem
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  }
                  label="メールアドレス"
                  value={email}
                  href={`mailto:${email}`}
                />
              </div>
            </div>

            {/* 交通案内 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-primary-700 mb-6">
                交通案内
              </h3>
              <div className="space-y-4">
                {transportation.map((item, index) => (
                  <TransportationItem
                    key={index}
                    type={item.type}
                    description={item.description}
                    time={item.time}
                  />
                ))}
              </div>
            </div>

            {/* カスタムコンテンツ */}
            {children}

            {/* お問い合わせボタン */}
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========================
// サブコンポーネント
// ========================

/**
 * 連絡先情報アイテム
 */
const ContactItem = ({ icon, label, value, href, className = '' }: ContactItemProps) => {
  const content = (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-base text-gray-900 break-words">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }

  return <div className="p-2 -m-2">{content}</div>
}

/**
 * 交通手段アイテム
 */
const TransportationItem = ({ type, description, time }: TransportationItem) => {
  const getIcon = (transportType: string) => {
    switch (transportType) {
      case 'train':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2v1a1 1 0 11-2 0v-1H8v1a1 1 0 11-2 0v-1a2 2 0 01-2-2v-4z" clipRule="evenodd" />
          </svg>
        )
      case 'bus':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2v-2h4v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      case 'car':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.5 3A1.5 1.5 0 004 4.5v4A1.5 1.5 0 005.5 10h9A1.5 1.5 0 0016 8.5v-4A1.5 1.5 0 0014.5 3h-9zM5 7a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getTypeColor = (transportType: string) => {
    switch (transportType) {
      case 'train':
        return 'bg-blue-100 text-blue-600'
      case 'bus':
        return 'bg-green-100 text-green-600'
      case 'car':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-primary-100 text-primary-600'
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(type)}`}>
        {getIcon(type)}
      </div>
      <div className="flex-1">
        <p className="text-base text-gray-900">{description}</p>
        {time && (
          <p className="text-sm text-gray-600 mt-1">{time}</p>
        )}
      </div>
    </div>
  )
}