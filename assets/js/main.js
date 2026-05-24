/* ==========================================================================
   AROMA LOUNGE — Site-wide interactions
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Intro loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const intro = document.querySelector('.intro');
      if (intro) intro.classList.add('done');
      document.body.classList.add('loaded');
    }, 1600);
  });

  /* ---------- Nav scrolled state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const cobs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const step = now => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cobs.disconnect();
      }
    }, { threshold: 0.6 });
    cobs.observe(el);
  });

  /* ---------- Live "today" hours highlight ---------- */
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

  /* ---------- Year (footer) ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

})();
