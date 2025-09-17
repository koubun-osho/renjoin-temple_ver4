'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // メインナビゲーションアイテム
  const navigationItems: NavigationItem[] = [
    { name: 'トップ', href: '/', description: 'ホーム' },
    { name: '由緒', href: '/about', description: '蓮城院の歴史' },
    { name: '年間行事', href: '/events', description: '法要・行事' },
    { name: 'お知らせ', href: '/news', description: '寺院からのお知らせ' },
    { name: 'ブログ', href: '/blog', description: '副住職のブログ' },
    { name: 'お問い合わせ', href: '/contact', description: '連絡先' },
  ];

  // アクティブなページかどうかを判定
  const isActivePage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // モバイルメニューのトグル
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // モバイルメニューを閉じる
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-zen border-b border-neutral-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* ロゴ・サイト名 */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              onClick={closeMobileMenu}
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-primary-700 group-hover:text-secondary-700 transition-colors duration-300">
                蓮城院
              </div>
              <div className="hidden sm:block text-xs sm:text-sm text-text-secondary font-sans">
                曹洞宗
              </div>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative px-3 py-2 text-sm font-medium transition-colors duration-300
                  ${isActivePage(item.href)
                    ? 'text-secondary-700'
                    : 'text-text-primary hover:text-secondary-700'
                  }
                `}
              >
                <span className="relative z-10">{item.name}</span>
                {/* アクティブページのインジケーター */}
                {isActivePage(item.href) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-700 transform origin-left animate-slide-up"></div>
                )}
                {/* ホバーエフェクト */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            ))}
          </nav>

          {/* モバイルメニューボタン */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-text-primary hover:text-secondary-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-700 transition-colors duration-300 touch-manipulation"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}</span>
              {/* ハンバーガーアイコン */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                <span
                  className={`
                    absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'translate-y-1'}
                  `}
                ></span>
                <span
                  className={`
                    absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'opacity-0' : 'translate-y-2'}
                  `}
                ></span>
                <span
                  className={`
                    absolute block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? '-rotate-45 translate-y-2' : 'translate-y-3'}
                  `}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルナビゲーション */}
      <div
        className={`
          lg:hidden absolute top-full left-0 w-full bg-white shadow-zen-lg border-t border-neutral-200
          transform transition-all duration-300 ease-in-out origin-top
          ${isMobileMenuOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}
        id="mobile-menu"
      >
        <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-1 bg-white max-h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation
                ${isActivePage(item.href)
                  ? 'text-secondary-700 bg-secondary-50 border-l-4 border-secondary-700'
                  : 'text-text-primary hover:text-secondary-700 hover:bg-neutral-100 active:bg-neutral-200'
                }
              `}
              onClick={closeMobileMenu}
            >
              <div className="flex flex-col">
                <span>{item.name}</span>
                {item.description && (
                  <span className="text-xs text-text-muted mt-0.5 sm:mt-1">
                    {item.description}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* モバイルメニュー開時のオーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;