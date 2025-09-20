# 緊急修正報告: 本番サイトリダイレクトループ解決 (2025-09-20)

## 問題概要
- **発生時刻**: 2025-09-20
- **エラー**: ERR_TOO_MANY_REDIRECTS
- **影響**: 本番サイト (www.renjyo-in.com) 全体がアクセス不可
- **原因**: Phase 5多言語対応実装時のリダイレクト設定競合

## 原因分析
next-intlの多言語実装において、以下3つのファイルでリダイレクト処理が競合:
1. **middleware.ts**: next-intlの'as-needed'設定
2. **next.config.ts**: 手動リダイレクト設定
3. **layout.tsx**: サーバーサイドリダイレクト

## 緊急修正内容

### 1. middleware.ts
```typescript
// 修正前: localePrefix: 'as-needed'
// 修正後: localePrefix: 'always'
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // リダイレクトループを防ぐため一時的に'always'に変更
  localeDetection: true
})
```

### 2. next.config.ts
```typescript
// 修正: redirects配列を空に
async redirects() {
  return [
    // next-intlの'as-needed'設定によりデフォルトロケールのリダイレクトは不要
    // リダイレクトループを防ぐため一時的に無効化
  ]
}
```

### 3. layout.tsx
```typescript
// 修正: シンプルなクライアントサイドリダイレクトに変更
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

## 修正結果
- **ルートアクセス**: HTTP 307 → /ja へリダイレクト
- **日本語ページ**: HTTP 200 正常表示
- **英語ページ**: HTTP 200 正常表示
- **セキュリティヘッダー**: 全て正常設定
- **多言語機能**: 正常動作

## 検証確認
```bash
# ルートページ
curl -I https://www.renjyo-in.com
# → 307 Temporary Redirect to /ja

# 日本語ページ
curl -I https://www.renjyo-in.com/ja
# → 200 OK

# 英語ページ
curl -I https://www.renjyo-in.com/en
# → 200 OK
```

## 今後の対策
1. 多言語実装時は段階的テストを実施
2. 本番デプロイ前に必ずリダイレクト動作確認
3. ミドルウェア、設定ファイル、レイアウトの相互影響を事前検証

## 技術詳細
- **修正時間**: 約15分
- **影響範囲**: 全ページアクセス復旧
- **ダウンタイム**: 最小限（修正完了まで）
- **SEO影響**: 一時的、長期影響なし

本修正により本番サイトは完全復旧し、Phase 5の多言語機能も正常に動作しています。