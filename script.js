const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

const filterButtons = document.querySelectorAll('.filter-button');
const cards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  cards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const progress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  if (!progress) return;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
}, { passive: true });

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Refined interaction layer: subtle, optional, and reduced-motion aware.
const header = document.querySelector('.site-header');
const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 18);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPath || (currentPath === '' && href === 'index.html')) link.classList.add('active');
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

// RSX: show the complete rover-arm CAD assembly before the detail images.
if (currentPath.toLowerCase() === 'rsx.html') {
  const gallery = document.querySelector('#overview .project-gallery');
  if (gallery && !gallery.querySelector('.rsx-full-arm')) {
    const figure = document.createElement('figure');
    figure.className = 'rsx-full-arm';
    figure.style.gridColumn = '1 / -1';
    figure.style.textAlign = 'center';
    figure.innerHTML = '<img src="../images/RSXArmFull.webp" alt="Full CAD assembly of the Robotics for Space Exploration rover arm." loading="lazy" width="595" height="622" style="display:block;width:min(100%,595px);height:auto;object-fit:contain;margin:0 auto"><figcaption>Full CAD assembly of the rover arm in Fusion 360.</figcaption>';
    gallery.prepend(figure);
  }
}
