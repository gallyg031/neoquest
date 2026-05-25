// ── Couche HUD Combat — barre PV, nom boss, brouillard, lanterne ──
// Remplace quest-quiz-boss.js. Expose la même API (bossInit/bossDamage/bossReact/bossDefeated/bossIsDefeated).
// Écrit dans les IDs construits par quest-quiz-modal.js : #qa-combat-boss-name, #qa-combat-hp-fill,
// #qa-combat-hp-num, #qa-combat-hp-max, #qa-combat-fog-left/right, #qa-combat-sprite-neo/boss,
// #qa-combat-lantern-slot, #qa-combat-stage.

(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Damage popup au-dessus du boss */
    @keyframes hudDmgPop {
      0%   { transform: translate(-50%, 0)     scale(0.55); opacity: 0; }
      22%  { transform: translate(-50%, -14px) scale(1.35); opacity: 1; }
      100% { transform: translate(-50%, -54px) scale(0.95); opacity: 0; }
    }
    .hud-dmg-pop {
      position: absolute; left: 50%; top: -10px;
      font-weight: 900; font-size: 1.4rem;
      pointer-events: none;
      text-shadow: 0 0 12px currentColor, 0 1px 4px rgba(0,0,0,0.8);
      animation: hudDmgPop 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      z-index: 5;
    }

    /* Shake léger (utilisé par bossReact en V1, remplacé par vraie séquence VFX à l'étape 3) */
    @keyframes hudBossShake {
      0%, 100% { transform: translateX(0) }
      15%      { transform: translateX(-6px) rotate(-3deg) }
      30%      { transform: translateX(6px)  rotate(3deg)  }
      45%      { transform: translateX(-4px) }
      60%      { transform: translateX(4px)  }
      80%      { transform: translateX(-1px) }
    }
    .combat-sprite.shake { animation: hudBossShake 0.45s cubic-bezier(.36,.07,.19,.97); }

    /* Boss KO : retombe en arrière */
    @keyframes hudBossKO {
      0%   { transform: rotate(0) translateY(0); opacity: 1; }
      25%  { transform: rotate(-14deg) translateY(-8px); filter: drop-shadow(0 0 18px #f472b6); }
      60%  { transform: rotate(-55deg) translateY(10px); opacity: 1; }
      100% { transform: rotate(-95deg) translateY(70px); opacity: 0; }
    }
    .combat-sprite.ko { animation: hudBossKO 1.1s cubic-bezier(.55,.08,.68,.53) forwards; }

    /* Pulse rouge sur la barre PV au moment où elle baisse */
    @keyframes hudHpFlash {
      0%, 100% { box-shadow: 0 0 10px rgba(244,63,94,0.7); }
      40%      { box-shadow: 0 0 28px rgba(254,202,202,1); filter: brightness(1.6); }
    }
    .combat-hp-fill.flash { animation: hudHpFlash 0.5s ease-out; }

    /* Trace "grise" pour matérialiser la perte de PV (delta old → new) */
    @keyframes hudHpGhostFade {
      0%   { opacity: 0.75; }
      30%  { opacity: 0.65; }
      100% { opacity: 0; }
    }
    .combat-hp-ghost {
      position: absolute;
      top: 0; bottom: 0;
      background: linear-gradient(90deg, rgba(226,232,240,0.7), rgba(148,163,184,0.5));
      pointer-events: none;
      animation: hudHpGhostFade 0.8s ease-out forwards;
      border-radius: 9999px;
    }

    /* Lanterne — flicker quand on consomme un éclat */
    @keyframes hudLanternFlicker {
      0%, 100% { filter: brightness(1) drop-shadow(0 0 0 transparent); transform: scale(1); }
      15%      { filter: brightness(0.55); transform: scale(0.96); }
      30%      { filter: brightness(1.6) drop-shadow(0 0 12px #fde047); transform: scale(1.02); }
      55%      { filter: brightness(0.7); transform: scale(0.98); }
      80%      { filter: brightness(1.2) drop-shadow(0 0 8px #fbbf24); transform: scale(1); }
    }
    .qa-lantern-img.flicker { animation: hudLanternFlicker 0.55s ease-out; }
  `;
  document.head.appendChild(style);
})();

var bossState = { hp: 0, maxHP: 0, name: '', icon: '', imgMechant: null, imgApaise: null };

function bossInit(opts) {
  opts = opts || {};
  bossState = {
    hp:    opts.maxHP || 0,
    maxHP: opts.maxHP || 0,
    name:  opts.name  || 'Le Gardien',
    icon:  opts.icon  || '👹',
    imgMechant: opts.imgMechant || null,
    imgApaise:  opts.imgApaise  || null
  };

  // Nom + barre PV + chiffres
  const nameEl = document.getElementById('qa-combat-boss-name');
  if (nameEl) nameEl.textContent = bossState.name;

  const hpFill = document.getElementById('qa-combat-hp-fill');
  if (hpFill) { hpFill.style.transition = 'none'; hpFill.style.width = '100%'; void hpFill.offsetWidth; hpFill.style.transition = ''; }

  const hpNum = document.getElementById('qa-combat-hp-num');
  const hpMax = document.getElementById('qa-combat-hp-max');
  if (hpNum) hpNum.textContent = bossState.hp;
  if (hpMax) hpMax.textContent = bossState.maxHP;

  // Sprite Boss : image profil du chap si dispo, sinon icône emoji
  // L'emoji est conservé en data-icon pour le fallback onerror + le tweaker.
  const spriteBoss = document.getElementById('qa-combat-sprite-boss');
  if (spriteBoss) {
    spriteBoss.classList.remove('shake', 'ko', 'is-apaise');
    spriteBoss.style.opacity = '';
    spriteBoss.style.transform = '';
    spriteBoss.dataset.icon = bossState.icon;
    if (bossState.imgMechant) {
      spriteBoss.classList.add('has-art');
      const img = document.createElement('img');
      img.className = 'combat-sprite-art';
      img.src = bossState.imgMechant;
      img.alt = bossState.name;
      img.onerror = function() {
        spriteBoss.classList.remove('has-art');
        spriteBoss.textContent = bossState.icon;
      };
      spriteBoss.textContent = '';
      spriteBoss.appendChild(img);
    } else {
      spriteBoss.classList.remove('has-art');
      spriteBoss.textContent = bossState.icon;
    }
  }
  const spriteNeo = document.getElementById('qa-combat-sprite-neo');
  if (spriteNeo) spriteNeo.classList.remove('shake');

  // Brouillard : opacité max au début (le boss est intact, l'Oubli est dense)
  _setFog(1);
  _setGlow(0);

  // Thème du royaume si fourni
  const shell = document.getElementById('qa-combat-shell');
  if (shell && opts.theme) shell.setAttribute('data-combat-theme', opts.theme);

  // Lanterne posée près de Neo (image seule, sans label) + compteur texte synchro
  if (opts.chapId && typeof window.mountLantern === 'function') {
    const slot = document.getElementById('qa-combat-lantern-slot');
    if (slot) window.mountLantern(slot, opts.chapId, { max: 15, label: 'Éclats' });
  }
  hudUpdateEclatCounter();

  // Mentor sur l'épaule de Neo (idempotent, ré-monte si pas déjà là)
  if (typeof window.mountMentor === 'function') window.mountMentor();
  if (typeof window.mentorHide   === 'function') window.mentorHide();
}

function hudUpdateEclatCounter() {
  const num = document.getElementById('qa-combat-eclat-num');
  if (num && typeof window.getLanternCount === 'function') {
    num.textContent = window.getLanternCount();
  }
}

function hudLanternFlicker() {
  const img = document.querySelector('.combat-lantern-near .qa-lantern-img');
  if (!img) return;
  img.classList.remove('flicker');
  void img.offsetWidth;
  img.classList.add('flicker');
  setTimeout(() => img.classList.remove('flicker'), 600);
}

function bossDamage(amount, color) {
  if (!amount) return;
  const oldHp = bossState.hp;
  bossState.hp = Math.max(0, bossState.hp - amount);

  // Barre PV graphique
  const hpFill = document.getElementById('qa-combat-hp-fill');
  if (hpFill && bossState.maxHP > 0) {
    const oldPct = (oldHp / bossState.maxHP) * 100;
    const newPct = (bossState.hp / bossState.maxHP) * 100;

    // Ghost gris : delta entre l'ancienne et la nouvelle valeur, fade out
    const hpBar = hpFill.parentElement;
    if (hpBar) {
      const ghost = document.createElement('div');
      ghost.className = 'combat-hp-ghost';
      ghost.style.left  = newPct + '%';
      ghost.style.width = (oldPct - newPct) + '%';
      hpBar.appendChild(ghost);
      setTimeout(() => ghost.remove(), 850);
    }

    hpFill.style.width = newPct + '%';
    hpFill.classList.remove('flash'); void hpFill.offsetWidth; hpFill.classList.add('flash');
  }
  const hpNum = document.getElementById('qa-combat-hp-num');
  if (hpNum) hpNum.textContent = bossState.hp;

  // Popup -X au-dessus du sprite boss
  const spriteBoss = document.getElementById('qa-combat-sprite-boss');
  if (spriteBoss) {
    const pop = document.createElement('span');
    pop.className = 'hud-dmg-pop';
    pop.style.color = color || '#fbbf24';
    pop.textContent = `−${amount}`;
    spriteBoss.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  }

  // Brouillard se dissipe avec les PV (1 = plein, 0 = dégagé)
  const ratio = bossState.maxHP > 0 ? (bossState.hp / bossState.maxHP) : 0;
  _setFog(ratio);
  _setGlow(1 - ratio);

  // Phase II à ≤20% PV (one-shot, le module gère le flag fired)
  if (bossState.hp > 0 && ratio <= 0.20 && typeof window.maybeTriggerPhase2 === 'function') {
    window.maybeTriggerPhase2();
  }

  if (bossState.hp === 0) bossDefeated();
}

function bossReact() {
  // Le boss attaque / l'élève se trompe : Neo recule (placeholder en attendant les vrais VFX étape 3)
  const spriteNeo = document.getElementById('qa-combat-sprite-neo');
  if (spriteNeo) {
    spriteNeo.classList.remove('shake');
    void spriteNeo.offsetWidth;
    spriteNeo.classList.add('shake');
  }
}

function bossDefeated() {
  const spriteBoss = document.getElementById('qa-combat-sprite-boss');
  if (spriteBoss) {
    spriteBoss.classList.add('ko');
    // Après l'anim KO (1.1s), bascule vers le portrait apaisé si dispo.
    if (bossState.imgApaise) {
      setTimeout(function() {
        spriteBoss.classList.remove('ko');
        spriteBoss.style.opacity = '';
        spriteBoss.style.transform = '';
        spriteBoss.classList.add('has-art', 'is-apaise');
        const img = document.createElement('img');
        img.className = 'combat-sprite-art';
        img.src = bossState.imgApaise;
        img.alt = bossState.name + ' (apaisé)';
        img.onerror = function() { spriteBoss.classList.remove('has-art', 'is-apaise'); };
        spriteBoss.textContent = '';
        spriteBoss.appendChild(img);
      }, 1100);
    }
  }
  _setFog(0);
  _setGlow(1);
}

function bossIsDefeated() { return bossState.maxHP > 0 && bossState.hp <= 0; }

function _setFog(ratio) {
  const r = Math.max(0, Math.min(1, ratio));
  const left  = document.getElementById('qa-combat-fog-left');
  const right = document.getElementById('qa-combat-fog-right');
  if (left)  left.style.opacity  = r;
  if (right) right.style.opacity = r;
}

function _setGlow(ratio) {
  const stage = document.getElementById('qa-combat-stage');
  if (stage) stage.style.setProperty('--combat-glow-opacity', Math.max(0, Math.min(1, ratio)));
}

// ─── Bulle de feedback (déléguée au mentor sur l'épaule de Neo) ───
function hudShowFeedbackBubble(opts) {
  if (typeof window.mentorSay !== 'function') return;
  const isCorrect = !!opts.isCorrect;
  const html = `
    <div class="combat-mentor-bubble-title ${isCorrect ? 'ok' : 'ko'}">${isCorrect ? '✓ Touché.' : '✗ Manqué.'}</div>
    ${!isCorrect && opts.correctAnswer ? `<div class="combat-mentor-bubble-answer">✅ ${opts.correctAnswer}</div>` : ''}
    ${opts.explication ? `<div class="combat-mentor-bubble-expl">${opts.explication}</div>` : ''}
  `;
  window.mentorSay(html, { variant: isCorrect ? 'ok' : 'ko', persist: true });
}

function hudHideFeedbackBubble() {
  if (typeof window.mentorHide === 'function') window.mentorHide();
}

window.bossInit              = bossInit;
window.bossDamage            = bossDamage;
window.bossReact             = bossReact;
window.bossDefeated          = bossDefeated;
window.bossIsDefeated        = bossIsDefeated;
window.hudShowFeedbackBubble = hudShowFeedbackBubble;
window.hudHideFeedbackBubble = hudHideFeedbackBubble;
window.hudUpdateEclatCounter = hudUpdateEclatCounter;
window.hudLanternFlicker     = hudLanternFlicker;
