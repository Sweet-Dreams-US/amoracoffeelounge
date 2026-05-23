/* ========================================================================
   AROMA LOUNGE — Admin mock data
   Plausible, realistic data simulating a live coffee lounge
   ======================================================================== */

window.AROMA_ADMIN = (() => {

  const FIRST = ['Layla', 'Noor', 'Omar', 'Jasmine', 'Sara', 'Yusuf', 'Maya', 'Karim', 'Zara', 'Ali', 'Fatima', 'Hassan', 'Amira', 'Adam', 'Leila', 'Tariq', 'Rania', 'Sami', 'Hana', 'Kareem'];
  const LAST  = ['Hassan', 'Rahman', 'Khan', 'Patel', 'Nguyen', 'Garcia', 'Johnson', 'Lee', 'Brown', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Martinez', 'Jackson'];

  const rand  = (min, max) => Math.random() * (max - min) + min;
  const ri    = (min, max) => Math.floor(rand(min, max + 1));
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
  const name  = () => `${pick(FIRST)} ${pick(LAST)}`;

  /* ---------- Staff ---------- */
  const ROLES = [
    { id: 'owner',    name: 'Owner',         color: 'bronze' },
    { id: 'manager',  name: 'General Manager',color: 'leaf' },
    { id: 'lead',     name: 'Shift Lead',    color: 'leaf' },
    { id: 'barista',  name: 'Lead Barista',  color: 'bronze' },
    { id: 'barista2', name: 'Barista',       color: 'bronze' },
    { id: 'kitchen',  name: 'Kitchen',       color: 'amber' },
    { id: 'host',     name: 'Host',          color: 'sky' },
  ];

  const STAFF = [
    { id: 1,  name: 'Omar Hassan',    role: 'Owner',          email: 'omar@aromalounge.coffee',    phone: '(260) 555-0142', wage: '—',     tenure: '1y',  rating: 5.0, status: 'active' },
    { id: 2,  name: 'Layla Rahman',   role: 'General Manager',email: 'layla@aromalounge.coffee',   phone: '(260) 555-0143', wage: '$24/hr', tenure: '10mo',rating: 4.9, status: 'active' },
    { id: 3,  name: 'Karim Patel',    role: 'Lead Barista',   email: 'karim@aromalounge.coffee',   phone: '(260) 555-0144', wage: '$19/hr', tenure: '10mo',rating: 4.8, status: 'active' },
    { id: 4,  name: 'Jasmine Lee',    role: 'Shift Lead',     email: 'jasmine@aromalounge.coffee', phone: '(260) 555-0145', wage: '$18/hr', tenure: '8mo', rating: 4.7, status: 'active' },
    { id: 5,  name: 'Yusuf Garcia',   role: 'Barista',        email: 'yusuf@aromalounge.coffee',   phone: '(260) 555-0146', wage: '$16/hr', tenure: '6mo', rating: 4.6, status: 'active' },
    { id: 6,  name: 'Sara Khan',      role: 'Barista',        email: 'sara@aromalounge.coffee',    phone: '(260) 555-0147', wage: '$16/hr', tenure: '5mo', rating: 4.8, status: 'active' },
    { id: 7,  name: 'Maya Nguyen',    role: 'Barista',        email: 'maya@aromalounge.coffee',    phone: '(260) 555-0148', wage: '$15.50/hr', tenure: '4mo', rating: 4.5, status: 'active' },
    { id: 8,  name: 'Adam Wilson',    role: 'Kitchen',        email: 'adam@aromalounge.coffee',    phone: '(260) 555-0149', wage: '$17/hr', tenure: '7mo', rating: 4.7, status: 'active' },
    { id: 9,  name: 'Noor Brown',     role: 'Kitchen',        email: 'noor@aromalounge.coffee',    phone: '(260) 555-0150', wage: '$16/hr', tenure: '3mo', rating: 4.6, status: 'active' },
    { id: 10, name: 'Tariq Davis',    role: 'Barista',        email: 'tariq@aromalounge.coffee',   phone: '(260) 555-0151', wage: '$15.50/hr', tenure: '2mo', rating: 4.5, status: 'training' },
    { id: 11, name: 'Hana Miller',    role: 'Host',           email: 'hana@aromalounge.coffee',    phone: '(260) 555-0152', wage: '$15/hr',     tenure: '4mo', rating: 4.9, status: 'active' },
    { id: 12, name: 'Sami Anderson',  role: 'Host',           email: 'sami@aromalounge.coffee',    phone: '(260) 555-0153', wage: '$15/hr',     tenure: '3mo', rating: 4.7, status: 'active' },
    { id: 13, name: 'Rania Taylor',   role: 'Barista',        email: 'rania@aromalounge.coffee',   phone: '(260) 555-0154', wage: '$15.50/hr',  tenure: '1mo', rating: 4.4, status: 'training' },
  ];

  /* ---------- Customers ---------- */
  const CUSTOMERS = [];
  for (let i = 0; i < 28; i++) {
    CUSTOMERS.push({
      id: 1000 + i,
      name: name(),
      email: 'customer' + i + '@example.com',
      visits: ri(2, 88),
      points: ri(0, 1200),
      spend: rand(40, 2400).toFixed(2),
      tier: ri(0, 100) > 75 ? 'Gold' : ri(0, 100) > 35 ? 'Silver' : 'Member',
      lastSeen: ri(0, 14) + 'd ago',
    });
  }
  CUSTOMERS.sort((a, b) => b.visits - a.visits);

  /* ---------- Orders ---------- */
  const ORDER_STATUSES = ['queued', 'preparing', 'ready', 'completed'];
  const CHANNELS = ['online', 'pos', 'delivery'];
  const ITEMS_POOL = ['The Aroma Latte', 'Qahwa Service', 'Pistachio Rose', 'Cortado', 'Gold Dust Latte', 'Brown Sugar Oat', 'Ceremonial Matcha', 'Cold Brew', 'Belgian Waffle', 'Avocado Toast', 'Baklava (3)', 'Cappuccino', 'Karak Chai', 'Caramel Frappé', 'Mango Dragonfruit', 'Pain au Chocolat', 'Nitro Cold Brew', 'Pistachio Latte', 'Saffron Honey', 'Nutella Crepe', 'Shawarma Wrap', 'Lavender Honey', 'London Fog', 'Iced Latte'];

  const ORDERS = [];
  let orderNum = 10847;
  for (let i = 0; i < 64; i++) {
    const itemCount = ri(1, 5);
    const items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const it = pick(ITEMS_POOL);
      const p = rand(5, 14);
      items.push({ name: it, price: p });
      total += p;
    }
    const tax = total * 0.07;
    const ago = ri(1, 480);
    let status;
    if (ago < 3) status = 'queued';
    else if (ago < 10) status = 'preparing';
    else if (ago < 20) status = 'ready';
    else status = 'completed';

    ORDERS.push({
      id: orderNum--,
      customer: ri(0, 100) > 40 ? name() : 'Walk-in',
      channel: pick(CHANNELS),
      status,
      items,
      itemCount,
      subtotal: total.toFixed(2),
      tax: tax.toFixed(2),
      total: (total + tax).toFixed(2),
      tip: (total * (ri(15, 22) / 100)).toFixed(2),
      placed: ago,
    });
  }

  /* ---------- Inventory ---------- */
  const INVENTORY = [
    { name: 'Single-Origin Ethiopian Yirgacheffe', sub: 'Espresso beans · whole', stock: 78, par: 120, unit: 'lb', supplier: 'Onyx Roasting', cost: 14.50 },
    { name: 'Colombia La Esperanza', sub: 'Espresso beans · whole', stock: 92, par: 120, unit: 'lb', supplier: 'Onyx Roasting', cost: 13.25 },
    { name: 'Sumatra Mandheling', sub: 'Cold brew · whole', stock: 24, par: 60, unit: 'lb', supplier: 'Onyx Roasting', cost: 11.00 },
    { name: 'Whole Milk', sub: 'Local · 1gal', stock: 14, par: 30, unit: 'gal', supplier: 'Hilger Farms', cost: 3.20 },
    { name: 'Oat Milk (Oatly Barista)', sub: '32oz cartons', stock: 32, par: 60, unit: 'ctn', supplier: 'KeHE', cost: 4.10 },
    { name: 'Almond Milk', sub: '32oz cartons', stock: 18, par: 36, unit: 'ctn', supplier: 'KeHE', cost: 3.60 },
    { name: 'Coconut Milk (Califia Barista)', sub: '32oz cartons', stock: 9, par: 24, unit: 'ctn', supplier: 'KeHE', cost: 4.40 },
    { name: 'House Rose Syrup', sub: 'Made Tuesdays · 1L', stock: 6, par: 12, unit: 'L', supplier: 'House', cost: 8.00 },
    { name: 'House Cardamom Syrup', sub: 'Made Tuesdays · 1L', stock: 4, par: 12, unit: 'L', supplier: 'House', cost: 8.50 },
    { name: 'House Pistachio Syrup', sub: 'Made Mondays · 1L', stock: 3, par: 10, unit: 'L', supplier: 'House', cost: 11.00 },
    { name: 'Saffron Threads (Iranian)', sub: 'Premium · 5g', stock: 4, par: 8, unit: 'jar', supplier: 'Mehdi Imports', cost: 42.00 },
    { name: 'Ceremonial Matcha (Uji)', sub: 'Tin · 30g', stock: 11, par: 24, unit: 'tin', supplier: 'Ippodo', cost: 38.00 },
    { name: 'Vanilla Syrup', sub: 'Monin · 1L', stock: 8, par: 16, unit: 'L', supplier: 'Monin', cost: 12.50 },
    { name: 'Caramel Syrup', sub: 'Monin · 1L', stock: 9, par: 16, unit: 'L', supplier: 'Monin', cost: 12.50 },
    { name: 'Pistachios (raw)', sub: 'Bulk · 5lb', stock: 6, par: 10, unit: 'bag', supplier: 'Wholefoods', cost: 36.00 },
    { name: 'Dried Rose Petals', sub: 'Garnish · 100g', stock: 5, par: 10, unit: 'jar', supplier: 'Mehdi Imports', cost: 14.00 },
    { name: 'Medjool Dates', sub: 'Premium · 5lb', stock: 8, par: 12, unit: 'case', supplier: 'Mehdi Imports', cost: 28.00 },
    { name: 'Cardamom Pods (green)', sub: 'Whole · 500g', stock: 7, par: 10, unit: 'bag', supplier: 'Mehdi Imports', cost: 18.00 },
    { name: 'Edible Gold Leaf', sub: '24K · 25 sheets', stock: 1, par: 4, unit: 'book', supplier: 'Specialty', cost: 96.00 },
    { name: 'Croissants (frozen, par-baked)', sub: 'Case of 60', stock: 3, par: 6, unit: 'case', supplier: 'Bridor', cost: 84.00 },
    { name: 'Pain au Chocolat (frozen)', sub: 'Case of 60', stock: 2, par: 4, unit: 'case', supplier: 'Bridor', cost: 92.00 },
    { name: 'Baklava (house-made)', sub: 'Trays of 24', stock: 4, par: 6, unit: 'tray', supplier: 'House', cost: 18.00 },
    { name: 'Belgian Waffle Batter Mix', sub: '5lb bags', stock: 6, par: 10, unit: 'bag', supplier: 'Sysco', cost: 22.00 },
    { name: '8oz Hot Cups (compostable)', sub: 'Sleeve of 50', stock: 28, par: 40, unit: 'sleeve', supplier: 'Eco Products', cost: 14.50 },
    { name: '16oz Hot Cups', sub: 'Sleeve of 50', stock: 22, par: 40, unit: 'sleeve', supplier: 'Eco Products', cost: 17.00 },
    { name: '12oz Cold Cups', sub: 'Sleeve of 50', stock: 19, par: 40, unit: 'sleeve', supplier: 'Eco Products', cost: 15.50 },
    { name: 'Cup Lids (universal)', sub: 'Sleeve of 100', stock: 30, par: 50, unit: 'sleeve', supplier: 'Eco Products', cost: 9.20 },
    { name: 'Cup Sleeves', sub: '1200/case', stock: 2, par: 4, unit: 'case', supplier: 'Eco Products', cost: 38.00 },
    { name: 'Sugar packets', sub: '1000/box', stock: 5, par: 8, unit: 'box', supplier: 'Sysco', cost: 11.40 },
    { name: 'Lavash (flatbread)', sub: 'Case of 24', stock: 5, par: 8, unit: 'case', supplier: 'Mehdi Imports', cost: 22.00 },
  ];

  /* ---------- Reviews ---------- */
  const REVIEWS = [
    { author: 'Catherine M.', source: 'Google',    time: '2 hours ago',  stars: 5, text: "The Aroma Latte is unreal. The rose and cardamom are subtle and not at all perfumey — finally a coffee shop in Fort Wayne that takes flavor seriously. The lounge itself feels like stepping into Marrakech." },
    { author: 'Jordan K.',    source: 'Yelp',      time: '1 day ago',    stars: 5, text: "Coming back specifically for the kunafa waffle. Worth the drive from the north side. Service was warm without being overbearing." },
    { author: 'Priya S.',     source: 'Google',    time: '2 days ago',   stars: 5, text: "We hosted a small bridal shower upstairs and the team handled everything beautifully. Karim made custom drinks for each guest. Stunning space." },
    { author: 'Brendan O.',   source: 'Instagram', time: '3 days ago',   stars: 5, text: "Single best pistachio latte I've had outside Beirut. Genuinely." },
    { author: 'Anonymous',    source: 'Yelp',      time: '4 days ago',   stars: 4, text: "Drinks are exceptional. Only knock is the wait at 8am on weekdays — they need a second barista on the morning shift." },
    { author: 'Renee F.',     source: 'Google',    time: '6 days ago',   stars: 5, text: "I work from here twice a week. Wi-Fi is fast, lighting is moody-but-functional, and the staff knows my order by sight. New favorite third place." },
    { author: 'Hassan T.',    source: 'Google',    time: '1 week ago',   stars: 5, text: "First Arabic coffee that's actually traditional in this city. Beautifully presented with dates and the spice is just right." },
    { author: 'Maya L.',      source: 'Tripadvisor',time: '1 week ago',  stars: 5, text: "Stopped here on a layover trip — locals were right to recommend it. Worth a detour." },
  ];

  /* ---------- Social ---------- */
  const SOCIAL = {
    instagram: { handle: '@aromaloungecoffee', followers: 14820, posts: 142, engagement: 8.4, growth: '+312', period: '7d' },
    tiktok:    { handle: '@aromaloungecoffee', followers: 26430, posts: 38,  engagement: 12.6, growth: '+2,840', period: '7d' },
    facebook:  { handle: 'Aroma Lounge',       followers: 3940,  posts: 86,  engagement: 4.1, growth: '+44', period: '7d' },
    google:    { handle: 'Google Business',    followers: null,  posts: null,reviews: 312, rating: 4.9, growth: '+18 reviews', period: '7d' },
  };

  /* ---------- Financial ---------- */
  function genSeries(days, base, vol) {
    const arr = [];
    for (let i = 0; i < days; i++) {
      const day = new Date();
      day.setDate(day.getDate() - (days - 1 - i));
      const weekend = day.getDay() === 5 || day.getDay() === 6;
      const v = base * (weekend ? 1.4 : 1) * (1 + (Math.random() - 0.5) * vol);
      arr.push({
        date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(v),
      });
    }
    return arr;
  }
  const REVENUE_30 = genSeries(30, 2750, 0.18);
  const ORDERS_30  = genSeries(30, 184,  0.16);

  /* ---------- Scheduling (current week) ---------- */
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  const WEEK = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    WEEK.push(d);
  }

  // Shifts per day per time block
  function buildSchedule() {
    const blocks = ['5a–10a', '10a–2p', '2p–6p', '6p–10p', '10p–12a'];
    const result = {}; // result[dayIdx][blockIdx] = [shift...]
    for (let d = 0; d < 7; d++) {
      result[d] = {};
      for (let b = 0; b < blocks.length; b++) result[d][b] = [];
    }
    // Assign deterministic-ish shifts
    const baristas = STAFF.filter(s => s.role.includes('Barista') || s.role === 'Shift Lead');
    const kitchen = STAFF.filter(s => s.role === 'Kitchen');
    const hosts = STAFF.filter(s => s.role === 'Host');

    for (let d = 0; d < 7; d++) {
      // Morning open (always 2 baristas + 1 lead)
      result[d][0].push({ who: baristas[d % baristas.length].name, role: 'Lead Barista', type: 'barista' });
      result[d][0].push({ who: baristas[(d + 1) % baristas.length].name, role: 'Barista', type: 'barista' });
      // Mid (3 baristas + kitchen)
      result[d][1].push({ who: baristas[(d + 2) % baristas.length].name, role: 'Lead Barista', type: 'shift-lead' });
      result[d][1].push({ who: baristas[(d + 3) % baristas.length].name, role: 'Barista', type: 'barista' });
      result[d][1].push({ who: kitchen[d % kitchen.length].name, role: 'Kitchen', type: 'kitchen' });
      result[d][1].push({ who: hosts[d % hosts.length].name, role: 'Host', type: 'host' });
      // Afternoon
      result[d][2].push({ who: baristas[(d + 4) % baristas.length].name, role: 'Barista', type: 'barista' });
      result[d][2].push({ who: baristas[(d + 5) % baristas.length].name, role: 'Barista', type: 'barista' });
      result[d][2].push({ who: kitchen[(d + 1) % kitchen.length].name, role: 'Kitchen', type: 'kitchen' });
      // Evening
      result[d][3].push({ who: baristas[(d + 1) % baristas.length].name, role: 'Shift Lead', type: 'shift-lead' });
      result[d][3].push({ who: baristas[(d + 2) % baristas.length].name, role: 'Barista', type: 'barista' });
      if (d === 4 || d === 5) {
        result[d][3].push({ who: hosts[1].name, role: 'Host', type: 'host' });
      }
      // Late (only Thursday-Saturday)
      if (d >= 4 && d <= 6) {
        result[d][4].push({ who: baristas[(d + 3) % baristas.length].name, role: 'Barista', type: 'barista' });
      }
    }
    return { blocks, schedule: result };
  }

  /* ---------- Campaigns ---------- */
  const CAMPAIGNS = [
    { name: 'Saffron Season',         channel: 'Instagram + Google', status: 'live',     budget: 480, spent: 312, impressions: 28400, clicks: 1242, conv: 86, start: 'May 10' },
    { name: 'Order Online · 20% Off', channel: 'Email · 2,400 list', status: 'live',     budget: 0,   spent: 0,   impressions: 2400,  clicks: 412,  conv: 142, start: 'May 18' },
    { name: 'Bridal Shower Packages', channel: 'Facebook + Google',  status: 'paused',   budget: 320, spent: 192, impressions: 14820, clicks: 622,  conv: 14, start: 'Apr 22' },
    { name: 'Kunafa Waffle Launch',   channel: 'TikTok · UGC',        status: 'live',     budget: 600, spent: 410, impressions: 86200, clicks: 3140, conv: 248, start: 'May 14' },
    { name: 'Loyalty Re-engagement',  channel: 'SMS · 480 dormant',  status: 'draft',    budget: 80,  spent: 0,   impressions: 0,     clicks: 0,    conv: 0, start: '—' },
  ];

  /* ---------- Permissions / Roles ---------- */
  const PERMISSIONS = [
    { area: 'Orders',          owner: 'view+edit', manager: 'view+edit', lead: 'view+edit', barista: 'view+edit', kitchen: 'view',     host: 'view' },
    { area: 'Menu',            owner: 'view+edit', manager: 'view+edit', lead: 'view',     barista: 'view',     kitchen: 'view',     host: 'view' },
    { area: 'Pricing',         owner: 'view+edit', manager: 'view+edit', lead: '—',        barista: '—',        kitchen: '—',        host: '—' },
    { area: 'Inventory',       owner: 'view+edit', manager: 'view+edit', lead: 'view+edit',barista: 'view',     kitchen: 'view+edit',host: '—' },
    { area: 'Staff Profiles',  owner: 'view+edit', manager: 'view+edit', lead: 'view',     barista: '—',        kitchen: '—',        host: '—' },
    { area: 'Scheduling',      owner: 'view+edit', manager: 'view+edit', lead: 'view+swap',barista: 'view+swap',kitchen: 'view+swap',host: 'view+swap' },
    { area: 'Time Clock',      owner: 'view',      manager: 'view+edit', lead: 'view',     barista: 'self',     kitchen: 'self',     host: 'self' },
    { area: 'Wages & Tips',    owner: 'view+edit', manager: 'view+edit', lead: '—',        barista: 'self',     kitchen: 'self',     host: 'self' },
    { area: 'Customers',       owner: 'view+edit', manager: 'view+edit', lead: 'view',     barista: 'view',     kitchen: '—',        host: 'view' },
    { area: 'Loyalty Program', owner: 'view+edit', manager: 'view+edit', lead: 'view+edit',barista: 'view+edit',kitchen: '—',        host: 'view+edit' },
    { area: 'Marketing',       owner: 'view+edit', manager: 'view+edit', lead: 'view',     barista: '—',        kitchen: '—',        host: '—' },
    { area: 'Analytics',       owner: 'view',      manager: 'view',      lead: 'view',     barista: '—',        kitchen: '—',        host: '—' },
    { area: 'Accounting',      owner: 'view',      manager: 'view',      lead: '—',        barista: '—',        kitchen: '—',        host: '—' },
    { area: 'Settings',        owner: 'view+edit', manager: 'view',      lead: '—',        barista: '—',        kitchen: '—',        host: '—' },
  ];

  /* ---------- Today's KPIs ---------- */
  const KPIS = {
    revenueToday:  4280,
    revenueYesterday: 3940,
    ordersToday: 286,
    ordersYesterday: 264,
    avgTicket: 14.96,
    avgTicketYesterday: 14.92,
    activeCustomers: 412,
    activeCustomersYesterday: 380,
    monthRevenue: 84260,
    monthRevenueLast: 71800,
    onlineRatio: 38, // %
    repeatRate: 64,
  };

  return {
    rand, ri, pick, name,
    ROLES, STAFF, CUSTOMERS, ORDERS, INVENTORY, REVIEWS, SOCIAL,
    REVENUE_30, ORDERS_30,
    WEEK, BUILD_SCHEDULE: buildSchedule,
    CAMPAIGNS, PERMISSIONS, KPIS,
  };
})();
