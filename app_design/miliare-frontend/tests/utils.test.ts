import assert from 'node:assert';
import { cn } from '../lib/utils';

assert.equal(cn('foo', 'bar'), 'foo bar');
assert.equal(cn('p-2', 'p-4'), 'p-4');
assert.equal(cn('text-left', { 'text-right': true }), 'text-right');
console.log('utils.test passed');
