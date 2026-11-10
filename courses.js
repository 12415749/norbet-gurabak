// Setup Scene, Camera, Renderer
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 3D PARTICLE GALAXY BACKGROUND ---
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Create particles scattered in 3D space
for (let i = 0; i < particleCount * 3; i += 3) {
  // Positions
  positions[i] = (Math.random() - 0.5) * 200;
  positions[i + 1] = (Math.random() - 0.5) * 200;
  positions[i + 2] = (Math.random() - 0.5) * 200;

  // Indigo and purple hues for accent
  colors[i] = 0.4 + Math.random() * 0.4;     // R
  colors[i + 1] = 0.4 + Math.random() * 0.2; // G
  colors[i + 2] = 0.9 + Math.random() * 0.1; // B
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particle Material
const material = new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Interactive Mouse Effect
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5;
  mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Slow drift rotation
  particleSystem.rotation.y += 0.0008;
  particleSystem.rotation.x += 0.0004;

  // React smoothly to mouse movement
  particleSystem.rotation.y += mouseX * 0.005;
  particleSystem.rotation.x += mouseY * 0.005;

  renderer.render(scene, camera);
}

animate();



// ============================================================
// COURSE FILTERS, SEARCH, MOBILE MENU & SCROLL REVEAL
// (independent of Three.js)
// ============================================================

(function () {

  // ----------------------------------------------------------
  // MOBILE MENU TOGGLE
  // ----------------------------------------------------------

  const nav = document.querySelector('.top-nav');
  const toggle = document.querySelector('.menu-toggle');

  if (nav && toggle) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) setOpen(false); });
  }


  // ----------------------------------------------------------
  // FILTER + SEARCH
  // Status filters: all | done | current | upcoming
  // ----------------------------------------------------------

  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#course-search');
  const noResults = document.querySelector('#no-results');
  const yearSections = document.querySelectorAll('.year-section');

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCards = 0;

    yearSections.forEach((section) => {
      let sectionHasVisible = false;

      section.querySelectorAll('.semester-card').forEach((card) => {
        const status = card.dataset.status;
        const statusMatch = activeFilter === 'all' || status === activeFilter;

        // Search inside individual subjects
        const items = card.querySelectorAll('.subject-list li');
        let itemMatches = 0;

        items.forEach((li) => {
          const match = !query || li.textContent.toLowerCase().includes(query);
          li.hidden = !match;
          li.classList.toggle('highlight', Boolean(query) && match);
          if (match) itemMatches++;
        });

        // Semester titles can also match (e.g. "semester 5")
        const titleText = (card.querySelector('h3')?.textContent || '').toLowerCase();
        const titleMatch = query && titleText.includes(query);

        if (titleMatch) {
          items.forEach((li) => { li.hidden = false; li.classList.remove('highlight'); });
        }

        const searchMatch = !query || titleMatch || itemMatches > 0;
        const show = statusMatch && searchMatch;

        card.hidden = !show;
        if (show) {
          sectionHasVisible = true;
          visibleCards++;
        }
      });

      section.hidden = !sectionHasVisible;
    });

    if (noResults) {
      noResults.hidden = visibleCards > 0;
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter || 'all';
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }


  // ----------------------------------------------------------
  // SCROLL REVEAL
  // ----------------------------------------------------------

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) return;

  const targets = document.querySelectorAll('.card, .timeline-item, .project-card');

  targets.forEach((el) => {
    const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
    el.style.transitionDelay = `${Math.min(Math.max(0, siblings.indexOf(el)), 5) * 70}ms`;
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');
      obs.unobserve(el);

      const cleanup = (e) => {
        if (e.target !== el || e.propertyName !== 'opacity') return;
        el.classList.remove('reveal', 'is-visible');
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', cleanup);
      };
      el.addEventListener('transitionend', cleanup);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => observer.observe(el));
})();



// ============================================================
// PHASE 2: PRELOADER & THEME TOGGLE
// ============================================================

(function () {

  // ----------------------------------------------------------
  // PRELOADER
  // ----------------------------------------------------------

  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (preloader) preloader.classList.add('fade-out');
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
    // Safety net: never trap the user behind the loader if a CDN stalls
    setTimeout(hidePreloader, 8000);
  }


  // ----------------------------------------------------------
  // THEME TOGGLE (dark / light, persisted)
  // ----------------------------------------------------------

  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (themeBtn) {
      themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
      themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }

  applyTheme(saved === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }
})();
