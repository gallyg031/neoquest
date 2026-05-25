window.__neoData = {
  "matieres": [
    {
      "id": "histoire-geo",
      "nom": "Histoire-Géographie",
      "logo": "img/NeoGeo-Transp.png",
      "couleur": "#a855f7",
      "couleur_print": "#4c1d95",
      "niveaux": [
        {
          "id": "6eme",
          "nom": "6ème",
          "themes": [
            {
              "id": "aube-humanite",
              "nom": "L'Aube de l'Humanité",
              "nom_region": "L'Aube de l'Humanité",
              "icone_region": "🌅",
              "loot_region": {
                "nom": "L'Éclat du Premier Feu",
                "emoji": "🔥"
              },
              "chapitres": []
            },
            {
              "id": "eveil-mediterranee",
              "nom": "L'Éveil de la Méditerranée",
              "nom_region": "L'Éveil de la Méditerranée",
              "icone_region": "🌊",
              "loot_region": {
                "nom": "Le Parchemin des Dieux",
                "emoji": "📜"
              },
              "chapitres": []
            },
            {
              "id": "aigle-rome",
              "nom": "L'Aigle de Rome",
              "nom_region": "L'Aigle de Rome",
              "icone_region": "🦅",
              "loot_region": {
                "nom": "Le Casque du Centurion",
                "emoji": "⚔️"
              },
              "chapitres": []
            }
          ],
          "nom_province": "L'Origine",
          "ambiance": "Préhistoire, déserts, marbre blanc et temples antiques",
          "emoji_province": "🏛️",
          "couleur_province": "#22d3ee",
          "soustitre": "L'Antiquité & les premières civilisations"
        },
        {
          "id": "5eme",
          "nom": "5ème",
          "themes": [
            {
              "id": "choc-empires",
              "nom": "Le Choc des Empires",
              "nom_region": "Le Choc des Empires",
              "couleur_region": "#f59e0b",
              "icone_region": "🕌",
              "loot_region": {
                "nom": "Tunique de l'Érudit Nomade",
                "emoji": "🧥"
              },
              "chapitres": [
                {
                  "id": "heritage-aigles",
                  "nom": "Byzance & Carolingiens",
                  "nom_quete": "L'Héritage des Aigles",
                  "icone_quete": "👑",
                  "presentation": "Deux empereurs jumeaux se proclamèrent héritiers de Rome — l'un à Byzance, l'autre à Aix-la-Chapelle — et leurs couronnes brillèrent côte à côte pendant des siècles. Sauras-tu démêler leurs deux trônes avant que le schisme ne les avale tout entiers ?",
                  "boss": {
                    "nom": "Schismaeon, le Chœur Brisé",
                    "personnage": "Une immense cloche de bronze fracturée en deux moitiés qui flottent dos à dos, chacune sonnant dans une langue différente, entourée d'un nuage de vitraux éclatés et de mosaïques d'or en suspension.",
                    "lore": "Né au cœur du Brouillard de l'Oubli le jour où les chrétientés d'Orient et d'Occident cessèrent de se comprendre, Schismaeon est l'écho fantôme du schisme qui a déchiré la foi médiévale en deux. De son battant de fer pend une lourde chaîne ornée d'un anneau gravé d'une croix latine d'un côté et d'une croix orthodoxe de l'autre : la Chaîne de Sainte-Sophie, forgée dans les fondations mêmes de la grande basilique de Constantinople. Tant qu'il sonne, les élèves confondent pape et patriarche, latin et grec, catholiques et orthodoxes — il ne libérera la Chaîne qu'à un Explorateur capable de remettre l'harmonie entre les deux Églises.",
                    "presentation": "Dans un fracas de bronze et un nuage de vitraux brisés, deux demi-cloches s'élèvent du Brouillard — Schismaeon s'éveille, et son double tintement fait vaciller mille ans d'Histoire.",
                    "image_mechant": "img/boss/boss-schismaeon-le-choeur-brise-mechant",
                    "image_apaise": "img/boss/boss-schismaeon-le-choeur-brise-apaise",
                    "image_mechant_profil": "img/boss/boss-schismaeon-le-choeur-brise-mechant-profil",
                    "image_apaise_profil": "img/boss/boss-schismaeon-le-choeur-brise-apaise-profil",
                    "panini_mechant": "img/panini/panini-schismaeon-le-choeur-brise-mechant",
                    "panini_apaise": "img/panini/panini-schismaeon-le-choeur-brise-apaise",
                    "dialogues": {
                      "avant_combat": [
                        "Petit Neo... entends-tu mon double écho ? L'un en latin, l'autre en grec — sauras-tu accorder mes deux voix ?",
                        "Ding... dong... ma cloche fissurée fait taire la moitié de l'Histoire à chaque coup. Lequel de mes deux chants choisiras-tu ?",
                        "Avant moi, la chrétienté ne formait qu'une seule note. Depuis mille ans, je sonne en discord. Prouve-moi que tu sais entendre les deux !"
                      ],
                      "touche": [
                        "Cling ! Une fêlure se referme... comment connais-tu ces voix oubliées ?",
                        "Mon bronze tremble... tu rappelles à mes vitraux leur couleur d'origine !",
                        "Aïe ! Tu accordes mes deux moitiés... la Chaîne se desserre !"
                      ],
                      "rate": [
                        "Ha ha ! Tu mélanges Constantinople et Aix-la-Chapelle comme on mélange deux chants discordants !",
                        "Encore une fausse note, Explorateur... mon double écho s'amplifie dans l'Oubli.",
                        "Tu confonds le pape et le patriarche... ma cloche sonne plus fort, et toi tu trembles."
                      ],
                      "defaite": "Mes deux moitiés... s'accordent enfin... dans un dernier silence harmonieux...",
                      "phare_idle": [
                        "Repose-toi, Explorateur. Ma cloche enfin posée, laisse-moi te conter ce que mes deux moitiés savaient sans jamais s'entendre.",
                        "Souviens-toi : en 395, l'Empire romain se fendit en deux. Rome chuta en 476, mais Byzance survécut, jusqu'à la prise de Constantinople par les Ottomans en 1453.",
                        "À l'ouest, Charlemagne fut sacré empereur à Rome en l'an 800, et son immense royaume se gouverna depuis Aix-la-Chapelle. Mais ses fils se déchirèrent au traité de Verdun en 843, et l'Empire carolingien se brisa en trois.",
                        "Le basileus régnait à Constantinople, gardien du Code justinien rédigé en grec ; Charlemagne, lui, réunissait ses comtes en plaids et bâtissait sa chapelle en latin. Deux mondes, deux langues, deux empires héritiers de Rome.",
                        "Et en 1054, le schisme — ce mot grec qui signifie « séparation » — divisa la chrétienté pour toujours : le pape à Rome, le patriarche à Constantinople, les catholiques en latin, les orthodoxes en grec. Garde ma Chaîne, Explorateur : tant qu'elle résonnera juste, tu n'oublieras plus quelle croix se tient à quel autel."
                      ]
                    }
                  },
                  "loot_quete": {
                    "nom": "La Chaîne de Sainte-Sophie",
                    "emoji": "⛓️",
                    "image": "img/loot/loot-la-chaine-de-sainte-sophie"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [
                    {
                      "question": "En quelle année l'Empire romain est-il partagé en deux ?",
                      "reponse": "En 395, l'Empire romain est partagé entre l'Empire romain d'Occident et l'Empire romain d'Orient.",
                      "indice": "C'est à la toute fin du IVe siècle, juste avant la chute de Rome."
                    },
                    {
                      "question": "Quand l'Empire romain d'Occident s'effondre-t-il ?",
                      "reponse": "L'Empire romain d'Occident s'effondre en 476, suite aux invasions venues du Nord et du Sud.",
                      "indice": "Date classique qui marque la fin de l'Antiquité."
                    },
                    {
                      "question": "Quel empire survit à l'effondrement de Rome en 476 ?",
                      "reponse": "L'Empire byzantin survit à l'est et perdure près de mille ans encore.",
                      "indice": "Son cœur se trouve à Constantinople, capitale d'Orient."
                    },
                    {
                      "question": "Quel empereur byzantin règne de 527 à 565 ?",
                      "reponse": "L'empereur Justinien, dont le règne marque l'apogée de l'Empire byzantin.",
                      "indice": "Son nom est associé à un grand code de lois et à Sainte-Sophie."
                    },
                    {
                      "question": "Quel est l'objectif politique de Justinien ?",
                      "reponse": "Justinien souhaite restaurer l'ancien Empire romain en reconquérant les terres perdues à l'ouest.",
                      "indice": "Il se considère comme l'héritier des empereurs romains antiques."
                    },
                    {
                      "question": "Que signifie le titre « basileus » et qui le porte ?",
                      "reponse": "« Basileus » signifie « roi » en grec ; c'est le titre de l'empereur byzantin.",
                      "indice": "Il remplace l'ancien titre romain « Auguste »."
                    },
                    {
                      "question": "Quelle est la capitale de l'Empire byzantin ?",
                      "reponse": "La capitale est Constantinople, où réside le basileus.",
                      "indice": "Une cité fondée par l'empereur Constantin, sur le Bosphore."
                    },
                    {
                      "question": "Quels pouvoirs concentre le basileus ?",
                      "reponse": "Le basileus est à la fois chef militaire, politique et religieux de l'empire.",
                      "indice": "Il concentre presque tous les pouvoirs, comme les anciens empereurs romains."
                    },
                    {
                      "question": "Qu'est-ce que le Code justinien ?",
                      "reponse": "Le Code justinien est un recueil unifiant le droit byzantin, rédigé en grec et inspiré des lois romaines.",
                      "indice": "Il porte le nom de l'empereur qui l'a commandé."
                    },
                    {
                      "question": "Quel événement marque la fin de l'Empire byzantin ?",
                      "reponse": "La prise de Constantinople par les Ottomans en 1453 marque la fin de l'Empire byzantin.",
                      "indice": "Cette date est souvent prise comme la fin du Moyen Âge."
                    },
                    {
                      "question": "De quelle dynastie Charlemagne est-il l'héritier ?",
                      "reponse": "Charlemagne appartient à la dynastie des Carolingiens, qui dirige le royaume des Francs depuis le VIIIe siècle.",
                      "indice": "La dynastie porte le nom d'un de ses plus grands rois."
                    },
                    {
                      "question": "Quel roi précède Charlemagne et renforce le royaume des Francs ?",
                      "reponse": "Pépin le Bref, son père, renforce le royaume avant sa mort en 768.",
                      "indice": "Son surnom évoque sa petite taille."
                    },
                    {
                      "question": "En quelle année Charlemagne est-il sacré empereur ?",
                      "reponse": "Charlemagne est sacré empereur à Rome en l'an 800, par le pape.",
                      "indice": "Une date ronde, juste au tournant des VIIIe et IXe siècles."
                    },
                    {
                      "question": "Quelle est la capitale de l'Empire carolingien ?",
                      "reponse": "La capitale est Aix-la-Chapelle, où Charlemagne s'entoure d'une cour fastueuse.",
                      "indice": "Une ville aujourd'hui à la frontière entre l'Allemagne et la Belgique."
                    },
                    {
                      "question": "Comment Charlemagne organise-t-il son empire ?",
                      "reponse": "Il charge des comtes de faire respecter les lois, lever les impôts et rendre la justice dans chaque province.",
                      "indice": "Des hommes de confiance représentent l'empereur dans chaque région."
                    },
                    {
                      "question": "Qu'est-ce qu'un plaid à l'époque carolingienne ?",
                      "reponse": "Un plaid est une grande réunion où l'empereur et ses comtes discutent des affaires importantes de l'empire.",
                      "indice": "Un mot qui désigne aujourd'hui une couverture, mais signifiait à l'origine « assemblée »."
                    },
                    {
                      "question": "Qui succède à Charlemagne en 814 ?",
                      "reponse": "Son fils Louis le Pieux lui succède en 814.",
                      "indice": "Son surnom évoque sa grande dévotion religieuse."
                    },
                    {
                      "question": "Que se passe-t-il en 843 ?",
                      "reponse": "Le partage de Verdun divise l'Empire carolingien en trois royaumes : Lotharingie, Francie occidentale et Francie orientale.",
                      "indice": "Une division entre les héritiers qui marque la fin de l'Empire carolingien."
                    },
                    {
                      "question": "Qu'est-ce que le schisme de 1054 ?",
                      "reponse": "Le schisme de 1054 divise la chrétienté en deux Églises : l'Église catholique (Occident) et l'Église orthodoxe (Orient).",
                      "indice": "Le mot « schisme » signifie « séparation » en grec."
                    },
                    {
                      "question": "Qui dirige chacune des deux Églises après le schisme ?",
                      "reponse": "L'Église catholique est dirigée par le pape à Rome ; l'Église orthodoxe par le patriarche de Constantinople.",
                      "indice": "Deux capitales religieuses, l'une à l'ouest, l'autre à l'est."
                    }
                  ],
                  "quiz": [
                    {
                      "question": "En quelle année l'Empire romain est-il partagé en deux ?",
                      "difficulte": "Facile",
                      "choix": [
                        "En 395 après J.-C.",
                        "En 476 après J.-C.",
                        "En 800 après J.-C.",
                        "En 1054 après J.-C."
                      ],
                      "bonne_reponse": "En 395 après J.-C.",
                      "indice": "Date proche de la chute de Rome (476).",
                      "explication": "En 395, à la mort de l'empereur Théodose, l'Empire romain est partagé entre Orient et Occident."
                    },
                    {
                      "question": "Quelle est la capitale de l'Empire byzantin ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Constantinople, en Orient",
                        "Rome, sur le Tibre",
                        "Aix-la-Chapelle, à l'ouest",
                        "Athènes, en mer Égée"
                      ],
                      "bonne_reponse": "Constantinople, en Orient",
                      "indice": "Une cité fondée par l'empereur Constantin.",
                      "explication": "Constantinople est la capitale byzantine depuis 330 jusqu'à sa prise par les Ottomans en 1453."
                    },
                    {
                      "question": "Comment s'appelle l'empereur byzantin ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Le basileus",
                        "Le pontife",
                        "Le sénateur",
                        "Le tribun"
                      ],
                      "bonne_reponse": "Le basileus",
                      "indice": "Un titre grec qui signifie « roi ».",
                      "explication": "Le basileus est l'empereur byzantin ; le mot vient du grec et signifie « roi »."
                    },
                    {
                      "question": "En quelle année Charlemagne est-il sacré empereur ?",
                      "difficulte": "Facile",
                      "choix": [
                        "En l'an 800",
                        "En l'an 768",
                        "En l'an 843",
                        "En l'an 1054"
                      ],
                      "bonne_reponse": "En l'an 800",
                      "indice": "Une date qui tombe pile au tournant du IXe siècle.",
                      "explication": "Charlemagne est sacré empereur par le pape Léon III à Rome, le 25 décembre 800."
                    },
                    {
                      "question": "Quelle est la capitale de l'Empire carolingien ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Aix-la-Chapelle, au nord",
                        "Constantinople, à l'est",
                        "Rome, au centre de l'Italie",
                        "Paris, sur la Seine"
                      ],
                      "bonne_reponse": "Aix-la-Chapelle, au nord",
                      "indice": "Ville aujourd'hui à la frontière germano-belge.",
                      "explication": "Charlemagne installe sa cour à Aix-la-Chapelle, qu'il transforme en capitale prestigieuse."
                    },
                    {
                      "question": "Que signifie le mot « schisme » en grec ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Séparation",
                        "Alliance",
                        "Couronnement",
                        "Conquête"
                      ],
                      "bonne_reponse": "Séparation",
                      "indice": "Le mot vient du grec ancien.",
                      "explication": "Le mot « schisme » signifie « séparation » en grec ; il désigne la division de la chrétienté en 1054."
                    },
                    {
                      "question": "Qui Charlemagne charge-t-il d'appliquer ses lois dans les provinces ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Les comtes, ses hommes de confiance",
                        "Les évêques qui dirigent les régions",
                        "Les ducs qui commandent les armées",
                        "Les patriarches venus de Constantinople"
                      ],
                      "bonne_reponse": "Les comtes, ses hommes de confiance",
                      "indice": "Ils représentent l'empereur dans chaque province.",
                      "explication": "Charlemagne nomme des comtes pour appliquer les lois, lever les impôts et rendre la justice dans ses provinces."
                    },
                    {
                      "question": "Que sont les plaids dans l'Empire carolingien ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Des grandes réunions politiques de l'empire",
                        "Des tribunaux pour juger les criminels",
                        "Des cérémonies religieuses du sacre",
                        "Des manuels rassemblant les lois écrites"
                      ],
                      "bonne_reponse": "Des grandes réunions politiques de l'empire",
                      "indice": "L'empereur y discute avec ses comtes.",
                      "explication": "Les plaids sont des assemblées où Charlemagne réunit ses comtes pour discuter les affaires de l'empire."
                    },
                    {
                      "question": "Qu'est-ce que le Code justinien ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Un recueil de lois byzantines en grec",
                        "Un livre de prières pour les moines",
                        "Un traité d'alliance entre deux empires",
                        "Un manuel de stratégie militaire navale"
                      ],
                      "bonne_reponse": "Un recueil de lois byzantines en grec",
                      "indice": "Il porte le nom de l'empereur qui l'a commandé.",
                      "explication": "Justinien fait rédiger le Code justinien pour unifier le droit byzantin ; inspiré des lois romaines, il est écrit en grec."
                    },
                    {
                      "question": "Pourquoi les empereurs se font-ils sacrer par l'Église ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Pour montrer qu'ils reçoivent leur pouvoir de Dieu",
                        "Pour obtenir l'autorisation de lever des impôts",
                        "Pour conclure un traité de paix avec les voisins",
                        "Pour pouvoir conduire eux-mêmes des batailles"
                      ],
                      "bonne_reponse": "Pour montrer qu'ils reçoivent leur pouvoir de Dieu",
                      "indice": "Le sacre est une cérémonie religieuse symbolique.",
                      "explication": "Le sacre est une cérémonie religieuse qui légitime le pouvoir politique en montrant qu'il vient directement de Dieu."
                    },
                    {
                      "question": "Quels peuples Charlemagne envoie-t-il évangéliser ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Les Danois, les Polonais et les Suédois",
                        "Les Bulgares, les Russes et les Serbes",
                        "Les Arabes, les Perses et les Turcs",
                        "Les Goths, les Vandales et les Huns"
                      ],
                      "bonne_reponse": "Les Danois, les Polonais et les Suédois",
                      "indice": "Des peuples situés au nord et à l'est de son empire.",
                      "explication": "Charlemagne envoie des missionnaires vers le Nord et l'Est de l'Europe ; les Byzantins, eux, évangélisent les Bulgares et les Russes."
                    },
                    {
                      "question": "Quelle basilique Justinien fait-il construire à Constantinople ?",
                      "difficulte": "Medium",
                      "choix": [
                        "La basilique Sainte-Sophie",
                        "La basilique Saint-Pierre",
                        "La basilique Sainte-Marie",
                        "La basilique Saint-Marc"
                      ],
                      "bonne_reponse": "La basilique Sainte-Sophie",
                      "indice": "Son nom signifie « sainte sagesse » en grec.",
                      "explication": "Justinien fait bâtir Sainte-Sophie, l'une des plus vastes basiliques du monde chrétien à l'époque."
                    },
                    {
                      "question": "Quelle langue Charlemagne utilise-t-il pour son administration ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Le latin, héritage des Romains",
                        "Le grec, langue des byzantins",
                        "Le franc, langue de ses ancêtres",
                        "L'hébreu, langue des écritures"
                      ],
                      "bonne_reponse": "Le latin, héritage des Romains",
                      "indice": "Même langue que celle de la cour antique romaine.",
                      "explication": "Charlemagne reprend le latin comme langue d'administration, à l'image des anciens empereurs romains."
                    },
                    {
                      "question": "Que partagent les fils de Louis le Pieux en 843 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "L'Empire carolingien en trois royaumes",
                        "Le trésor familial entre les héritiers",
                        "Les flottes navales entre les provinces",
                        "Les terres d'Église entre les comtes"
                      ],
                      "bonne_reponse": "L'Empire carolingien en trois royaumes",
                      "indice": "Le partage porte le nom d'une ville sur la Meuse.",
                      "explication": "Le partage de Verdun en 843 divise l'Empire carolingien en Lotharingie, Francie occidentale et Francie orientale."
                    },
                    {
                      "question": "Pourquoi Justinien et Charlemagne se disent-ils héritiers de Rome ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Tous deux cherchent à restaurer l'idéal impérial romain",
                        "Tous deux parlent uniquement latin dans leur palais",
                        "Tous deux gouvernent depuis l'ancienne ville de Rome",
                        "Tous deux refusent toute religion autre que païenne"
                      ],
                      "bonne_reponse": "Tous deux cherchent à restaurer l'idéal impérial romain",
                      "indice": "Pense à leurs ambitions politiques communes.",
                      "explication": "Justinien et Charlemagne s'inspirent du modèle romain : reconquêtes, droit écrit, administration centralisée, cour fastueuse."
                    },
                    {
                      "question": "Quelle différence essentielle distingue catholiques et orthodoxes après 1054 ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Ils partagent les mêmes croyances mais des pratiques différentes",
                        "Ils croient en des dieux totalement différents l'un de l'autre",
                        "Les catholiques ne reconnaissent plus la figure du Christ",
                        "Les orthodoxes refusent la lecture des textes religieux"
                      ],
                      "bonne_reponse": "Ils partagent les mêmes croyances mais des pratiques différentes",
                      "indice": "La rupture porte sur la pratique du culte, pas la foi.",
                      "explication": "Après le schisme, ils partagent les mêmes croyances mais diffèrent sur les pratiques : langue, mariage des prêtres, autorité religieuse."
                    },
                    {
                      "question": "Pourquoi l'Empire byzantin survit-il plus longtemps que l'Empire carolingien ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Il bénéficie d'une administration centralisée plus stable",
                        "Il pratique une religion totalement différente des autres",
                        "Il évite tout conflit avec les peuples des frontières",
                        "Il bénéficie de la protection militaire des Carolingiens"
                      ],
                      "bonne_reponse": "Il bénéficie d'une administration centralisée plus stable",
                      "indice": "Compare la cohésion politique des deux empires.",
                      "explication": "L'Empire byzantin tient près de mille ans grâce à son administration centralisée ; le Carolingien, partagé dès 843, dure beaucoup moins."
                    },
                    {
                      "question": "En quoi le sacre renforce-t-il le pouvoir impérial ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Il fait croire que l'empereur a été choisi par Dieu lui-même",
                        "Il oblige l'empereur à céder ses biens aux pauvres",
                        "Il transforme l'empereur en chef religieux du pape",
                        "Il permet à l'empereur d'épouser une princesse étrangère"
                      ],
                      "bonne_reponse": "Il fait croire que l'empereur a été choisi par Dieu lui-même",
                      "indice": "Symbole religieux combiné à l'autorité politique.",
                      "explication": "Le sacre place le pouvoir de l'empereur sous une autorité divine ; cela rend très difficile la contestation de son pouvoir."
                    },
                    {
                      "question": "Quel point commun rapproche le Code justinien et les comtes carolingiens ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Tous deux s'inspirent du modèle administratif romain antique",
                        "Tous deux sont rédigés exclusivement en langue grecque",
                        "Tous deux abolissent l'autorité religieuse du clergé",
                        "Tous deux interdisent l'esclavage dans tout l'empire"
                      ],
                      "bonne_reponse": "Tous deux s'inspirent du modèle administratif romain antique",
                      "indice": "Pense à ce que les deux empereurs ont en commun.",
                      "explication": "Justinien rédige son Code en s'inspirant du droit romain ; Charlemagne organise ses comtes et ses plaids sur le modèle institutionnel romain."
                    },
                    {
                      "question": "Pourquoi le schisme de 1054 a-t-il marqué durablement l'Europe ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Il a séparé deux mondes culturels qui ne se rejoindront plus",
                        "Il a entraîné la disparition complète du christianisme",
                        "Il a permis aux musulmans de conquérir toute l'Europe",
                        "Il a forcé tous les chrétiens à se convertir au judaïsme"
                      ],
                      "bonne_reponse": "Il a séparé deux mondes culturels qui ne se rejoindront plus",
                      "indice": "Une division qui persiste encore aujourd'hui.",
                      "explication": "Le schisme acte la séparation Occident catholique / Orient orthodoxe : des cultures, des liturgies et des autorités qui structurent encore l'Europe contemporaine."
                    }
                  ],
                  "diff_custom": {
                    "facile": "Apprenti Hérault",
                    "medium": "Chroniqueur des Empires",
                    "hard": "Maître des Deux Trônes"
                  }
                },
                {
                  "id": "souffle-desert",
                  "nom": "Naissance de l'Islam",
                  "nom_quete": "Le Souffle du Désert",
                  "icone_quete": "🌙",
                  "loot_quete": {
                    "nom": "L'Amphore d'Orient",
                    "emoji": "🏺"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [],
                  "quiz": []
                },
                {
                  "id": "savoirs-bagdad",
                  "nom": "Pouvoirs & Cultures",
                  "nom_quete": "Les Savoirs de Bagdad",
                  "icone_quete": "📜",
                  "loot_quete": {
                    "nom": "Le Parchemin des Savants",
                    "emoji": "📜"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [],
                  "quiz": []
                }
              ]
            },
            {
              "id": "age-seigneurs",
              "nom": "L'Âge des Seigneurs",
              "nom_region": "L'Âge des Seigneurs",
              "couleur_region": "#16a34a",
              "icone_region": "🏰",
              "loot_region": {
                "nom": "Le Tabard de Chevalier",
                "emoji": "🛡️"
              },
              "chapitres": [
                {
                  "id": "ordre-seigneurial",
                  "nom": "L'ordre seigneurial : la formation et la domination des campagnes",
                  "nom_quete": "Le Maître des Terres",
                  "icone_quete": "🌾",
                  "loot_quete": {
                    "nom": "La Sacoche du Paysan",
                    "emoji": "🌾"
                  },
                  "youtube": "",
                  "pdf": "fiches/histoire-5eme-ordre-seigneurial.pdf",
                  "flashcards": [],
                  "quiz": [],
                  "badges_custom": {
                    "novice": {
                      "label": "Novice"
                    },
                    "initie": {
                      "label": "Initié"
                    },
                    "maitre": {
                      "label": "Maître"
                    }
                  },
                  "diff_custom": {
                    "facile": "Facile",
                    "medium": "Medium",
                    "hard": "Hard"
                  }
                },
                {
                  "id": "emergence-villes",
                  "nom": "L'émergence d'une nouvelle société urbaine",
                  "nom_quete": "Neo et les Bâtisseurs",
                  "icone_quete": "🏘️",
                  "loot_quete": {
                    "nom": "Le Panier de la Foire",
                    "emoji": "🥖"
                  },
                  "youtube": "ETcHYFba9NY",
                  "pdf": "fiches/histoire-5eme-emergence-villes.pdf",
                  "badges_custom": {
                    "novice": {
                      "label": "Novice de la Cité",
                      "desc": ""
                    },
                    "initie": {
                      "label": "Marchand de la Guilde",
                      "desc": ""
                    },
                    "maitre": {
                      "label": "Maître de la Commune",
                      "desc": ""
                    }
                  },
                  "diff_custom": {
                    "facile": "Novice de la Cité",
                    "medium": "Marchand de la Guilde",
                    "hard": "Maître de la Commune"
                  },
                  "flashcards": [
                    {
                      "question": "Comment appelle-t-on un habitant de la ville, souvent riche et puissant par son travail, qui a obtenu des libertés ?",
                      "reponse": "Un bourgeois.",
                      "indice": "Il ne fait pas partie des seigneurs.",
                      "youtube_timestamp": 45
                    },
                    {
                      "question": "Quel document écrit par le seigneur accorde des droits, des privilèges et une autonomie aux bourgeois ?",
                      "reponse": "Une charte de franchises.",
                      "indice": "C'est une « charte ».",
                      "youtube_timestamp": 75
                    },
                    {
                      "question": "Comment s'appelle l'association qui regroupe les personnes exerçant le même métier dans la ville ?",
                      "reponse": "Une corporation.",
                      "indice": "Elle décide qui a le droit d'entrer dans le métier ou en est exclu.",
                      "youtube_timestamp": 105
                    },
                    {
                      "question": "Durant quelle période précise la nouvelle société urbaine émerge-t-elle le plus fortement ?",
                      "reponse": "Du XIIe au XVe siècle.",
                      "indice": "C'est une période de quatre siècles, juste avant la Renaissance.",
                      "youtube_timestamp": 45
                    },
                    {
                      "question": "Cite deux régions d'Europe où les villes se développent de manière spectaculaire.",
                      "reponse": "Le Nord de l'Italie et la Flandre.",
                      "indice": "L'une est le pays de Venise, l'autre est très connue pour le commerce du drap.",
                      "youtube_timestamp": 90
                    },
                    {
                      "question": "Comment appelle-t-on une ville qui s'est libérée de la domination de son seigneur pour s'administrer elle-même ?",
                      "reponse": "Une commune.",
                      "indice": "Aujourd'hui, c'est le mot utilisé pour désigner une municipalité.",
                      "youtube_timestamp": 120
                    },
                    {
                      "question": "Comment les villes font-elles pour s'agrandir face à l'augmentation de la population ?",
                      "reponse": "Elles se développent au-delà de leurs anciens remparts ou par la création de nouveaux quartiers.",
                      "indice": "Elles débordent de leurs anciens murs de protection.",
                      "youtube_timestamp": 150
                    },
                    {
                      "question": "En l'espace de deux siècles, comment évolue la proportion de la population vivant en ville ?",
                      "reponse": "Elle passe de 10 % à 20 %.",
                      "indice": "La proportion a doublé.",
                      "youtube_timestamp": 195
                    },
                    {
                      "question": "Que produisent les campagnes et qui permet de nourrir la population de plus en plus nombreuse des villes ?",
                      "reponse": "Des surplus agricoles.",
                      "indice": "C'est la part de récolte produite en trop par rapport aux besoins des paysans."
                    },
                    {
                      "question": "Quelle action des paysans pousse les seigneurs à fonder de nouvelles villes ?",
                      "reponse": "Les défrichements.",
                      "indice": "Le verbe associé est « défricher »."
                    },
                    {
                      "question": "Cite deux grands ports d'Europe qui s'enrichissent considérablement grâce au commerce international.",
                      "reponse": "Bruges et Venise.",
                      "indice": "L'un est en Italie, l'autre en Flandre."
                    },
                    {
                      "question": "Quelle ville de la région Champagne est très célèbre au Moyen Âge pour être une grande « ville de foire » ?",
                      "reponse": "Troyes.",
                      "indice": "Son nom ressemble au chiffre 3."
                    },
                    {
                      "question": "Quelles sont les trois professions qui s'enrichissent le plus grâce au commerce dans les villes ?",
                      "reponse": "Les artisans, les marchands et les banquiers.",
                      "indice": "Ils fabriquent, ils vendent et ils gèrent l'argent."
                    },
                    {
                      "question": "Avec quelles régions du monde les routes commerciales permettent-elles d'échanger ?",
                      "reponse": "L'Afrique du Nord et l'Europe de l'Est.",
                      "indice": "De l'autre côté de la mer Méditerranée et à l'Est du continent."
                    },
                    {
                      "question": "Comment appelle-t-on les bourgeois qui siègent au conseil communal pour administrer la ville ?",
                      "reponse": "Les échevins.",
                      "indice": "Ce mot commence par un E."
                    },
                    {
                      "question": "Quels grands monuments symbolisent l'indépendance et l'autonomie des villes de Flandre ?",
                      "reponse": "Les beffrois.",
                      "indice": "Ce sont de très hautes tours situées au cœur de la ville."
                    },
                    {
                      "question": "Quels chantiers gigantesques stimulent beaucoup les métiers du bâtiment dans les villes ?",
                      "reponse": "La construction de gigantesques cathédrales, palais ou de bâtiments publics.",
                      "indice": "Ce sont d'immenses églises où siège un évêque."
                    },
                    {
                      "question": "Vrai ou Faux : Dans la ville au Moyen Âge, tout le monde possède à peu près la même richesse.",
                      "reponse": "Faux, la société urbaine est très inégalitaire.",
                      "indice": "Il y a une petite élite très riche et de nombreuses personnes pauvres."
                    },
                    {
                      "question": "Que commandent les riches bourgeois et les religieux pour décorer leurs édifices et leurs maisons ?",
                      "reponse": "Des objets d'art comme des tableaux, des vitraux et des portraits.",
                      "indice": "Ces créations attirent beaucoup d'artistes en ville."
                    },
                    {
                      "question": "Quelles nouvelles institutions d'enseignement apparaissent dans les villes à partir du XIIe siècle ?",
                      "reponse": "Des universités.",
                      "indice": "Aujourd'hui, c'est là que vont les étudiants après le baccalauréat."
                    }
                  ],
                  "quiz": [
                    {
                      "question": "Qu'est-ce qu'un bourgeois au Moyen Âge ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Un habitant riche non seigneur",
                        "Un paysan travaillant la terre",
                        "Un chevalier armé du seigneur",
                        "Un moine copiste d'une abbaye"
                      ],
                      "bonne_reponse": "Un habitant riche non seigneur",
                      "indice": "Il ne fait pas partie de la noblesse féodale.",
                      "explication": "Les bourgeois sont des travailleurs riches et puissants de la ville qui ne sont pas des seigneurs."
                    },
                    {
                      "question": "Quel document donne l'autonomie à une ville ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Une charte de franchises",
                        "Un traité de paix royal",
                        "Une alliance religieuse",
                        "Un contrat de vassalité"
                      ],
                      "bonne_reponse": "Une charte de franchises",
                      "indice": "C'est un texte écrit accordé par le seigneur.",
                      "explication": "La charte de franchises est un document garantissant aux bourgeois une autonomie pour gérer la ville."
                    },
                    {
                      "question": "À partir de quel siècle la population augmente-t-elle fortement ?",
                      "difficulte": "Facile",
                      "choix": [
                        "À partir du IXe siècle",
                        "À partir du XIe siècle",
                        "À partir du XVe siècle",
                        "À partir du XXe siècle"
                      ],
                      "bonne_reponse": "À partir du XIe siècle",
                      "indice": "C'est le siècle juste après l'an 1000.",
                      "explication": "La population d'Europe occidentale augmente fortement à partir du XIe siècle."
                    },
                    {
                      "question": "Que représente le beffroi pour une ville de Flandre ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Un grand symbole d'autonomie",
                        "Un lieu de culte très sacré",
                        "Une prison pour les vassaux",
                        "Un marché pour les artisans"
                      ],
                      "bonne_reponse": "Un grand symbole d'autonomie",
                      "indice": "Il s'agit d'une affirmation de pouvoir face aux seigneurs.",
                      "explication": "L'autonomie des villes s'affirme par des constructions symboliques comme les tours et les beffrois."
                    },
                    {
                      "question": "Quelle est la population de Paris en l'an 1300 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Elle atteint 50 000 habitants",
                        "Elle compte 100 000 habitants",
                        "Elle atteint 200 000 habitants",
                        "Elle dépasse 300 000 habitants"
                      ],
                      "bonne_reponse": "Elle atteint 200 000 habitants",
                      "indice": "Elle a été multipliée par quatre en un siècle.",
                      "explication": "Paris voit sa population exploser, passant de 50 000 habitants en 1200 à 200 000 habitants en 1300."
                    },
                    {
                      "question": "Quelles régions concentrent la nouvelle société urbaine ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Le Nord de l'Italie et Flandre",
                        "Le Sud de l'Espagne et la Grèce",
                        "L'Europe de l'Est et la Russie",
                        "L'Angleterre et la Scandinavie"
                      ],
                      "bonne_reponse": "Le Nord de l'Italie et Flandre",
                      "indice": "Ces régions sont très actives dans le commerce textile et maritime.",
                      "explication": "La nouvelle société urbaine émerge essentiellement autour du Nord de l'Italie, de la Flandre ou du Nord de la France."
                    },
                    {
                      "question": "Comment s'appelle l'association encadrant un même métier ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Une grande corporation",
                        "Une assemblée féodale",
                        "Une commune marchande",
                        "Une alliance paysanne"
                      ],
                      "bonne_reponse": "Une grande corporation",
                      "indice": "Elle décide qui peut y entrer ou non.",
                      "explication": "Une corporation est une association de personnes exerçant le même métier et réglementant leur travail."
                    },
                    {
                      "question": "Comment évolue la proportion de la population urbaine en deux siècles ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Elle passe de 5% à 10% environ",
                        "Elle passe de 10% à 20% environ",
                        "Elle passe de 20% à 30% environ",
                        "Elle passe de 30% à 40% environ"
                      ],
                      "bonne_reponse": "Elle passe de 10% à 20% environ",
                      "indice": "Elle a exactement doublé.",
                      "explication": "La proportion de la population urbaine est passée de 10% à 20% en l'espace de deux siècles."
                    },
                    {
                      "question": "Qui administre la ville après son émancipation ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Les échevins élus au conseil",
                        "Les seigneurs et les vassaux",
                        "Les évêques et les cardinaux",
                        "Les artisans les plus pauvres"
                      ],
                      "bonne_reponse": "Les échevins élus au conseil",
                      "indice": "Ce sont des bourgeois qui siègent pour gouverner.",
                      "explication": "Les bourgeois qui siègent au conseil communal pour administrer la ville s'appellent des échevins."
                    },
                    {
                      "question": "Que fournissent les campagnes pour nourrir les villes ?",
                      "difficulte": "Facile",
                      "choix": [
                        "D'immenses surplus agricoles",
                        "De grandes réserves de gibier",
                        "Des produits exotiques chers",
                        "De nombreuses armes en métal"
                      ],
                      "bonne_reponse": "D'immenses surplus agricoles",
                      "indice": "C'est l'excédent de nourriture lié à l'expansion des campagnes.",
                      "explication": "L'expansion des campagnes entraîne une augmentation des productions agricoles et une commercialisation des surplus."
                    },
                    {
                      "question": "Quel est le rôle d'un drapier dans la ville ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Il contrôle la création textile",
                        "Il vend du bois de construction",
                        "Il gère les finances de la ville",
                        "Il dirige les armées du seigneur"
                      ],
                      "bonne_reponse": "Il contrôle la création textile",
                      "indice": "Il s'occupe de la tonte jusqu'au tissage.",
                      "explication": "Les drapiers contrôlent l'intégralité de la chaîne de production du textile, de la tonte des animaux au vêtement."
                    },
                    {
                      "question": "Avec quelles autres régions l'Europe occidentale commerce-t-elle ?",
                      "difficulte": "Hard",
                      "choix": [
                        "L'Afrique du Nord et l'Europe de l'Est",
                        "Les Amériques et les lointaines Caraïbes",
                        "Les royaumes d'Asie et l'Empire du Japon",
                        "Les îles d'Océanie et le sud de l'Inde"
                      ],
                      "bonne_reponse": "L'Afrique du Nord et l'Europe de l'Est",
                      "indice": "Il s'agit de régions directement voisines via la Méditerranée et les routes terrestres.",
                      "explication": "Les voies maritimes et terrestres permettent d'échanger des produits avec l'Afrique du Nord et l'Europe de l'Est."
                    },
                    {
                      "question": "Quelle grande ville de foire française se développe ?",
                      "difficulte": "Facile",
                      "choix": [
                        "La grande ville de Troyes",
                        "La grande ville de Nantes",
                        "La grande ville de Rennes",
                        "La grande ville de Cannes"
                      ],
                      "bonne_reponse": "La grande ville de Troyes",
                      "indice": "Elle est située en région Champagne.",
                      "explication": "Des grandes villes de foire comme Troyes se développent considérablement grâce au grand commerce."
                    },
                    {
                      "question": "À quoi servent les nombreuses corporations urbaines ?",
                      "difficulte": "Medium",
                      "choix": [
                        "À réglementer le travail urbain",
                        "À recruter des soldats de guerre",
                        "À organiser des fêtes de paroisse",
                        "À collecter les impôts du seigneur"
                      ],
                      "bonne_reponse": "À réglementer le travail urbain",
                      "indice": "Elles organisent les relations entre apprentis et maîtres.",
                      "explication": "Chaque corporation réglemente le travail, protège ses membres et favorise les transferts de savoir-faire."
                    },
                    {
                      "question": "Outre Paris et Bologne, où apparaît une université au XIIe siècle ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Dans la ville de Montpellier",
                        "Dans la commune de Marseille",
                        "Dans la métropole de Londres",
                        "Dans la seigneurie de Venise"
                      ],
                      "bonne_reponse": "Dans la ville de Montpellier",
                      "indice": "C'est une ville très dynamique du sud de la France.",
                      "explication": "Des universités apparaissent dès le XIIe siècle dans des villes intellectuellement dynamiques comme Paris, Montpellier ou Bologne."
                    },
                    {
                      "question": "Quelles professions s'enrichissent le plus en ville ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Les marchands, artisans, banquiers",
                        "Les chevaliers, moines et paysans",
                        "Les seigneurs, vassaux et paysans",
                        "Les mercenaires, évêques et rois"
                      ],
                      "bonne_reponse": "Les marchands, artisans, banquiers",
                      "indice": "Ils font fortune grâce au commerce et à l'argent.",
                      "explication": "Le développement du grand commerce enrichit considérablement les artisans, les marchands et les banquiers."
                    },
                    {
                      "question": "Qu'est-ce qui provoque de fortes tensions sociales dans ces villes ?",
                      "difficulte": "Hard",
                      "choix": [
                        "La hiérarchie très inégalitaire",
                        "La destruction des vieux remparts",
                        "La guerre cruelle des campagnes",
                        "Le manque grave de terres arables"
                      ],
                      "bonne_reponse": "La hiérarchie très inégalitaire",
                      "indice": "Les riches contrôlent tout face aux plus pauvres.",
                      "explication": "La domination d'une élite très riche crée des tensions sociales avec les petits artisans et les habitants les plus démunis."
                    },
                    {
                      "question": "Comment l'espace urbain est-il décrit par rapport à la campagne ?",
                      "difficulte": "Facile",
                      "choix": [
                        "L'espace est étroit et encombré",
                        "L'espace est vaste et très calme",
                        "L'espace est vide et abandonné",
                        "L'espace est boisé et dangereux"
                      ],
                      "bonne_reponse": "L'espace est étroit et encombré",
                      "indice": "Il y a beaucoup de monde concentré sur une petite surface.",
                      "explication": "La ville est décrite comme un monde nouveau, plus étroit et beaucoup plus encombré que les campagnes."
                    },
                    {
                      "question": "Par quel moyen physique les villes décident-elles de s'agrandir ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Elles s'étendent hors des remparts",
                        "Elles détruisent les forêts autour",
                        "Elles construisent de grandes tours",
                        "Elles envahissent les villes proches"
                      ],
                      "bonne_reponse": "Elles s'étendent hors des remparts",
                      "indice": "Elles débordent de leurs anciennes murailles de protection.",
                      "explication": "Face à la forte croissance spatiale, les villes se développent par le peuplement de nouveaux quartiers au-delà de leurs anciens remparts."
                    },
                    {
                      "question": "Quel chantier nécessite la mobilisation de milliers d'ouvriers ?",
                      "difficulte": "Hard",
                      "choix": [
                        "La construction des cathédrales",
                        "L'édification des châteaux forts",
                        "La création de flottes navales",
                        "Le pavage des routes marchandes"
                      ],
                      "bonne_reponse": "La construction des cathédrales",
                      "indice": "Ce sont de gigantesques bâtiments religieux.",
                      "explication": "Certaines villes se lancent dans la construction de cathédrales colossales qui nécessitent des moyens considérables et des milliers d'ouvriers."
                    }
                  ]
                },
                {
                  "id": "etat-monarchique",
                  "nom": "L'affirmation de l'État monarchique dans le Royaume des Capétiens et des Valois",
                  "nom_quete": "La Couronne des Rois",
                  "icone_quete": "👑",
                  "loot_quete": {
                    "nom": "L'Épée de Bois d'Écuyer",
                    "emoji": "🗡️"
                  },
                  "youtube": "",
                  "pdf": "fiches/histoire-5eme-etat-monarchique.pdf",
                  "badges_custom": {
                    "novice": {
                      "label": "Novice"
                    },
                    "initie": {
                      "label": "Initié"
                    },
                    "maitre": {
                      "label": "Maître"
                    }
                  },
                  "diff_custom": {
                    "facile": "Facile",
                    "medium": "Medium",
                    "hard": "Hard"
                  },
                  "flashcards": [
                    {
                      "question": "Qui est élu roi de France en 987, marquant la fin de la dynastie des Carolingiens ?",
                      "reponse": "Hugues Capet.",
                      "indice": "Il donne son nom à la nouvelle famille royale."
                    },
                    {
                      "question": "Comment les premiers rois Capétiens assurent-ils leur succession ?",
                      "reponse": "Ils organisent leur succession de leur vivant en faisant couronner leurs héritiers directs.",
                      "indice": "Ils mettent la couronne sur la tête de leur fils avant de mourir."
                    },
                    {
                      "question": "Quel grand roi Capétien remporte la bataille de Bouvines en 1214 ?",
                      "reponse": "Philippe Auguste.",
                      "indice": "Il porte le nom d'un célèbre empereur romain."
                    },
                    {
                      "question": "Quelle est la conséquence directe de la victoire de Bouvines pour le roi de France ?",
                      "reponse": "Il confisque les terres du roi d'Angleterre et agrandit considérablement son domaine royal.",
                      "indice": "Le roi devient beaucoup plus riche et puissant face aux autres seigneurs."
                    },
                    {
                      "question": "Dans quelle ville religieuse les rois de France sont-ils couronnés (Le Sacre) ?",
                      "reponse": "Dans la cathédrale de Reims.",
                      "indice": "C'est une grande ville de la région Champagne."
                    },
                    {
                      "question": "Comment s'appellent les représentants envoyés par le roi dans les provinces pour prélever les impôts et rendre la justice ?",
                      "reponse": "Les baillis et les sénéchaux.",
                      "indice": "Ils agissent directement au nom du roi."
                    },
                    {
                      "question": "Quel roi du XIIIe siècle annexe le Languedoc et impose une seule monnaie dans tout le royaume ?",
                      "reponse": "Louis IX.",
                      "indice": "Il est plus connu sous un nom religieux car il est devenu un saint."
                    },
                    {
                      "question": "Quel événement majeur déclenche le début de la guerre de Cent Ans en 1328 ?",
                      "reponse": "La mort du roi Charles IV sans héritier direct.",
                      "indice": "Il n'y a plus de fils dans la famille Capétienne pour prendre le trône."
                    },
                    {
                      "question": "Quel roi étranger revendique le trône de France au début de la guerre de Cent Ans ?",
                      "reponse": "Le roi d'Angleterre, Édouard III.",
                      "indice": "Il réclame le trône car sa mère est la sœur du roi de France défunt."
                    },
                    {
                      "question": "Quelle nouvelle branche de la famille royale française est choisie par les seigneurs en 1328 ?",
                      "reponse": "La famille des Valois (avec Philippe de Valois).",
                      "indice": "Les seigneurs la préfèrent à un roi anglais."
                    },
                    {
                      "question": "Pourquoi les armées anglaises remportent-elles les premières batailles de la guerre de Cent Ans ?",
                      "reponse": "Grâce à leur supériorité technique.",
                      "indice": "Ils possèdent des armes très efficaces."
                    },
                    {
                      "question": "Qui s'autoproclame roi de France en 1422, alors qu'une grande partie du pays est occupée ?",
                      "reponse": "Charles VII.",
                      "indice": "On l'appelle souvent le « dauphin »."
                    },
                    {
                      "question": "Quelle jeune fille rencontre Charles VII en 1429 et change le cours de la guerre ?",
                      "reponse": "Jeanne d'Arc.",
                      "indice": "Elle prend la tête de l'armée française."
                    },
                    {
                      "question": "Quelle grande ville française Jeanne d'Arc parvient-elle à reprendre aux Anglais en 1429 ?",
                      "reponse": "Orléans.",
                      "indice": "C'est une ville très importante sur la Loire."
                    },
                    {
                      "question": "Comment la vie de Jeanne d'Arc se termine-t-elle en 1431 ?",
                      "reponse": "Capturée par les Bourguignons, elle est brûlée vive par les alliés anglais.",
                      "indice": "Son exécution est tragique."
                    },
                    {
                      "question": "En quelle année se termine officiellement la guerre de Cent Ans ?",
                      "reponse": "En 1453.",
                      "indice": "C'est la victoire définitive de la France."
                    },
                    {
                      "question": "Quelle grande innovation militaire le roi Charles VII met-il en place pour vaincre les Anglais ?",
                      "reponse": "Il crée une armée professionnelle et permanente.",
                      "indice": "Avant, les armées n'étaient rassemblées qu'en cas de conflit."
                    },
                    {
                      "question": "Comment s'appelle le nouvel impôt régulier créé par Charles VII pour financer son armée ?",
                      "reponse": "La taille royale.",
                      "indice": "C'est un impôt sur la richesse payé chaque année."
                    },
                    {
                      "question": "Qui doit payer ce nouvel impôt appelé la « taille royale » ?",
                      "reponse": "Ceux qui ne sont ni religieux, ni nobles.",
                      "indice": "C'est-à-dire la grande majorité de la population."
                    },
                    {
                      "question": "À la fin de la guerre et du règne de Louis XI, le roi d'Angleterre possède-t-il encore des terres en France ?",
                      "reponse": "Non, il n'a plus aucun fief en France.",
                      "indice": "Le royaume de France est alors définitivement unifié."
                    }
                  ],
                  "quiz": [
                    {
                      "question": "En quelle année le roi Hugues Capet est-il élu ?",
                      "difficulte": "Facile",
                      "choix": [
                        "L'année  987",
                        "L'année 1180",
                        "L'année 1214",
                        "L'année 1328"
                      ],
                      "bonne_reponse": "L'année 987",
                      "indice": "C'est à la toute fin du Xe siècle.",
                      "explication": "Hugues Capet est élu roi de France par les grands seigneurs en 987."
                    },
                    {
                      "question": "Quelle dynastie le roi Hugues Capet remplace-t-il ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Les Carolingiens",
                        "Les Mérovingiens",
                        "La famille Tudor",
                        "Les rois anglais"
                      ],
                      "bonne_reponse": "Les Carolingiens",
                      "indice": "C'est la famille du célèbre Charlemagne.",
                      "explication": "L'élection de Hugues Capet met fin à la dynastie des Carolingiens."
                    },
                    {
                      "question": "Autour de quelles villes se situe le domaine royal en 987 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Paris et Orléans",
                        "Lyon et Grenoble",
                        "Bordeaux et Caen",
                        "Rouen et Avignon"
                      ],
                      "bonne_reponse": "Paris et Orléans",
                      "indice": "Cela inclut la capitale actuelle du pays.",
                      "explication": "Au Xe siècle, le petit domaine royal est situé autour de Paris et Orléans."
                    },
                    {
                      "question": "Au Moyen Âge, qu'est-ce qu'un « fief » ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Une terre pour fidélité",
                        "Une armure de chevalier",
                        "Une somme d'argent fixe",
                        "Un grand titre de noble"
                      ],
                      "bonne_reponse": "Une terre pour fidélité",
                      "indice": "C'est un bien physique en lien avec l'agriculture.",
                      "explication": "Un fief est une terre accordée par un seigneur à un vassal en échange de services et de fidélité."
                    },
                    {
                      "question": "Comment les premiers Capétiens s'assurent-ils de leur succession ?",
                      "difficulte": "Hard",
                      "choix": [
                        "En couronnant leur fils de leur vivant",
                        "En achetant le vote des grands nobles",
                        "En assassinant tous les autres rivaux",
                        "En demandant l'accord formel du pape"
                      ],
                      "bonne_reponse": "En couronnant leur fils de leur vivant",
                      "indice": "Ils n'attendent pas de mourir pour le faire.",
                      "explication": "Pour s'imposer, les rois organisent leur succession de leur vivant en faisant couronner leurs héritiers."
                    },
                    {
                      "question": "Dans quelle ville les rois de France sont-ils sacrés ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Cathédrale de Reims",
                        "Cathédrale de Paris",
                        "Cathédrale de Rouen",
                        "Cathédrale de Tours"
                      ],
                      "bonne_reponse": "Cathédrale de Reims",
                      "indice": "C'est une grande ville de la région Champagne.",
                      "explication": "Les rois reçoivent une légitimité religieuse en étant couronnés par l'évêque de Reims dans sa cathédrale."
                    },
                    {
                      "question": "Lors du sacre, quel objet remis au roi symbolise son pouvoir de justice ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Le sceptre royal",
                        "La couronne d'or",
                        "L'épée de combat",
                        "Le manteau sacré"
                      ],
                      "bonne_reponse": "Le sceptre royal",
                      "indice": "C'est un bâton de commandement.",
                      "explication": "Le roi reçoit ses attributs royaux, comme le sceptre, qui symbolise son pouvoir de justice."
                    },
                    {
                      "question": "Quelle grande bataille Philippe Auguste remporte-t-il en 1214 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "La bataille de Bouvines",
                        "La bataille d'Azincourt",
                        "La bataille de Poitiers",
                        "La bataille de Hastings"
                      ],
                      "bonne_reponse": "La bataille de Bouvines",
                      "indice": "C'est une victoire décisive dans le nord de la France.",
                      "explication": "La bataille de Bouvines en 1214 est un tournant majeur pour l'affirmation de la puissance monarchique."
                    },
                    {
                      "question": "Contre qui Philippe Auguste se bat-il à Bouvines ?",
                      "difficulte": "Hard",
                      "choix": [
                        "L'empereur Germanique et des comtes du Nord",
                        "Le roi d'Espagne et le duc de Bretagne",
                        "Les armées papales et les princes purs",
                        "Le puissant roi Italien et ses vassaux"
                      ],
                      "bonne_reponse": "L'empereur Germanique et des comtes du Nord",
                      "indice": "Ses adversaires viennent du Saint-Empire et des Flandres.",
                      "explication": "De grands seigneurs comme les comtes de Flandre et de Boulogne s'allient à l'empereur Otton pour cette bataille."
                    },
                    {
                      "question": "Quelle mesure économique majeure Louis IX (Saint Louis) impose-t-il ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Une monnaie unique dans le royaume",
                        "L'interdiction totale de commercer",
                        "La création d'une taxe sur le pain",
                        "Un grand impôt pour les chevaliers"
                      ],
                      "bonne_reponse": "Une monnaie unique dans le royaume",
                      "indice": "Cela facilite grandement les échanges commerciaux.",
                      "explication": "Louis IX impose sa propre monnaie dans tout le royaume pour affirmer son pouvoir."
                    },
                    {
                      "question": "Comment nomme-t-on les représentants du roi qui prélèvent l'impôt en province ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Les baillis et les sénéchaux",
                        "Les vassaux et les seigneurs",
                        "Les maires et les présidents",
                        "Les prêtres et clercs locaux"
                      ],
                      "bonne_reponse": "Les baillis et les sénéchaux",
                      "indice": "Leurs noms commencent par les lettres B et S.",
                      "explication": "Les baillis et les sénéchaux exercent leur autorité dans le domaine royal et prélèvent les impôts."
                    },
                    {
                      "question": "Quel événement provoque la guerre de Cent Ans en 1328 ?",
                      "difficulte": "Hard",
                      "choix": [
                        "La mort de Charles IV sans héritier direct",
                        "L'assassinat du roi de France par un noble",
                        "La grande révolte paysanne pour les taxes",
                        "L'invasion du royaume par l'armée anglaise"
                      ],
                      "bonne_reponse": "La mort de Charles IV sans héritier direct",
                      "indice": "C'est un problème de succession à la couronne.",
                      "explication": "À la mort de Charles IV en 1328, les Capétiens n'ont plus d'héritier direct, ce qui lance le conflit."
                    },
                    {
                      "question": "Pourquoi les grands du royaume refusent-ils le roi d'Angleterre Édouard III ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Ils refusent qu'une femme transmette le droit",
                        "Ils pensent qu'il est bien trop jeune et fou",
                        "Ils ne veulent pas d'un roi qui parle anglais",
                        "Ils ont déjà choisi secrètement un autre roi"
                      ],
                      "bonne_reponse": "Ils refusent qu'une femme transmette le droit",
                      "indice": "Il s'agit d'une règle sur l'héritage par les mères.",
                      "explication": "Les grands du royaume réfutent l'ascendance féminine du roi d'Angleterre (sa mère étant la sœur de Charles IV)."
                    },
                    {
                      "question": "Qui Charles VII rencontre-t-il de façon décisive en 1429 ?",
                      "difficulte": "Facile",
                      "choix": [
                        "La jeune Jeanne d'Arc",
                        "Le grand pape de Rome",
                        "Le duc de la Bretagne",
                        "L'empereur d'Autriche"
                      ],
                      "bonne_reponse": "La jeune Jeanne d'Arc",
                      "indice": "Elle est devenue une grande héroïne nationale.",
                      "explication": "En 1429, Jeanne d'Arc rencontre Charles VII, le dauphin du roi, pour l'aider à reconquérir son trône."
                    },
                    {
                      "question": "Quelle grande ville Jeanne d'Arc parvient-elle à reprendre aux Anglais ?",
                      "difficulte": "Facile",
                      "choix": [
                        "La ville d'Orléans",
                        "La grande capitale",
                        "La commune de Lyon",
                        "Le port de Valence"
                      ],
                      "bonne_reponse": "La ville d'Orléans",
                      "indice": "Cette ville est traversée par la Loire.",
                      "explication": "À la tête d'une armée, Jeanne d'Arc reprend la ville d'Orléans aux Anglais."
                    },
                    {
                      "question": "Comment Jeanne d'Arc meurt-elle tragiquement en 1431 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Elle est brûlée vive par les Anglais",
                        "Elle meurt au combat sous une flèche",
                        "Elle est empoisonnée dans sa cellule",
                        "Elle est exilée sur une île anglaise"
                      ],
                      "bonne_reponse": "Elle est brûlée vive par les Anglais",
                      "indice": "Elle a été exécutée publiquement.",
                      "explication": "Capturée par les Bourguignons, elle est condamnée à être brûlée vive en 1431 par ses ennemis."
                    },
                    {
                      "question": "Quelle innovation militaire le roi Charles VII met-il en place pour gagner ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Une armée professionnelle et permanente",
                        "Le recrutement de mercenaires étrangers",
                        "La mise en place de gardes territoriaux",
                        "L'usage exclusif de la marine de guerre"
                      ],
                      "bonne_reponse": "Une armée professionnelle et permanente",
                      "indice": "C'est la fin du système où les vassaux ne combattaient que temporairement.",
                      "explication": "Charles VII parvient à gagner la guerre en utilisant une armée professionnelle et permanente."
                    },
                    {
                      "question": "Qu'est-ce que la « taille royale » créée par Charles VII ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Un impôt payé par les non-nobles et non-religieux",
                        "Une loi forçant les paysans à aller à la guerre",
                        "Une grande taxe douanière sur le commerce externe",
                        "Un don obligatoire réclamé aux riches et aux ducs"
                      ],
                      "bonne_reponse": "Un impôt payé par les non-nobles et non-religieux",
                      "indice": "C'est une charge financière qui pèse sur les gens du peuple.",
                      "explication": "La taille royale est un impôt sur la richesse payé au roi chaque année par ceux qui ne sont ni religieux ni nobles."
                    },
                    {
                      "question": "Quel roi succède à Charles VII et rattache la Bourgogne au domaine royal ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Le roi Louis XI",
                        "Le roi Louis IX",
                        "Le roi Jean III",
                        "Le roi Henri IV"
                      ],
                      "bonne_reponse": "Le roi Louis XI",
                      "indice": "C'est le fils de Charles VII.",
                      "explication": "Louis XI succède à son père et poursuit l'extension du domaine royal, notamment en y rattachant la Bourgogne."
                    },
                    {
                      "question": "À la fin du règne de Louis XI, quelle est la situation de l'Angleterre en France ?",
                      "difficulte": "Hard",
                      "choix": [
                        "L'Angleterre n'a absolument plus aucun fief",
                        "L'Angleterre contrôle toujours la Normandie",
                        "Le roi d'Angleterre garde le nord de Paris",
                        "L'armée anglaise prépare une autre invasion"
                      ],
                      "bonne_reponse": "L'Angleterre n'a absolument plus aucun fief",
                      "indice": "La victoire française est totale sur le continent.",
                      "explication": "À la fin de la guerre et du règne de Louis XI, le roi d'Angleterre n'a plus aucun fief en France."
                    }
                  ]
                }
              ]
            },
            {
              "id": "nouveau-monde",
              "nom": "Le Nouveau Monde",
              "nom_region": "Le Nouveau Monde",
              "couleur_region": "#0ea5e9",
              "icone_region": "🌍",
              "loot_region": {
                "nom": "La Couronne de Soleil",
                "emoji": "👑",
                "image": "img/loot/loot-la-couronne-de-soleil"
              },
              "chapitres": [
                {
                  "id": "duel-titans",
                  "nom": "Charles Quint & Soliman",
                  "nom_quete": "Duel des Titans",
                  "icone_quete": "🧭",
                  "presentation": "Deux titans se disputent la Méditerranée pendant que des voiles inconnues s'élancent vers l'Ouest — et dans le Brouillard, un cartographe spectral a mêlé toutes les routes. Explorateur, sauras-tu redessiner le monde tel qu'il fut au siècle des audaces ?",
                  "boss": {
                    "nom": "Vespuccien le Cartographe Égaré",
                    "personnage": "Une silhouette spectrale drapée dans une caravelle-manteau aux voiles déchirées, son visage est une mappemonde fissurée où les continents glissent et se confondent, et ses mains tiennent une boussole dont l'aiguille tourne follement sans jamais se fixer.",
                    "lore": "Né du Brouillard de l'Oubli au moment précis où un élève a confondu Christophe Colomb avec Vasco de Gama, Vespuccien est l'âme errante de tous les explorateurs perdus en mer dont les routes se sont entremêlées. Sa boussole, autrefois fidèle alliée des navigateurs portugais et espagnols, est devenue folle car les directions du Nouveau Monde se sont effacées de la mémoire des Explorateurs. Il porte autour du cou la Boussole des Découvertes, relique sacrée qu'il libérera seulement face à un Explorateur capable de retrouver les vraies routes du XVIe siècle.",
                    "presentation": "Dans un tourbillon de brume salée et de parchemins déchirés, une caravelle fantôme s'échoue aux pieds de Neo : Vespuccien le Cartographe Égaré surgit, sa boussole hurlant aux quatre vents oubliés.",
                    "image_mechant": "img/boss/boss-vespuccien-le-cartographe-egare-mechant",
                    "image_apaise": "img/boss/boss-vespuccien-le-cartographe-egare-apaise",
                    "image_mechant_profil": "img/boss/boss-vespuccien-le-cartographe-egare-mechant-profil",
                    "image_apaise_profil": "img/boss/boss-vespuccien-le-cartographe-egare-apaise-profil",
                    "panini_mechant": "img/panini/panini-vespuccien-le-cartographe-egare-mechant",
                    "panini_apaise": "img/panini/panini-vespuccien-le-cartographe-egare-apaise",
                    "dialogues": {
                      "avant_combat": [
                        "Petit Neo... sais-tu seulement où tu poses les pattes ? Mes mers sont sans nom, mes terres sans rivage !",
                        "Avant moi, le monde tenait sur une carte. Après moi, il flotte dans le Brouillard. Veux-tu vraiment le redessiner ?",
                        "1492, 1498, 1522... ces dates pour toi ne sont que des chiffres morts. Prouve-moi le contraire, ou rejoins mes équipages perdus !"
                      ],
                      "touche": [
                        "Aïe ! Tu as trouvé un cap... mais sauras-tu trouver les autres ?",
                        "Ma voile se déchire encore... ton vent souffle juste, petit Explorateur.",
                        "L'aiguille tremble ! Elle se souvient de quelque chose grâce à toi..."
                      ],
                      "rate": [
                        "Hahaha ! Tu rames dans le mauvais océan, mousse !",
                        "Encore une caravelle qui sombre dans la brume... essaie encore !",
                        "Tu confonds les continents comme tant d'autres avant toi. L'Oubli te guette !"
                      ],
                      "defaite": "Ma boussole... elle se stabilise enfin... merci, Explorateur, de m'avoir rendu le Nord...",
                      "phare_idle": [
                        "Repose-toi près du feu, ami. Laisse-moi te raconter le vrai siècle des grandes découvertes, celui que j'avais oublié.",
                        "Souviens-toi : en 1492, Christophe Colomb atteint l'île d'Hispaniola en cherchant les Indes. En 1498, Vasco de Gama, lui, contourne l'Afrique par le sud et arrive aux vraies Indes. Deux hommes, deux routes, ne les confonds plus jamais.",
                        "La caravelle, ce navire portugais à plusieurs mâts et au gouvernail arrière, fut la clé de tout. Sans elle, sans la boussole ni l'astrolabe, aucun Européen n'aurait osé l'océan.",
                        "En 1494, Espagnols et Portugais se sont partagés le Nouveau Monde par le traité de Tordesillas : le Brésil au Portugal, le reste de l'Amérique du Sud et centrale à l'Espagne. Ainsi naquirent les premiers empires coloniaux.",
                        "Et n'oublie jamais Magellan, qui boucla le premier tour du monde entre 1519 et 1522, mais mourut en chemin en 1521. Garde ma boussole, Explorateur : tant qu'elle pointera juste, le Brouillard ne pourra plus engloutir ces routes."
                      ]
                    }
                  },
                  "loot_quete": {
                    "nom": "La Boussole d'Explorateur",
                    "emoji": "🧭",
                    "image": "img/loot/loot-la-boussole-d-explorateur"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [
                    {
                      "question": "En quelle année les Ottomans prennent-ils Constantinople ?",
                      "reponse": "Les Ottomans prennent Constantinople en 1453, mettant fin à l'Empire byzantin.",
                      "indice": "C'est l'année qui marque traditionnellement la fin du Moyen Âge."
                    },
                    {
                      "question": "Qui est Soliman le Magnifique ?",
                      "reponse": "Soliman le Magnifique est le sultan de l'Empire ottoman de 1520 à 1566, sous lequel l'empire atteint son apogée.",
                      "indice": "Son surnom rappelle la splendeur et la puissance de son règne."
                    },
                    {
                      "question": "Qui est Charles Quint ?",
                      "reponse": "Charles Quint est le souverain de l'empire des Habsbourg et l'homme le plus puissant de la chrétienté au XVIe siècle, qui rêve d'une monarchie universelle chrétienne.",
                      "indice": "Il hérite notamment du Saint Empire romain germanique de son grand-père."
                    },
                    {
                      "question": "Qui était l'allié inattendu de Soliman le Magnifique en Europe ?",
                      "reponse": "Le roi de France François Ier s'allie avec Soliman pour contrer la puissance des Habsbourg, malgré sa foi chrétienne.",
                      "indice": "Un roi très chrétien qui pourtant tend la main à un sultan musulman pour des raisons politiques."
                    },
                    {
                      "question": "Que se passe-t-il à Vienne en 1529 ?",
                      "reponse": "En 1529, Charles Quint repousse Soliman le Magnifique à Vienne et stoppe la progression ottomane en Europe centrale.",
                      "indice": "Une ville d'Europe centrale qui résiste au sultan venu de l'Est."
                    },
                    {
                      "question": "Qu'est-ce que la bataille de Lépante ?",
                      "reponse": "C'est une bataille navale de 1571, au large de la Grèce, où la flotte de Philippe II inflige une défaite décisive aux Ottomans en Méditerranée.",
                      "indice": "Un grand affrontement de navires qui freine durablement la puissance turque en mer."
                    },
                    {
                      "question": "Qui est Philippe II ?",
                      "reponse": "Philippe II est le fils de Charles Quint ; il met fin à la domination turque en Méditerranée grâce à la victoire de Lépante en 1571.",
                      "indice": "Le successeur du plus puissant souverain chrétien d'Europe."
                    },
                    {
                      "question": "Qu'est-ce qu'une caravelle ?",
                      "reponse": "Une caravelle est un bateau à voile rapide, muni de plusieurs mâts et d'un gouvernail à l'arrière, perfectionné par les Portugais pour les longs voyages.",
                      "indice": "Un navire maniable qui rend possibles les grandes traversées océaniques."
                    },
                    {
                      "question": "Quels instruments permettent aux marins de s'orienter à la fin du XVe siècle ?",
                      "reponse": "La boussole et l'astrolabe permettent aux marins de se diriger et de calculer leur position en mer.",
                      "indice": "L'un indique le nord, l'autre observe les étoiles."
                    },
                    {
                      "question": "Qu'a découvert Christophe Colomb en 1492 ?",
                      "reponse": "En 1492, Christophe Colomb atteint l'île d'Hispaniola et découvre le continent américain en cherchant une nouvelle route vers les Indes.",
                      "indice": "Il croyait avoir atteint l'Asie en traversant l'Atlantique."
                    },
                    {
                      "question": "Quel exploit Vasco de Gama réalise-t-il en 1498 ?",
                      "reponse": "Vasco de Gama contourne l'Afrique par le sud pour atteindre les Indes en 1498, ouvrant une nouvelle route maritime aux Portugais.",
                      "indice": "Il fait le tour d'un grand continent par le cap sud pour rejoindre les épices."
                    },
                    {
                      "question": "Quel voyage Magellan accomplit-il entre 1519 et 1522 ?",
                      "reponse": "Magellan réalise le premier tour du monde entre 1519 et 1522, mais meurt durant le trajet en 1521 ; son équipage achève l'expédition.",
                      "indice": "Un voyage qui prouve définitivement que la Terre est ronde."
                    },
                    {
                      "question": "Qu'est-ce que le traité de Tordesillas ?",
                      "reponse": "Signé en 1494, le traité de Tordesillas partage les nouveaux territoires découverts entre l'Espagne et le Portugal.",
                      "indice": "Deux royaumes ibériques se divisent le Nouveau Monde grâce à une ligne imaginaire."
                    },
                    {
                      "question": "Quels territoires l'Espagne et le Portugal obtiennent-ils selon le traité de Tordesillas ?",
                      "reponse": "Le Portugal contrôle la côte est de l'Amérique du Sud (le Brésil) ; l'Espagne reçoit la majeure partie de l'Amérique du Sud et de l'Amérique centrale.",
                      "indice": "L'un récupère une grande façade orientale, l'autre presque tout le reste du sous-continent."
                    },
                    {
                      "question": "Qu'est-ce qu'un conquistador ?",
                      "reponse": "Un conquistador est un chef d'expédition espagnol qui a conquis des territoires du Nouveau Monde au XVIe siècle.",
                      "indice": "Le mot espagnol signifie littéralement « conquérant »."
                    },
                    {
                      "question": "Qui a conquis l'Empire aztèque ?",
                      "reponse": "Hernan Cortés conquiert l'Empire aztèque au Mexique entre 1519 et 1522, parti de Cuba avec quelques centaines d'hommes.",
                      "indice": "Un conquistador qui s'empare d'un empire d'Amérique centrale grâce aux armes à feu et aux canons."
                    },
                    {
                      "question": "Qui a conquis l'Empire inca ?",
                      "reponse": "Francisco Pizarro conquiert l'Empire inca au Pérou entre 1531 et 1533, attiré par les rumeurs d'or.",
                      "indice": "Un conquistador attiré vers les Andes par la promesse d'un métal précieux."
                    },
                    {
                      "question": "Qu'est-ce qu'un empire colonial ?",
                      "reponse": "Un empire colonial est un vaste espace conquis par une puissance étrangère qui l'occupe et l'exploite économiquement.",
                      "indice": "Un territoire éloigné dominé et exploité par une métropole."
                    },
                    {
                      "question": "Qu'est-ce que la mondialisation ?",
                      "reponse": "La mondialisation est la mise en relation de régions et de peuples par les échanges mondiaux de marchandises et la circulation des personnes.",
                      "indice": "C'est ce qui se passe quand le monde devient un grand réseau d'échanges."
                    },
                    {
                      "question": "Quels grands ports européens s'enrichissent grâce au commerce avec le Nouveau Monde ?",
                      "reponse": "Les ports de Séville en Espagne et de Lisbonne au Portugal s'enrichissent grâce à l'arrivée des métaux précieux et des produits tropicaux.",
                      "indice": "Deux grandes villes portuaires de la péninsule ibérique."
                    }
                  ],
                  "quiz": [
                    {
                      "question": "En quelle année les Ottomans prennent-ils Constantinople ?",
                      "difficulte": "Facile",
                      "choix": [
                        "1453",
                        "1492",
                        "1520",
                        "1571"
                      ],
                      "bonne_reponse": "1453",
                      "indice": "C'est la date traditionnellement associée à la fin du Moyen Âge.",
                      "explication": "En 1453, les Ottomans s'emparent de Constantinople, mettant fin à l'Empire byzantin après 1100 ans de domination chrétienne."
                    },
                    {
                      "question": "Qui est le sultan ottoman au sommet de la puissance de l'empire au XVIe siècle ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Soliman le Magnifique",
                        "Mehmet le Conquérant",
                        "Charles le Téméraire",
                        "Philippe le Hardi"
                      ],
                      "bonne_reponse": "Soliman le Magnifique",
                      "indice": "Son surnom évoque la splendeur et la grandeur.",
                      "explication": "Soliman le Magnifique règne de 1520 à 1566 et porte l'Empire ottoman à son apogée."
                    },
                    {
                      "question": "Qui découvre l'île d'Hispaniola en 1492 ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Christophe Colomb",
                        "Vasco de Gama",
                        "Fernand de Magellan",
                        "Jacques Cartier"
                      ],
                      "bonne_reponse": "Christophe Colomb",
                      "indice": "Il cherchait une route vers les Indes par l'ouest.",
                      "explication": "En 1492, Christophe Colomb atteint l'île d'Hispaniola et ouvre la voie aux explorations européennes du Nouveau Monde."
                    },
                    {
                      "question": "Qu'est-ce qu'une caravelle ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Un bateau à voile rapide à plusieurs mâts",
                        "Une carte marine détaillée des côtes",
                        "Un instrument pour mesurer les étoiles",
                        "Un coffre transportant les métaux précieux"
                      ],
                      "bonne_reponse": "Un bateau à voile rapide à plusieurs mâts",
                      "indice": "Les Portugais l'ont perfectionné pour les longs voyages.",
                      "explication": "La caravelle est un navire rapide muni de plusieurs mâts, de multiples voiles et d'un gouvernail arrière qui facilite les manœuvres."
                    },
                    {
                      "question": "En quelle année est signé le traité de Tordesillas ?",
                      "difficulte": "Facile",
                      "choix": [
                        "1494",
                        "1453",
                        "1519",
                        "1535"
                      ],
                      "bonne_reponse": "1494",
                      "indice": "Il est signé peu après le premier voyage de Christophe Colomb.",
                      "explication": "Le traité de Tordesillas est signé en 1494 entre l'Espagne et le Portugal pour partager les nouveaux territoires découverts."
                    },
                    {
                      "question": "Qu'est-ce qu'un empire colonial ?",
                      "difficulte": "Facile",
                      "choix": [
                        "Un vaste espace conquis et exploité par une puissance étrangère",
                        "Un royaume chrétien dirigé par un empereur très puissant",
                        "Une alliance commerciale entre plusieurs cités portuaires",
                        "Un ensemble de comptoirs dirigés par un seul marchand"
                      ],
                      "bonne_reponse": "Un vaste espace conquis et exploité par une puissance étrangère",
                      "indice": "Pense à un territoire lointain dominé par une métropole.",
                      "explication": "Un empire colonial est un vaste espace conquis par une puissance étrangère qui l'occupe et l'exploite économiquement."
                    },
                    {
                      "question": "Pourquoi François Ier, roi chrétien, s'allie-t-il avec Soliman le Magnifique ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Pour contrer la puissance de Charles Quint en Europe",
                        "Pour partager les terres du Nouveau Monde avec lui",
                        "Pour propager la religion chrétienne dans les Balkans",
                        "Pour récupérer Constantinople prise par les Byzantins"
                      ],
                      "bonne_reponse": "Pour contrer la puissance de Charles Quint en Europe",
                      "indice": "L'ennemi de mon ennemi peut devenir mon ami.",
                      "explication": "François Ier juge la puissance des Habsbourg trop importante en Europe et s'allie aux Ottomans pour l'affaiblir."
                    },
                    {
                      "question": "Pourquoi les Européens cherchent-ils de nouvelles routes maritimes après 1453 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "La prise de Constantinople perturbe les routes vers les Indes",
                        "Les bateaux européens ne savent plus traverser la Méditerranée",
                        "Les Indes ont fermé leurs ports aux marchands chrétiens",
                        "Les Ottomans interdisent la fabrication de caravelles"
                      ],
                      "bonne_reponse": "La prise de Constantinople perturbe les routes vers les Indes",
                      "indice": "Une grande ville-carrefour vient de tomber aux mains des Ottomans.",
                      "explication": "La chute de Constantinople en 1453 pousse les Européens à chercher d'autres routes maritimes pour atteindre les Indes."
                    },
                    {
                      "question": "Quel est le rôle des comptoirs commerciaux pour les Européens ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Servir de bases pour commercer avec les territoires lointains",
                        "Former des armées pour conquérir les peuples indiens",
                        "Construire des navires destinés aux grandes traversées",
                        "Convertir les habitants locaux au christianisme catholique"
                      ],
                      "bonne_reponse": "Servir de bases pour commercer avec les territoires lointains",
                      "indice": "Ce sont des points d'appui installés sur les côtes pour les échanges.",
                      "explication": "Les comptoirs sont des établissements installés sur les littoraux pour entretenir un réseau d'échanges commerciaux entre l'Europe et le reste du monde."
                    },
                    {
                      "question": "Quelle conséquence la bataille de Lépante a-t-elle sur les Ottomans ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Elle stoppe durablement leur progression en Méditerranée",
                        "Elle leur permet de conquérir l'Espagne et le Portugal",
                        "Elle ouvre la route des Indes aux marchands turcs",
                        "Elle marque le début de leur expansion en Europe"
                      ],
                      "bonne_reponse": "Elle stoppe durablement leur progression en Méditerranée",
                      "indice": "C'est une défaite navale décisive face à Philippe II.",
                      "explication": "En 1571, la bataille de Lépante inflige une lourde défaite aux Ottomans qui perdent près de 200 navires et 20 000 hommes, mettant fin à leur domination en Méditerranée."
                    },
                    {
                      "question": "Comment Cortés parvient-il à vaincre l'Empire aztèque malgré ses faibles effectifs ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Grâce à la supériorité de ses armes à feu et canons",
                        "Grâce à la solidité de ses caravelles portugaises",
                        "Grâce à l'alliance avec Soliman le Magnifique",
                        "Grâce à la conversion forcée de ses propres soldats"
                      ],
                      "bonne_reponse": "Grâce à la supériorité de ses armes à feu et canons",
                      "indice": "Les peuples indiens ne connaissaient pas ces technologies militaires.",
                      "explication": "Avec quelques centaines d'hommes seulement, Cortés profite de l'avantage décisif que lui donnent les armes à feu et les canons face aux Aztèques."
                    },
                    {
                      "question": "Pourquoi Séville et Lisbonne deviennent-elles des ports très prospères au XVIe siècle ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Ce sont les portes d'entrée des richesses du Nouveau Monde",
                        "Ce sont les capitales de l'Empire ottoman en Europe",
                        "Elles produisent les plus belles caravelles d'Europe",
                        "Elles ont conclu une alliance avec les Habsbourg"
                      ],
                      "bonne_reponse": "Ce sont les portes d'entrée des richesses du Nouveau Monde",
                      "indice": "Une se trouve en Espagne, l'autre au Portugal.",
                      "explication": "Séville et Lisbonne reçoivent les métaux précieux et les produits tropicaux venus des colonies, ce qui enrichit considérablement l'Espagne et le Portugal."
                    },
                    {
                      "question": "Qu'est-ce que la « première mondialisation » du XVIe siècle ?",
                      "difficulte": "Medium",
                      "choix": [
                        "L'essor des échanges commerciaux à l'échelle du monde entier",
                        "La domination militaire des Ottomans sur toute la Méditerranée",
                        "L'unification religieuse des peuples sous une seule chrétienté",
                        "La création d'une langue commune pour tous les marchands"
                      ],
                      "bonne_reponse": "L'essor des échanges commerciaux à l'échelle du monde entier",
                      "indice": "Le mot « mondial » donne déjà un indice sur son étendue.",
                      "explication": "La première mondialisation est la mise en relation de régions et de peuples par des échanges mondiaux de marchandises et la circulation des personnes."
                    },
                    {
                      "question": "Quel est le but principal du traité de Tordesillas en 1494 ?",
                      "difficulte": "Medium",
                      "choix": [
                        "Partager les nouveaux territoires entre Espagne et Portugal",
                        "Stopper la progression des Ottomans en Méditerranée",
                        "Interdire le commerce des métaux précieux en Europe",
                        "Organiser une alliance chrétienne contre Soliman"
                      ],
                      "bonne_reponse": "Partager les nouveaux territoires entre Espagne et Portugal",
                      "indice": "Deux royaumes ibériques se mettent d'accord sur leurs zones.",
                      "explication": "Le traité de Tordesillas répartit les terres découvertes : le Portugal reçoit la côte est de l'Amérique du Sud (Brésil), l'Espagne le reste."
                    },
                    {
                      "question": "Pourquoi Charles Quint rêve-t-il d'une « monarchie universelle chrétienne » ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Il veut réunir l'Europe chrétienne comme Charlemagne autrefois",
                        "Il souhaite convertir tous les sultans ottomans au christianisme",
                        "Il cherche à devenir le sultan d'un grand empire oriental",
                        "Il veut remplacer le pape à la tête de toute l'Europe"
                      ],
                      "bonne_reponse": "Il veut réunir l'Europe chrétienne comme Charlemagne autrefois",
                      "indice": "Il s'inspire d'un grand empereur du Moyen Âge.",
                      "explication": "Charles Quint, héritier de plusieurs royaumes dont le Saint Empire romain germanique, rêve d'unifier la chrétienté à la manière de Charlemagne."
                    },
                    {
                      "question": "Quel facteur explique le mieux la formation rapide des empires coloniaux espagnols ?",
                      "difficulte": "Hard",
                      "choix": [
                        "La recherche d'or pousse les conquistadores à conquérir des territoires",
                        "Les peuples indiens demandent la protection des rois espagnols",
                        "Les Ottomans encouragent les Espagnols à s'installer outre-mer",
                        "Le pape ordonne aux Espagnols de coloniser le Nouveau Monde"
                      ],
                      "bonne_reponse": "La recherche d'or pousse les conquistadores à conquérir des territoires",
                      "indice": "Une motivation économique très forte se cache derrière ces expéditions.",
                      "explication": "La quête des métaux précieux, et particulièrement de l'or, pousse les conquistadores à intensifier les conquêtes, comme Pizarro au Pérou."
                    },
                    {
                      "question": "Pourquoi la Méditerranée reste-t-elle un grand espace d'échanges malgré les guerres ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Les Ottomans maintiennent les comptoirs de Gênes et Venise",
                        "Les Habsbourg interdisent toute bataille sur les côtes du Sud",
                        "Les pirates protègent les navires des marchands chrétiens",
                        "Les caravelles portugaises y assurent toute la circulation"
                      ],
                      "bonne_reponse": "Les Ottomans maintiennent les comptoirs de Gênes et Venise",
                      "indice": "Même en guerre, le commerce reste utile aux deux camps.",
                      "explication": "Les Ottomans conservent les comptoirs italiens de Gênes et Venise dans leur empire, ce qui permet aux échanges commerciaux de continuer autour du bassin méditerranéen."
                    },
                    {
                      "question": "Pourquoi l'arrivée des Européens est-elle une catastrophe pour les peuples indiens d'Amérique ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Leurs cultures sont détruites et ils sont parfois réduits en esclavage",
                        "Ils perdent toutes leurs caravelles dans les batailles navales",
                        "Ils sont expulsés vers l'Europe par les rois espagnols",
                        "Ils sont obligés de devenir alliés des sultans ottomans"
                      ],
                      "bonne_reponse": "Leurs cultures sont détruites et ils sont parfois réduits en esclavage",
                      "indice": "La colonisation a de très lourdes conséquences sur les populations locales.",
                      "explication": "Dans leurs empires coloniaux, Espagnols et Portugais détruisent en grande partie la culture des peuples indiens, les convertissent de force et les réduisent parfois en esclavage."
                    },
                    {
                      "question": "Si tu situes une expédition en 1532 au Pérou, à quel conquistador la rattaches-tu ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Francisco Pizarro, conquérant de l'Empire inca",
                        "Hernan Cortés, conquérant de l'Empire aztèque",
                        "Christophe Colomb, découvreur de l'Hispaniola",
                        "Jacques Cartier, explorateur de l'Amérique nord"
                      ],
                      "bonne_reponse": "Francisco Pizarro, conquérant de l'Empire inca",
                      "indice": "Le Pérou est associé aux Andes et à un grand empire d'or.",
                      "explication": "Francisco Pizarro conquiert l'Empire inca au Pérou entre 1531 et 1533, attiré par les rumeurs de présence massive d'or."
                    },
                    {
                      "question": "Quelle conclusion peut-on tirer du règne simultané de Charles Quint et Soliman ?",
                      "difficulte": "Hard",
                      "choix": [
                        "Deux empires puissants se partagent l'influence en Méditerranée",
                        "Un seul empire chrétien domine toute la Méditerranée au XVIe",
                        "Les Ottomans dominent désormais tous les royaumes européens",
                        "L'Europe entière vit sous la domination directe des Habsbourg"
                      ],
                      "bonne_reponse": "Deux empires puissants se partagent l'influence en Méditerranée",
                      "indice": "Pense à un équilibre entre deux grandes puissances rivales.",
                      "explication": "Au XVIe siècle, la Méditerranée est principalement dominée d'un côté par les Habsbourg de Charles Quint et de l'autre par les Ottomans de Soliman le Magnifique."
                    }
                  ],
                  "diff_custom": {
                    "facile": "Apprenti Mousse",
                    "medium": "Navigateur Aguerri",
                    "hard": "Maître Conquistador"
                  },
                  "cadeau_plan": {
                    "slot": "instrument de navigation",
                    "nom_propose": "La Boussole d'Explorateur",
                    "emoji_propose": "🧭",
                    "lien_thematique": "Symbolise les routes nouvelles du XVIe siècle — celles que se disputent Charles Quint et Soliman en Méditerranée, et celles que tracent les caravelles vers l'Ouest pendant que les empires s'affrontent."
                  }
                },
                {
                  "id": "esprit-lumieres",
                  "nom": "Humanisme & Réformes",
                  "nom_quete": "L'Esprit des Lumières",
                  "icone_quete": "🪶",
                  "loot_quete": {
                    "nom": "La Plume de l'Auteur",
                    "emoji": "🪶"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [],
                  "quiz": [],
                  "cadeau_plan": {
                    "slot": "codex",
                    "nom_propose": "Le Livre Imprimé",
                    "emoji_propose": "📖",
                    "lien_thematique": "Évoque la presse de Gutenberg, l'humanisme d'Érasme et la Réforme de Luther — un seul livre tiré à mille exemplaires suffit désormais à fissurer mille ans d'autorité religieuse et intellectuelle."
                  }
                },
                {
                  "id": "sacre-neo",
                  "nom": "Rois Absolus",
                  "nom_quete": "Le Sacre de Neo",
                  "icone_quete": "🏰",
                  "loot_quete": {
                    "nom": "La Clé des Châteaux",
                    "emoji": "🏰"
                  },
                  "youtube": "",
                  "pdf": "",
                  "flashcards": [],
                  "quiz": [],
                  "cadeau_plan": {
                    "slot": "insigne de cour",
                    "nom_propose": "Le Médaillon de la Cour",
                    "emoji_propose": "🎖️",
                    "lien_thematique": "Symbolise Versailles, l'étiquette et la noblesse domestiquée par Louis XIV — porter ce médaillon, c'est exister sous le regard du Roi-Soleil et participer à la mise en scène quotidienne du pouvoir absolu."
                  }
                }
              ],
              "lore_region": "Aux XVIe et XVIIe siècles, des voiles s'élancèrent vers l'inconnu et déchirèrent les cartes du monde connu. Boussole en main, livre sous le bras et médaillon de cour à la veste, l'Europe se rêva centre d'un univers élargi — entre soif d'or, soif de savoir et soif de pouvoir.",
              "starter_pack": {
                "theme_global": "Costume de l'Européen du Grand Siècle — boussole pour fendre les mers, livre imprimé pour fendre les esprits, médaillon de cour pour figurer dans la lumière du roi : Neo se forge la triple panoplie de l'aventurier, du penseur et du courtisan.",
                "pieces": [
                  {
                    "quete_id": "duel-titans",
                    "slot": "instrument de navigation",
                    "nom_propose": "La Boussole d'Explorateur",
                    "emoji_propose": "🧭",
                    "lien_thematique": "Symbolise les routes nouvelles du XVIe siècle — celles que se disputent Charles Quint et Soliman en Méditerranée, et celles que tracent les caravelles vers l'Ouest pendant que les empires s'affrontent."
                  },
                  {
                    "quete_id": "esprit-lumieres",
                    "slot": "codex",
                    "nom_propose": "Le Livre Imprimé",
                    "emoji_propose": "📖",
                    "lien_thematique": "Évoque la presse de Gutenberg, l'humanisme d'Érasme et la Réforme de Luther — un seul livre tiré à mille exemplaires suffit désormais à fissurer mille ans d'autorité religieuse et intellectuelle."
                  },
                  {
                    "quete_id": "sacre-neo",
                    "slot": "insigne de cour",
                    "nom_propose": "Le Médaillon de la Cour",
                    "emoji_propose": "🎖️",
                    "lien_thematique": "Symbolise Versailles, l'étiquette et la noblesse domestiquée par Louis XIV — porter ce médaillon, c'est exister sous le regard du Roi-Soleil et participer à la mise en scène quotidienne du pouvoir absolu."
                  }
                ]
              }
            }
          ],
          "soustitre": "Le Moyen Âge & les pouvoirs",
          "emoji_province": "⚔️",
          "couleur_province": "#a855f7",
          "nom_province": "L'Héritage",
          "ambiance": "Cathédrales, déserts d'Orient, châteaux forts et palais de la Renaissance"
        },
        {
          "id": "4eme",
          "nom": "4ème",
          "themes": [
            {
              "id": "siecle-lumieres",
              "nom": "Le Siècle des Lumières",
              "nom_region": "Le Siècle des Lumières",
              "icone_region": "💡",
              "loot_region": {
                "nom": "La Déclaration des Droits",
                "emoji": "📋"
              },
              "chapitres": [
                {
                  "id": "bourgeoisies-marchandes-negoces-internationaux-traites-negri",
                  "nom": "Bourgeoisies marchandes, négoces internationaux, traites négrières et esclavage au XVIIIe siècle"
                },
                {
                  "id": "l-europe-des-lumieres-circulation-des-idees-despotisme-eclai",
                  "nom": "L'Europe des Lumières : circulation des idées, despotisme éclairé et contestation de l'absolutisme"
                },
                {
                  "id": "la-revolution-francaise-et-l-empire-nouvel-ordre-politique-e",
                  "nom": "La Révolution française et l'Empire : nouvel ordre politique et société révolutionnée en France et en Europe"
                }
              ]
            },
            {
              "id": "age-fer",
              "nom": "L'Âge de Fer",
              "nom_region": "L'Âge de Fer",
              "icone_region": "⚙️",
              "loot_region": {
                "nom": "La Clé de la Locomotive",
                "emoji": "🚂"
              },
              "chapitres": [
                {
                  "id": "l-europe-de-la-revolution-industrielle",
                  "nom": "L'Europe de la révolution industrielle"
                },
                {
                  "id": "conquetes-et-societes-coloniales",
                  "nom": "Conquêtes et sociétés coloniales"
                }
              ]
            },
            {
              "id": "marche-peuple",
              "nom": "La Marche du Peuple",
              "nom_region": "La Marche du Peuple",
              "icone_region": "✊",
              "loot_region": {
                "nom": "Le Drapeau de la République",
                "emoji": "🇫🇷"
              },
              "chapitres": [
                {
                  "id": "une-difficile-conquete-voter-de-1815-a-1870",
                  "nom": "Une difficile conquête : voter de 1815 à 1870"
                },
                {
                  "id": "la-troisieme-republique",
                  "nom": "La Troisième République"
                },
                {
                  "id": "conditions-feminines-dans-une-societe-en-mutation",
                  "nom": "Conditions féminines dans une société en mutation"
                }
              ]
            }
          ],
          "nom_province": "Les Révolutions",
          "ambiance": "Navires de commerce, barricades, usines à vapeur et grandes cités coloniales",
          "emoji_province": "🏭",
          "couleur_province": "#f472b6",
          "soustitre": "Révolutions & monde moderne"
        },
        {
          "id": "3eme",
          "nom": "3ème",
          "themes": [
            {
              "id": "temps-tempetes",
              "nom": "Le Temps des Tempêtes",
              "nom_region": "Le Temps des Tempêtes",
              "icone_region": "⚡",
              "loot_region": {
                "nom": "La Médaille du Poilu",
                "emoji": "🎖️"
              },
              "chapitres": []
            },
            {
              "id": "equilibre-fragile",
              "nom": "L'Équilibre Fragile",
              "nom_region": "L'Équilibre Fragile",
              "icone_region": "☢️",
              "loot_region": {
                "nom": "Le Mur de Berlin (fragment)",
                "emoji": "🧱"
              },
              "chapitres": []
            },
            {
              "id": "souffle-francais",
              "nom": "Le Nouveau Souffle Français",
              "nom_region": "Le Nouveau Souffle Français",
              "icone_region": "🗼",
              "loot_region": {
                "nom": "La Clé de l'Élysée",
                "emoji": "🔑"
              },
              "chapitres": []
            }
          ],
          "nom_province": "Le Monde Moderne",
          "ambiance": "Tranchées, drapeaux, guerre froide et technologie",
          "emoji_province": "🌍",
          "couleur_province": "#fbbf24",
          "soustitre": "Le XXe siècle & le monde actuel"
        }
      ],
      "emoji": "🏛️",
      "nom_royaume": "Historya",
      "tagline": "Le Royaume du Temps & des Civilisations"
    },
    {
      "id": "svt",
      "nom": "SVT",
      "logo": "",
      "couleur": "#4ade80",
      "couleur_print": "#15803d",
      "niveaux": [],
      "emoji": "🌿",
      "nom_royaume": "Bioverde",
      "tagline": "Le Royaume du Vivant & de la Nature"
    },
    {
      "id": "physique-chimie",
      "nom": "Physique-Chimie",
      "logo": "",
      "couleur": "#f97316",
      "couleur_print": "#9a3412",
      "niveaux": [],
      "emoji": "⚗️",
      "nom_royaume": "Quantix",
      "tagline": "Le Royaume de la Matière & de l'Énergie"
    },
    {
      "id": "maths",
      "nom": "Maths",
      "logo": "",
      "couleur": "#facc15",
      "couleur_print": "#854d0e",
      "niveaux": [],
      "emoji": "📐",
      "nom_royaume": "Algebron",
      "tagline": "Le Royaume des Nombres & des Formes"
    },
    {
      "id": "francais",
      "nom": "Français",
      "logo": "",
      "couleur": "#f472b6",
      "couleur_print": "#9d174d",
      "niveaux": [],
      "emoji": "📖",
      "nom_royaume": "Lexoria",
      "tagline": "Le Royaume des Mots & des Récits"
    }
  ]
};
