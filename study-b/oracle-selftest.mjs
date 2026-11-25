import assert from 'node:assert/strict';
import { oracle } from './oracle.mjs';
// Expected results are hand-derived directly from the specification, not program output.
const examples = [
 ['discount', {amount:0}, 0],
 ['discount', {amount:9999}, 0],
 ['discount', {amount:10000}, 1000],
 ['discount', {amount:10009}, 1000],
 ['discount', {amount:10010}, 1001],
 ['discount', {amount:20000}, 2000],
 ['tax', {amount:20000,rate:0}, 0],
 ['tax', {amount:0,rate:2500}, 0],
 ['tax', {amount:1,rate:2500}, 0], // 0.25
 ['tax', {amount:2,rate:2500}, 1], // 0.50
 ['tax', {amount:6,rate:2500}, 2], // 1.50
 ['tax', {amount:5001,rate:1}, 1], // 0.5001
 ['tax', {amount:4999,rate:1}, 0], // 0.4999
 ['tax', {amount:20000,rate:2500}, 5000],
 ['refund', {paid:0,refunded:0,requested:20000}, 0],
 ['refund', {paid:1000,refunded:300,requested:500}, 500],
 ['refund', {paid:1000,refunded:300,requested:800}, 700],
 ['refund', {paid:1000,refunded:300,requested:700}, 700],
 ['refund', {paid:1000,refunded:1000,requested:1}, 0],
 ['refund', {paid:20000,refunded:0,requested:0}, 0],
 ['eligibility', {age:18,tenure:6,suspended:false}, true],
 ['eligibility', {age:17,tenure:6,suspended:false}, false],
 ['eligibility', {age:18,tenure:5,suspended:false}, false],
 ['eligibility', {age:18,tenure:6,suspended:true}, false],
 ['eligibility', {age:100,tenure:60,suspended:false}, true],
 ['eligibility', {age:0,tenure:0,suspended:false}, false],
];
for (const [task,input,expected] of examples) assert.equal(oracle(task,input),expected);
const invalid = [
 ['unknown', {}], ['discount', null], ['discount', []], ['discount', {}],
 ['discount', {amount:1,extra:0}],
 ...[-1,20001,0.5,NaN,Infinity,'10',true,10n].map(amount=>['discount',{amount}]),
 ['tax',{amount:0,rate:2501}], ['tax',{amount:0,rate:-1}],
 ['refund',{paid:10,refunded:11,requested:0}],
 ['refund',{paid:20001,refunded:0,requested:0}],
 ['refund',{paid:10,refunded:0,requested:20001}],
 ['eligibility',{age:101,tenure:6,suspended:false}],
 ['eligibility',{age:18,tenure:61,suspended:false}],
 ['eligibility',{age:18,tenure:6,suspended:0}],
];
for (const [task,input] of invalid) assert.throws(()=>oracle(task,input));
console.log(`oracle self-test passed: ${examples.length} hand-derived examples, ${invalid.length} invalid inputs`);
