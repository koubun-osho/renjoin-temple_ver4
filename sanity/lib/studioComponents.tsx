/**
 * 蓮城院公式サイト Sanity Studio カスタムコンポーネント
 *
 * Sanity Studioの外観を蓮城院の雰囲気に合わせてカスタマイズするコンポーネントです。
 * 日本の寺院らしい落ち着いた配色と、使いやすいインターフェースを提供します。
 *
 * @created 2025-09-16
 * @version 1.0.0
 */

import React from 'react'
import {Box, Card, Flex, Text} from '@sanity/ui'

/**
 * カスタムロゴコンポーネント
 * Sanity Studioのヘッダーに表示される蓮城院のロゴ
 */
export function CustomLogo() {
  return (
    <Flex align="center" gap={2}>
      {/* 蓮の花のアイコン（Unicode絵文字使用） */}
      <Box>
        <Text size={3}>🪷</Text>
      </Box>

      {/* サイト名 */}
      <Box>
        <Text size={2} weight="bold" style={{color: '#2D4A3E'}}>
          蓮城院
        </Text>
        <Text size={1} style={{color: '#6B7280', display: 'block', lineHeight: '1.2'}}>
          CMS
        </Text>
      </Box>
    </Flex>
  )
}

/**
 * カスタムナビゲーションバー
 * 使いやすさを向上させるためのナビゲーション要素
 */
export function CustomNavbar() {
  return (
    <Card padding={3} tone="primary" style={{borderBottom: '1px solid #E5E7EB'}}>
      <Flex justify="space-between" align="center">
        <CustomLogo />

        <Box>
          <Text size={1} style={{color: '#6B7280'}}>
            蓮城院公式サイト コンテンツ管理
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}

/**
 * ウェルカムメッセージ
 * 初回ユーザー向けの案内メッセージ
 */
export function WelcomeMessage() {
  return (
    <Card padding={4} radius={2} shadow={1} tone="positive">
      <Flex direction="column" gap={3}>
        <Text size={2} weight="bold">
          🙏 蓮城院CMS へようこそ
        </Text>

        <Text size={1} style={{lineHeight: '1.6', color: '#374151'}}>
          このシステムで以下のコンテンツを管理できます：
        </Text>

        <Box style={{paddingLeft: '1rem'}}>
          <Text size={1} style={{display: 'block', marginBottom: '0.5rem', color: '#4B5563'}}>
            📝 <strong>ブログ記事</strong> - 副住職の法話や日々の記録
          </Text>
          <Text size={1} style={{display: 'block', marginBottom: '0.5rem', color: '#4B5563'}}>
            📢 <strong>お知らせ</strong> - 法要案内や寺院からの重要な情報
          </Text>
          <Text size={1} style={{display: 'block', marginBottom: '0.5rem', color: '#4B5563'}}>
            📄 <strong>固定ページ</strong> - 寺院の由緒やアクセス情報
          </Text>
        </Box>

        <Text size={1} style={{color: '#6B7280', fontStyle: 'italic'}}>
          左側のメニューから各コンテンツの管理画面にアクセスできます。
        </Text>
      </Flex>
    </Card>
  )
}

/**
 * カスタムフッター
 * 著作権情報とサポート情報
 */
export function CustomFooter() {
  return (
    <Card padding={3} tone="transparent" style={{borderTop: '1px solid #E5E7EB'}}>
      <Flex justify="center" align="center">
        <Text size={0} style={{color: '#9CA3AF', textAlign: 'center'}}>
          © 2024 蓮城院 - Content Management System
          <br />
          Powered by Sanity CMS
        </Text>
      </Flex>
    </Card>
  )
}

/**
 * スタイルテーマ定義
 * 蓮城院らしい落ち着いた配色テーマ
 */
export const templeTheme = {
  colors: {
    // メインカラー：深い緑（寺院の落ち着き）
    primary: '#2D4A3E',

    // アクセントカラー：金色（仏具の色）
    accent: '#D4AF37',

    // ベースカラー：クリーム色（和紙の色）
    background: '#FEFDF8',

    // テキストカラー：墨色
    text: '#1F2937',

    // グレートーン
    muted: '#6B7280',
    subtle: '#9CA3AF',
  },

  // カスタムCSS（Sanity UIに適用）
  customStyles: `
    /* メインナビゲーションのカスタマイズ */
    [data-ui="NavBar"] {
      background: linear-gradient(135deg, #2D4A3E 0%, #3B5F4F 100%);
      border-bottom: 2px solid #D4AF37;
    }

    /* サイドバーのカスタマイズ */
    [data-ui="Pane"]:first-child {
      background: #FEFDF8;
      border-right: 1px solid #E5E7EB;
    }

    /* ドキュメントリストのカスタマイズ */
    [data-ui="MenuItem"] {
      transition: all 0.2s ease;
    }

    [data-ui="MenuItem"]:hover {
      background: rgba(45, 74, 62, 0.05);
      transform: translateX(2px);
    }

    /* 作成ボタンのカスタマイズ */
    [data-ui="Button"][data-tone="primary"] {
      background: linear-gradient(135deg, #2D4A3E 0%, #3B5F4F 100%);
      border: none;
    }

    [data-ui="Button"][data-tone="primary"]:hover {
      background: linear-gradient(135deg, #3B5F4F 0%, #2D4A3E 100%);
    }
  `
}

/**
 * 使用方法の説明
 *
 * これらのコンポーネントを使用するには、sanity.config.tsで以下のように設定します：
 *
 * import { CustomLogo, CustomNavbar } from './sanity/lib/studioComponents'
 *
 * export default defineConfig({
 *   // ... その他の設定
 *   studio: {
 *     components: {
 *       logo: CustomLogo,
 *       navbar: CustomNavbar,
 *     }
 *   }
 * })
 */