/* ========================================================================
   AROMA LOUNGE — Menu Data
   Single source of truth, used by menu page + admin
   ======================================================================== */

window.AROMA_CATEGORIES = [
  { id: 'signature',  name: 'Signature Lounge',  blurb: 'House compositions, made only here.', icon: '✦' },
  { id: 'espresso',   name: 'Espresso Bar',      blurb: 'The pure pursuit.',                   icon: '☕' },
  { id: 'arabic',     name: 'Arabic Tradition',  blurb: 'Centuries of ritual.',                icon: '⌘' },
  { id: 'lattes',     name: 'Specialty Lattes',  blurb: 'Reimagined classics.',                icon: '◐' },
  { id: 'matcha',     name: 'Matcha & Tea',      blurb: 'Ceremonial and slow.',                icon: '◉' },
  { id: 'cold',       name: 'Cold Brew & Iced',  blurb: 'Twenty-four hour steep.',             icon: '❉' },
  { id: 'refreshers', name: 'Refreshers',        blurb: 'Sparkling, fruit-forward.',           icon: '✺' },
  { id: 'frappes',    name: 'Frappes',           blurb: 'Indulgent, blended.',                 icon: '❋' },
  { id: 'smoothies',  name: 'Smoothies',         blurb: 'Whole-fruit, no compromise.',         icon: '◈' },
  { id: 'waffles',    name: 'Waffles & Crepes',  blurb: 'Brunch, all day.',                    icon: '❀' },
  { id: 'sandwiches', name: 'Sandwiches',        blurb: 'Fresh, pressed, layered.',            icon: '▤' },
  { id: 'pastries',   name: 'Pastries',          blurb: 'Daily from our kitchen.',             icon: '✿' },
];

/* Customization templates by category */
const SIZE_DRINK = {
  id: 'size', name: 'Size', required: true, type: 'single',
  options: [
    { id: 'short',  name: '8 oz',  delta: -0.75 },
    { id: 'tall',   name: '12 oz', delta: 0,     default: true },
    { id: 'grande', name: '16 oz', delta: 0.75  },
    { id: 'venti',  name: '20 oz', delta: 1.50  },
  ],
};

const MILK = {
  id: 'milk', name: 'Milk', required: true, type: 'single',
  options: [
    { id: 'whole',     name: 'Whole',          delta: 0, default: true },
    { id: 'twopct',    name: '2%',             delta: 0 },
    { id: 'skim',      name: 'Skim',           delta: 0 },
    { id: 'oat',       name: 'Oat',            delta: 0.85 },
    { id: 'almond',    name: 'Almond',         delta: 0.85 },
    { id: 'coconut',   name: 'Coconut',        delta: 0.85 },
    { id: 'lactose',   name: 'Lactose-Free',   delta: 0.50 },
    { id: 'half',      name: 'Half & Half',    delta: 0.50 },
  ],
};

const TEMP = {
  id: 'temp', name: 'Style', required: true, type: 'single',
  options: [
    { id: 'hot',     name: 'Hot',     delta: 0, default: true },
    { id: 'iced',    name: 'Iced',    delta: 0 },
    { id: 'blended', name: 'Blended', delta: 0.75 },
  ],
};

const SHOTS = {
  id: 'shots', name: 'Espresso Shots', required: false, type: 'single',
  options: [
    { id: 'none',  name: 'Standard',  delta: 0, default: true },
    { id: 'extra', name: '+1 Shot',  delta: 1.25 },
    { id: 'two',   name: '+2 Shots', delta: 2.25 },
    { id: 'decaf', name: 'Decaf swap', delta: 0 },
  ],
};

const SYRUPS = {
  id: 'syrups', name: 'Syrups', required: false, type: 'multi', upsell: true,
  options: [
    { id: 'vanilla',     name: 'Vanilla',         delta: 0.75 },
    { id: 'caramel',     name: 'Caramel',         delta: 0.75 },
    { id: 'hazelnut',    name: 'Hazelnut',        delta: 0.75 },
    { id: 'rose',        name: 'Rose',            delta: 1.00, badge: 'House' },
    { id: 'lavender',    name: 'Lavender',        delta: 1.00 },
    { id: 'cardamom',    name: 'Cardamom',        delta: 1.00, badge: 'House' },
    { id: 'pistachio',   name: 'Pistachio',       delta: 1.00, badge: 'House' },
    { id: 'honey',       name: 'Wildflower Honey',delta: 0.75 },
    { id: 'brownsugar',  name: 'Brown Sugar',     delta: 0.75 },
    { id: 'saffron',     name: 'Saffron',         delta: 1.50, badge: 'House' },
    { id: 'sfvanilla',   name: 'Sugar-Free Vanilla', delta: 0.75 },
  ],
};

const TOPPINGS = {
  id: 'toppings', name: 'Toppings', required: false, type: 'multi', upsell: true,
  options: [
    { id: 'whip',         name: 'Whipped Cream',     delta: 0.50 },
    { id: 'caramel-dr',   name: 'Caramel Drizzle',   delta: 0.50 },
    { id: 'choc-dr',      name: 'Chocolate Drizzle', delta: 0.50 },
    { id: 'cinnamon',     name: 'Ceylon Cinnamon',   delta: 0.50 },
    { id: 'pist-crumble', name: 'Pistachio Crumble', delta: 1.00 },
    { id: 'rose-petals',  name: 'Dried Rose Petals', delta: 1.00 },
    { id: 'gold',         name: '24K Gold Leaf',     delta: 4.00, badge: 'Premium' },
  ],
};

const FOAM = {
  id: 'foam', name: 'Foam', required: false, type: 'single',
  options: [
    { id: 'standard', name: 'Standard',     delta: 0, default: true },
    { id: 'light',    name: 'Light Foam',   delta: 0 },
    { id: 'extra',    name: 'Extra Foam',   delta: 0 },
    { id: 'cold',     name: 'Cold Foam',    delta: 0.75 },
    { id: 'sweet',    name: 'Sweet Cream',  delta: 0.75 },
  ],
};

const DRINK_CUSTOMIZATIONS = [SIZE_DRINK, TEMP, MILK, SHOTS, SYRUPS, FOAM, TOPPINGS];
const ARABIC_CUSTOMIZATIONS = [SIZE_DRINK, MILK, SYRUPS, TOPPINGS];
const COLD_CUSTOMIZATIONS = [SIZE_DRINK, MILK, SHOTS, SYRUPS, FOAM, TOPPINGS];
const REFRESHER_CUSTOMIZATIONS = [
  SIZE_DRINK,
  { id: 'base', name: 'Base', required: true, type: 'single',
    options: [
      { id: 'water',    name: 'Sparkling Water',  delta: 0, default: true },
      { id: 'lemonade', name: 'Lemonade',         delta: 0.50 },
      { id: 'coconut',  name: 'Coconut Milk',     delta: 0.85 },
    ],
  },
  TOPPINGS,
];

const FOOD_CUSTOMIZATIONS = [
  { id: 'addons', name: 'Add-ons', required: false, type: 'multi', upsell: true,
    options: [
      { id: 'avocado',   name: 'Avocado',          delta: 1.50 },
      { id: 'bacon',     name: 'Crispy Bacon',     delta: 2.00 },
      { id: 'cheese',    name: 'Aged Gruyère',     delta: 1.50 },
      { id: 'honey',     name: 'Local Honey',      delta: 1.00 },
      { id: 'pistachio', name: 'Pistachio',        delta: 1.00 },
      { id: 'strawberry',name: 'Strawberries',     delta: 1.50 },
    ],
  },
];

/* ========================================================================
   Menu items
   ======================================================================== */

window.AROMA_MENU = [
  /* ---------- SIGNATURE ---------- */
  { id: 'aroma-latte', cat: 'signature', name: 'The Aroma',
    desc: 'Our signature — double espresso, oat milk, rose-cardamom syrup, dusted with rose petals and crushed pistachio.',
    price: 7.25, calories: 220, img: 'rose-latte', badge: 'Most Loved', popular: true,
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'gold-dust', cat: 'signature', name: 'Gold Dust Latte',
    desc: 'Saffron-infused espresso, steamed whole milk, finished with edible 24-karat gold leaf.',
    price: 12.00, calories: 240, img: 'gold-latte', badge: 'Luxe',
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'pistachio-rose', cat: 'signature', name: 'Pistachio Rose',
    desc: 'House pistachio milk, espresso, rose water, lightly sweetened, pistachio crumble on top.',
    price: 7.75, calories: 280, img: 'pistachio-latte', popular: true,
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'desert-bloom', cat: 'signature', name: 'Desert Bloom',
    desc: 'Date-sweetened espresso, cardamom-infused oat steam, cinnamon dust.',
    price: 7.00, calories: 210, img: 'latte-art',
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'oud-mocha', cat: 'signature', name: 'Oud Mocha',
    desc: 'Single-origin Ethiopian, dark chocolate, oat, smoked salt rim, drizzle of caramel.',
    price: 7.50, calories: 310, img: 'mocha',
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'midnight', cat: 'signature', name: 'Midnight Velvet',
    desc: 'Cold brew concentrate, vanilla cream, lavender, served over a single large ice sphere.',
    price: 7.25, calories: 180, img: 'cold-brew-velvet',
    customizations: COLD_CUSTOMIZATIONS, },

  /* ---------- ESPRESSO ---------- */
  { id: 'espresso',     cat: 'espresso', name: 'Espresso',       desc: 'A single shot, pulled to 25 seconds.',
    price: 3.50, calories: 5, customizations: [SHOTS], },
  { id: 'doppio',       cat: 'espresso', name: 'Doppio',         desc: 'Double shot. The honest one.',
    price: 4.25, calories: 10, customizations: [SHOTS], },
  { id: 'macchiato',    cat: 'espresso', name: 'Macchiato',      desc: 'Double espresso, dollop of foam.',
    price: 4.50, calories: 20, customizations: [SHOTS, MILK], },
  { id: 'cortado',      cat: 'espresso', name: 'Cortado',        desc: 'Equal parts espresso and warm milk.',
    price: 4.75, calories: 60, popular: true, customizations: [SHOTS, MILK], },
  { id: 'americano',    cat: 'espresso', name: 'Americano',      desc: 'Espresso, hot water, served long.',
    price: 4.25, calories: 15, customizations: [SIZE_DRINK, TEMP, SHOTS], },
  { id: 'flat-white',   cat: 'espresso', name: 'Flat White',     desc: 'Double ristretto, velvet milk, no foam.',
    price: 5.50, calories: 130, customizations: [SHOTS, MILK, SYRUPS], },
  { id: 'cappuccino',   cat: 'espresso', name: 'Cappuccino',     desc: 'Classic third-third-third.',
    price: 5.25, calories: 120, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'cafe-latte',   cat: 'espresso', name: 'Café Latte',     desc: 'Espresso, steamed milk, light foam.',
    price: 5.50, calories: 180, popular: true, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'mocha',        cat: 'espresso', name: 'Café Mocha',     desc: 'Espresso, chocolate, milk, whip.',
    price: 6.00, calories: 320, customizations: DRINK_CUSTOMIZATIONS, },

  /* ---------- ARABIC TRADITION ---------- */
  { id: 'qahwa', cat: 'arabic', name: 'Qahwa (Arabic Coffee)',
    desc: 'Lightly roasted bean, cardamom, saffron. Served in finjan with dates.',
    price: 6.50, calories: 25, img: 'arabic-service', badge: 'Tradition',
    customizations: ARABIC_CUSTOMIZATIONS, },
  { id: 'turkish', cat: 'arabic', name: 'Turkish Coffee',
    desc: 'Finely ground, double-boiled in cezve, unfiltered.',
    price: 5.75, calories: 15,
    customizations: [{ id: 'sweet', name: 'Sweetness', required: true, type: 'single',
      options: [
        { id: 'sade', name: 'Sade (unsweetened)', delta: 0, default: true },
        { id: 'az',   name: 'Az şekerli (light)', delta: 0 },
        { id: 'orta', name: 'Orta (medium)',      delta: 0 },
        { id: 'cok',  name: 'Çok şekerli (sweet)',delta: 0 },
      ],
    }], },
  { id: 'karak', cat: 'arabic', name: 'Karak Chai',
    desc: 'Strong black tea, cardamom, ginger, evaporated milk, simmered slow.',
    price: 5.25, calories: 160, popular: true,
    customizations: [SIZE_DRINK, MILK, SYRUPS], },
  { id: 'saffron-latte', cat: 'arabic', name: 'Saffron Honey Latte',
    desc: 'Iranian saffron threads, espresso, honey, steamed milk.',
    price: 7.25, calories: 220,
    customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'sahlab', cat: 'arabic', name: 'Sahlab',
    desc: 'Warm cream pudding drink, rose water, pistachio, coconut, cinnamon.',
    price: 6.25, calories: 290, badge: 'Winter',
    customizations: [SIZE_DRINK, TOPPINGS], },

  /* ---------- LATTES ---------- */
  { id: 'lavender-honey', cat: 'lattes', name: 'Lavender Honey',
    desc: 'Espresso, lavender syrup, wildflower honey, oat milk.',
    price: 6.50, calories: 200, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'pistachio-latte', cat: 'lattes', name: 'Pistachio Latte',
    desc: 'House pistachio syrup, double espresso, whole milk.',
    price: 6.75, calories: 240, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'brown-sugar-oat', cat: 'lattes', name: 'Brown Sugar Oat',
    desc: 'Brown sugar shaken espresso, oat milk, cinnamon.',
    price: 6.50, calories: 220, popular: true, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'vanilla-honey', cat: 'lattes', name: 'Vanilla Honey',
    desc: 'Madagascar vanilla, raw honey, steamed milk.',
    price: 6.25, calories: 200, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'maple-pecan', cat: 'lattes', name: 'Maple Pecan',
    desc: 'Real maple, toasted pecan, espresso, oat.',
    price: 6.75, calories: 250, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'tiramisu', cat: 'lattes', name: 'Tiramisu Latte',
    desc: 'Espresso, mascarpone foam, cocoa dust, ladyfinger crumble.',
    price: 7.00, calories: 320, customizations: DRINK_CUSTOMIZATIONS, },

  /* ---------- MATCHA & TEA ---------- */
  { id: 'matcha-latte', cat: 'matcha', name: 'Ceremonial Matcha Latte',
    desc: 'Grade A Uji matcha, whisked in stone bowl, steamed milk.',
    price: 6.50, calories: 180, popular: true, img: 'matcha', customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'rose-matcha', cat: 'matcha', name: 'Rose Matcha',
    desc: 'Matcha, rose syrup, oat milk, dried petals.',
    price: 7.00, calories: 200, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'pistachio-matcha', cat: 'matcha', name: 'Pistachio Matcha',
    desc: 'House pistachio, matcha, whole milk, pistachio crumble.',
    price: 7.25, calories: 260, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'hojicha', cat: 'matcha', name: 'Hojicha Latte',
    desc: 'Roasted green tea, smoky, caffeine-light.',
    price: 6.00, calories: 160, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'london-fog', cat: 'matcha', name: 'London Fog',
    desc: 'Earl Grey, vanilla, steamed milk.',
    price: 5.75, calories: 170, customizations: DRINK_CUSTOMIZATIONS, },
  { id: 'jasmine-pearl', cat: 'matcha', name: 'Jasmine Pearl',
    desc: 'Hand-rolled jasmine green, served in glass pot.',
    price: 5.25, calories: 0, customizations: [TEMP], },

  /* ---------- COLD ---------- */
  { id: 'cold-brew', cat: 'cold', name: 'Cold Brew',
    desc: 'Slow-steeped 24 hours, served black.',
    price: 5.25, calories: 5, popular: true, customizations: [SIZE_DRINK, MILK, SYRUPS], },
  { id: 'nitro', cat: 'cold', name: 'Nitro Cold Brew',
    desc: 'Cold brew on tap, cascading nitrogen.',
    price: 6.00, calories: 5, badge: 'On Tap', customizations: [SIZE_DRINK, MILK, SYRUPS], },
  { id: 'iced-latte', cat: 'cold', name: 'Iced Latte',
    desc: 'Double espresso, cold milk, ice.',
    price: 5.75, calories: 130, customizations: COLD_CUSTOMIZATIONS, },
  { id: 'vietnamese', cat: 'cold', name: 'Vietnamese',
    desc: 'Phin-dripped dark roast, sweetened condensed milk.',
    price: 6.25, calories: 220, customizations: [SIZE_DRINK, SHOTS], },
  { id: 'horchata-cold', cat: 'cold', name: 'Horchata Cold Brew',
    desc: 'Cold brew, rice horchata, cinnamon.',
    price: 6.50, calories: 200, customizations: [SIZE_DRINK, TOPPINGS], },

  /* ---------- REFRESHERS ---------- */
  { id: 'mango-dragon', cat: 'refreshers', name: 'Mango Dragonfruit',
    desc: 'Real mango, dragonfruit cubes, lime, sparkling.',
    price: 5.75, calories: 110, popular: true, customizations: REFRESHER_CUSTOMIZATIONS, },
  { id: 'peach-passion', cat: 'refreshers', name: 'Peach Passion',
    desc: 'White peach, passion fruit, mint.',
    price: 5.75, calories: 100, customizations: REFRESHER_CUSTOMIZATIONS, },
  { id: 'strawberry-rose', cat: 'refreshers', name: 'Strawberry Rose',
    desc: 'Fresh strawberry, rose syrup, sparkling water.',
    price: 5.75, calories: 95, customizations: REFRESHER_CUSTOMIZATIONS, },
  { id: 'blueberry-lav', cat: 'refreshers', name: 'Blueberry Lavender',
    desc: 'Wild blueberry, lavender, lemonade.',
    price: 5.75, calories: 130, customizations: REFRESHER_CUSTOMIZATIONS, },

  /* ---------- FRAPPES ---------- */
  { id: 'caramel-frap', cat: 'frappes', name: 'Caramel Frappé',
    desc: 'Espresso, caramel, milk, ice, whipped cream.',
    price: 6.75, calories: 420, customizations: [SIZE_DRINK, MILK, SHOTS, TOPPINGS], },
  { id: 'mocha-frap',   cat: 'frappes', name: 'Mocha Frappé',
    desc: 'Espresso, chocolate, milk, blended cold.',
    price: 6.75, calories: 440, customizations: [SIZE_DRINK, MILK, SHOTS, TOPPINGS], },
  { id: 'biscoff-frap', cat: 'frappes', name: 'Biscoff Frappé',
    desc: 'Speculoos cookie, espresso, milk, biscoff drizzle.',
    price: 7.25, calories: 480, popular: true, customizations: [SIZE_DRINK, MILK, SHOTS, TOPPINGS], },
  { id: 'matcha-frap',  cat: 'frappes', name: 'Matcha Frappé',
    desc: 'Matcha, milk, vanilla, blended.',
    price: 6.75, calories: 360, customizations: [SIZE_DRINK, MILK, TOPPINGS], },

  /* ---------- SMOOTHIES ---------- */
  { id: 'green-glow', cat: 'smoothies', name: 'Green Glow',
    desc: 'Spinach, banana, mango, ginger, coconut water.',
    price: 7.50, calories: 240, customizations: [SIZE_DRINK], },
  { id: 'berry-bliss', cat: 'smoothies', name: 'Berry Bliss',
    desc: 'Mixed berries, banana, yogurt, honey.',
    price: 7.50, calories: 280, customizations: [SIZE_DRINK], },
  { id: 'tropic', cat: 'smoothies', name: 'Tropic',
    desc: 'Pineapple, mango, passion fruit, coconut milk.',
    price: 7.50, calories: 260, customizations: [SIZE_DRINK], },

  /* ---------- WAFFLES & CREPES ---------- */
  { id: 'belgian-waffle', cat: 'waffles', name: 'Belgian Waffle',
    desc: 'Liège pearl-sugar waffle, whipped cream, strawberry, maple.',
    price: 11.50, calories: 540, img: 'waffle', popular: true, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'nutella-waffle', cat: 'waffles', name: 'Nutella Banana Waffle',
    desc: 'Belgian waffle, Nutella, banana, hazelnut crumble.',
    price: 12.50, calories: 640, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'kunafa-waffle', cat: 'waffles', name: 'Kunafa Waffle',
    desc: 'Crispy kunafa-topped waffle, sweet cheese, rose syrup, pistachio.',
    price: 13.50, calories: 620, badge: 'Signature', customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'nutella-crepe', cat: 'waffles', name: 'Nutella Crepe',
    desc: 'Thin French crepe, Nutella, strawberry, powdered sugar.',
    price: 10.50, calories: 480, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'lotus-crepe', cat: 'waffles', name: 'Lotus Crepe',
    desc: 'Crepe, Lotus Biscoff spread, biscuit crumble, vanilla cream.',
    price: 11.00, calories: 510, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'savory-crepe', cat: 'waffles', name: 'Savory Crepe',
    desc: 'Buckwheat crepe, ham, gruyère, fried egg.',
    price: 12.00, calories: 460, customizations: FOOD_CUSTOMIZATIONS, },

  /* ---------- SANDWICHES ---------- */
  { id: 'caprese',      cat: 'sandwiches', name: 'Pressed Caprese',
    desc: 'Heirloom tomato, fresh mozzarella, basil, balsamic, ciabatta.',
    price: 11.50, calories: 520, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'turkey-pesto', cat: 'sandwiches', name: 'Turkey Pesto',
    desc: 'Smoked turkey, basil pesto, provolone, sun-dried tomato.',
    price: 12.50, calories: 580, popular: true, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'salmon-bagel', cat: 'sandwiches', name: 'Smoked Salmon Bagel',
    desc: 'Everything bagel, cream cheese, cured salmon, capers, red onion, dill.',
    price: 13.50, calories: 480, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'avocado-toast', cat: 'sandwiches', name: 'Avocado Toast',
    desc: 'Sourdough, smashed avocado, chili crisp, soft egg, microgreens.',
    price: 11.00, calories: 420, customizations: FOOD_CUSTOMIZATIONS, },
  { id: 'shawarma-wrap', cat: 'sandwiches', name: 'Chicken Shawarma Wrap',
    desc: 'Spiced chicken, garlic toum, pickled turnip, herbs, lavash.',
    price: 13.50, calories: 620, badge: 'House', customizations: FOOD_CUSTOMIZATIONS, },

  /* ---------- PASTRIES ---------- */
  { id: 'baklava',     cat: 'pastries', name: 'Baklava (3 pcs)',
    desc: 'Phyllo, walnut, pistachio, orange-blossom syrup.',
    price: 6.50, calories: 320, img: 'baklava', popular: true, customizations: [], },
  { id: 'kunafa',      cat: 'pastries', name: 'Kunafa',
    desc: 'Shredded phyllo, sweet cheese, rose syrup, pistachio.',
    price: 8.50, calories: 380, customizations: [], },
  { id: 'maamoul',     cat: 'pastries', name: 'Ma\'amoul (2 pcs)',
    desc: 'Semolina shortbread, date or pistachio filling.',
    price: 5.50, calories: 220, customizations: [], },
  { id: 'basbousa',    cat: 'pastries', name: 'Basbousa',
    desc: 'Semolina cake, coconut, simple syrup, almond center.',
    price: 5.00, calories: 280, customizations: [], },
  { id: 'croissant',   cat: 'pastries', name: 'Butter Croissant',
    desc: 'House-laminated, 81-layer, golden.',
    price: 4.50, calories: 280, customizations: [], },
  { id: 'pain-choc',   cat: 'pastries', name: 'Pain au Chocolat',
    desc: 'Croissant dough, dark chocolate batons.',
    price: 5.00, calories: 340, customizations: [], },
  { id: 'almond-croi', cat: 'pastries', name: 'Almond Croissant',
    desc: 'Twice-baked, almond cream, sliced almonds.',
    price: 5.50, calories: 410, customizations: [], },
];

window.AROMA_CUSTOMIZATIONS = { SIZE_DRINK, MILK, TEMP, SHOTS, SYRUPS, TOPPINGS, FOAM };

window.AROMA_BRAND = {
  name: 'Aroma Lounge',
  tagline: 'Where Arabia meets the artisan.',
  address: '1361 W Hamilton Rd S, Fort Wayne, IN 46814',
  neighborhood: 'Southwest Fort Wayne · Hamilton & Illinois',
  phone: '(260) 555-0142',
  email: 'hello@aromalounge.coffee',
  hours: [
    { day: 'Monday',    hours: '5:30 AM – 10:40 PM' },
    { day: 'Tuesday',   hours: '5:30 AM – 10:40 PM' },
    { day: 'Wednesday', hours: '5:30 AM – 10:40 PM' },
    { day: 'Thursday',  hours: '5:30 AM – 11:30 PM' },
    { day: 'Friday',    hours: '5:30 AM – 12:00 AM' },
    { day: 'Saturday',  hours: '6:30 AM – 12:00 AM' },
    { day: 'Sunday',    hours: '6:30 AM – 10:00 PM' },
  ],
  social: {
    instagram: 'https://instagram.com/aromaloungecoffee',
    tiktok:    'https://tiktok.com/@aromaloungecoffee',
    facebook:  'https://facebook.com/aromaloungecoffee',
  },
};
