import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { question } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '너는 중견기업의 정보보안 전문가야. 사용자의 질문에 맞춰 보안 정책, ISMS, CSAP 기준에 따라 친절하게 안내해줘.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    }),
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || '죄송해요, 답변을 가져오지 못했어요.';

  res.status(200).json({ answer });
}
