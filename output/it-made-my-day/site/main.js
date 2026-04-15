// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal fallback — force-show any elements still hidden after 1.5 s
// (guards against Rocket Loader timing issues or IntersectionObserver edge cases)
setTimeout(function () {
  document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-pop:not(.visible), .reveal-scale:not(.visible), .reveal-bounce:not(.visible)').forEach(function (el) {
    el.classList.add('visible');
  });
}, 1500);

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', function() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('immd-theme', next);
});

// IntersectionObserver for reveal animations
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-pop, .reveal-scale, .reveal-bounce').forEach(function (el) {
    observer.observe(el);
  });
})();

// Cycling headline word
(function() {
  var words = ["your worst Monday","that 2am moment","a heartbreak","a rejection","the hardest night","a moment of doubt"];
  var i = 0;
  var el = document.getElementById('cycleWord');
  if (!el) return;
  setInterval(function() {
    el.classList.add('fade-out');
    setTimeout(function() {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('fade-out');
    }, 400);
  }, 2500);
})();

// Feature spotlight auto-advance
(function () {
  var tabs = document.querySelectorAll('.fs-tab');
  var panels = document.querySelectorAll('.fs-panel');
  if (!tabs.length) return;
  var current = 0;
  var interval;
  var DURATION = 4500;

  function activate(idx) {
    tabs.forEach(function (t, i) {
      var isActive = i === idx;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      var bar = t.querySelector('.fs-progress-bar');
      if (bar) {
        bar.style.animation = 'none';
        bar.offsetHeight; // reflow
        bar.style.animation = '';
      }
    });
    panels.forEach(function (p, i) {
      p.classList.toggle('active', i === idx);
    });
    current = idx;
    // On mobile the nav scrolls horizontally — center the active tab.
    // scrollIntoView is unreliable in Android Chrome; directly set scrollLeft instead.
    var nav = tabs[idx].parentElement;
    if (nav && nav.scrollWidth > nav.clientWidth) {
      var offsetLeft = 0;
      for (var i = 0; i < idx; i++) { offsetLeft += tabs[i].offsetWidth; }
      var target = offsetLeft - (nav.clientWidth / 2) + (tabs[idx].offsetWidth / 2);
      nav.scrollLeft = Math.max(0, target);
    }
  }

  function startAuto() {
    clearInterval(interval);
    interval = setInterval(function () {
      activate((current + 1) % tabs.length);
    }, DURATION);
  }

  tabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      activate(idx);
      startAuto();
    });
  });

  startAuto();
})();

// Stories slow auto-scroll
(function () {
  var grid = document.getElementById('storiesGrid');
  if (!grid) return;
  var paused = false;
  var speed = 0.5;

  // Pause on hover (desktop)
  grid.addEventListener('mouseenter', function () { paused = true; });
  grid.addEventListener('mouseleave', function () { paused = false; });

  // Touch: pause auto-scroll and let the browser handle native scroll
  grid.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  grid.addEventListener('touchend', function () {
    setTimeout(function () { paused = false; }, 3000);
  });

  // Mouse drag (desktop only)
  var isDragging = false, startX, startScrollLeft;
  grid.addEventListener('mousedown', function (e) {
    isDragging = true; paused = true;
    startX = e.pageX - grid.offsetLeft;
    startScrollLeft = grid.scrollLeft;
    grid.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    grid.style.cursor = 'grab';
    setTimeout(function () { paused = false; }, 1500);
  });
  grid.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    grid.scrollLeft = startScrollLeft - (e.pageX - grid.offsetLeft - startX);
  });

  var btnLeft  = document.getElementById('storiesLeft');
  var btnRight = document.getElementById('storiesRight');

  function updateArrows() {
    if (!btnLeft || !btnRight) return;
    btnLeft.classList.toggle('hidden', grid.scrollLeft <= 4);
    btnRight.classList.toggle('hidden', grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 4);
  }

  if (btnLeft) {
    btnLeft.addEventListener('click', function () {
      paused = true;
      grid.scrollTo({ left: Math.max(0, grid.scrollLeft - 300), behavior: 'smooth' });
      setTimeout(function () { updateArrows(); paused = false; }, 600);
    });
  }
  if (btnRight) {
    btnRight.addEventListener('click', function () {
      paused = true;
      grid.scrollTo({ left: grid.scrollLeft + 300, behavior: 'smooth' });
      setTimeout(function () { updateArrows(); paused = false; }, 600);
    });
  }

  grid.addEventListener('scroll', updateArrows);
  updateArrows();

  function tick() {
    if (!paused) {
      if (grid.scrollLeft < grid.scrollWidth - grid.clientWidth - 1) {
        grid.scrollLeft += speed;
        updateArrows();
      } else {
        paused = true; // reached the end — stop, let user scroll back
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// Privacy stat count-down animation
(function () {
  var statEl = document.getElementById('privacyStat');
  if (!statEl) return;
  var triggered = false;
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      observer.disconnect();
      var start = 2847;
      var duration = 1800;
      var startTime = null;
      function ease(t) { return 1 - Math.pow(1 - t, 3); }
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.round(start * (1 - ease(progress)));
        statEl.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          statEl.textContent = '0';
          statEl.setAttribute('aria-label', 'Zero');
        }
      }
      requestAnimationFrame(step);
    }
  }, { threshold: 0.5 });
  observer.observe(statEl);
})();

// FAQ accordion
(function () {
  var questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answerId = btn.getAttribute('aria-controls');
      var answerWrap = document.getElementById(answerId);

      questions.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var otherId = other.getAttribute('aria-controls');
          var otherWrap = document.getElementById(otherId);
          if (otherWrap) otherWrap.classList.remove('open');
        }
      });

      var newExpanded = !expanded;
      btn.setAttribute('aria-expanded', String(newExpanded));
      if (answerWrap) {
        if (newExpanded) {
          answerWrap.classList.add('open');
        } else {
          answerWrap.classList.remove('open');
        }
      }
    });
  });
})();
