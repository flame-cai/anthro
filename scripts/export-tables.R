#!/usr/bin/env Rscript
# Exports WHO LMS tables from R package anthro to data/*.json
# Run after updating the anthro package to pick up new WHO tables.
#
# Requirements: install.packages(c("anthro", "jsonlite"))
# Usage:        Rscript scripts/export-tables.R

library(anthro)
library(jsonlite)

env <- asNamespace("anthro")
cat("anthro package version:", as.character(packageVersion("anthro")), "\n")

r7 <- function(x) round(x, 7)

to_columnar <- function(df, idx_col) {
  out <- list()
  for (code in c(1, 2)) {
    key <- if (code == 1) "M" else "F"
    sub <- df[df$sex == code, , drop = FALSE]
    sub <- sub[order(sub[[idx_col]]), ]
    entry <- list(i = as.numeric(sub[[idx_col]]),
                  l = r7(sub$l), m = r7(sub$m), s = r7(sub$s))
    if ("loh" %in% names(sub)) entry$loh <- as.character(sub$loh)
    out[[key]] <- entry
  }
  out
}

write_table <- function(obj, path) {
  writeLines(toJSON(obj, auto_unbox = TRUE, digits = 10), path)
  cat(sprintf("  wrote %-30s (%d M + %d F rows)\n",
    path, length(obj$M$i), length(obj$F$i)))
}

age_tables <- c(wfa = "weianthro", lhfa = "lenanthro",
                bmi = "bmianthro", acfa = "acanthro")
ht_tables  <- c(wfl = "wflanthro", wfh  = "wfhanthro")
ht_cols    <- c(wfl = "length",    wfh  = "height")

cat("\nDay-indexed:\n")
for (name in names(age_tables)) {
  df  <- get(paste0("growthstandards_", age_tables[[name]]), envir = env)
  write_table(to_columnar(df, "age"), sprintf("data/day_%s.json", name))
}
for (name in names(ht_tables)) {
  df  <- get(paste0("growthstandards_", ht_tables[[name]]), envir = env)
  write_table(to_columnar(df, ht_cols[[name]]), sprintf("data/day_%s.json", name))
}

cat("\nMonth-indexed tables (data/month_*.json) are maintained separately.\n")
cat("Source: https://www.who.int/tools/child-growth-standards/standards\n")
cat("\nRun `node test/anthro.test.js` to verify.\n")
