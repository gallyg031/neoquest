// ── Modal Défi / TV Show "Questions pour un Champion" — DOM ──
// Charge avant quest-chrono.js. Réutilise .qa-overlay / .qa-close de quest-modal.css.
// Le thermomètre, l'image du présentateur et celle de Neo sont injectés par quest-chrono.js.
(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-chrono">
      <div class="qa-chrono-box">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>
        <button class="qa-chrono-mute" id="qa-chrono-mute" onclick="chronoToggleMute()" title="Couper / activer le son" aria-label="Couper le son">🔊</button>
        <div class="qa-chrono-projector left"></div>
        <div class="qa-chrono-projector right"></div>

        <!-- Musique épique de fond (src injectée selon le royaume) -->
        <audio id="qa-chrono-music" loop preload="auto"></audio>

        <!-- Compte à rebours 3-2-1-GO avant le timer -->
        <div class="qa-chrono-countdown hidden" id="qa-chrono-countdown">
          <div class="qa-chrono-countdown-num" id="qa-chrono-countdown-num">3</div>
        </div>

        <!-- Écran intro : Neo entre dans l'arène face au boss-présentateur -->
        <div class="qa-chrono-intro" id="qa-chrono-intro">
          <!-- Spots lumineux qui balayent (rotations désynchronisées) -->
          <div class="qa-chrono-spot spot-1"></div>
          <div class="qa-chrono-spot spot-2"></div>
          <div class="qa-chrono-spot spot-3"></div>

          <!-- Sol de la scène -->
          <div class="qa-chrono-arena-floor"></div>

          <!-- Boss-présentateur (centré haut) -->
          <div class="qa-chrono-arena-presenter" id="qa-chrono-arena-presenter">
            <!-- img injectée par setupPresenterSprite ; fallback emoji ci-dessous -->
            <span class="qa-chrono-arena-presenter-fallback">🎤</span>
          </div>

          <!-- Éclair central -->
          <div class="qa-chrono-arena-bolt">⚡</div>

          <!-- Neo qui arrive (centré bas) -->
          <div class="qa-chrono-arena-neo">
            <img src="img/Neo_assis.png" alt="Neo" />
          </div>

          <!-- Record perso (caché si pas encore de score) -->
          <div class="qa-chrono-intro-record" id="qa-chrono-intro-record" style="display:none;">
            <span class="qa-chrono-intro-record-icon">🏆</span>
            Record à battre : <strong id="qa-chrono-intro-record-val">0</strong> pts
            <span class="qa-chrono-intro-record-sub" id="qa-chrono-intro-record-sub"></span>
          </div>

          <!-- CTA -->
          <button class="qa-chrono-intro-btn" onclick="chronoStart()">⚡ Que le défi commence</button>
        </div>

        <!-- Écran de jeu -->
        <div class="qa-chrono-game hidden" id="qa-chrono-game">

          <!-- Horloge (ring de progression conic + chiffre central) -->
          <div class="qa-chrono-clock" id="qa-chrono-clock" style="--progress:100;">
            <div class="qa-chrono-clock-inner">
              <span class="qa-chrono-clock-num" id="qa-chrono-timer">60</span>
            </div>
          </div>

          <!-- Scène arène -->
          <div class="qa-chrono-stage">

            <!-- Présentateur (haut centre) + bulle de dialogue -->
            <div class="qa-chrono-presenter">
              <div class="qa-chrono-presenter-sprite placeholder" id="qa-chrono-presenter-sprite"></div>
              <div class="qa-chrono-bubble" id="qa-chrono-bubble"></div>
            </div>

            <!-- Thermomètre (droite, sur 2 rangs) -->
            <div class="qa-chrono-thermo" id="qa-chrono-thermo">
              <div class="qa-chrono-thermo-tube" id="qa-chrono-thermo-tube">
                <!-- Segments injectés dynamiquement selon nb questions -->
              </div>
              <div class="qa-chrono-thermo-bulb">
                <span class="qa-chrono-thermo-bulb-num" id="qa-chrono-bulb-num">0</span>
              </div>
            </div>

            <!-- Options (sous le présentateur, gauche) -->
            <div class="qa-chrono-opts" id="qa-chrono-opts"></div>

          </div>

          <!-- Neo dans l'arène (sous le tout) -->
          <div class="qa-chrono-neo" id="qa-chrono-neo">
            <img src="img/Neo_assis.png" alt="Neo champion" />
          </div>

        </div>

        <!-- Écran final -->
        <div class="qa-chrono-final" id="qa-chrono-final">
          <div class="qa-chrono-confetti" id="qa-chrono-confetti"></div>
          <div class="qa-chrono-final-icon">🏆</div>
          <div class="qa-chrono-final-title" id="qa-chrono-final-title">Temps écoulé !</div>

          <!-- Banner "Nouveau record" (affiché conditionnellement) -->
          <div class="qa-chrono-record-banner" id="qa-chrono-record-banner" style="display:none;">
            <span class="qa-chrono-record-icon">🌟</span>
            <span>Nouveau Record !</span>
            <span class="qa-chrono-record-icon">🌟</span>
          </div>

          <div class="qa-chrono-final-sub" id="qa-chrono-final-sub"></div>
          <div class="qa-chrono-final-counter-label">Score final</div>
          <div class="qa-chrono-final-counter" id="qa-chrono-final-counter">0</div>
          <div class="qa-chrono-final-stats">
            <div class="qa-chrono-final-stat" data-stat="bonnes">
              <div class="qa-chrono-final-stat-icon">✓</div>
              <div class="qa-chrono-final-stat-label">Bonnes</div>
              <div class="qa-chrono-final-stat-val" id="qa-chrono-final-count">0</div>
            </div>
            <div class="qa-chrono-final-stat" data-stat="palier">
              <div class="qa-chrono-final-stat-icon">🌡️</div>
              <div class="qa-chrono-final-stat-label">Palier max</div>
              <div class="qa-chrono-final-stat-val" id="qa-chrono-final-palier">0</div>
            </div>
            <div class="qa-chrono-final-stat" data-stat="xp">
              <div class="qa-chrono-final-stat-icon">✨</div>
              <div class="qa-chrono-final-stat-label">XP gagnée</div>
              <div class="qa-chrono-final-stat-val" id="qa-chrono-final-xp">0</div>
            </div>
            <div class="qa-chrono-final-stat" data-stat="or">
              <div class="qa-chrono-final-stat-icon">🪙</div>
              <div class="qa-chrono-final-stat-label">Or bonus</div>
              <div class="qa-chrono-final-stat-val" id="qa-chrono-final-gold">0</div>
            </div>
          </div>
          <div class="qa-chrono-final-actions">
            <button class="qa-chrono-final-btn" onclick="chronoRestart()">↺ Rejouer</button>
            <button class="qa-chrono-final-btn primary" onclick="chronoFinish()">✓ Terminer</button>
          </div>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(el);
})();
