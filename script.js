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

// The first contrails image binaries uploaded to the repository were corrupted in
// transit. The verified replacements are stored as same-origin base64 text files.
// Hydrate only those affected figures in the browser, after validating that the
// decoded payload is a real image. Unique v7 payload URLs also avoid stale caches.
const contrailsFigurePayloads = new Map([
  ['contrails-les-temperature.webp', '/images/contrails-v7-temperature.b64'],
  ['contrails-les-density.webp', '/images/contrails-v7-density.b64'],
  ['contrails-les-si-mean.webp', '/images/contrails-v7-si-mean.b64']
]);

const hydrateContrailsFigure = async (img, payloadUrl) => {
  const originalSrc = img.getAttribute('src') || '';
  img.style.visibility = 'hidden';
  try {
    const response = await fetch(payloadUrl, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.text()).replace(/\s+/g, '');
    if (!payload.startsWith('UklGR') || payload.length < 1000) {
      throw new Error('Invalid WebP payload');
    }

    const dataUrl = `data:image/webp;base64,${payload}`;
    await new Promise((resolve, reject) => {
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth < 1000 || probe.naturalHeight < 400) {
          reject(new Error(`Unexpected dimensions ${probe.naturalWidth}x${probe.naturalHeight}`));
          return;
        }
        resolve();
      };
      probe.onerror = () => reject(new Error('Decoded image failed to load'));
      probe.src = dataUrl;
    });

    img.src = dataUrl;
    img.removeAttribute('loading');
  } catch (error) {
    console.error(`Could not replace contrails figure ${originalSrc}:`, error);
  } finally {
    img.style.visibility = 'visible';
  }
};

contrailsFigurePayloads.forEach((payloadUrl, filename) => {
  document.querySelectorAll(`img[src$="${filename}"]`).forEach(img => {
    hydrateContrailsFigure(img, payloadUrl);
  });
});