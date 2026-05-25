// ── Flashcards V5 — controller principal (state machine + transitions) ──
// Design : bundle Hi-Fi V5 (PFRXLBrOP5y6Y16wtM6pdA), final state après chat12+13.
// 4 écrans : Prépa · Session · Cristallisation · Révision.
//
// API publique (compat avec js/quest-modal.js) :
//   window.initFlashcards(cards)    → entrée principale, lance la modale sur l'écran Prépa
//   window.attachFCDragOnce()       → idempotent, attache swipe sur la carte
//   window.fcAcquis(), window.fcRevoir(), window.reshuffleFC()  → conservés (legacy)
//
// Modèle goutte de savoir :
//   - chaque "Acquis" = 1 goutte qui file vers la lanterne de session
//   - lanterne pleine (10 gouttes) → cristallisation → +5 éclats au stock chapitre (via window.addLanternEclats)
//   - mode révision : pas de gouttes, pas de cristallisation (travail de mémoire pur)

// État global (var pour partage cross-script avec quest-modal.js)
var fcPile = [], fcAcquises = 0, fcTotal = 0, fcFlipped = false, fcAllCards = [];
var fcDragAttached = false;
var fcStreak = 0;

const FCV5 = {
  state: {
    screen: 'prep',       // prep | session | fin | revis
    cardState: 'recto',   // recto | verso | acquis | refaire
    drops: 0,             // gouttes acquises dans la session courante
    sessionTotal: 10,     // taille de session (égale au stock si stock < 10)
    cardsPlayed: 0,
    sessionStatus: [],    // ['done'|'refaire'|'active'|null, ...] indexé par position session
    cardIndex: 0,
    hintRevealed: false,
    revisionMode: false,  // true = session courante en révision (pas de goutte, pas de cristal)
    isPlaying: false,
  },
  modal: null,
};

// Banque de cartes courante (référence à fcAllCards). On garde un index local.
function fcv5GetModal() {
  if (!FCV5.modal) FCV5.modal = document.getElementById('qa-modal-fc');
  return FCV5.modal;
}
function fcv5$(id) { return document.getElementById(id); }
function fcv5Shuffle(a) { return (typeof shuffle === 'function') ? shuffle(a) : a.slice().sort(() => Math.random() - 0.5); }

// ─── construction du deck ─────────────────────────────────
function fcv5BuildDeck(opts) {
  opts = opts || {};
  const weakMap = (typeof getFCWeak === 'function') ? getFCWeak() : {};
  const mastered = (typeof getFCMasteredSet === 'function' && chapitreId)
    ? getFCMasteredSet(chapitreId) : new Set();
  const isWeak = c => (weakMap[c.question] || 0) > 0;

  if (opts.revisionOnly) {
    // Révision : uniquement les cartes "à revoir"
    return fcv5Shuffle(fcAllCards.filter(c => isWeak(c)));
  }
  const weakCards   = fcv5Shuffle(fcAllCards.filter(c =>  isWeak(c)));
  const newCards    = fcv5Shuffle(fcAllCards.filter(c => !isWeak(c) && !mastered.has(c.question)));
  const reviewCards = fcv5Shuffle(fcAllCards.filter(c => !isWeak(c) &&  mastered.has(c.question)));
  const limit = (typeof FC_SIZE === 'number') ? FC_SIZE : 10;
  return [...weakCards, ...newCards, ...reviewCards].slice(0, limit);
}

// ─── render : écran prep ──────────────────────────────────
function fcv5RenderPrep() {
  const total = fcAllCards.length;
  const masteredSet = (typeof getFCMasteredSet === 'function' && chapitreId)
    ? getFCMasteredSet(chapitreId) : new Set();
  const weakMap = (typeof getFCWeak === 'function') ? getFCWeak() : {};
  const okCount = fcAllCards.filter(c => masteredSet.has(c.question)).length;
  const reCount = fcAllCards.filter(c => (weakMap[c.question] || 0) > 0).length;
  const xCount  = Math.max(0, total - okCount - reCount);
  const size    = Math.min((typeof FC_SIZE === 'number' ? FC_SIZE : 10), total);

  // labels
  const set = (id, v) => { const el = fcv5$(id); if (el) el.textContent = String(v); };
  set('fcv5-prep-total', total);
  set('fcv5-prep-ok', okCount);
  set('fcv5-prep-re', reCount);
  set('fcv5-prep-x', xCount);
  set('fcv5-prep-size', size);
  set('fcv5-prep-revis-count', reCount);

  // grille 20 (ou N) cellules
  const grid = fcv5$('fcv5-prep-grid');
  if (grid) {
    grid.innerHTML = '';
    const layout = []
      .concat(Array(okCount).fill('ok'))
      .concat(Array(reCount).fill('re'))
      .concat(Array(xCount).fill('x'));
    layout.forEach(s => {
      const c = document.createElement('div');
      c.className = 'fcv5-cell fcv5-' + s;
      grid.appendChild(c);
    });
  }

  // désactive le bouton révision si pas de cartes à revoir
  const revBtn = fcv5$('fcv5-prep-revis');
  if (revBtn) {
    if (reCount === 0) { revBtn.setAttribute('disabled', 'true'); revBtn.style.opacity = '.4'; revBtn.style.pointerEvents = 'none'; }
    else { revBtn.removeAttribute('disabled'); revBtn.style.opacity = ''; revBtn.style.pointerEvents = ''; }
  }
}

// ─── render : carte ──────────────────────────────────────
function fcv5RenderCard() {
  const c = fcPile[0];
  if (!c) return;
  const setText = (id, v) => { const el = fcv5$(id); if (el) el.textContent = v || ''; };
  const setHtml = (id, v) => { const el = fcv5$(id); if (el) el.innerHTML = v || ''; };

  // id (numéro de carte dans le stock)
  const cardNum = (fcAllCards.indexOf(c) + 1).toString().padStart(2, '0');
  setText('fcv5-card-id-r', '#' + cardNum);
  setText('fcv5-card-id-v', '#' + cardNum);

  // difficulté (pas de champ dans data.js — on infère via présence d'indice)
  const diff = c.difficulte || (c.indice ? 'moyen' : 'facile');
  setText('fcv5-card-diff-r', diff);
  setText('fcv5-card-diff-v', diff);

  // étape
  const step = `étape ${FCV5.state.cardsPlayed + 1} / ${FCV5.state.sessionTotal}`;
  setText('fcv5-card-num-r', step);
  setText('fcv5-card-num-v', step);

  setHtml('fcv5-card-q', c.question || '');
  setText('fcv5-card-a', c.reponse || '');
  setText('fcv5-card-note', c.note || c.explication || '');

  // indice : bouton visible si la carte a un indice
  const hintBtn  = fcv5$('fcv5-hint-btn');
  const hintWrap = fcv5$('fcv5-card-hint');
  const hintText = fcv5$('fcv5-card-hint-text');
  if (c.indice) {
    if (hintBtn)  { hintBtn.hidden = false; hintBtn.classList.remove('is-used'); }
    if (hintText) hintText.textContent = c.indice;
    if (hintWrap) hintWrap.hidden = true;
  } else {
    if (hintBtn)  hintBtn.hidden = true;
    if (hintWrap) hintWrap.hidden = true;
  }
  FCV5.state.hintRevealed = false;

  // Neo : pas d'indice sur Neo (transféré à la carte). On nettoie le badge 💡 s'il existait.
  if (typeof window.neoClearIndice === 'function') window.neoClearIndice();
}

// ─── render : chips de session ───────────────────────────
function fcv5RenderChips() {
  const row = fcv5$('fcv5-chips-row');
  if (!row) return;
  row.innerHTML = '';
  for (let i = 0; i < FCV5.state.sessionTotal; i++) {
    const s = FCV5.state.sessionStatus[i];
    const chip = document.createElement('div');
    chip.className = 'fcv5-chip';
    if (s === 'done')    chip.classList.add('is-done');
    if (s === 'refaire') chip.classList.add('is-refaire');
    if (s === 'active')  chip.classList.add('is-active');
    row.appendChild(chip);
  }
  const done = FCV5.state.sessionStatus.filter(s => s === 'done' || s === 'refaire').length;
  const setN = (id, v) => { const el = fcv5$(id); if (el) el.textContent = String(v); };
  setN('fcv5-cards-done', done);
  setN('fcv5-cards-total', FCV5.state.sessionTotal);
  setN('fcv5-drop-count', FCV5.state.drops);
  setN('fcv5-drop-total', FCV5.state.sessionTotal);
}

// ─── render : panneau stats chapitre ─────────────────────
function fcv5RenderChapterStats() {
  const total = fcAllCards.length;
  const masteredSet = (typeof getFCMasteredSet === 'function' && chapitreId)
    ? getFCMasteredSet(chapitreId) : new Set();
  const weakMap = (typeof getFCWeak === 'function') ? getFCWeak() : {};
  const ok = fcAllCards.filter(c => masteredSet.has(c.question)).length;
  const re = fcAllCards.filter(c => (weakMap[c.question] || 0) > 0).length;
  const x  = Math.max(0, total - ok - re);
  const setN = (id, v) => { const el = fcv5$(id); if (el) el.textContent = String(v); };
  setN('fcv5-chap-total', total);
  setN('fcv5-chap-ok', ok);
  setN('fcv5-chap-re', re);
  setN('fcv5-chap-x', x);
}

// ─── render : pile derrière la carte ─────────────────────
function fcv5RenderStack() {
  const stack = fcv5$('fcv5-card-stack');
  if (!stack) return;
  const remaining = Math.max(0, FCV5.state.sessionTotal - FCV5.state.cardsPlayed - 1);
  stack.innerHTML = '';
  for (let i = 0; i < Math.min(remaining, 6); i++) {
    const d = document.createElement('div');
    d.className = 'fcv5-stack-card';
    stack.appendChild(d);
  }
}

// ─── render : queue révision ─────────────────────────────
function fcv5RenderRevisQueue() {
  const ul = fcv5$('fcv5-revis-list');
  if (!ul) return;
  const weakMap = (typeof getFCWeak === 'function') ? getFCWeak() : {};
  const weakCards = fcAllCards.filter(c => (weakMap[c.question] || 0) > 0).slice(0, 8);
  ul.innerHTML = '';
  if (weakCards.length === 0) {
    ul.innerHTML = '<li style="opacity:.6"><b>—</b> Pas de carte à revoir</li>';
  } else {
    weakCards.forEach((c, i) => {
      const li = document.createElement('li');
      if (i === 0) li.classList.add('is-active');
      const short = (c.question || '').replace(/<[^>]+>/g, '').slice(0, 36);
      li.innerHTML = `<b>${i + 1}</b> ${short}${(c.question || '').length > 36 ? '…' : ''}`;
      ul.appendChild(li);
    });
  }
  const h = fcv5$('fcv5-revis-banner-h');
  if (h) h.textContent = `On retravaille ces ${weakCards.length || 0} cartes`;
}

// ─── transitions ─────────────────────────────────────────
function fcv5SetScreen(name) {
  FCV5.state.screen = name;
  const modal = fcv5GetModal();
  if (modal) modal.setAttribute('data-fcv5-screen', name);
  if (name === 'prep')  { fcv5RenderPrep(); }
  if (name === 'revis') { fcv5RenderRevisQueue(); }
  if (name === 'fin')   {
    fcv5UpdateFinStats();
    if (typeof window.fcv5ResetCristal === 'function') window.fcv5ResetCristal();
    setTimeout(() => {
      if (typeof window.fcv5PlayCristal === 'function') {
        window.fcv5PlayCristal({
          drops: FCV5.state.sessionTotal,
          onComplete: () => {
            // bump la lanterne persistante du chapitre (+5 éclats)
            if (typeof window.addLanternEclats === 'function') window.addLanternEclats(5);
            // marque la pile complète comme jouée
            try { localStorage.setItem(`neoquest_fc_${chapitreId}`, '1'); } catch(e) {}
          }
        });
      }
    }, 300);
  }
  if (name === 'session') {
    requestAnimationFrame(() => { if (typeof window.fcv5UpdatePath === 'function') window.fcv5UpdatePath(); });
  }
}

function fcv5SetCardState(s) {
  FCV5.state.cardState = s;
  const modal = fcv5GetModal();
  if (modal) modal.setAttribute('data-fcv5-card-state', s);
}

function fcv5UpdateFinStats() {
  const masteredCount = (typeof getFCMasteredCount === 'function' && chapitreId)
    ? getFCMasteredCount(chapitreId) : 0;
  const total = fcAllCards.length;
  const set = (id, v) => { const el = fcv5$(id); if (el) el.textContent = String(v); };
  // gains : on affiche le mastered AVANT/APRÈS (l'avant a été stocké au moment du start)
  const before = FCV5.state.masteredAtStart || 0;
  set('fcv5-fin-mastered-before', before);
  set('fcv5-fin-mastered-after', masteredCount);
  set('fcv5-fin-mastered-total', total);
  set('fcv5-fin-todo', Math.max(0, total - masteredCount));
}

// ─── démarrage d'une session (depuis prep ou revis) ──────
function fcv5StartSession(opts) {
  opts = opts || {};
  FCV5.state.revisionMode = !!opts.revisionOnly;
  fcPile = fcv5BuildDeck({ revisionOnly: FCV5.state.revisionMode });
  fcTotal = fcPile.length;
  fcAcquises = 0;
  fcFlipped = false;
  fcStreak = 0;
  FCV5.state.cardsPlayed = 0;
  FCV5.state.drops = 0;
  FCV5.state.sessionTotal = fcPile.length;
  FCV5.state.sessionStatus = new Array(FCV5.state.sessionTotal).fill(null);
  if (FCV5.state.sessionTotal > 0) FCV5.state.sessionStatus[0] = 'active';
  FCV5.state.cardIndex = 0;
  FCV5.state.masteredAtStart = (typeof getFCMasteredCount === 'function' && chapitreId)
    ? getFCMasteredCount(chapitreId) : 0;

  fcv5SetScreen('session');
  fcv5SetCardState('recto');
  fcv5RenderCard();
  fcv5RenderChips();
  fcv5RenderChapterStats();
  fcv5RenderStack();
  if (typeof window.fcv5LanternFill === 'function') window.fcv5LanternFill(0, FCV5.state.sessionTotal);
  if (typeof window.fcv5RenderSlots === 'function') {
    const slots = fcv5$('fcv5-lantern-slots');
    if (slots) window.fcv5RenderSlots(slots, 0);
  }
}

// ─── actions : flip, acquis, refaire ─────────────────────
function fcv5Flip() {
  if (FCV5.state.isPlaying) return;
  if (FCV5.state.cardState === 'recto') {
    if (typeof soundFlip === 'function') soundFlip();
    fcv5SetCardState('verso');
    fcFlipped = true;
  } else if (FCV5.state.cardState === 'verso') {
    fcv5SetCardState('recto');
    fcFlipped = false;
  }
}

async function fcv5Acquis() {
  if (FCV5.state.isPlaying) return;
  if (FCV5.state.cardState !== 'verso') fcv5SetCardState('verso');
  FCV5.state.isPlaying = true;

  const c = fcPile[0];
  if (!c) { FCV5.state.isPlaying = false; return; }

  // Persistance weak + mastery (compat existant)
  if (typeof markFCAcquis === 'function') markFCAcquis(c.question);
  if (typeof addFCMastered === 'function' && chapitreId) addFCMastered(chapitreId, c.question);
  // Successive Relearning (Rawson 2011) unifié : « Acquis » = 1 récup auto-déclarée.
  // Le cap 1/jour côté recup-counter.js empêche le spam intra-session ; un enfant
  // qui clique Acquis sur 3 jours espacés EST probablement en train d'apprendre,
  // même en self-eval. Lu par Fiche parent + mode contrôle.
  if (typeof window.rcInc === 'function' && chapitreId) {
    window.rcInc(chapitreId, c.question);
  }

  fcv5SetCardState('acquis');
  FCV5.state.sessionStatus[FCV5.state.cardsPlayed] = 'done';
  fcv5RenderChips();
  fcv5RenderChapterStats();
  fcAcquises++;
  fcStreak++;

  // Neo : expression succès + bulle streak/mastery
  if (typeof window.neoSetExpression === 'function') {
    window.neoSetExpression('succes', { autoRevertAfter: 1500 });
  }
  const total = fcAllCards.length;
  const masteredAfter = (typeof getFCMasteredCount === 'function' && chapitreId)
    ? getFCMasteredCount(chapitreId) : 0;
  if (typeof window.neoSayFromBank === 'function') {
    if (total > 0 && FCV5.state.masteredAtStart < total && masteredAfter === total) {
      setTimeout(() => window.neoSayFromBank('flashcards', 'mastery'), 350);
    } else if (fcStreak > 0 && fcStreak % 3 === 0) {
      setTimeout(() => window.neoSayFromBank('flashcards', 'streak3'), 350);
    }
  }

  // Astuce Néo (optionnelle, post-réponse) — 700ms : juste après le cheer streak/mastery,
  // pendant que la carte est en état "acquis" et avant le pop vers la suivante
  if (typeof window.showAstuceNeo === 'function') {
    window.showAstuceNeo(c.astuce_neo, { delayMs: 700 });
  }

  // Anim goutte (sauf en révision)
  if (!FCV5.state.revisionMode && typeof window.fcv5FlyDrop === 'function') {
    await new Promise(resolve => {
      window.fcv5FlyDrop(() => {
        FCV5.state.drops += 1;
        if (typeof window.fcv5LanternFill === 'function')
          window.fcv5LanternFill(FCV5.state.drops, FCV5.state.sessionTotal);
        if (typeof window.fcv5RenderSlots === 'function') {
          const slots = fcv5$('fcv5-lantern-slots');
          if (slots) window.fcv5RenderSlots(slots, FCV5.state.drops, FCV5.state.drops - 1);
        }
        fcv5RenderChips();
        resolve();
      });
    });
  } else if (FCV5.state.revisionMode) {
    await new Promise(r => setTimeout(r, 700));
  }

  // Pop la carte de la pile
  fcPile.shift();
  FCV5.state.cardsPlayed += 1;

  // Lanterne pleine → cristallisation
  if (!FCV5.state.revisionMode && FCV5.state.drops >= FCV5.state.sessionTotal) {
    await new Promise(r => setTimeout(r, 350));
    fcv5SetScreen('fin');
    FCV5.state.isPlaying = false;
    return;
  }

  // Plus de cartes → fin (révision) ou cristallisation (session normale)
  if (fcPile.length === 0) {
    await new Promise(r => setTimeout(r, 350));
    if (FCV5.state.revisionMode) {
      fcv5SetScreen('prep');
      if (typeof window.neoStopIdleWatch === 'function') window.neoStopIdleWatch();
      if (typeof window.neoSayFromBank === 'function') {
        setTimeout(() => window.neoSayFromBank('flashcards', 'end'), 400);
      }
    } else {
      fcv5SetScreen('fin');
    }
    FCV5.state.isPlaying = false;
    return;
  }

  // Carte suivante
  await new Promise(r => setTimeout(r, 220));
  FCV5.state.sessionStatus[FCV5.state.cardsPlayed] = 'active';
  fcv5SetCardState('recto');
  fcv5RenderCard();
  fcv5RenderChips();
  fcv5RenderStack();
  FCV5.state.isPlaying = false;
}

async function fcv5Refaire() {
  if (FCV5.state.isPlaying) return;
  if (FCV5.state.cardState !== 'verso') fcv5SetCardState('verso');
  FCV5.state.isPlaying = true;

  const c = fcPile[0];
  if (!c) { FCV5.state.isPlaying = false; return; }

  if (typeof markFCRevoir === 'function') markFCRevoir(c.question);
  fcv5SetCardState('refaire');
  FCV5.state.sessionStatus[FCV5.state.cardsPlayed] = 'refaire';
  fcv5RenderChips();
  fcv5RenderChapterStats();
  fcStreak = 0;

  if (typeof window.neoSetExpression === 'function') {
    window.neoSetExpression('oups', { autoRevertAfter: 1500 });
  }

  // Astuce Néo (optionnelle, post-réponse) — 500ms : pas de bulle cheer ici
  if (typeof window.showAstuceNeo === 'function') {
    window.showAstuceNeo(c.astuce_neo, { delayMs: 500 });
  }

  await new Promise(r => setTimeout(r, 800));
  // Re-injecte la carte en fin de pile en révision, ou la skip simplement en session
  const card = fcPile.shift();
  if (FCV5.state.revisionMode) fcPile.push(card);
  FCV5.state.cardsPlayed += 1;

  if (fcPile.length === 0) {
    await new Promise(r => setTimeout(r, 350));
    if (FCV5.state.revisionMode) fcv5SetScreen('prep');
    else fcv5SetScreen('fin');
    FCV5.state.isPlaying = false;
    return;
  }

  await new Promise(r => setTimeout(r, 220));
  FCV5.state.sessionStatus[FCV5.state.cardsPlayed] = 'active';
  fcv5SetCardState('recto');
  fcv5RenderCard();
  fcv5RenderChips();
  fcv5RenderStack();
  FCV5.state.isPlaying = false;
}

function fcv5ToggleHint() {
  const c = fcPile[0];
  if (!c || !c.indice) return;
  FCV5.state.hintRevealed = !FCV5.state.hintRevealed;
  const hintWrap = fcv5$('fcv5-card-hint');
  const hintBtn  = fcv5$('fcv5-hint-btn');
  if (hintWrap) hintWrap.hidden = !FCV5.state.hintRevealed;
  if (hintBtn)  hintBtn.classList.toggle('is-used', FCV5.state.hintRevealed);
}

// ─── handlers globaux ────────────────────────────────────
function fcv5HandleClick(e) {
  const modal = fcv5GetModal();
  if (!modal || !modal.classList.contains('active')) return;
  if (e.target.closest('#fcv5-hint-btn')) { e.preventDefault(); fcv5ToggleHint(); return; }
  if (e.target.closest('#fcv5-fin-replay')) {
    e.preventDefault();
    if (typeof window.fcv5PlayCristal === 'function') {
      window.fcv5PlayCristal({ drops: FCV5.state.sessionTotal });
    }
    return;
  }
  const btn = e.target.closest('[data-fcv5-go]');
  if (!btn || !modal.contains(btn)) return;
  if (btn.hasAttribute('disabled')) return;
  e.preventDefault();
  const target = btn.dataset.fcv5Go;
  switch (target) {
    case 'prep':    fcv5SetScreen('prep'); break;
    case 'recto':
      if (FCV5.state.screen === 'revis') { fcv5StartSession({ revisionOnly: true }); }
      else { fcv5StartSession({ revisionOnly: false }); }
      break;
    case 'verso':   fcv5Flip(); break;
    case 'acquis':  fcv5Acquis(); break;
    case 'refaire': fcv5Refaire(); break;
    case 'fin':     fcv5SetScreen('fin'); break;
    case 'revis':   fcv5SetScreen('revis'); break;
  }
}

function fcv5HandleKey(e) {
  const modal = fcv5GetModal();
  if (!modal || !modal.classList.contains('active')) return;
  if (FCV5.state.isPlaying) return;
  if (e.target.matches('input,select,textarea')) return;
  // Touches actives uniquement sur l'écran session
  if (FCV5.state.screen !== 'session') return;
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    if (FCV5.state.cardState === 'recto') fcv5Flip();
    else if (FCV5.state.cardState === 'verso') fcv5Acquis();
  }
  if (e.key === 'ArrowRight' && FCV5.state.cardState === 'verso') fcv5Acquis();
  if (e.key === 'ArrowLeft'  && FCV5.state.cardState === 'verso') fcv5Refaire();
}

document.addEventListener('click', fcv5HandleClick);
window.addEventListener('keydown', fcv5HandleKey);

// ─── public API (entrée depuis quest-modal.js) ───────────
function initFlashcards(cards) {
  fcAllCards = cards || [];
  fcStreak = 0;
  FCV5.modal = null;

  // Header (royaume / quête)
  const crumb = fcv5$('fcv5-crumb');
  const title = fcv5$('fcv5-title');
  if (crumb && currentMat) crumb.textContent = `Royaume · ${currentMat.nom_royaume || currentMat.nom || currentMat.id}`;
  if (title && currentChap) title.textContent = currentChap.nom_quete || currentChap.nom || currentChap.title || 'Quête';

  // Neo : passer en contexte 'flashcards', supprimer un éventuel badge indice
  if (typeof window.mountNeo === 'function') window.mountNeo(null, { context: 'flashcards' });
  if (typeof window.neoSetExpression === 'function') window.neoSetExpression('neutre');
  if (typeof window.neoClearIndice === 'function') window.neoClearIndice();
  if (typeof window.neoSayFromBank === 'function') {
    setTimeout(() => window.neoSayFromBank('flashcards', 'intro', { total: fcAllCards.length }), 250);
  }
  if (typeof window.neoStartIdleWatch === 'function') {
    window.neoStartIdleWatch(15000, () => {
      if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('flashcards', 'idle');
    });
  }

  fcv5SetScreen('prep');
  fcv5RenderPrep();
  fcv5RenderChapterStats();
}

// ─── swipe / drag (compat avec quest-modal.js) ───────────
function attachFCDragOnce() {
  if (fcDragAttached) return;
  fcDragAttached = true;
  const card = fcv5$('fcv5-card');
  if (!card) return;
  card.addEventListener('click', () => fcv5Flip());
  let tx = 0, dragging = false;
  card.addEventListener('touchstart', e => { tx = e.touches[0].clientX; dragging = false; }, { passive: true });
  card.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - tx;
    if (Math.abs(dx) > 10) {
      dragging = true;
      card.style.transform = `translateX(${dx * 0.3}px) rotate(${dx * 0.06}deg)`;
      card.style.opacity = String(Math.max(0.4, 1 - Math.abs(dx) / 280));
    }
  }, { passive: true });
  card.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    card.style.transform = ''; card.style.opacity = '';
    if (!dragging) return;
    dragging = false;
    if (FCV5.state.cardState !== 'verso') { fcv5Flip(); return; }
    if (dx > 60) fcv5Acquis();
    else if (dx < -60) fcv5Refaire();
  });
  let mx = 0, md = false;
  card.addEventListener('mousedown', e => { mx = e.clientX; md = false; });
  card.addEventListener('mousemove', e => {
    if (e.buttons !== 1) return;
    const dx = e.clientX - mx;
    if (Math.abs(dx) > 10) {
      md = true;
      card.style.transform = `translateX(${dx * 0.25}px) rotate(${dx * 0.04}deg)`;
    }
  });
  card.addEventListener('mouseup', e => {
    const dx = e.clientX - mx; card.style.transform = '';
    if (!md) return;
    md = false;
    if (FCV5.state.cardState !== 'verso') { fcv5Flip(); return; }
    if (dx > 80) fcv5Acquis();
    else if (dx < -80) fcv5Refaire();
  });
}

// ─── compat globale (legacy) ─────────────────────────────
function fcAcquis()  { fcv5Acquis(); }
function fcRevoir()  { fcv5Refaire(); }
function flipCard()  { fcv5Flip(); }
function reshuffleFC() {
  fcv5StartSession({ revisionOnly: FCV5.state.revisionMode });
}

window.initFlashcards   = initFlashcards;
window.attachFCDragOnce = attachFCDragOnce;
window.fcAcquis         = fcAcquis;
window.fcRevoir         = fcRevoir;
window.flipCard         = flipCard;
window.reshuffleFC      = reshuffleFC;

