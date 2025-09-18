'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Google Analytics 4コンポーネント
 * GDPR・個人情報保護法準拠のプライバシー配慮実装
 *
 * 特徴：
 * - Cookie使用前の同意取得
 * - IPアドレス匿名化
 * - 広告機能の無効化
 * - プライバシー重視の設定
 */

interface GoogleAnalyticsProps {
  gaId: string;
  /** Cookie同意が得られているかのフラグ */
  cookieConsent: boolean;
}

/**
 * GA4の初期化とプライバシー設定
 */
const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ gaId, cookieConsent }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && cookieConsent) {
      // GDPR対応：プライバシー重視の設定
      window.gtag('config', gaId, {
        // IPアドレスの匿名化（GDPR要件）
        anonymize_ip: true,

        // 広告機能の無効化（プライバシー保護）
        allow_google_signals: false,
        allow_ad_personalization_signals: false,

        // データ保持期間の制限（日本の個人情報保護法対応）
        storage: 'none',

        // カスタムイベントの設定
        custom_map: {},

        // サイト固有の設定
        page_title: document.title,
        page_location: window.location.href,

        // 寺院サイト特有の設定
        content_group1: 'Temple Website',
        content_group2: 'Renjoin Temple',
      });

      // 初期ページビューの記録
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: 'Temple Website',
      });
    }
  }, [gaId, cookieConsent]);

  // Cookie同意が得られていない場合は何も表示しない
  if (!cookieConsent) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 スクリプトの読み込み */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onLoad={() => {
          // GTAGライブラリの初期化
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: unknown[]) {
            window.dataLayer.push(args);
          }
          window.gtag = gtag;

          // タイムスタンプの設定
          gtag('js', new Date());

          // プライバシー重視の初期設定
          gtag('config', gaId, {
            // Cookie使用の制限
            storage: 'none',

            // 広告機能の無効化
            allow_google_signals: false,
            allow_ad_personalization_signals: false,

            // IPアドレスの匿名化
            anonymize_ip: true,

            // データ送信の制限
            transport_type: 'beacon',

            // サンプリング設定（大量アクセス時の負荷軽減）
            sample_rate: 100,

            // セッション設定
            session_timeout: 1800, // 30分

            // 寺院サイト用カスタム設定
            custom_parameter_table: {
              'site_type': 'temple',
              'temple_name': 'renjoin',
              'religion': 'soto_zen',
            },
          });
        }}
      />

      {/* 構造化データの設定（寺院向け）*/}
      <Script
        id="ga4-custom-events"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // カスタムイベントの定義
            window.trackTempleEvent = function(eventName, parameters = {}) {
              if (window.gtag && ${cookieConsent}) {
                window.gtag('event', eventName, {
                  ...parameters,
                  event_category: 'temple_interaction',
                  site_type: 'temple',
                  privacy_mode: 'enhanced'
                });
              }
            };

            // ページ離脱率の追跡（プライバシー配慮）
            window.trackScrollDepth = function() {
              if (window.gtag && ${cookieConsent}) {
                let maxScroll = 0;
                const trackScroll = () => {
                  const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                  );
                  if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                    maxScroll = scrollPercent;
                    window.gtag('event', 'scroll', {
                      event_category: 'engagement',
                      event_label: scrollPercent + '%',
                      value: scrollPercent,
                      privacy_mode: 'enhanced'
                    });
                  }
                };
                window.addEventListener('scroll', trackScroll);
              }
            };

            // 初期化
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', window.trackScrollDepth);
            } else {
              window.trackScrollDepth();
            }
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;

// TypeScript用のWindow拡張
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    trackTempleEvent: (eventName: string, parameters?: Record<string, unknown>) => void;
    trackScrollDepth: () => void;
  }
}