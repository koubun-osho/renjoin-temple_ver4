// 環境変数確認用のデバッグページ（本番確認後削除）
export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    // SANITY_API_TOKENは表示しない（セキュリティのため）
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">環境変数確認（デバッグ用）</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      <p className="mt-4 text-red-600">
        ⚠️ 確認後、このページは削除してください
      </p>
    </div>
  )
}