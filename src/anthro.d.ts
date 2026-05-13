/**
 * TypeScript declarations for anthro.js v2.0.0
 * WHO 2006 Child Growth Standards library
 */

export type Sex = 'M' | 'F' | 'male' | 'female' | 'm' | 'f' | 1 | 2 | '1' | '2';
export type Measure = 'L' | 'H' | 'l' | 'h';

export interface AnthroInput {
  sex: Sex;
  // Age — provide one:
  dob?: string | Date;
  measured?: string | Date;
  age_days?: number;
  age_months?: number;
  // Anthropometry:
  weight_kg?: number;
  weight_g?: number;
  height_cm?: number;
  muac_cm?: number;
  muac_mm?: number;
  // Method:
  measure?: Measure;
  oedema?: boolean;
}

export interface AnthroResult {
  sex: 'M' | 'F' | null;
  age_days: number | null;
  age_months: number | null;
  weight_kg: number | null;
  height_cm_raw: number | null;
  height_cm_adj: number | null;
  muac_mm: number | null;
  bmi: string | null;
  measure: 'L' | 'H' | null;
  measure_correction: string | null;
  // Z-scores (4 decimal places)
  z_lhfa: number | null;
  z_wfa:  number | null;
  z_wflh: number | null;
  z_bmi:  number | null;
  z_acfa: number | null;
  // Plausibility flags (1 = implausible per WHO igrowup)
  flag_lhfa: 0 | 1;
  flag_wfa:  0 | 1;
  flag_wflh: 0 | 1;
  flag_bmi:  0 | 1;
  flag_acfa: 0 | 1;
  // Classifications (6 indicators)
  muac_threshold: string | null;
  acfa:  string | null;
  bmi:   string | null;
  lhfa:  string | null;
  wfa:   string | null;
  wflh:  string | null;
  errors:   string[];
  warnings: string[];
}

export interface WHOTable {
  M: { i: number[]; l: number[]; m: number[]; s: number[]; loh?: string[] };
  F: { i: number[]; l: number[]; m: number[]; s: number[]; loh?: string[] };
}

export interface WHOTables {
  wfa:  WHOTable;
  lhfa: WHOTable;
  bmi:  WHOTable;
  acfa: WHOTable;
  wfl:  WHOTable;
  wfh:  WHOTable;
}

export interface ClassifyFunctions {
  wflh(z: number | null): string | null;
  lhfa(z: number | null): string | null;
  wfa(z: number | null):  string | null;
  zscore(z: number | null): string | null;
  muac(mm: number | null): string | null;
}

export interface LibraryMeta {
  version: string;
  tableSource: string;
  tableIndexing: string;
  tableVia: string;
  primaryCitation: string;
  softwareCitation: string;
  classificationCitation: string;
  formula: string;
  measureCorrection: string;
}

export interface AnthroInstance {
  compute(params: AnthroInput): AnthroResult;
  batch(rows: AnthroInput[]): AnthroResult[];
  classify: ClassifyFunctions;
  lmsZ(X: number, L: number, M: number, S: number): number | null;
  ageDays(dob: string | Date, measured?: string | Date): number | null;
  monthsToDays(months: number): number;
  meta: LibraryMeta;
}

/**
 * Create an anthro instance with pre-loaded WHO tables.
 * Load tables from the /data/ JSON files.
 */
export declare function createAnthro(tables: WHOTables): AnthroInstance;

export declare function computeZScores(params: AnthroInput & { _T: any }): AnthroResult;
export declare function computeBatch(rows: AnthroInput[], tables: any): AnthroResult[];
export declare const classify: ClassifyFunctions;
export declare function lmsZ(X: number, L: number, M: number, S: number): number | null;
export declare function ageDays(dob: string | Date, measured?: string | Date): number | null;
export declare function monthsToDays(months: number): number;
