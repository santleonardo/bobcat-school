/* ─── GameSound: motor de som leve e compartilhado pelos jogos ───
   Sintetiza os efeitos via Web Audio (nenhum arquivo de áudio externo),
   guarda a preferência de mudo no localStorage (vale para todos os jogos)
   e liga automaticamente qualquer botão com [data-sound-toggle]. */
window.GameSound = (function(){
  const KEY = 'bobcat-sound-muted';
  let muted = localStorage.getItem(KEY) === '1';
  let ctx = null;

  function ensureCtx(){
    if (!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, peak){
    const c = ensureCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    const t0 = c.currentTime + start;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak || 0.18, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  const SOUNDS = {
    click(){ tone(440, 0, 0.06, 'square', 0.12); },
    move(){ tone(300, 0, 0.045, 'square', 0.05); },
    push(){ tone(210, 0, 0.075, 'square', 0.11); },
    correct(){ tone(660, 0, 0.09, 'triangle', 0.18); tone(880, 0.08, 0.14, 'triangle', 0.16); },
    wrong(){ tone(190, 0, 0.16, 'sawtooth', 0.15); },
    hint(){ tone(520, 0, 0.05, 'sine', 0.12); tone(760, 0.06, 0.09, 'sine', 0.1); },
    win(){ [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.2)); }
  };

  function play(name){
    if (muted) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  }

  function syncButtons(){
    document.querySelectorAll('[data-sound-toggle]').forEach(btn => {
      btn.textContent = muted ? '🔇' : '🔊';
      btn.title = muted ? 'Ativar sons' : 'Desativar sons';
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    });
  }

  function setMuted(v){
    muted = v;
    localStorage.setItem(KEY, muted ? '1' : '0');
    syncButtons();
  }

  function toggle(){
    setMuted(!muted);
    if (!muted) play('click');
  }

  function initToggleButtons(){
    syncButtons();
    document.querySelectorAll('[data-sound-toggle]').forEach(btn => {
      if (btn.dataset.soundBound) return;
      btn.dataset.soundBound = '1';
      btn.addEventListener('click', toggle);
    });
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initToggleButtons);
  } else {
    initToggleButtons();
  }

  // Navegadores móveis só liberam áudio depois de um gesto do usuário.
  function unlock(){
    ensureCtx();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  }
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });

  return { play, toggle, isMuted: () => muted, setMuted, initToggleButtons };
})();
