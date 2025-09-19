/**
 * 蓮城院公式サイト サニタイゼーション処理
 *
 * DOMPurifyを使用した堅牢なXSS対策処理
 * Sanityから取得したコンテンツの安全な表示を担保します。
 * 要件定義書.md section 3.1 セキュリティ要件に完全準拠
 *
 * @created 2025-09-17
 * @version 2.0.0 セキュリティ強化版（DOMPurify実装）
 */

// 動的インポート用のキャッシュ
let purifyInstance: typeof import('dompurify')['default'] | null = null

// DOMPurifyとJSDOMを動的にロードする関数
async function getPurify() {
  if (purifyInstance) {
    return purifyInstance
  }

  if (typeof window !== 'undefined') {
    // ブラウザ環境
    const DOMPurify = (await import('dompurify')).default
    purifyInstance = DOMPurify
  } else {
    // サーバーサイド環境
    const [DOMPurify, jsdomModule] = await Promise.all([
      import('dompurify'),
      import('jsdom')
    ])
    const { JSDOM } = jsdomModule
    const window = new JSDOM('').window as unknown as Window & typeof globalThis
    purifyInstance = DOMPurify.default(window)
  }

  return purifyInstance
}

// セキュリティ設定
const SECURITY_CONFIG = {
  // 許可するHTMLタグ
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'i', 'b', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption'] as string[],
  // 許可する属性
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'] as string[],
  // 許可するプロトコル
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?):|mailto:|tel:|#|\/)/i
}

/**
 * HTMLエスケープ関数（フォールバック用）
 * DOMPurifyが利用できない場合の基本的なHTMLエスケープ
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * DOMPurifyを使用した堅牢なHTMLサニタイゼーション
 * @param html - サニタイズ対象のHTML文字列
 * @param options - サニタイゼーションオプション
 * @returns サニタイズ済みのHTML文字列
 */
export async function sanitizeHtmlWithDOMPurify(
  html: string,
  options: {
    allowedTags?: string[]
    allowedAttributes?: string[]
    allowLinks?: boolean
    allowImages?: boolean
  } = {}
): Promise<string> {
  if (!html || typeof html !== 'string') {
    return ''
  }

  try {
    const purify = await getPurify()

    const config = {
      ALLOWED_TAGS: options.allowedTags || [...SECURITY_CONFIG.ALLOWED_TAGS],
      ALLOWED_ATTR: options.allowedAttributes || [...SECURITY_CONFIG.ALLOWED_ATTR],
      ALLOWED_URI_REGEXP: SECURITY_CONFIG.ALLOWED_URI_REGEXP,
      FORBID_SCRIPTS: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      SANITIZE_DOM: true
    }

    // リンクを無効にする場合
    if (!options.allowLinks) {
      config.ALLOWED_TAGS = config.ALLOWED_TAGS.filter(tag => tag !== 'a')
    }

    // 画像を無効にする場合
    if (!options.allowImages) {
      config.ALLOWED_TAGS = config.ALLOWED_TAGS.filter(tag => tag !== 'img')
    }

    const clean = purify.sanitize(html, config)
    return typeof clean === 'string' ? clean : ''
  } catch (error) {
    console.error('DOMPurify sanitization failed:', error)
    // フォールバック: HTMLエスケープ
    return escapeHtml(html)
  }
}

/**
 * プレーンテキストをサニタイズする（同期版）
 * @param text - サニタイズ対象のテキスト
 * @returns サニタイズ済みのテキスト
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    // HTMLタグを除去し、エンティティをエスケープ
    const withoutTags = text.replace(/<[^>]*>/g, '')
    return escapeHtml(withoutTags.trim())
  } catch (error) {
    console.error('Text sanitization failed:', error)
    return ''
  }
}

/**
 * プレーンテキストをサニタイズする（非同期版・DOMPurify使用）
 * @param text - サニタイズ対象のテキスト
 * @returns サニタイズ済みのテキスト
 */
export async function sanitizeTextAsync(text: string): Promise<string> {
  if (!text || typeof text !== 'string') {
    return ''
  }

  try {
    const purify = await getPurify()

    // DOMPurifyを使用してHTMLタグを完全に除去
    const cleaned = purify.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false
    })

    return typeof cleaned === 'string' ? cleaned.trim() : ''
  } catch (error) {
    console.error('Text sanitization failed:', error)
    // フォールバック: HTMLタグを除去し、エンティティをエスケープ
    const withoutTags = text.replace(/<[^>]*>/g, '')
    return escapeHtml(withoutTags.trim())
  }
}

/**
 * URLをサニタイズする（同期版）
 * @param url - サニタイズ対象のURL
 * @returns サニタイズ済みのURL、無効な場合は空文字
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  try {
    const cleanUrl = url.trim()

    // 危険なプロトコルのチェック
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']
    const lowerUrl = cleanUrl.toLowerCase()

    for (const protocol of dangerousProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        console.warn(`Dangerous protocol detected and blocked: ${protocol}`)
        return ''
      }
    }

    // 許可されたプロトコル・パターンのチェック
    if (SECURITY_CONFIG.ALLOWED_URI_REGEXP.test(cleanUrl)) {
      return cleanUrl
    }

    console.warn(`URL blocked by security policy: ${url}`)
    return ''
  } catch (error) {
    console.error('URL sanitization failed:', error)
    return ''
  }
}

/**
 * URLをサニタイズする（非同期版・DOMPurify使用）
 * @param url - サニタイズ対象のURL
 * @returns サニタイズ済みのURL、無効な場合は空文字
 */
export async function sanitizeUrlAsync(url: string): Promise<string> {
  if (!url || typeof url !== 'string') {
    return ''
  }

  try {
    const cleanUrl = url.trim()

    // DOMPurifyのURL検証を使用
    const purify = await getPurify()
    const sanitized = purify.sanitize(`<a href="${cleanUrl}"></a>`, {
      ALLOWED_TAGS: ['a'],
      ALLOWED_ATTR: ['href'],
      ALLOWED_URI_REGEXP: SECURITY_CONFIG.ALLOWED_URI_REGEXP,
      KEEP_CONTENT: false,
      RETURN_DOM: false
    })

    // サニタイズされたURLを抽出
    const match = sanitized.match(/href="([^"]*)"/)
    if (match && match[1]) {
      return match[1]
    }

    // フォールバック: 手動検証
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']
    const lowerUrl = cleanUrl.toLowerCase()

    for (const protocol of dangerousProtocols) {
      if (lowerUrl.startsWith(protocol)) {
        console.warn(`Dangerous protocol detected and blocked: ${protocol}`)
        return ''
      }
    }

    // 許可されたプロトコル・パターンのチェック
    if (SECURITY_CONFIG.ALLOWED_URI_REGEXP.test(cleanUrl)) {
      return cleanUrl
    }

    console.warn(`URL blocked by security policy: ${url}`)
    return ''
  } catch (error) {
    console.error('URL sanitization failed:', error)
    return ''
  }
}

/**
 * 画像URLをサニタイズする（強化版）
 * @param imageUrl - サニタイズ対象の画像URL
 * @returns サニタイズ済みの画像URL、無効な場合は空文字
 */
export function sanitizeImageUrl(imageUrl: string): string {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return ''
  }

  try {
    const cleanUrl = imageUrl.trim()

    // まずURLとして基本的な検証
    const sanitizedUrl = sanitizeUrl(cleanUrl)
    if (!sanitizedUrl) {
      return ''
    }

    // Sanity CDNのURLパターンをチェック（最も信頼できる）
    const sanityUrlPattern = /^https:\/\/cdn\.sanity\.io\/images\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/[a-zA-Z0-9\-_]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^<>"']*)?$/i
    if (sanityUrlPattern.test(sanitizedUrl)) {
      return sanitizedUrl
    }

    // 信頼できるCDNドメインのホワイトリスト
    const trustedDomains = [
      'cdn.sanity.io',
      'images.unsplash.com',
      'source.unsplash.com'
    ]

    try {
      const urlObj = new URL(sanitizedUrl)

      // ドメインチェック
      if (!trustedDomains.includes(urlObj.hostname)) {
        console.warn(`Untrusted image domain blocked: ${urlObj.hostname}`)
        return ''
      }

      // ファイル拡張子チェック
      const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i
      if (!validExtensions.test(urlObj.pathname)) {
        console.warn(`Invalid image extension: ${urlObj.pathname}`)
        return ''
      }

      return sanitizedUrl
    } catch {
      // 相対URLの場合
      if (sanitizedUrl.startsWith('/')) {
        const validRelativePattern = /^\/images\/[a-zA-Z0-9\-_/]+\.(jpg|jpeg|png|gif|webp|svg)$/i
        if (validRelativePattern.test(sanitizedUrl)) {
          return sanitizedUrl
        }
      }
    }

    console.warn(`Image URL blocked by security policy: ${imageUrl}`)
    return ''
  } catch (error) {
    console.error('Image URL sanitization failed:', error)
    return ''
  }
}

/**
 * Sanityのポータブルテキストをサニタイズする（強化版）
 * @param portableText - Sanityのポータブルテキストオブジェクト
 * @returns サニタイズ済みのポータブルテキスト
 */
export async function sanitizePortableText(portableText: unknown): Promise<unknown[]> {
  if (!portableText || !Array.isArray(portableText)) {
    return []
  }

  try {
    const processedBlocks = await Promise.all(
      portableText.map(async (block: unknown) => {
        const blockData = block as Record<string, unknown>

        // ブロックタイプごとに厳密な処理
        if (blockData._type === 'block' && blockData.children) {
          const children = await Promise.all(
            (blockData.children as unknown[]).map(async (child: unknown) => {
              const childData = child as Record<string, unknown>
              return {
                ...childData,
                text: childData.text ? await sanitizeTextAsync(String(childData.text)) : '',
                // マークも安全にサニタイズ
                marks: Array.isArray(childData.marks) ?
                  (childData.marks as string[]).filter(mark =>
                    typeof mark === 'string' && /^[a-zA-Z0-9_-]+$/.test(mark)
                  ) : []
              }
            })
          )

          const markDefs = blockData.markDefs ?
            (await Promise.all(
              (blockData.markDefs as unknown[]).map(async (mark: unknown) => {
                const markData = mark as Record<string, unknown>
                const sanitizedMark: Record<string, unknown> = {
                  _key: markData._key,
                  _type: markData._type
                }

                if (markData._type === 'link' && markData.href) {
                  const sanitizedHref = await sanitizeUrlAsync(String(markData.href))
                  if (sanitizedHref) {
                    sanitizedMark.href = sanitizedHref
                    // タイトルもサニタイズ
                    if (markData.title) {
                      sanitizedMark.title = await sanitizeTextAsync(String(markData.title))
                    }
                  } else {
                    // 無効なリンクは除去
                    return null
                  }
                }

                return sanitizedMark
              })
            )).filter(Boolean) : []

          return {
            ...blockData,
            children,
            markDefs
          }
        }

        // 画像ブロックの場合
        if (blockData._type === 'image' && blockData.asset) {
          return {
            ...blockData,
            alt: blockData.alt ? await sanitizeTextAsync(String(blockData.alt)) : '',
            caption: blockData.caption ? await sanitizeTextAsync(String(blockData.caption)) : '',
            // 画像アセットの検証
            asset: {
              ...blockData.asset as Record<string, unknown>,
              // アセット参照の検証
              _ref: (blockData.asset as Record<string, unknown>)._ref
            }
          }
        }

        // その他の不明なブロックタイプは安全な形に制限
        return {
          _type: blockData._type,
          _key: blockData._key
        }
      })
    )

    return processedBlocks
  } catch (error) {
    console.error('Portable text sanitization failed:', error)
    return []
  }
}

/**
 * 簡易HTMLサニタイゼーション（後方互換性用）
 * @deprecated 新しいコードではsanitizeHtmlWithDOMPurifyを使用してください
 * @param html - サニタイズ対象のHTML文字列
 * @returns サニタイズ済みのHTML文字列
 */
export async function sanitizeHtml(html: string): Promise<string> {
  console.warn('sanitizeHtml is deprecated. Use sanitizeHtmlWithDOMPurify instead.')
  return await sanitizeHtmlWithDOMPurify(html)
}

/**
 * JSON-LD用のセキュアなサニタイゼーション
 * @param data - サニタイズ対象のオブジェクト
 * @returns サニタイズ済みのオブジェクト
 */
export async function sanitizeJsonLd(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!data || typeof data !== 'object') {
    return {}
  }

  try {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
      // キー名の検証（英数字、ハイフン、アンダースコア、@のみ許可）
      if (!/^[@a-zA-Z0-9_-]+$/.test(key)) {
        console.warn(`Invalid JSON-LD key blocked: ${key}`)
        continue
      }

      if (typeof value === 'string') {
        // 文字列値はテキストとしてサニタイズ
        sanitized[key] = await sanitizeTextAsync(value)
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        // 数値とブール値はそのまま
        sanitized[key] = value
      } else if (Array.isArray(value)) {
        // 配列は再帰的にサニタイズ
        sanitized[key] = await Promise.all(value.map(async item =>
          typeof item === 'object' && item !== null
            ? await sanitizeJsonLd(item as Record<string, unknown>)
            : typeof item === 'string'
              ? await sanitizeTextAsync(item)
              : item
        ))
      } else if (typeof value === 'object' && value !== null) {
        // オブジェクトは再帰的にサニタイズ
        sanitized[key] = await sanitizeJsonLd(value as Record<string, unknown>)
      }
    }

    return sanitized
  } catch (error) {
    console.error('JSON-LD sanitization failed:', error)
    return {}
  }
}

/**
 * セキュリティ設定の検証（強化版）
 * 開発時のデバッグ用
 */
export async function validateSanitizeConfig(): Promise<boolean> {
  try {
    // XSS攻撃パターンのテスト
    const testCases = [
      {
        input: '<script>alert("XSS")</script><p>Safe content</p>',
        expected: 'Safe content',
        shouldNotContain: ['<script>', 'alert']
      },
      {
        input: '<img src="x" onerror="alert(1)">',
        expected: '',
        shouldNotContain: ['onerror', 'alert']
      },
      {
        input: '<a href="javascript:alert(1)">Click</a>',
        expected: 'Click',
        shouldNotContain: ['javascript:', 'alert']
      }
    ]

    for (const testCase of testCases) {
      const result = await sanitizeHtmlWithDOMPurify(testCase.input)

      // 期待する安全なコンテンツが含まれているかチェック
      if (testCase.expected && !result.includes(testCase.expected)) {
        console.error(`Sanitization test failed: expected "${testCase.expected}" in result "${result}"`)
        return false
      }

      // 危険なパターンが除去されているかチェック
      for (const dangerous of testCase.shouldNotContain) {
        if (result.includes(dangerous)) {
          console.error(`Sanitization test failed: dangerous pattern "${dangerous}" found in result "${result}"`)
          return false
        }
      }
    }

    // URL sanitization test
    const dangerousUrl = 'javascript:alert(1)'
    const sanitizedUrl = await sanitizeUrlAsync(dangerousUrl)
    if (sanitizedUrl) {
      console.error('URL sanitization test failed: dangerous URL not blocked')
      return false
    }

    console.log('All sanitization tests passed')
    return true
  } catch (error) {
    console.error('Sanitization validation error:', error)
    return false
  }
}

// 初期化時に設定を検証（非同期）
if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
  validateSanitizeConfig().catch(error => {
    console.error('Sanitization validation initialization failed:', error)
  })
}

// JSDOM依存関係が不足している場合のフォールバック
try {
  if (typeof window === 'undefined') {
    // サーバーサイドでJSDOMが利用できない場合の警告
    console.warn('JSDOM not available for server-side DOMPurify. Install jsdom package for full functionality.')
  }
} catch (error) {
  console.warn('DOMPurify initialization warning:', error)
}