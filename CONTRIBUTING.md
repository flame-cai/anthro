# Contributing

## Repository structure

```
src/anthro.js           Core library (UMD — Node.js, browser, React Native)
src/anthro.d.ts         TypeScript declarations
data/day_*.json         WHO igrowup day-indexed LMS tables (0–1826 d)
data/month_*.json       WHO monthly LMS tables (0–60 m)
test/anthro.test.js     Test suite
scripts/export-tables.R Re-exports day-indexed tables from the R anthro package
docs/                   Website source (HTML, api.js, static files)
                        CI adds anthro.bundle.js and data/ at build time
```

## Tests

```bash
node test/anthro.test.js
```

No install needed. No test framework.

## Updating WHO tables

```bash
# Requires R with anthro and jsonlite
Rscript scripts/export-tables.R
node test/anthro.test.js
```

Month-indexed tables (`data/month_*.json`) are not in the R package; update them manually from https://www.who.int/tools/child-growth-standards/standards.

## How the site deploys

On every push to `main`, CI:
1. Runs tests
2. Bundles `src/anthro.js` → `anthro.bundle.js` with esbuild
3. Copies `data/*.json` alongside the site files
4. Deploys via GitHub Pages

**One-time setup:** repo Settings → Pages → Source: **GitHub Actions**.

## Pull requests

One concern per PR. Run tests. Describe what changed and why.

https://github.com/flame-cai/anthro/issues
