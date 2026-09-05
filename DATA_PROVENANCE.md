# Data Provenance

## Purpose

This document records the origin and handling of reference data used by `anthro`.

The distinction between **data provenance** and **software authorship** is important: the presence of reference data from an external source does not mean that the software implementation was authored or endorsed by that source.

## WHO Child Growth Standards

The implementation is based on the methodology associated with the **WHO Child Growth Standards**.

The WHO Child Growth Standards were released in 2006 and provide growth standards for children from birth to 5 years of age.

Official WHO information is available from:

- WHO Child Growth Standards: https://www.who.int/tools/child-growth-standards
- WHO Child Growth Standards software: https://www.who.int/tools/child-growth-standards/software
- WHO-maintained `anthro` R package: https://github.com/WorldHealthOrganization/anthro

These links are provided as source and methodology references.

## Reference tables

The repository contains reference tables used by the implementation.

### Day-indexed tables

The files under:

```text
data/day_*.json
```

contain day-indexed reference data used by the implementation.

The repository's current data-generation workflow documents these as being exported from the WHO-maintained R `anthro` package through:

```text
scripts/export-tables.R
```

The export process is intended to reproduce the required table structure in JSON for use by the JavaScript and Python implementations.

### Month-indexed tables

The files under:

```text
data/month_*.json
```

contain month-indexed reference data.

These tables are documented by the project as supplementary monthly tables associated with the WHO Child Growth Standards and are handled separately from the day-indexed export process.

They should not be represented as files generated directly from the WHO R package unless the underlying provenance has been independently established.

## Transformation

The project does not claim to reproduce the WHO R package source code.

Reference data are transformed into JSON structures suitable for programmatic use by the JavaScript and Python implementations.

The transformation may include:

- extracting required fields;
- converting table structures;
- serializing data as JSON;
- organizing data by indicator;
- organizing records by age; and
- making the same reference data consumable by both supported languages.

The transformation process should not change the underlying reference values except where explicitly documented and tested.

## Shared data

The JavaScript and Python implementations are designed to use the same underlying reference data.

This reduces the risk of the two language implementations silently using different reference values.

During Python package builds, the shared repository data are staged into the Python package by CI rather than maintained as an independent second copy.

## Source-data integrity

Changes to reference data are security- and correctness-sensitive.

Contributors modifying files under `data/` should document:

- the source;
- the source version or publication where available;
- the transformation performed;
- why the change is necessary;
- expected effects on calculations; and
- relevant validation results.

Reference-data changes should include regression tests where practical.

## Licensing and permissions

Reference-data provenance does not itself establish a license.

The project therefore does **not** claim that the WHO-derived reference tables are covered by the project's MIT License.

See [`LICENSING.md`](LICENSING.md) for the project's licensing boundaries.

Where redistribution or commercial use requires clarification, users should obtain appropriate guidance from the relevant rights holder.

## Attribution

The project acknowledges the World Health Organization and the WHO Child Growth Standards as important sources for the methodology and reference material used by this implementation.

This acknowledgement does not imply that WHO:

- developed this software;
- reviewed this software;
- verified its results;
- certified this software;
- endorses this software; or
- recommends this software.

## Versioning

Reference-data changes should be associated with a project release or clearly documented data revision.

The project uses [`VERSION`](VERSION) as its software version source of truth.

A future release containing changed reference data should identify the affected data and validation status in its release notes.

## Known provenance limitations

The project currently maintains provenance at the table/source level rather than providing a complete cryptographic chain of custody for every individual value.

Where the exact upstream file version, transformation history, or licensing status is uncertain, the project intentionally records that uncertainty rather than presenting an unsupported claim as fact.

## Contact and corrections

If you identify an incorrect source attribution, missing attribution, incorrect transformation, or licensing concern, please open an issue with enough information for the maintainer to investigate.

Do not submit confidential or identifiable health information.