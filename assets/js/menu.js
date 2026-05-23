/* ========================================================================
   AROMA LOUNGE — Menu page logic
   Renders menu, handles product drawer + cart drawer + add-to-bag
   ======================================================================== */

(() => {
  'use strict';

  const TAX_RATE = 0.07; // IN sales tax (Allen County ~7%)
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
      const div = document.createElement('div');
      div.className = 'menu-item';
      if (item.img) div.classList.add('has-img');
      div.id = item.id;
      div.dataset.id = item.id;

      const imgPart = item.img
        ? `<div class="menu-item-img"><img src="assets/img/${item.img}.jpg" alt="${item.name}" loading="lazy" onerror="this.style.display='none'" /></div>`
        : '';

      div.innerHTML = `
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
          <div class="menu-item-arr">Add →</div>
        </div>
      `;
      div.addEventListener('click', () => openProductDrawer(item));
      grid.appendChild(div);
    });

    menuRoot.appendChild(sec);
  });

  /* ---------- Category active scroll spy ---------- */
  const catSections = document.querySelectorAll('.cat-section');
  const catPills = document.querySelectorAll('.cat-pill');
  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id.replace('cat-', '');
        catPills.forEach(p => p.classList.toggle('active', p.dataset.cat === id));
        // Auto-scroll the cat nav to keep active pill visible
        const active = document.querySelector('.cat-pill.active');
        if (active) {
          active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });
  }, { rootMargin: '-140px 0px -60% 0px' });
  catSections.forEach(s => spyObs.observe(s));

  /* ========================================================================
     PRODUCT DRAWER (customize + add to cart)
     ======================================================================== */

  const drawer = document.querySelector('#prod-drawer');
  const drawerBody = drawer.querySelector('.drawer-body');
  const drawerMask = document.querySelector('#drawer-mask');
  const drawerFoot = drawer.querySelector('.drawer-foot');
  let currentProduct = null;
  let currentSelections = {};
  let currentQty = 1;

  function openProductDrawer(item) {
    currentProduct = item;
    currentSelections = {};
    currentQty = 1;
    // Initialize default selections
    (item.customizations || []).forEach(g => {
      if (g.type === 'single') {
        const def = g.options.find(o => o.default);
        if (def) currentSelections[g.id] = def.id;
        else if (g.required) currentSelections[g.id] = g.options[0].id;
      } else {
        currentSelections[g.id] = [];
      }
    });
    renderDrawer();
    drawer.classList.add('open');
    drawerMask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductDrawer() {
    drawer.classList.remove('open');
    drawerMask.classList.remove('open');
    document.body.style.overflow = '';
  }

  function calcCurrentTotal() {
    if (!currentProduct) return 0;
    let total = currentProduct.price;
    (currentProduct.customizations || []).forEach(g => {
      const sel = currentSelections[g.id];
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
    return total * currentQty;
  }

  function renderDrawer() {
    const p = currentProduct;
    const imgHtml = p.img
      ? `<div class="prod-hero"><img src="assets/img/${p.img}.jpg" alt="${p.name}" /></div>`
      : '';

    let html = `
      ${imgHtml}
      <h2 class="prod-title">${p.name}</h2>
      <div class="prod-desc">${p.desc}</div>
      <div class="prod-base-price">Base $${p.price.toFixed(2)} · ${p.calories || 0} cal</div>
    `;

    (p.customizations || []).forEach(g => {
      const isMulti = g.type === 'multi';
      const sel = currentSelections[g.id];

      html += `<div class="opt-group">
        <div class="opt-group-head">
          <div class="opt-group-name">
            ${g.name}${g.required ? '<span class="req">Required</span>' : ''}
          </div>
          ${isMulti ? '<div class="opt-group-hint">Pick any</div>' : (g.required ? '' : '<div class="opt-group-hint">Optional</div>')}
        </div>`;

      if (g.upsell) {
        html += `<div class="upsell-banner">
          <span class="label">+ Add</span>
          <span class="text">Most guests add a house syrup — try Rose or Cardamom.</span>
        </div>`;
      }

      html += '<div class="opt-grid">';
      g.options.forEach(o => {
        const selected = isMulti ? (sel || []).includes(o.id) : sel === o.id;
        const delta = o.delta || 0;
        const deltaHtml = delta === 0 ? '' : (delta > 0 ? `<span class="opt-delta positive">+$${delta.toFixed(2)}</span>` : `<span class="opt-delta">−$${Math.abs(delta).toFixed(2)}</span>`);
        const badgeHtml = o.badge ? `<span class="badge">${o.badge}</span>` : '';

        html += `<button class="opt ${selected ? 'selected' : ''}" data-group="${g.id}" data-opt="${o.id}" data-multi="${isMulti}">
          <span class="opt-name">${o.name} ${badgeHtml}</span>
          ${deltaHtml}
        </button>`;
      });
      html += '</div></div>';
    });

    drawerBody.innerHTML = html;

    // Bind option clicks
    drawerBody.querySelectorAll('.opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const gId = btn.dataset.group;
        const oId = btn.dataset.opt;
        const isMulti = btn.dataset.multi === 'true';
        if (isMulti) {
          const arr = currentSelections[gId] || [];
          if (arr.includes(oId)) currentSelections[gId] = arr.filter(x => x !== oId);
          else currentSelections[gId] = [...arr, oId];
        } else {
          currentSelections[gId] = oId;
        }
        renderDrawer();
      });
    });

    // Footer (qty + add)
    drawerFoot.innerHTML = `
      <div class="qty">
        <button id="qty-minus" aria-label="Decrease">−</button>
        <input id="qty-input" type="text" value="${currentQty}" readonly />
        <button id="qty-plus" aria-label="Increase">+</button>
      </div>
      <button class="drawer-add" id="add-btn">
        <span>Add to Bag</span>
        <span class="price">$${calcCurrentTotal().toFixed(2)}</span>
      </button>
    `;
    drawerFoot.querySelector('#qty-minus').addEventListener('click', () => { if (currentQty > 1) { currentQty--; renderDrawer(); } });
    drawerFoot.querySelector('#qty-plus').addEventListener('click', () => { currentQty++; renderDrawer(); });
    drawerFoot.querySelector('#add-btn').addEventListener('click', addCurrentToCart);
  }

  document.querySelector('#prod-drawer-close').addEventListener('click', closeProductDrawer);
  drawerMask.addEventListener('click', closeProductDrawer);

  /* ========================================================================
     CART STATE
     ======================================================================== */

  function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); window.dispatchEvent(new Event('aroma:cart-updated')); }

  function addCurrentToCart() {
    const p = currentProduct;
    const sel = { ...currentSelections };
    const total = calcCurrentTotal() / currentQty;
    const cart = getCart();

    // Try merge if exact same product + selections exist
    const sig = p.id + '::' + JSON.stringify(sel);
    const existing = cart.find(i => i.sig === sig);
    if (existing) existing.qty += currentQty;
    else cart.push({
      id: p.id, name: p.name, sig,
      selections: sel,
      unit: total, qty: currentQty, img: p.img,
    });
    saveCart(cart);
    closeProductDrawer();
    showToast(`${p.name} · added to bag`);
    renderCart();
  }

  /* ========================================================================
     CART DRAWER
     ======================================================================== */

  const cartDrawer = document.querySelector('#cart-drawer');
  const cartBody = cartDrawer.querySelector('.drawer-body');
  const cartSummaryEl = document.querySelector('#cart-summary');
  const cartFab = document.querySelector('#cart-fab');

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
          <div class="opts">${describeSelections(i)}</div>
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

    // FAB
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
    if (!drawer.classList.contains('open')) drawerMask.classList.remove('open');
    document.body.style.overflow = '';
  }
  cartFab.addEventListener('click', openCartDrawer);
  document.querySelector('#cart-drawer-close').addEventListener('click', closeCartDrawer);
  document.querySelector('#cart-open-nav').addEventListener('click', e => { e.preventDefault(); openCartDrawer(); });

  // Mask closes both
  drawerMask.addEventListener('click', () => {
    closeProductDrawer();
    closeCartDrawer();
  });

  // Esc closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeProductDrawer();
      closeCartDrawer();
    }
  });

  /* ========================================================================
     TOAST
     ======================================================================== */

  const toast = document.querySelector('#toast');
  let toastTimer;
  function showToast(text) {
    toast.querySelector('.text').innerHTML = `<strong>Added</strong>${text}`;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  /* Initial render */
  renderCart();

  /* If URL has hash matching a product, open its drawer */
  if (location.hash) {
    const item = AROMA_MENU.find(i => '#' + i.id === location.hash);
    if (item) setTimeout(() => openProductDrawer(item), 300);
  }

})();
