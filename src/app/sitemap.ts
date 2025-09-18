/**
 * サイトマップ自動生成
 *
 * Next.js App Routerのsitemap.tsファイルで自動的にsitemap.xmlを生成
 * 設計書 9.2サイトマップ自動生成に基づく実装
 */

import { MetadataRoute } from 'next'
import { fetchBlogPosts, fetchNews } from '../../lib/sanity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://renjoin.temple'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  // 静的ページ
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  routes.push(...staticPages)

  try {
    // ブログ記事のサイトマップ生成
    const blogPosts = await fetchBlogPosts.sitemap()

    for (const post of blogPosts) {
      if (post.slug?.current) {
        routes.push({
          url: `${SITE_URL}/blog/${post.slug.current}`,
          lastModified: new Date(post._updatedAt || post.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error)
  }

  try {
    // お知らせのサイトマップ生成
    const newsItems = await fetchNews.sitemap()

    for (const news of newsItems) {
      if (news.slug?.current) {
        routes.push({
          url: `${SITE_URL}/news/${news.slug.current}`,
          lastModified: new Date(news._updatedAt || news.publishedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch news for sitemap:', error)
  }

  return routes
}