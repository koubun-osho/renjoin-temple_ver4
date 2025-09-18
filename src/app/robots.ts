/**
 * robots.txt自動生成
 *
 * Next.js App Routerのrobots.tsファイルでrobots.txtを自動生成
 * SEO対策として検索エンジンクローラーに適切な指示を提供
 */

import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/events',
        '/contact',
        '/blog',
        '/news',
      ],
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/studio/',
        '/private/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}