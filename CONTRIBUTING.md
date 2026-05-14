# Contributing

## Repository structure

```
VERSION                 Single source of truth for the version number
src/anthro.js           JavaScript core library (UMD — Node.js, browser, React Native)
src/anthro.d.ts         TypeScript declarations
data/day_*.json         WHO igrowup day-indexed LMS tables (0–1826 d) — shared by JS and Python
data/month_*.json       WHO monthly LMS tables (0–60 m)         — shared by JS and Python
test/anthro.test.js     JavaScript test suite
scripts/export-tables.R Re-exports day-indexed tables from the R anthro package
python/anthro/          Python package source
python/test_anthro.py   Python test suite
python/pyproject.toml   Python build config (hatchling; version read from VERSION)
python/README.md        Python-specific documentation
docs/                   Website source (HTML, api.js, static files)
                        CI adds anthro.bundle.js and data/ at build time
```

## Versioning

**`VERSION`** is the single source of truth. To cut a release:

1. Update `VERSION` (e.g. `echo "1.1.0" > VERSION`)
2. Commit and push to `main`
3. Tag: `git tag v1.1.0 && git push origin v1.1.0`

CI will automatically:
- Sync `package.json` version (`npm run sync-version`)
- Inject the version into `src/anthro.js`
- Read the version for PyPI via `[tool.hatch.version]`
- Publish both packages

## Tests

```bash
# JavaScript
node test/anthro.test.js

# Python
python3 python/test_anthro.py
```

No install needed for either suite.

## Updating WHO tables

```bash
# Requires R with anthro and jsonlite
Rscript scripts/export-tables.R
node test/anthro.test.js
python3 python/test_anthro.py
```

Month-indexed tables (`data/month_*.json`) are not in the R package; update them manually from https://www.who.int/tools/child-growth-standards/standards.

## How the site deploys

On every push to `main`, CI:
1. Runs JS and Python tests
2. Bundles `src/anthro.js` → `anthro.bundle.js` with esbuild
3. Copies `data/*.json` alongside the site files
4. Deploys via GitHub Pages

**One-time setup:** repo Settings → Pages → Source: **GitHub Actions**.

## Pull requests

One concern per PR. Run both test suites. Describe what changed and why.

https://github.com/flame-cai/anthro/issues
