// Pages Function — serves the Audience & Performance rollup at the SAME-ORIGIN
// path /data/analytics.json so it stays behind Cloudflare Access (privacy-critical;
// the live data must never be served from an unprotected *.workers.dev host).
//
// Source of truth: the shared CONDITIONS KV namespace, written by the conditions
// Worker's getAnalytics() (daily cron). If KV isn't bound to this Pages project yet,
// or has no value, it falls back to the committed sample seed so the dashboard never
// breaks and simply shows the SAMPLE ribbon (meta.live=false).
//
// One-time setup (David, Cloudflare dashboard):
//   Pages project govallecito-web → Settings → Functions → KV namespace bindings →
//   add binding CONDITIONS = the same namespace the Worker uses
//   (id e98b1300cb02405cb6da4f417c51b80c).
//   Then put /analytics + /data/analytics.json behind Cloudflare Access.
export const onRequestGet = async (context) => {
  const { env, request } = context;
  const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
  try {
    if (env.CONDITIONS) {
      const live = await env.CONDITIONS.get("analytics");
      if (live) return new Response(live, { headers });
    }
  } catch (e) { /* fall through to the bundled sample */ }
  // Fallback: the committed seed shipped with the site (always present).
  const sampleUrl = new URL("/data/analytics.sample.json", request.url);
  const res = await env.ASSETS.fetch(new Request(sampleUrl, { headers: { accept: "application/json" } }));
  return new Response(await res.text(), { headers });
};
