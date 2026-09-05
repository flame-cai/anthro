# anthro

**WHO Child Growth Standards for Python & JavaScript**

An independent, open-source implementation of the **WHO Child Growth Standards** methodology, providing z-scores and nutritional classifications for six anthropometric indicators through Python and JavaScript/Node.js.

> **Important:** `anthro` is an independent implementation and is **not an official WHO software package**. It has not been reviewed, verified, certified, or endorsed by WHO. For authoritative WHO methodology and software, refer to the [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards).

**Repository:** https://github.com/flame-cai/anthro
**Website:** https://flame-cai.github.io/anthro
**Version:** 1.1.1

[![npm](https://img.shields.io/npm/v/@flame-cai/anthro?logo=npm)](https://www.npmjs.com/package/@flame-cai/anthro)
[![PyPI](https://img.shields.io/pypi/v/anthro?logo=pypi)](https://pypi.org/project/anthro/)
[![License](https://img.shields.io/badge/code%20license-MIT-blue.svg)](LICENSE)

## About

The **WHO Child Growth Standards** describe growth for children from birth to 5 years of age under the conditions represented by the WHO Multicentre Growth Reference Study.

WHO provides official software and programmatic resources for working with the standards, including the WHO-maintained `anthro` R package.

This project was created to provide an independent implementation for **Python and JavaScript**, making the methodology easier to integrate into data-science workflows, research software, web applications, and other programming environments.

### WHO resources

* [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards)
* [WHO Child Growth Standards — Software](https://www.who.int/tools/child-growth-standards/software)
* [WHO `anthro` R package](https://github.com/WorldHealthOrganization/anthro)
* [WHO Open Source Communication Channel](https://github.com/WorldHealthOrganization/open-source-communication-channel)

## Important distinction from WHO software

`anthro` is **not a port, fork, or redistribution of the WHO Anthro application**.

It is an independently developed implementation of the relevant methodology.

The project uses reference material associated with the WHO Child Growth Standards and documents its provenance separately.

This project must not be represented as:

* official WHO software;
* WHO-certified software;
* WHO-verified software;
* WHO-reviewed software;
* WHO-endorsed software; or
* software developed by WHO.

## Methodology, provenance and validation

The implementation follows the methodology associated with the **WHO Child Growth Standards (2006)**.

Reference-data origin and transformations are documented in [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md).

Validation procedures, regression testing, cross-language comparisons, and known limitations are documented in [`VALIDATION.md`](VALIDATION.md).

Validation against the WHO-maintained R implementation is a technical compatibility exercise and **does not constitute WHO review, certification, verification, or endorsement**.

## Licensing

The original source code authored for this project is released under the **MIT License**.

However, the repository also contains reference data and other material derived from or associated with external sources. Those materials are **not claimed to be MIT-licensed**.

See:

* [`LICENSE`](LICENSE) — license for original project source code
* [`LICENSING.md`](LICENSING.md) — licensing boundaries
* [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md) — source and transformation information

Users should review applicable third-party terms before redistributing reference data or incorporating them into downstream products.

## JavaScript

### Install

```bash
npm install @flame-cai/anthro
```

### Quick start

```js
const { createAnthro } = require('@flame-cai/anthro')
const fs = require('fs')

const names = ['wfa', 'lhfa', 'bmi', 'acfa', 'wfl', 'wfh']
const load = (p, n) =>
  JSON.parse(
    fs.readFileSync(
      require.resolve(`@flame-cai/anthro/data/${p}_${n}.json`)
    )
  )

const anthro = createAnthro(
  Object.fromEntries(names.map(n => [n, load('day', n)])),
  Object.fromEntries(names.map(n => [n, load('month', n)]))
)

const result = anthro.compute({
  mode: 'day',
  sex: 'female',
  dob: '2024-01-15',
  weight_kg: 7.0,
  height_cm: 64.0,
  muac_mm: 136,
})

console.log(result)
```

Full documentation:

https://flame-cai.github.io/anthro/

## Python

### Install

```bash
pip install anthro
```

### Quick start

```python
from anthro import compute, batch

result = compute({
    "sex": "female",
    "dob": "2024-01-15",
    "measured": "2025-01-15",
    "weight_kg": 7.0,
    "height_cm": 64.0,
    "muac_mm": 136,
})

print(result)

results = batch([
    {
        "sex": "m",
        "age_days": 200,
        "weight_kg": 6.8,
        "height_cm": 63.0,
    },
    {
        "sex": "f",
        "age_days": 400,
        "weight_kg": 8.2,
        "height_cm": 75.0,
    },
])
```

See [`python/README.md`](python/README.md) for the Python API.

## Output indicators

| Field            | Description                  |
| ---------------- | ---------------------------- |
| `muac_threshold` | Absolute MUAC classification |
| `acfa`           | MUAC-for-age                 |
| `bmi`            | BMI-for-age                  |
| `lhfa`           | Length/height-for-age        |
| `wfa`            | Weight-for-age               |
| `wflh`           | Weight-for-length/height     |

The implementation returns both calculated values and classifications where applicable.

## Reference tables

```text
data/day_*.json
data/month_*.json
```

Day-indexed tables are used when age is available in days.

Month-indexed tables are maintained separately.

See [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md) before reusing or redistributing these files.

## Testing

JavaScript:

```bash
node test/anthro.test.js
```

Python:

```bash
python3 python/test_anthro.py
```

See [`VALIDATION.md`](VALIDATION.md) for the validation strategy.

## Versioning

[`VERSION`](VERSION) is the project's single source of truth for the software version.

The release workflow synchronizes package versions from this file.

## Contributing

Contributions are welcome.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting a pull request.

Community participation is governed by [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Security

Please do not report security vulnerabilities through public issues.

See [`SECURITY.md`](SECURITY.md) for security-reporting guidance.

## Project documentation

* [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution and development workflow
* [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — community standards
* [`SECURITY.md`](SECURITY.md) — security policy
* [`VALIDATION.md`](VALIDATION.md) — validation methodology
* [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md) — reference-data provenance
* [`LICENSING.md`](LICENSING.md) — licensing boundaries
* [`LICENSE`](LICENSE) — original project source-code license

## Disclaimer

`anthro` is provided as an independent open-source software project.

It is not a substitute for professional medical or public-health judgment, official WHO documentation, or official WHO software.

Users are responsible for validating the suitability of the software for their particular application.

No representation is made that WHO has reviewed, verified, certified, endorsed, or recommended this project.
