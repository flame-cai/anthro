"""
anthro-who — WHO 2006 Child Growth Standards
z-scores and classifications for 6 indicators.

Python port of the @flame-cai/anthro JavaScript library.
"""

from .anthro import compute, batch, classify, lms_z, age_days, months_to_days, create_anthro

__version__ = "1.1.1"
__all__ = ["compute", "batch", "classify", "lms_z", "age_days", "months_to_days", "create_anthro"]
