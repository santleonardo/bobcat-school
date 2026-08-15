// /api/wordsearch-words.js
// Função serverless da Vercel — usada pelo Caça-Palavras de Português
// (lessons/caca-palavras-portugues.html) para gerar um banco de palavras
// NOVO a cada partida, em vez da lista fixa de 10 palavras por tema.
// Mesma chave/modelo dos outros endpoints de IA do projeto (GEMINI_API_KEY).
// Se a IA falhar por qualquer motivo, o cliente cai de volta na lista fixa
// (enviada aqui como "fallback") — o jogo nunca fica sem palavras.

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_COUNT = 14;
const MIN_LEN = 3;
const MAX_LEN = 14;
const MAX_FIELD = 120;
const MAX_LIST = 40;

function clip(v, max) {
  return String(v || '').slice(0, max).trim();
}

function stripAccents(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Só letras (sem espaço, número, hífen) — precisa caber numa grade de caça-palavras.
function isValidGridWord(w) {
  return /^[A-ZÀ-Ú]+$/i.test(w) && w.length >= MIN_LEN && w.length <= MAX_LEN;
}

function buildSystemPrompt(count) {
  return `Você é um dicionário/gerador de vocabulário para um jogo de caça-palavras dentro de um app de ensino de português para estudantes brasileiros do ensino médio.

Para cada rodada, você recebe um TEMA de gramática, literatura ou linguística (ex: "Figuras de Linguagem", "Tempos e Modos Verbais") e uma lista de palavras "conhecidas" (que já apareceram antes e devem ser evitadas, se possível, pra variar o jogo).

Gere ${count} palavras REAIS e relevantes para esse tema — termos técnicos de português que um estudante deveria reconhecer (pode reaproveitar termos já conhecidos SE não houver termos novos suficientes, mas priorize novidade).

Regras estritas para cada palavra:
- APENAS uma palavra única, sem espaço, sem hífen, sem número, sem sigla — só letras (acentos são aceitos, serão removidos depois).
- Entre 3 e 14 letras (fica melhor caber na grade).
- Tem que ser um termo real, correto e verificável do tema pedido (nada inventado).
- Não repita a mesma palavra duas vezes na lista.
- "definition": uma definição BEM curta (até 10 palavras), estilo verbete de dicionário escolar, em português.

Responda APENAS com um JSON puro, sem markdown, neste formato exato:
{"words":[{"word":"string","definition":"string"}, ... total de ${count} itens]}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'IA não configurada (GEMINI_API_KEY).' });
    return;
  }

  try {
    const body = req.body || {};
    const topicLabel = clip(body.topicLabel, MAX_FIELD);
    const topicId = clip(body.topicId, 60);
    const count = Math.min(MAX_COUNT, Math.max(4, parseInt(body.count, 10) || 10));
    const avoid = Array.isArray(body.avoid)
      ? body.avoid.map((w) => clip(w, 40)).filter(Boolean).slice(0, MAX_LIST)
      : [];
    const fallback = Array.isArray(body.fallback)
      ? body.fallback.map((w) => clip(w, 40)).filter(Boolean).slice(0, MAX_LIST)
      : [];

    if (!topicLabel) {
      res.status(400).json({ error: 'Tema vazio.' });
      return;
    }

    const userPrompt = [
      `Tema: ${topicLabel}`,
      avoid.length ? `Palavras já usadas antes (evite repetir se possível): ${avoid.join(', ')}` : 'Nenhuma palavra usada antes ainda.',
      `Gere ${count} palavras novas para esse tema seguindo as regras.`
    ].join('\n');

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(count) }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1400,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: 'low' }
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      console.error('Gemini API error:', geminiRes.status, errText);
      res.status(502).json({ error: 'Falha na IA', words: [] });
      return;
    }

    const data = await geminiRes.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim() || '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        res.status(502).json({ error: 'Resposta da IA inválida', words: [] });
        return;
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch (e2) {
        res.status(502).json({ error: 'Resposta da IA inválida', words: [] });
        return;
      }
    }

    const rawWords = Array.isArray(parsed.words) ? parsed.words : [];
    const seen = new Set();
    const words = [];

    rawWords.forEach((item) => {
      const wordRaw = clip(item && item.word, 40);
      const def = clip(item && item.definition, 140);
      if (!isValidGridWord(wordRaw)) return;
      const norm = stripAccents(wordRaw);
      if (seen.has(norm)) return;
      seen.add(norm);
      words.push({ word: norm, display: wordRaw, definition: def });
    });

    // Se a IA não devolveu palavras suficientes, completa com o fallback
    // (lista fixa mandada pelo cliente) até bater o count pedido.
    if (words.length < count && fallback.length) {
      for (const fw of fallback) {
        if (words.length >= count) break;
        const norm = stripAccents(fw);
        if (!isValidGridWord(norm) || seen.has(norm)) continue;
        seen.add(norm);
        words.push({ word: norm, display: fw, definition: '' });
      }
    }

    if (!words.length) {
      res.status(502).json({ error: 'A IA não retornou palavras válidas.', words: [] });
      return;
    }

    res.status(200).json({ words: words.slice(0, count), source: 'ai' });
  } catch (err) {
    console.error('Erro em /api/wordsearch-words:', err);
    res.status(500).json({ error: 'Erro interno ao gerar palavras.', words: [] });
  }
};
