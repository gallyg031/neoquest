// ── Modal Vidéo ──
(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-video">
      <button class="qa-close" onclick="closeQuestActivity()">✕</button>
      <div class="qa-video-box">
        <div class="qa-video-title">🎬 <span id="qa-video-chap-name"></span></div>
        <div class="qa-video-layout">
          <div class="qa-frame-wrap" id="qa-frame-wrap">
            <div class="qa-frame-inner">
              <div class="video-wrapper">
                <iframe id="qa-yt-frame" src="" title="Vidéo NeoQuest" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
                <div id="qa-yt-fallback" style="display:none;position:absolute;inset:0;background:rgba(8,6,26,0.95);flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;text-align:center;">
                  <div style="font-size:2.5rem;">🎬</div>
                  <p style="color:#94a3b8;font-size:0.9rem;max-width:280px;line-height:1.6;">La vidéo ne peut pas être lue ici.<br/>Regarde-la directement sur YouTube.</p>
                  <a id="qa-yt-fallback-link" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.6rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:9999px;padding:0.75rem 1.8rem;font-weight:800;color:#fff;text-decoration:none;font-size:0.95rem;font-family:'Nunito',sans-serif;">▶ Voir sur YouTube</a>
                </div>
              </div>
            </div>
            <div class="qa-flavor-text" id="qa-flavor-text"></div>
          </div>
          <div class="qa-lantern-col">
            <div class="qa-lantern-wrap" id="qa-lantern-wrap">
              <img class="qa-lantern-img" id="qa-lantern-img" src="assets/lantern_0.png" alt="Lanterne"/>
            </div>
            <span class="qa-lantern-label">Énergie</span>
            <span class="qa-lantern-pct" id="qa-lantern-pct">0 éclat</span>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
})();

const VIDEO_THEMES = {
  'histoire-geo':    { cls: 'vf-medieval', flavor: 'Neo observe la tapisserie… les pierres gardent leurs secrets.' },
  'svt':             { cls: 'vf-nature',   flavor: 'Neo s\'aventure dans la forêt vivante… les plantes murmurent.' },
  'physique-chimie': { cls: 'vf-circuit',  flavor: 'Neo analyse les flux d\'énergie… le courant ne ment pas.' },
  'maths':           { cls: 'vf-rune',     flavor: 'Neo déchiffre les runes… les nombres révèlent leur ordre.' },
  'francais':        { cls: 'vf-scroll',   flavor: 'Neo déroule le parchemin… les mots prennent vie.' }
};

const LANTERN_IMGS = [
  'assets/lantern_0.png',
  'assets/lantern_25.png',
  'assets/lantern_50.png',
  'assets/lantern_75.png',
  'assets/lantern_100.png'
];

const VIDEO_ECLATS = 5;

let _lanternChapId = null;
let _currentEclats = 0;

function _lanternKey(id) { return `neoquest_lantern_${id}`; }

function _loadEclats(chapId) {
  try { return Math.max(0, parseInt(localStorage.getItem(_lanternKey(chapId)) || '0', 10)); }
  catch(e) { return 0; }
}

function _saveEclats(chapId, n) {
  try { localStorage.setItem(_lanternKey(chapId), String(n)); } catch(e) {}
}

function _updateLanternDisplay(n) {
  const img = document.getElementById('qa-lantern-img');
  const label = document.getElementById('qa-lantern-pct');
  if (img) img.src = LANTERN_IMGS[Math.min(n, LANTERN_IMGS.length - 1)];
  if (label) label.textContent = n === 1 ? '1 éclat' : `${n} éclats`;
}

function _spawnEclatAnim(onDone) {
  const wrap = document.getElementById('qa-lantern-wrap');
  if (!wrap) { onDone && onDone(); return; }
  const eclat = document.createElement('img');
  eclat.src = 'assets/eclat.png';
  eclat.className = 'qa-eclat-fly';
  eclat.alt = 'éclat';
  eclat.onanimationend = () => { eclat.remove(); onDone && onDone(); };
  wrap.appendChild(eclat);
}

function _earnEclat() {
  const newCount = _currentEclats + 1;
  _currentEclats = newCount;
  if (_lanternChapId) _saveEclats(_lanternChapId, newCount);
  _spawnEclatAnim(() => _updateLanternDisplay(newCount));
}

window.addLanternEclats = function(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => _earnEclat(), i * 400);
  }
};

window.resetLantern = function() {
  _stopLanternPoll();
  if (_lanternChapId) {
    _currentEclats = _loadEclats(_lanternChapId);
    _updateLanternDisplay(_currentEclats);
  }
};

// ── YouTube IFrame API ──
let ytPlayer = null, ytPollInterval = null;
let ytAPIReady = false, ytAPILoading = false, pendingYtId = null;

window.onYouTubeIframeAPIReady = function() {
  ytAPIReady = true;
  if (pendingYtId) { _createOrLoadPlayer(pendingYtId); pendingYtId = null; }
};

function _loadYTAPI() {
  if (ytAPILoading || ytAPIReady) return;
  ytAPILoading = true;
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

function _createOrLoadPlayer(ytId) {
  if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById(ytId);
    return;
  }
  const frame = document.getElementById('qa-yt-frame');
  if (frame) frame.src = `https://www.youtube.com/embed/${ytId}?enablejsapi=1`;
  ytPlayer = new YT.Player('qa-yt-frame', {
    events: {
      onReady: () => _startLanternPoll(),
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) _startLanternPoll();
        else _stopLanternPoll();
      },
      onError: () => { document.getElementById('qa-yt-fallback').style.display = 'flex'; }
    }
  });
}

function _startLanternPoll() {
  _stopLanternPoll();
  ytPollInterval = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    const dur = ytPlayer.getDuration();
    if (dur <= 0) return;
    const earned = Math.min(Math.floor((ytPlayer.getCurrentTime() / dur) * VIDEO_ECLATS), VIDEO_ECLATS);
    if (earned > _currentEclats) _earnEclat();
  }, 500);
}

function _stopLanternPoll() {
  if (ytPollInterval) { clearInterval(ytPollInterval); ytPollInterval = null; }
}

window.stopQuestVideo = function() {
  if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
    try { ytPlayer.stopVideo(); } catch(e) {}
  } else {
    const frame = document.getElementById('qa-yt-frame');
    if (frame) frame.src = '';
  }
  pendingYtId = null;
};

function openVideoModal(chap, mat) {
  _lanternChapId = chap.id;
  document.getElementById('qa-video-chap-name').textContent = chap.nom || '';

  const wrap = document.getElementById('qa-frame-wrap');
  const flavorEl = document.getElementById('qa-flavor-text');
  wrap.className = 'qa-frame-wrap';
  const theme = VIDEO_THEMES[mat?.id] || { cls: 'vf-medieval', flavor: '' };
  wrap.classList.add(theme.cls);
  if (flavorEl) flavorEl.textContent = theme.flavor;

  _currentEclats = _loadEclats(chap.id);
  _updateLanternDisplay(_currentEclats);

  const ytId = chap.youtube;
  if (ytId) {
    document.getElementById('qa-yt-fallback').style.display = 'none';
    document.getElementById('qa-yt-fallback-link').href = `https://www.youtube.com/watch?v=${ytId}`;
    _loadYTAPI();
    if (ytAPIReady) _createOrLoadPlayer(ytId);
    else pendingYtId = ytId;
  }

  const frame = document.getElementById('qa-yt-frame');
  if (frame) frame.parentElement.onclick = () => { if (typeof window.pomoActivity === 'function') window.pomoActivity('video'); };

  document.getElementById('qa-modal-video').classList.add('active');
  document.body.style.overflow = 'hidden';
}
