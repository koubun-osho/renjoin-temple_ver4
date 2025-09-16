import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: '固定ページ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'ページタイトル',
      type: 'string',
      description: 'ページのタイトルを入力してください',
      validation: (Rule) => Rule.required().max(100).error('ページタイトルは必須です（100文字以内）')
    }),
    defineField({
      name: 'slug',
      title: 'URLスラッグ',
      type: 'slug',
      description: 'URLに使用されるスラッグ（自動生成されます）',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required().error('スラッグは必須です')
    }),
    defineField({
      name: 'description',
      title: 'ページ説明（SEO用）',
      type: 'text',
      description: '検索エンジンやSNSで表示されるページの説明文です',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('SEO向けには160文字以内が推奨です')
    }),
    defineField({
      name: 'order',
      title: '表示順',
      type: 'number',
      description: 'ナビゲーションメニューでの表示順序（小さい数字が先に表示されます）',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(100).error('0から100の間で設定してください')
    }),
    defineField({
      name: 'showInNavigation',
      title: 'ナビゲーションに表示',
      type: 'boolean',
      description: 'ヘッダーナビゲーションメニューに表示するかどうか',
      initialValue: true
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      description: 'ページの本文を入力してください',
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
                    validation: (Rule) => Rule.uri({
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
            defineField({
              name: 'alt',
              title: '代替テキスト',
              type: 'string',
              description: '画像の代替テキスト（アクセシビリティ向上のため）',
              validation: (Rule) => Rule.required().warning('代替テキストの設定を推奨します')
            }),
            defineField({
              name: 'caption',
              title: 'キャプション',
              type: 'string',
              description: '画像のキャプション（任意）'
            })
          ]
        },
        {
          // カスタムコンポーネント: アクセス情報
          type: 'object',
          name: 'accessInfo',
          title: 'アクセス情報',
          fields: [
            defineField({
              name: 'address',
              title: '住所',
              type: 'string',
              description: '正式な住所を入力してください'
            }),
            defineField({
              name: 'phone',
              title: '電話番号',
              type: 'string',
              description: '電話番号を入力してください'
            }),
            defineField({
              name: 'email',
              title: 'メールアドレス',
              type: 'email',
              description: 'お問い合わせ用メールアドレス'
            }),
            defineField({
              name: 'hours',
              title: '受付時間',
              type: 'array',
              of: [{ type: 'string' }],
              description: '受付時間や参拝時間を入力してください'
            }),
            defineField({
              name: 'transportInfo',
              title: '交通アクセス',
              type: 'array',
              of: [{ type: 'string' }],
              description: '電車・バス・車でのアクセス方法'
            }),
            defineField({
              name: 'mapUrl',
              title: 'Google マップURL',
              type: 'url',
              description: 'Google マップのリンクURL'
            })
          ],
          preview: {
            select: {
              address: 'address',
              phone: 'phone'
            },
            prepare({ address, phone }) {
              return {
                title: 'アクセス情報',
                subtitle: `${address || '住所未設定'} / ${phone || '電話番号未設定'}`
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.required().error('本文は必須です')
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      description: 'ページの公開日時（省略可）',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'lastModified',
      title: '最終更新日',
      type: 'datetime',
      description: 'ページの最終更新日時（自動更新）',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      showInNavigation: 'showInNavigation',
      slug: 'slug'
    },
    prepare(selection) {
      const { title, order, showInNavigation, slug } = selection
      
      const navigationStatus = showInNavigation ? '📱 ナビ表示' : '🔒 ナビ非表示'
      const orderDisplay = order !== undefined ? `順序:${order}` : '順序:未設定'
      
      return {
        title: title || '無題',
        subtitle: `${navigationStatus} | ${orderDisplay} | /${slug?.current || 'スラッグ未設定'}`,
        media: undefined
      }
    }
  },
  orderings: [
    {
      title: '表示順',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: '最終更新日（新しい順）',
      name: 'lastModifiedDesc',
      by: [{ field: 'lastModified', direction: 'desc' }]
    },
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ],
  groups: [
    {
      name: 'content',
      title: 'コンテンツ',
      default: true
    },
    {
      name: 'seo',
      title: 'SEO設定'
    },
    {
      name: 'settings',
      title: '表示設定'
    }
  ],
  fieldsets: [
    {
      name: 'metadata',
      title: 'メタデータ',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'navigation',
      title: 'ナビゲーション設定',
      options: { collapsible: true, collapsed: true }
    }
  ]
})