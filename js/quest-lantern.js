// ── Lanterne — composant partagé (vidéo, flashcards, …) ──
// API publique :
//   window.mountLantern(container, chapId, opts) → injecte la colonne lanterne dans `container`
//     opts = { max?: number (défaut 15), label?: string (défaut 'Énergie') }
//   window.addLanternEclats(n) → joue l'anim "+1" n fois (400ms entre chaque) sur la lanterne active
//   window.resetLantern() → recharge l'affichage depuis localStorage pour le chap courant
//   window.getLanternCount() → nombre d'éclats actuels (chap courant)
//
// Persistance : localStorage 'neoquest_lantern_<chapId>'

(function() {
  const LANTERN_IMGS = [
    'img/lantern_0.png',
    'img/lantern_20.png',
    'img/lantern_50.png',
    'img/lantern_75.png',
    'img/lantern_100.png'
  ];
  let LANTERN_MAX = 15;

  let currentChapId = null;
  let currentEclats = 0;
  let currentWrap = null;
  let currentImg = null;
  let currentLabel = null;

  function _imageForEclats(n) {
    const ratio = n / LANTERN_MAX;
    if (n <= 0)       return LANTERN_IMGS[0];
    if (ratio <= 0.3) return LANTERN_IMGS[1];
    if (ratio <= 0.55) return LANTERN_IMGS[2];
    if (ratio <= 0.8) return LANTERN_IMGS[3];
    return LANTERN_IMGS[4];
  }

  function _lanternKey(id) { return `neoquest_lantern_${id}`; }

  function _loadEclats(chapId) {
    try { return Math.max(0, parseInt(localStorage.getItem(_lanternKey(chapId)) || '0', 10)); }
    catch(e) { return 0; }
  }
  function _saveEclats(chapId, n) {
    try { localStorage.setItem(_lanternKey(chapId), String(n)); } catch(e) {}
  }

  function _updateDisplay(n) {
    if (currentImg) currentImg.src = _imageForEclats(n);
    if (currentLabel) currentLabel.textContent = n === 1 ? '1 éclat' : `${n} éclats`;
    if (currentWrap) currentWrap.classList.toggle('lantern-full', n >= LANTERN_MAX);
  }

  function _spawnEclatAnim(onDone) {
    if (!currentWrap) { onDone && onDone(); return; }
    const eclat = document.createElement('img');
    eclat.src = 'img/eclat.png';
    eclat.className = 'qa-eclat-fly';
    eclat.alt = 'éclat';
    eclat.onanimationend = () => { eclat.remove(); onDone && onDone(); };
    currentWrap.appendChild(eclat);
  }

  function _glowLantern() {
    if (!currentImg) return;
    currentImg.classList.remove('glow');
    void currentImg.offsetWidth;
    currentImg.classList.add('glow');
    setTimeout(() => currentImg.classList.remove('glow'), 1100);
  }

  function _earnEclat() {
    if (currentEclats >= LANTERN_MAX) return;
    currentEclats++;
    if (currentChapId) _saveEclats(currentChapId, currentEclats);
    _spawnEclatAnim(() => {
      _updateDisplay(currentEclats);
      _glowLantern();
    });
  }

  window.mountLantern = function(container, chapId, opts) {
    if (!container) return;
    opts = opts || {};
    if (typeof opts.max === 'number') LANTERN_MAX = opts.max;
    const label = opts.label || 'Énergie';

    container.innerHTML = `
      <div class="qa-lantern-wrap">
        <img class="qa-lantern-img" src="${LANTERN_IMGS[0]}" alt="Lanterne"/>
      </div>
      <span class="qa-lantern-label">${label}</span>
      <span class="qa-lantern-pct">0 éclat</span>
    `;
    currentWrap  = container.querySelector('.qa-lantern-wrap');
    currentImg   = container.querySelector('.qa-lantern-img');
    currentLabel = container.querySelector('.qa-lantern-pct');
    currentChapId = chapId;
    currentEclats = _loadEclats(chapId);
    _updateDisplay(currentEclats);
  };

  window.addLanternEclats = function(n) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => _earnEclat(), i * 400);
    }
  };

  window.resetLantern = function() {
    if (currentChapId) {
      currentEclats = _loadEclats(currentChapId);
      _updateDisplay(currentEclats);
    }
  };

  window.getLanternCount = function() { return currentEclats; };
})();
