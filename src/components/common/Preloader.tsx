/**
 * 蓮城院公式サイト - プリローダーコンポーネント
 *
 * 初回アクセス時に表示される和風のローディング画面
 * 寺院ロゴと蓮の花をモチーフとしたアニメーション
 *
 * @created 2025-09-20
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface PreloaderProps {
  /** プリローダーの表示時間（ミリ秒） */
  duration?: number;
  /** 初回表示のみ制御 */
  showOnlyFirstVisit?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({
  duration = 3000,
  showOnlyFirstVisit = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    // 初回表示制御
    if (showOnlyFirstVisit) {
      const hasVisited = sessionStorage.getItem('renjoin-visited');
      if (hasVisited) {
        return;
      }
      sessionStorage.setItem('renjoin-visited', 'true');
    }

    // プリローダー表示開始
    setIsVisible(true);

    // ページ読み込み完了後、または指定時間後にフェードアウト
    const timer = setTimeout(() => {
      setIsFadingOut(true);

      // フェードアウト完了後に非表示
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }, duration);

    // ページ読み込み完了時の早期非表示
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 500);
        clearTimeout(timer);
      }
    };

    // ブラウザ環境でのみイベントリスナーを追加
    if (typeof window !== 'undefined') {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad);
      }
    };
  }, [duration, showOnlyFirstVisit]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center
        transition-opacity duration-500 ease-in-out
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
        backdropFilter: 'blur(2px)'
      }}
      aria-label={t('loading') || 'Loading'}
      aria-live="polite"
      role="status"
      aria-hidden={isFadingOut}
    >
      {/* 和紙風のオーバーレイ */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 25% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center space-y-8 z-10">
        {/* 蓮の花のロゴ */}
        <div className="relative">
          {/* 外側の蓮の花びら - 回転アニメーション */}
          <div className="animate-spin-slow">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-white opacity-80"
              fill="none"
            >
              {/* 蓮の花びら - 8枚の花びら */}
              {Array.from({ length: 8 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 45} 60 60)`}>
                  <path
                    d="M60 25 Q52 15 45 25 Q52 35 60 30 Q68 35 75 25 Q68 15 60 25 Z"
                    fill="currentColor"
                    className="opacity-70"
                    style={{
                      transformOrigin: '60px 60px',
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* 中間層の蓮の花びら - 逆回転 */}
          <div className="absolute inset-0 animate-reverse-spin-slow">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-white opacity-60"
              fill="none"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 60 + 30} 60 60)`}>
                  <path
                    d="M60 35 Q54 28 50 35 Q54 42 60 40 Q66 42 70 35 Q66 28 60 35 Z"
                    fill="currentColor"
                    className="opacity-80"
                    style={{
                      transformOrigin: '60px 60px',
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* 内側の小さな花びら - ゆっくり回転 */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="text-white opacity-90"
              fill="none"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 90 + 45} 60 60)`}>
                  <circle
                    cx="60"
                    cy="45"
                    r="3"
                    fill="currentColor"
                    className="opacity-90"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* 中心の蓮華 - パルスアニメーション */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full opacity-95 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-200 rounded-full opacity-80" />
            </div>
          </div>
        </div>

        {/* 寺院名 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-white font-semibold tracking-wider">
            蓮城院
          </h1>
          <p className="text-sm text-white/80 font-sans tracking-wide">
            Renjoin Temple
          </p>
        </div>

        {/* ローディングテキスト */}
        <div className="flex items-center space-x-2 text-white/70">
          <span className="text-sm font-sans">
            {t('loading') || 'Loading'}
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-150" />
            <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-300" />
          </div>
        </div>
      </div>

      {/* 和風の雲の装飾 - 上部 */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-15">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 128"
          className="text-white"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 Q100,8 200,24 T400,16 Q350,40 250,48 Q150,56 0,40 Z"
            className="opacity-40"
          />
          <path
            d="M0,48 Q120,24 240,40 T400,32 Q320,56 200,64 Q80,72 0,56 Z"
            className="opacity-30"
          />
        </svg>
      </div>

      {/* 水墨画風の装飾 - 下部 */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 128"
          className="text-white"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path
            d="M0,96 Q100,64 200,80 T400,72 L400,128 L0,128 Z"
            className="opacity-30"
          />
          <path
            d="M0,112 Q150,80 300,96 T400,88 L400,128 L0,128 Z"
            className="opacity-50"
          />
        </svg>
      </div>

      {/* 浮遊する粒子効果 */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-30"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${20 + (i * 5)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Preloader;