// /api/vocab-lookup.js
// Função serverless da Vercel — usada pelo "Mapa de Vocabulário Clicável" no
// chat com o tutor de IA: o aluno toca numa palavra da resposta da IA e essa
// função devolve tradução, pronúncia e exemplos curtos pra um mini-cartão.
// Mesma chave/modelo do /api/chat. Não guarda nada em banco: tudo efêmero,
// o cliente que decide cachear no localStorage.

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_WORD_LENGTH = 40;
const MAX_CONTEXT_LENGTH = 300;

function clip(v, max) {
  return String(v || '').slice(0, max).trim();
}

function systemPromptFor(level) {
  const lvl = (level || 'A1').toUpperCase();
  return `You are a bilingual (English / Brazilian Portuguese) dictionary assistant embedded in a language-learning app for Brazilian students. The student tapped on a single word or short expression that appeared in a conversation with an AI English tutor, and wants a quick reference card for it.

The student's self-reported English level is ${lvl} (CEFR scale) — keep translations and examples appropriate for that level (very simple for A1/A2, richer for B1+).

Rules:
- You will receive the tapped word/expression AND the full sentence it came from, for context. Use the context to pick the right meaning and part of speech (e.g. "left" as in a direction vs. past tense of "leave").
- If the tapped text is actually Portuguese (this happens — sometimes the tutor writes a Portuguese translation in parentheses), detect that and translate it TO English instead, keeping the same JSON shape (just swap the direction).
- "pronunciation_ipa": the standard IPA transcription for the word (English pronunciation), e.g. "/əˈdvɛntʃər/". If the word is Portuguese, give the Portuguese IPA instead.
- "pronunciation_easy": a simple, phonetic "sounds like" respelling that is easy for a Portuguese speaker to read out loud, using Portuguese spelling conventions (e.g. for "adventure" something like "ad-VÊN-tchur"). Keep it short.
- "examples": exactly 2 short NEW example sentences using the word naturally (not copied from the context sentence), each as an object with "en" (English) and "pt" (natural Brazilian Portuguese translation, not word-for-word).
- Keep everything concise. This is a small popup card, not an essay.
- Respond with ONLY a raw JSON object, no markdown formatting, no code fences, matching exactly this shape:
{"word": "string", "translation": "string", "part_of_speech": "string", "pronunciation_ipa": "string", "pronunciation_easy": "string", "examples": [{"en": "string", "pt": "string"}, {"en": "string", "pt": "string"}]}`;
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
    const word = clip(body.word, MAX_WORD_LENGTH);
    const context = clip(body.context, MAX_CONTEXT_LENGTH);
    const level = clip(body.level, 10) || 'A1';

    if (!word) {
      res.status(400).json({ error: 'Palavra vazia.' });
      return;
    }

    const userText = context
      ? `Word/expression tapped: "${word}"\nFull sentence it came from: "${context}"`
      : `Word/expression tapped: "${word}"\n(no extra sentence context available)`;

    const payload = {
      system_instruction: { parts: [{ text: systemPromptFor(level) }] },
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      generationConfig: {
        maxOutputTokens: 260,
        temperature: 0.4,
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
      res.status(502).json({ error: 'Erro ao buscar a palavra. Tente novamente.' });
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
      res.status(502).json({ error: 'A IA não retornou uma resposta para essa palavra.' });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      res.status(502).json({ error: 'Não consegui interpretar a resposta da IA.' });
      return;
    }

    const examples = Array.isArray(parsed.examples)
      ? parsed.examples
          .slice(0, 2)
          .map(ex => ({ en: clip(ex && ex.en, 200), pt: clip(ex && ex.pt, 200) }))
          .filter(ex => ex.en)
      : [];

    const result = {
      word: clip(parsed.word, MAX_WORD_LENGTH) || word,
      translation: clip(parsed.translation, 120),
      partOfSpeech: clip(parsed.part_of_speech, 40),
      pronunciationIpa: clip(parsed.pronunciation_ipa, 80),
      pronunciationEasy: clip(parsed.pronunciation_easy, 80),
      examples
    };

    if (!result.translation) {
      res.status(502).json({ error: 'Não consegui traduzir essa palavra agora.' });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Erro em /api/vocab-lookup:', err);
    res.status(500).json({ error: 'Erro interno ao buscar a palavra.' });
  }
};
