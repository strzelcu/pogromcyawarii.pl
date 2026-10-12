import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../lib/seed';
import {
  advanceStatus,
  canRead,
  createRepair,
  decideQuote,
  nextStatuses,
  publishQuote,
  repairInputSchema,
  sendInbound,
  sendReturn,
} from '../lib/domain';
import { authProvider, repairRepository } from '../lib/mock-services';

test('complete accepted repair flow requires client approval and both shipments', () => {
  const { users, repairs } = createSeed();
  const [client, , staff] = users;
  let r = createRepair(repairs[0], client.id);
  const inbound = {
    direction: 'inbound' as const,
    tracking: 'DEMO-IN',
    createdAt: new Date().toISOString(),
  };
  r = sendInbound(r, client, inbound);
  assert.throws(() => advanceStatus(r, client, 'received'));
  r = advanceStatus(r, staff, 'received');
  r = advanceStatus(r, staff, 'diagnostics');
  assert.throws(() => advanceStatus(r, staff, 'repairing'));
  assert.throws(() => publishQuote(r, staff, NaN, 'Long enough diagnosis'));
  r = publishQuote(r, staff, 299.99, 'Wymiana uszkodzonego układu zasilania.');
  assert.throws(() => decideQuote(r, staff, true));
  assert.throws(() => sendReturn(r, staff, { ...inbound, direction: 'return' }));
  r = decideQuote(r, client, true);
  assert.throws(() => decideQuote(r, client, true));
  r = sendReturn(r, staff, { ...inbound, direction: 'return', tracking: 'DEMO-OUT' });
  r = advanceStatus(r, staff, 'completed');
  assert.equal(r.status, 'completed');
  assert.equal(r.shipments.length, 2);
  assert.equal(r.quote?.decision, 'accepted');
  assert.equal(r.history.length, 8);
});
test('rejected quote returns equipment without reopening diagnosis or repair', () => {
  const { users, repairs } = createSeed();
  let r = decideQuote(repairs[0], users[0], false);
  assert.equal(r.quote?.decision, 'rejected');
  assert.deepEqual(nextStatuses(r), []);
  assert.throws(() => advanceStatus(r, users[2], 'diagnostics'));
  r = sendReturn(r, users[2], {
    direction: 'return',
    tracking: 'DEMO-OUT',
    createdAt: new Date().toISOString(),
  });
  assert.equal(advanceStatus(r, users[2], 'completed').status, 'completed');
});
test('clients cannot read or modify another client repair', () => {
  const { users, repairs } = createSeed();
  assert.equal(canRead(users[1], repairs[0]), false);
  assert.throws(() => decideQuote(repairs[0], users[1], true));
  assert.throws(() => publishQuote(repairs[0], users[0], 100, 'Test diagnosis'));
});
test('form rejects invalid contact information and too short problem descriptions', () => {
  const { repairs } = createSeed();
  assert.equal(repairInputSchema.safeParse({ ...repairs[0], problem: 'x' }).success, false);
  assert.equal(
    repairInputSchema.safeParse({
      ...repairs[0],
      sender: {
        ...repairs[0].sender,
        email: 'bad',
        address: { ...repairs[0].sender.address, postalCode: '47100' },
      },
    }).success,
    false,
  );
});
test('local auth and repository enforce ownership and normalize registrations', () => {
  let state = createSeed();
  const read = () => state;
  const write = (next: typeof state) => {
    state = next;
  };
  const auth = authProvider(read, write);
  const repo = repairRepository(read, write);
  assert.throws(() => auth.login('unknown@example.com'));
  const client = auth.login('KLIENT@example.com');
  assert.equal(state.sessionId, client.id);
  assert.equal(repo.list(client).length, 1);
  assert.equal(repo.get('PA-DEMO-002', client), undefined);
  assert.throws(() => repo.replace(state.repairs[1], client));
  assert.throws(() => repo.add(state.repairs[1], client));
  const user = auth.register({ ...client, email: 'NEW@example.com' });
  assert.equal(user.role, 'client');
  assert.equal(user.email, 'new@example.com');
  assert.throws(() => auth.register({ ...client, email: 'new@example.com' }));
  auth.logout();
  assert.equal(state.sessionId, null);
});

test('persisted demo schema rejects corrupt data instead of rendering invalid records', async () => {
  const { demoStateSchema } = await import('../lib/domain');
  assert.equal(demoStateSchema.safeParse(createSeed()).success, true);
  assert.equal(
    demoStateSchema.safeParse({ version: 1, users: [{}], repairs: [], sessionId: null }).success,
    false,
  );
});
