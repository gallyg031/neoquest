// ── Modal Quiz — structure DOM "Arène de Vérité" (combat 40/60 fullscreen) ──
// Les IDs sont consommés par quest-quiz.js. À NE PAS RENOMMER sans mettre à jour ce fichier.
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes qzf-pop { 0% { transform: scale(0.55); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes qzf-slide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes qzf-record-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.55); } 50% { box-shadow: 0 0 0 10px rgba(250,204,21,0); } }
    @keyframes qzf-neo-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    .qzf-wrap { display:flex; flex-direction:column; align-items:center; padding:0.25rem 0 0.5rem; animation: qzf-slide 0.35s ease-out; }
    .qzf-neo { animation: qzf-pop 0.45s ease-out, qzf-neo-float 3s ease-in-out 0.5s infinite; margin-bottom:0.45rem; }
    .qzf-neo img { width:82px; height:82px; object-fit:contain; }
    .qzf-title { font-weight:900; font-size:1.3rem; margin-bottom:0.85rem; animation: qzf-slide 0.45s ease-out 0.1s both; text-align:center; }
    .qzf-ring-wrap { position:relative; width:160px; height:160px; margin-bottom:0.55rem; animation: qzf-pop 0.5s ease-out 0.15s both; }
    .qzf-ring-svg { transform: rotate(-90deg); }
    .qzf-ring-bg { fill:none; stroke:rgba(255,255,255,0.07); stroke-width:11; }
    .qzf-ring-fg { fill:none; stroke-width:11; stroke-linecap:round; transition: stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1); filter: drop-shadow(0 0 6px currentColor); }
    .qzf-ring-inner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .qzf-score { font-weight:900; font-size:2.3rem; line-height:1; }
    .qzf-pts-label { font-size:0.66rem; color:#94a3b8; font-weight:800; margin-top:0.25rem; letter-spacing:0.08em; }
    .qzf-stars { display:flex; gap:0.4rem; margin-bottom:0.95rem; font-size:1.5rem; }
    .qzf-stars span { animation: qzf-pop 0.45s ease-out both; display:inline-block; }
    .qzf-record { background:linear-gradient(135deg, rgba(250,204,21,0.2), rgba(251,146,60,0.14)); border:1px solid rgba(250,204,21,0.45); border-radius:999px; padding:0.42rem 1.1rem; margin-bottom:0.85rem; font-size:0.82rem; font-weight:900; color:#fbbf24; animation: qzf-record-pulse 1.6s ease-in-out infinite, qzf-pop 0.45s ease-out 0.4s both; }
    .qzf-breakdown { display:flex; gap:0.5rem; margin-bottom:0.95rem; flex-wrap:wrap; justify-content:center; animation: qzf-slide 0.4s ease-out 0.5s both; }
    .qzf-pill { background:rgba(255,255,255,0.04); border:1px solid; border-radius:999px; padding:0.32rem 0.75rem; font-size:0.78rem; font-weight:800; }
    .qzf-best { font-size:0.85rem; color:#94a3b8; font-weight:700; margin-bottom:1rem; animation: qzf-slide 0.4s ease-out 0.55s both; }
    .qzf-best strong { color:#fbbf24; font-weight:900; }
    .qzf-btns { display:flex; gap:0.6rem; width:100%; animation: qzf-slide 0.4s ease-out 0.6s both; }
    .qzf-btn { flex:1; border-radius:0.85rem; padding:0.78rem 0.8rem; font-weight:800; font-size:0.92rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:transform 0.18s, background 0.18s, box-shadow 0.18s; border:1px solid; }
    .qzf-btn:hover { transform:translateY(-2px); }
    .qzf-btn-restart { background:rgba(34,211,238,0.08); border-color:rgba(34,211,238,0.4); color:#22d3ee; }
    .qzf-btn-restart:hover { background:rgba(34,211,238,0.18); box-shadow:0 6px 20px -6px rgba(34,211,238,0.4); }
    .qzf-btn-back { background:linear-gradient(135deg, rgba(168,85,247,0.22), rgba(139,92,246,0.16)); border-color:rgba(168,85,247,0.5); color:#ddd6fe; }
    .qzf-btn-back:hover { background:linear-gradient(135deg, rgba(168,85,247,0.34), rgba(139,92,246,0.24)); box-shadow:0 6px 20px -6px rgba(168,85,247,0.5); }
    .qzf-btn-revision { background:rgba(251,191,36,0.08); border-color:rgba(251,191,36,0.4); color:#fbbf24; width:100%; margin-top:0.45rem; }
    .qzf-btn-revision:hover { background:rgba(251,191,36,0.18); box-shadow:0 6px 20px -6px rgba(251,191,36,0.4); }
    .qa-prog-fill { background:#22d3ee; transition: background 0.3s ease; }
    .qa-prog-fill.prog-facile { background:#22d3ee; }
    .qa-prog-fill.prog-medium { background:#c084fc; }
    .qa-prog-fill.prog-hard { background:#f472b6; }
  `;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay combat-mode" id="qa-modal-quiz">
      <div class="combat-shell" id="qa-combat-shell">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>

        <!-- ── SCÈNE (haut, 40%) ── -->
        <div class="combat-stage" id="qa-combat-stage">
          <div class="combat-stage-bg-img"></div>
          <div class="combat-vignette"></div>
          <div class="combat-fog combat-fog-left"  id="qa-combat-fog-left"></div>
          <div class="combat-fog combat-fog-right" id="qa-combat-fog-right"></div>

          <!-- HUD : nom Neo + compteur Éclats à gauche / nom Boss + PV à droite -->
          <div class="combat-hud">
            <div class="combat-hud-side combat-hud-side-left">
              <div class="combat-hud-name combat-hud-name-neo">Neo</div>
              <div class="combat-eclat-counter">
                <span class="combat-eclat-icon">✦</span>
                <span id="qa-combat-eclat-num">0</span>
                <span class="combat-eclat-label">Éclats de Savoir</span>
              </div>
              <div class="combat-hearts" id="qa-combat-hearts" aria-label="Cœurs de Neo"></div>
            </div>
            <div class="combat-hud-side combat-hud-side-right">
              <div class="combat-hud-name combat-hud-name-boss" id="qa-combat-boss-name">…</div>
              <div class="combat-hp-bar"><div class="combat-hp-fill" id="qa-combat-hp-fill" style="width:100%"></div></div>
              <div class="combat-hp-num"><span id="qa-combat-hp-num">100</span> / <span id="qa-combat-hp-max">100</span> PV</div>
            </div>
          </div>

          <!-- Acteurs : Neo + sa lanterne (groupés) à gauche, Boss à droite -->
          <div class="combat-actors">
            <div class="combat-actors-left">
              <div class="combat-lantern-near" id="qa-combat-lantern-slot"></div>
              <div class="combat-sprite combat-sprite-neo" id="qa-combat-sprite-neo">🧑‍🎓</div>
            </div>
            <div class="combat-sprite combat-sprite-boss" id="qa-combat-sprite-boss">👹</div>
          </div>
        </div>

        <!-- ── GRIMOIRE (bas, hauteur naturelle — quiz centré pleine largeur) ── -->
        <div class="combat-grimoire">
          <div class="combat-grimoire-inner">
            <div class="combat-grimoire-quiz">
              <div id="qa-quiz-header-prog" class="qa-quiz-prog-row" style="margin-bottom:0.7rem;">
                <div class="qa-quiz-timer" id="qa-quiz-timer" aria-label="Temps restant">
                  <svg viewBox="0 0 52 52" aria-hidden="true">
                    <g class="qtimer-notches">
                      <line x1="26" y1="2"  x2="26" y2="5"  stroke-width="1.2"/>
                      <line x1="50" y1="26" x2="47" y2="26" stroke-width="1.2"/>
                      <line x1="26" y1="50" x2="26" y2="47" stroke-width="1.2"/>
                      <line x1="2"  y1="26" x2="5"  y2="26" stroke-width="1.2"/>
                    </g>
                    <circle class="qtimer-bg"  cx="26" cy="26" r="21"/>
                    <circle class="qtimer-arc" id="qa-quiz-timer-arc" cx="26" cy="26" r="21"/>
                  </svg>
                  <div class="qtimer-num" id="qa-quiz-timer-num">15</div>
                </div>
                <div class="qa-quiz-prog-stack">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;font-size:0.75rem;font-weight:700;">
                    <span id="qa-quiz-progress-num" style="color:#cbd5e1;letter-spacing:0.04em;">Question <strong id="qa-quiz-prog-current" style="color:#fff;">1</strong> / <span id="qa-quiz-prog-total">12</span> · <span id="qa-quiz-prog-diff" style="color:#22d3ee;text-transform:uppercase;letter-spacing:0.06em;font-size:0.7rem;">facile</span></span>
                    <span id="qa-quiz-streak-badge" class="hidden"></span>
                  </div>
                  <div class="annale-tally" aria-live="polite">
                    <span class="tally-item tally-item--dmg"    id="qa-tally-dmg"><b>−10</b><em>pv au Gardien</em></span>
                    <span class="tally-sep">⟡</span>
                    <span class="tally-item tally-item--xp"     id="qa-tally-xp"><b>+25</b><em>xp</em></span>
                    <span class="tally-sep">⟡</span>
                    <span class="tally-item tally-item--streak" id="qa-tally-streak"><b>×3</b><em>streak</em></span>
                  </div>
                  <div class="qa-prog-track"><div class="qa-prog-fill prog-facile" id="qa-quiz-prog-bar" style="width:0%"></div></div>
                </div>
              </div>
              <div id="qa-quiz-content">
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.5rem;margin-bottom:0.75rem;">
                  <button id="qa-hint-btn" onclick="showHint()" title="Indice de Neo" style="display:flex;align-items:center;gap:0.4rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:9999px;padding:0.3rem 0.8rem;color:#fbbf24;font-weight:800;font-size:0.8rem;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;">💡 Indice</button>
                </div>
                <div id="qa-hint-box" class="hidden" style="margin-bottom:0.7rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:0.85rem;padding:0.6rem 0.8rem;display:flex;align-items:center;gap:0.6rem;">
                  <img src="img/Neo_assis.png" alt="Neo" style="width:40px;height:40px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 0 8px #fbbf24);" />
                  <p id="qa-hint-text" style="color:#fde68a;font-size:0.88rem;line-height:1.45;flex:1;"></p>
                </div>
                <div id="qa-quiz-grim-page" data-face="question">
                  <!-- Face A : QUESTION -->
                  <div class="grim-face grim-face--question">
                    <p id="qa-quiz-question" style="font-weight:900;font-size:1.15rem;color:#fff;margin-bottom:0.85rem;line-height:1.4;"></p>
                    <div id="qa-quiz-choix" style="display:flex;flex-direction:column;gap:0.5rem;position:relative;"></div>
                  </div>
                  <!-- Face B : ANNALE RÉVÉLÉE (feedback explicatif) -->
                  <div class="grim-face grim-face--annale" aria-live="polite">
                    <div class="annale-head">
                      <span class="annale-seal" id="qa-annale-seal" data-result="correct" aria-hidden="true">
                        <svg viewBox="0 0 40 40">
                          <circle class="annale-seal-disk" cx="20" cy="20" r="17"/>
                          <path class="annale-seal-mark annale-seal-mark--check" d="M 12 21 L 18 27 L 29 14" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                          <path class="annale-seal-mark annale-seal-mark--cross" d="M 13 13 L 27 27 M 27 13 L 13 27" fill="none" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                      </span>
                      <div class="annale-verdict">
                        <span class="annale-answer" id="qa-annale-answer"></span>
                        <span class="annale-yours"  id="qa-annale-yours" hidden>Tu avais répondu&nbsp;<b></b></span>
                      </div>
                    </div>
                    <div class="annale-divider"><span></span></div>
                    <p class="annale-body" id="qa-annale-body"></p>
                    <div class="annale-foot">
                      <button class="annale-next" id="qa-annale-next" type="button">
                        <span>Continuer</span>
                        <span class="annale-next-arrow" aria-hidden="true">→</span>
                        <span class="annale-next-hint"><kbd>Espace</kbd></span>
                      </button>
                    </div>
                  </div>
                </div>
                <div id="qa-quiz-feedback" class="hidden"></div>
                <!-- Bouton "suivant" — caché par défaut (annale gère le clic). Utilisé en Finish Him et fallback. -->
                <div style="margin-top:0.75rem;display:flex;gap:0.75rem;">
                  <button id="qa-quiz-next-btn" class="btn-quiz-nav qz-pending" onclick="quizNext()">Question suivante →</button>
                </div>
              </div>
              <div id="qa-quiz-final" class="hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
})();
