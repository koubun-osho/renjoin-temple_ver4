/**
 * 蓮城院公式サイト 多言語対応ヘルパー関数
 *
 * Sanity CMSスキーマの多言語対応を支援するユーティリティ
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

import { defineField, Rule } from 'sanity'

/**
 * 対応言語の定義
 */
export const supportedLanguages = [
  {
    id: 'ja',
    title: '日本語',
    isDefault: true,
    flag: '🇯🇵'
  },
  {
    id: 'en',
    title: 'English',
    isDefault: false,
    flag: '🇺🇸'
  }
] as const

/**
 * 言語IDの型定義
 */
export type LanguageId = typeof supportedLanguages[number]['id']

/**
 * 多言語対応フィールドのスキーマを生成
 *
 * @param fieldName フィールド名
 * @param fieldType フィールドタイプ（string, text, array等）
 * @param title 表示用タイトル
 * @param options 追加オプション
 * @returns 多言語対応フィールド定義
 */
export function createInternationalizedField(
  fieldName: string,
  fieldType: string,
  title: string,
  options: {
    description?: string
    required?: boolean
    maxLength?: number
    rows?: number
    validation?: (rule: Rule) => Rule
    of?: any[]
    styles?: any[]
    lists?: any[]
    marks?: any
  } = {}
) {
  const baseField = {
    name: fieldName,
    title: title,
    type: fieldType,
    ...options
  }

  // document-internationalizationプラグインは自動的に
  // スキーマを多言語対応に変換するため、
  // 基本的なフィールド定義をそのまま返す
  return defineField(baseField)
}

/**
 * タイトルフィールドの多言語対応スキーマ
 */
export const titleField = createInternationalizedField(
  'title',
  'string',
  'タイトル',
  {
    description: '記事のタイトルを入力してください',
    required: true,
    maxLength: 100,
    validation: (Rule: any) => Rule.required().max(100).error('タイトルは必須です（100文字以内）')
  }
)

/**
 * 概要フィールドの多言語対応スキーマ
 */
export const excerptField = createInternationalizedField(
  'excerpt',
  'text',
  '概要',
  {
    description: '記事の概要や要約を入力してください（検索結果やSNSで表示されます）',
    rows: 3,
    maxLength: 200,
    validation: (Rule: any) => Rule.max(200).warning('概要は200文字以内が推奨です')
  }
)

/**
 * 本文フィールドの多言語対応スキーマ
 */
export const bodyField = createInternationalizedField(
  'body',
  'array',
  '本文',
  {
    description: '記事の本文を入力してください',
    required: true,
    validation: (Rule: any) => Rule.required().error('本文は必須です'),
    of: [
      {
        type: 'block',
        styles: [
          { title: '標準', value: 'normal' },
          { title: '見出し1', value: 'h1' },
          { title: '見出し2', value: 'h2' },
          { title: '見出し3', value: 'h3' },
          { title: '引用', value: 'blockquote' }
        ],
        lists: [
          { title: '箇条書き', value: 'bullet' },
          { title: '番号付きリスト', value: 'number' }
        ],
        marks: {
          decorators: [
            { title: '太字', value: 'strong' },
            { title: '斜体', value: 'em' },
            { title: '下線', value: 'underline' }
          ],
          annotations: [
            {
              title: 'リンク',
              name: 'link',
              type: 'object',
              fields: [
                {
                  title: 'URL',
                  name: 'href',
                  type: 'url',
                  validation: (Rule: any) => Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel']
                  })
                },
                {
                  title: '新しいタブで開く',
                  name: 'blank',
                  type: 'boolean'
                }
              ]
            }
          ]
        }
      },
      {
        type: 'image',
        options: {
          hotspot: true,
          metadata: ['blurhash', 'lqip']
        },
        fields: [
          {
            name: 'alt',
            title: '代替テキスト',
            type: 'string',
            description: '画像の代替テキスト',
            validation: (Rule: any) => Rule.required().warning('代替テキストの設定を推奨します')
          },
          {
            name: 'caption',
            title: 'キャプション',
            type: 'string',
            description: '画像のキャプション（任意）'
          }
        ]
      }
    ]
  }
)

/**
 * メタディスクリプションフィールドの多言語対応スキーマ
 */
export const metaDescriptionField = createInternationalizedField(
  'metaDescription',
  'text',
  'メタディスクリプション',
  {
    description: 'SEO用のメタディスクリプション（検索結果で表示されます）',
    rows: 2,
    maxLength: 160,
    validation: (Rule: any) => Rule.max(160).warning('メタディスクリプションは160文字以内が推奨です')
  }
)

/**
 * カテゴリーフィールドの多言語対応スキーマ
 * （お知らせ用）
 */
export const categoryField = defineField({
  name: 'category',
  title: 'カテゴリー',
  type: 'string',
  description: 'お知らせのカテゴリーを選択してください',
  options: {
    list: [
      { title: '行事案内', value: 'event' },
      { title: 'お知らせ', value: 'notice' },
      { title: '法要', value: 'service' }
    ],
    layout: 'radio'
  },
  initialValue: 'notice',
  validation: (Rule: any) => Rule.required().error('カテゴリーは必須です')
})

/**
 * お知らせ用コンテンツフィールド（多言語対応）
 * ブログの本文より簡素化された構成
 */
export const contentField = createInternationalizedField(
  'content',
  'array',
  '内容',
  {
    description: 'お知らせの内容を入力してください',
    required: true,
    validation: (Rule: any) => Rule.required().error('内容は必須です'),
    of: [
      {
        type: 'block',
        styles: [
          { title: '標準', value: 'normal' },
          { title: '見出し2', value: 'h2' },
          { title: '見出し3', value: 'h3' },
          { title: '引用', value: 'blockquote' }
        ],
        lists: [
          { title: '箇条書き', value: 'bullet' },
          { title: '番号付きリスト', value: 'number' }
        ],
        marks: {
          decorators: [
            { title: '太字', value: 'strong' },
            { title: '斜体', value: 'em' },
            { title: '下線', value: 'underline' }
          ],
          annotations: [
            {
              title: 'リンク',
              name: 'link',
              type: 'object',
              fields: [
                {
                  title: 'URL',
                  name: 'href',
                  type: 'url',
                  validation: (Rule: any) => Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel']
                  })
                },
                {
                  title: '新しいタブで開く',
                  name: 'blank',
                  type: 'boolean'
                }
              ]
            }
          ]
        }
      }
    ]
  }
)

/**
 * 固定ページ用本文フィールド（多言語対応）
 * より多くのスタイルオプションとブロック要素を含む
 */
export const pageBodyField = createInternationalizedField(
  'body',
  'array',
  '本文',
  {
    description: 'ページの本文を入力してください',
    required: true,
    validation: (Rule: any) => Rule.required().error('本文は必須です'),
    of: [
      {
        type: 'block',
        styles: [
          { title: '標準', value: 'normal' },
          { title: '見出し1', value: 'h1' },
          { title: '見出し2', value: 'h2' },
          { title: '見出し3', value: 'h3' },
          { title: '見出し4', value: 'h4' },
          { title: '引用', value: 'blockquote' }
        ],
        lists: [
          { title: '箇条書き', value: 'bullet' },
          { title: '番号付きリスト', value: 'number' }
        ],
        marks: {
          decorators: [
            { title: '太字', value: 'strong' },
            { title: '斜体', value: 'em' },
            { title: '下線', value: 'underline' }
          ],
          annotations: [
            {
              title: 'リンク',
              name: 'link',
              type: 'object',
              fields: [
                {
                  title: 'URL',
                  name: 'href',
                  type: 'url',
                  validation: (Rule: any) => Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel']
                  })
                },
                {
                  title: '新しいタブで開く',
                  name: 'blank',
                  type: 'boolean'
                }
              ]
            }
          ]
        }
      },
      {
        type: 'image',
        options: {
          hotspot: true,
          metadata: ['blurhash', 'lqip']
        },
        fields: [
          {
            name: 'alt',
            title: '代替テキスト',
            type: 'string',
            description: '画像の代替テキスト（アクセシビリティ向上のため）',
            validation: (Rule: any) => Rule.required().warning('代替テキストの設定を推奨します')
          },
          {
            name: 'caption',
            title: 'キャプション',
            type: 'string',
            description: '画像のキャプション（任意）'
          }
        ]
      }
    ]
  }
)

/**
 * スラッグフィールド（多言語対応用に調整）
 */
export function createSlugField(sourceField = 'title') {
  return defineField({
    name: 'slug',
    title: 'URLスラッグ',
    type: 'slug',
    description: 'URLに使用されるスラッグ（自動生成されます）',
    options: {
      source: sourceField,
      maxLength: 96,
      slugify: (input: string) => {
        // 日本語文字を適切にスラッグ化
        return input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      }
    },
    validation: (Rule: any) => Rule.required().error('スラッグは必須です')
  })
}

/**
 * 公開日フィールド
 */
export const publishedAtField = defineField({
  name: 'publishedAt',
  title: '公開日',
  type: 'datetime',
  description: '記事の公開日時を設定してください',
  initialValue: () => new Date().toISOString(),
  validation: (Rule: any) => Rule.required().error('公開日は必須です')
})

/**
 * メイン画像フィールド（多言語対応）
 */
export const mainImageField = defineField({
  name: 'mainImage',
  title: 'メイン画像',
  type: 'image',
  description: '記事のメイン画像を設定してください',
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette']
  },
  fields: [
    createInternationalizedField(
      'alt',
      'string',
      '代替テキスト',
      {
        description: '画像の代替テキスト（アクセシビリティ向上のため）',
        required: true,
        validation: (Rule: any) => Rule.required().warning('代替テキストの設定を推奨します')
      }
    )
  ]
})

/**
 * プレビュー設定のヘルパー
 */
export function createPreviewConfig(
  titleField = 'title',
  mediaField = 'mainImage',
  dateField = 'publishedAt'
) {
  return {
    select: {
      title: titleField,
      media: mediaField,
      publishedAt: dateField
    },
    prepare(selection: any) {
      const { title, media, publishedAt } = selection
      const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('ja-JP')
        : '未設定'

      return {
        title: title || '無題',
        subtitle: `公開日: ${formattedDate}`,
        media
      }
    }
  }
}

/**
 * お知らせ用プレビュー設定のヘルパー
 */
export function createNewsPreviewConfig(
  titleField = 'title',
  categoryField = 'category',
  dateField = 'publishedAt'
) {
  return {
    select: {
      title: titleField,
      category: categoryField,
      publishedAt: dateField
    },
    prepare(selection: any) {
      const { title, category, publishedAt } = selection

      // カテゴリーの日本語表示
      const categoryLabels: Record<string, string> = {
        event: '行事案内',
        notice: 'お知らせ',
        service: '法要'
      }

      const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('ja-JP')
        : '未設定'

      const categoryLabel = categoryLabels[category] || category || '未分類'

      return {
        title: title || '無題',
        subtitle: `${categoryLabel} - ${formattedDate}`,
        media: undefined
      }
    }
  }
}

/**
 * 並び順設定のヘルパー
 */
export function createOrderings(titleField = 'title', dateField = 'publishedAt') {
  return [
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [{ field: dateField, direction: 'desc' as const }]
    },
    {
      title: '公開日（古い順）',
      name: 'publishedAtAsc',
      by: [{ field: dateField, direction: 'asc' as const }]
    },
    {
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{ field: titleField, direction: 'asc' as const }]
    }
  ]
}

/**
 * お知らせ用並び順設定のヘルパー
 */
export function createNewsOrderings(
  titleField = 'title',
  dateField = 'publishedAt',
  categoryField = 'category'
) {
  return [
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [{ field: dateField, direction: 'desc' as const }]
    },
    {
      title: '公開日（古い順）',
      name: 'publishedAtAsc',
      by: [{ field: dateField, direction: 'asc' as const }]
    },
    {
      title: 'カテゴリー別',
      name: 'categoryAsc',
      by: [
        { field: categoryField, direction: 'asc' as const },
        { field: dateField, direction: 'desc' as const }
      ]
    }
  ]
}

/**
 * 固定ページ用プレビュー設定のヘルパー
 */
export function createPagePreviewConfig(
  titleField = 'title',
  slugField = 'slug'
) {
  return {
    select: {
      title: titleField,
      slug: slugField
    },
    prepare(selection: any) {
      const { title, slug } = selection

      return {
        title: title || '無題',
        subtitle: `/${slug?.current || 'スラッグ未設定'}`,
        media: undefined
      }
    }
  }
}

/**
 * 固定ページ用並び順設定のヘルパー
 */
export function createPageOrderings(titleField = 'title') {
  return [
    {
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{ field: titleField, direction: 'asc' as const }]
    }
  ]
}