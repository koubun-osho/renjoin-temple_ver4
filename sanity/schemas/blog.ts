import { defineType } from 'sanity'
import {
  titleField,
  excerptField,
  bodyField,
  mainImageField,
  publishedAtField,
  createSlugField,
  createPreviewConfig,
  createOrderings
} from './helpers/i18n'

/**
 * ブログ記事スキーマ（多言語対応版）
 *
 * @sanity/document-internationalizationプラグインと連携し、
 * 日本語・英語の多言語対応を提供します。
 *
 * @created 2025-09-20 (多言語対応版)
 * @version 2.0.0
 */
export default defineType({
  name: 'blog',
  title: 'ブログ記事',
  type: 'document',
  // 多言語対応アイコン
  icon: () => '📝',
  fields: [
    // タイトル（多言語対応）
    titleField,

    // URLスラッグ（多言語対応）
    createSlugField('title'),

    // 公開日（共通）
    publishedAtField,

    // 概要（多言語対応）
    excerptField,

    // メイン画像（代替テキストが多言語対応）
    mainImageField,

    // 本文（多言語対応）
    bodyField
  ],

  // プレビュー設定
  preview: createPreviewConfig(),

  // 並び順設定
  orderings: createOrderings()
})