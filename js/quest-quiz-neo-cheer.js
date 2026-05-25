// ── Neo cheer — feedback "gagnant" sur bonne réponse ──
// 1) Sprite Neo : lift + glow doré (class .fx-cheer, auto-cleared après l'anim)
// 2) "+N XP" flottant en or au-dessus de Neo (variante --gain)
// 3) Compteur d'éclats : pop scale + flash doré (en plus du flicker lanterne existant)
//
// API publique :
//   neoCheer(opts)         — opts: { xp:number } (défaut 25)
//   eclatCounterFlash()    — Pop le compteur (utilisable seul, par ex. hors cheer)

function neoCheer(opts) {
  opts = opts || {};
  const xp = (typeof opts.xp === 'number') ? opts.xp : 25;
  const sprite = document.getElementById('qa-combat-sprite-neo');
  if (sprite) {
    sprite.classList.remove('fx-cheer');
    void sprite.offsetWidth;
    sprite.classList.add('fx-cheer');
    setTimeout(() => sprite.classList.remove('fx-cheer'), 800);
    _spawnXpFloat(sprite, xp);
  }
  eclatCounterFlash();
}

function _spawnXpFloat(host, xp) {
  const pop = document.createElement('span');
  pop.className = 'combat-xp-gain';
  pop.textContent = `+${xp} XP`;
  host.appendChild(pop);
  setTimeout(() => pop.remove(), 1100);
}

function eclatCounterFlash() {
  const num   = document.getElementById('qa-combat-eclat-num');
  const icon  = document.querySelector('.combat-eclat-icon');
  if (num) {
    num.classList.remove('flash-gold');
    void num.offsetWidth;
    num.classList.add('flash-gold');
    setTimeout(() => num.classList.remove('flash-gold'), 600);
  }
  if (icon) {
    icon.classList.remove('flash-gold');
    void icon.offsetWidth;
    icon.classList.add('flash-gold');
    setTimeout(() => icon.classList.remove('flash-gold'), 600);
  }
}

window.neoCheer          = neoCheer;
window.eclatCounterFlash = eclatCounterFlash;
