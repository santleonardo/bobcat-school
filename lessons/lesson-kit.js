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

  // ─── Init ───────────────────────────────────────────────
  function init(opts) {
    opts = opts || {};
    if (opts.lessonId) config.lessonId = opts.lessonId;
    if (opts.totalQuestions) config.totalQuestions = opts.totalQuestions;
    if (opts.xpPerLevel) config.xpPerLevel = opts.xpPerLevel;
    if (opts.xpPerStar) config.xpPerStar = opts.xpPerStar;

    updateHUD();
    initReveal();

    // Delegate audio buttons with data-speak
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-speak]');
      if (btn && !btn.closest('.flip-card')) {
        speak(btn, btn.getAttribute('data-speak'));
      }
    });
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
    getXP: function () { return XP; },
    getConfig: function () { return Object.assign({}, config); }
  };

  // Expose speak globally for inline onclick handlers used in lessons
  global.speak = speak;
})(typeof window !== 'undefined' ? window : this);
