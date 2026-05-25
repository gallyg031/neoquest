// ── Catalogue des skins de Neo ──
// Voir Specs Skin.md (section 2-3) pour la sémantique des tons et la hiérarchie.
//
// Schéma d'une entrée :
//   id        : string                — identifiant unique (= nom du dossier img/neo/<id>/)
//   type      : 'core'                — renard neutre, base
//             | 'royaume'             — tenue de royaume (matière)
//             | 'province'            — silhouette de province (année scolaire)
//             | 'gagne'               — skin figé gagné en fin de région (diégétique/identitaire)
//             | 'boutique'            — skin expressif acheté au Bazar du Hibou
//   label     : string                — nom affiché au Vestiaire
//   royaume   : string?               — id du royaume (pour types province/gagne)
//   province  : string?               — id de la province (pour types gagne)
//   region    : string?               — id de la région (pour type gagne uniquement)
//   art       : 'ready' | 'pending'   — 'pending' = art pas encore dessiné (silhouette muette + cartouche "à venir")
//
// Note Phase 1 : seul 'neutre' a son art. Les autres entrées s'ajouteront au fil de l'eau
// (sous-phases 1.2, 1.5, et plus tard royaume par royaume).

(function() {
  window.__neoSkins = {
    'neutre': {
      id: 'neutre',
      type: 'core',
      label: 'Neo',
      art: 'ready'
    }
    // Ajouts à venir :
    // 'historya'        → type: 'royaume',  label: 'Neo explorateur'
    // 'historya-5e'     → type: 'province', label: 'Neo médiéval',  royaume: 'historya'
    // 'historya-5e-T1'  → type: 'gagne',    label: 'Chevalier T1',  royaume: 'historya', province: 'historya-5e', region: 'historya-5e-T1'
  };
})();
