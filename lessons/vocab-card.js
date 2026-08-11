/**
 * Vocab card compartilhado — mesmo recurso do chat com a IA.
 * Usado nos manuais de Português (pt-*, pb-*, manual-*) que não carregam lesson-kit.
 *
 * Termos marcados com: <span class="vocab-word" data-word="sujeito">sujeito</span>
 */
(function (global) {
  'use strict';

  if (global.__bobcatVocabCardLoaded) return;
  global.__bobcatVocabCardLoaded = true;

  var currentWord = null;
  var currentContext = '';
  var currentLevel = 'A1';

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function injectStyles() {
    if (document.getElementById('vocab-card-styles')) return;
    var css = document.createElement('style');
    css.id = 'vocab-card-styles';
    css.textContent = [
      '.vocab-word{cursor:pointer;border-bottom:1.5px dotted #C1121F;border-radius:3px;transition:background .12s ease;color:inherit}',
      '.vocab-word:hover,.vocab-word:focus-visible{background:rgba(193,18,31,0.12);outline:none}',
      '.vocab-word:active{background:rgba(193,18,31,0.22)}',
      '.vocab-card-overlay{position:fixed;inset:0;background:rgba(32,24,16,0.5);display:flex;align-items:flex-end;justify-content:center;z-index:600}',
      '.vocab-card-overlay.hidden{display:none!important}',
      '@media(min-width:560px){.vocab-card-overlay{align-items:center;padding:20px}}',
      '.vocab-card{position:relative;background:#FDFAF5;width:100%;max-width:400px;max-height:78vh;overflow-y:auto;border-radius:16px 16px 0 0;box-shadow:0 12px 40px rgba(0,0,0,.35);padding:22px 20px 20px;animation:vocab-card-in .18s ease-out;border:1px solid #E8E4DC;color:#2B2D42;font-family:Inter,system-ui,sans-serif}',
      '@media(min-width:560px){.vocab-card{border-radius:16px}}',
      '@keyframes vocab-card-in{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}',
      '.vocab-card-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;border:none;background:#F5F0E8;color:#555770;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}',
      '.vocab-card-close:hover{color:#2B2D42}',
      '.vocab-card-loading{display:flex;gap:6px;align-items:center;justify-content:center;padding:30px 0;color:#555770;font-size:14px}',
      '.vocab-card-loading.hidden,.vocab-card-content.hidden,.vocab-card-error.hidden,.vocab-card-pos.hidden{display:none!important}',
      '.vocab-card-head{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding-right:34px}',
      '.vocab-card-word{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:21px;color:#C1121F}',
      '.vocab-card-pos{font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#C1121F;background:#F5E6E8;border-radius:99px;padding:4px 10px}',
      '.vocab-card-listen{margin-left:auto;width:36px;height:36px;border-radius:50%;border:1px solid #E8E4DC;background:#F5F0E8;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
      '.vocab-card-listen:hover{transform:translateY(-1px)}',
      '.vocab-card-pron{margin-top:4px;font-size:13.5px;color:#555770}',
      '.vocab-card-pron .ipa{font-style:italic}',
      '.vocab-card-pron .easy{color:#2B2D42;font-weight:600}',
      '.vocab-card-translation{margin-top:12px;font-size:16px;font-weight:600;color:#2D6A4F;background:#E8F5EE;border-radius:10px;padding:11px 13px;border:1px solid rgba(45,106,79,0.2)}',
      '.vocab-card-examples{margin-top:14px;display:flex;flex-direction:column;gap:10px}',
      '.vocab-example{border-left:3px solid #C1121F;padding:2px 0 2px 10px}',
      '.vocab-example .en{font-size:13.5px;color:#2B2D42;line-height:1.4}',
      '.vocab-example .pt{font-size:12.5px;color:#555770;margin-top:2px;line-height:1.4}',
      '.vocab-card-error{text-align:center;padding:18px 4px}',
      '.vocab-card-error p{color:#555770;font-size:13.5px;margin:0 0 12px 0}',
      '.vocab-card-error .btn{background:#C1121F;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer}'
    ].join('\n');
    document.head.appendChild(css);
  }

  function ensureDom() {
    if (document.getElementById('vocab-card-overlay')) return;
    injectStyles();
    var overlay = document.createElement('div');
    overlay.className = 'vocab-card-overlay hidden';
    overlay.id = 'vocab-card-overlay';
    overlay.innerHTML =
      '<div class="vocab-card" id="vocab-card">' +
        '<button type="button" class="vocab-card-close" id="vocab-card-close" aria-label="Fechar">✕</button>' +
        '<div class="vocab-card-body">' +
          '<div class="vocab-card-loading" id="vocab-card-loading">Carregando…</div>' +
          '<div class="vocab-card-content hidden" id="vocab-card-content">' +
            '<div class="vocab-card-head">' +
              '<span class="vocab-card-word" id="vocab-card-word"></span>' +
              '<span class="vocab-card-pos hidden" id="vocab-card-pos"></span>' +
              '<button type="button" class="vocab-card-listen" id="vocab-card-listen" aria-label="Ouvir" title="Ouvir">🔊</button>' +
            '</div>' +
            '<div class="vocab-card-pron" id="vocab-card-pron"></div>' +
            '<div class="vocab-card-translation" id="vocab-card-translation"></div>' +
            '<div class="vocab-card-examples" id="vocab-card-examples"></div>' +
          '</div>' +
          '<div class="vocab-card-error hidden" id="vocab-card-error">' +
            '<p id="vocab-card-error-text">Não consegui buscar essa palavra agora.</p>' +
            '<button type="button" class="btn" id="vocab-card-retry">Tentar de novo</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function cacheKey(word, level) {
    return 'vocabCache_' + level + '_' + word;
  }

  function cacheGet(word, level) {
    try {
      var raw = localStorage.getItem(cacheKey(word, level));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function cacheSet(word, level, data) {
    try { localStorage.setItem(cacheKey(word, level), JSON.stringify(data)); } catch (e) { /* optional */ }
  }

  function close() {
    var overlay = document.getElementById('vocab-card-overlay');
    if (overlay) overlay.classList.add('hidden');
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  function showError(msg) {
    var loading = document.getElementById('vocab-card-loading');
    var content = document.getElementById('vocab-card-content');
    var errorBox = document.getElementById('vocab-card-error');
    var errorText = document.getElementById('vocab-card-error-text');
    if (loading) loading.classList.add('hidden');
    if (content) content.classList.add('hidden');
    if (errorBox) errorBox.classList.remove('hidden');
    if (errorText) errorText.textContent = msg || 'Não consegui buscar essa palavra agora.';
  }

  function render(data) {
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

    if (wordEl) wordEl.textContent = data.word || currentWord || '';
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
      if (data.pronunciationIpa) bits.push('<span class="ipa">' + escapeHtml(data.pronunciationIpa) + '</span>');
      if (data.pronunciationEasy) bits.push('<span class="easy">' + escapeHtml(data.pronunciationEasy) + '</span>');
      pronEl.innerHTML = bits.join(' · ');
    }
    if (translationEl) translationEl.textContent = data.translation || '';
    if (examplesEl) {
      var examples = Array.isArray(data.examples) ? data.examples : [];
      examplesEl.innerHTML = examples.map(function (ex) {
        return '<div class="vocab-example">' +
          '<div class="en">' + escapeHtml(ex.en || '') + '</div>' +
          (ex.pt ? '<div class="pt">' + escapeHtml(ex.pt) + '</div>' : '') +
          '</div>';
      }).join('');
    }
  }

  async function fetchAndRender(word, context, level) {
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
        showError(data.error);
        return;
      }
      cacheSet(word, level, data);
      render(data);
    } catch (err) {
      console.error('vocab-card fetch:', err);
      showError('Erro de conexão. Verifique sua internet.');
    }
  }

  async function open(word, context) {
    ensureDom();
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
    } catch (e) { /* default */ }

    currentWord = word;
    currentContext = context || '';
    currentLevel = level;
    overlay.classList.remove('hidden');

    var cached = cacheGet(word, level);
    if (cached) {
      render(cached);
      return;
    }
    await fetchAndRender(word, context, level);
  }

  function speakCurrent() {
    if (!currentWord || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(currentWord);
      // Portuguese metalanguage terms → pt-BR; English words → en-US
      var isPt = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(currentWord) ||
        /^(sujeito|predicado|objeto|adjunto|aposto|vocativo|regência|concordância|crase|substantivo|adjetivo|advérbio|conjunção|preposição|interjeição|numeral|artigo|pronome|verbo|morfologia|sintaxe|ortografia|pontuação|hífen|oxítona|paroxítona|proparoxítona|ditongo|hiato|dígrafo|trígrafo|sílaba|oração|período|transitivo|intransitivo|predicativo|complemento|colocação|ênclise|próclise|mesóclise)$/i.test(currentWord);
      utter.lang = isPt ? 'pt-BR' : 'en-US';
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    } catch (e) { /* optional */ }
  }

  function setup() {
    ensureDom();

    document.addEventListener('click', function (e) {
      var span = e.target.closest('.vocab-word');
      if (!span) return;
      e.preventDefault();
      e.stopPropagation();
      var word = span.getAttribute('data-word') || span.textContent.trim();
      if (!word) return;
      var parent = span.closest('p, li, td, h2, h3, h4, .card, .box, .example, .note, blockquote, .content-block');
      var context = parent ? parent.textContent.replace(/\s+/g, ' ').trim().slice(0, 300) : '';
      open(word, context);
    });

    var overlay = document.getElementById('vocab-card-overlay');
    var closeBtn = document.getElementById('vocab-card-close');
    var listenBtn = document.getElementById('vocab-card-listen');
    var retryBtn = document.getElementById('vocab-card-retry');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target.id === 'vocab-card-overlay') close();
      });
    }
    if (listenBtn) listenBtn.addEventListener('click', speakCurrent);
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        if (currentWord) fetchAndRender(currentWord, currentContext, currentLevel);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  global.BobcatVocabCard = { open: open, close: close };
})(typeof window !== 'undefined' ? window : this);
