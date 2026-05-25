// ── Flashcards V5 — cérémonie de cristallisation ──
// Lancé quand la lanterne de session atteint son total (sessionTotal gouttes).
// Séquence : afficher les N gouttes flottantes → converger vers le centre → bloomer la lanterne → bouton replay.
//
// À la fin, on bump la lanterne persistante du chapitre (+5 éclats via window.addLanternEclats(5))
// si une fonction `onComplete` est fournie.
//
// API publique :
//   window.fcv5PlayCristal(opts) → joue la séquence
//     opts = { drops: number, onArrive?: Function, onComplete?: Function }
//   window.fcv5ResetCristal() → reset au step 0

(function() {
  let isPlaying = false;

  function getEls() {
    return {
      cristal:  document.getElementById('fcv5-fin-cristal'),
      lantern:  document.getElementById('fcv5-fin-lantern'),
      slots:    document.getElementById('fcv5-finLanternSlots'),
      replay:   document.getElementById('fcv5-fin-replay'),
    };
  }

  window.fcv5ResetCristal = function() {
    const { cristal, lantern, slots, replay } = getEls();
    if (!cristal || !lantern) return;
    cristal.setAttribute('data-step', '0');
    lantern.setAttribute('data-fill', '100');
    if (replay) replay.removeAttribute('disabled');
    // re-render des gouttes pour qu'elles flottent
    if (typeof window.fcv5RenderSlots === 'function' && slots) {
      window.fcv5RenderSlots(slots, 10);
    }
  };

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  window.fcv5PlayCristal = async function(opts) {
    if (isPlaying) return;
    isPlaying = true;
    const { cristal, lantern, slots, replay } = getEls();
    if (!cristal || !lantern) { isPlaying = false; return; }
    opts = opts || {};
    const drops = Math.max(5, Math.min(10, opts.drops || 10));

    if (replay) replay.setAttribute('disabled', 'true');

    // Étape 0 : lanterne pleine + N gouttes flottantes (on laisse admirer)
    cristal.setAttribute('data-step', '0');
    lantern.setAttribute('data-fill', '100');
    if (typeof window.fcv5RenderSlots === 'function' && slots) {
      window.fcv5RenderSlots(slots, drops);
    }
    await wait(1400);

    // Étape 1 : les gouttes convergent + lanterne pulse, palier 75
    cristal.setAttribute('data-step', '1');
    lantern.setAttribute('data-fill', '75');
    await wait(900);

    // Étape 2 : palier 100 (re-fill)
    cristal.setAttribute('data-step', '2');
    lantern.setAttribute('data-fill', '100');
    await wait(900);

    // Étape 3 : burst lumineux
    cristal.setAttribute('data-step', '3');
    await wait(400);
    // bump la lanterne persistante (+5 éclats pour le stock chapitre)
    if (typeof opts.onComplete === 'function') opts.onComplete();
    await wait(800);

    if (replay) replay.removeAttribute('disabled');
    isPlaying = false;
  };
})();
