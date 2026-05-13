# anthro

**WHO 2006 Child Growth Standards** — z-scores & classifications for 6 indicators.

[![Tests](https://github.com/flame-cai/anthro/actions/workflows/ci.yml/badge.svg)](https://github.com/flame-cai/anthro/actions)
[![npm](https://img.shields.io/npm/v/@flame-cai/anthro)](https://www.npmjs.com/package/@flame-cai/anthro)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live:** https://flame-cai.github.io/anthro  
**API/CDN:** https://flame-cai.github.io/anthro/anthro.bundle.js

---

## Table source

| Mode | Tables | Source |
|------|--------|--------|
| `'day'` (default) | Day-indexed: 1 LMS row per day (0–1826 d) | WHO igrowup SAS/SPSS/Stata software; R anthro v1.1.0 |
| `'month'` | Month-indexed: 1 LMS row per month (0–60 m) | WHO supplementary tables (same 2006 study) |

```js
// mode:'day'  → use when DOB is known (most precise, no rounding error)
// mode:'month' → use when only completed months are available; matches Excel/sheet workflows
```

---

## Indicators

| Field | Description | Cut-points |
|-------|-------------|-----------|
| `muac_threshold` | Absolute MUAC (age-independent) | SAM <115mm, MAM 115–<125mm, Normal ≥125mm |
| `acfa` | MUAC-for-age z-score (3–60m) | SAM z<−3, MAM −3 to <−2, Normal ≥−2 |
| `bmi` | BMI-for-age z-score (0–60m) | SAM z<−3, MAM −3 to <−2, Normal ≥−2 |
| `lhfa` | Length/height-for-age z-score (stunting) | Severely/Moderately stunted, Normal |
| `wfa` | Weight-for-age z-score (underweight) | Severely/Moderately underweight, Normal |
| `wflh` | Weight-for-length/height z-score (wasting) | Severe/Moderate wasting, Normal, Overweight |

---

## Quick start

### Browser (CDN)
```html
<script src="https://flame-cai.github.io/anthro/anthro.bundle.js"></script>
<script src="https://flame-cai.github.io/anthro/api.js"></script>
<script>
  await AnthroAPI.ready();
  const r = AnthroAPI.compute({
    mode: 'day', sex: 'female',
    dob: '2024-01-15',      // most accurate — exact age in days, no rounding
    weight_kg: 7.0,
    height_cm: 64.0,
    muac_mm:   136,
  });
  console.log(r.lhfa);   // 'Moderately stunted'
  console.log(r.z_lhfa); // -2.7901
</script>
```

### npm
```bash
npm install @flame-cai/anthro
```
```js
const { createAnthro } = require('@flame-cai/anthro');
const fs = require('fs');
const load = (p, n) => JSON.parse(fs.readFileSync(`data/${p}_${n}.json`));
const names = ['wfa','lhfa','bmi','acfa','wfl','wfh'];
const anthro = createAnthro(
  Object.fromEntries(names.map(n => [n, load('day', n)])),
  Object.fromEntries(names.map(n => [n, load('month', n)])),
);

const result = anthro.compute({
  mode: 'day',            // 'day' | 'month'
  sex: 'F',              // 'male'|'female'|'m'|'f'|'M'|'F'|1|2
  dob: '2024-01-15',     // DOB preferred over age_days/age_months
  weight_kg: 7.0,        // or weight_g: 7000
  height_cm: 64.0,       // 0.5 cm steps
  muac_mm: 136,          // or muac_cm: 13.6
  measure: 'L',          // 'L'=recumbent | 'H'=standing | omit=auto
});
```

### Missing inputs → informative messages (never silent nulls)
```js
anthro.compute({ sex: 'F', dob: '2024-01-01', height_cm: 64 })
// result.wfa  = "Missing weight to compute"
// result.wflh = "Missing weight to compute"
// result.lhfa = computed normally ✓
// result.muac_threshold = "Missing muac to compute"
```

---

## Precision

This library uses **exact floating-point z-scores** for classification.
R anthro rounds z to 2 decimal places before classifying; when z = −2.003, R rounds to −2.00 and classifies as Normal, while the exact formula correctly gives MAM.
Our library is more accurate at cut-point boundaries.

---

## Citations

| | |
|--|--|
| **Tables & methods** | WHO MGRS (2006). *WHO Child Growth Standards.* Geneva: WHO. ISBN 924154693X |
| **igrowup software** | WHO (2006). https://www.who.int/tools/child-growth-standards/software |
| **R anthro package** | WHO/Borghi. *anthro* v1.1.0. https://cran.r-project.org/package=anthro |
| **LMS formula** | WHO (2006) Technical Report §5.2, pp. 300–304 |
| **Classification** | WHO (2009). https://www.who.int/publications/i/item/9789241598163 |
| **Measure correction** | WHO (2006) Chapter 7: ±0.7 cm recumbent/standing |
| **Plausibility flags** | WHO igrowup documentation (igrowup_standard.sas/.ado) |

---

## License

MIT — library code.  
WHO Growth Standards data: CC BY-NC-SA 3.0 IGO.
