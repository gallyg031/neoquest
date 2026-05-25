// ── Page-flip 3D entre 2 questions (grimoire) ──
// Wrappe #qa-quiz-grim-page (question + choix). L'ancienne page tourne à gauche (rotateY -92°,
// translateX -14%, brunie), puis le `swap` callback monte la nouvelle question, puis la nouvelle
// page entre depuis la droite (rotateY 92° → 0). Total ~920ms, garde le contexte papier vieilli.
//
// API publique :
//   pageFlip(swap)                — Joue la transition complète puis appelle swap()
//   pageFlipFlourish('Q 3 / 12')  — (option) écrit une mini-typo au milieu de la transition

function pageFlip(swap) {
  const page = document.getElementById('qa-quiz-grim-page');
  if (!page) { if (typeof swap === 'function') swap(); return; }

  page.classList.remove('is-turning-in', 'is-turning-out');
  void page.offsetWidth;
  page.classList.add('is-turning-out');

  // À mi-flip : exécute le swap (le contenu change "à l'envers", invisible)
  setTimeout(() => {
    if (typeof swap === 'function') swap();
    page.classList.remove('is-turning-out');
    void page.offsetWidth;
    page.classList.add('is-turning-in');
    setTimeout(() => page.classList.remove('is-turning-in'), 520);
  }, 420);
}

function pageFlipFlourish(text) {
  const page = document.getElementById('qa-quiz-grim-page');
  if (!page || !text) return;
  const f = document.createElement('div');
  f.className = 'combat-grim-page-flourish';
  f.textContent = text;
  page.appendChild(f);
  setTimeout(() => f.remove(), 800);
}

window.pageFlip          = pageFlip;
window.pageFlipFlourish  = pageFlipFlourish;
