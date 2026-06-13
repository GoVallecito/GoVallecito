/* Registers the GoVallecito service worker (see /service-worker.js).
   Fail-soft: any error is swallowed so it can never break the page. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function () { /* ignore */ });
  });
})();
