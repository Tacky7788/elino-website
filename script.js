// ========== Scroll Reveal (IntersectionObserver) ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Step connectors also get revealed
document.querySelectorAll('.step-connector').forEach(el => revealObserver.observe(el));

// ========== Navbar Scroll Effect ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ========== Mobile Menu Toggle ==========
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ========== Hero Canvas Particles ==========
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let cw = 0, ch = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    cw = canvas.offsetWidth;
    ch = canvas.offsetHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.scale(dpr, dpr);
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * cw;
      this.y = ch + Math.random() * 100;
      this.size = Math.random() * 2.5 + 0.5;
      this.speed = Math.random() * 0.4 + 0.15;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.wobble = Math.random() * 0.02;
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.y * this.wobble) * 0.3;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 158, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = window.innerWidth < 768 ? 20 : 40;
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, cw, ch);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReduced.matches) {
    resizeCanvas();
    initParticles();
    animate();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    });
  }
}

// ========== Hero Mouse Parallax ==========
const heroVisual = document.getElementById('hero-visual');
const heroSection = document.querySelector('.hero');

if (heroVisual && heroSection && window.innerWidth > 768) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'translate(-50%, -50%)';
    heroVisual.style.transition = 'transform 0.5s ease';
    setTimeout(() => { heroVisual.style.transition = ''; }, 500);
  });
}

// ========== Language Toggle ==========
let currentLang = 'ja';

function setLang(lang) {
  currentLang = lang;

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang') === lang);
  });

  document.getElementById('btn-ja').classList.toggle('active', lang === 'ja');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');

  document.documentElement.lang = lang;
}

// ========== Smooth scroll for nav links (fallback) ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
