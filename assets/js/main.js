/* ==========================================================================
   AROMA LOUNGE — "The Sun Court" site-wide interactions
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Nav scrolled state + live --nav-h for sticky offsets ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const setNavH = () => {
      document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const was = nav.classList.contains('scrolled');
          const is = window.scrollY > 24;
          if (was !== is) {
            nav.classList.toggle('scrolled', is);
            setTimeout(setNavH, 360); // after the padding transition settles
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setNavH, { passive: true });
    onScroll();
    setNavH();
    setTimeout(setNavH, 400);
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Reveal on scroll (also rotates divider stars) ---------- */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-reveal], .divider-star').forEach(el => obs.observe(el));

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const cobs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const dur = 1500;
        const step = now => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cobs.disconnect();
      }
    }, { threshold: 0.6 });
    cobs.observe(el);
  });

  /* ---------- "Today" hours highlight ---------- */
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  document.querySelectorAll('.hours-grid').forEach(grid => {
    grid.querySelectorAll('.day').forEach(d => {
      if (d.textContent.trim() === today) {
        d.classList.add('today');
        const t = d.nextElementSibling;
        if (t) t.classList.add('today');
      }
    });
  });

  /* ---------- Open-now chip (live, from hours table) ---------- */
  const HOURS = {
    0: { open: 6.5 * 60,  close: 22 * 60,        label: '10P' },
    1: { open: 5.5 * 60,  close: 22 * 60 + 40,   label: '10:40P' },
    2: { open: 5.5 * 60,  close: 22 * 60 + 40,   label: '10:40P' },
    3: { open: 5.5 * 60,  close: 22 * 60 + 40,   label: '10:40P' },
    4: { open: 5.5 * 60,  close: 23 * 60 + 30,   label: '11:30P' },
    5: { open: 5.5 * 60,  close: 24 * 60,        label: 'MIDNIGHT' },
    6: { open: 6.5 * 60,  close: 24 * 60,        label: 'MIDNIGHT' },
  };
  const OPEN_LABEL = { 0: '6:30A', 1: '5:30A', 2: '5:30A', 3: '5:30A', 4: '5:30A', 5: '5:30A', 6: '6:30A' };
  function syncOpenChips() {
    const now = new Date();
    const h = HOURS[now.getDay()];
    const cur = now.getHours() * 60 + now.getMinutes();
    const open = cur >= h.open && cur < h.close;
    document.querySelectorAll('#open-chip, #open-chip-2, [data-open-chip]').forEach(chip => {
      if (open) {
        chip.classList.remove('closed');
        chip.textContent = 'Open now · until ' + h.label;
      } else {
        chip.classList.add('closed');
        const nextDay = cur >= h.close ? (now.getDay() + 1) % 7 : now.getDay();
        chip.textContent = 'Closed · opens ' + OPEN_LABEL[nextDay];
      }
    });
  }
  syncOpenChips();
  setInterval(syncOpenChips, 60000);

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && id !== '#') {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

})();
