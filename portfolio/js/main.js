/* ════════════════════════════════════════
   MAIN.JS — ZARA NOVA CREATIVE PORTFOLIO
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  /* ─────────────────────────────────────
     LOADER → INIT
  ───────────────────────────────────── */
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('out');
    document.querySelector('.hero')?.classList.add('hero-ready');
    initAll();
  }, 1600);

  /* ─────────────────────────────────────
     INIT ALL
  ───────────────────────────────────── */
  let scroller;

  function initAll() {
    scroller = new SmoothScroll({ lerp: 0.08 });
    initCursor();
    initNav(scroller);
    initScrollProgress(scroller);
    initNavLinks(scroller);
    initReveals(scroller);
    initParallax(scroller);
    initHeroParallax(scroller);
    initHeroMouseEffect();
    initBlobsParallax(scroller);
    initMagnetic();
    initGalleryTilt();
    initServiceCards();
    initGSAPServices(scroller);
    initCounters(scroller);
    initStickyProjects(scroller);
    initFormSubmit();
    initTextScramble();
    initAboutPhotoTilt();
  }

  /* ─────────────────────────────────────
     CURSOR — white circle only
  ───────────────────────────────────── */
  function initCursor() {
    const ring = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let tx = -200, ty = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
    });

    // Hover targets
    const hTargets = 'a, button, .project, .service-card, .skill-pill, .social-btn, input, textarea, .gallery__item, .counter-block';
    document.querySelectorAll(hTargets).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor--hover'));
    });

    function animateCursor() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      tx += (mx - tx) * 0.25;
      ty += (my - ty) * 0.25;

      ring.style.transform = `translate3d(${rx - ring.offsetWidth / 2}px,${ry - ring.offsetHeight / 2}px,0)`;
      trail.style.transform = `translate3d(${tx - 3}px,${ty - 3}px,0)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* ─────────────────────────────────────
     SCROLL PROGRESS
  ───────────────────────────────────── */
  function initScrollProgress(s) {
    s.on(({ progress }) => {
      progressBar.style.transform = `scaleX(${progress})`;
    });
  }

  /* ─────────────────────────────────────
     NAV STATE
  ───────────────────────────────────── */
  function initNav(s) {
    const nav = document.getElementById('nav');
    s.on(({ scroll, limit }) => {
      nav.classList.toggle('scrolled', scroll > 50);
      nav.classList.toggle('hidden', scroll > limit - window.innerHeight + 80);
    });
  }

  /* ─────────────────────────────────────
     SMOOTH NAV LINKS
  ───────────────────────────────────── */
  function initNavLinks(s) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = a.getAttribute('href');
        if (target === '#hero') { s.scrollTo(0); return; }
        s.scrollTo(target, { offset: -80 });
      });
    });
  }

  /* ─────────────────────────────────────
     SCROLL REVEALS — multi-direction
  ───────────────────────────────────── */
  function initReveals(s) {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));

    // Auto stagger siblings
    const parents = new Map();
    els.forEach(el => {
      const key = el.parentElement;
      if (!parents.has(key)) parents.set(key, []);
      parents.get(key).push(el);
    });
    parents.forEach(group => {
      if (group.length > 1) {
        group.forEach((el, i) => {
          if (!el.dataset.stagger) {
            el.style.transitionDelay = `${i * 0.08}s`;
          }
        });
      }
    });

    const check = () => {
      els.forEach(el => {
        if (el.classList.contains('visible')) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
          el.classList.add('visible');
        }
      });
    };

    s.on(check);
    setTimeout(check, 200);

    // IntersectionObserver fallback
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '-5% 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ─────────────────────────────────────
     IMAGE PARALLAX
  ───────────────────────────────────── */
  function initParallax(s) {
    const configs = [
      { selector: '.about__photo', speed: 0.08 }
    ];

    const items = [];
    configs.forEach(({ selector, speed }) => {
      document.querySelectorAll(selector).forEach(el => {
        const r = el.getBoundingClientRect();
        items.push({
          el,
          speed,
          initialCenter: r.top + r.height / 2 + window.scrollY - window.innerHeight / 2
        });
      });
    });

    s.on(({ scroll }) => {
      items.forEach(({ el, speed, initialCenter }) => {
        const relativeCenter = initialCenter - scroll;
        el.style.transform = `translate3d(0, ${relativeCenter * speed}px, 0)`;
      });
    });
  }

  /* ─────────────────────────────────────
     HERO TEXT PARALLAX
  ───────────────────────────────────── */
  function initHeroParallax(s) {
    const rows = document.querySelectorAll('.hero__title-row');
    const bottom = document.querySelector('.hero__bottom');
    const eye = document.querySelector('.hero__eyebrow');
    const scroll = document.querySelector('.hero__scroll');
    const avatar = document.querySelector('.hero__avatar-block');

    s.on(({ scroll: sc }) => {
      const p = sc;
      if (rows[0]) rows[0].style.transform = `translateX(${-p * 0.04}px) translateY(${p * 0.05}px)`;
      if (rows[1]) rows[1].style.transform = `translateX(${p * 0.03}px) translateY(${p * 0.05}px)`;
      if (rows[2]) rows[2].style.transform = `translateX(${-p * 0.02}px) translateY(${p * 0.05}px)`;

      const fade = Math.max(0, 1 - p / 500);
      if (bottom) {
        bottom.style.opacity = fade;
        bottom.style.transform = `translateY(${p * 0.1}px)`;
      }
      if (eye) {
        eye.style.opacity = fade;
        eye.style.transform = `translateX(${-p * 0.05}px)`;
      }
      if (scroll) { scroll.style.opacity = Math.max(0, 1 - p / 200); }
      if (avatar) {
        avatar.style.transform = `translateY(-50%) translateX(${-p * 0.04}px)`;
      }
    });
  }

  /* ─────────────────────────────────────
     HERO MOUSE MOVE — parallax on hover
  ───────────────────────────────────── */
  function initHeroMouseEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const targets = [
      { el: document.querySelector('.blob--magenta'), depth: 0.015 },
      { el: document.querySelector('.blob--cyan'), depth: -0.012 },
      { el: document.querySelector('.blob--yellow'), depth: 0.02 },
    ];

    const badges = document.querySelectorAll('.hero__badge');

    let heroRect = hero.getBoundingClientRect();
    window.addEventListener('resize', () => { heroRect = hero.getBoundingClientRect(); });

    let mx = 0, my = 0;
    let tx = 0, ty = 0;
    let active = false;

    hero.addEventListener('mousemove', e => {
      active = true;
      tx = e.clientX - heroRect.left;
      ty = e.clientY - heroRect.top;
    });

    hero.addEventListener('mouseleave', () => {
      active = false;
      tx = heroRect.width / 2;
      ty = heroRect.height / 2;
    });

    function update() {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;

      const cx = mx - heroRect.width / 2;
      const cy = my - heroRect.height / 2;

      targets.forEach(({ el, depth }) => {
        if (!el) return;
        el.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
      });

      badges.forEach(badge => {
        const d = parseFloat(badge.dataset.parallax || 0.05);
        badge.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
      });

      requestAnimationFrame(update);
    }
    update();
  }

  /* ─────────────────────────────────────
     BLOBS SCROLL PARALLAX
  ───────────────────────────────────── */
  function initBlobsParallax(s) {
    const blobConfigs = [
      { el: document.querySelector('.about__blobs .blob--cyan'), speed: -0.06 },
      { el: document.querySelector('.about__blobs .blob--magenta'), speed: 0.08 },
      { el: document.querySelector('.works__blobs .blob--lime'), speed: -0.05 },
      { el: document.querySelector('.works__blobs .blob--orange'), speed: 0.07 },
      { el: document.querySelector('.services__blobs .blob--magenta'), speed: -0.04 },
      { el: document.querySelector('.contact__blobs .blob--cyan'), speed: 0.06 },
    ];

    const items = blobConfigs.map(cfg => {
      if (!cfg.el) return null;
      const r = cfg.el.getBoundingClientRect();
      return {
        ...cfg,
        initialCenter: r.top + r.height / 2 + window.scrollY - window.innerHeight / 2
      };
    }).filter(i => i);

    s.on(({ scroll }) => {
      items.forEach(({ el, speed, initialCenter }) => {
        const relativeCenter = initialCenter - scroll;
        el.style.transform = `translateY(${relativeCenter * speed}px) scale(1)`;
      });
    });
  }

  /* ─────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.3;
        const dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
        btn.style.transition = 'transform 0.12s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ─────────────────────────────────────
     GALLERY / PROJECT TILT
  ───────────────────────────────────── */
  function initGalleryTilt() {
    document.querySelectorAll('.project').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.08s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
        card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ─────────────────────────────────────
     SERVICE CARDS — dim others on hover
  ───────────────────────────────────── */
  function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cards.forEach(c => { if (c !== card) c.style.opacity = '0.45'; });
      });
      card.addEventListener('mouseleave', () => {
        cards.forEach(c => { c.style.opacity = ''; c.style.transition = 'opacity 0.4s'; });
      });
    });
  }

  /* ─────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────── */
  function initCounters(s) {
    let triggered = false;
    const counters = document.querySelectorAll('.counter-num');

    s.on(() => {
      if (triggered || !counters.length) return;
      const firstCounter = counters[0];
      const r = firstCounter.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9) return;

      triggered = true;
      counters.forEach(el => {
        const targetVal = el.dataset.target || '0';
        const isFloat = targetVal.includes('.');
        const target = parseFloat(targetVal) || 0;
        const dur = 1400;
        const start = performance.now();

        function step(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const current = ease * target;

          el.textContent = isFloat ? current.toFixed(2) : Math.round(current);

          if (t < 1) requestAnimationFrame(step);
          else el.textContent = isFloat ? target.toFixed(2) : target;
        }
        requestAnimationFrame(step);
      });
    });
  }

  /* ─────────────────────────────────────
     ABOUT PHOTO TILT
  ───────────────────────────────────── */
  function initAboutPhotoTilt() {
    const wrap = document.querySelector('.about__photo-wrap');
    if (!wrap) return;

    let r = wrap.getBoundingClientRect();
    window.addEventListener('resize', () => { r = wrap.getBoundingClientRect(); });

    wrap.addEventListener('mousemove', e => {
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      wrap.querySelector('.about__photo').style.transform =
        `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.querySelector('.about__photo').style.transform = '';
    });
  }

  /* ─────────────────────────────────────
     TEXT SCRAMBLE — hero title
  ───────────────────────────────────── */
  function initTextScramble() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&';

    function scramble(el, finalText, delay = 0) {
      const steps = 12;
      let step = 0;
      setTimeout(() => {
        const interval = setInterval(() => {
          el.textContent = finalText.split('').map((c, i) => {
            if (c === ' ') return ' ';
            if (i < (step / steps) * finalText.length) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          step++;
          if (step > steps) {
            el.textContent = finalText;
            clearInterval(interval);
          }
        }, 50);
      }, delay);
    }

    setTimeout(() => {
      document.querySelectorAll('.ht-word').forEach((el, i) => {
        if (!el.classList.contains('ht-word--italic')) {
          const original = el.dataset.word || el.textContent.trim();
          scramble(el, original, i * 200);
        }
      });
    }, 1700);
  }

  /* ─────────────────────────────────────
     FORM SUBMIT
  ───────────────────────────────────── */
  /* ─────────────────────────────────────
     GSAP SERVICES HORIZONTAL SCROLL
  ───────────────────────────────────── */
  function initGSAPServices(s) {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.services');
    const container = document.querySelector('.services__sticky-container');
    const grid = document.querySelector('.services__grid');

    if (!section || !grid || !container) return;

    // Link GSAP to our custom SmoothScroll
    ScrollTrigger.scrollerProxy("#smooth-content", {
      scrollTop(value) {
        return arguments.length ? s.scrollTo(value) : s.current;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: "transform"
    });

    // Calculate total horizontal distance
    const getScrollAmount = () => {
      const gridWidth = grid.scrollWidth;
      return -(gridWidth - window.innerWidth + 160);
    };

    // The Animation
    const tween = gsap.to(grid, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        scroller: "#smooth-content",
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: container,
        scrub: 1.2,
        invalidateOnRefresh: true,
        // markers: true, // Uncomment to debug
      }
    });

    // Update ScrollTrigger when scroller moves
    s.on(() => {
      ScrollTrigger.update();
    });

    ScrollTrigger.addEventListener("refresh", () => s._resize());
    ScrollTrigger.refresh();
  }
  function initFormSubmit() {
    const btn = document.getElementById('formBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.cform__input');
      const filled = Array.from(inputs).some(i => i.value.trim());
      if (!filled) return;

      btn.innerHTML = '<span>Message Sent!</span> ✓';
      btn.style.background = 'linear-gradient(135deg, #2d8a2d, #5fff8a)';
      btn.style.boxShadow = '0 0 40px rgba(95,255,138,0.3)';

      setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        btn.style.background = '';
        btn.style.boxShadow = '';
        inputs.forEach(i => i.value = '');
      }, 3500);
    });
  }

  /* ─────────────────────────────────────
     STICKY VERTICAL SCROLL (JS POLYFILL)
  ───────────────────────────────────── */
  function initStickyProjects(s) {
    const projects = document.querySelectorAll('.project');
    if (!projects.length) return;

    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    const wrappers = [];
    projects.forEach(p => {
      const wrap = document.createElement('div');
      wrap.className = 'project-sticky-wrapper';
      wrap.style.willChange = 'transform';
      p.parentNode.insertBefore(wrap, p);
      wrap.appendChild(p);
      wrappers.push(wrap);
    });

    let originalTops = [];
    let wrapperHeights = [];
    let gridBottomAbs = 0;

    function calculateTops() {
      originalTops = [];
      wrapperHeights = [];
      wrappers.forEach(w => w.style.transform = 'translateY(0px)');

      const gridRect = grid.getBoundingClientRect();
      gridBottomAbs = gridRect.bottom + s.current;

      wrappers.forEach(w => {
        const rect = w.getBoundingClientRect();
        const absoluteTop = rect.top + s.current;
        originalTops.push(absoluteTop);
        wrapperHeights.push(rect.height);
      });

      updateSticky(s);
    }

    function updateSticky({ scroll }) {
      wrappers.forEach((w, i) => {
        const stickPoint = 60 + i * 30;
        const stickTrigger = originalTops[i] - stickPoint;
        const maxTranslate = gridBottomAbs - originalTops[i] - wrapperHeights[i];

        if (scroll > stickTrigger) {
          let distance = scroll - stickTrigger;
          if (maxTranslate > 0 && distance > maxTranslate) distance = maxTranslate;
          w.style.transform = `translate3d(0, ${distance}px, 0)`;
        } else {
          w.style.transform = 'translate3d(0, 0px, 0)';
        }
      });
    }

    s.on(updateSticky);
    window.addEventListener('resize', calculateTops);
    setTimeout(calculateTops, 500);
    setTimeout(calculateTops, 1500);
  }

  /* ─────────────────────────────────────
     STICKY SERVICES SCROLL ANIMATION
  ───────────────────────────────────── */

}); // DOMContentLoaded
