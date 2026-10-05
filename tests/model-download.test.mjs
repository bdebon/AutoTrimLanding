import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createModelDownloadHandler, issueModelDownload, MODEL } from '../lib/model-download.ts';

function request(body = { model: MODEL.id, version: '2.0.0' }, headers = {}) {
  return new Request('https://www.autotrim.app/api/model-download', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-autotrim-client': 'desktop', ...headers },
    body: JSON.stringify(body),
  });
}

test('an app trial receives a temporary link and the pinned model integrity data', async () => {
  let calls = 0;
  const handler = createModelDownloadHandler(async () => {
    calls++;
    return { url: 'https://example.invalid/signed', expiresAt: '2026-10-05T13:00:00.000Z' };
  });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.equal(calls, 1);
  const body = await response.json();
  assert.equal(body.model.size, 264464826);
  assert.equal(body.model.sha256, MODEL.sha256);
  assert.equal(body.model.attribution, 'CrisperWhisper by nyra health');
  assert.equal(body.model.key, undefined);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.equal(response.headers.get('access-control-allow-origin'), null);
});

test('rejects browser requests and arbitrary object keys before signing', async () => {
  const handler = createModelDownloadHandler(async () => { assert.fail('must not sign'); });
  assert.equal((await handler(request(undefined, { 'x-autotrim-client': '' }))).status, 403);
  assert.equal((await handler(request(undefined, { origin: 'https://example.com' }))).status, 403);
  for (const body of [null, [], {}, { model: '../../private', version: '2.0.0' },
    { model: MODEL.id, version: '2.0.0', key: 'other-file' },
    { model: MODEL.id, version: 'bad' }]) {
    assert.equal((await handler(request(body))).status, 400);
  }
});

test('rejects large or malformed input regardless of a false Content-Length', async () => {
  const handler = createModelDownloadHandler(async () => { assert.fail('must not sign'); });
  assert.equal((await handler(request({ data: 'x'.repeat(1025) }, { 'content-length': '1' }))).status, 413);
  assert.equal((await handler(request(undefined, { 'content-type': 'text/plain' }))).status, 415);
  const malformed = new Request('https://example.com', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-autotrim-client': 'desktop' }, body: '{' });
  assert.equal((await handler(malformed)).status, 400);
});

test('signing failures never expose server secrets or a fallback public URL', async () => {
  const handler = createModelDownloadHandler(async () => { throw new Error('private-secret'); });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private-secret|https:/);
});

test('the actual SDK signs only the fixed model for one hour, without network calls', async () => {
  const now = new Date('2026-10-05T12:00:00Z');
  const result = await issueModelDownload({
    R2_ACCOUNT_ID: 'a'.repeat(32), R2_MODEL_BUCKET: 'autotrim-models',
    R2_MODEL_ACCESS_KEY_ID: 'test-access-key', R2_MODEL_SECRET_ACCESS_KEY: 'test-secret-key',
  }, now);
  const url = new URL(result.url);
  assert.equal(url.protocol, 'https:');
  assert.ok(url.hostname.endsWith('.r2.cloudflarestorage.com'));
  assert.ok(decodeURIComponent(url.pathname).endsWith(MODEL.key));
  assert.equal(url.searchParams.get('X-Amz-Expires'), '3600');
  assert.equal(url.searchParams.get('X-Amz-Date'), '20261005T120000Z');
  assert.equal(url.searchParams.get('response-cache-control'), 'private, no-store');
  assert.ok(url.searchParams.get('X-Amz-Signature'));
  assert.equal(result.expiresAt, '2026-10-05T13:00:00.000Z');
  assert.doesNotMatch(result.url, /test-secret-key/);
  await assert.rejects(issueModelDownload({}), /Missing server configuration/);
  await assert.rejects(issueModelDownload({ R2_ACCOUNT_ID: 'https://evil.example' }), /Invalid R2 account ID/);
});
