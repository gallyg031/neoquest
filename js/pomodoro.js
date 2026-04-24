// Chrono Pomodoro flottant — widget autonome
// Expose : window.nqAudio (AudioContext partagé), window.pomoActivity(src)
(function() {
  'use strict';

  // ── AudioContext partagé (utilisé aussi par quest-modal.js) ──
  if (!window.nqAudio) {
    window.nqAudio = {
      _ctx: null,
      get() {
        if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        return this._ctx;
      }
    };
  }
  function getAudio() { return window.nqAudio.get(); }

  // ── CSS injection ──
  const style = document.createElement('style');
  style.textContent = `
    .pomo-wrap { position:relative; overflow:hidden; transition:box-shadow 0.8s ease, border-color 0.8s ease; }
    .pomo-wrap.glow-1 { box-shadow:0 0 8px rgba(34,211,238,0.25); border-color:rgba(34,211,238,0.4)!important; }
    .pomo-wrap.glow-2 { box-shadow:0 0 14px rgba(34,211,238,0.4); border-color:rgba(34,211,238,0.55)!important; }
    .pomo-wrap.glow-3 { box-shadow:0 0 22px rgba(34,211,238,0.55); border-color:rgba(34,211,238,0.7)!important; }
    .pomo-wrap.glow-4 { box-shadow:0 0 32px rgba(34,211,238,0.7); border-color:rgba(34,211,238,0.85)!important; }
    .pomo-wrap.glow-5 { box-shadow:0 0 44px rgba(34,211,238,0.85),0 0 80px rgba(168,85,247,0.3); border-color:#22d3ee!important; }
    .pomo-wrap.glow-done { box-shadow:0 0 60px rgba(34,211,238,1),0 0 120px rgba(168,85,247,0.5); border-color:#22d3ee!important; animation:glowPulseP 1s ease infinite; }
    @keyframes glowPulseP { 0%,100%{box-shadow:0 0 40px rgba(34,211,238,0.8)} 50%{box-shadow:0 0 80px rgba(34,211,238,1)} }
    .pomo-wrap.break-mode { border-color:rgba(251,191,36,0.6)!important; box-shadow:0 0 20px rgba(251,191,36,0.3); }
    .pdur-btn { padding:3px 0; border-radius:5px; background:rgba(255,255,255,0.03); border:1px solid rgba(168,85,247,0.2); color:#64748b; font-weight:700; font-size:11px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
    .pdur-btn:hover  { border-color:rgba(168,85,247,0.6); color:#c4b5fd; }
    .pdur-btn.active { background:rgba(34,211,238,0.12); border-color:#22d3ee; color:#22d3ee; }
    .pbtn-start { flex:1; padding:8px; border-radius:8px; background:linear-gradient(135deg,#7c3aed,#06b6d4); border:none; color:#fff; font-weight:800; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif; }
    .pbtn-reset { padding:8px 10px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#64748b; font-weight:700; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif; }
    .pbtn-reset:hover { color:#fff; }
    .p-book { width:8px; border-radius:2px 2px 0 0; transition:height 0.8s ease, opacity 0.8s ease; }
    .p-sdot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.1); transition:background 0.4s; }
    .p-sdot.done { background:#22d3ee; }
    @keyframes pBubblePop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
    .pbubble-pop { animation:pBubblePop 0.35s ease forwards; }
    .p-compact-dot { width:7px; height:7px; border-radius:50%; background:#22d3ee; flex-shrink:0; }
    .p-compact-dot.prunning { animation:pdotPulse 1s ease infinite; }
    .p-compact-dot.ppaused  { background:#f472b6; }
    .p-compact-dot.pbreak   { background:#fbbf24; animation:pdotPulse 1s ease infinite; }
    @keyframes pdotPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
  `;
  document.head.appendChild(style);

  // ── HTML injection ──
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;bottom:5rem;right:1.25rem;z-index:1000;font-family:\'Nunito\',sans-serif;';
  container.innerHTML = `
    <!-- Pill compacte -->
    <div id="p-compact" style="display:none;align-items:center;gap:8px;background:rgba(8,6,26,0.92);backdrop-filter:blur(16px);border:1px solid rgba(34,211,238,0.4);border-radius:9999px;padding:5px 12px 5px 5px;cursor:pointer;box-shadow:0 0 16px rgba(34,211,238,0.2);">
      <img src="img/Neo_assis.png" alt="Neo" style="width:28px;height:28px;object-fit:contain;border-radius:50%;background:rgba(168,85,247,0.15);padding:2px;" id="p-cneo-img" />
      <span id="p-ctime" style="font-size:14px;font-weight:900;color:#e2e8f0;font-variant-numeric:tabular-nums;">--:--</span>
      <svg width="24" height="24" style="transform:rotate(-90deg);flex-shrink:0;">
        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(34,211,238,0.2)" stroke-width="2.5"/>
        <circle id="p-cring" cx="12" cy="12" r="9" fill="none" stroke="#22d3ee" stroke-width="2.5"
          stroke-linecap="round" stroke-dasharray="56.5" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear;"/>
      </svg>
    </div>
    <!-- Panel complet -->
    <div id="p-full" class="pomo-wrap" style="background:rgba(8,6,26,0.95);backdrop-filter:blur(20px);border:1px solid rgba(168,85,247,0.35);border-radius:1.25rem;padding:1.1rem;width:252px;box-shadow:0 0 30px rgba(168,85,247,0.15);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
        <span style="font-weight:900;font-size:0.9rem;color:#fff;">⏱️ Chrono NeoQuest</span>
        <button onclick="pCollapse()" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:2px 8px;font-size:11px;color:#64748b;cursor:pointer;font-family:'Nunito',sans-serif;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#64748b'">— Réduire</button>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:0.6rem;position:relative;">
        <div id="p-neo-glow" style="position:absolute;width:70px;height:70px;border-radius:50%;background:rgba(34,211,238,0.12);filter:blur(14px);opacity:0.1;transition:opacity 0.8s,transform 0.8s;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
        <div id="p-neo" style="font-size:48px;line-height:1;position:relative;z-index:1;transition:filter 0.5s;">🦊</div>
        <div id="p-books" style="display:flex;gap:2px;justify-content:center;align-items:flex-end;height:18px;margin-top:4px;"></div>
      </div>
      <div id="p-bubble" style="background:rgba(255,255,255,0.05);border:1px solid rgba(168,85,247,0.2);border-radius:10px;padding:6px 10px;font-size:11px;color:#cbd5e1;line-height:1.4;text-align:center;margin-bottom:0.75rem;">Choisis ta durée et c'est parti !</div>
      <div style="display:flex;justify-content:center;margin-bottom:0.75rem;">
        <div style="position:relative;width:100px;height:100px;">
          <svg width="100" height="100" style="transform:rotate(-90deg);">
            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
            <circle id="p-ring" cx="50" cy="50" r="43" fill="none" stroke="url(#pmg)" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="270.2" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear;"/>
            <defs><linearGradient id="pmg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7F77DD" id="pmg1"/><stop offset="100%" stop-color="#22d3ee" id="pmg2"/>
            </linearGradient></defs>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <span id="p-time" style="font-size:1.4rem;font-weight:900;color:#fff;line-height:1;font-variant-numeric:tabular-nums;">--:--</span>
            <span id="p-phase" style="font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-top:2px;">Prêt</span>
          </div>
        </div>
      </div>
      <div id="p-setup">
        <div style="font-size:10px;color:#64748b;text-align:center;margin-bottom:5px;font-weight:700;">Durée de travail</div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:3px;margin-bottom:8px;">
          <button class="pdur-btn" onclick="pSetD(5)">5'</button>
          <button class="pdur-btn" onclick="pSetD(10)">10'</button>
          <button class="pdur-btn" onclick="pSetD(15)">15'</button>
          <button class="pdur-btn active" onclick="pSetD(30)">30'</button>
          <button class="pdur-btn" onclick="pSetD(45)">45'</button>
          <button class="pdur-btn" onclick="pSetD(60)">60'</button>
        </div>
        <div style="font-size:9px;color:#475569;text-align:center;margin-bottom:8px;">☕ Pause 5 min après chaque session</div>
        <div style="font-size:10px;color:#64748b;text-align:center;margin-bottom:5px;font-weight:700;">Nombre de cycles</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:8px;">
          <button class="pdur-btn" onclick="pSetCycles(1)">1</button>
          <button class="pdur-btn active" onclick="pSetCycles(2)">2</button>
          <button class="pdur-btn" onclick="pSetCycles(3)">3</button>
          <button class="pdur-btn" onclick="pSetCycles(4)">4</button>
          <button class="pdur-btn" onclick="pSetCycles(5)">5</button>
        </div>
      </div>
      <div style="display:flex;gap:5px;margin-bottom:8px;">
        <button class="pbtn-start" id="p-startbtn" onclick="pStart()">▶ Démarrer</button>
        <button class="pbtn-reset" onclick="pReset()">↺</button>
      </div>
      <div style="display:flex;justify-content:center;gap:4px;margin-bottom:4px;" id="p-sess"></div>
      <div style="text-align:center;font-size:10px;color:#475569;font-weight:700;" id="p-cycles-lbl">Cycle 1 / 2</div>
    </div>
  `;
  document.body.appendChild(container);

  // ── Logique pomodoro ──
  const P_BREAK = 5 * 60, P_RING = 270.2, P_CRING = 56.5, P_IDLE = 30;
  const P_DURS = [5, 10, 15, 30, 45, 60];
  const P_BOOK_COLORS = ['#7F77DD','#22d3ee','#f472b6','#fbbf24','#4ade80','#a855f7','#06b6d4','#c084fc'];
  const P_MESSAGES = [
    {pct:0,  txt:"C'est parti pour la quête du savoir ! 🚀"},
    {pct:10, txt:"Bien démarré ! Chaque minute compte."},
    {pct:20, txt:"Tu construis ton savoir brique par brique 🧱"},
    {pct:30, txt:"Neo est fier de toi, continue !"},
    {pct:40, txt:"Tu es dans la zone ! Reste focus 🎯"},
    {pct:50, txt:"La moitié du chemin est faite ! 💪"},
    {pct:60, txt:"Le savoir s'accumule dans ta tête 🧠"},
    {pct:70, txt:"Dernière ligne droite, ne lâche rien !"},
    {pct:80, txt:"80% ! Les grands explorateurs ne s'arrêtent pas 🗺️"},
    {pct:90, txt:"Presque fini ! Encore un effort ⚡"},
    {pct:95, txt:"Les dernières secondes sont les plus précieuses ✨"},
  ];
  const P_BREAK_MSGS = ["Ding ! Pose ton stylo, va boire un verre d'eau ! 🍎","Repose tes yeux, regarde au loin 30 secondes 👀","Étire-toi, bouge un peu ! 🌿","Pause méritée ! Tu as bien bossé 🌟"];
  const P_IDLE_MSG = "C'est pas grave, on reprend la quête quand tu es prêt !";

  let pDur = 30*60, pRem = pDur, pRun = false, pBreak = false, pStarted = false;
  let pIdle = 0, pSess = 0, pLastBubbleMin = -1, pTicker = null, pMaxCycles = 2, pIdlePaused = false;

  function pFmt(s){return`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
  function pGetNeo(pct){if(pBreak)return'😌';if(!pStarted)return'🦊';if(pct<40)return'🤩';if(pct<75)return'😤';if(pct<95)return'😅';return'🥵';}
  function pGetMsg(pct){if(pBreak)return P_BREAK_MSGS[pSess%P_BREAK_MSGS.length];let best=P_MESSAGES[0];for(const m of P_MESSAGES){if(pct>=m.pct)best=m;}return best.txt;}
  function pSetBubble(txt){const el=document.getElementById('p-bubble');el.style.opacity='0';setTimeout(()=>{el.textContent=txt;el.classList.add('pbubble-pop');el.style.opacity='1';setTimeout(()=>el.classList.remove('pbubble-pop'),350);},200);}
  function pRenderBooks(pct){const row=document.getElementById('p-books');const n=8, left=Math.ceil(n*(1-pct/100));row.innerHTML='';for(let i=0;i<n;i++){const b=document.createElement('div');b.className='p-book';b.style.height=(i<left?(10+i*1.5):0)+'px';b.style.opacity=i<left?'1':'0';b.style.background=P_BOOK_COLORS[i];row.appendChild(b);}}
  function pGlowLevel(pct){const w=document.getElementById('p-full');w.className='pomo-wrap';if(pBreak){w.classList.add('break-mode');return;}if(pct>=95)w.classList.add('glow-5');else if(pct>=75)w.classList.add('glow-4');else if(pct>=55)w.classList.add('glow-3');else if(pct>=35)w.classList.add('glow-2');else if(pct>=15)w.classList.add('glow-1');}

  function pUpdateUI(){
    const total=pBreak?P_BREAK:pDur;
    const pct=Math.round((1-pRem/total)*100);
    const off=P_RING*(pRem/total);
    const coff=P_CRING*(pRem/total);
    document.getElementById('p-ring').style.strokeDashoffset=off;
    document.getElementById('p-cring').style.strokeDashoffset=coff;
    document.getElementById('p-time').textContent=pFmt(pRem);
    document.getElementById('p-ctime').textContent=pFmt(pRem);
    const ph=pBreak?'☕ Pause':(pRun?'📚 Travail':(pIdlePaused?'⏸ Inactif':(pStarted?'⏸ Pausé':'Prêt')));
    document.getElementById('p-phase').textContent=ph;
    const cimg=document.getElementById('p-cneo-img');
    if(cimg){cimg.style.filter=pBreak?'hue-rotate(40deg)':'';}
    document.getElementById('p-neo').textContent=pGetNeo(pct);
    const g=document.getElementById('p-neo-glow');
    g.style.opacity=pStarted?Math.min(0.9,0.1+pct/100*0.8):'0.1';
    g.style.transform=`translate(-50%,-50%) scale(${1+pct/200})`;
    const mg1=document.getElementById('pmg1'),mg2=document.getElementById('pmg2');
    if(pBreak){mg1.setAttribute('stop-color','#f97316');mg2.setAttribute('stop-color','#fbbf24');}
    else{mg1.setAttribute('stop-color','#7F77DD');mg2.setAttribute('stop-color','#22d3ee');}
    if(pStarted&&!pBreak)pRenderBooks(pct);
    pGlowLevel(pct);
    const sr=document.getElementById('p-sess');sr.innerHTML='';
    for(let i=0;i<pMaxCycles;i++){const d=document.createElement('div');d.className='p-sdot'+(i<pSess?' done':'');sr.appendChild(d);}
    const cl=document.getElementById('p-cycles-lbl');
    if(cl)cl.textContent=pSess>=pMaxCycles?'🎉 Objectif atteint !':`Cycle ${pSess+1} / ${pMaxCycles}`;
  }

  function pTick(){
    if(!pRun)return;
    pIdle++;
    if(pIdle>=P_IDLE&&!pBreak){
      pRun=false;pIdlePaused=true;
      document.getElementById('p-startbtn').textContent='▶ Reprendre';
      document.getElementById('p-startbtn').onclick=pResumeFromIdle;
      pUpdateUI();return;
    }
    const total=pBreak?P_BREAK:pDur;
    const pct=Math.round((1-pRem/total)*100);
    const elapsed=Math.floor((total-pRem)/60);
    if(elapsed>0&&elapsed%5===0&&elapsed!==pLastBubbleMin){pLastBubbleMin=elapsed;pSetBubble(pGetMsg(pct));}
    if(pRem>0){pRem--;pUpdateUI();}
    else{
      pRun=false;
      if(!pBreak){
        pSess++;
        if(pSess>=pMaxCycles){
          pBreak=false;pStarted=false;
          document.getElementById('p-setup').style.display='block';
          document.getElementById('p-startbtn').textContent='▶ Démarrer';
          document.getElementById('p-startbtn').onclick=pStart;
          pSetBubble('🎉 Bravo ! Tu as complété tous tes cycles !');
          pPlayDone('work');
          const w=document.getElementById('p-full');
          w.classList.add('glow-done');setTimeout(()=>w.classList.remove('glow-done'),3000);
        } else {
          pBreak=true;pRem=P_BREAK;pRun=true;pIdle=0;
          pSetBubble(P_BREAK_MSGS[pSess%P_BREAK_MSGS.length]);
          pPlayDone('work');
          const w=document.getElementById('p-full');
          w.classList.add('glow-done');setTimeout(()=>w.classList.remove('glow-done'),3000);
        }
      } else {
        pBreak=false;pRem=pDur;pRun=true;pIdle=0;pLastBubbleMin=-1;
        pSetBubble(pGetMsg(0));pPlayDone('break');
        document.getElementById('p-startbtn').textContent='⏸ Pause';
        document.getElementById('p-startbtn').onclick=pPause;
      }
      pUpdateUI();
    }
  }

  function pPlayDone(type){
    try{
      const ctx=getAudio();
      if(type==='work'){
        [[523,0,0.2],[659,0.15,0.2],[784,0.3,0.2],[1047,0.5,0.35]].forEach(([f,d,l])=>{
          const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
          o.type='sine';o.frequency.value=f;const t=ctx.currentTime+d;
          g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.15,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+l);
          o.start(t);o.stop(t+l);
        });
      } else {
        const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
        o.type='sine';o.frequency.value=440;
        g.gain.setValueAtTime(0.1,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);
        o.start();o.stop(ctx.currentTime+0.6);
      }
    }catch(e){}
  }

  function pResumeFromIdle(){pRun=true;pIdlePaused=false;pIdle=0;document.getElementById('p-startbtn').textContent='⏸ Pause';document.getElementById('p-startbtn').onclick=pPause;pUpdateUI();}
  function pStart(){pRun=true;pStarted=true;pIdle=0;pLastBubbleMin=-1;pIdlePaused=false;pSess=0;document.getElementById('p-setup').style.display='none';document.getElementById('p-startbtn').textContent='⏸ Pause';document.getElementById('p-startbtn').onclick=pPause;pSetBubble(pGetMsg(0));pRenderBooks(0);pUpdateUI();}
  function pPause(){pRun=false;pIdlePaused=false;document.getElementById('p-startbtn').textContent='▶ Reprendre';document.getElementById('p-startbtn').onclick=pResumeFromIdle;pSetBubble(P_IDLE_MSG);pUpdateUI();}
  function pReset(){pRun=false;pBreak=false;pStarted=false;pRem=pDur;pIdle=0;pLastBubbleMin=-1;pSess=0;pIdlePaused=false;document.getElementById('p-setup').style.display='block';document.getElementById('p-startbtn').textContent='▶ Démarrer';document.getElementById('p-startbtn').onclick=pStart;document.getElementById('p-full').className='pomo-wrap';pSetBubble("Choisis ta durée et c'est parti !");document.getElementById('p-books').innerHTML='';pUpdateUI();}
  function pSetD(min){pDur=min*60;pRem=pDur;document.querySelectorAll('.pdur-btn').forEach((b,i)=>{if(i<P_DURS.length)b.classList.toggle('active',P_DURS[i]===min);});pUpdateUI();}
  function pSetCycles(n){pMaxCycles=n;const allBtns=document.querySelectorAll('.pdur-btn');const cycleBtns=Array.from(allBtns).slice(6);cycleBtns.forEach((b,i)=>b.classList.toggle('active',i+1===n));pUpdateUI();}
  function pCollapse(){document.getElementById('p-full').style.display='none';document.getElementById('p-compact').style.display='flex';pUpdateUI();}
  function pExpand(){document.getElementById('p-compact').style.display='none';document.getElementById('p-full').style.display='block';pUpdateUI();}

  // Appelée par flipCard, answer, et video play (depuis quest-modal.js)
  function pomoActivity(src){
    pIdle=0;
    if(pStarted&&!pRun&&!pBreak){
      pRun=true;pIdlePaused=false;
      document.getElementById('p-startbtn').textContent='⏸ Pause';
      document.getElementById('p-startbtn').onclick=pPause;
    }
  }

  // Exposer les fonctions onclick globalement
  window.pStart = pStart;
  window.pPause = pPause;
  window.pReset = pReset;
  window.pSetD = pSetD;
  window.pSetCycles = pSetCycles;
  window.pCollapse = pCollapse;
  window.pExpand = pExpand;
  window.pResumeFromIdle = pResumeFromIdle;
  window.pomoActivity = pomoActivity;

  pTicker = setInterval(pTick, 1000);
  pRenderBooks(0);
  pUpdateUI();
})();
