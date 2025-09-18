/**
 * 蓮城院公式サイト - パフォーマンステストスクリプト
 *
 * PageSpeed Insights API、Lighthouse、Web Vitalsを使用した
 * 包括的なパフォーマンス分析とレポート生成
 *
 * @created 2025-09-18
 * @version 1.0.0 Performance Optimization版
 * @task P4-04 - パフォーマンス最適化
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ========================
// 設定
// ========================

const CONFIG = {
  // テスト対象URL（本番環境のURLを設定）
  baseUrl: process.env.SITE_URL || 'https://renjoin.temple',

  // PageSpeed Insights API キー
  pagespeedApiKey: process.env.PAGESPEED_API_KEY,

  // テストページ一覧
  testPages: [
    '/',
    '/about',
    '/blog',
    '/news',
    '/events',
    '/contact'
  ],

  // パフォーマンス目標値
  targets: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95,
    lcp: 2500,  // ms
    fid: 100,   // ms
    cls: 0.1    // score
  },

  // レポート出力ディレクトリ
  outputDir: path.join(process.cwd(), 'reports', 'performance'),

  // 並行実行数
  concurrency: 2
};

// ========================
// PageSpeed Insights API
// ========================

/**
 * PageSpeed Insights APIでページを分析
 */
async function analyzePageWithPSI(url, strategy = 'mobile') {
  if (!CONFIG.pagespeedApiKey) {
    throw new Error('PageSpeed Insights API key is not configured');
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${CONFIG.pagespeedApiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

  return new Promise((resolve, reject) => {
    https.get(apiUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);

          if (result.error) {
            reject(new Error(`PSI API Error: ${result.error.message}`));
            return;
          }

          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse PSI response: ${error.message}`));
        }
      });

    }).on('error', (error) => {
      reject(new Error(`PSI API request failed: ${error.message}`));
    });
  });
}

/**
 * PageSpeed Insightsの結果を整形
 */
function formatPSIResults(psiResult, url, strategy) {
  const lighthouse = psiResult.lighthouseResult;
  const categories = lighthouse.categories;
  const audits = lighthouse.audits;

  return {
    url,
    strategy,
    timestamp: new Date().toISOString(),
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    },
    metrics: {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      firstInputDelay: audits['max-potential-fid']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0
    },
    opportunities: extractOpportunities(audits),
    diagnostics: extractDiagnostics(audits),
    passed: categories.performance.score >= CONFIG.targets.performance / 100
  };
}

/**
 * Lighthouse監査から改善提案を抽出
 */
function extractOpportunities(audits) {
  const opportunities = [];

  Object.keys(audits).forEach(auditKey => {
    const audit = audits[auditKey];

    if (audit.score !== null && audit.score < 1 && audit.details && audit.details.overallSavingsMs > 100) {
      opportunities.push({
        id: auditKey,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        savings: audit.details.overallSavingsMs,
        displayValue: audit.displayValue
      });
    }
  });

  return opportunities.sort((a, b) => b.savings - a.savings);
}

/**
 * 診断情報を抽出
 */
function extractDiagnostics(audits) {
  const diagnostics = [];

  const diagnosticKeys = [
    'uses-text-compression',
    'uses-responsive-images',
    'efficient-animated-content',
    'duplicated-javascript',
    'legacy-javascript',
    'preconnect-to-required-origins',
    'uses-rel-preconnect',
    'font-display',
    'no-document-write',
    'uses-http2',
    'uses-long-cache-ttl',
    'total-byte-weight'
  ];

  diagnosticKeys.forEach(key => {
    if (audits[key] && audits[key].score < 1) {
      diagnostics.push({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        score: audits[key].score,
        displayValue: audits[key].displayValue
      });
    }
  });

  return diagnostics;
}

// ========================
// レポート生成
// ========================

/**
 * 個別ページのレポートを生成
 */
function generatePageReport(results) {
  const { mobile, desktop } = results;

  return `
# ${results.url} - パフォーマンスレポート

生成日時: ${new Date().toLocaleString('ja-JP')}

## スコア概要

### モバイル
- パフォーマンス: ${mobile.scores.performance}/100 ${mobile.scores.performance >= CONFIG.targets.performance ? '✅' : '❌'}
- アクセシビリティ: ${mobile.scores.accessibility}/100 ${mobile.scores.accessibility >= CONFIG.targets.accessibility ? '✅' : '❌'}
- ベストプラクティス: ${mobile.scores.bestPractices}/100 ${mobile.scores.bestPractices >= CONFIG.targets.bestPractices ? '✅' : '❌'}
- SEO: ${mobile.scores.seo}/100 ${mobile.scores.seo >= CONFIG.targets.seo ? '✅' : '❌'}

### デスクトップ
- パフォーマンス: ${desktop.scores.performance}/100 ${desktop.scores.performance >= CONFIG.targets.performance ? '✅' : '❌'}
- アクセシビリティ: ${desktop.scores.accessibility}/100 ${desktop.scores.accessibility >= CONFIG.targets.accessibility ? '✅' : '❌'}
- ベストプラクティス: ${desktop.scores.bestPractices}/100 ${desktop.scores.bestPractices >= CONFIG.targets.bestPractices ? '✅' : '❌'}
- SEO: ${desktop.scores.seo}/100 ${desktop.scores.seo >= CONFIG.targets.seo ? '✅' : '❌'}

## Core Web Vitals (モバイル)

- **LCP (Largest Contentful Paint)**: ${(mobile.metrics.largestContentfulPaint / 1000).toFixed(2)}秒 ${mobile.metrics.largestContentfulPaint <= CONFIG.targets.lcp ? '✅' : '❌'}
- **FID (First Input Delay)**: ${mobile.metrics.firstInputDelay.toFixed(0)}ms ${mobile.metrics.firstInputDelay <= CONFIG.targets.fid ? '✅' : '❌'}
- **CLS (Cumulative Layout Shift)**: ${mobile.metrics.cumulativeLayoutShift.toFixed(3)} ${mobile.metrics.cumulativeLayoutShift <= CONFIG.targets.cls ? '✅' : '❌'}

## 改善提案 (モバイル)

${mobile.opportunities.length > 0 ? mobile.opportunities.map(opp =>
  `### ${opp.title}
- 削減可能時間: ${(opp.savings / 1000).toFixed(2)}秒
- 説明: ${opp.description}
`).join('\n') : '改善提案はありません。'}

## 診断結果 (モバイル)

${mobile.diagnostics.length > 0 ? mobile.diagnostics.map(diag =>
  `### ${diag.title}
- スコア: ${(diag.score * 100).toFixed(0)}/100
- 説明: ${diag.description}
- 値: ${diag.displayValue || 'N/A'}
`).join('\n') : '診断で問題は見つかりませんでした。'}
`;
}

/**
 * 統合レポートを生成
 */
function generateSummaryReport(allResults) {
  const totalPages = allResults.length;
  const passedPages = allResults.filter(result =>
    result.mobile.scores.performance >= CONFIG.targets.performance &&
    result.mobile.scores.accessibility >= CONFIG.targets.accessibility &&
    result.mobile.scores.bestPractices >= CONFIG.targets.bestPractices &&
    result.mobile.scores.seo >= CONFIG.targets.seo
  ).length;

  const averageScores = {
    performance: Math.round(allResults.reduce((sum, result) => sum + result.mobile.scores.performance, 0) / totalPages),
    accessibility: Math.round(allResults.reduce((sum, result) => sum + result.mobile.scores.accessibility, 0) / totalPages),
    bestPractices: Math.round(allResults.reduce((sum, result) => sum + result.mobile.scores.bestPractices, 0) / totalPages),
    seo: Math.round(allResults.reduce((sum, result) => sum + result.mobile.scores.seo, 0) / totalPages)
  };

  const averageMetrics = {
    lcp: allResults.reduce((sum, result) => sum + result.mobile.metrics.largestContentfulPaint, 0) / totalPages,
    fid: allResults.reduce((sum, result) => sum + result.mobile.metrics.firstInputDelay, 0) / totalPages,
    cls: allResults.reduce((sum, result) => sum + result.mobile.metrics.cumulativeLayoutShift, 0) / totalPages
  };

  return `
# 蓮城院公式サイト - パフォーマンス総合レポート

生成日時: ${new Date().toLocaleString('ja-JP')}
対象サイト: ${CONFIG.baseUrl}

## 総合評価

- **総ページ数**: ${totalPages}
- **合格ページ数**: ${passedPages}
- **合格率**: ${Math.round((passedPages / totalPages) * 100)}%

## 平均スコア

| カテゴリ | スコア | 目標 | 結果 |
|---------|-------|------|-----|
| パフォーマンス | ${averageScores.performance} | ${CONFIG.targets.performance} | ${averageScores.performance >= CONFIG.targets.performance ? '✅' : '❌'} |
| アクセシビリティ | ${averageScores.accessibility} | ${CONFIG.targets.accessibility} | ${averageScores.accessibility >= CONFIG.targets.accessibility ? '✅' : '❌'} |
| ベストプラクティス | ${averageScores.bestPractices} | ${CONFIG.targets.bestPractices} | ${averageScores.bestPractices >= CONFIG.targets.bestPractices ? '✅' : '❌'} |
| SEO | ${averageScores.seo} | ${CONFIG.targets.seo} | ${averageScores.seo >= CONFIG.targets.seo ? '✅' : '❌'} |

## Core Web Vitals 平均

| メトリクス | 値 | 目標 | 結果 |
|-----------|---|------|-----|
| LCP | ${(averageMetrics.lcp / 1000).toFixed(2)}秒 | ${CONFIG.targets.lcp / 1000}秒 | ${averageMetrics.lcp <= CONFIG.targets.lcp ? '✅' : '❌'} |
| FID | ${averageMetrics.fid.toFixed(0)}ms | ${CONFIG.targets.fid}ms | ${averageMetrics.fid <= CONFIG.targets.fid ? '✅' : '❌'} |
| CLS | ${averageMetrics.cls.toFixed(3)} | ${CONFIG.targets.cls} | ${averageMetrics.cls <= CONFIG.targets.cls ? '✅' : '❌'} |

## ページ別詳細

${allResults.map(result => `
### ${result.url}

**モバイルスコア**: P:${result.mobile.scores.performance} A:${result.mobile.scores.accessibility} BP:${result.mobile.scores.bestPractices} SEO:${result.mobile.scores.seo}
**Core Web Vitals**: LCP:${(result.mobile.metrics.largestContentfulPaint / 1000).toFixed(2)}s FID:${result.mobile.metrics.firstInputDelay.toFixed(0)}ms CLS:${result.mobile.metrics.cumulativeLayoutShift.toFixed(3)}
**状態**: ${result.mobile.passed ? '✅ 合格' : '❌ 要改善'}
`).join('')}

## 推奨事項

${averageScores.performance < CONFIG.targets.performance ? '- パフォーマンス改善が必要です。画像最適化、コード分割、キャッシュ戦略の見直しを検討してください。' : ''}
${averageScores.accessibility < CONFIG.targets.accessibility ? '- アクセシビリティの改善が必要です。ALTテキスト、色のコントラスト、キーボードナビゲーションを確認してください。' : ''}
${averageScores.bestPractices < CONFIG.targets.bestPractices ? '- ベストプラクティスの改善が必要です。HTTPS、画像アスペクト比、JavaScriptエラーを確認してください。' : ''}
${averageScores.seo < CONFIG.targets.seo ? '- SEOの改善が必要です。メタタグ、構造化データ、サイトマップを確認してください。' : ''}

${averageMetrics.lcp > CONFIG.targets.lcp ? '- LCP改善: ヒーロー画像の最適化、サーバーレスポンス時間の短縮を実施してください。' : ''}
${averageMetrics.fid > CONFIG.targets.fid ? '- FID改善: JavaScriptの実行時間短縮、メインスレッドのブロック時間を削減してください。' : ''}
${averageMetrics.cls > CONFIG.targets.cls ? '- CLS改善: レイアウトシフトの原因を特定し、要素のサイズを事前指定してください。' : ''}

---

このレポートは蓮城院公式サイトのパフォーマンス監視システムによって自動生成されました。
`;
}

// ========================
// メイン実行関数
// ========================

/**
 * 全ページのパフォーマンステストを実行
 */
async function runPerformanceTests() {
  console.log('🚀 蓮城院公式サイト パフォーマンステストを開始します...');
  console.log(`📊 対象URL: ${CONFIG.baseUrl}`);
  console.log(`📄 テストページ数: ${CONFIG.testPages.length}`);

  // 出力ディレクトリの作成
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const allResults = [];
  const errors = [];

  // 各ページをテスト
  for (let i = 0; i < CONFIG.testPages.length; i += CONFIG.concurrency) {
    const batch = CONFIG.testPages.slice(i, i + CONFIG.concurrency);

    const batchPromises = batch.map(async (page) => {
      const url = CONFIG.baseUrl + page;
      console.log(`📱 テスト中: ${url}`);

      try {
        const [mobileResult, desktopResult] = await Promise.all([
          analyzePageWithPSI(url, 'mobile'),
          analyzePageWithPSI(url, 'desktop')
        ]);

        const result = {
          url,
          mobile: formatPSIResults(mobileResult, url, 'mobile'),
          desktop: formatPSIResults(desktopResult, url, 'desktop')
        };

        // 個別レポートの生成
        const pageReport = generatePageReport(result);
        const fileName = page.replace(/\//g, '_') || 'home';
        const reportPath = path.join(CONFIG.outputDir, `${fileName}_report.md`);
        fs.writeFileSync(reportPath, pageReport);

        console.log(`✅ 完了: ${url} (P:${result.mobile.scores.performance}/100)`);
        return result;

      } catch (error) {
        console.error(`❌ エラー: ${url} - ${error.message}`);
        errors.push({ url, error: error.message });
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    allResults.push(...batchResults.filter(result => result !== null));

    // API レート制限対策で少し待機
    if (i + CONFIG.concurrency < CONFIG.testPages.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // 統合レポートの生成
  if (allResults.length > 0) {
    const summaryReport = generateSummaryReport(allResults);
    const summaryPath = path.join(CONFIG.outputDir, 'summary_report.md');
    fs.writeFileSync(summaryPath, summaryReport);

    // JSONファイルの生成（詳細データ）
    const jsonPath = path.join(CONFIG.outputDir, 'performance_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      baseUrl: CONFIG.baseUrl,
      targets: CONFIG.targets,
      results: allResults,
      errors
    }, null, 2));

    console.log('\n📊 テスト完了!');
    console.log(`📁 レポート場所: ${CONFIG.outputDir}`);
    console.log(`📄 統合レポート: ${summaryPath}`);
    console.log(`📋 JSONデータ: ${jsonPath}`);

    // エラーがある場合は警告
    if (errors.length > 0) {
      console.log(`\n⚠️ ${errors.length}件のエラーが発生しました:`);
      errors.forEach(error => {
        console.log(`  - ${error.url}: ${error.error}`);
      });
    }

    // 目標達成状況
    const passedPages = allResults.filter(result => result.mobile.passed).length;
    const passRate = Math.round((passedPages / allResults.length) * 100);

    if (passRate >= 80) {
      console.log(`\n✅ 素晴らしい! ${passRate}%のページが目標を達成しています。`);
    } else if (passRate >= 60) {
      console.log(`\n⚠️ ${passRate}%のページが目標を達成しています。さらなる改善を検討してください。`);
    } else {
      console.log(`\n❌ ${passRate}%のページのみが目標を達成しています。パフォーマンス改善が必要です。`);
      process.exit(1);
    }

  } else {
    console.error('❌ すべてのテストが失敗しました。');
    process.exit(1);
  }
}

// ========================
// スクリプト実行
// ========================

if (require.main === module) {
  // コマンドライン引数の処理
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
蓮城院公式サイト パフォーマンステストツール

使用方法:
  node scripts/performance-test.js [オプション]

オプション:
  --url <URL>          テスト対象のベースURL (デフォルト: ${CONFIG.baseUrl})
  --api-key <KEY>      PageSpeed Insights API キー
  --pages <pages>      テストページをカンマ区切りで指定
  --mobile-only        モバイルのみテスト
  --desktop-only       デスクトップのみテスト
  --help, -h           このヘルプを表示

環境変数:
  SITE_URL            テスト対象サイトのURL
  PAGESPEED_API_KEY   PageSpeed Insights APIキー

例:
  npm run performance:test
  node scripts/performance-test.js --url https://example.com
  PAGESPEED_API_KEY=your_key node scripts/performance-test.js
`);
    process.exit(0);
  }

  // URLの設定
  const urlIndex = args.indexOf('--url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    CONFIG.baseUrl = args[urlIndex + 1];
  }

  // APIキーの設定
  const apiKeyIndex = args.indexOf('--api-key');
  if (apiKeyIndex !== -1 && args[apiKeyIndex + 1]) {
    CONFIG.pagespeedApiKey = args[apiKeyIndex + 1];
  }

  // ページ指定
  const pagesIndex = args.indexOf('--pages');
  if (pagesIndex !== -1 && args[pagesIndex + 1]) {
    CONFIG.testPages = args[pagesIndex + 1].split(',').map(p => p.trim());
  }

  // APIキーチェック
  if (!CONFIG.pagespeedApiKey) {
    console.error('❌ PageSpeed Insights API キーが設定されていません。');
    console.error('環境変数 PAGESPEED_API_KEY を設定するか、--api-key オプションを使用してください。');
    console.error('APIキーの取得: https://developers.google.com/speed/docs/insights/v5/get-started');
    process.exit(1);
  }

  runPerformanceTests().catch(error => {
    console.error('❌ テスト実行エラー:', error);
    process.exit(1);
  });
}