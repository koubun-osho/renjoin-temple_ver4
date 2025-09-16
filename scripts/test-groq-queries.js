#!/usr/bin/env node

/**
 * GROQクエリテストスクリプト
 *
 * 作成した全てのGROQクエリの動作を検証します。
 * @created 2025-09-17
 */

// 環境変数の読み込み
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')

// Sanityクライアント設定
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-16',
  useCdn: true,
})

// lib/sanity.tsからのクエリ定義をインポート（実際のクエリをコピー）
const blogQueries = {
  list: `
    *[_type == "blog"] | order(publishedAt desc) [$start...$end] {
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
  `,
  detail: `
    *[_type == "blog" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      mainImage {
        asset,
        hotspot,
        crop,
        alt
      }
    }
  `,
  recent: `
    *[_type == "blog"] | order(publishedAt desc) [0...3] {
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
  `,
  count: `count(*[_type == "blog"])`,
  slugs: `*[_type == "blog"]{slug}`
}

const newsQueries = {
  list: `
    *[_type == "news"] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,
  detail: `
    *[_type == "news" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      category,
      content
    }
  `,
  recent: `
    *[_type == "news"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,
  byCategory: `
    *[_type == "news" && category == $category] | order(publishedAt desc) [$start...$end] {
      _id,
      title,
      slug,
      publishedAt,
      category
    }
  `,
  count: `count(*[_type == "news"])`,
  countByCategory: `count(*[_type == "news" && category == $category])`,
  slugs: `*[_type == "news"]{slug}`
}

const pageQueries = {
  detail: `
    *[_type == "page" && slug.current == $slug][0] {
      _id,
      title,
      body,
      metaDescription
    }
  `,
  list: `
    *[_type == "page"] | order(title asc) {
      _id,
      title,
      slug,
      metaDescription
    }
  `,
  slugs: `*[_type == "page"]{slug}`
}

const homeQueries = {
  homeData: `{
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
  }`
}

async function testQueries() {
  console.log('🚀 GROQクエリテスト開始...\n')

  let passedTests = 0
  let totalTests = 0

  // テスト実行ヘルパー関数
  async function runTest(testName, query, params = {}) {
    totalTests++
    try {
      console.log(`🔍 テスト: ${testName}`)
      const result = await client.fetch(query, params)
      console.log(`  ✅ 成功 - 結果: ${JSON.stringify(result).slice(0, 100)}${JSON.stringify(result).length > 100 ? '...' : ''}`)
      passedTests++
      return result
    } catch (error) {
      console.log(`  ❌ 失敗 - エラー: ${error.message}`)
      return null
    }
  }

  // 1. ブログクエリテスト
  console.log('📝 ブログクエリテスト:')
  await runTest('ブログ記事数取得', blogQueries.count)
  await runTest('ブログ一覧取得', blogQueries.list, { start: 0, end: 5 })
  await runTest('最新ブログ取得', blogQueries.recent)
  await runTest('ブログスラッグ一覧', blogQueries.slugs)

  // 存在しないスラッグでのテスト
  await runTest('ブログ詳細取得（存在しないスラッグ）', blogQueries.detail, { slug: 'test-slug' })
  console.log('')

  // 2. お知らせクエリテスト
  console.log('📢 お知らせクエリテスト:')
  await runTest('お知らせ数取得', newsQueries.count)
  await runTest('お知らせ一覧取得', newsQueries.list, { start: 0, end: 5 })
  await runTest('最新お知らせ取得', newsQueries.recent)
  await runTest('お知らせスラッグ一覧', newsQueries.slugs)

  // カテゴリ別テスト
  await runTest('イベントカテゴリお知らせ数', newsQueries.countByCategory, { category: 'event' })
  await runTest('イベントカテゴリお知らせ一覧', newsQueries.byCategory, { category: 'event', start: 0, end: 5 })

  // 存在しないスラッグでのテスト
  await runTest('お知らせ詳細取得（存在しないスラッグ）', newsQueries.detail, { slug: 'test-news-slug' })
  console.log('')

  // 3. 固定ページクエリテスト
  console.log('📄 固定ページクエリテスト:')
  await runTest('固定ページ一覧取得', pageQueries.list)
  await runTest('固定ページスラッグ一覧', pageQueries.slugs)

  // 存在しないスラッグでのテスト
  await runTest('固定ページ詳細取得（存在しないスラッグ）', pageQueries.detail, { slug: 'test-page-slug' })
  console.log('')

  // 4. トップページクエリテスト
  console.log('🏠 トップページクエリテスト:')
  await runTest('トップページ統合データ取得', homeQueries.homeData)
  console.log('')

  // 5. 複雑なクエリテスト
  console.log('🔬 高度なクエリテスト:')

  // 条件付きクエリ
  await runTest('公開済みブログ記事フィルタ', `
    *[_type == "blog" && defined(publishedAt)] | order(publishedAt desc) [0...5] {
      _id,
      title,
      publishedAt
    }
  `)

  // 日付範囲クエリ
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  await runTest('過去1週間のお知らせ', `
    *[_type == "news" && publishedAt >= $date] | order(publishedAt desc) {
      _id,
      title,
      publishedAt
    }
  `, { date: oneWeekAgo })

  // 検索クエリ
  await runTest('タイトル検索（部分一致）', `
    *[_type == "blog" && title match "*お知らせ*"] {
      _id,
      title
    }
  `)

  // カウントと存在チェック
  await runTest('画像付きブログ記事数', `
    count(*[_type == "blog" && defined(mainImage)])
  `)

  console.log('')

  // 6. 性能テスト
  console.log('⚡ 性能テスト:')
  const startTime = Date.now()
  await runTest('大量データ取得テスト', `
    *[_type in ["blog", "news", "page"]] | order(_createdAt desc) [0...100] {
      _id,
      _type,
      title,
      _createdAt
    }
  `)
  const endTime = Date.now()
  console.log(`  ⏱️  実行時間: ${endTime - startTime}ms`)
  console.log('')

  // テスト結果サマリー
  console.log('📊 テスト結果サマリー:')
  console.log(`  ✅ 成功: ${passedTests}/${totalTests}`)
  console.log(`  📈 成功率: ${Math.round((passedTests / totalTests) * 100)}%`)

  if (passedTests === totalTests) {
    console.log('\n🎉 全てのGROQクエリテストが正常に完了しました！')
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests}個のテストが失敗しました。`)
  }
}

// エラーハンドリング付きでテスト実行
async function main() {
  try {
    await testQueries()
  } catch (error) {
    console.error('\n❌ テスト実行中に予期しないエラーが発生しました:', error.message)
    process.exit(1)
  }
}

main()