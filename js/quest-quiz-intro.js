// ── Séquence d'intro du combat — Quest card → Flux A (1ʳᵉ tentative) / Flux C (replay) ──
// API publique : window.runIntroSequence({theme, bossName, bossIcon, chap}, callback)
//   Séquence : (1) Quest card (nom de quête + lede + stats + CTA Engager),
//              (2) Flux A révélation épique ~3.2s (1ʳᵉ fois) OU Flux C splash + slam ~1.6s (replay),
//              (3) callback() → renderQuiz.
//   chap.intro peut override : { title, lede, niveau, recompense, kicker, quote, nameLines, royaumeLabel }.
//   Espace / Échap : Échap = skip total ; Espace = engage (depuis quest card) ou skip (pendant flux).

function runIntroSequence(opts, callback) {
  const shell = document.getElementById('qa-combat-shell');
  if (!shell) { if (callback) callback(); return; }

  const theme    = opts.theme || 'historya';
  const linesAll = window.__BOSS_INTRO_LINES || {};
  const lines    = linesAll[theme] || linesAll.historya || {};
  const chap     = opts.chap || {};
  const chapIntro = chap.intro || {};
  // Résolution boss : chap.nom_boss → opts.bossName (sauf si c'est nom_quete legacy) → lines.bossTitle
  const bossName = chap.nom_boss || opts.bossName || lines.bossTitle || 'Le Gardien';
  // Résolution image : chap.image_boss → opts.bossIcon (si chemin image) → lines.bossImage → fallback emoji
  const bossImage = chap.image_boss
    || (isImagePath(opts.bossIcon) ? opts.bossIcon : null)
    || lines.bossImage
    || null;
  const bossEmoji = (!isImagePath(opts.bossIcon) && opts.bossIcon) || '👹';
  const royaumeLabel = chapIntro.royaumeLabel || ('Royaume · ' + cap(theme));
  const kicker = chapIntro.kicker || '— le défi —';
  const quote  = chap.quote_boss || chapIntro.quote || lines.challenge || '« À toi de jouer. »';
  const nameLines = chapIntro.nameLines || splitNameLines(bossName);

  // Détection : combien de fois ce chapitre a déjà été quizzé ?
  // chapId est var global posée par quest-modal.js. On lit le compteur quizDone.
  let attempts = 0;
  try {
    const cid = (typeof chapitreId !== 'undefined' && chapitreId)
      || (opts.chap && opts.chap.id)
      || null;
    if (cid) {
      const chd = JSON.parse(localStorage.getItem('neoquest_chap_' + cid) || '{}');
      attempts = chd.quizDone || 0;
    }
  } catch (e) {}
  const isReplay = attempts > 0;

  const overlay = document.createElement('div');
  overlay.className = 'combat-intro-v2';
  overlay.innerHTML = `
    <button class="civ2-skip" type="button" title="Passer l'intro">Passer ↪</button>
    <div class="civ2-stage"></div>
  `;
  shell.appendChild(overlay);
  const stage = overlay.querySelector('.civ2-stage');

  let cancelled = false;
  const timers = [];
  function later(fn, ms) { const t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers.length = 0; }

  function finish() {
    if (cancelled) return;
    cancelled = true;
    clearTimers();
    document.removeEventListener('keydown', onKey, true);
    overlay.classList.add('out');
    setTimeout(() => { try { overlay.remove(); } catch (e) {} }, 360);
    if (callback) callback();
  }

  overlay.querySelector('.civ2-skip').onclick = finish;
  // Clic n'importe où sur l'overlay = skip (sauf pendant la quest card où on attend l'engagement actif).
  overlay.addEventListener('click', (e) => {
    if (e.target.closest('.civ2-skip')) return;
    if (e.target.closest('.civ2-qc-cta')) { engage(); return; }
    if (overlay.dataset.phase === 'quest') return; // ignorer clics autres pendant la quest card
    finish();
  });

  function onKey(e) {
    if (e.code === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      finish();
      return;
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault(); e.stopPropagation();
      if (overlay.dataset.phase === 'quest') engage();
      else finish();
    }
  }
  document.addEventListener('keydown', onKey, true);

  function engage() {
    if (cancelled) return;
    if (overlay.dataset.phase !== 'quest') return;
    overlay.dataset.phase = 'flux';
    clearTimers();
    if (isReplay) playFluxC();
    else          playFluxA();
  }

  playQuestCard();

  // ─── Quest card : point d'entrée, attend l'engagement actif ──────────────────
  function playQuestCard() {
    overlay.dataset.phase = 'quest';
    const title    = chapIntro.title || chap.nom_quete || 'L\'Antre du Gardien';
    const lede     = chapIntro.lede  || chap.nom || lines.lore || 'Quelque chose t\'attend là-bas.';
    const niveau   = chapIntro.niveau   || '★★☆☆☆';
    const recomp   = chapIntro.recompense
      || (chap.loot_quete && (chap.loot_quete.emoji + ' ' + chap.loot_quete.nom))
      || '+ xp · or';
    const tentLbl  = !attempts ? 'Première'
                    : (attempts === 1 ? '2ᵉ'
                    : (attempts === 2 ? '3ᵉ' : (attempts + 1) + 'ᵉ'));

    stage.innerHTML = `
      <div class="civ2-questcard">
        <div class="civ2-qc">
          <div class="civ2-qc-meta">
            <span class="civ2-qc-chip">⟡ Royaume · ${escape(cap(theme))}</span>
            ${chap.nom ? `<span class="civ2-qc-chip civ2-qc-chip--dim">${escape(chap.nom)}</span>` : ''}
          </div>
          <h1 class="civ2-qc-title">${escape(title)}</h1>
          <p class="civ2-qc-lede">${escape(lede)}</p>
          <div class="civ2-qc-stats">
            <div class="civ2-qc-stat"><span>Récompense</span><b>${escape(recomp)}</b></div>
            <div class="civ2-qc-stat"><span>Niveau</span><b>${escape(niveau)}</b></div>
            <div class="civ2-qc-stat"><span>Tentative</span><b>${escape(tentLbl)}</b></div>
          </div>
          <button class="civ2-qc-cta" type="button">
            <span>Engager le combat</span>
            <span class="civ2-qc-cta-arrow" aria-hidden="true">→</span>
          </button>
          <div class="civ2-qc-hint">Tu pourras passer l'introduction d'un appui sur <kbd>Espace</kbd></div>
        </div>
      </div>
    `;
  }

  // ─── Flux A : révélation épique (~3.2 s avant auto-finish) ────────────────────
  function playFluxA() {
    stage.innerHTML = `
      <div class="civ2-fluxa">
        <div class="civ2-fluxa-bg"></div>
        <div class="civ2-noise"></div>
        <div class="civ2-card">
          <div class="civ2-royaume">
            <span class="civ2-rune">⟡</span>
            <span class="civ2-royaume-txt">${escape(royaumeLabel)}</span>
            <span class="civ2-rune">⟡</span>
          </div>
          <div class="civ2-divider"><span></span></div>
          <div class="civ2-silhouette" aria-hidden="true">
            ${bossSilhouette('civ2-sil-img')}
            <div class="civ2-fog civ2-fog--1"></div>
            <div class="civ2-fog civ2-fog--2"></div>
            <div class="civ2-fog civ2-fog--3"></div>
          </div>
          <div class="civ2-namewrap">
            <div class="civ2-kicker">${escape(kicker)}</div>
            <h2 class="civ2-name">
              <span class="civ2-name-line" data-line="1">${escape(nameLines[0] || bossName)}</span>
              ${nameLines[1] ? `<span class="civ2-name-line" data-line="2">${escape(nameLines[1])}</span>` : ''}
            </h2>
          </div>
          <blockquote class="civ2-quote">${escape(quote)}</blockquote>
          <div class="civ2-prompt">
            <kbd>Espace</kbd> <span>ou clic — engager</span>
          </div>
        </div>
        <svg class="civ2-frame" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
          <rect x=".5" y=".5" width="99" height="55" fill="none"
                stroke="rgba(251,210,74,.35)" stroke-width=".15"
                stroke-dasharray="0.6 0.4"/>
        </svg>
      </div>
    `;
    later(finish, 6000); // auto-finish fallback (joueur peut skip avant)
  }

  // ─── Flux C : splash royaume (~.8 s) → slam boss (~.9 s) → finish ─────────────
  function playFluxC() {
    stage.innerHTML = `
      <div class="civ2-fluxc1">
        <div class="civ2-fluxc1-bg"></div>
        <div class="civ2-rs">
          <div class="civ2-rs-rune">⟡</div>
          <div class="civ2-rs-label">Royaume</div>
          <div class="civ2-rs-name">${escape(cap(theme).toUpperCase())}</div>
          <div class="civ2-rs-bar"></div>
        </div>
      </div>
    `;
    later(() => {
      if (cancelled) return;
      const slamNameLines = nameLines.length === 2
        ? nameLines
        : splitNameLines(bossName);
      stage.innerHTML = `
        <div class="civ2-fluxc2">
          <div class="civ2-fluxc2-bg"></div>
          <div class="civ2-bs-silhouette" aria-hidden="true">
            ${bossSilhouette('')}
          </div>
          <div class="civ2-bs-content">
            <div class="civ2-bs-kicker">⟡ ${escape(firstWord(bossName))} ⟡</div>
            <h2 class="civ2-bs-name">
              <span>${escape((slamNameLines[0] || bossName).toUpperCase())}</span>
              ${slamNameLines[1] ? `<span>${escape(slamNameLines[1].toUpperCase())}</span>` : ''}
            </h2>
          </div>
        </div>
      `;
    }, 800);
    later(finish, 1700);
  }

  // ─── helpers ─────────────────────────────────────────────────────────────────
  function bossSilhouette(imgClass) {
    if (bossImage) return `<img class="${imgClass}" src="${escape(bossImage)}" alt="">`;
    return `<div class="civ2-sil-emoji">${escape(bossEmoji)}</div>`;
  }
  function isImagePath(s) {
    return typeof s === 'string' && /\.(png|jpe?g|svg|webp|gif)$/i.test(s);
  }
  function splitNameLines(name) {
    if (!name) return ['Le Gardien'];
    const words = String(name).trim().split(/\s+/);
    if (words.length <= 1) return [name];
    if (words.length === 2) return [words[0], words[1]];
    // Min-max : pivot qui minimise la ligne la plus longue (équilibrage visuel)
    let bestPivot = 1, bestMax = Infinity;
    for (let p = 1; p < words.length; p++) {
      const l1 = words.slice(0, p).join(' ').length;
      const l2 = words.slice(p).join(' ').length;
      const m  = Math.max(l1, l2);
      if (m < bestMax) { bestMax = m; bestPivot = p; }
    }
    return [words.slice(0, bestPivot).join(' '), words.slice(bestPivot).join(' ')];
  }
  function firstWord(s) { return String(s || '').trim().split(/\s+/)[0] || 'Gardien'; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.runIntroSequence = runIntroSequence;
