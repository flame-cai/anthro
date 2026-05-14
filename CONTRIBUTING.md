# Contributing

All contributions are welcome.

## Structure

```
src/anthro.js          core library (UMD — Node.js, browser, React Native)
src/anthro.d.ts        TypeScript declarations
data/day_*.json        WHO igrowup day-indexed LMS tables (0–1826 d)
data/month_*.json      WHO monthly LMS tables (0–60 m)
test/anthro.test.js    test suite — 33 tests, no dependencies
site/                  website source files (CI publishes to gh-pages branch)
```

## Running tests

```bash
node test/anthro.test.js
```

No npm install needed. No test framework.

## How the site is built

```
npm run build    # bundles src/anthro.js + copies data/ + copies site/ → _site/
npm run deploy   # runs build, then pushes _site/ to the gh-pages branch
```

The CI workflow (`.github/workflows/ci.yml`) does the same thing automatically on every push to `main` — it runs `npm ci`, then `npm run build`, then deploys via `peaceiris/actions-gh-pages`.

GitHub Pages is configured to serve the `gh-pages` branch. Set it once in repo Settings → Pages → Source: **gh-pages** branch, **/ (root)**.

`data/` in `main` is the single source of truth for the WHO tables — used by npm consumers and copied to the site at build time. No duplication.

## Updating WHO tables

Day-indexed tables (`data/day_*.json`) come from the R package `anthro` v1.1.0. To update them after WHO publishes new tables:

1. Obtain the new datasets from the R `anthro` package (`growthstandards_weianthro` etc.) or from the WHO igrowup software.
2. Export to the same columnar JSON format (`{M:{i,l,m,s},F:{i,l,m,s}}`).
3. Replace the relevant files in `data/`.
4. Run `node test/anthro.test.js`.

Month-indexed tables (`data/month_*.json`) must be updated manually from the [WHO website](https://www.who.int/tools/child-growth-standards/standards).

## Pull requests

- One concern per PR.
- Run tests before submitting.
- Describe what changed and why.

## Issues

https://github.com/flame-cai/anthro/issues
