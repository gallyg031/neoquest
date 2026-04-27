# Neoquest

## Project structure

Structure your project so files are small and self-contained.

One composition per file, not everything in a single html.
Keep assets in assets/, compositions in compositions/ — Claude won't need to scan both.

Use sub-compositions instead of one giant file.
When a composition grows, split it into compositions/scene1.html, compositions/scene2.html, etc. Claude only needs to read the one scene it's editing.

## Working with compositions

Never read all compositions at once. Read only the file you're editing.
Do not scan the entire project before making changes.

Only read files I specifically mention. Don't explore the project structure unprompted.

## Fichiers à ignorer

**`chapitre.html` n'est plus utilisé.** Ne pas lire, ne pas modifier, ne pas le proposer dans les plans. L'ignorer totalement.

## Before starting a task

**CRITICAL:** Before starting any task you request, reflect on whether a new decomposition/split is needed to maintain the principles of small, self-contained files and single responsibility. Ask yourself: should this logic be extracted into a separate file to keep each file focused? Consider decomposition FIRST before implementation.
