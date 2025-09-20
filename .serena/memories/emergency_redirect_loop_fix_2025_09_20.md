# 緊急修正：本番サイトリダイレクトループエラー対応記録

## 発生状況
- **日時**: 2025-09-20
- **問題**: 本番サイト www.renjyo-in.com で "ERR_TOO_MANY_REDIRECTS" エラー
- **原因**: 多言語対応実装後のリダイレクト競合

## 根本原因分析
next-intl実装による複数のリダイレクト機能の競合：

1. **next.config.ts**: ルートパス(`/`) → `/ja` のリダイレクト設定
2. **next-intl middleware**: `localePrefix: 'as-needed'` 設定により `/ja` → `/` への逆リダイレクト
3. **ルートlayout.tsx**: サーバーサイドでの `/ja` へのリダイレクト

この3つが組み合わさって無限リダイレクトループが発生。

## 実施した緊急修正

### 1. next.config.ts修正
```typescript
// 修正前
async redirects() {
  return [
    {
      source: '/',
      destination: '/ja',
      permanent: false,
    },
  ]
}

// 修正後
async redirects() {
  return [
    // リダイレクトループを防ぐため一時的に無効化
  ]
}
```

### 2. middleware.ts修正
```typescript
// 修正前
localePrefix: 'as-needed',

// 修正後
localePrefix: 'always', // リダイレクトループを防ぐため一時的に変更
```

### 3. ルートlayout.tsx修正
```typescript
// 修正前：サーバーサイドリダイレクト
import { redirect } from 'next/navigation'
export default function RootLayout() {
  redirect('/ja')
}

// 修正後：クライアントサイドリダイレクト
export default function RootLayout() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/ja" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: 'window.location.href = "/ja";'
        }} />
      </body>
    </html>
  )
}
```

### 4. matcher設定の簡素化
```typescript
// 修正前
matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  '/(ja|en)/:path*'
]

// 修正後
matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
]
```

## 修正結果
- 本番サイトのリダイレクトループエラーを解決
- 多言語機能は維持（常にロケールプレフィックス付きURL）
- セキュリティヘッダーは引き続き適用

## 今後の改善提案

### フェーズ1: 安定化（即座に実施）
- 本番環境での動作確認
- エラーログの監視
- ユーザー影響の確認

### フェーズ2: 最適化（次の開発サイクル）
- `localePrefix: 'as-needed'` への復帰検討
- URLの美化（日本語サイトでは `/ja` プレフィックスなし）
- パフォーマンス最適化

### フェーズ3: 機能拡張
- 言語自動検出の改善
- SEO最適化（hreflang等）
- アクセシビリティ向上

## 学習事項
1. next-intlとNext.jsのリダイレクト機能は慎重な設計が必要
2. 本番環境でのテストが重要
3. 段階的なデプロイ戦略の必要性
4. 緊急時対応手順の明文化の重要性

## 関連ファイル
- `/next.config.ts`
- `/src/middleware.ts`
- `/src/app/layout.tsx`
- `/src/i18n.ts`

## コミット情報
- Hash: ab8f14f
- Message: "URGENT FIX: 本番サイトのリダイレクトループエラーを修正"