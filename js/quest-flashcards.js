// ── Modal Flashcards ──
var fcPile = [], fcAcquises = 0, fcTotal = 0, fcFlipped = false, fcAllCards = [];
var fcDragAttached = false;

(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-fc">
      <div style="position:relative;z-index:1;max-width:560px;width:100%;margin:auto;background:rgba(18,12,40,0.85);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1.5px solid rgba(168,85,247,0.35);border-radius:1.5rem;padding:1.5rem;box-shadow:0 0 60px rgba(168,85,247,0.2),0 0 120px rgba(168,85,247,0.08);">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;padding-right:3rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <img src="favicon2.png" style="width:22px;height:22px;object-fit:contain;" />
            <span style="font-weight:900;font-size:1rem;color:#fff;">Neo-Flash</span>
            <span id="qa-fc-mastered" style="font-size:0.75rem;font-weight:700;color:#22d3ee;"></span>
          </div>
          <button onclick="reshuffleFC()" style="display:inline-flex;align-items:center;gap:0.35rem;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25);border-radius:8px;padding:0.3rem 0.75rem;font-size:0.75rem;font-weight:700;color:#a78bfa;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;">↺ Nouvelle pile</button>
        </div>
        <div class="fc-wrapper">
          <div id="qa-fc-indice-bar" style="margin-bottom:0.6rem;min-height:2rem;">
            <button id="qa-fc-indice-btn" onclick="showFCIndice()" style="display:none;align-items:center;gap:0.4rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:9999px;padding:0.25rem 0.9rem;font-size:0.78rem;font-weight:700;color:#fbbf24;cursor:pointer;font-family:'Nunito',sans-serif;">💡 Indice</button>
            <div id="qa-fc-indice-text" style="display:none;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:0.6rem;padding:0.5rem 0.8rem;font-size:0.82rem;color:#fde68a;line-height:1.5;"></div>
          </div>
          <div class="fc-stack" id="qa-fc-stack">
            <div class="fc-scene">
              <div class="fc-card" id="qa-fc-card">
                <div class="fc-face fc-front">
                  <div class="fc-label">Question</div>
                  <div class="fc-text" id="qa-fc-question"></div>
                  <div class="fc-hint" id="qa-fc-swipe-hint" style="font-size:0.72rem;color:#475569;margin-top:0.6rem;">Clique pour voir la réponse</div>
                </div>
                <div class="fc-face fc-back">
                  <div class="fc-label">Réponse</div>
                  <div class="fc-text" id="qa-fc-reponse"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-actions" id="qa-fc-actions">
            <button class="fc-btn-revoir" onclick="fcRevoir()">← À revoir</button>
            <button class="fc-btn-acquis" onclick="fcAcquis()">Acquis ! →</button>
          </div>
          <div class="fc-complete" id="qa-fc-complete">
            <div style="font-size:3.5rem;margin-bottom:0.5rem;">🎉</div>
            <p style="font-weight:900;font-size:1.3rem;color:#22d3ee;margin-bottom:0.3rem;">Pile maîtrisée !</p>
            <p style="color:#64748b;font-size:0.9rem;margin-bottom:1.5rem;">Tu as acquis toutes les cartes de cette session.</p>
            <button onclick="reshuffleFC()" style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);border:none;border-radius:9999px;padding:0.75rem 1.8rem;font-weight:800;color:#fff;font-size:0.95rem;cursor:pointer;font-family:'Nunito',sans-serif;">↺ Nouvelle pile</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
})();

function initFlashcards(cards) { fcAllCards = cards || []; pickFCPile(); }

function pickFCPile() {
  const weak = getFCWeak();
  const sorted = [...fcAllCards].sort((a,b) => (weak[b.question]||0) - (weak[a.question]||0));
  fcPile = sorted.slice(0, FC_SIZE); fcTotal = fcPile.length; fcAcquises = 0; fcFlipped = false;
  document.getElementById('qa-fc-complete').classList.remove('visible');
  document.getElementById('qa-fc-stack').style.display = 'block';
  document.getElementById('qa-fc-actions').classList.remove('visible');
  renderFCCard();
}

function renderFCCard() {
  if (fcPile.length === 0) { showFCComplete(); return; }
  const card = fcPile[0]; const el = document.getElementById('qa-fc-card');
  el.style.transition = 'none'; el.classList.remove('flipped','exit-right','exit-left'); void el.offsetWidth; el.style.transition = '';
  fcFlipped = false; document.getElementById('qa-fc-actions').classList.remove('visible');
  const ibtn = document.getElementById('qa-fc-indice-btn'), itxt = document.getElementById('qa-fc-indice-text');
  itxt.style.display = 'none';
  if (card.indice) { ibtn.style.display = 'inline-flex'; ibtn.disabled = false; ibtn.style.opacity = '1'; ibtn.textContent = '💡 Indice'; }
  else ibtn.style.display = 'none';
  document.getElementById('qa-fc-question').textContent = card.question;
  document.getElementById('qa-fc-reponse').textContent = card.reponse;
  document.getElementById('qa-fc-mastered').textContent = `✨ ${fcAcquises} / ${fcTotal}`;
}

function showFCIndice() {
  const card = fcPile[0]; if (!card || !card.indice) return;
  document.getElementById('qa-fc-indice-text').textContent = card.indice;
  document.getElementById('qa-fc-indice-text').style.display = 'block';
  const btn = document.getElementById('qa-fc-indice-btn'); btn.disabled = true; btn.style.opacity = '0.45'; btn.textContent = '💡 Indice révélé';
}

function flipCard() {
  if (fcPile.length === 0) return; soundFlip();
  if (typeof window.pomoActivity === 'function') window.pomoActivity('flashcard');
  const el = document.getElementById('qa-fc-card'); el.classList.toggle('flipped');
  fcFlipped = el.classList.contains('flipped');
  document.getElementById('qa-fc-actions').classList.toggle('visible', fcFlipped);
}

function fcAcquis() { markFCAcquis(fcPile[0].question); document.getElementById('qa-fc-card').classList.add('exit-right'); fcAcquises++; setTimeout(() => { fcPile.shift(); renderFCCard(); }, 340); }
function fcRevoir() { markFCRevoir(fcPile[0].question); document.getElementById('qa-fc-card').classList.add('exit-left'); setTimeout(() => { const c = fcPile.shift(); fcPile.push(c); renderFCCard(); }, 340); }

function showFCComplete() {
  document.getElementById('qa-fc-stack').style.display = 'none';
  document.getElementById('qa-fc-actions').classList.remove('visible');
  document.getElementById('qa-fc-complete').classList.add('visible');
  document.getElementById('qa-fc-mastered').textContent = `✨ ${fcAcquises} / ${fcTotal}`;
  try { localStorage.setItem(`neoquest_fc_${chapitreId}`, '1'); } catch(e) {}
}

function reshuffleFC() {
  const card = document.getElementById('qa-fc-card');
  if (card) { card.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; card.style.transform = 'scale(0.85) rotateY(20deg)'; card.style.opacity = '0'; }
  setTimeout(() => {
    const weak = getFCWeak();
    const withWeights = fcAllCards.map(c => ({c, w: weak[c.question]||0}));
    const strong = shuffle(withWeights.filter(x => x.w === 0)).map(x => x.c);
    const weakCards = shuffle(withWeights.filter(x => x.w > 0).sort((a,b) => b.w - a.w)).map(x => x.c);
    fcPile = [...weakCards, ...strong].slice(0, FC_SIZE);
    fcTotal = fcPile.length; fcAcquises = 0; fcFlipped = false;
    document.getElementById('qa-fc-complete').classList.remove('visible');
    document.getElementById('qa-fc-stack').style.display = 'block';
    document.getElementById('qa-fc-actions').classList.remove('visible');
    if (card) { card.style.transition = ''; card.style.transform = ''; card.style.opacity = ''; }
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
window.showFCIndice  = showFCIndice;
window.fcAcquis      = fcAcquis;
window.fcRevoir      = fcRevoir;
