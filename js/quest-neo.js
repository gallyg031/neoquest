// ── Composant Neo (compagnon / sidekick) — partagé entre toutes les modales ──
// Expose : mountNeo, neoSay, neoSetExpression, neoMute, neoIsMuted,
//          neoStartIdleWatch, neoStopIdleWatch, unmountNeo, neoSayFromBank
//
// Usage minimal :
//   mountNeo(hostContainer, { context: 'flashcards' });
//   neoSayFromBank('flashcards', 'intro', { total: 10 });
//   neoSetExpression('succes', { autoRevertAfter: 1500 });
//   neoMute(true);     // global persistant
//
// Le composant ne modifie pas le DOM du parent : il s'injecte dans le container donné.

(function() {
  var NEO_STATES = ['neutre', 'reflexion', 'succes', 'oups', 'combat'];
  var NEO_MUTE_KEY = 'neoquest_neo_muted';

  var _neoRoot = null;
  var _avatarEl = null;
  var _imgEl = null;
  var _muteBtnEl = null;
  var _bubbleEl = null;
  var _bubbleHideTimer = null;
  var _expressionTimer = null;
  var _idleTimer = null;
  var _idleMs = 0;
  var _idleCb = null;
  var _indiceText = null;          // texte d'indice en attente (null = pas d'indice dispo)
  var _bubblePersistent = false;   // bulle actuelle persistante (clic pour fermer)

  // ── Mute global persisté ──
  function neoIsMuted() {
    try { return localStorage.getItem(NEO_MUTE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function neoMute(on) {
    try { localStorage.setItem(NEO_MUTE_KEY, on ? '1' : '0'); } catch (e) {}
    if (_avatarEl) _avatarEl.classList.toggle('muted', !!on);
    if (_muteBtnEl) {
      _muteBtnEl.textContent = on ? '🔇' : '🔊';
      _muteBtnEl.setAttribute('aria-label', on ? 'Activer Neo' : 'Mettre Neo en sourdine');
      _muteBtnEl.title = on ? 'Activer Neo' : 'Silence, Neo !';
    }
    if (on && _bubbleEl) _hideBubble();
  }

  // ── Expression (change l'image affichée) ──
  // Pour l'instant : visuel unique (NeoHist5.2.png) pour tous les états.
  // La différenciation visuelle se fait via la couleur de bordure de l'avatar (CSS data-state).
  // Quand les vraies images d'expressions seront prêtes, remplacer par :
  //   return 'img/neo/neo-' + state + '.svg';   // ou .png
  function _imgFor(state) {
    if (NEO_STATES.indexOf(state) === -1) state = 'neutre';
    return 'img/NeoHist5.2.png';
  }
  function neoSetExpression(state, opts) {
    if (!_imgEl || !_avatarEl) return;
    opts = opts || {};
    state = (NEO_STATES.indexOf(state) >= 0) ? state : 'neutre';
    _imgEl.src = _imgFor(state);
    _avatarEl.setAttribute('data-state', state);
    if (_expressionTimer) { clearTimeout(_expressionTimer); _expressionTimer = null; }
    if (opts.autoRevertAfter && state !== 'neutre') {
      _expressionTimer = setTimeout(function() {
        if (_imgEl && _avatarEl) {
          _imgEl.src = _imgFor('neutre');
          _avatarEl.setAttribute('data-state', 'neutre');
        }
      }, opts.autoRevertAfter);
    }
  }

  // ── Bulle de dialogue ──
  function _hideBubble() {
    if (_bubbleHideTimer) { clearTimeout(_bubbleHideTimer); _bubbleHideTimer = null; }
    if (_bubbleEl) {
      _bubbleEl.classList.remove('visible');
      _bubbleEl.classList.remove('persistent');
    }
    _bubblePersistent = false;
  }
  function neoSay(text, opts) {
    if (!_bubbleEl || !_avatarEl) return;
    opts = opts || {};
    // Le mute peut être ignoré pour les indices (demande active de l'enfant).
    if (neoIsMuted() && !opts.ignoreMute) return;
    if (opts.state) neoSetExpression(opts.state);
    _bubbleEl.textContent = text;
    _bubbleEl.classList.add('visible');
    _bubbleEl.classList.toggle('persistent', !!opts.persistent);
    _bubblePersistent = !!opts.persistent;
    _avatarEl.classList.remove('bounce');
    void _avatarEl.offsetWidth;
    _avatarEl.classList.add('bounce');
    if (_bubbleHideTimer) { clearTimeout(_bubbleHideTimer); _bubbleHideTimer = null; }
    if (!opts.persistent) {
      var duration = opts.duration || Math.max(2500, text.length * 60);
      _bubbleHideTimer = setTimeout(_hideBubble, duration);
    }
  }

  // ── Indice (Mode Murmure) ──
  // L'enfant clique sur Neo → la bulle affiche l'indice, persistant, ignore le mute.
  function neoSetIndice(text) {
    _indiceText = text || null;
    if (_avatarEl) _avatarEl.classList.toggle('has-indice', !!_indiceText);
  }
  function neoClearIndice() {
    _indiceText = null;
    if (_avatarEl) _avatarEl.classList.remove('has-indice');
    // Si la bulle actuelle est l'indice persistant, on la ferme aussi
    if (_bubblePersistent) _hideBubble();
  }
  function _onAvatarClick() {
    if (!_indiceText) return;
    neoSetExpression('reflexion');
    neoSay(_indiceText, { persistent: true, ignoreMute: true, state: 'reflexion' });
  }

  // ── Banque de répliques ──
  function _interpolate(tpl, vars) {
    if (!vars) return tpl;
    return tpl.replace(/\{(\w+)\}/g, function(_, k) {
      return (vars[k] !== undefined && vars[k] !== null) ? vars[k] : '';
    });
  }
  function neoSayFromBank(context, bucket, vars) {
    var bank = window.__neoLines && window.__neoLines[context];
    if (!bank || !bank[bucket] || !bank[bucket].length) return;
    var arr = bank[bucket];
    var pick = arr[Math.floor(Math.random() * arr.length)];
    neoSay(_interpolate(pick.text, vars), { state: pick.state });
  }

  // ── Détection d'inactivité ──
  function _resetIdle() {
    if (_idleTimer) { clearTimeout(_idleTimer); _idleTimer = null; }
    if (_idleMs > 0 && _idleCb) {
      _idleTimer = setTimeout(function() {
        try { _idleCb(); } catch (e) {}
      }, _idleMs);
    }
  }
  function _onUserActivity() { _resetIdle(); }
  function neoStartIdleWatch(ms, cb) {
    neoStopIdleWatch();
    _idleMs = ms || 15000;
    _idleCb = cb;
    document.addEventListener('click', _onUserActivity, true);
    document.addEventListener('keydown', _onUserActivity, true);
    document.addEventListener('touchstart', _onUserActivity, true);
    _resetIdle();
  }
  function neoStopIdleWatch() {
    if (_idleTimer) { clearTimeout(_idleTimer); _idleTimer = null; }
    _idleMs = 0; _idleCb = null;
    document.removeEventListener('click', _onUserActivity, true);
    document.removeEventListener('keydown', _onUserActivity, true);
    document.removeEventListener('touchstart', _onUserActivity, true);
  }

  // ── Mount / unmount ──
  // Neo est un singleton fixe dans le viewport.
  // Auto-monté sur DOMContentLoaded ; rarement appelé explicitement.
  function mountNeo(host, opts) {
    opts = opts || {};
    if (_neoRoot) {
      // Déjà monté : on met juste à jour le contexte
      _neoRoot.setAttribute('data-neo-context', opts.context || '');
      return;
    }
    host = host || document.body;
    _neoRoot = document.createElement('div');
    _neoRoot.className = 'neo-host';
    _neoRoot.setAttribute('data-neo-context', opts.context || '');
    _neoRoot.innerHTML =
      '<div class="neo-bubble" id="neo-bubble"></div>' +
      '<div class="neo-avatar" data-state="neutre" title="Clique pour un indice">' +
        '<img alt="Neo" src="' + _imgFor('neutre') + '" />' +
        '<div class="neo-indice-badge" aria-hidden="true">💡</div>' +
        '<button class="neo-mute" type="button" aria-label="Mettre Neo en sourdine" title="Silence, Neo !">🔊</button>' +
      '</div>';
    host.appendChild(_neoRoot);
    _avatarEl  = _neoRoot.querySelector('.neo-avatar');
    _imgEl     = _neoRoot.querySelector('.neo-avatar img');
    _muteBtnEl = _neoRoot.querySelector('.neo-mute');
    _bubbleEl  = _neoRoot.querySelector('.neo-bubble');
    _muteBtnEl.addEventListener('click', function(e) {
      e.stopPropagation();
      neoMute(!neoIsMuted());
    });
    _avatarEl.addEventListener('click', _onAvatarClick);
    // Clic sur la bulle persistante → on la ferme (indice consulté)
    _bubbleEl.addEventListener('click', function() {
      if (_bubblePersistent) _hideBubble();
    });
    // Sync visuel avec l'état persistant
    neoMute(neoIsMuted());
  }
  function unmountNeo() {
    neoStopIdleWatch();
    if (_expressionTimer) { clearTimeout(_expressionTimer); _expressionTimer = null; }
    if (_bubbleHideTimer) { clearTimeout(_bubbleHideTimer); _bubbleHideTimer = null; }
    if (_neoRoot && _neoRoot.parentNode) _neoRoot.parentNode.removeChild(_neoRoot);
    _neoRoot = _avatarEl = _imgEl = _muteBtnEl = _bubbleEl = null;
  }

  // Reset léger entre deux contextes (sortie d'une modale) : Neo reste monté,
  // mais on coupe la bulle, l'idle watch, l'indice, et on remet l'expression à neutre.
  function neoReset() {
    neoStopIdleWatch();
    if (_expressionTimer) { clearTimeout(_expressionTimer); _expressionTimer = null; }
    _hideBubble();
    neoClearIndice();
    neoSetExpression('neutre');
    if (_neoRoot) _neoRoot.setAttribute('data-neo-context', '');
  }

  // Auto-mount au chargement de la page (singleton dans le viewport)
  function _autoMount() {
    if (_neoRoot) return;
    mountNeo(document.body, {});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoMount);
  } else {
    _autoMount();
  }

  window.mountNeo            = mountNeo;
  window.unmountNeo          = unmountNeo;
  window.neoReset            = neoReset;
  window.neoSay              = neoSay;
  window.neoSayFromBank      = neoSayFromBank;
  window.neoSetExpression    = neoSetExpression;
  window.neoSetIndice        = neoSetIndice;
  window.neoClearIndice      = neoClearIndice;
  window.neoMute             = neoMute;
  window.neoIsMuted          = neoIsMuted;
  window.neoStartIdleWatch   = neoStartIdleWatch;
  window.neoStopIdleWatch    = neoStopIdleWatch;
})();
