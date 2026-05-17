// ── Mentor — sidekick pédagogique perché sur l'épaule de Neo combattant ──
// API publique :
//   mountMentor()            — Injecte orbe + bulle dans #qa-combat-sprite-neo (idempotent)
//   mentorSay(html, opts)    — Affiche une bulle. opts: { variant: 'ok'|'ko', persist, duration }
//   mentorHide()             — Cache la bulle (anim exit)
//   mentorUnmount()          — Retire mentor + bulle

function mountMentor() {
  const host = document.getElementById('qa-combat-sprite-neo');
  if (!host) return;
  if (host.querySelector('.combat-mentor')) return;

  const mentor = document.createElement('div');
  mentor.className = 'combat-mentor';
  mentor.id = 'qa-combat-mentor';
  mentor.innerHTML = `
    <div class="combat-mentor-orb" id="qa-combat-mentor-orb" title="Mentor">n</div>
    <div class="combat-mentor-bubble" id="qa-combat-mentor-bubble" role="status" aria-live="polite"></div>
  `;
  host.appendChild(mentor);
}

var _mentorHideTimer = null;

function mentorSay(html, opts) {
  opts = opts || {};
  const bubble = document.getElementById('qa-combat-mentor-bubble');
  if (!bubble) return;

  clearTimeout(_mentorHideTimer);
  bubble.classList.remove('show', 'exit', 'ok', 'ko');
  if (opts.variant === 'ok') bubble.classList.add('ok');
  else if (opts.variant === 'ko') bubble.classList.add('ko');

  bubble.innerHTML = html;
  void bubble.offsetWidth;
  bubble.classList.add('show');

  if (!opts.persist) {
    const txt = bubble.textContent || '';
    const dur = opts.duration || Math.max(2400, Math.min(7000, txt.length * 55));
    _mentorHideTimer = setTimeout(mentorHide, dur);
  }
}

function mentorHide() {
  const bubble = document.getElementById('qa-combat-mentor-bubble');
  if (!bubble) return;
  clearTimeout(_mentorHideTimer);
  if (!bubble.classList.contains('show')) return;
  bubble.classList.add('exit');
  setTimeout(() => {
    bubble.classList.remove('show', 'exit', 'ok', 'ko');
    bubble.innerHTML = '';
  }, 240);
}

function mentorUnmount() {
  const m = document.getElementById('qa-combat-mentor');
  if (m) m.remove();
  clearTimeout(_mentorHideTimer);
}

window.mountMentor   = mountMentor;
window.mentorSay     = mentorSay;
window.mentorHide    = mentorHide;
window.mentorUnmount = mentorUnmount;
