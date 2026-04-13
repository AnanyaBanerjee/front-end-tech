// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', function() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('immd-theme', next);
});

// Email protection
document.querySelectorAll('.email-protect').forEach(function (el) {
  el.textContent = el.dataset.user + '@' + el.dataset.domain;
});

// Reveal animations
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
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
          var otherWrap = document.getElementById(other.getAttribute('aria-controls'));
          if (otherWrap) otherWrap.classList.remove('open');
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answerWrap) answerWrap.classList.toggle('open', !expanded);
    });
  });
})();
