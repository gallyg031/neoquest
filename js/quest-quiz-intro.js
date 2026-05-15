// ── Séquence d'intro du combat (3 actes skippables) ──
// API publique :
//   window.runIntroSequence({theme, bossName, bossIcon, chap}, callback)
//     Joue : (1) reveal du nom du boss, (2) fiche/lore + défi, (3) briefing NeoGuide.
//     callback() est appelé à la fin OU au "Passer ↪". chap.intro peut override le lore par défaut.

function runIntroSequence(opts, callback) {
  const shell = document.getElementById('qa-combat-shell');
  if (!shell) { if (callback) callback(); return; }

  const theme    = opts.theme || 'historya';
  const linesAll = window.__BOSS_INTRO_LINES || {};
  const lines    = linesAll[theme] || linesAll.historya || {};
  const chapIntro = (opts.chap && opts.chap.intro) || {};
  const intro    = Object.assign({}, lines, chapIntro);
  const bossName = opts.bossName || 'Le Gardien';
  const bossIcon = opts.bossIcon || '👹';

  const overlay = document.createElement('div');
  overlay.className = 'combat-intro';
  overlay.innerHTML = `
    <div class="combat-intro-bg"></div>
    <div class="combat-intro-fog combat-intro-fog-1"></div>
    <div class="combat-intro-fog combat-intro-fog-2"></div>
    <button class="combat-intro-skip" type="button" title="Passer l'intro">Passer ↪</button>
    <div class="combat-intro-stage"></div>
  `;
  shell.appendChild(overlay);
  const stageEl = overlay.querySelector('.combat-intro-stage');

  let cancelled = false;
  function finish() {
    if (cancelled) return;
    cancelled = true;
    overlay.classList.add('out');
    setTimeout(() => { try { overlay.remove(); } catch(e) {} }, 360);
    if (callback) callback();
  }
  overlay.querySelector('.combat-intro-skip').onclick = finish;

  // ─── Acte 1 : reveal du nom (auto, ~2.4s) ───
  function acte1() {
    stageEl.innerHTML = `
      <div class="intro-act intro-act-1">
        <div class="intro-prefix">Face à</div>
        <div class="intro-boss-name"></div>
      </div>
    `;
    const nameEl = stageEl.querySelector('.intro-boss-name');
    let i = 0;
    function typeChar() {
      if (cancelled) return;
      if (i <= bossName.length) {
        nameEl.textContent = bossName.slice(0, i);
        i++;
        setTimeout(typeChar, 65);
      } else {
        setTimeout(() => { if (!cancelled) acte2(); }, 850);
      }
    }
    setTimeout(typeChar, 380);
  }

  // ─── Acte 2 : fiche du boss + phrase de défi ───
  function acte2() {
    if (cancelled) return;
    stageEl.innerHTML = `
      <div class="intro-act intro-act-2">
        <div class="intro-card">
          <div class="intro-card-portrait">${bossIcon}</div>
          <div class="intro-card-title">${bossName}</div>
          ${intro.bossTitle ? `<div class="intro-card-subtitle">${intro.bossTitle}</div>` : ''}
          ${intro.lore ? `<div class="intro-card-lore">${intro.lore}</div>` : ''}
          <div class="intro-card-stats">
            <span class="intro-card-stat"><strong>100</strong> PV</span>
            <span class="intro-card-sep">·</span>
            <span class="intro-card-stat">Royaume <strong>${cap(theme)}</strong></span>
          </div>
          ${intro.challenge ? `<div class="intro-card-challenge">${intro.challenge}</div>` : ''}
          <button class="intro-engage-btn" type="button">⚔️ Engager le combat</button>
        </div>
      </div>
    `;
    stageEl.querySelector('.intro-engage-btn').onclick = acte3;
  }

  // ─── Acte 3 : briefing NeoGuide ───
  function acte3() {
    if (cancelled) return;
    stageEl.innerHTML = `
      <div class="intro-act intro-act-3">
        <div class="intro-guide-bubble">
          <div class="intro-guide-bubble-title">NeoGuide te conseille</div>
          <div class="intro-guide-bubble-text">${intro.neoGuideHint || 'Concentre-toi, vise juste, et écoute-toi.'}</div>
        </div>
        <div class="intro-guide-sprite">🦉</div>
        <button class="intro-ready-btn" type="button">🔥 Prêt à combattre</button>
      </div>
    `;
    stageEl.querySelector('.intro-ready-btn').onclick = finish;
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  acte1();
}

window.runIntroSequence = runIntroSequence;
