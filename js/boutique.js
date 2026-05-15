// ── NeoQuest — Le Bazar du Hibou ──
// Page boutique.html : catégories, achat, persistance.

// ─────────────────────────────────────────
// Catalogue d'items (MVP : skins + consommables)
// ─────────────────────────────────────────
const BAZAR_ITEMS = [
  // Skins de Neo
  { id:'skin-chevalier',  cat:'skins', name:'Neo Chevalier',
    desc:'Armure brillante pour intimider les Boss les plus rudes.',
    price:250, emoji:'⚔️', rarity:'rare' },
  { id:'skin-explorateur',cat:'skins', name:'Neo Explorateur',
    desc:'Chapeau d\'aventurier et boussole. Pour les terres inconnues.',
    price:180, emoji:'🧭', rarity:'commun' },
  { id:'skin-lunettes',   cat:'skins', name:'Neo en Lunettes',
    desc:'Lunettes de soleil cool. Mode "Boss qui s\'en fout."',
    price:120, emoji:'😎', rarity:'commun' },
  { id:'skin-mage',       cat:'skins', name:'Neo Mage',
    desc:'Chapeau pointu et étoiles. Pour incanter du savoir.',
    price:320, emoji:'🧙', rarity:'rare' },
  { id:'skin-roi',        cat:'skins', name:'Neo Souverain',
    desc:'Couronne d\'or et cape royale. Le prestige absolu.',
    price:800, emoji:'👑', rarity:'legendaire' },

  // Consommables
  { id:'potion-munition', cat:'consommables', name:'Potion de Munition',
    desc:'Remplit ta jauge d\'éclats instantanément (1 utilisation).',
    price:80, emoji:'🧪', rarity:'commun', consumable:true },
  { id:'potion-fortune',  cat:'consommables', name:'Fiole de Fortune',
    desc:'Triple l\'or gagné sur ton prochain quiz.',
    price:150, emoji:'🍯', rarity:'rare', consumable:true },
];

const RARITY_LABELS = { commun:'Commun', rare:'Rare', legendaire:'Légendaire' };

// Commentaires Neo pour les achats (random)
const NEO_COMMENTS_BUY = [
  "Woah ! Avec ça, le Boss va trembler de peur !",
  "Tu es sûr pour ça ? Bon… si ça te plaît !",
  "Excellent choix, ça va péter à l'arène !",
  "Hop, dans le sac ! On part conquérir le monde.",
  "Trop classe ! Le Hibou a vraiment de bons trésors.",
];
const NEO_COMMENTS_POOR = [
  "Pas assez d'or… On enchaîne quelques quiz avant ?",
  "Hmm, faut bosser un peu plus pour ça.",
];

// Dialogues de Neo dans la modale de confirmation (selon rareté)
const NEO_CONFIRM_BY_RARITY = {
  commun:     ["Sympa ce petit truc, on prend ?", "Allez, ça mange pas de pain !"],
  rare:       ["Tu es sûr pour ça ? Bon… si ça te plaît !", "Belle pièce, ça va péter à l'arène !"],
  legendaire: ["Woah ! C'est cher mais carrément classe… tu confirmes ?", "Le Hibou va pleurer en s'en séparant ! Tu valides ?"],
};

// ─────────────────────────────────────────
// Sons (mini WebAudio, aligné sur quest-modal.js)
// ─────────────────────────────────────────
function bzGetAudio() {
  try { return window.nqAudio ? window.nqAudio.get() : new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
}
function bzPlayTone(freq, type, duration, volume, delay) {
  try {
    const ctx = bzGetAudio(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type; o.frequency.value = freq;
    const t = ctx.currentTime + (delay || 0);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.start(t); o.stop(t + duration);
  } catch {}
}
// Cling montant + éclat brillant — satisfaisant pour un achat
function bzSoundBuy() {
  bzPlayTone(880,  'triangle', 0.14, 0.18, 0);
  bzPlayTone(1175, 'triangle', 0.14, 0.16, 0.08);
  bzPlayTone(1568, 'sine',     0.22, 0.15, 0.18);
}
// Note grave courte pour un refus
function bzSoundFail() {
  bzPlayTone(220, 'sawtooth', 0.16, 0.12, 0);
  bzPlayTone(165, 'sawtooth', 0.18, 0.10, 0.10);
}
// Clic discret pour l'ouverture/fermeture modale
function bzSoundClick() {
  bzPlayTone(520, 'sine', 0.06, 0.08, 0);
}

// ─────────────────────────────────────────
// Persistance : or (mock) + items possédés
// ─────────────────────────────────────────
const STARTING_GOLD_MOCK = 500;
const LS_OWNED = 'neoquest_boutique_owned';

function bzGetProgress() {
  try { return JSON.parse(localStorage.getItem('neoquest_progress') || '{}'); }
  catch { return {}; }
}
function bzSaveProgress(p) {
  try { localStorage.setItem('neoquest_progress', JSON.stringify(p)); } catch {}
}

// Mock initial : si pas d'or du tout, on met 500 pour pouvoir tester
function bzEnsureMockGold() {
  const p = bzGetProgress();
  if (typeof p.totalGold !== 'number') {
    p.totalGold = STARTING_GOLD_MOCK;
    bzSaveProgress(p);
  }
}

function bzGetGold() {
  return bzGetProgress().totalGold || 0;
}
function bzSpendGold(n) {
  const p = bzGetProgress();
  p.totalGold = Math.max(0, (p.totalGold || 0) - n);
  bzSaveProgress(p);
}

function bzGetOwned() {
  try { return JSON.parse(localStorage.getItem(LS_OWNED) || '[]'); }
  catch { return []; }
}
function bzAddOwned(id) {
  const owned = bzGetOwned();
  if (!owned.includes(id)) {
    owned.push(id);
    try { localStorage.setItem(LS_OWNED, JSON.stringify(owned)); } catch {}
  }
}

// ─────────────────────────────────────────
// Rendu
// ─────────────────────────────────────────
var currentCat = 'skins';

function bzRender() {
  const grid  = document.getElementById('bazar-grid');
  const empty = document.getElementById('bazar-empty');
  if (!grid) return;

  const items = BAZAR_ITEMS.filter(it => it.cat === currentCat);
  const owned = bzGetOwned();
  const gold  = bzGetGold();

  if (!items.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = items.map(it => {
    const isOwned    = !it.consumable && owned.includes(it.id);
    const tooPoor    = !isOwned && gold < it.price;
    const btnLabel   = isOwned ? 'Possédé' : 'Acheter';
    const btnClass   = isOwned ? 'bazar-buy owned' : 'bazar-buy';
    const btnDisabled= isOwned || tooPoor ? 'disabled' : '';
    let tip = '';
    if (isOwned)      tip = 'Déjà dans ton inventaire';
    else if (tooPoor) tip = `Il te manque ${it.price - gold} 💰`;
    const tipAttr = tip ? ` data-tooltip="${tip}"` : '';
    return `
      <div class="bazar-card rarity-${it.rarity} ${tooPoor ? 'too-poor' : ''}" data-id="${it.id}"${tipAttr}>
        <span class="bazar-card-rarity">${RARITY_LABELS[it.rarity]}</span>
        <div class="bazar-card-visual">${it.emoji}</div>
        <div class="bazar-card-name">${it.name}</div>
        <div class="bazar-card-desc">${it.desc}</div>
        <div class="bazar-card-foot">
          <span class="bazar-price"><span class="bazar-price-emoji">💰</span>${it.price}</span>
          <button class="${btnClass}" ${btnDisabled} data-buy="${it.id}">${btnLabel}</button>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => bzTryBuy(btn.dataset.buy));
  });
}

// ─────────────────────────────────────────
// Achat : tryBuy (point d'entrée) → bzConfirmOpen → bzDoBuy
// ─────────────────────────────────────────
function bzTryBuy(id) {
  const item = BAZAR_ITEMS.find(i => i.id === id);
  if (!item) return;

  const owned = bzGetOwned();
  if (!item.consumable && owned.includes(id)) return;

  const gold = bzGetGold();
  if (gold < item.price) {
    bzSoundFail();
    bzNeoSay(pick(NEO_COMMENTS_POOR));
    return;
  }

  // Consommables : achat direct (rachetables, pas besoin de confirmer à chaque fois)
  if (item.consumable) { bzDoBuy(item); return; }

  // Non-consommables (skins, cosmétiques) : Neo demande confirmation
  bzConfirmOpen(item);
}

function bzDoBuy(item) {
  bzSpendGold(item.price);
  if (!item.consumable) bzAddOwned(item.id);

  bzSoundBuy();
  bzFlashGoldDisplay();
  bzRender();
  bzToast(item.consumable ? `${item.name} achetée !` : `${item.name} débloqué !`, 'success');
  bzNeoSay(pick(NEO_COMMENTS_BUY));
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─────────────────────────────────────────
// Modale de confirmation
// ─────────────────────────────────────────
var pendingItem = null;

function bzConfirmOpen(item) {
  const modal = document.getElementById('bazar-confirm');
  if (!modal) return;
  pendingItem = item;

  const emoji = document.getElementById('bazar-confirm-emoji');
  emoji.textContent = item.emoji;
  // Relance l'animation de pop à chaque ouverture
  emoji.style.animation = 'none';
  void emoji.offsetWidth;
  emoji.style.animation = '';
  document.getElementById('bazar-confirm-name').textContent  = item.name;
  document.getElementById('bazar-confirm-price').textContent = item.price;
  document.getElementById('bazar-confirm-rest').textContent  = (bzGetGold() - item.price);
  document.getElementById('bazar-confirm-text').textContent  = pick(NEO_CONFIRM_BY_RARITY[item.rarity] || NEO_CONFIRM_BY_RARITY.commun);

  modal.classList.remove('out');
  modal.style.display = 'flex';
  bzSoundClick();
  // Focus accessible
  setTimeout(() => document.getElementById('bazar-confirm-buy')?.focus(), 30);
}

function bzConfirmClose() {
  const modal = document.getElementById('bazar-confirm');
  if (!modal) return;
  modal.classList.add('out');
  setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('out'); }, 200);
  pendingItem = null;
}

function bzInitConfirm() {
  const modal   = document.getElementById('bazar-confirm');
  if (!modal) return;
  modal.querySelector('.bazar-modal-backdrop')?.addEventListener('click', () => { bzSoundClick(); bzConfirmClose(); });
  modal.querySelector('.bazar-modal-close')?.addEventListener('click',     () => { bzSoundClick(); bzConfirmClose(); });
  document.getElementById('bazar-cancel')?.addEventListener('click',       () => { bzSoundClick(); bzConfirmClose(); });
  document.getElementById('bazar-confirm-buy')?.addEventListener('click',  () => {
    if (pendingItem) { const it = pendingItem; bzConfirmClose(); bzDoBuy(it); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') { bzSoundClick(); bzConfirmClose(); }
  });
}

// ─────────────────────────────────────────
// Feedback visuel
// ─────────────────────────────────────────
function bzUpdateGoldDisplays() {
  const gold = bzGetGold();
  const purse = document.getElementById('bazar-gold-amount');
  if (purse) purse.textContent = gold;
  // Met aussi à jour le badge de la nav (injecté par xp.js)
  if (typeof window.nqRefreshGoldDisplay === 'function') window.nqRefreshGoldDisplay();
}

function bzFlashGoldDisplay() {
  bzUpdateGoldDisplays();
  ['bazar-gold-amount', 'nq-gold-amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('gold-flash');
      void el.offsetWidth; // restart anim
      el.classList.add('gold-flash');
    }
  });
}

var toastTimer = null;
function bzToast(msg, kind) {
  const t = document.getElementById('bazar-toast');
  if (!t) return;
  t.className = 'bazar-toast' + (kind ? ' ' + kind : '');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => { t.style.display = 'none'; t.classList.remove('out'); }, 250);
  }, 1800);
}

var neoTimer = null;
function bzNeoSay(text) {
  const wrap = document.getElementById('neo-comment');
  const txt  = document.getElementById('neo-comment-text');
  if (!wrap || !txt) return;
  txt.textContent = text;
  wrap.classList.remove('out');
  wrap.style.display = 'flex';
  clearTimeout(neoTimer);
  neoTimer = setTimeout(() => {
    wrap.classList.add('out');
    setTimeout(() => { wrap.style.display = 'none'; }, 300);
  }, 3200);
}

// ─────────────────────────────────────────
// Onglets
// ─────────────────────────────────────────
function bzInitTabs() {
  document.querySelectorAll('.bazar-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bazar-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      bzRender();
    });
  });
}

// ─────────────────────────────────────────
// Init
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bzEnsureMockGold();
  bzInitTabs();
  bzInitConfirm();
  bzUpdateGoldDisplays();
  bzRender();
});
