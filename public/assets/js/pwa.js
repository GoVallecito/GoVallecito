/* Registers the GoVallecito service worker (see /service-worker.js).
   Fail-soft: any error is swallowed so it can never break the page. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function () { /* ignore */ });
  });
})();

// One-tap native directions (Apple Maps app on iPhone; web map elsewhere).
// Keep exactly the maps.apple.com/?daddr=lat,lng form; Maps uses current location.
window.gvDirections = function (lat, lng) {
  return 'https://maps.apple.com/?daddr=' + lat + ',' + lng + '&dirflg=d';
};

// Native share sheet on iOS; clipboard copy fallback elsewhere.
document.addEventListener('click', function (e) {
  var t = e.target && e.target.closest && e.target.closest('[data-share-url]'); if (!t) return;
  e.preventDefault();
  var data = { title: t.getAttribute('data-share-title') || document.title,
               text: t.getAttribute('data-share-text') || '',
               url: t.getAttribute('data-share-url') };
  if (navigator.share) { navigator.share(data).catch(function () {}); }
  else if (navigator.clipboard) {
    navigator.clipboard.writeText(data.url).then(function () {
      t.setAttribute('data-shared', '1');
      setTimeout(function () { t.removeAttribute('data-shared'); }, 1500);
    });
  }
});
