document.getElementById('year').textContent = new Date().getFullYear();
// ── Theme toggle ──────────────────────────────────────────────────────────
(function () {
  // Initialise on first paint: respect saved preference, then system pref
  const saved = localStorage.getItem('theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

// ── Scroll reveal with stagger ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll(':scope > .reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.08}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Step number pop ──
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.step-num').forEach((n, i) => {
        setTimeout(() => n.classList.add('visible'), i * 200);
      });
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
const stepsContainer = document.getElementById('steps-container');
if (stepsContainer) stepObserver.observe(stepsContainer);

// ── Privacy table row stagger ──
const privacyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.privacy-row').forEach((row, i) => {
        setTimeout(() => row.classList.add('visible'), i * 100);
      });
      privacyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const privacyTerminal = document.getElementById('privacy-terminal');
if (privacyTerminal) privacyObserver.observe(privacyTerminal);

// ── Hero word-mask reveal ──
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setTimeout(() => {
    document.querySelectorAll('.word').forEach(w => w.classList.add('in'));
  }, 120);
} else {
  document.querySelectorAll('.word').forEach(w => w.classList.add('in'));
}

// ── Feature card micro-animation triggers ──
const featAnimObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    // Workflow chips
    card.querySelectorAll('.feat-chip').forEach(el => el.classList.add('chip-play'));
    // Connected badge
    card.querySelectorAll('.connected-badge').forEach(el => el.classList.add('badge-play'));
    // Token stream lines
    card.querySelectorAll('.token-line').forEach(el => el.classList.add('chip-play'));
    featAnimObs.unobserve(card);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.feat-card').forEach(c => featAnimObs.observe(c));

// ── Feature card spotlight + 3D tilt ──
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    // 3D tilt: max ±6deg
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -5;
    const ry = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Terminal typing animation ──
const terminalLines = [
  { type: 'cmd',   text: '$ <span class="tc-accent">connect</span> <span class="tc-secondary">https://research.example.com</span>' },
  { type: 'info',  text: '<span class="tc-accent">&#10003;</span> Agent Card discovered at /.well-known/agent.json' },
  { type: 'info',  text: '<span class="tc-accent">&#10003;</span> Capabilities: streaming, multimodal, push-notifications' },
  { type: 'info',  text: '<span class="tc-accent">&#10003;</span> Session established <span class="tc-muted">(anonymous, on-device)</span>' },
  { type: 'sep',   text: '' },
  { type: 'user',  text: '<span class="tc-accent">you</span>  Summarize the latest A2A protocol spec changes' },
  { type: 'agent', text: '<span class="tc-muted">agent</span> ', words: 'The March revision added three changes: streaming task updates via SSE, a new parts array for multi-modal responses, and push notification support for long-running tasks.' },
];

const termBody = document.getElementById('terminal-body');
const terminal = document.getElementById('terminal');
let termStarted = false;

function createLine(line) {
  const div = document.createElement('div');
  div.className = 'term-line';
  if (line.type === 'cmd' || line.type === 'user') {
    div.className += ' flex items-start gap-3';
    div.innerHTML = line.text;
  } else if (line.type === 'info') {
    div.className += ' pl-6 tc-muted text-xs font-mono';
    div.innerHTML = line.text;
  } else if (line.type === 'sep') {
    div.className = 'term-line glow-line my-4';
  } else if (line.type === 'agent') {
    div.className += ' flex items-start gap-3';
    div.innerHTML = line.text;
    const span = document.createElement('span');
    span.className = 'tc-secondary leading-relaxed';
    span.id = 'agent-response';
    div.appendChild(span);
  }
  return div;
}

async function typeTerminal() {
  for (let i = 0; i < terminalLines.length; i++) {
    const line = terminalLines[i];
    const el = createLine(line);
    termBody.appendChild(el);
    await new Promise(r => setTimeout(r, 80));
    el.classList.add('typed');

    if (line.type === 'agent') {
      const responseEl = el.querySelector('#agent-response');
      const words = line.words.split(' ');
      for (let w = 0; w < words.length; w++) {
        await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
        responseEl.textContent += (w > 0 ? ' ' : '') + words[w];
      }
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink tc-accent ml-1';
      cursor.textContent = '|';
      responseEl.appendChild(cursor);
      terminal.classList.add('active-glow');
    } else {
      await new Promise(r => setTimeout(r, line.type === 'sep' ? 300 : 150));
    }
  }
}

const termObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !termStarted) {
      termStarted = true;
      setTimeout(typeTerminal, 900);
      termObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const termWrap = document.getElementById('terminal-wrap');
if (termWrap) termObserver.observe(termWrap);

// ── Subtle parallax on dot grid ──
const heroGrid = document.getElementById('hero-grid');
if (heroGrid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    heroGrid.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}
