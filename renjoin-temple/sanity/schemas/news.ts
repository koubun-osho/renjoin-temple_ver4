import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'news',
  title: 'お知らせ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: 'お知らせのタイトルを入力してください',
      validation: (Rule) => Rule.required().max(100).error('タイトルは必須です（100文字以内）')
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
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
      description: 'お知らせの公開日時を設定してください',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error('公開日は必須です')
    }),
    defineField({
      name: 'category',
      title: 'カテゴリー',
      type: 'string',
      description: 'お知らせのカテゴリーを選択してください',
      options: {
        list: [
          { title: '法要', value: 'service' },
          { title: 'イベント', value: 'event' },
          { title: 'お知らせ', value: 'notice' },
          { title: 'その他', value: 'other' }
        ],
        layout: 'radio'
      },
      initialValue: 'notice',
      validation: (Rule) => Rule.required().error('カテゴリーは必須です')
    }),
    defineField({
      name: 'priority',
      title: '重要度',
      type: 'string',
      description: 'お知らせの重要度を選択してください',
      options: {
        list: [
          { title: '高', value: 'high' },
          { title: '中', value: 'medium' },
          { title: '低', value: 'low' }
        ],
        layout: 'radio'
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required().error('重要度は必須です')
    }),
    defineField({
      name: 'content',
      title: '内容',
      type: 'array',
      description: 'お知らせの内容を入力してください',
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
              description: '画像の代替テキスト',
              validation: (Rule) => Rule.required().warning('代替テキストの設定を推奨します')
            }),
            defineField({
              name: 'caption',
              title: 'キャプション',
              type: 'string',
              description: '画像のキャプション（任意）'
            })
          ]
        }
      ],
      validation: (Rule) => Rule.required().error('内容は必須です')
    }),
    defineField({
      name: 'eventDate',
      title: 'イベント日時',
      type: 'datetime',
      description: 'イベント系のお知らせの場合、開催日時を設定してください',
      hidden: ({ document }) => document?.category !== 'event'
    }),
    defineField({
      name: 'eventLocation',
      title: '開催場所',
      type: 'string',
      description: 'イベント系のお知らせの場合、開催場所を入力してください',
      hidden: ({ document }) => document?.category !== 'event',
      validation: (Rule) => Rule.custom((value, context) => {
        const category = context.document?.category
        if (category === 'event' && !value) {
          return 'イベントの場合、開催場所は必須です'
        }
        return true
      })
    })
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      priority: 'priority',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { title, category, priority, publishedAt } = selection
      
      // カテゴリーの日本語表示
      const categoryLabels: Record<string, string> = {
        service: '法要',
        event: 'イベント',
        notice: 'お知らせ',
        other: 'その他'
      }
      
      // 重要度の絵文字
      const priorityIcons: Record<string, string> = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
      }
      
      const formattedDate = publishedAt 
        ? new Date(publishedAt).toLocaleDateString('ja-JP')
        : '未設定'
      
      const categoryLabel = categoryLabels[category] || category || '未分類'
      const priorityIcon = priorityIcons[priority] || '⚪'
      
      return {
        title: title || '無題',
        subtitle: `${priorityIcon} ${categoryLabel} - ${formattedDate}`,
        media: undefined
      }
    }
  },
  orderings: [
    {
      title: '重要度・公開日順',
      name: 'priorityAndDate',
      by: [
        { field: 'priority', direction: 'asc' },
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: '公開日（新しい順）',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: '公開日（古い順）',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }]
    },
    {
      title: 'カテゴリー別',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'publishedAt', direction: 'desc' }
      ]
    }
  ],
  groups: [
    {
      name: 'content',
      title: 'コンテンツ',
      default: true
    },
    {
      name: 'settings',
      title: '設定'
    },
    {
      name: 'event',
      title: 'イベント詳細'
    }
  ],
  fieldsets: [
    {
      name: 'metadata',
      title: 'メタデータ',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'eventDetails',
      title: 'イベント詳細',
      options: { collapsible: true, collapsed: true }
    }
  ]
})