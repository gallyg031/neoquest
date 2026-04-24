// Modale de quête — vidéo, flashcards, quiz
// Expose : window.openQuestActivity(chap, niveau, mat, tab), window.closeQuestActivity()
// Déclenche : window.addEventListener('questActivityCompleted', e => { e.detail = {chapId, type} })
(function() {
  'use strict';

  // ═══════════════════ CSS INJECTION ═══════════════════
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay full-screen pour toutes les modales d'activité */
    .qa-overlay { position:fixed; inset:0; z-index:900; display:none; padding:1rem; overflow-y:auto; align-items:center; justify-content:center; }
    .qa-overlay.active { display:flex; }
    .qa-overlay::before { content:''; position:absolute; inset:0; background:rgba(8,6,26,0.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
    .qa-close { position:absolute; top:1rem; right:1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:50%; width:40px; height:40px; color:#94a3b8; cursor:pointer; font-size:1.2rem; display:flex; align-items:center; justify-content:center; transition:all 0.2s; z-index:2; }
    .qa-close:hover { background:rgba(255,255,255,0.12); color:#fff; }

    /* Vidéo */
    .qa-video-box { position:relative; z-index:1; max-width:900px; width:100%; margin:auto; background:rgba(15,10,30,0.9); backdrop-filter:blur(30px); border:1.5px solid rgba(168,85,247,0.35); border-radius:1.5rem; padding:1.5rem; box-shadow:0 0 60px rgba(168,85,247,0.2); }
    .qa-video-title { font-weight:900; font-size:1.1rem; color:#fff; margin-bottom:1rem; display:flex; align-items:center; gap:0.6rem; padding-right:3rem; }
    .video-wrapper { position:relative; padding-bottom:56.25%; height:0; border-radius:0.75rem; overflow:hidden; }
    .video-wrapper iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
    .qa-video-pdf { margin-top:1rem; text-align:center; }
    .btn-download { display:inline-flex; align-items:center; gap:0.6rem; background:linear-gradient(135deg,#7c3aed,#06b6d4); border-radius:9999px; padding:0.85rem 2rem; font-weight:800; color:#fff; box-shadow:0 0 20px rgba(124,58,237,0.4); transition:transform 0.2s,box-shadow 0.2s; text-decoration:none; font-size:1rem; border:none; cursor:pointer; font-family:'Nunito',sans-serif; }
    .btn-download:hover { transform:scale(1.05); box-shadow:0 0 35px rgba(124,58,237,0.6); }

    /* Flashcards */
    .fc-wrapper { position:relative; width:100%; }
    .fc-stack { position:relative; width:100%; height:220px; margin-bottom:1rem; }
    .fc-stack::before, .fc-stack::after {
      content:''; position:absolute; inset:0;
      border-radius:1.1rem; border:1px solid rgba(34,211,238,0.2);
      background:rgba(255,255,255,0.02);
    }
    .fc-stack::before { transform:rotate(-2.5deg) translateY(6px); z-index:1; }
    .fc-stack::after  { transform:rotate(1.5deg)  translateY(3px); z-index:2; }
    .fc-scene { position:absolute; inset:0; z-index:3; perspective:1200px; }
    .fc-card {
      width:100%; height:100%;
      position:relative;
      transform-style:preserve-3d;
      -webkit-transform-style:preserve-3d;
      transition:transform 0.65s cubic-bezier(.4,0,.2,1);
      cursor:pointer;
      border-radius:1.1rem;
    }
    .fc-card.flipped { transform:rotateY(180deg); }
    .fc-face {
      position:absolute; inset:0;
      border-radius:1.1rem;
      backface-visibility:hidden;
      -webkit-backface-visibility:hidden;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      padding:1.5rem; text-align:center;
    }
    .fc-front {
      background:rgba(168,85,247,0.08);
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      border:1.5px solid rgba(168,85,247,0.45);
      box-shadow:0 0 30px rgba(168,85,247,0.15), inset 0 0 20px rgba(168,85,247,0.05);
    }
    .fc-back {
      background:rgba(34,211,238,0.08);
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
      border:1.5px solid rgba(34,211,238,0.5);
      box-shadow:0 0 30px rgba(34,211,238,0.18), inset 0 0 20px rgba(34,211,238,0.05);
      transform:rotateY(180deg);
      -webkit-transform:rotateY(180deg);
    }
    .fc-label { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.6rem; }
    .fc-front .fc-label { color:#c084fc; }
    .fc-back  .fc-label { color:#22d3ee; }
    .fc-text  { font-size:1.05rem; font-weight:800; color:#fff; line-height:1.5; }
    .fc-hint  { font-size:0.72rem; color:#64748b; margin-top:0.6rem; }
    .fc-actions { display:none; gap:0.75rem; justify-content:center; margin-top:0.75rem; }
    .fc-actions.visible { display:flex; }
    .fc-btn-revoir { flex:1; max-width:160px; padding:0.7rem 1rem; border-radius:9999px; background:rgba(244,114,182,0.12); border:1.5px solid rgba(244,114,182,0.5); color:#f472b6; font-weight:800; font-size:0.9rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
    .fc-btn-revoir:hover  { background:rgba(244,114,182,0.22); box-shadow:0 0 16px rgba(244,114,182,0.3); }
    .fc-btn-acquis  { flex:1; max-width:160px; padding:0.7rem 1rem; border-radius:9999px; background:rgba(34,211,238,0.12); border:1.5px solid rgba(34,211,238,0.5); color:#22d3ee; font-weight:800; font-size:0.9rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
    .fc-btn-acquis:hover  { background:rgba(34,211,238,0.22); box-shadow:0 0 16px rgba(34,211,238,0.3); }
    .fc-complete { text-align:center; padding:2rem 1rem; display:none; }
    .fc-complete.visible { display:block; }
    @keyframes fcSlideOut { 0%{transform:translateX(0) rotate(0) scale(1);opacity:1} 100%{transform:translateX(120%) rotate(15deg) scale(0.8);opacity:0} }
    @keyframes fcSlideBack { 0%{transform:translateX(0) rotate(0) scale(1);opacity:1} 100%{transform:translateX(-120%) rotate(-10deg) scale(0.8);opacity:0} }
    .fc-card.exit-right { animation:fcSlideOut 0.35s ease forwards; }
    .fc-card.exit-left  { animation:fcSlideBack 0.35s ease forwards; }

    /* Quiz */
    .quiz-opt { width:100%; text-align:left; padding:0.9rem 1.2rem; border-radius:0.75rem; background:rgba(255,255,255,0.04); border:2px solid rgba(168,85,247,0.15); color:#e2e8f0; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s; font-family:'Nunito',sans-serif; }
    .quiz-opt:hover:not(:disabled) { background:rgba(168,85,247,0.12); border-color:rgba(168,85,247,0.5); }
    .quiz-opt.correct { background:rgba(34,211,238,0.18); border:2px solid #22d3ee; color:#e2e8f0; font-weight:800; }
    .quiz-opt.correct::before { content:'✓  '; color:#22d3ee; }
    .quiz-opt.wrong   { background:rgba(244,114,182,0.18); border:2px solid #f472b6; color:#e2e8f0; font-weight:800; }
    .quiz-opt.wrong::before   { content:'✗  '; color:#f472b6; }
    .quiz-opt.muted   { opacity:0.35; }
    .btn-quiz-nav { background:rgba(168,85,247,0.15); border:1px solid rgba(168,85,247,0.35); border-radius:9999px; padding:0.6rem 1.4rem; color:#c4b5fd; font-weight:800; cursor:pointer; transition:all 0.2s; font-family:'Nunito',sans-serif; font-size:0.9rem; }
    .btn-quiz-nav:hover { background:rgba(168,85,247,0.3); color:#fff; }
    .qa-prog-track { background:rgba(255,255,255,0.08); border-radius:9999px; height:10px; overflow:hidden; }
    .qa-prog-fill { height:100%; border-radius:9999px; background:linear-gradient(90deg,#a855f7,#22d3ee); transition:width 0.6s cubic-bezier(.4,0,.2,1); }
    .diff-badge   { display:inline-flex; align-items:center; gap:0.3rem; border-radius:9999px; padding:0.25rem 0.7rem; font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; }
    .diff-facile  { background:rgba(34,211,238,0.12);  border:1px solid #22d3ee55; color:#22d3ee; }
    .diff-medium  { background:rgba(168,85,247,0.12);  border:1px solid #a855f755; color:#c084fc; }
    .diff-hard    { background:rgba(244,114,182,0.12); border:1px solid #f472b655; color:#f472b6; }
    @keyframes pointsPop { 0%{transform:scale(0.5) translateY(0);opacity:0} 40%{transform:scale(1.3) translateY(-10px);opacity:1} 100%{transform:scale(1) translateY(-24px);opacity:0} }
    .points-pop { position:absolute; right:1rem; top:0; font-weight:900; font-size:1.1rem; pointer-events:none; animation:pointsPop 1s ease forwards; }

    /* Neo feedback */
    @keyframes neoIn { 0%{transform:scale(0.4) translateY(20px);opacity:0} 70%{transform:scale(1.1) translateY(-4px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
    .neo-feedback { display:flex; align-items:flex-end; gap:1rem; padding:1rem; border-radius:1rem; margin-top:1rem; }
    .neo-feedback.ok  { background:rgba(34,211,238,0.07);  border:1px solid #22d3ee33; }
    .neo-feedback.ko  { background:rgba(244,114,182,0.07); border:1px solid #f472b633; }
    .neo-feedback img { width:64px; height:64px; object-fit:contain; animation:neoIn 0.5s cubic-bezier(.4,0,.2,1) forwards; flex-shrink:0; }
    .neo-feedback-text { flex:1; }
    .neo-feedback-title { font-weight:900; font-size:1rem; margin-bottom:0.3rem; }
    .neo-feedback-title.ok { color:#22d3ee; }
    .neo-feedback-title.ko { color:#f472b6; }
    .neo-feedback-expl { font-size:0.88rem; color:#cbd5e1; line-height:1.5; }
    .neo-feedback-answer { display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.4rem; background:rgba(34,211,238,0.1); border:1px solid #22d3ee44; border-radius:0.5rem; padding:0.3rem 0.7rem; font-size:0.82rem; font-weight:700; color:#22d3ee; }

    /* Streak */
    @keyframes streakPop { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.3);opacity:1} 100%{transform:scale(1);opacity:1} }
    .streak-badge { display:inline-flex; align-items:center; gap:0.3rem; background:rgba(251,146,60,0.15); border:1px solid rgba(251,146,60,0.4); border-radius:9999px; padding:0.2rem 0.65rem; font-size:0.78rem; font-weight:900; color:#fb923c; animation:streakPop 0.4s ease forwards; }

    /* Slide transition quiz */
    @keyframes qslideIn  { from{transform:translateX(50px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes qslideOut { from{transform:translateX(0);opacity:1}    to{transform:translateX(-50px);opacity:0} }
    .quiz-slide-in  { animation:qslideIn  0.28s cubic-bezier(.4,0,.2,1) forwards; }
    .quiz-slide-out { animation:qslideOut 0.22s cubic-bezier(.4,0,.2,1) forwards; pointer-events:none; }

    .hidden { display:none !important; }
  `;
  document.head.appendChild(style);

  // ═══════════════════ HTML INJECTION ═══════════════════
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <!-- MODAL VIDÉO -->
    <div class="qa-overlay" id="qa-modal-video">
      <button class="qa-close" onclick="closeQuestActivity()">✕</button>
      <div class="qa-video-box">
        <div class="qa-video-title">🎬 <span id="qa-video-chap-name"></span></div>
        <div style="padding:3px;border-radius:0.9rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);box-shadow:0 0 40px rgba(124,58,237,0.3);">
          <div style="border-radius:0.75rem;overflow:hidden;background:#08061a;">
            <div class="video-wrapper">
              <iframe id="qa-yt-frame" src="" title="Vidéo NeoQuest" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
              <div id="qa-yt-fallback" style="display:none;position:absolute;inset:0;background:rgba(8,6,26,0.95);flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;text-align:center;">
                <div style="font-size:2.5rem;">🎬</div>
                <p style="color:#94a3b8;font-size:0.9rem;max-width:280px;line-height:1.6;">La vidéo ne peut pas être lue ici.<br/>Regarde-la directement sur YouTube.</p>
                <a id="qa-yt-fallback-link" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.6rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:9999px;padding:0.75rem 1.8rem;font-weight:800;color:#fff;text-decoration:none;font-size:0.95rem;font-family:'Nunito',sans-serif;">▶ Voir sur YouTube</a>
              </div>
            </div>
          </div>
        </div>
        <div class="qa-video-pdf">
          <a id="qa-pdf-link" href="#" class="btn-download" download>
            <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Télécharger la fiche PDF
          </a>
        </div>
      </div>
    </div>

    <!-- MODAL FLASHCARDS -->
    <div class="qa-overlay" id="qa-modal-fc">
      <div style="position:relative;z-index:1;max-width:560px;width:100%;margin:auto;background:rgba(18,12,40,0.85);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1.5px solid rgba(168,85,247,0.35);border-radius:1.5rem;padding:1.5rem;box-shadow:0 0 60px rgba(168,85,247,0.2),0 0 120px rgba(168,85,247,0.08);">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;padding-right:3rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <img src="favicon2.png" style="width:22px;height:22px;object-fit:contain;" />
            <span style="font-weight:900;font-size:1rem;color:#fff;">Neo-Flash</span>
            <span id="qa-fc-mastered" style="font-size:0.75rem;font-weight:700;color:#22d3ee;"></span>
          </div>
          <button onclick="reshuffleFC()" style="display:inline-flex;align-items:center;gap:0.35rem;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25);border-radius:8px;padding:0.3rem 0.75rem;font-size:0.75rem;font-weight:700;color:#a78bfa;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;">↺ Nouvelle pile</button>
        </div>
        <div class="fc-wrapper">
          <div id="qa-fc-indice-bar" style="margin-bottom:0.6rem;min-height:2rem;">
            <button id="qa-fc-indice-btn" onclick="showFCIndice()" style="display:none;align-items:center;gap:0.4rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:9999px;padding:0.25rem 0.9rem;font-size:0.78rem;font-weight:700;color:#fbbf24;cursor:pointer;font-family:'Nunito',sans-serif;">💡 Indice</button>
            <div id="qa-fc-indice-text" style="display:none;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:0.6rem;padding:0.5rem 0.8rem;font-size:0.82rem;color:#fde68a;line-height:1.5;"></div>
          </div>
          <div class="fc-stack" id="qa-fc-stack">
            <div class="fc-scene">
              <div class="fc-card" id="qa-fc-card">
                <div class="fc-face fc-front">
                  <div class="fc-label">Question</div>
                  <div class="fc-text" id="qa-fc-question"></div>
                  <div class="fc-hint" id="qa-fc-swipe-hint" style="font-size:0.72rem;color:#475569;margin-top:0.6rem;">Clique pour voir la réponse</div>
                </div>
                <div class="fc-face fc-back">
                  <div class="fc-label">Réponse</div>
                  <div class="fc-text" id="qa-fc-reponse"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-actions" id="qa-fc-actions">
            <button class="fc-btn-revoir" onclick="fcRevoir()">← À revoir</button>
            <button class="fc-btn-acquis" onclick="fcAcquis()">Acquis ! →</button>
          </div>
          <div class="fc-complete" id="qa-fc-complete">
            <div style="font-size:3.5rem;margin-bottom:0.5rem;">🎉</div>
            <p style="font-weight:900;font-size:1.3rem;color:#22d3ee;margin-bottom:0.3rem;">Pile maîtrisée !</p>
            <p style="color:#64748b;font-size:0.9rem;margin-bottom:1.5rem;">Tu as acquis toutes les cartes de cette session.</p>
            <button onclick="reshuffleFC()" style="display:inline-flex;align-items:center;gap:0.5rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);border:none;border-radius:9999px;padding:0.75rem 1.8rem;font-weight:800;color:#fff;font-size:0.95rem;cursor:pointer;font-family:'Nunito',sans-serif;">↺ Nouvelle pile</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL QUIZ -->
    <div class="qa-overlay" id="qa-modal-quiz">
      <div style="position:relative;z-index:1;max-width:560px;width:100%;margin:auto;background:rgba(12,18,40,0.85);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1.5px solid rgba(34,211,238,0.3);border-radius:1.5rem;padding:1.5rem;box-shadow:0 0 60px rgba(34,211,238,0.15),0 0 120px rgba(34,211,238,0.06);">
        <button class="qa-close" onclick="closeQuestActivity()">✕</button>
        <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;padding-right:3rem;">
          <div style="width:32px;height:32px;border-radius:8px;background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.4);display:flex;align-items:center;justify-content:center;">❓</div>
          <span style="font-weight:900;font-size:1rem;color:#fff;">Quiz — <span id="qa-quiz-chap-name"></span></span>
        </div>
        <p id="qa-quiz-bank-info" style="color:#64748b;font-size:0.78rem;font-weight:700;margin-bottom:1rem;"></p>
        <div style="margin-bottom:1.25rem;">
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">
            <span style="color:#94a3b8;" id="qa-quiz-prog-label">Question 1 / 12</span>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span id="qa-quiz-streak-badge" class="hidden"></span>
              <span id="qa-quiz-pts-label" style="color:#fbbf24;">0 pts</span>
            </div>
          </div>
          <div class="qa-prog-track"><div class="qa-prog-fill" id="qa-quiz-prog-bar" style="width:0%"></div></div>
          <div style="display:flex;justify-content:space-between;margin-top:3px;">
            <span style="font-size:10px;color:#22d3ee;font-weight:700;">Facile</span>
            <span style="font-size:10px;color:#c084fc;font-weight:700;">Medium</span>
            <span style="font-size:10px;color:#f472b6;font-weight:700;">Hard</span>
          </div>
        </div>
        <div id="qa-quiz-content">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span id="qa-quiz-diff-badge" class="diff-badge diff-facile">⭐ Facile</span>
              <span id="qa-quiz-pts-badge" class="diff-badge" style="background:rgba(250,204,21,0.1);border-color:#fbbf2444;color:#fbbf24;">+10 pts</span>
            </div>
            <button id="qa-hint-btn" onclick="showHint()" title="Indice de Neo" style="display:flex;align-items:center;gap:0.4rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.35);border-radius:9999px;padding:0.3rem 0.8rem;color:#fbbf24;font-weight:800;font-size:0.8rem;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;">💡 Indice</button>
          </div>
          <div id="qa-hint-box" class="hidden" style="margin-bottom:1rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:0.85rem;padding:0.85rem 1rem;display:flex;align-items:flex-start;gap:0.75rem;">
            <img src="img/Neo_assis.png" alt="Neo" style="width:44px;height:44px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 0 8px #fbbf24);" />
            <div>
              <p style="font-weight:900;color:#fbbf24;font-size:0.82rem;margin-bottom:0.25rem;">💡 Petit rappel de Neo :</p>
              <p id="qa-hint-text" style="color:#fde68a;font-size:0.88rem;line-height:1.5;"></p>
              <p style="color:#92400e;font-size:0.72rem;margin-top:0.35rem;font-weight:700;">⚠️ Points divisés par 2 si bonne réponse</p>
            </div>
          </div>
          <p id="qa-quiz-q-num" style="font-size:0.72rem;color:#a855f7;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;"></p>
          <p id="qa-quiz-question" style="font-weight:900;font-size:1.2rem;color:#fff;margin-bottom:1.25rem;line-height:1.5;"></p>
          <div id="qa-quiz-choix" style="display:flex;flex-direction:column;gap:0.75rem;position:relative;"></div>
          <div id="qa-quiz-feedback" class="hidden"></div>
          <div style="margin-top:1rem;display:flex;gap:0.75rem;">
            <button id="qa-quiz-next-btn" class="btn-quiz-nav hidden" onclick="quizNext()">Question suivante →</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // ═══════════════════ STATE ═══════════════════
  let currentChap = null, currentNiveau = null, currentMat = null;
  let chapitreId = null, matiereId = null;
  let DIFF_LABELS = {facile:'⭐ Facile',medium:'🔥 Medium',hard:'💀 Hard'};
  const DIFF_POINTS = {facile:10,medium:30,hard:50};
  const DIFF_CLASS  = {facile:'diff-facile',medium:'diff-medium',hard:'diff-hard'};
  const MAX_PTS     = 3*10+6*30+3*50;
  const QUIZ_SIZE   = 12;
  const FC_SIZE     = 10;

  let fcPile=[], fcAcquises=0, fcTotal=0, fcFlipped=false, fcAllCards=[];
  let allQuestions=[], quizData=[], quizIndex=0, quizPts=0, quizAnswered=false, quizHistory=[], hintUsed=false, streak=0, isRevisionMode=false;
  let fcDragAttached = false;

  // ═══════════════════ HELPERS ═══════════════════
  function getAudio(){return window.nqAudio ? window.nqAudio.get() : new (window.AudioContext||window.webkitAudioContext)();}
  function playTone(freq,type,duration,volume=0.18,delay=0) {
    try { const ctx=getAudio(),o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g);g.connect(ctx.destination);
      o.type=type;o.frequency.value=freq; const t=ctx.currentTime+delay;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+duration);
      o.start(t);o.stop(t+duration); } catch(e) {}
  }
  function soundCorrect() { playTone(523,'sine',0.12,0.15);playTone(659,'sine',0.12,0.15,0.1);playTone(784,'sine',0.18,0.15,0.2); }
  function soundWrong()   { playTone(220,'sawtooth',0.18,0.12);playTone(180,'sawtooth',0.22,0.12,0.15); }
  function soundFlip()    { try { const ctx=getAudio(),o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g);g.connect(ctx.destination);
    o.type='sine';o.frequency.setValueAtTime(600,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(300,ctx.currentTime+0.12);
    g.gain.setValueAtTime(0.08,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
    o.start();o.stop(ctx.currentTime+0.18); } catch(e) {} }

  function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

  // ═══════════════════ LOCALSTORAGE ═══════════════════
  function getProgress() { try { return JSON.parse(localStorage.getItem('neoquest_progress') || '{}'); } catch { return {}; } }
  function saveProgress(p) { try { localStorage.setItem('neoquest_progress', JSON.stringify(p)); } catch {} }

  function addPts(n) {
    const p = getProgress();
    const prev = p.totalPts || 0;
    p.totalPts = prev + n;
    saveProgress(p);
    try {
      const key = `neoquest_chap_${chapitreId}`;
      const chd = JSON.parse(localStorage.getItem(key) || '{}');
      chd.pts = (chd.pts || 0) + n;
      chd.quizDone = (chd.quizDone || 0) + 1;
      localStorage.setItem(key, JSON.stringify(chd));
    } catch(e) {}
    if(typeof nqCheckLevelUp === 'function') nqCheckLevelUp(prev, p.totalPts);
    try {
      const xp2 = p.totalPts;
      const lvl2 = nqGetLevel(xp2);
      const pct2 = nqGetLevelProgress(xp2);
      const badge = document.getElementById('nav-level-badge');
      if(badge) { badge.textContent = lvl2.level; badge.style.background = lvl2.color; }
      const bar = document.getElementById('nav-xp-bar');
      if(bar) { bar.style.width = pct2 + '%'; bar.style.background = lvl2.color; }
      const title = document.getElementById('nav-level-title');
      if(title) { title.textContent = lvl2.title; title.style.color = lvl2.color; }
    } catch(e) {}
  }

  function getWeakQuestions(){try{return JSON.parse(localStorage.getItem('neoquest_weak')||'{}');}catch{return{};}}
  function recordResult(q,ok){const w=getWeakQuestions();if(!ok)w[q]=(w[q]||0)+1;else if(w[q])w[q]=Math.max(0,w[q]-1);try{localStorage.setItem('neoquest_weak',JSON.stringify(w));}catch{}}
  function weightedShuffle(questions){const weak=getWeakQuestions(),pool=[];questions.forEach(q=>{const weight=1+(weak[q.question]||0)*2;for(let i=0;i<weight;i++)pool.push(q);});return shuffle(pool);}

  function getFCWeak(){try{return JSON.parse(localStorage.getItem('neoquest_fc_weak')||'{}');}catch{return{};}}
  function saveFCWeak(w){try{localStorage.setItem('neoquest_fc_weak',JSON.stringify(w));}catch{}}
  function markFCRevoir(q){const w=getFCWeak();w[q]=(w[q]||0)+1;saveFCWeak(w);}
  function markFCAcquis(q){const w=getFCWeak();delete w[q];saveFCWeak(w);}

  // ═══════════════════ THEME (difficultés custom par chapitre) ═══════════════════
  function applyChapterTheme(chap){
    if(chap.diff_custom){
      DIFF_LABELS={facile:'⭐'+(chap.diff_custom.facile||'Facile'),medium:'🔥'+(chap.diff_custom.medium||'Medium'),hard:'💀'+(chap.diff_custom.hard||'Hard')};
    } else {
      DIFF_LABELS={facile:'⭐ Facile',medium:'🔥 Medium',hard:'💀 Hard'};
    }
  }

  // ═══════════════════ FLASHCARDS ═══════════════════
  function initFlashcards(cards){fcAllCards=cards||[];pickFCPile();}
  function pickFCPile(){
    const weak=getFCWeak();
    const sorted=[...fcAllCards].sort((a,b)=>(weak[b.question]||0)-(weak[a.question]||0));
    fcPile=sorted.slice(0,FC_SIZE);fcTotal=fcPile.length;fcAcquises=0;fcFlipped=false;
    document.getElementById('qa-fc-complete').classList.remove('visible');
    document.getElementById('qa-fc-stack').style.display='block';
    document.getElementById('qa-fc-actions').classList.remove('visible');
    renderFCCard();
  }
  function renderFCCard(){
    if(fcPile.length===0){showFCComplete();return;}
    const card=fcPile[0];const el=document.getElementById('qa-fc-card');
    el.style.transition='none';el.classList.remove('flipped','exit-right','exit-left');void el.offsetWidth;el.style.transition='';
    fcFlipped=false;document.getElementById('qa-fc-actions').classList.remove('visible');
    const ibtn=document.getElementById('qa-fc-indice-btn'),itxt=document.getElementById('qa-fc-indice-text');
    itxt.style.display='none';
    if(card.indice){ibtn.style.display='inline-flex';ibtn.disabled=false;ibtn.style.opacity='1';ibtn.textContent='💡 Indice';}
    else ibtn.style.display='none';
    document.getElementById('qa-fc-question').textContent=card.question;
    document.getElementById('qa-fc-reponse').textContent=card.reponse;
    document.getElementById('qa-fc-mastered').textContent=`✨ ${fcAcquises} / ${fcTotal}`;
  }
  function showFCIndice(){
    const card=fcPile[0];if(!card||!card.indice)return;
    document.getElementById('qa-fc-indice-text').textContent=card.indice;document.getElementById('qa-fc-indice-text').style.display='block';
    const btn=document.getElementById('qa-fc-indice-btn');btn.disabled=true;btn.style.opacity='0.45';btn.textContent='💡 Indice révélé';
  }
  function flipCard(){
    if(fcPile.length===0)return;soundFlip();
    if(typeof window.pomoActivity==='function') window.pomoActivity('flashcard');
    const el=document.getElementById('qa-fc-card');el.classList.toggle('flipped');
    fcFlipped=el.classList.contains('flipped');
    document.getElementById('qa-fc-actions').classList.toggle('visible',fcFlipped);
  }
  function fcAcquis(){markFCAcquis(fcPile[0].question);document.getElementById('qa-fc-card').classList.add('exit-right');fcAcquises++;setTimeout(()=>{fcPile.shift();renderFCCard();},340);}
  function fcRevoir(){markFCRevoir(fcPile[0].question);document.getElementById('qa-fc-card').classList.add('exit-left');setTimeout(()=>{const c=fcPile.shift();fcPile.push(c);renderFCCard();},340);}
  function showFCComplete(){
    document.getElementById('qa-fc-stack').style.display='none';
    document.getElementById('qa-fc-actions').classList.remove('visible');
    document.getElementById('qa-fc-complete').classList.add('visible');
    document.getElementById('qa-fc-mastered').textContent=`✨ ${fcAcquises} / ${fcTotal}`;
    // Marquer comme "vu" pour débloquer le quiz
    try { localStorage.setItem(`neoquest_fc_${chapitreId}`, '1'); } catch(e) {}
  }
  function reshuffleFC(){
    const card = document.getElementById('qa-fc-card');
    if(card) { card.style.transition='transform 0.3s ease, opacity 0.3s ease';card.style.transform='scale(0.85) rotateY(20deg)';card.style.opacity='0'; }
    setTimeout(()=>{
      const weak = getFCWeak();
      const withWeights = fcAllCards.map(c => ({c, w: weak[c.question]||0}));
      const strong = shuffle(withWeights.filter(x=>x.w===0)).map(x=>x.c);
      const weakCards = shuffle(withWeights.filter(x=>x.w>0).sort((a,b)=>b.w-a.w)).map(x=>x.c);
      fcPile = [...weakCards, ...strong].slice(0, FC_SIZE);
      fcTotal = fcPile.length; fcAcquises = 0; fcFlipped = false;
      document.getElementById('qa-fc-complete').classList.remove('visible');
      document.getElementById('qa-fc-stack').style.display = 'block';
      document.getElementById('qa-fc-actions').classList.remove('visible');
      if(card) { card.style.transition = ''; card.style.transform = ''; card.style.opacity = ''; }
      renderFCCard();
    }, 300);
  }

  function attachFCDragOnce() {
    if (fcDragAttached) return;
    fcDragAttached = true;
    const card = document.getElementById('qa-fc-card');
    card.addEventListener('click', flipCard);
    let tx=0, dragging=false;
    card.addEventListener('touchstart', e=>{tx=e.touches[0].clientX;dragging=false;}, {passive:true});
    card.addEventListener('touchmove', e=>{const dx=e.touches[0].clientX-tx;if(Math.abs(dx)>10){dragging=true;card.style.transform=`translateX(${dx*0.4}px) rotate(${dx*0.08}deg)`;card.style.opacity=Math.max(0.4,1-Math.abs(dx)/280);}}, {passive:true});
    card.addEventListener('touchend', e=>{const dx=e.changedTouches[0].clientX-tx;card.style.transform='';card.style.opacity='';if(!dragging)return;dragging=false;if(!fcFlipped){flipCard();return;}if(dx>60)fcAcquis();else if(dx<-60)fcRevoir();});
    let mx=0, md=false;
    card.addEventListener('mousedown', e=>{mx=e.clientX;md=false;});
    card.addEventListener('mousemove', e=>{if(e.buttons!==1)return;const dx=e.clientX-mx;if(Math.abs(dx)>10){md=true;card.style.transform=`translateX(${dx*0.3}px) rotate(${dx*0.05}deg)`;}});
    card.addEventListener('mouseup', e=>{const dx=e.clientX-mx;card.style.transform='';if(!md)return;md=false;if(!fcFlipped){flipCard();return;}if(dx>80)fcAcquis();else if(dx<-80)fcRevoir();});
  }

  // ═══════════════════ QUIZ ═══════════════════
  function initQuiz(questions){allQuestions=questions||[];isRevisionMode=false;pickAndStart();}
  function startRevisionMode(){const failed=quizHistory.filter(h=>!h.correct).map(h=>h.questionObj);if(!failed.length)return;isRevisionMode=true;allQuestions=failed;pickAndStart();}

  function pickAndStart(){
    const easy=weightedShuffle(allQuestions.filter(q=>q.difficulte==='facile'));
    const med =weightedShuffle(allQuestions.filter(q=>q.difficulte==='medium'));
    const hard=weightedShuffle(allQuestions.filter(q=>q.difficulte==='hard'));
    quizData=[...easy.slice(0,3),...med.slice(0,6),...hard.slice(0,3)];
    if(quizData.length<QUIZ_SIZE){const used=new Set(quizData.map(q=>q.question));quizData=[...quizData,...weightedShuffle(allQuestions.filter(q=>!used.has(q.question)))].slice(0,QUIZ_SIZE);}
    quizIndex=0;quizPts=0;quizAnswered=false;quizHistory=[];streak=0;
    const info=document.getElementById('qa-quiz-bank-info');
    if(info)info.textContent=isRevisionMode?`🔄 Mode révision — ${quizData.length} question${quizData.length>1?'s':''}`:(allQuestions.length>QUIZ_SIZE?`🎲 12 questions tirées parmi ${allQuestions.length} — chaque session est unique !`:`❓ ${allQuestions.length} question${allQuestions.length>1?'s':''}`);
    document.getElementById('qa-quiz-streak-badge').classList.add('hidden');
    document.getElementById('qa-quiz-content').classList.remove('hidden');
    renderQuiz();
  }

  function renderQuiz(){
    if(quizIndex>=quizData.length){showQuizFinal();return;}
    const q=quizData[quizIndex];quizAnswered=false;
    const content=document.getElementById('qa-quiz-content');
    content.classList.remove('quiz-slide-in');void content.offsetWidth;content.classList.add('quiz-slide-in');
    document.getElementById('qa-quiz-prog-bar').style.width=`${Math.round((quizIndex/quizData.length)*100)}%`;
    document.getElementById('qa-quiz-prog-label').textContent=`Question ${quizIndex+1} / ${quizData.length}`;
    document.getElementById('qa-quiz-pts-label').textContent=isRevisionMode?'Mode révision':`${quizPts} pts`;
    const diff=q.difficulte||'facile';
    const db=document.getElementById('qa-quiz-diff-badge');db.textContent=DIFF_LABELS[diff];db.className=`diff-badge ${DIFF_CLASS[diff]}`;
    document.getElementById('qa-quiz-pts-badge').style.display=isRevisionMode?'none':'inline-flex';
    document.getElementById('qa-quiz-pts-badge').textContent=`+${DIFF_POINTS[diff]} pts`;
    hintUsed=false;
    const hintBox=document.getElementById('qa-hint-box');hintBox.classList.add('hidden');
    const hintBtn=document.getElementById('qa-hint-btn');hintBtn.disabled=false;hintBtn.style.opacity='1';hintBtn.textContent='💡 Indice';
    hintBtn.style.visibility=q.indice?'visible':'hidden';
    document.getElementById('qa-quiz-q-num').textContent=`Question ${quizIndex+1} / ${quizData.length}`;
    document.getElementById('qa-quiz-question').textContent=q.question;
    document.getElementById('qa-quiz-feedback').classList.add('hidden');
    document.getElementById('qa-quiz-next-btn').classList.add('hidden');
    const choixEl=document.getElementById('qa-quiz-choix');choixEl.innerHTML='';
    q.choix.forEach((c,i)=>{const btn=document.createElement('button');btn.className='quiz-opt';btn.textContent=c;btn.onclick=()=>answer(i,q.bonne_reponse,q.difficulte||'facile');choixEl.appendChild(btn);});
  }

  function showHint(){
    const q=quizData[quizIndex];if(!q.indice||hintUsed)return;hintUsed=true;
    document.getElementById('qa-hint-text').textContent=q.indice;
    const box=document.getElementById('qa-hint-box');box.classList.remove('hidden');box.style.display='flex';
    const halved=Math.floor(DIFF_POINTS[q.difficulte||'facile']/2);
    document.getElementById('qa-quiz-pts-badge').textContent=`+${halved} pts (indice)`;
    const btn=document.getElementById('qa-hint-btn');btn.disabled=true;btn.style.opacity='0.45';btn.textContent='💡 Indice utilisé';
  }

  function answer(selected,correct,diff){
    if(quizAnswered)return;quizAnswered=true;
    const q=quizData[quizIndex];
    if(typeof window.pomoActivity==='function') window.pomoActivity('quiz');
    document.querySelectorAll('#qa-quiz-choix .quiz-opt').forEach((btn,i)=>{btn.disabled=true;if(i===correct)btn.classList.add('correct');else if(i===selected)btn.classList.add('wrong');else btn.classList.add('muted');});
    const isCorrect=selected===correct;
    const basePts=DIFF_POINTS[diff];
    const pts=isRevisionMode?0:(isCorrect?(hintUsed?Math.floor(basePts/2):basePts):0);
    recordResult(q.question,isCorrect);
    if(isCorrect){streak++;soundCorrect();}else{streak=0;soundWrong();}
    const streakEl=document.getElementById('qa-quiz-streak-badge');
    if(streak>=2){streakEl.className='streak-badge';streakEl.textContent=`🔥 ×${streak}`;streakEl.classList.remove('hidden');}else streakEl.classList.add('hidden');
    if(isCorrect&&!isRevisionMode){
      quizPts+=pts;
      const pop=document.createElement('span');pop.className='points-pop';pop.textContent=`+${pts}`;pop.style.color=diff==='hard'?'#f472b6':diff==='medium'?'#c084fc':'#22d3ee';document.getElementById('qa-quiz-choix').appendChild(pop);setTimeout(()=>pop.remove(),1000);
    }
    document.getElementById('qa-quiz-pts-label').textContent=isRevisionMode?'Mode révision':`${quizPts} pts`;
    quizHistory.push({question:q.question,questionObj:q,correct:isCorrect,pts,hintUsed,correctAnswer:q.choix[correct],diff});
    const fb=document.getElementById('qa-quiz-feedback');fb.classList.remove('hidden');
    const hintNote=(!isRevisionMode&&isCorrect&&hintUsed)?` <span style="font-size:0.78rem;color:#fbbf24;font-weight:700;">(indice : ×½)</span>`:'';
    const correctTitle=isRevisionMode?'👍 Bravo ! (mode révision — sans points)':`👍 Bravo ! +${pts} pts${hintNote}`;
    const explication=q.explication||null;
    fb.innerHTML=`<div class="neo-feedback ${isCorrect?'ok':'ko'}"><img src="img/Neo_assis.png" alt="Neo" style="${isCorrect?'filter:drop-shadow(0 0 12px #22d3ee)':'transform:scaleX(-1);filter:drop-shadow(0 0 12px #f472b6)'};" /><div class="neo-feedback-text"><div class="neo-feedback-title ${isCorrect?'ok':'ko'}">${isCorrect?correctTitle:'😬 Pas tout à fait…'}</div>${!isCorrect?`<div class="neo-feedback-answer">✅ ${q.choix[correct]}</div>`:''}${explication?`<div class="neo-feedback-expl">${explication}</div>`:''}</div></div>`;
    const nb=document.getElementById('qa-quiz-next-btn');nb.classList.remove('hidden');nb.textContent=quizIndex<quizData.length-1?'Question suivante →':'✓ Retour à la map';
    const hintBtn2=document.getElementById('qa-hint-btn');hintBtn2.disabled=true;hintBtn2.style.opacity='0.35';
  }

  function quizNext(){
    const content=document.getElementById('qa-quiz-content');
    content.classList.add('quiz-slide-out');
    setTimeout(()=>{content.classList.remove('quiz-slide-out');quizIndex++;renderQuiz();},220);
  }

  // Quiz terminé : sauvegarde pts, ferme la modale et laisse la cérémonie se jouer sur la map.
  function showQuizFinal(){
    if(!isRevisionMode){
      addPts(quizPts);
      const p=getProgress();p.quizCount=(p.quizCount||0)+1;saveProgress(p);
      try {
        const key=`neoquest_chap_${chapitreId}`;
        const chd=JSON.parse(localStorage.getItem(key)||'{}');
        if(quizPts > (chd.bestScore||0)) { chd.bestScore=quizPts; localStorage.setItem(key,JSON.stringify(chd)); }
        localStorage.setItem(`neoquest_quiz_${chapitreId}`, '1');
      } catch(e) {}
    }
    closeQuestActivity();
  }

  function quizRestart(){ pickAndStart(); }

  // ═══════════════════ API PUBLIQUE ═══════════════════
  function openQuestActivity(chap, niveau, mat, tab) {
    currentChap = chap;
    currentNiveau = niveau;
    currentMat = mat;
    chapitreId = chap.id;
    matiereId = mat?.id || null;

    applyChapterTheme(chap);

    // Marquer l'activité en cours comme "vue" pour débloquer les suivantes
    if (tab === 'video') {
      try { localStorage.setItem(`neoquest_video_${chapitreId}`, '1'); } catch(e) {}
      openVideoModal(chap);
    } else if (tab === 'flashcards') {
      initFlashcards(chap.flashcards || []);
      attachFCDragOnce();
      document.getElementById('qa-modal-fc').classList.add('active');
      document.body.style.overflow='hidden';
    } else if (tab === 'quiz') {
      initQuiz(chap.quiz || []);
      document.getElementById('qa-modal-quiz').classList.add('active');
      document.body.style.overflow='hidden';
    } else if (tab === 'chrono') {
      // Déplier le pomodoro s'il est compact
      if (typeof window.pExpand === 'function') {
        const compact = document.getElementById('p-compact');
        if (compact && compact.style.display !== 'none') window.pExpand();
      }
    }
  }

  function openVideoModal(chap) {
    document.getElementById('qa-video-chap-name').textContent = chap.nom || '';
    const ytId = chap.youtube;
    const frame = document.getElementById('qa-yt-frame');
    if (ytId) {
      frame.src = `https://www.youtube.com/embed/${ytId}?enablejsapi=1`;
      frame.style.display = 'block';
      document.getElementById('qa-yt-fallback').style.display = 'none';
      document.getElementById('qa-yt-fallback-link').href = `https://www.youtube.com/watch?v=${ytId}`;
    }
    if (chap.pdf) {
      document.getElementById('qa-pdf-link').href = chap.pdf;
      document.getElementById('qa-pdf-link').style.display = 'inline-flex';
    } else {
      document.getElementById('qa-pdf-link').style.display = 'none';
    }
    // Activité pomodoro au clic sur la vidéo
    frame.parentElement.onclick = () => { if (typeof window.pomoActivity === 'function') window.pomoActivity('video'); };
    document.getElementById('qa-modal-video').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuestActivity() {
    document.getElementById('qa-modal-video').classList.remove('active');
    document.getElementById('qa-modal-fc').classList.remove('active');
    document.getElementById('qa-modal-quiz').classList.remove('active');
    // Stopper la vidéo YT en retirant le src
    const frame = document.getElementById('qa-yt-frame');
    if (frame) frame.src = '';
    document.body.style.overflow = '';

    // Notifier royaume.html pour refresh le panel (même si on ferme sans finir le quiz)
    if (chapitreId) {
      window.dispatchEvent(new CustomEvent('questActivityCompleted', { detail: { chapId: chapitreId, type: 'close' } }));
    }
  }

  // Fermer clic sur overlay (hors du contenu)
  ['qa-modal-video','qa-modal-fc','qa-modal-quiz'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('click', e => { if (e.target === el) closeQuestActivity(); });
  });

  // Fermer via Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.querySelector('.qa-overlay.active')) {
      closeQuestActivity();
    }
  });

  // Exposer globalement
  window.openQuestActivity  = openQuestActivity;
  window.closeQuestActivity = closeQuestActivity;
  window.reshuffleFC        = reshuffleFC;
  window.showFCIndice       = showFCIndice;
  window.fcAcquis           = fcAcquis;
  window.fcRevoir           = fcRevoir;
  window.quizNext           = quizNext;
  window.quizRestart        = quizRestart;
  window.showHint           = showHint;
  window.startRevisionMode  = startRevisionMode;
})();
