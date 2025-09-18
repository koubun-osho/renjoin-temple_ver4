/**
 * 蓮城院公式サイト - フォント最適化ユーティリティ
 *
 * Google Fontsの最適化とパフォーマンス向上のためのユーティリティ
 * FOUT、FOIT対策とCore Web Vitalsの改善
 *
 * @created 2025-09-18
 * @version 1.0.0 Performance Optimization版
 * @task P4-04 - パフォーマンス最適化
 */

/**
 * フォント読み込み状態の管理
 */
export class FontLoader {
  private static instance: FontLoader
  private loadedFonts: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()

  private constructor() {}

  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader()
    }
    return FontLoader.instance
  }

  /**
   * フォントのプリロード
   */
  async preloadFont(fontFamily: string, weight: string = '400'): Promise<void> {
    const fontKey = `${fontFamily}-${weight}`

    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve()
    }

    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!
    }

    const loadingPromise = this.loadFontInternal(fontFamily, weight)
    this.loadingPromises.set(fontKey, loadingPromise)

    try {
      await loadingPromise
      this.loadedFonts.add(fontKey)
    } finally {
      this.loadingPromises.delete(fontKey)
    }
  }

  private async loadFontInternal(fontFamily: string, weight: string): Promise<void> {
    if (typeof window === 'undefined' || !('fonts' in document)) {
      return Promise.resolve()
    }

    try {
      // CSS Font Loading APIを使用してフォントを読み込み
      const font = new FontFace(fontFamily, `url(/fonts/${fontFamily}-${weight}.woff2)`, {
        weight,
        display: 'swap'
      })

      const loadedFont = await font.load()
      document.fonts.add(loadedFont)

      console.log(`Font loaded: ${fontFamily} ${weight}`)
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily} ${weight}`, error)
    }
  }

  /**
   * 日本語フォントの遅延読み込み
   */
  async loadJapaneseFonts(): Promise<void> {
    if (typeof window === 'undefined') return

    // 日本語文字が含まれているかチェック
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(document.body.textContent || '')

    if (hasJapanese) {
      const promises = [
        this.preloadFont('Noto Serif JP', '400'),
        this.preloadFont('Noto Serif JP', '600'),
        this.preloadFont('Noto Sans JP', '400'),
        this.preloadFont('Noto Sans JP', '600')
      ]

      await Promise.allSettled(promises)
    }
  }

  /**
   * 重要なフォントのプリロード（Above the fold用）
   */
  async preloadCriticalFonts(): Promise<void> {
    const criticalFonts = [
      { family: 'Noto Serif JP', weight: '600' }, // ヒーローセクションのタイトル用
      { family: 'Noto Sans JP', weight: '400' }   // 本文用
    ]

    const promises = criticalFonts.map(font =>
      this.preloadFont(font.family, font.weight)
    )

    await Promise.allSettled(promises)
  }

  /**
   * フォント読み込み状態の確認
   */
  isFontLoaded(fontFamily: string, weight: string = '400'): boolean {
    return this.loadedFonts.has(`${fontFamily}-${weight}`)
  }

  /**
   * すべてのフォントの読み込み状況を取得
   */
  getLoadingStatus(): { loaded: string[], loading: string[] } {
    return {
      loaded: Array.from(this.loadedFonts),
      loading: Array.from(this.loadingPromises.keys())
    }
  }
}

/**
 * フォント最適化設定
 */
export const fontOptimizationConfig = {
  // 重要度の高いフォント（Above the fold）
  critical: [
    { family: 'Noto Serif JP', weight: '600', subset: 'latin' },
    { family: 'Noto Sans JP', weight: '400', subset: 'latin' }
  ],

  // 重要度の低いフォント（Below the fold）
  nonCritical: [
    { family: 'Noto Serif JP', weight: '400', subset: 'latin' },
    { family: 'Noto Sans JP', weight: '600', subset: 'latin' }
  ],

  // 日本語サブセット（必要に応じて遅延読み込み）
  japanese: [
    { family: 'Noto Serif JP', weight: '400', subset: 'japanese' },
    { family: 'Noto Serif JP', weight: '600', subset: 'japanese' },
    { family: 'Noto Sans JP', weight: '400', subset: 'japanese' },
    { family: 'Noto Sans JP', weight: '600', subset: 'japanese' }
  ]
}

/**
 * フォントプリロード用のリンクタグを生成
 */
export const generateFontPreloadLinks = () => {
  if (typeof window === 'undefined') return []

  return fontOptimizationConfig.critical.map(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = `/fonts/${font.family.replace(/\s+/g, '-')}-${font.weight}.woff2`

    return link
  })
}

/**
 * フォント読み込みのパフォーマンス測定
 */
export const measureFontLoadTime = () => {
  if (typeof window === 'undefined' || !window.performance) return

  const startTime = performance.now()
  let fontsLoaded = 0
  const totalFonts = fontOptimizationConfig.critical.length

  const checkFontsLoaded = () => {
    if (document.fonts.ready) {
      document.fonts.ready.then(() => {
        const endTime = performance.now()
        const loadTime = endTime - startTime

        // Google Analytics等に送信
        if (window.gtag) {
          window.gtag('event', 'font_load_time', {
            load_time: Math.round(loadTime),
            fonts_count: totalFonts,
            event_category: 'Performance'
          })
        }

        console.log(`All fonts loaded in ${loadTime.toFixed(2)}ms`)
      })
    }
  }

  // フォント読み込み完了を監視
  if (document.fonts.ready) {
    checkFontsLoaded()
  } else {
    // フォールバック：タイムアウト付きでチェック
    const timeoutId = setTimeout(() => {
      console.warn('Font loading timeout')
    }, 3000)

    document.addEventListener('DOMContentLoaded', () => {
      clearTimeout(timeoutId)
      checkFontsLoaded()
    })
  }
}

/**
 * フォント表示の最適化（FOUT対策）
 */
export const optimizeFontDisplay = () => {
  if (typeof window === 'undefined') return

  // CSS font-displayプロパティの動的設定
  const style = document.createElement('style')
  style.textContent = `
    @font-face {
      font-family: 'Noto Serif JP';
      font-display: swap;
      /* その他のプロパティはNext.jsが自動生成 */
    }

    @font-face {
      font-family: 'Noto Sans JP';
      font-display: swap;
      /* その他のプロパティはNext.jsが自動生成 */
    }

    /* フォント読み込み中のスタイル調整 */
    .font-serif {
      font-family: var(--font-serif-jp), serif, 'メイリオ', 'ヒラギノ明朝', 'Hiragino Mincho ProN';
    }

    .font-sans {
      font-family: var(--font-sans-jp), sans-serif, 'メイリオ', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN';
    }

    /* フォント読み込み中のレイアウトシフト防止 */
    .font-loading {
      font-size-adjust: 0.5;
    }
  `

  document.head.appendChild(style)
}

/**
 * クリティカルフォントの即座の読み込み開始
 */
export const initializeFontLoading = () => {
  const fontLoader = FontLoader.getInstance()

  // クリティカルフォントをプリロード
  fontLoader.preloadCriticalFonts()

  // パフォーマンス測定開始
  measureFontLoadTime()

  // フォント表示最適化
  optimizeFontDisplay()

  // 日本語フォントの遅延読み込み（必要に応じて）
  setTimeout(() => {
    fontLoader.loadJapaneseFonts()
  }, 1000) // 1秒後に日本語フォントを読み込み
}

export default FontLoader