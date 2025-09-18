'use client';

import { useEffect } from 'react';
import { trackBlogView, trackScrollDepth } from '@/lib/analytics';

/**
 * ブログ記事専用GA4追跡コンポーネント
 * プライバシー配慮のブログ特化型アナリティクス
 *
 * 機能：
 * - ブログ記事閲覧の追跡
 * - スクロール深度の測定
 * - 読了時間の推定
 * - プライバシー保護の匿名化追跡
 */

interface BlogAnalyticsProps {
  /** ブログ記事のスラッグ */
  postSlug: string;
  /** ブログ記事のタイトル */
  postTitle: string;
  /** 記事の文字数（読了時間推定用）*/
  wordCount?: number;
  /** カテゴリー（オプション）*/
  category?: string;
}

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({
  postSlug,
  postTitle,
  wordCount = 0,
  category,
}) => {
  useEffect(() => {
    // ページロード時にブログ閲覧を追跡
    trackBlogView(postSlug, postTitle);

    // スクロール深度追跡の設定
    let maxScrollPercent = 0;
    const startTime = Date.now();
    let hasTrackedRead = false;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      // 最大スクロール位置を更新
      if (scrollPercent > maxScrollPercent) {
        maxScrollPercent = scrollPercent;
        trackScrollDepth(scrollPercent, 'blog_post');
      }

      // 75%以上読了した場合の追跡（一度のみ）
      if (scrollPercent >= 75 && !hasTrackedRead) {
        hasTrackedRead = true;
        const readTime = Math.round((Date.now() - startTime) / 1000);

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'blog_post_read_completion', {
            event_category: 'blog_engagement',
            content_id: postSlug,
            reading_time_seconds: readTime,
            word_count: wordCount,
            category: category,
            scroll_percent: scrollPercent,
            privacy_mode: 'enhanced',
          });
        }
      }
    };

    // 離脱時の追跡
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'blog_post_engagement', {
          event_category: 'blog_engagement',
          content_id: postSlug,
          time_on_page_seconds: timeOnPage,
          max_scroll_percent: maxScrollPercent,
          privacy_mode: 'enhanced',
        });
      }
    };

    // イベントリスナーの設定
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // コンポーネントアンマウント時の最終追跡
      handleBeforeUnload();
    };
  }, [postSlug, postTitle, wordCount, category]);

  // このコンポーネントは表示要素を持たない
  return null;
};

export default BlogAnalytics;