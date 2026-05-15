// ── Couche VFX Combat — projectile, flash, particules, screen shake, squash & stretch ──
// API publique :
//   window.vfxAttack(success, eclatType, onImpact)
//     - success     : true = touche, false = miss
//     - eclatType   : 'eclat' (orbe doré) | 'caillou' (pierre grise)
//     - onImpact    : callback appelé pile au moment de l'impact (pour synchroniser bossDamage)
//   window.vfxScreenShake(intensity)  // 'soft' | 'hard'

(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* ─── Projectile ─── */
    .vfx-projectile {
      position: absolute;
      pointer-events: none;
      z-index: 8;
      will-change: transform;
    }
    .vfx-projectile-eclat {
      width: 60px; height: 60px;
      border-radius: 0;
      background: url('img/eclat.png') no-repeat center / contain;
      box-shadow: none;
      filter:
        drop-shadow(0 0 14px #fef3c7)
        drop-shadow(0 0 28px rgba(252,211,77,0.9))
        drop-shadow(0 0 48px rgba(168,85,247,0.75))
        drop-shadow(0 0 80px rgba(168,85,247,0.45));
    }
    .vfx-projectile-caillou {
      width: 14px; height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #cbd5e1, #64748b 60%, #334155 100%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
    }
    /* Traînée violette néon derrière l'éclat */
    .vfx-projectile-tail {
      position: absolute; top: 50%; left: -75px;
      width: 90px; height: 10px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(168,85,247,0.2) 15%,
        rgba(168,85,247,0.55) 45%,
        rgba(196,181,253,0.85) 75%,
        rgba(255,255,255,0.95) 100%);
      filter: blur(3px) drop-shadow(0 0 12px rgba(168,85,247,0.85));
      transform: translateY(-50%);
      pointer-events: none;
      border-radius: 9999px;
    }
    .vfx-projectile-caillou .vfx-projectile-tail { display: none; }

    /* ─── Flash blanc d'impact ─── */
    @keyframes vfxFlash {
      0%   { opacity: 0; }
      15%  { opacity: 0.85; }
      100% { opacity: 0; }
    }
    .vfx-flash {
      position: absolute; inset: 0;
      background: radial-gradient(circle at var(--fx, 70%) var(--fy, 60%),
        rgba(255,255,255,0.95) 0%,
        rgba(255,255,255,0.55) 20%,
        rgba(252,211,77,0.25) 45%,
        transparent 70%);
      pointer-events: none;
      z-index: 7;
      animation: vfxFlash 0.32s ease-out forwards;
    }

    /* ─── Particules d'impact (étoile de cristaux) ─── */
    .vfx-burst {
      position: absolute;
      width: 0; height: 0;
      pointer-events: none;
      z-index: 9;
    }
    .vfx-particle {
      position: absolute; top: 0; left: 0;
      width: 6px; height: 6px;
      border-radius: 2px;
      background: linear-gradient(135deg, #fef3c7, #fbbf24);
      box-shadow: 0 0 8px #fbbf24;
      will-change: transform, opacity;
      animation: vfxParticle 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes vfxParticle {
      0%   { transform: translate(0,0) scale(1);   opacity: 1; }
      100% { transform: translate(var(--px), var(--py)) scale(0.2); opacity: 0; }
    }

    /* ─── Screen shake ─── */
    @keyframes vfxShakeSoft {
      0%,100% { transform: translate(0,0); }
      20%     { transform: translate(-2px, 1px); }
      40%     { transform: translate(2px, -1px); }
      60%     { transform: translate(-1px, 2px); }
      80%     { transform: translate(1px, -2px); }
    }
    @keyframes vfxShakeHard {
      0%,100% { transform: translate(0,0); }
      10%     { transform: translate(-6px, 2px); }
      20%     { transform: translate(6px, -3px); }
      30%     { transform: translate(-5px, -2px); }
      40%     { transform: translate(5px, 3px); }
      55%     { transform: translate(-3px, 2px); }
      70%     { transform: translate(3px, -2px); }
      85%     { transform: translate(-2px, 1px); }
    }
    /* Niveau 3 — désorientation : tremblement horizontal pur (le Brouillard attaque Neo) */
    @keyframes vfxShakeDazed {
      0%,100% { transform: translateX(0); }
      10%     { transform: translateX(-10px); }
      25%     { transform: translateX(9px); }
      40%     { transform: translateX(-8px); }
      55%     { transform: translateX(7px); }
      70%     { transform: translateX(-5px); }
      85%     { transform: translateX(3px); }
    }
    .combat-stage.shake-soft  { animation: vfxShakeSoft 0.22s ease-out; }
    .combat-stage.shake-hard  { animation: vfxShakeHard 0.36s cubic-bezier(.36,.07,.19,.97); }
    .combat-stage.shake-dazed { animation: vfxShakeDazed 0.55s cubic-bezier(.36,.07,.19,.97); }

    /* ─── Poof de poussière pour les cailloux ─── */
    @keyframes vfxPoof {
      0%   { opacity: 0.85; transform: translate(-50%, -50%) scale(0.3); }
      40%  { opacity: 0.65; transform: translate(-50%, -50%) scale(1.1); }
      100% { opacity: 0;    transform: translate(-50%, -50%) scale(1.6); }
    }
    .vfx-poof {
      position: absolute;
      width: 60px; height: 60px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(203,213,225,0.85) 0%, rgba(148,163,184,0.5) 45%, transparent 75%);
      filter: blur(2px);
      animation: vfxPoof 0.7s ease-out forwards;
      z-index: 7;
    }

    /* ─── Sort d'ombre du Boss (contre-attaque sur miss) ─── */
    .vfx-shadow-bolt {
      position: absolute;
      width: 26px; height: 26px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 8;
      background: radial-gradient(circle at 35% 35%, #6b21a8 0%, #1e1b4b 50%, #0a0118 100%);
      box-shadow: 0 0 18px rgba(107,33,168,0.85), 0 0 38px rgba(30,27,75,0.6);
      will-change: transform;
    }
    @keyframes vfxBossRoar {
      0%   { transform: scale(1)    rotate(0); filter: drop-shadow(0 0 0 transparent); }
      30%  { transform: scale(1.18) rotate(-2deg); filter: drop-shadow(0 0 22px #f43f5e); }
      60%  { transform: scale(1.1)  rotate(2deg);  filter: drop-shadow(0 0 14px #f43f5e); }
      100% { transform: scale(1)    rotate(0); filter: drop-shadow(0 0 0 transparent); }
    }
    .combat-sprite.roar { animation: vfxBossRoar 0.5s cubic-bezier(.36,.07,.19,.97); animation-delay: 0s !important; }

    @keyframes vfxShadowFlash {
      0%   { opacity: 0; }
      30%  { opacity: 0.55; }
      100% { opacity: 0; }
    }
    .vfx-shadow-flash {
      position: absolute; inset: 0;
      pointer-events: none;
      z-index: 7;
      background: radial-gradient(circle at var(--sx, 30%) var(--sy, 60%),
        rgba(30,27,75,0.8) 0%,
        rgba(15,13,40,0.5) 25%,
        transparent 50%);
      animation: vfxShadowFlash 0.4s ease-out forwards;
    }

    /* ─── Squash & stretch acteurs ─── */
    /* Neo lance (étirement horizontal) */
    @keyframes vfxNeoAttack {
      0%   { transform: translateX(0)    scaleX(1)   scaleY(1); }
      35%  { transform: translateX(-8px) scaleX(0.88) scaleY(1.08); }
      55%  { transform: translateX(14px) scaleX(1.18) scaleY(0.92); }
      100% { transform: translateX(0)    scaleX(1)   scaleY(1); }
    }
    /* Neo encaisse (recule en arrière) */
    @keyframes vfxNeoRecoil {
      0%   { transform: translateX(0); }
      40%  { transform: translateX(-22px) rotate(-6deg); }
      75%  { transform: translateX(-6px) rotate(-2deg); }
      100% { transform: translateX(0)    rotate(0); }
    }
    /* Boss encaisse (compression verticale) */
    @keyframes vfxBossHit {
      0%   { transform: translateY(0)    scaleX(1)    scaleY(1); }
      18%  { transform: translateY(6px)  scaleX(1.15) scaleY(0.82); }
      45%  { transform: translateY(-3px) scaleX(0.94) scaleY(1.08); }
      100% { transform: translateY(0)    scaleX(1)    scaleY(1); }
    }
    .combat-sprite.attacking { animation: vfxNeoAttack 0.45s cubic-bezier(.4,0,.2,1); animation-delay: 0s !important; }
    .combat-sprite.recoil    { animation: vfxNeoRecoil 0.55s cubic-bezier(.36,.07,.19,.97); animation-delay: 0s !important; }
    .combat-sprite.hit       { animation: vfxBossHit  0.55s cubic-bezier(.36,.07,.19,.97); animation-delay: 0s !important; }

    /* ─── Message de soutien Neo ─── */
    @keyframes vfxBubbleIn {
      0%   { opacity: 0; transform: translateY(8px) scale(0.85); }
      30%  { opacity: 1; transform: translateY(-2px) scale(1.05); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes vfxBubbleOut {
      0%   { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-6px) scale(0.95); }
    }
    .vfx-bubble {
      position: absolute;
      max-width: 220px;
      padding: 0.45rem 0.75rem;
      background: rgba(15,23,42,0.92);
      border: 1.5px solid rgba(244,114,182,0.55);
      border-radius: 0.75rem;
      color: #fda4af;
      font-weight: 800;
      font-size: 0.82rem;
      line-height: 1.3;
      box-shadow: 0 0 18px rgba(244,114,182,0.35);
      z-index: 10;
      animation: vfxBubbleIn 0.25s cubic-bezier(.22,1,.36,1) forwards;
      pointer-events: none;
    }
    .vfx-bubble.out { animation: vfxBubbleOut 0.3s ease-in forwards; }
  `;
  document.head.appendChild(style);
})();

const VFX_TRAVEL_MS = 380;     // durée projectile Neo→Boss
const VFX_IMPACT_FRAME = 0.78; // moment de l'impact (0–1) dans la trajectoire

function vfxScreenShake(intensity) {
  const stage = document.getElementById('qa-combat-stage');
  if (!stage) return;
  const cls = intensity === 'hard' ? 'shake-hard'
            : intensity === 'dazed' ? 'shake-dazed'
            : 'shake-soft';
  stage.classList.remove('shake-soft', 'shake-hard', 'shake-dazed');
  void stage.offsetWidth;
  stage.classList.add(cls);
  setTimeout(() => stage.classList.remove(cls), 600);
}

function vfxAttack(success, eclatType, onImpact) {
  const stage   = document.getElementById('qa-combat-stage');
  const neo     = document.getElementById('qa-combat-sprite-neo');
  const boss    = document.getElementById('qa-combat-sprite-boss');
  if (!stage || !neo || !boss) { if (onImpact) onImpact(); return; }

  const stageRect = stage.getBoundingClientRect();
  const neoRect   = neo.getBoundingClientRect();
  const bossRect  = boss.getBoundingClientRect();

  // Position de départ (centre haut de Neo) et d'arrivée (centre du Boss)
  const startX = neoRect.left  - stageRect.left + neoRect.width  / 2;
  const startY = neoRect.top   - stageRect.top  + neoRect.height * 0.35;
  let   endX   = bossRect.left - stageRect.left + bossRect.width / 2;
  let   endY   = bossRect.top  - stageRect.top  + bossRect.height * 0.35;

  // Miss : on dévie le projectile vers le ciel à droite
  if (!success) {
    endX = bossRect.right - stageRect.left + 40;
    endY = -20;
  }

  // Neo attaque (squash horizontal)
  _replayAnim(neo, 'attacking');
  vfxScreenShake('soft');

  // Création du projectile
  const isCaillou = eclatType === 'caillou';
  const half = isCaillou ? 7 : 30; // demi-taille pour centrer sur le point de départ
  const proj = document.createElement('div');
  proj.className = 'vfx-projectile ' + (isCaillou ? 'vfx-projectile-caillou' : 'vfx-projectile-eclat');
  proj.innerHTML = '<span class="vfx-projectile-tail"></span>';
  proj.style.left = (startX - half) + 'px';
  proj.style.top  = (startY - half) + 'px';
  proj.style.transform = 'translate(0,0)';
  stage.appendChild(proj);

  const dx = endX - startX;
  const dy = endY - startY;
  const duration = isCaillou ? 620 : VFX_TRAVEL_MS;
  const impactRatio = isCaillou ? 0.92 : VFX_IMPACT_FRAME;
  const impactDelay = duration * impactRatio;

  // Trajectoire — caillou en cloche (parabole), éclat en ligne droite
  if (isCaillou) {
    _animateProjectileArc(proj, dx, dy, duration, 80);
  } else {
    void proj.offsetWidth;
    proj.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0, 0.55, 1)`;
    proj.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  // Au moment de l'impact
  setTimeout(() => {
    if (success) {
      if (isCaillou) {
        _impactPoof(stage, endX, endY);
        _replayAnim(boss, 'hit');
        vfxScreenShake('soft'); // caillou = impact léger
      } else {
        _impactBurst(stage, endX, endY);
        _replayAnim(boss, 'hit');
        vfxScreenShake('hard');
      }
    } else {
      // Miss : Neo recule + bulle, puis le Boss contre-attaque (sort d'ombre)
      _replayAnim(neo, 'recoil');
      _showNeoBubble(stage, neo);
      vfxScreenShake('soft');
      setTimeout(() => _bossCounterShadow(stage, neo, boss), 200);
    }
    if (onImpact) onImpact();
  }, impactDelay);

  // Cleanup projectile à la fin
  setTimeout(() => proj.remove(), duration + 80);
}

// Anime un projectile en trajectoire de cloche (parabole, JS pour cohérence avec coords dynamiques)
function _animateProjectileArc(proj, dx, dy, duration, peak) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const x = dx * t;
    // y = dy*t (linéaire) - parabole 4t(1-t) qui culmine à peak à t=0.5
    const y = dy * t - peak * 4 * t * (1 - t);
    proj.style.transform = `translate(${x}px, ${y}px) rotate(${t * 280}deg)`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Poof de poussière (cailloux qui touchent)
function _impactPoof(stage, x, y) {
  const poof = document.createElement('div');
  poof.className = 'vfx-poof';
  poof.style.left = x + 'px';
  poof.style.top  = y + 'px';
  stage.appendChild(poof);
  setTimeout(() => poof.remove(), 750);
}

// Le Boss contre-attaque : il rugit puis lance un sort d'ombre sur Neo
function _bossCounterShadow(stage, neo, boss) {
  // Boss rugit (scale + glow rouge)
  _replayAnim(boss, 'roar');

  const stageRect = stage.getBoundingClientRect();
  const neoRect   = neo.getBoundingClientRect();
  const bossRect  = boss.getBoundingClientRect();

  // Projectile d'ombre Boss → Neo
  const bolt = document.createElement('div');
  bolt.className = 'vfx-shadow-bolt';
  const startX = bossRect.left - stageRect.left + bossRect.width * 0.3;
  const startY = bossRect.top  - stageRect.top  + bossRect.height * 0.4;
  const endX   = neoRect.left  - stageRect.left + neoRect.width * 0.5;
  const endY   = neoRect.top   - stageRect.top  + neoRect.height * 0.4;
  bolt.style.left = (startX - 13) + 'px';
  bolt.style.top  = (startY - 13) + 'px';
  stage.appendChild(bolt);

  void bolt.offsetWidth;
  const shadowDuration = 360;
  bolt.style.transition = `transform ${shadowDuration}ms cubic-bezier(0.55, 0, 0.45, 1)`;
  bolt.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1.3)`;

  // Impact sur Neo : flash sombre + screen shake horizontal "dazed"
  setTimeout(() => {
    const flash = document.createElement('div');
    flash.className = 'vfx-shadow-flash';
    flash.style.setProperty('--sx', (endX / stageRect.width * 100) + '%');
    flash.style.setProperty('--sy', (endY / stageRect.height * 100) + '%');
    stage.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
    vfxScreenShake('dazed');
  }, shadowDuration * 0.85);

  setTimeout(() => bolt.remove(), shadowDuration + 80);
}

function _impactBurst(stage, x, y) {
  // Flash radial centré sur le point d'impact
  const flash = document.createElement('div');
  flash.className = 'vfx-flash';
  flash.style.setProperty('--fx', x + 'px');
  flash.style.setProperty('--fy', y + 'px');
  stage.appendChild(flash);
  setTimeout(() => flash.remove(), 320);

  // Particules d'impact : 8 cristaux en étoile
  const burst = document.createElement('div');
  burst.className = 'vfx-burst';
  burst.style.left = x + 'px';
  burst.style.top  = y + 'px';
  stage.appendChild(burst);
  const N = 8;
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const dist  = 36 + Math.random() * 22;
    const p = document.createElement('span');
    p.className = 'vfx-particle';
    p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
    p.style.animationDelay = (Math.random() * 60) + 'ms';
    burst.appendChild(p);
  }
  setTimeout(() => burst.remove(), 800);
}

function _showNeoBubble(stage, neo) {
  const stageRect = stage.getBoundingClientRect();
  const neoRect   = neo.getBoundingClientRect();
  const bubble = document.createElement('div');
  bubble.className = 'vfx-bubble';
  bubble.textContent = 'Aïe ! On se reconcentre !';
  bubble.style.left = (neoRect.left - stageRect.left + neoRect.width + 8) + 'px';
  bubble.style.top  = (neoRect.top  - stageRect.top  - 12) + 'px';
  stage.appendChild(bubble);
  setTimeout(() => bubble.classList.add('out'), 1500);
  setTimeout(() => bubble.remove(), 1850);
}

function _replayAnim(el, cls) {
  el.classList.remove('attacking', 'recoil', 'hit');
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 600);
}

window.vfxAttack      = vfxAttack;
window.vfxScreenShake = vfxScreenShake;
