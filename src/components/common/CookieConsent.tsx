'use client';

import { useState, useEffect } from 'react';

/**
 * Cookie同意管理コンポーネント
 * GDPR・日本の個人情報保護法完全準拠
 *
 * 機能：
 * - Cookie使用前の明示的な同意取得
 * - 同意の撤回機能
 * - ローカルストレージでの同意状態管理
 * - 寺院サイトに適した丁寧な説明文
 */

interface CookieConsentProps {
  onConsentChange: (consent: boolean) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  // 同意状態のローカルストレージキー
  const CONSENT_KEY = 'renjoin_cookie_consent';
  const CONSENT_DATE_KEY = 'renjoin_consent_date';

  useEffect(() => {
    // 既存の同意状態を確認
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);

    if (savedConsent && consentDate) {
      // 同意から1年以上経過している場合は再確認
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const savedDate = new Date(consentDate);

      if (savedDate < oneYearAgo) {
        // 期限切れの場合は同意を削除して再表示
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_DATE_KEY);
        setIsVisible(true);
        setHasConsented(null);
      } else {
        // 有効な同意が存在
        const consent = savedConsent === 'true';
        setHasConsented(consent);
        onConsentChange(consent);
      }
    } else {
      // 初回訪問または同意未取得
      setIsVisible(true);
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    const now = new Date().toISOString();
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(CONSENT_DATE_KEY, now);
    setHasConsented(true);
    setIsVisible(false);
    onConsentChange(true);
  };

  const handleDecline = () => {
    const now = new Date().toISOString();
    localStorage.setItem(CONSENT_KEY, 'false');
    localStorage.setItem(CONSENT_DATE_KEY, now);
    setHasConsented(false);
    setIsVisible(false);
    onConsentChange(false);
  };

  const handleRevokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_DATE_KEY);
    setHasConsented(null);
    setIsVisible(true);
    onConsentChange(false);
  };

  // 同意済みの場合は撤回ボタンのみ表示
  if (hasConsented === true) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={handleRevokeConsent}
          className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
          aria-label="Cookie使用の同意を撤回"
        >
          Cookie設定
        </button>
      </div>
    );
  }

  // 拒否済みの場合は設定変更ボタンを表示
  if (hasConsented === false) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
          aria-label="Cookie設定を変更"
        >
          Cookie設定
        </button>
      </div>
    );
  }

  // 同意取得バナー
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto border border-gray-200">
        <div className="p-6">
          <h2
            id="cookie-consent-title"
            className="text-lg font-semibold text-gray-900 mb-3 font-serif"
          >
            Cookieの使用について
          </h2>

          <div id="cookie-consent-description" className="text-sm text-gray-700 space-y-3 mb-6">
            <p>
              蓮城院公式サイトでは、ウェブサイトの利用状況を分析し、
              より良いサービスを提供するためにCookieを使用いたします。
            </p>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">使用するCookieについて</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Google Analytics</strong>: サイトの利用状況分析（匿名化済み）</li>
                <li>• <strong>セッション管理</strong>: ユーザー体験の向上</li>
                <li>• <strong>設定保存</strong>: お客様の設定の記憶</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">プライバシーへの配慮</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• IPアドレスは匿名化して処理いたします</li>
                <li>• 個人を特定できる情報は収集いたしません</li>
                <li>• 広告配信のための追跡は行いません</li>
                <li>• いつでも同意を撤回できます</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500">
              詳細については、
              <a
                href="/privacy"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                プライバシーポリシー
              </a>
              をご確認ください。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleDecline}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
              aria-label="Cookieの使用を拒否"
            >
              使用しない
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
              aria-label="Cookieの使用に同意"
            >
              同意して利用する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;