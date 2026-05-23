/* ========================================================================
   AROMA LOUNGE — Admin Panel App
   Single-page admin with views routed via hash
   ======================================================================== */

(() => {
  'use strict';

  const A = window.AROMA_ADMIN;

  /* ---------- Nav structure ---------- */
  const NAV = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard',  name: 'Dashboard',     ico: '◉' },
        { id: 'orders',     name: 'Orders',        ico: '▤', badge: '12' },
        { id: 'reports',    name: 'Reports',       ico: '◇' },
      ],
    },
    {
      group: 'Operations',
      items: [
        { id: 'menu',       name: 'Menu',          ico: '☕' },
        { id: 'inventory',  name: 'Inventory',     ico: '⊟', badge: '6' },
        { id: 'kitchen',    name: 'Kitchen Display',ico: '⌬' },
      ],
    },
    {
      group: 'People',
      items: [
        { id: 'staff',      name: 'Staff',         ico: '◍' },
        { id: 'scheduling', name: 'Scheduling',    ico: '◫' },
        { id: 'customers',  name: 'Customers',     ico: '◐' },
        { id: 'loyalty',    name: 'Loyalty',       ico: '✦' },
      ],
    },
    {
      group: 'Growth',
      items: [
        { id: 'marketing',  name: 'Marketing',     ico: '◬' },
        { id: 'social',     name: 'Social',        ico: '◈' },
        { id: 'reviews',    name: 'Reviews',       ico: '★' },
      ],
    },
    {
      group: 'Admin',
      items: [
        { id: 'accounting', name: 'Accounting',    ico: '◊' },
        { id: 'permissions',name: 'Permissions',   ico: '◯' },
        { id: 'settings',   name: 'Settings',      ico: '⚙' },
      ],
    },
  ];

  /* ---------- Render sidebar ---------- */
  const sb = document.querySelector('#sidebar-nav');
  NAV.forEach(g => {
    const wrap = document.createElement('div');
    wrap.className = 'sb-group';
    wrap.innerHTML = `<div class="sb-group-name">${g.group}</div>`;
    g.items.forEach(i => {
      const b = document.createElement('button');
      b.className = 'sb-item';
      b.dataset.view = i.id;
      b.innerHTML = `
        <span class="ico">${i.ico}</span>
        <span>${i.name}</span>
        ${i.badge ? `<span class="badge">${i.badge}</span>` : ''}
      `;
      b.addEventListener('click', () => goTo(i.id));
      wrap.appendChild(b);
    });
    sb.appendChild(wrap);
  });

  /* ---------- View router ---------- */
  let currentView = '';
  let currentCharts = []; // Track to destroy on view change

  function goTo(view) {
    if (currentView === view) return;
    currentView = view;
    location.hash = view;

    // Destroy existing charts
    currentCharts.forEach(c => { try { c.destroy(); } catch (e) {} });
    currentCharts = [];

    // Update active sidebar
    document.querySelectorAll('.sb-item').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });

    const def = VIEW_DEFS[view] || VIEW_DEFS.dashboard;
    document.querySelector('#page-title').textContent = def.title;
    document.querySelector('#page-sub').textContent = def.sub;

    const content = document.querySelector('#content');
    content.innerHTML = '';
    const html = def.render();
    const div = document.createElement('div');
    div.className = 'view';
    div.innerHTML = html;
    content.appendChild(div);
    if (def.after) setTimeout(def.after, 30);

    // Close mobile sidebar if open
    document.querySelector('.sidebar').classList.remove('open');
  }

  /* ========================================================================
     Helpers
     ======================================================================== */

  const money = v => '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const money2 = v => '$' + Number(v).toFixed(2);
  const initials = n => n.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  function chart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    const inst = new Chart(ctx, config);
    currentCharts.push(inst);
    return inst;
  }

  // Common chart defaults
  Chart.defaults.color = 'rgba(244, 236, 219, 0.55)';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.borderColor = 'rgba(180, 138, 75, 0.1)';

  function gradient(ctx, color1, color2) {
    const g = ctx.createLinearGradient(0, 0, 0, 240);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    return g;
  }

  /* ========================================================================
     VIEWS
     ======================================================================== */

  const VIEW_DEFS = {

    /* ----- DASHBOARD ----- */
    dashboard: {
      title: 'Good morning, Omar.',
      sub: 'Today · Live operations overview',
      render: () => {
        const k = A.KPIS;
        const dRev = ((k.revenueToday - k.revenueYesterday) / k.revenueYesterday * 100).toFixed(1);
        const dOrd = ((k.ordersToday - k.ordersYesterday) / k.ordersYesterday * 100).toFixed(1);
        const dCust = ((k.activeCustomers - k.activeCustomersYesterday) / k.activeCustomersYesterday * 100).toFixed(1);
        return `
          <div class="kpi-grid">
            ${kpi('Revenue Today', money(k.revenueToday), '◊', dRev, 'vs yesterday')}
            ${kpi('Orders Today', k.ordersToday, '▤', dOrd, 'vs yesterday')}
            ${kpi('Avg Ticket', money2(k.avgTicket), '☕', '+0.3', 'vs 30d avg')}
            ${kpi('Active Guests', k.activeCustomers, '◐', dCust, 'in lounge + online')}
          </div>

          <div class="row-grid r-2" style="margin-bottom:24px;">
            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Revenue — 30 day</div>
                  <div class="card-sub">${money(A.REVENUE_30.reduce((s,d)=>s+d.value,0))} total</div>
                </div>
                <button class="card-action">Export CSV</button>
              </div>
              <div class="chart-wrap"><canvas id="ch-rev"></canvas></div>
            </div>
            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Channel Mix</div>
                  <div class="card-sub">Last 7 days</div>
                </div>
              </div>
              <div class="chart-wrap"><canvas id="ch-channel"></canvas></div>
            </div>
          </div>

          <div class="row-grid r-2">
            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Live Order Feed</div>
                  <div class="card-sub"><span class="pill success dot">Operating Normally</span></div>
                </div>
                <a href="#orders" class="card-action" onclick="event.preventDefault(); window.aromaGoTo('orders');">View all →</a>
              </div>
              <div class="order-feed" id="live-feed">
                ${A.ORDERS.slice(0, 8).map(orderCardHTML).join('')}
              </div>
            </div>
            <div class="card">
              <div class="card-head">
                <div>
                  <div class="card-title">Top Movers Today</div>
                  <div class="card-sub">By units sold</div>
                </div>
              </div>
              <table class="table">
                <thead><tr><th>Item</th><th class="right">Sold</th><th class="right">Rev</th></tr></thead>
                <tbody>
                  ${[
                    ['The Aroma Latte', 64, 464.00],
                    ['Pistachio Rose', 48, 372.00],
                    ['Cortado', 42, 199.50],
                    ['Belgian Waffle', 38, 437.00],
                    ['Cold Brew', 36, 189.00],
                    ['Cappuccino', 31, 162.75],
                    ['Karak Chai', 28, 147.00],
                    ['Baklava (3pc)', 22, 143.00],
                  ].map(([n, q, r]) => `
                    <tr>
                      <td>${n}</td>
                      <td class="right mono">${q}</td>
                      <td class="right mono" style="color:var(--bronze)">${money2(r)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      },
      after: () => {
        // Revenue line
        chart('ch-rev', {
          type: 'line',
          data: {
            labels: A.REVENUE_30.map(d => d.date),
            datasets: [{
              data: A.REVENUE_30.map(d => d.value),
              borderColor: '#B58A4B',
              backgroundColor: (ctx) => {
                const c = ctx.chart.ctx;
                if (!c) return 'rgba(180,138,75,0.2)';
                return gradient(c, 'rgba(180,138,75,0.4)', 'rgba(180,138,75,0)');
              },
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#B58A4B',
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: {
              backgroundColor: '#1D1814', borderColor: 'rgba(180,138,75,0.3)', borderWidth: 1,
              titleColor: '#F4ECDB', bodyColor: '#B58A4B', padding: 12,
              callbacks: { label: ctx => money(ctx.parsed.y) }
            } },
            scales: {
              y: { grid: { color: 'rgba(180,138,75,0.06)' }, ticks: { callback: v => '$' + v } },
              x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
            },
          }
        });
        // Channel doughnut
        chart('ch-channel', {
          type: 'doughnut',
          data: {
            labels: ['In-store POS', 'Online / Pickup', 'Delivery Apps'],
            datasets: [{
              data: [54, 38, 8],
              backgroundColor: ['#B58A4B', '#6B97B5', '#D4955D'],
              borderColor: '#0E0B08',
              borderWidth: 4,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: { position: 'bottom', labels: { padding: 16, boxWidth: 8, boxHeight: 8, usePointStyle: true } },
              tooltip: { callbacks: { label: ctx => ctx.label + ' · ' + ctx.parsed + '%' } },
            },
          }
        });

        // Simulate live order arrivals
        startLiveOrderSim();
      },
    },

    /* ----- ORDERS ----- */
    orders: {
      title: 'Orders',
      sub: 'In-store POS + Online + Delivery',
      render: () => {
        const queued = A.ORDERS.filter(o => o.status === 'queued').length;
        const prep   = A.ORDERS.filter(o => o.status === 'preparing').length;
        const ready  = A.ORDERS.filter(o => o.status === 'ready').length;
        return `
          <div class="kpi-grid">
            ${kpi('Queued', queued, '◐', null, 'awaiting prep', 'warn')}
            ${kpi('Preparing', prep, '☕', null, 'on the bar', 'info')}
            ${kpi('Ready', ready, '✓', null, 'pickup or runner', 'success')}
            ${kpi('Completed today', 248, '✦', '+8.3', 'vs yesterday')}
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">All Orders</div>
                <div class="card-sub">Live · click any row to inspect</div>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-sec btn-sm">All channels ▾</button>
                <button class="btn btn-sec btn-sm">Today ▾</button>
                <button class="btn btn-pri btn-sm">+ New Order</button>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th class="right">Total</th>
                  <th class="right">Tip</th>
                  <th class="right">Placed</th>
                </tr>
              </thead>
              <tbody>
                ${A.ORDERS.slice(0, 22).map(o => `
                  <tr>
                    <td class="mono" style="color:var(--bronze)">#${o.id}</td>
                    <td>${o.customer}</td>
                    <td>${channelChip(o.channel)}</td>
                    <td>${o.itemCount}</td>
                    <td>${statusPill(o.status)}</td>
                    <td class="right mono">${money2(o.total)}</td>
                    <td class="right mono" style="color:var(--text-mute)">${money2(o.tip)}</td>
                    <td class="right mono" style="color:var(--text-mute)">${o.placed}m ago</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      },
    },

    /* ----- REPORTS ----- */
    reports: {
      title: 'Reports',
      sub: 'Daily, weekly, monthly performance',
      render: () => `
        <div class="row-grid r-1-1" style="margin-bottom:24px;">
          <div class="card">
            <div class="card-head">
              <div><div class="card-title">Revenue vs Orders</div><div class="card-sub">30 days</div></div>
            </div>
            <div class="chart-wrap"><canvas id="ch-rep-rev"></canvas></div>
          </div>
          <div class="card">
            <div class="card-head">
              <div><div class="card-title">Hourly Heat</div><div class="card-sub">Average order volume by hour, last 14d</div></div>
            </div>
            <div class="chart-wrap"><canvas id="ch-rep-hour"></canvas></div>
          </div>
        </div>
        <div class="row-grid r-1-1">
          <div class="card">
            <div class="card-head"><div><div class="card-title">Category Mix</div></div></div>
            <div class="chart-wrap"><canvas id="ch-rep-cat"></canvas></div>
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Day-of-Week Performance</div></div></div>
            <div class="chart-wrap"><canvas id="ch-rep-dow"></canvas></div>
          </div>
        </div>
      `,
      after: () => {
        chart('ch-rep-rev', {
          type: 'bar',
          data: {
            labels: A.REVENUE_30.map(d => d.date),
            datasets: [
              { label: 'Revenue', data: A.REVENUE_30.map(d => d.value), backgroundColor: 'rgba(180,138,75,0.6)', borderRadius: 4, order: 2 },
              { label: 'Orders', data: A.ORDERS_30.map(d => d.value), type: 'line', borderColor: '#6B97B5', backgroundColor: '#6B97B5', tension: 0.4, yAxisID: 'y1', borderWidth: 2, pointRadius: 0, order: 1 }
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
            scales: {
              y: { position: 'left', grid: { color: 'rgba(180,138,75,0.06)' }, ticks: { callback: v => '$' + v } },
              y1: { position: 'right', grid: { display: false } },
              x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
            }
          }
        });
        chart('ch-rep-hour', {
          type: 'bar',
          data: {
            labels: ['5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p'],
            datasets: [{
              data: [4, 12, 32, 48, 38, 26, 22, 28, 26, 18, 14, 16, 22, 28, 24, 18, 14, 10],
              backgroundColor: ctx => {
                const v = ctx.parsed?.y || 0;
                if (v > 40) return '#B58A4B';
                if (v > 25) return 'rgba(180,138,75,0.7)';
                if (v > 15) return 'rgba(180,138,75,0.4)';
                return 'rgba(180,138,75,0.2)';
              },
              borderRadius: 3,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: 'rgba(180,138,75,0.06)' } }, x: { grid: { display: false } } }
          }
        });
        chart('ch-rep-cat', {
          type: 'polarArea',
          data: {
            labels: ['Espresso', 'Signature', 'Matcha & Tea', 'Cold', 'Refreshers', 'Food', 'Pastries'],
            datasets: [{
              data: [320, 248, 142, 186, 112, 158, 96],
              backgroundColor: ['rgba(180,138,75,0.7)', 'rgba(212,149,93,0.7)', 'rgba(107,157,122,0.7)', 'rgba(107,151,181,0.7)', 'rgba(199,111,112,0.7)', 'rgba(180,138,75,0.5)', 'rgba(212,149,93,0.4)'],
              borderColor: '#0E0B08',
              borderWidth: 2,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, scales: { r: { ticks: { display: false }, grid: { color: 'rgba(180,138,75,0.1)' } } } }
        });
        chart('ch-rep-dow', {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [2680, 2740, 2820, 3140, 3680, 3940, 3280],
              backgroundColor: 'rgba(180,138,75,0.6)',
              borderRadius: 4,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: 'rgba(180,138,75,0.06)' }, ticks: { callback: v => '$' + v } }, x: { grid: { display: false } } }
          }
        });
      },
    },

    /* ----- MENU ----- */
    menu: {
      title: 'Menu',
      sub: 'Manage items, pricing, availability',
      render: () => {
        const cats = window.AROMA_CATEGORIES;
        return `
          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">${window.AROMA_MENU.length} items across ${cats.length} categories</div>
                <div class="card-sub">Drag to reorder · Toggle to hide from menu</div>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-sec btn-sm">Categories ▾</button>
                <button class="btn btn-sec btn-sm">Export</button>
                <button class="btn btn-pri btn-sm">+ Add Item</button>
              </div>
            </div>

            ${cats.map(cat => {
              const items = window.AROMA_MENU.filter(i => i.cat === cat.id);
              if (!items.length) return '';
              return `
                <div style="margin-top:24px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                      <span style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:22px; color:var(--text);">${cat.name}</span>
                      <span style="font-size:11px; color:var(--text-mute); letter-spacing:.16em; text-transform:uppercase; margin-left:12px;">${items.length} items</span>
                    </div>
                    <button class="card-action">Edit category</button>
                  </div>
                  <div class="product-list">
                    ${items.map(item => `
                      <div class="product-row">
                        <div class="thumb">${item.img ? `<img src="../assets/img/${item.img}.jpg" />` : `<span class="ph">${cat.icon}</span>`}</div>
                        <div>
                          <div class="name">${item.name} ${item.popular ? '<span class="pill bronze" style="margin-left:8px;">★ Popular</span>' : ''} ${item.badge ? `<span class="pill" style="margin-left:8px;">${item.badge}</span>` : ''}</div>
                          <div class="cat">${item.desc.slice(0, 80)}${item.desc.length > 80 ? '…' : ''}</div>
                        </div>
                        <div class="price">${money2(item.price)}</div>
                        <div class="stock"><span class="pill success dot">In Stock</span></div>
                        <div style="display:flex; gap:8px; align-items:center;">
                          <span class="toggle on" title="Visible on menu"></span>
                          <button class="btn-icon-sm" title="Edit">✎</button>
                          <button class="btn-icon-sm" title="More">⋯</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      },
      after: () => {
        document.querySelectorAll('.toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));
      },
    },

    /* ----- INVENTORY ----- */
    inventory: {
      title: 'Inventory',
      sub: 'Stock levels · auto-reorder · suppliers',
      render: () => {
        const low = A.INVENTORY.filter(i => i.stock / i.par < 0.4);
        return `
          <div class="kpi-grid">
            ${kpi('SKUs Tracked', A.INVENTORY.length, '⊟', null, 'across 8 suppliers')}
            ${kpi('Low Stock', low.length, '⚠', null, 'below 40% of par', 'warn')}
            ${kpi('Avg Days On Hand', '7.2', '⌛', null, 'all categories')}
            ${kpi('Inventory Value', money(A.INVENTORY.reduce((s,i) => s + i.stock * i.cost, 0)), '◊', null, 'at cost')}
          </div>

          <div class="card">
            <div class="card-head">
              <div><div class="card-title">Stock Levels</div><div class="card-sub">All SKUs · sorted by urgency</div></div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-sec btn-sm">Order Suggested</button>
                <button class="btn btn-pri btn-sm">+ Add SKU</button>
              </div>
            </div>
            ${[...A.INVENTORY].sort((a,b) => (a.stock/a.par) - (b.stock/b.par)).map(i => {
              const pct = Math.round(i.stock / i.par * 100);
              const cls = pct < 20 ? 'crit' : pct < 40 ? 'warn' : '';
              return `
                <div class="inv-row">
                  <div>
                    <div class="nm">${i.name}</div>
                    <div class="sub">${i.sub} · ${i.supplier}</div>
                  </div>
                  <div class="inv-bar"><i class="${cls}" style="width:${Math.min(pct,100)}%"></i></div>
                  <div class="inv-pct">${pct}%</div>
                  <div>
                    <span class="mono" style="color:var(--text-dim); font-size:12px;">${i.stock} / ${i.par} ${i.unit}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      },
    },

    /* ----- KITCHEN DISPLAY ----- */
    kitchen: {
      title: 'Kitchen Display',
      sub: 'Real-time barista + kitchen tickets',
      render: () => {
        const tix = A.ORDERS.filter(o => o.status !== 'completed').slice(0, 9);
        return `
          <div class="card-head" style="margin-bottom:16px;">
            <div><div class="card-title">Active Tickets</div><div class="card-sub">${tix.length} on the bar</div></div>
            <div style="display:flex; gap:8px;">
              <span class="pill success dot">Bar Running 5:42</span>
              <button class="btn btn-sec btn-sm">Fullscreen</button>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
            ${tix.map(o => `
              <div class="card" style="padding:18px; ${o.status === 'queued' ? 'border-color:var(--bronze);' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                  <div>
                    <div class="mono" style="color:var(--bronze); font-weight:600; font-size:16px;">#${o.id}</div>
                    <div style="font-size:12px; color:var(--text-mute); margin-top:2px;">${o.customer} · ${o.placed}m ago</div>
                  </div>
                  ${channelChip(o.channel)}
                </div>
                <div style="border-top:1px solid var(--border); padding-top:12px;">
                  ${o.items.map(it => `
                    <div style="display:flex; justify-content:space-between; padding:6px 0; font-size:13px;">
                      <span>${it.name}</span>
                      <span class="mono" style="color:var(--text-mute);">${money2(it.price)}</span>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:12px; display:flex; gap:8px;">
                  ${o.status === 'queued' ? '<button class="btn btn-pri btn-sm" style="flex:1;">Start →</button>' : ''}
                  ${o.status === 'preparing' ? '<button class="btn btn-pri btn-sm" style="flex:1;">Mark Ready →</button>' : ''}
                  ${o.status === 'ready' ? '<button class="btn btn-pri btn-sm" style="flex:1;">Complete ✓</button>' : ''}
                  <button class="btn btn-sec btn-sm">⋯</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      },
    },

    /* ----- STAFF ----- */
    staff: {
      title: 'Staff',
      sub: 'Team roster · onboarding · performance',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Active Staff', A.STAFF.filter(s => s.status === 'active').length, '◍', null, 'on payroll')}
          ${kpi('In Training', A.STAFF.filter(s => s.status === 'training').length, '◐', null, '90-day program', 'info')}
          ${kpi('Avg Rating', '4.7', '★', null, 'guest-rated')}
          ${kpi('Open Positions', '2', '+', null, 'barista + line cook', 'warn')}
        </div>

        <div class="card">
          <div class="card-head">
            <div><div class="card-title">Team Roster</div><div class="card-sub">${A.STAFF.length} members</div></div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sec btn-sm">Time Clock</button>
              <button class="btn btn-sec btn-sm">Payroll</button>
              <button class="btn btn-pri btn-sm">+ Add Staff</button>
            </div>
          </div>
          <div class="staff-grid">
            ${A.STAFF.map(s => `
              <div class="staff-card">
                <div class="staff-avatar">${initials(s.name)}</div>
                <div class="staff-info">
                  <div class="name">${s.name}</div>
                  <div class="role">${s.role} · <span style="color:var(--bronze)">${s.wage}</span></div>
                  <div class="meta">
                    <span>${s.tenure}</span>
                    <span>★ ${s.rating}</span>
                    ${s.status === 'training' ? '<span style="color:var(--amber)">Training</span>' : '<span style="color:var(--leaf)">●</span>'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `,
    },

    /* ----- SCHEDULING ----- */
    scheduling: {
      title: 'Scheduling',
      sub: 'Weekly shifts · swap requests · time-off',
      render: () => {
        const { blocks, schedule } = A.BUILD_SCHEDULE();
        const today = new Date();
        return `
          <div class="card-head" style="margin-bottom:16px;">
            <div><div class="card-title">Week of ${A.WEEK[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${A.WEEK[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div><div class="card-sub">${Object.values(schedule).flat().flat().length} shifts scheduled</div></div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sec btn-sm">‹ Prev Week</button>
              <button class="btn btn-sec btn-sm">Next Week ›</button>
              <button class="btn btn-sec btn-sm">Time-Off Requests <span class="pill danger" style="margin-left:4px;">3</span></button>
              <button class="btn btn-pri btn-sm">+ Add Shift</button>
            </div>
          </div>

          <div class="cal-head">
            <div class="col"></div>
            ${A.WEEK.map(d => {
              const isToday = d.toDateString() === today.toDateString();
              return `<div class="col ${isToday ? 'today' : ''}">${d.toLocaleDateString('en-US', { weekday: 'short' })}<strong>${d.getDate()}</strong></div>`;
            }).join('')}
          </div>
          <div class="cal-body">
            ${blocks.map((b, bi) => `
              <div class="cal-time">${b}</div>
              ${A.WEEK.map((_, di) => `
                <div class="cal-cell">
                  ${(schedule[di][bi] || []).map(s => `
                    <div class="shift ${s.type}">
                      <div class="who">${s.who.split(' ')[0]}</div>
                      <div class="role">${s.role}</div>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            `).join('')}
          </div>

          <div class="row-grid r-1-1" style="margin-top:24px;">
            <div class="card">
              <div class="card-head"><div><div class="card-title">Swap Requests</div></div></div>
              ${['Yusuf Garcia wants to swap Friday 2p-6p with Sara Khan', 'Tariq Davis requested Saturday 10p-12a off (weddings)', 'Maya Nguyen offering Wednesday 6p-10p'].map(t => `
                <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px;">
                  <span style="font-size:13px; color:var(--text-dim);">${t}</span>
                  <div style="display:flex; gap:6px;">
                    <button class="btn-icon-sm" style="color:var(--leaf)">✓</button>
                    <button class="btn-icon-sm" style="color:var(--rose)">×</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="card">
              <div class="card-head"><div><div class="card-title">Labor Cost — This Week</div></div></div>
              <div style="display:flex; align-items:end; justify-content:space-between; margin-bottom:12px;">
                <div>
                  <div style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:42px; color:var(--text);">$8,420</div>
                  <div style="font-size:12px; color:var(--text-mute);">${'$1,203/day avg · 28.2% of revenue'}</div>
                </div>
                <span class="pill success dot">On Track</span>
              </div>
              <div class="chart-wrap-sm" style="height:140px;"><canvas id="ch-labor"></canvas></div>
            </div>
          </div>
        `;
      },
      after: () => {
        chart('ch-labor', {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              { label: 'Labor', data: [1080, 1120, 1140, 1280, 1380, 1490, 1180], backgroundColor: 'rgba(180,138,75,0.6)', borderRadius: 3 },
              { label: 'Budget', type: 'line', data: [1200, 1200, 1200, 1300, 1500, 1500, 1200], borderColor: 'rgba(199,111,112,0.7)', borderDash: [4,4], borderWidth: 1.5, pointRadius: 0 },
            ],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } }, scales: { y: { ticks: { callback: v => '$' + v }, grid: { color: 'rgba(180,138,75,0.06)' } }, x: { grid: { display: false } } } }
        });
      },
    },

    /* ----- CUSTOMERS ----- */
    customers: {
      title: 'Customers',
      sub: 'Guest CRM · profiles · spend history',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Total Guests', A.CUSTOMERS.length.toLocaleString(), '◐', '+12.4', '30-day')}
          ${kpi('Repeat Rate', '64%', '↻', '+3.2', 'vs prior 30')}
          ${kpi('Avg Visits / mo', '4.2', '☕', null, 'per active guest')}
          ${kpi('Lifetime Value', money(186), '◊', null, 'per guest')}
        </div>
        <div class="card">
          <div class="card-head">
            <div><div class="card-title">Top Guests</div><div class="card-sub">By visit frequency</div></div>
            <div style="display:flex; gap:8px;">
              <input type="text" placeholder="Search guest…" style="background:var(--surface-2); border:1px solid var(--border); border-radius:var(--r-sm); padding:8px 12px; color:var(--text); font-size:12px;" />
              <button class="btn btn-sec btn-sm">Export</button>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr><th>Guest</th><th>Tier</th><th class="right">Visits</th><th class="right">Lifetime Spend</th><th class="right">Loyalty Points</th><th class="right">Last Seen</th></tr>
            </thead>
            <tbody>
              ${A.CUSTOMERS.slice(0, 20).map(c => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="staff-avatar" style="width:32px; height:32px; font-size:11px;">${initials(c.name)}</div>
                      <div>
                        <div style="font-weight:500; color:var(--text);">${c.name}</div>
                        <div style="font-size:11px; color:var(--text-mute);">${c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>${tierPill(c.tier)}</td>
                  <td class="right mono">${c.visits}</td>
                  <td class="right mono">${money(c.spend)}</td>
                  <td class="right mono" style="color:var(--bronze)">${c.points.toLocaleString()}</td>
                  <td class="right mono" style="color:var(--text-mute)">${c.lastSeen}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,
    },

    /* ----- LOYALTY ----- */
    loyalty: {
      title: 'Loyalty Program',
      sub: 'Tiers, rewards, redemptions',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Members', '2,840', '✦', '+186', 'this month')}
          ${kpi('Gold Tier', '186', '◆', '+12', 'vs last month', 'bronze')}
          ${kpi('Points Earned', '142K', '+', null, '30 days')}
          ${kpi('Redemption Rate', '42%', '↻', '+5.1', 'vs benchmark', 'success')}
        </div>

        <div class="row-grid r-2">
          <div class="card">
            <div class="card-head"><div><div class="card-title">Tier Structure</div></div><button class="btn btn-sec btn-sm">Edit Tiers</button></div>
            ${[
              ['Member',  '0–199 pts',     'Welcome free pastry on signup · earn 1pt/$1'],
              ['Silver',  '200–999 pts',   '+ Free drink every 10th visit · early menu access'],
              ['Gold',    '1,000+ pts',    '+ Birthday treat · invite to seasonal tastings · 2x points on Mondays'],
            ].map(([t, r, d], i) => `
              <div style="padding:16px 0; border-bottom:${i < 2 ? '1px solid var(--border)' : '0'};">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                  <div style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:24px; color:var(--bronze);">${t}</div>
                  <div class="mono" style="font-size:12px; color:var(--text-mute);">${r}</div>
                </div>
                <p style="margin-top:6px; color:var(--text-dim); font-size:13px;">${d}</p>
              </div>
            `).join('')}
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Active Rewards</div></div></div>
            <div class="chart-wrap-sm" style="height:200px;"><canvas id="ch-rewards"></canvas></div>
            <div style="margin-top:16px;">
              ${['Free 12oz drink · 100 pts', 'Free pastry · 75 pts', 'Free signature latte · 200 pts', '15% off catering · 500 pts'].map(t => `
                <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:13px;">${t}</span>
                  <span class="toggle on"></span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `,
      after: () => {
        chart('ch-rewards', {
          type: 'doughnut',
          data: {
            labels: ['Free Drink', 'Free Pastry', 'Sig Latte', 'Catering Discount'],
            datasets: [{ data: [248, 182, 96, 32], backgroundColor: ['#B58A4B', '#D4955D', '#6B97B5', '#6B9D7A'], borderColor: '#0E0B08', borderWidth: 3 }]
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { boxWidth: 8, usePointStyle: true, padding: 12 } } } }
        });
        document.querySelectorAll('.toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));
      },
    },

    /* ----- MARKETING ----- */
    marketing: {
      title: 'Marketing',
      sub: 'Campaigns · email · paid social',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Active Campaigns', '3', '◬', null, '2 live · 1 paused', 'info')}
          ${kpi('Spend MTD', money(914), '◊', '+12.4', 'of $1,800 budget')}
          ${kpi('ROAS', '4.6x', '↗', '+0.4', 'vs prior month', 'success')}
          ${kpi('New Signups', '186', '+', null, '30 days', 'bronze')}
        </div>
        <div class="card">
          <div class="card-head">
            <div><div class="card-title">Campaigns</div></div>
            <button class="btn btn-pri btn-sm">+ New Campaign</button>
          </div>
          <table class="table">
            <thead><tr><th>Campaign</th><th>Channel</th><th>Status</th><th class="right">Budget</th><th class="right">Spent</th><th class="right">Impr.</th><th class="right">Clicks</th><th class="right">CVR</th><th class="right">Started</th></tr></thead>
            <tbody>
              ${A.CAMPAIGNS.map(c => `
                <tr>
                  <td><div style="font-weight:500; color:var(--text);">${c.name}</div></td>
                  <td><span style="font-size:12px; color:var(--text-mute);">${c.channel}</span></td>
                  <td><span class="pill ${c.status === 'live' ? 'success' : c.status === 'paused' ? 'warn' : 'info'} dot">${c.status}</span></td>
                  <td class="right mono">${c.budget ? money(c.budget) : '—'}</td>
                  <td class="right mono">${c.spent ? money(c.spent) : '—'}</td>
                  <td class="right mono">${c.impressions.toLocaleString()}</td>
                  <td class="right mono">${c.clicks.toLocaleString()}</td>
                  <td class="right mono" style="color:var(--bronze)">${c.conv}</td>
                  <td class="right mono" style="color:var(--text-mute)">${c.start}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="card" style="margin-top:24px;">
          <div class="card-head"><div><div class="card-title">UTM Performance</div><div class="card-sub">Last 30 days</div></div></div>
          <div class="chart-wrap"><canvas id="ch-utm"></canvas></div>
        </div>
      `,
      after: () => {
        chart('ch-utm', {
          type: 'bar',
          data: {
            labels: ['Instagram', 'TikTok', 'Google Search', 'Email', 'Facebook', 'Direct', 'Referral'],
            datasets: [
              { label: 'Sessions', data: [3240, 5860, 2480, 1840, 940, 1620, 480], backgroundColor: 'rgba(180,138,75,0.6)', borderRadius: 4 },
              { label: 'Conversions', data: [212, 348, 312, 178, 64, 142, 38], backgroundColor: 'rgba(107,151,181,0.6)', borderRadius: 4 },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
            scales: { y: { grid: { color: 'rgba(180,138,75,0.06)' } }, x: { grid: { display: false } } }
          }
        });
      },
    },

    /* ----- SOCIAL ----- */
    social: {
      title: 'Social',
      sub: 'Connected accounts · engagement · listening',
      render: () => `
        <div class="social-grid">
          ${socialTile('ig', 'Instagram', A.SOCIAL.instagram)}
          ${socialTile('tk', 'TikTok',    A.SOCIAL.tiktok)}
          ${socialTile('fb', 'Facebook',  A.SOCIAL.facebook)}
        </div>

        <div class="row-grid r-2" style="margin-top:24px;">
          <div class="card">
            <div class="card-head">
              <div><div class="card-title">Follower Growth — 90 day</div></div>
            </div>
            <div class="chart-wrap"><canvas id="ch-social"></canvas></div>
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Google Business</div></div></div>
            <div style="text-align:center; padding:24px 0 8px;">
              <div style="font-family:'Cormorant Garamond',serif; font-style:italic; font-size:72px; color:var(--bronze); line-height:1;">4.9</div>
              <div style="color:var(--bronze); font-size:18px; margin-top:4px;">★★★★★</div>
              <div style="font-size:12px; color:var(--text-mute); margin-top:8px;">${A.SOCIAL.google.reviews} reviews · ${A.SOCIAL.google.growth} this week</div>
            </div>
            <div style="border-top:1px solid var(--border); padding-top:16px; margin-top:16px;">
              ${[['5★', 84], ['4★', 11], ['3★', 3], ['2★', 1], ['1★', 1]].map(([l, p]) => `
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                  <span style="width:24px; font-size:11px; color:var(--text-mute);">${l}</span>
                  <div style="flex:1; height:6px; background:var(--surface-3); border-radius:999px; overflow:hidden;">
                    <div style="width:${p}%; height:100%; background:var(--bronze);"></div>
                  </div>
                  <span class="mono" style="width:32px; text-align:right; font-size:11px;">${p}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:24px;">
          <div class="card-head"><div><div class="card-title">Recent Posts</div></div><button class="btn btn-pri btn-sm">+ New Post</button></div>
          <table class="table">
            <thead><tr><th>Post</th><th>Channel</th><th class="right">Reach</th><th class="right">Eng.</th><th class="right">Saves</th><th class="right">Sends</th><th class="right">Posted</th></tr></thead>
            <tbody>
              ${[
                ['"The Aroma" — rose petal latte close-up',     'IG · Reel',    18420, 1840, 312, 142, '2h'],
                ['Kunafa Waffle plate-up — 14 sec',             'TT',           62800, 6240, 420, 1820, '8h'],
                ['Saffron Season is here',                       'IG · Post',   8420,  640,  86,  18,  '1d'],
                ['Behind the bar — pulling 100 shots an hour', 'TT',           42100, 4820, 380, 940, '2d'],
                ['"Where Arabia meets the artisan"',           'IG · Story',   3200,  186,  4,   12,  '3d'],
              ].map(([t, c, r, e, s, sn, p]) => `
                <tr><td>${t}</td><td><span style="font-size:11px;color:var(--text-mute)">${c}</span></td><td class="right mono">${r.toLocaleString()}</td><td class="right mono" style="color:var(--bronze)">${e.toLocaleString()}</td><td class="right mono">${s}</td><td class="right mono">${sn}</td><td class="right mono" style="color:var(--text-mute)">${p} ago</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,
      after: () => {
        chart('ch-social', {
          type: 'line',
          data: {
            labels: Array.from({ length: 30 }, (_, i) => `D-${30-i}`),
            datasets: [
              { label: 'Instagram', data: gen90(14820, 32), borderColor: '#FD1D1D', backgroundColor: 'rgba(253,29,29,0.05)', tension: 0.4, pointRadius: 0, borderWidth: 2 },
              { label: 'TikTok',    data: gen90(26430, 64), borderColor: '#F4ECDB', backgroundColor: 'rgba(244,236,219,0.05)', tension: 0.4, pointRadius: 0, borderWidth: 2 },
              { label: 'Facebook',  data: gen90(3940, 4),   borderColor: '#1877F2', backgroundColor: 'rgba(24,119,242,0.05)', tension: 0.4, pointRadius: 0, borderWidth: 2 },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } },
            scales: { y: { grid: { color: 'rgba(180,138,75,0.06)' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } } }
          }
        });
      },
    },

    /* ----- REVIEWS ----- */
    reviews: {
      title: 'Reviews',
      sub: 'Google · Yelp · Instagram · Tripadvisor',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Avg Rating', '4.9', '★', '+0.1', 'last 30d')}
          ${kpi('Total Reviews', '486', '◇', '+42', '30 days')}
          ${kpi('Response Rate', '94%', '↻', null, 'within 24h')}
          ${kpi('Flagged', '2', '⚠', null, 'needs response', 'warn')}
        </div>

        <div class="row-grid r-2">
          <div class="card">
            <div class="card-head"><div><div class="card-title">Recent Reviews</div></div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-sec btn-sm">All sources ▾</button>
                <button class="btn btn-sec btn-sm">Last 30d ▾</button>
              </div>
            </div>
            ${A.REVIEWS.map(r => `
              <div class="review">
                <div class="review-head">
                  <div>
                    <div class="review-author">${r.author}</div>
                    <div class="review-meta">${r.source} · ${r.time}</div>
                  </div>
                  <div class="review-stars">${'★'.repeat(r.stars)}<span style="opacity:.2">${'★'.repeat(5 - r.stars)}</span></div>
                </div>
                <div class="review-text">"${r.text}"</div>
                <div style="margin-top:10px; display:flex; gap:8px;">
                  <button class="btn btn-sec btn-sm">Reply</button>
                  <button class="btn btn-sec btn-sm">Mark Read</button>
                  ${r.stars < 4 ? '<button class="btn btn-sm" style="background:rgba(199,111,112,0.16); color:var(--rose);">Escalate</button>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Sentiment</div></div></div>
            <div class="chart-wrap"><canvas id="ch-sent"></canvas></div>
            <div style="margin-top:16px;">
              <div style="font-size:11px; color:var(--text-mute); letter-spacing:.16em; text-transform:uppercase; margin-bottom:8px;">Most Mentioned</div>
              ${['"atmosphere" (94)', '"baklava" (62)', '"latte art" (58)', '"pistachio" (54)', '"service" (51)', '"saffron" (38)', '"wait" (12, neg)'].map(t => `
                <div style="padding:8px 0; border-bottom:1px solid var(--border); font-size:13px;">${t}</div>
              `).join('')}
            </div>
          </div>
        </div>
      `,
      after: () => {
        chart('ch-sent', {
          type: 'doughnut',
          data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{ data: [88, 9, 3], backgroundColor: ['#6B9D7A', '#D4955D', '#C76F70'], borderColor: '#0E0B08', borderWidth: 3 }],
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, usePointStyle: true, padding: 12 } } } }
        });
      }
    },

    /* ----- ACCOUNTING ----- */
    accounting: {
      title: 'Accounting',
      sub: 'P&L · COGS · expenses · payouts',
      render: () => `
        <div class="kpi-grid">
          ${kpi('Revenue MTD', money(84260), '↗', '+17.3', 'vs last May')}
          ${kpi('COGS', money(24840), '⊟', null, '29.5% of rev')}
          ${kpi('Gross Profit', money(59420), '◊', '+22.1', '70.5% margin')}
          ${kpi('Net Income', money(22480), '✦', '+18.4', '26.7% margin', 'success')}
        </div>

        <div class="row-grid r-2" style="margin-bottom:24px;">
          <div class="card">
            <div class="card-head"><div><div class="card-title">P&L — May 2026</div><div class="card-sub">Through ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div></div></div>
            <table class="table">
              <tbody>
                ${[
                  ['Revenue · Drinks',            '$58,420',  null],
                  ['Revenue · Food',              '$18,940',  null],
                  ['Revenue · Pastries & Other',  '$ 6,900',  null],
                  ['Gross Revenue',               '$84,260',  'pri'],
                  ['COGS · Coffee',               '($ 8,420)', null],
                  ['COGS · Dairy & Milk Alt',     '($ 4,620)', null],
                  ['COGS · Food',                 '($ 6,840)', null],
                  ['COGS · Syrups & Garnishes',   '($ 1,820)', null],
                  ['COGS · Pastries',             '($ 1,940)', null],
                  ['COGS · Packaging',            '($ 1,200)', null],
                  ['Total COGS',                  '($24,840)', 'pri'],
                  ['Gross Profit',                '$59,420',  'big'],
                  ['Labor (incl. benefits)',      '($23,820)', null],
                  ['Rent + Utilities',            '($ 6,200)', null],
                  ['Marketing',                   '($ 1,840)', null],
                  ['Equipment Lease',             '($ 1,420)', null],
                  ['Other Operating',             '($ 3,660)', null],
                  ['Total Operating Expense',     '($36,940)', 'pri'],
                  ['Net Income',                  '$22,480',  'big'],
                ].map(([l, v, k]) => `
                  <tr>
                    <td style="${k === 'big' ? 'font-family:Cormorant Garamond,serif;font-style:italic;font-size:18px;color:var(--bronze);' : k === 'pri' ? 'font-weight:600;color:var(--text);' : ''}">${l}</td>
                    <td class="right mono" style="${k === 'big' ? 'font-family:JetBrains Mono;font-size:16px;color:var(--bronze);' : k === 'pri' ? 'color:var(--text);font-weight:600;' : ''}">${v}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Expenses by Category</div></div></div>
            <div class="chart-wrap"><canvas id="ch-exp"></canvas></div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div><div class="card-title">Recent Payouts</div></div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sec btn-sm">Stripe</button>
              <button class="btn btn-sec btn-sm">Square</button>
              <button class="btn btn-sec btn-sm">Export to QuickBooks</button>
            </div>
          </div>
          <table class="table">
            <thead><tr><th>Date</th><th>Source</th><th>Type</th><th class="right">Gross</th><th class="right">Fees</th><th class="right">Net</th><th>Status</th></tr></thead>
            <tbody>
              ${[
                ['May 22', 'Square POS',     'Daily batch', 4280, 132, 4148, 'paid'],
                ['May 21', 'Square POS',     'Daily batch', 3940, 122, 3818, 'paid'],
                ['May 20', 'Square POS',     'Daily batch', 3680, 114, 3566, 'paid'],
                ['May 19', 'Stripe (online)','Weekly',      8640, 286, 8354, 'paid'],
                ['May 19', 'DoorDash',       'Weekly',      1840, 482, 1358, 'paid'],
                ['May 19', 'Uber Eats',      'Weekly',      1320, 380, 940,  'pending'],
              ].map(r => `
                <tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="right mono">${money(r[3])}</td><td class="right mono" style="color:var(--rose)">${money(r[4])}</td><td class="right mono" style="color:var(--bronze)">${money(r[5])}</td><td>${r[6] === 'paid' ? '<span class="pill success dot">paid</span>' : '<span class="pill warn dot">pending</span>'}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,
      after: () => {
        chart('ch-exp', {
          type: 'doughnut',
          data: {
            labels: ['Labor', 'COGS', 'Rent/Util', 'Marketing', 'Equipment', 'Other'],
            datasets: [{ data: [23820, 24840, 6200, 1840, 1420, 3660], backgroundColor: ['#B58A4B', '#D4955D', '#6B97B5', '#6B9D7A', '#C76F70', '#7a6852'], borderColor: '#0E0B08', borderWidth: 3 }],
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { boxWidth: 8, usePointStyle: true, padding: 10 } }, tooltip: { callbacks: { label: ctx => ctx.label + ' · ' + money(ctx.parsed) } } } }
        });
      },
    },

    /* ----- PERMISSIONS ----- */
    permissions: {
      title: 'Permissions',
      sub: 'Role-based access · per area',
      render: () => `
        <div class="card">
          <div class="card-head">
            <div><div class="card-title">Access Matrix</div><div class="card-sub">Click cells to toggle</div></div>
            <button class="btn btn-pri btn-sm">+ Add Role</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Area</th>
                <th class="center">Owner</th>
                <th class="center">GM</th>
                <th class="center">Lead</th>
                <th class="center">Barista</th>
                <th class="center">Kitchen</th>
                <th class="center">Host</th>
              </tr>
            </thead>
            <tbody>
              ${A.PERMISSIONS.map(p => `
                <tr>
                  <td style="font-weight:500; color:var(--text);">${p.area}</td>
                  ${['owner', 'manager', 'lead', 'barista', 'kitchen', 'host'].map(r => `<td class="center">${permCell(p[r])}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="card" style="margin-top:24px;">
          <div class="card-head"><div><div class="card-title">Active Sessions</div></div></div>
          <table class="table">
            <thead><tr><th>User</th><th>Role</th><th>Device</th><th>Location</th><th>Started</th><th></th></tr></thead>
            <tbody>
              ${[
                ['Omar Hassan',  'Owner',     'iPad · Safari',      'Lounge · POS Terminal 1', '6:14 AM'],
                ['Layla Rahman', 'GM',         'MacBook · Chrome',   'Back office',             '7:02 AM'],
                ['Karim Patel',  'Lead Barista','iPhone · Mobile App','In lounge',              '5:58 AM'],
                ['Sara Khan',    'Barista',    'POS Terminal 2',     'Lounge · POS',            '9:30 AM'],
              ].map(s => `
                <tr>
                  <td><div style="display:flex;align-items:center;gap:10px;"><div class="staff-avatar" style="width:28px;height:28px;font-size:10px;">${initials(s[0])}</div>${s[0]}</div></td>
                  <td>${s[1]}</td>
                  <td>${s[2]}</td>
                  <td style="color:var(--text-mute);">${s[3]}</td>
                  <td class="mono" style="color:var(--text-mute);">${s[4]}</td>
                  <td class="right"><button class="btn btn-sec btn-sm">Sign Out</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `,
    },

    /* ----- SETTINGS ----- */
    settings: {
      title: 'Settings',
      sub: 'Account · integrations · preferences',
      render: () => `
        <div class="row-grid r-1-1">
          <div class="card">
            <div class="card-head"><div><div class="card-title">Business Profile</div></div></div>
            ${[
              ['Business Name', 'Aroma Lounge'],
              ['Address', '1361 W Hamilton Rd S, Fort Wayne, IN 46814'],
              ['Phone', '(260) 555-0142'],
              ['Email', 'hello@aromalounge.coffee'],
              ['Tax ID', 'XX-XXXXXXX'],
              ['Sales Tax Rate', '7.00% (Allen County, IN)'],
            ].map(([l, v]) => `
              <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); align-items:center;">
                <div><div style="font-size:11px; color:var(--text-mute); letter-spacing:.12em; text-transform:uppercase;">${l}</div><div style="margin-top:4px;">${v}</div></div>
                <button class="btn btn-sec btn-sm">Edit</button>
              </div>
            `).join('')}
          </div>
          <div class="card">
            <div class="card-head"><div><div class="card-title">Integrations</div></div></div>
            ${[
              ['Square POS', 'Connected · syncing every 60s', 'success'],
              ['Stripe', 'Online payments · payouts every Mon/Thu', 'success'],
              ['DoorDash', 'Connected · auto-accept on', 'success'],
              ['Uber Eats', 'Disconnected since Mar 18, 2026', 'warn'],
              ['QuickBooks Online', 'Bookkeeping sync · nightly', 'success'],
              ['Mailchimp', 'Connected · 2,840 contacts', 'success'],
              ['Meta Business', 'IG + FB managed', 'success'],
              ['Google Business', 'Listing verified', 'success'],
              ['Toast Online', 'Not configured', 'info'],
            ].map(([n, s, t]) => `
              <div style="display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); align-items:center;">
                <div><div style="font-weight:500;">${n}</div><div style="font-size:12px; color:var(--text-mute); margin-top:2px;">${s}</div></div>
                <span class="pill ${t} dot">${t === 'warn' ? 'reconnect' : t === 'info' ? 'configure' : 'live'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `,
    },

  };

  /* ========================================================================
     Helpers (UI fragments)
     ======================================================================== */

  function kpi(label, value, ico, delta, foot, deltaClass = 'up') {
    const dCls = delta && delta.toString().startsWith('-') ? 'down' : deltaClass;
    const dTxt = delta == null ? '' : (delta.toString().startsWith('-') ? delta : '+' + delta) + (typeof delta === 'string' && delta.endsWith('%') ? '' : '%');
    return `
      <div class="kpi">
        <div class="kpi-head">
          <div class="kpi-label">${label}</div>
          <div class="kpi-icon">${ico}</div>
        </div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-foot">
          ${delta != null ? `<span class="kpi-delta ${dCls}">${dTxt}</span>` : ''}
          ${foot ? `<span class="vs">${foot}</span>` : ''}
        </div>
      </div>
    `;
  }

  function channelChip(c) {
    const map = { online: ['IG', 'Online'], pos: ['T', 'In-store'], delivery: ['DD', 'Delivery'] };
    const [ic, lbl] = map[c] || ['?', c];
    return `<span class="channel ${c}"><span class="ic">${ic}</span>${lbl}</span>`;
  }
  function statusPill(s) {
    const map = { queued: ['warn', 'Queued'], preparing: ['info', 'Preparing'], ready: ['bronze', 'Ready'], completed: ['success', 'Done'] };
    const [c, l] = map[s] || ['', s];
    return `<span class="pill ${c} dot">${l}</span>`;
  }
  function tierPill(t) {
    if (t === 'Gold')   return `<span class="pill bronze dot">${t}</span>`;
    if (t === 'Silver') return `<span class="pill info dot">${t}</span>`;
    return `<span class="pill">${t}</span>`;
  }
  function permCell(v) {
    if (v === 'view+edit') return '<span style="color:var(--leaf); font-size:16px;">●</span><div style="font-size:9px; color:var(--text-mute); margin-top:2px;">view + edit</div>';
    if (v === 'view+swap') return '<span style="color:var(--bronze); font-size:16px;">●</span><div style="font-size:9px; color:var(--text-mute); margin-top:2px;">view + swap</div>';
    if (v === 'view')      return '<span style="color:var(--sky); font-size:16px;">●</span><div style="font-size:9px; color:var(--text-mute); margin-top:2px;">view</div>';
    if (v === 'self')      return '<span style="color:var(--amber); font-size:16px;">●</span><div style="font-size:9px; color:var(--text-mute); margin-top:2px;">self only</div>';
    return '<span style="color:var(--text-mute); font-size:14px;">—</span>';
  }
  function orderCardHTML(o) {
    return `
      <div class="order-card">
        <div class="num">#${o.id}</div>
        <div>
          <div class="name">${o.customer} <span style="margin-left:8px;">${channelChip(o.channel)}</span></div>
          <div class="meta">${o.itemCount} items · ${o.placed}m ago · ${statusPill(o.status)}</div>
        </div>
        <div>
          <div class="total">${money2(o.total)}</div>
          <div class="meta right" style="text-align:right;">+${money2(o.tip)} tip</div>
        </div>
      </div>
    `;
  }
  function socialTile(ic, name, data) {
    return `
      <div class="social-tile">
        <div class="social-tile-head">
          <div class="ic ${ic}">${ic.toUpperCase()}</div>
          <div>
            <div class="name">${name}</div>
            <div class="handle">${data.handle}</div>
          </div>
          <div style="margin-left:auto;"><span class="pill success dot">${data.growth} ${data.period}</span></div>
        </div>
        <div class="social-stats">
          <div class="social-stat"><div class="num">${formatK(data.followers)}</div><div class="lbl">Followers</div></div>
          <div class="social-stat"><div class="num">${data.posts}</div><div class="lbl">Posts</div></div>
          <div class="social-stat"><div class="num">${data.engagement}%</div><div class="lbl">Eng. Rate</div></div>
        </div>
      </div>
    `;
  }
  function formatK(n) { if (n == null) return '—'; if (n > 999) return (n/1000).toFixed(1) + 'k'; return n; }
  function gen90(base, vol) {
    const a = []; let v = base - 30 * vol;
    for (let i = 0; i < 30; i++) { v += vol * (1 + Math.random() * 0.6 - 0.3); a.push(Math.round(v)); }
    return a;
  }

  /* ========================================================================
     Live order simulation
     ======================================================================== */
  let simInterval;
  function startLiveOrderSim() {
    clearInterval(simInterval);
    simInterval = setInterval(() => {
      const feed = document.querySelector('#live-feed');
      if (!feed) { clearInterval(simInterval); return; }
      const newOrder = {
        id: A.ORDERS[0].id + 1,
        customer: Math.random() > 0.4 ? A.name() : 'Walk-in',
        channel: A.pick(['online', 'pos', 'pos', 'pos', 'delivery']),
        status: 'queued',
        itemCount: A.ri(1, 4),
        total: A.rand(8, 32).toFixed(2),
        tip: A.rand(1, 4).toFixed(2),
        placed: 0,
      };
      A.ORDERS.unshift(newOrder);
      const html = orderCardHTML(newOrder);
      const div = document.createElement('div');
      div.innerHTML = html;
      div.firstElementChild.classList.add('new');
      feed.insertBefore(div.firstElementChild, feed.firstChild);
      if (feed.children.length > 10) feed.removeChild(feed.lastChild);

      // Bump nav badge
      const badge = document.querySelector('.sb-item[data-view="orders"] .badge');
      if (badge) badge.textContent = +badge.textContent + 1;
    }, 14000);
  }

  /* Mobile sidebar trigger */
  const mt = document.querySelector('#mobile-trigger');
  if (mt) mt.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));

  /* Expose for inline onclick handlers */
  window.aromaGoTo = goTo;

  /* Init */
  const startView = (location.hash || '#dashboard').slice(1);
  goTo(startView in VIEW_DEFS ? startView : 'dashboard');

  /* React to manual hash change */
  window.addEventListener('hashchange', () => {
    const v = location.hash.slice(1);
    if (v in VIEW_DEFS && v !== currentView) goTo(v);
  });

  /* Set live date in top bar */
  const now = new Date();
  const dateEl = document.querySelector('#tb-date');
  if (dateEl) {
    dateEl.innerHTML = `<span class="live">Live</span> · ${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }

})();
