# -*- coding: utf-8 -*-
"""Expand lessons 1-30 (except 3) to full Lição-3 structure."""
from pathlib import Path
import json

OUT = Path(__file__).resolve().parent

def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            .replace('"', '&quot;'))

def dialogue_html(lines):
    parts = []
    for who, name, text in lines:
        parts.append(f'''  <div class="bubble-row reveal">
    <span class="miniav {who}">{name[0]}</span>
    <div class="bubble {who}"><span class="who">{esc(name)}</span>{esc(text)}
      <button class="audio-btn" onclick="speak(this,{json.dumps(text)})">🔊</button>
    </div>
  </div>''')
    return '\n'.join(parts)

def vocab_table(rows):
    trs = []
    for en, pt, ex in rows:
        trs.append(f'<tr><td>{esc(en)} <button class="audio-btn" onclick="speak(this,{json.dumps(en.split("/")[0].strip())})">🔊</button></td><td>{esc(pt)}</td><td>{esc(ex)}</td></tr>')
    return '<table class="lesson-table reveal"><thead><tr><th>English</th><th>Português</th><th>Exemplo</th></tr></thead><tbody>\n' + '\n'.join(trs) + '\n</tbody></table>'

def grammar_html(blocks):
    cards = []
    for title, rule, ex in blocks:
        cards.append(f'''  <div class="card reveal" style="margin-bottom:12px">
    <h3 style="margin:0 0 6px;color:var(--orange-dark);font-size:16px">{esc(title)}</h3>
    <p style="margin:0 0 8px;font-size:14px">{rule}</p>
    <div class="struct-example">{esc(ex)}</div>
  </div>''')
    return '\n'.join(cards)

def quiz_js(items):
    # items: (prompt, options, correct_index)
    arr = []
    for p, opts, ci in items:
        arr.append({'prompt': p, 'options': opts, 'answer': ci})
    return json.dumps(arr, ensure_ascii=False)

def fill_js(items):
    arr = [{'s': a, 'a': b} for a, b in items]
    return json.dumps(arr, ensure_ascii=False)

def build(L):
    n = L['num']
    total_q = len(L['quiz']) + len(L['fill'])
    objs = ''.join(
        f'<div class="card obj-card"><span class="ic">{o[0]}</span><h3>{esc(o[1])}</h3><p>{esc(o[2])}</p></div>'
        for o in L['objs']
    )
    oral = ''.join(f'<li>{esc(x)}</li>' for x in L['oral'])
    review = ''.join(f'<li>{esc(x)}</li>' for x in L['review'])
    dialogue = dialogue_html(L['dialogue'])
    vocab = vocab_table(L['vocab'])
    grammar = grammar_html(L['grammar_blocks'])
    quiz_data = quiz_js(L['quiz'])
    fill_data = fill_js(L['fill'])

    return f'''<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bobcat Language School — Lição {n} — {esc(L['title'])}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="lesson-kit.css">
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
</head><body>
<div class="hud" id="hud">
  <div class="hud-left"><span>🐾 Bobcat</span>
    <div class="xp-track"><div class="xp-fill" id="xpBar"></div></div>
    <span id="xpLabel" style="font-weight:700;color:var(--orange-dark)">0 XP</span>
  </div>
  <div class="hud-right">
    <span class="pill" id="levelPill">⭐ Nível 1</span>
    <span class="pill" id="starsPill">🏆 0 estrelas</span>
  </div>
</div>
<header class="hero" id="hero" style="background:linear-gradient(180deg,rgba(43,27,18,0) 40%,rgba(43,27,18,.78) 100%),url('{L['hero']}') center/cover no-repeat">
  <div class="wrap hero-inner">
    <a class="back-link" href="../index.html" style="color:#fff;opacity:.9">← Voltar ao app</a>
    <span class="badge">🐾 Bobcat · {esc(L['level'])}</span>
    <h1>{esc(L['title'])}</h1>
    <p class="lede">{esc(L['lede'])}</p>
    <div class="hero-cta"><a href="#objetivos" class="btn">Começar →</a></div>
  </div>
</header>
<div class="wrap">

<section class="section" id="objetivos">
  <div class="section-head reveal"><span class="sec-num">1</span>
    <div><h2 class="sec-title">🎯 Objetivos da Lição</h2><p class="sec-sub">Ao final desta lição você será capaz de:</p></div>
  </div>
  <div class="grid-3 reveal">{objs}</div>
</section>

<section class="section" id="warmup">
  <div class="section-head reveal"><span class="sec-num">2</span>
    <div><h2 class="sec-title">🔥 Warm-Up</h2><p class="sec-sub">Ative o cérebro antes de estudar.</p></div>
  </div>
  <div class="card reveal callout" style="font-size:15px;line-height:1.55">{esc(L['warmup'])}</div>
</section>

<section class="section" id="dialogue" style="background:linear-gradient(180deg,var(--cream-3),#fff)">
  <div class="section-head reveal"><span class="sec-num">3</span>
    <div><h2 class="sec-title">🎧 Listening &amp; Speaking — "{esc(L['dialogue_title'])}"</h2>
    <p class="sec-sub">{esc(L['dialogue_sub'])}</p></div>
  </div>
{dialogue}
  <p class="reveal" style="margin-top:12px;font-size:13px;color:var(--ink-soft)">Ouça (🔊), repita em voz alta e troque os papéis.</p>
</section>

<section class="section" id="vocab">
  <div class="section-head reveal"><span class="sec-num">4</span>
    <div><h2 class="sec-title">🔍 Vocabulário da Lição</h2><p class="sec-sub">Palavras e expressões essenciais.</p></div>
  </div>
  {vocab}
</section>

<section class="section" id="grammar" style="background:linear-gradient(180deg,#fff,var(--cream-3))">
  <div class="section-head reveal"><span class="sec-num">5</span>
    <div><h2 class="sec-title">📘 Gramática — {esc(L['grammar_title'])}</h2>
    <p class="sec-sub">Estrutura e uso no dia a dia.</p></div>
  </div>
{grammar}
</section>

<section class="section" id="exercises">
  <div class="section-head reveal"><span class="sec-num">6</span>
    <div><h2 class="sec-title">🎮 Exercícios Interativos</h2><p class="sec-sub">Pratique e ganhe XP!</p></div>
  </div>

  <div class="game-wrap reveal" id="game1">
    <div class="game-title">⚡ Quiz Relâmpago <span class="score-badge" id="quizScore">0/{len(L['quiz'])}</span></div>
    <div id="quizGame"></div>
    <div class="game-actions"><button class="btn" type="button" id="btnQuizNext">Próxima →</button></div>
  </div>

  <div class="game-wrap reveal" id="game2" style="margin-top:16px">
    <div class="game-title">✍️ Complete as lacunas <span class="score-badge" id="sFill">0/{len(L['fill'])}</span></div>
    <div id="fillBox"></div>
    <div class="game-actions"><button class="btn" type="button" onclick="checkFill()">Verificar</button></div>
  </div>
</section>

<section class="section" id="oral" style="background:linear-gradient(180deg,var(--cream-3),#fff)">
  <div class="section-head reveal"><span class="sec-num">7</span>
    <div><h2 class="sec-title">🎭 Prática Oral — Role-play</h2><p class="sec-sub">Fale em voz alta (só ou em dupla).</p></div>
  </div>
  <div class="card reveal"><ol style="margin:0;padding-left:18px;line-height:1.7">{oral}</ol></div>
</section>

<section class="section" id="twister">
  <div class="section-head reveal"><span class="sec-num">8</span>
    <div><h2 class="sec-title">👅 Trava-língua (Tongue Twister)</h2><p class="sec-sub">Repita 3× cada vez mais rápido.</p></div>
  </div>
  <div class="card reveal" style="text-align:center;font-size:17px;font-weight:700;line-height:1.5">
    {esc(L['twister'])}
    <div style="margin-top:10px"><button class="audio-btn btn" onclick="speak(this,{json.dumps(L['twister'])})">🔊 Ouvir</button></div>
  </div>
</section>

<section class="section" id="culture" style="background:linear-gradient(180deg,#fff,var(--cream-3))">
  <div class="section-head reveal"><span class="sec-num">9</span>
    <div><h2 class="sec-title">🌍 Curiosidade Cultural</h2><p class="sec-sub">Inglês no mundo real.</p></div>
  </div>
  <div class="card reveal callout" style="line-height:1.55">{esc(L['culture'])}</div>
</section>

<section class="section" id="review">
  <div class="section-head reveal"><span class="sec-num">10</span>
    <div><h2 class="sec-title">🔁 Revisão Rápida</h2><p class="sec-sub">Os pontos-chave em um minuto.</p></div>
  </div>
  <div class="card reveal"><ul style="margin:0;padding-left:18px;line-height:1.7">{review}</ul></div>
</section>

<section class="section" id="homework" style="background:linear-gradient(180deg,var(--cream-3),#fff)">
  <div class="section-head reveal"><span class="sec-num">11</span>
    <div><h2 class="sec-title">🏠 Tarefa de Casa</h2><p class="sec-sub">Pratique fora do app.</p></div>
  </div>
  <div class="card reveal" style="line-height:1.55">{esc(L['homework'])}</div>
  <div style="margin-top:18px;text-align:center" class="reveal">
    <button class="btn" type="button" id="btnFinish">🏁 Finalizar Lição</button>
    <p id="finishMsg" class="finish-msg" style="display:none;margin-top:12px;font-weight:700;color:var(--ok)">Parabéns! Lição concluída 🎉</p>
    <p id="finishMessage" style="display:none"></p>
  </div>
</section>

</div>
<script src="lesson-kit.js"></script>
<script>
const LESSON_ID = {json.dumps(L['id'])};
const TOTAL_Q = {total_q};
var SCORE = {{ correct: 0, total: TOTAL_Q }};
function norm(s){{ return (s||'').toString().trim().toLowerCase().replace(/[.!?]/g,''); }}
function addXP(n){{ if(window.BobcatLesson) BobcatLesson.addXP(n); }}

/* Quiz */
var QUIZ = {quiz_data};
var qi = 0, qCorrect = 0, qAnswered = false;
function renderQuiz(){{
  var box = document.getElementById('quizGame');
  if(qi >= QUIZ.length){{
    box.innerHTML = '<p style="font-weight:700;color:var(--ok)">Quiz completo! '+qCorrect+'/'+QUIZ.length+' acertos.</p>';
    document.getElementById('btnQuizNext').style.display='none';
    return;
  }}
  qAnswered = false;
  var q = QUIZ[qi];
  var opts = q.options.map(function(o,i){{
    return '<button type="button" class="btn secondary" style="margin:6px 6px 0 0" data-i="'+i+'">'+o+'</button>';
  }}).join('');
  box.innerHTML = '<p style="font-weight:700;font-size:16px;margin:0 0 10px">'+(qi+1)+'. '+q.prompt+'</p><div>'+opts+'</div>';
  box.querySelectorAll('button[data-i]').forEach(function(b){{
    b.addEventListener('click', function(){{
      if(qAnswered) return; qAnswered = true;
      var ok = +b.dataset.i === q.answer;
      if(ok){{ qCorrect++; addXP(15); b.style.background='var(--ok)'; b.style.color='#fff'; }}
      else {{ b.style.background='var(--bad)'; b.style.color='#fff'; }}
      document.getElementById('quizScore').textContent = qCorrect+'/'+QUIZ.length;
      SCORE.correct = qCorrect + fillCorrect;
    }});
  }});
}}
document.getElementById('btnQuizNext').addEventListener('click', function(){{
  if(!qAnswered && qi < QUIZ.length) return;
  qi++; renderQuiz();
}});
renderQuiz();

/* Fill */
var FILL = {fill_data};
var fillCorrect = 0;
(function(){{
  var el = document.getElementById('fillBox');
  FILL.forEach(function(item,i){{
    var p = item.s.split('___');
    var row = document.createElement('div');
    row.className = 'fill-row';
    row.innerHTML = '<span>'+p[0]+'</span><input class="practice-input" id="fill_'+i+'" style="max-width:110px"><span>'+(p[1]||'')+'</span>';
    el.appendChild(row);
  }});
}})();
function checkFill(){{
  fillCorrect = 0;
  FILL.forEach(function(item,i){{
    var inp = document.getElementById('fill_'+i);
    var ok = norm(inp.value) === norm(item.a);
    inp.className = 'practice-input '+(ok?'correct':'incorrect');
    if(ok) fillCorrect++;
  }});
  document.getElementById('sFill').textContent = fillCorrect+'/'+FILL.length;
  addXP(fillCorrect*12);
  SCORE.correct = qCorrect + fillCorrect;
  if(SCORE.correct >= Math.floor(TOTAL_Q*0.8) && window.BobcatLesson) BobcatLesson.fireConfetti();
}}

document.getElementById('btnFinish').addEventListener('click', function(){{
  SCORE.correct = qCorrect + fillCorrect;
  SCORE.total = TOTAL_Q;
  document.getElementById('finishMsg').style.display = 'block';
  if(window.BobcatLesson){{
    BobcatLesson.complete({{ correct: SCORE.correct, total: SCORE.total }});
    BobcatLesson.fireConfetti();
  }}
}});

if(window.BobcatLesson) BobcatLesson.init({{ lessonId: LESSON_ID, totalQuestions: TOTAL_Q }});
</script>
</body></html>
'''

# ── Content for all lessons except 3 ─────────────────────────────────────
def L(**kw): return kw

DATA = []

def add(num, **kw):
    kw['num'] = num
    DATA.append(kw)

# Shared heroes
H1='https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=1200'
H2='https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200'
H3='https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200'
H4='https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1200'
H5='https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200'

add(1, file='verb-to-be.html', id='verb-to-be', level='A1', title='Verb To Be',
    lede='am, is, are — afirmativas, negativas e perguntas', hero=H1,
    objs=[('📝','Formas','Usar am, is e are'),('🚫','Negativas','Formar negativas com not'),('❓','Perguntas','Yes/No questions')],
    warmup='Complete: "I ___ a student. She ___ a teacher. They ___ friends."',
    dialogue_title='At the Cafe', dialogue_sub='Anna e Tom usam o verbo to be.',
    dialogue=[('anna','Anna','Hi! I am Anna. Are you a student?'),('tom','Tom','Yes, I am. I am from Brazil. Is she your friend?'),('anna','Anna','Yes, she is. We are classmates.')],
    vocab=[('am','eu sou/estou','I am happy.'),('is','ele/ela é','She is a teacher.'),('are','você/nós/eles','You are my friend.'),("I'm",'contração','I\'m fine.'),("isn't",'is not','He isn\'t here.'),("aren't",'are not','They aren\'t ready.')],
    grammar_title='Verbo To Be',
    grammar_blocks=[('Afirmativa','I am / You are / He-She-It is / We-They are.','I am a student.'),('Negativa','am/is/are + not.','He isn\'t at home.'),('Pergunta','Am/Is/Are + sujeito?','Are you ready?')],
    quiz=[('I ___ a teacher.',['am','is','are'],0),('She ___ from Japan.',['am','is','are'],1),('They ___ my friends.',['am','is','are'],2),('___ you a student?',['Am','Is','Are'],2),('He ___ not at home.',['am','is','are'],1),('We ___ happy.',['am','is','are'],2),('___ she your sister?',['Am','Is','Are'],1),('I ___ not Brazilian.',['am','is','are'],0)],
    fill=[('I ___ Brazilian.','am'),('She ___ a doctor.','is'),('They ___ students.','are'),('___ you ready?','Are'),('He ___ not here.','is')],
    oral=['Apresente-se com to be.','Pergunte "Are you…?" ao parceiro.'],
    twister='She is sure she is a seller of sea shells.',
    culture='To be aparece o tempo todo em inglês para identidade, estado e lugar.',
    review=['I am / You are / He is','Negativa: isn\'t / aren\'t','Pergunta: Are you…?'],
    homework='Escreva 8 frases com to be: 3 + 3 negativas + 2 perguntas.')

add(2, file='saudacoes-apresentacoes.html', id='saudacoes-apresentacoes', level='A1', title='Saudações e Apresentações',
    lede='Greetings, introductions e diálogos', hero=H2,
    objs=[('👋','Saudações','Hello, Good morning…'),('🤝','Apresentações','Nice to meet you'),('💬','Diálogos','Cumprimentar e se apresentar')],
    warmup='Liste 3 formas de dizer "oi" em inglês.',
    dialogue_title='First Day', dialogue_sub='Anna conhece Tom.',
    dialogue=[('anna','Anna','Good morning! My name is Anna. Nice to meet you.'),('tom','Tom','Hi, Anna! I\'m Tom. Nice to meet you too.'),('anna','Anna','How are you today?'),('tom','Tom','I\'m fine, thanks. And you?')],
    vocab=[('Hello / Hi','Oi','Hi, how are you?'),('Good morning','Bom dia','Good morning!'),('Good evening','Boa noite','Good evening.'),('Nice to meet you','Prazer','Nice to meet you.'),('How are you?','Como vai?','How are you?'),("I'm fine",'Estou bem','I\'m fine, thanks.')],
    grammar_title='Saudações e Cortesia',
    grammar_blocks=[('Por horário','morning / afternoon / evening','Good morning, class!'),('Apresentação',"My name is… / I'm…",'I\'m Lucas.'),('Resposta','Nice to meet you too. / Fine, thanks.','Fine, thanks. And you?')],
    quiz=[('___ morning!',['Good','Nice','Well'],0),('My name ___ Sofia.',['am','is','are'],1),('Nice to ___ you.',['meet','met','meeting'],0),('How ___ you?',['is','are','am'],1),("I'm fine, ___.",['please','thanks','sorry'],1),('Good ___ (à noite).',['morning','evening','day'],1),('___ to meet you too.',['Nice','Good','Well'],0),('I ___ Pedro.',['am','is','are'],0)],
    fill=[('___ morning!','Good'),('My name ___ Carla.','is'),('Nice to ___ you.','meet'),('How ___ you?','are'),("I'm fine, ___.",'thanks')],
    oral=['Cumprimente conforme o horário.','Apresente-se e pergunte o nome.'],
    twister='Hi Harry, how happy are you today?',
    culture='"How are you?" em inglês costuma ser cumprimento curto, não um relatório do dia.',
    review=['Hello / Good morning','My name is…','Nice to meet you'],
    homework='Grave 30s: cumprimento + nome + How are you?')

add(4, file='licao-3-revisao-perguntas.html', id='licao-3-revisao-perguntas', level='A1', title='Revisão: Quem é Você? O Que é Isso?',
    lede='To Be, saudações e Wh- questions', hero=H3,
    objs=[('🔁','Revisar','To Be + saudações'),('❓','Wh-','Who, What, Where'),('🗣️','Praticar','Diálogos')],
    warmup='Diga 3 perguntas em inglês de cabeça.',
    dialogue_title='Meeting Again', dialogue_sub='Anna e Tom revisam perguntas.',
    dialogue=[('tom','Tom','Hi Anna! How are you?'),('anna','Anna','I\'m great! Who is that?'),('tom','Tom','That is my brother. His name is Paul.'),('anna','Anna','Where is he from?'),('tom','Tom','He is from Rio.')],
    vocab=[('Who','Quem','Who is she?'),('What','O que','What is this?'),('Where','Onde','Where are you from?'),('How','Como','How are you?'),('This/That','Isto/Aquilo','What is that?'),('from','de (origem)','I am from Brazil.')],
    grammar_title='Revisão Integrada',
    grammar_blocks=[('To Be','I am / She is + identidade','I am a student.'),('Wh- + to be','Wh- + am/is/are + sujeito?','Where are you from?'),('Diálogo','Hi + How are you? + Wh-','Who is he?')],
    quiz=[('___ is your name?',['Who','What','Where'],1),('___ are you from?',['What','Where','Who'],1),('___ is that man?',['Who','What','How'],0),('I ___ Brazilian.',['am','is','are'],0),('___ you a teacher?',['Am','Is','Are'],2),('What ___ this?',['am','is','are'],1),('Nice to ___ you.',['meet','met','meeting'],0),('How ___ she?',['am','is','are'],1)],
    fill=[('___ is your name?','What'),('___ are you from?','Where'),('___ is he?','Who'),('I ___ a student.','am'),('___ you OK?','Are')],
    oral=['Faça 5 Wh- questions.','Apresente alguém (who/where).'],
    twister='What, where, who — which will you choose?',
    culture='Wh- questions abrem qualquer conversa em inglês.',
    review=['What / Who / Where','To Be','Cumprimentar + perguntar'],
    homework='Minidiálogo com 6 falas: saudação + to be + 3 Wh-.')

add(5, file='licao-4-preposicoes.html', id='licao-4-preposicoes', level='A1', title='Preposições: Onde? Com Quem? Como?',
    lede='Preposições de lugar e companhia', hero=H4,
    objs=[('📍','Lugar','in, on, at, under…'),('👥','Companhia','with, without'),('🗺️','Localizar','Descrever onde as coisas estão')],
    warmup='Onde está seu celular agora? Tente dizer em inglês.',
    dialogue_title='Where is my bag?', dialogue_sub='Anna procura a mochila.',
    dialogue=[('anna','Anna','Tom, where is my bag?'),('tom','Tom','Is it on the table?'),('anna','Anna','No… Oh! It is under the chair.'),('tom','Tom','And your keys are in the bag.')],
    vocab=[('in','em (dentro)','in the box'),('on','em cima','on the table'),('at','em (ponto)','at school'),('under','debaixo','under the bed'),('with','com','with my friend'),('next to','ao lado','next to the door')],
    grammar_title='Preposições de Lugar',
    grammar_blocks=[('in / on / at','in = dentro; on = superfície; at = ponto.','in the room / on the desk / at home'),('under / next to','under = embaixo; next to = ao lado.','under the chair'),('with','Companhia.','I am with my brother.')],
    quiz=[('The book is ___ the table.',['in','on','at'],1),('She is ___ home.',['in','on','at'],2),('The cat is ___ the bed.',['under','on','at'],0),('I live ___ Brazil.',['in','on','at'],0),('He sits ___ me.',['next to','in','at'],0),('Keys are ___ the bag.',['in','on','at'],0),('Coffee is ___ the cup.',['in','on','at'],0),('We are ___ the park.',['in','on','at'],0)],
    fill=[('The phone is ___ the table.','on'),('She is ___ school.','at'),('The shoes are ___ the bed.','under'),('I am ___ my friend.','with'),('We live ___ São Paulo.','in')],
    oral=['Descreva 5 objetos na sala com preposições.','Pergunte "Where is…?" ao parceiro.'],
    twister='Where is the red bag under the big black bed?',
    culture='At home / at school são chunks fixos — não diga "in home".',
    review=['in / on / at','under / next to','with'],
    homework='Liste 10 objetos da sua casa e diga onde estão.')

add(6, file='licao-5-posse.html', id='licao-5-posse', level='A1', title='Posse: De Quem É?',
    lede="Possessivos, 's e whose", hero=H5,
    objs=[('🎒',"Possessivos",'my, your, his, her…'),(" ’s","Genitive",'Anna\'s bag'),('❓','Whose','Whose is this?')],
    warmup='Pegue um objeto e diga: "This is my…"',
    dialogue_title="Whose phone?", dialogue_sub='Tom acha um celular.',
    dialogue=[('tom','Tom','Whose phone is this?'),('anna','Anna',"It\'s not my phone. Maybe it\'s Paul\'s."),('tom','Tom',"Is it his phone?"),('anna','Anna','Yes! It is his.')],
    vocab=[('my / your','meu / seu','my book'),('his / her','dele / dela','her bag'),('our / their','nosso / deles','their house'),("Anna's","de Anna","Anna's car"),('whose','de quem','Whose is this?'),("it's",'it is',"It's mine.")],
    grammar_title='Posse em Inglês',
    grammar_blocks=[('Adjetivos possessivos','my, your, his, her, our, their + substantivo','This is my bag.'),(" 's",'Nome + \'s + coisa',"Tom's bike"),('Whose','Whose + substantivo / Whose is this?','Whose book is this?')],
    quiz=[('This is ___ book.',['my','me','I'],0),("That is ___ bag.",["Anna","Anna's","Annas"],1),('___ phone is this?',['Who','Whose','Who\'s'],1),('It is ___ (dele).',['his','he','him'],0),('___ names are Ana and Bi.',['They','Their','Them'],1),('Is this ___ pencil?',['you','your','yours'],1),("The dog is ___ (da Maria).",["Maria","Maria's","Marias"],1),('___ house is big.',['Our','We','Us'],0)],
    fill=[('This is ___ bag. (meu)','my'),("It is ___ book. (da Ana)","Ana's"),('___ car is this?','Whose'),('It is ___ (dela).','her'),('___ school is new. (nossa)','Our')],
    oral=['Mostre objetos e diga de quem são.','Pergunte "Whose is this?"'],
    twister="Is this Chris's Swiss watch or Jill's?",
    culture="Em inglês o 's de posse é muito comum: today's class, my friend's house.",
    review=['my/your/his/her','Nome + \'s','Whose…?'],
    homework='Escreva 10 frases de posse sobre objetos da sua família.')

add(7, file='licao-12-simple-present-daily-life.html', id='licao-12-simple-present-daily-life', level='A1', title='Simple Present: Rotina e Hábitos',
    lede='Rotina diária no presente simples', hero=H1,
    objs=[('🗓️','Rotina','I work / She works'),('⏰','Hábitos','always, usually, sometimes'),('🗣️','Falar do dia','Descrever seu dia')],
    warmup='Que horas você acorda? Tente dizer em inglês.',
    dialogue_title='A Normal Day', dialogue_sub='Anna conta a rotina.',
    dialogue=[('tom','Tom','What time do you wake up?'),('anna','Anna','I usually wake up at 7. I have breakfast and go to work.'),('tom','Tom','Does your brother work too?'),('anna','Anna','Yes, he works in a bank. He starts at 9.')],
    vocab=[('wake up','acordar','I wake up at 7.'),('have breakfast','tomar café','She has breakfast.'),('go to work','ir ao trabalho','I go to work.'),('usually','geralmente','I usually read.'),('always','sempre','He always smiles.'),('sometimes','às vezes','We sometimes cook.')],
    grammar_title='Simple Present',
    grammar_blocks=[('Forma base','I/You/We/They + verbo','I work every day.'),('He/She/It','verbo + s/es','She works. He watches TV.'),('Frequência','always, usually, sometimes, never','I always drink coffee.')],
    quiz=[('She ___ to school.',['go','goes','going'],1),('I ___ up at 6.',['wake','wakes','waking'],0),('He ___ TV at night.',['watch','watchs','watches'],2),('They ___ breakfast together.',['has','have','haves'],1),('I ___ drink coffee.',['always','always to','am always'],0),('___ she work here?',['Do','Does','Is'],1),('We ___ play soccer.',['sometimes','sometimes to','are sometimes'],0),('He ___ not like tea.',['do','does','is'],1)],
    fill=[('She ___ (work) in a hospital.','works'),('I ___ (wake) up early.','wake'),('He ___ (watch) movies.','watches'),('They ___ (have) lunch at 12.','have'),('___ you study English?','Do')],
    oral=['Conte sua rotina da manhã.','Pergunte a rotina do parceiro.'],
    twister='She sells fresh bread every busy breakfast.',
    culture='Em inglês, hábitos usam Simple Present — não Present Continuous.',
    review=['I work / She works','always / usually / sometimes','Do/Does para perguntar'],
    homework='Escreva sua rotina em 8 frases no Simple Present.')

add(8, file='licao-10-do-does-to-for.html', id='licao-10-do-does-to-for', level='A1', title='Do / Does · To e For',
    lede='Perguntas com Do/Does e uso de to e for', hero=H2,
    objs=[('❓','Do / Does','Perguntas no presente'),('➡️','To','Direção e infinitivo'),('🎁','For','Benefício e duração')],
    warmup='Como você pergunta "Você gosta de café?" em inglês?',
    dialogue_title='Plans', dialogue_sub='Tom pergunta sobre planos.',
    dialogue=[('tom','Tom','Do you study English every day?'),('anna','Anna','Yes, I do. I study to travel.'),('tom','Tom','Does your sister study too?'),('anna','Anna','Yes. This book is for her.')],
    vocab=[('do / does','auxiliar','Do you like…?'),('to','para / a','go to school / to learn'),('for','para / por','for you / for two hours'),('every day','todo dia','I run every day.'),('Yes, I do','Sim','Yes, I do.'),('No, she doesn\'t','Não','No, she doesn\'t.')],
    grammar_title='Do/Does e To/For',
    grammar_blocks=[('Do / Does','Do + I/you/we/they; Does + he/she/it','Does she live here?'),('To','Direção (to school) ou propósito (to learn)','I go to work to earn money.'),('For','Benefício (for you) ou duração (for 2 hours)','This gift is for you.')],
    quiz=[('___ you like pizza?',['Do','Does','Are'],0),('___ she work here?',['Do','Does','Is'],1),('I go ___ school.',['to','for','at'],0),('This is ___ my mom.',['to','for','at'],1),('We waited ___ an hour.',['to','for','at'],1),('He studies ___ pass the test.',['to','for','at'],0),('___ they play soccer?',['Do','Does','Are'],0),('She comes ___ the office.',['to','for','in'],0)],
    fill=[('___ you live in Brazil?','Do'),('___ your mother cook?','Does'),('I go ___ school.','to'),('This present is ___ my sister.','for'),('She studies ___ learn English.','to')],
    oral=['Faça 5 perguntas com Do/Does.','Use to e for em 4 frases.'],
    twister='Does Dan do the dishes for Donna daily?',
    culture='Do/Does não se traduz palavra a palavra — é o "esqueleto" da pergunta.',
    review=['Do vs Does','to = direção/propósito','for = benefício/duração'],
    homework='10 frases: 5 Do/Does e 5 com to/for.')

add(9, file='licao-13-perguntas-simple-present.html', id='licao-13-perguntas-simple-present', level='A1', title='Perguntas no Simple Present',
    lede='Wh- questions no presente simples', hero=H3,
    objs=[('❓','Wh- + do/does','What do you…?'),('🗣️','Perguntar','Sobre hábitos'),('💬','Responder','Respostas curtas e longas')],
    warmup='Pergunte mentalmente: What do you do on Sundays?',
    dialogue_title='Weekend Plans', dialogue_sub='O que cada um faz no fim de semana.',
    dialogue=[('anna','Anna','What do you do on Saturdays?'),('tom','Tom','I play soccer. What about you?'),('anna','Anna','I visit my family. Where does your sister work?'),('tom','Tom','She works at a hospital.')],
    vocab=[('What do you…?','O que você…?','What do you eat?'),('Where does he…?','Onde ele…?','Where does he live?'),('When do they…?','Quando…?','When do they study?'),('Why do you…?','Por que…?','Why do you run?'),('How often','Com que frequência','How often do you cook?'),('on Saturdays','aos sábados','on Sundays')],
    grammar_title='Perguntas no Presente',
    grammar_blocks=[('Wh- + do','Wh- + do + sujeito + verbo','What do you study?'),('Wh- + does','Wh- + does + he/she/it + verbo','Where does she live?'),('Resposta curta','Yes, I do. / No, she doesn\'t.','Yes, I do.')],
    quiz=[('What ___ you do?',['do','does','are'],0),('Where ___ she live?',['do','does','is'],1),('When ___ they study?',['do','does','are'],0),('Why ___ he run?',['do','does','is'],1),('How often ___ you cook?',['do','does','are'],0),('What ___ your father do?',['do','does','is'],1),('___ do you go to bed?',['What','When','Who'],1),('___ does she work?',['Where','What time','Both OK'],2)],
    fill=[('What ___ you eat for lunch?','do'),('Where ___ he work?','does'),('When ___ they arrive?','do'),('Why ___ she study English?','does'),('How often ___ you exercise?','do')],
    oral=['Entreviste o parceiro com 6 Wh- questions.','Responda com hábitos reais.'],
    twister='What does she do when the weather is wild?',
    culture='How often…? é clássico para falar de hábitos.',
    review=['What do you…?','Where does she…?','Yes, I do / No, he doesn\'t'],
    homework='Escreva 8 perguntas sobre a rotina de um amigo.')

add(10, file='licao-15-can-cant.html', id='licao-15-can-cant', level='A1', title="Can / Can't",
    lede='Habilidade e possibilidade com can', hero=H4,
    objs=[('💪','Habilidade','I can swim'),('🚫',"Can't",'I can\'t drive'),('❓','Perguntar','Can you…?')],
    warmup='O que você sabe fazer bem? E o que ainda não consegue?',
    dialogue_title='Talents', dialogue_sub='Anna e Tom falam de habilidades.',
    dialogue=[('tom','Tom','Can you play the guitar?'),('anna','Anna',"Yes, I can. But I can't sing very well."),('tom','Tom','I can cook. Can you cook too?'),('anna','Anna','A little!')],
    vocab=[('can','poder / saber','I can swim.'),("can't",'não poder','I can\'t drive.'),('play the guitar','tocar violão','She can play the guitar.'),('swim','nadar','Can you swim?'),('speak','falar','I can speak English.'),('well / a little','bem / um pouco','I can cook a little.')],
    grammar_title='Can / Cannot',
    grammar_blocks=[('Afirmativa','sujeito + can + verbo base','I can dance.'),('Negativa',"can + not → can't",'He can\'t drive.'),('Pergunta','Can + sujeito + verbo?','Can you help me?')],
    quiz=[('I ___ swim.',['can','cans','can to'],0),('She ___ drive.',["can't","doesn't can",'can not to'],0),('___ you speak English?',['Can','Do','Are'],0),('He can ___ the piano.',['play','plays','playing'],0),('They ___ come today.',["can't",'can nots','doesn\'t can'],0),('___ she cook?',['Can','Does','Is'],0),('We can ___ fast.',['run','runs','running'],0),('I ___ sing well.',["can't",'can\'t to','no can'],0)],
    fill=[('I ___ (saber) swim.','can'),("She ___ (não sabe) drive.","can't"),('___ you help me?','Can'),('He can ___ (tocar) the guitar.','play'),('They ___ speak French.','can')],
    oral=['Liste 5 coisas que você can e 3 can\'t.','Pergunte habilidades ao parceiro.'],
    twister='Can clean clam cream cans cling?',
    culture='Can não muda com he/she — nunca "cans".',
    review=['I can / She can','I can\'t','Can you…?'],
    homework='Tabela: 10 habilidades suas com can/can\'t.')

add(11, file='licao-14-there-is-there-are.html', id='licao-14-there-is-there-are', level='A1', title='There Is / There Are',
    lede='Existência de coisas no espaço', hero=H5,
    objs=[('1️⃣','There is','Singular'),('🔢','There are','Plural'),('❓','Perguntas','Is there…? Are there…?')],
    warmup='Olhe a sala: o que tem nela? There is… There are…',
    dialogue_title='In the Classroom', dialogue_sub='O que tem na sala de aula.',
    dialogue=[('anna','Anna','Is there a whiteboard?'),('tom','Tom','Yes, there is. And there are twenty chairs.'),('anna','Anna','Are there any computers?'),('tom','Tom','No, there aren\'t.')],
    vocab=[('there is','há (1)','There is a book.'),('there are','há (2+)','There are two pens.'),('is there…?','tem…?','Is there a bathroom?'),('any','algum/nenhum (pergunta/neg.)','Are there any apples?'),('some','alguns (afirm.)','There are some books.'),("there isn't",'não há','There isn\'t a lift.')],
    grammar_title='There is / There are',
    grammar_blocks=[('Singular','There is + substantivo singular','There is a cat.'),('Plural','There are + plural','There are three dogs.'),('Pergunta/Negativa','Is there…? / There isn\'t…','Are there any chairs?')],
    quiz=[('There ___ a book on the table.',['is','are','am'],0),('There ___ two windows.',['is','are','am'],1),('___ there a park near here?',['Is','Are','Do'],0),('There ___ any milk.',["isn't","aren't",'no is'],0),('___ there any students?',['Is','Are','Do'],1),('There are ___ apples.',['some','any','a'],0),('There ___ a big problem.',['is','are','have'],0),("There ___ three people.",['is','are','have'],1)],
    fill=[('There ___ a pen.','is'),('There ___ five chairs.','are'),('___ there a bathroom?','Is'),('There ___ any sugar.',"isn't"),('___ there any books?','Are')],
    oral=['Descreva a sala com there is/are.','Pergunte o que tem na mochila do parceiro.'],
    twister='Is there thin thread there through three thick trees?',
    culture='There is não é "lá está" — é "existe/há".',
    review=['There is + singular','There are + plural','Is there / Are there'],
    homework='Descreva seu quarto em 8 frases com there is/are.')

add(12, file='licao-6-here-there.html', id='licao-6-here-there', level='A1', title='Aqui e Ali: Localização',
    lede='here, there, this, that, these, those', hero=H1,
    objs=[('👆','Here / This','Perto de mim'),('👇','There / That','Longe'),('📦','These / Those','Plurais')],
    warmup='Aponte para algo perto e algo longe. This… That…',
    dialogue_title='In the Store', dialogue_sub='Comprando com this/that.',
    dialogue=[('anna','Anna','I like this shirt. It is soft.'),('tom','Tom','What about that one over there?'),('anna','Anna','Those are expensive. These are better.'),('tom','Tom','OK. Let\'s take these.')],
    vocab=[('here','aqui','Come here.'),('there','lá','Look there.'),('this','este (perto)','this book'),('that','aquele (longe)','that car'),('these','estes','these shoes'),('those','aqueles','those houses')],
    grammar_title='Here/There e Demonstrativos',
    grammar_blocks=[('here / there','here = perto; there = longe','I live here.'),('this / that','singular perto/longe','this phone / that phone'),('these / those','plurais perto/longe','these keys / those keys')],
    quiz=[('___ book is mine (perto).',['This','That','These'],0),('___ cars are fast (longe).',['This','Those','That'],1),('Come ___.',['here','there','this'],0),('Look over ___.',['here','there','these'],1),('___ are my friends (perto).',['This','These','That'],1),('___ is a big house (longe).',['This','That','These'],1),('I want ___ apples (perto).',['this','these','that'],1),('___ shoes are old (longe).',['That','Those','This'],1)],
    fill=[('___ pen is blue (perto).','This'),('___ house is big (longe).','That'),('Come ___.','here'),('___ are my keys (perto).','These'),('___ birds are loud (longe).','Those')],
    oral=['Aponte e nomeie 6 objetos com this/that/these/those.','Dê instruções: come here / go there.'],
    twister='These thin things thrill those thick thinkers.',
    culture='This is John (apresentar alguém perto) é muito natural.',
    review=['this/these = perto','that/those = longe','here / there'],
    homework='Tire 4 fotos e legende com this/that/these/those.')

add(13, file='licao-8-to-be-passado.html', id='licao-8-to-be-passado', level='A1', title='To Be no Passado (was/were)',
    lede='was e were — passado do to be', hero=H2,
    objs=[('⏪','Was','I/he/she/it was'),('⏪','Were','you/we/they were'),('❓','Perguntas','Were you…?')],
    warmup='Onde você estava ontem às 20h?',
    dialogue_title='Yesterday', dialogue_sub='O que fizeram ontem.',
    dialogue=[('tom','Tom','Were you at home yesterday?'),('anna','Anna','Yes, I was. I was tired.'),('tom','Tom','Was Paul at the party?'),('anna','Anna','No, he wasn\'t. We were only five people.')],
    vocab=[('was','era/estava (sing.)','I was happy.'),('were','era/estava (plur./you)','They were here.'),("wasn't",'não era','She wasn\'t ready.'),("weren't",'não eram','We weren\'t late.'),('yesterday','ontem','yesterday morning'),('last night','ontem à noite','last night')],
    grammar_title='Was / Were',
    grammar_blocks=[('Was','I, he, she, it + was','She was at school.'),('Were','you, we, they + were','You were great.'),('Pergunta','Was/Were + sujeito?','Were you OK?')],
    quiz=[('I ___ tired yesterday.',['was','were','am'],0),('They ___ at the park.',['was','were','are'],1),('___ you at home?',['Was','Were','Are'],1),('She ___ not hungry.',['was','were','is'],0),('We ___ friends in 2010.',['was','were','are'],1),('___ he late?',['Was','Were','Did'],0),('The movie ___ good.',['was','were','are'],0),('You ___ not there.',['was','were','are'],1)],
    fill=[('I ___ at school yesterday.','was'),('They ___ happy.','were'),('___ you tired?','Were'),('She ___ not home.',"wasn't"),('We ___ late.','were')],
    oral=['Conte onde você was ontem.','Pergunte ao parceiro sobre o fim de semana passado.'],
    twister='Was Will willing while we were waiting?',
    culture='Was/were cobrem ser e estar no passado — o resto dos verbos usa Simple Past.',
    review=['I was / You were','wasn\'t / weren\'t','Were you…?'],
    homework='8 frases sobre ontem com was/were.')

add(14, file='licao-21-simple-past-regular.html', id='licao-21-simple-past-regular', level='A2', title='Simple Past: Verbos Regulares',
    lede='Passado com verbos regulares (-ed)', hero=H3,
    objs=[('📅','-ed','worked, played, studied'),('🚫','Negativa','did not + base'),('❓','Pergunta','Did you…?')],
    warmup='O que você fez ontem? Use um verbo em português e pense no inglês.',
    dialogue_title='Last Weekend', dialogue_sub='O fim de semana passado.',
    dialogue=[('anna','Anna','Did you watch the game?'),('tom','Tom','Yes, I watched it at home. I cooked pizza too.'),('anna','Anna','Nice! I visited my grandma and cleaned my room.'),('tom','Tom','We stayed busy!')],
    vocab=[('worked','trabalhou','I worked late.'),('played','jogou/tocou','She played tennis.'),('studied','estudou','We studied English.'),('watched','assistiu','They watched a film.'),('cleaned','limpou','He cleaned the kitchen.'),('did','auxiliar passado','Did you call?')],
    grammar_title='Simple Past Regular',
    grammar_blocks=[('Afirmativa','verbo + ed (study → studied)','I played soccer.'),('Negativa','did not (didn\'t) + verbo base','I didn\'t work.'),('Pergunta','Did + sujeito + verbo base?','Did you study?')],
    quiz=[('She ___ TV yesterday.',['watched','watch','watches'],0),('I ___ not cook.',['did','do','does'],0),('___ you play?',['Did','Do','Does'],0),('They ___ the house.',['cleaned','clean','cleans'],0),('He ___ English.',['studied','study','studys'],0),('We ___ to the park. (walk)',['walked','walk','walks'],0),('She didn\'t ___.',['call','called','calls'],0),('___ he work last week?',['Did','Does','Was'],0)],
    fill=[('I ___ (play) soccer.','played'),('She ___ (watch) a movie.','watched'),('___ you study?','Did'),('They didn\'t ___ (call).','call'),('He ___ (work) yesterday.','worked')],
    oral=['Conte 5 coisas que você fez no último fim de semana.','Use Did you…? com o parceiro.'],
    twister='Ted edited ten tested texts yesterday.',
    culture='A pronúncia do -ed muda: /t/, /d/ ou /ɪd/.',
    review=['verb + ed','didn\'t + base','Did you…?'],
    homework='Diário de ontem: 10 verbos regulares no passado.')

add(15, file='licao-22-simple-past-irregular.html', id='licao-22-simple-past-irregular', level='A2', title='Simple Past: Verbos Irregulares',
    lede='went, had, saw, ate…', hero=H4,
    objs=[('🔀','Irregulares','went, saw, had…'),('🧠','Memória','Formas mais comuns'),('🗣️','Narrar','Contar o passado')],
    warmup='Como se diz "eu fui" e "eu vi" em inglês?',
    dialogue_title='A Trip', dialogue_sub='Tom conta uma viagem.',
    dialogue=[('tom','Tom','I went to the beach last month.'),('anna','Anna','Nice! Did you swim?'),('tom','Tom','Yes. I ate fresh fish and saw dolphins.'),('anna','Anna','I had a quiet weekend. I read a book.')],
    vocab=[('went','foi (go)','I went home.'),('saw','viu (see)','She saw a movie.'),('had','teve (have)','We had lunch.'),('ate','comeu (eat)','He ate pizza.'),('did','fez (do)','I did my homework.'),('bought','comprou (buy)','They bought a car.')],
    grammar_title='Irregulares no Passado',
    grammar_blocks=[('Forma própria','Não leva -ed: go→went, see→saw','I went to school.'),('Negativa/Pergunta','Igual aos regulares: didn\'t / Did…?','Did you go? I didn\'t see it.'),('Lista mínima','go, have, see, eat, do, buy, come, make','I had coffee.')],
    quiz=[('I ___ to the mall.',['went','goed','go'],0),('She ___ a bird.',['saw','seed','see'],0),('We ___ pizza.',['ate','eated','eat'],0),('He ___ a new phone.',['bought','buyed','buy'],0),('___ you go?',['Did','Do','Was'],0),('They didn\'t ___ the movie.',['see','saw','seen'],0),('I ___ my homework.',['did','doed','done'],0),('She ___ a cake.',['made','maked','make'],0)],
    fill=[('I ___ (go) home.','went'),('She ___ (see) him.','saw'),('We ___ (have) lunch.','had'),('___ you eat?','Did'),('They didn\'t ___ (buy) it.','buy')],
    oral=['Conte um passeio usando 5 irregulares.','Pergunte o que o parceiro did last week.'],
    twister='Betty bought a bit of better butter.',
    culture='Os irregulares mais comuns cobrem grande parte do dia a dia — vale memorizar cedo.',
    review=['went/saw/had/ate','didn\'t + base','Did you go?'],
    homework='Lista de 15 irregulares com uma frase cada.')

add(16, file='licao-24-future-going-to.html', id='licao-24-future-going-to', level='A2', title='Futuro com Going To',
    lede='Planos e intenções com be going to', hero=H5,
    objs=[('📌','Planos','I am going to travel'),('🔮','Evidência','Look! It\'s going to rain'),('❓','Perguntar','Are you going to…?')],
    warmup='O que você vai fazer no próximo fim de semana?',
    dialogue_title='Next Week', dialogue_sub='Planos da semana.',
    dialogue=[('anna','Anna','What are you going to do on Friday?'),('tom','Tom','I\'m going to visit my parents. Are you going to study?'),('anna','Anna','Yes. I\'m going to finish my project.'),('tom','Tom','It\'s going to be a busy week!')],
    vocab=[('going to','vai / pretendo','I\'m going to cook.'),('tomorrow','amanhã','tomorrow morning'),('next week','semana que vem','next week'),('plan','plano','I have a plan.'),('intend','pretender','I intend to go.'),('busy','ocupado','a busy day')],
    grammar_title='Be Going To',
    grammar_blocks=[('Forma','am/is/are + going to + verbo','She is going to call.'),('Uso','Planos decididos / previsão com evidência','I\'m going to move. It\'s going to rain.'),('Pergunta','Are you going to…?','Are you going to come?')],
    quiz=[("I ___ going to travel.",['am','is','are'],0),('She is going ___ study.',['to','for','at'],0),('___ you going to come?',['Are','Is','Do'],0),('They ___ going to cook.',['am','is','are'],2),('He ___ going to work tomorrow.',['is','are','am'],0),("We aren't ___ to stay.",['going','go','goes'],0),('Look at those clouds! It ___ rain.',["is going to","goes to","will to"],0),('What ___ she going to do?',['is','are','does'],0)],
    fill=[("I ___ going to rest.",'am'),('She is going ___ travel.','to'),('___ you going to study?','Are'),('They ___ going to move.','are'),('He isn\'t going to ___.','come')],
    oral=['Conte 5 planos com going to.','Pergunte os planos do parceiro.'],
    twister='We are going to grow green grapes in the garden.',
    culture='Going to é o futuro mais natural para planos pessoais no dia a dia.',
    review=['am/is/are going to + verb','planos e previsões','Are you going to…?'],
    homework='Agenda da semana em 8 frases com going to.')

add(17, file='licao-25-future-will.html', id='licao-25-future-will', level='A2', title='Futuro com Will',
    lede='Decisões na hora, promessas e previsões', hero=H1,
    objs=[('⚡','Will','I will help'),('🤝','Promessas','I will call you'),('🔮','Previsões','It will be sunny')],
    warmup='Alguém pede ajuda. Como você oferece em inglês?',
    dialogue_title='I will help', dialogue_sub='Decisões espontâneas.',
    dialogue=[('tom','Tom','The phone is ringing.'),('anna','Anna','I will answer it!'),('tom','Tom','Thanks. I will make coffee.'),('anna','Anna','Great. We will finish this soon.')],
    vocab=[('will','vai / irei','I will go.'),("won't",'não vai','I won\'t be late.'),('promise','promessa','I promise.'),('probably','provavelmente','It will probably rain.'),('I think','eu acho','I think it will be fine.'),('right now','agora','I will do it right now.')],
    grammar_title='Will',
    grammar_blocks=[('Forma','will + verbo base (igual para todos)','She will come.'),('Uso','decisão na hora, promessa, previsão','I will help you.'),('Negativa/Pergunta',"won't / Will you…?",'Will you marry me?')],
    quiz=[('I ___ help you.',['will','going','am'],0),('She ___ be late.',["won't","willn't",'doesn\'t will'],0),('___ you open the door?',['Will','Do','Are'],0),('They will ___ tomorrow.',['arrive','arrives','arriving'],0),('I think it ___ rain.',['will','goes','is'],0),('We ___ call you.',['will','wills','are will'],0),('He ___ not come.',['will','do','is'],0),('___ they win?',['Will','Do','Are'],0)],
    fill=[('I ___ help you.','will'),("She ___ be late.","won't"),('___ you come?','Will'),('They will ___ (stay).','stay'),('It will ___ (be) fine.','be')],
    oral=['Ofereça ajuda com I will… em 4 situações.','Faça 3 previsões sobre o tempo/ano.'],
    twister='Will Wendy willfully whistle while we wait?',
    culture='Will é comum em ofertas e promessas; going to em planos já decididos.',
    review=['will + base','won\'t','Will you…?'],
    homework='5 promessas e 5 previsões com will.')

add(18, file='licao-9-revisao-completa.html', id='licao-9-revisao-completa', level='A1', title='Revisão A1: Conversação Básica',
    lede='Integração de to be, Wh-, can, present e preposições', hero=H2,
    objs=[('🎓','Integrar','Tudo do A1 básico'),('💬','Conversar','Diálogo fluido'),('✅','Checar','Pontos fracos')],
    warmup='Em 30 segundos, apresente-se e fale um hábito seu.',
    dialogue_title='Full Chat', dialogue_sub='Uma conversa completa de nível A1.',
    dialogue=[('anna','Anna','Hi! My name is Anna. Are you new here?'),('tom','Tom','Yes. I am Tom. I live near the park.'),('anna','Anna','Nice! What do you do?'),('tom','Tom','I study English. I can speak a little. And you?'),('anna','Anna','I work in a café. There is a great one on this street!')],
    vocab=[('live','morar','I live here.'),('study','estudar','I study English.'),('work','trabalhar','She works a lot.'),('near','perto','near the park'),('a little','um pouco','a little English'),('on this street','nesta rua','on this street')],
    grammar_title='Pacote A1',
    grammar_blocks=[('Identidade','to be + nome/origem/profissão','I am Ana. I am from Brazil.'),('Hábitos e habilidade','Simple Present + can','I work. I can cook.'),('Espaço','there is + preposições','There is a café on the corner.')],
    quiz=[('I ___ from Brazil.',['am','is','are'],0),('What ___ you do?',['do','does','are'],0),('She ___ swim.',['can','cans','can to'],0),('There ___ a book here.',['is','are','have'],0),('The keys are ___ the table.',['on','in','at'],0),('___ you like coffee?',['Do','Does','Are'],0),('He ___ a teacher.',['is','are','am'],0),('I ___ going to study tonight.',['am','is','are'],0)],
    fill=[('I ___ Ana.','am'),('What ___ you do?','do'),('I ___ swim.','can'),('There ___ two chairs.','are'),('The bag is ___ the chair.','under')],
    oral=['Simule um primeiro encontro de 1 minuto.','Troque de papel.'],
    twister='Can Anna ask what Tom does at that café?',
    culture='Fluência A1 = frases curtas corretas e confiança para perguntar de novo.',
    review=['to be','do/does + can','there is + preposições'],
    homework='Texto de 12 linhas sobre você integrando a lição.')

add(19, file='licao-11-object-possessive-pronouns.html', id='licao-11-object-possessive-pronouns', level='A2', title='Pronomes Objeto e Possessivos',
    lede='me, him, her, us… e mine, yours…', hero=H3,
    objs=[('👤','Objeto','me, him, her, us, them'),('📦','Possessivos','mine, yours, his, hers'),('🔄','Trocar','Suj. → obj. → poss.')],
    warmup='Complete: "Give ___ the book. It is ___."',
    dialogue_title='Give it to me', dialogue_sub='Pronomes no diálogo.',
    dialogue=[('tom','Tom','Can you help me?'),('anna','Anna','Sure. Give me the keys. Are they yours?'),('tom','Tom','No, they are hers. Please call her.'),('anna','Anna','OK. I will call her now.')],
    vocab=[('me / you','me / te','Help me.'),('him / her','o / a','Call him.'),('us / them','nos / os','Tell us.'),('mine / yours','meu / seu','It\'s mine.'),('his / hers','dele / dela','It\'s hers.'),('ours / theirs','nosso / deles','It\'s ours.')],
    grammar_title='Objeto e Possessivo',
    grammar_blocks=[('Objeto','após verbo/preposição: me, him, her, us, them','She likes him.'),('Possessivo','substitui substantivo: mine, yours, his…','This bag is mine.'),('Cuidado',"it's = it is; its = posse de it",'The dog wagged its tail.')],
    quiz=[('Give ___ the book.',['me','I','my'],0),('This pen is ___.',['mine','my','me'],0),('I saw ___.',['her','she','hers'],0),('The house is ___.',['theirs','their','them'],0),('Come with ___.',['us','we','our'],0),('Is this ___?',['yours','your','you'],0),('Tell ___ the truth.',['them','they','their'],0),('That car is ___.',['his','him','he'],0)],
    fill=[('Help ___. (eu)','me'),('This is ___. (meu)','mine'),('I called ___. (ela)','her'),('The books are ___. (deles)','theirs'),('Sit with ___. (nós)','us')],
    oral=['Troque objetos e diga: It\'s mine/yours.','Peça coisas com Give me…'],
    twister='Give him his hats and give her hers.',
    culture='Mine/yours evitam repetir o substantivo — soam naturais e fluidos.',
    review=['me/him/her/us/them','mine/yours/his/hers','Give me…'],
    homework='10 frases misturando objeto e possessivo.')

add(20, file='licao-16-present-continuous.html', id='licao-16-present-continuous', level='A2', title='Present Continuous',
    lede='Ações em andamento agora', hero=H4,
    objs=[('🏃','Agora','I am working'),('📸','Descrever','O que está acontecendo'),('🔄','vs Present','Hábito ≠ agora')],
    warmup='O que você está fazendo neste exato momento?',
    dialogue_title='Right Now', dialogue_sub='O que cada um está fazendo.',
    dialogue=[('tom','Tom','What are you doing?'),('anna','Anna','I\'m studying English. And you?'),('tom','Tom','I\'m cooking dinner. My brother is watching TV.'),('anna','Anna','Nice. We are all busy!')],
    vocab=[('am/is/are + -ing','estar + gerúndio','I am reading.'),('right now','agora','right now'),('at the moment','no momento','at the moment'),('looking for','procurando','I\'m looking for my keys.'),('working','trabalhando','She is working.'),('sleeping','dormindo','He is sleeping.')],
    grammar_title='Present Continuous',
    grammar_blocks=[('Forma','am/is/are + verbo-ing','She is running.'),('Uso','ação no momento / temporária','I am living here this month.'),('vs Simple Present','hábito = present; agora = continuous','I work / I am working now.')],
    quiz=[('I ___ working now.',['am','is','are'],0),('She is ___ TV.',['watching','watch','watches'],0),('___ you studying?',['Are','Is','Do'],0),('They ___ playing.',['are','is','am'],0),('He ___ not sleeping.',['is','are','am'],0),('What ___ she doing?',['is','are','does'],0),('We are ___ dinner.',['having','have','has'],0),('Look! It ___.',['is raining','rains','rain'],0)],
    fill=[('I ___ studying.','am'),('She is ___ (read).','reading'),('___ you working?','Are'),('They ___ playing.','are'),('He isn\'t ___.','sleeping')],
    oral=['Descreva 5 ações acontecendo agora.','Mímica: o parceiro adivinha com continuous.'],
    twister='She is sitting and stitching six shirts.',
    culture='Em legendas e lives, continuous é o tempo rei do "ao vivo".',
    review=['am/is/are + -ing','agora / temporário','Are you…-ing?'],
    homework='5 fotos: legenda em Present Continuous.')

add(21, file='licao-17-countable-uncountable.html', id='licao-17-countable-uncountable', level='A2', title='Contáveis e Incontáveis',
    lede='some, any, much, many, a/an', hero=H5,
    objs=[('🍎','Countable','apples, books'),('💧','Uncountable','water, rice'),('🛒','Quantificar','some/any/much/many')],
    warmup='Dá para contar "água"? E "garrafas de água"?',
    dialogue_title='At the Market', dialogue_sub='Compras com quantidades.',
    dialogue=[('anna','Anna','We need some rice and some apples.'),('tom','Tom','Are there any eggs?'),('anna','Anna','No, there aren\'t. How much milk do we have?'),('tom','Tom','Not much. Let\'s buy some.')],
    vocab=[('some','algum(ns)','some bread'),('any','algum (perg/neg)','any sugar?'),('much','muito (incont.)','much water'),('many','muitos (cont.)','many books'),('a lot of','muito(s)','a lot of time'),('rice / water','arroz / água','uncountable')],
    grammar_title='Countable vs Uncountable',
    grammar_blocks=[('Countable','têm plural + a/an + many','an apple / many apples'),('Uncountable','sem plural; much / some','water, rice, money'),('some / any','some em +; any em ? e −','I have some tea. Do you have any?')],
    quiz=[('There are ___ apples.',['many','much','a'],0),('How ___ water?',['much','many','a'],0),('I need ___ sugar.',['some','an','many'],0),('Is there ___ milk?',['any','many','a'],0),('She has ___ money.',['much','many','a'],0),('I bought ___ orange.',['an','a','some'],0),('How ___ books?',['many','much','any'],0),('There isn\'t ___ rice.',['much','many','a'],0)],
    fill=[('How ___ milk?','much'),('How ___ apples?','many'),('I need ___ bread.','some'),('Is there ___ sugar?','any'),('There are ___ chairs.','many')],
    oral=['Monte uma lista de compras com contáveis e incontáveis.','Pergunte quantidades ao parceiro.'],
    twister='How much fresh fish can a fish chef catch?',
    culture='Information, advice, furniture são incontáveis em inglês — surpresa comum.',
    review=['many + contável','much + incontável','some / any'],
    homework='Classifique 20 palavras da cozinha em contável/incontável.')

add(22, file='licao-18-quantities-choices.html', id='licao-18-quantities-choices', level='A2', title='Quantidades e Escolhas',
    lede='a few, a little, too much, enough…', hero=H1,
    objs=[('🔢','Quantidades','a few / a little'),('⚖️','Excesso','too much / too many'),('✅','Suficiente','enough')],
    warmup='Você tem tempo suficiente hoje? Enough time?',
    dialogue_title='Ordering Food', dialogue_sub='Pedindo no restaurante.',
    dialogue=[('tom','Tom','I would like a little soup and a few crackers.'),('anna','Anna','This coffee has too much sugar!'),('tom','Tom','Do we have enough money?'),('anna','Anna','Yes. Let\'s order.')],
    vocab=[('a few','alguns (cont.)','a few friends'),('a little','um pouco (incont.)','a little milk'),('too much','demais (incont.)','too much noise'),('too many','demais (cont.)','too many people'),('enough','suficiente','enough time'),('would like','gostaria','I would like tea.')],
    grammar_title='Quantificadores',
    grammar_blocks=[('a few / a little','few = contável; little = incontável','a few eggs / a little oil'),('too much / too many','excesso','too much salt / too many cars'),('enough','após adj. ou antes de substantivo','big enough / enough food')],
    quiz=[('I have ___ friends here.',['a few','a little','much'],0),('Add ___ salt.',['a little','a few','many'],0),('There are ___ cars.',['too many','too much','a little'],0),('We don\'t have ___ time.',['enough','too','few'],0),('There is ___ noise.',['too much','too many','a few'],0),('I would ___ some tea.',['like','likes','liking'],0),('Only ___ people came.',['a few','a little','much'],0),('Is it big ___?',['enough','too','much'],0)],
    fill=[('a ___ apples','few'),('a ___ water','little'),('too ___ sugar','much'),('too ___ chairs','many'),('enough ___ (tempo)','time')],
    oral=['Peça comida usando a little / a few.','Reclame com too much/many de forma educada.'],
    twister='A few free fruit flies flew from the fruit.',
    culture='Would like é mais educado que want em pedidos.',
    review=['a few / a little','too much / too many','enough'],
    homework='6 pedidos educados em um café imaginário.')

add(23, file='licao-19-quantities-distance-time.html', id='licao-19-quantities-distance-time', level='A2', title='Quantidade, Distância e Tempo',
    lede='How much / many / long / far', hero=H2,
    objs=[('⏱️','How long','Quanto tempo'),('📏','How far','Que distância'),('💰','How much','Quanto custa')],
    warmup='Quanto tempo você leva até o trabalho/escola?',
    dialogue_title='Getting There', dialogue_sub='Perguntas práticas de viagem.',
    dialogue=[('anna','Anna','How far is the station?'),('tom','Tom','It\'s about two kilometers. How long does it take?'),('anna','Anna','Ten minutes by bus. How much is the ticket?'),('tom','Tom','About three dollars.')],
    vocab=[('How far','que distância','How far is it?'),('How long','quanto tempo','How long does it take?'),('How much','quanto (preço/incont.)','How much is it?'),('How many','quantos','How many stops?'),('take','levar (tempo)','It takes 10 minutes.'),('about','cerca de','about 2 km')],
    grammar_title='Perguntas de Medida',
    grammar_blocks=[('How far','distância','How far is your house?'),('How long','duração','How long is the movie?'),('How much / many','preço e quantidade','How much is this? How many seats?')],
    quiz=[('___ far is the beach?',['How','What','When'],0),('How ___ does it take?',['long','far','much'],0),('How ___ is the ticket?',['much','many','long'],0),('How ___ people?',['many','much','far'],0),('It ___ 20 minutes.',['takes','takes to','is take'],0),('How ___ is the river?',['long','far','many'],0),('___ much water do you drink?',['How','What','When'],0),('How far ___ it?',['is','does','do'],0)],
    fill=[('How ___ is the museum?','far'),('How ___ does it take?','long'),('How ___ is this shirt?','much'),('How ___ students are there?','many'),('It ___ 15 minutes.','takes')],
    oral=['Pergunte distância, tempo e preço para 3 lugares.','Responda com about…'],
    twister='How long will the long long log last?',
    culture='How long does it take to get to…? é chunk essencial de viagem.',
    review=['How far / How long','How much / How many','It takes…'],
    homework='Pesquise 3 lugares e anote far/long/much.')

add(24, file='licao-20-survival-english.html', id='licao-20-survival-english', level='A2', title='Survival English',
    lede='Frases para se virar em situações reais', hero=H3,
    objs=[('✈️','Viagem','airport, hotel'),('🍽️','Restaurante','pedir e pagar'),('🆘','Ajuda','I need help')],
    warmup='Você se perdeu na rua. O que diria em inglês?',
    dialogue_title='At the Hotel', dialogue_sub='Check-in e pedidos simples.',
    dialogue=[('anna','Anna','I have a reservation under Anna Silva.'),('tom','Tom','(Receptionist) Sure. Can I see your passport?'),('anna','Anna','Here you are. Is breakfast included?'),('tom','Tom','Yes. The Wi-Fi password is on the desk.')],
    vocab=[('reservation','reserva','I have a reservation.'),('passport','passaporte','my passport'),('included','incluso','breakfast included'),('How do I get to…?','Como chego a…?','How do I get to the museum?'),('I need help','preciso de ajuda','I need help.'),('Here you are','aqui está','Here you are.')],
    grammar_title='Frases de Sobrevivência',
    grammar_blocks=[('Pedidos educados','Could you…? / I would like…','Could you help me?'),('Localização','How do I get to…? / Where is…?','Where is the bathroom?'),('Problemas','I need… / I lost my…','I lost my bag.')],
    quiz=[('I have a ___.',['reservation','reserve','reserving'],0),('___ do I get to the station?',['How','What','Where'],0),('I would ___ some water.',['like','likes','liking'],0),('___ you help me?',['Could','Are','Have'],0),('Breakfast is ___.',['included','include','including'],0),('I ___ my passport.',['lost','lose','losed'],0),('Where ___ the bathroom?',['is','are','does'],0),('Here you ___.',['are','is','go'],0)],
    fill=[('I have a ___.','reservation'),('How do I ___ to the mall?','get'),('I would ___ a coffee.','like'),('Could you ___ me?','help'),('Where ___ the exit?','is')],
    oral=['Simule check-in no hotel.','Peça direções para 2 lugares.'],
    twister='She sells tickets to tourists at the station.',
    culture='Could you…? soa mais educado que Can you…? com estranhos.',
    review=['Could you…?','How do I get to…?','I would like…'],
    homework='Roteiro de viagem com 10 frases survival.')

add(25, file='licao-23-talking-about-the-past.html', id='licao-23-talking-about-the-past', level='A2', title='Falando Sobre o Passado',
    lede='Consolidar passado: perguntas, negativas e tempo', hero=H4,
    objs=[('🕰️','Passado','was/were + past'),('❓','Perguntar','Did you…? When…?'),('🧵','Narrar','Contar histórias curtas')],
    warmup='Resuma ontem em 3 frases em inglês.',
    dialogue_title='What happened?', dialogue_sub='Recontando o dia.',
    dialogue=[('tom','Tom','What did you do last night?'),('anna','Anna','I stayed home and watched a series. What about you?'),('tom','Tom','I met some friends. We talked for hours.'),('anna','Anna','That sounds fun. Were you tired after that?'),('tom','Tom','A little, but it was great.')],
    vocab=[('last night','ontem à noite','last night'),('ago','atrás','two days ago'),('met','encontrou (meet)','I met her.'),('stayed','ficou','I stayed home.'),('for hours','por horas','for hours'),('What did you do?','O que você fez?','What did you do?')],
    grammar_title='Narrar o Passado',
    grammar_blocks=[('Mistura natural','was/were + past simple','I was tired. I went home.'),('Perguntas','Did + base / Wh- + did','When did you arrive?'),('Marcadores','yesterday, last week, ago','three years ago')],
    quiz=[('What ___ you do?',['did','do','does'],0),('I ___ home.',['stayed','stay','stays'],0),('She ___ her friends.',['met','meet','meets'],0),('___ you tired?',['Were','Was','Did'],0),('We talked ___ hours.',['for','since','during'],0),('He ___ not come.',['did','does','was'],0),('When ___ they leave?',['did','do','were'],0),('I saw him two days ___.',['ago','before','last'],0)],
    fill=[('What ___ you do yesterday?','did'),('I ___ (stay) home.','stayed'),('___ you happy?','Were'),('She ___ (meet) him.','met'),('It happened 3 days ___.','ago')],
    oral=['Conte o último fim de semana em 8 frases.','O parceiro faz 4 perguntas no passado.'],
    twister='Did David decide to dig deeper during dusk?',
    culture='Histórias reais curtas são o melhor treino de passado.',
    review=['Did you…?','yesterday / ago','was + past verbs'],
    homework='História de 10 linhas sobre um dia marcante.')

add(26, file='licao-26-comparatives-superlatives.html', id='licao-26-comparatives-superlatives', level='A2', title='Comparativos e Superlativos',
    lede='bigger, more interesting, the best…', hero=H5,
    objs=[('⚖️','Comparativo','bigger than'),('🏆','Superlativo','the biggest'),('📏','Igualdade','as… as')],
    warmup='Compare dois celulares ou dois filmes que você gosta.',
    dialogue_title='Which is better?', dialogue_sub='Comparando opções.',
    dialogue=[('anna','Anna','This café is quieter than that one.'),('tom','Tom','Yes, but that one is cheaper. It has the best coffee.'),('anna','Anna','Really? I think this cake is as good as theirs.'),('tom','Tom','Maybe. The staff here is the friendliest.')],
    vocab=[('bigger than','maior que','bigger than mine'),('more interesting','mais interessante','more interesting'),('the best','o melhor','the best day'),('the most','o mais','the most popular'),('as… as','tão… quanto','as tall as'),('than','do que','older than me')],
    grammar_title='Comparar em Inglês',
    grammar_blocks=[('Curto','adj + er + than','smaller than'),('Longo','more + adj + than','more expensive than'),('Superlativo','the + est / the most','the tallest / the most famous')],
    quiz=[('She is ___ than me.',['taller','more tall','tallest'],0),('This is ___ interesting.',['more','most','er'],0),('He is the ___ student.',['best','better','good'],0),('It is as big ___ yours.',['as','than','to'],0),('Cars are ___ than bikes.',['faster','more fast','fastest'],0),('This is the ___ city.',['most beautiful','more beautiful','beautifuler'],0),('I am older ___ him.',['than','as','that'],0),('Today is the ___ day.',['hottest','hotter','most hot'],0)],
    fill=[('bigger ___ me','than'),('more ___ (caro)','expensive'),('the ___ (melhor)','best'),('as fast ___ you','as'),('the most ___ (interessante)','interesting')],
    oral=['Compare 3 filmes.','Descreva a pessoa mais engraçada que você conhece.'],
    twister='Which witch wishes which wicked wish?',
    culture='Good → better → best e bad → worse → worst são irregulares essenciais.',
    review=['-er than / more… than','the -est / the most','as… as'],
    homework='Compare sua cidade com outra em 8 frases.')

add(27, file='licao-28-modal-verbs.html', id='licao-28-modal-verbs', level='A2', title='Verbos Modais (introdução)',
    lede='could, must, should, may…', hero=H1,
    objs=[('🔑','Modais','must, should, could'),('💡','Conselho','You should…'),('⚠️','Obrigação','You must…')],
    warmup='Que conselho você daria a alguém com sono na aula?',
    dialogue_title='Advice', dialogue_sub='Conselhos e regras.',
    dialogue=[('tom','Tom','I feel sick.'),('anna','Anna','You should see a doctor. You mustn\'t ignore it.'),('tom','Tom','Could you come with me?'),('anna','Anna','Of course. You may wait here first.')],
    vocab=[('should','deveria','You should rest.'),('must','deve (obrigação)','You must stop.'),("mustn't",'não deve','You mustn\'t smoke.'),('could','poderia','Could you help?'),('may','pode (permissão)','You may enter.'),('advice','conselho','some advice')],
    grammar_title='Modais Básicos',
    grammar_blocks=[('should','conselho','You should sleep more.'),('must / mustn\'t','obrigação / proibição','You must wear a seatbelt.'),('could / may','pedido educado / permissão','Could you open the window?')],
    quiz=[('You ___ see a doctor.',['should','should to','must to'],0),('You ___ smoke here.',["mustn't","must not to","don't must"],0),('___ you help me?',['Could','Should','Must'],0),('You ___ wear a helmet.',['must','must to','should to'],0),('You ___ enter.',['may','may to','can to'],0),('He should ___ harder.',['study','studies','studying'],0),('___ I use your phone?',['May','Must','Should'],0),('You mustn\'t ___ late.',['be','are','is'],0)],
    fill=[('You ___ rest.','should'),("You ___ smoke.","mustn't"),('___ you open the door?','Could'),('You ___ wear a seatbelt.','must'),('You ___ sit here.','may')],
    oral=['Dê 5 conselhos com should.','Liste 4 regras com must/mustn\'t.'],
    twister='Should Sheila sell seashells or should she not?',
    culture='Must é forte (regra); should é conselho — não são sinônimos.',
    review=['should = conselho','must / mustn\'t','Could you…?'],
    homework='Cartaz de regras da casa com modais.')

add(28, file='licao-29-phrasal-verbs.html', id='licao-29-phrasal-verbs', level='A2', title='Phrasal Verbs Essenciais',
    lede='get up, look for, turn on, give up…', hero=H2,
    objs=[('🧩','Partículas','up, on, off, for'),('🗣️','Dia a dia','Os 12 essenciais'),('🔁','Praticar','Em contexto')],
    warmup='Como se diz "acordar" e "procurar" em inglês informal?',
    dialogue_title='Busy Morning', dialogue_sub='Phrasals na rotina.',
    dialogue=[('anna','Anna','I got up late and looked for my keys.'),('tom','Tom','Did you turn off the lights?'),('anna','Anna','Yes. Don\'t give up — we will find them.'),('tom','Tom','Here! Pick them up.')],
    vocab=[('get up','acordar/levantar','I get up at 6.'),('look for','procurar','look for keys'),('turn on/off','ligar/desligar','turn on the TV'),('give up','desistir','Don\'t give up.'),('pick up','pegar / buscar','pick up the phone'),('find out','descobrir','find out the truth')],
    grammar_title='Phrasal Verbs',
    grammar_blocks=[('Verbo + partícula','sentido novo: look + for = procurar','She looks for jobs.'),('Separáveis','objeto no meio às vezes: turn off the light / turn the light off','Turn it off.'),('Aprender em chunks','memorize a frase inteira','I get up early.')],
    quiz=[('I ___ up at 7.',['get','got','getting'],0),('She is looking ___ her bag.',['for','to','at'],0),('Please turn ___ the TV.',['on','in','for'],0),("Don't give ___.",['up','on','off'],0),('___ the phone up.',['Pick','Take','Get'],0),('I need to find ___ the time.',['out','up','on'],0),('He turned ___ the lights.',['off','of','out'],0),('We ___ up late.',['got','getted','gotten'],0)],
    fill=[('I ___ up early.','get'),('look ___ the keys','for'),('turn ___ the lamp','on'),("don't give ___",'up'),('pick ___ the book','up')],
    oral=['Descreva sua manhã com 5 phrasals.','Mímica de phrasals para o parceiro adivinhar.'],
    twister='Pick up the pepper, put up the paper, turn up later.',
    culture='Phrasals são o inglês real de filmes e conversas — impossível fugir deles.',
    review=['get up / look for','turn on/off','give up / pick up'],
    homework='Diário com 12 phrasals diferentes.')

add(29, file='licao-30-revisao-semestre-2.html', id='licao-30-revisao-semestre-2', level='A2', title='Revisão Geral do Semestre 2',
    lede='Passado, futuro, quantidades, modais e phrasals', hero=H3,
    objs=[('🎓','Revisar','Blocos do semestre'),('🔗','Integrar','Textos e diálogos'),('✅','Consolidar','Antes de avançar')],
    warmup='Liste 5 tópicos que você estudou neste semestre.',
    dialogue_title='Semester Chat', dialogue_sub='Usando de tudo um pouco.',
    dialogue=[('tom','Tom','What did you do last week?'),('anna','Anna','I studied a lot. I\'m going to take a test tomorrow.'),('tom','Tom','You should rest a little. Don\'t give up!'),('anna','Anna','Thanks. There are many phrasal verbs, but I can do it.')],
    vocab=[('take a test','fazer uma prova','take a test'),('rest','descansar','You should rest.'),('semester','semestre','this semester'),('a lot','muito','studied a lot'),('tomorrow','amanhã','tomorrow'),("don't give up",'não desista','Don\'t give up!')],
    grammar_title='Revisão Integrada A2',
    grammar_blocks=[('Passado e futuro','did / was + going to / will','I went. I\'m going to study. I will try.'),('Quantidade e espaço','there is, much/many, preposições','There are many books on the desk.'),('Modais e phrasals','should, must, get up, look for','You should get up earlier.')],
    quiz=[('I ___ to the cinema yesterday.',['went','go','goes'],0),("I'm ___ to travel.",['going','go','went'],0),('You ___ sleep more.',['should','must to','can to'],0),('How ___ water?',['much','many','long'],0),('There ___ many people.',['are','is','have'],0),('Please look ___ your keys.',['for','to','on'],0),('She can ___ English.',['speak','speaks','speaking'],0),('___ you finish the test?',['Did','Do','Are'],0)],
    fill=[('I ___ (go) home yesterday.','went'),("I am ___ to study.",'going'),('You ___ rest.','should'),('How ___ milk?','much'),('look ___ the answer','for')],
    oral=['Resuma o semestre em 1 minuto.','Faça 6 perguntas misturando os tempos.'],
    twister='She should study six short simple past stories.',
    culture='Revisão ativa (falar e escrever) grava mais que só reler.',
    review=['past + future','much/many + there is','should + phrasals'],
    homework='Texto de 15 linhas usando pelo menos 8 estruturas do semestre.')

add(30, file='licao-31-past-continuous.html', id='licao-31-past-continuous', level='A2', title='Past Continuous',
    lede='was/were + -ing — ações em progresso no passado', hero=H4,
    objs=[('🎬','Em progresso','I was reading'),('⚡','Interrupção','when + past simple'),('🖼️','Cena','Descrever atmosferas')],
    warmup='O que você estava fazendo ontem às 21h?',
    dialogue_title='At 9 PM', dialogue_sub='Cenas interrompidas.',
    dialogue=[('tom','Tom','What were you doing at 9?'),('anna','Anna','I was reading when the phone rang.'),('tom','Tom','I was cooking and my sister was watching TV.'),('anna','Anna','We were all busy!')],
    vocab=[('was/were + -ing','estava + gerúndio','I was sleeping.'),('when','quando','when it started'),('while','enquanto','while I was walking'),('rang','tocou (ring)','the phone rang'),('at 9','às 9','at 9 o\'clock'),('suddenly','de repente','suddenly')],
    grammar_title='Past Continuous',
    grammar_blocks=[('Forma','was/were + verbo-ing','They were playing.'),('Uso','ação em progresso no passado','I was working at 8.'),('with Simple Past','contínuo + when + passado simples','I was showering when you called.')],
    quiz=[('I ___ reading.',['was','were','am'],0),('They ___ playing.',['were','was','are'],0),('___ you sleeping?',['Were','Was','Did'],0),('She was ___ TV.',['watching','watch','watched'],0),('I was cooking when he ___.',['arrived','arrive','arrives'],0),('We ___ not working.',['were','was','did'],0),('What ___ she doing?',['was','were','did'],0),('While I was walking, it ___.',['started','start','starts'],0)],
    fill=[('I ___ studying.','was'),('They ___ playing.','were'),('___ you working?','Were'),('She was ___ (run).','running'),('I was reading when she ___.','called')],
    oral=['Descreva a cena de ontem às 20h.','Crie 3 frases com when + interrupção.'],
    twister='I was wishing while we were washing with warm water.',
    culture='Past continuous pinta o fundo da história; simple past traz o evento principal.',
    review=['was/were + -ing','when + past simple','What were you doing?'],
    homework='História de 10 linhas misturando continuous e simple past.')

# Generate
written = []
for Ldata in DATA:
    html = build(Ldata)
    path = OUT / Ldata['file']
    path.write_text(html, encoding='utf-8')
    written.append((Ldata['num'], Ldata['file'], path.stat().st_size))

print(f'Wrote {len(written)} lessons')
for n,f,sz in written:
    print(f'  L{n:02d} {sz:6d} B  {f}')
ENDSCRIPT
