// ── Couche Audio Combat — wrapper sons (placeholder V1) ──
// Route vers soundCorrect / soundWrong existants en attendant les vrais SFX
// (cristallin, impact métallique, sourd, grognement boss, cloche épique).
// API publique :
//   window.audioLaunchEclat()   — Neo lance un éclat (charge de magie)
//   window.audioCriticalHit()   — Impact réussi sur le boss (cristallin + métallique)
//   window.audioMissBoss()      — Miss / mauvaise réponse (sourd + grognement)
//   window.audioBossKO()        — Boss vaincu
//   window.audioVictory()       — Écran de victoire (fanfare)

(function() {
  function _safe(fn) { try { if (typeof fn === 'function') fn(); } catch(e) {} }

  window.audioLaunchEclat = function() {
    // Placeholder V1 : son de "charge" — on n'a pas encore d'asset dédié, silence.
    // À remplacer par un .play() sur un <audio> "magic-charge.mp3".
  };

  window.audioCriticalHit = function() {
    // Placeholder V1 : son cristallin de réussite
    _safe(window.soundCorrect);
  };

  window.audioMissBoss = function() {
    // Placeholder V1 : son sourd + grognement
    _safe(window.soundWrong);
  };

  window.audioBossKO = function() {
    // Placeholder V1 : son de chute boss
    _safe(window.soundCorrect);
  };

  window.audioVictory = function() {
    // Placeholder V1 : fanfare finale (silence pour V1, à brancher sur asset audio)
  };
})();
