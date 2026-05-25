// ── Helper images de quête ──
// Résout les paths boss / panini / loot stockés dans data.js (sans extension).
// Convention : tous les paths sont ajoutés en .png si pas d'extension explicite.
// Retourne null si l'image n'est pas définie pour le chap → l'appelant gère le fallback (emoji/icône).
(function() {
  function pathWithExt(base) {
    if (!base) return null;
    return /\.(png|jpg|jpeg|webp|svg)$/i.test(base) ? base : base + '.png';
  }

  // chap.boss.image_mechant / image_apaise / image_mechant_profil / image_apaise_profil
  window.nqGetBossImg = function(chap, state, profil) {
    if (!chap || !chap.boss) return null;
    var key = 'image_' + (state || 'mechant') + (profil ? '_profil' : '');
    return pathWithExt(chap.boss[key]);
  };

  // chap.boss.panini_mechant / panini_apaise
  window.nqGetPaniniImg = function(chap, state) {
    if (!chap || !chap.boss) return null;
    return pathWithExt(chap.boss['panini_' + (state || 'mechant')]);
  };

  // chap.loot_quete.image
  window.nqGetLootImg = function(chap) {
    if (!chap || !chap.loot_quete) return null;
    return pathWithExt(chap.loot_quete.image);
  };

  // Affiche le loot dans un élément : <img> si dispo, fallback emoji sinon (+ onerror).
  // opts: { size: '2rem', inline: false }
  window.nqRenderLoot = function(targetEl, chap, opts) {
    if (!targetEl || !chap || !chap.loot_quete) return;
    opts = opts || {};
    var size  = opts.size  || '2rem';
    var emoji = chap.loot_quete.emoji || '🎁';
    var path  = window.nqGetLootImg(chap);
    targetEl.textContent = '';
    if (path) {
      var img = document.createElement('img');
      img.src = path;
      img.alt = chap.loot_quete.nom || '';
      img.style.cssText =
        'width:' + size + ';height:' + size + ';' +
        'object-fit:contain;' +
        (opts.inline ? 'display:inline-block;vertical-align:middle;' : 'display:block;margin:0 auto;');
      img.onerror = function() { targetEl.textContent = emoji; };
      targetEl.appendChild(img);
    } else {
      targetEl.textContent = emoji;
    }
  };
})();
