import type { NextConfig } from "next";

// Bundle Analyzerのインポート
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

/**
 * 蓮城院公式サイト - セキュリティ強化 Next.js設定
 *
 * 要件定義書.md section 3.1 セキュリティ要件に準拠
 * - XSS攻撃の防止
 * - 適切なContent Security Policy
 * - セキュリティヘッダーの設定
 *
 * @version 2.0.0 セキュリティ強化版
 */

const nextConfig: NextConfig = {
  // 静的サイト生成の設定
  output: 'standalone',
  trailingSlash: false,

  // 静的ファイルの最適化
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        // 全てのページに適用
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://cdn.sanity.io https://images.unsplash.com https://source.unsplash.com",
              "connect-src 'self' https://api.sanity.io https://cdn.sanity.io https://www.google-analytics.com",
              "media-src 'self' https://cdn.sanity.io",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()'
            ].join(', ')
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  },


  // 画像最適化の設定（パフォーマンス強化版）
  images: {
    // リモート画像パターン
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com'
      }
    ],
    // 画像形式の最適化
    formats: ['image/webp', 'image/avif'],
    // 画像サイズの最適化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // キャッシュ設定
    minimumCacheTTL: 31536000, // 1年
    // 安全でない画像リクエストを防ぐ
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 画像最適化のローダー設定
    loader: 'default',
    // 未最適化画像の処理
    unoptimized: false
  },

  // TypeScript設定の強化
  typescript: {
    // 型エラーでビルドを停止（セキュリティ上重要）
    ignoreBuildErrors: false
  },

  // ESLint設定の強化
  eslint: {
    // リント警告でビルドを停止（セキュリティ上重要）
    ignoreDuringBuilds: false
  },

  // 本番環境での最適化
  ...(process.env.NODE_ENV === 'production' && {
    poweredByHeader: false, // Powered by Next.jsヘッダーを削除
    generateEtags: true,    // ETagの自動生成を有効化（キャッシュ最適化）
    compress: true,         // gzip圧縮を有効化
    reactStrictMode: true   // React Strict Modeを有効化
  }),

  // パフォーマンス最適化設定
  compiler: {
    // 本番環境でのコンソールログ除去
    removeConsole: process.env.NODE_ENV === 'production',
    // React Compiler（実験的）
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$'] } : false
  },

  // Webpack最適化設定
  webpack: (config, { dev, isServer, webpack }) => {
    // 本番環境の最適化
    if (!dev && !isServer) {
      // Tree shakingの強化
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
            // Sanity関連のコードを分離
            sanity: {
              test: /[\\/]node_modules[\\/](@sanity|next-sanity)[\\/]/,
              name: 'sanity',
              chunks: 'all',
            },
            // React関連のコードを分離
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
            },
          },
        },
      }

      // バンドルサイズの制限
      config.performance = {
        ...config.performance,
        maxAssetSize: 512000, // 512KB
        maxEntrypointSize: 512000, // 512KB
      }

      // 未使用コードの除去
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      )
    }

    // エイリアスの設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('./src', import.meta.url).pathname,
    }

    return config
  },

  // 実験的機能
  experimental: {
    // ページ間のプリフェッチ最適化
    optimizePackageImports: ['@sanity/client', '@portabletext/react']
  }
};

// Bundle Analyzerでラップしてエクスポート
export default withBundleAnalyzer(nextConfig);
