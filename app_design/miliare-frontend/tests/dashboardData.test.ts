import assert from 'node:assert';
import {
  chartConfig,
  earningsData6Months,
  earningsData12Months,
  earningsDataYear,
} from '../lib/dashboardData';

assert.ok(Array.isArray(earningsData6Months));
assert.ok(Array.isArray(earningsData12Months));
assert.ok(Array.isArray(earningsDataYear));
assert.ok('earnings' in chartConfig);
console.log('dashboardData.test passed');
