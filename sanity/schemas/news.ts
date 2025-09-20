import { defineType } from 'sanity'
import {
  titleField,
  contentField,
  categoryField,
  publishedAtField,
  createSlugField,
  createNewsPreviewConfig,
  createNewsOrderings
} from './helpers/i18n'

/**
 * お知らせスキーマ（多言語対応版）
 *
 * @sanity/document-internationalizationプラグインと連携し、
 * 日本語・英語の多言語対応を提供します。
 *
 * @created 2025-09-20 (多言語対応版)
 * @version 2.0.0
 */
export default defineType({
  name: 'news',
  title: 'お知らせ',
  type: 'document',
  // 多言語対応アイコン
  icon: () => '📢',
  fields: [
    // タイトル（多言語対応）
    titleField,

    // URLスラッグ（多言語対応）
    createSlugField('title'),

    // 公開日（共通）
    publishedAtField,

    // カテゴリー（共通 - 値は変わらないが表示ラベルは多言語対応）
    categoryField,

    // 内容（多言語対応）
    contentField
  ],

  // プレビュー設定
  preview: createNewsPreviewConfig(),

  // 並び順設定
  orderings: createNewsOrderings()
})