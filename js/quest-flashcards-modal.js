// ── Modal Flashcards V5 "Lanterne de Neo" — injection DOM ──
// Design : bundle Hi-Fi V5 (PFRXLBrOP5y6Y16wtM6pdA), final state après chat12+13.
// Tout est scopé sous #qa-modal-fc avec classes préfixées `fcv5-`.
// 4 écrans : Prépa · Session · Cristallisation · Révision.
(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-fc" data-fcv5-screen="prep" data-fcv5-card-state="recto">
      <div class="fcv5-shell">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>

        <!-- ── HEADER ───────────────────────────── -->
        <header class="fcv5-header">
          <div class="fcv5-h-left">
            <div class="fcv5-crumb" id="fcv5-crumb">Royaume · Historya</div>
            <h1 class="fcv5-title" id="fcv5-title">Quête</h1>
          </div>
        </header>

        <!-- ── SCREENS ──────────────────────────── -->
        <div class="fcv5-screens">

          <!-- 01 PRÉPA -->
          <section class="fcv5-screen fcv5-screen-prep">
            <div class="fcv5-prep-grid">
              <div class="fcv5-prep-col fcv5-prep-col--main">
                <span class="fcv5-kicker">⟡ Avant de commencer</span>
                <h2 class="fcv5-prep-h">Remplir la Lanterne</h2>
                <p class="fcv5-prep-lede">À chaque carte acquise, une <b>goutte de savoir</b> rejoint la lanterne. Une fois pleine, elle cristallise en <b>5 éclats</b> pour ton aventure.</p>

                <div class="fcv5-prep20">
                  <div class="fcv5-prep20-label">État de la quête — <span id="fcv5-prep-total">0</span> cartes</div>
                  <div class="fcv5-prep20-row" id="fcv5-prep-grid"></div>
                  <div class="fcv5-prep20-legend">
                    <span><i class="fcv5-dot fcv5-dot-ok"></i> <span id="fcv5-prep-ok">0</span> maîtrisées</span>
                    <span><i class="fcv5-dot fcv5-dot-re"></i> <span id="fcv5-prep-re">0</span> à revoir</span>
                    <span><i class="fcv5-dot fcv5-dot-x"></i> <span id="fcv5-prep-x">0</span> à découvrir</span>
                  </div>
                </div>

                <div class="fcv5-prep-actions">
                  <button class="fcv5-btn fcv5-btn-primary fcv5-btn-xl" data-fcv5-go="recto">
                    <span class="fcv5-btn-mono">↵ COMMENCER</span>
                    <span class="fcv5-btn-label">Remplir la lanterne</span>
                    <span class="fcv5-btn-hint"><span id="fcv5-prep-size">10</span> cartes · 2–3 minutes</span>
                  </button>
                  <button class="fcv5-btn fcv5-btn-ghost fcv5-btn-rose" data-fcv5-go="revis" id="fcv5-prep-revis">
                    <span class="fcv5-btn-label">🧠 Révision ciblée</span>
                    <span class="fcv5-btn-hint"><span id="fcv5-prep-revis-count">0</span> cartes "à revoir"</span>
                  </button>
                </div>
              </div>

              <div class="fcv5-prep-col fcv5-prep-col--lantern">
                <div class="fcv5-lantern-stand fcv5-lantern-stand--big" data-fill="0">
                  <img class="fcv5-lantern-fill" data-level="0"   src="img/lantern_0.png"   alt="Lanterne vide">
                  <img class="fcv5-lantern-fill" data-level="20"  src="img/lantern_20.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="50"  src="img/lantern_50.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="75"  src="img/lantern_75.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="100" src="img/lantern_100.png" alt="Lanterne pleine">
                  <div class="fcv5-lantern-glow fcv5-lantern-glow--soft"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- 02-05 SESSION -->
          <section class="fcv5-screen fcv5-screen-session">

            <!-- colonne gauche : lanterne de session -->
            <aside class="fcv5-lantern-side">
              <div class="fcv5-lantern-stand fcv5-lantern-stand--session" id="fcv5-lantern-stand" data-fill="0">
                <img class="fcv5-lantern-fill" data-level="0"   src="img/lantern_0.png"   alt="">
                <img class="fcv5-lantern-fill" data-level="20"  src="img/lantern_20.png"  alt="">
                <img class="fcv5-lantern-fill" data-level="50"  src="img/lantern_50.png"  alt="">
                <img class="fcv5-lantern-fill" data-level="75"  src="img/lantern_75.png"  alt="">
                <img class="fcv5-lantern-fill" data-level="100" src="img/lantern_100.png" alt="Lanterne pleine">
                <svg class="fcv5-lantern-overlay" viewBox="0 0 100 145" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  <defs>
                    <linearGradient id="fcv5-trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stop-color="oklch(0.78 0.16 80)"  stop-opacity="0"/>
                      <stop offset="55%"  stop-color="oklch(0.82 0.14 80)"  stop-opacity=".25"/>
                      <stop offset="95%"  stop-color="oklch(0.92 0.10 85)"  stop-opacity=".95"/>
                      <stop offset="100%" stop-color="oklch(0.92 0.10 85)"  stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <ellipse class="fcv5-lantern-bloom" id="fcv5-lantern-bloom" cx="50" cy="82" rx="22" ry="32" fill="oklch(0.92 0.10 85)" opacity="0"/>
                  <g id="fcv5-lantern-slots"></g>
                </svg>
                <div class="fcv5-lantern-glow"></div>
                <div class="fcv5-counter-pop" id="fcv5-counter-pop">+1</div>
              </div>
              <div class="fcv5-lantern-side-stat">
                <div class="fcv5-lantern-side-num"><span id="fcv5-drop-count">0</span><em>/ <span id="fcv5-drop-total">10</span></em></div>
                <div class="fcv5-lantern-side-cap">gouttes de savoir</div>
              </div>
            </aside>

            <!-- colonne centrale : carte -->
            <article class="fcv5-card-stage">

              <div class="fcv5-session-progress">
                <div class="fcv5-chips-row" id="fcv5-chips-row"></div>
                <div class="fcv5-session-counter"><span id="fcv5-cards-done">0</span>/<span id="fcv5-cards-total">10</span></div>
              </div>

              <div class="fcv5-card-wrap">
                <div class="fcv5-card" id="fcv5-card">
                  <div class="fcv5-card-shadow" aria-hidden="true"></div>

                  <!-- RECTO -->
                  <div class="fcv5-card-face fcv5-card-face--recto">
                    <div class="fcv5-card-band">
                      <span class="fcv5-band-id">
                        <span class="fcv5-compass-tiny"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M8 2.5 L 9.2 8 L 8 13.5 L 6.8 8 Z" fill="currentColor"/></svg></span>
                        Carnet · <b id="fcv5-card-id-r">#01</b>
                      </span>
                      <span class="fcv5-band-tags">
                        <span class="fcv5-tag fcv5-tag--diff" id="fcv5-card-diff-r">facile</span>
                        <span class="fcv5-tag fcv5-tag--n" id="fcv5-card-num-r">étape 1 / 10</span>
                      </span>
                    </div>
                    <div class="fcv5-card-body">
                      <div class="fcv5-card-watermark" aria-hidden="true">
                        <svg viewBox="0 0 200 200">
                          <g fill="none" stroke="currentColor" stroke-width="1.2">
                            <circle cx="100" cy="100" r="80"/>
                            <circle cx="100" cy="100" r="60"/>
                            <circle cx="100" cy="100" r="4" fill="currentColor"/>
                            <path d="M100 20 L 108 100 L 100 90 L 92 100 Z" fill="currentColor"/>
                            <path d="M100 180 L 108 100 L 100 110 L 92 100 Z" fill="currentColor" opacity=".4"/>
                            <path d="M180 100 L 100 108 L 110 100 L 100 92 Z" fill="currentColor" opacity=".4"/>
                            <path d="M20 100 L 100 108 L 90 100 L 100 92 Z" fill="currentColor" opacity=".4"/>
                            <path d="M44 44 L 96 96 M156 44 L 104 96 M44 156 L 96 104 M156 156 L 104 104" stroke-width=".6" opacity=".5"/>
                          </g>
                        </svg>
                      </div>
                      <div class="fcv5-card-q" id="fcv5-card-q"></div>
                      <button class="fcv5-hint-btn" id="fcv5-hint-btn" type="button" hidden>
                        <span class="fcv5-hint-btn-icon">💡</span>
                        <span class="fcv5-hint-btn-label">Indice de Neo</span>
                      </button>
                      <div class="fcv5-card-hint" id="fcv5-card-hint" hidden>
                        <span class="fcv5-card-hint-kicker">— indice —</span>
                        <span class="fcv5-card-hint-text" id="fcv5-card-hint-text"></span>
                      </div>
                    </div>
                    <div class="fcv5-card-corner tl"></div>
                    <div class="fcv5-card-corner tr"></div>
                    <div class="fcv5-card-corner bl"></div>
                    <div class="fcv5-card-corner br"></div>
                  </div>

                  <!-- VERSO -->
                  <div class="fcv5-card-face fcv5-card-face--verso">
                    <div class="fcv5-card-band fcv5-card-band--verso">
                      <span class="fcv5-band-id">
                        <span class="fcv5-compass-tiny"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M8 2.5 L 9.2 8 L 8 13.5 L 6.8 8 Z" fill="currentColor"/></svg></span>
                        Carnet · <b id="fcv5-card-id-v">#01</b> · résolu
                      </span>
                      <span class="fcv5-band-tags">
                        <span class="fcv5-tag fcv5-tag--diff" id="fcv5-card-diff-v">facile</span>
                        <span class="fcv5-tag fcv5-tag--n" id="fcv5-card-num-v">étape 1 / 10</span>
                      </span>
                    </div>
                    <div class="fcv5-card-body">
                      <div class="fcv5-card-a-kicker">— réponse —</div>
                      <div class="fcv5-card-a" id="fcv5-card-a"></div>
                      <div class="fcv5-card-note" id="fcv5-card-note"></div>
                    </div>
                    <div class="fcv5-card-corner tl"></div>
                    <div class="fcv5-card-corner tr"></div>
                    <div class="fcv5-card-corner bl"></div>
                    <div class="fcv5-card-corner br"></div>

                    <div class="fcv5-card-spawn" aria-hidden="true"></div>

                    <div class="fcv5-card-stamp" aria-hidden="true">
                      <svg viewBox="0 0 110 110">
                        <defs>
                          <radialGradient id="fcv5-crystalGrad" cx="40%" cy="35%" r="70%">
                            <stop offset="0%"  stop-color="oklch(0.85 0.12 320)"/>
                            <stop offset="50%" stop-color="oklch(0.62 0.22 320)"/>
                            <stop offset="100%" stop-color="oklch(0.32 0.18 320)"/>
                          </radialGradient>
                        </defs>
                        <path d="M 55 10 L 95 38 L 80 90 L 30 90 L 15 38 Z"
                              fill="url(#fcv5-crystalGrad)" stroke="oklch(0.25 0.12 320)" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M 55 10 L 55 90 M 15 38 L 80 90 M 95 38 L 30 90" stroke="oklch(0.95 0.06 320 / .35)" stroke-width=".6" fill="none"/>
                        <path d="M 35 28 L 50 22 L 45 35 Z" fill="oklch(0.95 0.06 320 / .65)"/>
                        <text x="55" y="65" text-anchor="middle" font-family="Cinzel" font-size="30" font-weight="800" fill="oklch(0.95 0.05 320)">✓</text>
                      </svg>
                      <div class="fcv5-card-stamp-text">Découvert</div>
                    </div>
                  </div>
                </div>

                <div class="fcv5-card-stack" aria-hidden="true" id="fcv5-card-stack"></div>
              </div>
            </article>

            <!-- colonne droite : actions -->
            <aside class="fcv5-actions">
              <div class="fcv5-chapter-stats">
                <div class="fcv5-chapter-stats-label">Quête · <b id="fcv5-chap-total">0</b> cartes</div>
                <div class="fcv5-chapter-stats-row">
                  <div class="fcv5-cs-stat fcv5-cs-stat--ok"><b id="fcv5-chap-ok">0</b><span>acquises</span></div>
                  <div class="fcv5-cs-stat fcv5-cs-stat--re"><b id="fcv5-chap-re">0</b><span>à revoir</span></div>
                  <div class="fcv5-cs-stat fcv5-cs-stat--x"><b id="fcv5-chap-x">0</b><span>pas vu</span></div>
                </div>
              </div>

              <!-- RECTO : Retourner -->
              <div class="fcv5-action-block fcv5-action-block--recto">
                <button class="fcv5-btn fcv5-btn-flip fcv5-btn-xl" data-fcv5-go="verso">
                  <span class="fcv5-btn-mono">[ ESPACE / TAP ]</span>
                  <span class="fcv5-btn-label">↻ Retourner</span>
                </button>
              </div>

              <!-- VERSO : Acquis / À revoir -->
              <div class="fcv5-action-block fcv5-action-block--verso">
                <button class="fcv5-btn fcv5-btn-acquis fcv5-btn-xl" data-fcv5-go="acquis">
                  <span class="fcv5-btn-mono">[ → ] / SWIPE →</span>
                  <span class="fcv5-btn-label">Acquis ✓</span>
                  <span class="fcv5-btn-hint">+1 goutte pour la lanterne</span>
                </button>
                <button class="fcv5-btn fcv5-btn-refaire" data-fcv5-go="refaire">
                  <span class="fcv5-btn-mono">[ ← ] / SWIPE ←</span>
                  <span class="fcv5-btn-label">↺ À revoir</span>
                  <span class="fcv5-btn-hint">pas encore solide</span>
                </button>
              </div>
            </aside>

            <!-- overlay : path goutte + sparks -->
            <svg class="fcv5-paths" viewBox="0 0 1100 580" preserveAspectRatio="none">
              <path id="fcv5-pathTrail" d="" fill="none" stroke="url(#fcv5-trailGrad)" stroke-width="3.2" stroke-linecap="round"/>
            </svg>
            <div class="fcv5-drop" id="fcv5-drop" aria-hidden="true">
              <div class="fcv5-drop-aura"></div>
              <div class="fcv5-drop-core"></div>
              <div class="fcv5-drop-spark"></div>
            </div>
            <div class="fcv5-sparks" id="fcv5-sparks" aria-hidden="true"></div>
          </section>

          <!-- 06 CRISTALLISATION -->
          <section class="fcv5-screen fcv5-screen-fin">
            <div class="fcv5-fin-stage">
              <span class="fcv5-kicker">⟡ Lanterne pleine</span>
              <h2 class="fcv5-fin-h">Cristallisation</h2>

              <div class="fcv5-fin-cristal" id="fcv5-fin-cristal" data-step="0">
                <div class="fcv5-lantern-stand fcv5-lantern-stand--fin" id="fcv5-fin-lantern" data-fill="100">
                  <img class="fcv5-lantern-fill" data-level="0"   src="img/lantern_0.png"   alt="">
                  <img class="fcv5-lantern-fill" data-level="20"  src="img/lantern_20.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="50"  src="img/lantern_50.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="75"  src="img/lantern_75.png"  alt="">
                  <img class="fcv5-lantern-fill" data-level="100" src="img/lantern_100.png" alt="">
                  <svg class="fcv5-lantern-overlay" viewBox="0 0 100 145" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <g id="fcv5-finLanternSlots"></g>
                  </svg>
                  <div class="fcv5-lantern-glow fcv5-lantern-glow--fin"></div>
                  <div class="fcv5-fin-burst" aria-hidden="true">
                    <div class="fcv5-burst-ring r1"></div>
                    <div class="fcv5-burst-ring r2"></div>
                    <div class="fcv5-burst-ring r3"></div>
                  </div>
                </div>

                <button class="fcv5-btn fcv5-btn-ghost fcv5-btn-replay" id="fcv5-fin-replay" type="button" title="Rejouer l'animation">↻ Rejouer l'animation</button>
              </div>

              <div class="fcv5-fin-stats">
                <div class="fcv5-stat">
                  <span class="fcv5-stat-label">Gains de session</span>
                  <span class="fcv5-stat-val fcv5-stat-val--gold">+ 5 <em>éclats</em></span>
                </div>
                <div class="fcv5-stat-sep"></div>
                <div class="fcv5-stat">
                  <span class="fcv5-stat-label">Quête maîtrisée</span>
                  <span class="fcv5-stat-val"><span id="fcv5-fin-mastered-before">0</span> → <em class="fcv5-hilite" id="fcv5-fin-mastered-after">0</em> / <span id="fcv5-fin-mastered-total">0</span></span>
                </div>
                <div class="fcv5-stat-sep"></div>
                <div class="fcv5-stat">
                  <span class="fcv5-stat-label">Reste à découvrir</span>
                  <span class="fcv5-stat-val"><span id="fcv5-fin-todo">0</span> secrets</span>
                </div>
              </div>

              <div class="fcv5-fin-actions">
                <button class="fcv5-btn fcv5-btn-primary" data-fcv5-go="prep">↻ Refaire une série</button>
                <button class="fcv5-btn fcv5-btn-cta" onclick="closeQuestActivity()">Sortir de la lanterne</button>
              </div>
            </div>
          </section>

          <!-- 07 RÉVISION (placeholder — déclenche la session standard sur la queue 'à revoir') -->
          <section class="fcv5-screen fcv5-screen-revis">
            <div class="fcv5-revis-grid">
              <div class="fcv5-revis-main">
                <div class="fcv5-revis-banner">
                  <div class="fcv5-revis-banner-icon">🧠</div>
                  <div>
                    <div class="fcv5-kicker fcv5-kicker--rose">Révision</div>
                    <div class="fcv5-revis-banner-h" id="fcv5-revis-banner-h">On retravaille ces cartes</div>
                  </div>
                </div>
                <div class="fcv5-revis-cta-row">
                  <button class="fcv5-btn fcv5-btn-primary" data-fcv5-go="recto" id="fcv5-revis-start">
                    <span class="fcv5-btn-label">↵ Lancer la révision</span>
                  </button>
                  <button class="fcv5-btn fcv5-btn-ghost fcv5-btn-back" data-fcv5-go="prep">
                    <span class="fcv5-btn-label">← Retour prépa</span>
                  </button>
                </div>
              </div>
              <aside class="fcv5-revis-queue">
                <div class="fcv5-revis-queue-label">À revoir avec Neo</div>
                <ul class="fcv5-revis-list" id="fcv5-revis-list"></ul>
                <div class="fcv5-revis-note">En révision, pas de cristallisation (pas de farming) — on travaille la mémoire.</div>
              </aside>
            </div>
          </section>

        </div><!-- /.fcv5-screens -->
      </div><!-- /.fcv5-shell -->
    </div>
  `;
  document.body.appendChild(el.firstElementChild);
})();
