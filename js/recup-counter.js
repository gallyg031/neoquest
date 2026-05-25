// ── Compteur Successive Relearning (Rawson 2011) ──
// Store léger pour tracker le nombre de récupérations RÉUSSIES CUMULÉES par item.
// Critère mémoire long terme = 3 récups réussies cumulées (+40 à +80 % rétention à 6 mois).
// Voir Specs Pedagogie.md §2.6.
//
// Agnostique de la source : utilisé par mode contrôle, à étendre quiz combat / flashcards / carnet.
//
// API publique (window) :
//   rcInc(chapitreId, questionText)             // +1 (1 séance = 1 incrément max, voir below)
//   rcGet(chapitreId, questionText)             // entier 0..3+ (capé à 3 dans l'usage UI)
//   rcIsConsolide(chapitreId, questionText)     // bool : >= 3 récups réussies
//   rcQid(chapitreId, questionText)             // helper pour build qid (compat carnet d'oublis)
//   rcReset(qid?)                                // reset un item ou tout
//
// Persistance : localStorage 'neoquest_recup_counter'
//   { [qid]: { successes: 0..N, last_success_iso: 'YYYY-MM-DD', first_success_iso: 'YYYY-MM-DD' } }
//
// Règle "1 séance = 1 incrément max" : on n'incrémente pas si la dernière réussite est aujourd'hui
// (sinon, refaire 3 fois la même question dans la même session = item consolidé à tort).
// Réf : Rawson 2011 cible explicitement des séances espacées, pas du massed practice.

(function(){
  var LS_KEY = 'neoquest_recup_counter';
  var TARGET = 3;

  function _todayIso() {
    var d = new Date();
    var m = String(d.getMonth()+1).padStart(2,'0');
    var day = String(d.getDate()).padStart(2,'0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  // djb2 hash (compat avec neo-notebook-store qid)
  function _hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function _load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function _save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
  }

  window.rcQid = function(chapitreId, questionText) {
    if (!chapitreId || !questionText) return null;
    return chapitreId + ':' + _hash(questionText);
  };

  // Incrémente le compteur de récup. Renvoie le nouveau total (ou existant si même jour).
  window.rcInc = function(chapitreId, questionText) {
    var qid = window.rcQid(chapitreId, questionText);
    if (!qid) return 0;
    var data = _load();
    var today = _todayIso();
    var entry = data[qid] || { successes: 0, last_success_iso: null, first_success_iso: null };
    // Anti-massed-practice : 1 incrément max par jour
    if (entry.last_success_iso === today) return entry.successes;
    entry.successes = (entry.successes || 0) + 1;
    if (!entry.first_success_iso) entry.first_success_iso = today;
    entry.last_success_iso = today;
    data[qid] = entry;
    _save(data);
    return entry.successes;
  };

  window.rcGet = function(chapitreId, questionText) {
    var qid = window.rcQid(chapitreId, questionText);
    if (!qid) return 0;
    var data = _load();
    return (data[qid] && data[qid].successes) || 0;
  };

  window.rcIsConsolide = function(chapitreId, questionText) {
    return window.rcGet(chapitreId, questionText) >= TARGET;
  };

  window.rcReset = function(qid) {
    var data = _load();
    if (qid) { delete data[qid]; _save(data); }
    else { try { localStorage.removeItem(LS_KEY); } catch (e) {} }
  };

  // Debug helpers
  window.rcDebug = {
    dump: _load,
    clear: function() { window.rcReset(); },
    target: TARGET,
    today: _todayIso
  };
})();
