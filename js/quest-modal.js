// Modale de quête — core
// Expose : window.openQuestActivity(chap, niveau, mat, tab), window.closeQuestActivity()
// Déclenche : window.addEventListener('questActivityCompleted', e => { e.detail = {chapId, type} })

// ── Variables partagées (var = global dans scripts classiques) ──
var currentChap = null, currentNiveau = null, currentMat = null;
var chapitreId = null, matiereId = null;
var DIFF_LABELS = {facile:'⭐ Facile', medium:'🔥 Medium', hard:'💀 Hard'};
var DIFF_POINTS = {facile:10, medium:30, hard:50};
var DIFF_CLASS  = {facile:'diff-facile', medium:'diff-medium', hard:'diff-hard'};
var QUIZ_SIZE   = 12;
var FC_SIZE     = 10;

// ── Audio ──
function getAudio() { return window.nqAudio ? window.nqAudio.get() : new (window.AudioContext||window.webkitAudioContext)(); }
function playTone(freq, type, duration, volume=0.18, delay=0) {
  try { const ctx=getAudio(),o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
    o.type=type; o.frequency.value=freq; const t=ctx.currentTime+delay;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(volume,t+0.02); g.gain.exponentialRampToValueAtTime(0.001,t+duration);
    o.start(t); o.stop(t+duration); } catch(e) {}
}
function soundCorrect() { playTone(523,'sine',0.12,0.15); playTone(659,'sine',0.12,0.15,0.1); playTone(784,'sine',0.18,0.15,0.2); }
function soundWrong()   { playTone(220,'sawtooth',0.18,0.12); playTone(180,'sawtooth',0.22,0.12,0.15); }
function soundFlip()    { try { const ctx=getAudio(),o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination);
  o.type='sine'; o.frequency.setValueAtTime(600,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(300,ctx.currentTime+0.12);
  g.gain.setValueAtTime(0.08,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
  o.start(); o.stop(ctx.currentTime+0.18); } catch(e) {} }

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

// ── LocalStorage ──
function getProgress() { try { return JSON.parse(localStorage.getItem('neoquest_progress') || '{}'); } catch { return {}; } }
function saveProgress(p) { try { localStorage.setItem('neoquest_progress', JSON.stringify(p)); } catch {} }

function addPts(n) {
  const p = getProgress();
  const prev = p.totalPts || 0;
  p.totalPts = prev + n;
  saveProgress(p);
  try {
    const key = `neoquest_chap_${chapitreId}`;
    const chd = JSON.parse(localStorage.getItem(key) || '{}');
    chd.pts = (chd.pts || 0) + n;
    chd.quizDone = (chd.quizDone || 0) + 1;
    localStorage.setItem(key, JSON.stringify(chd));
  } catch(e) {}
  if (typeof nqCheckLevelUp === 'function') nqCheckLevelUp(prev, p.totalPts);
  try {
    const xp2 = p.totalPts;
    const lvl2 = nqGetLevel(xp2);
    const pct2 = nqGetLevelProgress(xp2);
    const badge = document.getElementById('nav-level-badge');
    if (badge) { badge.textContent = lvl2.level; badge.style.background = lvl2.color; }
    const bar = document.getElementById('nav-xp-bar');
    if (bar) { bar.style.width = pct2 + '%'; bar.style.background = lvl2.color; }
    const title = document.getElementById('nav-level-title');
    if (title) { title.textContent = lvl2.title; title.style.color = lvl2.color; }
  } catch(e) {}
}

var GOLD_PER_ECLAT = 10;

function addGold(n) {
  if (!n || n <= 0) return;
  const p = getProgress();
  p.totalGold = (p.totalGold || 0) + n;
  saveProgress(p);
  if (typeof nqRefreshGoldDisplay === 'function') nqRefreshGoldDisplay();
}
window.addGold = addGold;

function getWeakQuestions() { try { return JSON.parse(localStorage.getItem('neoquest_weak')||'{}'); } catch { return {}; } }
function recordResult(q,ok) { const w=getWeakQuestions(); if(!ok) w[q]=(w[q]||0)+1; else if(w[q]) w[q]=Math.max(0,w[q]-1); try { localStorage.setItem('neoquest_weak',JSON.stringify(w)); } catch {} }
function weightedShuffle(questions) { const weak=getWeakQuestions(),pool=[]; questions.forEach(q=>{const weight=1+(weak[q.question]||0)*2;for(let i=0;i<weight;i++)pool.push(q);}); return shuffle(pool); }

function getFCWeak() { try { return JSON.parse(localStorage.getItem('neoquest_fc_weak')||'{}'); } catch { return {}; } }
function saveFCWeak(w) { try { localStorage.setItem('neoquest_fc_weak',JSON.stringify(w)); } catch {} }
function markFCRevoir(q) { const w=getFCWeak(); w[q]=(w[q]||0)+1; saveFCWeak(w); }
function markFCAcquis(q) { const w=getFCWeak(); delete w[q]; saveFCWeak(w); }

// ── Cartes acquises au moins une fois (par chapitre) — pour la jauge X/total + bonus de maîtrise ──
function _fcMasteredKey(chapId) { return `neoquest_fc_mastered_${chapId}`; }
function getFCMasteredSet(chapId) {
  try { return new Set(JSON.parse(localStorage.getItem(_fcMasteredKey(chapId))||'[]')); }
  catch { return new Set(); }
}
function addFCMastered(chapId, question) {
  if (!chapId || !question) return;
  const s = getFCMasteredSet(chapId);
  if (s.has(question)) return;
  s.add(question);
  try { localStorage.setItem(_fcMasteredKey(chapId), JSON.stringify([...s])); } catch {}
}
function getFCMasteredCount(chapId) { return getFCMasteredSet(chapId).size; }

// ── Éclats (lanterne max 15) ──
var ECLAT_MAX = 15;
function getEclats(chapId)    { return parseInt(localStorage.getItem('neoquest_lantern_' + chapId) || '0'); }
function setEclats(chapId, n) { try { localStorage.setItem('neoquest_lantern_' + chapId, String(n)); } catch(e) {} }

function addEclats(chapId, amount) {
  setEclats(chapId, Math.min(ECLAT_MAX, getEclats(chapId) + amount));
}

function consumeEclatForQuiz(chapId) {
  const n = getEclats(chapId);
  if (n > 0) { setEclats(chapId, n - 1); return 'eclat'; }
  return 'caillou';
}

function renderEclatCounter(elId, chapId) {
  const el = document.getElementById(elId);
  if (el) el.textContent = `🔆 ${getEclats(chapId)}/15`;
}

// ── Thème custom par chapitre ──
function applyChapterTheme(chap) {
  if (chap.diff_custom) {
    DIFF_LABELS = {facile:'⭐'+(chap.diff_custom.facile||'Facile'), medium:'🔥'+(chap.diff_custom.medium||'Medium'), hard:'💀'+(chap.diff_custom.hard||'Hard')};
  } else {
    DIFF_LABELS = {facile:'⭐ Facile', medium:'🔥 Medium', hard:'💀 Hard'};
  }
}

// ── API publique ──
function openQuestActivity(chap, niveau, mat, tab) {
  currentChap = chap;
  currentNiveau = niveau;
  currentMat = mat;
  chapitreId = chap.id;
  matiereId = mat?.id || null;

  applyChapterTheme(chap);

  if (tab === 'video') {
    try { localStorage.setItem(`neoquest_video_${chapitreId}`, '1'); } catch(e) {}
    openVideoModal(chap, mat);
  } else if (tab === 'flashcards') {
    initFlashcards(chap.flashcards || []);
    attachFCDragOnce();
    document.getElementById('qa-modal-fc').classList.add('active');
    document.body.style.overflow = 'hidden';
  } else if (tab === 'quiz') {
    initQuiz(chap.quiz || [], chap);
    document.getElementById('qa-modal-quiz').classList.add('active');
    document.body.style.overflow = 'hidden';
  } else if (tab === 'chrono') {
    // Mode Défi (speedrun). Tant que le quiz refactor n'expose pas la liste des
    // questions "non vues", on tire dans tout chap.quiz.
    if (typeof initChrono === 'function') {
      initChrono(chap.quiz || []);
      document.getElementById('qa-modal-chrono').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}

function closeQuestActivity() {
  document.getElementById('qa-modal-video').classList.remove('active');
  document.getElementById('qa-modal-fc').classList.remove('active');
  document.getElementById('qa-modal-quiz').classList.remove('active');
  const chronoEl = document.getElementById('qa-modal-chrono');
  if (chronoEl) chronoEl.classList.remove('active');
  if (typeof window.chronoStop === 'function') window.chronoStop();
  if (typeof window.stopQuestVideo === 'function') {
    window.stopQuestVideo();
  } else {
    const frame = document.getElementById('qa-yt-frame');
    if (frame) frame.src = '';
  }
  if (typeof window.resetLantern === 'function') window.resetLantern();
  // Mentor combat : on cache la bulle (l'orbe reste monté, ré-utilisé au prochain combat)
  if (typeof window.mentorHide === 'function') window.mentorHide();
  // Neo reste monté (singleton) — on coupe juste sa bulle / idle / expression
  if (typeof window.neoReset === 'function') window.neoReset();
  document.body.style.overflow = '';
  if (chapitreId) {
    window.dispatchEvent(new CustomEvent('questActivityCompleted', { detail: { chapId: chapitreId, type: 'close' } }));
  }
}

// Fermeture uniquement via la croix (.qa-close) ou Escape.
// Pas de close par clic-sur-overlay : Neo sit dessus (position:fixed) et les
// "ratés" de clic sur Neo fermaient la modale par accident.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.querySelector('.qa-overlay.active')) {
    closeQuestActivity();
  }
});

window.openQuestActivity  = openQuestActivity;
window.closeQuestActivity = closeQuestActivity;
