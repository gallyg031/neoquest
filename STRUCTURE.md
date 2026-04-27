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

### `assets/quest-modal.css` (123 lignes)
Styles pour les modales de quête :
- Overlays, close buttons
- Progress bars, badges
- Glassmorphisme

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

**`js/quest-modal.js`** (136 lignes) — Core, expose API publique
- Variables partagées : `currentChap`, `currentNiveau`, `currentMat`, `chapitreId`, `matiereId`
- Audio helpers
- localStorage : progress, weak questions, flashcard weak
- `applyChapterTheme(chap)` — Customise labels difficulté
- **API publique** :
  - `openQuestActivity(chap, niveau, mat, tab)` — Ouvre modale (video/flashcards/quiz/chrono)
  - `closeQuestActivity()` — Ferme modale

**`js/quest-video.js`** (52 lignes)
- `openVideoModal(chap)` — Affiche vidéo YouTube + PDF
- Fallback si vidéo pas disponible

**`js/quest-flashcards.js`** (144 lignes)
- État : `fcPile`, `fcAcquises`, `fcTotal`, `fcFlipped`, `fcAllCards`, `fcDragAttached`
- `initFlashcards(cards)` — Lance la pile
- `pickFCPile()` → `renderFCCard()` — Affiche carte
- `flipCard()` — Flip animation
- `fcAcquis()` / `fcRevoir()` — Marque acquise ou à revoir
- `reshuffleFC()` — Nouvelle pile (strong puis weak)
- `attachFCDragOnce()` — Swipe desktop/mobile pour yes/no
- Weak tracking : `getFCWeak()`, `saveFCWeak()`, `markFCRevoir()`, `markFCAcquis()`

**`js/quest-quiz-modal.js`** (66 lignes) — DOM template
- IIFE : crée et injecte la modale HTML dans le DOM
- Charge avant `quest-quiz.js`

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
