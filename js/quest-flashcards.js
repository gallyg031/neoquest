// ── Flashcards — logique (DOM injecté par quest-flashcards-modal.js) ──
var fcPile = [], fcAcquises = 0, fcTotal = 0, fcFlipped = false, fcAllCards = [];
var fcDragAttached = false;
var fcStreak = 0;  // suite d'« Acquis » consécutifs, pour la réplique streak3 de Neo

const FC_THEMES = {
  'histoire-geo':    'historya',
  'svt':             'bioverde',
  'physique-chimie': 'quantix',
  'maths':           'algebron',
  'francais':        'lexoria'
};

function initFlashcards(cards) {
  fcAllCards = cards || [];
  fcStreak = 0;
  const box = document.querySelector('#qa-modal-fc .qa-fc-box');
  if (box) {
    const theme = (currentMat && FC_THEMES[currentMat.id]) || 'historya';
    box.setAttribute('data-fc-theme', theme);
  }
  if (typeof window.mountLantern === 'function' && chapitreId) {
    window.mountLantern(document.getElementById('qa-fc-lantern-col'), chapitreId, { label: 'Lanterne' });
  }
  // Neo est déjà monté en singleton fixe sur la page.
  // On lui passe le contexte 'flashcards', on déclenche l'intro et le watch d'inactivité.
  if (typeof window.mountNeo === 'function') {
    window.mountNeo(null, { context: 'flashcards' });
  }
  if (typeof window.neoSetExpression === 'function') window.neoSetExpression('neutre');
  setTimeout(() => {
    if (typeof window.neoSayFromBank === 'function') {
      window.neoSayFromBank('flashcards', 'intro', { total: fcAllCards.length });
    }
  }, 250);
  if (typeof window.neoStartIdleWatch === 'function') {
    window.neoStartIdleWatch(15000, () => {
      window.neoSayFromBank('flashcards', 'idle');
    });
  }
  refreshMasteryDisplay();
  pickFCPile();
}

var _lastMasteredCount = -1;
function refreshMasteryDisplay() {
  const total = fcAllCards.length;
  const mastered = (chapitreId && typeof getFCMasteredCount === 'function')
    ? getFCMasteredCount(chapitreId) : 0;
  const countEl = document.getElementById('qa-fc-mastery-count');
  if (countEl) countEl.textContent = `${mastered} / ${total}`;
  const wrap = document.getElementById('qa-fc-mastery');
  if (wrap && _lastMasteredCount >= 0 && mastered > _lastMasteredCount) {
    wrap.classList.remove('pulse');
    void wrap.offsetWidth;
    wrap.classList.add('pulse');
    setTimeout(() => wrap.classList.remove('pulse'), 720);
  }
  _lastMasteredCount = mastered;
}

function updatePileCounter() {
  const stack = document.getElementById('qa-fc-stack');
  const remEl = document.getElementById('qa-fc-remaining');
  const n = fcPile.length;
  if (stack) stack.setAttribute('data-remaining', String(n));
  if (remEl) {
    remEl.textContent = String(n);
    const lbl = remEl.nextElementSibling;
    if (lbl) lbl.textContent = n <= 1 ? 'carte' : 'cartes';
  }
}

// Construit la pile : weak (à revoir) > non-acquises encore > déjà acquises
// → garantit qu'en quelques sessions, l'enfant aura vu toutes les cartes du stock
function _buildFCDeck() {
  const weak = getFCWeak();
  const mastered = (typeof getFCMasteredSet === 'function' && chapitreId)
    ? getFCMasteredSet(chapitreId) : new Set();
  const isWeak = c => (weak[c.question] || 0) > 0;
  const weakCards   = shuffle(fcAllCards.filter(c =>  isWeak(c)));
  const newCards    = shuffle(fcAllCards.filter(c => !isWeak(c) && !mastered.has(c.question)));
  const reviewCards = shuffle(fcAllCards.filter(c => !isWeak(c) &&  mastered.has(c.question)));
  return [...weakCards, ...newCards, ...reviewCards].slice(0, FC_SIZE);
}

function pickFCPile() {
  fcPile = _buildFCDeck(); fcTotal = fcPile.length; fcAcquises = 0; fcFlipped = false;
  document.getElementById('qa-fc-complete').classList.remove('visible');
  document.getElementById('qa-fc-stack').style.display = '';
  document.getElementById('qa-fc-actions').classList.remove('visible');
  updatePileCounter();
  renderFCCard();
}

function renderFCCard() {
  if (fcPile.length === 0) { showFCComplete(); return; }
  const card = fcPile[0]; const el = document.getElementById('qa-fc-card');
  el.style.transition = 'none'; el.classList.remove('flipped','exit-right','exit-left'); void el.offsetWidth; el.style.transition = '';
  fcFlipped = false; document.getElementById('qa-fc-actions').classList.remove('visible');
  // Indice : transféré à Neo (badge 💡 sur Neo, clic pour afficher l'indice dans sa bulle)
  if (typeof window.neoSetIndice === 'function') {
    if (card.indice) window.neoSetIndice(card.indice);
    else window.neoClearIndice();
  }
  document.getElementById('qa-fc-question').textContent = card.question;
  document.getElementById('qa-fc-reponse').textContent = card.reponse;
  updatePileCounter();
}

function flipCard() {
  if (fcPile.length === 0) return; soundFlip();
  if (typeof window.pomoActivity === 'function') window.pomoActivity('flashcard');
  const el = document.getElementById('qa-fc-card'); el.classList.toggle('flipped');
  fcFlipped = el.classList.contains('flipped');
  document.getElementById('qa-fc-actions').classList.toggle('visible', fcFlipped);
  // Quand on retourne la carte (réponse visible), l'indice n'a plus de sens
  if (fcFlipped && typeof window.neoClearIndice === 'function') window.neoClearIndice();
}

function fcAcquis() {
  const q = fcPile[0].question;
  const masteredBefore = (typeof getFCMasteredCount === 'function' && chapitreId)
    ? getFCMasteredCount(chapitreId) : 0;
  markFCAcquis(q);
  if (typeof addFCMastered === 'function' && chapitreId) addFCMastered(chapitreId, q);
  document.getElementById('qa-fc-card').classList.add('exit-right');
  fcAcquises++;
  fcStreak++;
  // Neo : expression de succès (auto-revert), puis streak3 / mastery éventuels
  if (typeof window.neoSetExpression === 'function') {
    window.neoSetExpression('succes', { autoRevertAfter: 1500 });
  }
  const masteredAfter = (typeof getFCMasteredCount === 'function' && chapitreId)
    ? getFCMasteredCount(chapitreId) : 0;
  const total = fcAllCards.length;
  if (typeof window.neoSayFromBank === 'function') {
    if (total > 0 && masteredBefore < total && masteredAfter === total) {
      setTimeout(() => window.neoSayFromBank('flashcards', 'mastery'), 350);
    } else if (fcStreak > 0 && fcStreak % 3 === 0) {
      setTimeout(() => window.neoSayFromBank('flashcards', 'streak3'), 350);
    }
  }
  setTimeout(() => {
    fcPile.shift();
    refreshMasteryDisplay();
    renderFCCard();
  }, 340);
}

function fcRevoir() {
  markFCRevoir(fcPile[0].question);
  document.getElementById('qa-fc-card').classList.add('exit-left');
  fcStreak = 0;
  // Neo : expression "oups" bienveillante (auto-revert), pas de bulle pour ne pas surcharger
  if (typeof window.neoSetExpression === 'function') {
    window.neoSetExpression('oups', { autoRevertAfter: 1500 });
  }
  setTimeout(() => {
    const c = fcPile.shift();
    fcPile.push(c);
    renderFCCard();
  }, 340);
}

function showFCComplete() {
  document.getElementById('qa-fc-stack').style.display = 'none';
  document.getElementById('qa-fc-actions').classList.remove('visible');
  document.getElementById('qa-fc-complete').classList.add('visible');
  try { localStorage.setItem(`neoquest_fc_${chapitreId}`, '1'); } catch(e) {}
  if (chapitreId && typeof window.addLanternEclats === 'function') {
    window.addLanternEclats(5);
  }
  // Neo : réplique de fin (lanterne pleine)
  if (typeof window.neoStopIdleWatch === 'function') window.neoStopIdleWatch();
  if (typeof window.neoSayFromBank === 'function') {
    setTimeout(() => window.neoSayFromBank('flashcards', 'end'), 600);
  }
  refreshMasteryDisplay();
}

function reshuffleFC() {
  const card = document.getElementById('qa-fc-card');
  if (card) { card.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; card.style.transform = 'scale(0.85) rotateY(20deg)'; card.style.opacity = '0'; }
  setTimeout(() => {
    fcPile = _buildFCDeck();
    fcTotal = fcPile.length; fcAcquises = 0; fcFlipped = false;
    document.getElementById('qa-fc-complete').classList.remove('visible');
    document.getElementById('qa-fc-stack').style.display = '';
    document.getElementById('qa-fc-actions').classList.remove('visible');
    if (card) { card.style.transition = ''; card.style.transform = ''; card.style.opacity = ''; }
    updatePileCounter();
    renderFCCard();
  }, 300);
}

function attachFCDragOnce() {
  if (fcDragAttached) return;
  fcDragAttached = true;
  const card = document.getElementById('qa-fc-card');
  card.addEventListener('click', flipCard);
  let tx = 0, dragging = false;
  card.addEventListener('touchstart', e => { tx = e.touches[0].clientX; dragging = false; }, {passive:true});
  card.addEventListener('touchmove', e => { const dx = e.touches[0].clientX - tx; if (Math.abs(dx) > 10) { dragging = true; card.style.transform = `translateX(${dx*0.4}px) rotate(${dx*0.08}deg)`; card.style.opacity = Math.max(0.4, 1 - Math.abs(dx)/280); } }, {passive:true});
  card.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; card.style.transform = ''; card.style.opacity = ''; if (!dragging) return; dragging = false; if (!fcFlipped) { flipCard(); return; } if (dx > 60) fcAcquis(); else if (dx < -60) fcRevoir(); });
  let mx = 0, md = false;
  card.addEventListener('mousedown', e => { mx = e.clientX; md = false; });
  card.addEventListener('mousemove', e => { if (e.buttons !== 1) return; const dx = e.clientX - mx; if (Math.abs(dx) > 10) { md = true; card.style.transform = `translateX(${dx*0.3}px) rotate(${dx*0.05}deg)`; } });
  card.addEventListener('mouseup', e => { const dx = e.clientX - mx; card.style.transform = ''; if (!md) return; md = false; if (!fcFlipped) { flipCard(); return; } if (dx > 80) fcAcquis(); else if (dx < -80) fcRevoir(); });
}

window.reshuffleFC   = reshuffleFC;
window.fcAcquis      = fcAcquis;
window.fcRevoir      = fcRevoir;
