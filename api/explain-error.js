// /api/explain-error.js
// Função serverless da Vercel — gera explicações curtas para questões que o
// aluno errou numa lição ("Trilha de Erro"). Mesma chave/modelo do /api/chat.
//
// Não guarda nada em banco: recebe a pergunta + resposta do aluno + resposta
// certa, devolve uma explicação curta e alguns exemplos novos. Tudo efêmero.

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_FIELD_LENGTH = 300;
const MAX_EXAMPLES_ECHO = 6; // quantos exemplos anteriores aceitamos ecoar de volta (modo "more")

function clip(v, max) {
  return String(v || '').slice(0, max).trim();
}

function systemPromptFor(level) {
  const lvl = (level || 'A1').toUpperCase();
  const languageRule = ['A1', 'A2'].includes(lvl)
    ? 'The student is a beginner (A1/A2). Write the explanation mostly in Portuguese (Brazil), with the key English words/structure highlighted. Each example sentence must be in English, followed by a short Portuguese translation in parentheses.'
    : 'The student is intermediate or above (B1+). Write the explanation mostly in English, with at most one short Portuguese clarification if truly needed. Example sentences are in English only, no translation needed.';

  return `You are a friendly, encouraging English grammar tutor embedded in a school app for Brazilian students. A student just got one exercise question wrong. Your job is to help them understand the mistake in a warm, non-judgmental way — never make them feel bad about it.

${languageRule}

Rules:
- Be specific about THIS mistake: gently contrast what the student wrote with the correct answer, and explain the rule behind the correct answer.
- Keep the explanation short: 2 to 4 sentences max.
- Never lecture broadly about the whole grammar topic — stay focused on the exact point of confusion.
- Always respond with ONLY a raw JSON object, no markdown formatting, no code fences, matching exactly this shape:
{"explanation": "string", "examples": ["string", "string", "string"]}
- "examples" must contain exactly 3 short NEW English sentences (never reuse the student's exercise sentence) that show the correct pattern in a different everyday context.
- If asked for more examples ("mode: more"), skip re-explaining the rule — set "explanation" to a very short one-line transition (e.g. "Mais um pouco de prática:" style, in the same language as before), and provide 3 more NEW examples different from any already shown.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'A IA ainda não foi configurada no servidor. Veja o README para configurar na Vercel.'
    });
    return;
  }

  try {
    const body = req.body || {};
    const mode = body.mode === 'more' ? 'more' : 'explain';
    const level = clip(body.level, 10) || 'A1';
    const question = clip(body.question, MAX_FIELD_LENGTH);
    const studentAnswer = clip(body.studentAnswer, MAX_FIELD_LENGTH);
    const correctAnswer = clip(body.correctAnswer, MAX_FIELD_LENGTH);
    const lessonTitle = clip(body.lessonTitle, 120);
    const previousExamples = Array.isArray(body.previousExamples)
      ? body.previousExamples.slice(0, MAX_EXAMPLES_ECHO).map(e => clip(e, MAX_FIELD_LENGTH))
      : [];

    if (!question) {
      res.status(400).json({ error: 'Faltou a pergunta da questão.' });
      return;
    }

    const userParts = [
      `mode: ${mode}`,
      lessonTitle ? `Lesson topic: ${lessonTitle}` : '',
      `Question: ${question}`,
      `Student's answer: ${studentAnswer || '(deixou em branco)'}`,
      correctAnswer ? `Correct answer: ${correctAnswer}` : '',
      previousExamples.length
        ? `Examples already shown to the student (do not repeat these): ${previousExamples.join(' | ')}`
        : ''
    ].filter(Boolean).join('\n');

    const payload = {
      system_instruction: { parts: [{ text: systemPromptFor(level) }] },
      contents: [{ role: 'user', parts: [{ text: userParts }] }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.6,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: 'low' }
      }
    };

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      res.status(502).json({ error: 'Erro ao falar com a IA. Tente novamente em instantes.' });
      return;
    }

    const data = await geminiRes.json();
    const raw =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map(p => p.text || '').join('').trim();

    if (!raw) {
      res.status(502).json({ error: 'A IA não retornou uma resposta. Tente novamente.' });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Falha ao interpretar JSON da IA:', raw);
      res.status(502).json({ error: 'A IA respondeu em um formato inesperado. Tente novamente.' });
      return;
    }

    const explanation = clip(parsed.explanation, 800);
    const examples = Array.isArray(parsed.examples)
      ? parsed.examples.slice(0, 3).map(e => clip(e, 200)).filter(Boolean)
      : [];

    if (!explanation && !examples.length) {
      res.status(502).json({ error: 'A IA não retornou conteúdo útil. Tente novamente.' });
      return;
    }

    res.status(200).json({ explanation, examples });
  } catch (err) {
    console.error('Erro em /api/explain-error:', err);
    res.status(500).json({ error: 'Erro interno ao processar sua solicitação.' });
  }
};
