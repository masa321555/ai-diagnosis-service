import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import client from '@/lib/db';
import { ObjectId } from 'mongodb';
import Anthropic from '@anthropic-ai/sdk';
import { QUESTIONS } from '@/app/diagnosis/_data/questions';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { answers } = await request.json();

  // バリデーション: 必須質問が回答済みか
  for (const q of QUESTIONS) {
    const answer = answers[q.id];
    // text型でrequired=falseの場合はスキップ可
    if (q.type === 'text' && !q.required) continue;
    if (!answer) {
      return NextResponse.json(
        { error: `質問「${q.text}」が未回答です` },
        { status: 400 }
      );
    }
    if (q.type === 'multiple' && (!Array.isArray(answer) || answer.length === 0)) {
      return NextResponse.json(
        { error: `質問「${q.text}」は1つ以上選択してください` },
        { status: 400 }
      );
    }
    if (q.type === 'skill-level' && (typeof answer !== 'object' || Array.isArray(answer) || Object.keys(answer).length === 0)) {
      return NextResponse.json(
        { error: `質問「${q.text}」は1つ以上スキルを選択してください` },
        { status: 400 }
      );
    }
  }

  // ユーザープロフィールから年齢・性別を取得
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

  let profileInfo = '';
  if (user?.birthday) {
    const birthDate = new Date(user.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    profileInfo += `年齢: ${age}歳\n`;
  }
  if (user?.gender) {
    const genderLabels: Record<string, string> = {
      male: '男性',
      female: '女性',
      other: 'その他',
      prefer_not_to_say: '回答なし',
    };
    profileInfo += `性別: ${genderLabels[user.gender] ?? user.gender}\n`;
  }

  // プロンプト構築
  const answersText = QUESTIONS.map((q) => {
    const answer = answers[q.id];
    if (!answer) return `${q.text}: （未回答）`;
    if (q.type === 'skill-level' && typeof answer === 'object' && !Array.isArray(answer)) {
      const skillEntries = Object.entries(answer as Record<string, string>)
        .map(([skill, level]) => `  - ${skill}: ${level}`)
        .join('\n');
      return `${q.text}:\n${skillEntries}`;
    }
    const answerStr = Array.isArray(answer) ? answer.join('、') : answer;
    return `${q.text}: ${answerStr}`;
  }).join('\n');

  const prompt = `あなたはプロのキャリアアドバイザーです。以下のユーザーの回答を元に、深い洞察に基づいたキャリア診断を行ってください。

【重要な指示】
- ユーザーの入力内容に矛盾がある場合（例：スキルなしで開発職希望、安定志向で起業希望など）、それを無視せずに「ここがハードルになるため、このようなステップが必要です」と現実的なアドバイスを行ってください。
- 診断結果は抽象的な言葉（リーダーシップ、課題解決力など）で終わらせず、具体的な職種名、具体的なツール名、具体的なアクションに落とし込んでください。
- ユーザーの「現在のスキル（Can）」から「目標（Will）」に到達するための架け橋となる具体的な手段を提示してください。
- ロードマップには具体的な学習リソース（Progate、Udemy講座名、Google認定資格など）やツール名を含めてください。
- 「明日何をすべきか」がわかるレベルの具体性を持たせてください。
- 現在の年収と希望年収のギャップを踏まえ、現実的な到達プランを提示してください。年収アップに必要なスキル・資格・経験を具体的に示してください。
- おすすめ職種ごとに想定年収レンジを付記してください。
- 転職の緊急度に応じてロードマップのペース配分を調整してください（「すぐに転職したい」なら短期に重点、「1〜2年かけて準備」なら中長期に重点）。
- 各キャリアパスのリスク（市場の競争激化、スキル陳腐化、年齢要因など）と、そのリスクへの対策を含めてください。
${profileInfo ? `- ユーザーの年齢・性別情報が提供されています。年齢に応じたキャリアステージ（第二新卒/若手/中堅/ベテラン等）を考慮し、年齢層に適した転職市場の現実やキャリア戦略を反映してください。性別に関しては、業界の多様性や働き方の選択肢に配慮した助言を行ってください。summaryの冒頭で「XX代のYY」のように年齢層を踏まえた分析であることを明示してください。` : ''}
【ユーザーのプロフィール】
${profileInfo || '（未登録）'}

【ユーザーの回答】
${answersText}

以下のJSON形式のみで回答してください。JSON以外のテキスト、マークダウン記法（\`\`\`など）は絶対に含めないでください。
【重要】各フィールドの文字数制限を厳守してください。jobTitleは20文字以内の簡潔な職種名にしてください。salaryRangeは「○○〜○○万円」の形式で15文字以内にしてください。
{
  "careerType": "キャリアタイプ名（10文字以内。例：テックイノベーター型）",
  "catchphrase": "キャッチコピー（40文字以内）",
  "summary": "診断結果の概要（200文字以内）",
  "strengths": ["具体的な強み1（30文字以内）", "強み2", "強み3"],
  "gapAnalysis": "Will×Canギャップ分析（200文字以内）",
  "recommendations": [
    { "jobTitle": "職種名（20文字以内）", "salaryRange": "○○〜○○万円", "fit": "適合理由（80文字以内）" },
    { "jobTitle": "職種名", "salaryRange": "○○〜○○万円", "fit": "適合理由" },
    { "jobTitle": "職種名", "salaryRange": "○○〜○○万円", "fit": "適合理由" }
  ],
  "riskAnalysis": "キャリアパスのリスクと対策（200文字以内）",
  "roadmap": {
    "shortTerm": "短期プラン0〜6ヶ月（150文字以内）",
    "midTerm": "中期プラン6ヶ月〜2年（150文字以内）",
    "longTerm": "長期プラン2〜5年（150文字以内）"
  }
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'AI応答の解析に失敗しました' },
        { status: 500 }
      );
    }

    // トークン上限で途中切れした場合のチェック
    if (message.stop_reason === 'max_tokens') {
      console.error('診断エラー: AI応答がトークン上限で途中切れしました');
      return NextResponse.json(
        { error: 'AI応答が長すぎて途中で切れました。もう一度お試しください。' },
        { status: 500 }
      );
    }

    // JSONブロックを抽出（```json...```、閉じなし、または生JSONに対応）
    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
    // それでもパースできない場合、最初の { から最後の } までを抽出
    if (!jsonText.startsWith('{')) {
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonText = jsonText.slice(start, end + 1);
      }
    }
    const result = JSON.parse(jsonText);

    // MongoDBに保存
    const now = new Date();
    const doc = {
      userId: session.user.id,
      answers,
      result,
      memo: '',
      createdAt: now,
      updatedAt: now,
    };

    const insertResult = await db.collection('diagnoses').insertOne(doc);

    return NextResponse.json({
      _id: insertResult.insertedId.toString(),
      ...doc,
    });
  } catch (error) {
    console.error('診断エラー:', error);
    return NextResponse.json(
      { error: '診断の実行に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const db = client.db();
  const diagnoses = await db
    .collection('diagnoses')
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .project({
      userId: 1,
      'result.careerType': 1,
      'result.summary': 1,
      createdAt: 1,
    })
    .toArray();

  return NextResponse.json(diagnoses);
}
