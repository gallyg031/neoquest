// ── Tweaker dev (panneau de test des animations / ressources combat) ──
// Ouvre via le bouton flottant 🔧 en bas-droite de la scène combat.
// À retirer (ou cacher via display:none) avant prod.

(function() {
  const style = document.createElement('style');
  style.textContent = `
    .tweaker-toggle {
      position: fixed;
      bottom: 0.8rem; right: 0.8rem;
      z-index: 9999;
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(0,0,0,0.75);
      border: 1px solid rgba(251,191,36,0.7);
      color: #fbbf24;
      font-size: 1.05rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.6);
      transition: background 0.18s, transform 0.18s;
      font-family: 'Nunito', sans-serif;
    }
    .tweaker-toggle:hover { background: rgba(251,191,36,0.22); transform: scale(1.06); }
    .tweaker-panel {
      position: fixed;
      bottom: 3.2rem; right: 0.8rem;
      z-index: 9999;
      background: rgba(15,18,38,0.97);
      border: 1px solid rgba(251,191,36,0.5);
      border-radius: 0.7rem;
      padding: 0.5rem 0.55rem;
      width: 195px;
      max-height: calc(100vh - 5rem);
      overflow-y: auto;
      box-shadow: 0 8px 28px rgba(0,0,0,0.6);
      font-family: 'Nunito', sans-serif;
      display: none;
    }
    .tweaker-panel.open { display: block; animation: tweakerIn 0.18s ease-out; }
    @keyframes tweakerIn { 0% { opacity: 0; transform: translateY(8px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    .tweaker-title {
      font-size: 0.58rem;
      font-weight: 900;
      color: #fbbf24;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.35rem;
      padding-bottom: 0.28rem;
      border-bottom: 1px solid rgba(251,191,36,0.25);
    }
    .tweaker-group { margin-bottom: 0.4rem; }
    .tweaker-group:last-child { margin-bottom: 0; }
    .tweaker-group-label {
      font-size: 0.54rem;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.22rem;
    }
    .tweaker-btn {
      display: block; width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      color: #e2e8f0;
      padding: 0.26rem 0.45rem;
      border-radius: 0.32rem;
      font-size: 0.68rem;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 0.17rem;
      text-align: left;
      transition: background 0.15s, border-color 0.15s;
      font-family: 'Nunito', sans-serif;
      line-height: 1.25;
    }
    .tweaker-btn:hover { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.45); color: #fff; }
  `;
  document.head.appendChild(style);

  // Attaché directement au <body> pour être indépendant des contextes de stacking
  // créés par les modaux/overlay. Visible en permanence (outil dev).
  function mount() {
    if (!document.body || document.body.querySelector('.tweaker-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'tweaker-toggle';
    toggle.type = 'button';
    toggle.title = 'Panneau dev (test animations)';
    toggle.textContent = '🔧';

    const panel = document.createElement('div');
    panel.className = 'tweaker-panel';
    panel.innerHTML = `
      <div class="tweaker-title">🔧 Tweaker DEV</div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Munitions</div>
        <button class="tweaker-btn" data-action="lantern-full">Recharger lanterne (15 éclats)</button>
        <button class="tweaker-btn" data-action="lantern-empty">Vider la lanterne (0 éclat)</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">VFX Tir</div>
        <button class="tweaker-btn" data-action="fire-eclat-hit">Tirer éclat (impact)</button>
        <button class="tweaker-btn" data-action="fire-eclat-miss">Tirer éclat (miss → contre-attaque)</button>
        <button class="tweaker-btn" data-action="fire-caillou-hit">Tirer caillou (cloche + poof)</button>
        <button class="tweaker-btn" data-action="fire-caillou-miss">Tirer caillou (miss → contre-attaque)</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Boss PV</div>
        <button class="tweaker-btn" data-action="boss-full">Boss à 100 PV (reset)</button>
        <button class="tweaker-btn" data-action="boss-15">Boss à 15 PV (proche K.O.)</button>
        <button class="tweaker-btn" data-action="boss-damage">−10 PV (test ghost gris)</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Shakes</div>
        <button class="tweaker-btn" data-action="shake-soft">Shake soft</button>
        <button class="tweaker-btn" data-action="shake-hard">Shake hard</button>
        <button class="tweaker-btn" data-action="shake-dazed">Shake dazed (désorientation)</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Cœurs Neo</div>
        <button class="tweaker-btn" data-action="heart-lose">Perdre 1 cœur</button>
        <button class="tweaker-btn" data-action="heart-reset">Reset 3 cœurs</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Timer 15s</div>
        <button class="tweaker-btn" data-action="timer-start">Start (15s)</button>
        <button class="tweaker-btn" data-action="timer-start-short">Start (5s)</button>
        <button class="tweaker-btn" data-action="timer-pause">Pause / Resume</button>
        <button class="tweaker-btn" data-action="timer-stop">Stop</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Phase II</div>
        <button class="tweaker-btn" data-action="phase2-trigger">⚠ Trigger banner</button>
        <button class="tweaker-btn" data-action="phase2-reset">Reset flag (one-shot)</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Feedback gagnant</div>
        <button class="tweaker-btn" data-action="neo-cheer">↑ Neo cheer (+25 XP)</button>
        <button class="tweaker-btn" data-action="eclat-flash">✦ Flash compteur éclats</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Page-flip</div>
        <button class="tweaker-btn" data-action="page-flip">↻ Tourner la page</button>
      </div>

      <div class="tweaker-group">
        <div class="tweaker-group-label">Annale</div>
        <button class="tweaker-btn" data-action="annale-correct">📜 Révéler (correct)</button>
        <button class="tweaker-btn" data-action="annale-wrong">📜 Révéler (faux)</button>
        <button class="tweaker-btn" data-action="annale-continue">↪ Continuer (close)</button>
      </div>
    `;

    toggle.onclick = () => panel.classList.toggle('open');
    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('.tweaker-btn');
      if (!btn) return;
      handle(btn.dataset.action);
    });

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
  }

  function handle(action) {
    const chapId = (typeof chapitreId !== 'undefined') ? chapitreId : null;
    switch (action) {
      case 'lantern-full':
        if (chapId) {
          try { localStorage.setItem(`neoquest_lantern_${chapId}`, '15'); } catch(e) {}
          if (typeof window.resetLantern === 'function') window.resetLantern();
          if (typeof hudUpdateEclatCounter === 'function') hudUpdateEclatCounter();
        }
        break;
      case 'lantern-empty':
        if (chapId) {
          try { localStorage.setItem(`neoquest_lantern_${chapId}`, '0'); } catch(e) {}
          if (typeof window.resetLantern === 'function') window.resetLantern();
          if (typeof hudUpdateEclatCounter === 'function') hudUpdateEclatCounter();
        }
        break;
      case 'fire-eclat-hit':
        if (typeof vfxAttack === 'function') vfxAttack(true, 'eclat', () => {
          if (typeof bossDamage === 'function') bossDamage(10, '#fbbf24');
        });
        break;
      case 'fire-eclat-miss':
        if (typeof vfxAttack === 'function') vfxAttack(false, 'eclat', () => {});
        break;
      case 'fire-caillou-hit':
        if (typeof hudLanternFlicker === 'function') hudLanternFlicker();
        if (typeof vfxAttack === 'function') vfxAttack(true, 'caillou', () => {
          if (typeof bossDamage === 'function') bossDamage(3, '#cbd5e1');
        });
        break;
      case 'fire-caillou-miss':
        if (typeof vfxAttack === 'function') vfxAttack(false, 'caillou', () => {});
        break;
      case 'boss-full':
        if (typeof bossInit === 'function') {
          // Réutilise l'état courant (préserve aussi les images si chargées via portrait)
          const sprite = document.getElementById('qa-combat-sprite-boss');
          const name = document.getElementById('qa-combat-boss-name')?.textContent || 'Le Gardien';
          const icon = sprite?.dataset.icon || sprite?.textContent || '👹';
          const artImg = sprite?.querySelector('img.combat-sprite-art')?.src;
          bossInit({ name, icon, imgMechant: artImg || null, maxHP: 100, chapId });
        }
        break;
      case 'boss-15':
        if (typeof bossInit === 'function') {
          const sprite = document.getElementById('qa-combat-sprite-boss');
          const name = document.getElementById('qa-combat-boss-name')?.textContent || 'Le Gardien';
          const icon = sprite?.dataset.icon || sprite?.textContent || '👹';
          const artImg = sprite?.querySelector('img.combat-sprite-art')?.src;
          bossInit({ name, icon, imgMechant: artImg || null, maxHP: 100, chapId });
          // Baisse à 15 immédiatement
          if (typeof bossDamage === 'function') bossDamage(85, '#fbbf24');
        }
        break;
      case 'boss-damage':
        if (typeof bossDamage === 'function') bossDamage(10, '#fbbf24');
        break;
      case 'shake-soft':
        if (typeof vfxScreenShake === 'function') vfxScreenShake('soft');
        break;
      case 'shake-hard':
        if (typeof vfxScreenShake === 'function') vfxScreenShake('hard');
        break;
      case 'shake-dazed':
        if (typeof vfxScreenShake === 'function') vfxScreenShake('dazed');
        break;
      case 'heart-lose':
        if (typeof window.loseHeart === 'function') window.loseHeart();
        break;
      case 'heart-reset':
        if (typeof window.resetHearts === 'function') window.resetHearts(3);
        break;
      case 'timer-start':
        if (typeof window.startTimer === 'function') window.startTimer(15, () => console.log('[tweaker] timer expired'));
        break;
      case 'timer-start-short':
        if (typeof window.startTimer === 'function') window.startTimer(5, () => console.log('[tweaker] timer expired (5s)'));
        break;
      case 'timer-pause':
        if (typeof window.pauseTimer === 'function' && typeof window.resumeTimer === 'function') {
          const ring = document.getElementById('qa-quiz-timer');
          if (ring && ring.classList.contains('is-paused')) window.resumeTimer();
          else window.pauseTimer();
        }
        break;
      case 'timer-stop':
        if (typeof window.stopTimer === 'function') window.stopTimer();
        break;
      case 'phase2-trigger':
        if (typeof window.phase2Reset === 'function') window.phase2Reset();
        if (typeof window.triggerPhase2 === 'function') window.triggerPhase2();
        break;
      case 'phase2-reset':
        if (typeof window.phase2Reset === 'function') window.phase2Reset();
        break;
      case 'neo-cheer':
        if (typeof window.neoCheer === 'function') window.neoCheer({ xp: 25 });
        break;
      case 'eclat-flash':
        if (typeof window.eclatCounterFlash === 'function') window.eclatCounterFlash();
        break;
      case 'page-flip':
        if (typeof window.pageFlip === 'function') window.pageFlip(() => { /* swap no-op */ });
        break;
      case 'annale-correct':
        if (typeof window.revealAnnale === 'function') window.revealAnnale({
          letter: 'A', isCorrect: true,
          correctAnswer: 'En 1198, après la guerre des Lanternes',
          explication: 'Le sceau des Annales fut posé alors que les cendres des Lanternes fumaient encore — date gravée au fronton de la crypte.',
          dmg: 10, xp: 25, streak: 3, previousStreak: 2
        });
        break;
      case 'annale-wrong':
        if (typeof window.revealAnnale === 'function') window.revealAnnale({
          letter: 'C', isCorrect: false,
          correctAnswer: 'En 1198, après la guerre des Lanternes',
          explication: 'Le sceau des Annales fut posé alors que les cendres des Lanternes fumaient encore — date gravée au fronton de la crypte.',
          dmg: 0, xp: 0, streak: 0, previousStreak: 3
        });
        break;
      case 'annale-continue':
        if (typeof window.continueFromAnnale === 'function') window.continueFromAnnale();
        break;
    }
  }

  // Surveille l'apparition du combat-stage (modal ouvert) pour monter le tweaker
  const observer = new MutationObserver(() => mount());
  observer.observe(document.body, { childList: true, subtree: true });
  // Tentative immédiate aussi
  document.addEventListener('DOMContentLoaded', mount);
  mount();
})();
