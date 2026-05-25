// ── Flashcards V5 — anim "goutte de savoir" en vol vers la lanterne ──
// API publique :
//   window.fcv5LanternFill(n, total)         → snape la PNG la plus proche, rend les slots flottants
//   window.fcv5FlyDrop(onArrive)             → joue la séquence : trajectoire carte→lanterne + sparks + bloom
//   window.fcv5RenderSlots(target, n, newest)→ rend les n gouttes flottantes dans une lanterne
//   window.fcv5UpdatePath()                  → recalcule la trajectoire (à appeler après resize)
//
// Convention SVG viewBox lanterne : 100 × 145
// Convention SVG viewBox overlay session : 1100 × 580

(function() {
  const ns = 'http://www.w3.org/2000/svg';
  const LEVELS = [0, 20, 50, 75, 100];

  // 10 positions de gouttes dans le verre — coordonnées en viewBox 100x145
  const SLOTS = [
    { x: 40, y: 72 }, { x: 60, y: 80 }, { x: 49, y: 96 }, { x: 36, y: 104 }, { x: 63, y: 108 },
    { x: 45, y: 88 }, { x: 58, y: 70 }, { x: 53, y: 112 }, { x: 40, y: 112 }, { x: 57, y: 92 },
  ];

  function nearestLevel(pct) {
    let best = LEVELS[0], bd = 999;
    for (const lv of LEVELS) {
      const d = Math.abs(pct - lv);
      if (d < bd) { bd = d; best = lv; }
    }
    return best;
  }

  // Met à jour le data-fill de la lanterne (crossfade des 5 PNG via CSS)
  window.fcv5LanternFill = function(n, total) {
    if (!total) return;
    const pct = (n / total) * 100;
    const lv = nearestLevel(pct);
    document.querySelectorAll('.fcv5-lantern-stand--session, .fcv5-lantern-stand--big')
      .forEach(el => el.setAttribute('data-fill', lv));
  };

  // Rend N gouttes flottantes dans le SVG cible (overlay de la lanterne)
  window.fcv5RenderSlots = function(target, count, newest) {
    if (!target) return;
    target.innerHTML = '';
    const N = Math.min(count, SLOTS.length);
    const CX = 50, CY = 90;
    if (newest === undefined) newest = -1;
    for (let i = 0; i < N; i++) {
      const p = SLOTS[i];
      const g = document.createElementNS(ns, 'g');
      let cls = `fcv5-slot s${(i % 5) + 1}`;
      if (i === newest) cls += ' fcv5-slot--new';
      g.setAttribute('class', cls);
      g.style.setProperty('--dx', `${(CX - p.x).toFixed(1)}px`);
      g.style.setProperty('--dy', `${(CY - p.y).toFixed(1)}px`);
      g.innerHTML =
        `<circle cx="${p.x}" cy="${p.y}" r="7"   fill="oklch(0.82 0.16 80 / .35)" filter="blur(2px)"/>` +
        `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="oklch(0.92 0.10 85)"/>` +
        `<circle cx="${p.x - 1}" cy="${p.y - 1}" r="1.2" fill="#fff" opacity=".95"/>`;
      target.appendChild(g);
    }
  };

  // Trajectoire goutte : départ ~ bas-droit du verso, arrivée centre-bas de la lanterne
  function buildPath() {
    const card    = document.getElementById('fcv5-card');
    const lantern = document.getElementById('fcv5-lantern-stand');
    if (!card || !lantern) return null;
    // coords absolues dans le viewport de la session (parent .fcv5-screen-session)
    const screen = card.closest('.fcv5-screen-session');
    if (!screen) return null;
    const sb = screen.getBoundingClientRect();
    const cb = card.getBoundingClientRect();
    const lb = lantern.getBoundingClientRect();
    // viewBox SVG : 1100x580 (préserveAspectRatio="none" → mapping 1:1 sur la taille du screen)
    const sx = (cb.left - sb.left) + cb.width * 0.82 - 11;
    const sy = (cb.top  - sb.top)  + cb.height * 0.78 - 11;
    const lx = (lb.left - sb.left) + lb.width * 0.5  - 11;
    const ly = (lb.top  - sb.top)  + lb.height * 0.40 - 11;
    // convertir px → viewBox 1100x580
    const vx = 1100 / sb.width, vy = 580 / sb.height;
    const sX = sx * vx, sY = sy * vy;
    const lX = lx * vx, lY = ly * vy;
    const c1 = { x: sX + 70, y: Math.max(sY - 210, 10) };
    const c2 = { x: lX - 70, y: Math.max(lY - 210, 10) };
    return { d: `M ${sX} ${sY} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${lX} ${lY}`, sx, sy, lx, ly, sb };
  }

  window.fcv5UpdatePath = function() {
    const p = buildPath();
    if (!p) return;
    const trail = document.getElementById('fcv5-pathTrail');
    const drop  = document.getElementById('fcv5-drop');
    if (trail) {
      trail.setAttribute('d', p.d);
      try {
        const len = trail.getTotalLength();
        trail.style.strokeDasharray = len;
        if (!trail.classList.contains('is-animating')) trail.style.strokeDashoffset = len;
      } catch (e) {}
    }
    if (drop) {
      // offset-path en pixels : la goutte vole dans le screen (coordinate space px)
      const dPx = `M ${p.sx} ${p.sy} C ${p.sx + 70} ${Math.max(p.sy - 110, 0)} ${p.lx - 70} ${Math.max(p.ly - 110, 0)} ${p.lx} ${p.ly}`;
      drop.style.offsetPath = `path("${dPx}")`;
      drop.style.left = '0';
      drop.style.top  = '0';
    }
  };

  function spawnSparks() {
    const wrap = document.getElementById('fcv5-sparks');
    const trail = document.getElementById('fcv5-pathTrail');
    if (!wrap || !trail) return;
    wrap.innerHTML = '';
    const N = 3;
    let len = 0;
    try { len = trail.getTotalLength(); } catch (e) { return; }
    const screen = trail.closest('.fcv5-screen-session');
    if (!screen) return;
    const sb = screen.getBoundingClientRect();
    const vx = sb.width / 1100, vy = sb.height / 580;
    for (let i = 0; i < N; i++) {
      const t = (i + .5) / N + (Math.random() * .08 - .04);
      let pt;
      try { pt = trail.getPointAtLength(len * t); } catch (e) { continue; }
      const sp = document.createElement('div');
      sp.className = 'fcv5-spark';
      sp.style.left = (pt.x * vx - 2) + 'px';
      sp.style.top  = (pt.y * vy - 2) + 'px';
      sp.style.setProperty('--dx', (Math.random() * 24 - 12) + 'px');
      sp.style.setProperty('--dy', (Math.random() * 14 - 8) + 'px');
      sp.style.animationDelay = (t * 1400 * .85) + 'ms';
      wrap.appendChild(sp);
    }
    setTimeout(() => { wrap.innerHTML = ''; }, 2900);
  }

  // Joue la séquence complète : goutte naît au bas-droit du verso, file vers la lanterne,
  // la lanterne pulse (bloom), puis callback (incrémenter le compteur côté logique).
  window.fcv5FlyDrop = function(onArrive) {
    const drop  = document.getElementById('fcv5-drop');
    const trail = document.getElementById('fcv5-pathTrail');
    const stand = document.getElementById('fcv5-lantern-stand');
    if (!drop || !trail || !stand) { onArrive && onArrive(); return; }
    window.fcv5UpdatePath();
    drop.classList.remove('is-flying', 'is-arrived');
    trail.classList.add('is-animating');
    let len = 0;
    try { len = trail.getTotalLength(); } catch (e) {}
    if (len) {
      trail.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 1400, easing: 'cubic-bezier(.4,.0,.2,1)', fill: 'forwards' }
      );
    }
    // re-trigger CSS animation
    void drop.offsetWidth;
    drop.classList.add('is-flying');
    spawnSparks();

    setTimeout(() => {
      drop.classList.remove('is-flying');
      drop.classList.add('is-arrived');
      stand.classList.add('is-blooming');
      const pop = document.getElementById('fcv5-counter-pop');
      if (pop) { pop.classList.remove('is-popping'); void pop.offsetWidth; pop.classList.add('is-popping'); }
      onArrive && onArrive();
      setTimeout(() => {
        drop.classList.remove('is-arrived');
        stand.classList.remove('is-blooming');
        trail.classList.remove('is-animating');
        if (len) trail.style.strokeDashoffset = len;
      }, 800);
    }, 1400);
  };

  // Recalcul de path au resize
  let rzT;
  window.addEventListener('resize', () => {
    clearTimeout(rzT);
    rzT = setTimeout(() => window.fcv5UpdatePath(), 80);
  });
})();
