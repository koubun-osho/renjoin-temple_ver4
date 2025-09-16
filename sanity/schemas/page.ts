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
        }
      ],
      validation: (Rule) => Rule.required().error('本文は必須です')
    }),
    defineField({
      name: 'metaDescription',
      title: 'メタディスクリプション',
      type: 'text',
      description: '検索エンジンやSNSで表示されるページの説明文です',
      rows: 2,
      validation: (Rule) => Rule.max(160).warning('SEO向けには160文字以内が推奨です')
    })
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug'
    },
    prepare(selection) {
      const { title, slug } = selection

      return {
        title: title || '無題',
        subtitle: `/${slug?.current || 'スラッグ未設定'}`,
        media: undefined
      }
    }
  },
  orderings: [
    {
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})