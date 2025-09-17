export default function Home() {
  return (
    <div className="bg-bg-primary">
      {/* ヒーローセクション（将来実装予定） */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-700 mb-6">
            蓮城院
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            曹洞宗の寺院として、地域の皆様と共に歩み続けています。<br />
            副住職・荒木弘文のブログも掲載しております。
          </p>
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              ヘッダーコンポーネント実装テスト
            </p>
            <p className="text-sm text-text-muted">
              Phase 2 Task P2-02 完了
            </p>
          </div>
        </div>
      </section>

      {/* お知らせセクション（将来実装予定） */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 text-primary-700">
            お知らせ
          </h2>
          <div className="text-center text-text-muted">
            <p>お知らせ機能は今後のPhaseで実装予定です。</p>
          </div>
        </div>
      </section>

      {/* ブログセクション（将来実装予定） */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 text-primary-700">
            副住職ブログ
          </h2>
          <div className="text-center text-text-muted">
            <p>ブログ機能は今後のPhaseで実装予定です。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
