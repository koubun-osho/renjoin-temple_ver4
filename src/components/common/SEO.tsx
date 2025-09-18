/**
 * SEOコンポーネント
 *
 * 設計書 9.1メタデータ基本設定に基づき、以下を実装：
 * - 動的メタタグ設定
 * - OGP（Open Graph Protocol）対応
 * - Twitter Cards設定
 * - 構造化データ（JSON-LD）対応
 */

import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  author?: string;
  noindex?: boolean;
  canonical?: string;
}

/**
 * 動的メタデータ生成関数
 * Next.js App Routerのmetadata APIを活用
 */
export function generateSEOMetadata({
  title,
  description = '蓮城院の公式サイト。副住職・荒木弘文のブログも掲載。曹洞宗の教えと共に、地域に根ざした寺院活動をご紹介いたします。',
  ogImage = '/images/og-image.jpg',
  ogImageAlt = '蓮城院の境内写真',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords = ['蓮城院', '曹洞宗', '寺院', '副住職', '荒木弘文', 'ブログ', '仏教', '法要'],
  author = '蓮城院',
  noindex = false,
  canonical,
}: SEOProps): Metadata {

  const fullTitle = title
    ? `${title} | 蓮城院`
    : '蓮城院 | 曹洞宗の寺院';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: '蓮城院',
    publisher: '蓮城院',
    ...(canonical && { alternates: { canonical } }),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      locale: 'ja_JP',
      siteName: '蓮城院',
      url: fullUrl,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        ...(modifiedTime && { modifiedTime }),
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: '@renjoin_temple', // 実装時に実際のTwitterアカウントに変更
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Google Search Console verification (実装時に追加)
      // google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

/**
 * JSON-LD構造化データインターフェース
 */
export interface StructuredDataProps {
  type: 'Organization' | 'Article' | 'BlogPosting' | 'Event' | 'BreadcrumbList';
  data: Record<string, unknown>;
}

/**
 * 構造化データコンポーネント
 * JSON-LDスキーマを安全に出力
 */
export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

/**
 * 組織情報の構造化データ生成
 * 寺院の基本情報をJSON-LDで定義
 */
export function generateOrganizationData() {
  return {
    name: '蓮城院',
    alternateName: 'Renjoin Temple',
    description: '曹洞宗の寺院。副住職・荒木弘文のブログも掲載。',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/images/og-image.jpg`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'}/images/temple-hero.jpg`,
    '@type': 'ReligiousOrganization',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: '東京都',
      addressLocality: '練馬区',
      streetAddress: '○○町○-○-○', // 実装時に実際の住所に変更
      postalCode: '000-0000', // 実装時に実際の郵便番号に変更
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+81-3-0000-0000', // 実装時に実際の電話番号に変更
      contactType: 'customer service',
      availableLanguage: 'Japanese',
    },
    sameAs: [
      // 実装時にソーシャルメディアアカウントを追加
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '法要・行事',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '法要',
            description: '各種法要を承っております',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '年間行事',
            description: '季節の行事や法要を行っております',
          },
        },
      ],
    },
  };
}

/**
 * ブログ記事の構造化データ生成
 */
export function generateBlogPostData({
  title,
  description,
  publishedAt,
  slug,
  author = '荒木弘文',
  mainImage,
}: {
  title: string;
  description: string;
  publishedAt: string;
  slug: string;
  author?: string;
  mainImage?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple';

  return {
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
      jobTitle: '副住職',
      worksFor: {
        '@type': 'ReligiousOrganization',
        name: '蓮城院',
      },
    },
    publisher: {
      '@type': 'ReligiousOrganization',
      name: '蓮城院',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/og-image.jpg`,
      },
    },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
    ...(mainImage && {
      image: {
        '@type': 'ImageObject',
        url: mainImage.startsWith('http') ? mainImage : `${siteUrl}${mainImage}`,
        width: 1200,
        height: 630,
      },
    }),
    articleSection: 'ブログ',
    inLanguage: 'ja-JP',
  };
}

/**
 * イベント構造化データ生成
 */
export function generateEventData({
  name,
  description,
  startDate,
  endDate,
  location = '蓮城院',
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
}) {
  return {
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'JP',
        addressRegion: '東京都',
        addressLocality: '練馬区',
        streetAddress: '○○町○-○-○', // 実装時に実際の住所に変更
      },
    },
    organizer: {
      '@type': 'ReligiousOrganization',
      name: '蓮城院',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple',
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'ja-JP',
  };
}

/**
 * パンくずリスト構造化データ生成
 */
export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple';

  return {
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}