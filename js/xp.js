// ── NeoQuest TV — Système XP & Niveaux ──
// Importé dans toutes les pages via <script src="xp.js"></script>

const NQ_LEVELS = [
  { level:1,  title:'Curieux Éveillé',        emoji:'🌱', minXP:0,    color:'#94a3b8' },
  { level:2,  title:'Apprenti Voyageur',       emoji:'🎒', minXP:50,   color:'#22d3ee' },
  { level:3,  title:'Explorateur du Savoir',   emoji:'🧭', minXP:150,  color:'#22d3ee' },
  { level:4,  title:'Lecteur des Étoiles',     emoji:'⭐', minXP:300,  color:'#a855f7' },
  { level:5,  title:'Gardien des Archives',    emoji:'📜', minXP:500,  color:'#a855f7' },
  { level:6,  title:'Scribe Éclairé',          emoji:'✍️', minXP:750,  color:'#a855f7' },
  { level:7,  title:'Cartographe du Temps',    emoji:'🗺️', minXP:1050, color:'#c084fc' },
  { level:8,  title:'Chevalier du Savoir',     emoji:'⚔️', minXP:1400, color:'#c084fc' },
  { level:9,  title:'Architecte des Idées',    emoji:'🏛️', minXP:1800, color:'#f472b6' },
  { level:10, title:'Maître des Horizons',     emoji:'🌅', minXP:2300, color:'#f472b6' },
  { level:11, title:'Sage de la Cité',         emoji:'🦉', minXP:2900, color:'#fbbf24' },
  { level:12, title:'Oracle du Passé',         emoji:'🔮', minXP:3600, color:'#fbbf24' },
  { level:13, title:'Prévôt de l\'Académie',   emoji:'🎓', minXP:4400, color:'#fbbf24' },
  { level:14, title:'Gardien de la Flamme',    emoji:'🔥', minXP:5300, color:'#fb923c' },
  { level:15, title:'Légende NeoQuest',        emoji:'👑', minXP:6500, color:'#fbbf24' },
];

// ── Helpers localStorage ──
function nqGetProgress() {
  try { return JSON.parse(localStorage.getItem('neoquest_progress') || '{}'); } catch { return {}; }
}
function nqGetXP()   { return nqGetProgress().totalPts  || 0; }
function nqGetGold() { return nqGetProgress().totalGold || 0; }

// ── Calcul niveau actuel ──
function nqGetLevel(xp) {
  let current = NQ_LEVELS[0];
  for (const l of NQ_LEVELS) { if (xp >= l.minXP) current = l; else break; }
  return current;
}
function nqGetNextLevel(xp) {
  return NQ_LEVELS.find(l => l.minXP > xp) || null;
}
function nqGetLevelProgress(xp) {
  const cur  = nqGetLevel(xp);
  const next = nqGetNextLevel(xp);
  if (!next) return 100;
  return Math.round(((xp - cur.minXP) / (next.minXP - cur.minXP)) * 100);
}

// ── Injection des badges dans la navbar ──
function nqInjectLevelBadge() {
  const xp   = nqGetXP();
  const lvl  = nqGetLevel(xp);
  const next = nqGetNextLevel(xp);
  const pct  = nqGetLevelProgress(xp);

  const profileLink = document.getElementById('nav-profile');
  if (!profileLink) return;

  // Badge XP
  if (!document.getElementById('nq-level-badge')) {
    const badge = document.createElement('a');
    badge.href = 'profil.html';
    badge.id   = 'nq-level-badge';
    badge.title = `${lvl.title} — ${xp} XP${next ? ` · ${next.minXP - xp} XP pour niveau ${next.level}` : ' · Niveau max !'}`;
    badge.style.cssText = `
      display:inline-flex; align-items:center; gap:5px;
      text-decoration:none; cursor:pointer;
      background:rgba(255,255,255,0.04);
      border:1px solid ${lvl.color}55;
      border-radius:9999px;
      padding:3px 10px 3px 6px;
      transition:all 0.2s;
      position:relative; overflow:hidden;
    `;
    badge.innerHTML = `
      <span style="font-size:14px;line-height:1;">${lvl.emoji}</span>
      <div>
        <div style="font-size:10px;font-weight:800;color:${lvl.color};line-height:1.1;white-space:nowrap;">Niv. ${lvl.level} · ${lvl.title}</div>
        <div style="width:60px;height:3px;background:rgba(255,255,255,0.08);border-radius:9999px;margin-top:2px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;border-radius:9999px;background:${lvl.color};transition:width 0.8s ease;"></div>
        </div>
      </div>
    `;
    badge.onmouseover = () => badge.style.background = `${lvl.color}18`;
    badge.onmouseout  = () => badge.style.background = 'rgba(255,255,255,0.04)';
    profileLink.parentNode.insertBefore(badge, profileLink);
  }

  // Badge Or
  if (!document.getElementById('nq-gold-badge')) {
    const gold = document.createElement('a');
    gold.href  = 'profil.html';
    gold.id    = 'nq-gold-badge';
    gold.title = `Or disponible : ${nqGetGold()}`;
    gold.style.cssText = `
      display:inline-flex; align-items:center; gap:5px;
      text-decoration:none; cursor:pointer;
      background:rgba(255,255,255,0.04);
      border:1px solid #fbbf2455;
      border-radius:9999px;
      padding:3px 10px 3px 8px;
      transition:all 0.2s;
    `;
    gold.innerHTML = `
      <span style="font-size:14px;line-height:1;">💰</span>
      <span id="nq-gold-amount" style="font-size:11px;font-weight:800;color:#fbbf24;white-space:nowrap;">${nqGetGold()}</span>
    `;
    gold.onmouseover = () => gold.style.background = '#fbbf2418';
    gold.onmouseout  = () => gold.style.background = 'rgba(255,255,255,0.04)';
    profileLink.parentNode.insertBefore(gold, profileLink);
  }
}

// ── Notification de montée de niveau ──
function nqCheckLevelUp(previousXP, newXP) {
  const prevLvl = nqGetLevel(previousXP);
  const newLvl  = nqGetLevel(newXP);
  if (newLvl.level > prevLvl.level) {
    nqShowLevelUpOverlay(newLvl);
  }
}

function nqShowLevelUpOverlay(lvl) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:99999;
    display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;
    background:rgba(8,6,26,0.92); backdrop-filter:blur(10px);
    animation:nqOverlayIn 0.3s ease forwards;
    font-family:'Nunito',sans-serif;
  `;

  // Rayons rotatifs
  const rays = document.createElement('div');
  rays.style.cssText = `
    position:absolute; width:320px; height:320px;
    background:conic-gradient(${lvl.color}22 0deg 20deg, transparent 20deg 40deg, ${lvl.color}22 40deg 60deg, transparent 60deg 80deg, ${lvl.color}22 80deg 100deg, transparent 100deg 120deg, ${lvl.color}22 120deg 140deg, transparent 140deg 160deg, ${lvl.color}22 160deg 180deg, transparent 180deg 200deg, ${lvl.color}22 200deg 220deg, transparent 220deg 240deg, ${lvl.color}22 240deg 260deg, transparent 260deg 280deg, ${lvl.color}22 280deg 300deg, transparent 300deg 320deg, ${lvl.color}22 320deg 340deg, transparent 340deg 360deg);
    border-radius:50%; animation:nqRays 8s linear infinite;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes nqOverlayIn  { from{opacity:0} to{opacity:1} }
      @keyframes nqOverlayOut { from{opacity:1} to{opacity:0} }
      @keyframes nqRays       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes nqBadgeDrop  { 0%{transform:scale(0.1) translateY(-60px);opacity:0} 55%{transform:scale(1.15) translateY(5px);opacity:1} 75%{transform:scale(0.97) translateY(-2px);} 100%{transform:scale(1);opacity:1} }
      @keyframes nqShimmer    { 0%,100%{opacity:0.7} 50%{opacity:1} }
    </style>
    <div style="font-size:72px;animation:nqBadgeDrop 0.65s cubic-bezier(.4,0,.2,1) forwards;position:relative;z-index:1;">${lvl.emoji}</div>
    <div style="font-size:13px;font-weight:700;color:${lvl.color};letter-spacing:0.15em;text-transform:uppercase;position:relative;z-index:1;">Niveau ${lvl.level} atteint !</div>
    <div style="font-size:22px;font-weight:900;color:#fff;position:relative;z-index:1;animation:nqShimmer 1.2s ease infinite;">${lvl.title}</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.5);position:relative;z-index:1;">Continue comme ça, tu es incroyable !</div>
  `;

  overlay.appendChild(rays);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.animation = 'nqOverlayOut 0.4s ease forwards';
    setTimeout(() => overlay.remove(), 400);
  }, 2800);
}

// ── Init automatique au chargement de la page ──
document.addEventListener('DOMContentLoaded', () => {
  nqInjectLevelBadge();
});

// ── Export pour usage dans d'autres scripts ──
window.NQ_LEVELS            = NQ_LEVELS;
window.nqGetXP              = nqGetXP;
window.nqGetGold            = nqGetGold;
window.nqGetLevel           = nqGetLevel;
window.nqGetNextLevel       = nqGetNextLevel;
window.nqGetLevelProgress   = nqGetLevelProgress;
window.nqCheckLevelUp       = nqCheckLevelUp;
window.nqShowLevelUpOverlay = nqShowLevelUpOverlay;
window.nqInjectLevelBadge   = nqInjectLevelBadge;
window.nqRefreshGoldDisplay = function() {
  const el = document.getElementById('nq-gold-amount');
  if (el) el.textContent = nqGetGold();
};
