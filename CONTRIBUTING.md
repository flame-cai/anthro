# Contributing

All contributions are welcome.

## Structure

```
src/anthro.js          core library (UMD — Node.js, browser, React Native)
src/anthro.d.ts        TypeScript declarations
data/day_*.json        WHO igrowup day-indexed LMS tables (0–1826 d)
data/month_*.json      WHO monthly LMS tables (0–60 m)
test/anthro.test.js    test suite
docs/                  website source (index.html, api.js, static files)
                       CI adds anthro.bundle.js and data/ at build time
```

## Running tests

```bash
node test/anthro.test.js
```

No npm install needed. No test framework.

## How the site deploys

On every push to `main`, the CI workflow (`.github/workflows/ci.yml`):

1. Runs `node test/anthro.test.js`
2. Bundles `src/anthro.js` → `docs/anthro.bundle.js` with esbuild
3. Copies `data/*.json` → `docs/data/`
4. Uploads `docs/` as a GitHub Pages artifact and deploys it

**GitHub Pages setup** (one-time): repo Settings → Pages → Source: **GitHub Actions**.

`data/` in the repo root is the single source of truth for WHO tables. npm consumers use it directly; the website gets a copy at build time.

## Updating WHO tables

1. Obtain updated datasets from the R `anthro` package or WHO igrowup software.
2. Replace the relevant files in `data/` using the same JSON format (`{M:{i,l,m,s},F:{i,l,m,s}}`).
3. Run `node test/anthro.test.js`.

## Pull requests

- One concern per PR.
- Run tests before submitting.
- Describe what changed and why.

## Issues

https://github.com/flame-cai/anthro/issues
