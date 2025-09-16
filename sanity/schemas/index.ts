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
 * スキーマ設定の概要
 * 
 * 【blog（ブログ記事）】
 * - タイトル、スラッグ、公開日、概要、著者、タグ、メイン画像、本文
 * - リッチテキストエディタ対応
 * - 画像の代替テキスト、キャプション設定可能
 * - SEO対応の概要文設定
 * 
 * 【news（お知らせ）】
 * - タイトル、スラッグ、公開日、カテゴリー、重要度、内容
 * - カテゴリー: 法要、イベント、お知らせ、その他
 * - 重要度: 高、中、低
 * - イベント日時・開催場所の条件付きフィールド
 * 
 * 【page（固定ページ）】
 * - タイトル、スラッグ、説明、表示順、本文
 * - ナビゲーション表示設定
 * - アクセス情報コンポーネント内蔵
 * - SEO設定項目完備
 * 
 * 【共通機能】
 * - 全スキーマでスラッグ自動生成
 * - バリデーション設定済み
 * - プレビュー表示カスタマイズ
 * - 並び順設定（公開日、タイトルなど）
 * - 日本語UI対応
 * 
 * 【セキュリティ対策】
 * - URL形式バリデーション
 * - 文字数制限設定
 * - XSS対策を考慮したフィールド設計
 * 
 * 【拡張予定】
 * Phase 2以降で以下の機能追加を予定:
 * - カテゴリー・タグ管理
 * - メディアライブラリ拡張
 * - 多言語対応
 * - 高度なSEO設定
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
      return field in schema && (schema as any)[field] !== undefined
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