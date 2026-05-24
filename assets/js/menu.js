/* ==========================================================================
   AROMA LOUNGE — Menu + cart (light theme, Mocha-style ordering)
   ========================================================================== */

(() => {
  'use strict';

  const CART_KEY = 'aroma_cart';

  /* ----------------------------------------------------------------------
     CART STATE (shared between menu page, drawer, and order page)
     ---------------------------------------------------------------------- */
  const Cart = {
    read() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; } catch { return { items: [] }; } },
    write(s) { localStorage.setItem(CART_KEY, JSON.stringify(s)); document.dispatchEvent(new CustomEvent('cart:change')); window.dispatchEvent(new Event('aroma:cart-updated')); },
    add(item, selections, qty = 1) {
      const sig = item.id + '::' + serializeSelections(selections);
      const state = this.read();
      const found = state.items.find(i => i.sig === sig);
      if (found) found.qty += qty;
      else state.items.push({
        id: item.id, name: item.name, basePrice: item.price,
        sig, selections,
        modifiers: flattenMods(item, selections),
        unit: priceFor(item, selections),
        qty,
        img: item.img || null,
      });
      this.write(state);
    },
    setQty(sig, qty) {
      const state = this.read();
      const item = state.items.find(i => i.sig === sig);
      if (!item) return;
      if (qty <= 0) state.items = state.items.filter(i => i.sig !== sig);
      else item.qty = qty;
      this.write(state);
    },
    remove(sig) { this.setQty(sig, 0); },
    clear() { this.write({ items: [] }); },
    total(state) { state = state || this.read(); return state.items.reduce((s, i) => s + i.unit * i.qty, 0); },
    count(state) { state = state || this.read(); return state.items.reduce((s, i) => s + i.qty, 0); },
    countOf(itemId, state) { state = state || this.read(); return state.items.filter(i => i.id === itemId).reduce((s, i) => s + i.qty, 0); },
  };
  window.AromaCart = Cart;

  function serializeSelections(sel) {
    const keys = Object.keys(sel).sort();
    return keys.map(k => k + ':' + (Array.isArray(sel[k]) ? sel[k].sort().join(',') : sel[k])).join('|');
  }
  function defaultSelections(item) {
    const sel = {};
    (item.customizations || []).forEach(g => {
      if (g.type === 'single') {
        const def = g.options.find(o => o.default);
        if (def) sel[g.id] = def.id;
        else if (g.required) sel[g.id] = g.options[0].id;
      } else { sel[g.id] = []; }
    });
    return sel;
  }
  function priceFor(item, selections) {
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
    return total;
  }
  function flattenMods(item, selections) {
    const mods = [];
    (item.customizations || []).forEach(g => {
      const sel = selections[g.id];
      if (!sel) return;
      if (g.type === 'single') {
        const o = g.options.find(o => o.id === sel);
        if (o && (g.required || (o.delta && o.delta !== 0))) mods.push({ group: g.name, label: o.name, price: o.delta || 0 });
      } else if (Array.isArray(sel)) {
        sel.forEach(id => {
          const o = g.options.find(o => o.id === id);
          if (o) mods.push({ group: g.name, label: o.name, price: o.delta || 0 });
        });
      }
    });
    return mods;
  }

  /* ----------------------------------------------------------------------
     Sync nav cart count (works on every page)
     ---------------------------------------------------------------------- */
  function syncNavCount() {
    const c = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = c;
      el.classList.toggle('hidden', c === 0);
      el.style.display = c === 0 ? 'none' : '';
    });
  }
  syncNavCount();
  document.addEventListener('cart:change', syncNavCount);
  window.addEventListener('storage', e => { if (e.key === CART_KEY) syncNavCount(); });

  /* ----------------------------------------------------------------------
     Menu page rendering (only runs if #menu-root present)
     ---------------------------------------------------------------------- */
  const menuRoot = document.getElementById('menu-root');
  const catNavTrack = document.getElementById('cat-nav-track');
  if (menuRoot && window.AROMA_MENU) renderMenu();

  function renderMenu() {
    // Category nav
    AROMA_CATEGORIES.forEach((c, i) => {
      const items = AROMA_MENU.filter(it => it.cat === c.id);
      if (!items.length) return;
      const b = document.createElement('button');
      b.className = 'cat-pill' + (i === 0 ? ' active' : '');
      b.dataset.cat = c.id;
      b.innerHTML = `<span class="icon">${c.icon}</span><span>${c.name}</span>`;
      b.addEventListener('click', () => {
        const t = document.getElementById('cat-' + c.id);
        if (t) {
          const top = t.getBoundingClientRect().top + window.scrollY - 140;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
      catNavTrack.appendChild(b);
    });

    // Sections
    AROMA_CATEGORIES.forEach(cat => {
      const items = AROMA_MENU.filter(i => i.cat === cat.id);
      if (!items.length) return;
      const sec = document.createElement('section');
      sec.className = 'cat-section';
      sec.id = 'cat-' + cat.id;
      sec.innerHTML = `
        <div class="cat-head">
          <div>
            <span class="count">${items.length} items</span>
            <h2>${cat.name}</h2>
          </div>
          <p class="blurb">${cat.blurb}</p>
        </div>
        <div class="menu-grid"></div>
      `;
      const grid = sec.querySelector('.menu-grid');
      items.forEach(item => grid.appendChild(menuRowEl(item)));
      menuRoot.appendChild(sec);
    });

    // Scroll-spy active pill
    const sections = document.querySelectorAll('.cat-section');
    const pills = document.querySelectorAll('.cat-pill');
    const spy = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id.replace('cat-', '');
          pills.forEach(p => p.classList.toggle('active', p.dataset.cat === id));
          const active = document.querySelector('.cat-pill.active');
          if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }, { rootMargin: '-140px 0px -60% 0px' });
    sections.forEach(s => spy.observe(s));

    syncAddButtons();
  }

  function menuRowEl(item) {
    const row = document.createElement('div');
    row.className = 'menu-row' + (item.img ? ' has-img' : '');
    row.id = item.id;
    row.dataset.id = item.id;

    const hasMods = (item.customizations || []).length > 0;

    row.innerHTML = `
      ${item.img ? `<div class="thumb"><img src="assets/img/${item.img}.jpg" alt="${item.name}" loading="lazy" onerror="this.parentElement.style.display='none'" /></div>` : ''}
      <div>
        <div class="menu-row-name">
          ${item.popular ? '<span class="pop-dot" title="Most loved"></span>' : ''}
          <span>${item.name}</span>
          ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        </div>
        <div class="menu-row-desc">${item.desc}</div>
        ${item.calories ? `<div class="menu-row-cal">${item.calories} cal</div>` : ''}
      </div>
      <div class="menu-row-price">$${item.price.toFixed(2)}</div>
      <button class="menu-add" data-add type="button" aria-label="${hasMods ? 'Customize and add ' : 'Add '}${item.name}"><span class="ic">+</span></button>
    `;

    const btn = row.querySelector('[data-add]');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (hasMods) openCustomize(item);
      else { Cart.add(item, {}, 1); flashAdded(btn); bumpFab(); }
    });

    return row;
  }

  function flashAdded(btn) {
    btn.classList.add('added');
    const ic = btn.querySelector('.ic');
    if (ic) ic.textContent = '✓';
    setTimeout(() => { btn.classList.remove('added'); if (ic) ic.textContent = '+'; }, 900);
  }

  function syncAddButtons() {
    document.querySelectorAll('.menu-row').forEach(row => {
      const id = row.dataset.id;
      const btn = row.querySelector('[data-add]');
      if (!btn) return;
      const n = Cart.countOf(id);
      if (n > 0) {
        btn.classList.add('has-count');
        btn.dataset.count = n;
        btn.setAttribute('aria-label', `${n} in bag — tap to add another`);
      } else {
        btn.classList.remove('has-count');
        btn.removeAttribute('data-count');
      }
    });
  }
  document.addEventListener('cart:change', syncAddButtons);

  /* ----------------------------------------------------------------------
     CUSTOMIZE SHEET
     ---------------------------------------------------------------------- */
  const csOverlay = document.getElementById('drawer-overlay');
  const csSheet   = document.getElementById('customize-sheet');
  const csClose   = document.getElementById('cs-close');

  let csCurrent = null; // { item, selections, qty }

  function openCustomize(item) {
    csCurrent = { item, selections: defaultSelections(item), qty: 1 };
    renderCustomize();
    csSheet.classList.add('open');
    csOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCustomize() {
    csSheet?.classList.remove('open');
    if (!document.getElementById('cart-drawer')?.classList.contains('open')) csOverlay?.classList.remove('open');
    csCurrent = null;
    document.body.style.overflow = '';
  }

  function renderCustomize() {
    if (!csCurrent) return;
    const { item, selections, qty } = csCurrent;
    const heroImg = item.img
      ? `<div class="cs-hero"><img src="assets/img/${item.img}.jpg" alt="${item.name}" onerror="this.parentElement.style.display='none'" /></div>`
      : '';
    const upsell = (item.customizations || []).some(g => g.upsell)
      ? `<div class="cs-upsell"><strong>Upgrade</strong>Most guests add a house syrup — Rose, Cardamom, or Pistachio.</div>`
      : '';

    const groups = (item.customizations || []).map(g => {
      const sel = selections[g.id];
      const opts = g.options.map(o => {
        const checked = g.type === 'multi' ? (sel || []).includes(o.id) : sel === o.id;
        const dTxt = o.delta && o.delta !== 0 ? (o.delta > 0 ? '+$' + o.delta.toFixed(2) : '−$' + Math.abs(o.delta).toFixed(2)) : '';
        const badge = o.badge ? `<span class="b">${o.badge}</span>` : '';
        return `
          <button type="button" class="mod-opt ${checked ? 'is-checked' : ''}" data-g="${g.id}" data-o="${o.id}" data-multi="${g.type === 'multi'}">
            <span class="mod-name">${o.name} ${badge}</span>
            ${dTxt ? `<span class="mod-price">${dTxt}</span>` : ''}
          </button>
        `;
      }).join('');
      return `
        <div class="mod-group">
          <div class="mod-group-label">
            <span>${g.name}</span>
            ${g.required ? '<span class="req">Required</span>' : `<span class="opt-hint">${g.type === 'multi' ? 'pick any' : 'optional'}</span>`}
          </div>
          <div class="mod-options">${opts}</div>
        </div>
      `;
    }).join('');

    document.getElementById('cs-name').textContent = item.name;
    document.getElementById('cs-base').textContent = `Starting at $${item.price.toFixed(2)} · ${item.calories || 0} cal`;

    const body = document.getElementById('cs-body');
    body.innerHTML = `
      ${heroImg}
      <p class="cs-desc">${item.desc}</p>
      ${upsell}
      ${groups}
    `;

    // Bind chip clicks
    body.querySelectorAll('.mod-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const gId = btn.dataset.g;
        const oId = btn.dataset.o;
        const isMulti = btn.dataset.multi === 'true';
        if (isMulti) {
          const arr = selections[gId] || [];
          selections[gId] = arr.includes(oId) ? arr.filter(x => x !== oId) : [...arr, oId];
        } else {
          selections[gId] = oId;
        }
        renderCustomize();
      });
    });

    // Footer (qty + add)
    const foot = document.getElementById('cs-foot');
    const total = priceFor(item, selections) * qty;
    foot.innerHTML = `
      <div class="cs-qty-row">
        <span class="lbl">Quantity</span>
        <div class="cs-qty-stepper">
          <button type="button" data-qty="-1" aria-label="Decrease">−</button>
          <span class="val">${qty}</span>
          <button type="button" data-qty="+1" aria-label="Increase">+</button>
        </div>
      </div>
      <button type="button" class="customize-add" id="cs-add">
        <span>Add ${qty} to Bag</span>
        <span class="price">$${total.toFixed(2)}</span>
      </button>
    `;
    foot.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
      csCurrent.qty = Math.max(1, csCurrent.qty + (+b.dataset.qty));
      renderCustomize();
    }));
    foot.querySelector('#cs-add').addEventListener('click', () => {
      Cart.add(item, selections, qty);
      bumpFab();
      showToast(`${item.name} · added`);
      closeCustomize();
    });
  }

  csClose?.addEventListener('click', closeCustomize);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCustomize(); closeCartDrawer(); } });

  /* ----------------------------------------------------------------------
     CART FAB + DRAWER
     ---------------------------------------------------------------------- */
  const fab        = document.getElementById('cart-fab');
  const drawer     = document.getElementById('cart-drawer');
  const drawerBody = document.getElementById('cart-body');
  const cartTotalEl= document.getElementById('cart-total');
  const cartFooter = document.getElementById('cart-footer');
  const cartClose  = document.getElementById('cart-close');
  const cartCount  = document.getElementById('cart-fab-count');
  const cartFabTotal = document.getElementById('cart-fab-total');

  function bumpFab() {
    if (!fab) return;
    fab.classList.add('bump');
    setTimeout(() => fab.classList.remove('bump'), 500);
  }
  function openCartDrawer() {
    renderCartDrawer();
    drawer?.classList.add('open');
    csOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    drawer?.classList.remove('open');
    if (!csSheet?.classList.contains('open')) csOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }
  fab?.addEventListener('click', openCartDrawer);
  cartClose?.addEventListener('click', closeCartDrawer);
  csOverlay?.addEventListener('click', () => { closeCustomize(); closeCartDrawer(); });
  document.querySelector('#cart-open-nav')?.addEventListener('click', e => { e.preventDefault(); openCartDrawer(); });
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCartDrawer(); }));

  function renderCartDrawer() {
    const state = Cart.read();
    if (!drawerBody) return;
    if (state.items.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty">
          <div class="display">∅</div>
          <p style="font-family: var(--font-display); font-style: italic; font-size: 1.25rem; color: var(--ink); margin-bottom: 0.5rem;">Your bag is empty</p>
          <p>Tap any <strong style="color:var(--bronze-deep)">+</strong> on the menu to add an item.</p>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }
    if (cartFooter) cartFooter.style.display = '';
    drawerBody.innerHTML = state.items.map(i => `
      <div class="cart-item" data-sig="${escapeAttr(i.sig)}">
        <div>
          <div class="cart-item-name">${i.name}</div>
          ${i.modifiers && i.modifiers.length ? `<div class="cart-item-mods">${i.modifiers.map(m => m.label + (m.price ? ' +$' + m.price.toFixed(2) : '')).join(' · ')}</div>` : ''}
          <div class="qty-control">
            <button class="qty-btn" data-act="dec" aria-label="Decrease">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn" data-act="inc" aria-label="Increase">+</button>
            <button class="cart-remove" data-act="rm">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">$${(i.unit * i.qty).toFixed(2)}</div>
      </div>
    `).join('');
    if (cartTotalEl) cartTotalEl.textContent = '$' + Cart.total(state).toFixed(2);
  }

  drawerBody?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const sig = btn.closest('.cart-item').dataset.sig;
    const state = Cart.read();
    const item = state.items.find(i => i.sig === sig);
    if (!item) return;
    if (btn.dataset.act === 'inc') Cart.setQty(sig, item.qty + 1);
    else if (btn.dataset.act === 'dec') Cart.setQty(sig, item.qty - 1);
    else if (btn.dataset.act === 'rm') Cart.remove(sig);
  });

  function escapeAttr(s) { return String(s).replace(/"/g, '&quot;'); }

  function syncFab() {
    const state = Cart.read();
    const c = Cart.count(state);
    if (!fab) return;
    if (c > 0) {
      fab.classList.add('visible');
      if (cartCount) cartCount.textContent = c;
      if (cartFabTotal) cartFabTotal.textContent = '$' + Cart.total(state).toFixed(2);
    } else {
      fab.classList.remove('visible');
    }
  }
  syncFab();
  document.addEventListener('cart:change', () => { syncFab(); renderCartDrawer(); });

  /* ----------------------------------------------------------------------
     TOAST
     ---------------------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.querySelector('.text').textContent = text;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
  }

})();
