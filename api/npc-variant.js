// /api/npc-variant.js
// Gera variações de fala + alternativas para Interpretação — Harmonia.
// Dificuldade sobe com careerPhase e playCount: distratores mais convincentes,
// resposta certa menos "didática"/óbvia, fala mais ambígua.

const MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_ITEMS = 10;
const MAX_FIELD = 480;

function clip(v, max) {
  return String(v || '').slice(0, max).trim();
}

function difficultyGuide(phase, playCount) {
  const p = Math.max(1, Math.min(5, parseInt(phase, 10) || 1));
  const pc = Math.max(1, parseInt(playCount, 10) || 1);
  if (p <= 1 && pc <= 1) {
    return `DIFICULDADE BAIXA (fase inicial):
- Fala com intenção legível, sem armadilha excessiva.
- Alternativa correta pode ser a mais equilibrada e clara.
- Distratores podem ser extremos ou pouco plausíveis.
- Ainda assim, NÃO escreva a correta com palavras tipo "a leitura mais madura/equilibrada/precisa".`;
  }
  if (p <= 2) {
    return `DIFICULDADE MÉDIA:
- Fala com ambiguidade moderada (tom misto, cortesia + pressão).
- Alternativa correta deve exigir perceber o implícito, não só o literal.
- Pelo menos 2 distratores devem parecer razoáveis à primeira leitura.
- Evite distratores caricatos ("pedir demissão", "atacar a pessoa").`;
  }
  if (p === 3) {
    return `DIFICULDADE ALTA (vendas/carreira):
- Fala de cliente com sinal misto (interesse + objeção + teste).
- A correta NÃO deve soar como conselho de livro didático.
- Os 3 distratores devem ser interpretações parcialmente verdadeiras ou táticas comuns de vendedor iniciante.
- Inclua um distrator "quase certo" que captura só metade da intenção.`;
  }
  if (p === 4) {
    return `DIFICULDADE MUITO ALTA (gestão):
- Fala com camada política/emocional (status, medo, lealdade).
- Correta: leitura sistêmica, sem moralismo explícito na redação da opção.
- Distratores: leituras legítimas em outro contexto, mas erradas AQUI.
- Proibido: opção correta começando com "Validar", "Reconhecer de forma madura", "A leitura equilibrada".`;
  }
  return `DIFICULDADE MÁXIMA (comitê/crise/conselho):
- Máxima ambiguidade: silêncio, ironia, veto indireto, duplo vínculo.
- Opção correta deve ser a que sobrevive ao pior cenário / alocação de poder — formulada de modo sóbrio, quase técnico.
- Distratores altamente persuasivos (otimismo político, lealdade cega, formalismo rígido, cinismo total).
- NUNCA use nas opções as palavras: maduro, equilibrado, harmonia, implícito, leitura precisa, saudável.
- A diferença entre certa e errada deve exigir juízo fino, não senso comum óbvio.
- playCount=${pc}: se >1, aumente ainda mais a ambiguidade da fala e a semelhança entre opções.`;
}

const SYSTEM = `Você prepara partidas de um jogo de interpretação de intenções (português do Brasil).

Para CADA item você recebe: speech, context, ask, options[4], correctIndex (0-3).

Devolva APENAS JSON válido:
{"items":[{"speech":"...","context":"...","options":["...","...","...","..."]}]}

Regras:
1. Mesma quantidade de items, mesma ordem.
2. Reescreva speech e context (tom natural, 1–3 frases / 1 frase).
3. Reescreva as 4 options NA MESMA ORDEM de significado: options[i] deve continuar sendo a MESMA interpretação que options[i] original (a correta continua no mesmo correctIndex).
4. NÃO revele qual é a correta na redação (sem "a melhor leitura", "o certo é", etc.).
5. NÃO mude o sentido da fala a ponto de invalidar a opção no correctIndex.
6. Siga o guia de DIFICULDADE do usuário à risca.
7. Sem markdown, sem comentários — só o JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { requireSupabaseUser } = require('./_auth');
  const auth = await requireSupabaseUser(req);
  if (!auth.ok) {
    res.status(auth.status).json({ error: auth.error });
    return;
  }


  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'IA não configurada (GEMINI_API_KEY).' });
    return;
  }

  try {
    const body = req.body || {};
    const scenarioTitle = clip(body.scenarioTitle, 100);
    const who = clip(body.who, 80);
    const goal = clip(body.goal, 160);
    const playCount = Math.min(99, Math.max(1, parseInt(body.playCount, 10) || 1));
    const careerPhase = Math.min(5, Math.max(1, parseInt(body.careerPhase, 10) || 1));
    const itemsIn = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];

    if (!itemsIn.length) {
      res.status(400).json({ error: 'Lista de falas vazia.' });
      return;
    }

    const packed = itemsIn.map((it, i) => {
      const options = Array.isArray(it.options) ? it.options.map((o) => clip(o, 220)).slice(0, 4) : [];
      while (options.length < 4) options.push('(opção)');
      const correctIndex = Math.min(3, Math.max(0, parseInt(it.correctIndex, 10) || 0));
      return {
        i,
        speech: clip(it.speech, MAX_FIELD),
        context: clip(it.context, MAX_FIELD),
        ask: clip(it.ask, 220),
        options,
        correctIndex
      };
    });

    const userPrompt = [
      `Cenário: ${scenarioTitle}`,
      `Personagem: ${who}`,
      `Objetivo do jogador: ${goal}`,
      `Fase de carreira: ${careerPhase} | Partida nº: ${playCount}`,
      difficultyGuide(careerPhase, playCount),
      `Reescreva cada item (speech, context e as 4 options, preservando o significado por índice):`,
      JSON.stringify(packed)
    ].join('\n\n');

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: careerPhase >= 4 ? 0.85 : 0.9,
          maxOutputTokens: 8192,
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
    const raw = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
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
      let options = Array.isArray(neu.options)
        ? neu.options.map((o) => clip(o, 220)).slice(0, 4)
        : [];
      // Garante 4 opções; se IA falhar, mantém originais
      if (options.length < 4) options = orig.options.slice();
      else {
        for (let j = 0; j < 4; j++) {
          if (!options[j]) options[j] = orig.options[j];
        }
      }
      return {
        speech: clip(neu.speech, MAX_FIELD) || orig.speech,
        context: clip(neu.context, MAX_FIELD) || orig.context,
        options,
        // correctIndex permanece o do original (mesma ordem semântica)
        correctIndex: orig.correctIndex
      };
    });

    res.status(200).json({ items, source: 'ai', careerPhase, playCount });
  } catch (err) {
    console.error('npc-variant error', err);
    res.status(500).json({ error: 'Erro interno ao gerar variações' });
  }
};
