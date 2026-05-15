C’est le moment où NeoQuest doit passer d'une application "éducative" à un **véritable jeu de combat**. Pour que l'étape **⚔️ COMBATTRE** soit mémorable, l'interface doit être radicalement différente des phases d'apprentissage.

Voici les specs de design pour ton écran de Quiz :

Pour que ce soit propre sur desktop comme sur mobile, on divise l'écran en deux zones distinctes :

*   **La Scène (Haut - 40%) :** Le face-à-face entre Neo et le Boss.
    
*   **Le Grimoire (Bas - 60%) :** La question et les boutons de réponse.
    

**1\. L'Ambiance Visuelle : "L'Arène de Vérité"**
-------------------------------------------------

On est en plein duel.

*   **Zone haute du quiz : la partie illustrée, le reste en bas reste avec son look présent.**
    
*   **Le Background :** Une illustration immersive de la quête (ex: une grotte préhistorique, un camp romain) légèrement assombrie avec un **vignettage noir** sur les bords pour focaliser l'attention au centre.
    
*   **L'Effet "Brouillard" :** Un voile de brume noire (le Brouillard de l'Oubli) flotte sur les côtés de l'écran. Plus le Boss perd de PV, plus la brume se dissipe pour laisser place à une lumière dorée.
    

**2\. Le HUD (Head-Up Display) de Combat**
------------------------------------------

Situé en haut de l'écran, il affiche l'état du duel.

*   **À Gauche (Neo) :** \* Le sprite 2D de Neo avec son équipement actuel.
    
*   **À Droite (Le Boss) :**  Le sprite imposant du Boss (ex: un Mammouth spectral ou un Chef de Clan).
    
    *   **Barre de Vie Rouge (PV) :**
        

**3\. La Zone de Question (Le "Grille-Pain")**
----------------------------------------------

Située en bas, elle reprend le modele de UI des etapes rpécedentes: adaptée au style du royaiùe

**4\. La Mécanique d'Attaque (L'Animation)**
--------------------------------------------

C'est ici que le système d'Éclats et de Loot prend vie.

*   **Quand l'élève répond juste :**
    
    1.  Neo lance un **Éclat de Savoir , il touche le boss**
        
    2.  Le Boss tremble, un flash blanc illumine l'écran.
        
    3.  La barre rouge descend de **\-10 PV**
        
*   **Quand l'élève se trompe :**
    
    1.  Neo lance un **Éclat de Savoir, il loupe le boss**
        
    2.  Le Boss rugit et lance un sort d'ombre sur Neo.
        
    3.  Neo recule
        
    4.  Un message de soutien de Neo s'affiche brièvement : _"Aïe ! On se reconcentre !"_.
        

**5\. Les Feedbacks Audio (Crucial pour la traction)**
------------------------------------------------------

*   **Bonne réponse :** Un son cristallin + un bruit d'impact métallique.
    
*   **Mauvaise réponse :** Un son sourd (basse) + un grognement du Boss.
    
*   **Combo Critique :** Un son de cloche épique ou un éclair. (à définir quand ça arrive)
    

**6\. La Transition de Victoire**
---------------------------------

Une fois les 100 PV éliminés

1.  **L'Exécution :** Neo s'élance et traverse le Boss en un trait de lumière.
    
2.  **La Dissipation :** Le nuage de l’oubli qui embrumait le boss se dissipe et il retrouve tout son eclat
    
3.  **L'Apparition du Loot :** Le coffre ou l'objet légendaire apparaît au centre dans un faisceau de lumière.
    
4.  **Le Score Final :** Affiché sur un parchemin qui se déroule par-dessus la scène de victoire.
    

### **Résumé des Specs pour l'Intégration (CSS/React)**

**Élément**

**Propriété Design**

**Animation**

**Barre PV Boss**

Gradient Rouge vif

transition: width 0.5s ease-out

**Bouton Réponse**

backdrop-filter: blur(10px)

transform: scale(1.05) au hover

**Texte Question**

Typographie "Game" (ex: Cinzel ou Montserrat Bold)

Fade-in progressif à chaque question

**Effet Critique**

Overlay de flash blanc rapide

opacity: 0.2 pendant 100ms

### **3\. Les Effets Visuels "Low-Cost, High-Impact"**

Puisque tu es sur du Web, utilise des effets CSS et des particules simples :

*   **Le Projectile :** L’eclat avec une traînée violette (box-shadow néon).
    
*   **L'Impact :** Un léger tremblement de l'écran (screen shake) et une petite explosion de pixels quand le Boss est touché.
    
*   **La jauge d'Éclats :** Elle brille intensément quand elle est à 100%, indiquant que le bonus de dégâts est actif. (avoir remplit la
    

### **4\. Le "Game Over" Bienveillant**

Si le boss gagne

*   Le Boss lance un sort de **Sommeil** , Neo s’endort
    
*   Neo dit : _"Oups, ma concentration s'évapore... On va faire une pause et revenir plus fort ?"_
    
*   **Option à débattre:** On propose à l'élève de dépenser quelques pièces d'or pour une "Potion de Rappel" (une seconde chance) ou de retourner aux Flashcards.
    

### **5\. La "Cérémonie du Loot"**

C'est le moment gratifiant à la fin du quiz.

*   Le Boss offre le cadeau (si possible selon difficulté de design, idéalement c’est un morceau de son costume qu’il offre)
    
*   Une carte de l'objet gagné apparaît au centre avec un effet de **brillance (Glow)**.
    
*   L’objet s’ajoute au starter pack
    

L'idée d'un **Pouvoir Actif (1 fois par quiz)** : c'est un "Joker" visuel et stratégique qui donne un sentiment de puissance sans casser tes calculs de PV.

Voici comment on pourrait structurer ces **Pouvoirs de Reliques** :

### **1\. Le Principe : "L'Appel de la Relique"**

L'objet équipé apparaît dans un petit emplacement spécial à côté de Neo. Une fois par combat, l'élève peut cliquer dessus (ou le pouvoir s'active automatiquement selon la condition).

1.  **Choix stratégique :** Avant le combat, l'élève choisit sa relique. _"Est-ce que je prends le Bouclier car je suis pas sûr de moi, ou le Sablier car je veux faire un record de vitesse ?"_
    

### **2\. Typologie des Pouvoirs (Exemples)**

Au lieu de changer les dégâts, on change les **règles** du quiz pour aider l'élève :

*   **🛡️ Le Bouclier de Silex (Défensif) :** "Annule les dégâts d'une mauvaise réponse."
    
    *   _Utilité :_ Idéal pour les élèves qui ont peur de l'échec.
        
*   **👁️ La Longue-vue d'Anubis (Soutien) :** "Supprime deux mauvaises réponses (50/50)."
    
    *   _Utilité :_ Aide directe sur une question difficile.
        
*   **⏳ Le Sablier de Chronos (Temps) :** "Gèle le timer pendant 10 secondes."
    
    *   _Utilité :_ Donne le temps de réfléchir ou de chercher dans le mémo.
        
*   **💥 La Corne de Brume (Offensif) :** "Inflige -20 PV au Boss d'un coup, mais ne valide pas la question."
    
    *   _Utilité :_ Pour finir un Boss quand on a fait trop d'erreurs.
        

### **5\. Comment ça s'affiche dans le Quiz ?**

À côté de Neo, l'icône de l'objet brille quand elle est prête.

*   L'enfant clique.
    
*   **Effet visuel :** Une onde de choc ou un halo entoure Neo.
    
*   **Effet sonore :** Un son "magique" distinct.
    
*   L'icône devient grise (utilisée).
    

**Quiz (Le Stock total) : 20 à 25 questions.**

*   _En session (Combat) :_ **12 questions**.
    
*   Pourquoi 20-25 en stock ? Pour que s'il rate son combat et recommence, il tombe sur environ 50% de nouvelles questions. C'est le ratio parfait pour éviter le par cœur pur tout en restant familier.
    

**Niveau**

**Flashcards (Stock)**

**Quiz (Stock)**

**Questions par Combat**

**6ème**

15 cartes

15 questions

8 questions

**5ème / 4ème**

15 cartes

20 questions

10 questions

**3ème (Brevet)**

20 cartes

30 questions

12 questions

**Résultat**

**Énergie (Munitions)**

**Dégâts Boss**

**Juste**

*   **1 Éclat**
    

**\-10 PV**

**Faux**

*   **1 Éclat**
    

**0 PV**

**Quiz** : Consomme les Éclats (Dégâts 10) ou utilise les cailloux (Dégâts 1) si la lanterne est vide.

**Paramètre**

**Valeur**

**PV du Boss**

**100**

**Nombre de questions**

**12**

**Dégâts Éclat**

**10**

**Dégâts Caillou**

**1**

**Éclats (Standard)**

**10** 

### **3\. La Gratuité après la Victoire (Le mode "Maître")**

### **1\. Le Concept : "Le Match de l'Amitié"**

Puisque le Boss est libéré du Brouillard, il retrouve sa forme colorée et son caractère sympa. Le quiz ne sert plus à le blesser, mais à entretenir la flamme de la connaissance.

*   **Le projectile :** L'Éclat de savoir se transforme en **Ballon de Lumière**.
    
*   **L'action :** Chaque bonne réponse déclenche une passe. Neo envoie le ballon, le Boss le réceptionne avec style (une tête, un jongle, un arrêt de gardien) et le renvoie à Neo.
    

### **2\. Comment gérer les PV (qui n'en sont plus) ?**

On ne peut plus parler de "tuer" le Boss. On remplace la barre de vie par une **Jauge de Combo** ou de **Plaisir**.

*   **L'objectif :** Faire 12 passes réussies sur les 12 questions.
    
*   **Le visuel :** À chaque bonne réponse, le score de "Combo" augmente et le ballon brille de plus en plus fort.
    
*   **Le bonus :** Si l'enfant fait un 12/12 (le match parfait), Neo et le Boss font une célébration spéciale à la fin (un "check", une petite danse, ou ils soulèvent un trophée ensemble).
    

### **3\. Et si l'enfant se trompe ?**

C'est là que ça reste pédagogique. Si l'élève fait une erreur :

*   Le ballon tombe par terre ou s'échappe.
    
*   Le Boss fait une petite moue triste ou encourageante : _"Oups, je n'ai pas pu rattraper celle-là ! Réessaie !"_
    
*   Le combo retombe à zéro, mais le jeu continue. Il n'y a plus de "Game Over", car on est en mode **Libre**.
    

### **4\. Pourquoi c'est stratégique pour ton site ?**

1.  **La dédramatisation de l'erreur :** Une fois le Boss vaincu "pour de vrai", le mode libre permet de s'entraîner sur les questions difficiles sans le stress de perdre ses munitions ou de devoir retourner aux flashcards.
    
2.  **L'attachement au Boss :** En jouant au ballon avec lui, l'enfant s'attache au personnage. Il aura encore plus envie d'aller dégeler le Boss de la région suivante pour voir avec quel genre de ballon il joue !
    

### **5\. Une variante fun par Boss**

Pour rendre chaque mode "Maître" unique, le "ballon" peut changer selon le thème :

*   **Histoire (Moyen-Âge) :** Un bouclier rond qu'ils se lancent comme un frisbee.
    
*   **SVT :** Une cellule géante ou un globe terrestre.
    
*   **Maths :** Un cube de Rubik ou un dé à 20 faces.
    

**Imagine la scène au Phare :** L'enfant voit la statue dégelée, il clique dessus, et le Boss lui propose : _"Hé Neo, on se fait un petit match pour voir si tu te souviens encore de tout ?"_

**Récompense :** Très peu d'or (juste pour l'effort), mais beaucoup de dialogues de Lore bonus avec le Boss. 

Pour le **Mode Maître**, Neo porte une tenue décontractée (ex: une casquette). 

### **1\. La Fin Précoce : "Victoire Instantanée"**

Dès que les PV du Boss tombent à **0** (par exemple à la 10ème question) :

*   **Le Quiz s'arrête net.** Inutile de poser les questions 11 et 12.
    
*   **Animation de Victoire :** Le Boss est dissipé par la lumière, Neo fait sa pose de héros.
    
*   **L'effet "Wow" :** On affiche un message du type : _"K.O. TECHNIQUE ! Tu as terrassé l'Oubli avec une rapidité déconcertante !"_
    

### **2\. Le Bonus de "Munitions Restantes" (La récompense)**

C'est ici qu'on valorise le fait d'avoir bien révisé. Les questions non posées et les éclats non utilisés se transforment en **Bonus d'Or ou d'XP**.

$$Bonus = (Eclats\\\_restants \\times 10) + (Questions\\\_non\\\_posees \\times 5)$$

*   **L'intérêt :** L'enfant comprend que plus il est efficace, plus il devient riche rapidement. C'est l'incitation parfaite pour ne pas faire d'erreurs.
    

### **5\. Une variante pour les "Gourmands" : Le Combo Final**

Si tu veux vraiment marquer le coup, tu peux proposer une **"Question Fatale"** (Finish Him !) :

*   Dès que le Boss arrive à 0 PV, une dernière question bonus apparaît.
    
*   Si l'enfant répond juste, il double son butin d'or.
    
*   Si l'enfant répond faux, il gagne quand même, mais sans le bonus.
    

**Verdict : On arrête le combat dès que les PV tombent à zéro.** C'est la preuve ultime de maîtrise. Et surtout, ça valide l'utilité d'avoir un "gros chargeur" (Maîtrise Totale) : non pas pour durer plus longtemps, mais pour s'assurer d'achever le Boss le plus vite possible !

### **2\. Le Quiz de l'Observateur : "Spot the Glitch"**

Dans les question du quizz, on peut ajouter des questions rigolotes, sur la video qui a des bugs IA : Dans le quiz du Boss, la question devient :

_"L'Oubli a glissé une anomalie dans la vidéo du Moyen-Âge. L'as-tu repérée ?"_

*   A) Le bouclier du chevalier a fondu.
    
*   B) Le roi avait trois bras.
    
*   C) La couronne flottait en l'air.
    

### **4\. Le Bonus : "Le Nettoyeur de Réalité"**

Si l'élève répond juste à cette question de bug :

*   Neo dit : _"Bien vu ! En repérant ce bug, tu as aidé à stabiliser la réalité de ce Royaume !"_
    

### **Le Look "Anti-Glitch"**

Au lieu d'être un cristal doré classique, cet éclat particulier pourrait avoir une apparence **"Code Source"** :

*   **Le Visuel :** Un cristal blanc électrique entouré de petits cubes de données qui tournoient.
    
*   **L'effet de traînée :** Quand Neo le lance, il laisse derrière lui une trace de code binaire (des 0 et des 1) ou une grille de réalité qui se répare au passage du projectile.
    

### **L'Impact de Réalité**

Quand cet éclat touche le Boss glitché :

*   **L'Animation :** Au moment de l'impact, il y a un flash de "mise au propre". Pendant une fraction de seconde, à l'endroit où le Boss est touché, on voit sa **vraie forme** (celle du mode Maître) à travers une sorte de scanner circulaire.
    
*   **Le Son :** Un bruit de "système qui redémarre" (un _ping_ cristallin très pur) qui contraste avec les bruits de glitch du Boss.
    

### **3\. Pourquoi c'est malin techniquement ?**

Tu n'as pas besoin de coder un nouveau type d'objet. Dans ton code, tu ajoutes juste une petite condition visuelle :

JavaScript

if (munition.provenance == "bug\_ia") {

   jouerAnimation("eclat\_purificateur"); // Le projectile devient bleu/blanc

   jouerSon("correction\_bug");

} else {

   jouerAnimation("eclat\_standard"); // Le projectile est doré

}

### **Le clin d'œil de Neo**

Juste avant de lancer cet éclat-là, Neo pourrait avoir une petite animation spéciale, genre il ajuste ses lunettes ou il dit :

*   _"Cible verrouillée, réalité rétablie !"_
    
*   _"Allez, on remet de l'ordre dans tout ça !"_
    

### **En résumé :**

*   **Calcul :** Toujours 10 PV (pour ne pas t'embêter).
    
*   **Récompense :** Bonus d'Or (pour la Boutique).
    
*   **Visuel :** Un projectile "Cyber-Magique" qui répare le décor au lieu de juste le frapper.
    

### **2\. Comment rendre le combat épique en 2D ?**

Tu peux tricher pour que ça ait l'air "moderne" sans la complexité de la 3D :

*   **Le Parallaxe :** Fais défiler le fond (le décor du royaume) un peu moins vite que le sol. Ça donne une profondeur immédiate.
    
*   **Les Effets de Particules (Canvas/CSS) :** C'est là que tu mets le paquet. Quand l'éclat de savoir part, il laisse une traînée de lumière. Quand il touche le Boss, il y a un flash blanc et des petits pixels qui volent.
    
*   **Le "Juice" :** Un léger tremblement de l'écran (shake) quand le Boss attaque ou quand Neo lance son caillou. Ça donne un impact physique énorme sans aucune 3D.
    

### **3\. L'astuce du "Boss Imposant"**

En 2D, tu peux jouer sur les échelles. Fais un Neo assez petit à gauche et un Boss immense (qui dépasse presque du cadre) à droite.

*   **Le Glitch du Brouillard :** Pour les fameux bugs de l'IA que tu veux intégrer, tu peux ajouter un filtre de "bruit" (noise) ou de distorsion uniquement sur le Boss pour montrer qu'il est instable.
    

C’est **LE** défi de beaucoup de jeux indépendants, et la réponse est géniale : **tu ne vas pas animer les personnages, tu vas animer tout le reste !**

C’est le principe du **"Juice"** (le jus) dans le game design. On prend une image fixe, et on lui donne de la vie grâce à l’interface (UI), aux effets spéciaux (VFX), aux bruitages (SFX) et au mouvement de la caméra.

Voici comment tu peux créer un combat épique en 2D avec des images IA fixes (tes sprites) :

### **1\. La Technique du "Pantin Élastique" (Squash & Stretch)**

C'est l'animation la plus simple et la plus efficace en CSS ou en Canvas.

*   **Au repos :** Ton Neo fixe et ton Boss fixe "respirent". Tu leur appliques un léger changement d'échelle (scale) et une petite translation verticale en boucle (par exemple, de 2 pixels toutes les 3 secondes).
    
    *   _Résultat :_ Ils n’ont pas l’air morts, ils flottent légèrement.
        
*   **À l'attaque :** Quand l'éclat part, Neo s'étire rapidement en largeur (scaleX) pour donner l'impression qu'il "pousse" le projectile.
    
*   **À l'impact :** Quand le Boss est touché, il se compresse rapidement en hauteur (scaleY) puis remonte, comme s'il avait pris un coup d'estomac.
    

### **2\. Les VFX (Visual Effects) : La Magie de l'Éclat**

C'est ici que tu dois mettre le paquet. Les effets spéciaux doivent compenser l'immobilité des sprites.

*   **L'Éclat (Le Projectile) :** C'est une animation à part entière. Tu n'utilises pas une image IA, mais un asset de particules (ou un dessin vectoriel simple). C'est un orbe de lumière pure avec une traînée scintillante qui traverse l'écran à toute vitesse.
    
*   **L'Impact :** C'est le moment clé. Quand l'éclat touche le Boss :
    
    *   Un gros **Flash lumineux** blanc ou doré sur le Boss.
        
    *   Une **Explosion de particules** (des petits cristaux qui volent) du côté opposé à l'impact.
        
*   **Les Cailloux :** Une trajectoire en cloche (arc de cercle) plus lente, et un petit effet de poussière ("poof") ridicule quand il touche le Boss.
    

### **3\. La Caméra : Le "Screen Shake"**

Rien ne donne plus de puissance à un coup qu'un tremblement d'écran.

*   **Niveau 1 :** Quand Neo lance son éclat, l'écran tremble très légèrement.
    
*   **Niveau 2 :** Quand l'éclat touche le Boss, l'écran tremble fort pendant 0.2 seconde. Ça donne un sentiment de lourdeur et de force.
    
*   **Niveau 3 :** Quand Neo se trompe et que le Brouillard de l'Oubli l'attaque (visuellement, avec de la fumée), l'écran tremble horizontalement pour simuler la désorientation.
    

### **4\. L'Interface (UI) Dynamique**

Les jauges et les chiffres sont des acteurs du combat.

*   **Les Chiffres de Dégâts :** Quand le Boss est touché, un gros chiffre rouge **"-10"** (avec une belle police) apparaît juste au-dessus de lui, monte légèrement en tremblant, puis s'efface.
    
*   **La Jauge de Vie :** Ne fais pas juste baisser le % de vie. Fais en sorte que la barre rouge clignote en blanc ou rouge vif quand elle baisse, puis que la barre se remplisse de "gris" pour montrer la perte.
    
*   **L'Animation de la Lanterne :** La jauge d'éclats (tes munitions) peut être une petite lanterne. Quand l'enfant a ses 100% (15 éclats), la lanterne brille intensément. Quand il tire, la flamme baisse. Quand elle est vide (cailloux), la lanterne est éteinte et Neo a l'air un peu plus "dans le noir".
    

### **Résumé de l'Action (Exemple d'une bonne réponse) :**

1.  **L'enfant valide la bonne réponse.**
    
2.  **SFX :** Un son cristallin de "chargement de magie".
    
3.  **UI :** Une charge d'éclat descend de la lanterne.
    
4.  **Neo :** S'étire légèrement (scaleX).
    
5.  **VFX :** Un projectile lumineux traverse l'écran.
    
6.  **IMPACT :** SFX d'explosion sourde + VFX Flash/Particules + Screen Shake.
    
7.  **Boss :** Se compresse (scaleY).
    
8.  **UI :** Chiffre "-10" apparaît + Jauge de Boss clignote et baisse.
    

### **L'astuce technique pour toi (CSS/JS)**

Utilise les **transformations CSS (transform: translate, scale, rotate)** et les **transitions/animations (transition: 0.2s ease-out)**. C'est très performant et facile à coder en JavaScript quand tu triggers tes réponses.

**Ce mélange de "micro-mouvements", de VFX et de Screen Shake est exactement ce qui fait que des jeux comme** _**Darkest Dungeon**_ **ou** _**Hearthstone**_ **sont magnifiques malgré des personnages très fixes. C'est l'ambiance qui rend le combat vivant !**