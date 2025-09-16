/**
 * 蓮城院公式サイト Sanityスキーマ定義
 * 
 * 本ファイルは、Sanity CMSで使用される全てのスキーマをエクスポートします。
 * MVP版では、ブログ記事、お知らせ、固定ページの3つのスキーマを定義しています。
 * 
 * @created 2025-09-16
 * @version 1.0.0 MVP版
 */

// スキーマファイルのインポート
import blog from './blog'
import news from './news'
import page from './page'

/**
 * Sanity Studioで使用するスキーマの配列
 * 
 * 配列の順序は、Sanity Studio内でのスキーマ表示順序に影響します。
 * 使用頻度の高いものから順に配置することを推奨します。
 */
export const schemaTypes = [
  // ブログ記事スキーマ
  // 副住職のブログ投稿に使用
  blog,
  
  // お知らせスキーマ  
  // 法要、イベント、一般的なお知らせに使用
  news,
  
  // 固定ページスキーマ
  // 由緒、アクセス、利用規約などの静的コンテンツに使用
  page
]

/**
 * スキーマ設定の概要（設計書.md準拠）
 *
 * 【blog（ブログ記事）】
 * - タイトル（string, required）
 * - スラッグ（slug, required, 自動生成）
 * - 公開日（datetime, required）
 * - 概要（text, 任意）
 * - メイン画像（image with hotspot, 代替テキスト付き）
 * - 本文（array of block and image）
 *
 * 【news（お知らせ）】
 * - タイトル（string, required）
 * - スラッグ（slug, required, 自動生成）
 * - 公開日（datetime, required）
 * - カテゴリー（string with options: event/notice/service）
 * - 内容（array of block）
 *
 * 【page（固定ページ）】
 * - タイトル（string, required）
 * - スラッグ（slug, required, 自動生成）
 * - 本文（array of block and image）
 * - メタディスクリプション（text, 任意）
 *
 * 【実装方針】
 * - 設計書.mdの仕様に厳密準拠
 * - MVPスコープに限定した機能
 * - セキュリティとパフォーマンスを最優先
 * - 和モダンなコンテンツ編集体験
 *
 * 【セキュリティ対策】
 * - URL形式バリデーション
 * - 文字数制限設定
 * - XSS対策を考慮したフィールド設計
 * - 最小権限の原則
 */

// 型安全性のための型定義エクスポート（TypeScript用）
export type SchemaType = typeof schemaTypes[number]

// 開発時のデバッグ用：スキーマ名の配列
export const schemaNames = schemaTypes.map(schema => schema.name)

/**
 * スキーマ検証関数
 * 開発時にスキーマの整合性をチェックするためのユーティリティ
 */
export function validateSchemas(): boolean {
  const requiredFields = ['name', 'title', 'type', 'fields']
  
  return schemaTypes.every(schema => {
    return requiredFields.every(field => {
      return field in schema && (schema as Record<string, unknown>)[field] !== undefined
    })
  })
}

/**
 * スキーマメタデータ
 * 管理・監視用の情報
 */
export const schemaMetadata = {
  version: '1.0.0',
  lastUpdated: '2025-09-16',
  totalSchemas: schemaTypes.length,
  description: '蓮城院公式サイト MVP版 Sanityスキーマ定義',
  maintainer: 'Claude Code - CMS Architect',
  documentation: '設計書.md参照'
} as const