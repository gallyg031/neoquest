// ── Carnet d'oublis — popup Neo à l'entrée du royaume ──
// Affiche au chargement de royaume.html si :
//   - nbCanPrompt(royaumeId) === true (>= 3 oublis, jamais prompté aujourd'hui)
// Deux boutons : "Aide-moi" → nbOpenReview, "Plus tard" → close.
// Dans les deux cas, le cooldown du jour est consommé (nbMarkPromptShown).
//
// API publique : nbOpenPrompt(royaumeId, royaumeNom)
//
// Dépend de : nbCanPrompt, nbCountForRoyaume, nbMarkPromptShown, nbOpenReview

(function(){
  var _root = null;

  function _close(skipCooldown) {
    if (_root && _root.parentNode) _root.parentNode.removeChild(_root);
    _root = null;
  }

  function _pickPromptText(royaumeNom, n) {
    var bank = window.__neoLines && window.__neoLines.notebook && window.__neoLines.notebook.prompt;
    if (!bank || !bank.length) {
      return { text: 'J\'ai oublié ' + n + ' trucs de ' + royaumeNom + '. Tu m\'aides ?', state: 'reflexion' };
    }
    var pick = bank[Math.floor(Math.random() * bank.length)];
    var text = pick.text.replace(/\{royaume\}/g, royaumeNom).replace(/\{n\}/g, String(n));
    return { text: text, state: pick.state || 'reflexion' };
  }

  function _injectStyles() {
    if (document.getElementById('nb-prompt-styles')) return;
    var s = document.createElement('style');
    s.id = 'nb-prompt-styles';
    s.textContent = [
      '.nbp-overlay{position:fixed;inset:0;background:rgba(8,6,26,0.78);backdrop-filter:blur(6px);z-index:9997;display:flex;align-items:center;justify-content:center;padding:1rem;animation:nbpFadeIn .3s ease}',
      '@keyframes nbpFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes nbpPopIn{from{opacity:0;transform:scale(0.9) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '.nbp-card{background:linear-gradient(135deg,#1a1230,#0f0a24);border:1px solid rgba(168,85,247,0.4);border-radius:20px;max-width:440px;width:100%;padding:1.5rem 1.5rem 1.25rem;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(168,85,247,0.18);animation:nbpPopIn .35s cubic-bezier(.34,1.56,.64,1)}',
      '.nbp-neo{width:96px;height:96px;margin:0 auto 0.85rem;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(168,85,247,0.2),transparent 65%);border-radius:50%}',
      '.nbp-neo img{width:90px;height:90px;object-fit:contain;filter:drop-shadow(0 0 14px rgba(168,85,247,0.5))}',
      '.nbp-badge{display:inline-flex;align-items:center;gap:0.4rem;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:9999px;padding:0.25rem 0.7rem;font-size:0.7rem;font-weight:900;color:#c4b5fd;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.7rem}',
      '.nbp-text{font-size:1.05rem;font-weight:800;color:#fff;line-height:1.45;margin-bottom:1.1rem;padding:0 0.25rem}',
      '.nbp-btns{display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap}',
      '.nbp-btn{padding:0.75rem 1.4rem;border-radius:12px;font-weight:900;font-size:0.92rem;cursor:pointer;font-family:inherit;border:none;letter-spacing:0.02em;transition:all .15s}',
      '.nbp-btn-primary{background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;box-shadow:0 4px 12px rgba(168,85,247,0.35)}',
      '.nbp-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}',
      '.nbp-btn-ghost{background:rgba(255,255,255,0.05);color:#cbd5e1;border:1px solid rgba(255,255,255,0.12)}',
      '.nbp-btn-ghost:hover{background:rgba(255,255,255,0.1);color:#fff}'
    ].join('\n');
    document.head.appendChild(s);
  }

  window.nbOpenPrompt = function(royaumeId, royaumeNom) {
    if (_root) return;
    if (typeof window.nbCanPrompt !== 'function' || !window.nbCanPrompt(royaumeId)) return;
    var n = (typeof window.nbCountForRoyaume === 'function') ? window.nbCountForRoyaume(royaumeId) : 0;
    if (n < 3) return;

    _injectStyles();
    var p = _pickPromptText(royaumeNom || 'ce royaume', n);

    _root = document.createElement('div');
    _root.className = 'nbp-overlay';
    _root.innerHTML =
      '<div class="nbp-card" role="dialog" aria-modal="true" aria-label="Neo a oublié des choses">' +
        '<div class="nbp-neo"><img src="img/Neo_assis.png" alt="Neo" /></div>' +
        '<div class="nbp-badge">📓 Carnet d\'oublis</div>' +
        '<div class="nbp-text"></div>' +
        '<div class="nbp-btns">' +
          '<button class="nbp-btn nbp-btn-ghost" data-action="later">Plus tard</button>' +
          '<button class="nbp-btn nbp-btn-primary" data-action="help">Aide-moi 📓</button>' +
        '</div>' +
      '</div>';
    _root.querySelector('.nbp-text').textContent = p.text;
    document.body.appendChild(_root);

    _root.querySelector('[data-action="later"]').addEventListener('click', function() {
      if (typeof window.nbMarkPromptShown === 'function') window.nbMarkPromptShown(royaumeId);
      _close();
    });
    _root.querySelector('[data-action="help"]').addEventListener('click', function() {
      if (typeof window.nbMarkPromptShown === 'function') window.nbMarkPromptShown(royaumeId);
      _close();
      // Petit délai pour transition visuelle entre les deux modales
      setTimeout(function() {
        if (typeof window.nbOpenReview === 'function') window.nbOpenReview(royaumeId);
      }, 200);
    });
  };

  // Auto-trigger au chargement : lit ?matiere=XXX et déclenche si éligible
  function _autoTrigger() {
    try {
      var url = new URL(window.location.href);
      var matiere = url.searchParams.get('matiere');
      if (!matiere) return;

      // Cherche le nom lisible du royaume dans data.js
      var royaumeNom = matiere;
      var matieres = window.__neoData && window.__neoData.matieres;
      if (Array.isArray(matieres)) {
        var found = matieres.find(function(r) { return r.id === matiere; });
        if (found) royaumeNom = found.nom || matiere;
      }
      if (typeof window.nbOpenPrompt === 'function') {
        // Léger délai pour que la page se pose visuellement avant le popup
        setTimeout(function() {
          // Priorité au popup contrôle s'il est éligible ce jour-là (cf neo-controle-prompt.js)
          if (window.__nqControlePromptToday) return;
          window.nbOpenPrompt(matiere, royaumeNom);
        }, 1200);
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoTrigger);
  } else {
    _autoTrigger();
  }
})();
