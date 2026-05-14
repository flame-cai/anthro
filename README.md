# anthro

WHO 2006 Child Growth Standards — z-scores and nutritional classifications for 6 indicators.

**Website:** https://flame-cai.github.io/anthro  
**Version:** 1.0.1

Available for **JavaScript / Node.js** (`@flame-cai/anthro` on npm) and **Python** (`anthro` on PyPI).

---

## JavaScript

### Install

```bash
npm install @flame-cai/anthro
```

Or clone and use directly:

```bash
git clone https://github.com/flame-cai/anthro.git
```

### Quick start

```js
const { createAnthro } = require('@flame-cai/anthro')
const fs = require('fs')

const names = ['wfa', 'lhfa', 'bmi', 'acfa', 'wfl', 'wfh']
const load  = (p, n) => JSON.parse(fs.readFileSync(require.resolve(`@flame-cai/anthro/data/${p}_${n}.json`)))

const anthro = createAnthro(
  Object.fromEntries(names.map(n => [n, load('day',   n)])),
  Object.fromEntries(names.map(n => [n, load('month', n)]))
)

const result = anthro.compute({
  mode:      'day',
  sex:       'female',
  dob:       '2024-01-15',
  weight_kg: 7.0,
  height_cm: 64.0,
  muac_mm:   136,
})

result.lhfa            // 'Moderately stunted'
result.z_lhfa          // -2.7901
result.wfa             // 'Normal'
result.muac_threshold  // 'Normal'
result.bmi_val         // 17.0898
```

Full documentation: https://flame-cai.github.io/anthro/#/docs

---

## Python

### Install

```bash
pip install anthro
```

### Quick start

```python
from anthro import compute, batch

result = compute({
    'sex':       'female',
    'dob':       '2024-01-15',
    'measured':  '2025-01-15',
    'weight_kg': 7.0,
    'height_cm': 64.0,
    'muac_mm':   136,
})

result['lhfa']            # 'Moderately stunted'
result['z_lhfa']          # -2.7901
result['wfa']             # 'Normal'
result['muac_threshold']  # 'Normal'
result['bmi_val']         # 17.0898

# Batch
results = batch([
    {'sex': 'm', 'age_days': 200, 'weight_kg': 6.8, 'height_cm': 63.0},
    {'sex': 'f', 'age_days': 400, 'weight_kg': 8.2, 'height_cm': 75.0},
])
```

See [`python/README.md`](python/README.md) for full Python API reference.

---

## Output indicators

| Field | Description |
|-------|-------------|
| `muac_threshold` | Absolute MUAC (age-independent): SAM / MAM / Normal |
| `acfa` | MUAC-for-age z-score (3–60 m) |
| `bmi`  | BMI-for-age z-score (0–60 m) |
| `lhfa` | Length/height-for-age — stunting (0–60 m) |
| `wfa`  | Weight-for-age — underweight (0–60 m) |
| `wflh` | Weight-for-length/height — wasting (0–60 m) |

Missing inputs return a descriptive string, not `null` / `None`.

## Tables

`data/day_*.json` — WHO igrowup day-indexed (1 row/day, 0–1826 d). Preferred when DOB is known.  
`data/month_*.json` — WHO supplementary monthly (1 row/month, 0–60 m).

Shared between the JS and Python packages — no duplication.

Source: WHO MGRS (2006). ISBN 924154693X.

## Versioning

The single source of truth is [`VERSION`](VERSION). Both packages read from it:

- **npm** — `package.json` version is synced by CI before publish (`npm run sync-version`)
- **PyPI** — `pyproject.toml` uses `[tool.hatch.version]` pointing at `VERSION`
- **JS source** — `src/anthro.js` version string is updated by CI before publish

To cut a release: update `VERSION`, commit, push `git tag vX.Y.Z && git push origin vX.Y.Z`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
