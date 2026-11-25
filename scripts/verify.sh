#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
node study-a/replay.mjs > "$tmp/study-a.json"
node study-b/replay.mjs > "$tmp/study-b.json"
node - "$tmp" <<'JS'
const assert=require('node:assert/strict');
const fs=require('node:fs');
for(const study of ['study-a','study-b']){
  const read=path=>JSON.parse(fs.readFileSync(path));
  const released=read('results/'+study+'.json');
  delete released.provenance;
  assert.deepEqual(read(process.argv[2]+'/'+study+'.json'),released,study);
}
console.log('Both deterministic replays match the released results.');
JS
