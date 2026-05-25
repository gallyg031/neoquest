// ── Écran Victoire — cinématique fullscreen (god-rays + motes + loot reveal) ──
// API publique : window.runVictoryScreen(opts, onPrimary, onSecondary)
//   opts: { bossName, bossImage, theme, flavor:'win'|'flawless',
//           gold, xp, bonus, correct, total, time, shards, hearts,
//           winKicker, winTitle, winQuote, flawlessKicker, flawlessTitle, flawlessQuote,
//           primaryLabel, primarySub, secondaryLabel, secondarySub }
//   onPrimary  : callback du bouton CTA doré
//   onSecondary: callback du bouton ghost (peut être null pour cacher)

function runVictoryScreen(opts, onPrimary, onSecondary) {
  opts = opts || {};
  const shell = document.getElementById('qa-combat-shell') || document.body;
  const theme = opts.theme || 'historya';
  const lines = (window.__BOSS_INTRO_LINES && (window.__BOSS_INTRO_LINES[theme] || window.__BOSS_INTRO_LINES.historya)) || {};

  // Résolution boss (même chaîne que l'intro)
  const bossName  = opts.bossName  || lines.bossTitle || 'Le Gardien';
  const bossImage = opts.bossImage || lines.bossImage || null;
  const bossEmoji = '👹';

  const flavor = (opts.flavor === 'flawless') ? 'flawless' : 'win';
  const kicker = (flavor === 'flawless')
    ? (opts.flawlessKicker || '— Lumière retrouvée —')
    : (opts.winKicker      || '— La brume se lève —');
  const title  = (flavor === 'flawless')
    ? (opts.flawlessTitle  || 'Tu lui as rendu sa lumière')
    : (opts.winTitle       || bossName + ' se souvient');
  const quote  = (flavor === 'flawless')
    ? (opts.flawlessQuote  || `« Tu n'as pas vaincu ${bossName} — tu l'as ramené. »`)
    : (opts.winQuote       || `« Tu as dissipé la brume… je me souviens, maintenant. »`);

  const gold = (opts.gold  != null) ? opts.gold  : 0;
  const xp   = (opts.xp    != null) ? opts.xp    : 0;
  const bonus= (opts.bonus != null) ? opts.bonus : 0;
  const correct = (opts.correct != null) ? opts.correct : 0;
  const total   = (opts.total   != null) ? opts.total   : 12;
  const time    = opts.time || '—';
  const shards  = (opts.shards != null) ? opts.shards : 0;
  const hearts  = (opts.hearts != null) ? opts.hearts : 0;
  const heartsDisplay = hearts > 0 ? '♥ '.repeat(hearts).trim() : '—';

  const primaryLabel   = opts.primaryLabel   || '✓ Retour à la map';
  const primarySub     = opts.primarySub     || 'récupérer ton butin';
  const secondaryLabel = opts.secondaryLabel || '↻ Rejouer';
  const secondarySub   = opts.secondarySub   || 'retenter ce combat';

  // Construction de la silhouette boss (img si dispo, emoji sinon)
  const sil = bossImage
    ? `<img src="${escape(bossImage)}" alt="">`
    : `<div class="vt-sil-emoji">${escape(bossEmoji)}</div>`;

  const overlay = document.createElement('div');
  overlay.className = 'combat-victory';
  overlay.dataset.flavor = flavor;
  overlay.innerHTML = `
    <div class="vt-bg"></div>
    <div class="vt-rays" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="vt-vignette"></div>

    <div class="vt-motes" aria-hidden="true">
      <span style="--x:8%;  --d:0s;   --dur:6.2s;"></span>
      <span style="--x:18%; --d:1.4s; --dur:7.1s;"></span>
      <span style="--x:27%; --d:.6s;  --dur:5.6s;"></span>
      <span style="--x:38%; --d:2.1s; --dur:8.0s;"></span>
      <span style="--x:46%; --d:.2s;  --dur:6.8s;"></span>
      <span style="--x:55%; --d:1.7s; --dur:5.9s;"></span>
      <span style="--x:64%; --d:.9s;  --dur:7.4s;"></span>
      <span style="--x:73%; --d:2.4s; --dur:6.0s;"></span>
      <span style="--x:82%; --d:1.1s; --dur:7.8s;"></span>
      <span style="--x:91%; --d:.4s;  --dur:6.4s;"></span>
    </div>

    <div class="vt-fog vt-fog--1"></div>
    <div class="vt-fog vt-fog--2"></div>

    <div class="vt-silhouette" aria-hidden="true">${sil}</div>

    <div class="vt-rune vt-rune--tl">⟡</div>
    <div class="vt-rune vt-rune--tr">⟡</div>
    <div class="vt-rune vt-rune--bl">⟡</div>
    <div class="vt-rune vt-rune--br">⟡</div>

    <div class="vt-crown" aria-hidden="true">
      <span>⟡</span><span>✦</span><span>⟡</span><span>✦</span>
      <span>⟡</span><span>✦</span><span>⟡</span><span>✦</span>
    </div>

    <div class="vt-card">
      <div class="vt-kicker">${escape(kicker)}</div>
      <h2 class="vt-title">${escape(title)}</h2>
      <div class="vt-divider"><span></span></div>
      <blockquote class="vt-quote">${escape(quote)}</blockquote>

      <div class="vt-loot">
        <div class="vt-loot-label">⟡ Récompense ⟡</div>
        <div class="vt-loot-row">
          <div class="vt-loot-item">
            <span class="vt-loot-val">+ ${gold}</span>
            <span class="vt-loot-unit">or</span>
          </div>
          <div class="vt-loot-sep"></div>
          <div class="vt-loot-item">
            <span class="vt-loot-val">+ ${xp}</span>
            <span class="vt-loot-unit">xp</span>
          </div>
          <div class="vt-loot-sep vt-loot-sep--bonus"></div>
          <div class="vt-loot-item vt-loot-item--bonus">
            <span class="vt-loot-val">+ ${bonus}</span>
            <span class="vt-loot-unit">bonus<br>sans faute</span>
          </div>
        </div>
        <div class="vt-shine" aria-hidden="true"></div>
      </div>

      <div class="vt-stats">
        <div class="vt-stat">
          <span class="vt-stat-val">${correct}</span>
          <span class="vt-stat-lbl">justes / ${total}</span>
        </div>
        <div class="vt-stat">
          <span class="vt-stat-val">${escape(String(time))}</span>
          <span class="vt-stat-lbl">temps</span>
        </div>
        <div class="vt-stat">
          <span class="vt-stat-val">${shards}</span>
          <span class="vt-stat-lbl">éclats restants</span>
        </div>
        <div class="vt-stat">
          <span class="vt-stat-val vt-stat-val--hearts">${escape(heartsDisplay)}</span>
          <span class="vt-stat-lbl">cœurs sauvés</span>
        </div>
      </div>

      <div class="vt-actions">
        <button class="vt-btn vt-btn--primary" type="button" id="vt-primary">
          <span>${escape(primaryLabel)}</span>
          <span class="vt-btn-sub">${escape(primarySub)}</span>
        </button>
        ${onSecondary ? `
        <button class="vt-btn vt-btn--ghost" type="button" id="vt-secondary">
          <span>${escape(secondaryLabel)}</span>
          <span class="vt-btn-sub">${escape(secondarySub)}</span>
        </button>` : ''}
      </div>
    </div>
  `;
  shell.appendChild(overlay);

  function teardown(cb) {
    document.removeEventListener('keydown', onKey, true);
    overlay.classList.add('out');
    setTimeout(() => { try { overlay.remove(); } catch (e) {} }, 360);
    if (cb) cb();
  }

  const primaryBtn = overlay.querySelector('#vt-primary');
  if (primaryBtn) primaryBtn.onclick = () => teardown(onPrimary);
  const secondaryBtn = overlay.querySelector('#vt-secondary');
  if (secondaryBtn) secondaryBtn.onclick = () => teardown(onSecondary);

  function onKey(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault(); e.stopPropagation();
      teardown(onPrimary);
    } else if (e.code === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      teardown(onPrimary);
    }
  }
  document.addEventListener('keydown', onKey, true);

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

window.runVictoryScreen = runVictoryScreen;
