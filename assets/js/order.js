/* ==========================================================================
   AROMA LOUNGE — Order (checkout) page
   ========================================================================== */

(() => {
  'use strict';
  if (!window.AromaCart) return;

  const TAX_RATE = 0.07;
  const Cart = window.AromaCart;

  const summaryEl  = document.getElementById('order-summary');
  const subEl      = document.getElementById('order-subtotal');
  const taxEl      = document.getElementById('order-tax');
  const totalEl    = document.getElementById('order-total');
  const placeTotal = document.getElementById('place-total');
  const placeMeth  = document.getElementById('place-method');
  const placePick  = document.getElementById('place-pickup');
  const placeBtn   = document.getElementById('place-order');
  const checkoutEl = document.getElementById('checkout-shell');
  const successEl  = document.getElementById('success-shell');
  const sIdEl      = document.getElementById('success-id');
  const sMethEl    = document.getElementById('success-method');
  const sTimeEl    = document.getElementById('success-time');
  const sTotalEl   = document.getElementById('success-total');
  const timeSelect = document.getElementById('pickup-time');
  const hoursNote  = document.getElementById('hours-note');

  // Hours mirror menu-data.js
  const HOURS = {
    0: { open: '6:30', close: '22:00', label: '6:30a — 10p' },     // Sun
    1: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },  // Mon
    2: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },  // Tue
    3: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },  // Wed
    4: { open: '5:30', close: '23:30', label: '5:30a — 11:30p' },  // Thu
    5: { open: '5:30', close: '24:00', label: '5:30a — Midnight' },// Fri
    6: { open: '6:30', close: '24:00', label: '6:30a — Midnight' },// Sat
  };

  /* ------------- helpers ------------- */
  const fmtTime = (h, m) => {
    const am = h < 12;
    const hr = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    return hr + ':' + String(m).padStart(2, '0') + (am ? 'a' : 'p');
  };
  const parseHM = s => s.split(':').map(Number);
  const mins = (h, m) => h * 60 + m;

  /* ------------- time slot generation ------------- */
  function buildSlots() {
    if (!timeSelect) return;
    const now = new Date();
    const day = now.getDay();
    const h = HOURS[day];
    if (hoursNote) hoursNote.textContent = 'Open today · ' + h.label;
    timeSelect.innerHTML = '';

    const [openH, openM] = parseHM(h.open);
    const [closeH, closeM] = parseHM(h.close);
    const openAbs = mins(openH, openM);
    const closeAbs = mins(closeH, closeM);

    const leadAbs = mins(now.getHours(), now.getMinutes()) + 12;
    let firstSlot = Math.max(leadAbs, openAbs);
    firstSlot = Math.ceil(firstSlot / 10) * 10;
    const lastSlot = closeAbs - 10;

    if (firstSlot > lastSlot) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = "Sorry — we're closed for today";
      timeSelect.appendChild(opt);
      timeSelect.disabled = true;
      if (placeBtn) placeBtn.disabled = true;
      return;
    }
    const asap = document.createElement('option');
    asap.value = 'asap:' + firstSlot;
    asap.textContent = 'ASAP — ready ~' + fmtTime(Math.floor(firstSlot / 60), firstSlot % 60);
    timeSelect.appendChild(asap);

    for (let m = firstSlot; m <= lastSlot; m += 10) {
      const o = document.createElement('option');
      o.value = 'slot:' + m;
      o.textContent = fmtTime(Math.floor(m / 60), m % 60);
      timeSelect.appendChild(o);
    }
    // Update mirror
    updatePickupLabel();
  }
  buildSlots();
  setInterval(buildSlots, 120000);

  function updatePickupLabel() {
    const raw = timeSelect?.value || '';
    const m = raw.match(/^(asap|slot):(\d+)$/);
    if (!m) { placePick.textContent = '~15 min'; return; }
    const totalMin = parseInt(m[2], 10);
    const now = new Date();
    const nowAbs = mins(now.getHours(), now.getMinutes());
    const delta = totalMin - nowAbs;
    placePick.textContent = (m[1] === 'asap' ? 'ASAP · ' : '') + fmtTime(Math.floor(totalMin / 60), totalMin % 60) + (delta > 0 ? ' · in ' + delta + 'm' : '');
  }
  timeSelect?.addEventListener('change', updatePickupLabel);

  /* ------------- order summary ------------- */
  function render() {
    const state = Cart.read();
    if (state.items.length === 0) {
      summaryEl.innerHTML = `
        <div style="text-align:center; padding: 2rem 1rem;">
          <div style="font-family: var(--font-display); font-style: italic; font-size: 3rem; color: var(--line-2);">∅</div>
          <p style="font-family: var(--font-display); font-style: italic; font-size: 1.2rem; color: var(--ink); margin-top: 0.5rem;">No items yet</p>
          <p style="margin-top: 0.5rem; font-size: 0.92rem; color: var(--text-dim);">Head back to the menu to add a few things.</p>
          <a href="menu.html" class="btn btn-primary btn-arrow" style="margin-top: 1.5rem;">
            Browse Menu
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
          </a>
        </div>
      `;
      document.getElementById('totals-block').style.display = 'none';
      if (placeBtn) placeBtn.disabled = true;
      return;
    }
    document.getElementById('totals-block').style.display = '';

    summaryEl.innerHTML = state.items.map(i => `
      <div class="summary-line">
        <div>
          <div><span class="qty-tag">×${i.qty}</span><span class="item-name">${i.name}</span></div>
          ${i.modifiers && i.modifiers.length ? `<div class="item-mods">${i.modifiers.map(m => m.label + (m.price ? ' +$' + m.price.toFixed(2) : '')).join(' · ')}</div>` : ''}
        </div>
        <div class="item-price">$${(i.unit * i.qty).toFixed(2)}</div>
      </div>
    `).join('');

    const sub = Cart.total(state);
    const tax = sub * TAX_RATE;
    const total = sub + tax;
    if (subEl)   subEl.textContent = '$' + sub.toFixed(2);
    if (taxEl)   taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    if (placeTotal) placeTotal.textContent = '$' + total.toFixed(2);

    if (placeBtn && !timeSelect.disabled) placeBtn.disabled = false;
  }
  render();
  document.addEventListener('cart:change', render);

  /* ------------- method label mirror ------------- */
  document.querySelectorAll('input[name="method"]').forEach(r =>
    r.addEventListener('change', () => {
      placeMeth.textContent = r.value === 'curbside' ? 'Curbside' : 'In-person';
    })
  );

  /* ------------- submit (fake) ------------- */
  document.getElementById('order-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const state = Cart.read();
    if (state.items.length === 0) return;

    const form = e.target;
    const fd = new FormData(form);
    const method = fd.get('method') === 'curbside' ? 'Curbside' : 'In-person';
    const timeRaw = fd.get('time') || '';
    let timeLabel = '—';
    const m = timeRaw.match(/^(asap|slot):(\d+)$/);
    if (m) {
      const totalMin = parseInt(m[2], 10);
      timeLabel = fmtTime(Math.floor(totalMin / 60), totalMin % 60);
      if (m[1] === 'asap') timeLabel = 'ASAP — ' + timeLabel;
    }
    const sub = Cart.total(state);
    const grand = sub * (1 + TAX_RATE);
    const orderId = 'AL-' + Date.now().toString(36).toUpperCase().slice(-6);

    if (sIdEl)    sIdEl.textContent   = orderId;
    if (sMethEl)  sMethEl.textContent = method;
    if (sTimeEl)  sTimeEl.textContent = timeLabel;
    if (sTotalEl) sTotalEl.textContent= '$' + grand.toFixed(2);

    checkoutEl.style.display = 'none';
    successEl.style.display  = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Cart.clear();
  });

})();
