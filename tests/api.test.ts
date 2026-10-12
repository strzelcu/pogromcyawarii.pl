import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POST as create } from '../app/api/demo/repairs/route';
import { POST as shipping } from '../app/api/demo/shipping/route';
import { createSeed } from '../lib/seed';
function request(body: unknown) {
  return new Request('http://localhost/api/demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
test('Node API validates repair and returns stateless demo record', async () => {
  const { repairs } = createSeed();
  const response = await create(request({ input: repairs[0], userId: 'client-anna' }));
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.demo, true);
  assert.equal(body.repair.status, 'submitted');
  assert.match(body.repair.id, /^PA-/);
  assert.equal((await create(request({ input: {}, userId: '' }))).status, 400);
  assert.equal(
    (await create(new Request('http://localhost', { method: 'POST', body: '{' }))).status,
    400,
  );
});
test('mock courier generates test tracking only and rejects invalid direction', async () => {
  const response = await shipping(request({ repairId: 'PA-DEMO-001', direction: 'return' }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(body.shipment.tracking, /^DEMO-/);
  assert.equal(body.shipment.direction, 'return');
  assert.equal(
    (await shipping(request({ repairId: 'PA-DEMO-001', direction: 'other' }))).status,
    400,
  );
});

test('demo endpoints reject oversized payloads even without a content-length header', async () => {
  const payload = { large: 'x'.repeat(17000) };
  assert.equal((await create(request(payload))).status, 413);
  assert.equal((await shipping(request(payload))).status, 413);
});
