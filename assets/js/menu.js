/* ========================================================================
   AROMA LOUNGE — Menu page logic
   Instant-add: one click adds to bag with defaults and reveals inline
   customization chips. No modal, no extra clicks.
   ======================================================================== */

(() => {
  'use strict';

  const TAX_RATE = 0.07;
  const CART_KEY = 'aroma_cart';

  /* ---------- Render category nav ---------- */
  const catNav = document.querySelector('#cat-nav-track');
  AROMA_CATEGORIES.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'cat-pill' + (i === 0 ? ' active' : '');
    btn.dataset.cat = c.id;
    btn.innerHTML = `<span class="icon">${c.icon}</span><span>${c.name}</span>`;
    btn.addEventListener('click', () => {
      const target = document.querySelector('#cat-' + c.id);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
    catNav.appendChild(btn);
  });

  /* ---------- Render menu sections ---------- */
  const menuRoot = document.querySelector('#menu-root');
  AROMA_CATEGORIES.forEach(cat => {
    const items = AROMA_MENU.filter(i => i.cat === cat.id);
    if (!items.length) return;

    const sec = document.createElement('section');
    sec.className = 'cat-section';
    sec.id = 'cat-' + cat.id;

    sec.innerHTML = `
      <div class="cat-head">
        <div>
          <span class="eyebrow">${cat.icon} &nbsp; ${items.length} items</span>
          <h2>${cat.name}</h2>
        </div>
        <p class="blurb">${cat.blurb}</p>
      </div>
      <div class="menu-grid"></div>
    `;
    const grid = sec.querySelector('.menu-grid');

    items.forEach(item => {
      // Wrap row + inline panel into a single .menu-row container
      const row = document.createElement('div');
      row.className = 'menu-row' + (item.img ? ' has-img' : '');
      row.id = item.id;
      row.dataset.id = item.id;

      const imgPart = item.img
        ? `<div class="menu-item-img"><img src="assets/img/${item.img}.jpg" alt="${item.name}" loading="lazy" onerror="this.parentElement.style.display='none'" /></div>`
        : '';

      row.innerHTML = `
        <div class="menu-item ${item.img ? 'has-img' : ''}">
          ${imgPart}
          <div class="menu-item-main">
            <div class="menu-item-name">
              ${item.popular ? '<span class="pop-dot" title="Most loved"></span>' : ''}
              <span>${item.name}</span>
              ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
            </div>
            <div class="menu-item-desc">${item.desc}</div>
            ${item.calories ? `<div class="menu-item-cal">${item.calories} cal</div>` : ''}
          </div>
          <div class="menu-item-side">
            <div class="menu-item-price">$${item.price.toFixed(2)}</div>
            <div class="menu-item-arr">Add ›</div>
          </div>
        </div>
        <div class="inline-panel"><div class="inner"></div></div>
      `;

      const rowMain = row.querySelector('.menu-item');
      rowMain.addEventListener('click', e => {
        // Don't re-add if a chip / nested control is clicked
        if (e.target.closest('.chip, .mini-qty, .done, .add-another, button')) return;
        handleRowTap(row, item);
      });

      grid.appendChild(row);
    });

    menuRoot.appendChild(sec);
  });

  /* ---------- Category scroll spy ---------- */
  const catSections = document.querySelectorAll('.cat-section');
  const catPills = document.querySelectorAll('.cat-pill');
  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id.replace('cat-', '');
        catPills.forEach(p => p.classList.toggle('active', p.dataset.cat === id));
        const active = document.querySelector('.cat-pill.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }, { rootMargin: '-140px 0px -60% 0px' });
  catSections.forEach(s => spyObs.observe(s));

  /* ========================================================================
     STATE
     ======================================================================== */

  let currentRow = null;           // expanded row element
  let currentItem = null;          // menu item definition
  let currentCartIndex = -1;       // index of the just-added cart line being edited

  function defaultSelections(item) {
    const sel = {};
    (item.customizations || []).forEach(g => {
      if (g.type === 'single') {
        const def = g.options.find(o => o.default);
        if (def) sel[g.id] = def.id;
        else if (g.required) sel[g.id] = g.options[0].id;
      } else {
        sel[g.id] = [];
      }
    });
    return sel;
  }

  function priceFor(item, selections, qty = 1) {
    let total = item.price;
    (item.customizations || []).forEach(g => {
      const sel = selections[g.id];
      if (!sel) return;
      if (g.type === 'single') {
        const o = g.options.find(o => o.id === sel);
        if (o) total += o.delta || 0;
      } else if (Array.isArray(sel)) {
        sel.forEach(id => {
          const o = g.options.find(o => o.id === id);
          if (o) total += o.delta || 0;
        });
      }
    });
    return total * qty;
  }

  /* ========================================================================
     Tap row → add + expand
     ======================================================================== */

  function handleRowTap(row, item) {
    // If this row is already expanded → close it (toggle behavior)
    if (currentRow === row) {
      collapseCurrent();
      return;
    }
    // Close any other expanded row first
    if (currentRow) collapseCurrent();

    // Add a line item to the cart with defaults
    const selections = defaultSelections(item);
    const unit = priceFor(item, selections, 1);
    const sig = item.id + '::' + JSON.stringify(selections);
    const cart = getCart();
    cart.push({
      id: item.id,
      name: item.name,
      sig,
      selections,
      unit,
      qty: 1,
      img: item.img,
    });
    saveCart(cart);
    currentCartIndex = cart.length - 1;
    currentItem = item;
    currentRow = row;

    // Expand inline panel
    row.classList.add('expanded');
    row.querySelector('.inline-panel .inner').innerHTML = inlineHTML(item, selections, 1);
    bindInlineControls(row);

    // Confirmation flash near the price
    flashAdded(row);
    showToast(`${item.name} · added`);
    renderCart();

    // Smooth scroll to keep panel in view
    setTimeout(() => {
      const rect = row.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 80) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);
  }

  function flashAdded(row) {
    const side = row.querySelector('.menu-item-side');
    const arrow = side.querySelector('.menu-item-arr');
    arrow.innerHTML = '<span class="added-pill">In Bag</span>';
  }

  function collapseCurrent() {
    if (!currentRow) return;
    currentRow.classList.remove('expanded');
    const arrow = currentRow.querySelector('.menu-item-arr');
    if (arrow) arrow.textContent = 'Add ›';
    // Clear inner after slide-down finishes (also avoids re-renders flashing)
    const inner = currentRow.querySelector('.inline-panel .inner');
    setTimeout(() => { if (inner) inner.innerHTML = ''; }, 450);
    currentRow = null;
    currentItem = null;
    currentCartIndex = -1;
  }

  /* ========================================================================
     Inline customize HTML + interactions
     ======================================================================== */

  function inlineHTML(item, selections, qty) {
    // Compose chip rows for each customization group
    let rows = '';
    let hasUpsell = false;
    (item.customizations || []).forEach(g => {
      const isMulti = g.type === 'multi';
      const sel = selections[g.id];
      if (g.upsell && !hasUpsell) hasUpsell = true;

      const chips = g.options.map(o => {
        const selected = isMulti ? (sel || []).includes(o.id) : sel === o.id;
        const delta = o.delta || 0;
        const dTxt = delta === 0 ? '' : (delta > 0 ? `<span class="delta">+$${delta.toFixed(2)}</span>` : `<span class="delta">−$${Math.abs(delta).toFixed(2)}</span>`);
        const badge = o.badge ? `<span class="b">${o.badge}</span>` : '';
        return `<button class="chip ${selected ? 'on' : ''}" data-group="${g.id}" data-opt="${o.id}" data-multi="${isMulti}">
          <span>${o.name}</span>${badge}${dTxt}
        </button>`;
      }).join('');

      rows += `<div class="inline-row">
        <div class="label">${g.name}</div>
        <div class="chips">${chips}</div>
      </div>`;
    });

    const running = priceFor(item, selections, qty);
    const upsellNote = item.customizations?.some(g => g.upsell)
      ? `<div class="inline-upsell"><strong>Upgrade:</strong>add a house syrup — Rose, Cardamom, or Pistachio go beautifully with this drink.</div>`
      : '';

    return `
      ${upsellNote}
      ${rows}
      <div class="inline-foot">
        <div class="left">
          <div class="running">Running <span class="v">$${running.toFixed(2)}</span></div>
          <div class="mini-qty">
            <button data-qty="-1" aria-label="Decrease">−</button>
            <span class="val">${qty}</span>
            <button data-qty="+1" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="actions">
          <button class="add-another" data-add-another>+ Add Another</button>
          <button class="done" data-done>Done</button>
        </div>
      </div>
    `;
  }

  function bindInlineControls(row) {
    const inner = row.querySelector('.inline-panel .inner');

    inner.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const gId = btn.dataset.group;
        const oId = btn.dataset.opt;
        const isMulti = btn.dataset.multi === 'true';
        const cart = getCart();
        const line = cart[currentCartIndex];
        if (!line) return;

        if (isMulti) {
          const arr = line.selections[gId] || [];
          line.selections[gId] = arr.includes(oId) ? arr.filter(x => x !== oId) : [...arr, oId];
        } else {
          line.selections[gId] = oId;
        }
        line.unit = priceFor(currentItem, line.selections, 1);
        line.sig = currentItem.id + '::' + JSON.stringify(line.selections);
        saveCart(cart);

        // Re-render the panel in place (preserve scroll)
        inner.innerHTML = inlineHTML(currentItem, line.selections, line.qty);
        bindInlineControls(row);
        renderCart();
      });
    });

    inner.querySelectorAll('[data-qty]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const delta = +btn.dataset.qty;
        const cart = getCart();
        const line = cart[currentCartIndex];
        if (!line) return;
        line.qty = Math.max(1, line.qty + delta);
        saveCart(cart);
        inner.querySelector('.mini-qty .val').textContent = line.qty;
        inner.querySelector('.running .v').textContent = '$' + (line.unit * line.qty).toFixed(2);
        renderCart();
      });
    });

    inner.querySelector('[data-done]')?.addEventListener('click', e => {
      e.stopPropagation();
      collapseCurrent();
    });

    inner.querySelector('[data-add-another]')?.addEventListener('click', e => {
      e.stopPropagation();
      // Duplicate the current line with same selections
      const cart = getCart();
      const line = cart[currentCartIndex];
      if (!line) return;
      cart.push({ ...line, selections: { ...line.selections }, qty: 1 });
      saveCart(cart);
      currentCartIndex = cart.length - 1;
      inner.querySelector('.mini-qty .val').textContent = 1;
      inner.querySelector('.running .v').textContent = '$' + line.unit.toFixed(2);
      showToast(`Another ${currentItem.name} added`);
      renderCart();
    });
  }

  /* Collapse when clicking outside */
  document.addEventListener('click', e => {
    if (!currentRow) return;
    if (currentRow.contains(e.target)) return;
    // Ignore clicks on cart fab, toast, cart drawer, nav
    if (e.target.closest('#cart-fab, #cart-drawer, #drawer-mask, .nav, .cat-nav, #toast')) return;
    collapseCurrent();
  });

  /* Esc closes expanded row + cart drawer */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      collapseCurrent();
      closeCartDrawer();
    }
  });

  /* ========================================================================
     CART STATE + DRAWER (the side bag remains for review only)
     ======================================================================== */

  function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(c) {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
    window.dispatchEvent(new Event('aroma:cart-updated'));
  }

  const cartDrawer = document.querySelector('#cart-drawer');
  const cartBody = cartDrawer.querySelector('.drawer-body');
  const cartSummaryEl = document.querySelector('#cart-summary');
  const cartFab = document.querySelector('#cart-fab');
  const drawerMask = document.querySelector('#drawer-mask');

  function describeSelections(item) {
    const product = AROMA_MENU.find(m => m.id === item.id);
    if (!product) return '';
    const parts = [];
    (product.customizations || []).forEach(g => {
      const sel = item.selections[g.id];
      if (!sel) return;
      if (g.type === 'single') {
        const o = g.options.find(o => o.id === sel);
        if (o && (g.required || (o.delta && o.delta !== 0))) parts.push(o.name);
      } else if (Array.isArray(sel) && sel.length) {
        sel.forEach(id => {
          const o = g.options.find(o => o.id === id);
          if (o) parts.push('+ ' + o.name);
        });
      }
    });
    return parts.join(' · ');
  }

  function renderCart() {
    const cart = getCart();
    if (!cart.length) {
      cartBody.innerHTML = `
        <div class="empty-cart">
          <div class="display">✦</div>
          <p>Your bag is empty.</p>
          <button class="btn btn-primary" id="close-empty">Browse the Menu</button>
        </div>`;
      cartBody.querySelector('#close-empty').addEventListener('click', closeCartDrawer);
      cartSummaryEl.innerHTML = '';
      cartFab.classList.remove('visible');
      return;
    }

    cartBody.innerHTML = cart.map((i, idx) => `
      <div class="cart-item">
        <div>
          <h4>${i.name}</h4>
          <div class="opts">${describeSelections(i) || 'Standard'}</div>
          <div class="row">
            <div class="qty">
              <button data-cart-minus="${idx}">−</button>
              <input type="text" value="${i.qty}" readonly />
              <button data-cart-plus="${idx}">+</button>
            </div>
            <button class="remove" data-cart-remove="${idx}">Remove</button>
          </div>
        </div>
        <div class="price">$${(i.unit * i.qty).toFixed(2)}</div>
      </div>
    `).join('');

    cartBody.querySelectorAll('[data-cart-minus]').forEach(b => b.addEventListener('click', e => {
      const idx = +e.target.dataset.cartMinus;
      const c = getCart();
      if (c[idx].qty > 1) { c[idx].qty--; saveCart(c); renderCart(); }
    }));
    cartBody.querySelectorAll('[data-cart-plus]').forEach(b => b.addEventListener('click', e => {
      const idx = +e.target.dataset.cartPlus;
      const c = getCart();
      c[idx].qty++; saveCart(c); renderCart();
    }));
    cartBody.querySelectorAll('[data-cart-remove]').forEach(b => b.addEventListener('click', e => {
      const idx = +e.target.dataset.cartRemove;
      const c = getCart();
      c.splice(idx, 1); saveCart(c); renderCart();
      if (idx === currentCartIndex) collapseCurrent();
    }));

    const sub = cart.reduce((s, i) => s + i.unit * i.qty, 0);
    const tax = sub * TAX_RATE;
    const tip = sub * 0.15;
    const total = sub + tax;
    cartSummaryEl.innerHTML = `
      <div class="row"><span class="l">Subtotal</span><span class="v">$${sub.toFixed(2)}</span></div>
      <div class="row"><span class="l">Tax (7%)</span><span class="v">$${tax.toFixed(2)}</span></div>
      <div class="row"><span class="l">Suggested Tip (15%)</span><span class="v">$${tip.toFixed(2)}</span></div>
      <div class="row total"><span>Total</span><span class="v">$${total.toFixed(2)}</span></div>
      <button class="btn btn-primary" style="margin-top:16px; width:100%; justify-content:center;" onclick="alert('Demo only — checkout would integrate Square / Stripe / Toast.');">Continue to Checkout →</button>
      <button class="btn btn-ghost" style="margin-top:8px; width:100%; justify-content:center;" id="keep-shopping">Add More Items</button>
    `;
    cartSummaryEl.querySelector('#keep-shopping').addEventListener('click', closeCartDrawer);

    const count = cart.reduce((s, i) => s + i.qty, 0);
    cartFab.classList.add('visible');
    cartFab.querySelector('.count').textContent = count;
    cartFab.querySelector('.total').textContent = '$' + sub.toFixed(2);
  }

  function openCartDrawer() {
    renderCart();
    cartDrawer.classList.add('open');
    drawerMask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    drawerMask.classList.remove('open');
    document.body.style.overflow = '';
  }
  cartFab.addEventListener('click', openCartDrawer);
  document.querySelector('#cart-drawer-close').addEventListener('click', closeCartDrawer);
  document.querySelector('#cart-open-nav').addEventListener('click', e => { e.preventDefault(); openCartDrawer(); });
  drawerMask.addEventListener('click', closeCartDrawer);

  /* ========================================================================
     TOAST
     ======================================================================== */

  const toast = document.querySelector('#toast');
  let toastTimer;
  function showToast(text) {
    toast.querySelector('.text').innerHTML = `<strong>Added</strong>${text}`;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
  }

  /* Initial render */
  renderCart();

})();
