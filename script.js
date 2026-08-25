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

// Contrails page: replace legacy wrapper images with direct report-extracted JPEG assets.
if (location.pathname.endsWith('/projects/contrails.html')) {
  const prepareFigure = (figure, src, alt, caption) => {
    if (!figure) return;
    const img = figure.querySelector('img');
    const figcaption = figure.querySelector('figcaption');
    if (!img) return;
    img.src = src;
    img.alt = alt;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = 'none';
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    figure.style.overflow = 'visible';
    if (figcaption && caption) figcaption.textContent = caption;
  };

  const validationFigure = document.querySelector('#validation .research-figure');
  prepareFigure(
    validationFigure,
    '../images/contrails-report-validation.jpg',
    'Axisymmetric OpenFOAM temperature field and centreline validation against tunnel measurements.',
    'Report Figure 2 — developed temperature field and measured-vs-computed centreline-temperature decay for the validated axisymmetric reactingFoam case.'
  );

  const meshSection = document.querySelector('#mesh');
  const oldLesFigure = document.querySelector('#les .research-figure');
  if (meshSection && oldLesFigure) {
    const ogridFigure = oldLesFigure.cloneNode(true);
    prepareFigure(
      ogridFigure,
      '../images/contrails-report-ogrid.jpg',
      'Structured cylindrical O-grid extracted from the Summer 2026 UTIAS contrail research report.',
      'Report mesh figure — structured cylindrical O-grid topology used for the three-dimensional RANS-to-LES workflow.'
    );
    meshSection.appendChild(ogridFigure);

    prepareFigure(
      oldLesFigure,
      '../images/contrails-report-production-mesh.jpg',
      'Production three-dimensional LES mesh extracted from the Summer 2026 UTIAS contrail research report.',
      'Report production mesh — final 14,272,512-cell structured mesh used for the same-mesh RANS-to-LES workflow.'
    );
    meshSection.appendChild(oldLesFigure);
  }
}