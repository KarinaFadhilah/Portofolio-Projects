/**
 * SmoothScroll — Lenis-style RAF-based lerp scroller
 */
class SmoothScroll {
  constructor({ lerp = 0.04 } = {}) {
    this.lerp = lerp;
    this.current = 0;
    this.target  = 0;
    this.limit   = 0;
    this.velocity = 0;
    this.isRunning = false;
    this.rafId = null;
    this._cbs = [];
    this._touchY = 0;
    this._init();
  }

  _init() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const sw = document.getElementById('smooth-wrapper');
    if (sw) {
      sw.style.cssText += ';position:fixed;top:0;left:0;width:100%;height:100vh;overflow:hidden;';
    }
    this._el = document.getElementById('smooth-content');

    window.addEventListener('wheel',      this._wheel.bind(this), { passive: false });
    window.addEventListener('touchstart', this._ts.bind(this),    { passive: true  });
    window.addEventListener('touchmove',  this._tm.bind(this),    { passive: false });
    window.addEventListener('resize',     this._resize.bind(this));
    this._resize();
    this.start();
  }

  _wheel(e) {
    e.preventDefault();
    this.target = Math.max(0, Math.min(this.target + e.deltaY, this.limit));
  }
  _ts(e) { this._touchY = e.touches[0].clientY; }
  _tm(e) {
    e.preventDefault();
    const d = (this._touchY - e.touches[0].clientY) * 2;
    this._touchY = e.touches[0].clientY;
    this.target = Math.max(0, Math.min(this.target + d, this.limit));
  }
  _resize() {
    if (this._el) this.limit = Math.max(0, this._el.getBoundingClientRect().height - window.innerHeight);
  }

  _tick() {
    this.velocity = this.target - this.current;
    this.current += this.velocity * this.lerp;
    if (Math.abs(this.velocity) < 0.05) this.current = this.target;

    if (this._el) this._el.style.transform = `translate3d(0,${-this.current}px,0)`;

    const data = {
      scroll:   this.current,
      target:   this.target,
      velocity: this.velocity,
      limit:    this.limit,
      progress: this.limit > 0 ? this.current / this.limit : 0
    };
    this._cbs.forEach(cb => cb(data));

    if (this.isRunning) this.rafId = requestAnimationFrame(this._tick.bind(this));
  }

  on(cb)  { this._cbs.push(cb); return () => { this._cbs = this._cbs.filter(c => c !== cb); }; }
  start() { this.isRunning = true; this._tick(); }
  stop()  { this.isRunning = false; if (this.rafId) cancelAnimationFrame(this.rafId); }

  scrollTo(target, { offset = 0 } = {}) {
    let y = 0;
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) y = el.getBoundingClientRect().top + this.current + offset;
    } else if (typeof target === 'number') {
      y = target;
    } else if (target instanceof HTMLElement) {
      y = target.getBoundingClientRect().top + this.current + offset;
    }
    this.target = Math.max(0, Math.min(y, this.limit));
  }
}
