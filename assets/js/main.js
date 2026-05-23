/* ========================================================================
   AROMA LOUNGE — Main interactions
   ======================================================================== */

(() => {
  'use strict';

  /* ---------- Intro loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const intro = document.querySelector('.intro');
      if (intro) intro.classList.add('done');
      // Trigger first reveals immediately after intro fades
      document.body.classList.add('loaded');
    }, 1700);
  });

  /* ---------- Nav scrolled state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Split text → per-char reveal for headings with .split ---------- */
  document.querySelectorAll('.split').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = c === ' ' ? ' ' : c;
      span.style.transitionDelay = `${i * 0.025}s`;
      el.appendChild(span);
    });
    observer.observe(el);
    // Wrap in trigger: when parent comes into view, add 'in' to all children
    const charObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.split-char').forEach(c => c.classList.add('in'));
        charObs.disconnect();
      }
    }, { threshold: 0.5 });
    charObs.observe(el);
  });

  /* ---------- Live clock & "today" hours highlight ---------- */
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  document.querySelectorAll('.hours-grid').forEach(grid => {
    const days = grid.querySelectorAll('.day');
    days.forEach(d => {
      if (d.textContent.trim() === today) {
        d.classList.add('today');
        const next = d.nextElementSibling;
        if (next) next.classList.add('today');
      }
    });
  });

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const counterObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const duration = 1600;
        const step = now => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObs.disconnect();
      }
    }, { threshold: 0.6 });
    counterObs.observe(el);
  });

  /* ---------- Parallax hero (mild, performant) ---------- */
  const heroMedia = document.querySelector('.hero-media img, .hero-media video');
  if (heroMedia) {
    let h = 0;
    const onParallax = () => {
      h = window.scrollY;
      if (h < window.innerHeight) {
        heroMedia.style.transform = `scale(1.08) translateY(${h * 0.18}px)`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Cart badge sync (read from localStorage) ---------- */
  function syncCartBadge() {
    const cart = JSON.parse(localStorage.getItem('aroma_cart') || '[]');
    const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count;
      el.classList.toggle('has-items', count > 0);
    });
  }
  syncCartBadge();
  window.addEventListener('aroma:cart-updated', syncCartBadge);
  window.addEventListener('storage', e => { if (e.key === 'aroma_cart') syncCartBadge(); });

})();
