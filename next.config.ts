import type { NextConfig } from "next";

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

  // 開発時のセキュリティ設定
  experimental: {
    // セキュリティ関連の実験的機能
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', 'renjoin.com']
    }
  },

  // 画像最適化の設定
  images: {
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
    // 安全でない画像リクエストを防ぐ
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
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
    generateEtags: false    // ETagの自動生成を無効化
  })
};

export default nextConfig;
