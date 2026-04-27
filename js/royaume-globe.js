// ── Modal globe ──
function openGlobeModal(event) {
  event.stopPropagation();
  const modal = document.getElementById('globe-modal');
  const overlay = document.getElementById('globe-overlay');
  modal.classList.add('active');
  overlay.classList.add('active');
  setTimeout(() => {
    placeFresnelModal();
    placeZonesModal();
  }, 100);
}

function closeGlobeModal() {
  const modal = document.getElementById('globe-modal');
  const overlay = document.getElementById('globe-overlay');
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

// Fermer si clic sur overlay
document.addEventListener('click', (e) => {
  const modal = document.getElementById('globe-modal');
  const overlay = document.getElementById('globe-overlay');
  if (overlay.classList.contains('active') && e.target === overlay) {
    closeGlobeModal();
  }
});

// Fermer au clic Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGlobeModal();
  }
});

// ── Fresnel pour globe principal ──
function placeFresnel() {
  const img = document.getElementById('globe-img');
  const fr  = document.getElementById('fresnel-modal');
  if (!img || !fr || !img.offsetWidth || !img.naturalWidth) return;

  const iw = img.offsetWidth;
  const ih = img.offsetHeight;
  const r  = ih * 0.40;
  const cx = iw * 0.5;
  const cy = ih * 0.5;

  fr.style.width  = (r*2) + 'px';
  fr.style.height = (r*2) + 'px';
  fr.style.left   = (cx - r) + 'px';
  fr.style.top    = (cy - r) + 'px';
}

// ── Fresnel pour globe modal ──
function placeFresnelModal() {
  const img = document.getElementById('globe-img-modal');
  const fr  = document.getElementById('fresnel-modal-modal');
  if (!img || !fr || !img.offsetWidth || !img.naturalWidth) return;

  const iw = img.offsetWidth;
  const ih = img.offsetHeight;
  const r  = ih * 0.40;
  const cx = iw * 0.5;
  const cy = ih * 0.5;

  fr.style.width  = (r*2) + 'px';
  fr.style.height = (r*2) + 'px';
  fr.style.left   = (cx - r) + 'px';
  fr.style.top    = (cy - r) + 'px';
}

// ── Fog pour globe principal ──
var _persistentZone = null;
var _persistentZoneModal = null;

// ── Placer zones du modal en fonction de la taille réelle de l'image ──
function placeZonesModal() {
  const img = document.getElementById('globe-img-modal');
  const wrap = document.getElementById('globe-wrap-modal');
  if (!img || !img.offsetWidth || !img.offsetHeight) {
    setTimeout(placeZonesModal, 100);
    return;
  }

  const zones = wrap.querySelectorAll('.g-zone');
  zones.forEach(zone => {
    const leftPct = parseFloat(zone.getAttribute('data-left-pct') || '50');
    const topPct = parseFloat(zone.getAttribute('data-top-pct') || '50');
    zone.style.left = (leftPct / 100 * img.offsetWidth) + 'px';
    zone.style.top = (topPct / 100 * img.offsetHeight) + 'px';
  });
}

function drawFog(activeZone, persist) {
  const fogCanvas = document.getElementById('globe-fog-canvas');
  const globeImg  = document.getElementById('globe-img');
  const wrap      = document.getElementById('globe-wrap');
  if (!fogCanvas || !globeImg) return;

  if (persist) { _persistentZone = activeZone; }
  const zone = activeZone || _persistentZone;

  const iw = globeImg.offsetWidth, ih = globeImg.offsetHeight;
  fogCanvas.width = iw; fogCanvas.height = ih;
  const ctx = fogCanvas.getContext('2d');
  ctx.clearRect(0, 0, iw, ih);

  if (!zone) { wrap.classList.remove('has-active'); return; }
  wrap.classList.add('has-active');

  const cx = parseFloat(zone.style.left) / 100 * iw;
  const cy = parseFloat(zone.style.top)  / 100 * ih;
  const r = iw * 0.15;

  ctx.fillStyle = 'rgba(8,6,26,0.7)';
  ctx.fillRect(0, 0, iw, ih);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(cx, cy, r*0.3, cx, cy, r*1.5);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r*1.5, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawFogModal(activeZone, persist) {
  const fogCanvas = document.getElementById('globe-fog-canvas-modal');
  const globeImg  = document.getElementById('globe-img-modal');
  const wrap      = document.getElementById('globe-wrap-modal');
  if (!fogCanvas || !globeImg) return;

  if (persist) { _persistentZoneModal = activeZone; }
  const zone = activeZone || _persistentZoneModal;

  const iw = globeImg.offsetWidth, ih = globeImg.offsetHeight;
  fogCanvas.width = iw; fogCanvas.height = ih;
  const ctx = fogCanvas.getContext('2d');
  ctx.clearRect(0, 0, iw, ih);

  if (!zone) { wrap.classList.remove('has-active'); return; }
  wrap.classList.add('has-active');

  const cx = parseFloat(zone.style.left);
  const cy = parseFloat(zone.style.top);
  const r = iw * 0.15;

  ctx.fillStyle = 'rgba(8,6,26,0.7)';
  ctx.fillRect(0, 0, iw, ih);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(cx, cy, r*0.3, cx, cy, r*1.5);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r*1.5, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

// ── Hover fog ──
document.addEventListener('DOMContentLoaded', () => {
  const zones = [
    { col: '#22d3ee', left: '34%', top: '20%', id: '6eme', label: 'L\'Origine', sub: '6ème · Antiquité' },
    { col: '#a855f7', left: '65%', top: '20%', id: '5eme', label: 'L\'Héritage', sub: '5ème · Moyen Âge' },
    { col: '#f472b6', left: '34%', top: '70%', id: '4eme', label: 'Les Révolutions', sub: '4ème · XVIIIe-XIXe' },
    { col: '#fbbf24', left: '65%', top: '70%', id: '3eme', label: 'Le Monde Moderne', sub: '3ème · XXe siècle' }
  ];

  // Créer zones pour globe principal
  const globeWrap = document.getElementById('globe-wrap');
  zones.forEach(z => {
    const zone = document.createElement('div');
    zone.className = 'g-zone';
    zone.style.cssText = `--col:${z.col};left:${z.left};top:${z.top};`;
    zone.innerHTML = `
      <div class="g-ring"></div><div class="g-dot"></div>
      <div class="g-tip"><div class="g-tip-name" style="--col:${z.col};">${z.label}</div><div class="g-tip-sub">${z.sub}</div></div>
    `;
    zone.onclick = () => selectProvince(z.id);
    zone.addEventListener('mouseenter', () => drawFog(zone));
    zone.addEventListener('mouseleave', () => drawFog(_persistentZone));
    globeWrap.appendChild(zone);
  });

  // Créer zones pour modal
  const globeWrapModal = document.getElementById('globe-wrap-modal');
  zones.forEach(z => {
    const zone = document.createElement('div');
    zone.className = 'g-zone';
    zone.setAttribute('data-left-pct', z.left.replace('%', ''));
    zone.setAttribute('data-top-pct', z.top.replace('%', ''));
    zone.style.cssText = `--col:${z.col};`;
    zone.innerHTML = `
      <div class="g-ring"></div><div class="g-dot"></div>
      <div class="g-tip"><div class="g-tip-name" style="--col:${z.col};">${z.label}</div><div class="g-tip-sub">${z.sub}</div></div>
    `;
    zone.onclick = () => selectProvince(z.id);
    zone.addEventListener('mouseenter', () => drawFogModal(zone));
    zone.addEventListener('mouseleave', () => drawFogModal(_persistentZoneModal));
    globeWrapModal.appendChild(zone);
  });

  setTimeout(placeZonesModal, 100);

  // Fresnel init pour globe principal
  const globeImg = document.getElementById('globe-img');
  globeImg.addEventListener('load', placeFresnel);
  if (globeImg.complete) placeFresnel();
  window.addEventListener("resize", () => {
    placeFresnel();
    drawFog(_persistentZone);
  });
  setTimeout(placeFresnel, 300);

  // Fresnel init pour modal
  const globeImgModal = document.getElementById('globe-img-modal');
  globeImgModal.addEventListener('load', placeFresnelModal);
  if (globeImgModal.complete) placeFresnelModal();
});
