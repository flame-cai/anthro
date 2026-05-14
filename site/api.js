(function () {
  'use strict';

  const BASE = (function () {
    const s = document.currentScript;
    if (s) {
      const u = new URL(s.src);
      return u.origin + u.pathname.replace(/\/[^/]+$/, '/');
    }
    return './';
  })();

  const NAMES = ['wfa', 'lhfa', 'bmi', 'acfa', 'wfl', 'wfh'];
  let _inst = null;
  let _ready = null;

  function ready() {
    if (!_ready) {
      _ready = (async () => {
        const day = {}, month = {};
        await Promise.all(NAMES.map(async n => {
          const [d, m] = await Promise.all([
            fetch(BASE + 'data/day_'   + n + '.json').then(r => r.json()),
            fetch(BASE + 'data/month_' + n + '.json').then(r => r.json()),
          ]);
          day[n] = d;
          month[n] = m;
        }));
        _inst = anthro.createAnthro(day, month);
      })();
    }
    return _ready;
  }

  window.AnthroAPI = {
    ready,
    compute: (p) => { if (!_inst) throw new Error('call AnthroAPI.ready() first'); return _inst.compute(p); },
    batch:   (r) => { if (!_inst) throw new Error('call AnthroAPI.ready() first'); return _inst.batch(r); },
    meta:    ()  => { if (!_inst) throw new Error('call AnthroAPI.ready() first'); return _inst.meta; },
  };
})();
