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

  function addXP(n) {
    if (window.BobcatLesson) BobcatLesson.addXP(n);
  }

  global.Gridscape = {
    init: init,
    revealNext: revealNext,
    centerOnNode: centerOnNode,
    remeasure: remeasure,
    norm: norm,
    addXP: addXP,
    GAP_Y: GAP_Y
  };
})(typeof window !== 'undefined' ? window : this);
