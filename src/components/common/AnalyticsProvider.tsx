'use client';

import { useState, useEffect } from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import CookieConsent from './CookieConsent';

/**
 * Analytics統合プロバイダーコンポーネント
 * GA4とCookie管理を統合し、プライバシー法令遵守を実現
 *
 * 機能：
 * - 環境変数からGA4 IDを取得
 * - Cookie同意状態の管理
 * - サーバーサイド・クライアントサイド対応
 * - 開発環境での無効化オプション
 */

const AnalyticsProvider: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  // GA4トラッキングIDの取得
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  useEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true);
  }, []);

  const handleConsentChange = (consent: boolean) => {
    setCookieConsent(consent);

    // 同意撤回時にGoogle Analyticsのデータをクリア
    if (!consent && typeof window !== 'undefined') {
      // GAのCookieを削除
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        }
      });

      // LocalStorageのGA関連データを削除
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('_ga') || key.startsWith('gtag')) {
          localStorage.removeItem(key);
        }
      });

      // SessionStorageのGA関連データを削除
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('_ga') || key.startsWith('gtag')) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('Analytics cookies and storage cleared due to consent withdrawal');
    }
  };

  // 開発環境またはGA IDが未設定の場合は何も表示しない
  if (process.env.NODE_ENV === 'development' && !gaId) {
    console.warn('Google Analytics ID is not set. Analytics disabled in development.');
    return null;
  }

  // GA IDが設定されていない場合
  if (!gaId) {
    console.warn('NEXT_PUBLIC_GA_TRACKING_ID is not set. Analytics disabled.');
    return null;
  }

  // クライアントサイドでのみレンダリング
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <GoogleAnalytics
          gaId={gaId}
          cookieConsent={cookieConsent}
        />
      )}

      {/* Cookie同意管理 */}
      <CookieConsent onConsentChange={handleConsentChange} />

      {/* 開発環境での確認用（本番では非表示）*/}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs z-50">
          <strong>Dev Info:</strong>
          <br />
          GA ID: {gaId}
          <br />
          Consent: {cookieConsent ? 'Yes' : 'No'}
        </div>
      )}
    </>
  );
};

export default AnalyticsProvider;