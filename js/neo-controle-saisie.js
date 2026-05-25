// ── Mode contrôle — bouton sur le panneau de quête + modale de saisie ──
// Encart "📅 Contrôle" injecté en bas du panneau qp-selected quand une quête
// est sélectionnée. Affiche le statut courant (saisir / dans Xj / passé).
//
// API publique (window) :
//   ctrlMountInPanel(chap, royaumeId, regionColor) — appelé par royaume-map.js
//   ctrlOpenSaisieModal(chap, royaumeId, regionColor)
//
// Dépend de : ctrlGet, ctrlAdd, ctrlDaysLeft, ctrlIsRush, ctrlIsPast,
//             ctrlPaliersDus, ctrlRemove, ctrlDebug.today

(function(){
  var _modalRoot = null;

  function _todayIso() {
    return window.ctrlDebug ? window.ctrlDebug.today() : new Date().toISOString().slice(0,10);
  }

  function _injectStyles() {
    if (document.getElementById('ctrl-saisie-styles')) return;
    var s = document.createElement('style');
    s.id = 'ctrl-saisie-styles';
    s.textContent = [
      // Encart dans le panneau
      '.ctrl-panel-box{margin-top:0.85rem;padding:0.75rem 0.85rem;border-radius:0.85rem;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.28);display:flex;align-items:center;gap:0.7rem;flex-wrap:wrap}',
      '.ctrl-panel-box.is-rush{background:rgba(251,146,60,0.10);border-color:rgba(251,146,60,0.42)}',
      '.ctrl-panel-box.is-past{background:rgba(100,116,139,0.10);border-color:rgba(100,116,139,0.30);opacity:0.85}',
      '.ctrl-panel-icon{font-size:1.4rem;line-height:1;flex-shrink:0}',
      '.ctrl-panel-text{flex:1;min-width:120px;font-size:0.78rem;line-height:1.3;color:#cbd5e1;font-weight:700}',
      '.ctrl-panel-text strong{color:#fff;font-weight:900}',
      '.ctrl-panel-text .ctrl-days{display:inline-block;background:rgba(168,85,247,0.25);color:#fff;border-radius:9999px;padding:1px 9px;font-weight:900;letter-spacing:0.02em;margin:0 2px}',
      '.ctrl-panel-text.is-rush .ctrl-days{background:rgba(251,146,60,0.35)}',
      '.ctrl-panel-actions{display:flex;gap:0.35rem;flex-wrap:wrap}',
      '.ctrl-panel-btn{padding:0.4rem 0.75rem;border-radius:0.55rem;font-weight:800;font-size:0.72rem;cursor:pointer;font-family:inherit;border:none;letter-spacing:0.02em;transition:all .15s;white-space:nowrap}',
      '.ctrl-panel-btn-primary{background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;box-shadow:0 2px 8px rgba(168,85,247,0.30)}',
      '.ctrl-panel-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}',
      '.ctrl-panel-btn-ghost{background:rgba(255,255,255,0.06);color:#cbd5e1;border:1px solid rgba(255,255,255,0.12)}',
      '.ctrl-panel-btn-ghost:hover{background:rgba(255,255,255,0.10);color:#fff}',

      // Modale de saisie
      '.ctrl-overlay{position:fixed;inset:0;background:rgba(8,6,26,0.78);backdrop-filter:blur(6px);z-index:9996;display:flex;align-items:center;justify-content:center;padding:1rem;animation:ctrlFadeIn .25s ease}',
      '@keyframes ctrlFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes ctrlPopIn{from{opacity:0;transform:scale(0.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '.ctrl-card{background:linear-gradient(135deg,#1a1230,#0f0a24);border:1px solid rgba(168,85,247,0.4);border-radius:18px;max-width:440px;width:100%;padding:1.3rem 1.4rem 1.15rem;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(168,85,247,0.18);animation:ctrlPopIn .3s cubic-bezier(.34,1.56,.64,1);position:relative}',
      '.ctrl-card-close{position:absolute;top:0.55rem;right:0.7rem;background:none;border:none;color:#94a3b8;font-size:1.4rem;font-weight:700;cursor:pointer;line-height:1;padding:0.2rem 0.4rem;border-radius:0.4rem}',
      '.ctrl-card-close:hover{color:#fff;background:rgba(255,255,255,0.06)}',
      '.ctrl-card-badge{display:inline-flex;align-items:center;gap:0.4rem;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:9999px;padding:0.22rem 0.7rem;font-size:0.66rem;font-weight:900;color:#c4b5fd;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.65rem}',
      '.ctrl-card-title{font-size:1.05rem;font-weight:900;color:#fff;line-height:1.3;margin-bottom:0.25rem}',
      '.ctrl-card-sub{font-size:0.78rem;color:#cbd5e1;line-height:1.4;margin-bottom:0.95rem}',
      '.ctrl-card-sub strong{color:#fff}',
      '.ctrl-field{margin-bottom:0.85rem}',
      '.ctrl-label{display:block;font-size:0.72rem;font-weight:900;color:#a78bfa;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.35rem}',
      '.ctrl-date{width:100%;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.14);border-radius:0.6rem;padding:0.6rem 0.7rem;color:#fff;font-size:0.95rem;font-weight:700;font-family:inherit;color-scheme:dark}',
      '.ctrl-date:focus{outline:none;border-color:#a855f7;box-shadow:0 0 0 3px rgba(168,85,247,0.18)}',
      '.ctrl-radio-row{display:flex;gap:0.45rem}',
      '.ctrl-radio{flex:1;cursor:pointer;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.12);border-radius:0.6rem;padding:0.55rem 0.6rem;text-align:center;font-weight:800;font-size:0.82rem;color:#cbd5e1;transition:all .15s}',
      '.ctrl-radio:hover{border-color:rgba(168,85,247,0.4);color:#fff}',
      '.ctrl-radio.is-active{background:rgba(168,85,247,0.18);border-color:#a855f7;color:#fff;box-shadow:0 0 0 2px rgba(168,85,247,0.18)}',
      '.ctrl-feedback{font-size:0.74rem;font-weight:700;color:#fbbf24;margin-top:0.55rem;min-height:1em}',
      '.ctrl-feedback.is-error{color:#f87171}',
      '.ctrl-btn-row{display:flex;gap:0.5rem;justify-content:flex-end;margin-top:1rem}',
      '.ctrl-btn{padding:0.6rem 1.1rem;border-radius:0.6rem;font-weight:900;font-size:0.85rem;cursor:pointer;font-family:inherit;border:none;letter-spacing:0.02em;transition:all .15s}',
      '.ctrl-btn-primary{background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;box-shadow:0 3px 10px rgba(168,85,247,0.32)}',
      '.ctrl-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}',
      '.ctrl-btn-primary:disabled{filter:grayscale(0.6) brightness(0.7);cursor:not-allowed;transform:none}',
      '.ctrl-btn-ghost{background:rgba(255,255,255,0.05);color:#cbd5e1;border:1px solid rgba(255,255,255,0.12)}',
      '.ctrl-btn-ghost:hover{background:rgba(255,255,255,0.10);color:#fff}',
      '.ctrl-btn-danger{background:rgba(248,113,113,0.12);color:#fca5a5;border:1px solid rgba(248,113,113,0.3)}',
      '.ctrl-btn-danger:hover{background:rgba(248,113,113,0.22);color:#fff}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function _closeModal() {
    if (_modalRoot && _modalRoot.parentNode) _modalRoot.parentNode.removeChild(_modalRoot);
    _modalRoot = null;
  }

  function _paliersLabel(daysLeft) {
    if (daysLeft <= 0) return '';
    var FULL = [10, 5, 2, 1];
    var actifs = FULL.filter(function(p) { return p <= daysLeft; });
    if (!actifs.length) actifs = [daysLeft];
    return actifs.map(function(p) { return 'J-' + p; }).join(' · ');
  }

  window.ctrlOpenSaisieModal = function(chap, royaumeId, regionColor) {
    if (!chap || !royaumeId) return;
    if (_modalRoot) return;
    _injectStyles();

    var existing = window.ctrlGet(chap.id);
    var titleQuete = chap.nom_quete || chap.nom || 'cette quête';
    var today = _todayIso();
    var defaultDate = existing ? existing.date_iso : '';

    _modalRoot = document.createElement('div');
    _modalRoot.className = 'ctrl-overlay';
    _modalRoot.innerHTML =
      '<div class="ctrl-card" role="dialog" aria-modal="true" aria-label="Saisir une date de contrôle">' +
        '<button class="ctrl-card-close" data-action="close" aria-label="Fermer">×</button>' +
        '<div class="ctrl-card-badge">📅 Mode contrôle</div>' +
        '<div class="ctrl-card-title">Contrôle de <span data-bind="title"></span> ?</div>' +
        '<div class="ctrl-card-sub">Neo cale tes révisions sur les jours-clés <strong>J-10 · J-5 · J-2 · J-1</strong> avant le contrôle, et te rappelle quand t\'y mettre.</div>' +
        '<div class="ctrl-field">' +
          '<label class="ctrl-label" for="ctrl-date-input">Date du contrôle</label>' +
          '<input class="ctrl-date" type="date" id="ctrl-date-input" />' +
        '</div>' +
        '<div class="ctrl-feedback" data-bind="feedback"></div>' +
        '<div class="ctrl-btn-row">' +
          (existing
            ? '<button class="ctrl-btn ctrl-btn-danger" data-action="delete" type="button">Annuler le contrôle</button>'
            : '') +
          '<button class="ctrl-btn ctrl-btn-ghost" data-action="close" type="button">Plus tard</button>' +
          '<button class="ctrl-btn ctrl-btn-primary" data-action="save" type="button" disabled>Activer</button>' +
        '</div>' +
      '</div>';
    _modalRoot.querySelector('[data-bind="title"]').textContent = titleQuete;
    document.body.appendChild(_modalRoot);

    var dateInput = _modalRoot.querySelector('#ctrl-date-input');
    dateInput.min = today;
    if (defaultDate) dateInput.value = defaultDate;

    var saveBtn = _modalRoot.querySelector('[data-action="save"]');
    var feedback = _modalRoot.querySelector('[data-bind="feedback"]');

    function _validate() {
      var v = dateInput.value;
      if (!v) { saveBtn.disabled = true; feedback.textContent = ''; return; }
      var dl = window.ctrlDebug.daysBetween(today, v);
      if (dl < 0) {
        saveBtn.disabled = true;
        feedback.textContent = 'Cette date est déjà passée.';
        feedback.classList.add('is-error');
        return;
      }
      if (dl === 0) {
        saveBtn.disabled = true;
        feedback.textContent = 'C\'est aujourd\'hui — trop tard pour planifier. Lance la quête directement.';
        feedback.classList.add('is-error');
        return;
      }
      feedback.classList.remove('is-error');
      var plan = _paliersLabel(dl);
      if (dl < 5) {
        feedback.textContent = '⚡ Court (' + dl + ' jour' + (dl>1?'s':'') + ') — Neo cale au mieux. Plan : ' + plan;
      } else {
        feedback.textContent = '✓ ' + dl + ' jours · Plan : ' + plan;
      }
      saveBtn.disabled = false;
    }
    dateInput.addEventListener('input', _validate);
    dateInput.addEventListener('change', _validate);
    _validate();

    _modalRoot.querySelectorAll('[data-action="close"]').forEach(function(b) {
      b.addEventListener('click', _closeModal);
    });
    _modalRoot.addEventListener('click', function(e) {
      if (e.target === _modalRoot) _closeModal();
    });

    saveBtn.addEventListener('click', function() {
      if (saveBtn.disabled) return;
      window.ctrlAdd(chap.id, royaumeId, dateInput.value);
      _closeModal();
      window.ctrlMountInPanel(chap, royaumeId, regionColor);
    });

    var deleteBtn = _modalRoot.querySelector('[data-action="delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        window.ctrlRemove(chap.id);
        _closeModal();
        window.ctrlMountInPanel(chap, royaumeId, regionColor);
      });
    }
  };

  // Mount un encart "Contrôle" en bas du panneau qp-selected.
  // Idempotent : retire le précédent encart avant d'en créer un nouveau.
  window.ctrlMountInPanel = function(chap, royaumeId, regionColor) {
    if (!chap || !royaumeId) return;
    _injectStyles();

    var panel = document.getElementById('qp-selected');
    if (!panel) return;
    // Retire tous les anciens encarts (idempotent)
    panel.querySelectorAll('.ctrl-panel-box').forEach(function(n) { n.remove(); });

    var ctrl = window.ctrlGet(chap.id);
    var box = document.createElement('div');
    box.className = 'ctrl-panel-box';

    if (!ctrl || ctrl.statut === 'archive') {
      // État vierge : proposer de saisir une date
      box.innerHTML =
        '<div class="ctrl-panel-icon">📅</div>' +
        '<div class="ctrl-panel-text">Tu as un contrôle prévu sur ce chapitre ? <strong>Active le mode contrôle</strong> — Neo cale les révisions.</div>' +
        '<div class="ctrl-panel-actions">' +
          '<button class="ctrl-panel-btn ctrl-panel-btn-primary" data-action="open">Saisir la date</button>' +
        '</div>';
      box.querySelector('[data-action="open"]').addEventListener('click', function() {
        window.ctrlOpenSaisieModal(chap, royaumeId, regionColor);
      });
    } else {
      // État actif : affiche le compteur + édition
      var daysLeft = window.ctrlDaysLeft(chap.id);
      var isRush = window.ctrlIsRush(chap.id);
      var isPast = window.ctrlIsPast(chap.id);
      if (isRush) box.classList.add('is-rush');
      if (isPast) box.classList.add('is-past');

      var textHTML, iconHTML;
      if (isPast) {
        iconHTML = '⏱️';
        textHTML = 'Contrôle <strong>passé</strong>. Neo te demandera bientôt comment ça s\'est passé.';
      } else if (daysLeft === 1) {
        iconHTML = '🔥';
        textHTML = 'Contrôle <strong>demain</strong> — relis ta fiche et tes flashcards.';
      } else {
        iconHTML = isRush ? '⚡' : '📅';
        textHTML = 'Contrôle dans <span class="ctrl-days">' + daysLeft + ' j</span>' +
                   (isRush ? ' — court, Neo cale au mieux.' : ' — Neo planifie tes révisions.');
      }
      box.innerHTML =
        '<div class="ctrl-panel-icon">' + iconHTML + '</div>' +
        '<div class="ctrl-panel-text' + (isRush ? ' is-rush' : '') + '">' + textHTML + '</div>' +
        '<div class="ctrl-panel-actions">' +
          '<button class="ctrl-panel-btn ctrl-panel-btn-ghost" data-action="edit">Modifier</button>' +
        '</div>';
      box.querySelector('[data-action="edit"]').addEventListener('click', function() {
        window.ctrlOpenSaisieModal(chap, royaumeId, regionColor);
      });
    }

    // Insère juste après l'en-tête (avant les 4 étapes de jeu) pour visibilité immédiate
    var body = panel.querySelector('.qp-body');
    if (body) panel.insertBefore(box, body);
    else panel.appendChild(box);
  };
})();
