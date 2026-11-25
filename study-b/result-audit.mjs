import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const r=JSON.parse(readFileSync('results.json'));
assert.equal(r.tasks.length,4);
for(const [f,h] of Object.entries(r.hashes))assert.equal(createHash('sha256').update(readFileSync(f)).digest('hex'),h,f);
for(const t of r.tasks){assert.equal(t.witnesses.length,6);assert.equal(new Set(t.witnesses.map(x=>x.id)).size,6);for(const p of ['development','heldout'])assert.equal(t.witnesses.filter(x=>x.partition===p).length,3);assert.ok(t.witnesses.every(x=>x.eligible&&!x.error));assert.equal(t.audit.disagreements.length,0);assert.deepEqual(t.arms.map(x=>x.testCount),[3,12]);for(const a of t.arms){assert.equal(a.outcomes.length,6);assert.equal(a.controls.length,a.testCount);assert.equal(new Set(a.controls.map(x=>x.caseId)).size,a.testCount);assert.equal(a.controlPass,true);for(const o of a.outcomes){assert.equal(o.observations.length,a.testCount);assert.equal(new Set(o.observations.map(x=>x.caseId)).size,a.testCount);assert.ok(o.observations.every(x=>!x.error));assert.equal(o.status,o.observations.some(x=>!x.pass)?'detected':'survived')}}}
for(const [arm,partition,count] of [['baseline','heldout',2],['baseline','development',5],['deterministic_boundary','heldout',12],['deterministic_boundary','development',12]]){const outcomes=r.tasks.flatMap(t=>t.arms.find(a=>a.arm===arm).outcomes.filter(x=>x.partition===partition));assert.equal(outcomes.length,12);assert.equal(outcomes.filter(x=>x.status==='detected').length,count)}
console.log('PASS: source hashes, 4 tasks, 24 eligible distinct-ID witnesses, 12 held-out denominators, complete case identities, observed classifications, and aggregate counts.');
