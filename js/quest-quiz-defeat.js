// ── Écran Défaite — cinématique fullscreen (brume rouge + silhouette boss + runes brisées) ──
// API publique : window.runDefeatScreen(opts, onReplay, onShards, onQuit)
//   opts: { reason:'ko'|'timeout', bossName, bossImage, theme,
//           correct, total, bossHp, shardsUsed,
//           koKicker, koTitle, koQuote, timeoutKicker, timeoutTitle, timeoutQuote,
//           replayLabel, replaySub, shardsLabel, shardsSub, quitLabel, quitSub }
//   onReplay : callback du bouton Recommencer (primaire doré)
//   onShards : callback du bouton Récupérer éclats (doré, omis si null/undefined)
//   onQuit   : callback du bouton Abandonner (ghost)

function runDefeatScreen(opts, onReplay, onShards, onQuit) {
  opts = opts || {};
  const shell = document.getElementById('qa-combat-shell') || document.body;
  const theme = opts.theme || 'historya';
  const lines = (window.__BOSS_INTRO_LINES && (window.__BOSS_INTRO_LINES[theme] || window.__BOSS_INTRO_LINES.historya)) || {};

  // Résolution boss (même chaîne que l'intro/victoire)
  const bossImage = opts.bossImage || lines.bossImage || null;
  const bossEmoji = '👹';

  const reason = (opts.reason === 'timeout') ? 'timeout' : 'ko';
  const kicker = (reason === 'timeout')
    ? (opts.timeoutKicker || '— Défaite —')
    : (opts.koKicker      || '— Défaite —');
  const titleKo      = opts.koTitle      || 'Tu es tombé';
  const titleTimeout = opts.timeoutTitle || "Les annales t'échappent";
  const quoteKo      = opts.koQuote      || '« Tes éclats étaient bien faibles… repose-toi, et reviens. »';
  const quoteTimeout = opts.timeoutQuote || "« Le temps n'attend pas. Les annales se referment. »";

  const correct    = (opts.correct    != null) ? opts.correct    : 0;
  const total      = (opts.total      != null) ? opts.total      : 12;
  const bossHp     = (opts.bossHp     != null) ? opts.bossHp     : 0;
  const shardsUsed = (opts.shardsUsed != null) ? opts.shardsUsed : 0;

  const replayLabel = opts.replayLabel || '↻ Recommencer';
  const replaySub   = opts.replaySub   || 'avec éclats restants';
  const shardsLabel = opts.shardsLabel || '✦ Récupérer des éclats';
  const shardsSub   = opts.shardsSub   || '+5 éclats de savoir';
  const quitLabel   = opts.quitLabel   || '↩ Abandonner';
  const quitSub     = opts.quitSub     || 'retour à la quête';

  const sil = bossImage
    ? `<img src="${escape(bossImage)}" alt="">`
    : `<div class="df-sil-emoji">${escape(bossEmoji)}</div>`;

  const overlay = document.createElement('div');
  overlay.className = 'combat-defeat';
  overlay.dataset.reason = reason;
  overlay.innerHTML = `
    <div class="df-bg"></div>
    <div class="df-vignette"></div>

    <div class="df-fog df-fog--1"></div>
    <div class="df-fog df-fog--2"></div>
    <div class="df-fog df-fog--3"></div>

    <div class="df-silhouette" aria-hidden="true">${sil}</div>

    <div class="df-rune df-rune--tl">⟡</div>
    <div class="df-rune df-rune--tr">⟡</div>
    <div class="df-rune df-rune--bl">⟡</div>
    <div class="df-rune df-rune--br">⟡</div>

    <div class="df-card">
      <div class="df-kicker">${escape(kicker)}</div>
      <h2 class="df-title">
        <span class="df-title--ko">${escape(titleKo)}</span>
        <span class="df-title--timeout">${escape(titleTimeout)}</span>
      </h2>
      <div class="df-divider"><span></span></div>
      <blockquote class="df-quote">
        <span class="df-quote--ko">${escape(quoteKo)}</span>
        <span class="df-quote--timeout">${escape(quoteTimeout)}</span>
      </blockquote>

      <div class="df-stats">
        <div class="df-stat">
          <span class="df-stat-val">${correct}</span>
          <span class="df-stat-lbl">justes / ${total}</span>
        </div>
        <div class="df-stat">
          <span class="df-stat-val">${bossHp}</span>
          <span class="df-stat-lbl">PV restants</span>
        </div>
        <div class="df-stat">
          <span class="df-stat-val">${shardsUsed}</span>
          <span class="df-stat-lbl">éclats utilisés</span>
        </div>
      </div>

      <div class="df-actions">
        <button class="df-btn df-btn--primary" type="button" id="df-replay">
          <span>${escape(replayLabel)}</span>
          <span class="df-btn-sub">${escape(replaySub)}</span>
        </button>
        ${onShards ? `
        <button class="df-btn df-btn--shards" type="button" id="df-shards">
          <span>${escape(shardsLabel)}</span>
          <span class="df-btn-sub">${escape(shardsSub)}</span>
        </button>` : ''}
        <button class="df-btn df-btn--ghost" type="button" id="df-quit">
          <span>${escape(quitLabel)}</span>
          <span class="df-btn-sub">${escape(quitSub)}</span>
        </button>
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

  const replayBtn = overlay.querySelector('#df-replay');
  if (replayBtn) replayBtn.onclick = () => teardown(onReplay);
  const shardsBtn = overlay.querySelector('#df-shards');
  if (shardsBtn) shardsBtn.onclick = () => teardown(onShards);
  const quitBtn = overlay.querySelector('#df-quit');
  if (quitBtn) quitBtn.onclick = () => teardown(onQuit);

  function onKey(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault(); e.stopPropagation();
      teardown(onReplay); // primaire = recommencer
    } else if (e.code === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      teardown(onQuit); // échap = abandonner
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

window.runDefeatScreen = runDefeatScreen;
