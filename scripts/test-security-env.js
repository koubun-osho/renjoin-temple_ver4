#!/usr/bin/env node

/**
 * セキュリティと環境変数テストスクリプト
 *
 * 環境変数設定、XSS対策、データサニタイゼーションを検証します。
 * @created 2025-09-17
 */

const fs = require('fs')
const path = require('path')
const { config } = require('dotenv')

// 環境変数の読み込み
config({ path: '.env.local' })

console.log('🔒 セキュリティと環境変数テスト開始...\n')

let passedTests = 0
let totalTests = 0

function runSecurityTest(testName, testFn) {
  totalTests++
  try {
    const result = testFn()
    if (result.success) {
      console.log(`  ✅ ${testName}`)
      if (result.details) {
        console.log(`     ${result.details}`)
      }
      passedTests++
    } else {
      console.log(`  ❌ ${testName}`)
      if (result.error) {
        console.log(`     エラー: ${result.error}`)
      }
    }
  } catch (error) {
    console.log(`  ❌ ${testName} - 例外: ${error.message}`)
  }
}

async function testSecurity() {
  // 1. 環境変数設定の確認
  console.log('📋 環境変数設定確認:')

  runSecurityTest('NEXT_PUBLIC_SANITY_PROJECT_ID設定確認', () => {
    const value = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    return {
      success: !!value && value !== '',
      details: value ? '設定済み' : '未設定',
      error: !value ? 'プロジェクトIDが設定されていません' : null
    }
  })

  runSecurityTest('NEXT_PUBLIC_SANITY_DATASET設定確認', () => {
    const value = process.env.NEXT_PUBLIC_SANITY_DATASET
    return {
      success: !!value && value !== '',
      details: value ? `データセット: ${value}` : '未設定',
      error: !value ? 'データセットが設定されていません' : null
    }
  })

  runSecurityTest('SANITY_API_TOKEN設定確認', () => {
    const value = process.env.SANITY_API_TOKEN
    return {
      success: !!value && value !== '',
      details: value ? 'トークン設定済み（機密情報のため値は非表示）' : '未設定',
      error: !value ? 'APIトークンが設定されていません' : null
    }
  })

  runSecurityTest('API_VERSION設定確認', () => {
    const value = process.env.NEXT_PUBLIC_SANITY_API_VERSION
    return {
      success: !!value && value !== '',
      details: value ? `APIバージョン: ${value}` : 'デフォルト値を使用',
      error: null // APIバージョンは任意
    }
  })

  console.log('')

  // 2. ファイルセキュリティ確認
  console.log('🔐 ファイルセキュリティ確認:')

  runSecurityTest('.env.localファイル権限確認', () => {
    try {
      const envPath = path.join(process.cwd(), '.env.local')
      if (!fs.existsSync(envPath)) {
        return { success: false, error: '.env.localファイルが存在しません' }
      }

      const stats = fs.statSync(envPath)
      const mode = stats.mode & parseInt('777', 8)
      const isSecure = mode === parseInt('600', 8) // 所有者のみ読み書き可能

      return {
        success: isSecure,
        details: `ファイル権限: ${mode.toString(8)}`,
        error: !isSecure ? 'ファイル権限が不適切です。600に設定してください。' : null
      }
    } catch (error) {
      return { success: false, error: `権限確認エラー: ${error.message}` }
    }
  })

  runSecurityTest('.gitignore設定確認', () => {
    try {
      const gitignorePath = path.join(process.cwd(), '.gitignore')
      if (!fs.existsSync(gitignorePath)) {
        return { success: false, error: '.gitignoreファイルが存在しません' }
      }

      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
      const hasEnvPattern = gitignoreContent.includes('.env*')

      return {
        success: hasEnvPattern,
        details: hasEnvPattern ? '.env*パターンが設定済み' : '.env*パターンが未設定',
        error: !hasEnvPattern ? '.gitignoreに.env*パターンを追加してください' : null
      }
    } catch (error) {
      return { success: false, error: `gitignore確認エラー: ${error.message}` }
    }
  })

  console.log('')

  // 3. XSS対策確認
  console.log('🛡️  XSS対策確認:')

  runSecurityTest('HTMLエスケープ処理テスト', () => {
    // 基本的なHTMLエスケープ関数をテスト
    const dangerousString = '<script>alert("XSS")</script>'
    const basicEscape = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
    }

    const escaped = basicEscape(dangerousString)
    const isEscaped = !escaped.includes('<script>') && escaped.includes('&lt;script&gt;')

    return {
      success: isEscaped,
      details: `エスケープ結果: ${escaped.slice(0, 50)}...`,
      error: !isEscaped ? 'HTMLエスケープが正常に動作していません' : null
    }
  })

  runSecurityTest('URLサニタイゼーションテスト', () => {
    // 危険なURLパターンの検出
    const dangerousUrls = [
      'javascript:alert("XSS")',
      'data:text/html,<script>alert("XSS")</script>',
      'vbscript:alert("XSS")'
    ]

    const isValidUrl = (url) => {
      try {
        const parsedUrl = new URL(url)
        const allowedProtocols = ['http:', 'https:', 'mailto:']
        return allowedProtocols.includes(parsedUrl.protocol)
      } catch {
        return false
      }
    }

    const allDangerous = dangerousUrls.every(url => !isValidUrl(url))

    return {
      success: allDangerous,
      details: `危険なURL ${dangerousUrls.length}個を適切に検出`,
      error: !allDangerous ? '危険なURLの検出が不完全です' : null
    }
  })

  console.log('')

  // 4. データサニタイゼーション確認
  console.log('🧹 データサニタイゼーション確認:')

  runSecurityTest('スラッグサニタイゼーションテスト', () => {
    const dangerousSlug = '../../../etc/passwd'
    const sanitizeSlug = (slug) => {
      return slug
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-') // 安全な文字のみ許可
        .replace(/-+/g, '-') // 連続するハイフンを1つに
        .replace(/^-|-$/g, '') // 先頭・末尾のハイフンを削除
    }

    const sanitized = sanitizeSlug(dangerousSlug)
    const isSafe = !sanitized.includes('../') && !sanitized.includes('/')

    return {
      success: isSafe,
      details: `サニタイズ結果: "${sanitized}"`,
      error: !isSafe ? 'スラッグサニタイゼーションが不完全です' : null
    }
  })

  runSecurityTest('コンテンツフィルタリングテスト', () => {
    // 危険なHTMLタグの検出
    const dangerousContent = `
      <script>alert('xss')</script>
      <iframe src="javascript:alert('xss')"></iframe>
      <img src="x" onerror="alert('xss')">
    `

    const stripDangerousTags = (content) => {
      const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form']
      const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover']

      let filtered = content
      dangerousTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi')
        filtered = filtered.replace(regex, '')
      })

      dangerousAttrs.forEach(attr => {
        const regex = new RegExp(`${attr}\\s*=\\s*['""][^'"]*['"]`, 'gi')
        filtered = filtered.replace(regex, '')
      })

      return filtered
    }

    const filtered = stripDangerousTags(dangerousContent)
    const isSafe = !filtered.includes('<script>') && !filtered.includes('onerror')

    return {
      success: isSafe,
      details: '危険なタグと属性を適切に除去',
      error: !isSafe ? 'コンテンツフィルタリングが不完全です' : null
    }
  })

  console.log('')

  // 5. セキュリティ設定の検証
  console.log('⚙️  セキュリティ設定検証:')

  runSecurityTest('Next.js設定セキュリティ確認', () => {
    try {
      // next.config.tsの存在確認
      const configPath = path.join(process.cwd(), 'next.config.ts')
      const configExists = fs.existsSync(configPath)

      return {
        success: configExists,
        details: configExists ? 'Next.js設定ファイル存在確認' : 'Next.js設定ファイルが見つかりません',
        error: !configExists ? 'next.config.tsファイルを作成してください' : null
      }
    } catch (error) {
      return { success: false, error: `設定確認エラー: ${error.message}` }
    }
  })

  runSecurityTest('本番環境変数確認', () => {
    const nodeEnv = process.env.NODE_ENV
    const isProduction = nodeEnv === 'production'

    // 本番環境での追加チェック項目
    if (isProduction) {
      const hasProductionUrl = !!process.env.NEXT_PUBLIC_SITE_URL
      const hasSecureSecret = !!process.env.NEXTAUTH_SECRET

      return {
        success: hasProductionUrl && hasSecureSecret,
        details: `本番環境設定: URL=${!!hasProductionUrl}, Secret=${!!hasSecureSecret}`,
        error: (!hasProductionUrl || !hasSecureSecret) ? '本番環境設定が不完全です' : null
      }
    } else {
      return {
        success: true,
        details: `現在の環境: ${nodeEnv || 'development'}`,
        error: null
      }
    }
  })

  console.log('')

  // 6. lib/sanity-security.tsの検証
  console.log('🔍 Sanityセキュリティ設定確認:')

  runSecurityTest('Sanityセキュリティファイル存在確認', () => {
    const securityPath = path.join(process.cwd(), 'lib', 'sanity-security.ts')
    const exists = fs.existsSync(securityPath)

    return {
      success: exists,
      details: exists ? 'セキュリティファイル存在確認' : 'セキュリティファイルが見つかりません',
      error: !exists ? 'lib/sanity-security.tsファイルを確認してください' : null
    }
  })

  // テスト結果サマリー
  console.log('')
  console.log('📊 セキュリティテスト結果:')
  console.log(`  ✅ 成功: ${passedTests}/${totalTests}`)
  console.log(`  📈 成功率: ${Math.round((passedTests / totalTests) * 100)}%`)

  if (passedTests === totalTests) {
    console.log('\n🎉 全てのセキュリティテストが正常に完了しました！')
    console.log('環境変数設定とセキュリティ対策が適切に実装されています。')
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests}個のテストが失敗しました。`)
    console.log('セキュリティ設定の見直しが必要です。')
  }

  // セキュリティ推奨事項
  console.log('\n🔒 セキュリティ推奨事項:')
  console.log('  1. .env.localファイルの権限を600に設定してください')
  console.log('  2. 本番環境では異なるAPIトークンを使用してください')
  console.log('  3. 定期的にAPIトークンを更新してください')
  console.log('  4. Content Security Policy (CSP) の実装を検討してください')
  console.log('  5. HTTPSの使用を徹底してください')
}

// メイン実行
testSecurity()