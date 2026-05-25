// ── Timer 15s par question (anneau runique drainable) ──
// Drain visuel : cercle SVG dont stroke-dashoffset s'incrémente. États visuels :
//   normal (>6s) : violet magique
//   warn   (≤6s) : doré
//   danger (≤3s) : rouge cramoisi + pulse + chiffre clignote
//   paused       : gris + barres
//   expired      : flash ring + déclenche le callback de timeout
//
// API publique :
//   startTimer(duration, onExpire)   — Lance/relance le timer
//   pauseTimer() / resumeTimer()
//   stopTimer()                      — Stop sans déclencher onExpire
//   timerRemaining()                 — Secondes restantes (float)

var timerState = {
  duration: 15,
  remaining: 15,
  running: false,
  paused: false,
  startTs: 0,
  rafId: null,
  onExpire: null
};

const TIMER_RADIUS = 21;
const TIMER_CIRC   = 2 * Math.PI * TIMER_RADIUS;

function startTimer(duration, onExpire) {
  stopTimer();
  if (typeof duration === 'number' && duration > 0) timerState.duration = duration;
  timerState.remaining = timerState.duration;
  timerState.onExpire  = onExpire || null;
  timerState.running   = true;
  timerState.paused    = false;
  timerState.startTs   = performance.now();
  _ensureRing();
  _setState('');
  _renderTick();
  _loop();
}

function pauseTimer() {
  if (!timerState.running || timerState.paused) return;
  timerState.paused = true;
  cancelAnimationFrame(timerState.rafId);
  _setState('is-paused');
}

function resumeTimer() {
  if (!timerState.running || !timerState.paused) return;
  timerState.paused = false;
  timerState.startTs = performance.now();
  _setState('');
  _renderTick();
  _loop();
}

function stopTimer() {
  timerState.running = false;
  timerState.paused  = false;
  cancelAnimationFrame(timerState.rafId);
  _setState('');
}

function timerRemaining() { return timerState.remaining; }

function _loop() {
  if (!timerState.running || timerState.paused) return;
  const now = performance.now();
  const elapsed = (now - timerState.startTs) / 1000;
  timerState.startTs = now;
  timerState.remaining = Math.max(0, timerState.remaining - elapsed);
  _renderTick();
  if (timerState.remaining <= 0) { _expire(); return; }
  timerState.rafId = requestAnimationFrame(_loop);
}

function _renderTick() {
  const arc = document.getElementById('qa-quiz-timer-arc');
  const num = document.getElementById('qa-quiz-timer-num');
  if (!arc || !num) return;
  const pct = timerState.duration > 0 ? (timerState.remaining / timerState.duration) : 0;
  arc.style.strokeDashoffset = (TIMER_CIRC * (1 - pct)).toFixed(2);
  num.textContent = Math.ceil(timerState.remaining);

  if      (timerState.remaining <= 3) _setState('is-danger');
  else if (timerState.remaining <= 6) _setState('is-warn');
  else                                _setState('');
}

function _setState(cls) {
  const root = document.getElementById('qa-quiz-timer');
  if (!root) return;
  root.classList.remove('is-warn', 'is-danger', 'is-paused', 'is-expired');
  if (cls) root.classList.add(cls);
}

function _expire() {
  timerState.running = false;
  cancelAnimationFrame(timerState.rafId);
  _setState('is-expired');
  const cb = timerState.onExpire;
  timerState.onExpire = null;
  setTimeout(() => { _setState(''); }, 600);
  if (typeof cb === 'function') cb();
}

function _ensureRing() {
  const root = document.getElementById('qa-quiz-timer');
  if (!root) return;
  const arc = document.getElementById('qa-quiz-timer-arc');
  if (arc) {
    arc.setAttribute('stroke-dasharray',  TIMER_CIRC.toFixed(2));
    arc.setAttribute('stroke-dashoffset', '0');
  }
}

window.startTimer      = startTimer;
window.pauseTimer      = pauseTimer;
window.resumeTimer     = resumeTimer;
window.stopTimer       = stopTimer;
window.timerRemaining  = timerRemaining;
