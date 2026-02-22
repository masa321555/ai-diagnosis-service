# Survibe AI — week3-2 引き継ぎ資料

## 1. サービス概要

AIキャリア診断サービス。10問の質問に回答すると、Claude Haiku がキャリアタイプ・おすすめ職種・ロードマップ等を生成する。

- **本番URL**: https://myboard321.site
- **リポジトリ**: https://github.com/masa321555/ai-diagnosis-service
- **ホスティング**: Vercel
- **DB**: MongoDB Atlas

---

## 2. 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript |
| UIライブラリ | Material-UI (MUI) |
| 認証 | NextAuth v5 + Google OAuth |
| DB | MongoDB Atlas + MongoDBAdapter |
| AI | Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| デプロイ | Vercel |

---

## 3. アプリ構成

### ページ一覧

| パス | 説明 |
|------|------|
| `/` | LP（ランディングページ） |
| `/auth/signin` | ログイン画面（Google OAuth） |
| `/dashboard` | ダッシュボード（メインハブ） |
| `/profile` | プロフィール編集（名前・生年月日・性別） |
| `/diagnosis` | 診断フォーム（10問） |
| `/diagnosis/result?id=xxx` | 診断結果表示（診断直後） |
| `/diagnosis/history` | 診断履歴一覧 |
| `/diagnosis/[id]` | 過去の診断結果詳細 |
| `/diagnosis/[id]/edit` | 診断メモ編集 |
| `/terms` | 利用規約 |
| `/privacy` | プライバシーポリシー |

### API一覧

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/auth/[...nextauth]` | - | NextAuth認証ハンドラ |
| `/api/diagnosis` | POST | 診断実行（AI呼び出し+DB保存） |
| `/api/diagnosis` | GET | 診断履歴一覧取得 |
| `/api/diagnosis/[id]` | GET | 診断結果詳細取得 |
| `/api/diagnosis/[id]` | PUT | メモ更新 |
| `/api/diagnosis/[id]` | DELETE | 診断結果削除 |
| `/api/user/profile` | GET | プロフィール取得 |
| `/api/user/profile` | PUT | プロフィール更新 |

### 主要コンポーネント

| ファイル | 説明 |
|---------|------|
| `app/components/Header.tsx` | LP用追従ヘッダー |
| `app/components/HeroSection.tsx` | LP ヒーローセクション |
| `app/components/FeatureSection.tsx` | LP 特徴セクション |
| `app/components/StepSection.tsx` | LP ステップセクション |
| `app/components/FAQSection.tsx` | LP よくある質問 |
| `app/components/CTASection.tsx` | LP CTAセクション |
| `app/components/CTAButton.tsx` | CTA共通ボタン |
| `app/components/Footer.tsx` | フッター |
| `app/diagnosis/_components/DiagnosisResultView.tsx` | 診断結果表示（共通コンポーネント） |
| `app/diagnosis/_data/questions.ts` | 質問データ定義 |

---

## 4. LP仕様

### 構成
Header → Hero → Feature → Step → FAQ → CTA → Footer

### キャッチコピー
「10問でわかる、あなたのキャリア」

### メタデータ（`app/layout.tsx`）
- title: `10問でわかる、あなたのキャリア | AIキャリア診断`
- description: `たった10問・3分で、AIがあなたに最適なキャリアロードマップを提案。`
- OGP・Twitter Card 対応済み

---

## 5. 診断ツール仕様

### 5-1. 質問一覧（10問）

| # | ID | 質問 | タイプ | 必須 |
|---|-----|------|--------|------|
| 1 | q1 | 現在の職業・状況 | single | Yes |
| 2 | q1_detail | 具体的な職種（自由入力） | text | Yes |
| 3 | q2 | 興味のある分野（複数選択可） | multiple | Yes |
| 4 | q3 | スキル・強みとレベル | skill-level | Yes |
| 5 | q4 | キャリアで最も重視すること | single | Yes |
| 6 | q5 | 将来の働き方の希望 | single | Yes |
| 7 | q7 | 現在の年収レンジ | single | Yes |
| 8 | q8 | 3年後の希望年収 | single | Yes |
| 9 | q9 | キャリアチェンジの時期感 | single | Yes |
| 10 | q6 | 今の不満・楽しい瞬間（自由入力） | text | No |

質問タイプ:
- `single`: ラジオボタン（1つ選択）
- `multiple`: チェックボックス（複数選択）
- `skill-level`: スキル名 × レベル（実務経験あり/勉強中/興味あり）
- `text`: 自由テキスト入力

### 5-2. AI診断の仕組み

**フロー**: 回答送信 → バリデーション → ユーザープロフィール取得（年齢・性別） → プロンプト構築 → Claude Haiku 呼び出し → JSON解析 → MongoDB保存 → 結果画面へリダイレクト

**AIモデル**: `claude-haiku-4-5-20251001` / max_tokens: `8192`

**プロンプトの要点**（`app/api/diagnosis/route.ts`）:
- 矛盾がある場合は無視せず現実的なステップを提案
- 具体的な職種名・ツール名・学習リソース名を含める
- 年収ギャップを踏まえた現実的な到達プラン
- おすすめ職種ごとに想定年収レンジを付記
- 転職緊急度に応じたロードマップのペース調整
- 各キャリアパスのリスクと対策を含める
- 年齢・性別情報がある場合はキャリアステージを考慮
- 各フィールドに文字数制限を設定（応答サイズ抑制）

### 5-3. 診断結果JSON構造

```json
{
  "careerType": "キャリアタイプ名（10文字以内）",
  "catchphrase": "キャッチコピー（40文字以内）",
  "summary": "診断概要（200文字以内）",
  "strengths": ["強み1", "強み2", "強み3"],
  "gapAnalysis": "Will×Canギャップ分析（200文字以内）",
  "recommendations": [
    { "jobTitle": "職種名（20文字以内）", "salaryRange": "○○〜○○万円", "fit": "適合理由（80文字以内）" }
  ],
  "riskAnalysis": "リスクと対策（200文字以内）",
  "roadmap": {
    "shortTerm": "短期プラン0〜6ヶ月（150文字以内）",
    "midTerm": "中期プラン6ヶ月〜2年（150文字以内）",
    "longTerm": "長期プラン2〜5年（150文字以内）"
  }
}
```

### 5-4. 結果表示画面の構成

`DiagnosisResultView.tsx` が結果表示を担当。以下の順で表示:

1. **キャリアタイプ**（グラデーションカード）
2. **キャッチコピー**（引用アイコン付き）
3. **診断概要**
4. **あなたの強み**（3項目）
5. **Will × Can ギャップ分析**
6. **おすすめの職種**（職種名 → 年収レンジ → 適合理由の縦並び）
7. **リスク分析と対策**（⚠アイコン付き）
8. **キャリアロードマップ**（短期・中期・長期）
9. **メモ**（ある場合のみ）
10. **あなたの回答内容**（質問と回答の一覧）

**後方互換**: `recommendations` は `string[] | RecommendationObj[]` のユニオン型。旧データ（string[]）も正常表示。`riskAnalysis`, `catchphrase`, `gapAnalysis` はオプショナル。

### 5-5. MongoDBデータ構造

**コレクション: `diagnoses`**
```json
{
  "_id": "ObjectId",
  "userId": "ユーザーID（文字列）",
  "answers": { "q1": "選択肢", "q2": ["選択肢1", "選択肢2"], "q3": {"スキル名": "レベル"}, ... },
  "result": { /* 上記JSON構造 */ },
  "memo": "ユーザーメモ",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**コレクション: `users`**（NextAuth MongoDBAdapter管理）
```json
{
  "_id": "ObjectId",
  "name": "名前",
  "email": "メール",
  "image": "アバターURL",
  "birthday": "YYYY-MM-DD or null",
  "gender": "male | female | other | prefer_not_to_say | null"
}
```

---

## 6. 認証仕様

- Google OAuth（NextAuth v5）
- セッション戦略: JWT
- `prompt: 'select_account'` でアカウント選択画面を表示
- JWTコールバックで `user.id` をトークンに保持
- sessionコールバックで `session.user.id` に反映

---

## 7. week3-2 対応履歴

| コミット | 内容 |
|---------|------|
| `e50acb9` | 質問3問追加、プロンプト改善、結果表示拡張 |
| `4b2bec0` | LPの質問数表記を5問→10問に修正 |
| `866fbcd` | 診断結果画面に回答内容の表示セクションを追加 |
| `5b8f0c8` | プロフィールの保存・取得バグ修正（ObjectId型不一致） |
| `30255cb` | おすすめ職種のレイアウトを縦並びに修正 |
| `9d1a4b1` | AI応答のトークン切れによるJSONパースエラー修正 |

---

## 8. 既知の注意点・今後の改善候補

### 注意点
- **ObjectIdの扱い**: `session.user.id` は文字列。MongoDBクエリ時は `new ObjectId(id)` で変換が必要（`as unknown as ObjectId` の型キャストは実行時に無効）
- **AI応答のJSON解析**: マークダウンコードブロックで囲まれる場合がある。正規表現で抽出 + `{`〜`}` のフォールバック抽出を実装済み
- **トークン上限**: `max_tokens: 8192` に設定済み。`stop_reason === 'max_tokens'` の場合はエラーを返す
- **後方互換**: 旧診断データ（recommendations が string[]、riskAnalysis なし）も表示可能

### 改善候補
- 診断結果のSNSシェア機能
- 診断結果の比較機能（複数回の診断結果を並べて表示）
- PDFエクスポート
- 診断結果に基づくおすすめ学習コンテンツのリンク
- AIモデルのアップグレード検討

---

## 9. ドキュメント一覧

| パス | 説明 |
|------|------|
| `docs/要件定義/01_ペルソナ定義.md` | ユーザーペルソナ定義 |
| `docs/要件定義/02_ユーザージャーニーマップ.md` | ユーザージャーニーマップ |
| `docs/要件定義/03_ユーザーニーズ洗い出し.md` | ユーザーニーズ整理 |
| `docs/要件定義/04_MVP機能一覧と優先順位.md` | MVP機能要件 |
| `docs/設計/LP設計書.md` | LP設計書 |
| `docs/設計/診断ツールブラッシュアップ_week3-2.md` | week3-2 変更仕様書 |
| `docs/テスト/LP動作確認チェックリスト.md` | LP動作確認 |
| `docs/テスト/Google認証動作確認チェックリスト.md` | 認証テスト |
| `docs/テスト/week3-1_AIキャリア診断_作業レポート.md` | week3-1 レポート |
