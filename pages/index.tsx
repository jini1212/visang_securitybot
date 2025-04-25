import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Home() {
  const [pdfText, setPdfText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  async function extractTextFromPDF(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(' ') + '\n';
    }

    setPdfText(text);
  }

  async function handleAsk() {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context: pdfText }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>visang_securitybot</h1>
      <p>“회사의 개인정보 및 정보보안, 보안심사(ISMS, CSAP 등) 규정에 능한 신뢰도 높은 챗봇입니다.”</p>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) extractTextFromPDF(file);
        }}
      />
      <br /><br />

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
