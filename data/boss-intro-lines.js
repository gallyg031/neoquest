// ── Lignes narratives d'intro de combat (lore + défi + hint NeoGuide) par royaume ──
// Fallback générique par thème. Quand un boss a son lore propre, le chap pourra fournir
// chap.intro = {bossTitle, lore, challenge, neoGuideHint} qui override ces valeurs.

window.__BOSS_INTRO_LINES = {
  historya: {
    bossTitle: 'Gardien des Annales Oubliées',
    lore: "Né d'une page arrachée du grand registre, il garde jalousement les souvenirs que les hommes ont laissé se dissoudre dans l'Oubli.",
    challenge: "« Tu prétends connaître mes annales… prouve-le, jeune scribe. »",
    neoGuideHint: "Concentre-toi sur les faits, les dates, les noms. Chaque éclat de mémoire compte."
  },
  bioverde: {
    bossTitle: 'Sève Pétrifiée',
    lore: "Quand un cycle de vie est oublié, ses racines se figent. Cette créature minérale s'oppose à tout ce qui pousse et respire.",
    challenge: "« Tes racines sont-elles assez profondes pour me déchiffrer ? »",
    neoGuideHint: "Pense aux mécanismes du vivant. Observe avant de tirer ton éclat."
  },
  quantix: {
    bossTitle: 'Erreur de Calcul Absolue',
    lore: "Né d'une division par zéro maintenue trop longtemps, cet être paradoxal refuse l'ordre des lois physiques.",
    challenge: "« La science ne pardonne pas l'à-peu-près, apprenti. »",
    neoGuideHint: "Vérifie tes formules avant de tirer. La précision est ton arme."
  },
  algebron: {
    bossTitle: 'Théorème Inachevé',
    lore: "Issu d'une démonstration jamais conclue, il erre dans le brouillard à la recherche de son point final.",
    challenge: "« Démontre… ou tais-toi. »",
    neoGuideHint: "Chaque étape compte. Ne saute pas un raisonnement."
  },
  lexoria: {
    bossTitle: 'Manuscrit Effacé',
    lore: "Toutes les phrases qu'on oublie de relire viennent s'incarner ici, en quête d'une voix qui les redira.",
    challenge: "« Sauras-tu redonner sens à mes lignes oubliées ? »",
    neoGuideHint: "Lis chaque mot. La nuance fait le sens."
  }
};
