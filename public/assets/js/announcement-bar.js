/* ==========================================================================
   GoVallecito.com — dismissible announcement bar
   Scrolling marquee with a close button; remembers dismissal for 7 days.

   EDITORS: change the message by editing the ANNOUNCEMENT object below.
   No markup edits needed. Set `enabled: false` to hide the bar entirely.
   The bar can be reused for any announcement (fire restrictions, events) —
   just swap the text/link.

   Expects in the page:  <div class="annbar" id="annbar" hidden></div>
   ========================================================================== */
(function () {
  'use strict';

  // ----- editor-configurable content -------------------------------------
  var ANNOUNCEMENT = {
    enabled: true,
    // Whole-bar message — the ENTIRE bar links to linkHref. Keep it short.
    text: '🏡 Dreaming of a place at the lake? Meet Julie Coffelt — your local Vallecito real-estate broker →',
    linkHref: '/real-estate-partner.html',
    // Bump this id whenever you want a *new* message to re-show for everyone
    // who previously dismissed the old one.
    id: 'realtor-julie-2026-3'
  };

  var DISMISS_DAYS = 7;
  var MS = DISMISS_DAYS * 24 * 60 * 60 * 1000; // 7 days
  var KEY = 'gv_ann_dismissed';

  var bar = document.getElementById('annbar');
  if (!bar || !ANNOUNCEMENT.enabled) {
    if (bar) bar.hidden = true;
    return;
  }

  // If the *current* announcement was dismissed within the window, stay hidden.
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      if (saved && saved.id === ANNOUNCEMENT.id && (Date.now() - saved.t) < MS) {
        bar.hidden = true;
        return;
      }
    }
  } catch (e) { /* localStorage unavailable — just show the bar */ }

  // Build the bar: the WHOLE message is one link; the ✕ is a separate button.
  var wrap = document.createElement('div');
  wrap.className = 'wrap';

  var link = document.createElement('a');
  link.className = 'annlink';
  link.href = ANNOUNCEMENT.linkHref;

  var marq = document.createElement('div');
  marq.className = 'marq';
  var span = document.createElement('span');
  span.textContent = ANNOUNCEMENT.text;
  marq.appendChild(span);
  link.appendChild(marq);

  var close = document.createElement('button');
  close.className = 'x';
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss announcement');
  close.textContent = '✕';

  wrap.appendChild(link);
  wrap.appendChild(close);
  bar.appendChild(wrap);
  bar.hidden = false;

  // Ease the scroll: only animate if the text actually overflows its container.
  if (span.scrollWidth > marq.clientWidth + 4) marq.classList.add('scrolling');

  close.addEventListener('click', function () {
    bar.hidden = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ id: ANNOUNCEMENT.id, t: Date.now() }));
    } catch (e) { /* ignore */ }
  });
})();
