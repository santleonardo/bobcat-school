// /api/npc-variant.js
// Gera variações de fala de NPCs para o jogo Interpretação — Harmonia.
// Usa a mesma chave GEMINI_API_KEY do /api/chat (Vercel).
// Recebe o cenário + lista de falas-base e devolve versões reescritas
// mantendo a mesma intenção interpretativa (o índice da resposta certa não muda).

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_ITEMS = 7;
const MAX_FIELD = 400;

function clip(v, max) {
  return String(v || '').slice(0, max).trim();
}

const SYSTEM = `Você reescreve diálogos de NPCs para um jogo educativo de interpretação de textos em português do Brasil.

Regras obrigatórias:
- Responda APENAS com JSON válido, sem markdown e sem cercas de código.
- Formato: {"items":[{"speech":"...","context":"..."}]}
- A quantidade de items deve ser IGUAL à quantidade recebida, na MESMA ordem.
- "speech" = o que o personagem diz (1 a 3 frases, tom natural, português do Brasil).
- "context" = 1 frase curta descrevendo a situação (sem aspas desnecessárias).
- Mantenha a MESMA intenção comunicativa e o mesmo grau de ambiguidade de cada fala original.
- NÃO mude o sentido de modo a invalidar a resposta correta de interpretação.
- Varie vocabulário, ordem das ideias e detalhes de superfície (nomes de objetos, horários, adjetivos).
- Não explique a regra; só devolva o JSON.`;

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
    const scenarioTitle = clip(body.scenarioTitle, 80);
    const who = clip(body.who, 80);
    const goal = clip(body.goal, 120);
    const playCount = Math.min(99, Math.max(1, parseInt(body.playCount, 10) || 1));
    const itemsIn = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];

    if (!itemsIn.length) {
      res.status(400).json({ error: 'Lista de falas vazia.' });
      return;
    }

    const packed = itemsIn.map((it, i) => ({
      i,
      speech: clip(it.speech, MAX_FIELD),
      context: clip(it.context, MAX_FIELD)
    }));

    const userPrompt = [
      `Cenário: ${scenarioTitle}`,
      `Personagem: ${who}`,
      `Objetivo do jogador: ${goal}`,
      `Esta é a ${playCount}ª vez que o aluno joga este cenário — faça as falas soarem frescas, não cópia.`,
      `Reescreva cada item abaixo:`,
      JSON.stringify(packed)
    ].join('\n');

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '');
      res.status(502).json({ error: 'Falha na IA', detail: errText.slice(0, 200) });
      return;
    }

    const data = await geminiRes.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        res.status(502).json({ error: 'Resposta da IA inválida' });
        return;
      }
      parsed = JSON.parse(match[0]);
    }

    const out = Array.isArray(parsed.items) ? parsed.items : [];
    const items = packed.map((orig, idx) => {
      const neu = out[idx] || {};
      return {
        speech: clip(neu.speech, MAX_FIELD) || orig.speech,
        context: clip(neu.context, MAX_FIELD) || orig.context
      };
    });

    res.status(200).json({ items, source: 'ai' });
  } catch (err) {
    console.error('npc-variant error', err);
    res.status(500).json({ error: 'Erro interno ao gerar variações' });
  }
};
