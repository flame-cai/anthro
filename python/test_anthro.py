"""
Basic smoke tests for anthro_who Python package.
Mirrors key assertions from anthro.test.js.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from anthro_who import compute, batch, lms_z, age_days, months_to_days, classify

PASS = 0
FAIL = 0


def assert_close(a, b, tol=0.001, label=""):
    global PASS, FAIL
    if a is None or b is None:
        if a == b:
            PASS += 1
            return
        print(f"FAIL [{label}]: {a!r} != {b!r}")
        FAIL += 1
        return
    if abs(a - b) <= tol:
        PASS += 1
    else:
        print(f"FAIL [{label}]: {a} != {b} (tol={tol})")
        FAIL += 1


def assert_eq(a, b, label=""):
    global PASS, FAIL
    if a == b:
        PASS += 1
    else:
        print(f"FAIL [{label}]: {a!r} != {b!r}")
        FAIL += 1


# ── lms_z ──────────────────────────────────────────────────────────────────────
assert_close(lms_z(3.3464, 0.3487, 3.3464, 0.14), 0.0, tol=0.001, label="lms_z X=M gives z=0")
assert_eq(lms_z(0, 1, 1, 1), None, label="lms_z X=0")
assert_eq(lms_z(1, 1, 0, 1), None, label="lms_z M=0")

# ── age_days ───────────────────────────────────────────────────────────────────
assert_eq(age_days("2022-01-01", "2023-01-01"), 365, label="age_days 1yr")
assert_eq(age_days("2022-01-01", "2022-01-01"), 0,   label="age_days same day")
assert_eq(age_days("2023-01-01", "2022-01-01"), None, label="age_days negative")

# ── months_to_days ─────────────────────────────────────────────────────────────
assert_eq(months_to_days(12), round(12 * 30.4375), label="months_to_days 12")

# ── classify ───────────────────────────────────────────────────────────────────
assert_eq(classify.zscore(-3.5), "SAM",    label="classify SAM")
assert_eq(classify.zscore(-2.5), "MAM",    label="classify MAM")
assert_eq(classify.zscore(-1.0), "Normal", label="classify Normal")
assert_eq(classify.muac(110),    "SAM",    label="muac SAM")
assert_eq(classify.muac(120),    "MAM",    label="muac MAM")
assert_eq(classify.muac(130),    "Normal", label="muac Normal")

# ── errors ─────────────────────────────────────────────────────────────────────
r = compute({"sex": "x", "age_days": 100, "weight_kg": 5})
assert_eq(len(r["errors"]) > 0, True, label="invalid sex → error")

r = compute({"sex": "m"})
assert_eq(len(r["errors"]) == 0, True, label="no age → no error (age computed separately)")
assert_eq(r["wfa"], "Missing age to compute", label="no age → wfa missing")

# ── day mode z-scores ──────────────────────────────────────────────────────────
r = compute({
    "sex": "m",
    "age_days": 365,
    "weight_kg": 9.5,
    "height_cm": 75.2,
})
assert_eq(r["errors"], [], label="day mode no errors")
assert_eq(isinstance(r["z_wfa"], float), True, label="z_wfa is float")
assert_eq(isinstance(r["z_lhfa"], float), True, label="z_lhfa is float")
assert_eq(isinstance(r["z_wflh"], float), True, label="z_wflh is float")

# wfa for male 365 days, 9.5kg → expect close to 0
assert_close(r["z_wfa"], 0.0, tol=1.5, label="day mode wfa in range")

# ── month mode ─────────────────────────────────────────────────────────────────
r = compute({
    "sex": "f",
    "age_months": 12,
    "weight_kg": 8.9,
    "height_cm": 74.0,
    "mode": "month",
})
assert_eq(r["errors"], [], label="month mode no errors")
assert_eq(isinstance(r["z_wfa"], float), True, label="month mode z_wfa")

# ── MUAC / ACFA ────────────────────────────────────────────────────────────────
r = compute({
    "sex": "m",
    "age_days": 365,
    "muac_cm": 14.5,
})
assert_eq(r["muac_threshold"], "Normal", label="muac 145mm = Normal")
assert_eq(isinstance(r["z_acfa"], float), True, label="acfa z-score computed")

r2 = compute({"sex": "m", "age_days": 365, "muac_mm": 110})
assert_eq(r2["muac_threshold"], "SAM", label="muac 110mm = SAM")

# ── dob/measured ───────────────────────────────────────────────────────────────
r = compute({
    "sex": "m",
    "dob": "2022-01-01",
    "measured": "2023-01-01",
    "weight_kg": 9.5,
})
assert_eq(r["age_days"], 365, label="dob/measured age_days")
assert_eq(r["errors"], [], label="dob/measured no errors")

# ── batch ──────────────────────────────────────────────────────────────────────
results = batch([
    {"sex": "m", "age_days": 200, "weight_kg": 6.8, "height_cm": 63.0},
    {"sex": "f", "age_days": 400, "weight_kg": 8.2, "height_cm": 75.0},
])
assert_eq(len(results), 2, label="batch returns 2 results")
assert_eq(results[0]["errors"], [], label="batch[0] no errors")
assert_eq(results[1]["errors"], [], label="batch[1] no errors")

# ── plausibility flags ─────────────────────────────────────────────────────────
r = compute({"sex": "m", "age_days": 365, "weight_kg": 0.1})
assert_eq(r["flag_wfa"], 1, label="implausible weight → flag_wfa=1")
assert_eq(len(r["warnings"]) > 0, True, label="implausible weight → warning")

# ── out-of-range age ───────────────────────────────────────────────────────────
r = compute({"sex": "m", "age_days": 2000, "weight_kg": 15})
assert_eq("Age > 60 months" in str(r["wfa"]), True, label="age > max → wfa error string")

# ── summary ───────────────────────────────────────────────────────────────────
total = PASS + FAIL
print(f"\n{'=' * 40}")
print(f"Python tests: {PASS}/{total} passed", end="")
if FAIL:
    print(f"  ({FAIL} FAILED)")
    sys.exit(1)
else:
    print(" ✓")
