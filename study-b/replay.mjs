import {cpSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'releaseradar-'));
try {
  for(const path of ['specs.json','suites.json','PLAN.md','oracle.mjs','faults.mjs','assertions.json','evaluate.mjs','oracle-selftest.mjs','result-audit.mjs']){
    cpSync(fileURLToPath(new URL(path, import.meta.url)),join(dir,path));
  }
  const run=file=>execFileSync(process.execPath,[file],{cwd:dir,encoding:'utf8'});
  process.stderr.write(run('oracle-selftest.mjs'));
  run('evaluate.mjs');
  process.stderr.write(run('result-audit.mjs'));
  const {tasks}=JSON.parse(readFileSync(join(dir,'results.json'),'utf8'));
  const byTask=Object.fromEntries(tasks.map(t=>{
    const counts=arm=>arm.outcomes.filter(o=>o.partition==='heldout' && o.status==='detected').length;
    return [t.id,{starter:counts(t.arms[0]),expanded:counts(t.arms[1]),
      eligibleHeldOut:t.witnesses.filter(v=>v.eligible&&v.partition==='heldout').length,
      oraclePairs:t.audit.count,disagreements:t.audit.disagreements.length}];
  }));
  const sum=k=>Object.values(byTask).reduce((n,r)=>n+r[k],0);
  const caseBudgets=tasks[0].arms.map(a=>a.testCount);
  console.log(JSON.stringify({
    tasks:tasks.length,starterCasesPerTask:caseBudgets[0],expandedCasesPerTask:caseBudgets[1],
    totals:Object.fromEntries(['starter','expanded','eligibleHeldOut','oraclePairs','disagreements'].map(k=>[k,sum(k)])),byTask
  },null,2));
} finally { rmSync(dir,{recursive:true,force:true}); }
