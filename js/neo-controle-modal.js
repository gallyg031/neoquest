// ── Mode contrôle — modale mini-quiz de révision ──
// Mini-quiz N questions (selon palier) tirées par le mixer.
// Bonne réponse → rcInc(chap, q) + sort du carnet (nbMarkSuccess si dedans).
// Mauvaise réponse → reste/rentre dans le carnet (nbAdd).
// Fin → ctrlMarkRevisionDone(chap.id, palier) + résumé.
//
// API publique :
//   ctrlOpenReview(chap, royaumeId, palier, opts?)
//     opts = { daysLeft?, onComplete? }
//
// Dépend de : ctrlMixForPalier, rcInc, ctrlMarkRevisionDone,
//             nbMarkSuccess, nbAdd (Couche 1), neoSayFromBank

(function(){
  var _root = null;
  var _items = [];
  var _idx = 0;
  var _state = null; // {chap, royaumeId, palier, daysLeft, onComplete, score}

  function _close() {
    if (_root && _root.parentNode) _root.parentNode.removeChild(_root);
    _root = null; _items = []; _idx = 0;
    var s = _state; _state = null;
    if (s && typeof s.onComplete === 'function') s.onComplete(false);
  }

  function _injectStyles() {
    if (document.getElementById('cr-modal-styles')) return;
    var s = document.createElement('style');
    s.id = 'cr-modal-styles';
    // Reprend la palette de neo-notebook-modal (cohérence visuelle des mini-quiz Neo)
    s.textContent = [
      '.cr-overlay{position:fixed;inset:0;background:rgba(8,6,26,0.85);backdrop-filter:blur(8px);z-index:9998;display:flex;align-items:center;justify-content:center;padding:1rem;animation:crFadeIn .25s ease}',
      '@keyframes crFadeIn{from{opacity:0}to{opacity:1}}',
      '.cr-modal{background:linear-gradient(135deg,#1a1230,#0f0a24);border:1px solid rgba(168,85,247,0.4);border-radius:18px;max-width:560px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(168,85,247,0.15)}',
      '.cr-header{padding:1.1rem 1.25rem 0.7rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid rgba(168,85,247,0.18)}',
      '.cr-header-icon{font-size:1.8rem}',
      '.cr-header-title{font-weight:900;font-size:1.05rem;color:#fff;letter-spacing:0.02em;line-height:1.2}',
      '.cr-header-sub{font-size:0.74rem;color:#94a3b8;font-weight:700;margin-top:2px}',
      '.cr-header-sub strong{color:#a78bfa}',
      '.cr-x{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#cbd5e1;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:0.9rem;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:inherit}',
      '.cr-x:hover{background:rgba(239,68,68,0.18);border-color:#ef4444;color:#fff}',
      '.cr-body{padding:1.1rem 1.25rem 1.25rem}',
      '.cr-progress{font-size:0.72rem;color:#a78bfa;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.55rem;display:flex;justify-content:space-between;align-items:center}',
      '.cr-progress-bar{flex:1;height:4px;background:rgba(168,85,247,0.15);border-radius:9999px;margin-left:0.7rem;overflow:hidden}',
      '.cr-progress-fill{height:100%;background:linear-gradient(90deg,#a855f7,#22d3ee);border-radius:9999px;transition:width .3s}',
      '.cr-question{font-size:1.05rem;font-weight:800;color:#fff;line-height:1.45;margin-bottom:1rem}',
      '.cr-choices{display:flex;flex-direction:column;gap:0.55rem;margin-bottom:0.5rem}',
      '.cr-choice{display:flex;align-items:center;gap:0.7rem;padding:0.75rem 0.95rem;background:rgba(168,85,247,0.08);border:1.5px solid rgba(168,85,247,0.25);border-radius:12px;color:#e2e8f0;font-weight:700;font-size:0.95rem;text-align:left;cursor:pointer;transition:all .15s;font-family:inherit}',
      '.cr-choice:hover:not(:disabled){background:rgba(168,85,247,0.18);border-color:rgba(168,85,247,0.55);transform:translateX(2px)}',
      '.cr-choice:disabled{cursor:default}',
      '.cr-choice-letter{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(168,85,247,0.25);color:#fff;font-weight:900;font-size:0.85rem;flex-shrink:0}',
      '.cr-choice-text{flex:1}',
      '.cr-choice.cr-correct{background:rgba(34,197,94,0.22);border-color:#22c55e;color:#fff}',
      '.cr-choice.cr-correct .cr-choice-letter{background:#22c55e}',
      '.cr-choice.cr-wrong{background:rgba(239,68,68,0.22);border-color:#ef4444;color:#fff}',
      '.cr-choice.cr-wrong .cr-choice-letter{background:#ef4444}',
      '.cr-choice.cr-muted{opacity:0.4}',
      '.cr-feedback{margin-top:0.75rem;padding:0.85rem 1rem;background:rgba(15,10,36,0.6);border:1px solid rgba(168,85,247,0.2);border-radius:12px;animation:crFadeIn .25s ease}',
      '.cr-fb-label{font-weight:900;font-size:0.95rem;margin-bottom:0.45rem;letter-spacing:0.02em}',
      '.cr-fb-ok{color:#4ade80}',
      '.cr-fb-ko{color:#fbbf24}',
      '.cr-fb-text{color:#cbd5e1;font-size:0.88rem;line-height:1.5;font-weight:600}',
      '.cr-fb-correct{margin-top:0.4rem;font-size:0.85rem;color:#e2e8f0;font-weight:700}',
      '.cr-fb-correct strong{color:#4ade80}',
      '.cr-recups{margin-top:0.5rem;font-size:0.72rem;color:#a78bfa;font-weight:800;letter-spacing:0.04em}',
      '.cr-recups .cr-dot{display:inline-block;width:11px;height:11px;border-radius:50%;border:1.5px solid #a78bfa;margin-left:3px;vertical-align:middle}',
      '.cr-recups .cr-dot.cr-dot-on{background:#a78bfa}',
      '.cr-next{margin-top:0.85rem;width:100%;padding:0.7rem;background:linear-gradient(135deg,#a855f7,#6366f1);border:none;border-radius:10px;color:#fff;font-weight:900;font-size:0.95rem;cursor:pointer;font-family:inherit;letter-spacing:0.02em}',
      '.cr-next:hover{filter:brightness(1.1)}',
      '.cr-end{text-align:center;padding:1rem 0.5rem}',
      '.cr-end-icon{font-size:3rem;margin-bottom:0.65rem}',
      '.cr-end-title{font-size:1.4rem;font-weight:900;color:#fff;margin-bottom:0.4rem}',
      '.cr-end-text{font-size:0.92rem;color:#cbd5e1;font-weight:700;margin-bottom:0.55rem;line-height:1.45}',
      '.cr-end-score{font-size:0.85rem;color:#a78bfa;font-weight:800;margin-bottom:1.1rem}',
      '.cr-close-btn{padding:0.7rem 1.8rem;background:linear-gradient(135deg,#a855f7,#6366f1);border:none;border-radius:10px;color:#fff;font-weight:900;cursor:pointer;font-family:inherit;font-size:0.95rem}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function _renderQuestion() {
    var it = _items[_idx];
    if (!it) return _renderEnd();
    var total = _items.length;
    var n = _idx + 1;
    var pct = Math.round((n / total) * 100);

    var choices = it.choix.map(function(c, i) {
      return '<button class="cr-choice" data-i="' + i + '">' +
               '<span class="cr-choice-letter">' + String.fromCharCode(65 + i) + '</span>' +
               '<span class="cr-choice-text"></span>' +
             '</button>';
    }).join('');

    _root.querySelector('.cr-body').innerHTML =
      '<div class="cr-progress"><span>Question ' + n + ' / ' + total + '</span>' +
        '<span class="cr-progress-bar"><span class="cr-progress-fill" style="width:' + pct + '%"></span></span>' +
      '</div>' +
      '<div class="cr-question"></div>' +
      '<div class="cr-choices">' + choices + '</div>' +
      '<div class="cr-feedback" style="display:none"></div>';

    _root.querySelector('.cr-question').textContent = it.question;
    var btns = _root.querySelectorAll('.cr-choice');
    btns.forEach(function(b, i) {
      b.querySelector('.cr-choice-text').textContent = it.choix[i];
      b.addEventListener('click', function() { _onAnswer(i); });
    });
  }

  function _onAnswer(selectedIdx) {
    var it = _items[_idx];
    var correctIdx = it.choix.indexOf(it.bonne_reponse);
    var isCorrect = selectedIdx === correctIdx;
    var s = _state;

    _root.querySelectorAll('.cr-choice').forEach(function(b, i) {
      b.disabled = true;
      if (i === correctIdx) b.classList.add('cr-correct');
      else if (i === selectedIdx) b.classList.add('cr-wrong');
      else b.classList.add('cr-muted');
    });

    var fb = _root.querySelector('.cr-feedback');
    fb.style.display = '';
    var recups = 0;

    if (isCorrect) {
      s.score++;
      // Incrément du compteur successive relearning (Rawson 2011) — 1 par jour max
      if (typeof window.rcInc === 'function') recups = window.rcInc(s.chap.id, it.question);
      // Si l'item est dans le carnet d'oublis : on le sort (compat Couche 1).
      // À noter : sortie à 1/1 actuellement, dette à passer à 3/3 plus tard (cf Étape C).
      if (typeof window.nbMarkSuccess === 'function' && typeof window.rcQid === 'function') {
        window.nbMarkSuccess(window.rcQid(s.chap.id, it.question));
      }
      var recupsDots = '';
      for (var d = 1; d <= 3; d++) {
        recupsDots += '<span class="cr-dot' + (d <= recups ? ' cr-dot-on' : '') + '"></span>';
      }
      fb.innerHTML = '<div class="cr-fb-label cr-fb-ok">✅ Bonne réponse</div>' +
                     '<div class="cr-fb-text"></div>' +
                     '<div class="cr-recups">Mémorisation long terme : ' + recups + '/3 ' + recupsDots + '</div>';
      fb.querySelector('.cr-fb-text').textContent = it.explication || '';
      if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('controle', 'correct');
    } else {
      // Réinsère dans le carnet d'oublis (rentre/incrémente fail_count)
      if (typeof window.nbAdd === 'function') {
        window.nbAdd(s.chap.id, s.royaumeId, [it]);
      }
      fb.innerHTML = '<div class="cr-fb-label cr-fb-ko">Pas tout à fait</div>' +
                     '<div class="cr-fb-text"></div>' +
                     '<div class="cr-fb-correct">Bonne réponse : <strong></strong></div>';
      fb.querySelector('.cr-fb-text').textContent = it.explication || '';
      fb.querySelector('.cr-fb-correct strong').textContent = it.bonne_reponse;
      if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('controle', 'wrong');
    }

    fb.innerHTML += '<button class="cr-next" type="button">' +
      (_idx + 1 >= _items.length ? 'Terminer' : 'Question suivante →') +
      '</button>';
    fb.querySelector('.cr-next').addEventListener('click', function() {
      _idx++;
      if (_idx >= _items.length) _renderEnd();
      else _renderQuestion();
    });
  }

  function _renderEnd() {
    var s = _state;
    // Marque le palier comme fait
    if (typeof window.ctrlMarkRevisionDone === 'function') {
      window.ctrlMarkRevisionDone(s.chap.id, s.palier);
    }
    var total = _items.length;
    var score = s.score;
    var ratio = score / total;
    var bucket = (ratio >= 0.75) ? 'end_strong' : (ratio >= 0.4 ? 'end_mixed' : 'end_fragile');
    var titre = ratio >= 0.75 ? 'Solide.' : (ratio >= 0.4 ? 'Pas mal.' : 'Faut bosser.');
    var icone = ratio >= 0.75 ? '✨' : (ratio >= 0.4 ? '📓' : '🔁');
    var commentaire = ratio >= 0.75
      ? 'Les questions tombées sortent du carnet pour cette fois.'
      : (ratio >= 0.4
        ? 'Quelques trous, on les retravaillera la prochaine fois.'
        : 'Pas grave, on remettra ça. Le carnet garde ce qui a coincé.');

    if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('controle', bucket);

    _root.querySelector('.cr-body').innerHTML =
      '<div class="cr-end">' +
        '<div class="cr-end-icon">' + icone + '</div>' +
        '<div class="cr-end-title">' + titre + '</div>' +
        '<div class="cr-end-text"></div>' +
        '<div class="cr-end-score">' + score + ' / ' + total + ' bonnes réponses</div>' +
        '<button class="cr-close-btn" type="button">Fermer</button>' +
      '</div>';
    _root.querySelector('.cr-end-text').textContent = commentaire;
    _root.querySelector('.cr-close-btn').addEventListener('click', function() {
      if (s && typeof s.onComplete === 'function') s.onComplete(true);
      _state = null; // empêche le double-trigger via _close
      _root.parentNode.removeChild(_root);
      _root = null; _items = []; _idx = 0;
    });
  }

  window.ctrlOpenReview = function(chap, royaumeId, palier, opts) {
    if (_root) return;
    opts = opts || {};
    if (typeof window.ctrlMixForPalier !== 'function') return;
    var items = window.ctrlMixForPalier(chap, palier);
    if (!items.length) return;

    _items = items; _idx = 0;
    _state = {
      chap: chap, royaumeId: royaumeId, palier: palier,
      daysLeft: opts.daysLeft, onComplete: opts.onComplete, score: 0
    };
    _injectStyles();

    var titre = chap.nom_quete || chap.nom || 'le chapitre';
    var subBits = ['Révision'];
    if (typeof opts.daysLeft === 'number') subBits.push('contrôle dans <strong>' + opts.daysLeft + ' j</strong>');
    subBits.push('pas de combat');
    var sub = subBits.join(' · ');

    _root = document.createElement('div');
    _root.className = 'cr-overlay';
    _root.innerHTML =
      '<div class="cr-modal" role="dialog" aria-modal="true" aria-label="Révision contrôle">' +
        '<div class="cr-header">' +
          '<div class="cr-header-icon">📅</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="cr-header-title"></div>' +
            '<div class="cr-header-sub">' + sub + '</div>' +
          '</div>' +
          '<button class="cr-x" type="button" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<div class="cr-body"></div>' +
      '</div>';
    _root.querySelector('.cr-header-title').textContent = titre;
    document.body.appendChild(_root);
    _root.querySelector('.cr-x').addEventListener('click', _close);

    if (typeof window.neoSayFromBank === 'function') window.neoSayFromBank('controle', 'start');
    _renderQuestion();
  };
})();
