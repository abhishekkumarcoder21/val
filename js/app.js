/* ============================================
   Valentine Wrapped 2026 — App Core
   ============================================ */

// ============================================
// Particles System
// ============================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const emojis = ['💕', '❤️', '✨', '💖', '🌹', '💗', '💘', '🫶', '💝'];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (12 + Math.random() * 16) + 'px';
    particle.style.animationDuration = (8 + Math.random() * 12) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';

    container.appendChild(particle);
  }
}

// ============================================
// Countdown Timer
// ============================================
function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');

  if (!daysEl) return;

  const targetDate = new Date('2026-02-14T23:59:59+05:30');

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minsEl.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minsEl.textContent = mins;
  }

  update();
  setInterval(update, 60000);
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up:not(.hero .fade-in-up)');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    elements.forEach(el => el.classList.add('visible'));
  }
}

// ============================================
// Social Proof Counter Animation
// ============================================
function animateCounter() {
  const countEl = document.getElementById('couple-count');
  const finalCountEl = document.getElementById('final-count');
  if (!countEl) return;

  const baseCount = 12450;
  // Add small random increment to make it feel real
  const randomExtra = Math.floor(Math.random() * 200);
  const finalCount = baseCount + randomExtra;

  function formatNumber(n) {
    return n.toLocaleString('en-IN');
  }

  // Animate from 0 to final count
  let current = 0;
  const duration = 2000;
  const steps = 60;
  const increment = finalCount / steps;
  const interval = duration / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= finalCount) {
      current = finalCount;
      clearInterval(timer);
    }
    const display = formatNumber(Math.floor(current));
    countEl.textContent = display;
    if (finalCountEl) finalCountEl.textContent = display;
  }, interval);
}

// ============================================
// Utility: Save & Load Data (localStorage)
// ============================================
const ValStorage = {
  KEY: 'valentine_wrapped_2026',

  save(data) {
    try {
      const existing = this.load() || {};
      const merged = { ...existing, ...data };
      localStorage.setItem(this.KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};

// ============================================
// Utility: Calculate Relationship Stats
// ============================================
function calculateStats(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diffMs = now - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = diffDays * 24;
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);

  return {
    days: diffDays,
    hours: diffHours,
    months: diffMonths,
    years: diffYears,
    sunsets: diffDays,
    heartbeats: diffHours * 4200, // ~70/min * 60mins
  };
}

// ============================================
// Couple Vibe Descriptions
// ============================================
const VIBE_DESCRIPTIONS = {
  'adventurous': {
    title: 'The Adventurous Duo 🌍',
    desc: 'You two are always chasing the next thrill. From spontaneous road trips to midnight adventures — boredom doesn\'t exist in your world.',
    emoji: '🌍',
    color: '#36d1c4'
  },
  'cozy': {
    title: 'The Cozy Soulmates 🛋️',
    desc: 'Netflix, warm blankets, and each other — that\'s your idea of a perfect day. Your love language is comfort, and you speak it fluently.',
    emoji: '🛋️',
    color: '#ff9ecd'
  },
  'chaotic': {
    title: 'The Beautiful Chaos 🎪',
    desc: 'Loud laughter, silly fights, and making up 5 minutes later. Your love story is a Bollywood movie — dramatic, intense, and unforgettable.',
    emoji: '🎪',
    color: '#f5c542'
  },
  'classic': {
    title: 'The Timeless Romance 🌹',
    desc: 'Handwritten letters, meaningful glances, and deep conversations. Your love is the kind that poets write about.',
    emoji: '🌹',
    color: '#e8436a'
  },
  'longdistance': {
    title: 'The Distance Warriors 📱',
    desc: 'Time zones, video calls, and counting days. Your love proves that distance is just a number when the heart knows where it belongs.',
    emoji: '📱',
    color: '#6b5ce7'
  }
};

// ============================================
// Love Letter Templates
// ============================================
function generateLoveLetter(name1, name2, specialTrait) {
  const traitMessages = {
    'humor': `${name2}, your laughter is my favorite sound in the universe. Every joke, every giggle — you turn ordinary moments into memories I'll treasure forever.`,
    'care': `${name2}, the way you care about the little things makes all the big things feel effortless. You are my safe place in this chaotic world.`,
    'eyes': `${name2}, I could write a thousand love songs, but none would capture what I feel when I look into your eyes. You are my favorite view.`,
    'voice': `${name2}, your voice is the melody my heart hums to every single day. In silence and in noise, it's your voice I always search for.`,
    'everything': `${name2}, there aren't enough words in any language to describe what you mean to me. You're not just my love — you're my everything, my always.`
  };

  return {
    letter: traitMessages[specialTrait] || traitMessages['everything'],
    from: name1,
    to: name2
  };
}

// ============================================
// Memory Descriptions
// ============================================
const MEMORY_DESCRIPTIONS = {
  'firstdate': 'First Date 🥰',
  'trip': 'Our First Trip 🛫',
  'latenight': 'Late Night Talks 🌙',
  'festival': 'Festival Together 🎉',
  'surprise': 'The Surprise 🎁'
};

// ============================================
// Init on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCountdown();
  initScrollAnimations();

  // Animate counter only on landing page
  if (document.getElementById('couple-count')) {
    setTimeout(animateCounter, 800);
  }
});
