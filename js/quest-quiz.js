// ── Modal Quiz — logique ──
var quizState = {
  allQuestions: [], quizData: [], quizIndex: 0, quizPts: 0,
  quizAnswered: false, quizHistory: [], hintUsed: false, streak: 0, isRevisionMode: false
};

function initQuiz(questions, chap) { quizState.allQuestions = questions || []; quizState.chap = chap || null; quizState.isRevisionMode = false; pickAndStart(); }
function startRevisionMode() { const failed = quizState.quizHistory.filter(h => !h.correct).map(h => h.questionObj); if (!failed.length) return; quizState.isRevisionMode = true; quizState.allQuestions = failed; pickAndStart(); }

function pickAndStart() {
  const easy = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'facile'));
  const med  = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'medium'));
  const hard = weightedShuffle(quizState.allQuestions.filter(q => q.difficulte === 'hard'));
  quizState.quizData = [...easy.slice(0,3), ...med.slice(0,6), ...hard.slice(0,3)];
  if (quizState.quizData.length < QUIZ_SIZE) { const used = new Set(quizState.quizData.map(q => q.question)); quizState.quizData = [...quizState.quizData, ...weightedShuffle(quizState.allQuestions.filter(q => !used.has(q.question)))].slice(0, QUIZ_SIZE); }
  quizState.quizIndex = 0; quizState.quizPts = 0; quizState.quizAnswered = false; quizState.quizHistory = []; quizState.streak = 0;
  const ch = quizState.chap || {};
  const maxHP = quizState.isRevisionMode
    ? quizState.quizData.length
    : quizState.quizData.reduce((s, q) => s + DIFF_POINTS[q.difficulte || 'facile'], 0);
  bossInit({
    name: quizState.isRevisionMode ? `${ch.nom_quete || 'Le Gardien'} — revanche` : (ch.nom_quete || 'Le Gardien'),
    icon: ch.icone_quete || '👹',
    maxHP
  });
  document.getElementById('qa-quiz-streak-badge').classList.add('hidden');
  document.getElementById('qa-quiz-final').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = '';
  const bossSlot = document.getElementById('qa-quiz-boss'); if (bossSlot) bossSlot.style.display = '';
  document.getElementById('qa-quiz-content').classList.remove('hidden');
  renderQuiz();
}

function renderQuiz() {
  if (quizState.quizIndex >= quizState.quizData.length) { showQuizFinal(); return; }
  const q = quizState.quizData[quizState.quizIndex]; quizState.quizAnswered = false;
  const content = document.getElementById('qa-quiz-content');
  content.classList.remove('quiz-slide-in'); void content.offsetWidth; content.classList.add('quiz-slide-in');
  const progBar = document.getElementById('qa-quiz-prog-bar');
  progBar.style.width = `${Math.round((quizState.quizIndex/quizState.quizData.length)*100)}%`;
  document.getElementById('qa-quiz-pts-label').textContent = quizState.isRevisionMode ? 'Mode révision' : `${quizState.quizPts} pts`;
  const diff = q.difficulte || 'facile';
  progBar.className = `qa-prog-fill prog-${diff}`;
  document.getElementById('qa-quiz-pts-badge').style.display = quizState.isRevisionMode ? 'none' : 'inline-flex';
  document.getElementById('qa-quiz-pts-badge').textContent = `+${DIFF_POINTS[diff]} pts`;
  quizState.hintUsed = false;
  const hintBox = document.getElementById('qa-hint-box'); hintBox.classList.add('hidden');
  const hintBtn = document.getElementById('qa-hint-btn'); hintBtn.disabled = false; hintBtn.style.opacity = '1'; hintBtn.textContent = '💡 Indice';
  hintBtn.style.visibility = q.indice ? 'visible' : 'hidden';
  document.getElementById('qa-quiz-question').textContent = q.question;
  document.getElementById('qa-quiz-feedback').classList.add('hidden');
  document.getElementById('qa-quiz-next-btn').classList.add('hidden');
  const choixEl = document.getElementById('qa-quiz-choix'); choixEl.innerHTML = '';
  q.choix.forEach((c,i) => { const btn = document.createElement('button'); btn.className = 'quiz-opt'; btn.textContent = c; btn.onclick = () => answer(i, q.bonne_reponse, q.difficulte||'facile'); choixEl.appendChild(btn); });
}

function showHint() {
  const q = quizState.quizData[quizState.quizIndex]; if (!q.indice || quizState.hintUsed) return; quizState.hintUsed = true;
  document.getElementById('qa-hint-text').textContent = q.indice;
  const box = document.getElementById('qa-hint-box'); box.classList.remove('hidden'); box.style.display = 'flex';
  const halved = Math.floor(DIFF_POINTS[q.difficulte||'facile']/2);
  document.getElementById('qa-quiz-pts-badge').textContent = `+${halved} pts (indice)`;
  const btn = document.getElementById('qa-hint-btn'); btn.disabled = true; btn.style.opacity = '0.45'; btn.textContent = '💡 Indice utilisé';
}

function answer(selected, correct, diff) {
  if (quizState.quizAnswered) return; quizState.quizAnswered = true;
  const q = quizState.quizData[quizState.quizIndex];
  if (typeof window.pomoActivity === 'function') window.pomoActivity('quiz');
  document.querySelectorAll('#qa-quiz-choix .quiz-opt').forEach((btn,i) => { btn.disabled = true; if (i === correct) btn.classList.add('correct'); else if (i === selected) btn.classList.add('wrong'); else btn.classList.add('muted'); });
  const isCorrect = selected === correct;
  const basePts = DIFF_POINTS[diff];
  const pts = quizState.isRevisionMode ? 0 : (isCorrect ? (quizState.hintUsed ? Math.floor(basePts/2) : basePts) : 0);
  recordResult(q.question, isCorrect);
  if (isCorrect) { quizState.streak++; soundCorrect(); } else { quizState.streak = 0; soundWrong(); }
  const streakEl = document.getElementById('qa-quiz-streak-badge');
  if (quizState.streak >= 2) { streakEl.className = 'streak-badge'; streakEl.textContent = `🔥 ×${quizState.streak}`; streakEl.classList.remove('hidden'); } else streakEl.classList.add('hidden');
  const dmgColor = diff==='hard'?'#f472b6':diff==='medium'?'#c084fc':'#22d3ee';
  if (isCorrect) {
    bossDamage(quizState.isRevisionMode ? 1 : pts, dmgColor);
  } else {
    bossReact();
  }
  if (isCorrect && !quizState.isRevisionMode) {
    quizState.quizPts += pts;
    const pop = document.createElement('span'); pop.className = 'points-pop'; pop.textContent = `+${pts}`; pop.style.color = dmgColor; document.getElementById('qa-quiz-choix').appendChild(pop); setTimeout(() => pop.remove(), 1000);
  }
  document.getElementById('qa-quiz-pts-label').textContent = quizState.isRevisionMode ? 'Mode révision' : `${quizState.quizPts} pts`;
  quizState.quizHistory.push({question:q.question, questionObj:q, correct:isCorrect, pts, hintUsed:quizState.hintUsed, correctAnswer:q.choix[correct], diff});
  const fb = document.getElementById('qa-quiz-feedback'); fb.classList.remove('hidden');
  const correctTitle = quizState.isRevisionMode ? '👍 Bravo !' : `👍 Bravo ! +${pts} pts`;
  const explication = q.explication || null;
  fb.innerHTML = `<div class="neo-feedback ${isCorrect?'ok':'ko'}"><img src="img/Neo_assis.png" alt="Neo" style="${isCorrect?'filter:drop-shadow(0 0 12px #22d3ee)':'transform:scaleX(-1);filter:drop-shadow(0 0 12px #f472b6)'};" /><div class="neo-feedback-text"><div class="neo-feedback-title ${isCorrect?'ok':'ko'}">${isCorrect?correctTitle:'😬 Pas tout à fait…'}</div>${!isCorrect?`<div class="neo-feedback-answer">✅ ${q.choix[correct]}</div>`:''}${explication?`<div class="neo-feedback-expl">${explication}</div>`:''}</div></div>`;
  const nb = document.getElementById('qa-quiz-next-btn'); nb.classList.remove('hidden'); nb.textContent = quizState.quizIndex < quizState.quizData.length-1 ? 'Question suivante →' : '🏆 Bilan';
  const hintBtn2 = document.getElementById('qa-hint-btn'); hintBtn2.disabled = true; hintBtn2.style.opacity = '0.35';
}

function quizNext() {
  const content = document.getElementById('qa-quiz-content');
  content.classList.add('quiz-slide-out');
  setTimeout(() => { content.classList.remove('quiz-slide-out'); quizState.quizIndex++; renderQuiz(); }, 150);
}

function showQuizFinal() {
  document.getElementById('qa-quiz-content').classList.add('hidden');
  document.getElementById('qa-quiz-header-prog').style.display = 'none';
  const bossSlot = document.getElementById('qa-quiz-boss'); if (bossSlot) bossSlot.style.display = 'none';

  const correctCount = quizState.quizHistory.filter(h => h.correct).length;
  const total = quizState.quizData.length;

  if (quizState.isRevisionMode) {
    renderQuizFinalRevision(correctCount, total);
    return;
  }

  addPts(quizState.quizPts);
  const p = getProgress(); p.quizCount = (p.quizCount||0) + 1; saveProgress(p);

  let bestScore = quizState.quizPts, isNewRecord = false;
  try {
    const key = `neoquest_chap_${chapitreId}`;
    const chd = JSON.parse(localStorage.getItem(key)||'{}');
    isNewRecord = quizState.quizPts > (chd.bestScore||0);
    if (isNewRecord) chd.bestScore = quizState.quizPts;
    bestScore = chd.bestScore || quizState.quizPts;
    localStorage.setItem(key, JSON.stringify(chd));
    localStorage.setItem(`neoquest_quiz_${chapitreId}`, '1');
  } catch(e) {}

  const maxPossible = quizState.quizData.reduce((sum, q) => sum + DIFF_POINTS[q.difficulte||'facile'], 0);
  const pct = maxPossible > 0 ? Math.round((quizState.quizPts / maxPossible) * 100) : 0;
  renderQuizFinal(quizState.quizPts, bestScore, correctCount, total, pct, isNewRecord);
}

function renderQuizFinal(score, best, correct, total, pct, isNewRecord) {
  const fb = pct >= 80 ? {emoji:'🌟', label:'Excellent !',          color:'#22d3ee'}
           : pct >= 50 ? {emoji:'👍', label:'Bien joué !',           color:'#c084fc'}
           :             {emoji:'💪', label:'Continue, tu progresses !', color:'#f472b6'};
  const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const failedCount = quizState.quizHistory.filter(h => !h.correct).length;

  const r = 68, circ = 2 * Math.PI * r;
  const offsetTarget = circ * (1 - Math.min(100, pct) / 100);
  const starHTML = [0,1,2].map(i => `<span style="animation-delay:${0.5 + i*0.12}s;filter:${i < stars ? 'drop-shadow(0 0 6px #fbbf24)' : 'grayscale(1) opacity(0.3)'};">⭐</span>`).join('');

  document.getElementById('qa-quiz-final').innerHTML = `
    <div class="qzf-wrap">
      <div class="qzf-neo"><img src="img/Neo_assis.png" alt="Neo" style="filter:drop-shadow(0 0 14px ${fb.color}99);" /></div>
      <div class="qzf-title" style="color:${fb.color};">${fb.emoji} ${fb.label}</div>
      <div class="qzf-ring-wrap">
        <svg class="qzf-ring-svg" width="160" height="160" viewBox="0 0 160 160">
          <circle class="qzf-ring-bg" cx="80" cy="80" r="${r}"></circle>
          <circle class="qzf-ring-fg" id="qa-quiz-ring-fg" cx="80" cy="80" r="${r}" stroke="${fb.color}" stroke-dasharray="${circ}" stroke-dashoffset="${circ}"></circle>
        </svg>
        <div class="qzf-ring-inner">
          <div class="qzf-score" id="qa-quiz-score-num" style="color:${fb.color};">0</div>
          <div class="qzf-pts-label">PTS · ${pct}%</div>
        </div>
      </div>
      <div class="qzf-stars">${starHTML}</div>
      ${isNewRecord ? `<div class="qzf-record">🏆 Nouveau record !</div>` : ''}
      <div class="qzf-best">${correct}/${total} bonnes réponses · meilleur : <strong>${best} pts</strong></div>
      <div class="qzf-btns">
        <button class="qzf-btn qzf-btn-restart" onclick="quizRestart()">🔄 Relancer</button>
        <button class="qzf-btn qzf-btn-back" onclick="closeQuestActivity()">✓ Retour à la map</button>
      </div>
      ${failedCount > 0 ? `<button class="qzf-btn qzf-btn-revision" onclick="startRevisionMode()">🔁 Réviser les erreurs (${failedCount})</button>` : ''}
    </div>`;
  document.getElementById('qa-quiz-final').classList.remove('hidden');
  requestAnimationFrame(() => { const fg = document.getElementById('qa-quiz-ring-fg'); if (fg) fg.style.strokeDashoffset = offsetTarget; });
  animateCount('qa-quiz-score-num', 0, score, 1400);
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
