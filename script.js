// Scroll animation
const elements = document.querySelectorAll('.card, .project-card, .gallery-card, .testimonial-card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

elements.forEach(el=>{
  el.style.opacity=0;
  el.style.transform="translateY(40px)";
  el.style.transition="0.6s";
  observer.observe(el);
});

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
