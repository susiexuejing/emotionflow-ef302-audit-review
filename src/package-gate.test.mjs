import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { checkPackageBytes } from './package-gate.mjs';
const names = ['scope','policy','output_schema','collector','teardown',
  'private_path_proof','logging_proof','single_use_control','cost_limit'];
function fixture() {
  const parts = Object.fromEntries(names.map(n => [n, Buffer.from('synthetic-'+n)]));
  const digests = Object.fromEntries(names.map(n => [n,
    'sha256:'+createHash('sha256').update(parts[n]).digest('hex')]));
  return { parts, digests };
}
test('matching bytes never grant execution or attest provider readiness', () => {
  const {parts,digests}=fixture();
  assert.deepEqual(checkPackageBytes(parts,digests),
    {integrity:'matched',execution_authorized:false});
});
test('each missing, changed, empty or unbound component rejects', () => {
  for (const n of names) {
    for (const mode of ['missing','changed','empty','unbound']) {
      const {parts,digests}=fixture();
      if(mode==='missing') delete parts[n];
      if(mode==='changed') parts[n]=Buffer.from('changed');
      if(mode==='empty') parts[n]=Buffer.alloc(0);
      if(mode==='unbound') delete digests[n];
      assert.throws(()=>checkPackageBytes(parts,digests));
    }
  }
});
test('unknown, hidden and accessor fields reject without reading them', () => {
  for (const target of ['parts','digests']) {
    const f=fixture();
    Object.defineProperty(f[target], 'extra', {value:'synthetic',enumerable:false});
    assert.throws(()=>checkPackageBytes(f.parts,f.digests));
    const g=fixture();
    let called=false;
    Object.defineProperty(g[target],names[0],{get(){called=true;throw Error('raw');}});
    assert.throws(()=>checkPackageBytes(g.parts,g.digests));
    assert.equal(called,false);
  }
});
test('fixed errors do not include supplied bytes or binding values', () => {
  const {parts,digests}=fixture();
  parts.scope=Buffer.from('synthetic-private-marker');
  assert.throws(()=>checkPackageBytes(parts,digests),
    e=>e.message==='Package integrity check failed');
});
