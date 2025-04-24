import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleAsk() {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>visang_securitybot</h1>
      <p>“회사의 개인정보 및 정보보안, 보안심사(ISMS, CSAP 등) 규정에 능한 신뢰도 높은 챗봇입니다.”</p>

      <textarea
        rows={3}
        style={{ width: '100%' }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="질문을 입력하세요..."
      />
      <br />
      <button onClick={handleAsk}>질문하기</button>
      <br /><br />
      <div><strong>답변:</strong><br />{answer}</div>
    </main>
  );
}
