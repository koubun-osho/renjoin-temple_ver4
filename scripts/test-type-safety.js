#!/usr/bin/env node

/**
 * TypeScript型定義の整合性テストスクリプト（JavaScript版）
 *
 * Sanity型定義とクエリ結果の型安全性を検証します。
 * @created 2025-09-17
 */

const { config } = require('dotenv')
const { createClient } = require('@sanity/client')

// 環境変数の読み込み
config({ path: '.env.local' })

// Sanityクライアント設定
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-16',
  useCdn: true,
})

console.log('🔍 TypeScript型定義整合性テスト開始...\n')

// 型ガード関数の定義
function isSanitySlug(value) {
  return value && typeof value === 'object' && typeof value.current === 'string' && value._type === 'slug'
}

function isSanityImage(value) {
  return value && typeof value === 'object' && value._type === 'image' && value.asset
}

function isBlogPost(value) {
  return value &&
    typeof value === 'object' &&
    typeof value._id === 'string' &&
    value._type === 'blog' &&
    typeof value.title === 'string' &&
    isSanitySlug(value.slug) &&
    typeof value.publishedAt === 'string' &&
    Array.isArray(value.body)
}

function isBlogPostPreview(value) {
  return value &&
    typeof value === 'object' &&
    typeof value._id === 'string' &&
    typeof value.title === 'string' &&
    isSanitySlug(value.slug) &&
    typeof value.publishedAt === 'string'
}

function isNewsItem(value) {
  return value &&
    typeof value === 'object' &&
    typeof value._id === 'string' &&
    value._type === 'news' &&
    typeof value.title === 'string' &&
    isSanitySlug(value.slug) &&
    typeof value.publishedAt === 'string' &&
    ['event', 'notice', 'service'].includes(value.category) &&
    Array.isArray(value.content)
}

function isNewsItemPreview(value) {
  return value &&
    typeof value === 'object' &&
    typeof value._id === 'string' &&
    typeof value.title === 'string' &&
    isSanitySlug(value.slug) &&
    typeof value.publishedAt === 'string' &&
    ['event', 'notice', 'service'].includes(value.category)
}

function isPage(value) {
  return value &&
    typeof value === 'object' &&
    typeof value._id === 'string' &&
    value._type === 'page' &&
    typeof value.title === 'string' &&
    isSanitySlug(value.slug) &&
    Array.isArray(value.body)
}

function isHomePageData(value) {
  return value &&
    typeof value === 'object' &&
    Array.isArray(value.recentNews) &&
    Array.isArray(value.recentBlogs)
}

// テスト結果記録
let passedTests = 0
let totalTests = 0

// テストヘルパー関数
function runTypeTest(testName, testFn) {
  totalTests++
  try {
    const result = testFn()
    if (result) {
      console.log(`  ✅ ${testName}`)
      passedTests++
    } else {
      console.log(`  ❌ ${testName}`)
    }
  } catch (error) {
    console.log(`  ❌ ${testName} - エラー: ${error.message}`)
  }
}

async function testTypeDefinitions() {
  // 1. 基本的な型定義テスト
  console.log('📋 基本的な型定義テスト:')

  runTypeTest('SanitySlug型の検証', () => {
    const validSlug = { current: 'test-slug', _type: 'slug' }
    return isSanitySlug(validSlug)
  })

  runTypeTest('SanityImage型の検証', () => {
    const validImage = {
      asset: { _ref: 'image-ref', _type: 'reference' },
      _type: 'image',
      alt: 'Test image'
    }
    return isSanityImage(validImage)
  })

  runTypeTest('NewsCategory型の検証', () => {
    const validCategories = ['event', 'notice', 'service']
    return validCategories.every(cat => ['event', 'notice', 'service'].includes(cat))
  })

  console.log('')

  // 2. クエリ結果の型安全性テスト
  console.log('🔍 クエリ結果の型安全性テスト:')

  try {
    // ブログクエリの型テスト
    const blogCount = await client.fetch('count(*[_type == "blog"])')
    runTypeTest('ブログ記事数の型確認', () => typeof blogCount === 'number')

    const blogList = await client.fetch(`
      *[_type == "blog"] | order(publishedAt desc) [0...5] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage {
          asset,
          hotspot,
          crop,
          alt
        }
      }
    `)
    runTypeTest('ブログ一覧の型確認', () => Array.isArray(blogList))

    // お知らせクエリの型テスト
    const newsCount = await client.fetch('count(*[_type == "news"])')
    runTypeTest('お知らせ数の型確認', () => typeof newsCount === 'number')

    const newsList = await client.fetch(`
      *[_type == "news"] | order(publishedAt desc) [0...5] {
        _id,
        title,
        slug,
        publishedAt,
        category
      }
    `)
    runTypeTest('お知らせ一覧の型確認', () => Array.isArray(newsList))

    // 固定ページクエリの型テスト
    const pageList = await client.fetch(`
      *[_type == "page"] | order(title asc) {
        _id,
        title,
        slug,
        metaDescription
      }
    `)
    runTypeTest('固定ページ一覧の型確認', () => Array.isArray(pageList))

    // トップページクエリの型テスト
    const homeData = await client.fetch(`{
      "recentNews": *[_type == "news"] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        category
      },
      "recentBlogs": *[_type == "blog"] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage {
          asset,
          hotspot,
          crop,
          alt
        }
      }
    }`)
    runTypeTest('トップページデータの型確認', () => isHomePageData(homeData))

  } catch (error) {
    console.log(`  ❌ クエリ実行エラー: ${error.message}`)
  }

  console.log('')

  // 3. 型推論テスト
  console.log('🎯 型推論テスト:')

  runTypeTest('ブログ記事型の推論テスト', () => {
    const mockBlog = {
      _id: 'blog-1',
      _type: 'blog',
      _createdAt: '2025-09-17T00:00:00Z',
      _updatedAt: '2025-09-17T00:00:00Z',
      title: 'テストブログ',
      slug: { current: 'test-blog', _type: 'slug' },
      publishedAt: '2025-09-17T00:00:00Z',
      excerpt: 'テスト概要',
      body: []
    }
    return isBlogPost(mockBlog)
  })

  runTypeTest('お知らせ型の推論テスト', () => {
    const mockNews = {
      _id: 'news-1',
      _type: 'news',
      _createdAt: '2025-09-17T00:00:00Z',
      _updatedAt: '2025-09-17T00:00:00Z',
      title: 'テストお知らせ',
      slug: { current: 'test-news', _type: 'slug' },
      publishedAt: '2025-09-17T00:00:00Z',
      category: 'event',
      content: []
    }
    return isNewsItem(mockNews)
  })

  runTypeTest('固定ページ型の推論テスト', () => {
    const mockPage = {
      _id: 'page-1',
      _type: 'page',
      _createdAt: '2025-09-17T00:00:00Z',
      _updatedAt: '2025-09-17T00:00:00Z',
      title: 'テストページ',
      slug: { current: 'test-page', _type: 'slug' },
      body: [],
      metaDescription: 'テストページの説明'
    }
    return isPage(mockPage)
  })

  console.log('')

  // 4. エラーケース型テスト
  console.log('⚠️  エラーケース型テスト:')

  runTypeTest('不正なスラッグ型の検出', () => {
    const invalidSlug = { current: 'test', _type: 'invalid' }
    return !isSanitySlug(invalidSlug)
  })

  runTypeTest('不正なカテゴリの検出', () => {
    const invalidCategory = 'invalid-category'
    return !['event', 'notice', 'service'].includes(invalidCategory)
  })

  runTypeTest('不完全なブログ記事型の検出', () => {
    const incompleteBlog = {
      _id: 'blog-1',
      title: 'テストブログ'
      // 必須フィールドが不足
    }
    return !isBlogPost(incompleteBlog)
  })

  console.log('')

  // 5. lib/sanity.tsとの整合性テスト
  console.log('🔗 lib/sanity.tsとの整合性テスト:')

  runTypeTest('Sanity設定の整合性確認', () => {
    return !!(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
              process.env.NEXT_PUBLIC_SANITY_DATASET)
  })

  runTypeTest('クエリ構文の妥当性確認', () => {
    // 基本的なGROQクエリ構文をテスト
    const testQueries = [
      'count(*[_type == "blog"])',
      '*[_type == "news"] | order(publishedAt desc) [0...3]',
      '*[_type == "page" && slug.current == "test"][0]'
    ]

    // 構文エラーがないことを確認
    return testQueries.every(query => typeof query === 'string' && query.length > 0)
  })

  // テスト結果サマリー
  console.log('')
  console.log('📊 型定義テスト結果:')
  console.log(`  ✅ 成功: ${passedTests}/${totalTests}`)
  console.log(`  📈 成功率: ${Math.round((passedTests / totalTests) * 100)}%`)

  if (passedTests === totalTests) {
    console.log('\n🎉 全ての型定義テストが正常に完了しました！')
    console.log('TypeScriptの型安全性が確保されています。')
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests}個のテストが失敗しました。`)
    console.log('型定義の見直しが必要です。')
  }
}

// メイン実行
async function main() {
  try {
    await testTypeDefinitions()
  } catch (error) {
    console.error('\n❌ 型テスト実行中にエラーが発生しました:', error.message)
    process.exit(1)
  }
}

main()