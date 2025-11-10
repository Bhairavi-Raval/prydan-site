// Quick test to confirm JS is connected
console.log("JS connected!");

// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.navbar');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});


/* ===== Sticky header (adds .is-scrolled) ===== */
(function () {
  const header = document.querySelector('header.navbar');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 8) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== Smooth scroll for top nav ===== */
(function () {
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
(function () {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const sections = [
    { el: document.querySelector('.hero'),   key: 'Home'   },
    { el: document.querySelector('.about'),  key: 'About'  },
    { el: document.querySelector('.services'), key: 'Services' },
    { el: document.querySelector('.contact'),  key: 'Contact'  },
    { el: document.querySelector('.pages'),    key: 'Pages'    }
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
(function () {
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
    {
      threshold: 0.15, // triggers when 15% of section is visible
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));
})();

// Mark that JS is running (used by CSS above)
document.documentElement.classList.add('js');

function initReveal() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  // helper: is element in viewport now?
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.85 && r.bottom > 0;
  };

  const show = (el) => el.classList.add('visible');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05
    });

    // If an element is already visible before observer attaches, show it immediately.
    els.forEach((el) => {
      if (inView(el)) show(el);
      else io.observe(el);
    });
  } else {
    // Fallback for older browsers
    const onScroll = () => els.forEach((el) => inView(el) && show(el));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

// Ensure DOM is ready before attaching
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReveal);
} else {
  initReveal();
}

/// ===== Mobile Navbar Toggle =====
(() => {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  // Safety check
  if (!toggleBtn || !navLinks) {
    console.warn("⚠️ Navbar elements missing!");
    return;
  }

  // Toggle menu open/close
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    toggleBtn.classList.toggle('active', isOpen);

    // Prevent background scroll when menu is open
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      toggleBtn.classList.remove('active');
      body.style.overflow = ''; // Re-enable scroll
    });
  });

  // Optional: close on scroll or resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      navLinks.classList.remove('show');
      toggleBtn.classList.remove('active');
      body.style.overflow = '';
    }
  });
})();
