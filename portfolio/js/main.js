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
    initTimelineTracing(scroller);
    initGradientBlinds();
    initSilk();
    initHeroSplitText();
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
     HERO SPLIT TEXT
  ───────────────────────────────────── */
  function initHeroSplitText() {
    const textEl = document.querySelector('.hero__title-row .ht-word:not(.ht-word--italic)');
    if (!textEl) return;
    
    // Disable the CSS 'wordUp' animation with !important so it doesn't override GSAP,
    // but keep the 'ht-word' class so the text size and font remain correct!
    textEl.style.setProperty('animation', 'none', 'important');
    // Reset the CSS initial translateY(110%) so the element is visible for GSAP inner spans!
    textEl.style.transform = 'translateY(0)';
    textEl.style.opacity = '1';
    
    const text = textEl.getAttribute('data-word') || textEl.textContent;
    textEl.innerHTML = '';
    
    const chars = [];
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      }
      textEl.appendChild(span);
      chars.push(span);
    });

    gsap.fromTo(chars,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.05,
        delay: 1.5 // Wait for page loader to finish
      }
    );
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

  /* ─────────────────────────────────────
     TIMELINE INTERACTIVE TRACING
  ───────────────────────────────────── */
  function initTimelineTracing(s) {
    const section = document.querySelector('.experience');
    const lineTrack = document.querySelector('.timeline__line');
    const progressLine = document.querySelector('.timeline__line-progress');
    const items = document.querySelectorAll('.timeline__item');

    if (!section || !progressLine) return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate the clip-path of the progress line as the user scrolls down
    gsap.fromTo(progressLine,
      {
        clipPath: 'inset(0% 0% 100% 0%)'
      },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: lineTrack || section,
          scroller: '#smooth-content',
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: true
        }
      }
    );

    // Synchronize Landmark Nodes (dots) to light up exactly when the path reaches their centers
    items.forEach(item => {
      ScrollTrigger.create({
        trigger: item,
        scroller: '#smooth-content',
        start: 'center 50%', // when center of item (where node is located) reaches viewport center
        end: 'bottom 20%',
        toggleClass: { targets: item, className: 'traced' }
      });
    });
  }

  /* ─────────────────────────────────────
     GRADIENT BLINDS HERO ANIMATION
  ───────────────────────────────────── */
  async function initGradientBlinds() {
    const container = document.getElementById('gradient-blinds-container');
    if (!container) return;

    // Load OGL dynamically
    const ogl = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.10/+esm');
    const { Renderer, Program, Mesh, Triangle } = ogl;

    const MAX_COLORS = 8;
    const hexToRGB = hex => {
      const c = hex.replace('#', '').padEnd(6, '0');
      const r = parseInt(c.slice(0, 2), 16) / 255;
      const g = parseInt(c.slice(2, 4), 16) / 255;
      const b = parseInt(c.slice(4, 6), 16) / 255;
      return [r, g, b];
    };

    const prepStops = stops => {
      const base = (stops && stops.length ? stops : ['#FF9FFC', '#5227FF']).slice(0, MAX_COLORS);
      if (base.length === 1) base.push(base[0]);
      while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
      const arr = [];
      for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]));
      const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
      return { arr, count };
    };

    const p = {
      gradientColors: ['#f272a8', '#ff9a55', '#c44169', '#8544c7', '#296092', '#101423'],
      angle: 0,
      noise: 0.3,
      blindCount: 12,
      blindMinWidth: 50,
      spotlightRadius: 0.5,
      spotlightSoftness: 1,
      spotlightOpacity: 1,
      mouseDampening: 0.15,
      distortAmount: 0,
      shineDirection: 'left',
      mixBlendMode: 'lighten',
      mirrorGradient: false,
      paused: false
    };

    container.style.mixBlendMode = p.mixBlendMode;

    const renderer = new Renderer({
      dpr: window.devicePixelRatio || 1,
      alpha: true,
      antialias: true
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

    const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  if (seg < 1.0) return mix(uColor0, uColor1, f);
  if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
  if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
  if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
  if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
  if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
  if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
  if (count > 7) return uColor7;
  if (count > 6) return uColor6;
  if (count > 5) return uColor5;
  if (count > 4) return uColor4;
  if (count > 3) return uColor3;
  if (count > 2) return uColor2;
  return uColor1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    vec2 uvMod = uv;
    if (uDistort > 0.0) {
      float a = uvMod.y * 6.0;
      float b = uvMod.x * 6.0;
      float w = 0.01 * uDistort;
      uvMod.x += sin(a) * w;
      uvMod.y += cos(b) * w;
    }
    float t = uvMod.x;
    if (uMirror > 0.5) {
      t = 1.0 - abs(1.0 - 2.0 * fract(t));
    }
    vec3 base = getGradientColor(t);

    vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
  float d = length(uv0 - offset);
  float r = max(uSpotlightRadius, 1e-4);
  float dn = d / r;
  float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
  vec3 cir = vec3(spot);
  float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
  if (uShineFlip > 0.5) stripe = 1.0 - stripe;
    vec3 ran = vec3(stripe);

    vec3 col = cir + base - ran;
    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;

    fragColor = vec4(col, 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`;

    const { arr: colorArr, count: colorCount } = prepStops(p.gradientColors);
    const uniforms = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
      },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uAngle: { value: (p.angle * Math.PI) / 180 },
      uNoise: { value: p.noise },
      uBlindCount: { value: Math.max(1, p.blindCount) },
      uSpotlightRadius: { value: p.spotlightRadius },
      uSpotlightSoftness: { value: p.spotlightSoftness },
      uSpotlightOpacity: { value: p.spotlightOpacity },
      uMirror: { value: p.mirrorGradient ? 1 : 0 },
      uDistort: { value: p.distortAmount },
      uShineFlip: { value: p.shineDirection === 'right' ? 1 : 0 },
      uColor0: { value: colorArr[0] },
      uColor1: { value: colorArr[1] },
      uColor2: { value: colorArr[2] },
      uColor3: { value: colorArr[3] },
      uColor4: { value: colorArr[4] },
      uColor5: { value: colorArr[5] },
      uColor6: { value: colorArr[6] },
      uColor7: { value: colorArr[7] },
      uColorCount: { value: colorCount }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    let mouseTarget = [0, 0];
    let firstResize = true;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];

      if (p.blindMinWidth && p.blindMinWidth > 0) {
        const maxByMinWidth = Math.max(1, Math.floor(rect.width / p.blindMinWidth));
        const effective = p.blindCount ? Math.min(p.blindCount, maxByMinWidth) : maxByMinWidth;
        uniforms.uBlindCount.value = Math.max(1, effective);
      } else {
        uniforms.uBlindCount.value = Math.max(1, p.blindCount);
      }

      if (firstResize) {
        firstResize = false;
        const cx = gl.drawingBufferWidth / 2;
        const cy = gl.drawingBufferHeight / 2;
        uniforms.iMouse.value = [cx, cy];
        mouseTarget = [cx, cy];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTarget = [x, y];
      if (p.mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);

    let rafId = null;
    let lastTime = 0;

    const loop = t => {
      rafId = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (p.mouseDampening > 0) {
        if (!lastTime) lastTime = t;
        const dt = (t - lastTime) / 1000;
        lastTime = t;
        const tau = Math.max(1e-4, p.mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTarget;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTime = t;
      }
      if (!p.paused) {
        renderer.render({ scene: mesh });
      }
    };
    rafId = requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────
     SILK FOOTER ANIMATION
  ───────────────────────────────────── */
  async function initSilk() {
    const container = document.getElementById('footer-silk');
    if (!container) return;

    const ogl = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.10/+esm');
    const { Renderer, Program, Mesh, Triangle } = ogl;

    const hexToRgb = hex => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return [1, 1, 1];
      return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
    };

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3  uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uNoiseIntensity;

      const float e = 2.71828182845904523536;

      float noise(vec2 texCoord) {
        float G = e;
        vec2  r = (G * sin(G * texCoord));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }

      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2  rot = mat2(c, -s, s, c);
        return rot * uv;
      }

      void main() {
        float rnd        = noise(gl_FragCoord.xy);
        vec2  uv         = rotateUvs(vUv * uScale, uRotation);
        vec2  tex        = uv * uScale;
        float tOffset    = uSpeed * uTime;

        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

        float pattern = 0.6 +
                        0.4 * sin(5.0 * (tex.x + tex.y +
                                         cos(3.0 * tex.x + 5.0 * tex.y) +
                                         0.02 * tOffset) +
                                 sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

        vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
        col.a = 1.0;
        gl_FragColor = col;
      }
    `;

    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        // Use the deep indigo/blue from the new design theme
        uColor: { value: new Float32Array(hexToRgb('#1e223b')) },
        uSpeed: { value: 5 },
        uScale: { value: 1 },
        uRotation: { value: 0 },
        uNoiseIntensity: { value: 1.5 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = t => {
      program.uniforms.uTime.value = (t - t0) * 0.0001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; isVisible ? tryStart() : tryStop(); },
      { threshold: 0 }
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();
  }

}); // DOMContentLoaded
