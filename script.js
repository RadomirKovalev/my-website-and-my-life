'use strict';

// Placeholder for future interactive features
// Example: set current year in footer
document.addEventListener('DOMContentLoaded', function onReady() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Handle contact form submit with real request
  var form = document.querySelector('.contact-form');
  if (form) {
    var statusEl = document.createElement('div');
    statusEl.className = 'form-success';
    statusEl.style.display = 'none';
    statusEl.setAttribute('aria-live', 'polite');
    form.appendChild(statusEl);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Отправка...'; }

      var fd = new FormData(form);
      fetch(form.action, { method: 'POST', body: fd })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && (data.success === true || data.message)) {
            statusEl.textContent = 'Спасибо!\nВаше сообщение отправлено.';
            statusEl.style.display = 'block';
            if (typeof form.reset === 'function') { form.reset(); }
          } else {
            statusEl.textContent = 'Ошибка отправки. Попробуйте позже.';
            statusEl.style.display = 'block';
          }
        })
        .catch(function () {
          statusEl.textContent = 'Ошибка сети. Попробуйте позже.';
          statusEl.style.display = 'block';
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
          window.setTimeout(function () { statusEl.style.display = 'none'; }, 5000);
        });
    });
  }

  // Smooth scroll for nav links with sticky header offset
  var header = document.querySelector('.site-header');
  var headerHeight = header ? header.offsetHeight : 0;
  var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (headerHeight - 1);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Scroll spy: highlight active section in nav
  var sectionIds = ['about','skills','projects','interests','games','twitch','contact'];
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(function (el) { return !!el; });
  var linkById = {};
  navLinks.forEach(function (link) {
    var hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      linkById[hash.slice(1)] = link;
    }
  });

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var link = linkById[id];
        if (!link) return;
        if (entry.isIntersecting) {
          // remove active from others
          Object.keys(linkById).forEach(function (key) { linkById[key].classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, {
      root: null,
      threshold: 0.5,
      rootMargin: '-' + headerHeight + 'px 0px 0px 0px'
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close menu on nav link click (for mobile)
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (siteNav.classList.contains('open')) {
          siteNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});


