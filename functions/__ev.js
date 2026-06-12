// Pages Function — first-party action counter. The partner-events.js beacon POSTs
// { slug, action } here (same-origin govallecito.com/__ev) whenever a visitor taps a
// partner's call / text / book / website / email button. We increment a per-partner,
// per-action counter in the shared CONDITIONS KV (ev:<slug>:<action>); the Worker's
// daily getAnalytics() reads these into partners[].clicks.
//
// PRIVACY: no cookies, no IPs, no PII — just an integer per (slug, action). It runs
// same-origin because the conditions Worker route isn't attached to the apex.
// If KV isn't bound yet, it accepts and drops the event (the beacon is fire-and-forget).
const ALLOWED = new Set([
  "call", "text", "book", "booking", "website", "site", "email",
  "facebook", "instagram", "directions", "estimate", "profile", "other"
]);
const SLUG_RE = /^[a-z0-9-]{2,40}$/;

export const onRequestPost = async (context) => {
  const { env, request } = context;
  if (!env.CONDITIONS) return new Response(null, { status: 204 }); // KV not bound — accept + drop
  let body;
  try { body = await request.json(); } catch { return new Response(null, { status: 204 }); }
  const slug = String((body && body.slug) || "").toLowerCase();
  let action = String((body && body.action) || "").toLowerCase();
  if (!SLUG_RE.test(slug)) return new Response(null, { status: 204 });
  if (!ALLOWED.has(action)) action = "other";
  const key = "ev:" + slug + ":" + action;
  try {
    const cur = parseInt(await env.CONDITIONS.get(key), 10) || 0;
    await env.CONDITIONS.put(key, String(cur + 1));
  } catch (e) { /* swallow — best-effort */ }
  return new Response(null, { status: 204 });
};
