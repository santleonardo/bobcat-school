/**
 * Bobcat Language School — Gridscape Kit
 * Motor de lição em canvas vertical (cards empilhados, arraste só no eixo Y).
 *
 * Uso:
 *   <link rel="stylesheet" href="gridscape-kit.css">
 *   <script src="lesson-kit.js"></script>
 *   <script src="gridscape-kit.js"></script>
 *   <script>
 *     Gridscape.init({
 *       lessonId: 'extra-gridscape-xyz',
 *       totalQuestions: 20,
 *       nodes: [ htmlString0, htmlString1, ... ],
 *       onReady: function (api) { ... }
 *     });
 *   </script>
 */
(function (global) {
  'use strict';

  var GAP_Y = 90;
  var NODE_W = 520;
  var NODE_TOPS = [];
  var revealed = 1;
  var maxNodeHeight = 360;
  var SAFE_TOP = 78;
  var SAFE_BOTTOM = 70;
  var transform = { x: 0, y: 220 };
  var dragging = false;
  var dragStart = { y: 0, ty: 0 };
  var canvasWrap, canvas, nodesCount = 0;
  var config = { lessonId: null, totalQuestions: 10, nodes: [] };

  function viewportSize() {
    if (window.visualViewport) {
      return { w: window.visualViewport.width, h: window.visualViewport.height };
    }
    return { w: window.innerWidth, h: window.innerHeight };
  }

  function computeLayout() {
    var sample = document.getElementById('node-0');
    if (sample) NODE_W = sample.offsetWidth;
    transform.x = (viewportSize().w - NODE_W) / 2;
  }

  function clampTransform() {
    var vc = viewportSize();
    var contentTop = NODE_TOPS[0] || 0;
    var lastIdx = NODE_TOPS.length - 1;
    var lastEl = document.getElementById('node-' + lastIdx);
    var contentBottom = (NODE_TOPS[lastIdx] || 0) + (lastEl ? lastEl.offsetHeight : maxNodeHeight);
    var maxY = SAFE_TOP - contentTop;
    var minY = (vc.h - SAFE_BOTTOM) - contentBottom;
    if (minY > maxY) {
      transform.y = Math.max(maxY, Math.min(minY, transform.y));
    } else {
      transform.y = Math.max(minY, Math.min(maxY, transform.y));
    }
  }

  function applyTransform() {
    clampTransform();
    canvas.style.transform = 'translate(' + transform.x + 'px,' + transform.y + 'px)';
  }

  function centerOnNode(i) {
    var el = document.getElementById('node-' + i);
    var h = el ? el.offsetHeight : 360;
    var y = NODE_TOPS[i] || 0;
    var vc = viewportSize();
    var hh = SAFE_TOP + (vc.h - SAFE_TOP - SAFE_BOTTOM) / 2;
    transform.y = hh - (y + h / 2);
    applyTransform();
  }

  function drawLine(i) {
    var svg = document.getElementById('lines');
    if (!svg) return;
    var elA = document.getElementById('node-' + i);
    var elB = document.getElementById('node-' + (i + 1));
    var x1 = NODE_W / 2;
    var y1 = NODE_TOPS[i] + (elA ? elA.offsetHeight : 0);
    var x2 = NODE_W / 2;
    var y2 = NODE_TOPS[i + 1] || 0;
    var midY = (y1 + y2) / 2;
    var d = 'M' + x1 + ',' + y1 + ' C ' + x1 + ',' + midY + ' ' + x2 + ',' + midY + ' ' + x2 + ',' + y2;
    var glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('stroke', 'url(#lineGrad)');
    glow.setAttribute('stroke-width', '7');
    glow.setAttribute('fill', 'none');
    glow.setAttribute('opacity', '.35');
    glow.setAttribute('filter', 'url(#lineGlow)');
    svg.appendChild(glow);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'url(#lineGrad)');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-dasharray', '1 10');
    svg.appendChild(path);
    [[x1, y1], [x2, y2]].forEach(function (p) {
      var star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      star.setAttribute('cx', p[0]);
      star.setAttribute('cy', p[1]);
      star.setAttribute('r', '3.5');
      star.setAttribute('fill', '#ffd166');
      star.setAttribute('opacity', '.9');
      svg.appendChild(star);
    });
  }

  function revealNext() {
    if (revealed >= nodesCount) return;
    var idx = revealed;
    var el = document.getElementById('node-' + idx);
    drawLine(idx - 1);
    requestAnimationFrame(function () { el.classList.add('show'); });
    revealed++;
    var badge = document.getElementById('capacityBadge');
    if (badge) badge.textContent = 'CAPACIDADE: ' + revealed + '/' + nodesCount + ' NÓS';
    setTimeout(function () { centerOnNode(idx); }, 60);
  }

  function bindDrag() {
    canvasWrap.addEventListener('pointerdown', function (e) {
      var nodeEl = e.target.closest('.gnode');
      if (!nodeEl) return;
      if (e.target.closest('.gtoolbar')) return;
      if (e.target.closest('button, input, a, [data-go], textarea, select')) return;
      dragging = true;
      canvasWrap.classList.add('dragging');
      canvasWrap.setPointerCapture(e.pointerId);
      dragStart = { y: e.clientY, ty: transform.y };
    });
    canvasWrap.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      transform.y = dragStart.ty + (e.clientY - dragStart.y);
      applyTransform();
    });
    function stopDrag() {
      dragging = false;
      canvasWrap.classList.remove('dragging');
    }
    canvasWrap.addEventListener('pointerup', stopDrag);
    canvasWrap.addEventListener('pointerleave', stopDrag);
    canvasWrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      transform.y -= e.deltaY;
      applyTransform();
    }, { passive: false });
  }

  function ensureShell() {
    // Se a página já tem #canvasWrap, reutiliza; senão monta o esqueleto mínimo.
    if (!document.getElementById('canvasWrap')) {
      document.body.insertAdjacentHTML('beforeend',
        '<div id="canvasWrap"><div id="canvas">' +
        '<svg class="gline" id="lines" width="1200" height="12000">' +
        '<defs>' +
        '<linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#ffd166"/>' +
        '<stop offset="100%" stop-color="#ff8a4c"/>' +
        '</linearGradient>' +
        '<filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">' +
        '<feGaussianBlur stdDeviation="4" result="blur"/>' +
        '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
        '</defs></svg></div></div>' +
        '<div class="gcapacity" id="capacityBadge">CAPACIDADE: 1/? NÓS</div>' +
        '<div class="gtoolbar"><button type="button" id="recenter" aria-label="Voltar ao card atual">⤾</button></div>'
      );
    }
    canvasWrap = document.getElementById('canvasWrap');
    canvas = document.getElementById('canvas');
    document.documentElement.style.setProperty('--safe-top', SAFE_TOP + 'px');
    document.documentElement.style.setProperty('--safe-bottom', SAFE_BOTTOM + 'px');
  }

  function buildNodes(htmlList) {
    nodesCount = htmlList.length;
    htmlList.forEach(function (html, i) {
      var node = document.createElement('div');
      node.className = 'gnode';
      node.id = 'node-' + i;
      node.style.left = '0px';
      node.innerHTML = html;
      canvas.appendChild(node);
    });
    computeLayout();
    var cumY = 0;
    htmlList.forEach(function (_, i) {
      var node = document.getElementById('node-' + i);
      NODE_TOPS[i] = cumY;
      node.style.top = cumY + 'px';
      maxNodeHeight = Math.max(maxNodeHeight, node.offsetHeight);
      cumY += node.offsetHeight + GAP_Y;
    });
    applyTransform();
    document.getElementById('node-0').classList.add('show');
    var badge = document.getElementById('capacityBadge');
    if (badge) badge.textContent = 'CAPACIDADE: 1/' + nodesCount + ' NÓS';
  }

  function remeasure() {
    maxNodeHeight = 0;
    var cumY = 0;
    for (var i = 0; i < nodesCount; i++) {
      var node = document.getElementById('node-' + i);
      if (!node) continue;
      NODE_TOPS[i] = cumY;
      node.style.top = cumY + 'px';
      maxNodeHeight = Math.max(maxNodeHeight, node.offsetHeight);
      cumY += node.offsetHeight + GAP_Y;
    }
    computeLayout();
    applyTransform();
  }

  function init(opts) {
    opts = opts || {};
    config.lessonId = opts.lessonId || null;
    config.totalQuestions = opts.totalQuestions || 10;
    config.nodes = opts.nodes || [];

    ensureShell();
    bindDrag();

    var recenter = document.getElementById('recenter');
    if (recenter) {
      recenter.addEventListener('click', function () { centerOnNode(revealed - 1); });
    }

    canvas.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-go]');
      if (btn) revealNext();
    });

    if (config.nodes.length) buildNodes(config.nodes);

    window.addEventListener('resize', function () { computeLayout(); applyTransform(); });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () { computeLayout(); applyTransform(); });
    }

    setTimeout(function () { centerOnNode(0); }, 30);

    if (typeof opts.onReady === 'function') {
      opts.onReady({
        revealNext: revealNext,
        centerOnNode: centerOnNode,
        remeasure: remeasure,
        getRevealed: function () { return revealed; }
      });
      // Conteúdo interativo pode ter mudado altura dos cards
      setTimeout(remeasure, 50);
    }

    if (window.BobcatLesson && config.lessonId) {
      BobcatLesson.init({ lessonId: config.lessonId, totalQuestions: config.totalQuestions });
    }
  }

  // Helpers de UI usados nas lições gridscape
  function norm(s) {
    return (s || '').toString().trim().toLowerCase().replace(/[.!?]/g, '');
  }

  function decodeHtml(s) {
    if (s == null) return '';
    var str = String(s);
    if (str.indexOf('&') === -1) return str;
    try {
      var ta = document.createElement('textarea');
      ta.innerHTML = str;
      return ta.value;
    } catch (e) {
      return str.replace(/&#x27;|&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
  }

  function addXP(n) {
    if (window.BobcatLesson) BobcatLesson.addXP(n);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /**
   * True/False interativo.
   * items: [{ prompt, ans: true|false }]
   * opts: { scoreId, onDone, xp }
   */
  function mountTrueFalse(boxId, items, opts) {
    opts = opts || {};
    var box = document.getElementById(boxId);
    if (!box || !items || !items.length) return { correct: 0, total: 0 };
    var i = 0, correct = 0, answered = false;
    var total = items.length;

    function render() {
      if (i >= total) {
        box.innerHTML = '<p style="font-weight:700;color:var(--ok,#1e6b40)">Verdadeiro/Falso: ' + correct + '/' + total + ' acertos.</p>';
        if (opts.scoreId) {
          var el = document.getElementById(opts.scoreId);
          if (el) el.textContent = correct + '/' + total;
        }
        if (typeof opts.onDone === 'function') opts.onDone(correct, total);
        if (typeof opts.remeasure === 'function') opts.remeasure();
        return;
      }
      answered = false;
      var q = items[i];
      box.innerHTML =
        '<p style="font-weight:700;font-size:15px;margin:0 0 8px">' + (i + 1) + '. ' + decodeHtml(q.prompt) + '</p>' +
        '<div>' +
        '<button type="button" class="gtf-opt" data-v="true">Verdadeiro</button>' +
        '<button type="button" class="gtf-opt" data-v="false">Falso</button>' +
        '</div>' +
        '<button type="button" class="gnext" id="' + boxId + '_next" style="margin-top:12px">Próxima →</button>';
      box.querySelectorAll('.gtf-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var chosen = b.getAttribute('data-v') === 'true';
          var ok = chosen === !!q.ans;
          if (ok) { correct++; addXP(opts.xp || 10); b.classList.add('ok'); }
          else { b.classList.add('bad'); }
          if (opts.scoreId) {
            var el = document.getElementById(opts.scoreId);
            if (el) el.textContent = correct + '/' + total;
          }
        });
      });
      var next = document.getElementById(boxId + '_next');
      if (next) next.addEventListener('click', function () {
        if (!answered && i < total) return;
        i++;
        render();
      });
      if (typeof opts.remeasure === 'function') opts.remeasure();
    }
    render();
    return {
      getCorrect: function () { return correct; },
      getTotal: function () { return total; }
    };
  }

  /**
   * Matching pairs (left-right).
   * pairs: [{ left, right }]
   */
  function mountMatch(boxId, pairs, opts) {
    opts = opts || {};
    var box = document.getElementById(boxId);
    if (!box || !pairs || !pairs.length) return { correct: 0, total: 0 };
    var total = pairs.length;
    var correct = 0;
    var lefts = pairs.map(function (p, idx) { return { t: p.left, i: idx }; });
    var rights = shuffle(pairs.map(function (p, idx) { return { t: p.right, i: idx }; }));
    var selectedLeft = null;
    var matched = {};

    function render() {
      var leftHtml = lefts.map(function (L) {
        var cls = matched[L.i] ? 'gmatch-item ok' : 'gmatch-item';
        if (selectedLeft === L.i) cls += ' selected';
        return '<button type="button" class="' + cls + '" data-side="L" data-i="' + L.i + '"' + (matched[L.i] ? ' disabled' : '') + '>' + decodeHtml(L.t) + '</button>';
      }).join('');
      var rightHtml = rights.map(function (R) {
        var cls = matched[R.i] ? 'gmatch-item ok' : 'gmatch-item';
        return '<button type="button" class="' + cls + '" data-side="R" data-i="' + R.i + '"' + (matched[R.i] ? ' disabled' : '') + '>' + decodeHtml(R.t) + '</button>';
      }).join('');
      box.innerHTML =
        '<p class="gpractice-hint">Toque num item da esquerda e depois o correspondente à direita.</p>' +
        '<div class="gmatch-grid"><div class="gmatch-col">' + leftHtml + '</div><div class="gmatch-col">' + rightHtml + '</div></div>' +
        '<span class="gscore" id="' + boxId + '_score">' + correct + '/' + total + '</span>' +
        (correct >= total ? '' : '<div style="margin-top:10px"><button type="button" class="gnext" id="' + boxId + '_skip" style="background:#fff;color:var(--ink);border:1px solid var(--border);box-shadow:none">Continuar mesmo assim →</button></div>');

      box.querySelectorAll('.gmatch-item').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.disabled) return;
          var side = b.getAttribute('data-side');
          var idx = +b.getAttribute('data-i');
          if (side === 'L') {
            selectedLeft = idx;
            render();
            return;
          }
          if (selectedLeft === null) return;
          if (selectedLeft === idx) {
            matched[idx] = true;
            correct++;
            addXP(opts.xp || 12);
            selectedLeft = null;
            if (opts.scoreId) {
              var el = document.getElementById(opts.scoreId);
              if (el) el.textContent = correct + '/' + total;
            }
            if (correct >= total && typeof opts.onDone === 'function') opts.onDone(correct, total);
          } else {
            b.classList.add('bad');
            setTimeout(function () { selectedLeft = null; render(); }, 450);
            return;
          }
          render();
        });
      });
      var skipBtn = document.getElementById(boxId + '_skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', function () {
          if (typeof opts.onDone === 'function') opts.onDone(correct, total);
        });
      }
      if (typeof opts.remeasure === 'function') opts.remeasure();
    }
    render();
    return {
      getCorrect: function () { return correct; },
      getTotal: function () { return total; }
    };
  }

  /**
   * Order dialogue / sentences.
   * lines: string[]
   */
  function mountOrder(boxId, lines, opts) {
    opts = opts || {};
    var box = document.getElementById(boxId);
    if (!box || !lines || lines.length < 2) return { correct: 0, total: 0 };
    var total = 1; // one exercise
    var correct = 0;
    var order = shuffle(lines.map(function (_, i) { return i; }));
    var picked = [];

    function label(n) {
      return n >= 0 ? String(n + 1) : '·';
    }

    function render() {
      var html = '<p class="gpractice-hint">Toque nas falas na ordem correta do diálogo.</p><div class="gorder-list">';
      order.forEach(function (idx) {
        var pos = picked.indexOf(idx);
        html += '<button type="button" class="gorder-item' + (pos >= 0 ? ' selected' : '') + '" data-i="' + idx + '">' +
          '<span class="gord-num">' + label(pos) + '</span><span>' + lines[idx] + '</span></button>';
      });
      html += '</div>';
      html += '<button type="button" class="gnext" id="' + boxId + '_check">Verificar ordem</button>';
      html += ' <button type="button" class="gnext" id="' + boxId + '_reset" style="background:#fff;color:var(--ink);border:1px solid var(--border);box-shadow:none">Reiniciar</button>';
      html += '<div id="' + boxId + '_msg" style="margin-top:10px;font-weight:700"></div>';
      box.innerHTML = html;

      box.querySelectorAll('.gorder-item').forEach(function (b) {
        b.addEventListener('click', function () {
          var idx = +b.getAttribute('data-i');
          var pos = picked.indexOf(idx);
          if (pos >= 0) picked.splice(pos, 1);
          else picked.push(idx);
          render();
        });
      });
      var chk = document.getElementById(boxId + '_check');
      if (chk) chk.addEventListener('click', function () {
        var ok = picked.length === lines.length && picked.every(function (v, i) { return v === i; });
        var msg = document.getElementById(boxId + '_msg');
        if (ok) {
          correct = 1;
          addXP(opts.xp || 20);
          if (msg) { msg.style.color = 'var(--ok,#1e6b40)'; msg.textContent = '✓ Ordem correta!'; }
          if (opts.scoreId) {
            var el = document.getElementById(opts.scoreId);
            if (el) el.textContent = '1/1';
          }
          if (typeof opts.onDone === 'function') opts.onDone(1, 1);
        } else {
          if (msg) { msg.style.color = 'var(--bad,#d9432f)'; msg.textContent = 'Ainda não — tente de novo.'; }
        }
        if (typeof opts.remeasure === 'function') opts.remeasure();
      });
      var rst = document.getElementById(boxId + '_reset');
      if (rst) rst.addEventListener('click', function () {
        picked = [];
        order = shuffle(lines.map(function (_, i) { return i; }));
        render();
      });
      if (typeof opts.remeasure === 'function') opts.remeasure();
    }
    render();
    return {
      getCorrect: function () { return correct; },
      getTotal: function () { return total; }
    };
  }

  /**
   * Speaking checklist — aluno marca o que praticou em voz alta.
   * prompts: string[]
   */
  function mountSpeakChecklist(boxId, prompts, opts) {
    opts = opts || {};
    var box = document.getElementById(boxId);
    if (!box || !prompts || !prompts.length) return { correct: 0, total: 0 };
    var total = prompts.length;
    var done = {};
    var correct = 0;

    function render() {
      var html = '<p class="gpractice-hint">Fale em voz alta cada item e toque para marcar. Use 🔊 para ouvir o modelo.</p><div class="gspeak-list">';
      prompts.forEach(function (p, i) {
        var isDone = !!done[i];
        html += '<div class="gspeak-item' + (isDone ? ' done' : '') + '" data-i="' + i + '">' +
          '<span class="gcheck">' + (isDone ? '✓' : '') + '</span>' +
          '<span class="gspeak-text">' + p +
          ' <button type="button" class="gaudio" data-speak="' + p.replace(/"/g, '&quot;') + '">🔊</button></span></div>';
      });
      html += '</div><span class="gscore" id="' + boxId + '_score">' + correct + '/' + total + '</span>';
      box.innerHTML = html;
      box.querySelectorAll('.gspeak-item').forEach(function (row) {
        row.addEventListener('click', function (e) {
          if (e.target.closest('.gaudio')) return;
          var idx = +row.getAttribute('data-i');
          if (done[idx]) return;
          done[idx] = true;
          correct++;
          addXP(opts.xp || 8);
          if (opts.scoreId) {
            var el = document.getElementById(opts.scoreId);
            if (el) el.textContent = correct + '/' + total;
          }
          if (correct >= total && typeof opts.onDone === 'function') opts.onDone(correct, total);
          render();
        });
      });
      if (typeof opts.remeasure === 'function') opts.remeasure();
    }
    render();
    return {
      getCorrect: function () { return correct; },
      getTotal: function () { return total; }
    };
  }

  /**
   * Sentence scramble — montar frase na ordem certa.
   * sentence: string (words separated by space)
   */
  function mountScramble(boxId, sentence, opts) {
    opts = opts || {};
    var box = document.getElementById(boxId);
    if (!box || !sentence) return { correct: 0, total: 0 };
    var words = sentence.replace(/[.!?]/g, '').split(/\s+/).filter(Boolean);
    var total = 1;
    var correct = 0;
    var bank = shuffle(words.map(function (w, i) { return { w: w, i: i }; }));
    var answer = [];

    function render() {
      var bankHtml = bank.map(function (item, bi) {
        return '<button type="button" class="gscramble-word" data-bi="' + bi + '">' + item.w + '</button>';
      }).join('');
      var ansHtml = answer.map(function (item, ai) {
        return '<button type="button" class="gscramble-word selected" data-ai="' + ai + '">' + item.w + '</button>';
      }).join('');
      box.innerHTML =
        '<p class="gpractice-hint">Monte a frase na ordem correta.</p>' +
        '<div class="gscramble-answer" id="' + boxId + '_ans">' + (ansHtml || '<span style="color:var(--ink-soft);font-size:12px">Toque nas palavras abaixo…</span>') + '</div>' +
        '<div class="gscramble-bank">' + bankHtml + '</div>' +
        '<button type="button" class="gnext" id="' + boxId + '_check">Verificar</button>' +
        ' <button type="button" class="gnext" id="' + boxId + '_reset" style="background:#fff;color:var(--ink);border:1px solid var(--border);box-shadow:none">Limpar</button>' +
        '<div id="' + boxId + '_msg" style="margin-top:10px;font-weight:700"></div>';

      box.querySelectorAll('[data-bi]').forEach(function (b) {
        b.addEventListener('click', function () {
          var bi = +b.getAttribute('data-bi');
          answer.push(bank[bi]);
          bank.splice(bi, 1);
          render();
        });
      });
      box.querySelectorAll('[data-ai]').forEach(function (b) {
        b.addEventListener('click', function () {
          var ai = +b.getAttribute('data-ai');
          bank.push(answer[ai]);
          answer.splice(ai, 1);
          render();
        });
      });
      var chk = document.getElementById(boxId + '_check');
      if (chk) chk.addEventListener('click', function () {
        var built = answer.map(function (x) { return x.w; }).join(' ');
        var target = words.join(' ');
        var ok = norm(built) === norm(target);
        var msg = document.getElementById(boxId + '_msg');
        if (ok) {
          correct = 1;
          addXP(opts.xp || 18);
          if (msg) { msg.style.color = 'var(--ok,#1e6b40)'; msg.textContent = '✓ Frase correta!'; }
          if (opts.scoreId) {
            var el = document.getElementById(opts.scoreId);
            if (el) el.textContent = '1/1';
          }
          if (typeof opts.onDone === 'function') opts.onDone(1, 1);
        } else {
          if (msg) { msg.style.color = 'var(--bad,#d9432f)'; msg.textContent = 'Ainda não — tente de novo.'; }
        }
        if (typeof opts.remeasure === 'function') opts.remeasure();
      });
      var rst = document.getElementById(boxId + '_reset');
      if (rst) rst.addEventListener('click', function () {
        bank = shuffle(words.map(function (w, i) { return { w: w, i: i }; }));
        answer = [];
        render();
      });
      if (typeof opts.remeasure === 'function') opts.remeasure();
    }
    render();
    return {
      getCorrect: function () { return correct; },
      getTotal: function () { return total; }
    };
  }

  global.Gridscape = {
    init: init,
    revealNext: revealNext,
    centerOnNode: centerOnNode,
    remeasure: remeasure,
    norm: norm,
    addXP: addXP,
    shuffle: shuffle,
    mountTrueFalse: mountTrueFalse,
    mountMatch: mountMatch,
    mountOrder: mountOrder,
    mountSpeakChecklist: mountSpeakChecklist,
    mountScramble: mountScramble,
    GAP_Y: GAP_Y
  };
})(typeof window !== 'undefined' ? window : this);
