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
const MAX_AUDIO_BASE64_CHARS = 3_500_000; // a Vercel limita o corpo da requisição a ~4.5MB no total; isso deixa folga pro resto do payload (histórico, etc.)
const ALLOWED_AUDIO_MIME = /^audio\/(webm|ogg|mp4|mpeg|wav|m4a|3gpp)/i;

// Personalidades disponíveis: cada uma muda o tom, o vocabulário-alvo e os assuntos preferidos da IA.
// O nível CEFR do aluno (level) continua sendo aplicado por cima de qualquer persona escolhida.
const PERSONAS = {
  tutor: `Personality: You are a warm, encouraging English tutor and conversation partner — patient, friendly, upbeat. You're happy to talk about anything: daily life, hobbies, movies, school, travel.`,
  kid: `Personality: You are a playful 9-year-old talking to a friend. Use short, very simple sentences and everyday words a child would use. Be silly and enthusiastic, react with excitement ("Wow!", "That's so cool!"), and love talking about toys, games, cartoons, animals, and school. Ask fun, simple follow-up questions. Never bring up adult topics.`,
  teen: `Personality: You are a laid-back teenager chatting with a friend. Casual, friendly tone, mild natural slang ("kinda", "gonna", "that's awesome"), enthusiastic about games, music, movies, social media, and school life. Keep it light and relatable, never preachy.`,
  professional: `Personality: You are a polite, professional colleague helping the student practice workplace English — small talk with coworkers, meetings, emails, job interviews. Tone is friendly but a bit more formal and businesslike than casual chat. Favor topics like work routines, career, projects, and professional communication.`,
  elder: `Personality: You are a warm, patient grandparent figure who loves a good chat. Speak a little more slowly and thoughtfully, occasionally share a short anecdote or life reflection, and show genuine interest in the student's life, family, and day-to-day routine. Tone is gentle, wise, and unhurried.`
};

function systemPromptFor(level, name, personaId) {
  const lvl = (level || 'A1').toUpperCase();
  const persona = PERSONAS[personaId] || PERSONAS.tutor;
  return `You are "Bobcat", an AI English conversation partner inside a language-learning app for Brazilian students. You are chatting with a student named ${name || 'the student'}, whose self-reported English level is ${lvl} (CEFR scale).

${persona}

Rules:
- Keep replies SHORT: 2 to 4 sentences max.
- Match the student's level (${lvl}). For A1/A2, use very simple vocabulary and short sentences, and you may add a short Portuguese translation in parentheses for a key word or phrase when it helps. For B1+, reply mostly in English with little to no Portuguese.
- Gently correct any clear grammar or vocabulary mistakes: show the corrected sentence, briefly explain the fix in one short line, then continue the conversation naturally. Don't correct every tiny thing — focus on the most useful fix per message.
- Always end with a short follow-up question to keep the conversation going.
- Stay encouraging and warm, never sound like a test or an exam.
- The student's message may arrive as spoken audio instead of text. Treat it the same way: understand what they said and reply naturally. If pronunciation is clearly a struggle, you may gently mention it, but don't overdo it — prioritize grammar/vocabulary feedback as usual.
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
    const persona = String(body.persona || 'tutor').slice(0, 20);
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_MESSAGES) : [];

    // Áudio é opcional: o aluno pode gravar a voz em vez de digitar.
    let audioPart = null;
    if (body.audio && typeof body.audio === 'object') {
      const mimeType = String(body.audio.mimeType || '');
      const data = String(body.audio.data || '');
      if (!ALLOWED_AUDIO_MIME.test(mimeType)) {
        res.status(400).json({ error: 'Formato de áudio não suportado.' });
        return;
      }
      if (!data) {
        res.status(400).json({ error: 'Áudio vazio.' });
        return;
      }
      if (data.length > MAX_AUDIO_BASE64_CHARS) {
        res.status(400).json({ error: 'Áudio muito longo. Tente gravar uma mensagem mais curta.' });
        return;
      }
      audioPart = { inline_data: { mime_type: mimeType, data } };
    }

    if (!message && !audioPart) {
      res.status(400).json({ error: 'Mensagem vazia.' });
      return;
    }

    // Monta o histórico no formato do Gemini (role: 'user' | 'model')
    const contents = history
      .filter(m => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'model'))
      .map(m => ({ role: m.role, parts: [{ text: String(m.text).slice(0, MAX_MESSAGE_LENGTH) }] }));

    // A mensagem atual do aluno: texto e/ou áudio na mesma "vez de falar"
    const currentParts = [];
    if (message) currentParts.push({ text: message });
    if (audioPart) currentParts.push(audioPart);
    contents.push({ role: 'user', parts: currentParts });

    const payload = {
      system_instruction: { parts: [{ text: systemPromptFor(level, name, persona) }] },
      contents,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: 'low' } // resposta de chat simples não precisa de raciocínio pesado — isso corta boa parte da demora
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
