# 蓮城院公式サイト 環境変数セキュリティ設定

## 実装済み設定

### .env.local ファイル
- **場所**: `/Users/koubun/Desktop/AIコーディング/Claude_code/蓮城院HP_ver4/renjoin-temple/.env.local`
- **権限**: 600 (所有者のみ読み書き可能)
- **Git除外**: .gitignore により確実に除外

### セキュリティ要件遵守状況
✅ **機密情報管理**: 全てプレースホルダー化、実際の値は手動設定が必要
✅ **Git管理除外**: .gitignore の `.env*` パターンで除外済み
✅ **ファイル権限**: 600 に設定済み
✅ **ハードコード禁止**: 実際のAPIトークン等は含まれていない

### 設定済み環境変数項目
1. **Sanity CMS設定**
   - NEXT_PUBLIC_SANITY_PROJECT_ID
   - NEXT_PUBLIC_SANITY_DATASET  
   - NEXT_PUBLIC_SANITY_API_VERSION
   - NEXT_PUBLIC_SANITY_STUDIO_URL
   - SANITY_API_TOKEN

2. **Next.js認証設定**
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

3. **サイト設定**
   - NEXT_PUBLIC_SITE_URL

4. **分析設定**
   - NEXT_PUBLIC_GA_TRACKING_ID

5. **将来拡張用**
   - CONTACT_FORM_API_KEY
   - EMAIL_SERVICE_API_KEY
   - reCAPTCHA設定等

### セキュリティ警告
- 各環境変数の詳細な説明と取得方法を日本語で記載
- 機密情報取り扱いの注意事項を明記
- 本番環境での異なる値使用を強調

### 次のステップ
開発者は各環境変数に実際の値を設定する必要があります（プレースホルダー ""を実際の値に置換）。