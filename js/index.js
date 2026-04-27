document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('mobileMenu').classList.toggle('hidden'));

const pingStyle = document.createElement('style');
pingStyle.textContent = '@keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }';
document.head.appendChild(pingStyle);

function openPortal(mat) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#08061a;opacity:0;transition:opacity 0.5s ease;pointer-events:none;';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    setTimeout(() => { window.location.href = `royaume.html?matiere=${mat.id}`; }, 400);
  });
}

// Hero : dernière quête visitée + badge nouveautés
(function() {
  try {
    const lastKey = Object.keys(localStorage).filter(k => k.startsWith('neoquest_chap_')).pop();
    if (lastKey) {
      const chapId = lastKey.replace('neoquest_chap_', '');
      let chapNom = null, chapUrl = null;
      window.__neoData.matieres.forEach(mat => {
        mat.niveaux?.forEach(niv => {
          niv.themes?.forEach(t => {
            t.chapitres?.forEach(ch => {
              if (ch.id === chapId) {
                chapNom = ch.nom;
                chapUrl = `chapitre.html?matiere=${mat.id}&niveau=${niv.id}&chapitre=${chapId}`;
              }
            });
          });
        });
      });
      if (chapNom) {
        document.getElementById('hero-quest-name').textContent = chapNom;
        document.getElementById('hero-quest-link').href = chapUrl;
        document.getElementById('hero-last-quest').style.display = 'flex';
      }
    }
    let newCount = 0, newMatiere = '';
    window.__neoData.matieres.forEach(mat => {
      mat.niveaux?.forEach(niv => {
        niv.themes?.forEach(t => {
          t.chapitres?.forEach(ch => {
            if ((ch.quiz?.length || 0) > 0 && !localStorage.getItem(`neoquest_chap_${ch.id}`)) {
              newCount++;
              if (!newMatiere) newMatiere = mat.nom;
            }
          });
        });
      });
    });
    if (newCount > 0) {
      document.getElementById('hero-new-text').textContent = `${newCount} quête${newCount > 1 ? 's' : ''} disponible${newCount > 1 ? 's' : ''} en ${newMatiere}`;
      document.getElementById('hero-new-badge').style.display = 'flex';
    }
  } catch(e) {}
})();

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Grille des portails
{
  const data = window.__neoData;
  const grid = document.getElementById('matieres-grid');

  const ROYAUME_IMAGES = {
    'histoire-geo': 'img/Historya.png',
    'svt':          'img/Bioverde.png',
    'maths':        'img/Algebron.png',
    'francais':     'img/Lexoria.png',
    'physique-chimie': 'img/Quantix.png',
  };

  const PALETTES = {
    'histoire-geo':    { p1:'#a855f7', p2:'#7c3aed', p3:'#c084fc', bg:'#0e0820', emoji:'🏛️' },
    'svt':             { p1:'#22c55e', p2:'#15803d', p3:'#4ade80', bg:'#051a0d', emoji:'🌿' },
    'physique-chimie': { p1:'#22d3ee', p2:'#0891b2', p3:'#67e8f9', bg:'#00131a', emoji:'⚗️' },
    'maths':           { p1:'#facc15', p2:'#ca8a04', p3:'#fde047', bg:'#1a1400', emoji:'📐' },
    'francais':        { p1:'#f472b6', p2:'#be185d', p3:'#f9a8d4', bg:'#1a0510', emoji:'📖' },
  };

  const HEX_POSITIONS = [
    { x: 0,   y: 0   },
    { x: 270, y: 0   },
    { x: 540, y: 0   },
    { x: 135, y: 235 },
    { x: 405, y: 235 },
  ];

  const NEO_FILTERS = {
    'svt':             'hue-rotate(80deg) saturate(1.4) brightness(1.1)',
    'physique-chimie': 'hue-rotate(160deg) saturate(1.4) brightness(1.1)',
    'maths':           'hue-rotate(140deg) saturate(1.3) brightness(1.2)',
    'francais':        'hue-rotate(280deg) saturate(1.4) brightness(1.1)',
  };

  data.matieres.forEach((mat, i) => {
    const hasContent = mat.niveaux && mat.niveaux.length > 0;
    const pal = PALETTES[mat.id] || { p1:mat.couleur, p2:mat.couleur, p3:'#fff', bg:'#0a0a1a', emoji:'✦' };
    const img = ROYAUME_IMAGES[mat.id];

    const allChaps = mat.niveaux?.flatMap(n => n.themes?.flatMap(t => t.chapitres) || []) || [];
    const total = allChaps.length;
    const visited = allChaps.filter(ch => localStorage.getItem(`neoquest_chap_${ch.id}`)).length;
    const pct = total > 0 ? Math.round((visited / total) * 100) : 0;

    const wrap = document.createElement('div');
    wrap.className = `portal-wrap reveal ${!hasContent ? 'locked' : ''}`;
    const pos = HEX_POSITIONS[i] || { x: i * 226, y: 0 };
    wrap.style.left = pos.x + 'px';
    wrap.style.top  = pos.y + 'px';
    wrap.style.transitionDelay = `${i * 0.08}s`;
    wrap.style.setProperty('--p1', pal.p1);
    wrap.style.setProperty('--p2', pal.p2);
    wrap.style.setProperty('--p3', pal.p3);

    const neoFilter = NEO_FILTERS[mat.id] || '';
    const iconHTML = img
      ? ''
      : `<img src="img/Neo_assis.png" alt="Neo" class="portal-icon" style="width:90px;height:90px;object-fit:contain;filter:${neoFilter} drop-shadow(0 0 14px ${pal.p1}aa);" />`;
    const imgStyle = img
      ? `background-image:url('${img}');`
      : `background:radial-gradient(ellipse at 50% 30%, ${pal.p1}44 0%, ${pal.bg} 70%);`;
    const barHTML = hasContent && total > 0
      ? `<div class="portal-bar-wrap"><div class="portal-bar" style="width:${pct}%;background:${pal.p3};box-shadow:0 0 6px ${pal.p1};"></div></div><div class="portal-sub">${pct > 0 ? pct + '% exploré' : 'Inexploré'}</div>`
      : (!hasContent ? `<div class="portal-sub">Bientôt...</div>` : '');

    wrap.innerHTML = `
      <div class="portal-border" style="--p1:${pal.p1};--p2:${pal.p2};--p3:${pal.p3};"></div>
      <div class="portal-hex">
        <div class="portal-img" style="${imgStyle}"></div>
        <div class="portal-overlay"></div>
        <div class="portal-glow" style="--p1-raw:${pal.p1};"></div>
        <div class="portal-content" style="--p1-raw:${pal.p1};">
          ${iconHTML}
          <div class="portal-name" style="--p1-raw:${pal.p1};">${mat.nom_royaume || mat.nom}</div>
          ${barHTML}
        </div>
      </div>
    `;

    if (hasContent) {
      wrap.style.cursor = 'pointer';
      wrap.addEventListener('click', () => openPortal(mat));
    }

    grid.appendChild(wrap);
    observer.observe(wrap);
  });
}

if("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("[NeoQuest] Service Worker enregistré"))
    .catch(e => console.warn("[NeoQuest] SW erreur:", e));
}
