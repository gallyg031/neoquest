// ── Phase II — beat narratif déclenché à ≤20% PV du Gardien ──
// One-shot par combat (consommé via phase2State.fired). Affiche un banner cramoisi
// avec 4 craquelures, flash blanc→rouge, kicker + titre slam + quote du boss.
// Pendant ~2.4s la suite du combat se met en pause (timer pausé).
//
// API publique :
//   triggerPhase2(opts)       — Joue le banner. opts: { title:[ligne1,ligne2], quote, kicker }
//   maybeTriggerPhase2(opts)  — Idempotent (utilisé par bossDamage), trigger 1× quand PV ≤ 20%
//   phase2Reset()             — Reset le flag (à appeler à chaque nouveau combat)

var phase2State = { fired: false };

function phase2Reset() { phase2State.fired = false; }

function maybeTriggerPhase2(opts) {
  if (phase2State.fired) return false;
  if (typeof bossState === 'undefined' || !bossState.maxHP) return false;
  const ratio = bossState.hp / bossState.maxHP;
  if (ratio > 0.20 || bossState.hp <= 0) return false;
  triggerPhase2(opts);
  return true;
}

function triggerPhase2(opts) {
  if (phase2State.fired) return;
  phase2State.fired = true;
  opts = opts || {};

  const stage = document.getElementById('qa-combat-stage');
  if (!stage) return;

  const title = opts.title  || ['LE GARDIEN', 'ENRAGÉ'];
  const quote = opts.quote  || '« Tu commences à m’agacer… »';
  const kicker = opts.kicker || '⟡ Phase II ⟡';

  const banner = document.createElement('div');
  banner.className = 'combat-phase2-banner is-active';
  banner.setAttribute('aria-hidden', 'true');
  banner.innerHTML = `
    <div class="combat-p2-flash"></div>
    <div class="combat-p2-frame">
      <div class="combat-p2-kicker">${kicker}</div>
      <div class="combat-p2-title">
        ${title.map(l => `<span>${l}</span>`).join('')}
      </div>
      <div class="combat-p2-quote">${quote}</div>
    </div>
    <div class="combat-p2-cracks" aria-hidden="true">
      <span class="combat-p2-crack combat-p2-crack--1"></span>
      <span class="combat-p2-crack combat-p2-crack--2"></span>
      <span class="combat-p2-crack combat-p2-crack--3"></span>
      <span class="combat-p2-crack combat-p2-crack--4"></span>
    </div>
  `;
  stage.appendChild(banner);

  // Boss roar
  const bossSprite = document.getElementById('qa-combat-sprite-boss');
  if (bossSprite) {
    bossSprite.classList.remove('is-phase2');
    void bossSprite.offsetWidth;
    bossSprite.classList.add('is-phase2');
  }

  // Shake hard pour appuyer le slam
  if (typeof window.vfxScreenShake === 'function') {
    setTimeout(() => window.vfxScreenShake('hard'), 200);
  }

  // Pause le timer pendant la cérémonie
  if (typeof window.pauseTimer === 'function') window.pauseTimer();

  setTimeout(() => {
    try { banner.remove(); } catch (e) {}
    if (typeof window.resumeTimer === 'function') window.resumeTimer();
  }, 2400);
}

window.triggerPhase2      = triggerPhase2;
window.maybeTriggerPhase2 = maybeTriggerPhase2;
window.phase2Reset        = phase2Reset;
