/* ==========================================================================
   GoVallecito.com — site navigation
   Grouped-dropdown top nav: opens on hover (CSS) AND click/tap (here),
   keyboard-operable, closes on Esc / outside-click. Mobile: hamburger toggles
   a full-screen menu whose groups are tap-to-expand accordions.
   Shared on every page (replaces the old announcement-bar.js).
   ========================================================================== */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  if (!header) return;
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var groups = [].slice.call(header.querySelectorAll('.navgroup'));

  function closeGroups(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      g.classList.remove('open');
      var b = g.querySelector('.navgroup-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  function closeMobile() {
    if (!nav) return;
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }
  }

  // ----- mobile hamburger -----
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
      if (!open) closeGroups();
    });
  }

  // ----- group dropdowns: click/tap to toggle (hover handled by CSS) -----
  groups.forEach(function (g) {
    var btn = g.querySelector('.navgroup-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !g.classList.contains('open');
      closeGroups(g);
      g.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  // ----- close on outside click -----
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) closeGroups();
  });

  // ----- Esc closes open menus -----
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeGroups();
      if (nav && nav.classList.contains('open')) {
        closeMobile();
        if (toggle) toggle.focus();
      }
    }
  });

  // ----- tidy up when crossing the mobile/desktop breakpoint -----
  var mq = window.matchMedia('(max-width:820px)');
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
    closeGroups();
    closeMobile();
  });
})();

/* ----- Back-to-top button (site-wide; appears after ~1 viewport of scroll) ----- */
(function () {
  if (!document.body) return;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'backtop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<span aria-hidden="true">↑</span>';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', function () {
    try { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
    catch (e) { window.scrollTo(0, 0); }
    var brand = document.querySelector('.brand');           // return focus to the top for keyboard users
    if (brand && brand.focus) brand.focus();
  });
  var ticking = false;
  function update() {
    ticking = false;
    if (window.pageYOffset > window.innerHeight) btn.classList.add('show');
    else btn.classList.remove('show');
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  document.body.appendChild(btn);
  update();
})();
