// ── Logique de tenue de Neo ──
// Voir Specs Skin.md section 4 pour la règle d'affichage par lieu.
//
// Expose :
//   neoApplyOutfit()              → calcule le skin attendu (mode + lieu) et appelle neoSetSkin
//   neoGetCurrentLieu()           → lit le lieu courant depuis <body data-lieu=...>
//   neoGetOutfit() / neoSetOutfit(obj) → lit/écrit la préférence d'équipement (localStorage)
//
// Le détecteur de lieu lit ces attributs sur <body> :
//   data-lieu       = 'phare' | 'map-royaume' | 'map-province' | 'map-region'
//                   | 'arene' | 'salle-prep' | 'grenier' | 'boutique' | 'vestiaire'
//   data-royaume    (pour map-royaume / map-province / map-region / arene / salle-prep)
//   data-province   (pour map-province / map-region / arene / salle-prep)
//   data-region     (pour map-region / arene / salle-prep)
//
// Sur royaume.html, ces attributs peuvent être mis à jour dynamiquement par JS
// quand la vue change (royaume → province → région), puis neoApplyOutfit() rappelé.

(function() {
  var OUTFIT_KEY = 'neoquest_outfit';
  var DEFAULT_OUTFIT = { mode: 'auto', skin: null };

  function neoGetOutfit() {
    try {
      var raw = localStorage.getItem(OUTFIT_KEY);
      if (!raw) return { mode: DEFAULT_OUTFIT.mode, skin: DEFAULT_OUTFIT.skin };
      var obj = JSON.parse(raw);
      return {
        mode: (obj && obj.mode === 'manual') ? 'manual' : 'auto',
        skin: (obj && obj.skin) ? String(obj.skin) : null
      };
    } catch (e) {
      return { mode: DEFAULT_OUTFIT.mode, skin: DEFAULT_OUTFIT.skin };
    }
  }
  function neoSetOutfit(next) {
    var safe = {
      mode: (next && next.mode === 'manual') ? 'manual' : 'auto',
      skin: (next && next.skin) ? String(next.skin) : null
    };
    try { localStorage.setItem(OUTFIT_KEY, JSON.stringify(safe)); } catch (e) {}
    return safe;
  }

  function neoGetCurrentLieu() {
    var body = document.body || {};
    return {
      lieu:     body.getAttribute ? (body.getAttribute('data-lieu')     || '') : '',
      royaume:  body.getAttribute ? (body.getAttribute('data-royaume')  || '') : '',
      province: body.getAttribute ? (body.getAttribute('data-province') || '') : '',
      region:   body.getAttribute ? (body.getAttribute('data-region')   || '') : ''
    };
  }

  // ── Règle auto : lieu → skin id attendu ──
  // Voir Specs Skin.md section 4 "Mode auto".
  function _autoSkinFor(loc) {
    switch (loc.lieu) {
      case 'map-royaume':
        return loc.royaume || 'neutre';
      case 'map-province':
      case 'map-region':
      case 'arene':
      case 'salle-prep':
        return loc.province || loc.royaume || 'neutre';
      case 'phare':
      case 'grenier':
      case 'boutique':
      case 'vestiaire':
      case '':
      default:
        return 'neutre';
    }
  }

  // Vérifie qu'un skin existe dans le catalogue. Si non, fallback 'neutre'.
  // (Évite de pointer vers un dossier img/neo/<skin>/ inexistant tant que l'art n'est pas livré.)
  function _resolveSkin(skinId) {
    var cat = window.__neoSkins || {};
    if (skinId && cat[skinId] && cat[skinId].art === 'ready') return skinId;
    return 'neutre';
  }

  function neoApplyOutfit() {
    if (typeof window.neoSetSkin !== 'function') return;
    var outfit = neoGetOutfit();
    var target;
    if (outfit.mode === 'manual' && outfit.skin) {
      // Mode manuel : skin choisi porté partout, sauf au Grenier qui force le neutre.
      var loc = neoGetCurrentLieu();
      target = (loc.lieu === 'grenier') ? 'neutre' : outfit.skin;
    } else {
      target = _autoSkinFor(neoGetCurrentLieu());
    }
    window.neoSetSkin(_resolveSkin(target));
  }

  window.neoGetOutfit       = neoGetOutfit;
  window.neoSetOutfit       = neoSetOutfit;
  window.neoGetCurrentLieu  = neoGetCurrentLieu;
  window.neoApplyOutfit     = neoApplyOutfit;

  // Hook au chargement : applique la tenue après que quest-neo.js ait monté Neo.
  // Les deux scripts écoutent DOMContentLoaded ; l'ordre d'attache (script-order)
  // garantit que mountNeo s'exécute avant neoApplyOutfit.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', neoApplyOutfit);
  } else {
    neoApplyOutfit();
  }
})();
