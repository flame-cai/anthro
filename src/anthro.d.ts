export type Sex = 'M' | 'F' | 'male' | 'female' | 'm' | 'f' | 1 | 2 | '1' | '2';
export type Measure = 'L' | 'H' | 'l' | 'h';
export type Mode = 'day' | 'month';

export interface AnthroInput {
  mode?: Mode;
  sex: Sex;
  dob?: string | Date;
  measured?: string | Date;
  age_days?: number;
  age_months?: number;
  weight_kg?: number;
  weight_g?: number;
  height_cm?: number;
  muac_cm?: number;
  muac_mm?: number;
  measure?: Measure;
  oedema?: boolean;
}

export interface AnthroResult {
  mode: Mode;
  sex: 'M' | 'F' | null;
  age_days: number | null;
  age_months: number | null;
  weight_kg: number | null;
  height_cm_raw: number | null;
  height_cm_adj: number | null;
  muac_mm: number | null;
  bmi_val: number | null;
  measure: 'L' | 'H' | null;
  measure_correction: string | null;
  z_lhfa: number | null;
  z_wfa:  number | null;
  z_wflh: number | null;
  z_bmi:  number | null;
  z_acfa: number | null;
  flag_lhfa: 0 | 1;
  flag_wfa:  0 | 1;
  flag_wflh: 0 | 1;
  flag_bmi:  0 | 1;
  flag_acfa: 0 | 1;
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
  wfa(z:  number | null): string | null;
  zscore(z: number | null): string | null;
  muac(mm: number | null): string | null;
}

export interface AnthroMeta {
  version: string;
  repo: string;
  tableIndexing: string;
  tableSource: string;
  primaryCitation: string;
  formula: string;
  precision: string;
  verified: string;
}

export interface AnthroInstance {
  compute(params: AnthroInput): AnthroResult;
  batch(rows: AnthroInput[], defaultMode?: Mode): AnthroResult[];
  classify: ClassifyFunctions;
  lmsZ(X: number, L: number, M: number, S: number): number | null;
  ageDays(dob: string | Date, measured?: string | Date): number | null;
  monthsToDays(months: number): number;
  meta: AnthroMeta;
}

export declare function createAnthro(dayTables: WHOTables, monthTables: WHOTables): AnthroInstance;
export declare function computeZScores(params: AnthroInput & { _T: any }): AnthroResult;
export declare function computeBatch(rows: AnthroInput[], T: any, defaultMode?: Mode): AnthroResult[];
export declare const classify: ClassifyFunctions;
export declare function lmsZ(X: number, L: number, M: number, S: number): number | null;
export declare function ageDays(dob: string | Date, measured?: string | Date): number | null;
export declare function monthsToDays(months: number): number;
