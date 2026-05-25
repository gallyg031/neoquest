// ── Astuce Néo — bulle persistante post-réponse (quiz + flashcards) ──
// Rôle : afficher un truc à retenir, voix Néo, APRÈS que l'enfant a répondu.
// Différent de l'indice (aide avant réponse, déjà géré par neoSetIndice/neoClearIndice).
// Différent du cheer (état affectif éphémère, déjà géré par neoSayFromBank).
//
// API publique :
//   showAstuceNeo(text, opts?)
//     - text : string non vide → bulle persistante, expression 'reflexion'
//     - opts.delayMs (par défaut 2200ms) : laisser le cheer s'achever avant d'afficher
//     - opts.skipIfPersistent (par défaut true) : ne pas écraser une bulle persistante
//       déjà visible (typiquement un indice ouvert)
//
// Garde-fous :
//   - Respecte neoMute (l'astuce n'ignore PAS le mute, contrairement à l'indice).
//   - Si text vide/absent → no-op silencieux (champ optionnel côté data).
//   - Un seul timer en vol à la fois : un nouvel appel annule le précédent.

(function () {
  var _pendingTimer = null;

  function cancelPendingAstuce() {
    if (_pendingTimer) { clearTimeout(_pendingTimer); _pendingTimer = null; }
  }

  function showAstuceNeo(text, opts) {
    cancelPendingAstuce();
    if (!text || typeof text !== 'string' || !text.trim()) return;
    opts = opts || {};
    var delayMs = (typeof opts.delayMs === 'number') ? opts.delayMs : 2200;
    var skipIfPersistent = (opts.skipIfPersistent !== false);

    _pendingTimer = setTimeout(function () {
      _pendingTimer = null;
      if (typeof window.neoSay !== 'function') return;
      if (skipIfPersistent) {
        var bubble = document.getElementById('neo-bubble');
        if (bubble && bubble.classList.contains('persistent') && bubble.classList.contains('visible')) {
          return;
        }
      }
      window.neoSay(text, { persistent: true, state: 'reflexion' });
    }, delayMs);
  }

  window.showAstuceNeo       = showAstuceNeo;
  window.cancelPendingAstuce = cancelPendingAstuce;
})();
