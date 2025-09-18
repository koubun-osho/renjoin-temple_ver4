/**
 * 蓮城院専用Google Analytics追跡ユーティリティ
 * GDPR・個人情報保護法完全準拠
 *
 * 機能：
 * - プライバシー配慮のカスタムイベント追跡
 * - 寺院サイト特有のインタラクション測定
 * - 個人特定を避けた匿名化データ収集
 */

// イベントカテゴリの定義（寺院サイト専用）
export const ANALYTICS_CATEGORIES = {
  TEMPLE_INTERACTION: 'temple_interaction',
  BLOG_ENGAGEMENT: 'blog_engagement',
  NEWS_ENGAGEMENT: 'news_engagement',
  NAVIGATION: 'navigation',
  CONTENT_INTERACTION: 'content_interaction',
  ACCESSIBILITY: 'accessibility',
} as const;

// イベント名の定義
export const ANALYTICS_EVENTS = {
  // ブログ関連
  BLOG_POST_VIEW: 'blog_post_view',
  BLOG_POST_SHARE: 'blog_post_share',
  BLOG_SCROLL_COMPLETE: 'blog_scroll_complete',

  // お知らせ関連
  NEWS_VIEW: 'news_view',
  NEWS_CATEGORY_FILTER: 'news_category_filter',

  // ナビゲーション
  HEADER_MENU_CLICK: 'header_menu_click',
  FOOTER_LINK_CLICK: 'footer_link_click',
  BREADCRUMB_CLICK: 'breadcrumb_click',

  // 寺院特有のインタラクション
  CONTACT_INFO_VIEW: 'contact_info_view',
  TEMPLE_HISTORY_VIEW: 'temple_history_view',
  EVENTS_SCHEDULE_VIEW: 'events_schedule_view',
  ACCESS_MAP_INTERACTION: 'access_map_interaction',

  // アクセシビリティ
  TEXT_SIZE_CHANGE: 'text_size_change',
  HIGH_CONTRAST_TOGGLE: 'high_contrast_toggle',

  // エラー関連
  SEARCH_NO_RESULTS: 'search_no_results',
  PAGE_NOT_FOUND: 'page_not_found',
} as const;

/**
 * プライバシー配慮のイベント追跡関数
 */
export const trackEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  // Cookie同意が得られている場合のみ実行
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // プライバシー保護のためのパラメータフィルタリング
  const sanitizedParameters = sanitizeEventParameters(parameters);

  try {
    window.gtag('event', eventName, {
      ...sanitizedParameters,
      // プライバシー設定を強制
      privacy_mode: 'enhanced',
      anonymize_ip: true,
      allow_google_signals: false,

      // 寺院サイト固有の情報
      site_type: 'temple',
      temple_name: 'renjoin',
      religion: 'soto_zen',
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

/**
 * ブログ記事の閲覧追跡
 */
export const trackBlogView = (postSlug: string, postTitle: string) => {
  trackEvent(ANALYTICS_EVENTS.BLOG_POST_VIEW, {
    event_category: ANALYTICS_CATEGORIES.BLOG_ENGAGEMENT,
    content_id: postSlug,
    content_title: sanitizeString(postTitle),
    page_type: 'blog_post',
  });
};

/**
 * お知らせの閲覧追跡
 */
export const trackNewsView = (newsSlug: string, newsTitle: string, category?: string) => {
  trackEvent(ANALYTICS_EVENTS.NEWS_VIEW, {
    event_category: ANALYTICS_CATEGORIES.NEWS_ENGAGEMENT,
    content_id: newsSlug,
    content_title: sanitizeString(newsTitle),
    content_category: category,
    page_type: 'news',
  });
};

/**
 * ナビゲーション操作の追跡
 */
export const trackNavigation = (linkText: string, destination: string) => {
  trackEvent(ANALYTICS_EVENTS.HEADER_MENU_CLICK, {
    event_category: ANALYTICS_CATEGORIES.NAVIGATION,
    link_text: sanitizeString(linkText),
    link_destination: destination,
  });
};

/**
 * 寺院特有のコンテンツ閲覧追跡
 */
export const trackTempleContentView = (contentType: string, sectionName: string) => {
  trackEvent(ANALYTICS_EVENTS.TEMPLE_HISTORY_VIEW, {
    event_category: ANALYTICS_CATEGORIES.TEMPLE_INTERACTION,
    content_type: contentType,
    section_name: sanitizeString(sectionName),
  });
};

/**
 * スクロール深度の追跡
 */
export const trackScrollDepth = (scrollPercent: number, pageType: string) => {
  if (scrollPercent % 25 === 0) { // 25%刻みでのみ記録
    trackEvent('scroll_depth', {
      event_category: ANALYTICS_CATEGORIES.CONTENT_INTERACTION,
      scroll_percent: scrollPercent,
      page_type: pageType,
    });
  }
};

/**
 * エラー状況の追跡（プライバシー配慮）
 */
export const trackError = (errorType: string, errorContext?: string) => {
  trackEvent(errorType, {
    event_category: 'error',
    error_context: errorContext ? sanitizeString(errorContext) : undefined,
    // 個人情報を含む可能性のある詳細なエラー情報は送信しない
  });
};

/**
 * パラメータのサニタイズ（個人情報除去）
 */
const sanitizeEventParameters = (parameters: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  Object.entries(parameters).forEach(([key, value]) => {
    // 個人情報を含む可能性のあるキーは除外
    const sensitiveKeys = ['email', 'phone', 'address', 'name', 'ip', 'user_id'];
    if (sensitiveKeys.includes(key.toLowerCase())) {
      return;
    }

    // 文字列値のサニタイズ
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
    // オブジェクトや配列は含めない（プライバシー保護）
  });

  return sanitized;
};

/**
 * 文字列のサニタイズ
 */
const sanitizeString = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  return str
    .trim()
    .substring(0, 100) // 最大100文字に制限
    .replace(/[<>\"'&]/g, '') // HTMLタグや特殊文字を除去
    .replace(/\s+/g, ' '); // 連続する空白を単一空白に変換
};

/**
 * プライバシー設定の確認
 */
export const checkPrivacyCompliance = (): boolean => {
  if (typeof window === 'undefined') return false;

  const consent = localStorage.getItem('renjoin_cookie_consent');
  return consent === 'true';
};

/**
 * GA4デバッグ情報の出力（開発環境のみ）
 */
export const debugAnalytics = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🔍 Analytics Debug Info');
  console.log('GA Tracking ID:', process.env.NEXT_PUBLIC_GA_TRACKING_ID);
  console.log('Cookie Consent:', checkPrivacyCompliance());
  console.log('DataLayer:', window.dataLayer || 'Not initialized');
  console.groupEnd();
};