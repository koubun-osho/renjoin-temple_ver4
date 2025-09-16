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
          { title: '行事案内', value: 'event' },
          { title: 'お知らせ', value: 'notice' },
          { title: '法要', value: 'service' }
        ],
        layout: 'radio'
      },
      initialValue: 'notice',
      validation: (Rule) => Rule.required().error('カテゴリーは必須です')
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
        }
      ],
      validation: (Rule) => Rule.required().error('内容は必須です')
    })
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
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
  },
  orderings: [
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
  ]
})