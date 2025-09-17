import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  // サイトマップセクション
  const siteMapSections: FooterSection[] = [
    {
      title: '寺院案内',
      links: [
        { name: '蓮城院由緒', href: '/about' },
        { name: '年間行事', href: '/events' },
        { name: 'アクセス', href: '/access' },
      ]
    },
    {
      title: 'コンテンツ',
      links: [
        { name: 'お知らせ', href: '/news' },
        { name: '副住職ブログ', href: '/blog' },
        { name: 'お問い合わせ', href: '/contact' },
      ]
    },
    {
      title: 'サイト情報',
      links: [
        { name: 'プライバシーポリシー', href: '/privacy' },
        { name: '利用規約', href: '/terms' },
        { name: 'サイトマップ', href: '/sitemap' },
      ]
    }
  ];

  // 寺院基本情報
  const templeInfo = {
    name: '蓮城院',
    sect: '曹洞宗',
    address: '〒123-4567 東京都○○区○○1-2-3',
    phone: '03-1234-5678',
    email: 'info@renjoin-temple.jp',
    businessHours: '9:00〜17:00（法要・行事時は除く）'
  };

  // 最新のお知らせとブログ記事（実際のデータはSanityから取得）
  const recentNews = [
    { title: '春彼岸法要のお知らせ', href: '/news/spring-higan-2025' },
    { title: '境内清掃ボランティア募集', href: '/news/volunteer-recruitment' },
    { title: '新年特別祈祷受付開始', href: '/news/new-year-prayer' },
  ];

  const recentBlogPosts = [
    { title: '禅の心を日常に活かす', href: '/blog/zen-in-daily-life' },
    { title: '四季折々の境内風景', href: '/blog/seasonal-temple-views' },
    { title: '座禅の作法について', href: '/blog/zazen-manner' },
  ];

  return (
    <footer className="bg-primary-800 text-white relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 transform rotate-45 translate-x-32 -translate-y-32">
          <div className="w-full h-full border border-secondary-400"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 transform -rotate-12 -translate-x-24 translate-y-24">
          <div className="w-full h-full border border-secondary-400"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* メインフッターコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* 寺院情報セクション */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-secondary-400 mb-2">
                {templeInfo.name}
              </h3>
              <p className="text-xs sm:text-sm text-primary-300 font-sans">
                {templeInfo.sect}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div>
                <h4 className="font-semibold text-primary-200 mb-1 text-xs sm:text-sm">所在地</h4>
                <p className="text-primary-300 leading-relaxed">
                  {templeInfo.address}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-200 mb-1 text-xs sm:text-sm">電話番号</h4>
                <p className="text-primary-300">
                  <a
                    href={`tel:${templeInfo.phone}`}
                    className="hover:text-secondary-400 transition-colors duration-300 inline-block py-1 touch-manipulation"
                  >
                    {templeInfo.phone}
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-200 mb-1 text-xs sm:text-sm">メールアドレス</h4>
                <p className="text-primary-300">
                  <a
                    href={`mailto:${templeInfo.email}`}
                    className="hover:text-secondary-400 transition-colors duration-300 break-all inline-block py-1 touch-manipulation"
                  >
                    {templeInfo.email}
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-200 mb-1 text-xs sm:text-sm">受付時間</h4>
                <p className="text-primary-300 text-xs leading-relaxed">
                  {templeInfo.businessHours}
                </p>
              </div>
            </div>
          </div>

          {/* サイトマップセクション */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-secondary-400 mb-4 sm:mb-6">
              サイトマップ
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {siteMapSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold text-primary-200 mb-2 sm:mb-3 text-xs sm:text-sm">
                    {section.title}
                  </h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-primary-300 hover:text-secondary-400 transition-colors duration-300 text-xs sm:text-sm block py-1 sm:py-1 leading-relaxed touch-manipulation"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 最新記事セクション */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="space-y-6 sm:space-y-8">
              {/* 最新お知らせ */}
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-secondary-400 mb-3 sm:mb-4">
                  最新のお知らせ
                </h3>
                <ul className="space-y-1 sm:space-y-2">
                  {recentNews.map((news, index) => (
                    <li key={index}>
                      <Link
                        href={news.href}
                        className="text-primary-300 hover:text-secondary-400 transition-colors duration-300 text-xs sm:text-sm block py-1 leading-relaxed touch-manipulation"
                      >
                        {news.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 sm:mt-3">
                  <Link
                    href="/news"
                    className="text-secondary-400 hover:text-secondary-300 text-xs underline decoration-1 underline-offset-2 touch-manipulation"
                  >
                    すべてのお知らせを見る
                  </Link>
                </div>
              </div>

              {/* 最新ブログ記事 */}
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-secondary-400 mb-3 sm:mb-4">
                  副住職ブログ
                </h3>
                <ul className="space-y-1 sm:space-y-2">
                  {recentBlogPosts.map((post, index) => (
                    <li key={index}>
                      <Link
                        href={post.href}
                        className="text-primary-300 hover:text-secondary-400 transition-colors duration-300 text-xs sm:text-sm block py-1 leading-relaxed touch-manipulation"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 sm:mt-3">
                  <Link
                    href="/blog"
                    className="text-secondary-400 hover:text-secondary-300 text-xs underline decoration-1 underline-offset-2 touch-manipulation"
                  >
                    すべての記事を見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
          <div className="w-full h-px bg-primary-600"></div>
        </div>

        {/* コピーライトセクション */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
          <div>
            <p className="text-primary-300 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} 蓮城院. All rights reserved.
            </p>
            <p className="text-primary-400 text-xs mt-1">
              曹洞宗 蓮城院 公式ウェブサイト
            </p>
          </div>

          {/* お知らせメッセージ */}
          <div className="text-primary-400 text-xs leading-relaxed">
            寺院からのお知らせは公式サイトにてご確認ください
          </div>
        </div>
      </div>

      {/* モバイル用の追加余白 */}
      <div className="h-3 sm:h-0"></div>
    </footer>
  );
};

export default Footer;