// ── Modal Vidéo ──
(function() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="qa-overlay" id="qa-modal-video">
      <button class="qa-close" onclick="closeQuestActivity()">✕</button>
      <div class="qa-video-box">
        <img class="qa-cadre-img" id="qa-cadre-img" src="img/cadre-historya.png" alt=""/>
        <div class="qa-video-content">
          <div class="qa-video-title" style="visibility:hidden;">🎬 <span id="qa-video-chap-name"></span></div>
          <div class="qa-video-layout">
            <div class="qa-frame-wrap" id="qa-frame-wrap">
              <div class="video-wrapper">
                <iframe id="qa-yt-frame" src="" title="Vidéo NeoQuest" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>
                <div id="qa-yt-fallback" style="display:none;position:absolute;inset:0;background:rgba(8,6,26,0.95);flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;text-align:center;">
                  <div style="font-size:2.5rem;">🎬</div>
                  <p style="color:#94a3b8;font-size:0.9rem;max-width:280px;line-height:1.6;">La vidéo ne peut pas être lue ici.<br/>Regarde-la directement sur YouTube.</p>
                  <a id="qa-yt-fallback-link" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:0.6rem;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:9999px;padding:0.75rem 1.8rem;font-weight:800;color:#fff;text-decoration:none;font-size:0.95rem;font-family:'Nunito',sans-serif;">▶ Voir sur YouTube</a>
                </div>
              </div>
            </div>
            <div class="qa-lantern-col" id="qa-video-lantern-col"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
})();

const VIDEO_THEMES = {
  'histoire-geo':    { cadre: 'historya' },
  'svt':             { cadre: 'bioverde' },
  'physique-chimie': { cadre: 'quantix' },
  'maths':           { cadre: 'algebron' },
  'francais':        { cadre: 'lexoria' }
};

const VIDEO_ECLATS = 5;
let _videoChapId = null;
let _videoEclatsThisChap = 0;

function _videoEclatsKey(id) { return `neoquest_video_eclats_${id}`; }
function _loadVideoEclats(chapId) {
  try { return Math.max(0, parseInt(localStorage.getItem(_videoEclatsKey(chapId)) || '0', 10)); }
  catch(e) { return 0; }
}
function _saveVideoEclats(chapId, n) {
  try { localStorage.setItem(_videoEclatsKey(chapId), String(n)); } catch(e) {}
}

function _earnVideoEclat() {
  if (_videoEclatsThisChap >= VIDEO_ECLATS) return;
  _videoEclatsThisChap++;
  if (_videoChapId) _saveVideoEclats(_videoChapId, _videoEclatsThisChap);
  if (typeof window.addLanternEclats === 'function') window.addLanternEclats(1);
}

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
        if (e.data === YT.PlayerState.ENDED) _awardRemainingVideoEclats();
      },
      onError: () => { document.getElementById('qa-yt-fallback').style.display = 'flex'; }
    }
  });
}

function _awardRemainingVideoEclats() {
  const missing = Math.max(0, VIDEO_ECLATS - _videoEclatsThisChap);
  for (let i = 0; i < missing; i++) {
    setTimeout(() => _earnVideoEclat(), i * 450);
  }
}

function _startLanternPoll() {
  _stopLanternPoll();
  ytPollInterval = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    const dur = ytPlayer.getDuration();
    if (dur <= 0) return;
    const ratio = ytPlayer.getCurrentTime() / dur;
    const earned = Math.min(Math.floor(ratio * VIDEO_ECLATS + 0.05), VIDEO_ECLATS);
    if (earned > _videoEclatsThisChap) _earnVideoEclat();
  }, 500);
}

function _stopLanternPoll() {
  if (ytPollInterval) { clearInterval(ytPollInterval); ytPollInterval = null; }
}

window.stopQuestVideo = function() {
  _stopLanternPoll();
  if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
    try { ytPlayer.stopVideo(); } catch(e) {}
  } else {
    const frame = document.getElementById('qa-yt-frame');
    if (frame) frame.src = '';
  }
  pendingYtId = null;
};

function openVideoModal(chap, mat) {
  _videoChapId = chap.id;
  _videoEclatsThisChap = _loadVideoEclats(chap.id);

  const chapNameEl = document.getElementById('qa-video-chap-name');
  if (chapNameEl) chapNameEl.textContent = chap.nom || '';

  const theme = VIDEO_THEMES[mat?.id] || { flavor: '', cadre: 'historya' };
  const cadreImg = document.getElementById('qa-cadre-img');
  if (cadreImg && theme.cadre) {
    cadreImg.src = `img/cadre-${theme.cadre}.png`;
  }

  if (typeof window.mountLantern === 'function') {
    window.mountLantern(document.getElementById('qa-video-lantern-col'), chap.id, { label: 'Énergie' });
  }

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
