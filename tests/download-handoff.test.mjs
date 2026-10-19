import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createClaimHandler, createPurgeHandler, createRecordHandler, networkKey, parseHandoff, HANDOFF_PREFIX,
} from '../lib/download-handoff.ts';

const SECRET = 'test-secret';
const VISITOR = '01a15329-47d0-7c45-a436-33fc581198ca';
const OTHER = '01a152bd-3b0a-7b4a-8640-96a162093aa9';

function memoryStore() {
  const items = new Map();
  let clock = new Date('2026-10-19T08:00:00Z');
  return {
    items,
    at(date) { clock = new Date(date); },
    async put(pathname, body) { items.set(pathname, { body, uploadedAt: clock }); },
    async list(prefix) {
      return [...items].filter(([p]) => p.startsWith(prefix)).map(([pathname, v]) => ({ pathname, uploadedAt: v.uploadedAt }));
    },
    async read(pathname) { return items.get(pathname)?.body ?? null; },
    async remove(pathnames) { for (const p of pathnames) items.delete(p); },
  };
}

function click(ip, body = { visitor_id: VISITOR, utm_source: 'youtube', utm_campaign: 'launch' }, origin = 'https://autotrim.app') {
  return new Request('https://autotrim.app/api/download-handoff', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-real-ip': ip, ...(origin ? { origin } : {}) },
    body: JSON.stringify(body),
  });
}

function claim(ip, headers = { 'x-autotrim-client': 'desktop' }) {
  return new Request('https://autotrim.app/api/download-claim', { method: 'POST', headers: { 'x-real-ip': ip, ...headers } });
}

function handlers(store, now) {
  const options = { secret: SECRET, now: () => new Date(now()) };
  return { record: createRecordHandler(store, options), claimFor: createClaimHandler(store, options) };
}

test('the network is hashed: IPv4 as is, IPv6 by its /64, never stored in clear', () => {
  assert.equal(networkKey('203.0.113.7', SECRET), networkKey('203.0.113.7', SECRET));
  assert.notEqual(networkKey('203.0.113.7', SECRET), networkKey('203.0.113.8', SECRET));
  assert.notEqual(networkKey('203.0.113.7', SECRET), networkKey('203.0.113.7', 'other-secret'));
  assert.equal(networkKey('2001:db8:1:2:aaaa::1', SECRET), networkKey('2001:0db8:0001:0002:bbbb:cccc:dddd:eeee', SECRET));
  assert.notEqual(networkKey('2001:db8:1:2::1', SECRET), networkKey('2001:db8:1:3::1', SECRET));
  for (const invalid of ['', 'localhost', '1:2:3', '1::2::3', 'x.y.z.w']) assert.equal(networkKey(invalid, SECRET), null, invalid);
  assert.doesNotMatch(networkKey('203.0.113.7', SECRET), /203/);
});

test('only a visitor id and the campaign are accepted from the site', () => {
  assert.deepEqual(parseHandoff({ visitor_id: VISITOR, utm_source: 'yt', utm_term: '' }), { visitor_id: VISITOR, utm_source: 'yt' });
  for (const body of [null, [], {}, { visitor_id: 'short' }, { visitor_id: '../../etc/passwd' },
    { visitor_id: VISITOR, email: 'a@b.c' }, { visitor_id: VISITOR, utm_source: 'x'.repeat(201) }, { visitor_id: VISITOR, utm_source: 3 }]) {
    assert.equal(parseHandoff(body), null, JSON.stringify(body));
  }
});

test('an app launched from the same network takes the visitor who clicked, once', async () => {
  const store = memoryStore();
  let now = '2026-10-19T08:00:00Z';
  const { record, claimFor } = handlers(store, () => now);

  assert.equal((await record(click('203.0.113.7'))).status, 204);
  assert.equal(store.items.size, 1);
  assert.doesNotMatch([...store.items.keys()][0], /203\.0\.113\.7/);

  now = '2026-10-19T08:20:00Z';
  const response = await claimFor(claim('203.0.113.7'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { visitor_id: VISITOR, utm_source: 'youtube', utm_campaign: 'launch' });
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(store.items.size, 0, 'a claimed click is deleted');
  assert.equal((await claimFor(claim('203.0.113.7'))).status, 204, 'and cannot be claimed twice');
});

test('no match from another network, after 3 hours, or with two visitors on the network', async () => {
  const store = memoryStore();
  let now = '2026-10-19T08:00:00Z';
  const { record, claimFor } = handlers(store, () => now);
  await record(click('203.0.113.7'));

  assert.equal((await claimFor(claim('198.51.100.1'))).status, 204, 'another network');
  now = '2026-10-19T11:30:00Z';
  assert.equal((await claimFor(claim('203.0.113.7'))).status, 204, 'more than 3 hours later');

  const shared = memoryStore();
  now = '2026-10-19T08:00:00Z';
  const office = handlers(shared, () => now);
  await office.record(click('192.0.2.10'));
  await office.record(click('192.0.2.10', { visitor_id: OTHER }));
  assert.equal((await office.claimFor(claim('192.0.2.10'))).status, 204, 'two visitors: no guess');
});

test('a visitor who clicked twice is still one visitor', async () => {
  const store = memoryStore();
  let now = '2026-10-19T08:00:00Z';
  const { record, claimFor } = handlers(store, () => now);
  await record(click('2001:db8:1:2::1'));
  now = '2026-10-19T08:05:00Z';
  store.at(now);
  await record(click('2001:db8:1:2::1'));
  // The app's request leaves from another address of the same /64
  const response = await claimFor(claim('2001:db8:1:2:dead:beef:0:9'));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).visitor_id, VISITOR);
});

test('only the site may record, only the app may claim', async () => {
  const store = memoryStore();
  const { record, claimFor } = handlers(store, () => '2026-10-19T08:00:00Z');
  assert.equal((await record(click('203.0.113.7', undefined, 'https://evil.example'))).status, 403);
  assert.equal((await record(click('203.0.113.7', undefined, null))).status, 403);
  assert.equal((await record(click('203.0.113.7', { visitor_id: 'bad' }))).status, 400);
  const malformed = new Request('https://autotrim.app/api/download-handoff', {
    method: 'POST', headers: { origin: 'https://autotrim.app', 'x-real-ip': '203.0.113.7' }, body: '{' });
  assert.equal((await record(malformed)).status, 400);
  assert.equal(store.items.size, 0);

  await record(click('203.0.113.7'));
  assert.equal((await claimFor(claim('203.0.113.7', {}))).status, 403);
  assert.equal((await claimFor(claim('203.0.113.7', { 'x-autotrim-client': 'desktop', origin: 'https://autotrim.app' }))).status, 403);
  assert.equal(store.items.size, 1, 'a refused claim takes nothing');
});

test('records older than 24 hours are purged by the next request and by the daily cron', async () => {
  const store = memoryStore();
  let now = '2026-10-19T08:00:00Z';
  const { record } = handlers(store, () => now);
  await record(click('203.0.113.7'));
  await record(click('198.51.100.1', { visitor_id: OTHER }));

  now = '2026-10-20T08:30:00Z';
  store.at(now);
  await record(click('192.0.2.10'));
  assert.deepEqual([...store.items.keys()].map(p => p.startsWith(HANDOFF_PREFIX)), [true]);

  const purge = createPurgeHandler(store, { cronSecret: 'cron', now: () => new Date('2026-10-21T09:00:00Z') });
  assert.equal((await purge(new Request('https://autotrim.app/api/cron/purge-download-handoffs'))).status, 401);
  const response = await purge(new Request('https://autotrim.app/api/cron/purge-download-handoffs', { headers: { authorization: 'Bearer cron' } }));
  assert.deepEqual(await response.json(), { deleted: 1 });
  assert.equal(store.items.size, 0);
});

test('without the secret or an address, nothing is kept and nothing is handed over', async () => {
  const store = memoryStore();
  const record = createRecordHandler(store, { secret: '' });
  assert.equal((await record(click('203.0.113.7'))).status, 204);
  const noIp = new Request('https://autotrim.app/api/download-handoff', {
    method: 'POST', headers: { origin: 'https://autotrim.app', 'content-type': 'application/json' }, body: JSON.stringify({ visitor_id: VISITOR }) });
  assert.equal((await createRecordHandler(store, { secret: SECRET })(noIp)).status, 204);
  assert.equal(store.items.size, 0);
});
