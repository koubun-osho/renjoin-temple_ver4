/**
 * 蓮城院公式サイト - バンドル分析スクリプト
 *
 * Webpackバンドルのサイズ分析とパフォーマンス最適化のためのレポート生成
 * 継続的な監視とアラート機能を提供
 *
 * @created 2025-09-18
 * @version 1.0.0 Performance Optimization版
 * @task P4-04 - パフォーマンス最適化
 */

const fs = require('fs');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// ========================
// 設定
// ========================

const BUNDLE_SIZE_LIMITS = {
  // KB単位での制限値
  totalBundle: 1024, // 1MB
  mainChunk: 512,    // 512KB
  vendorChunk: 768,  // 768KB
  cssBundle: 128,    // 128KB
  imageAssets: 2048  // 2MB
};

const OUTPUT_DIR = path.join(process.cwd(), '.next', 'analyze');
const REPORTS_DIR = path.join(process.cwd(), 'reports');

// ========================
// バンドル分析関数
// ========================

/**
 * バンドルサイズを分析してレポートを生成
 */
async function analyzeBundleSize() {
  console.log('🔍 バンドルサイズ分析を開始しています...');

  try {
    const buildPath = path.join(process.cwd(), '.next');

    if (!fs.existsSync(buildPath)) {
      throw new Error('ビルドファイルが見つかりません。先に npm run build を実行してください。');
    }

    const stats = await getBundleStats(buildPath);
    const analysis = await analyzeStats(stats);
    const report = generateReport(analysis);

    // レポートディレクトリの作成
    if (!fs.existsSync(REPORTS_DIR)) {
      fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }

    // JSONレポートの保存
    const jsonReportPath = path.join(REPORTS_DIR, `bundle-analysis-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(jsonReportPath, JSON.stringify(analysis, null, 2));

    // HTMLレポートの保存
    const htmlReportPath = path.join(REPORTS_DIR, `bundle-report-${new Date().toISOString().split('T')[0]}.html`);
    fs.writeFileSync(htmlReportPath, generateHTMLReport(analysis));

    // コンソール出力
    console.log(report);

    // サイズ制限チェック
    checkSizeLimits(analysis);

    console.log(`📊 レポートが生成されました:`);
    console.log(`   JSON: ${jsonReportPath}`);
    console.log(`   HTML: ${htmlReportPath}`);

    return analysis;

  } catch (error) {
    console.error('❌ バンドル分析エラー:', error.message);
    process.exit(1);
  }
}

/**
 * ビルド統計情報を取得
 */
async function getBundleStats(buildPath) {
  const staticPath = path.join(buildPath, 'static');
  const stats = {
    chunks: [],
    assets: [],
    totalSize: 0
  };

  // チャンクファイルの分析
  if (fs.existsSync(staticPath)) {
    const chunksPath = path.join(staticPath, 'chunks');
    if (fs.existsSync(chunksPath)) {
      const chunkFiles = fs.readdirSync(chunksPath).filter(file => file.endsWith('.js'));

      for (const file of chunkFiles) {
        const filePath = path.join(chunksPath, file);
        const stat = fs.statSync(filePath);

        stats.chunks.push({
          name: file,
          size: stat.size,
          type: determineChunkType(file)
        });

        stats.totalSize += stat.size;
      }
    }

    // CSSファイルの分析
    const cssPath = path.join(staticPath, 'css');
    if (fs.existsSync(cssPath)) {
      const cssFiles = fs.readdirSync(cssPath).filter(file => file.endsWith('.css'));

      for (const file of cssFiles) {
        const filePath = path.join(cssPath, file);
        const stat = fs.statSync(filePath);

        stats.assets.push({
          name: file,
          size: stat.size,
          type: 'css'
        });

        stats.totalSize += stat.size;
      }
    }

    // 画像ファイルの分析
    const mediaPath = path.join(staticPath, 'media');
    if (fs.existsSync(mediaPath)) {
      const mediaFiles = fs.readdirSync(mediaPath);

      for (const file of mediaFiles) {
        const filePath = path.join(mediaPath, file);
        const stat = fs.statSync(filePath);

        stats.assets.push({
          name: file,
          size: stat.size,
          type: 'media'
        });

        stats.totalSize += stat.size;
      }
    }
  }

  return stats;
}

/**
 * チャンクタイプを判定
 */
function determineChunkType(filename) {
  if (filename.includes('main')) return 'main';
  if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor';
  if (filename.includes('runtime')) return 'runtime';
  if (filename.includes('polyfill')) return 'polyfill';
  return 'chunk';
}

/**
 * 統計情報を分析
 */
async function analyzeStats(stats) {
  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize: stats.totalSize,
    totalSizeFormatted: formatBytes(stats.totalSize),
    chunks: {},
    assets: {},
    recommendations: []
  };

  // チャンク分析
  const chunksByType = {};
  stats.chunks.forEach(chunk => {
    if (!chunksByType[chunk.type]) {
      chunksByType[chunk.type] = [];
    }
    chunksByType[chunk.type].push(chunk);
  });

  Object.keys(chunksByType).forEach(type => {
    const chunks = chunksByType[type];
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    analysis.chunks[type] = {
      count: chunks.length,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      files: chunks.map(chunk => ({
        name: chunk.name,
        size: formatBytes(chunk.size)
      }))
    };
  });

  // アセット分析
  const assetsByType = {};
  stats.assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });

  Object.keys(assetsByType).forEach(type => {
    const assets = assetsByType[type];
    const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);

    analysis.assets[type] = {
      count: assets.length,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      files: assets.map(asset => ({
        name: asset.name,
        size: formatBytes(asset.size)
      }))
    };
  });

  // 推奨事項の生成
  analysis.recommendations = generateRecommendations(analysis);

  return analysis;
}

/**
 * 推奨事項を生成
 */
function generateRecommendations(analysis) {
  const recommendations = [];

  // 大きなチャンクの警告
  Object.keys(analysis.chunks).forEach(type => {
    const chunk = analysis.chunks[type];
    const limit = BUNDLE_SIZE_LIMITS[type + 'Chunk'] || BUNDLE_SIZE_LIMITS.mainChunk;

    if (chunk.totalSize > limit * 1024) {
      recommendations.push({
        type: 'warning',
        category: 'bundle-size',
        message: `${type}チャンクが大きすぎます (${chunk.totalSizeFormatted} > ${formatBytes(limit * 1024)})`
      });
    }
  });

  // 全体サイズの警告
  if (analysis.totalSize > BUNDLE_SIZE_LIMITS.totalBundle * 1024) {
    recommendations.push({
      type: 'error',
      category: 'bundle-size',
      message: `総バンドルサイズが制限を超えています (${analysis.totalSizeFormatted} > ${formatBytes(BUNDLE_SIZE_LIMITS.totalBundle * 1024)})`
    });
  }

  // 最適化提案
  if (analysis.chunks.vendor && analysis.chunks.vendor.totalSize > 500 * 1024) {
    recommendations.push({
      type: 'info',
      category: 'optimization',
      message: 'vendorチャンクが大きいです。依存関係の見直しやtree shakingの強化を検討してください。'
    });
  }

  return recommendations;
}

/**
 * サイズ制限をチェック
 */
function checkSizeLimits(analysis) {
  let hasErrors = false;

  console.log('\n📏 サイズ制限チェック:');

  // 総サイズチェック
  const totalLimitBytes = BUNDLE_SIZE_LIMITS.totalBundle * 1024;
  if (analysis.totalSize > totalLimitBytes) {
    console.log(`❌ 総バンドルサイズ: ${analysis.totalSizeFormatted} (制限: ${formatBytes(totalLimitBytes)})`);
    hasErrors = true;
  } else {
    console.log(`✅ 総バンドルサイズ: ${analysis.totalSizeFormatted} (制限: ${formatBytes(totalLimitBytes)})`);
  }

  // チャンクサイズチェック
  Object.keys(analysis.chunks).forEach(type => {
    const chunk = analysis.chunks[type];
    const limit = BUNDLE_SIZE_LIMITS[type + 'Chunk'] || BUNDLE_SIZE_LIMITS.mainChunk;
    const limitBytes = limit * 1024;

    if (chunk.totalSize > limitBytes) {
      console.log(`❌ ${type}チャンク: ${chunk.totalSizeFormatted} (制限: ${formatBytes(limitBytes)})`);
      hasErrors = true;
    } else {
      console.log(`✅ ${type}チャンク: ${chunk.totalSizeFormatted} (制限: ${formatBytes(limitBytes)})`);
    }
  });

  if (hasErrors) {
    console.log('\n⚠️ サイズ制限を超過しているファイルがあります。最適化を検討してください。');
    process.exit(1);
  } else {
    console.log('\n✅ すべてのファイルがサイズ制限内です。');
  }
}

/**
 * テキストレポートを生成
 */
function generateReport(analysis) {
  let report = '\n📊 バンドル分析レポート\n';
  report += '='.repeat(50) + '\n\n';

  report += `📅 分析日時: ${new Date(analysis.timestamp).toLocaleString('ja-JP')}\n`;
  report += `📦 総バンドルサイズ: ${analysis.totalSizeFormatted}\n\n`;

  // チャンク詳細
  report += '📋 チャンク詳細:\n';
  Object.keys(analysis.chunks).forEach(type => {
    const chunk = analysis.chunks[type];
    report += `  ${type}: ${chunk.totalSizeFormatted} (${chunk.count}ファイル)\n`;
  });

  // アセット詳細
  if (Object.keys(analysis.assets).length > 0) {
    report += '\n🎨 アセット詳細:\n';
    Object.keys(analysis.assets).forEach(type => {
      const asset = analysis.assets[type];
      report += `  ${type}: ${asset.totalSizeFormatted} (${asset.count}ファイル)\n`;
    });
  }

  // 推奨事項
  if (analysis.recommendations.length > 0) {
    report += '\n💡 推奨事項:\n';
    analysis.recommendations.forEach(rec => {
      const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
      report += `  ${icon} ${rec.message}\n`;
    });
  }

  return report;
}

/**
 * HTMLレポートを生成
 */
function generateHTMLReport(analysis) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>蓮城院サイト - バンドル分析レポート</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 2rem; }
        .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem; }
        .section { margin-bottom: 2rem; }
        .metric { background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .error { background: #fee2e2; border-left: 4px solid #ef4444; }
        .success { background: #ecfdf5; border-left: 4px solid #10b981; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ 蓮城院公式サイト - バンドル分析レポート</h1>
        <p>分析日時: ${new Date(analysis.timestamp).toLocaleString('ja-JP')}</p>
    </div>

    <div class="section">
        <h2>📊 概要</h2>
        <div class="metric">
            <h3>総バンドルサイズ: ${analysis.totalSizeFormatted}</h3>
        </div>
    </div>

    <div class="section">
        <h2>📋 チャンク詳細</h2>
        <table>
            <thead>
                <tr>
                    <th>チャンクタイプ</th>
                    <th>サイズ</th>
                    <th>ファイル数</th>
                </tr>
            </thead>
            <tbody>
                ${Object.keys(analysis.chunks).map(type => {
                  const chunk = analysis.chunks[type];
                  return `
                    <tr>
                        <td>${type}</td>
                        <td>${chunk.totalSizeFormatted}</td>
                        <td>${chunk.count}</td>
                    </tr>
                  `;
                }).join('')}
            </tbody>
        </table>
    </div>

    ${analysis.recommendations.length > 0 ? `
    <div class="section">
        <h2>💡 推奨事項</h2>
        ${analysis.recommendations.map(rec => {
          const className = rec.type === 'error' ? 'error' : rec.type === 'warning' ? 'warning' : 'success';
          return `<div class="metric ${className}">${rec.message}</div>`;
        }).join('')}
    </div>
    ` : ''}

    <div class="section">
        <p><small>Generated by 蓮城院 Performance Monitoring System</small></p>
    </div>
</body>
</html>
  `;
}

/**
 * バイト数をフォーマット
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ========================
// メイン実行
// ========================

if (require.main === module) {
  analyzeBundleSize()
    .then(() => {
      console.log('\n✅ バンドル分析が完了しました。');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ エラー:', error);
      process.exit(1);
    });
}

module.exports = {
  analyzeBundleSize,
  BUNDLE_SIZE_LIMITS,
  formatBytes
};