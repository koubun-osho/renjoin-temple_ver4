/**
 * 蓮城院公式サイト Sanity CMS セキュリティ設定
 *
 * このファイルは Sanity CMS のセキュリティ設定を管理します。
 * アクセス制御、データ検証、セキュリティポリシーを定義しています。
 *
 * @created 2025-09-16
 * @version 1.0.0
 * @security high
 */

/**
 * アクセス権限の定義
 * Sanity Studio へのアクセス権限をロール別に管理
 */
export const ACCESS_ROLES = {
  // 住職・管理者：全権限
  ADMIN: 'admin',
  // 副住職・編集者：コンテンツ編集権限
  EDITOR: 'editor',
  // 閲覧者：読み取り専用
  VIEWER: 'viewer',
} as const

export type AccessRole = typeof ACCESS_ROLES[keyof typeof ACCESS_ROLES]

/**
 * ドキュメント操作権限の設定
 * 各ロールがどのドキュメントに対してどの操作を実行できるかを定義
 */
export const DOCUMENT_PERMISSIONS = {
  [ACCESS_ROLES.ADMIN]: {
    // 管理者は全てのドキュメントに対して全操作が可能
    blog: ['create', 'read', 'update', 'delete', 'publish'],
    news: ['create', 'read', 'update', 'delete', 'publish'],
    page: ['create', 'read', 'update', 'delete', 'publish'],
  },
  [ACCESS_ROLES.EDITOR]: {
    // 編集者はドキュメントの作成・編集・公開が可能（削除は不可）
    blog: ['create', 'read', 'update', 'publish'],
    news: ['create', 'read', 'update', 'publish'],
    page: ['read', 'update'], // 固定ページは編集のみ（新規作成は管理者のみ）
  },
  [ACCESS_ROLES.VIEWER]: {
    // 閲覧者は読み取り専用
    blog: ['read'],
    news: ['read'],
    page: ['read'],
  },
} as const

/**
 * API セキュリティ設定
 * Sanity API の安全な使用のための設定
 */
export const API_SECURITY = {
  // 本番環境でのCDN使用設定
  useCdn: process.env.NODE_ENV === 'production',

  // APIバージョンを固定（セキュリティ強化）
  apiVersion: '2024-01-01',

  // 認証が必要な操作
  withCredentials: true,

  // タイムアウト設定（DoS攻撃対策）
  timeout: 10000, // 10秒

  // レート制限設定
  rateLimit: {
    // 1分間あたりの最大リクエスト数
    requestsPerMinute: 100,
    // バーストリクエストの許容数
    burstLimit: 20,
  },
} as const

/**
 * データ検証ルール
 * ユーザー入力の安全性を確保するためのバリデーションルール
 */
export const VALIDATION_RULES = {
  // 文字列フィールドの共通制限
  text: {
    maxLength: 10000, // 最大文字数
    minLength: 1,     // 最小文字数
    // 危険な文字列パターンをブロック
    forbiddenPatterns: [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // スクリプトタグ
      /javascript:/gi,                                        // JavaScript URL
      /data:text\/html/gi,                                   // Data URL
      /vbscript:/gi,                                         // VBScript URL
    ],
  },

  // タイトルフィールドの制限
  title: {
    maxLength: 200,
    minLength: 1,
    required: true,
  },

  // スラッグフィールドの制限
  slug: {
    // URL安全文字のみ許可
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    maxLength: 100,
    minLength: 1,
    required: true,
  },

  // 画像フィールドの制限
  image: {
    maxSizeMB: 5,           // 最大ファイルサイズ
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'], // 許可する画像形式
    maxDimension: 2048,     // 最大解像度（pixel）
  },
} as const

/**
 * XSS対策のためのサニタイゼーション関数
 * ユーザー入力を安全な形式に変換
 */
export function sanitizeText(input: string): string {
  if (!input) return ''

  // 危険なパターンを除去
  let sanitized = input

  VALIDATION_RULES.text.forbiddenPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  // HTML エンティティの変換
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  return sanitized
}

/**
 * スラッグの検証とサニタイゼーション
 * URL安全なスラッグを生成
 */
export function sanitizeSlug(input: string): string {
  if (!input) return ''

  return input
    .toLowerCase()                    // 小文字化
    .trim()                          // 前後の空白除去
    .replace(/[^\w\s-]/g, '')        // 英数字、空白、ハイフン以外を除去
    .replace(/\s+/g, '-')            // 空白をハイフンに変換
    .replace(/-+/g, '-')             // 連続するハイフンを1つに
    .replace(/^-|-$/g, '')           // 前後のハイフンを除去
    .substring(0, VALIDATION_RULES.slug.maxLength) // 長さ制限
}

/**
 * セキュリティヘッダーの設定
 * Sanity Studio に適用するセキュリティヘッダー
 */
export const SECURITY_HEADERS = {
  // XSS 保護
  'X-XSS-Protection': '1; mode=block',

  // コンテンツタイプ検出の無効化
  'X-Content-Type-Options': 'nosniff',

  // フレーム埋め込みの制限
  'X-Frame-Options': 'DENY',

  // リファラーポリシー
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sanity.io",
    "style-src 'self' 'unsafe-inline' *.sanity.io",
    "img-src 'self' data: *.sanity.io cdn.sanity.io",
    "font-src 'self' *.sanity.io",
    "connect-src 'self' *.sanity.io",
    "frame-ancestors 'none'",
  ].join('; '),
} as const

/**
 * 監査ログの設定
 * セキュリティイベントを記録するための設定
 */
export const AUDIT_SETTINGS = {
  // ログ対象の操作
  loggedOperations: [
    'create',
    'update',
    'delete',
    'publish',
    'unpublish',
    'login',
    'logout',
  ],

  // ログ保存期間（日数）
  retentionDays: 90,

  // 重要度レベル
  severityLevels: {
    LOW: 'low',       // 一般的な操作
    MEDIUM: 'medium', // 編集操作
    HIGH: 'high',     // 削除・公開操作
    CRITICAL: 'critical', // 設定変更・権限変更
  } as const,
} as const

/**
 * セキュリティ設定の検証
 * 設定が適切に行われているかチェック
 */
export function validateSecurityConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 環境変数の確認
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    errors.push('NEXT_PUBLIC_SANITY_PROJECT_ID が設定されていません')
  }

  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    errors.push('NEXT_PUBLIC_SANITY_DATASET が設定されていません')
  }

  if (!process.env.SANITY_API_TOKEN) {
    warnings.push('SANITY_API_TOKEN が設定されていません（読み取り専用の場合は問題ありません）')
  }

  // 本番環境での追加チェック
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_SECRET) {
      errors.push('本番環境では NEXTAUTH_SECRET の設定が必須です')
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      warnings.push('NEXT_PUBLIC_SITE_URL が設定されていません')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * セキュリティベストプラクティスの確認リスト
 * 運用時に確認すべき項目
 */
export const SECURITY_CHECKLIST = [
  '✅ Sanity API トークンは適切な権限（最小権限の原則）で設定されている',
  '✅ 本番環境と開発環境で異なるデータセットを使用している',
  '✅ NEXTAUTH_SECRET は十分に複雑で本番環境固有の値を使用している',
  '✅ .env.local ファイルが .gitignore に含まれている',
  '✅ Sanity プロジェクトのアクセス権限が適切に設定されている',
  '✅ CORS 設定が必要最小限のドメインのみを許可している',
  '✅ 定期的にAPI トークンを更新している',
  '✅ セキュリティアップデートを定期的に適用している',
] as const

/**
 * 使用方法
 *
 * このファイルの設定を有効にするには、以下の手順を実行してください：
 *
 * 1. sanity.config.ts で設定をインポート
 * 2. 環境変数の設定確認
 * 3. アクセス権限の適用
 * 4. セキュリティチェックリストの確認
 */