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
    // Lead text shown before the link (plain text; emoji ok).
    text: 'Dreaming of a place in the mountains? Julie Coffelt — local broker with Coldwell Banker Mountain Properties — knows every road and ridge up here.',
    // Optional small avatar shown at the start of the bar (empty string = none).
    image: '',
    // Call-to-action link.
    linkText: 'See what’s for sale →',
    linkHref: '/real-estate-partner.html',
    // Bump this id whenever you want a *new* message to re-show for everyone
    // who previously dismissed the old one.
    id: 'realtor-julie-2026-2'
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

  // Build the bar contents from config (no markup to maintain in HTML).
  var wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (ANNOUNCEMENT.image) {
    var avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = ANNOUNCEMENT.image;
    avatar.alt = '';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.setAttribute('loading', 'lazy');
    wrap.appendChild(avatar);
  }

  var marq = document.createElement('div');
  marq.className = 'marq';
  var span = document.createElement('span');
  span.appendChild(document.createTextNode(ANNOUNCEMENT.text + ' '));
  var link = document.createElement('a');
  link.href = ANNOUNCEMENT.linkHref;
  link.textContent = ANNOUNCEMENT.linkText;
  span.appendChild(link);
  marq.appendChild(span);

  var close = document.createElement('button');
  close.className = 'x';
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss announcement');
  close.textContent = '✕';

  wrap.appendChild(marq);
  wrap.appendChild(close);
  bar.appendChild(wrap);
  bar.hidden = false;

  close.addEventListener('click', function () {
    bar.hidden = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ id: ANNOUNCEMENT.id, t: Date.now() }));
    } catch (e) { /* ignore */ }
  });
})();
