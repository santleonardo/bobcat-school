// /api/chat.js
// Função serverless da Vercel — roda no servidor, nunca no navegador do aluno.
// É aqui (e só aqui) que a chave da IA fica guardada, na variável de ambiente
// GEMINI_API_KEY (configurada no painel da Vercel, nunca neste arquivo).
//
// Usa o Gemini 3.5 Flash-Lite (Google AI Studio), que tem cota gratuita
// generosa o suficiente para uma escola pequena (na prática, R$ 0 de custo).
// Se quiser trocar de modelo depois, basta mudar a constante MODEL abaixo.

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Limites simples para controlar custo/abuso mesmo estando na cota grátis.
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 16; // ~8 idas e vindas de contexto

function systemPromptFor(level, name) {
  const lvl = (level || 'A1').toUpperCase();
  return `You are "Bobcat", a friendly and patient English conversation partner inside a language-learning app for Brazilian students. You are chatting with a student named ${name || 'the student'}, whose self-reported English level is ${lvl} (CEFR scale).

Rules:
- Keep replies SHORT: 2 to 4 sentences max.
- Match the student's level (${lvl}). For A1/A2, use very simple vocabulary and short sentences, and you may add a short Portuguese translation in parentheses for a key word or phrase when it helps. For B1+, reply mostly in English with little to no Portuguese.
- Gently correct any clear grammar or vocabulary mistakes: show the corrected sentence, briefly explain the fix in one short line, then continue the conversation naturally. Don't correct every tiny thing — focus on the most useful fix per message.
- Always end with a short follow-up question to keep the conversation going.
- Stay encouraging and warm, never sound like a test or an exam.
- Only discuss appropriate, everyday topics suitable for a school app (hobbies, daily life, travel, food, school, etc). If the student goes off-topic into inappropriate territory, gently steer the conversation back to safe, everyday English practice.
- Never claim to be a human teacher; you're an AI conversation partner that helps the student practice.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY não configurada no servidor. Veja o README para configurar na Vercel.'
    });
    return;
  }

  try {
    const body = req.body || {};
    const message = String(body.message || '').slice(0, MAX_MESSAGE_LENGTH).trim();
    const level = String(body.level || 'A1').slice(0, 10);
    const name = String(body.name || '').slice(0, 60);
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_MESSAGES) : [];

    if (!message) {
      res.status(400).json({ error: 'Mensagem vazia.' });
      return;
    }

    // Monta o histórico no formato do Gemini (role: 'user' | 'model')
    const contents = history
      .filter(m => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'model'))
      .map(m => ({ role: m.role, parts: [{ text: String(m.text).slice(0, MAX_MESSAGE_LENGTH) }] }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const payload = {
      system_instruction: { parts: [{ text: systemPromptFor(level, name) }] },
      contents,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
        thinking_level: 'low' // resposta de chat simples não precisa de raciocínio pesado — isso corta boa parte da demora
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
    const reply =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map(p => p.text || '').join('').trim();

    if (!reply) {
      res.status(502).json({ error: 'A IA não retornou uma resposta. Tente reformular sua mensagem.' });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Erro em /api/chat:', err);
    res.status(500).json({ error: 'Erro interno ao processar sua mensagem.' });
  }
};
