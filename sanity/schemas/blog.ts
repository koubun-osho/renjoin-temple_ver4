import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'ブログ記事',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: 'ブログ記事のタイトルを入力してください',
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
      description: '記事の公開日時を設定してください',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error('公開日は必須です')
    }),
    defineField({
      name: 'excerpt',
      title: '概要',
      type: 'text',
      description: '記事の概要や要約を入力してください（検索結果やSNSで表示されます）',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('概要は200文字以内が推奨です')
    }),
    defineField({
      name: 'author',
      title: '著者名',
      type: 'string',
      description: '記事の著者名を入力してください',
      initialValue: '副住職 荒木弘文',
      validation: (Rule) => Rule.max(50).warning('著者名は50文字以内が推奨です')
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      description: '記事に関連するタグを追加してください',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      validation: (Rule) => Rule.max(10).warning('タグは10個以内が推奨です')
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      description: '記事のメイン画像を設定してください',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette']
      },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          description: '画像の代替テキスト（アクセシビリティ向上のため）',
          validation: (Rule) => Rule.required().warning('代替テキストの設定を推奨します')
        })
      ]
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'array',
      description: '記事の本文を入力してください',
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
      validation: (Rule) => Rule.required().error('本文は必須です')
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { title, author, media, publishedAt } = selection
      const formattedDate = publishedAt 
        ? new Date(publishedAt).toLocaleDateString('ja-JP')
        : '未設定'
      
      return {
        title: title || '無題',
        subtitle: `${author || '著者未設定'} - ${formattedDate}`,
        media
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
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
})