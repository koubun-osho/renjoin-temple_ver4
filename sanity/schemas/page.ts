import { defineType } from 'sanity'
import {
  titleField,
  pageBodyField,
  metaDescriptionField,
  createSlugField,
  createPagePreviewConfig,
  createPageOrderings
} from './helpers/i18n'

/**
 * 固定ページスキーマ（多言語対応版）
 *
 * @sanity/document-internationalizationプラグインと連携し、
 * 日本語・英語の多言語対応を提供します。
 *
 * @created 2025-09-20 (多言語対応版)
 * @version 2.0.0
 */
export default defineType({
  name: 'page',
  title: '固定ページ',
  type: 'document',
  // 多言語対応アイコン
  icon: () => '📄',
  fields: [
    // ページタイトル（多言語対応）
    titleField,

    // URLスラッグ（多言語対応）
    createSlugField('title'),

    // 本文（多言語対応）
    pageBodyField,

    // メタディスクリプション（多言語対応）
    metaDescriptionField
  ],

  // プレビュー設定
  preview: createPagePreviewConfig(),

  // 並び順設定
  orderings: createPageOrderings()
})