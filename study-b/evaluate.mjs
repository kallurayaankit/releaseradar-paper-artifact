import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {oracle} from './oracle.mjs';
const read=f=>JSON.parse(readFileSync(f,'utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const specs=read('specs.json'),inputSuites=read('suites.json');
// Assertions freeze before this process imports any evaluated implementation.
const suites=Object.fromEntries(specs.tasks.map(t=>[t.id,inputSuites[t.id].map((input,i)=>({id:`${t.id}-${i+1}`,input,expected:oracle(t.id,input)}))]));
const serialized=JSON.stringify(suites,null,2)+'\n';
let prior;try{prior=readFileSync('assertions.json','utf8')}catch{}
if(prior&&prior!==serialized)throw Error('Frozen assertions mismatch');
if(!prior)writeFileSync('assertions.json',serialized);
const {correct,faults}=await import('./faults.mjs');
const observe=(run,t)=>{try{const actual=run(t.input);return {actual,pass:actual===t.expected,error:null}}catch(e){return {actual:null,pass:false,error:e.message}}};
function auditInputs(task){const rows=[];if(task==='discount')for(let amount=0;amount<=20000;amount++)rows.push({amount});if(task==='tax')for(let amount=0;amount<=20000;amount+=100)for(let rate=0;rate<=2500;rate+=100)rows.push({amount,rate});if(task==='refund')for(let paid=0;paid<=30;paid++)for(let refunded=0;refunded<=paid;refunded++)for(let requested=0;requested<=31;requested++)rows.push({paid,refunded,requested});if(task==='eligibility')for(let age=0;age<=100;age++)for(let tenure=0;tenure<=60;tenure++)for(const suspended of [false,true])rows.push({age,tenure,suspended});return rows;}
const tasks=specs.tasks.map(({id})=>{
 const audit=auditInputs(id).map(input=>{try{const expected=oracle(id,input),actual=correct(id,input);return {input,expected,actual,pass:expected===actual,error:null}}catch(e){return {input,pass:false,error:e.message}}});
 const disagreements=audit.filter(x=>!x.pass);
 const witnesses=faults.filter(f=>f.task===id).map(f=>{let expected,actual,error=null;try{expected=oracle(id,f.witness);actual=f.run(f.witness)}catch(e){error=e.message}return {id:f.id,partition:f.partition,intent:f.intent,input:f.witness,expected:expected??null,actual:actual??null,error,eligible:!error&&expected!==actual}});
 const arms=[['baseline',suites[id].slice(0,3)],['deterministic_boundary',suites[id]]].map(([arm,tests])=>{
  const controls=tests.map(t=>({caseId:t.id,...observe(input=>correct(id,input),t)}));
  const controlPass=!disagreements.length&&controls.every(x=>x.pass&&!x.error);
  const outcomes=faults.filter(f=>f.task===id).map(f=>{const observations=tests.map(t=>({caseId:t.id,...observe(f.run,t)}));const eligible=witnesses.find(w=>w.id===f.id).eligible;const status=!eligible?'ineligible':!controlPass||observations.some(x=>x.error)?'inconclusive':observations.some(x=>!x.pass)?'detected':'survived';return {id:f.id,partition:f.partition,status,observations}});
  return {arm,testCount:tests.length,controlPass,controls,outcomes};
 });
 return {id,audit:{count:audit.length,sha256:sha(JSON.stringify(audit.map(x=>x.input))),disagreements},witnesses,arms};
});
const files=['specs.json','suites.json','PLAN.md','oracle.mjs','faults.mjs','assertions.json','evaluate.mjs'];
const result={schemaVersion:1,scope:'Four synthetic tasks, deterministic suites only, context-separated code authorship; no independent human review or AI-generation comparison',node:process.version,platform:process.platform,hashes:Object.fromEntries(files.map(f=>[f,sha(readFileSync(f))])),tasks};
writeFileSync('results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(tasks.map(t=>({task:t.id,auditCount:t.audit.count,oracleDisagreements:t.audit.disagreements.length,eligible:t.witnesses.filter(w=>w.eligible).length,arms:t.arms.map(a=>({arm:a.arm,tests:a.testCount,controlPass:a.controlPass,development:a.outcomes.filter(x=>x.partition==='development').map(x=>({id:x.id,status:x.status})),heldout:a.outcomes.filter(x=>x.partition==='heldout').map(x=>({id:x.id,status:x.status}))}))})),null,2));
