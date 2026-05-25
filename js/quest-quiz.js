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

  // Résolution boss : profil par chap → fallback profil chap → fallback image thématique (boss-intro-lines.js)
  const themeLines = (window.__BOSS_INTRO_LINES && window.__BOSS_INTRO_LINES[theme]) || {};
  const imgMechant = ((typeof nqGetBossImg === 'function') ? nqGetBossImg(ch, 'mechant', true) : null)
                  || ((typeof nqGetBossImg === 'function') ? nqGetBossImg(ch, 'mechant', false) : null)
                  || ch.image_boss
                  || themeLines.bossImage
                  || null;
  const imgApaise  = ((typeof nqGetBossImg === 'function') ? nqGetBossImg(ch, 'apaise', true) : null)
                  || ((typeof nqGetBossImg === 'function') ? nqGetBossImg(ch, 'apaise', false) : null)
                  || null;
  // Nom boss : chap.nom_boss > chap.boss.nom > thème > fallback. (Ne PAS prendre nom_quete = nom de la leçon.)
  const bossDisplayName = ch.nom_boss
                       || (ch.boss && ch.boss.nom)
                       || themeLines.bossTitle
                       || 'Le Gardien';
  bossInit({
    name: quizState.isRevisionMode ? `${bossDisplayName} — revanche` : bossDisplayName,
    icon: ch.icone_quete || '👹',
    imgMechant,
    imgApaise,
    maxHP,
    chapId: typeof chapitreId !== 'undefined' ? chapitreId : null
  });

  // Reset Phase 2 features : cœurs, Phase II, timer (skippé en mode révision : pas de défaite)
  if (typeof window.resetHearts === 'function') window.resetHearts(quizState.isRevisionMode ? 99 : 3);
  if (typeof window.mountHearts  === 'function') window.mountHearts();
  if (typeof window.phase2Reset  === 'function') window.phase2Reset();
  if (typeof window.stopTimer    === 'function') window.stopTimer();
  quizState.koDefeat = false;

  document.getElementById('qa-quiz-streak-badge').classList.add('hidden');
  document.getElementById('qa-quiz-final').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = '';
  document.getElementById('qa-quiz-content').classList.remove('hidden');

  // Intro narrative (Flux A 1ʳᵉ fois, Flux C en replay) — skippée en mode révision
  const shouldPlayIntro = !quizState.isRevisionMode && typeof runIntroSequence === 'function';
  if (shouldPlayIntro) {
    runIntroSequence({
      theme,
      bossName: ch.nom_boss,       // si absent → fallback boss thématique (boss-intro-lines.js)
      bossIcon: ch.image_boss,     // si absent → fallback image thématique (boss-intro-lines.js)
      chap: ch
    }, renderQuiz);
  } else {
    renderQuiz();
  }
}

function renderQuiz() {
  if (quizState.quizIndex >= quizState.quizData.length) { showQuizFinal(); return; }
  const q = quizState.quizData[quizState.quizIndex]; quizState.quizAnswered = false;
  // Reset face vers question (au cas où on revient d'une annale)
  const grimPage = document.getElementById('qa-quiz-grim-page');
  if (grimPage) grimPage.dataset.face = 'question';
  const content = document.getElementById('qa-quiz-content');
  content.classList.remove('quiz-slide-in', 'answered'); void content.offsetWidth; content.classList.add('quiz-slide-in');
  const progBar = document.getElementById('qa-quiz-prog-bar');
  progBar.style.width = `${Math.round((quizState.quizIndex/quizState.quizData.length)*100)}%`;
  const diff = q.difficulte || 'facile';
  progBar.className = `qa-prog-fill prog-${diff}`;
  // Compteur "Question X / N · difficulté"
  const curEl  = document.getElementById('qa-quiz-prog-current');
  const totEl  = document.getElementById('qa-quiz-prog-total');
  const diffEl = document.getElementById('qa-quiz-prog-diff');
  if (curEl) curEl.textContent = quizState.quizIndex + 1;
  if (totEl) totEl.textContent = quizState.quizData.length;
  if (diffEl) {
    const diffLabel = diff === 'hard' ? 'difficile' : (diff === 'medium' ? 'moyen' : 'facile');
    const diffColor = diff === 'hard' ? '#f472b6' : (diff === 'medium' ? '#c084fc' : '#22d3ee');
    diffEl.textContent = diffLabel;
    diffEl.style.color = diffColor;
  }
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
  q.choix.forEach((c,i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.type = 'button';
    btn.dataset.letter = String.fromCharCode(65 + i);
    const letter = document.createElement('span');
    letter.className = 'quiz-opt-letter';
    letter.textContent = btn.dataset.letter;
    const text = document.createElement('span');
    text.className = 'quiz-opt-text';
    text.textContent = c;
    btn.appendChild(letter);
    btn.appendChild(text);
    btn.onclick = () => answer(i, q.bonne_reponse, q.difficulte || 'facile');
    choixEl.appendChild(btn);
  });

  // Timer 15s par question (sauf en révision ou Finish Him où on enlève la pression)
  if (!quizState.isRevisionMode && !quizState.isFinishHim && typeof window.startTimer === 'function') {
    window.startTimer(15, quizTimeout);
  }
}

// Timeout : timer atteint 0 sans réponse → traité comme une mauvaise réponse
function quizTimeout() {
  if (quizState.quizAnswered) return;
  const q = quizState.quizData[quizState.quizIndex];
  if (!q) return;
  answer(-1, q.bonne_reponse, q.difficulte || 'facile');
}

function showHint() {
  const q = quizState.quizData[quizState.quizIndex]; if (!q.indice || quizState.hintUsed) return; quizState.hintUsed = true;
  document.getElementById('qa-hint-text').textContent = q.indice;
  const box = document.getElementById('qa-hint-box'); box.classList.remove('hidden'); box.style.display = 'flex';
  const btn = document.getElementById('qa-hint-btn'); btn.disabled = true; btn.style.opacity = '0.45'; btn.textContent = '💡 Indice utilisé';
}

function answer(selected, correct, diff) {
  if (quizState.quizAnswered) return; quizState.quizAnswered = true;
  if (typeof window.stopTimer === 'function') window.stopTimer();
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
  // Successive Relearning (Rawson 2011) — unifié avec le mode contrôle :
  // chaque bonne réponse au quiz boss incrémente le compteur de récup de l'item
  // (capé à 1 par jour côté recup-counter.js, sémantique « séances espacées »).
  // Skip en mode révision (replay des ratées d'une même session) pour ne pas
  // gonfler artificiellement. Lu par la Fiche parent pour afficher X/total justes.
  if (isCorrect && chapitreId && !quizState.isRevisionMode && typeof window.rcInc === 'function') {
    window.rcInc(chapitreId, q.question);
  }
  quizState.quizHistory.push({question:q.question, questionObj:q, correct:isCorrect, hintUsed:quizState.hintUsed, correctAnswer:q.choix[correctIdx], diff});

  // Mauvaise réponse (ou timeout) → perte de cœur (sauf révision / Finish Him où le joueur ne peut plus tomber)
  if (!isCorrect && !quizState.isRevisionMode && !quizState.isFinishHim) {
    if (typeof window.loseHeart === 'function') window.loseHeart();
    if (typeof window.heartsKO === 'function' && window.heartsKO()) {
      quizState.koDefeat = true;
    }
  }

  // Compacte l'affichage après réponse (cache question + hint)
  document.getElementById('qa-quiz-content').classList.add('answered');

  // Streak (suspendu en Finish Him pour ne pas perturber la cérémonie)
  const previousStreak = quizState.streak || 0;
  if (!quizState.isFinishHim) {
    if (isCorrect) quizState.streak++; else quizState.streak = 0;
    const streakEl = document.getElementById('qa-quiz-streak-badge');
    if (quizState.streak >= 2) {
      streakEl.className = 'streak-badge';
      streakEl.innerHTML = `<span class="streak-runes">⟡⟡⟡</span><span class="streak-label">×${quizState.streak}</span>`;
      streakEl.classList.remove('hidden');
    } else {
      streakEl.classList.add('hidden');
    }
  }

  const hintBtn2 = document.getElementById('qa-hint-btn'); hintBtn2.disabled = true; hintBtn2.style.opacity = '0.35';

  const nb = document.getElementById('qa-quiz-next-btn');
  const dmgColor = diff==='hard'?'#f472b6':diff==='medium'?'#c084fc':'#22d3ee';
  const dmg = quizState.isRevisionMode ? 1 : (munition === 'eclat' ? 10 : 3);
  const xp  = quizState.isRevisionMode ? 0 : (munition === 'eclat' ? 25 : 8);

  const showNextBtn = () => {
    nb.classList.remove('qz-pending');
    if (!quizState.finishHimPending) {
      nb.textContent = quizState.quizIndex < quizState.quizData.length-1 ? 'Question suivante →' : '🏆 Bilan';
      nb.classList.remove('finish-him');
    }
  };

  const scheduleAnnale = () => {
    if (quizState.annaleTimer) clearTimeout(quizState.annaleTimer);
    const delay = isCorrect ? 1500 : 1800;
    quizState.annaleTimer = setTimeout(() => {
      if (typeof window.revealAnnale !== 'function') { showNextBtn(); return; }
      window.revealAnnale({
        letter: selectedIdx >= 0 ? String.fromCharCode(65 + selectedIdx) : null,
        isCorrect,
        timedOut: selectedIdx < 0,
        correctAnswer: q.choix[correctIdx],
        explication:   q.explication || '',
        astuceNeo:     q.astuce_neo || '',
        dmg, xp,
        streak:         quizState.streak,
        previousStreak: previousStreak
      });
    }, delay);
  };

  if (typeof audioLaunchEclat === 'function') audioLaunchEclat();

  if (quizState.isFinishHim) {
    // Cérémonie Finish Him : pas d'annale, on garde le bouton classique
    quizState.finishHimWon = isCorrect;
    if (isCorrect) { if (typeof audioCriticalHit === 'function') audioCriticalHit(); }
    else            { if (typeof audioMissBoss   === 'function') audioMissBoss();   }
    showNextBtn();
  } else if (typeof vfxAttack === 'function') {
    // Annale schedulée en parallèle des VFX (cancellable si K.O. technique)
    scheduleAnnale();
    vfxAttack(isCorrect, munition, () => {
      if (isCorrect) {
        if (typeof audioCriticalHit === 'function') audioCriticalHit();
        bossDamage(dmg, dmgColor);
        if (typeof window.neoCheer === 'function') window.neoCheer({ xp });
        // K.O. technique → on annule l'annale et on bascule en Finish Him sur la PROCHAINE question
        if (bossIsDefeated() && !quizState.isRevisionMode && quizState.quizIndex < quizState.quizData.length - 1) {
          if (quizState.annaleTimer) { clearTimeout(quizState.annaleTimer); quizState.annaleTimer = null; }
          quizState.questionsSavedByKO = Math.max(0, quizState.quizData.length - quizState.quizIndex - 2);
          quizState.finishHimPending = true;
          quizState.quizData = quizState.quizData.slice(0, quizState.quizIndex + 2);
          nb.textContent = '🔥 FINISH HIM !';
          nb.classList.add('finish-him');
          showNextBtn();
        }
      } else {
        if (typeof audioMissBoss === 'function') audioMissBoss();
      }
    });
  } else {
    // Fallback si VFX pas chargé
    if (isCorrect) {
      bossDamage(dmg, dmgColor);
      if (typeof window.neoCheer === 'function') window.neoCheer({ xp });
    } else {
      bossReact();
    }
    scheduleAnnale();
  }
}


function quizNext() {
  // KO : 3 cœurs perdus → défaite immédiate (placeholder, écran cinématique en Phase 5)
  if (quizState.koDefeat) {
    if (typeof window.stopTimer === 'function') window.stopTimer();
    if (typeof hudHideFeedbackBubble === 'function') hudHideFeedbackBubble();
    showQuizFinalKO();
    return;
  }
  if (typeof hudHideFeedbackBubble === 'function') hudHideFeedbackBubble();
  const goingToFinishHim = quizState.finishHimPending;
  if (goingToFinishHim) {
    quizState.finishHimPending = false;
    quizState.isFinishHim = true;
    showFinishHimOverlay();
    setTimeout(() => { quizState.quizIndex++; renderQuiz(); }, 600);
    return;
  }
  if (typeof window.pageFlip === 'function') {
    window.pageFlip(() => { quizState.quizIndex++; renderQuiz(); });
  } else {
    setTimeout(() => { quizState.quizIndex++; renderQuiz(); }, 150);
  }
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

// Carnet d'oublis de Neo : enregistre les questions ratées (hors mode révision)
function _nbEnqueueFromQuiz() {
  if (quizState.isRevisionMode) return;
  if (typeof window.nbAdd !== 'function') return;
  var failed = (quizState.quizHistory || []).filter(function(h) { return !h.correct; }).map(function(h) { return h.questionObj; });
  if (!failed.length) return;
  var royaumeId = (typeof currentMat !== 'undefined' && currentMat) ? currentMat.id : null;
  var chId = (typeof chapitreId !== 'undefined') ? chapitreId : null;
  if (!royaumeId || !chId) return;
  try { window.nbAdd(chId, royaumeId, failed); } catch (e) {}
}

// K.O. — écran cinématique Défaite avec reason='ko'
function showQuizFinalKO() {
  _nbEnqueueFromQuiz();
  document.getElementById('qa-quiz-content').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = 'none';
  document.getElementById('qa-quiz-final').classList.add('hidden');

  const correctCount = quizState.quizHistory.filter(h => h.correct).length;
  const total        = quizState.quizData.length;
  const ch           = quizState.chap || {};
  const theme        = ch.theme || ch.matiere || matiereId || 'historya';
  const bossHp       = (typeof bossState !== 'undefined' && bossState && bossState.hp != null) ? Math.max(0, bossState.hp) : 0;
  const eclatsLeft   = (typeof getEclats === 'function' && chapitreId) ? getEclats(chapitreId) : 0;
  const shardsUsed   = Math.max(0, (typeof ECLAT_MAX !== 'undefined' ? ECLAT_MAX : 15) - eclatsLeft);

  if (typeof runDefeatScreen === 'function') {
    runDefeatScreen({
      theme,
      bossName: ch.nom_boss,
      bossImage: ch.image_boss,
      reason: 'ko',
      correct: correctCount, total,
      bossHp, shardsUsed,
    }, function onReplay() { quizRestart(); },
       null, // pas de bouton "récup éclats" tant que la mécanique n'est pas câblée
       function onQuit()   { closeQuestActivity(); });
    return;
  }

  // Fallback inline si runDefeatScreen pas chargé
  document.getElementById('qa-quiz-final').innerHTML = `
    <div class="qzf-wrap">
      <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="transform:scaleX(-1);filter:drop-shadow(0 0 14px #ef444499);" /></div>
      <div class="qzf-title" style="color:#ef4444;">💔 K.O.</div>
      <div class="qzf-best">${correctCount}/${total} avant de tomber</div>
      <div class="qzf-btns">
        <button class="qzf-btn qzf-btn-restart" onclick="quizRestart()">🔄 Recommencer</button>
        <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()">← Retour</button>
      </div>
    </div>`;
  document.getElementById('qa-quiz-final').classList.remove('hidden');
}

function showQuizFinal() {
  _nbEnqueueFromQuiz();
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
  var xpBreakdown = null;
  if (defeated) {
    // XP modulé par difficulté — uniquement à la 1ʳᵉ victoire du chapitre (anti-farm).
    // Rejeu = 0 XP mais Or normal (l'Or est limité par l'économie des éclats).
    var isFirstWin = false;
    try { isFirstWin = !localStorage.getItem(`neoquest_quiz_${chapitreId}`); } catch(e) {}
    if (isFirstWin) {
      const XP_BY_DIFF = { facile: 5, medium: 10, hard: 15 };
      const buckets = { facile:{n:0,xp:0}, medium:{n:0,xp:0}, hard:{n:0,xp:0} };
      let xpFromQ = 0;
      quizState.quizHistory.forEach(h => {
        if (!h.correct) return;
        const diff = ((h.questionObj && h.questionObj.difficulte) || 'facile').toLowerCase();
        if (XP_BY_DIFF[diff] != null) {
          xpFromQ += XP_BY_DIFF[diff];
          buckets[diff].n++;
          buckets[diff].xp += XP_BY_DIFF[diff];
        }
      });
      const xpBonus = 50;
      const xpTotal = xpFromQ + xpBonus;
      addPts(xpTotal);
      xpBreakdown = { facile: buckets.facile, medium: buckets.medium, hard: buckets.hard, bonus: xpBonus, total: xpTotal, alreadyMastered: false };
    } else {
      xpBreakdown = { alreadyMastered: true, total: 0 };
    }
    // Or — inchangé. Formule Specs Quiz : (Éclats restants × 10) + (Questions non posées × 5)
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
  renderQuizFinal(defeated, correctCount, total, goldEarned, goldBreakdown, xpBreakdown);
}

function renderQuizFinal(defeated, correct, total, goldEarned, breakdown, xpInfo) {
  const failedCount = quizState.quizHistory.filter(h => !h.correct).length;

  if (defeated) {
    // ── Victoire — écran cinématique dédié (combat-victory.css + quest-quiz-victory.js) ──
    const xi = xpInfo || {};
    const ch = quizState.chap || {};
    const theme = ch.theme || ch.matiere || matiereId || 'historya';
    const heartsLeft = (typeof window.heartsCount === 'function') ? window.heartsCount() : 0;
    const heartsMax  = (typeof window.heartsState !== 'undefined' && window.heartsState && window.heartsState.max) || 3;
    const flavor = (!quizState.isRevisionMode && heartsLeft === heartsMax) ? 'flawless' : 'win';
    const shards = (typeof getEclats === 'function' && chapitreId) ? getEclats(chapitreId) : 0;
    const bonus  = (flavor === 'flawless') ? 50 : 0;
    const xpTotal = (xi.total || 0) + bonus;

    if (typeof runVictoryScreen === 'function') {
      document.getElementById('qa-quiz-content').classList.add('hidden');
      document.getElementById('qa-quiz-final').classList.add('hidden');
      runVictoryScreen({
        theme,
        bossName: ch.nom_boss,
        bossImage: ch.image_boss,
        flavor,
        gold: goldEarned,
        xp: xi.total || 0,
        bonus,
        correct, total,
        shards,
        hearts: heartsLeft,
        // Mode défi serait l'idéal (Phase 7 future) ; pour l'instant retour map en primaire, rejouer en ghost.
        primaryLabel: '✓ Retour à la map',
        primarySub: xpTotal > 0 ? `+${xpTotal} xp · +${goldEarned} or` : `+${goldEarned} or`,
        secondaryLabel: '↻ Rejouer',
        secondarySub: 'retenter ce combat',
      }, function onPrimary() { closeQuestActivity(); },
         function onSecondary() { quizRestart(); });
      return;
    }
    // Fallback (si runVictoryScreen pas chargé) : ancien recap inline
    document.getElementById('qa-quiz-final').innerHTML = `
      <div class="qzf-wrap">
        <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="filter:drop-shadow(0 0 14px #22d3ee99);" /></div>
        <div class="qzf-title" style="color:#22d3ee;">⚔️ Victoire !</div>
        <div class="qzf-best">${correct}/${total} · +${goldEarned} Or</div>
        <div class="qzf-btns">
          <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()">✓ Retour à la map</button>
        </div>
      </div>`;
    document.getElementById('qa-quiz-final').classList.remove('hidden');
    return;
  } else {
    // ── Timeout — quiz fini, boss encore debout. Écran cinématique Défaite reason='timeout' ──
    const ch = quizState.chap || {};
    const theme = ch.theme || ch.matiere || matiereId || 'historya';
    const bossHp = (typeof bossState !== 'undefined' && bossState && bossState.hp != null) ? Math.max(0, bossState.hp) : 0;
    const eclatsLeft = (typeof getEclats === 'function' && chapitreId) ? getEclats(chapitreId) : 0;
    const shardsUsed = Math.max(0, (typeof ECLAT_MAX !== 'undefined' ? ECLAT_MAX : 15) - eclatsLeft);

    if (typeof runDefeatScreen === 'function') {
      document.getElementById('qa-quiz-content').classList.add('hidden');
      document.getElementById('qa-quiz-final').classList.add('hidden');
      // En mode timeout, le slot doré "Récup éclats" est détourné pour "Réviser erreurs"
      // (mécanique pédago importante — récup active sur les questions ratées).
      const hasFailed = failedCount > 0;
      runDefeatScreen({
        theme,
        bossName: ch.nom_boss,
        bossImage: ch.image_boss,
        reason: 'timeout',
        correct, total,
        bossHp, shardsUsed,
        replayLabel: '↻ Réessayer',
        replaySub: 'reprendre le combat',
        shardsLabel: '📖 Réviser les erreurs',
        shardsSub: hasFailed ? `${failedCount} à reprendre` : '',
        quitLabel: '↩ Retour',
        quitSub: 'à la map',
      }, function onReplay() { quizRestart(); },
         hasFailed ? function onRevise() { startRevisionMode(); } : null,
         function onQuit()    { closeQuestActivity(); });
      return;
    }

    // Fallback inline si runDefeatScreen pas chargé (garde le bouton "Réviser erreurs")
    document.getElementById('qa-quiz-final').innerHTML = `
      <div class="qzf-wrap">
        <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="transform:scaleX(-1);filter:drop-shadow(0 0 14px #f472b699);" /></div>
        <div class="qzf-title" style="color:#f472b6;">😤 Le boss tient encore…</div>
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
