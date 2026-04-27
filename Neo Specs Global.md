Voici une proposition de spécifications structurées pour le projet **NeoQuest**, organisées selon une logique d'architecture allant de la vision globale aux détails techniques.

### 1\. Vision et Concept Stratégique

Le projet vise à transformer la révision scolaire au collège en une **épopée héroïque** en superposant les programmes officiels à des mécaniques de **jeu de rôle (RPG)** 1. L'élève n'est plus un simple utilisateur, mais un **Explorateur** accompagné de sa mascotte, **Neo** 1, 2. L'objectif est de créer un environnement où l'élève progresse par plaisir ("on vient pour aider Neo") tout en garantissant une efficacité pédagogique ("on finit par avoir 18/20")

### 2\. Architecture du Monde (Mapping Scolaire/RPG)

La structure du contenu suit une hiérarchie stricte permettant une navigation fluide dans le "Multivers" de la connaissance

*   **Le Royaume (La Matière) :** Domaine d'exploration libre (ex: _Historya_ pour l'Histoire)
    
*   **La Province (La Classe) :** Régions correspondant aux paliers de difficulté (6ème à 3ème)
    
*   **La Région (Le Thème) :** Zones géographiques à "libérer" sur une carte interactive
    
*   **La Quête (Le Chapitre) :** Parcours scénarisé séquentiel menant à un combat final
    

La navigation utilise un système de **"brouillard de guerre"** : toutes les zones sont visibles pour exciter la curiosité, mais les niveaux non adaptés à l'élève sont floutés.

### 3\. La Boucle de Gameplay (Le "Flow" Utilisateur)

Chaque quête (chapitre) se décompose en 4 phases obligatoires pour maximiser la mémorisation:

1.  **Exploration (Vidéo) :** Immersion visuelle  pour comprendre l'univers et gagner des "Eclats de Savoir".
    
2.  **Entraînement (Flashcards) :** Mémorisation active permettant de récolter des "Eclats de Savoir" pour armer Neo
    
3.  **Combat (Quiz Boss) :** Test final de 12 questions avec un ratio de difficulté (3 Faciles / 6 Medium / 3 Hard). La quête est validée si le Boss est vaincu.

4.  **Defi Final** : Mode Speed-run. Répondre à un maximum de questions en 60 secondes.
    

### 4\. Mécaniques d'Engagement et Rétention

Pour assurer la régularité de l'apprentissage (le "Stickiness"), plusieurs leviers sont intégrés :

*   **La Mascotte Neo :** Compagnon évolutif qui change de tenue selon la matière (ex: Neo Chevalier en Histoire) et réagit avec empathie aux succès/échecs
    
*   **Système de Récompenses :** Gain d'XP, de monnaie virtuelle pour la boutique, et collection d'objets rares (Loot)
    
*   **Leviers Sociaux :** Classements (Leaderboards), défis quotidiens et "Quêtes de Guilde" où les points de plusieurs élèves s'additionnent pour débloquer un trésor commun
    
*   **Régularité :** Système de "Streaks" (séries) pour encourager une connexion quotidienne
    

### 5\. Fonctionnalités Spécifiques de Révision

*   **Mode "SOS Contrôle" :** Bouton d'urgence sélectionnant les 10 flashcards et le quiz essentiels pour une révision flash la veille d'un examen
    
*   **Adaptabilité des Profils :** Des parcours segmentés pour les profils "Performance" (Speedrun, défis chrono) et les profils "Décrocheurs" (micro-victoires de 2 minutes, droits à l'erreur via des boucliers)
    
*   **Récupération :** Une fois un thème fini, déblocage d'une "Cheat Sheet" (fiche de synthèse visuelle)
    

### 6\. Stratégie Technique

*   **Contrôle du Contenu :** Utilisation de fichiers **JSON curatés** pour garantir la qualité pédagogique et la rapidité d'exécution 
    
*   **Infrastructure Légère :** Architecture **Localstorage First**, permettant une application fonctionnelle immédiatement sans base de données complexe
    
*   **Portabilité :** Système de **"Codes de Sauvegarde"** permettant à l'élève de transférer sa progression d'un appareil à l'autre en copiant une chaîne de caractères 