// ── Mode contrôle — mixer de questions par palier ──
// Sélectionne N questions selon le palier (J-10 / J-5 / J-2).
// Priorise les items fragiles : carnet d'oublis prio, puis non-consolidées (rcGet < 3),
// puis (rare) consolidées (rcGet >= 3) pour entretien si manque de matière.
//
// Voir Specs Pedagogie.md §2.6 (Rawson 2011 : 3 récups cumulées = cible).
//
// API publique (window) :
//   ctrlMixForPalier(chap, palier) → array de questions {question, choix, bonne_reponse, ...}
//
// Dépend de : rcGet (recup-counter.js), nbDebug.dump (neo-notebook-store.js, lecture seule)

(function(){
  var N_BY_PALIER = { 'J-10': 5, 'J-5': 6, 'J-2': 8 };
  // Ratio carnet / non-carnet par palier (% carnet)
  var CARNET_RATIO = { 'J-10': 1.0, 'J-5': 0.6, 'J-2': 0.5 };

  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // Récupère les items du carnet d'oublis pour un chapitre.
  // Retourne array de questions au format snapshot.
  function _carnetItemsForChap(chapId) {
    if (typeof window.nbDebug !== 'object' || typeof window.nbDebug.dump !== 'function') return [];
    var dump = window.nbDebug.dump();
    if (!dump || !dump.items) return [];
    var out = [];
    Object.keys(dump.items).forEach(function(qid) {
      var it = dump.items[qid];
      if (it.ch_id === chapId && it.snapshot && it.snapshot.question) {
        out.push({
          question: it.snapshot.question,
          choix: it.snapshot.choix,
          bonne_reponse: it.snapshot.bonne_reponse,
          indice: it.snapshot.indice,
          explication: it.snapshot.explication,
          difficulte: it.snapshot.difficulte,
          _source: 'carnet'
        });
      }
    });
    return out;
  }

  // Helper : nombre de récups réussies sur cette question
  function _recups(chapId, q) {
    if (typeof window.rcGet !== 'function') return 0;
    return window.rcGet(chapId, q.question);
  }

  // Trie les questions par fragilité décroissante (priorité = items à 0 récup d'abord)
  function _sortByFragilite(qs, chapId) {
    return qs.slice().sort(function(a, b) {
      return _recups(chapId, a) - _recups(chapId, b);
    });
  }

  window.ctrlMixForPalier = function(chap, palier) {
    if (!chap || !chap.quiz || !chap.quiz.length) return [];
    var n = N_BY_PALIER[palier] || 6;
    var ratio = CARNET_RATIO[palier] !== undefined ? CARNET_RATIO[palier] : 0.6;

    // Source 1 : carnet d'oublis pour ce chapitre
    var carnet = _carnetItemsForChap(chap.id);

    // Source 2 : questions du chapitre PAS dans le carnet (= acquises présumées)
    var carnetTexts = {};
    carnet.forEach(function(q) { carnetTexts[q.question] = true; });
    var nonCarnet = chap.quiz
      .filter(function(q) { return !carnetTexts[q.question]; })
      .map(function(q) { return Object.assign({}, q, { _source: 'non_carnet' }); });

    // Cap consolidées : si une question est rcGet >= 3, basse priorité (entretien seulement)
    var nonCarnetFragile = nonCarnet.filter(function(q) { return _recups(chap.id, q) < 3; });
    var nonCarnetConsolide = nonCarnet.filter(function(q) { return _recups(chap.id, q) >= 3; });

    // Tri carnet par fragilité (items à 0 récup en premier)
    var carnetSorted = _sortByFragilite(carnet, chap.id);
    var nonCarnetSorted = _sortByFragilite(nonCarnetFragile, chap.id);

    // Calcul des quotas
    var nCarnet = Math.min(carnetSorted.length, Math.round(n * ratio));
    var nNonCarnet = Math.min(nonCarnetSorted.length, n - nCarnet);

    // Si le carnet est trop petit, on rebascule sur non_carnet pour combler
    if (nCarnet + nNonCarnet < n) {
      var manque = n - (nCarnet + nNonCarnet);
      var resteNonCarnet = nonCarnetSorted.length - nNonCarnet;
      var supplement = Math.min(manque, resteNonCarnet);
      nNonCarnet += supplement;
    }

    // Saturation extrême : si toujours pas assez, ajoute les consolidées (entretien)
    var picked = carnetSorted.slice(0, nCarnet)
      .concat(_shuffle(nonCarnetSorted).slice(0, nNonCarnet));
    if (picked.length < n && nonCarnetConsolide.length) {
      picked = picked.concat(_shuffle(nonCarnetConsolide).slice(0, n - picked.length));
    }

    // Shuffle final pour ne pas afficher tout le carnet d'abord
    return _shuffle(picked);
  };

  // Debug
  window.ctrlMixDebug = {
    inspect: function(chap, palier) {
      var carnet = _carnetItemsForChap(chap.id);
      return {
        chap_id: chap.id,
        palier: palier,
        n_target: N_BY_PALIER[palier],
        ratio_carnet: CARNET_RATIO[palier],
        quiz_total: (chap.quiz || []).length,
        carnet_count: carnet.length,
        carnet_recups: carnet.map(function(q) { return { q: q.question.slice(0,40), r: _recups(chap.id, q) }; })
      };
    }
  };
})();
