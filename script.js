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

// Contrails portfolio: render the original extracted report rasters directly.
// The earlier SVG wrappers could display with a mismatched intrinsic viewport in some browsers,
// which made one figure look corrupted and others appear cropped.
const contrailsReportAssets = {
  'contrails-report-validation-2026.svg': {
    source: '../images/contrails-wedge-validation.jpg.b64',
    mime: 'image/jpeg'
  },
  'contrails-report-les-fields.svg': {
    source: '../images/contrails-les-report.webp.b64',
    mime: 'image/webp'
  }
};

if (location.pathname.endsWith('/projects/contrails.html')) {
  document.querySelectorAll('.research-figure').forEach(figure => {
    figure.style.overflow = 'visible';
    figure.style.padding = '14px';

    const image = figure.querySelector('img');
    if (!image) return;

    image.style.display = 'block';
    image.style.width = '100%';
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    image.style.maxHeight = 'none';
    image.style.objectFit = 'contain';
    image.style.objectPosition = 'center';

    const filename = (image.getAttribute('src') || '').split('/').pop();
    const asset = contrailsReportAssets[filename];
    if (!asset) return;

    const originalSrc = image.getAttribute('src');
    image.style.opacity = '0';

    fetch(asset.source, { cache: 'no-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${asset.source}`);
        return response.text();
      })
      .then(base64 => {
        const clean = base64.trim();
        if (!clean) throw new Error(`Empty image data in ${asset.source}`);
        image.onload = () => { image.style.opacity = '1'; };
        image.onerror = () => {
          image.removeAttribute('src');
          figure.style.display = 'none';
        };
        image.src = `data:${asset.mime};base64,${clean}`;
      })
      .catch(() => {
        // Do not leave the known-bad wrapper visible if the replacement asset fails.
        image.removeAttribute('src');
        image.alt = '';
        figure.style.display = 'none';
        console.warn(`Could not replace contrails report image: ${originalSrc}`);
      });
  });
}
