#!/usr/bin/env Rscript
#
# scripts/export-tables.R
#
# Re-exports all WHO LMS tables from the R anthro package to data/*.json.
# Run this when updating to a new version of the anthro package.
#
# Usage:
#   Rscript scripts/export-tables.R
#
# Requirements:
#   install.packages("anthro")     # CRAN — maintained by WHO
#   install.packages("jsonlite")
#
# Output: overwrites data/day_*.json and data/month_*.json
# The data/ directory must exist (it is in version control).
#

library(anthro)
library(jsonlite)

# ── Helpers ───────────────────────────────────────────────────────────────────

# Round to 7 decimal places (matches existing table precision)
r7 <- function(x) round(x, 7)

# Convert a data.frame to the compact columnar JSON format used by anthro.js:
# { "M": { "i": [...], "l": [...], "m": [...], "s": [...], "loh": [...] },
#   "F": { ... } }
to_columnar <- function(df, idx_col) {
  out <- list()
  for (sex_code in c(1, 2)) {
    sex_key <- if (sex_code == 1) "M" else "F"
    sub <- df[df$sex == sex_code, ]
    sub <- sub[order(sub[[idx_col]]), ]

    entry <- list(
      i = as.numeric(sub[[idx_col]]),
      l = r7(sub$l),
      m = r7(sub$m),
      s = r7(sub$s)
    )

    # Include loh column if present (lenanthro, bmianthro)
    if ("loh" %in% names(sub)) {
      entry$loh <- as.character(sub$loh)
    }

    out[[sex_key]] <- entry
  }
  out
}

write_json_compact <- function(obj, path) {
  writeLines(toJSON(obj, auto_unbox = TRUE, digits = 10), path)
  cat(sprintf("  wrote %s  (%d M + %d F rows)\n",
      path, length(obj$M$i), length(obj$F$i)))
}

# ── Extract tables from the anthro package namespace ─────────────────────────

env <- asNamespace("anthro")

day_tables <- list(
  wfa  = get("growthstandards_weianthro", envir = env),
  lhfa = get("growthstandards_lenanthro", envir = env),
  bmi  = get("growthstandards_bmianthro", envir = env),
  acfa = get("growthstandards_acanthro",  envir = env)
)

height_tables <- list(
  wfl  = get("growthstandards_wflanthro", envir = env),
  wfh  = get("growthstandards_wfhanthro", envir = env)
)

cat("anthro package version:", as.character(packageVersion("anthro")), "\n\n")

# ── Export day-indexed tables ─────────────────────────────────────────────────

cat("Day-indexed tables:\n")
for (name in names(day_tables)) {
  obj  <- to_columnar(day_tables[[name]], "age")
  path <- sprintf("data/day_%s.json", name)
  write_json_compact(obj, path)
}

# WFL/WFH are indexed by height, not age
cat("\nHeight-indexed tables:\n")
idx_cols <- c(wfl = "length", wfh = "height")
for (name in names(height_tables)) {
  obj  <- to_columnar(height_tables[[name]], idx_cols[[name]])
  path <- sprintf("data/day_%s.json", name)
  write_json_compact(obj, path)
}

# ── Export month-indexed tables ───────────────────────────────────────────────
# The month tables are the WHO supplementary tables, not in the R package.
# They must be updated manually from the WHO website if new versions are published.
# See: https://www.who.int/tools/child-growth-standards/standards

cat("\nMonth-indexed tables (data/month_*.json) are maintained separately.\n")
cat("Update them manually from:\n")
cat("  https://www.who.int/tools/child-growth-standards/standards\n")

cat("\nDone. Run `node test/anthro.test.js` to verify.\n")
