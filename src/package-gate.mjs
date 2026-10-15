// Offline package integrity check only. Never an execution authorization.
import { createHash } from 'node:crypto';

const PARTS = Object.freeze([
  'scope', 'policy', 'output_schema', 'collector', 'teardown',
  'private_path_proof', 'logging_proof', 'single_use_control', 'cost_limit'
]);
const fail = () => { throw new Error('Package integrity check failed'); };
function exact(value, keys) {
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) fail();
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const names = Reflect.ownKeys(descriptors);
  if (names.length !== keys.length || names.some(k => !keys.includes(k))) fail();
  if (keys.some(k => !Object.hasOwn(descriptors[k], 'value'))) fail();
}
const sha = bytes => 'sha256:' + createHash('sha256').update(bytes).digest('hex');

/**
 * Inputs are bytes already supplied by an offline caller. This function never
 * opens files, calls adapters or returns their contents. Reviewed bindings must
 * be obtained independently; passing caller-chosen hashes proves no review,
 * cloud configuration, permission, private route, cost cap or one-run control.
 */
export function checkPackageBytes(parts, reviewedDigests) {
  exact(parts, PARTS);
  exact(reviewedDigests, PARTS);
  for (const name of PARTS) {
    const bytes = parts[name];
    const expected = reviewedDigests[name];
    if (!Buffer.isBuffer(bytes) || bytes.length === 0 ||
        typeof expected !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(expected) ||
        sha(bytes) !== expected) fail();
  }
  return Object.freeze({integrity: 'matched', execution_authorized: false});
}
