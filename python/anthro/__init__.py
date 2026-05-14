"""
anthro — WHO 2006 Child Growth Standards
z-scores and classifications for 6 indicators.

Python port of the @flame-cai/anthro JavaScript library.
"""

import os as _os

def _read_version():
    _here = _os.path.dirname(_os.path.abspath(__file__))
    _vfile = _os.path.join(_here, "..", "..", "VERSION")
    try:
        with open(_vfile) as _f:
            return _f.read().strip()
    except OSError:
        return "unknown"

__version__ = _read_version()

from .anthro import compute, batch, classify, lms_z, age_days, months_to_days, create_anthro

__all__ = ["compute", "batch", "classify", "lms_z", "age_days", "months_to_days", "create_anthro", "__version__"]
