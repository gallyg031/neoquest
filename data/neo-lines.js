// ── Banque de répliques de Neo (compagnon / sidekick) ──
// Format : window.__neoLines[context][bucket] = [ { text, state }, ... ]
//   - text : la phrase. Variables disponibles : {total}, {acquises}, {restantes}
//   - state : expression de Neo ('neutre' | 'reflexion' | 'succes' | 'oups' | 'combat')
// Plusieurs phrases par bucket : Neo en choisit une au hasard à chaque déclenchement.
//
// Registre éditorial : sass-cute. Voir Description generale.md → "Voix et registre de Néo".
// Pas de "Bravo !", pas de "jeune X", pas de parentalisme, phrases courtes avec attitude.
window.__neoLines = {
  flashcards: {
    intro: [
      { text: "{total} cartes. On y va.", state: "neutre" },
      { text: "{total} éclats à capter. On déroule.", state: "neutre" }
    ],
    end: [
      { text: "Lanterne pleine. Posé.", state: "succes" },
      { text: "+5 éclats. T'as géré.", state: "succes" }
    ],
    idle: [
      { text: "Tu réfléchis. Je bouge pas.", state: "reflexion" },
      { text: "Prends ton temps. Pas pressé.", state: "reflexion" }
    ],
    streak3: [
      { text: "Trois d'affilée. Tu chauffes.", state: "succes" },
      { text: "T'es en mode auto. Continue.", state: "succes" }
    ],
    mastery: [
      { text: "Toutes acquises. Bonus de maîtrise débloqué.", state: "succes" },
      { text: "Chapitre dans la poche. Impressionnant.", state: "succes" }
    ]
  },
  notebook: {
    // Variables : {royaume}, {n}
    prompt: [
      { text: "J'ai oublié {n} trucs de {royaume}. Tu m'aides ?", state: "reflexion" },
      { text: "Petite faille mémoire sur {royaume}. T'as 2 min ?", state: "reflexion" },
      { text: "{n} questions me reviennent pas. Refresh ?", state: "reflexion" }
    ],
    start: [
      { text: "Trois questions. Pas de combat, juste de la mémoire.", state: "neutre" },
      { text: "Tranquille. Pas de cœurs, pas de timer.", state: "neutre" }
    ],
    correct: [
      { text: "Ah ouais c'est ça. Merci.", state: "succes" },
      { text: "T'es solide. J'avais zappé.", state: "succes" },
      { text: "Voilà, ça revient.", state: "succes" }
    ],
    wrong: [
      { text: "Bon, on retiendra pour la prochaine fois.", state: "oups" },
      { text: "Pas grave. On la garde pour plus tard.", state: "oups" }
    ],
    end: [
      { text: "Merci. Maintenant je sais.", state: "succes" },
      { text: "Carnet à jour. On peut y aller.", state: "succes" }
    ]
  },
  controle: {
    // Variables : {chap}, {daysLeft}, {palier}
    prompt_classic: [
      { text: "Contrôle {chap} dans {daysLeft} jours. On cale une révision ?", state: "reflexion" },
      { text: "Plus que {daysLeft} jours avant {chap}. On s'y met ?", state: "reflexion" },
      { text: "{chap} dans {daysLeft} jours. Petite session ?", state: "reflexion" }
    ],
    prompt_rush: [
      { text: "Contrôle {chap} dans {daysLeft} jours. C'est court, on fonce ?", state: "reflexion" },
      { text: "{daysLeft} jours avant {chap}. Pas de temps à perdre.", state: "reflexion" }
    ],
    prompt_j1: [
      { text: "Contrôle {chap} demain. Relecture des flashcards ?", state: "reflexion" },
      { text: "Demain c'est {chap}. On revoit tes cartes ?", state: "reflexion" }
    ],
    start: [
      { text: "On déroule. Pas de combat.", state: "neutre" },
      { text: "Mémoire pure. Vas-y.", state: "neutre" }
    ],
    correct: [
      { text: "Ça reste. Bien.", state: "succes" },
      { text: "Bon point pour le contrôle.", state: "succes" },
      { text: "Validé.", state: "succes" }
    ],
    wrong: [
      { text: "On la remet dans le carnet. Elle reviendra.", state: "oups" },
      { text: "Pas grave, on a le temps de la retravailler.", state: "oups" }
    ],
    end_strong: [
      { text: "Solide. Le contrôle, t'es prêt.", state: "succes" },
      { text: "Posé. On en refait une autre fois.", state: "succes" }
    ],
    end_mixed: [
      { text: "Pas mal. Quelques trous à reboucher.", state: "neutre" },
      { text: "Correct. On revient sur les ratées la prochaine fois.", state: "neutre" }
    ],
    end_fragile: [
      { text: "Faut bosser. Le carnet est plein, on reviendra.", state: "oups" },
      { text: "Beaucoup de trous. Pas grave, on a encore le temps.", state: "oups" }
    ]
  }
};
