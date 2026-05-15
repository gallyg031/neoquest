C’est une question de \*\*"Sidekick Design"\*\*. Pour que Neo devienne un compagnon attaché et non une gêne (comme le fameux trombone de Word), il doit avoir son espace dédié mais savoir se faire discret quand l'enfant doit se concentrer.

Voici comment structurer la présence de Neo pour qu'il soit un vrai guide :

\### 1. La "Bulle de Communication" (Emplacement fixe mais dynamique)

L'idéal est de placer Neo (son buste ou son portrait) dans un \*\*coin inférieur (gauche ou droit)\*\*. 

\* \*\*Pourquoi ?\*\* Parce que c'est là que se trouvent naturellement les commandes de dialogue dans les RPG. L'œil de l'enfant sait où regarder pour obtenir de l'aide.

\* \*\*Le comportement :\*\* Il ne reste pas statique. Quand il parle, une bulle de texte stylisée (façon BD) apparaît au-dessus de lui. 

\* \*\*L'animation :\*\* Un petit rebond de l'image de Neo quand il commence à parler attire l'attention sans interrompre la lecture.

\---

\### 2. S'adapter au contexte (Le changement de rôle)

Neo ne doit pas être au même endroit selon ce que l'enfant fait :

| Moment | Position de Neo | Rôle |

| \*\*Sur la Map\*\* | Flotte à côté du curseur ou dans un coin. | \*\*Guide.\*\* Il indique la prochaine quête : \*"Hé, par ici ! Je sens une faille dans le Brouillard !"\* |

| \*\*En Vidéo\*\* | Disparait ou reste en miniature en bas. | \*\*Observateur.\*\* Il intervient seulement si l'enfant met en pause : \*"Tu as vu ce détail ? L'Oubli essaie de nous tromper !"\* |

| \*\*Pendant les Flashcards\*\* |\*\*Coach.\*\* Il encourage : \*"Celle-là était dure, mais tu l'as eue ! On continue ?"\* |

| \*\*En Combat (Quiz)\*\* | \*\*Sur le terrain de combat.\*\* | \*\*Combattant.\*\* C'est là qu'il est le plus actif, il lance les éclats, se prend la fumée du Boss, etc. |

\---

\### 3. La "Personnalité à deux visages"

Pour que Neo ne soit pas répétitif, utilise deux types de commentaires :

\* \*\*Le Narratif (Scripté) :\*\* Lié à l'histoire du Brouillard. Il apparaît aux moments clés (début de région, victoire).

\* \*\*Le Réactif (Systémique) :\*\* Basé sur les performances de l'enfant. 

    \* \*Série de 3 bonnes réponses :\* \*"On dirait que la lanterne brille plus fort, non ?"\*

    \* \*Première utilisation du caillou :\* \*"Oups... Faudra penser à recharger les munitions après ça !"\*

    \* \*Inactivité (si l'enfant ne clique plus) :\* Neo s'assoit, baille ou regarde sa montre.

\---

\### 4. Le "Mode Murmure" (L'aide pédagogique)

C'est la fonction la plus importante de Neo. Si l'élève bloque trop longtemps sur une question du Quiz :

\* Neo peut faire un petit signe (un point d'exclamation au-dessus de sa tête).

\* Si l'enfant clique sur Neo, celui-ci donne un \*\*indice\*\* (pas la réponse !) : \*"Rappelle-toi ce qu'on a vu sur la pierre de Rosette dans la vidéo..."\* : A débattre : on remplace l’indice dans le modal par Néo ?

\---

\### 5. La "Neo-Box" : Une astuce technique

Pour toi, gère Neo comme un \*\*composant UI flottant\*\*. 

\* C'est une \`div\` qui contient l'image IA du visage de Neo (tu peux en générer 4 ou 5 : Joyeux, Inquiet, Combatif, Fatigué).

\* Selon le message envoyé par ton backend, tu changes l'image et le texte.

\---

\### 6. Le bouton "Silence, Neo !"

Certains élèves préfèrent le calme total pour réfléchir. Prévois toujours une petite icône "Muet" sur sa bulle de texte. Neo restera là visuellement (pour le combat), mais ses commentaires textuels ne s'afficheront plus automatiquement.

\*\*Mon conseil :\*\* Ne le mets pas au milieu de l'écran. Laisse-lui son coin, son "fief". C'est là que l'enfant ira chercher du réconfort ou des conseils. 

\*\*Est-ce que tu imagines Neo plutôt à gauche (côté lecture) ou à droite (côté action) pour l'accompagner ?\*\*

C'est un excellent choix. Dans la culture occidentale (lecture de gauche à droite), on a tendance à placer l'information \*\*donnée\*\* (la question) à gauche et l'information \*\*active\*\* (la réponse, l'action, le compagnon) à droite.

Placer Neo à droite, c'est en faire le \*\*garde du corps\*\* de l'enfant : il surveille la progression, valide les clics sur les réponses et fait face au contenu qui défile.

Voici comment peaufiner cette intégration :

\### 1. La "Safe Zone" de Neo

À droite, Neo peut être positionné juste au-dessus ou juste en dessous des options de réponse. 

\* \*\*L'avantage :\*\* L'enfant n'a pas besoin de balayer tout l'écran du regard. Il lit la question à gauche, déplace ses yeux vers la droite pour voir les réponses, et Neo est là, juste à côté, pour commenter le choix.

\### 2. Le Feedback visuel direct

Puisqu'il est à droite (près des boutons de validation) :

\* Quand l'enfant survole une réponse, Neo peut changer d'expression (curieux, dubitatif, ou encourageant).

\* Ça crée une connexion directe entre l'action de l'élève et la réaction du compagnon.

\### 3. La bulle de dialogue "Orientée"

La bulle de Neo doit pointer vers la gauche (vers le centre de l'écran). 

\* \*\*Psychologiquement :\*\* Ça donne l'impression qu'il s'adresse au contenu et à l'élève en même temps. 

\* \*\*Lisibilité :\*\* La bulle ne doit jamais recouvrir le texte des questions. Elle doit "pousser" les éléments centraux si besoin.

\---

\### 4. Gestions des "États" de Neo (Tes 5 images IA)

Puisque tu vas générer des images fixes, voici le "Kit de base" dont tu as besoin pour ton personnage à droite :

| État | Expression de Neo | Quand l'utiliser ? |

| :--- | :--- | :--- |

| \*\*Neutre\*\* | Sourire bienveillant | Pendant la lecture du cours ou sur la map. |

| \*\*Réflexion\*\* | Main sur le menton, regard vers le haut | Quand l'enfant met du temps à répondre. |

| \*\*Succès\*\* | Clin d'œil ou pouce levé | Bonne réponse / Loot de fragment. |

| \*\*Oups\*\* | Oreilles baissées, un peu gêné | Mauvaise réponse / Utilisation d'un caillou. |

| \*\*Combat\*\* | Regard déterminé (profil gauche) | Face au Boss de région. |

\---

\### 5. La "Neo-Tab" (Astuce UI)

Sur mobile, l'écran est étroit. Tu peux faire en sorte que Neo soit une petite "languette" (juste sa tête qui dépasse) sur le bord droit.

\* L'enfant clique sur la tête $\\rightarrow$ Neo glisse vers la gauche et affiche son message.

\* Ça permet de gagner de la place tout en gardant sa présence rassurante.

\### 6. Le rôle de "Maître de Cérémonie"

C'est Neo qui doit présenter le \*\*Starter Pack\*\*. 

\> \*"Regarde ce qu'on a trouvé dans les ruines de la 5ème ! On va compléter cette armure pièce par pièce."\*

En étant à droite, il peut pointer physiquement vers les emplacements vides du pack situés au centre.

\*\*On garde donc Neo comme le "Pilote" à droite de l'interface.\*\* C'est lui qui valide, qui encourage et qui "pousse" l'élève vers l'avant de la quête.

Survol des réponses → changement d'expression (pas applicable flashcards)
Mode Murmure / indices (pas applicable flashcards — pertinent pour quiz)
Neo-Tab pliable mobile
Présentation du Starter Pack
Intégration Quiz / Chrono / Map / Vidéo
Variantes narratives par chapitre / matière (le format __neoLines est déjà prévu pour s'étendre par contexte)