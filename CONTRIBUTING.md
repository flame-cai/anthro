# Contributing to anthro

Thank you for your interest in contributing to `anthro`.

`anthro` is an independent open-source implementation of the WHO Child Growth Standards methodology for Python and JavaScript.

Contributions are welcome, particularly those that improve correctness, testing, documentation, reproducibility, accessibility, and maintainability.

## Important project status

`anthro` is **not official WHO software**.

It has not been reviewed, verified, certified, or endorsed by WHO.

Contributors must not describe the project as official WHO software or imply that WHO has approved a contribution or release.

## Before contributing

Please read:

* [`README.md`](README.md)
* [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
* [`SECURITY.md`](SECURITY.md)
* [`VALIDATION.md`](VALIDATION.md)
* [`DATA_PROVENANCE.md`](DATA_PROVENANCE.md)
* [`LICENSING.md`](LICENSING.md)

## Repository structure

```text
anthro/
├── .github/
│   └── workflows/
├── data/
│   ├── day_*.json
│   └── month_*.json
├── docs/
├── python/
│   ├── anthro/
│   └── test_anthro.py
├── scripts/
│   └── export-tables.R
├── src/
│   ├── anthro.js
│   └── anthro.d.ts
├── test/
│   └── anthro.test.js
├── CONTRIBUTING.md
├── DATA_PROVENANCE.md
├── LICENSE
├── LICENSING.md
├── README.md
├── SECURITY.md
├── VALIDATION.md
└── VERSION
```

## Development requirements

### JavaScript

The project currently targets Node.js 24 or later for development and CI.

Install dependencies as required by the project and run:

```bash
node test/anthro.test.js
```

The package build uses `esbuild`.

### Python

The Python package currently supports Python 3.8 and later.

Run:

```bash
python3 python/test_anthro.py
```

The package uses Hatchling for building.

### R

R is required when regenerating day-indexed reference tables using:

```bash
Rscript scripts/export-tables.R
```

Do not regenerate reference data casually. Changes to reference tables require provenance and validation review.

## Making changes

Keep changes focused.

A good pull request should generally:

* address one logical problem;
* include tests for behavior changes;
* update documentation when behavior changes;
* avoid unrelated formatting changes;
* preserve backwards compatibility where practical; and
* explain important design or numerical decisions.

## Changes to calculations

Changes to anthropometric calculations are particularly sensitive.

When modifying calculation logic, provide:

* the reason for the change;
* the affected indicator(s);
* representative input/output examples;
* tests covering the changed behavior;
* comparison results where applicable; and
* information about any numerical tolerance or boundary effects.

See [`VALIDATION.md`](VALIDATION.md).

## Changes to reference data

Changes under `data/` require additional care.

A contribution modifying reference data should document:

1. The source.
2. The source version/date, where available.
3. The transformation used.
4. The reason for the change.
5. Expected numerical impact.
6. Validation performed.
7. Relevant licensing/provenance considerations.

Do not replace reference data with values from an unrelated source without documenting the change.

## Updating WHO-derived tables

The day-indexed export process is documented in:

```text
scripts/export-tables.R
```

The repository currently uses this process to export the relevant day-indexed tables from the WHO-maintained R `anthro` package.

Month-indexed tables are handled separately.

Any uncertainty concerning the provenance or redistribution rights of reference material should be raised before merging the change.

## Tests

Before submitting a pull request, run at least:

```bash
node test/anthro.test.js
python3 python/test_anthro.py
```

If your change affects the website/build process, also run the relevant build command.

If your change affects package metadata or publishing, verify both package configurations.

## Documentation

Documentation should remain synchronized with implementation behavior.

Changes affecting:

* supported indicators;
* input fields;
* outputs;
* age ranges;
* classification rules;
* reference data;
* installation;
* APIs; or
* release behavior

should normally include corresponding documentation updates.

## Licensing

Original contributions to the project are expected to be compatible with the project's MIT License unless a different arrangement is explicitly documented.

Do not submit third-party material without confirming that its license permits the intended use.

In particular, contributors must not assume that WHO-derived reference data can be relicensed under MIT merely because the surrounding source code is MIT-licensed.

See [`LICENSING.md`](LICENSING.md).

## Pull requests

Pull requests should include:

* a clear title;
* a concise explanation of the change;
* relevant tests;
* documentation updates where necessary;
* provenance information for external material; and
* any known limitations.

For numerical changes, include before/after examples where useful.

## Commit messages

Use concise commit messages that describe the change.

Examples:

```text
fix: correct age boundary handling
test: add regression cases for muac classification
docs: clarify reference-data provenance
build: update package release workflow
```

## CI/CD

The repository uses GitHub Actions for testing, building, GitHub Pages deployment, and package publishing.

Workflow changes should be reviewed carefully because they may affect release security.

Do not introduce secrets, credentials, or publishing permissions into pull-request workflows unnecessarily.

Do not commit:

* npm tokens;
* PyPI tokens;
* GitHub tokens;
* private keys;
* credentials; or
* other secrets.

## Release process

`VERSION` is the project's software-version source of truth.

The current release process synchronizes package versions from this file.

A release generally follows:

```bash
# update VERSION
git add VERSION
git commit -m "release: X.Y.Z"
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

Publishing is performed by the repository's CI workflow.

Do not manually publish a release unless the project release process explicitly requires it.

## Health and clinical use

Contributors should avoid presenting software output as a diagnosis or clinical decision by itself.

The project implements anthropometric calculations and classifications; interpretation and application remain the responsibility of qualified users and the relevant clinical or public-health context.

Do not include identifiable patient information in issues, pull requests, tests, examples, or documentation.

## Community discussion

Technical disagreements are welcome when they are supported by reproducible evidence and discussed respectfully.

When discussing compatibility with WHO methodology or another implementation, provide enough information for others to reproduce the comparison.

## Questions

If you are unsure whether a proposed change is appropriate, open an issue describing:

* the problem;
* the proposed solution;
* relevant references; and
* any uncertainty.

For security issues, follow [`SECURITY.md`](SECURITY.md) instead of opening a public issue.
