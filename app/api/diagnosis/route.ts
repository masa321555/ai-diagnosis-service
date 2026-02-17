import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import client from '@/lib/db';
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

【ユーザーの回答】
${answersText}

以下のJSON形式のみで回答してください。JSON以外のテキスト、マークダウン記法（\`\`\`など）は絶対に含めないでください。
{
  "careerType": "キャリアタイプ名（例：テックイノベーター型、DXブリッジ人材型）",
  "catchphrase": "職務経歴書やSNSプロフィールに使えるキャッチコピー（例：営業力×AI活用で企業のDXを加速させるブリッジ人材）",
  "summary": "診断結果の概要。ユーザーの現在の状況と可能性を踏まえた分析（200〜300文字）",
  "strengths": ["現在のスキルや経験に基づく具体的な強み1", "強み2", "強み3"],
  "gapAnalysis": "Will（やりたいこと）とCan（できること）のギャップ分析。現実的なハードルとその乗り越え方（200〜300文字）",
  "recommendations": ["具体的な職種名1", "具体的な職種名2", "具体的な職種名3", "具体的な職種名4"],
  "roadmap": {
    "shortTerm": "短期プラン（0〜6ヶ月）：明日から始められる具体的なアクション。学習リソース名やツール名を含める",
    "midTerm": "中期プラン（6ヶ月〜2年）：具体的なスキル習得目標と資格・ポートフォリオの計画",
    "longTerm": "長期プラン（2年〜5年）：目標とするポジションと到達するための具体的なマイルストーン"
  }
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'AI応答の解析に失敗しました' },
        { status: 500 }
      );
    }

    // ```json ... ``` で囲まれている場合はJSONブロックを抽出
    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }
    const result = JSON.parse(jsonText);

    // MongoDBに保存
    const db = client.db();
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
