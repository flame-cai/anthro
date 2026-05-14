# anthro

WHO 2006 Child Growth Standards — z-scores and nutritional classifications for 6 indicators.

**Website:** https://flame-cai.github.io/anthro  
**Version:** 1.0.0

## Install

```bash
npm install @flame-cai/anthro
```

Or clone and use directly:

```bash
git clone https://github.com/flame-cai/anthro.git
```

## Quick start

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
  mode:      'day',          // 'day' (default) | 'month'
  sex:       'female',       // 'male'|'female'|'m'|'f'|'M'|'F'|1|2
  dob:       '2024-01-15',   // date of birth (ISO 8601) — most accurate
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

## Output indicators

| Field | Description |
|-------|-------------|
| `muac_threshold` | Absolute MUAC (age-independent): SAM / MAM / Normal |
| `acfa` | MUAC-for-age z-score (3–60 m) |
| `bmi`  | BMI-for-age z-score (0–60 m) |
| `lhfa` | Length/height-for-age — stunting (0–60 m) |
| `wfa`  | Weight-for-age — underweight (0–60 m) |
| `wflh` | Weight-for-length/height — wasting (0–60 m) |

Missing inputs return a descriptive string, not `null`.

## Tables

`data/day_*.json` — WHO igrowup day-indexed (1 row/day, 0–1826 d). Preferred when DOB is known.  
`data/month_*.json` — WHO supplementary monthly (1 row/month, 0–60 m).

Source: WHO MGRS (2006). ISBN 924154693X.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
