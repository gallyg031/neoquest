// ── Carnet d'oublis — modal mini-quiz révision ──
// Affiche 3 questions (max) en mode mémoire pur : question + 4 choix + feedback.
// Pas de combat / cœurs / timer / éclats / XP.
// Bonne réponse → la question sort du carnet (nbMarkSuccess).
// Mauvaise réponse → la question reste (sera ré-éligible demain).
//
// API publique :
//   nbOpenReview(royaumeId)
//
// Dépend de : nbPickReview, nbMarkSuccess (neo-notebook-store.js),
//             neoSayFromBank (quest-neo.js)

(function(){
  var _root = null;
  var _items = [];
  var _idx = 0;

  function _close() {
    if (_root && _root.parentNode) _root.parentNode.removeChild(_root);
    _root = null; _items = []; _idx = 0;
  }

  function _renderQuestion() {
    var it = _items[_idx];
    if (!it) return _renderEnd();
    var q = it.snapshot;
    var total = _items.length;
    var n = _idx + 1;

    var choices = q.choix.map(function(c, i) {
      return '<button class="nb-choice" data-i="' + i + '">' +
               '<span class="nb-choice-letter">' + String.fromCharCode(65 + i) + '</span>' +
               '<span class="nb-choice-text"></span>' +
             '</button>';
    }).join('');

    _root.querySelector('.nb-body').innerHTML =
      '<div class="nb-progress">Question ' + n + ' / ' + total + '</div>' +
      '<div class="nb-question"></div>' +
      '<div class="nb-choices">' + choices + '</div>' +
      '<div class="nb-feedback"></div>';

    // Set text content safely (no HTML injection)
    _root.querySelector('.nb-question').textContent = q.question;
    var btns = _root.querySelectorAll('.nb-choice');
    btns.forEach(function(b, i) {
      b.querySelector('.nb-choice-text').textContent = q.choix[i];
      b.addEventListener('click', function() { _onAnswer(i); });
    });
  }

  function _onAnswer(selectedIdx) {
    var it = _items[_idx];
    var q = it.snapshot;
    var correctIdx = q.choix.indexOf(q.bonne_reponse);
    var isCorrect = selectedIdx === correctIdx;

    // Bloque les autres choix
    _root.querySelectorAll('.nb-choice').forEach(function(b, i) {
      b.disabled = true;
      if (i === correctIdx) b.classList.add('nb-correct');
      else if (i === selectedIdx) b.classList.add('nb-wrong');
      else b.classList.add('nb-muted');
    });

    var fb = _root.querySelector('.nb-feedback');
    if (isCorrect) {
      fb.innerHTML = '<div class="nb-fb-label nb-fb-ok">✅ Exact</div>' +
                     '<div class="nb-fb-text"></div>';
      fb.querySelector('.nb-fb-text').textContent = q.explication || '';
      // Successive Relearning : incrément avant nbMarkSuccess (le store check rcGet>=3 pour sortir)
      if (typeof window.rcInc === 'function' && it.ch_id) {
        window.rcInc(it.ch_id, q.question);
      }
      if (typeof window.nbMarkSuccess === 'function') window.nbMarkSuccess(it.qid);
      if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('notebook', 'correct');
    } else {
      fb.innerHTML = '<div class="nb-fb-label nb-fb-ko">Pas tout à fait</div>' +
                     '<div class="nb-fb-text"></div>' +
                     '<div class="nb-fb-correct">Bonne réponse : <strong></strong></div>';
      fb.querySelector('.nb-fb-text').textContent = q.explication || '';
      fb.querySelector('.nb-fb-correct strong').textContent = q.bonne_reponse;
      if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('notebook', 'wrong');
    }

    fb.innerHTML += '<button class="nb-next" type="button">' +
      (_idx + 1 >= _items.length ? 'Terminer' : 'Question suivante →') +
      '</button>';
    fb.querySelector('.nb-next').addEventListener('click', function() {
      _idx++;
      if (_idx >= _items.length) _renderEnd();
      else _renderQuestion();
    });
  }

  function _renderEnd() {
    if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('notebook', 'end');
    _root.querySelector('.nb-body').innerHTML =
      '<div class="nb-end">' +
        '<div class="nb-end-icon">📓</div>' +
        '<div class="nb-end-title">Merci !</div>' +
        '<div class="nb-end-text">Le carnet de Neo est à jour.</div>' +
        '<button class="nb-close-btn" type="button">Fermer</button>' +
      '</div>';
    _root.querySelector('.nb-close-btn').addEventListener('click', _close);
  }

  function _injectStyles() {
    if (document.getElementById('nb-modal-styles')) return;
    var s = document.createElement('style');
    s.id = 'nb-modal-styles';
    s.textContent = [
      '.nb-overlay{position:fixed;inset:0;background:rgba(8,6,26,0.85);backdrop-filter:blur(8px);z-index:9998;display:flex;align-items:center;justify-content:center;padding:1rem;animation:nbFadeIn .25s ease}',
      '@keyframes nbFadeIn{from{opacity:0}to{opacity:1}}',
      '.nb-modal{background:linear-gradient(135deg,#1a1230,#0f0a24);border:1px solid rgba(168,85,247,0.4);border-radius:18px;max-width:560px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(168,85,247,0.15)}',
      '.nb-header{padding:1.1rem 1.25rem 0.6rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid rgba(168,85,247,0.18)}',
      '.nb-header-icon{font-size:1.8rem}',
      '.nb-header-title{font-weight:900;font-size:1.1rem;color:#fff;letter-spacing:0.02em}',
      '.nb-header-sub{font-size:0.78rem;color:#94a3b8;font-weight:700}',
      '.nb-x{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:inherit}',
      '.nb-x:hover{background:rgba(239,68,68,0.18);border-color:#ef4444;color:#fff}',
      '.nb-body{padding:1.1rem 1.25rem 1.25rem}',
      '.nb-progress{font-size:0.72rem;color:#a78bfa;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.55rem}',
      '.nb-question{font-size:1.05rem;font-weight:800;color:#fff;line-height:1.45;margin-bottom:1rem}',
      '.nb-choices{display:flex;flex-direction:column;gap:0.55rem;margin-bottom:0.5rem}',
      '.nb-choice{display:flex;align-items:center;gap:0.7rem;padding:0.75rem 0.95rem;background:rgba(168,85,247,0.08);border:1.5px solid rgba(168,85,247,0.25);border-radius:12px;color:#e2e8f0;font-weight:700;font-size:0.95rem;text-align:left;cursor:pointer;transition:all .15s;font-family:inherit}',
      '.nb-choice:hover:not(:disabled){background:rgba(168,85,247,0.18);border-color:rgba(168,85,247,0.55);transform:translateX(2px)}',
      '.nb-choice:disabled{cursor:default}',
      '.nb-choice-letter{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(168,85,247,0.25);color:#fff;font-weight:900;font-size:0.85rem;flex-shrink:0}',
      '.nb-choice-text{flex:1}',
      '.nb-choice.nb-correct{background:rgba(34,197,94,0.22);border-color:#22c55e;color:#fff}',
      '.nb-choice.nb-correct .nb-choice-letter{background:#22c55e}',
      '.nb-choice.nb-wrong{background:rgba(239,68,68,0.22);border-color:#ef4444;color:#fff}',
      '.nb-choice.nb-wrong .nb-choice-letter{background:#ef4444}',
      '.nb-choice.nb-muted{opacity:0.4}',
      '.nb-feedback{margin-top:0.75rem;padding:0.85rem 1rem;background:rgba(15,10,36,0.6);border:1px solid rgba(168,85,247,0.2);border-radius:12px;animation:nbFadeIn .25s ease}',
      '.nb-fb-label{font-weight:900;font-size:0.95rem;margin-bottom:0.45rem;letter-spacing:0.02em}',
      '.nb-fb-ok{color:#4ade80}',
      '.nb-fb-ko{color:#fbbf24}',
      '.nb-fb-text{color:#cbd5e1;font-size:0.88rem;line-height:1.5;font-weight:600}',
      '.nb-fb-correct{margin-top:0.4rem;font-size:0.85rem;color:#e2e8f0;font-weight:700}',
      '.nb-fb-correct strong{color:#4ade80}',
      '.nb-next{margin-top:0.85rem;width:100%;padding:0.7rem;background:linear-gradient(135deg,#a855f7,#6366f1);border:none;border-radius:10px;color:#fff;font-weight:900;font-size:0.95rem;cursor:pointer;font-family:inherit;letter-spacing:0.02em}',
      '.nb-next:hover{filter:brightness(1.1)}',
      '.nb-end{text-align:center;padding:1rem 0.5rem}',
      '.nb-end-icon{font-size:3rem;margin-bottom:0.65rem}',
      '.nb-end-title{font-size:1.4rem;font-weight:900;color:#fff;margin-bottom:0.4rem}',
      '.nb-end-text{font-size:0.9rem;color:#94a3b8;font-weight:700;margin-bottom:1.2rem}',
      '.nb-close-btn{padding:0.7rem 1.8rem;background:linear-gradient(135deg,#a855f7,#6366f1);border:none;border-radius:10px;color:#fff;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.95rem}'
    ].join('\n');
    document.head.appendChild(s);
  }

  window.nbOpenReview = function(royaumeId) {
    if (_root) return; // déjà ouvert
    var items = (typeof window.nbPickReview === 'function') ? window.nbPickReview(royaumeId, 3) : [];
    if (!items.length) return;
    _items = items; _idx = 0;
    _injectStyles();

    _root = document.createElement('div');
    _root.className = 'nb-overlay';
    _root.innerHTML =
      '<div class="nb-modal" role="dialog" aria-modal="true" aria-label="Mini-révision">' +
        '<div class="nb-header">' +
          '<div class="nb-header-icon">📓</div>' +
          '<div style="flex:1">' +
            '<div class="nb-header-title">Carnet d\'oublis de Neo</div>' +
            '<div class="nb-header-sub">Mini-révision · pas de combat</div>' +
          '</div>' +
          '<button class="nb-x" type="button" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<div class="nb-body"></div>' +
      '</div>';
    document.body.appendChild(_root);
    _root.querySelector('.nb-x').addEventListener('click', _close);

    if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('notebook', 'start');
    _renderQuestion();
  };
})();
