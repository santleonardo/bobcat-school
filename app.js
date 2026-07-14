// ============================================================
// Bobcat Language School — App PWA
// Perfil e progresso vêm do db-client.js (Supabase ou localStorage).
// ============================================================

// Catálogo de lições. Para adicionar uma nova lição, basta
// incluir um novo objeto aqui e criar o arquivo em /lessons.
const LESSONS = [
  {
    id: 'verb-to-be',
    name: 'Verb To Be',
    level: 'A1',
    icon: '📘',
    description: 'am, is, are — afirmativas, negativas e perguntas',
    url: 'lessons/verb-to-be.html',
    totalQuestions: 21 // 8 (parte1) + 6 (parte2) + 7 (parte3)
  },
  {
    id: 'saudacoes-apresentacoes',
    name: 'Saudações e Apresentações',
    level: 'A1',
    icon: '👋',
    description: 'Greetings, introductions e diálogos com áudio',
    url: 'lessons/saudacoes-apresentacoes.html',
    totalQuestions: 17 // 5 (parte1) + 3 (parte2) + 3 (parte3) + 4 (parte4) + 2 (parte5)
  }
  // próximas lições entram aqui, ex:
  // { id: 'present-simple', name: 'Present Simple', level: 'A1', icon: '📗', url: 'lessons/present-simple.html', totalQuestions: 15 }
];

// ---------- Navegação entre telas ----------

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen-' + id).classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector('.nav-btn[data-screen="' + id + '"]');
  if (navBtn) navBtn.classList.add('active');

  if (id === 'home') renderHome();
  if (id === 'profile-view') renderProfileView();
}

// ---------- Tela de criação de perfil ----------

let selectedAvatarSetup = '🦁';

function initAvatarPicker(containerId, onSelect) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.avatar-option').forEach(opt => {
    opt.addEventListener('click', () => {
      container.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      onSelect(opt.dataset.avatar);
    });
  });
}

function setupProfileScreen() {
  initAvatarPicker('avatar-picker', (avatar) => { selectedAvatarSetup = avatar; });
  document.querySelector('#avatar-picker .avatar-option').classList.add('selected');

  document.getElementById('btn-save-profile').addEventListener('click', async () => {
    const name = document.getElementById('input-name').value.trim();
    if (!name) {
      document.getElementById('input-name').focus();
      document.getElementById('input-name').style.borderColor = 'var(--bad)';
      return;
    }
    const level = document.getElementById('input-level').value;
    const btn = document.getElementById('btn-save-profile');
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    await saveProfile({ name, avatar: selectedAvatarSetup, level, createdAt: new Date().toISOString() });
    btn.disabled = false;
    btn.textContent = 'Começar a estudar';
    enterApp();
  });
}

// ---------- Tela de perfil (visualização/edição) ----------

let selectedAvatarEdit = '🦁';

async function renderProfileView() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('profile-avatar').textContent = profile.avatar;
  document.getElementById('profile-name-display').textContent = profile.name;
  document.getElementById('profile-level-display').textContent = 'Nível ' + profile.level;

  document.getElementById('edit-name').value = profile.name;
  document.getElementById('edit-level').value = profile.level;

  selectedAvatarEdit = profile.avatar;
  const editContainer = document.getElementById('avatar-picker-edit');
  editContainer.querySelectorAll('.avatar-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.avatar === profile.avatar);
  });

  const cloudNote = document.getElementById('cloud-status');
  if (cloudNote) {
    cloudNote.textContent = isUsingCloud()
      ? '☁️ Sincronizado com a nuvem (Supabase)'
      : '💾 Salvo apenas neste navegador (sem Supabase configurado)';
  }
}

function setupProfileViewScreen() {
  initAvatarPicker('avatar-picker-edit', (avatar) => { selectedAvatarEdit = avatar; });

  document.getElementById('btn-update-profile').addEventListener('click', async () => {
    const name = document.getElementById('edit-name').value.trim();
    if (!name) return;
    const level = document.getElementById('edit-level').value;
    const profile = (await getProfile()) || {};
    profile.name = name;
    profile.avatar = selectedAvatarEdit;
    profile.level = level;
    await saveProfile(profile);
    await renderProfileView();
    showScreen('home');
  });

  document.getElementById('btn-reset-progress').addEventListener('click', async () => {
    if (confirm('Isso vai apagar o progresso de todas as lições. Tem certeza?')) {
      await resetAllProgress();
      await renderHome();
      alert('Progresso zerado.');
    }
  });
}

// ---------- Tela Home / lista de lições ----------

async function renderHome() {
  const profile = await getProfile();
  if (!profile) return;

  document.getElementById('home-avatar').textContent = profile.avatar;
  document.getElementById('home-greeting').textContent = 'Olá, ' + profile.name + '!';
  document.getElementById('home-level-sub').textContent = 'Nível ' + profile.level + ' • continue praticando';

  const progress = await getProgress();

  const completedLessons = LESSONS.filter(l => progress[l.id] && progress[l.id].completed);
  document.getElementById('stat-completed').textContent = completedLessons.length;

  const scored = LESSONS.filter(l => progress[l.id] && progress[l.id].total > 0);
  if (scored.length > 0) {
    const avgPct = Math.round(
      scored.reduce((sum, l) => sum + (progress[l.id].correct / progress[l.id].total), 0) / scored.length * 100
    );
    document.getElementById('stat-score').textContent = avgPct + '%';
  } else {
    document.getElementById('stat-score').textContent = '—';
  }

  document.getElementById('stat-streak').textContent = LESSONS.length;

  const list = document.getElementById('lesson-list');
  list.innerHTML = '';

  LESSONS.forEach(lesson => {
    const p = progress[lesson.id];
    const pct = p && p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
    const done = p && p.completed;

    const card = document.createElement('div');
    card.className = 'lesson-card';
    card.innerHTML = `
      <div class="icon">${lesson.icon}</div>
      <div class="info">
        <div class="name">${lesson.name}</div>
        <div class="level">Nível ${lesson.level} • ${lesson.description}</div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
      </div>
      <div class="badge ${done ? 'done' : ''}">${done ? '✓ ' + pct + '%' : (p ? pct + '%' : 'Começar')}</div>
      <div class="chevron">›</div>
    `;
    card.addEventListener('click', () => openLesson(lesson));
    list.appendChild(card);
  });
}

function openLesson(lesson) {
  window.location.href = lesson.url;
}

// ---------- Fluxo geral do app ----------

function enterApp() {
  document.getElementById('bottom-nav').style.display = 'flex';
  showScreen('home');
}

async function boot() {
  showLoadingState(true);
  await initDataLayer();

  setupProfileScreen();
  setupProfileViewScreen();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.screen));
  });

  const profile = await getProfile();
  showLoadingState(false);

  if (profile) {
    enterApp();
  } else {
    showScreen('profile-setup');
  }

  setupInstallPrompt();
  registerServiceWorker();
}

function showLoadingState(loading) {
  const el = document.getElementById('boot-loading');
  if (el) el.style.display = loading ? 'flex' : 'none';
}

// ---------- PWA: instalação e service worker ----------

let deferredInstallPrompt = null;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const slot = document.getElementById('install-banner-slot');
    if (slot) slot.innerHTML = '';
  });
}

function showInstallBanner() {
  const slot = document.getElementById('install-banner-slot');
  if (!slot) return;
  slot.innerHTML = `
    <div class="install-banner">
      <span>📲 Instale o app na tela inicial para acessar offline</span>
      <button id="btn-install">Instalar</button>
    </div>
  `;
  document.getElementById('btn-install').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    slot.innerHTML = '';
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      console.log('Service worker não registrado (provavelmente rodando via file://).');
    });
  }
}

document.addEventListener('DOMContentLoaded', boot);
