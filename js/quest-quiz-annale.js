// ── Annale révélée — face B du grimoire (feedback explicatif après réponse) ──
// Workflow :
//   answer() → après revealDelay (1500ms correct / 1800ms wrong) → revealAnnale({...})
//   revealAnnale  → page-flip + data-face="annale" + remplit le contenu + démarre un timer auto 12s
//   continueFromAnnale → quizNext() (qui page-flip vers Q+1 et remet data-face="question")
//
// API publique :
//   revealAnnale(opts)        — opts: { letter, isCorrect, correctAnswer, explication, source, dmg, xp, streak, previousStreak, timedOut }
//   continueFromAnnale()      — Avance à la question suivante (clic "Continuer →" ou auto 12s)
//   fillAnnaleTally(opts)     — Remplit/anime le tally (utilisable seul pour tests)

var _annaleAutoTimer = null;

function revealAnnale(opts) {
  opts = opts || {};
  const page = document.getElementById('qa-quiz-grim-page');
  if (!page) return;

  const swap = () => {
    page.dataset.face = 'annale';
    _replayAnimations();
    _fillAnnale(opts);
    fillAnnaleTally(opts);
    _bindContinueBtn();
  };

  if (typeof window.pageFlip === 'function') {
    window.pageFlip(swap);
  } else {
    swap();
  }

  if (typeof window.showAstuceNeo === 'function') {
    window.showAstuceNeo(opts.astuceNeo, { delayMs: 2400 });
  }

  if (_annaleAutoTimer) clearTimeout(_annaleAutoTimer);
  _annaleAutoTimer = setTimeout(continueFromAnnale, 12000);
}

function continueFromAnnale() {
  if (_annaleAutoTimer) { clearTimeout(_annaleAutoTimer); _annaleAutoTimer = null; }
  if (typeof window.cancelPendingAstuce === 'function') window.cancelPendingAstuce();
  if (typeof window.quizNext === 'function') window.quizNext();
}

function _fillAnnale(opts) {
  const isCorrect = !!opts.isCorrect;
  const timedOut  = !!opts.timedOut;

  const seal = document.getElementById('qa-annale-seal');
  if (seal) seal.dataset.result = isCorrect ? 'correct' : 'wrong';

  const ansEl = document.getElementById('qa-annale-answer');
  if (ansEl) ansEl.textContent = opts.correctAnswer || '';

  const yoursEl = document.getElementById('qa-annale-yours');
  if (yoursEl) {
    if (!isCorrect && opts.letter && !timedOut) {
      const b = yoursEl.querySelector('b');
      if (b) b.textContent = opts.letter;
      yoursEl.hidden = false;
    } else {
      yoursEl.hidden = true;
    }
  }

  const bodyEl = document.getElementById('qa-annale-body');
  if (bodyEl) bodyEl.textContent = opts.explication || '';
}

function fillAnnaleTally(opts) {
  opts = opts || {};
  const isCorrect = !!opts.isCorrect;

  const dmgItem    = document.getElementById('qa-tally-dmg');
  const xpItem     = document.getElementById('qa-tally-xp');
  const streakItem = document.getElementById('qa-tally-streak');
  if (!dmgItem || !xpItem || !streakItem) return;

  const dmgB = dmgItem.querySelector('b');
  const dmgL = dmgItem.querySelector('em');
  const xpB  = xpItem.querySelector('b');
  const xpL  = xpItem.querySelector('em');
  const stB  = streakItem.querySelector('b');
  const stL  = streakItem.querySelector('em');

  if (isCorrect) {
    dmgItem.classList.remove('tally-item--counter'); dmgItem.classList.add('tally-item--dmg');
    if (dmgB) dmgB.textContent = `−${opts.dmg || 0}`;
    if (dmgL) dmgL.textContent = 'pv au Gardien';

    if (xpB) xpB.textContent = `+${opts.xp || 0}`;
    if (xpL) xpL.textContent = 'xp';

    const streak = opts.streak || 0;
    if (streak >= 2) {
      if (stB) stB.textContent = `×${streak}`;
      if (stL) stL.textContent = 'streak';
      streakItem.style.display = '';
    } else {
      streakItem.style.display = 'none';
    }
  } else {
    dmgItem.classList.remove('tally-item--dmg'); dmgItem.classList.add('tally-item--counter');
    if (dmgB) dmgB.textContent = '−1';
    if (dmgL) dmgL.textContent = 'cœur';

    if (xpB) xpB.textContent = '0';
    if (xpL) xpL.textContent = 'contre-attaque';

    const prev = opts.previousStreak || 0;
    if (prev >= 2) {
      if (stB) stB.textContent = `×${prev}→0`;
      if (stL) stL.textContent = 'streak rompue';
      streakItem.style.display = '';
    } else {
      streakItem.style.display = 'none';
    }
  }

  _replayTallyAnimations();
}

function _bindContinueBtn() {
  const btn = document.getElementById('qa-annale-next');
  if (btn) btn.onclick = continueFromAnnale;
}

function _replayAnimations() {
  // Clone .grim-face--annale pour relancer toutes les animations CSS dès le swap
  const face = document.querySelector('#qa-quiz-grim-page .grim-face--annale');
  if (!face) return;
  const clone = face.cloneNode(true);
  face.replaceWith(clone);
}

function _replayTallyAnimations() {
  const tally = document.querySelector('.annale-tally');
  if (!tally) return;
  const clone = tally.cloneNode(true);
  tally.replaceWith(clone);
}

function resetAnnale() {
  if (_annaleAutoTimer) { clearTimeout(_annaleAutoTimer); _annaleAutoTimer = null; }
  if (typeof window.cancelPendingAstuce === 'function') window.cancelPendingAstuce();
  const page = document.getElementById('qa-quiz-grim-page');
  if (page) page.dataset.face = 'question';
}

// Espace = Continuer quand l'annale est visible
document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return;
  const page = document.getElementById('qa-quiz-grim-page');
  if (!page || page.dataset.face !== 'annale') return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  e.preventDefault();
  continueFromAnnale();
});

window.revealAnnale       = revealAnnale;
window.continueFromAnnale = continueFromAnnale;
window.fillAnnaleTally    = fillAnnaleTally;
window.resetAnnale        = resetAnnale;
