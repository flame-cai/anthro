/**
 * anthro GitHub Pages API v2.1.0
 * 
 * Exposes window.AnthroAPI with methods:
 *   AnthroAPI.ready()     → Promise<void>
 *   AnthroAPI.compute(params) → AnthroResult
 *   AnthroAPI.batch(rows, mode) → AnthroResult[]
 *   AnthroAPI.meta()     → library metadata
 *
 * Also handles fetch-based API calls to ?query=... for external consumers.
 */
(function() {
  'use strict';

  const BASE = document.currentScript
    ? new URL(document.currentScript.src).origin + new URL(document.currentScript.src).pathname.replace(/\/[^/]+$/, '/')
    : './';

  const TABLE_NAMES = ['wfa','lhfa','bmi','acfa','wfl','wfh'];
  let _instance = null;
  let _readyPromise = null;

  async function _load() {
    const day = {}, month = {};
    await Promise.all(TABLE_NAMES.map(async n => {
      const [rd, rm] = await Promise.all([
        fetch(BASE + `data/day_${n}.json`).then(r => r.json()),
        fetch(BASE + `data/month_${n}.json`).then(r => r.json()),
      ]);
      day[n] = rd; month[n] = rm;
    }));
    _instance = anthro.createAnthro(day, month);
    return _instance;
  }

  function ready() {
    if (!_readyPromise) _readyPromise = _load();
    return _readyPromise;
  }

  function compute(params) {
    if (!_instance) throw new Error('AnthroAPI not ready. await AnthroAPI.ready() first.');
    return _instance.compute(params);
  }

  function batch(rows, defaultMode = 'day') {
    if (!_instance) throw new Error('AnthroAPI not ready. await AnthroAPI.ready() first.');
    return _instance.batch(rows, defaultMode);
  }

  function meta() {
    if (!_instance) throw new Error('AnthroAPI not ready.');
    return _instance.meta;
  }

  window.AnthroAPI = { ready, compute, batch, meta };

  // ── URL param handling (for iframe / direct fetch usage) ──────────────────
  // If page loaded with ?q=JSON (base64-encoded), respond via window.anthroResult
  function _handleURLQuery() {
    const sp = new URLSearchParams(window.location.search);
    const q  = sp.get('q');
    if (!q) return;
    ready().then(() => {
      try {
        const params = JSON.parse(atob(q));
        const result = Array.isArray(params)
          ? _instance.batch(params, sp.get('mode') || 'day')
          : _instance.compute(params);
        window.anthroResult = result;
        // Post to parent if in iframe
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'anthro_result', result }, '*');
        }
        // Also set meta tag for scraping
        const m = document.createElement('meta');
        m.name = 'anthro-result';
        m.content = JSON.stringify(result);
        document.head.appendChild(m);
      } catch(e) {
        window.anthroError = e.message;
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'anthro_error', error: e.message }, '*');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _handleURLQuery);
  } else {
    _handleURLQuery();
  }
})();
