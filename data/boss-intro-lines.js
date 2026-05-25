// ── Lignes narratives d'intro de combat (lore + défi + hint Néo) par royaume ──
// Fallback générique par thème. Quand un boss a son lore propre, le chap pourra fournir
// chap.intro = {bossTitle, lore, challenge, neoGuideHint} qui override ces valeurs.
//
// Registre éditorial : direct, pas de gothique, pas de "jeune scribe/apprenti".
// Voir Description generale.md → "Voix et registre de Néo".

window.__BOSS_INTRO_LINES = {
  historya: {
    bossTitle: 'Gardien des Annales Oubliées',
    bossImage: 'img/boss/boss-schismaeon-le-choeur-brise-mechant.png',
    lore: "Né d'une page d'histoire qu'on a laissée s'effacer. Il protège ce qu'on n'a pas pris la peine de retenir.",
    challenge: "« Tu connais ces dates ? Prouve-le. »",
    neoGuideHint: "Faits, dates, noms. Précision exigée."
  },
  bioverde: {
    bossTitle: 'Sève Pétrifiée',
    lore: "Un cycle du vivant qu'on a oublié de transmettre. Ses racines se sont figées. Il refuse maintenant tout ce qui pousse.",
    challenge: "« Tu prétends comprendre le vivant ? Montre. »",
    neoGuideHint: "Pense mécanique du vivant. Observe avant de tirer."
  },
  quantix: {
    bossTitle: 'Erreur de Calcul Absolue',
    lore: "Né d'une division par zéro qui a tenu trop longtemps. Il refuse les lois physiques en bloc.",
    challenge: "« La physique n'aime pas l'à-peu-près. Toi non plus, j'espère. »",
    neoGuideHint: "Vérifie tes formules avant de tirer. Précision = arme."
  },
  algebron: {
    bossTitle: 'Théorème Inachevé',
    lore: "Une démonstration jamais terminée qui erre depuis. Il cherche son point final.",
    challenge: "« Démontre. Ou rentre chez toi. »",
    neoGuideHint: "Chaque étape compte. Ne saute rien."
  },
  lexoria: {
    bossTitle: 'Manuscrit Effacé',
    lore: "Toutes les phrases qu'on n'a pas relues viennent s'incarner ici. Elles veulent qu'on les lise enfin.",
    challenge: "« Tu sais lire ? Vraiment lire ? »",
    neoGuideHint: "Lis chaque mot. La nuance fait le sens."
  }
};
