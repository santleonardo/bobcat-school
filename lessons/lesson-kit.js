/**
 * Bobcat Language School — Lesson Kit (shared)
 * HUD/XP, TTS, confetti helpers, scroll reveal, flip cards,
 * and bridge to the real progress system (db-client.js).
 *
 * Usage in a lesson page:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="../config.js"></script>
 *   <script src="../db-client.js"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
 *   <script src="lesson-kit.js"></script>
 *   <script>
 *     BobcatLesson.init({ lessonId: 'licao-2-perguntas-artigos', totalQuestions: 14 });
 *   </script>
 */

(function applyBobcatTheme() {
  try {
    var t = localStorage.getItem('bobcat_theme');
    if (t !== 'light' && t !== 'dark') {
      t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();


(function (global) {
  'use strict';

  var XP = 0;
  var LEVEL = 1;
  var STARS = 0;
  var config = {
    lessonId: null,
    totalQuestions: 10,
    xpPerLevel: 100,
    xpPerStar: 50
  };

  // ─── HUD / XP ───────────────────────────────────────────
  function addXP(n) {
    if (!n || n <= 0) return;
    XP += n;
    LEVEL = Math.floor(XP / config.xpPerLevel) + 1;
    STARS = Math.floor(XP / config.xpPerStar);
    updateHUD();
  }

  function updateHUD() {
    var bar = document.getElementById('xpBar');
    var label = document.getElementById('xpLabel');
    var lv = document.getElementById('levelPill');
    var st = document.getElementById('starsPill');
    if (bar) bar.style.width = Math.min(XP % config.xpPerLevel, 100) + '%';
    if (label) label.textContent = XP + ' XP';
    if (lv) lv.textContent = '⭐ Nível ' + LEVEL;
    if (st) st.textContent = '🏆 ' + STARS + ' estrelas';
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }

  function fireConfetti(opts) {
    if (typeof confetti === 'function') {
      confetti(opts || { particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }

  // ─── TTS ────────────────────────────────────────────────
  function speak(btn, text) {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta síntese de voz. Use Chrome ou Edge.');
      return;
    }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.92;
    u.pitch = 1;
    if (btn) btn.classList.add('playing');
    u.onend = function () { if (btn) btn.classList.remove('playing'); };
    u.onerror = function () { if (btn) btn.classList.remove('playing'); };
    window.speechSynthesis.speak(u);
  }

  // ─── Scroll reveal ──────────────────────────────────────
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ─── Flip cards ─────────────────────────────────────────
  /**
   * data: [{ word, trans, ex, icon, color }]
   * containerId: element id for the grid
   */
  function buildFlipCards(containerId, data) {
    var grid = document.getElementById(containerId);
    if (!grid || !data) return;
    grid.innerHTML = '';
    data.forEach(function (d) {
      var card = document.createElement('div');
      card.className = 'flip-card';
      var color = d.color || '#D9793F';
      card.innerHTML =
        '<div class="flip-card-inner">' +
          '<div class="flip-card-face flip-front" style="background:linear-gradient(135deg,' + color + ',' + color + 'dd)">' +
            '<span class="flip-icon">' + (d.icon || '🔤') + '</span>' + d.word +
            '<span class="flip-hint">Toque para virar</span>' +
          '</div>' +
          '<div class="flip-card-face flip-back">' +
            '<span class="fb-word">' + d.word + '</span>' +
            '<span class="fb-trans">' + d.trans + '</span>' +
            (d.ex ? '<span class="fb-example">"' + d.ex + '"</span>' : '') +
            '<div class="fb-audio"><button type="button" class="audio-btn" data-speak="' +
              escapeAttr(d.ex || d.word) + '">🔊 Ouvir</button></div>' +
          '</div>' +
        '</div>';
      card.addEventListener('click', function (e) {
        if (e.target.closest('.audio-btn')) return;
        card.classList.toggle('flipped');
      });
      grid.appendChild(card);
    });
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-speak]');
      if (btn) {
        e.stopPropagation();
        speak(btn, btn.getAttribute('data-speak'));
      }
    });
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ─── Progress bridge ────────────────────────────────────
  var finishing = false;

  /**
   * Finish the lesson and save real progress via db-client.handleLessonFinish.
   * @param {number} correct
   * @param {number} total
   * @param {'correct'|'filled'} kind
   * @returns {Promise<boolean>}
   */
  async function finishLesson(correct, total, kind) {
    if (finishing) return false;
    finishing = true;

    var lessonId = config.lessonId;
    if (!lessonId) {
      console.error('BobcatLesson: lessonId not set. Call init({ lessonId: "..." })');
      finishing = false;
      return false;
    }

    var safeTotal = total > 0 ? total : (config.totalQuestions || 1);
    var safeCorrect = typeof correct === 'number' ? correct : 0;
    if (safeCorrect > safeTotal) safeCorrect = safeTotal;

    // Prefer real handleLessonFinish from db-client.js
    if (typeof handleLessonFinish === 'function') {
      try {
        var passed = await handleLessonFinish(lessonId, safeCorrect, safeTotal, kind || 'correct');
        if (!passed) finishing = false;
        return passed;
      } catch (err) {
        console.error(err);
        finishing = false;
        showToast('Erro ao salvar progresso. Tente novamente.');
        return false;
      }
    }

    // Fallback (standalone / no db-client): localStorage only
    var msg = document.getElementById('finishMsg') || document.getElementById('finishMessage');
    var pct = safeTotal ? Math.round((safeCorrect / safeTotal) * 100) : 0;
    var ok = pct >= 85;
    try {
      var key = 'bobcat_progress';
      var raw = localStorage.getItem(key);
      var map = raw ? JSON.parse(raw) : {};
      map[lessonId] = {
        completed: ok,
        correct: safeCorrect,
        total: safeTotal,
        lastAttempt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(map));
    } catch (e) { /* ignore */ }

    if (msg) {
      msg.style.display = 'block';
      if (ok) {
        msg.style.color = '#1e6b40';
        msg.textContent = '🎉 Lição concluída (' + pct + '%)! Progresso salvo neste navegador.';
        fireConfetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      } else {
        msg.style.color = '#C0392B';
        msg.textContent = '📌 Você fez ' + safeCorrect + '/' + safeTotal + ' (' + pct + '%). Precisa de pelo menos 85% para concluir.';
      }
    }
    if (!ok) finishing = false;
    return ok;
  }

  // ─── Vocab card (same resource as AI chat) ──────────────
  // Student taps a .vocab-word span → mini-card with translation,
  // pronunciation and examples via /api/vocab-lookup.
  var vocabCardCurrentWord = null;
  var vocabCardCurrentContext = '';
  var vocabCardCurrentLevel = 'A1';

  function vocabEscapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function vocabCacheKey(word, level) {
    return 'vocabCache_' + level + '_' + word;
  }

  function vocabCacheGet(word, level) {
    try {
      var raw = localStorage.getItem(vocabCacheKey(word, level));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function vocabCacheSet(word, level, data) {
    try { localStorage.setItem(vocabCacheKey(word, level), JSON.stringify(data)); } catch (e) { /* optional */ }
  }

  function ensureVocabCardDom() {
    if (document.getElementById('vocab-card-overlay')) return;
    var overlay = document.createElement('div');
    overlay.className = 'vocab-card-overlay hidden';
    overlay.id = 'vocab-card-overlay';
    overlay.innerHTML =
      '<div class="vocab-card" id="vocab-card">' +
        '<button type="button" class="vocab-card-close" id="vocab-card-close" aria-label="Fechar">✕</button>' +
        '<div class="vocab-card-body" id="vocab-card-body">' +
          '<div class="vocab-card-loading" id="vocab-card-loading">Carregando…</div>' +
          '<div class="vocab-card-content hidden" id="vocab-card-content">' +
            '<div class="vocab-card-head">' +
              '<span class="vocab-card-word" id="vocab-card-word"></span>' +
              '<span class="vocab-card-pos hidden" id="vocab-card-pos"></span>' +
              '<button type="button" class="vocab-card-listen" id="vocab-card-listen" aria-label="Ouvir pronúncia" title="Ouvir pronúncia">🔊</button>' +
            '</div>' +
            '<div class="vocab-card-pron" id="vocab-card-pron"></div>' +
            '<div class="vocab-card-translation" id="vocab-card-translation"></div>' +
            '<div class="vocab-card-examples" id="vocab-card-examples"></div>' +
          '</div>' +
          '<div class="vocab-card-error hidden" id="vocab-card-error">' +
            '<p id="vocab-card-error-text">Não consegui buscar essa palavra agora.</p>' +
            '<button type="button" class="btn" id="vocab-card-retry" style="margin-top:8px">Tentar de novo</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function vocabCardClose() {
    var overlay = document.getElementById('vocab-card-overlay');
    if (overlay) overlay.classList.add('hidden');
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  function vocabCardShowError(msg) {
    var loading = document.getElementById('vocab-card-loading');
    var content = document.getElementById('vocab-card-content');
    var errorBox = document.getElementById('vocab-card-error');
    var errorText = document.getElementById('vocab-card-error-text');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.add('hidden');
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorText) errorText.textContent = msg || 'Não consegui buscar essa palavra agora.';
  }

  function vocabCardRender(data) {
    var loading = document.getElementById('vocab-card-loading');
    var content = document.getElementById('vocab-card-content');
    var errorBox = document.getElementById('vocab-card-error');
    if (loading) loading.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');
    if (content) content.classList.remove('hidden');

    var wordEl = document.getElementById('vocab-card-word');
    var posEl = document.getElementById('vocab-card-pos');
    var pronEl = document.getElementById('vocab-card-pron');
    var translationEl = document.getElementById('vocab-card-translation');
    var examplesEl = document.getElementById('vocab-card-examples');

    if (wordEl) wordEl.textContent = data.word || vocabCardCurrentWord || '';
    if (posEl) {
      if (data.partOfSpeech) {
        posEl.textContent = data.partOfSpeech;
        posEl.classList.remove('hidden');
      } else {
        posEl.classList.add('hidden');
      }
    }
    if (pronEl) {
      var bits = [];
      if (data.pronunciationIpa) bits.push('<span class="ipa">' + vocabEscapeHtml(data.pronunciationIpa) + '</span>');
      if (data.pronunciationEasy) bits.push('<span class="easy">' + vocabEscapeHtml(data.pronunciationEasy) + '</span>');
      pronEl.innerHTML = bits.join(' · ');
    }
    if (translationEl) translationEl.textContent = data.translation || '';
    if (examplesEl) {
      var examples = Array.isArray(data.examples) ? data.examples : [];
      examplesEl.innerHTML = examples.map(function (ex) {
        return '<div class="vocab-example">' +
          '<div class="en">' + vocabEscapeHtml(ex.en || '') + '</div>' +
          (ex.pt ? '<div class="pt">' + vocabEscapeHtml(ex.pt) + '</div>' : '') +
          '</div>';
      }).join('');
    }
  }

  async function vocabCardFetchAndRender(word, context, level) {
    var loading = document.getElementById('vocab-card-loading');
    var content = document.getElementById('vocab-card-content');
    var errorBox = document.getElementById('vocab-card-error');
    if (loading) loading.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');

    try {
      var resp = await fetch('/api/vocab-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word, context: context, level: level })
      });
      var data = await resp.json().catch(function () { return {}; });
      if (!resp.ok || !data.translation) {
        vocabCardShowError(data.error);
        return;
      }
      vocabCacheSet(word, level, data);
      vocabCardRender(data);
    } catch (err) {
      console.error('Erro em vocabCardFetchAndRender:', err);
      vocabCardShowError('Erro de conexão. Verifique sua internet.');
    }
  }

  async function vocabCardOpen(word, context) {
    ensureVocabCardDom();
    var overlay = document.getElementById('vocab-card-overlay');
    if (!overlay) return;

    var level = 'A1';
    try {
      if (typeof getProfile === 'function') {
        var profile = (await getProfile()) || {};
        if (profile.level) level = profile.level;
      } else {
        var stored = localStorage.getItem('bobcat_profile');
        if (stored) {
          var p = JSON.parse(stored);
          if (p && p.level) level = p.level;
        }
      }
    } catch (e) { /* default A1 */ }

    vocabCardCurrentWord = word;
    vocabCardCurrentContext = context || '';
    vocabCardCurrentLevel = level;

    overlay.classList.remove('hidden');

    var cached = vocabCacheGet(word, level);
    if (cached) {
      vocabCardRender(cached);
      return;
    }
    await vocabCardFetchAndRender(word, context, level);
  }

  function vocabCardSpeakCurrent() {
    if (!vocabCardCurrentWord) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(vocabCardCurrentWord);
      utter.lang = 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch (e) { /* optional */ }
  }

  function setupVocabCard() {
    ensureVocabCardDom();

    document.addEventListener('click', function (e) {
      var span = e.target.closest('.vocab-word');
      if (!span) return;
      e.preventDefault();
      e.stopPropagation();
      var word = span.getAttribute('data-word') || span.textContent.trim();
      if (!word) return;
      // Prefer surrounding sentence / paragraph as context
      var parent = span.closest('p, li, td, .bubble, .struct-example, .card, h3, h2');
      var context = parent ? parent.textContent.replace(/\s+/g, ' ').trim().slice(0, 300) : '';
      vocabCardOpen(word, context);
    });

    var overlay = document.getElementById('vocab-card-overlay');
    var closeBtn = document.getElementById('vocab-card-close');
    var listenBtn = document.getElementById('vocab-card-listen');
    var retryBtn = document.getElementById('vocab-card-retry');
    if (closeBtn) closeBtn.addEventListener('click', vocabCardClose);
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target.id === 'vocab-card-overlay') vocabCardClose();
      });
    }
    if (listenBtn) listenBtn.addEventListener('click', vocabCardSpeakCurrent);
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        if (vocabCardCurrentWord) {
          vocabCardFetchAndRender(vocabCardCurrentWord, vocabCardCurrentContext, vocabCardCurrentLevel);
        }
      });
    }
  }

  // ─── Init ───────────────────────────────────────────────
  function init(opts) {
    opts = opts || {};
    if (opts.lessonId) config.lessonId = opts.lessonId;
    if (opts.totalQuestions) config.totalQuestions = opts.totalQuestions;
    if (opts.xpPerLevel) config.xpPerLevel = opts.xpPerLevel;
    if (opts.xpPerStar) config.xpPerStar = opts.xpPerStar;

    updateHUD();
    initReveal();
    setupVocabCard();

    // Delegate audio buttons with data-speak
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-speak]');
      if (btn && !btn.closest('.flip-card')) {
        speak(btn, btn.getAttribute('data-speak'));
      }
    });
  }

  /** Alias for older lesson scripts that called complete({correct, total}) */
  function complete(arg1, arg2, arg3) {
    if (arg1 && typeof arg1 === 'object') {
      return finishLesson(arg1.correct, arg1.total, arg1.kind || 'correct');
    }
    return finishLesson(arg1, arg2, arg3);
  }

  global.BobcatLesson = {
    init: init,
    addXP: addXP,
    updateHUD: updateHUD,
    showToast: showToast,
    fireConfetti: fireConfetti,
    speak: speak,
    buildFlipCards: buildFlipCards,
    finishLesson: finishLesson,
    complete: complete,
    getXP: function () { return XP; },
    getConfig: function () { return Object.assign({}, config); }
  };

  // Expose speak globally for inline onclick handlers used in lessons
  global.speak = speak;
})(typeof window !== 'undefined' ? window : this);
