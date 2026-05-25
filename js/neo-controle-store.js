// ── Mode contrôle (Couche 2 espacement) — store + planning rétrograde ──
// Stocke les dates de contrôle saisies par enfant ou parent.
// Planning rétrograde : J-10 (1ʳᵉ récup ciblée) → J-5 → J-2 → J-1 (fiche + flashcards).
// Compression intelligente si date proche : on filtre les paliers ≤ daysLeft.
// Propage les paliers manqués au prochain lancement (pas obsessionnel).
//
// API publique (window) :
//   ctrlAdd(chapitreId, royaumeId, dateIso, saisiePar)
//   ctrlGet(chapitreId)
//   ctrlGetActive()                                 // tous les actifs (statut !== 'archive')
//   ctrlGetClosest(royaumeId?)                      // le plus proche (filtrable par royaume)
//   ctrlPaliersDus(chapitreId, todayIso?)           // ['J-10','J-5'] dus aujourd'hui
//   ctrlDaysLeft(chapitreId, todayIso?)             // entier (peut être négatif)
//   ctrlIsRush(chapitreId, todayIso?)               // daysLeft < 5 à la saisie
//   ctrlIsPast(chapitreId, todayIso?)               // daysLeft <= 0
//   ctrlMarkRevisionDone(chapitreId, palier)        // 'J-5' → consommé
//   ctrlCanProposeToday(chapitreId, todayIso?)      // cap 1×/jour
//   ctrlMarkPropositionShown(chapitreId, todayIso?)
//   ctrlMarkResult(chapitreId, ressenti)            // 'bien'|'moyen'|'dur' → archive
//   ctrlArchive(chapitreId)
//   ctrlRemove(chapitreId)
//
// Persistance : localStorage 'neoquest_controles'
//   { [chapitreId]: {
//       date_iso, royaume_id, saisie_le_iso, saisie_par: 'enfant'|'parent',
//       revisions_faites: ['J-10','J-5'],
//       derniere_proposition_iso, statut: 'actif'|'passe'|'archive',
//       ressenti: null|'bien'|'moyen'|'dur'
//   } }

(function(){
  var LS_KEY = 'neoquest_controles';
  var FULL_PALIERS = [10, 5, 2, 1]; // jours avant le contrôle

  function _todayIso(d) {
    d = d || new Date();
    var m = String(d.getMonth()+1).padStart(2,'0');
    var day = String(d.getDate()).padStart(2,'0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function _daysBetween(fromIso, toIso) {
    // Nombre de jours entiers entre 2 dates locales (ignore l'heure)
    var a = new Date(fromIso + 'T00:00:00');
    var b = new Date(toIso   + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  function _load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function _save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function _get(chapitreId) {
    if (!chapitreId) return null;
    var data = _load();
    return data[chapitreId] || null;
  }

  window.ctrlAdd = function(chapitreId, royaumeId, dateIso, saisiePar) {
    if (!chapitreId || !royaumeId || !dateIso) return null;
    if (!['enfant','parent'].includes(saisiePar)) saisiePar = 'enfant';
    var data = _load();
    var today = _todayIso();
    data[chapitreId] = {
      date_iso: dateIso,
      royaume_id: royaumeId,
      saisie_le_iso: today,
      saisie_par: saisiePar,
      revisions_faites: [],
      derniere_proposition_iso: null,
      statut: 'actif',
      ressenti: null
    };
    _save(data);
    return data[chapitreId];
  };

  window.ctrlGet = _get;

  window.ctrlGetActive = function() {
    var data = _load();
    return Object.keys(data).reduce(function(acc, chapId) {
      if (data[chapId].statut !== 'archive') acc[chapId] = data[chapId];
      return acc;
    }, {});
  };

  window.ctrlGetClosest = function(royaumeId) {
    var active = window.ctrlGetActive();
    var today = _todayIso();
    var best = null;
    var bestDays = Infinity;
    Object.keys(active).forEach(function(chapId) {
      var c = active[chapId];
      if (royaumeId && c.royaume_id !== royaumeId) return;
      var d = _daysBetween(today, c.date_iso);
      if (d < 0) return; // passé
      if (d < bestDays) { bestDays = d; best = Object.assign({chapitre_id: chapId}, c); }
    });
    return best;
  };

  window.ctrlDaysLeft = function(chapitreId, todayIso) {
    var c = _get(chapitreId);
    if (!c) return null;
    return _daysBetween(todayIso || _todayIso(), c.date_iso);
  };

  window.ctrlIsRush = function(chapitreId, todayIso) {
    var c = _get(chapitreId);
    if (!c) return false;
    var atSaisie = _daysBetween(c.saisie_le_iso, c.date_iso);
    return atSaisie > 0 && atSaisie < 5;
  };

  window.ctrlIsPast = function(chapitreId, todayIso) {
    var dl = window.ctrlDaysLeft(chapitreId, todayIso);
    return dl !== null && dl <= 0;
  };

  // Paliers dus à aujourd'hui = palier déclenché (daysLeft <= P) ET pas encore fait.
  // Propage automatiquement les paliers manqués.
  window.ctrlPaliersDus = function(chapitreId, todayIso) {
    var c = _get(chapitreId);
    if (!c || c.statut === 'archive') return [];
    var daysLeft = _daysBetween(todayIso || _todayIso(), c.date_iso);
    if (daysLeft <= 0) return []; // J0 ou passé, plus de révision
    var done = c.revisions_faites || [];
    return FULL_PALIERS
      .filter(function(p) { return daysLeft <= p; })
      .map(function(p) { return 'J-' + p; })
      .filter(function(lbl) { return done.indexOf(lbl) === -1; });
  };

  window.ctrlMarkRevisionDone = function(chapitreId, palier) {
    var data = _load();
    if (!data[chapitreId]) return;
    var done = data[chapitreId].revisions_faites || [];
    if (done.indexOf(palier) === -1) done.push(palier);
    data[chapitreId].revisions_faites = done;
    _save(data);
  };

  window.ctrlCanProposeToday = function(chapitreId, todayIso) {
    var c = _get(chapitreId);
    if (!c || c.statut === 'archive') return false;
    var today = todayIso || _todayIso();
    return c.derniere_proposition_iso !== today;
  };

  window.ctrlMarkPropositionShown = function(chapitreId, todayIso) {
    var data = _load();
    if (!data[chapitreId]) return;
    data[chapitreId].derniere_proposition_iso = todayIso || _todayIso();
    _save(data);
  };

  window.ctrlMarkResult = function(chapitreId, ressenti) {
    if (!['bien','moyen','dur'].includes(ressenti)) return;
    var data = _load();
    if (!data[chapitreId]) return;
    data[chapitreId].ressenti = ressenti;
    data[chapitreId].statut = 'archive';
    _save(data);
  };

  window.ctrlArchive = function(chapitreId) {
    var data = _load();
    if (!data[chapitreId]) return;
    data[chapitreId].statut = 'archive';
    _save(data);
  };

  window.ctrlRemove = function(chapitreId) {
    var data = _load();
    delete data[chapitreId];
    _save(data);
  };

  // Debug helpers
  window.ctrlDebug = {
    dump: function() { return _load(); },
    clear: function() { try { localStorage.removeItem(LS_KEY); } catch (e) {} },
    today: _todayIso,
    daysBetween: _daysBetween,
    fullPaliers: FULL_PALIERS
  };
})();
