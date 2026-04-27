// ── Couche Boss — gameplay combat pour le quiz ──
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .qa-boss-row { display:flex; align-items:center; gap:0.7rem; margin-bottom:0.4rem; }
    .qa-boss-avatar {
      width:46px; height:46px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:1.7rem; line-height:1;
      background:radial-gradient(circle, rgba(244,114,182,0.28), rgba(244,114,182,0.04));
      border:1.5px solid rgba(244,114,182,0.55);
      border-radius:50%;
      box-shadow:0 0 14px rgba(244,114,182,0.35);
      transition:box-shadow 0.3s;
    }
    .qa-boss-avatar.shake { animation:bossShake 0.42s cubic-bezier(.36,.07,.19,.97); }
    .qa-boss-avatar.ko { animation:bossKO 1.1s cubic-bezier(.55,.08,.68,.53) forwards; }
    @keyframes bossShake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-5px) rotate(-4deg)} 30%{transform:translateX(5px) rotate(4deg)} 45%{transform:translateX(-3px)} 60%{transform:translateX(3px)} 80%{transform:translateX(-1px)} }
    @keyframes bossKO { 0%{transform:rotate(0)} 25%{transform:rotate(-15deg) translateY(-6px); filter:drop-shadow(0 0 14px #f472b6);} 60%{transform:rotate(-55deg) translateY(8px); opacity:1} 100%{transform:rotate(-95deg) translateY(60px); opacity:0} }
    .qa-boss-info { flex:1; min-width:0; position:relative; }
    .qa-boss-name { font-size:0.88rem; font-weight:900; color:#fda4af; line-height:1.2; margin-bottom:0.2rem; letter-spacing:0.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .qa-boss-hp-row { display:flex; align-items:center; gap:0.4rem; font-size:0.66rem; color:#94a3b8; font-weight:800; letter-spacing:0.05em; }
    .qa-boss-hp-row strong { color:#fda4af; font-weight:900; font-size:0.78rem; letter-spacing:0; }
    .qa-dmg-pop { position:absolute; right:-2px; top:-4px; font-weight:900; font-size:1.2rem; pointer-events:none; animation:dmgPop 1s cubic-bezier(.22,1,.36,1) forwards; text-shadow:0 0 10px currentColor; z-index:5; }
    @keyframes dmgPop { 0%{transform:translateY(0) scale(0.5);opacity:0} 22%{transform:translateY(-8px) scale(1.3);opacity:1} 100%{transform:translateY(-36px) scale(0.95);opacity:0} }
  `;
  document.head.appendChild(style);
})();

var bossState = { hp: 0, maxHP: 0, name: '', icon: '' };

function bossInit(opts) {
  bossState = {
    hp: opts.maxHP || 0,
    maxHP: opts.maxHP || 0,
    name: opts.name || 'Le Gardien',
    icon: opts.icon || '👹'
  };
  const slot = document.getElementById('qa-quiz-boss');
  if (slot) {
    slot.innerHTML = `
      <div class="qa-boss-row">
        <div class="qa-boss-avatar" id="qa-boss-avatar">${bossState.icon}</div>
        <div class="qa-boss-info">
          <div class="qa-boss-name">${bossState.name}</div>
          <div class="qa-boss-hp-row"><span>PV</span> <strong id="qa-boss-hp-num">${bossState.hp}</strong> <span>/ ${bossState.maxHP}</span></div>
        </div>
      </div>
    `;
  }
}

function bossDamage(amount, color) {
  if (!amount) return;
  bossState.hp = Math.max(0, bossState.hp - amount);
  const num = document.getElementById('qa-boss-hp-num');
  if (num) num.textContent = bossState.hp;
  const info = document.querySelector('#qa-quiz-boss .qa-boss-info');
  if (info) {
    const pop = document.createElement('span');
    pop.className = 'qa-dmg-pop';
    pop.style.color = color || '#22d3ee';
    pop.textContent = `−${amount}`;
    info.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  }
  if (bossState.hp === 0) bossDefeated();
}

function bossReact() {
  const av = document.getElementById('qa-boss-avatar');
  if (!av) return;
  av.classList.remove('shake');
  void av.offsetWidth;
  av.classList.add('shake');
}

function bossDefeated() {
  const av = document.getElementById('qa-boss-avatar');
  if (av) av.classList.add('ko');
}

function bossIsDefeated() { return bossState.maxHP > 0 && bossState.hp <= 0; }

window.bossInit       = bossInit;
window.bossDamage     = bossDamage;
window.bossReact      = bossReact;
window.bossDefeated   = bossDefeated;
window.bossIsDefeated = bossIsDefeated;
