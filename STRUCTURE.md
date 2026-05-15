# Neoquest — Structure du Projet

## Architecture générale

**Principe** : fichiers petits et auto-contenus. Un rôle par fichier.

### Répertoires

- `assets/` — CSS partagé par page
- `js/` — JS partagé et logique métier
- `data/` — Données (data.js)
- `img/` — Images, icônes, bannières
- `compositions/` — Futures sous-pages

---

## Pages HTML et dépendances

### `index_hidden.html` (165 lignes)
**Contient** : Nav, Hero, Portails (grille des royaumes), Comment ça marche, Footer

**Dépendances** :
- `js/xp.js` — Gestion XP (en head, utilisé par nav inline)
- `data/data.js` — Données des royaumes (en head, utilisé par js/index.js)
- `assets/index.css` — Tous les styles de la page
- `js/index.js` — Portails rendering, hero section, intersection observer, menu toggle, SW

**Points clés** :
- Script nav inline `<script>` après `</nav>` (anti-FOUC, profile/XP init)
- Portails : grille hexagonale avec positions absolues en CSS
- Images par royaume dans `ROYAUME_IMAGES` (js/index.js)
- Palettes couleur dans `PALETTES` (js/index.js)
- Intersection observer pour animations `.reveal`

---

### `boutique.html` (~80 lignes)
**Contient** : Nav, En-tête Hibou, Onglets catégories, Grille items, Bulle Neo, Toast

**Dépendances** :
- `js/xp.js` — Gestion XP/Or (en head, fournit `nqGetGold`, `nqRefreshGoldDisplay`, badge or de la nav)
- `data/data.js` — Données globales (en head, par cohérence)
- `assets/index.css` — Styles partagés (nav, blobs, glass, badge)
- `assets/boutique.css` — Styles spécifiques (bazar, cartes items, hibou, bulle Neo)
- `js/boutique.js` — Catalogue items, render, achat, persistance

**Points clés** :
- MVP : 2 catégories (Skins, Consommables)
- Mock or de départ : 500 (si `totalGold` absent de `neoquest_progress`)
- Persistance items achetés : `neoquest_boutique_owned` (array d'ids)
- Items consommables = rachetables ; cosmétiques = unique

---

### `royaume.html` (135 lignes)
**Contient** : Nav, Banneau du royaume, Grille des quêtes par zone

**Dépendances** :
- `js/xp.js` — Gestion XP (en head)
- `data/data.js` — Données (en head)
- `assets/royaume.css` — Styles de la page
- `js/royaume-globe.js` — Globe modal, fog canvas, fresnel effect, zone interactions
- `js/royaume-init.js` — Variables partagées (currentChap, currentNiveau, etc.), fonctions utilitaires audio, localStorage, thème custom
- `js/royaume-map.js` — Rendu des quêtes (renderMapRoute avec closures, renderZigzag)
- `js/royaume-panel.js` — renderProvince (infos zone)

**Points clés** :
- Script nav inline après `</nav>`
- Globes modaux : glossmorphisme, hexagone clipPath, fresnel overlay
- `var` (pas `let`/`const`) pour variables partagées entre scripts
- Closures dans renderMapRoute : colorFilter, drawPaw, placeNodes, syncPanelHeight

---

### `chapitre.html` (N/A — non refactorisé)
**À décomposer** : CSS, JS des quêtes (vidéo, flashcards, quiz)

---

### `profil.html` (N/A — non refactorisé)

---

## Fichiers CSS

### `assets/royaume.css` (443 lignes)
Styles pour `royaume.html` :
- Globe, hexagones, portails
- Grille de quêtes
- Animations (portails, zones)

### `assets/index.css` (165 lignes)
Styles pour `index_hidden.html` :
- Nav, blobs, stars, badges
- Portails (hexagones, positions)
- Section "Comment ça marche" (cristaux, connecteurs, particles)

### `assets/boutique.css`
Styles pour `boutique.html` :
- En-tête (hibou animé + glow)
- Onglets catégories
- Cartes items (rareté commun/rare/légendaire)
- Bouton acheter, bulle Neo, toast feedback

### `assets/quest-modal.css` (123 lignes)
Styles pour les modales de quête :
- Overlays, close buttons
- Progress bars, badges
- Glassmorphisme

### `assets/neo.css`
Styles pour le composant Neo (sidekick) :
- `.neo-host` — conteneur flottant (position absolue, bas-droite du parent)
- `.neo-avatar` — avatar circulaire 64px (48px mobile), couleur du contour pilotée par `data-state`
- `.neo-bubble` — bulle de dialogue à gauche, pointe vers Neo via triangle pseudo-élément
- `.neo-mute` — bouton "Silence, Neo !" en pastille sur l'avatar
- Animation `neoBounce` au déclenchement d'une réplique
- 5 états visuels via `data-state` : neutre / reflexion / succes / oups / combat

### `assets/chrono.css`
Styles pour la modale Défi "Questions pour un Champion" (`quest-chrono-modal.js`) :
- Boîte `.qa-chrono-box` avec projecteurs balayants + décor étincelles (plateau TV)
- Bandeau stats (timer + score + bonnes + streak) en haut
- Scène arène en grid : présentateur centré (avec bulle de dialogue), thermomètre vertical à droite, options 2×2 à gauche, Neo en bas
- Thermomètre `.qa-chrono-thermo` : tube vertical + boule, fill animé bottom→top, graduations dynamiques, bump sur palier+, shake sur retour à 0
- Bulle dialogue `.qa-chrono-bubble` avec queue pointant vers le présentateur
- Écran final : count-up dramatique (counter géant) + confettis tombants + stats secondaires

---

## Fichiers JS

### Partagés / Utilitaires

**`js/xp.js`** — Système XP
- `nqGetXP()` — Récupère XP total
- `nqGetLevel(xp)` — Retourne {level, title, color}
- `nqGetLevelProgress(xp)` — Pourcentage vers prochain niveau
- `nqCheckLevelUp(prev, curr)` — Vérifie montée de niveau

**`data/data.js`** — Données globales
- `window.__neoData` — Matieres, niveaux, thèmes, chapitres

### Pages

**`js/index.js`** (130 lignes) — Pour `index_hidden.html`
- `openPortal(mat)` — Navigation vers royaume
- Hero section : dernière quête, badges nouveautés
- Grille portails : positions, palettes, interactions
- Intersection observer pour animations `.reveal`
- Menu mobile toggle
- Service Worker registration

**`js/boutique.js`** — Pour `boutique.html`
- `BAZAR_ITEMS` : catalogue (id, cat, name, desc, price, emoji, rarity, consumable?)
- `bzEnsureMockGold()` — Initialise 500 or si absent (mock à remplacer plus tard)
- `bzGetGold/bzSpendGold` — Wrappers sur `neoquest_progress.totalGold`
- `bzGetOwned/bzAddOwned` — Persistance `neoquest_boutique_owned`
- `bzRender()` — Affiche grille selon `currentCat`, gère états (owned, too-poor)
- `bzBuy(id)` — Achat, son d'or, refresh display, commentaire Neo
- `bzNeoSay/bzToast` — Feedbacks UX

**`js/royaume-globe.js`** (224 lignes) — Pour `royaume.html`
- Globe interactif, modal glossmorphe
- Fog canvas (darkening zones)
- Fresnel effect
- Zone click interactions

**`js/royaume-init.js`** (246 lignes) — Pour `royaume.html`
- Variables globales : `currentChap`, `currentNiveau`, `currentMat`, etc.
- Constantes : `DIFF_LABELS`, `DIFF_POINTS`, `DIFF_CLASS`, `QUIZ_SIZE`, `FC_SIZE`
- Fonctions audio : `playTone()`, `soundCorrect()`, `soundWrong()`, `soundFlip()`
- Helpers localStorage : `getProgress()`, `saveProgress()`
- Thème custom par chapitre : `applyChapterTheme()`
- Shuffle & weighted shuffle

**`js/royaume-map.js`** (557 lignes) — Pour `royaume.html`
- `renderMapRoute(chap, niveau)` — Affiche quêtes, zones, chemin
  - Closures internes : `colorFilter()`, `drawPaw()`, `placeNodes()`, `syncPanelHeight()`
  - Utilise 3 canvas (brouillard, paw icons, quêtes)
  - Gère interactions (clic sur zones, quêtes)
- `renderZigzag()` — Chemin zigzag entre quêtes

**`js/royaume-panel.js`** (37 lignes) — Pour `royaume.html`
- `renderProvince(provence_id)` — Affiche infos zone dans panel latéral

### Quête (Modales)

**Organisation** : Chaque modale a un fichier DOM (`*-modal.js`) chargé avant le fichier logique (`*.js`)

**`js/quest-modal.js`** — Core, expose API publique
- Variables partagées : `currentChap`, `currentNiveau`, `currentMat`, `chapitreId`, `matiereId`
- Audio helpers
- localStorage : progress, weak questions, flashcard weak, **flashcard mastered (acquis ≥1 fois par chap)**
- `getFCMasteredSet/addFCMastered/getFCMasteredCount` — Tracking persistant pour jauge X/total + bonus de maîtrise
- `applyChapterTheme(chap)` — Customise labels difficulté
- **API publique** :
  - `openQuestActivity(chap, niveau, mat, tab)` — Ouvre modale (video/flashcards/quiz/chrono)
  - `closeQuestActivity()` — Ferme modale

**`js/quest-lantern.js`** — Composant lanterne partagé (vidéo + flashcards)
- DOM injecté via `mountLantern(container, chapId, opts)`
- Animation éclat volant + glow, persistance `neoquest_lantern_<chapId>` (cap 15)
- **API publique** : `mountLantern`, `addLanternEclats(n)`, `resetLantern`, `getLanternCount`

**`js/quest-neo.js`** — Composant Neo (sidekick / compagnon) partagé
- **Singleton fixe** dans le viewport (`position: fixed; bottom-right; z-index 950`) — auto-monté sur `DOMContentLoaded`, **toujours visible**, y compris pendant les modales (z-index > 900)
- DOM : avatar + bulle + bouton mute, créé dans `document.body`
- 5 expressions visuelles (`neutre`, `reflexion`, `succes`, `oups`, `combat`) via `data-state` sur l'avatar, image `img/neo/neo-<state>.svg`
- Bulle de dialogue temporisée (durée auto basée sur longueur du texte), bounce de l'avatar à chaque réplique
- Mute global persistant : `localStorage.neoquest_neo_muted` ('1'/'0')
- Détection d'inactivité : `neoStartIdleWatch(ms, cb)` — la callback se redéclenche à chaque nouvelle séquence d'inactivité après une activité utilisateur
- `mountNeo(host, { context })` — appel idempotent ; si déjà monté, met juste à jour le contexte. Appelé sans `host` (null) après auto-mount pour changer de contexte.
- `neoReset()` — coupe la bulle, stoppe l'idle watch, clear l'indice, repasse à neutre (utilisé à la fermeture d'une modale ; Neo reste monté)
- **Mode Murmure (indice)** : `neoSetIndice(text)` allume un badge 💡 pulsant sur l'avatar et rend l'avatar cliquable. Au clic, la bulle s'ouvre avec l'indice en mode **persistant** (pas d'auto-hide) et **ignore le mute** (demande active de l'enfant). `neoClearIndice()` retire le badge et ferme la bulle si elle affichait l'indice.
- `neoSay(text, { persistent, ignoreMute, state, duration })` — `persistent: true` désactive l'auto-hide (clic sur la bulle pour fermer) ; `ignoreMute: true` affiche même si Neo muet.
- **API publique** : `mountNeo`, `unmountNeo`, `neoReset`, `neoSay(text, opts)`, `neoSayFromBank(context, bucket, vars)`, `neoSetExpression(state, { autoRevertAfter })`, `neoSetIndice(text)`, `neoClearIndice()`, `neoMute(bool)`, `neoIsMuted()`, `neoStartIdleWatch`, `neoStopIdleWatch`

**`data/neo-lines.js`** — Banque de répliques de Neo
- `window.__neoLines[context][bucket] = [{ text, state }, ...]`
- Variables disponibles dans `{text}` : `{total}`, `{acquises}`, `{restantes}`
- Buckets actuels (context `flashcards`) : `intro`, `end`, `idle`, `streak3`, `mastery`
- Plusieurs phrases par bucket → tirage aléatoire

**`js/quest-video.js`**
- DOM modale vidéo + cadre thématique (`img/cadre-{theme}.png`)
- YouTube IFrame API, polling progression → éclats progressifs (cap 5/vidéo)
- `openVideoModal(chap, mat)` — Mount la lanterne, charge le cadre, lance la vidéo

**`js/quest-flashcards-modal.js`** — DOM template
- IIFE : crée et injecte la modale flashcards (header "Éclats de Savoir", jauge X/total, bonus de maîtrise, pile, lanterne)
- Conteneur `.qa-fc-box` avec attribut `data-fc-theme="historya|bioverde|quantix|algebron|lexoria"` qui pilote tout le thème via CSS variables
- **Pas de barre d'indice** — les indices sont délégués à Neo via `neoSetIndice` (badge 💡 sur l'avatar, clic pour afficher)
- Charge avant `quest-flashcards.js`

**`js/quest-flashcards.js`** — Logique seule
- État : `fcPile`, `fcAcquises`, `fcTotal`, `fcFlipped`, `fcAllCards`, `fcDragAttached`, `fcStreak`
- `FC_THEMES` map matière → thème CSS
- `initFlashcards(cards)` — Set le thème, mount la lanterne, **passe Neo en contexte 'flashcards' + bulle d'intro + idle watch 15s** (Neo lui-même est déjà monté en singleton fixe), refresh la jauge X/total, lance la pile
- Hooks Neo intégrés :
  - `fcAcquis()` → expression `succes` (auto-revert 1.5s) + réplique `streak3` tous les 3 acquis consécutifs + réplique `mastery` à la transition vers maîtrise totale du chapitre
  - `fcRevoir()` → expression `oups` (auto-revert 1.5s), reset du streak, pas de bulle (sobre)
  - `renderFCCard()` → `neoSetIndice(card.indice)` si dispo (badge 💡 sur Neo), sinon `neoClearIndice()`
  - `flipCard()` → `neoClearIndice()` quand la carte montre la réponse (indice obsolète)
  - `showFCComplete()` → stop idle watch + réplique `end`
- `refreshMasteryDisplay()` — Met à jour jauge `X/total` + état du bonus de maîtrise (verrou/déverrouille)
- `updatePileCounter()` — Compteur "N cartes restantes" + `data-remaining` sur la pile (pour effacer les cartes fantômes derrière)
- `pickFCPile()` → `renderFCCard()` — Affiche carte
- `flipCard()` — Flip animation
- `fcAcquis()` / `fcRevoir()` — Marque acquise (+ `addFCMastered`) ou à revoir
- `showFCComplete()` — Anim 5 éclats vers la lanterne via `window.addLanternEclats(5)`
- `reshuffleFC()` — Nouvelle pile (strong puis weak)
- `attachFCDragOnce()` — Swipe desktop/mobile pour yes/no
- Weak tracking : `getFCWeak()`, `saveFCWeak()`, `markFCRevoir()`, `markFCAcquis()` (dans `quest-modal.js`)

**`js/quest-quiz-modal.js`** (66 lignes) — DOM template
- IIFE : crée et injecte la modale HTML dans le DOM
- Charge avant `quest-quiz.js`

**`js/quest-chrono-modal.js`** — DOM template (TV Show "Questions pour un Champion")
- IIFE : crée et injecte `#qa-modal-chrono` (intro / jeu / final)
- Contient l'élément `<audio id="qa-chrono-music">` pour la musique épique de fond
- Scène arène : zones `qa-chrono-presenter` (sprite + bulle), `qa-chrono-thermo`, `qa-chrono-opts`, `qa-chrono-neo`
- Charge avant `quest-chrono.js`

**`js/quest-chrono.js`** — Logique du mode Défi (TV show 60s avec jauge palier)
- État : `chronoState` (`pool`, `idx`, `timeLeft`, `score`, `count`, `streak`, `palier`, `maxPalier`, `maxStreak`, `poolSize`, `running`, `timerId`, `countupRaf`)
- Constantes : `CHRONO_DURATION=60`, `CHRONO_STREAK_PCT=0.20`, `CHRONO_GOLD_RATIO=5`, `CHRONO_COUNTUP_MS=3500`
- **Mécaniques** :
  - Bonne réponse : `palier += 1`, `streak += 1`, `score += round(palier × (1 + streak × 0.20))`
  - Mauvaise réponse : `palier = 0`, `streak = 0`, **score conservé**, pas de pénalité de temps
  - Jauge thermomètre graduée jusqu'à `pool.length` (taille du stock)
- `initChrono(questions)` — Reset état + HUD, charge sprite présentateur + musique
- `chronoStart()` — Lance timer + musique + 1ère question
- `chronoStop()` — Stoppe timer + RAF count-up + musique (appelé par `closeQuestActivity`)
- `chronoAnswer(btn, isCorrect)` — Applique mécanique, dings, anims (bump/shake jauge, flame Neo, streak flame)
- `chronoEnd()` — Confettis + count-up dramatique 3.5s easeOutQuart + jingle final do-mi-sol
- `chronoRestart()` — Re-shuffle, relance
- `palierDing(palier)` — Ding montant en demi-tons (440 Hz × 1.0595^palier)
- `setupPresenterSprite()` — Tente `img/presenter-{chapId}.png`, fallback emoji 🎤 si 404
- `setupChronoMusic()` — Tente `wav/Music{Royaume capitalisé}.mp3` (ex. `wav/MusicHistorya.mp3`)
- `buildThermoTicks(total)` — Crée 5 à 12 graduations selon taille du pool
- Persistance locale : `neoquest_chrono_<chapId>` (best prestige/palier/streak/count + dernière run)
- Cumul global : `neoquest_progress.totalPrestige`
- **Assets attendus** :
  - `img/presenter-{chapId}.png` — boss-présentateur du chapitre (PNG transparent)
  - `wav/Music{Royaume}.mp3` — musique épique de fond (existe déjà pour Historya)
  - Neo : réutilise `img/Neo_assis.png`
- Format attendu des questions : `{question, choices:[], answer}` (alias `options`/`correct`)
- **TODO** : brancher sur la liste "questions non vues" une fois le refactor Quiz fini (actuellement pioche dans tout `chap.quiz`)
- **TODO** : déblocage conditionné à Boss vaincu + maîtrise totale — câblage côté `royaume-map.js` une fois le signal K.O. exposé par le quiz refactor

**`js/quest-quiz.js`** (163 lignes) — Logique seule
- État centralisé : `quizState` object (`allQuestions`, `quizData`, `quizIndex`, `quizPts`, `quizAnswered`, `quizHistory`, `hintUsed`, `streak`, `isRevisionMode`)
- `initQuiz(questions)` — Lance quiz (12 random : 3 facile, 6 medium, 3 hard)
- `pickAndStart()` → `renderQuiz()` — Affiche question
- `answer(selected, correct, diff)` — Valide réponse, sons, streak, points
- `quizNext()` — Question suivante
- `showQuizFinal()` — Écran victoire
- `showHint()` — Révèle indice (pts ÷ 2)
- `startRevisionMode()` — Mode révision (questions échouées, 0 pts)
- Weighted shuffle pour weak questions : `getWeakQuestions()`, `recordResult()`, `weightedShuffle()`

---

## Points d'entrée

1. **index.html** → (non lu)
2. **index_hidden.html** → nav + portails + hero + comment ça marche
   - Accès royaume : `openPortal()` → `royaume.html?matiere=ID`
3. **royaume.html** → nav + globe + grille quêtes par zone
   - Accès quête : `openQuestActivity(chap, niveau, mat, 'video'|'flashcards'|'quiz'|'chrono')`
4. **chapitre.html** → (non refactorisé)
5. **profil.html** → (non refactorisé)

---

## Checklists pour modifs futures

### Ajouter une nouvelle page
1. Créer `nouveau.html` (~50-100 lignes max, juste structure)
2. Extraire CSS → `assets/nouveau.css`
3. Extraire JS → `js/nouveau.js` (ou plusieurs si > 150 lignes)
4. Déclarer dépendances en commentaire HTML
5. **Mettre à jour ce fichier STRUCTURE.md**

### Ajouter une feature à une page existante
1. Vérifier si elle rentre dans le fichier JS existant (< 200 lignes cible)
2. Sinon, créer un nouveau fichier JS modulé (ex: `js/index-newfeature.js`)
3. **Mettre à jour STRUCTURE.md** : dépendances, logique

### Refactoriser un fichier volumineux
1. Chercher les responsabilités : UI, données, interactions, animations
2. Créer un fichier par responsabilité
3. Utiliser `var` pour variables partagées (scope global entre scripts)
4. Grouper closures & helpers dans le même fichier quand dépendances serrées
5. **Mettre à jour STRUCTURE.md**

---

## Notes d'architecture

- **Variable scope** : `var` (pas `let`/`const`) pour partage entre scripts non-modulés
- **Closures** : Grouper avec leur contexte (ex: colorFilter, drawPaw dans renderMapRoute)
- **Event delegation** : Utiliser pour DOM injecté après script load
- **localStorage keys** : préfixes `neoquest_` (progress, chap_ID, quizDone, weak, fc_weak, etc.)
- **CSS variables** : `--bg`, `--violet`, `--cyan` (réutilisés)
- **Anti-FOUC** : Scripts nav inline après `</nav>` pour éviter flash de texte
