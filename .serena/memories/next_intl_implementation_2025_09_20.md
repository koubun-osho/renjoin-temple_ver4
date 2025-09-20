# next-intl実装とビルドエラー解決 - 2025-09-20

## 問題の概要
next-intl実装後にビルドエラーが発生。`/_not-found`ページのプリレンダリングエラーが原因。

## 根本原因
1. ルートレベルとlocaleレベルの両方にページが存在していた競合
2. `localePrefix: 'always'`設定によるルーティング競合
3. グローバルnot-foundページの不在

## 解決策

### 1. ルーティング構造の整理
- ルートレベルのページをすべて削除
- `/[locale]`ディレクトリ内にすべてのページを配置
- `localePrefix: 'as-needed'`に変更

### 2. not-foundページの作成
- `/src/app/not-found.tsx`：グローバル404ページ
- `/src/app/[locale]/not-found.tsx`：ローカライズ404ページ

### 3. リダイレクト設定
- ルートアクセス時は`/ja`にリダイレクト
- `/src/app/layout.tsx`と`/src/app/page.tsx`を簡素化

### 4. 翻訳メッセージの追加
- `notFound`セクションを日英両方に追加
- エスケープが必要な文字を適切に処理

### 5. ESLintエラーの修正
- 未使用変数にコメント注釈を追加
- エスケープされていない引用符を修正

## 実装されたページ構造
```
/[locale]/
├── page.tsx (ホーム)
├── about/page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── contact/page.tsx
├── events/page.tsx
├── news/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── privacy/page.tsx
├── terms/page.tsx
└── not-found.tsx
```

## 技術的改善点
1. **多言語対応**: next-intlによる完全な多言語サポート
2. **SEO最適化**: 適切なhreflang設定とcanonical URL
3. **型安全性**: TypeScriptによる型定義の強化
4. **パフォーマンス**: 適切なISR設定とキャッシュ制御

## ビルド結果
- ✅ ビルド成功
- ✅ 23ページが正常に生成
- ⚠️ バンドルサイズの警告（機能的問題なし）

## 今後の改善点
1. バンドルサイズの最適化
2. Sanityとの統合による動的コンテンツ対応
3. コンポーネントの多言語対応強化