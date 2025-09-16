/**
 * 蓮城院公式サイト Sanity クライアント設定
 * 
 * Next.jsプロジェクトでSanity CMSを使用するためのクライアント設定ファイル。
 * GROQ クエリの実行とデータフェッチを担当します。
 * 
 * @created 2025-09-16
 * @version 1.0.0 MVP版
 */

import { createClient } from 'next-sanity'

// 環境変数の型安全性を確保
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-16'

/**
 * 本番用 Sanity クライアント
 * 公開データの取得に使用（APIトークン不要）
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDNを使用してパフォーマンスを向上
})

/**
 * プレビュー用 Sanity クライアント
 * ドラフトデータの取得に使用（要APIトークン）
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // プレビューではCDNを無効化
  token: process.env.SANITY_API_TOKEN,
})

/**
 * 動的なクライアント取得関数
 * プレビューモードに応じて適切なクライアントを返却
 */
export const getClient = (preview?: boolean) => (preview ? previewClient : client)

/**
 * 設定値の確認
 * 開発時のデバッグ用
 */
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  hasToken: !!process.env.SANITY_API_TOKEN,
} as const