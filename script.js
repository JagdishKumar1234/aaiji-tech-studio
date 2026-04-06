// Theme toggle
const themeIconToggle = document.querySelector('[data-theme-icon-toggle]');
const themeStorageKey = 'aaiji-theme';
let currentTheme = 'dark';

const readStoredTheme = () => {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // Ignore storage failures and continue with in-memory theme state.
  }
};

const applyTheme = (theme) => {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  if (themeIconToggle) {
    const isLight = theme === 'light';
    themeIconToggle.classList.toggle('is-light', isLight);
    themeIconToggle.setAttribute('aria-pressed', String(isLight));
    themeIconToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  storeTheme(theme);
};

const savedTheme = readStoredTheme() || 'dark';
applyTheme(savedTheme);

if (themeIconToggle) {
  themeIconToggle.addEventListener('click', () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });
}

// Reveal animation
const revealGroups = [
  { selector: '.hero-copy, .section-head, .footer-left', variant: 'reveal-up' },
  { selector: '.hero-panel, .contact-form, .footer-meta', variant: 'reveal-right' },
  { selector: '.about-copy, .panel', variant: 'reveal-left' },
  { selector: '.card, .work-card, .testimonial-card, .gallery-card, .trusted-inner', variant: 'reveal-scale' }
];

const revealTargets = [];
const seenTargets = new Set();

revealGroups.forEach(group => {
  document.querySelectorAll(group.selector).forEach((element, index) => {
    if (seenTargets.has(element)) return;
    seenTargets.add(element);
    element.setAttribute('data-reveal', '');
    element.classList.add(group.variant);
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 80}ms`);
    revealTargets.push(element);
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18,
  rootMargin: '0px 0px -40px 0px'
});

revealTargets.forEach(element => {
  revealObserver.observe(element);
});

// Scroll depth motion
const parallaxTargets = [
  { element: document.querySelector('.hero-copy'), speed: 0.035 },
  { element: document.querySelector('.hero-panel'), speed: 0.05 },
  { element: document.querySelector('.trusted-inner'), speed: 0.03 }
].filter(item => item.element);

let ticking = false;

const updateScrollMotion = () => {
  const scrollY = window.scrollY;

  parallaxTargets.forEach(({ element, speed }) => {
    const offset = Math.min(scrollY * speed, 24);
    element.style.setProperty('--scroll-offset', `${offset}px`);
  });

  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollMotion);
    ticking = true;
  }
}, { passive: true });

updateScrollMotion();

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  const setMenuState = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });

  nav.querySelectorAll('a, button').forEach(item => {
    item.addEventListener('click', () => setMenuState(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });
}

// Carousel
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-carousel-track]');
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return;

  const updateDisabled = () => {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScrollLeft - 2;
  };

  const scrollByCard = (direction) => {
    const firstCard = track.querySelector('.gallery-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '16') || 16;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));

  track.addEventListener('scroll', () => window.requestAnimationFrame(updateDisabled), { passive: true });
  window.addEventListener('resize', updateDisabled);

  updateDisabled();
});

// Popup
function openForm(){
  document.getElementById("popupForm").style.display="block";
  document.body.classList.add('menu-open');
}
function closeForm(){
  document.getElementById("popupForm").style.display="none";
  if (!document.querySelector('.nav.is-open')) {
    document.body.classList.remove('menu-open');
  }
}

document.addEventListener('click', event => {
  const popup = document.getElementById("popupForm");
  if (!popup) return;

  if (event.target === popup) {
    closeForm();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeForm();
  }
});
