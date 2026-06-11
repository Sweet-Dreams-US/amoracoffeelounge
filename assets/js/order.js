/* ==========================================================================
   AROMA LOUNGE — Order (checkout) page
   Arch time chips · receipt summary · demo place-order
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
  const timeChips  = document.getElementById('pickup-time');
  const hoursNote  = document.getElementById('hours-note');

  if (!summaryEl) return;

  // Hours mirror menu-data.js (0=Sun … 6=Sat)
  const HOURS = {
    0: { open: '6:30', close: '22:00', label: '6:30a — 10p' },
    1: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },
    2: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },
    3: { open: '5:30', close: '22:40', label: '5:30a — 10:40p' },
    4: { open: '5:30', close: '23:30', label: '5:30a — 11:30p' },
    5: { open: '5:30', close: '24:00', label: '5:30a — midnight' },
    6: { open: '6:30', close: '24:00', label: '6:30a — midnight' },
  };

  const fmtTime = (h, m) => {
    const am = h < 12;
    const hr = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    return hr + ':' + String(m).padStart(2, '0') + (am ? 'a' : 'p');
  };
  const parseHM = s => s.split(':').map(Number);
  const mins = (h, m) => h * 60 + m;

  /* ------------- time chips (scroll-snap arch row) ------------- */
  let closedToday = false;

  function buildSlots() {
    if (!timeChips) return;
    const prevChecked = timeChips.querySelector('input[name="time"]:checked')?.value || null;
    const now = new Date();
    const day = now.getDay();
    const h = HOURS[day];
    if (hoursNote) hoursNote.textContent = 'Open today · ' + h.label;
    timeChips.innerHTML = '';

    const [openH, openM] = parseHM(h.open);
    const [closeH, closeM] = parseHM(h.close);
    const openAbs = mins(openH, openM);
    const closeAbs = mins(closeH, closeM);

    const leadAbs = mins(now.getHours(), now.getMinutes()) + 12;
    let firstSlot = Math.max(leadAbs, openAbs);
    firstSlot = Math.ceil(firstSlot / 10) * 10;
    const lastSlot = closeAbs - 10;

    if (firstSlot > lastSlot) {
      closedToday = true;
      const chip = document.createElement('span');
      chip.className = 'time-chip disabled';
      chip.textContent = "Closed for today — see you tomorrow";
      timeChips.appendChild(chip);
      if (placeBtn) placeBtn.disabled = true;
      if (placePick) placePick.textContent = '—';
      return;
    }
    closedToday = false;

    const addChip = (value, label, checked) => {
      const lab = document.createElement('label');
      lab.className = 'time-chip';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'time';
      input.value = value;
      input.checked = checked;
      lab.appendChild(input);
      lab.appendChild(document.createTextNode(label));
      timeChips.appendChild(lab);
    };

    // ASAP + the next 18 ten-minute windows
    const values = [];
    addChip('asap:' + firstSlot, 'ASAP · ~' + fmtTime(Math.floor(firstSlot / 60), firstSlot % 60), false);
    values.push('asap:' + firstSlot);
    for (let m = firstSlot, n = 0; m <= lastSlot && n < 18; m += 10, n++) {
      addChip('slot:' + m, fmtTime(Math.floor(m / 60), m % 60), false);
      values.push('slot:' + m);
    }

    // Restore previous selection if still valid, else default to ASAP
    const toCheck = values.includes(prevChecked) ? prevChecked : values[0];
    const input = timeChips.querySelector(`input[value="${CSS.escape(toCheck)}"]`);
    if (input) input.checked = true;

    updatePickupLabel();
  }
  buildSlots();
  setInterval(buildSlots, 120000);

  function updatePickupLabel() {
    if (!placePick) return;
    const raw = timeChips?.querySelector('input[name="time"]:checked')?.value || '';
    const m = raw.match(/^(asap|slot):(\d+)$/);
    if (!m) { placePick.textContent = '~15 min'; return; }
    const totalMin = parseInt(m[2], 10);
    const now = new Date();
    const delta = totalMin - mins(now.getHours(), now.getMinutes());
    placePick.textContent = (m[1] === 'asap' ? 'ASAP · ' : '') + fmtTime(Math.floor(totalMin / 60), totalMin % 60) + (delta > 0 ? ' · in ' + delta + 'm' : '');
  }
  timeChips?.addEventListener('change', updatePickupLabel);

  /* ------------- order summary (dotted-leader receipt) ------------- */
  function render() {
    const state = Cart.read();
    if (state.items.length === 0) {
      summaryEl.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 1rem 2rem;">
          <div style="font-family: var(--font-display); font-size: 2.5rem; color: var(--brass); opacity: 0.45;">✦</div>
          <p style="font-weight: 600; color: var(--ink); margin-top: 0.5rem;">No items yet</p>
          <p style="margin-top: 0.4rem; font-size: 0.9rem; color: var(--text-dim);">Head back to the menu to add a few things.</p>
          <a href="menu.html" class="btn btn-primary" style="margin-top: 1.25rem;">Browse the Menu</a>
        </div>
      `;
      document.getElementById('totals-block').style.display = 'none';
      if (placeBtn) placeBtn.disabled = true;
      return;
    }
    document.getElementById('totals-block').style.display = '';

    summaryEl.innerHTML = state.items.map(i => `
      <div class="summary-line">
        <span class="qty-tag">×${i.qty}</span>
        <span class="line-main">
          <span class="item-name">${i.name}</span>
          ${i.modifiers && i.modifiers.length ? `<div class="item-mods">${i.modifiers.map(m => m.label + (m.price ? ' +$' + m.price.toFixed(2) : '')).join(' · ')}</div>` : ''}
        </span>
        <span class="leader in" aria-hidden="true" style="transform: none;"></span>
        <span class="item-price">$${(i.unit * i.qty).toFixed(2)}</span>
      </div>
    `).join('');

    const sub = Cart.total(state);
    const tax = sub * TAX_RATE;
    const total = sub + tax;
    if (subEl)   subEl.textContent = '$' + sub.toFixed(2);
    if (taxEl)   taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    if (placeTotal) placeTotal.textContent = '$' + total.toFixed(2);

    if (placeBtn && !closedToday) placeBtn.disabled = false;
  }
  render();
  document.addEventListener('cart:change', render);

  /* ------------- method mirror ------------- */
  document.querySelectorAll('input[name="method"]').forEach(r =>
    r.addEventListener('change', () => {
      if (placeMeth) placeMeth.textContent = r.value === 'curbside' ? 'Curbside' : 'In-person';
    })
  );

  /* ------------- submit (demo) ------------- */
  document.getElementById('order-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const state = Cart.read();
    if (state.items.length === 0 || closedToday) return;

    const fd = new FormData(e.target);
    const method = fd.get('method') === 'curbside' ? 'Curbside' : 'In-person';
    const timeRaw = fd.get('time') || '';
    let timeLabel = '—';
    const m = String(timeRaw).match(/^(asap|slot):(\d+)$/);
    if (m) {
      const totalMin = parseInt(m[2], 10);
      timeLabel = fmtTime(Math.floor(totalMin / 60), totalMin % 60);
      if (m[1] === 'asap') timeLabel = 'ASAP — ' + timeLabel;
    }
    const sub = Cart.total(state);
    const grand = sub * (1 + TAX_RATE);
    const orderId = 'AL-' + Date.now().toString(36).toUpperCase().slice(-6);

    if (sIdEl)    sIdEl.textContent    = orderId;
    if (sMethEl)  sMethEl.textContent  = method;
    if (sTimeEl)  sTimeEl.textContent  = timeLabel;
    if (sTotalEl) sTotalEl.textContent = '$' + grand.toFixed(2);

    checkoutEl.style.display = 'none';
    successEl.style.display  = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Cart.clear();
  });

})();
