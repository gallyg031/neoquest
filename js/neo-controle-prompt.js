// ── Mode contrôle — popup d'annonce à l'entrée du royaume ──
// Si l'enfant a un contrôle actif sur ce royaume avec un palier dû aujourd'hui,
// Neo lui annonce et propose de démarrer la session.
//
// Cap 1×/jour par chapitre (ctrlCanProposeToday / ctrlMarkPropositionShown).
// Coordination avec carnet d'oublis : pose le flag __nqControlePromptToday → carnet skippe.
//
// J-1 (veille du contrôle) = exception : Neo redirige vers les flashcards (pas de quiz).
//
// API publique : ctrlOpenAnnouncePrompt(ctrl, niveau, chap, matiereData)
//
// Dépend de : ctrlGetClosest, ctrlPaliersDus, ctrlCanProposeToday, ctrlMarkPropositionShown,
//             ctrlDaysLeft, ctrlOpenReview, openQuestActivity (flashcards J-1)

(function(){
  var _root = null;

  function _close(skipCooldown) {
    if (_root && _root.parentNode) _root.parentNode.removeChild(_root);
    _root = null;
  }

  function _pickPromptText(bucket, vars) {
    var bank = window.__neoLines && window.__neoLines.controle && window.__neoLines.controle[bucket];
    if (!bank || !bank.length) {
      var fallback = {
        prompt_classic: 'Contrôle ' + vars.chap + ' dans ' + vars.daysLeft + ' jours. On y va ?',
        prompt_rush:    'Contrôle ' + vars.chap + ' dans ' + vars.daysLeft + ' jours. C\'est court, on s\'y met ?',
        prompt_j1:      'Contrôle ' + vars.chap + ' demain. On regarde tes flashcards ?'
      };
      return { text: fallback[bucket] || fallback.prompt_classic, state: 'reflexion' };
    }
    var pick = bank[Math.floor(Math.random() * bank.length)];
    var text = pick.text
      .replace(/\{chap\}/g, vars.chap || 'ce chapitre')
      .replace(/\{daysLeft\}/g, String(vars.daysLeft || ''))
      .replace(/\{palier\}/g, vars.palier || '');
    return { text: text, state: pick.state || 'reflexion' };
  }

  function _injectStyles() {
    if (document.getElementById('cr-prompt-styles')) return;
    var s = document.createElement('style');
    s.id = 'cr-prompt-styles';
    s.textContent = [
      '.crp-overlay{position:fixed;inset:0;background:rgba(8,6,26,0.78);backdrop-filter:blur(6px);z-index:9997;display:flex;align-items:center;justify-content:center;padding:1rem;animation:crpFadeIn .3s ease}',
      '@keyframes crpFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes crpPopIn{from{opacity:0;transform:scale(0.9) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '.crp-card{background:linear-gradient(135deg,#1a1230,#0f0a24);border:1px solid rgba(168,85,247,0.4);border-radius:20px;max-width:440px;width:100%;padding:1.5rem 1.5rem 1.25rem;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(168,85,247,0.18);animation:crpPopIn .35s cubic-bezier(.34,1.56,.64,1)}',
      '.crp-card.is-rush{border-color:rgba(251,146,60,0.5)}',
      '.crp-card.is-j1{border-color:rgba(251,191,36,0.5)}',
      '.crp-neo{width:96px;height:96px;margin:0 auto 0.85rem;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(168,85,247,0.2),transparent 65%);border-radius:50%}',
      '.crp-neo img{width:90px;height:90px;object-fit:contain;filter:drop-shadow(0 0 14px rgba(168,85,247,0.5))}',
      '.crp-badge{display:inline-flex;align-items:center;gap:0.4rem;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:9999px;padding:0.25rem 0.7rem;font-size:0.7rem;font-weight:900;color:#c4b5fd;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.7rem}',
      '.crp-badge.is-rush{background:rgba(251,146,60,0.15);border-color:rgba(251,146,60,0.42);color:#fdba74}',
      '.crp-badge.is-j1{background:rgba(251,191,36,0.15);border-color:rgba(251,191,36,0.42);color:#fde68a}',
      '.crp-text{font-size:1.05rem;font-weight:800;color:#fff;line-height:1.45;margin-bottom:1.1rem;padding:0 0.25rem}',
      '.crp-btns{display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap}',
      '.crp-btn{padding:0.75rem 1.4rem;border-radius:12px;font-weight:900;font-size:0.92rem;cursor:pointer;font-family:inherit;border:none;letter-spacing:0.02em;transition:all .15s}',
      '.crp-btn-primary{background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;box-shadow:0 4px 12px rgba(168,85,247,0.35)}',
      '.crp-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}',
      '.crp-btn-ghost{background:rgba(255,255,255,0.05);color:#cbd5e1;border:1px solid rgba(255,255,255,0.12)}',
      '.crp-btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff}'
    ].join('\n');
    document.head.appendChild(s);
  }

  // Lookup niveau+chap depuis data.js à partir d'un chapId
  function _findChapAndNiveau(matiereId, chapId) {
    var data = window.__neoData;
    if (!data || !data.matieres) return null;
    var mat = data.matieres.find(function(m) { return m.id === matiereId; });
    if (!mat || !mat.niveaux) return null;
    for (var i = 0; i < mat.niveaux.length; i++) {
      var niv = mat.niveaux[i];
      var themes = niv.themes || [];
      for (var j = 0; j < themes.length; j++) {
        var chaps = themes[j].chapitres || [];
        for (var k = 0; k < chaps.length; k++) {
          if (chaps[k].id === chapId) return { chap: chaps[k], niveau: niv, matiere: mat };
        }
      }
    }
    return null;
  }

  // Affiche le popup de proposition (révision ou flashcards selon palier)
  window.ctrlOpenAnnouncePrompt = function(matiereId) {
    if (_root) return;
    if (typeof window.ctrlGetClosest !== 'function') return;
    var ctrl = window.ctrlGetClosest(matiereId);
    if (!ctrl) return;
    var chapId = ctrl.chapitre_id;
    if (!window.ctrlCanProposeToday(chapId)) return;
    var paliers = window.ctrlPaliersDus(chapId);
    if (!paliers.length) return;

    var found = _findChapAndNiveau(matiereId, chapId);
    if (!found) return;
    var chap = found.chap, niveau = found.niveau, mat = found.matiere;
    var daysLeft = window.ctrlDaysLeft(chapId);
    if (daysLeft === null || daysLeft <= 0) return;

    var isJ1 = (daysLeft === 1);
    var isRush = (daysLeft > 1 && daysLeft < 5);
    var palier = paliers[0]; // 1er palier de la liste (le plus haut, à faire en premier)

    var bucket = isJ1 ? 'prompt_j1' : (isRush ? 'prompt_rush' : 'prompt_classic');
    var p = _pickPromptText(bucket, {
      chap: chap.nom_quete || chap.nom,
      daysLeft: daysLeft,
      palier: palier
    });

    _injectStyles();
    _root = document.createElement('div');
    _root.className = 'crp-overlay';
    var modifierClass = isJ1 ? 'is-j1' : (isRush ? 'is-rush' : '');
    var badge = isJ1 ? '🔥 Veille de contrôle' : (isRush ? '⚡ Contrôle proche' : '📅 Mode contrôle');
    var primaryLabel = isJ1 ? 'Ouvrir mes flashcards' : 'On s\'y met';

    _root.innerHTML =
      '<div class="crp-card ' + modifierClass + '" role="dialog" aria-modal="true" aria-label="Neo annonce un contrôle">' +
        '<div class="crp-neo"><img src="img/Neo_assis.png" alt="Neo" /></div>' +
        '<div class="crp-badge ' + modifierClass + '">' + badge + '</div>' +
        '<div class="crp-text"></div>' +
        '<div class="crp-btns">' +
          '<button class="crp-btn crp-btn-ghost" data-action="later">Plus tard</button>' +
          '<button class="crp-btn crp-btn-primary" data-action="start">' + primaryLabel + '</button>' +
        '</div>' +
      '</div>';
    _root.querySelector('.crp-text').textContent = p.text;
    document.body.appendChild(_root);

    _root.querySelector('[data-action="later"]').addEventListener('click', function() {
      if (typeof window.ctrlMarkPropositionShown === 'function') window.ctrlMarkPropositionShown(chapId);
      _close();
    });

    _root.querySelector('[data-action="start"]').addEventListener('click', function() {
      if (typeof window.ctrlMarkPropositionShown === 'function') window.ctrlMarkPropositionShown(chapId);
      _close();
      setTimeout(function() {
        if (isJ1) {
          // J-1 → ouvre les flashcards directement
          if (typeof window.openQuestActivity === 'function') {
            window.openQuestActivity(chap, niveau, mat, 'flashcards');
            // Marque le palier J-1 comme fait dès l'ouverture (cf décision : l'enfant a vu la fiche)
            if (typeof window.ctrlMarkRevisionDone === 'function') {
              window.ctrlMarkRevisionDone(chapId, 'J-1');
            }
          }
        } else {
          // Sinon → ouvre la modale révision
          if (typeof window.ctrlOpenReview === 'function') {
            window.ctrlOpenReview(chap, matiereId, palier, { daysLeft: daysLeft });
          }
        }
      }, 200);
    });
  };

  // Auto-trigger au chargement de royaume.html
  function _autoTrigger() {
    try {
      var url = new URL(window.location.href);
      var matiere = url.searchParams.get('matiere');
      if (!matiere) return;

      // Vérif sync de l'éligibilité (pour poser le flag immédiatement)
      // → permet à neo-notebook-prompt de skipper sa propre annonce
      if (typeof window.ctrlGetClosest === 'function') {
        var ctrl = window.ctrlGetClosest(matiere);
        if (ctrl
            && typeof window.ctrlCanProposeToday === 'function'
            && window.ctrlCanProposeToday(ctrl.chapitre_id)
            && typeof window.ctrlPaliersDus === 'function'
            && window.ctrlPaliersDus(ctrl.chapitre_id).length > 0
            && typeof window.ctrlDaysLeft === 'function'
            && window.ctrlDaysLeft(ctrl.chapitre_id) > 0) {
          window.__nqControlePromptToday = true;
        }
      }

      setTimeout(function() {
        window.ctrlOpenAnnouncePrompt(matiere);
      }, 1000);
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoTrigger);
  } else {
    _autoTrigger();
  }
})();
