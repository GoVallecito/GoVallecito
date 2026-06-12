// First-party partner action tracking — no cookies, no PII, fire-and-forget.
// On a partner profile page, when a visitor taps an action link (call / text / book /
// website / email / social / directions), POST { slug, action } to the same-origin
// /__ev endpoint (a Pages Function) which increments a per-partner KV counter.
// The Worker's daily analytics pull reads those into the dashboard's partner clicks.
(function () {
  // Slug from the URL: /partner-<slug>. Julie's bespoke page maps to her directory slug.
  var slug = null;
  var m = location.pathname.match(/\/partner-([a-z0-9-]+)/i);
  if (m) slug = m[1].toLowerCase();
  else if (/real-estate-partner/.test(location.pathname)) slug = "julie-coffelt";
  if (!slug) return;

  function classify(href) {
    var low = (href || "").trim().toLowerCase();
    if (!low || low.charAt(0) === "#") return null;            // empty / in-page anchor
    if (low.indexOf("tel:") === 0) return "call";
    if (low.indexOf("mailto:") === 0) return "email";
    if (/maps\.google|google\.[a-z.]+\/maps|maps\.app\.goo|[?&]api=1&query=/.test(low)) return "directions";
    if (/facebook\.com|fb\.me|fb\.com/.test(low)) return "facebook";
    if (/instagram\.com/.test(low)) return "instagram";
    if (/fareharbor|newbook|toasttab|order\.|\bbook\b|reserve/.test(low)) return "book";
    if (/^https?:\/\//.test(low)) return /govallecito\.com/.test(low) ? null : "website";
    return null;                                                // internal page link
  }

  function send(action) {
    try {
      var payload = JSON.stringify({ slug: slug, action: action });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/__ev", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/__ev", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(function () {});
      }
    } catch (e) { /* never let tracking break a click */ }
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var action = classify(a.getAttribute("href"));
    if (action) send(action);
  }, true);
})();
