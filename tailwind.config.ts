import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 和モダンカラーパレット（設計書に基づく）
      colors: {
        // プライマリカラー（墨色）
        primary: {
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748', // メインの墨色
          800: '#1a202c',
          900: '#171923',
        },
        // セカンダリカラー（金茶色）
        secondary: {
          50: '#fefcf3',
          100: '#fdf8e1',
          200: '#fbefc2',
          300: '#f7e498',
          400: '#f1d56c',
          500: '#ebc849',
          600: '#d4af37',
          700: '#b8860b', // メインの金茶色
          800: '#996f0a',
          900: '#7a5608',
        },
        // アクセントカラー（朱色）
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#c53030', // メインの朱色
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // ニュートラルカラー（白系）
        neutral: {
          50: '#f7fafc', // メインの白系
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        },
        // テキストカラー
        text: {
          primary: '#1a202c',
          secondary: '#4a5568',
          muted: '#718096',
          inverse: '#ffffff',
        },
        // 背景カラー
        bg: {
          primary: '#ffffff',
          secondary: '#f7fafc',
          muted: '#edf2f7',
        },
      },
      // 日本語フォント設定
      fontFamily: {
        // メインの日本語セリフフォント
        serif: [
          'Noto Serif JP',
          'Hiragino Mincho ProN',
          'Hiragino Mincho Pro',
          'Yu Mincho',
          'YuMincho',
          'serif',
        ],
        // サブの日本語サンセリフフォント
        sans: [
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Yu Gothic',
          'YuGothic',
          'Meiryo',
          'sans-serif',
        ],
        // 見出し用のより太いフォント
        heading: [
          'Noto Serif JP',
          'Hiragino Mincho ProN',
          'serif',
        ],
      },
      // フォントサイズ（日本語に適したサイズ調整）
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      // レスポンシブブレークポイント（設計書に基づく）
      screens: {
        'xs': '480px',  // Large Mobile
        'sm': '640px',  // Mobile以上
        'md': '768px',  // Tablet
        'lg': '1024px', // Desktop以上
        'xl': '1280px',
        '2xl': '1536px',
      },
      // スペーシング（日本語デザインに適した調整）
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 行間（日本語テキストに最適化）
      lineHeight: {
        'tight': '1.3',
        'snug': '1.4',
        'normal': '1.6',
        'relaxed': '1.7',
        'loose': '1.8',
      },
      // 文字間隔
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      // ボックスシャドウ（和モダンデザイン用）
      boxShadow: {
        'zen': '0 4px 6px -1px rgba(45, 55, 72, 0.1), 0 2px 4px -1px rgba(45, 55, 72, 0.06)',
        'zen-lg': '0 10px 15px -3px rgba(45, 55, 72, 0.1), 0 4px 6px -2px rgba(45, 55, 72, 0.05)',
        'zen-xl': '0 20px 25px -5px rgba(45, 55, 72, 0.1), 0 10px 10px -5px rgba(45, 55, 72, 0.04)',
      },
      // アニメーション（上品で控えめ）
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // カスタムユーティリティ（縦書きサポート）
      writingMode: {
        'vertical-rl': 'vertical-rl',
        'vertical-lr': 'vertical-lr',
        'horizontal-tb': 'horizontal-tb',
      },
      textOrientation: {
        'mixed': 'mixed',
        'upright': 'upright',
        'sideways': 'sideways',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/line-clamp'),
    // カスタムプラグイン
    function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities = {
        '.writing-mode-vertical': {
          'writing-mode': 'vertical-rl',
          'text-orientation': 'mixed',
        },
        '.text-orientation-mixed': {
          'text-orientation': 'mixed',
        },
        '.text-orientation-upright': {
          'text-orientation': 'upright',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config