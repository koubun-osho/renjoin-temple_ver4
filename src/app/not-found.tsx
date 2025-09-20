/**
 * 蓮城院公式サイト - グローバル404ページ
 *
 * ルートレベルのnot-foundページ（多言語対応）
 * aタグを使用した直接リンク
 *
 * @created 2025-09-20
 * @version 1.5.0 - aタグ直接版
 */

export default function GlobalNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', sans-serif"
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '1rem'
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1f2937'
          }}
        >
          ページが見つかりません
        </h2>
        <p
          style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}
        >
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <a
            href="/ja"
            style={{
              background: '#1e40af',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e40af'
            }}
          >
            日本語サイトへ
          </a>
          <a
            href="/en"
            style={{
              background: '#1e40af',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e40af'
            }}
          >
            English Site
          </a>
        </div>
      </div>
    </div>
  )
}