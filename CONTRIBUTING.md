# Contributing

All contributions are welcome.

## Repository structure

```
src/anthro.js          core library (UMD — Node.js, browser, React Native)
src/anthro.d.ts        TypeScript declarations
data/day_*.json        WHO igrowup day-indexed LMS tables (from R anthro package)
data/month_*.json      WHO monthly LMS tables (manually maintained)
test/anthro.test.js    test suite (33 tests, verified vs R anthro v1.1.0)
scripts/export-tables.R  re-exports day-indexed tables from the R anthro package
docs/                  GitHub Pages site (built by CI — do not edit bundle/data here)
```

## Running tests

```bash
node test/anthro.test.js
```

No npm install required. Tests run in Node.js directly, no test framework.

## Pre-commit hook

The repository uses [Husky](https://typicode.github.io/husky/) to run tests before every commit. To activate it after cloning:

```bash
npm install   # installs husky and runs `husky` via the prepare script
```

After that, `node test/anthro.test.js` runs automatically on every `git commit`. Commits are blocked if any test fails.

## Updating WHO tables

Day-indexed tables (`data/day_*.json`) are extracted from the R `anthro` package. If WHO publishes updated tables:

```bash
# Requires R with anthro and jsonlite packages installed
Rscript scripts/export-tables.R

# Then verify
node test/anthro.test.js
```

Month-indexed tables (`data/month_*.json`) must be updated manually from the [WHO website](https://www.who.int/tools/child-growth-standards/standards).

## Making changes to the library

- Edit `src/anthro.js` only — it is the single source of truth.
- Keep `src/anthro.d.ts` in sync with any API changes.
- `docs/anthro.bundle.js` is built by CI — never edit it manually.

## Pull requests

- One concern per PR.
- Run tests before submitting.
- Describe what changed and why.

## Issues

https://github.com/flame-cai/anthro/issues
