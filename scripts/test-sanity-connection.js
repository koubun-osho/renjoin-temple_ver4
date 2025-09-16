#!/usr/bin/env node

/**
 * Sanity接続テストスクリプト
 *
 * Sanityクライアントの接続とクエリ動作を確認します。
 * @created 2025-09-17
 */

// 環境変数の読み込み
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')

// 環境変数の確認
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-16'

console.log('🔗 Sanity接続テスト開始...\n')

// 設定値の表示
console.log('📋 設定確認:')
console.log(`  Project ID: ${projectId ? '✅ 設定済み' : '❌ 未設定'}`)
console.log(`  Dataset: ${dataset ? '✅ 設定済み' : '❌ 未設定'}`)
console.log(`  API Version: ${apiVersion}`)
console.log(`  Token: ${process.env.SANITY_API_TOKEN ? '✅ 設定済み' : '❌ 未設定'}`)
console.log('')

if (!projectId || !dataset) {
  console.error('❌ 必要な環境変数が設定されていません。')
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID と NEXT_PUBLIC_SANITY_DATASET を設定してください。')
  process.exit(1)
}

// クライアント作成
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

async function testConnection() {
  try {
    console.log('🔍 Sanity接続テスト中...')

    // 1. プロジェクト情報の取得テスト
    console.log('\n1️⃣ プロジェクト情報取得テスト:')
    try {
      const projectInfo = await client.request({
        url: `/projects/${projectId}`,
        method: 'GET'
      })
      console.log(`  ✅ プロジェクト名: ${projectInfo.displayName || 'N/A'}`)
    } catch (error) {
      console.log(`  ⚠️  プロジェクト情報の取得に失敗: ${error.message}`)
    }

    // 2. スキーマ確認テスト
    console.log('\n2️⃣ スキーマ確認テスト:')
    try {
      const schemas = await client.fetch('*[_type == "schema"]')
      console.log(`  ✅ スキーマ取得成功`)
    } catch (error) {
      console.log(`  ⚠️  スキーマ取得失敗: ${error.message}`)
    }

    // 3. 基本クエリテスト
    console.log('\n3️⃣ 基本クエリテスト:')

    // ブログ記事数
    try {
      const blogCount = await client.fetch('count(*[_type == "blog"])')
      console.log(`  ✅ ブログ記事数: ${blogCount}件`)
    } catch (error) {
      console.log(`  ❌ ブログ記事クエリ失敗: ${error.message}`)
    }

    // お知らせ数
    try {
      const newsCount = await client.fetch('count(*[_type == "news"])')
      console.log(`  ✅ お知らせ数: ${newsCount}件`)
    } catch (error) {
      console.log(`  ❌ お知らせクエリ失敗: ${error.message}`)
    }

    // 固定ページ数
    try {
      const pageCount = await client.fetch('count(*[_type == "page"])')
      console.log(`  ✅ 固定ページ数: ${pageCount}件`)
    } catch (error) {
      console.log(`  ❌ 固定ページクエリ失敗: ${error.message}`)
    }

    // 4. サンプルデータ取得テスト
    console.log('\n4️⃣ サンプルデータ取得テスト:')

    try {
      const sampleBlog = await client.fetch('*[_type == "blog"][0]')
      if (sampleBlog) {
        console.log(`  ✅ サンプルブログ取得成功: "${sampleBlog.title}"`)
      } else {
        console.log(`  ⚠️  ブログ記事が存在しません`)
      }
    } catch (error) {
      console.log(`  ❌ サンプルブログ取得失敗: ${error.message}`)
    }

    try {
      const sampleNews = await client.fetch('*[_type == "news"][0]')
      if (sampleNews) {
        console.log(`  ✅ サンプルお知らせ取得成功: "${sampleNews.title}"`)
      } else {
        console.log(`  ⚠️  お知らせが存在しません`)
      }
    } catch (error) {
      console.log(`  ❌ サンプルお知らせ取得失敗: ${error.message}`)
    }

    console.log('\n✅ Sanity接続テスト完了!')

  } catch (error) {
    console.error('\n❌ 接続テスト中にエラーが発生しました:', error.message)
    process.exit(1)
  }
}

// テスト実行
testConnection()