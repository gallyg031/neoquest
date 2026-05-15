// ── Modal Flashcards — injection DOM ──
(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-fc">
      <div class="qa-fc-box" data-fc-theme="historya">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>

        <header class="qa-fc-header">
          <div class="qa-fc-title-block">
            <span class="qa-fc-reward">+5 éclats à la clé</span>
          </div>
          <div class="qa-fc-meta">
            <div class="qa-fc-mastery" id="qa-fc-mastery" title="Cartes maîtrisées du chapitre">
              <span class="qa-fc-mastery-icon">🃏</span>
              <span class="qa-fc-mastery-count" id="qa-fc-mastery-count">0 / 0</span>
            </div>
          </div>
        </header>

        <div class="qa-fc-layout">
          <div class="fc-wrapper">
            <div class="fc-stack" id="qa-fc-stack" data-remaining="10">
              <div class="fc-scene">
                <div class="fc-card" id="qa-fc-card">
                  <div class="fc-face fc-front">
                    <div class="fc-corner fc-corner-tl"></div>
                    <div class="fc-corner fc-corner-br"></div>
                    <div class="fc-label">Question</div>
                    <div class="fc-text" id="qa-fc-question"></div>
                    <div class="fc-hint" id="qa-fc-swipe-hint">Clique pour voir la réponse</div>
                  </div>
                  <div class="fc-face fc-back">
                    <div class="fc-corner fc-corner-tl"></div>
                    <div class="fc-corner fc-corner-br"></div>
                    <div class="fc-label">Réponse</div>
                    <div class="fc-text" id="qa-fc-reponse"></div>
                  </div>
                </div>
              </div>
              <div class="fc-pile-counter">
                <span id="qa-fc-remaining">10</span> <span>cartes</span>
              </div>
            </div>
            <div class="fc-actions" id="qa-fc-actions">
              <button class="fc-btn-revoir" onclick="fcRevoir()">← À revoir</button>
              <button class="fc-btn-acquis" onclick="fcAcquis()">Acquis ! →</button>
            </div>
            <div class="fc-complete" id="qa-fc-complete">
              <div class="fc-complete-icon">🎉</div>
              <p class="fc-complete-title">Pile maîtrisée !</p>
              <p class="fc-complete-sub">Tu as acquis toutes les cartes de cette session.</p>
              <button class="fc-complete-btn" onclick="reshuffleFC()">↺ Nouvelle pile</button>
            </div>
          </div>

          <div class="qa-lantern-col" id="qa-fc-lantern-col"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
})();
