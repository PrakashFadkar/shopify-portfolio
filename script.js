(function () {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('is-open');
  }

  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.classList.toggle('is-open', !open);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 800) closeMenu();
  });
})();

(function () {
  if (!window.gsap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const words = document.querySelectorAll('.hero-title-word');
  const badge = document.querySelector('.hero-badge');
  const copy = document.querySelector('.hero-copy');
  const actions = document.querySelectorAll('.hero-copy .btn');

  // Split only the visible title into characters. No background or text box is added.
  words.forEach(function (word) {
    const text = word.textContent.trim();
    word.textContent = '';
    Array.from(text).forEach(function (char) {
      const span = document.createElement('span');
      span.className = 'hero-title-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      word.appendChild(span);
    });
  });

  const chars = document.querySelectorAll('.hero-title-char');
  gsap.set(chars, { y: 70, opacity: 0, rotateX: -85, transformOrigin: '50% 100%', filter: 'blur(7px)' });
  gsap.set([badge, copy], { y: 22, opacity: 0 });
  gsap.set(actions, { y: 14, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(badge, { y: 0, opacity: 1, duration: .65 })
    .to(chars, { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: .8, stagger: .045 }, '-=.2')
    .to(copy, { y: 0, opacity: 1, duration: .8 }, '-=.48')
    .to(actions, { y: 0, opacity: 1, duration: .55, stagger: .1 }, '-=.5');

  // A subtle text-only accent travels across the letters after the reveal.
  const accentChars = document.querySelectorAll('.hero-title .outline .hero-title-char');
  tl.to(accentChars, {
    color: 'var(--green)',
    webkitTextStrokeColor: 'var(--green)',
    duration: .12,
    stagger: .035,
    yoyo: true,
    repeat: 1,
    ease: 'sine.inOut'
  }, '-=.1');

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section-head, .project, .technical-grid > *, .edu, .contact').forEach(function (el, i) {
      gsap.from(el, {
        y: 45,
        opacity: 0,
        duration: .8,
        ease: 'power3.out',
        delay: (i % 3) * .04,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }
})();

document.querySelectorAll('img[data-fallback]').forEach(function(img){
    img.addEventListener('error', function(){
      if (img.dataset.fallback && img.src.indexOf(img.dataset.fallback) === -1) {
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });

(function () {
  const tabs = document.querySelectorAll('.filters [role="tab"]');
  const projects = document.querySelectorAll('.projects-grid .project');
  if (!tabs.length || !projects.length) return;

  function applyFilter(filter) {
    tabs.forEach(function(tab) {
      const active = tab.dataset.filter === filter;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    projects.forEach(function(project) {
      const categories = (project.dataset.category || '').split(/\s+/);
      const show = filter === 'all' || categories.includes(filter);
      project.classList.toggle('is-hidden', !show);
    });

    if (window.ScrollTrigger) {
      setTimeout(function() {
        ScrollTrigger.refresh();
      }, 50);
    }
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      applyFilter(tab.dataset.filter);
    });

    tab.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        applyFilter(tab.dataset.filter);
      }
    });
  });
})();
