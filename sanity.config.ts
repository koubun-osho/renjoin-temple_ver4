import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'

/**
 * 蓮城院公式サイト Sanity Studio設定
 *
 * 日本の寺院サイトに最適化された設定
 * - 日本語対応のUI設定
 * - セキュリティを考慮したアクセス制御
 * - コンテンツ管理者フレンドリーな構成
 */
export default defineConfig({
  name: 'renjoin-temple-cms',
  title: '蓮城院 CMS｜コンテンツ管理システム',
  subtitle: '蓮城院公式サイトのコンテンツを管理します',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  // API設定とセキュリティ
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    // 本番環境ではCDNを使用
    useCdn: process.env.NODE_ENV === 'production',
    // APIバージョンを固定してセキュリティ向上
    apiVersion: '2024-01-01',
    // セキュリティ強化：プレビューモードのみでトークン使用
    withCredentials: true,
  },

  // プラグイン設定
  plugins: [
    // 構造化ツール（日本語対応設定）
    structureTool({
      title: 'コンテンツ管理',
      name: 'content',
      structure: (S) =>
        S.list()
          .title('コンテンツ一覧')
          .items([
            // ブログ記事
            S.documentTypeListItem('blog')
              .title('ブログ記事')
              .icon(() => '📝'),

            // お知らせ
            S.documentTypeListItem('news')
              .title('お知らせ')
              .icon(() => '📢'),

            // 固定ページ
            S.documentTypeListItem('page')
              .title('固定ページ')
              .icon(() => '📄'),
          ]),
    }),

    // Vision ツール（GROQ クエリのテスト用）
    visionTool({
      title: 'クエリテスト',
      name: 'vision',
    }),
  ],

  // スキーマ設定
  schema: {
    types: schemaTypes,
    // テンプレート設定（日本語対応）
    templates: (templates) =>
      templates.map((template) => {
        // テンプレートオブジェクトの型安全性を確保
        const templateWithType = template as { schemaType?: string }

        if (templateWithType.schemaType === 'blog') {
          return {
            ...template,
            title: 'ブログ記事を作成',
            description: '新しいブログ記事を作成します',
          }
        }
        if (templateWithType.schemaType === 'news') {
          return {
            ...template,
            title: 'お知らせを作成',
            description: '新しいお知らせを作成します',
          }
        }
        if (templateWithType.schemaType === 'page') {
          return {
            ...template,
            title: '固定ページを作成',
            description: '新しい固定ページを作成します',
          }
        }
        return template
      }),
  },

  // Studio UI設定
  studio: {
    components: {
      // カスタムロゴやヘッダーは後日実装予定
    },
  },

  // 開発環境設定
  tools: (prev) => {
    // 開発環境でのみVision ツールを表示
    if (process.env.NODE_ENV === 'development') {
      return prev
    }
    // 本番環境ではVision ツールを非表示（セキュリティ強化）
    return prev.filter((tool) => tool.name !== 'vision')
  },

  // ドキュメント設定
  document: {
    // 新規作成時のデフォルト値設定
    newDocumentOptions: (prev) => {
      return prev.map((option) => {
        // テンプレートオブジェクトの型安全性を確保
        const templateWithType = option as { schemaType?: string }

        if (templateWithType.schemaType === 'blog') {
          return {
            ...option,
            title: '新しいブログ記事',
            icon: () => '📝',
          }
        }
        if (templateWithType.schemaType === 'news') {
          return {
            ...option,
            title: '新しいお知らせ',
            icon: () => '📢',
          }
        }
        if (templateWithType.schemaType === 'page') {
          return {
            ...option,
            title: '新しい固定ページ',
            icon: () => '📄',
          }
        }
        return option
      })
    },
  },

  // プレビュー設定（Next.jsと連携）
  productionUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  previewUrl: {
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    previewMode: {
      enable: '/api/preview',
    },
  },
})