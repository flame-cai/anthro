# anthro-who (Python)

**WHO 2006 Child Growth Standards** — z-scores and classifications for 6 indicators.

Python port of the JavaScript library [`@flame-cai/anthro`](https://github.com/flame-cai/anthro).

## Installation

```bash
pip install anthro-who
```

## Quick start

```python
from anthro_who import compute, batch

# Single child
result = compute({
    "sex": "m",
    "age_days": 365,
    "weight_kg": 9.5,
    "height_cm": 75.2,
    "muac_cm": 14.5,
})
print(result["z_wfa"])    # weight-for-age z-score
print(result["wfa"])      # 'Normal' | 'MAM' | 'SAM'
print(result["z_lhfa"])   # length/height-for-age z-score
print(result["z_wflh"])   # weight-for-length/height z-score

# Using date of birth
result = compute({
    "sex": "female",
    "dob": "2022-03-15",
    "measured": "2023-03-15",
    "weight_kg": 9.0,
    "height_cm": 74.5,
})

# Month mode
result = compute({
    "sex": "f",
    "age_months": 12,
    "weight_kg": 9.0,
    "height_cm": 74.5,
    "mode": "month",
})

# Batch
results = batch([
    {"sex": "m", "age_days": 200, "weight_kg": 6.8, "height_cm": 63.0},
    {"sex": "f", "age_days": 400, "weight_kg": 8.2, "height_cm": 75.0},
])
```

## API

### `compute(params)` → `dict`

| Parameter    | Type             | Description |
|---|---|---|
| `sex`        | str              | `'m'`/`'f'`/`'male'`/`'female'`/`'1'`/`'2'` |
| `dob`        | str \| date      | Date of birth (`'YYYY-MM-DD'` or `date`) |
| `measured`   | str \| date      | Date measured (required with `dob`) |
| `age_days`   | float            | Age in days (alternative to dob/measured) |
| `age_months` | float            | Age in months (alternative) |
| `weight_kg`  | float            | Weight in kg |
| `weight_g`   | float            | Weight in g (alternative) |
| `height_cm`  | float            | Length/height in cm |
| `muac_mm`    | float            | MUAC in mm |
| `muac_cm`    | float            | MUAC in cm (alternative) |
| `measure`    | `'L'` \| `'H'`  | Recumbent (`L`) or standing (`H`); auto-inferred if omitted |
| `oedema`     | bool             | Default `False` |
| `mode`       | `'day'`\|`'month'` | Default `'day'` |

### Return dict keys

`mode`, `sex`, `age_days`, `age_months`, `weight_kg`, `height_cm_raw`,
`height_cm_adj`, `muac_mm`, `bmi_val`, `measure`, `measure_correction`,
`z_lhfa`, `z_wfa`, `z_wflh`, `z_bmi`, `z_acfa`,
`flag_lhfa`, `flag_wfa`, `flag_wflh`, `flag_bmi`, `flag_acfa`,
`muac_threshold`, `acfa`, `bmi`, `lhfa`, `wfa`, `wflh`,
`errors`, `warnings`

### `batch(rows, default_mode='day')` → `list[dict]`

### Low-level helpers

```python
from anthro_who import lms_z, age_days, months_to_days, classify

z = lms_z(X=9.5, L=0.1, M=10.0, S=0.12)
d = age_days("2022-01-01", "2023-01-01")  # → 365
classify.muac(110)   # → 'SAM'
classify.zscore(-2.5)  # → 'MAM'
```

## Table sources

* **Day-indexed tables** (default): extracted from the R package `anthro` v1.1.0 (WHO-maintained, CRAN) — the same tables used by WHO igrowup SAS/SPSS/Stata software.
* **Month-indexed tables**: WHO 2006 published monthly supplementary tables.

## References

* WHO MGRS (2006). *WHO Child Growth Standards*. Geneva: WHO. ISBN 924154693X
* Formula: Restricted LMS + SD23 adjustment — WHO (2006) §5.2
