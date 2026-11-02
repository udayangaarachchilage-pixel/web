/* =====================================================
   AKZ CREATION — Interactive Engine (Vanilla JS)
   ===================================================== */
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================
   1. PRELOADER — percentage 0 → 100
   ===================================================== */
(function preloader() {
  const preloaderEl = document.getElementById('preloader');
  const fill = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');
  const particleBox = document.getElementById('loaderParticles');

  // spawn glowing particles inside the preloader
  if (!prefersReducedMotion && particleBox) {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = 60 + Math.random() * 40 + '%';
      p.style.animationDelay = Math.random() * 2 + 's';
      if (Math.random() > 0.5) {
        p.style.background = '#a855f7';
        p.style.boxShadow = '0 0 8px #a855f7';
      }
      particleBox.appendChild(p);
    }
  }

  let progress = 0;
  const start = performance.now();
  const DURATION = prefersReducedMotion ? 200 : 2000;

  function tick(now) {
    const t = Math.min((now - start) / DURATION, 1);
    // ease-out for a smooth decelerating feel
    progress = Math.round((1 - Math.pow(1 - t, 3)) * 100);
    fill.style.width = progress + '%';
    percent.textContent = progress + '%';
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        preloaderEl.classList.add('hidden');
        document.querySelector('.hero').classList.add('loaded');
      }, 350);
    }
  }
  requestAnimationFrame(tick);
})();

/* =====================================================
   2. CUSTOM CURSOR (desktop / fine pointers only)
   ===================================================== */
(function customCursor() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll('a, button, input, textarea, .tilt').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* =====================================================
   3. NAVBAR — sticky state, mobile menu, active links
   ===================================================== */
(function navigation() {
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link, .btn').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
})();

/* =====================================================
   4. HERO — typing animation, mouse glow, parallax
   ===================================================== */
(function hero() {
  // typing effect
  const phrases = [
    'Building next-gen web experiences...',
    'Crafting intelligent automation bots...',
    'Designing the future of digital...',
    'Turning ideas into reality with code...'
  ];
  const typingEl = document.getElementById('typingText');
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const current = phrases[pi];
    typingEl.textContent = current.slice(0, ci);
    let delay = deleting ? 32 : 62;
    if (!deleting && ci === current.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    ci += deleting ? -1 : 1;
    setTimeout(type, delay);
  }
  if (typingEl) setTimeout(type, 1400);

  if (prefersReducedMotion) return;

  // mouse-following glow
  const glow = document.getElementById('mouseGlow');
  const hero = document.querySelector('.hero');
  let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
  });
  (function moveGlow() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(moveGlow);
  })();

  // subtle parallax on 3D object + floating icons
  const object3d = document.getElementById('object3d');
  hero.addEventListener('mousemove', (e) => {
    const dx = (e.clientX / innerWidth - 0.5);
    const dy = (e.clientY / innerHeight - 0.5);
    object3d.style.transform = `translate(${dx * 24}px, ${dy * 24}px)`;
  });
})();

/* =====================================================
   5. SCROLL REVEAL — IntersectionObserver
   ===================================================== */
(function scrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

/* =====================================================
   6. ANIMATED COUNTERS
   ===================================================== */
(function counters() {
  const counters = document.querySelectorAll('.counter');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      obs.unobserve(el);

      (function step(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => obs.observe(c));
})();

/* =====================================================
   7. 3D TILT HOVER EFFECT
   ===================================================== */
(function tiltEffect() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.tilt').forEach((card) => {
    const MAX = 10;
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
      card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
      setTimeout(() => (card.style.transition = ''), 500);
    });
  });
})();

/* =====================================================
   8. MAGNETIC BUTTONS
   ===================================================== */
(function magneticButtons() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      btn.style.transform = 'translate(0, 0)';
      setTimeout(() => (btn.style.transition = ''), 500);
    });
  });
})();

/* =====================================================
   9. FLOATING PARTICLES CANVAS (site-wide background)
   ===================================================== */
(function particles() {
  const canvas = document.getElementById('particlesCanvas');
  if (prefersReducedMotion) { canvas.remove(); return; }
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = Math.min(70, Math.floor(innerWidth / 22));
  const COLORS = ['#00d4ff', '#a855f7', '#ec4899'];

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.25
    });
  }

  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // gentle mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        p.x += (dx / dist) * 0.8;
        p.y += (dy / dist) * 0.8;
      }

      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  })();
})();

/* =====================================================
   10. CONTACT FORM — front-end validation
   ===================================================== */
(function contactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name (min 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Subject must be at least 3 characters.',
    message: (v) => v.trim().length >= 10 || 'Message must be at least 10 characters.'
  };

  function validateField(field) {
    const rule = validators[field.name];
    const group = field.closest('.form-group');
    const errorEl = group.querySelector('.error-msg');
    const result = rule(field.value);
    if (result === true) {
      group.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }
    group.classList.add('error');
    errorEl.textContent = result;
    return false;
  }

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach((field) => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // simulate sending
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'SENDING...';
    setTimeout(() => {
      form.reset();
      form.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));
      successMsg.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'SEND MESSAGE';
      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1500);
  });
})();

/* =====================================================
   11. BACK TO TOP
   ===================================================== */
(function backToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
})();
