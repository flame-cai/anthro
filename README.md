# anthro

**WHO Child Growth Standards for Python & JavaScript**

An independent, open-source implementation of the **WHO Child Growth Standards** methodology, providing z-scores and nutritional classifications for six anthropometric indicators through Python and JavaScript/Node.js.

> **Important:** `anthro` is an independent implementation and is **not an official WHO software package**. It has not been reviewed, verified, certified, or endorsed by WHO. For authoritative WHO methodology and software, please refer to the [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards).

**Project:** [github.com/flame-cai/anthro](https://github.com/flame-cai/anthro)
**Website:** [flame-cai.github.io/anthro](https://flame-cai.github.io/anthro)
**Version:** 1.1.1

[![npm](https://img.shields.io/npm/v/@flame-cai/anthro?logo=npm)](https://www.npmjs.com/package/@flame-cai/anthro)
[![PyPI](https://img.shields.io/pypi/v/anthro?logo=pypi)](https://pypi.org/project/anthro/)
[![GitHub](https://img.shields.io/badge/GitHub-flame--cai%2Fanthro-black?logo=github)](https://github.com/flame-cai/anthro)

## About

WHO provides the official Child Growth Standards and programmatic implementations including the `anthro` R package. This project was created to make the methodology accessible directly from **Python and JavaScript**, which are widely used for data science, research, web applications, and software development.

The project maintains shared reference data and implementations across both languages, with automated testing, batch processing, documentation, and CI/CD-based package and website deployment.

### WHO resources

* [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards)
* [WHO Child Growth Standards — Software](https://www.who.int/tools/child-growth-standards/software)
* [WHO `anthro` R package](https://github.com/WorldHealthOrganization/anthro)
* [WHO Open Source Communication Channel](https://github.com/WorldHealthOrganization/open-source-communication-channel)

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
