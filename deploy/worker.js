/**
 * Cloudflare Worker — anthro REST API
 * Deploy free at: https://workers.cloudflare.com
 * 100,000 requests/day free.
 *
 * Routes:
 *   POST /compute   → single child
 *   POST /batch     → array of children
 *   GET  /health    → status check
 *   GET  /          → API info
 */

// GitHub Pages base URL (update after deploying)
const PAGES_BASE = 'https://flame-cai.github.io/anthro';
const TABLE_NAMES = ['wfa','lhfa','bmi','acfa','wfl','wfh'];

// ── Table caching (per isolate lifetime, ~30s–30min) ─────────────────────────
let _dayTables   = null;
let _monthTables = null;
let _anthro      = null;

async function loadTables(env) {
  if (_anthro) return _anthro;

  // Load from GitHub Pages (cached by CDN)
  const [day, month] = await Promise.all([
    loadSet('day', env),
    loadSet('month', env),
  ]);

  // Inline the anthro library (bundled as a string in the worker)
  // In production: use wrangler bundle or import the module
  // For simplicity, we import from a public CDN:
  const { createAnthro } = await import(`${PAGES_BASE}/anthro.bundle.js`)
    .catch(() => globalThis.anthro || {});

  _anthro = createAnthro ? createAnthro(day, month) : null;
  if (!_anthro) throw new Error('Failed to load anthro library');
  return _anthro;
}

async function loadSet(prefix, env) {
  const result = {};
  await Promise.all(TABLE_NAMES.map(async n => {
    const url = `${PAGES_BASE}/data/${prefix}_${n}.json`;
    // Try KV cache first (if configured)
    let data;
    if (env.ANTHRO_CACHE) {
      const cached = await env.ANTHRO_CACHE.get(`${prefix}_${n}`, 'json');
      if (cached) { result[n] = cached; return; }
    }
    const r = await fetch(url, { cf: { cacheTtl: 86400 } }); // cache 24h at CDN
    data = await r.json();
    result[n] = data;
    if (env.ANTHRO_CACHE) {
      await env.ANTHRO_CACHE.put(`${prefix}_${n}`, JSON.stringify(data), { expirationTtl: 86400 });
    }
  }));
  return result;
}

// ── Request handler ───────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url     = new URL(request.url);
    const method  = request.method;

    // CORS
    const headers = {
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type',
    };

    if (method === 'OPTIONS') return new Response(null, { headers });

    // Health
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', version: '2.1.0' }), { headers });
    }

    // Info
    if (url.pathname === '/' && method === 'GET') {
      return new Response(JSON.stringify({
        name: 'anthro API',
        version: '2.1.0',
        routes: {
          'POST /compute': 'Single child. Body: AnthroInput',
          'POST /batch':   'Array of children. Body: AnthroInput[]',
          'GET  /health':  'Health check',
        },
        modes: ['day', 'month'],
        source: PAGES_BASE,
      }, null, 2), { headers });
    }

    // Compute
    if (url.pathname === '/compute' && method === 'POST') {
      try {
        const a = await loadTables(env);
        const body = await request.json();
        const result = a.compute(body);
        return new Response(JSON.stringify(result), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers });
      }
    }

    // Batch
    if (url.pathname === '/batch' && method === 'POST') {
      try {
        const a = await loadTables(env);
        const body = await request.json();
        if (!Array.isArray(body)) throw new Error('Body must be an array');
        if (body.length > 500) throw new Error('Max 500 rows per batch request');
        const result = a.batch(body);
        return new Response(JSON.stringify(result), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  }
};
