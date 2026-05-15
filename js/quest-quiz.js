// ── Modal Quiz — logique ──
var quizState = {
  allQuestions: [], quizData: [], quizIndex: 0,
  quizAnswered: false, quizHistory: [], hintUsed: false, streak: 0, isRevisionMode: false
};

// Mapping matière → thème royaume (cohérent avec FC_THEMES de quest-flashcards.js)
const COMBAT_THEMES = {
  'histoire-geo':    'historya',
  'svt':             'bioverde',
  'physique-chimie': 'quantix',
  'mathematiques':   'algebron',
  'francais':        'lexoria'
};

function initQuiz(questions, chap) { quizState.allQuestions = questions || []; quizState.chap = chap || null; quizState.isRevisionMode = false; pickAndStart(); }
function startRevisionMode() { const failed = quizState.quizHistory.filter(h => !h.correct).map(h => h.questionObj); if (!failed.length) return; quizState.isRevisionMode = true; quizState.allQuestions = failed; pickAndStart(); }

function pickAndStart() {
  // Dédoublonnage strict par texte de question : aucun duplicate dans un même quiz
  const seen = new Set();
  const keepUnique = (q) => { if (seen.has(q.question)) return false; seen.add(q.question); return true; };

  const easy = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'facile'));
  const med  = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'medium'));
  const hard = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'hard'));
  quizState.quizData = [...easy.slice(0,3), ...med.slice(0,6), ...hard.slice(0,3)].filter(keepUnique);

  // Complète avec d'autres questions non utilisées si le quota n'est pas atteint
  if (quizState.quizData.length < QUIZ_SIZE) {
    const filler = weightedShuffle(quizState.allQuestions.filter(q => !seen.has(q.question))).filter(keepUnique);
    quizState.quizData = [...quizState.quizData, ...filler].slice(0, QUIZ_SIZE);
  }
  quizState.quizIndex = 0; quizState.quizAnswered = false; quizState.quizHistory = []; quizState.streak = 0;
  quizState.finishHimPending = false; quizState.isFinishHim = false; quizState.finishHimWon = false; quizState.questionsSavedByKO = 0;
  const ch = quizState.chap || {};
  const maxHP = quizState.isRevisionMode ? quizState.quizData.length : 100;

  // Thème du royaume (parchemin historya / herbier bioverde / etc.)
  const matId = (typeof currentMat !== 'undefined' && currentMat) ? currentMat.id : null;
  const theme = (matId && COMBAT_THEMES[matId]) || 'historya';
  const shell = document.getElementById('qa-combat-shell');
  if (shell) shell.setAttribute('data-combat-theme', theme);

  bossInit({
    name: quizState.isRevisionMode ? `${ch.nom_quete || 'Le Gardien'} — revanche` : (ch.nom_quete || 'Le Gardien'),
    icon: ch.icone_quete || '👹',
    maxHP,
    chapId: typeof chapitreId !== 'undefined' ? chapitreId : null
  });
  document.getElementById('qa-quiz-streak-badge').classList.add('hidden');
  document.getElementById('qa-quiz-final').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = '';
  document.getElementById('qa-quiz-content').classList.remove('hidden');

  // Intro narrative (3 actes skippables) — skippée en mode révision (déjà vue au 1er run)
  const shouldPlayIntro = !quizState.isRevisionMode && typeof runIntroSequence === 'function';
  if (shouldPlayIntro) {
    runIntroSequence({
      theme,
      bossName: ch.nom_quete || 'Le Gardien',
      bossIcon: ch.icone_quete || '👹',
      chap: ch
    }, renderQuiz);
  } else {
    renderQuiz();
  }
}

function renderQuiz() {
  if (quizState.quizIndex >= quizState.quizData.length) { showQuizFinal(); return; }
  const q = quizState.quizData[quizState.quizIndex]; quizState.quizAnswered = false;
  const content = document.getElementById('qa-quiz-content');
  content.classList.remove('quiz-slide-in', 'answered'); void content.offsetWidth; content.classList.add('quiz-slide-in');
  const progBar = document.getElementById('qa-quiz-prog-bar');
  progBar.style.width = `${Math.round((quizState.quizIndex/quizState.quizData.length)*100)}%`;
  const diff = q.difficulte || 'facile';
  progBar.className = `qa-prog-fill prog-${diff}`;
  // Compteur "Question X / N"
  const curEl = document.getElementById('qa-quiz-prog-current');
  const totEl = document.getElementById('qa-quiz-prog-total');
  if (curEl) curEl.textContent = quizState.quizIndex + 1;
  if (totEl) totEl.textContent = quizState.quizData.length;
  quizState.hintUsed = false;
  const hintBox = document.getElementById('qa-hint-box'); hintBox.classList.add('hidden');
  const hintBtn = document.getElementById('qa-hint-btn'); hintBtn.disabled = false; hintBtn.style.opacity = '1'; hintBtn.textContent = '💡 Indice';
  hintBtn.style.visibility = q.indice ? 'visible' : 'hidden';
  const qEl = document.getElementById('qa-quiz-question');
  qEl.classList.remove('qz-fade-in');
  qEl.textContent = q.question;
  void qEl.offsetWidth;
  qEl.classList.add('qz-fade-in');
  document.getElementById('qa-quiz-feedback').classList.add('hidden');
  document.getElementById('qa-quiz-next-btn').classList.add('qz-pending');
  const choixEl = document.getElementById('qa-quiz-choix'); choixEl.innerHTML = '';
  q.choix.forEach((c,i) => { const btn = document.createElement('button'); btn.className = 'quiz-opt'; btn.textContent = c; btn.onclick = () => answer(i, q.bonne_reponse, q.difficulte||'facile'); choixEl.appendChild(btn); });
}

function showHint() {
  const q = quizState.quizData[quizState.quizIndex]; if (!q.indice || quizState.hintUsed) return; quizState.hintUsed = true;
  document.getElementById('qa-hint-text').textContent = q.indice;
  const box = document.getElementById('qa-hint-box'); box.classList.remove('hidden'); box.style.display = 'flex';
  const btn = document.getElementById('qa-hint-btn'); btn.disabled = true; btn.style.opacity = '0.45'; btn.textContent = '💡 Indice utilisé';
}

function answer(selected, correct, diff) {
  if (quizState.quizAnswered) return; quizState.quizAnswered = true;
  const q = quizState.quizData[quizState.quizIndex];
  if (typeof window.pomoActivity === 'function') window.pomoActivity('quiz');

  // Consommation munition (skip si Finish Him : boss déjà mort, pas de dégâts à infliger)
  var munition = 'caillou';
  if (chapitreId && !quizState.isRevisionMode && !quizState.isFinishHim && typeof consumeEclatForQuiz === 'function') {
    munition = consumeEclatForQuiz(chapitreId);
    if (typeof window.resetLantern === 'function') window.resetLantern();
    if (typeof hudUpdateEclatCounter === 'function') hudUpdateEclatCounter();
    if (typeof hudLanternFlicker === 'function' && munition === 'eclat') hudLanternFlicker();
  }

  // bonne_reponse peut être stocké en number (index) OU en string (texte de la bonne réponse) selon les questions
  const correctIdx  = (typeof correct === 'string') ? q.choix.indexOf(correct) : Number(correct);
  const selectedIdx = Number(selected);

  // Highlight des choix
  document.querySelectorAll('#qa-quiz-choix .quiz-opt').forEach((btn,i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.classList.add('correct');
    else if (i === selectedIdx) btn.classList.add('wrong');
    else btn.classList.add('muted');
  });

  const isCorrect = selectedIdx === correctIdx;
  recordResult(q.question, isCorrect);
  quizState.quizHistory.push({question:q.question, questionObj:q, correct:isCorrect, hintUsed:quizState.hintUsed, correctAnswer:q.choix[correctIdx], diff});

  // Compacte l'affichage après réponse (cache question + hint)
  document.getElementById('qa-quiz-content').classList.add('answered');

  // Streak (suspendu en Finish Him pour ne pas perturber la cérémonie)
  if (!quizState.isFinishHim) {
    if (isCorrect) quizState.streak++; else quizState.streak = 0;
    const streakEl = document.getElementById('qa-quiz-streak-badge');
    if (quizState.streak >= 2) { streakEl.className = 'streak-badge'; streakEl.textContent = `🔥 ×${quizState.streak}`; streakEl.classList.remove('hidden'); } else streakEl.classList.add('hidden');
  }

  // Feedback : bulle Neo ancrée au sprite dans la scène (libère le grimoire)
  if (typeof hudShowFeedbackBubble === 'function') {
    hudShowFeedbackBubble({
      isCorrect,
      correctAnswer: q.choix[correctIdx],
      explication:   q.explication || ''
    });
  }
  const hintBtn2 = document.getElementById('qa-hint-btn'); hintBtn2.disabled = true; hintBtn2.style.opacity = '0.35';

  const nb = document.getElementById('qa-quiz-next-btn');
  const dmgColor = diff==='hard'?'#f472b6':diff==='medium'?'#c084fc':'#22d3ee';
  const dmg = quizState.isRevisionMode ? 1 : (munition === 'eclat' ? 10 : 3);

  const showNextBtn = () => {
    nb.classList.remove('qz-pending');
    if (!quizState.finishHimPending) {
      nb.textContent = quizState.quizIndex < quizState.quizData.length-1 ? 'Question suivante →' : '🏆 Bilan';
      nb.classList.remove('finish-him');
    }
  };

  if (typeof audioLaunchEclat === 'function') audioLaunchEclat();

  if (quizState.isFinishHim) {
    // Question fatale : boss déjà mort, pas de bossDamage. On stocke juste le résultat.
    quizState.finishHimWon = isCorrect;
    if (isCorrect) { if (typeof audioCriticalHit === 'function') audioCriticalHit(); }
    else            { if (typeof audioMissBoss   === 'function') audioMissBoss();   }
    showNextBtn();
  } else if (typeof vfxAttack === 'function') {
    vfxAttack(isCorrect, munition, () => {
      if (isCorrect) {
        if (typeof audioCriticalHit === 'function') audioCriticalHit();
        bossDamage(dmg, dmgColor);
        // Détection K.O. technique → on bascule en Finish Him sur la PROCHAINE question
        if (bossIsDefeated() && !quizState.isRevisionMode && quizState.quizIndex < quizState.quizData.length - 1) {
          quizState.questionsSavedByKO = Math.max(0, quizState.quizData.length - quizState.quizIndex - 2);
          quizState.finishHimPending = true;
          quizState.quizData = quizState.quizData.slice(0, quizState.quizIndex + 2); // garde la prochaine, tronque le reste
          nb.textContent = '🔥 FINISH HIM !';
          nb.classList.add('finish-him');
        }
      } else {
        if (typeof audioMissBoss === 'function') audioMissBoss();
        // vfxAttack(false, …) joue déjà la séquence complète : Neo recule + bulle "Aïe!" +
        // contre-attaque du Boss (rugissement, sort d'ombre, dazed shake). bossReact() est redondant ici.
      }
      showNextBtn();
    });
  } else {
    // Fallback si VFX pas chargé
    if (isCorrect) bossDamage(dmg, dmgColor); else bossReact();
    showNextBtn();
  }
}

function quizNext() {
  const content = document.getElementById('qa-quiz-content');
  content.classList.add('quiz-slide-out');
  if (typeof hudHideFeedbackBubble === 'function') hudHideFeedbackBubble();
  const goingToFinishHim = quizState.finishHimPending;
  if (goingToFinishHim) {
    quizState.finishHimPending = false;
    quizState.isFinishHim = true;
    showFinishHimOverlay();
  }
  setTimeout(() => { content.classList.remove('quiz-slide-out'); quizState.quizIndex++; renderQuiz(); }, goingToFinishHim ? 600 : 150);
}

function showFinishHimOverlay() {
  const stage = document.getElementById('qa-combat-stage');
  if (!stage) return;
  const ov = document.createElement('div');
  ov.className = 'finish-him-overlay';
  ov.textContent = 'FINISH HIM !';
  stage.appendChild(ov);
  if (typeof vfxScreenShake === 'function') vfxScreenShake('hard');
  setTimeout(() => ov.remove(), 1400);
}

function showQuizFinal() {
  document.getElementById('qa-quiz-content').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = 'none';

  const correctCount = quizState.quizHistory.filter(h => h.correct).length;
  const total = quizState.quizData.length;

  if (quizState.isRevisionMode) {
    renderQuizFinalRevision(correctCount, total);
    return;
  }

  const p = getProgress(); p.quizCount = (p.quizCount||0) + 1; saveProgress(p);
  const defeated = typeof bossIsDefeated === 'function' && bossIsDefeated();
  var goldEarned = 0;
  var goldBreakdown = null;
  if (defeated) {
    addPts(100);
    // Nouvelle formule (Specs Quiz) : (Éclats restants × 10) + (Questions non posées × 5)
    const eclatsLeft = (typeof getEclats === 'function' && chapitreId) ? getEclats(chapitreId) : 0;
    const savedQ     = quizState.questionsSavedByKO || 0;
    const goldEclats = eclatsLeft * 10;
    const goldSaved  = savedQ * 5;
    goldEarned = goldEclats + goldSaved;
    const doubled = !!quizState.finishHimWon;
    if (doubled) goldEarned *= 2;
    goldBreakdown = { eclatsLeft, goldEclats, savedQ, goldSaved, doubled };
    if (typeof addGold === 'function') addGold(goldEarned);
    try { localStorage.setItem(`neoquest_quiz_${chapitreId}`, '1'); } catch(e) {}
  }
  renderQuizFinal(defeated, correctCount, total, goldEarned, goldBreakdown);
}

function renderQuizFinal(defeated, correct, total, goldEarned, breakdown) {
  const failedCount = quizState.quizHistory.filter(h => !h.correct).length;

  if (defeated) {
    const b = breakdown || {};
    const koBadge = (b.savedQ > 0)
      ? `<span style="background:rgba(239,68,68,0.14);border:1px solid #f59e0b88;border-radius:999px;padding:0.4rem 1rem;font-size:0.85rem;font-weight:900;color:#fcd34d;">🔥 K.O. technique — ${b.savedQ} question${b.savedQ>1?'s':''} non posée${b.savedQ>1?'s':''} (+${b.goldSaved} Or)</span>`
      : '';
    const doubleBadge = b.doubled
      ? `<span style="background:linear-gradient(135deg,#dc262633,#f59e0b33);border:1px solid #fbbf24;border-radius:999px;padding:0.4rem 1rem;font-size:0.85rem;font-weight:900;color:#fef3c7;">✨ DOUBLE OR (Finish Him réussi)</span>`
      : '';
    document.getElementById('qa-quiz-final').innerHTML = `
      <div class="qzf-wrap">
        <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="filter:drop-shadow(0 0 14px #22d3ee99);" /></div>
        <div class="qzf-title" style="color:#22d3ee;">⚔️ Victoire !</div>
        <div style="font-size:0.85rem;color:#94a3b8;font-weight:700;margin-bottom:1rem;">Le boss est vaincu !</div>
        <div style="display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap;justify-content:center;">
          <span style="background:rgba(251,191,36,0.12);border:1px solid #fbbf2444;border-radius:999px;padding:0.4rem 1rem;font-size:0.88rem;font-weight:900;color:#fbbf24;">💰 +${goldEarned} Or</span>
          <span style="background:rgba(34,211,238,0.1);border:1px solid #22d3ee44;border-radius:999px;padding:0.4rem 1rem;font-size:0.88rem;font-weight:900;color:#22d3ee;">⬆ +100 XP</span>
        </div>
        ${(koBadge || doubleBadge) ? `<div style="display:flex;gap:0.5rem;margin-bottom:0.9rem;flex-wrap:wrap;justify-content:center;">${koBadge}${doubleBadge}</div>` : ''}
        <div class="qzf-best">${correct}/${total} réponses correctes</div>
        <div class="qzf-btns">
          <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()">✓ Retour à la map</button>
        </div>
      </div>`;
  } else {
    document.getElementById('qa-quiz-final').innerHTML = `
      <div class="qzf-wrap">
        <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="transform:scaleX(-1);filter:drop-shadow(0 0 14px #f472b699);" /></div>
        <div class="qzf-title" style="color:#f472b6;">😤 Le boss tient encore…</div>
        <div style="font-size:0.85rem;color:#94a3b8;font-weight:700;margin-bottom:1rem;">Retourne réviser et reviens plus fort !</div>
        <div class="qzf-best">${correct}/${total} réponses correctes</div>
        <div class="qzf-btns">
          <button class="qzf-btn qzf-btn-restart" onclick="quizRestart()">🔄 Réessayer</button>
          <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()">← Retour</button>
        </div>
        ${failedCount > 0 ? `<button class="qzf-btn qzf-btn-revision" onclick="startRevisionMode()">🔁 Réviser les erreurs (${failedCount})</button>` : ''}
      </div>`;
  }
  document.getElementById('qa-quiz-final').classList.remove('hidden');
}

function renderQuizFinalRevision(correct, total) {
  const allRight = correct === total;
  const pct = total > 0 ? Math.round((correct/total) * 100) : 0;
  const r = 68, circ = 2 * Math.PI * r;
  const offsetTarget = circ * (1 - pct/100);

  document.getElementById('qa-quiz-final').innerHTML = `
    <div class="qzf-wrap">
      <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="filter:drop-shadow(0 0 14px #c084fc99);" /></div>
      <div class="qzf-title" style="color:#c084fc;">${allRight ? '🌟 Parfait !' : '💪 Tu progresses !'}</div>
      <div style="font-size:0.72rem;color:#94a3b8;font-weight:800;margin-bottom:0.85rem;letter-spacing:0.1em;text-transform:uppercase;">Mode révision</div>
      <div class="qzf-ring-wrap">
        <svg class="qzf-ring-svg" width="160" height="160" viewBox="0 0 160 160">
          <circle class="qzf-ring-bg" cx="80" cy="80" r="${r}"></circle>
          <circle class="qzf-ring-fg" id="qa-quiz-ring-fg" cx="80" cy="80" r="${r}" stroke="#c084fc" stroke-dasharray="${circ}" stroke-dashoffset="${circ}"></circle>
        </svg>
        <div class="qzf-ring-inner">
          <div class="qzf-score" style="color:#c084fc;">${correct}<span style="font-size:1.3rem;color:#64748b;font-weight:800;">/${total}</span></div>
          <div class="qzf-pts-label">RÉUSSIES</div>
        </div>
      </div>
      <div class="qzf-btns">
        <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()" style="flex:1;">✓ Retour à la map</button>
      </div>
    </div>`;
  document.getElementById('qa-quiz-final').classList.remove('hidden');
  requestAnimationFrame(() => { const fg = document.getElementById('qa-quiz-ring-fg'); if (fg) fg.style.strokeDashoffset = offsetTarget; });
}

function animateCount(elId, from, to, duration) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function quizRestart() { pickAndStart(); }

window.quizNext          = quizNext;
window.quizRestart       = quizRestart;
window.showHint          = showHint;
window.startRevisionMode = startRevisionMode;
