# Aroma Lounge — Demo Website

A demo storefront and operator console for **Aroma Lounge**, a premium Arabic-inspired coffee shop opening at Hamilton & Illinois in southwest Fort Wayne.

**Live demo:** https://sweet-dreams-us.github.io/amoracoffeelounge/

## What's in the box

| Page | Path | What it does |
|---|---|---|
| **Landing** | `/` | Editorial hero, brand story, lounge feature, signature drinks preview, location & hours |
| **Menu** | `/menu.html` | 50+ items across 12 categories with full customization (size, milk, syrups, shots, toppings) and an in-page cart with running total |
| **Admin Console** | `/admin/` | 15-section operator panel — Dashboard, Orders, Reports, Menu Management, Inventory, Kitchen Display, Staff, Scheduling, Customers, Loyalty, Marketing, Social, Reviews, Accounting, Permissions, Settings |

The cart persists across pages via `localStorage`. The admin panel ships with realistic mock data and live-feed simulation (new orders pop in every ~14s on the dashboard).

## How it's built

Pure static HTML/CSS/JS — no build step, no framework. Hosted directly from `main` on GitHub Pages.

- **Design system** in `assets/css/main.css` (custom CSS with brass/espresso palette, Cormorant Garamond display + Inter body)
- **Menu state + cart** in `assets/js/menu.js` + `menu-data.js`
- **Admin SPA** in `admin/admin.js` (hash routing, view-per-render, Chart.js)
- **Imagery** generated via Higgsfield (Nano Banana Pro, 2K) — sourced and compressed into `assets/img/`

External dependencies (CDN):
- Google Fonts: Cormorant Garamond, Inter, JetBrains Mono
- Chart.js 4.4 (admin panel only)

## Brand

- **Voice:** Considered, slow, prestige-without-pretense
- **Palette:** Espresso `#14100C` · Bronze `#B58A4B` · Cream `#F4ECDB` · Sage `#4A5A3C`
- **Type:** Cormorant Garamond italic for display, Inter for body, JetBrains Mono for prices and data

## Demo data

All sales, customer, and inventory data is fabricated. Drink pricing reflects 2026 third-wave-cafe norms. Address is real (1361 W Hamilton Rd S, Fort Wayne, IN 46814). Phone number is a placeholder.

## Local preview

Anything that serves the directory works:

```bash
cd /path/to/website
python3 -m http.server 8000
# open http://localhost:8000
```

---

Crafted in Fort Wayne. © 2026.
