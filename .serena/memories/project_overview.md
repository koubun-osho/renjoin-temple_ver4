# 蓮城院公式サイト プロジェクト概要

## プロジェクト名
蓮城院公式サイト兼副住職ブログ（MVP版）

## 技術スタック
- **フロントエンド**: Next.js 15.5.3 + React 19.1.0 + TypeScript
- **スタイリング**: Tailwind CSS v4
- **CMS**: Sanity v4.8.1 (Headless CMS)
- **デプロイ**: Vercel (予定)
- **分析**: Google Analytics 4

## プロジェクト構造
```
/Users/koubun/Desktop/AIコーディング/Claude_code/蓮城院HP_ver4/
├── renjoin-temple/ (メインアプリケーション)
│   ├── src/ (Next.jsアプリケーション)
│   ├── sanity/ (Sanity CMS設定)
│   ├── public/ (静的ファイル)
│   └── lib/ (ユーティリティ)
├── sanity/ (Sanity Studio用)
└── docs/ (要件定義書、設計書等)
```

## セキュリティ最優先事項
- 環境変数の適切な管理（.env.local使用、.gitignore除外）
- XSS対策（DOMPurify等によるサニタイズ）
- Sanity APIトークンの秘匿管理
- 機密情報のハードコード禁止

## 主要機能（MVP範囲）
1. ブログ記事管理・表示
2. お知らせ管理・表示  
3. 固定ページ（由緒、年間行事等）
4. トップページ（統合表示）