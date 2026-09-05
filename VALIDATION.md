# Validation

## Purpose

`anthro` is an independent implementation of the methodology associated with the **WHO Child Growth Standards**.

The purpose of this document is to describe how the implementation is tested and how numerical compatibility is assessed.

Validation results in this repository are **not a claim of WHO certification, verification, review, approval, or endorsement**.

## Validation principles

The project uses several complementary forms of validation:

1. Unit and regression testing
2. Cross-language consistency testing
3. Reference-data integrity checks
4. Comparison with the WHO-maintained R implementation where applicable
5. Manual review of boundary and edge cases

No single test category is considered sufficient by itself.

## Reference implementation

Where a corresponding calculation is available, results may be compared with the WHO-maintained `anthro` R package.

The purpose of such comparisons is to identify implementation differences and numerical errors.

The WHO R implementation is treated as a reference for comparison, not as an indication that this project is an official WHO implementation.

## Tested indicators

The project currently implements the following indicators:

| Indicator | Description |
|---|---|
| `lhfa` | Length/height-for-age |
| `wfa` | Weight-for-age |
| `wflh` | Weight-for-length/height |
| `bmi` | BMI-for-age |
| `acfa` | MUAC-for-age |
| `muac_threshold` | Absolute MUAC classification |

The exact supported age ranges and measurement requirements are defined by the implementation and its reference tables.

## Test categories

### Normal values

Tests cover representative valid inputs across supported ages, sexes, and anthropometric measurements.

These tests verify that:

- expected outputs are produced;
- z-scores are numerically plausible;
- classifications correspond to calculated values; and
- Python and JavaScript implementations behave consistently.

### Boundary values

Tests should cover values near important classification thresholds.

This is particularly important because small numerical differences can otherwise result in a different classification near a boundary.

### Age handling

Age calculations are tested using:

- day-indexed ages;
- month-indexed ages where applicable;
- age boundaries;
- minimum supported ages; and
- maximum supported ages.

Where date-of-birth and measurement-date inputs are accepted, date handling is tested separately from the underlying anthropometric calculation.

### Sex handling

Both supported sexes are tested against the corresponding reference data.

### Missing and invalid inputs

Tests cover missing, incomplete, and invalid measurements.

The implementation should fail predictably and should not silently substitute clinically meaningful measurements when required inputs are unavailable.

### Cross-language consistency

The JavaScript and Python implementations use the same underlying reference tables.

Equivalent inputs should therefore produce equivalent results within the numerical tolerance defined by the tests.

## Numerical comparison

Floating-point results may differ slightly between implementations because of language runtimes, arithmetic order, and rounding.

Validation should therefore distinguish between:

- exact structural agreement;
- numerical agreement within a defined tolerance; and
- classification agreement.

A small floating-point difference should not automatically be treated as an implementation error.

Classification differences near a threshold require particular attention and should be investigated against the underlying reference calculation.

## Regression testing

Known values and previously corrected bugs should be preserved as regression tests.

A change to:

- calculation logic;
- reference data;
- age handling;
- classification thresholds;
- numerical precision; or
- input validation

should include appropriate regression coverage.

## Reference-data validation

Reference tables are treated as a critical part of the implementation.

Data validation should check, where applicable:

- expected files exist;
- expected fields are present;
- age indexes are complete;
- sex-specific tables are not mixed;
- numerical fields parse correctly;
- no unexpected duplicate records exist;
- reference-table dimensions are consistent; and
- generated files remain reproducible from their documented source.

## Limitations

Passing the project's tests does not establish clinical validity for every possible use case.

The implementation should not be treated as a substitute for:

- clinical judgment;
- local public-health guidance;
- professional anthropometric measurement procedures; or
- official WHO software or documentation.

Users are responsible for determining whether the implementation is appropriate for their particular application.

## Reporting discrepancies

If a result appears inconsistent with the WHO methodology or another trusted implementation, please open an issue with:

- the indicator;
- input values;
- age/date information;
- sex;
- expected result;
- observed result;
- software/library version; and
- a minimal reproducible example.

Do not include identifiable patient information.

## Validation status

Validation is an ongoing process.

The project should be considered an independent software implementation whose compatibility is continually tested rather than a WHO-validated or clinically certified product.