// ── Banque de répliques de Neo (compagnon / sidekick) ──
// Format : window.__neoLines[context][bucket] = [ { text, state }, ... ]
//   - text : la phrase. Variables disponibles : {total}, {acquises}, {restantes}
//   - state : expression de Neo ('neutre' | 'reflexion' | 'succes' | 'oups' | 'combat')
// Plusieurs phrases par bucket : Neo en choisit une au hasard à chaque déclenchement.
//
// 👉 Tu peux éditer/ajouter librement. Pas besoin de toucher au reste du code.
window.__neoLines = {
  flashcards: {
    intro: [
      { text: "Prêt(e) ? On a {total} éclats à capturer ensemble !", state: "neutre" },
      { text: "Allons-y ! {total} cartes, et la lanterne s'illumine.", state: "neutre" }
    ],
    end: [
      { text: "Lanterne pleine ! Tu brilles plus fort que le Brouillard.", state: "succes" },
      { text: "Bravo ! Cinq éclats de plus dans notre besace.", state: "succes" }
    ],
    idle: [
      { text: "Tu réfléchis ? Pas de panique, je t'attends.", state: "reflexion" },
      { text: "Hmm… prends ton temps, je ne bouge pas.", state: "reflexion" }
    ],
    streak3: [
      { text: "Trois d'affilée ! La lanterne brille plus fort, non ?", state: "succes" },
      { text: "Tu es en feu ! Continue comme ça.", state: "succes" }
    ],
    mastery: [
      { text: "Toutes les cartes acquises — bonus de maîtrise débloqué !", state: "succes" },
      { text: "Chapitre maîtrisé ! Impressionnant.", state: "succes" }
    ]
  }
};
