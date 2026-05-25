// ── Cœurs de Neo (3 vies) ──
// Math : boss 100 PV / 10 PV par éclat = 10 hits parfaits → 12 questions → 2 erreurs tolérées → 3 cœurs.
// Une mauvaise réponse (clic ou timeout) consomme un cœur. 0 cœur restant = K.O. → écran défaite.
//
// API publique :
//   mountHearts()         — Injecte 3 cœurs SVG dans #qa-combat-hearts
//   resetHearts(max)      — Remet tous les cœurs au max (défaut 3)
//   loseHeart()           — Perd un cœur (anim crack + shards + shake si dernier)
//   heartsCount()         — Cœurs restants
//   heartsKO()            — true si current === 0

var heartsState = { current: 3, max: 3 };

const HEART_SVG = '<svg viewBox="0 0 20 18" aria-hidden="true"><path d="M10 16.5 C 3.5 12, 0.8 8.4, 0.8 4.8 C 0.8 2.3, 2.6 0.8, 4.8 0.8 C 7 0.8, 9 2.2, 10 4.3 C 11 2.2, 13 0.8, 15.2 0.8 C 17.4 0.8, 19.2 2.3, 19.2 4.8 C 19.2 8.4, 16.5 12, 10 16.5 Z"/></svg>';

function mountHearts() {
  const slot = document.getElementById('qa-combat-hearts');
  if (!slot) return;
  if (slot.dataset.mounted === '1') return;
  slot.dataset.mounted = '1';
  slot.innerHTML = '';
  for (let i = 0; i < heartsState.max; i++) {
    const heart = document.createElement('span');
    heart.className = 'combat-heart';
    heart.dataset.i = String(i);
    heart.innerHTML = HEART_SVG;
    slot.appendChild(heart);
  }
}

function resetHearts(max) {
  if (typeof max === 'number' && max > 0) heartsState.max = max;
  heartsState.current = heartsState.max;
  const slot = document.getElementById('qa-combat-hearts');
  if (!slot) return;
  slot.dataset.mounted = '';
  mountHearts();
  const hud = document.querySelector('.combat-hud-side-left');
  if (hud) hud.classList.remove('is-ko');
}

function loseHeart() {
  if (heartsState.current <= 0) return false;
  const idx = heartsState.current - 1;
  heartsState.current -= 1;

  const heart = document.querySelector(`#qa-combat-hearts .combat-heart[data-i="${idx}"]`);
  if (heart) {
    _spawnHeartShards(heart);
    heart.classList.remove('is-losing');
    void heart.offsetWidth;
    heart.classList.add('is-losing');
    setTimeout(() => heart.classList.add('is-lost'), 560);
  }

  if (heartsState.current === 0) {
    const hud = document.querySelector('.combat-hud-side-left');
    if (hud) { hud.classList.remove('is-ko'); void hud.offsetWidth; hud.classList.add('is-ko'); }
  }
  return true;
}

function heartsCount() { return heartsState.current; }
function heartsKO()    { return heartsState.current <= 0; }

function _spawnHeartShards(heartEl) {
  for (let i = 0; i < 3; i++) {
    const shard = document.createElement('span');
    shard.className = 'combat-heart-shard';
    shard.textContent = '♥';
    const dx  = (Math.random() * 28 - 14).toFixed(1);
    const rot = (Math.random() * 180 - 90).toFixed(0);
    shard.style.setProperty('--shard-dx',  dx + 'px');
    shard.style.setProperty('--shard-rot', rot + 'deg');
    shard.style.animationDelay = (i * 60) + 'ms';
    heartEl.appendChild(shard);
    setTimeout(() => shard.remove(), 900 + i * 60);
  }
}

window.mountHearts  = mountHearts;
window.resetHearts  = resetHearts;
window.loseHeart    = loseHeart;
window.heartsCount  = heartsCount;
window.heartsKO     = heartsKO;
