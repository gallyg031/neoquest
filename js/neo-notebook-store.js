// ── Carnet d'oublis de Neo — store ──
// Stocke les questions ratées au quiz combat. Neo propose une mini-révision
// à l'entrée du royaume (max 1×/jour/royaume, si carnet >= 3).
//
// API publique (window) :
//   nbAdd(chapitreId, royaumeId, failedQs)
//   nbCountForRoyaume(royaumeId)
//   nbCanPrompt(royaumeId)           // true si >=3 oublis et pas déjà prompté aujourd'hui
//   nbPickReview(royaumeId, n=3)     // pick les n plus anciens
//   nbMarkSuccess(qid)               // sort la question du carnet
//   nbMarkPromptShown(royaumeId)     // pose timestamp aujourd'hui (cooldown)
//
// Persistance : localStorage 'neoquest_neo_notebook'
//   { items: { [qid]: { qid, ch_id, royaume_id, snapshot, added_at, fail_count } },
//     last_prompted: { [royaume_id]: 'YYYY-MM-DD' } }

(function(){
  const LS_KEY = 'neoquest_neo_notebook';
  const MIN_TO_PROMPT = 3;

  function _today() {
    const d = new Date();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  // Hash simple djb2 → string court stable
  function _hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function _load() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch { return {}; }
  }
  function _save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
  }
  function _ensure(data) {
    if (!data.items) data.items = {};
    if (!data.last_prompted) data.last_prompted = {};
    return data;
  }

  function _qid(chapitreId, questionText) {
    return chapitreId + ':' + _hash(questionText);
  }

  function _snapshot(q) {
    return {
      question: q.question,
      choix: q.choix,
      bonne_reponse: q.bonne_reponse,
      indice: q.indice || '',
      explication: q.explication || '',
      difficulte: q.difficulte || ''
    };
  }

  window.nbAdd = function(chapitreId, royaumeId, failedQs) {
    if (!chapitreId || !royaumeId || !Array.isArray(failedQs) || !failedQs.length) return 0;
    const data = _ensure(_load());
    const nowIso = new Date().toISOString();
    let added = 0;
    failedQs.forEach(q => {
      if (!q || !q.question) return;
      const qid = _qid(chapitreId, q.question);
      if (data.items[qid]) {
        // Déjà dans le carnet → on incrémente fail_count
        data.items[qid].fail_count = (data.items[qid].fail_count || 1) + 1;
      } else {
        data.items[qid] = {
          qid, ch_id: chapitreId, royaume_id: royaumeId,
          snapshot: _snapshot(q),
          added_at: nowIso, fail_count: 1
        };
        added++;
      }
    });
    _save(data);
    return added;
  };

  window.nbCountForRoyaume = function(royaumeId) {
    if (!royaumeId) return 0;
    const data = _ensure(_load());
    return Object.values(data.items).filter(it => it.royaume_id === royaumeId).length;
  };

  window.nbCanPrompt = function(royaumeId) {
    if (!royaumeId) return false;
    const data = _ensure(_load());
    const count = Object.values(data.items).filter(it => it.royaume_id === royaumeId).length;
    if (count < MIN_TO_PROMPT) return false;
    const last = data.last_prompted[royaumeId];
    return last !== _today();
  };

  window.nbPickReview = function(royaumeId, n) {
    n = n || 3;
    if (!royaumeId) return [];
    const data = _ensure(_load());
    const items = Object.values(data.items)
      .filter(it => it.royaume_id === royaumeId)
      .sort((a, b) => (a.added_at || '').localeCompare(b.added_at || ''));
    return items.slice(0, n);
  };

  // Successive Relearning (Rawson 2011) : la question sort du carnet UNIQUEMENT
  // si elle est consolidée (3 récups réussies cumulées sur séances espacées).
  // Une seule réussite ne suffit plus — l'enfant peut deviner ou avoir compris
  // un truc dans la session sans vrai ancrage long terme.
  // Si rcGet n'est pas dispo (recup-counter.js pas chargé), fallback legacy 1/1.
  window.nbMarkSuccess = function(qid) {
    if (!qid) return;
    const data = _ensure(_load());
    const item = data.items[qid];
    if (!item) return;
    if (typeof window.rcGet === 'function' && item.ch_id && item.snapshot && item.snapshot.question) {
      const successes = window.rcGet(item.ch_id, item.snapshot.question);
      if (successes < 3) {
        // Pas encore consolidé : on garde dans le carnet, on note la dernière réussite
        item.last_review_success = new Date().toISOString();
        _save(data);
        return;
      }
    }
    // Consolidé OU fallback legacy → sortie définitive
    delete data.items[qid];
    _save(data);
  };

  window.nbMarkPromptShown = function(royaumeId) {
    if (!royaumeId) return;
    const data = _ensure(_load());
    data.last_prompted[royaumeId] = _today();
    _save(data);
  };

  // Debug helpers (console)
  window.nbDebug = {
    dump: () => _load(),
    clear: () => { try { localStorage.removeItem(LS_KEY); } catch {} },
    minToPrompt: MIN_TO_PROMPT
  };
})();
