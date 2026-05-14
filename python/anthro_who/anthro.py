"""
WHO 2006 Child Growth Standards — Production Library

TABLE SOURCE — OFFICIAL WHO igrowup DAY-INDEXED TABLES (default)
Extracted from R package "anthro" v1.1.0 (WHO-maintained, CRAN).

Python port of https://github.com/flame-cai/anthro
"""

import json
import math
import os
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Union

# ── Constants ──────────────────────────────────────────────────────────────────
DAYS_PER_MONTH = 30.4375       # WHO igrowup: ANTHRO_DAYS_OF_MONTH = 365.25/12
MEASURE_CORRECTION = 0.7       # cm, recumbent↔standing, WHO 2006 Ch.7
MAX_AGE_DAYS = 1826            # 5 × 365.25 rounded down
MAX_AGE_MONTHS = 60
FLAG = {"wfa": 6, "lhfa": 6, "wflh": 5, "bmi": 5, "acfa": 5}

_DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# ── LMS z-score formula with SD23 adjustment ──────────────────────────────────
def lms_z(X: float, L: float, M: float, S: float) -> Optional[float]:
    """Compute WHO LMS z-score with SD23 adjustment."""
    if not all(math.isfinite(v) for v in (X, M, L, S)):
        return None
    if X <= 0 or M <= 0:
        return None
    if abs(L) < 1e-10:
        z = math.log(X / M) / S
    else:
        z = (math.pow(X / M, L) - 1) / (L * S)
    if not math.isfinite(z):
        return None
    # SD23 adjustment
    if abs(z) > 3:
        if z > 3:
            SD3 = M * math.pow(1 + L * S * 3, 1 / L) if abs(L) >= 1e-10 else M * math.exp(S * 3)
            SD23 = SD3 - (M * math.pow(1 + L * S * 2, 1 / L) if abs(L) >= 1e-10 else M * math.exp(S * 2))
            z = 3 + (X - SD3) / SD23 if SD23 != 0 else z
        else:
            SD3neg = M * math.pow(1 + L * S * -3, 1 / L) if abs(L) >= 1e-10 else M * math.exp(S * -3)
            SD23neg = (M * math.pow(1 + L * S * -2, 1 / L) if abs(L) >= 1e-10 else M * math.exp(S * -2)) - SD3neg
            z = -3 + (X - SD3neg) / SD23neg if SD23neg != 0 else z
    return z if math.isfinite(z) else None


def _r4(x: Optional[float]) -> Optional[float]:
    if x is None or not math.isfinite(x):
        return None
    return round(x, 4)


def _r2(x: Optional[float]) -> Optional[float]:
    if x is None or not math.isfinite(x):
        return None
    return round(x, 2)


# ── Table loading ──────────────────────────────────────────────────────────────
_table_cache: Dict[str, Any] = {}


def _load_table(filename: str) -> Dict:
    """Load and cache a JSON growth table."""
    if filename not in _table_cache:
        path = os.path.join(_DATA_DIR, filename)
        with open(path, "r") as f:
            raw = json.load(f)
        # Convert columnar arrays to dict keyed by index value for fast lookup
        result = {}
        for sex in ("M", "F"):
            tbl = raw[sex]
            keys = tbl["i"]
            rows = {}
            cols = {k: tbl[k] for k in tbl if k != "i"}
            for idx, key in enumerate(keys):
                rows[key] = {k: cols[k][idx] for k in cols}
            result[sex] = rows
        _table_cache[filename] = result
    return _table_cache[filename]


def _load_day_tables() -> Dict:
    return {
        "wfa":  _load_table("day_wfa.json"),
        "lhfa": _load_table("day_lhfa.json"),
        "bmi":  _load_table("day_bmi.json"),
        "acfa": _load_table("day_acfa.json"),
        "wfl":  _load_table("day_wfl.json"),
        "wfh":  _load_table("day_wfh.json"),
    }


def _load_month_tables() -> Dict:
    return {
        "wfa":  _load_table("month_wfa.json"),
        "lhfa": _load_table("month_lhfa.json"),
        "bmi":  _load_table("month_bmi.json"),
        "acfa": _load_table("month_acfa.json"),
        "wfl":  _load_table("month_wfl.json"),
        "wfh":  _load_table("month_wfh.json"),
    }


# ── Table lookup helpers ───────────────────────────────────────────────────────
def _lookup_day(tbl: Dict, d: float) -> Optional[Dict]:
    return tbl.get(round(d))


def _lookup_month(tbl: Dict, m: float) -> Optional[Dict]:
    return tbl.get(round(m))


def _lookup_cm(tbl: Dict, cm: float, step: float = 0.1) -> Optional[Dict]:
    """Look up a row by height in cm, rounding to the given step."""
    rounded = round(round(cm / step) * step, 4)
    row = tbl.get(rounded)
    if row is not None:
        return row
    # Try adjacent steps
    for delta in (step, -step, 2 * step, -2 * step):
        r = round(rounded + delta, 4)
        row = tbl.get(r)
        if row is not None:
            return row
    return None


# ── Sex normalisation ──────────────────────────────────────────────────────────
def _norm_sex(raw: Any) -> Optional[str]:
    if raw is None:
        return None
    s = str(raw).strip().lower()
    if s in ("m", "male", "1"):
        return "M"
    if s in ("f", "female", "2"):
        return "F"
    return None


# ── Date helpers ───────────────────────────────────────────────────────────────
def age_days(dob: Union[str, date], measured: Union[str, date]) -> Optional[int]:
    """Return age in days between dob and measured date."""
    def _parse(d):
        if isinstance(d, (date, datetime)):
            return d if isinstance(d, date) else d.date()
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
            try:
                return datetime.strptime(d, fmt).date()
            except (ValueError, TypeError):
                pass
        return None

    d0, d1 = _parse(dob), _parse(measured)
    if d0 is None or d1 is None:
        return None
    delta = (d1 - d0).days
    return delta if delta >= 0 else None


def months_to_days(m: float) -> int:
    return round(m * DAYS_PER_MONTH)


def _days_to_months(d: float) -> float:
    return d / DAYS_PER_MONTH


# ── Classification ─────────────────────────────────────────────────────────────
def _classify_zscore(z: float) -> str:
    if z < -3:
        return "SAM"
    if z < -2:
        return "MAM"
    return "Normal"


def _classify_muac(mm: float) -> str:
    if mm < 115:
        return "SAM"
    if mm < 125:
        return "MAM"
    return "Normal"


class classify:
    """Classification helpers mirroring the JS classify object."""
    zscore = staticmethod(_classify_zscore)
    muac   = staticmethod(_classify_muac)
    lhfa   = staticmethod(_classify_zscore)
    wfa    = staticmethod(_classify_zscore)
    wflh   = staticmethod(_classify_zscore)


# ── Core computation ───────────────────────────────────────────────────────────
def _compute_z_scores(params: Dict, T_day: Dict, T_month: Dict) -> Dict:
    """
    Compute WHO z-scores for a single child.

    Parameters mirror the JavaScript computeZScores function.
    """
    mode      = params.get("mode", "day")
    raw_sex   = params.get("sex")
    dob_val   = params.get("dob")
    measured  = params.get("measured")
    rad       = params.get("age_days")
    ram       = params.get("age_months")
    weight_kg = params.get("weight_kg")
    weight_g  = params.get("weight_g")
    height_cm = params.get("height_cm")
    muac_cm   = params.get("muac_cm")
    muac_mm   = params.get("muac_mm")
    raw_meas  = params.get("measure")
    oedema    = params.get("oedema", False)

    _T = T_month if mode == "month" else T_day

    R: Dict[str, Any] = {
        "mode": mode, "sex": None,
        "age_days": None, "age_months": None,
        "weight_kg": None, "height_cm_raw": None, "height_cm_adj": None,
        "muac_mm": None, "bmi_val": None, "measure": None, "measure_correction": None,
        "z_lhfa": None, "z_wfa": None, "z_wflh": None, "z_bmi": None, "z_acfa": None,
        "flag_lhfa": 0, "flag_wfa": 0, "flag_wflh": 0, "flag_bmi": 0, "flag_acfa": 0,
        "muac_threshold": None, "acfa": None, "bmi": None, "lhfa": None, "wfa": None, "wflh": None,
        "errors": [], "warnings": [],
    }

    def miss(*args):
        return f"Missing {' & '.join(args)} to compute"

    if mode not in ("day", "month"):
        R["errors"].append("mode must be 'day' or 'month'")
        return R

    sex = _norm_sex(raw_sex)
    if not sex:
        R["errors"].append("sex required: male|female|m|f|M|F|1|2")
        return R
    R["sex"] = sex

    # Age
    days = months = None
    if dob_val is not None:
        days = age_days(dob_val, measured)
        if days is None:
            R["errors"].append("Invalid dob/measured date")
        else:
            months = _days_to_months(days)
    elif rad is not None and math.isfinite(float(rad)) and float(rad) >= 0:
        days = round(float(rad))
        months = _days_to_months(days)
    elif ram is not None and math.isfinite(float(ram)) and float(ram) >= 0:
        months = float(ram)
        days = months_to_days(months)

    if days is not None and days < 0:
        R["errors"].append("Age must be ≥ 0")
        days = months = None

    if mode == "day" and days is not None and days > MAX_AGE_DAYS:
        R["warnings"].append(f"Age {days}d > {MAX_AGE_DAYS}d (60m) table max")
    if mode == "month" and months is not None and round(months) > MAX_AGE_MONTHS:
        R["warnings"].append(f"Age {round(months)}m > {MAX_AGE_MONTHS}m table max")

    R["age_days"] = days
    R["age_months"] = _r2(months) if days is not None else None

    # Weight
    w_kg = None
    if weight_kg is not None and math.isfinite(float(weight_kg)) and float(weight_kg) > 0:
        w_kg = float(weight_kg)
    elif weight_g is not None and math.isfinite(float(weight_g)) and float(weight_g) > 0:
        w_kg = float(weight_g) / 1000
    R["weight_kg"] = w_kg
    if oedema:
        R["warnings"].append("Oedema: WFA & WFLH may overestimate malnutrition")

    # Height
    h_cm = None
    measure_used = None
    if height_cm is not None and math.isfinite(float(height_cm)) and float(height_cm) > 0:
        h_cm = float(height_cm)
        R["height_cm_raw"] = h_cm
        measure_used = raw_meas.upper() if raw_meas else ("L" if (days is not None and days < 730) else "H")
        R["measure"] = measure_used

    # MUAC
    muac_mm_val = None
    if muac_mm is not None and math.isfinite(float(muac_mm)) and float(muac_mm) > 0:
        muac_mm_val = float(muac_mm)
    elif muac_cm is not None and math.isfinite(float(muac_cm)) and float(muac_cm) > 0:
        muac_mm_val = float(muac_cm) * 10
    R["muac_mm"] = muac_mm_val

    if w_kg and h_cm:
        R["bmi_val"] = _r4(w_kg / math.pow(h_cm / 100, 2))

    R["muac_threshold"] = _classify_muac(muac_mm_val) if muac_mm_val is not None else miss("muac")

    if days is None:
        for k in ("acfa", "bmi", "lhfa", "wfa", "wflh"):
            R[k] = miss("age")
        return R

    oob = (days > MAX_AGE_DAYS) if mode == "day" else (round(months) > MAX_AGE_MONTHS)
    if oob:
        for k in ("acfa", "bmi", "lhfa", "wfa", "wflh"):
            R[k] = f"Age > 60 months (table max {MAX_AGE_DAYS}d)"
        return R

    def set_z(key, zv, cl_fn):
        if zv is None:
            return
        R[f"z_{key}"] = _r4(zv)
        if abs(zv) > FLAG[key]:
            R[f"flag_{key}"] = 1
            R["warnings"].append(f"z_{key}={_r2(zv)} exceeds plausibility |z|>{FLAG[key]}")
        R[key] = cl_fn(zv)

    def lookup_age(tbl_sex):
        if mode == "day":
            return _lookup_day(tbl_sex, days)
        return _lookup_month(tbl_sex, round(months))

    def lookup_ht(tbl_sex):
        step = 0.1 if mode == "day" else 0.5
        return _lookup_cm(tbl_sex, h_cm, step)

    # ── LHFA ──
    if not h_cm:
        R["lhfa"] = miss("height_cm")
    else:
        row = lookup_age(_T["lhfa"][sex])
        if row is None:
            R["lhfa"] = f"No LHFA entry ({'day ' + str(days) if mode == 'day' else 'month ' + str(round(months))})"
        else:
            expected = row.get("loh", "L") if mode == "day" else ("L" if round(months) < 24 else "H")
            h_adj = h_cm
            corr = None
            if expected == "L" and measure_used == "H":
                h_adj = h_cm + MEASURE_CORRECTION
                corr = f"+{MEASURE_CORRECTION}cm (H→L: table expects recumbent)"
            elif expected == "H" and measure_used == "L":
                h_adj = h_cm - MEASURE_CORRECTION
                corr = f"-{MEASURE_CORRECTION}cm (L→H: table expects standing)"
            R["height_cm_adj"] = _r2(h_adj)
            R["measure_correction"] = corr
            set_z("lhfa", lms_z(h_adj, row["l"], row["m"], row["s"]), _classify_zscore)

    # ── WFA ──
    if not w_kg:
        R["wfa"] = miss("weight")
    else:
        row = lookup_age(_T["wfa"][sex])
        if row is None:
            R["wfa"] = "No WFA entry"
        else:
            set_z("wfa", lms_z(w_kg, row["l"], row["m"], row["s"]), _classify_zscore)

    # ── WFLH ──
    if not w_kg:
        R["wflh"] = miss("weight")
    elif not h_cm:
        R["wflh"] = miss("height_cm")
    else:
        use_wfl = (days < 730) if mode == "day" else (round(months) < 24)
        step = 0.1 if mode == "day" else 0.5
        pri = _T["wfl"][sex] if use_wfl else _T["wfh"][sex]
        sec = _T["wfh"][sex] if use_wfl else _T["wfl"][sex]
        row = _lookup_cm(pri, h_cm, step) or _lookup_cm(sec, h_cm, step)
        if row is None:
            R["wflh"] = f"Height {h_cm}cm out of WFLH range (45–120cm)"
        else:
            set_z("wflh", lms_z(w_kg, row["l"], row["m"], row["s"]), _classify_zscore)

    # ── BMI-for-age ──
    if not w_kg or not h_cm:
        R["bmi"] = miss("weight" if not w_kg else "height_cm")
    else:
        row = lookup_age(_T["bmi"][sex])
        if row is None:
            R["bmi"] = "No BMI entry"
        else:
            h_b = R["height_cm_adj"] if R["height_cm_adj"] is not None else h_cm
            bmi_adj = w_kg / math.pow(h_b / 100, 2)
            R["bmi_val"] = _r4(bmi_adj)
            set_z("bmi", lms_z(bmi_adj, row["l"], row["m"], row["s"]), _classify_zscore)

    # ── ACFA ──
    if not muac_mm_val:
        R["acfa"] = miss("muac")
    else:
        min_age = 91 if mode == "day" else 3
        cur_age = days if mode == "day" else round(months)
        if cur_age < min_age:
            R["acfa"] = "Age < 3 months (ACFA starts at day 91)"
        else:
            row = lookup_age(_T["acfa"][sex])
            if row is None:
                R["acfa"] = "No ACFA entry"
            else:
                set_z("acfa", lms_z(muac_mm_val / 10, row["l"], row["m"], row["s"]), _classify_zscore)

    return R


# ── Public API ─────────────────────────────────────────────────────────────────
class create_anthro:
    """
    Instantiate with custom day and month tables (dicts with keys
    wfa, lhfa, bmi, acfa, wfl, wfh). Primarily for testing.
    """
    def __init__(self, day_tables: Dict, month_tables: Dict):
        required = ["wfa", "lhfa", "bmi", "acfa", "wfl", "wfh"]
        for k in required:
            if k not in day_tables:
                raise ValueError(f"anthro: missing day table '{k}'")
            if k not in month_tables:
                raise ValueError(f"anthro: missing month table '{k}'")
        self._td = day_tables
        self._tm = month_tables

    def compute(self, params: Dict) -> Dict:
        mode = params.get("mode", "day")
        return _compute_z_scores(params, self._td, self._tm)

    def batch(self, rows: List[Dict], default_mode: str = "day") -> List[Dict]:
        return [_compute_z_scores({**r, "mode": r.get("mode", default_mode)}, self._td, self._tm)
                for r in rows]


# ── Module-level convenience functions (use bundled data) ──────────────────────
def compute(params: Dict) -> Dict:
    """
    Compute WHO z-scores for a single child.

    Args:
        params: dict with keys:
            sex           – 'm'/'f'/'male'/'female'/'1'/'2'
            dob           – date of birth (date object or 'YYYY-MM-DD')
            measured      – date measured  (date object or 'YYYY-MM-DD')
            age_days      – age in days (alternative to dob/measured)
            age_months    – age in months (alternative to dob/measured)
            weight_kg     – weight in kilograms
            weight_g      – weight in grams (alternative)
            height_cm     – length/height in centimetres
            muac_mm       – MUAC in millimetres
            muac_cm       – MUAC in centimetres (alternative)
            measure       – 'L' (recumbent) or 'H' (standing); auto-inferred if omitted
            oedema        – bool, default False
            mode          – 'day' (default) or 'month'

    Returns:
        dict with z-scores, classifications, flags, errors, warnings.
    """
    return _compute_z_scores(params, _load_day_tables(), _load_month_tables())


def batch(rows: List[Dict], default_mode: str = "day") -> List[Dict]:
    """
    Compute WHO z-scores for a list of children.

    Args:
        rows:         list of param dicts (same keys as compute())
        default_mode: 'day' or 'month'; used when a row omits 'mode'

    Returns:
        list of result dicts.
    """
    td, tm = _load_day_tables(), _load_month_tables()
    return [_compute_z_scores({**r, "mode": r.get("mode", default_mode)}, td, tm)
            for r in rows]
