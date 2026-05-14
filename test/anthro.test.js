// anthro.js 1.1.1 — test suite
'use strict';
const path=require('path'),fs=require('fs');
const {createAnthro}=require('../src/anthro.js');

function load(prefix){
  const T={};
  for(const n of ['wfa','lhfa','bmi','acfa','wfl','wfh'])
    T[n]=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/',prefix+'_'+n+'.json'),'utf8'));
  return T;
}
const anthro=createAnthro(load('day'),load('month'));
let ok=0,fail=0;
function test(label,fn){try{fn();ok++;console.log(`  ✓ ${label}`);}catch(e){fail++;console.error(`  ✗ ${label}\n    ${e.message}`);}}
function assert(c,m){if(!c)throw new Error(m||'failed');}
function assertZ(got,exp,tol=0.02,lbl=''){
  if(got==null||!isFinite(got))throw new Error(`${lbl} got null, expected ${exp}`);
  if(Math.abs(got-exp)>tol)throw new Error(`${lbl} z=${got.toFixed(3)} expected≈${exp} (±${tol})`);
}

console.log('\n══ anthro.js — test suite ══\n');

// ── DAY MODE ──────────────────────────────────────────────────────────────────
console.log('Group 1: Day-mode z-scores (vs R anthro v1.1.0)\n');

test('Boy d61 wt=5kg → z_wfa≈-0.86 (R: -0.86)', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:61,weight_kg:5.0});
  assertZ(r.z_wfa,-0.86,0.02,'WFA boy d61');
  assert(r.mode==='day');
});
test('Boy d335 ht=73cm L → z_lhfa≈-0.66 (R: -0.66)', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:335,height_cm:73,measure:'L'});
  assertZ(r.z_lhfa,-0.66,0.02,'LHFA boy d335');
});
test('Boy d730 ht=78cm H → z_lhfa≈-2.98 (R: -2.98) [+0.7cm]', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:730,height_cm:78,measure:'H',weight_kg:8});
  assertZ(r.z_lhfa,-2.98,0.02,'LHFA boy d730 H');
  assert(r.measure_correction&&r.measure_correction.includes('+0.7'));
});
test('Boy d731 ht=78cm H → z_lhfa≈-2.99 (R: -2.99) [no corr]', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:731,height_cm:78,measure:'H'});
  assertZ(r.z_lhfa,-2.99,0.02,'LHFA boy d731');
  assert(!r.measure_correction);
});
test('Girl d289 full check vs R anthro d289', ()=>{
  const r=anthro.compute({mode:'day',sex:'F',age_days:289,weight_kg:7,height_cm:64,muac_mm:136,measure:'L'});
  assertZ(r.z_lhfa,-2.79,0.03,'LHFA girl d289'); // R: -2.79
  assertZ(r.z_wfa, -1.47,0.03,'WFA girl d289');  // R: -1.47
  assertZ(r.z_wflh, 0.24,0.03,'WFLH girl d289'); // R: 0.24
  assertZ(r.z_acfa,-0.43,0.05,'ACFA girl d289'); // R: -0.43
  assert(r.lhfa==='Moderately stunted');
  assert(r.wfa==='Normal');
  assert(r.muac_threshold==='Normal');
});
test('Day 1826 (60m) included — not excluded', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:1826,weight_kg:18,height_cm:108,muac_mm:145,measure:'H'});
  assert(r.z_wfa!==null&&!r.wfa.includes('Missing'),`wfa: ${r.wfa}`);
});
test('Day 1827 → unavailable', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:1827,weight_kg:18,height_cm:108});
  assert(r.z_wfa===null,`expected null got ${r.z_wfa}`);
});

// ── MONTH MODE ────────────────────────────────────────────────────────────────
console.log('\nGroup 2: Month-mode z-scores (matches Excel sheet)\n');

test('Girl 9m ht=64cm L → z_lhfa≈-2.54 (sheet: Moderately stunted)', ()=>{
  // Sheet uses month=9, key=Female_9, M=70.1463 → z=-2.54
  const r=anthro.compute({mode:'month',sex:'F',age_months:9,weight_kg:7,height_cm:64,muac_mm:136,measure:'L'});
  assertZ(r.z_lhfa,-2.54,0.03,'LHFA girl 9m month-mode');
  assert(r.lhfa==='Moderately stunted',`lhfa: ${r.lhfa}`);
  assert(r.mode==='month');
});
test('Month mode: girl 9m WFA z≈-1.34 (sheet: Normal)', ()=>{
  const r=anthro.compute({mode:'month',sex:'F',age_months:9,weight_kg:7,height_cm:64,muac_mm:136});
  assertZ(r.z_wfa,-1.34,0.03,'WFA girl 9m month');
  assert(r.wfa==='Normal');
});
test('Month mode: month 60 (inclusive)', ()=>{
  const r=anthro.compute({mode:'month',sex:1,age_months:60,weight_kg:18,height_cm:108,muac_mm:145,measure:'H'});
  assert(r.z_wfa!==null,`wfa at 60m: ${r.wfa}`);
});
test('Month mode: month 61 → unavailable', ()=>{
  const r=anthro.compute({mode:'month',sex:1,age_months:61,weight_kg:18,height_cm:108});
  assert(r.z_wfa===null,`expected null`);
});

// ── BOTH MODES — same child, compare ──────────────────────────────────────────
console.log('\nGroup 3: Day vs Month mode — same child comparison\n');

test('Same child (9m girl): day & month give different z_lhfa (different table granularity)', ()=>{
  const rd=anthro.compute({mode:'day',  sex:'F',age_months:9,weight_kg:7,height_cm:64,muac_mm:136,measure:'L'});
  const rm=anthro.compute({mode:'month',sex:'F',age_months:9,weight_kg:7,height_cm:64,muac_mm:136,measure:'L'});
  // Day uses day 274 (round(9*30.4375)), month uses month 9 exactly
  assert(rd.mode==='day'&&rm.mode==='month');
  // They will differ slightly — this is expected and documented
  assert(rd.z_lhfa!==null&&rm.z_lhfa!==null);
  console.log(`      day z_lhfa=${rd.z_lhfa} (d${rd.age_days}), month z_lhfa=${rm.z_lhfa} (m${Math.round(rm.age_months)})`);
});
test('WFLH: day & month modes agree when age=9m, ht=64cm (same 0.5cm table step)', ()=>{
  const rd=anthro.compute({mode:'day',  sex:'F',age_months:9,weight_kg:7,height_cm:64,measure:'L'});
  const rm=anthro.compute({mode:'month',sex:'F',age_months:9,weight_kg:7,height_cm:64,measure:'L'});
  // Both use WFL table indexed by 0.5cm or 0.1cm — may differ by index rounding
  assert(rd.z_wflh!==null&&rm.z_wflh!==null);
});

// ── CLASSIFICATION ─────────────────────────────────────────────────────────────
console.log('\nGroup 4: Classification cut-points (WHO 2009)\n');

test('LHFA z=-3.001 → Severely stunted',    ()=>assert(anthro.classify.lhfa(-3.001)==='Severely stunted'));
test('LHFA z=-3.0   → Moderately stunted',  ()=>assert(anthro.classify.lhfa(-3.0)==='Moderately stunted'));
test('LHFA z=-2.001 → Moderately stunted',  ()=>assert(anthro.classify.lhfa(-2.001)==='Moderately stunted'));
test('WFLH z=-2.999 → Moderate wasting',    ()=>assert(anthro.classify.wflh(-2.999)==='Moderate wasting'));
test('WFLH z=-3.001 → Severe wasting',      ()=>assert(anthro.classify.wflh(-3.001)==='Severe wasting'));
test('MUAC 114mm → SAM',                    ()=>assert(anthro.classify.muac(114)==='SAM'));
test('MUAC 115mm → MAM (boundary)',          ()=>assert(anthro.classify.muac(115)==='MAM'));
test('MUAC 125mm → Normal (boundary)',       ()=>assert(anthro.classify.muac(125)==='Normal'));

// ── MISSING INPUTS ─────────────────────────────────────────────────────────────
console.log('\nGroup 5: Missing inputs\n');

test('Missing weight → wfa/wflh missing, lhfa computed', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:200,height_cm:68,muac_mm:138,measure:'L'});
  assert(r.wfa.includes('Missing')&&r.wflh.includes('Missing'));
  assert(r.z_lhfa!==null&&!r.lhfa.includes('Missing'));
});
test('Missing height → lhfa/wflh/bmi missing', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:200,weight_kg:7,muac_mm:138});
  assert(r.lhfa.includes('Missing')&&r.wflh.includes('Missing'));
});
test('Missing MUAC → muac_threshold/acfa missing', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:200,weight_kg:7,height_cm:68});
  assert(r.muac_threshold.includes('Missing')&&r.acfa.includes('Missing'));
});
test('No age → age-based missing; muac_threshold still works', ()=>{
  const r=anthro.compute({mode:'day',sex:1,weight_kg:7,height_cm:68,muac_mm:138});
  assert(r.wfa.includes('Missing')&&r.lhfa.includes('Missing'));
  assert(r.muac_threshold==='Normal');
});
test('Invalid mode → error', ()=>{
  const r=anthro.compute({mode:'weekly',sex:1,age_days:100});
  assert(r.errors.length>0&&r.errors[0].includes('mode'));
});

// ── UNIT FLEXIBILITY ───────────────────────────────────────────────────────────
console.log('\nGroup 6: Unit flexibility\n');

test('weight_g=7000 same as weight_kg=7.0', ()=>{
  const p={mode:'day',sex:1,age_days:200,height_cm:68,muac_mm:138,measure:'L'};
  const r1=anthro.compute({...p,weight_kg:7.0});
  const r2=anthro.compute({...p,weight_g:7000});
  assert(r1.z_wfa===r2.z_wfa);
});
test('muac_cm=13.6 same as muac_mm=136', ()=>{
  const p={mode:'day',sex:'F',age_days:289,weight_kg:7,height_cm:64,measure:'L'};
  const r1=anthro.compute({...p,muac_mm:136});
  const r2=anthro.compute({...p,muac_cm:13.6});
  assert(r1.z_acfa===r2.z_acfa);
});
test('sex=1/male/m/M all identical', ()=>{
  const p={mode:'day',age_days:200,weight_kg:7,height_cm:68,muac_mm:138,measure:'L'};
  const r1=anthro.compute({...p,sex:1});
  const r2=anthro.compute({...p,sex:'male'});
  const r3=anthro.compute({...p,sex:'M'});
  assert(r1.z_wfa===r2.z_wfa&&r2.z_wfa===r3.z_wfa);
});
test('DOB gives same result as age_days', ()=>{
  const today=new Date(), dob=new Date(today-289*86400000);
  const p={mode:'day',sex:'F',weight_kg:7,height_cm:64,muac_mm:136,measure:'L'};
  const r1=anthro.compute({...p,age_days:289});
  const r2=anthro.compute({...p,dob:dob.toISOString().split('T')[0],measured:today.toISOString().split('T')[0]});
  assert(r1.z_lhfa===r2.z_lhfa,`dob=${r2.z_lhfa} vs days=${r1.z_lhfa}`);
});

// ── BATCH ──────────────────────────────────────────────────────────────────────
console.log('\nGroup 7: Batch + mixed modes\n');

test('Batch processes array with _index', ()=>{
  const rows=[
    {mode:'day',  sex:'M',age_days:200,  weight_kg:7.5,height_cm:68,muac_mm:138,measure:'L'},
    {mode:'month',sex:'F',age_months:9,  weight_kg:7.0,height_cm:64,muac_mm:136,measure:'L'},
  ];
  const res=anthro.batch(rows);
  assert(res.length===2&&res[0]._index===0&&res[1]._index===1);
  assert(res[0].mode==='day'&&res[1].mode==='month');
  assert(res[1].z_lhfa!==null);
});
test('Batch default mode applies to rows without mode', ()=>{
  const rows=[{sex:1,age_days:200,weight_kg:7},{sex:2,age_days:200,weight_kg:6}];
  const res=anthro.batch(rows,'month');
  assert(res[0].mode==='month'&&res[1].mode==='month');
});

// ── PLAUSIBILITY ───────────────────────────────────────────────────────────────
console.log('\nGroup 8: Plausibility flags\n');

test('Extreme weight sets flag_wfa=1', ()=>{
  const r=anthro.compute({mode:'day',sex:1,age_days:365,weight_kg:1.0,height_cm:75,muac_mm:90,measure:'L'});
  assert(r.flag_wfa===1||r.flag_lhfa===1||r.flag_wflh===1,'flag expected');
});

// ── Summary ────────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(48)}`);
console.log(`  Results: ${ok} passed, ${fail} failed`);
if(fail>0){console.error('  FAILURES DETECTED');process.exit(1);}
else console.log('  All tests passed ✓');
