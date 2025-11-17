// Quick test to confirm JS is connected
console.log("JS connected!");

// Mark that JS is running (used by CSS above)
document.documentElement.classList.add('js');

/* ===== Sticky header (adds .is-scrolled) ===== */
(() => {
  const header = document.querySelector('header.navbar');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== Smooth scroll for top nav ===== */
(() => {
  const links = document.querySelectorAll('.nav-links a:not(.btn-primary)');
  if (!links.length) return;

  const TARGETS = {
    Home: '.hero',
    About: '.about',
    Services: '.services',
    Contact: '.contact',
    Pages: '.pages'
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach(link => {
    const label = (link.textContent || '').trim();
    const targetSel = TARGETS[label];
    if (!targetSel) return;

    const targetEl = document.querySelector(targetSel);
    if (!targetEl) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
})();

/* ===== Active link highlight while scrolling ===== */
(() => {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const sections = [
    { el: document.querySelector('.hero'), key: 'Home' },
    { el: document.querySelector('.about'), key: 'About' },
    { el: document.querySelector('.services'), key: 'Services' },
    { el: document.querySelector('.contact'), key: 'Contact' },
    { el: document.querySelector('.pages'), key: 'Pages' }
  ].filter(s => s.el);

  if (!sections.length) return;

  const linkByKey = {};
  nav.querySelectorAll('a:not(.btn-primary)').forEach(a => {
    linkByKey[(a.textContent || '').trim()] = a;
  });

  const setActive = (key) => {
    nav.querySelectorAll('a').forEach(a => a.classList.remove('is-active'));
    if (linkByKey[key]) linkByKey[key].classList.add('is-active');
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const found = sections.find(s => s.el === entry.target);
        if (found) setActive(found.key);
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(s => io.observe(s.el));
})();

/* ===== Scroll Reveal Sections ===== */
(() => {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => revealObserver.observe(el));
})();

/* ===== Mobile Navbar Toggle ===== */
(() => {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    toggleBtn.classList.toggle('active', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      toggleBtn.classList.remove('active');
      body.style.overflow = '';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      navLinks.classList.remove('show');
      toggleBtn.classList.remove('active');
      body.style.overflow = '';
    }
  });
})();

/* ===== Back to Top Button ===== */
(() => {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    display: 'none',
    background: '#081c3b',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    zIndex: '999'
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });
})();

/* ===== Dark / Light Mode Toggle ===== */
(() => {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;

  const applyTheme = (dark) => {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  toggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
  });

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') applyTheme(true);
})();
