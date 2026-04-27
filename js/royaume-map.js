function renderMapRoute(niveau, c, mapImg, lastActiveIdx, neoSrc, container) {
  const allChaps = niveau.themes?.flatMap(t => t.chapitres) || [];
  const positions = MAP_NODE_POSITIONS[niveau.id] || MAP_NODE_POSITIONS.default;

  const split = document.createElement('div');
  split.className = 'province-split';

  const splitMap = document.createElement('div');
  splitMap.className = 'province-split-map';
  split.appendChild(splitMap);

  const splitPanel = document.createElement('div');
  splitPanel.className = 'province-split-panel';
  splitPanel.innerHTML = `
    <div class="quest-panel" id="quest-panel-main">
      <!-- État d'attente -->
      <div class="qp-waiting" id="qp-waiting">
        <div class="qp-waiting-icon"><img src="img/Neo_assis.png" alt="Neo" style="width:80px;height:80px;object-fit:contain;"/></div>
        <h3 class="qp-waiting-title">Choisis ta quête</h3>
        <p class="qp-waiting-subtitle">Clique sur un monument de la carte pour découvrir les détails de l'aventure et commencer ton exploration.</p>
        <div class="qp-waiting-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- État quête sélectionnée -->
      <div class="qp-selected" id="qp-selected" style="display:none;">
        <div class="qp-header">
          <img class="qp-header-img" id="qp-header-img" src="" alt="Quête" />
          <div class="qp-header-text">
            <div class="qp-region-badge" id="qp-region-badge"></div>
            <h3 class="qp-title" id="qp-title">—</h3>
            <p class="qp-subtitle" id="qp-subtitle"></p>
          </div>
        </div>
        <div class="qp-body" id="qp-body">
          <div class="qp-step" id="qp-step-explore">
            <div class="qp-step-icon">👁️</div>
            <div class="qp-step-content">
              <div class="qp-step-title">EXPLORER</div>
              <div class="qp-step-subtitle">Gagne tes Points de Vision.</div>
            </div>
          </div>
          <div class="qp-step" id="qp-step-prepare">
            <div class="qp-step-icon">🏹</div>
            <div class="qp-step-content">
              <div class="qp-step-title">PRÉPARER</div>
              <div class="qp-step-subtitle">Collecte tes Munitions.</div>
            </div>
          </div>
          <div class="qp-step" id="qp-step-fight">
            <div class="qp-step-icon">⚔️</div>
            <div class="qp-step-content">
              <div class="qp-step-title" id="qp-fight-title">COMBATTRE</div>
              <div class="qp-step-subtitle">Affronte le Boss.</div>
            </div>
          </div>
          <div class="qp-step" id="qp-step-challenge">
            <div class="qp-step-icon">🔥</div>
            <div class="qp-step-content">
              <div class="qp-step-title" id="qp-challenge-title">DÉFIER</div>
              <div class="qp-step-subtitle">Mode Speedrun (Expert).</div>
            </div>
          </div>
        </div>
        <div class="qp-footer" id="qp-footer">
          <!-- Loot normal -->
          <div class="qp-loot-box" id="qp-loot-box">
            <div class="qp-loot-img" id="qp-loot-img"></div>
            <div class="qp-loot-text">
              <div class="qp-loot-label">Récompense de quête</div>
              <div class="qp-loot-name" id="qp-loot-name"></div>
              <div class="qp-loot-condition">Nécessite un score de 70% au Combat</div>
            </div>
          </div>
          <!-- Bandeau victoire CONQUIS (remplace le loot si quête maîtrisée) -->
          <div class="qp-victory" id="qp-victory">
            <div class="qp-victory-ribbon">
              <span class="qp-victory-crown">👑</span>
              <span class="qp-victory-title">CONQUIS</span>
              <span class="qp-victory-crown">👑</span>
            </div>
            <div class="qp-victory-body">
              <div class="qp-victory-loot">
                <span class="qp-victory-loot-img" id="qp-victory-loot-img"></span>
                <span class="qp-victory-loot-name" id="qp-victory-loot-name"></span>
              </div>
              <div class="qp-victory-score">
                <span class="qp-victory-score-label">Score</span>
                <span class="qp-victory-score-value" id="qp-victory-score-value">—</span>
              </div>
            </div>
            <button class="qp-victory-replay" id="qp-victory-replay" type="button">
              🔄 Rejouer pour améliorer
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  split.appendChild(splitPanel);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;display:inline-block;width:100%;border-radius:1rem;overflow:hidden;';

  const img = document.createElement('img');
  img.src = mapImg;
  img.style.cssText = 'width:100%;display:block;border-radius:1rem;';
  wrap.appendChild(img);

  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');
  wrap.appendChild(svg);

  function colorFilter(color, lit) {
    if (!lit) return 'brightness(0) invert(1)';
    const map = {
      '#ffffff': 'brightness(0) invert(1)',
      '#a855f7': 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1000%) hue-rotate(252deg) brightness(103%) contrast(96%)',
      '#22c55e': 'brightness(0) saturate(100%) invert(59%) sepia(75%) saturate(450%) hue-rotate(95deg) brightness(98%) contrast(93%)',
      '#f97316': 'brightness(0) saturate(100%) invert(55%) sepia(94%) saturate(800%) hue-rotate(6deg) brightness(103%) contrast(97%)',
      '#22d3ee': 'brightness(0) saturate(100%) invert(78%) sepia(60%) saturate(500%) hue-rotate(155deg) brightness(100%) contrast(97%)',
      '#f472b6': 'brightness(0) saturate(100%) invert(62%) sepia(80%) saturate(600%) hue-rotate(295deg) brightness(103%) contrast(95%)',
      '#facc15': 'brightness(0) saturate(100%) invert(85%) sepia(60%) saturate(800%) hue-rotate(5deg) brightness(105%) contrast(97%)',
    };
    return map[color] || 'brightness(0) invert(1)';
  }

  function drawPaw(wrap, iw, ih, cx, cy, angle, lit, color) {
    const el = document.createElement('img');
    el.src = 'img/paw.png';
    el.className = 'paw-print';
    const sizePx = Math.round(iw * 0.022);
    const pxX = cx / 100 * iw;
    const pxY = cy / 100 * ih;
    el.style.cssText = `
      position:absolute;
      left:${pxX}px; top:${pxY}px;
      width:${sizePx}px; height:${sizePx}px;
      transform:translate(-50%,-50%) rotate(${(angle * 180/Math.PI).toFixed(1)}deg);
      filter:${colorFilter(color, lit)};
      opacity:${lit ? 1 : 0.3};
      pointer-events:none;
      z-index:5;
    `;
    wrap.appendChild(el);
  }

  const pawsToDraw = [];
  allChaps.forEach((chap, i) => {
    if (i === 0) return;
    const prev = positions[i-1] || [50,50];
    const curr = positions[i]   || [50,50];
    const prevStatut = getStatut(allChaps[i-1].id);
    const lit = prevStatut === 'mastered';
    const pawColor = lit ? c : '#ffffff';

    const IW = 2744, IH = 1568;
    const dpx = (curr[0]-prev[0])/100 * IW;
    const dpy = (curr[1]-prev[1])/100 * IH;
    const distPx = Math.sqrt(dpx*dpx + dpy*dpy);
    const steps = Math.max(4, Math.round(distPx / 50));
    for (let s = 0; s < steps; s++) {
      const t  = (s + 0.5) / steps;
      const mx = (prev[0]+curr[0])/2;
      const my = (prev[1]+curr[1])/2 - 3;
      const bx = (1-t)*(1-t)*prev[0] + 2*(1-t)*t*mx + t*t*curr[0];
      const by = (1-t)*(1-t)*prev[1] + 2*(1-t)*t*my + t*t*curr[1];
      const dtx = 2*(1-t)*(mx-prev[0]) + 2*t*(curr[0]-mx);
      const dty = 2*(1-t)*(my-prev[1]) + 2*t*(curr[1]-my);
      const angle = Math.atan2(dty * IH, dtx * IW) + Math.PI/2;
      const offsetPctX = (30 / IW) * 100;
      const offsetPctY = (30 / IH) * 100;
      const offsetDir = (s % 2 === 0 ? 1.0 : -1.0);
      const px = bx + offsetDir * offsetPctX * Math.cos(angle - Math.PI/2);
      const py = by + offsetDir * offsetPctY * Math.sin(angle - Math.PI/2);
      pawsToDraw.push({px, py, angle, lit, color: pawColor});
    }
  });

  const nodes = [];
  allChaps.forEach((chap, i) => {
    const statut  = getStatut(chap.id);
    const isEmpty = (chap.quiz?.length||0)===0 && (chap.flashcards?.length||0)===0;
    const isNeo   = (i === lastActiveIdx);
    const loot    = chap.loot_quete || null;
    const pionSrc = QUEST_PIONS[chap.id];

    let pionFilter = '';
    let pionAnim   = 'none';
    let pionGlow   = '';
    let checkmark = '';

    if (isEmpty || statut === 'not-started') {
      pionFilter = 'grayscale(1) brightness(0.65) opacity(0.75)';
    } else if (statut === 'in-progress') {
      pionAnim = 'nodePulse 2.2s ease-in-out infinite';
      pionGlow = `drop-shadow(0 0 12px ${c}) drop-shadow(0 0 24px ${c}) drop-shadow(0 0 40px ${c}33)`;
    } else if (statut === 'mastered') {
      pionGlow = 'drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 16px #f59e0b) drop-shadow(0 0 32px #fbbf24) drop-shadow(0 0 48px rgba(251,191,36,0.8))';
      pionAnim = 'nodeGlow 2s ease-in-out infinite';
      checkmark = loot ? `<div style="position:absolute;top:-6px;right:-6px;width:32px;height:32px;border-radius:50%;background:#fbbf24;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.4rem;box-shadow:0 0 12px #f59e0b;line-height:1;">${loot.emoji}</div>` : '';
    }

    const lootTip  = loot ? `<div style="font-size:0.62rem;color:#fbbf24;font-weight:800;margin-top:5px;">${loot.emoji} ${loot.nom}</div>` : '';

    let statLabel, statColor, statEmoji;
    if (isEmpty) { statLabel='En préparation'; statColor='#64748b'; statEmoji='🏗️'; }
    else if (statut==='mastered') { statLabel='Maîtrisé'; statColor='#fbbf24'; statEmoji='✓'; }
    else if (statut==='in-progress') { statLabel='En cours'; statColor='#22d3ee'; statEmoji='⚡'; }
    else { statLabel='Disponible'; statColor=c; statEmoji='▶'; }
    const statutBadge = `<div style="display:inline-flex;align-items:center;gap:4px;background:${statColor}22;border:1px solid ${statColor}55;border-radius:9999px;padding:2px 9px;font-size:0.58rem;font-weight:800;color:${statColor};margin-top:5px;letter-spacing:0.03em;">${statEmoji} ${statLabel}</div>`;

    const progressBar = (statut==='in-progress') ? `<div style="height:3px;background:rgba(255,255,255,0.1);border-radius:9999px;overflow:hidden;margin-top:7px;"><div style="height:100%;width:55%;background:linear-gradient(90deg,${c},#22d3ee);border-radius:9999px;animation:tipProgress 2s ease-in-out infinite alternate;"></div></div>` : '';

    const miniPion = pionSrc ? `<img src="${pionSrc}" style="width:26px;height:26px;object-fit:contain;display:block;margin:0 auto 5px;${isEmpty?'filter:grayscale(1) brightness(0.65) opacity(0.75);':''}"/>` : '';

    const node = document.createElement('div');
    node.dataset.idx = i;
    node.style.cssText = 'position:absolute;transform:translate(-50%,-50%);z-index:10;cursor:' + (isEmpty?'default':'pointer') + ';';
    node.innerHTML = `
      ${isNeo ? `<img class="neo-pion" src="${neoSrc}" style="position:absolute;left:50%;object-fit:contain;filter:drop-shadow(0 0 10px ${c});animation:neoFloat 2.5s ease-in-out infinite;pointer-events:none;"/>` : ''}
      <div style="position:relative;">
        ${pionSrc
          ? `<img class="quest-pion" src="${pionSrc}" style="object-fit:contain;filter:${pionFilter}${pionGlow};animation:${pionAnim};transition:filter 0.3s, transform 0.25s;display:block;"/>`
          : `<div class="quest-pion quest-pion-fallback" style="border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;">${chap.icone_quete||'📍'}</div>`
        }
        ${checkmark}
      </div>
      <div class="map-tooltip" style="
        position:absolute;
        bottom:calc(100% + 10px);
        left:50%;
        transform:translateX(-50%) translateY(6px);
        min-width:160px;
        max-width:200px;
        background:rgba(10,6,30,0.85);
        backdrop-filter:blur(32px);
        -webkit-backdrop-filter:blur(32px);
        border:1px solid rgba(168,85,247,0.35);
        border-radius:1rem;
        padding:11px 15px;
        opacity:0;
        transition:opacity 0.22s, transform 0.22s;
        pointer-events:none;
        z-index:200;
        text-align:center;
        white-space:normal;
        box-shadow:0 8px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06);
      ">
        ${miniPion}
        <div style="font-size:0.75rem;font-weight:900;color:#fff;line-height:1.3;">${chap.nom_quete||chap.nom}</div>
        ${statutBadge}
        ${progressBar}
        ${lootTip}
        <div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(168,85,247,0.35);"></div>
      </div>
    `;

    node.addEventListener('mouseenter', () => {
      node.style.zIndex = '500';
      const tip = node.querySelector('.map-tooltip');
      const nodeTop = parseFloat(node.style.top);
      const nodeLeft = parseFloat(node.style.left);
      const ih = img.offsetHeight;
      const iw = img.offsetWidth;
      const tipWidth = 180;

      if (nodeTop < ih * 0.20) {
        tip.style.bottom = 'auto';
        tip.style.top = 'calc(100% + 10px)';
        const arrow = tip.querySelector('div[style*="border-top-color"]');
        if (arrow) {
          arrow.style.borderTopColor = 'transparent';
          arrow.style.borderBottomColor = 'rgba(168,85,247,0.4)';
          arrow.style.top = 'auto';
          arrow.style.bottom = '100%';
        }
      }
      if (nodeLeft + tipWidth/2 > iw * 0.95) {
        tip.style.transform = 'translateX(-80%) translateY(0)';
      } else if (nodeLeft - tipWidth/2 < iw * 0.05) {
        tip.style.transform = 'translateX(-20%) translateY(0)';
      } else {
        tip.style.transform = 'translateX(-50%) translateY(0)';
      }
      tip.style.opacity = '1';
      const img2 = node.querySelector('img.quest-pion');
      if(img2) img2.style.transform = 'scale(1.15)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.zIndex = '10';
      const tip = node.querySelector('.map-tooltip');
      tip.style.opacity = '0';
      tip.style.transform = (tip.style.transform||'').replace(/translateY\([^)]*\)/, '') + ' translateY(6px)';
      const img2 = node.querySelector('img.quest-pion');
      if(img2) img2.style.transform = 'scale(1)';
    });

    if (!isEmpty) {
      node.addEventListener('click', () => {
        playParchmentSound();
        nodes.forEach(n => n.classList.remove('quest-node-selected'));
        node.classList.add('quest-node-selected');

        const panel = document.querySelector('.quest-panel');
        if (panel) { panel.classList.remove('unroll'); void panel.offsetWidth; panel.classList.add('unroll'); }

        const statut = getStatut(chap.id);
        const videoVu   = !!localStorage.getItem(`neoquest_video_${chap.id}`);
        const fcVu      = !!localStorage.getItem(`neoquest_fc_${chap.id}`);
        const quizVu    = !!localStorage.getItem(`neoquest_quiz_${chap.id}`);
        const quizUnlock = videoVu || fcVu;
        const chronoUnlock = quizVu;

        const regionData = niveau.themes?.find(t => (t.chapitres||[]).some(ch => ch.id === chap.id));
        const regionColor = regionData?.couleur_region || c;
        const regionNom   = regionData?.nom_region || '';

        document.getElementById('qp-waiting').style.display = 'none';
        document.getElementById('qp-selected').style.display = 'flex';

        const panel2 = document.getElementById('quest-panel-main');
        if (panel2) {
          panel2.style.setProperty('--region-color', regionColor);
          panel2.classList.add('colored');
          panel2.style.borderColor = regionColor + '40';
          panel2.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), inset 0 0 40px ${regionColor}10`;
        }

        const pionSrc2 = QUEST_PIONS[chap.id] || '';
        document.getElementById('qp-header-img').src = pionSrc2;
        document.getElementById('qp-region-badge').textContent = `${regionData?.icone_region || '📍'} ${regionNom}`;
        document.getElementById('qp-region-badge').style.background = regionColor;
        document.getElementById('qp-title').textContent = chap.nom_quete || chap.nom;
        document.getElementById('qp-subtitle').textContent = chap.nom || '';

        _selectedChapId = chap.id;
        _selectedNiveauId = niveau.id;
        const goChapitre = (tab) => {
          if (typeof window.openQuestActivity === 'function') {
            window.openQuestActivity(chap, niveau, matiereData, tab);
          } else {
            window.location.href = `chapitre.html?matiere=${matiereId}&niveau=${niveau.id}&chapitre=${chap.id}&tab=${tab}`;
          }
        };

        const stepExplore   = document.getElementById('qp-step-explore');
        const stepPrepare   = document.getElementById('qp-step-prepare');
        const stepFight     = document.getElementById('qp-step-fight');
        const stepChallenge = document.getElementById('qp-step-challenge');

        stepExplore.style.cursor   = 'pointer';
        stepPrepare.style.cursor   = 'pointer';
        stepExplore.style.borderColor = regionColor + '55';
        stepPrepare.style.borderColor = regionColor + '55';

        stepExplore.onclick   = () => goChapitre('video');
        stepPrepare.onclick   = () => goChapitre('flashcards');

        if (quizUnlock) {
          stepFight.style.cursor  = 'pointer';
          stepFight.style.opacity = '1';
          stepFight.onclick = () => goChapitre('quiz');
          document.getElementById('qp-fight-title').textContent = '⚔️ COMBATTRE';
        } else {
          stepFight.style.cursor  = 'not-allowed';
          stepFight.style.opacity = '0.45';
          stepFight.onclick = null;
          document.getElementById('qp-fight-title').textContent = '🔒 COMBATTRE';
        }

        if (chronoUnlock) {
          stepChallenge.style.cursor  = 'pointer';
          stepChallenge.style.opacity = '1';
          stepChallenge.onclick = () => goChapitre('chrono');
          stepChallenge.querySelector('.qp-step-title').textContent = '🔥 DÉFIER';
        } else {
          stepChallenge.style.cursor  = 'not-allowed';
          stepChallenge.style.opacity = '0.45';
          stepChallenge.onclick = null;
          stepChallenge.querySelector('.qp-step-title').textContent = '🔒 DÉFIER';
        }

        if (chap.loot_quete) {
          document.getElementById('qp-loot-img').textContent  = chap.loot_quete.emoji;
          document.getElementById('qp-loot-name').textContent = `+50 XP & ${chap.loot_quete.nom}`;
        }

        const lootBox   = document.getElementById('qp-loot-box');
        const victoryEl = document.getElementById('qp-victory');
        if (statut === 'mastered') {
          if (panel2) panel2.classList.add('mastered');
          lootBox.style.display = 'none';
          victoryEl.classList.add('active');
          if (chap.loot_quete) {
            document.getElementById('qp-victory-loot-img').textContent  = chap.loot_quete.emoji;
            document.getElementById('qp-victory-loot-name').textContent = chap.loot_quete.nom;
          }
          document.getElementById('qp-victory-score-value').textContent = `${getPts(chap.id)} pts`;
          const replayBtn = document.getElementById('qp-victory-replay');
          replayBtn.style.background = `linear-gradient(135deg, ${regionColor}, #22d3ee)`;
          replayBtn.onclick = () => goChapitre('quiz');
        } else {
          if (panel2) panel2.classList.remove('mastered');
          lootBox.style.display = '';
          victoryEl.classList.remove('active');
        }
      });
    }

    wrap.appendChild(node);
    nodes.push(node);
  });

  function placeNodes() {
    const iw = img.offsetWidth;
    const ih = img.offsetHeight;
    if (!iw || !ih || !img.naturalWidth || !img.naturalHeight) {
      setTimeout(placeNodes, 100);
      return;
    }
    const pionSize = Math.max(40, Math.min(84, Math.round(iw * 0.093)));
    const neoSize  = Math.max(32, Math.round(pionSize * 0.72));
    wrap.querySelectorAll('.quest-pion').forEach(p => {
      p.style.width  = pionSize + 'px';
      p.style.height = pionSize + 'px';
      if (p.classList.contains('quest-pion-fallback')) {
        p.style.fontSize = (pionSize * 0.5) + 'px';
      }
    });
    wrap.querySelectorAll('.neo-pion').forEach(n => {
      n.style.width  = neoSize + 'px';
      n.style.height = neoSize + 'px';
      n.style.top    = `-${Math.round(neoSize * 0.7)}px`;
      n.style.transform = 'translateX(-50%)';
    });
    nodes.forEach((node, i) => {
      const pos = positions[i] || [50,50];
      node.style.left = (pos[0]/100 * iw) + 'px';
      node.style.top  = (pos[1]/100 * ih) + 'px';
    });
    wrap.querySelectorAll('.paw-print').forEach(p => p.remove());
    pawsToDraw.forEach(({px, py, angle, lit, color}) => {
      drawPaw(wrap, iw, ih, px, py, angle, lit, color || c);
      wrap.lastChild.classList.add('paw-print');
    });
  }

  img.addEventListener('load', placeNodes);
  window.addEventListener('resize', placeNodes);
  if (img.complete && img.naturalWidth && img.naturalHeight) placeNodes();
  else setTimeout(placeNodes, 400);

  splitMap.appendChild(wrap);
  container.appendChild(split);

  function syncPanelHeight() {
    const mapH = wrap.offsetHeight;
    if (mapH > 0) splitPanel.style.height = mapH + 'px';
  }
  if (img.complete && img.naturalWidth) syncPanelHeight();
  img.addEventListener('load', syncPanelHeight);
  window.addEventListener('resize', syncPanelHeight);
  if (window.ResizeObserver) {
    new ResizeObserver(syncPanelHeight).observe(wrap);
  }
}

function renderZigzag(niveau, c, lastActiveIdx, neoSrc, container) {
  const route = document.createElement('div');
  route.className = 'quest-route';

  const STATUS_ICON  = {'not-started':'📖','in-progress':'⚡','mastered':'✅'};
  const STATUS_LABEL = {'not-started':'Pas commencé','in-progress':'En cours','mastered':'Maîtrisé'};
  const STATUS_COL   = {'not-started':'rgba(255,255,255,0.1)','in-progress':'#fbbf24','mastered':'#22d3ee'};

  let globalIdx = 0;
  niveau.themes?.forEach(theme => {
    const regionNom  = theme.nom_region  || theme.nom;
    const regionIcon = theme.icone_region || '📍';
    const loot       = theme.loot_region  || null;
    const themeChaps = theme.chapitres || [];
    const allMastered = themeChaps.length > 0 && themeChaps.every(ch => getStatut(ch.id) === 'mastered');
    const lootHTML = loot ? `
      <div style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:0.5rem;
        background:${allMastered?'rgba(250,204,21,0.12)':'rgba(255,255,255,0.04)'};
        border:1px solid ${allMastered?'rgba(250,204,21,0.5)':'rgba(255,255,255,0.08)'};
        border-radius:9999px;padding:3px 12px;font-size:0.62rem;font-weight:800;
        color:${allMastered?'#fbbf24':'#334155'};">
        ${loot.emoji} ${allMastered ? loot.nom : '??? Objet légendaire'}
      </div>` : '';

    const lbl = document.createElement('div');
    lbl.className = 'theme-label';
    lbl.innerHTML = `
      <div style="display:inline-flex;flex-direction:column;align-items:center;gap:0.4rem;">
        <span style="font-size:0.68rem;font-weight:800;color:${c};text-transform:uppercase;letter-spacing:0.1em;background:${c}18;border:1px solid ${c}33;border-radius:9999px;padding:4px 16px;">
          ${regionIcon} ${regionNom}
        </span>
        ${lootHTML}
      </div>`;
    route.appendChild(lbl);

    theme.chapitres.forEach(chap => {
      const statut  = getStatut(chap.id);
      const pts     = getPts(chap.id);
      const pct2    = Math.min(100, Math.round((pts/200)*100));
      const isEmpty = (chap.quiz?.length||0)===0 && (chap.flashcards?.length||0)===0;
      const isNeo   = (globalIdx === lastActiveIdx);
      const isEven  = globalIdx % 2 === 0;
      const thumbBg = chap.youtube ? `background-image:url('https://img.youtube.com/vi/${chap.youtube}/mqdefault.jpg');` : '';

      const cardHTML = `
        <a href="#" class="quest-card ${isEmpty?'empty':statut}" data-chap-id="${chap.id}">
          <div class="quest-card-thumb" style="${thumbBg}"></div>
          <div class="quest-card-inner">
            <div class="quest-card-num">${chap.icone_quete||'📍'} Quête ${globalIdx+1}</div>
            <div class="quest-card-name">${chap.nom_quete || chap.nom}</div>
            <span class="quest-status-pill ${isEmpty?'not-started':statut}">
              ${isEmpty ? '🚧 Bientôt' : STATUS_LABEL[statut]}
            </span>
            ${statut!=='not-started'&&!isEmpty?`<div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${pct2}%;background:${STATUS_COL[statut]};"></div></div>`:''}
          </div>
        </a>`;

      const dotHTML = `
        <div class="quest-node-center">
          ${isNeo ? `<img class="neo-on-map" src="${neoSrc}" alt="Neo" />` : ''}
          <div class="quest-node-dot ${isEmpty?'empty':statut}">
            ${isEmpty ? '🔒' : STATUS_ICON[statut]}
          </div>
        </div>`;
      const spacer = `<div class="quest-spacer"></div>`;
      const node = document.createElement('div');
      node.className = 'quest-node';
      node.innerHTML = isEven ? cardHTML + dotHTML + spacer : spacer + dotHTML + cardHTML;
      route.appendChild(node);
      globalIdx++;
    });
  });

  route.addEventListener('click', (e) => {
    const card = e.target.closest('.quest-card[data-chap-id]');
    if (!card || card.classList.contains('empty')) return;
    e.preventDefault();
    const chapId = card.dataset.chapId;
    const chap = niveau.themes?.flatMap(t => t.chapitres).find(c => c.id === chapId);
    if (chap && typeof window.openQuestActivity === 'function') {
      _selectedChapId = chapId;
      window.openQuestActivity(chap, niveau, matiereData, 'video');
    }
  });
  container.appendChild(route);
}
