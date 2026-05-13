# anthro

WHO 2006 Child Growth Standards — z-scores and nutritional status for 6 indicators.

**Live:** https://flame-cai.github.io/anthro

```
version: 1.0.0
tables:  WHO igrowup day-indexed (0–1826 d) + WHO monthly (0–60 m)
tests:   33 / 33 pass, verified against R anthro v1.1.0
```

## Install

```bash
npm install @flame-cai/anthro
```

Or clone and use directly (works in Node.js, React Native, any bundler):

```bash
git clone https://github.com/flame-cai/anthro.git
```

## Quick start

```js
const { createAnthro } = require('@flame-cai/anthro')        // npm
// or:
const { createAnthro } = require('./anthro/src/anthro.js')   // cloned

const load = (p, n) => require(`./data/${p}_${n}.json`)      // or fs.readFileSync
const names = ['wfa','lhfa','bmi','acfa','wfl','wfh']
const anthro = createAnthro(
  Object.fromEntries(names.map(n => [n, load('day',   n)])),
  Object.fromEntries(names.map(n => [n, load('month', n)]))
)

const result = anthro.compute({
  mode:      'day',         // 'day' | 'month'
  sex:       'female',
  dob:       '2024-01-15',  // date of birth — most accurate
  weight_kg: 7.0,
  height_cm: 64.0,
  muac_mm:   136,
})

result.lhfa            // 'Moderately stunted'
result.z_lhfa          // -2.7901
result.muac_threshold  // 'Normal'
result.wfa             // 'Normal'
```

Full documentation: https://flame-cai.github.io/anthro/#/docs

## Indicators

| Field | Description |
|-------|-------------|
| `muac_threshold` | Absolute MUAC (age-independent): SAM / MAM / Normal |
| `acfa` | MUAC-for-age z-score (3–60 m) |
| `bmi` | BMI-for-age z-score (0–60 m) |
| `lhfa` | Length/height-for-age — stunting (0–60 m) |
| `wfa` | Weight-for-age — underweight (0–60 m) |
| `wflh` | Weight-for-length/height — wasting (0–60 m) |

Missing inputs return a descriptive string, not null.

## Data

`data/day_*.json` — WHO igrowup day-indexed LMS tables (1 row/day, 0–1826 d).  
`data/month_*.json` — WHO monthly LMS tables (1 row/month, 0–60 m).

Source: WHO MGRS (2006). ISBN 924154693X. https://www.who.int/publications/i/item/924154693X

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
