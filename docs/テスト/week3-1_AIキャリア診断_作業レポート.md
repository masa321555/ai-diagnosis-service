# AIキャリア診断機能 作業レポート（week3-1）

## 概要

会員限定のAIキャリア診断機能を実装した。ユーザーが7問の質問に回答し、Claude Haiku 4.5で分析、結果をMongoDBに保存する。CRUD操作（作成・読取・更新・削除）に対応。

---

## 実装した機能

### 1. 診断フォーム（ステッパー形式）
- 7問の質問に1問ずつ回答するUI（MUI Stepper）
- 4種類の入力タイプに対応:
  - **単一選択（Radio）**: 職業・状況、重視すること、働き方の希望
  - **複数選択（Checkbox）**: 興味のある分野
  - **スキルレベル選択（Chip）**: スキルごとに「実務経験あり / 勉強中 / 興味あり」を選択
  - **自由記述（TextField）**: 具体的な職種、不満・楽しい瞬間

### 2. AI診断（Claude Haiku 4.5）
- Anthropic SDK経由でClaude Haiku 4.5を呼び出し
- プロンプトにギャップ分析・具体的なリソース提示を指示
- JSON形式でレスポンスを取得し、MongoDBに保存

### 3. 診断結果表示
- キャリアタイプ名（グラデーションカード）
- キャッチコピー（SNSプロフィール向け）
- 診断概要
- 強み一覧（Chip）
- Will × Can ギャップ分析
- おすすめ職種（Chip）
- キャリアロードマップ（短期・中期・長期）
- メモ欄

### 4. CRUD操作
| 操作 | エンドポイント | 説明 |
|------|---------------|------|
| 作成 | `POST /api/diagnosis` | 診断実行 + MongoDB保存 |
| 一覧 | `GET /api/diagnosis` | ユーザーの診断履歴（要約） |
| 詳細 | `GET /api/diagnosis/[id]` | 診断結果の全フィールド取得 |
| 更新 | `PUT /api/diagnosis/[id]` | メモの編集 |
| 削除 | `DELETE /api/diagnosis/[id]` | 診断結果の削除 |

### 5. 認証・認可
- `/diagnosis` 以下は会員限定（未ログイン時は `/auth/signin` にリダイレクト）
- APIは `auth()` で認証チェック + 所有者チェック（他ユーザーのデータにアクセス不可）

---

## 作成・修正したファイル一覧

### 新規作成（10ファイル）

| ファイル | 説明 |
|---------|------|
| `app/diagnosis/_data/questions.ts` | 7問の質問データ定義（4種類の入力タイプ） |
| `app/diagnosis/_components/DiagnosisResultView.tsx` | 診断結果表示の共通コンポーネント |
| `app/diagnosis/page.tsx` | 診断フォームページ（ステッパー形式） |
| `app/diagnosis/result/page.tsx` | 診断結果ページ（診断直後） |
| `app/diagnosis/history/page.tsx` | 診断履歴一覧ページ |
| `app/diagnosis/[id]/page.tsx` | 診断結果詳細ページ（履歴から） |
| `app/diagnosis/[id]/edit/page.tsx` | メモ編集ページ |
| `app/api/diagnosis/route.ts` | 診断API（POST: 実行 / GET: 一覧） |
| `app/api/diagnosis/[id]/route.ts` | 診断個別API（GET / PUT / DELETE） |

### 修正（3ファイル）

| ファイル | 変更内容 |
|---------|---------|
| `middleware.ts` | matcherに `/diagnosis/:path*` を追加 |
| `auth.config.ts` | protectedPathsに `/diagnosis` を追加 |
| `app/dashboard/page.tsx` | Coming Soon Snackbar → `/diagnosis` リンクに変更、診断履歴リンク追加 |

### 環境設定

| ファイル | 変更内容 |
|---------|---------|
| `package.json` | `@anthropic-ai/sdk` を追加 |
| `.env.local` | `ANTHROPIC_API_KEY` を追加 |

---

## 質問構成（改善後）

| # | 質問ID | 入力タイプ | 質問内容 |
|---|--------|-----------|---------|
| 1 | q1 | 単一選択 | 現在の職業・状況 |
| 2 | q1_detail | 自由記述（必須） | 具体的な職種 |
| 3 | q2 | 複数選択 | 興味のある分野 |
| 4 | q3 | スキルレベル選択 | スキル・強みとレベル |
| 5 | q4 | 単一選択 | キャリアで重視すること |
| 6 | q5 | 単一選択 | 将来の働き方の希望 |
| 7 | q6 | 自由記述（任意） | 不満なこと / 楽しい瞬間 |

---

## MongoDBドキュメント構造（diagnoses コレクション）

```typescript
{
  _id: ObjectId,
  userId: string,
  answers: {
    q1: string,
    q1_detail: string,
    q2: string[],
    q3: { [skill: string]: "実務経験あり" | "勉強中" | "興味あり" },
    q4: string,
    q5: string,
    q6: string,  // 任意
  },
  result: {
    careerType: string,      // キャリアタイプ名
    catchphrase: string,     // キャッチコピー
    summary: string,         // 診断概要
    strengths: string[],     // 強み一覧
    gapAnalysis: string,     // Will×Canギャップ分析
    recommendations: string[], // おすすめ職種
    roadmap: {
      shortTerm: string,     // 短期プラン（0〜6ヶ月）
      midTerm: string,       // 中期プラン（6ヶ月〜2年）
      longTerm: string,      // 長期プラン（2年〜5年）
    },
  },
  memo: string,
  createdAt: Date,
  updatedAt: Date,
}
```

---

## フィードバック対応（改善内容）

初回実装後のフィードバックを受けて以下を改善した。

### 入力フェーズ：解像度向上
- **具体的な職種の自由記述を追加**（q1_detail）: 「社会人」だけでなく「法人営業」「Webエンジニア」等の具体的な情報を取得
- **スキルレベルの段階化**（q3）: チェックボックス → 「実務経験あり / 勉強中 / 興味あり」の3段階に変更
- **自由記述の追加**（q6）: 「不満なこと / 楽しい瞬間」でAIが生の言葉を拾えるようにした

### ロジックフェーズ：プロンプト強化
- **ギャップ分析指示**: Will（やりたい）× Can（できる）の矛盾を指摘するよう指示
- **具体性の要求**: 抽象語ではなく具体的な職種名・ツール名・学習リソース名を出すよう指示
- **現実的なアドバイス**: 入力に矛盾がある場合はハードルと対処法を提示するよう指示
- **max_tokens**: 1024 → 2048 に増加（より詳細な回答を生成するため）

### 出力フェーズ：結果の具体化
- **キャッチコピー追加**: 職務経歴書やSNSプロフィールに使える自己PR文を生成
- **ギャップ分析追加**: 理想と現実の差分と、その架け橋となる具体的手段を表示
- **ロードマップの具体化**: 学習リソース（Progate、Udemy等）やツール名を含む詳細なプラン
- **共通コンポーネント化**: `DiagnosisResultView` で結果表示を統一し、コードの重複を削減

---

## 発生した問題と対応

### 1. JSON.parseエラー
- **問題**: Claude APIが ````json ... ` `` ` で囲んだレスポンスを返し、`JSON.parse` が失敗
- **対応**: 正規表現でJSONブロックを抽出する処理を追加
- **追加対応**: プロンプトに「マークダウン記法は絶対に含めない」を明記

### 2. useSearchParams の Suspense boundary エラー
- **問題**: Next.js 16で `useSearchParams()` は Suspense境界内で使用する必要がある
- **対応**: `result/page.tsx` にSuspenseラッパーコンポーネントを追加

---

## 検証方法

1. `npm run dev` でローカルサーバー起動
2. 未ログイン時に `/diagnosis` → `/auth/signin` にリダイレクトされることを確認
3. ログイン後、ダッシュボード → 「キャリア診断を始める」で診断フォーム表示
4. 7問に回答 → 「診断する」→ AI分析結果が表示される
5. 結果にキャッチコピー・ギャップ分析・具体的なロードマップが含まれることを確認
6. 「診断履歴」で過去の結果一覧が表示される
7. 詳細表示・メモ編集・削除が正常動作する
8. SP表示でレイアウトが崩れないか確認

---

## ページ遷移図

```
ダッシュボード (/dashboard)
  ├─→ キャリア診断を始める → 診断フォーム (/diagnosis)
  │                            └─→ 診断結果 (/diagnosis/result?id=xxx)
  │                                  ├─→ 診断履歴 (/diagnosis/history)
  │                                  └─→ もう一度診断 → /diagnosis
  └─→ 診断履歴を見る → 診断履歴 (/diagnosis/history)
                          └─→ カードクリック → 詳細 (/diagnosis/[id])
                                                ├─→ メモを編集 (/diagnosis/[id]/edit)
                                                ├─→ もう一度診断 → /diagnosis
                                                └─→ 診断履歴一覧に戻る → /diagnosis/history
```
