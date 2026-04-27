// ── Variables globales ──
var matiereId = new URLSearchParams(window.location.search).get('matiere');
var matiereData = null, couleur = '#a855f7', currentNiveau = null;

// ── Son de parchemin ──
function playParchmentSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.setValueAtTime(180, audioContext.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(240, audioContext.currentTime + 0.15);
  gain1.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  osc1.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.15);

  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.setValueAtTime(320, audioContext.currentTime + 0.05);
  osc2.frequency.exponentialRampToValueAtTime(380, audioContext.currentTime + 0.18);
  gain2.gain.setValueAtTime(0.12, audioContext.currentTime + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
  osc2.start(audioContext.currentTime + 0.05);
  osc2.stop(audioContext.currentTime + 0.18);
}

// ── Son papier (pour ouverture map) ──
function playPaperSound() {
  const audio = new Audio('wav/mapsound.wav');
  audio.volume = 0.6;
  audio.play().catch(() => {});
}

// ── Sélection province ──
function selectProvince(id) {
  const wrap   = document.getElementById('globe-wrap');
  const fresnel = document.getElementById('fresnel-modal');
  const btn = document.getElementById('globe-toggle-btn');

  if (fresnel) fresnel.style.display = 'none';

  drawFog(null);
  closeGlobeModal();

  wrap.classList.add('compact');
  if (btn) btn.classList.add('active');

  wrap.classList.add('teleporting');

  setTimeout(() => {
    const data = window.__neoData;
    if (!data) return;
    const mid = new URLSearchParams(window.location.search).get('matiere');
    const mat = data.matieres.find(m => m.id === mid);
    if (!mat) return;
    const niv = mat.niveaux?.find(n => n.id === id);
    if (!niv) return;
    const c = niv.couleur_province || couleur;

    document.documentElement.style.setProperty('--accent', c);
    const lbl = document.getElementById('sidebar-province-label');
    if (lbl) lbl.textContent = (niv.emoji_province||'') + ' ' + (niv.nom_province || niv.nom);

    playPaperSound();
    renderProvince(niv, c);

    let activeZone = null;
    document.querySelectorAll('.g-zone').forEach(z => {
      if ((z.getAttribute('onclick') || '').includes(id)) activeZone = z;
    });
    _persistentZone = null;
    drawFog(null);
    if (activeZone) {
      _persistentZone = activeZone;
      drawFog(activeZone, true);
    }

    const container = document.getElementById('quest-route-container');
    if (container) {
      container.style.cssText = 'clip-path:inset(0 100% 0 0);transition:none;';
      setTimeout(() => {
        container.style.cssText = 'clip-path:inset(0 0 0 0);transition:clip-path 0.9s cubic-bezier(0.22,1,0.36,1);';
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  }, 500);
}

// ── Init principale ──
function init() {
  if (!window.__neoData) { setTimeout(init, 50); return; }
  const data = window.__neoData;
  matiereData = data.matieres.find(m => m.id === matiereId);
  if (!matiereData) { window.location.href = 'index_hidden.html'; return; }

  couleur = matiereData.couleur || '#a855f7';
  document.documentElement.style.setProperty('--accent', couleur);
  document.querySelector('.blob-1').style.background = couleur + '22';
  document.title = `NeoQuest — ${matiereData.nom_royaume || matiereData.nom}`;

  const bannerEl = document.getElementById('kingdom-banner-img');
  const bannerImg = {'histoire-geo':'img/HistoryaBannerShort.png'}[matiereId];
  bannerEl.style.backgroundImage = bannerImg ? `url('${bannerImg}')` : 'none';
  if (!bannerImg) bannerEl.style.background = `linear-gradient(135deg,${couleur}33 0%,#08061a 100%)`;

  document.getElementById('bc-royaume').textContent = matiereData.nom_royaume || matiereData.nom;
  document.getElementById('kingdom-name').textContent = matiereData.nom_royaume || matiereData.nom;
  document.getElementById('kingdom-tagline').textContent = matiereData.tagline || '';
  document.getElementById('sticky-kingdom-name').textContent = matiereData.nom_royaume || matiereData.nom;
}
init();

// ── Constantes de configuration ──
var PROVINCE_MAPS = {
  '5eme': 'img/Hist5Map.png',
};

var NEO_PROVINCE_IMGS = {};
var BANNER_IMGS  = { 'histoire-geo':'img/HistoryaBannerShort.png' };
var NEO_MAT_IMGS = { 'histoire-geo':'img/Neo_assis.png' };

(function(){
  const data = window.__neoData;
  if (!data || !data.matieres) { console.warn('data.js non chargé'); return; }
  matiereData = data.matieres.find(m => m.id === matiereId);
  if (!matiereData) { window.location.href = 'index_hidden.html'; return; }

  couleur = matiereData.couleur || '#a855f7';
  document.documentElement.style.setProperty('--accent', couleur);
  document.querySelector('.blob-1').style.background = couleur + '22';
  document.title = `NeoQuest — ${matiereData.nom_royaume || matiereData.nom}`;

  const bannerImg = BANNER_IMGS[matiereId];
  const bannerEl = document.getElementById('kingdom-banner-img');
  bannerEl.style.backgroundImage = bannerImg ? `url('${bannerImg}')` : 'none';
  if (!bannerImg) bannerEl.style.background = `linear-gradient(135deg,${couleur}33 0%,#08061a 100%)`;

  document.getElementById('bc-royaume').textContent = matiereData.nom_royaume || matiereData.nom;
  document.getElementById('kingdom-name').textContent = matiereData.nom_royaume || matiereData.nom;
  document.getElementById('kingdom-tagline').textContent = matiereData.tagline || '';
  document.getElementById('sticky-kingdom-name').textContent = matiereData.nom_royaume || matiereData.nom;

  const neoSrc = NEO_MAT_IMGS[matiereId];
  const neoImg = document.getElementById('kingdom-neo');
  if (neoSrc && neoImg) neoImg.src = neoSrc;

  if (!matiereData.niveaux || matiereData.niveaux.length === 0) {
    document.getElementById('empty-state').style.display = 'block';
    return;
  }

  const globeImg = document.getElementById('globe-img');
  if (globeImg) {
    globeImg.addEventListener('load', placeFresnel);
    if (globeImg.complete) placeFresnel();
    window.addEventListener('resize', placeFresnel);
    setTimeout(placeFresnel, 300);
  }
})();

function getStatut(id) {
  try {
    const d = JSON.parse(localStorage.getItem(`neoquest_chap_${id}`) || 'null');
    if (!d) return 'not-started';
    if (d.pts >= 200) return 'mastered';
    if (d.pts > 0 || d.quizDone > 0) return 'in-progress';
    return 'not-started';
  } catch { return 'not-started'; }
}

function getPts(id) {
  try { return JSON.parse(localStorage.getItem(`neoquest_chap_${id}`) || '{}').pts || 0; } catch { return 0; }
}

var QUEST_PIONS = {
  'heritage-aigles':  'img/dome.png',
  'souffle-desert':   'img/croissant.png',
  'savoirs-bagdad':   'img/livre.png',
  'ordre-seigneurial':'img/moulin.png',
  'emergence-villes': 'img/befroi.png',
  'etat-monarchique': 'img/bouclierroi.png',
  'duel-titans':      'img/galeres.png',
  'esprit-lumieres':  'img/presse.png',
  'sacre-neo':        'img/portailroi.png',
};

var MAP_NODE_POSITIONS = {
  '5eme': [
    [ 7.0, 50.2],
    [18.9, 62.0],
    [10.6, 88.7],
    [53.2, 81.4],
    [44.6, 58.2],
    [60.9, 43.8],
    [71.1, 36.5],
    [73.3, 66.5],
    [85.5, 55.6],
  ],
  default: [
    [20, 75], [35, 60], [20, 45],
    [50, 75], [50, 55], [50, 35],
    [80, 45], [80, 62], [80, 78],
  ]
};

var REGION_BOUNDARIES = {
  '5eme': [
    { xMin: 0,  xMax: 33, nom: 'Le Choc des Empires',  couleur: '#f97316' },
    { xMin: 33, xMax: 66, nom: "L'Âge des Seigneurs",  couleur: '#a855f7' },
    { xMin: 66, xMax: 100,nom: 'Le Nouveau Monde',     couleur: '#22c55e' },
  ]
};

// ── État sélection quête (pour refresh après activité) ──
var _selectedChapId = null, _selectedNiveauId = null;

function launchSOSQuiz() {
  if (!currentNiveau) return;
  const active = currentNiveau.themes?.flatMap(t=>t.chapitres).filter(ch =>
    localStorage.getItem(`neoquest_chap_${ch.id}`) && (ch.quiz?.length||0) > 0
  ) || [];
  if (active.length === 0) { alert('Complète au moins une quête pour débloquer le SOS Contrôle !'); return; }
  if (typeof window.openQuestActivity === 'function') {
    window.openQuestActivity(active[0], currentNiveau, matiereData, 'quiz');
  }
}

// ── Refresh du panneau après complétion d'une activité ──
window.addEventListener('questActivityCompleted', (e) => {
  if (!currentNiveau) return;
  const chapId = _selectedChapId;
  renderProvince(currentNiveau, document.documentElement.style.getPropertyValue('--accent') || couleur);
  if (chapId) {
    setTimeout(() => {
      const nodes = document.querySelectorAll('[data-idx]');
      const allChaps = currentNiveau.themes?.flatMap(t => t.chapitres) || [];
      const idx = allChaps.findIndex(c => c.id === chapId);
      if (idx >= 0 && nodes[idx]) nodes[idx].click();
    }, 50);
  }
});
