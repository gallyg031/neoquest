function renderProvince(niveau, c) {
  currentNiveau = niveau;
  document.documentElement.style.setProperty('--accent', c);

  const allChaps = niveau.themes?.flatMap(t => t.chapitres) || [];
  const total   = allChaps.filter(ch => (ch.quiz?.length||0) > 0).length;
  const visited = allChaps.filter(ch => localStorage.getItem(`neoquest_chap_${ch.id}`)).length;
  const pct     = total > 0 ? Math.round((visited/total)*100) : 0;
  document.getElementById('sticky-visited').textContent = visited;
  document.getElementById('sticky-total').textContent   = total;
  document.getElementById('sticky-fill').style.width    = pct + '%';

  const container = document.getElementById('quest-route-container');
  container.innerHTML = '';

  if (allChaps.length === 0) {
    document.getElementById('empty-state').style.display = 'block';
    return;
  }
  document.getElementById('empty-state').style.display = 'none';

  let lastActiveIdx = 0;
  allChaps.forEach((ch, i) => {
    const s = getStatut(ch.id);
    if (s === 'in-progress' || s === 'mastered') lastActiveIdx = i;
  });

  const neoEl = document.getElementById('kingdom-neo');
  const neoSrc = neoEl ? neoEl.src : 'img/Neo_assis.png';
  const mapImg = PROVINCE_MAPS[niveau.id];

  if (mapImg) {
    renderMapRoute(niveau, c, mapImg, lastActiveIdx, neoSrc, container);
  } else {
    renderZigzag(niveau, c, lastActiveIdx, neoSrc, container);
  }
}
