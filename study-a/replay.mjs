import assert from 'node:assert/strict';
import {checkout} from './fixture/checkout.js';
import {baseline, prepared} from './fixture/scenario.js';
import {freezePlan, classify, variants} from './fixture/challenge-core.js';
const controls = ['correct','fixed'];
function replay(tests) {
  const plan=freezePlan({summary:'Replay of the prepared checkout cases',tests});
  const rows=[...controls,...variants.map(v=>v.id)].flatMap(version=>
    plan.tests.map(t=>({version,name:t.name,error:null,pass:checkout(t.subtotal,t.discount,version).shipping===t.expectedShipping})));
  assert.ok(rows.filter(row=>controls.includes(row.version)).every(row=>row.pass));
  const outcomes=Object.fromEntries(classify(rows,plan.tests).map(v=>[v.id,v.status]));
  assert.ok(Object.values(outcomes).every(v=>v==='detected'||v==='missed'));
  return {cases:plan.tests.length,detected:Object.values(outcomes).filter(v=>v==='detected').length,outcomes};
}
const starter=replay(baseline), expanded=replay([...baseline,...prepared.tests]);
console.log(JSON.stringify({starter,expanded,variants:variants.length,correctAndFixedControlsPass:true},null,2));
