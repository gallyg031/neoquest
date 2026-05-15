// ── Mode Défi / TV Show "Questions pour un Champion" — Logique ──
// Dépend de quest-modal.js : currentChap, currentMat, chapitreId, addGold,
// soundCorrect, soundWrong, playTone, getProgress, saveProgress, shuffle.
//
// Mécaniques :
// - Speedrun 60s, pas de pénalité de temps
// - Bonne réponse : palier +1, streak +1, points += palier × (1 + streak × 0.2)
// - Mauvaise réponse : palier = 0, streak = 0, score conservé
// - Jauge thermomètre verticale graduée jusqu'à nb total de questions
// - Final : count-up dramatique 3.5s, confettis, dings montants
//
// Assets attendus :
// - img/presenter-{chapId}.png — boss-présentateur du chapitre (PNG transparent)
// - img/Neo_assis.png — déjà présent
// - wav/Music{Royaume}.mp3 — musique épique de fond (ex: wav/MusicHistorya.mp3)
//
// API publique : initChrono(questions), chronoStart(), chronoRestart(), chronoStop().

var CHRONO_DURATION    = 60;     // secondes
var CHRONO_STREAK_PCT  = 0.20;   // bonus de score par niveau de streak
var CHRONO_GOLD_RATIO  = 5;      // 1 or pour 5 points de prestige
var CHRONO_XP_PER_HIT  = 5;      // XP gagnée par bonne réponse
var CHRONO_COUNTUP_MS  = 3500;   // durée animation finale du score

var chronoState = {
  pool: [],
  idx: 0,
  timeLeft: CHRONO_DURATION,
  score: 0,
  count: 0,
  streak: 0,
  palier: 0,
  maxPalier: 0,
  maxStreak: 0,
  poolSize: 0,            // taille du stock (pour le max de la jauge)
  answered: false,
  running: false,
  timerId: null,
  countupRaf: null,
  countdownTimeout: null, // 3-2-1-GO en cours
  typewriterTimeout: null,// typewriter de la bulle en cours
  currentQ: null,         // question affichée actuellement
  presenterImgs: { neutre:null, happy:null, sad:null },
  presenterRevertTimeout: null,
};

// ─────────────────── Mute ───────────────────
function isChronoMuted() {
  try { return localStorage.getItem('neoquest_chrono_muted') === '1'; } catch { return false; }
}
function chronoToggleMute() {
  const next = !isChronoMuted();
  try { localStorage.setItem('neoquest_chrono_muted', next ? '1' : '0'); } catch(e) {}
  applyMuteState();
}
function applyMuteState() {
  const muted = isChronoMuted();
  const btn = document.getElementById('qa-chrono-mute');
  const audio = document.getElementById('qa-chrono-music');
  if (btn) { btn.textContent = muted ? '🔇' : '🔊'; btn.classList.toggle('muted', muted); }
  if (audio) audio.muted = muted;
}
// Wrapper : tous les sons générés par playTone respectent le mute
function chronoTone(freq, type, dur, vol, delay) {
  if (isChronoMuted() || typeof playTone !== 'function') return;
  playTone(freq, type, dur, vol, delay);
}
window.chronoToggleMute = chronoToggleMute;

// ─────────────────── Cycle de vie ───────────────────

function initChrono(questions, opts) {
  opts = opts || {};
  chronoStop();
  cancelTypewriter();
  // Garde le cache d'images du présentateur si on relance la même partie
  const presenterCache = (opts.quickStart && chronoState.presenterImgs)
    ? chronoState.presenterImgs
    : { neutre:null, happy:null, sad:null };

  const pool = shuffle(questions || []);
  chronoState = {
    pool,
    idx: 0,
    timeLeft: CHRONO_DURATION,
    score: 0,
    count: 0,
    streak: 0,
    palier: 0,
    maxPalier: 0,
    maxStreak: 0,
    poolSize: pool.length || 1,
    answered: false,
    running: false,
    timerId: null,
    countupRaf: null,
    countdownTimeout: null,
    typewriterTimeout: null,
    currentQ: null,
    presenterImgs: presenterCache,
    presenterRevertTimeout: null,
  };

  const introEl = document.getElementById('qa-chrono-intro');
  const gameEl  = document.getElementById('qa-chrono-game');
  document.getElementById('qa-chrono-final').classList.remove('visible');

  if (opts.quickStart) {
    // Restart rapide : on saute la scène d'intro, le 3-2-1 démarre direct
    introEl.classList.add('hidden');
    gameEl.classList.remove('hidden');
  } else {
    // Démarrage normal : intro avec animations Neo + Boss rejouées
    introEl.classList.remove('hidden', 'play');
    void introEl.offsetWidth;
    introEl.classList.add('play');
    gameEl.classList.add('hidden');
  }

  // Reset HUD
  const clockEl = document.getElementById('qa-chrono-clock');
  if (clockEl) {
    clockEl.classList.remove('danger');
    clockEl.style.setProperty('--progress', 100);
  }
  document.getElementById('qa-chrono-timer').textContent    = CHRONO_DURATION;
  document.getElementById('qa-chrono-bulb-num').textContent = '0';

  // Présentateur / fond / musique — pas la peine de re-setup si quickStart
  if (!opts.quickStart) {
    setupPresenterSprite();
    setupArenaBackground();
    setupChronoMusic();
  }
  document.getElementById('qa-chrono-bubble').textContent = '';

  // Segments du thermomètre selon la taille du pool (1 segment = 1 palier)
  buildThermoSegments(chronoState.poolSize);

  // Record perso à battre (affiché dans l'intro)
  updateIntroRecord();

  // État mute (UI + audio)
  applyMuteState();
}

// Met à jour le badge "record à battre" dans l'intro
function updateIntroRecord() {
  const wrap  = document.getElementById('qa-chrono-intro-record');
  const valEl = document.getElementById('qa-chrono-intro-record-val');
  const subEl = document.getElementById('qa-chrono-intro-record-sub');
  if (!wrap || !valEl) return;
  const best = getBestPrestige();
  if (best.prestige > 0) {
    valEl.textContent = best.prestige;
    if (subEl) subEl.textContent = best.palier ? `· palier ${best.palier}` : '';
    wrap.style.display = '';
  } else {
    wrap.style.display = 'none';
  }
}

function chronoStart() {
  if (chronoState.running) return;
  if (!chronoState.pool.length) return;
  document.getElementById('qa-chrono-intro').classList.add('hidden');
  document.getElementById('qa-chrono-game').classList.remove('hidden');
  runChronoCountdown(_chronoBegin);
}

// 3-2-1-GO ! Lance ensuite le vrai timer + 1ère question.
function runChronoCountdown(done) {
  const cd  = document.getElementById('qa-chrono-countdown');
  const num = document.getElementById('qa-chrono-countdown-num');
  cd.classList.remove('hidden');
  const sequence = ['3', '2', '1', 'GO !'];
  let i = 0;
  function step() {
    if (i >= sequence.length) {
      cd.classList.add('hidden');
      chronoState.countdownTimeout = null;
      done();
      return;
    }
    const isGo = i === sequence.length - 1;
    num.textContent = sequence[i];
    num.classList.toggle('go', isGo);
    // Reset animation
    num.style.animation = 'none';
    void num.offsetWidth;
    num.style.animation = '';
    // Son
    if (typeof playTone === 'function') {
      if (isGo) {
        playTone(660, 'sine', 0.40, 0.22, 0);
        playTone(880, 'sine', 0.40, 0.18, 0.08);
      } else {
        playTone(440 + i * 90, 'sine', 0.20, 0.16, 0);
      }
    }
    i++;
    chronoState.countdownTimeout = setTimeout(step, isGo ? 650 : 800);
  }
  step();
}

function _chronoBegin() {
  chronoState.running = true;
  chronoState.timerId = setInterval(chronoTick, 1000);
  playChronoMusic();
  pickChronoQuestion();
}

function chronoStop() {
  // Filet : crédite l'or différé si le user ferme sans cliquer "Terminer"
  commitPendingGold();
  if (chronoState.timerId)               { clearInterval(chronoState.timerId);            chronoState.timerId = null; }
  if (chronoState.countupRaf)            { cancelAnimationFrame(chronoState.countupRaf);  chronoState.countupRaf = null; }
  if (chronoState.countdownTimeout)      { clearTimeout(chronoState.countdownTimeout);    chronoState.countdownTimeout = null; }
  if (chronoState.typewriterTimeout)     { clearTimeout(chronoState.typewriterTimeout);   chronoState.typewriterTimeout = null; }
  if (chronoState.presenterRevertTimeout){ clearTimeout(chronoState.presenterRevertTimeout); chronoState.presenterRevertTimeout = null; }
  const cd = document.getElementById('qa-chrono-countdown');
  if (cd) cd.classList.add('hidden');
  chronoState.running = false;
  stopChronoMusic();
}

// Crédite silencieusement l'or différé (utilisé par chronoStop et chronoRestart)
function commitPendingGold() {
  const a = chronoState._pendingGold || 0;
  chronoState._pendingGold = 0;
  if (a > 0 && typeof addGold === 'function') addGold(a);
}

// Restart rapide : on saute la scène cinématique, on relance 3-2-1 direct
function chronoRestart() {
  const questions = chronoState.pool.length
    ? chronoState.pool
    : ((currentChap && currentChap.quiz) || []);
  initChrono(questions, { quickStart: true });
  if (!chronoState.pool.length) return;
  runChronoCountdown(_chronoBegin);
}

// ─────────────────── Timer ───────────────────

function chronoTick() {
  chronoState.timeLeft -= 1;
  if (chronoState.timeLeft <= 0) {
    chronoState.timeLeft = 0;
    updateClockDisplay();
    if (chronoState.timerId) { clearInterval(chronoState.timerId); chronoState.timerId = null; }
    playGongAndEnd();
    return;
  }
  updateClockDisplay();
}

// ─────────────────── Gong final ───────────────────
function playGongAndEnd() {
  stopChronoMusic();
  showGongFlash();
  playGong();
  // Petit délai pour laisser le flash + le gong s'épanouir avant le récap
  setTimeout(chronoEnd, 700);
}
function showGongFlash() {
  const box = document.querySelector('.qa-chrono-box');
  if (!box) return;
  const fl = document.createElement('div');
  fl.className = 'qa-chrono-gong-flash';
  box.appendChild(fl);
  setTimeout(() => fl.remove(), 900);
}
function playGong() {
  // Note grave longue + harmonique octave + quinte aiguë (timbre de gong)
  chronoTone(110, 'sine',     1.4, 0.45, 0);
  chronoTone(220, 'sine',     1.2, 0.30, 0.02);
  chronoTone(330, 'triangle', 0.9, 0.16, 0.05);
}

function updateClockDisplay() {
  const timerEl = document.getElementById('qa-chrono-timer');
  const clockEl = document.getElementById('qa-chrono-clock');
  if (timerEl) timerEl.textContent = chronoState.timeLeft;
  if (clockEl) {
    const pct = Math.max(0, (chronoState.timeLeft / CHRONO_DURATION) * 100);
    clockEl.style.setProperty('--progress', pct);
    if (chronoState.timeLeft <= 10) clockEl.classList.add('danger');
    else clockEl.classList.remove('danger');
  }
}

// ─────────────────── Questions ───────────────────

function pickChronoQuestion() {
  if (chronoState.idx >= chronoState.pool.length) {
    chronoState.pool = shuffle(chronoState.pool);
    chronoState.idx = 0;
  }
  chronoState.answered = false;
  renderChronoQuestion(chronoState.pool[chronoState.idx]);
}

function renderChronoQuestion(q) {
  chronoState.currentQ = q;
  const bubble = document.getElementById('qa-chrono-bubble');
  bubble.classList.remove('pop');
  void bubble.offsetWidth;
  bubble.classList.add('pop');
  typewriteBubble(bubble, q.question, 22);

  const optsEl = document.getElementById('qa-chrono-opts');
  optsEl.innerHTML = '';
  // Format Neoquest : q.choix + q.bonne_reponse, qui peut être un index (number)
  // OU le texte exact de la bonne réponse (string), comme dans quest-quiz.js.
  const originalChoices = q.choix || q.choices || q.options || [];
  const correct = (q.bonne_reponse !== undefined) ? q.bonne_reponse : q.answerIndex;
  // On remonte au texte de la bonne réponse avant de mélanger, comme ça
  // le shuffle ne casse pas le mapping.
  const correctValue = (typeof correct === 'string')
    ? correct
    : originalChoices[Number(correct)];
  const choices = shuffle(originalChoices);
  const correctIdx = choices.indexOf(correctValue);
  choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'chrono-opt';
    btn.textContent = c;
    btn.onclick = () => chronoAnswer(btn, i === correctIdx);
    optsEl.appendChild(btn);
  });
}

function chronoAnswer(btn, isCorrect) {
  if (chronoState.answered || !chronoState.running) return;
  chronoState.answered = true;
  document.querySelectorAll('.chrono-opt').forEach(b => b.disabled = true);

  // Si on répond avant la fin du typewriter, on stoppe et on révèle la question
  cancelTypewriter();
  if (chronoState.currentQ) {
    document.getElementById('qa-chrono-bubble').textContent = chronoState.currentQ.question;
  }

  const prevPalier = chronoState.palier;

  if (isCorrect) {
    btn.classList.add('correct');
    chronoState.streak  += 1;
    chronoState.palier  += 1;
    chronoState.count   += 1;
    if (chronoState.streak  > chronoState.maxStreak)  chronoState.maxStreak  = chronoState.streak;
    if (chronoState.palier  > chronoState.maxPalier)  chronoState.maxPalier  = chronoState.palier;
    const pts = Math.round(chronoState.palier * (1 + chronoState.streak * CHRONO_STREAK_PCT));
    chronoState.score += pts;

    if (!isChronoMuted() && typeof soundCorrect === 'function') soundCorrect();
    palierDing(chronoState.palier);
    pulseBulb();
    flameNeo();
    showPointsPop(btn, '+' + pts, true);
    applyPresenterState('happy');
  } else {
    btn.classList.add('wrong');
    if (!isChronoMuted() && typeof soundWrong === 'function') soundWrong();
    chronoState.streak = 0;
    chronoState.palier = 0;
    shakeThermo();
    showPointsPop(btn, '−palier', false);
    applyPresenterState('sad');
  }

  refreshHud(prevPalier);

  setTimeout(() => {
    if (!chronoState.running) return;
    applyPresenterState('neutre');
    chronoState.idx += 1;
    pickChronoQuestion();
  }, 400);
}

// ─────────────────── Typewriter (bulle question) ───────────────────
function typewriteBubble(el, text, charDelay) {
  cancelTypewriter();
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i >= text.length) { chronoState.typewriterTimeout = null; return; }
    el.textContent += text.charAt(i++);
    // petit "tick" silencieux toutes les 3 lettres pour le feeling
    if (i % 4 === 0) chronoTone(820 + Math.random() * 80, 'square', 0.025, 0.04);
    chronoState.typewriterTimeout = setTimeout(tick, charDelay);
  }
  tick();
}
function cancelTypewriter() {
  if (chronoState.typewriterTimeout) {
    clearTimeout(chronoState.typewriterTimeout);
    chronoState.typewriterTimeout = null;
  }
}

function refreshHud(prevPalier) {
  // Score, count et streak ne sont plus affichés en cours de partie (révélés en
  // fin de partie). Seuls le bulbe et les segments du thermomètre sont MAJ ici.
  document.getElementById('qa-chrono-bulb-num').textContent = chronoState.palier;
  applyPalierToSegments(chronoState.palier, prevPalier || 0);
}

// ─────────────────── Effets visuels & audio ───────────────────

function pulseBulb() {
  const b = document.querySelector('.qa-chrono-thermo-bulb');
  if (!b) return;
  b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
}

function shakeThermo() {
  const t = document.getElementById('qa-chrono-thermo');
  t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake');
}

function flameNeo() {
  const n = document.getElementById('qa-chrono-neo');
  n.classList.remove('flame'); void n.offsetWidth; n.classList.add('flame');
}

function showPointsPop(anchorBtn, text, positive) {
  const parent = anchorBtn.closest('.qa-chrono-box');
  if (!parent) return;
  const rect  = anchorBtn.getBoundingClientRect();
  const prect = parent.getBoundingClientRect();
  const pop = document.createElement('div');
  pop.className = 'chrono-points-pop ' + (positive ? 'pos' : 'neg');
  pop.textContent = text;
  pop.style.left = (rect.left - prect.left + rect.width / 2 - 28) + 'px';
  pop.style.top  = (rect.top  - prect.top  - 8) + 'px';
  parent.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

// Ding montant à chaque palier (fréquence ~ palier)
function palierDing(palier) {
  if (isChronoMuted() || typeof playTone !== 'function') return;
  const freq = 440 * Math.pow(1.0595, Math.min(palier - 1, 24)); // demi-ton par palier
  chronoTone(freq, 'sine', 0.22, 0.18, 0);
  chronoTone(freq * 1.5, 'sine', 0.18, 0.12, 0.05);
}

// ─────────────────── Thermomètre — segments ───────────────────

// 1 segment = 1 palier. Si pool trop petit, on garde un minimum visuel de 5.
function buildThermoSegments(total) {
  const tube = document.getElementById('qa-chrono-thermo-tube');
  if (!tube) return;
  tube.innerHTML = '';
  const count = Math.max(5, total);
  for (let i = 0; i < count; i++) {
    const seg = document.createElement('div');
    seg.className = 'thermo-seg';
    // Couleur qui chauffe avec la hauteur — jaune → orange → rouge
    const heat = count > 1 ? i / (count - 1) : 0;
    const c1 = lerpColor([253,224,71], [254,116,46], Math.min(1, heat * 1.4));
    const c2 = lerpColor([251,146,60], [220,38,38],  heat);
    seg.style.setProperty('--seg-color-1', `rgb(${c1.join(',')})`);
    seg.style.setProperty('--seg-color-2', `rgb(${c2.join(',')})`);
    seg.style.setProperty('--seg-glow',    `rgba(${c2.join(',')},0.7)`);
    tube.appendChild(seg);
  }
}

function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// Allume/éteint les segments selon le palier. Flash le segment nouvellement
// allumé. Cascade fade-out si on retombe à 0.
function applyPalierToSegments(palier, prevPalier) {
  const segs = document.querySelectorAll('#qa-chrono-thermo-tube .thermo-seg');
  if (!segs.length) return;
  const target = Math.min(palier, segs.length);

  // Retour à 0 : cascade fade rouge → off
  if (palier === 0 && prevPalier > 0) {
    segs.forEach((s, i) => {
      if (!s.classList.contains('lit')) return;
      s.classList.remove('flash');
      s.classList.add('dying');
      setTimeout(() => { s.classList.remove('lit','dying'); }, 350);
    });
    return;
  }

  // Montée normale : on s'assure que tous les segments ≤ palier sont allumés
  segs.forEach((s, i) => {
    if (i < target) s.classList.add('lit');
    else s.classList.remove('lit');
    s.classList.remove('dying');
  });

  // Flash sur le palier nouvellement gagné
  if (palier > prevPalier && palier > 0 && target <= segs.length) {
    const top = segs[target - 1];
    if (top) {
      top.classList.remove('flash');
      void top.offsetWidth;
      top.classList.add('flash');
    }
  }
}

// ─────────────────── Présentateur ───────────────────

// Charge l'image de fond de l'arène selon le royaume (currentMat.id).
// Convention : img/arena-{royaume}.png  (ex. img/arena-historya.png)
// Si l'image n'existe pas encore, on retombe sur le gradient sombre du CSS.
function setupArenaBackground() {
  const box = document.querySelector('.qa-chrono-box');
  if (!box) return;
  box.style.removeProperty('--arena-bg');
  const matId = (currentMat && currentMat.id) || '';
  if (!matId) return;
  const src = `img/arena-${matId}.png`;
  const probe = new Image();
  probe.onload  = () => box.style.setProperty('--arena-bg', `url("${src}")`);
  probe.onerror = () => box.style.removeProperty('--arena-bg');
  probe.src = src;
}

// ─────────────────── Présentateur réactif (3 poses) ───────────────────
// Convention assets :
//   img/presenter-{chapId}.png       — pose neutre (par défaut)
//   img/presenter-{chapId}-happy.png — sur bonne réponse
//   img/presenter-{chapId}-sad.png   — sur mauvaise réponse
// Toute pose absente est simplement ignorée (fallback sur neutre).
function setupPresenterSprite() {
  // Reset caches + DOM
  chronoState.presenterImgs = { neutre:null, happy:null, sad:null };
  const gameWrap  = document.getElementById('qa-chrono-presenter-sprite');
  const introWrap = document.getElementById('qa-chrono-arena-presenter');
  [gameWrap, introWrap].forEach(w => {
    if (!w) return;
    Array.from(w.querySelectorAll('img')).forEach(n => n.remove());
  });
  if (gameWrap)  gameWrap.classList.add('placeholder');
  if (introWrap) introWrap.classList.remove('has-img');

  const chapId = chapitreId || (currentChap && currentChap.id);
  if (!chapId) return;

  const variants = {
    neutre: `img/presenter-${chapId}.png`,
    happy:  `img/presenter-${chapId}-happy.png`,
    sad:    `img/presenter-${chapId}-sad.png`,
  };
  Object.entries(variants).forEach(([state, src]) => {
    const probe = new Image();
    probe.onload = () => {
      chronoState.presenterImgs[state] = src;
      if (state === 'neutre') applyPresenterState('neutre');
    };
    // onerror : on laisse simplement la variante absente
    probe.src = src;
  });
}

// Applique une pose (neutre/happy/sad) sur les 2 emplacements (intro + HUD jeu)
function applyPresenterState(state) {
  if (chronoState.presenterRevertTimeout) {
    clearTimeout(chronoState.presenterRevertTimeout);
    chronoState.presenterRevertTimeout = null;
  }
  const src = chronoState.presenterImgs[state] || chronoState.presenterImgs.neutre;
  if (!src) return;
  ['qa-chrono-presenter-sprite', 'qa-chrono-arena-presenter'].forEach(id => {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    let img = wrap.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = 'Présentateur';
      wrap.appendChild(img);
    }
    if (img.src !== src) img.src = src;
    if (id === 'qa-chrono-arena-presenter') wrap.classList.add('has-img');
    if (id === 'qa-chrono-presenter-sprite') wrap.classList.remove('placeholder');
  });
  // Auto-revert vers neutre après une réaction (mais pas si on demande neutre)
  if (state !== 'neutre') {
    chronoState.presenterRevertTimeout = setTimeout(
      () => applyPresenterState('neutre'),
      900
    );
  }
}

// ─────────────────── Musique épique ───────────────────

function setupChronoMusic() {
  const audio = document.getElementById('qa-chrono-music');
  if (!audio) return;
  const matId = (currentMat && currentMat.id) || '';
  if (!matId) { audio.removeAttribute('src'); return; }
  // Convention : wav/Music{Royaume}.mp3 — ex. wav/MusicHistorya.mp3
  const cap = matId.charAt(0).toUpperCase() + matId.slice(1);
  audio.src = `wav/Music${cap}.mp3`;
  audio.volume = 0.35;
  audio.load();
}

function playChronoMusic() {
  const audio = document.getElementById('qa-chrono-music');
  if (!audio || !audio.src) return;
  try { audio.currentTime = 0; audio.play().catch(()=>{}); } catch(e) {}
}

function stopChronoMusic() {
  const audio = document.getElementById('qa-chrono-music');
  if (!audio) return;
  try { audio.pause(); audio.currentTime = 0; } catch(e) {}
}

// ─────────────────── Fin de partie ───────────────────

function chronoEnd() {
  if (chronoState.timerId) { clearInterval(chronoState.timerId); chronoState.timerId = null; }
  chronoState.running = false;
  stopChronoMusic();

  const prestige  = chronoState.score;
  const goldBonus = Math.round(prestige / CHRONO_GOLD_RATIO);
  const xpGain    = chronoState.count * CHRONO_XP_PER_HIT;
  const previousBest = getBestPrestige();
  const isNewRecord  = prestige > previousBest.prestige && prestige > 0;
  saveChronoRun(prestige, chronoState.maxStreak, chronoState.maxPalier, chronoState.count);

  // XP : commitée tout de suite (le badge de niveau de la nav doit se MAJ)
  if (xpGain > 0 && typeof addPts === 'function') addPts(xpGain);

  // Or : DIFFÉRÉ à "Terminer" pour que les pièces volent visuellement vers la bourse
  chronoState._pendingGold = goldBonus;

  document.getElementById('qa-chrono-game').classList.add('hidden');
  document.getElementById('qa-chrono-final').classList.add('visible');

  // Banner "Nouveau Record !" (affiché conditionnellement)
  const banner = document.getElementById('qa-chrono-record-banner');
  if (banner) banner.style.display = isNewRecord ? '' : 'none';

  // Reset les compteurs à 0 (les valeurs vont count-up depuis 0)
  document.getElementById('qa-chrono-final-count').textContent  = '0';
  document.getElementById('qa-chrono-final-palier').textContent = '0';
  document.getElementById('qa-chrono-final-xp').textContent     = '0';
  document.getElementById('qa-chrono-final-gold').textContent   = '0';

  // Count-up staggered : bonnes → palier → XP → or, le tout en parallèle du score géant
  animateStatCountUp('qa-chrono-final-count',  chronoState.count,     900,  450);
  animateStatCountUp('qa-chrono-final-palier', chronoState.maxPalier, 1000, 800);
  animateStatCountUp('qa-chrono-final-xp',     xpGain,                1100, 1150);
  animateStatCountUp('qa-chrono-final-gold',   goldBonus,             1300, 1500);

  const subEl = document.getElementById('qa-chrono-final-sub');
  if (isNewRecord) {
    subEl.innerHTML = `Tu pulvérises ton ancien record de <strong>${previousBest.prestige}</strong> pts !`;
  } else if (previousBest.prestige > 0) {
    subEl.innerHTML = `Record perso : <strong>${previousBest.prestige}</strong> pts · palier <strong>${previousBest.palier || 0}</strong>`;
  } else {
    subEl.textContent = '';
  }

  // Confettis + count-up score géant
  spawnConfetti();
  animateScoreCountUp(prestige);

  // Fanfare spéciale si nouveau record (jouée après le gong, délai 400ms)
  if (isNewRecord) setTimeout(playRecordFanfare, 400);
}

// Fanfare montante (do-mi-sol-do + sparkle) sur nouveau record perso
function playRecordFanfare() {
  if (isChronoMuted() || typeof playTone !== 'function') return;
  chronoTone(523,  'sine',     0.16, 0.22, 0);     // C5
  chronoTone(659,  'sine',     0.16, 0.22, 0.12);  // E5
  chronoTone(784,  'sine',     0.20, 0.22, 0.24);  // G5
  chronoTone(1047, 'sine',     0.50, 0.25, 0.38);  // C6 (climax)
  chronoTone(1568, 'triangle', 0.35, 0.16, 0.58);  // G6 sparkle
}

// "Terminer" : crédite l'or différé via une volée de pièces vers la bourse, puis ferme
function chronoFinish() {
  const amount = chronoState._pendingGold || 0;
  chronoState._pendingGold = 0; // évite double-commit via chronoStop
  if (amount <= 0) {
    closeQuestActivity();
    return;
  }
  flyGoldToBourse(amount, () => {
    if (typeof addGold === 'function') addGold(amount);
    bumpGoldBadge();
    setTimeout(closeQuestActivity, 220);
  });
}

// N pièces (cap 16) volent du centre de la modale vers #nq-gold-badge dans la nav
function flyGoldToBourse(amount, onAllDone) {
  const box = document.querySelector('.qa-chrono-box');
  if (!box) { onAllDone && onAllDone(); return; }
  const target  = document.getElementById('nq-gold-badge');
  const boxRect = box.getBoundingClientRect();
  const startX  = boxRect.left + boxRect.width / 2;
  const startY  = boxRect.top  + boxRect.height / 2;
  let targetX = window.innerWidth - 60;
  let targetY = 32;
  if (target) {
    const r = target.getBoundingClientRect();
    targetX = r.left + r.width / 2;
    targetY = r.top  + r.height / 2;
  }
  const count = Math.min(amount, 16);
  let remaining = count;
  const tinkle = () => chronoTone(880 + Math.random() * 240, 'sine', 0.08, 0.06);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const coin = document.createElement('div');
      coin.className = 'qa-chrono-flying-coin';
      coin.textContent = '🪙';
      const jx = (Math.random() - 0.5) * 80;
      const jy = (Math.random() - 0.5) * 40;
      coin.style.left = (startX + jx) + 'px';
      coin.style.top  = (startY + jy) + 'px';
      document.body.appendChild(coin);
      void coin.offsetWidth;
      coin.style.transform = `translate(${targetX - startX - jx}px, ${targetY - startY - jy}px) scale(0.45) rotate(${Math.random()*540 - 270}deg)`;
      coin.style.opacity   = '0';
      tinkle();
      setTimeout(() => {
        coin.remove();
        remaining -= 1;
        if (remaining === 0 && onAllDone) onAllDone();
      }, 950);
    }, i * 65);
  }
}

function bumpGoldBadge() {
  const b = document.getElementById('nq-gold-badge');
  if (!b) return;
  b.classList.remove('nq-gold-bump');
  void b.offsetWidth;
  b.classList.add('nq-gold-bump');
}

// Count-up générique pour une stat (sans son). Stagger via `delayMs`.
function animateStatCountUp(elId, target, durationMs, delayMs) {
  setTimeout(() => {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!target || target <= 0) { el.textContent = '0'; return; }
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }, delayMs || 0);
}

// Count-up dramatique avec ralentissement (easeOutQuart)
function animateScoreCountUp(target) {
  const el = document.getElementById('qa-chrono-final-counter');
  if (target <= 0) { el.textContent = '0'; return; }
  const start = performance.now();
  let lastTickFreq = 0;

  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / CHRONO_COUNTUP_MS);
    const eased = 1 - Math.pow(1 - t, 4);                // easeOutQuart
    const val = Math.round(target * eased);
    el.textContent = val;

    // Tic-tic-tic montant pendant le count-up (rare, sinon ça spamme)
    const stepFreq = 280 + eased * 460;
    if (now - lastTickFreq > 90 && t < 1) {
      if (typeof playTone === 'function') playTone(stepFreq, 'square', 0.04, 0.05);
      lastTickFreq = now;
    }

    if (t < 1) {
      chronoState.countupRaf = requestAnimationFrame(frame);
    } else {
      chronoState.countupRaf = null;
      el.textContent = target;
      el.classList.remove('boom'); void el.offsetWidth; el.classList.add('boom');
      if (typeof playTone === 'function') {
        playTone(523, 'sine', 0.35, 0.22);              // do
        playTone(659, 'sine', 0.35, 0.22, 0.12);        // mi
        playTone(784, 'sine', 0.45, 0.22, 0.24);        // sol
      }
    }
  }
  chronoState.countupRaf = requestAnimationFrame(frame);
}

// Confettis simples — 24 morceaux qui tombent
function spawnConfetti() {
  const layer = document.getElementById('qa-chrono-confetti');
  if (!layer) return;
  layer.innerHTML = '';
  const colors = ['#fde047','#fb923c','#22d3ee','#a855f7','#f472b6','#22c55e'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.style.left           = (Math.random() * 100) + '%';
    s.style.background     = colors[i % colors.length];
    s.style.animationDelay = (Math.random() * 0.6) + 's';
    s.style.transform      = `rotate(${Math.random()*180}deg)`;
    layer.appendChild(s);
  }
  setTimeout(() => { layer.innerHTML = ''; }, 3200);
}

// ─────────────────── Persistance ───────────────────

function _chronoKey() { return `neoquest_chrono_${chapitreId || 'unknown'}`; }

function getBestPrestige() {
  try { return JSON.parse(localStorage.getItem(_chronoKey()) || '{"prestige":0,"streak":0,"palier":0,"count":0}'); }
  catch { return { prestige:0, streak:0, palier:0, count:0 }; }
}

function saveChronoRun(prestige, maxStreak, maxPalier, count) {
  const best = getBestPrestige();
  const next = {
    prestige: Math.max(best.prestige, prestige),
    streak:   Math.max(best.streak,   maxStreak),
    palier:   Math.max(best.palier || 0, maxPalier),
    count:    Math.max(best.count,    count),
    lastPrestige: prestige,
    lastStreak:   maxStreak,
    lastPalier:   maxPalier,
    lastCount:    count,
    lastAt: Date.now(),
  };
  try { localStorage.setItem(_chronoKey(), JSON.stringify(next)); } catch(e) {}
  try {
    const p = getProgress();
    p.totalPrestige = (p.totalPrestige || 0) + prestige;
    saveProgress(p);
  } catch(e) {}
}

window.initChrono    = initChrono;
window.chronoStart   = chronoStart;
window.chronoStop    = chronoStop;
window.chronoRestart = chronoRestart;
window.chronoAnswer  = chronoAnswer;
window.chronoFinish  = chronoFinish;
