// Theme toggle
const themeIconToggle = document.querySelector('[data-theme-icon-toggle]');
const themeColorMeta = document.querySelector('#theme-color-meta');
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
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', theme === 'light' ? '#f7faff' : '#050a12');
  }
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
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
const sectionTargets = navLinks
  .map(link => {
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

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

if (sectionTargets.length) {
  const setActiveNavLink = () => {
    const scrollPosition = window.scrollY + 130;
    let activeItem = sectionTargets[0];

    sectionTargets.forEach(item => {
      if (item.target.offsetTop <= scrollPosition) {
        activeItem = item;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('is-active', activeItem && link === activeItem.link);
    });
  };

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(setActiveNavLink);
  }, { passive: true });

  window.addEventListener('resize', setActiveNavLink);
  setActiveNavLink();
}

// Carousel
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-carousel-track]');
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return;

  let autoplayId = null;

  const getScrollStep = () => {
    const firstCard = track.querySelector('.gallery-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '12') || 12;
    return cardWidth + gap;
  };

  const scrollToPosition = (position) => {
    track.scrollTo({ left: position, behavior: 'smooth' });
  };

  const scrollByCard = (direction) => {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const step = getScrollStep();
    const nextPosition = track.scrollLeft + (direction * step);

    if (direction > 0 && track.scrollLeft >= maxScrollLeft - 4) {
      scrollToPosition(0);
      return;
    }

    if (direction < 0 && track.scrollLeft <= 4) {
      scrollToPosition(maxScrollLeft);
      return;
    }

    scrollToPosition(Math.max(0, Math.min(nextPosition, maxScrollLeft)));
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      scrollByCard(1);
    }, 2600);
  };

  prev.addEventListener('click', () => {
    scrollByCard(-1);
    startAutoplay();
  });
  next.addEventListener('click', () => {
    scrollByCard(1);
    startAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
  track.addEventListener('touchstart', stopAutoplay, { passive: true });
  track.addEventListener('touchend', startAutoplay, { passive: true });
  window.addEventListener('resize', startAutoplay);

  startAutoplay();
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
