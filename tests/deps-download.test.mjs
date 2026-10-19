import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDepsDownloadHandler, DEPS_FILES, DEPS_PREFIX } from '../lib/deps-download.ts';
import { signPrivateObject } from '../lib/model-download.ts';

function get(file) {
  const request = new Request(`https://www.autotrim.app/api/deps/deps-v1/${encodeURIComponent(file)}`);
  return [request, { params: Promise.resolve({ file }) }];
}

test('each archive of deps-v1 redirects to a fresh signed link, never cached', async () => {
  const signed = [];
  const handler = createDepsDownloadHandler(async object => {
    signed.push(object);
    return { url: `https://example.invalid/signed/${object.file}` };
  });
  for (const file of DEPS_FILES) {
    const response = await handler(...get(file));
    assert.equal(response.status, 302, file);
    assert.equal(response.headers.get('location'), `https://example.invalid/signed/${file}`);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
  }
  assert.deepEqual(signed.map(object => object.key), DEPS_FILES.map(file => DEPS_PREFIX + file));
  assert.ok(signed.every(object => object.contentType === 'application/zip'));
});

test('anything but the six archives is not found, and nothing is signed for it', async () => {
  const handler = createDepsDownloadHandler(async () => { assert.fail('must not sign'); });
  for (const file of ['', 'ffmpeg.zip', '../models/crisperwhisper-2.0/small-q8_0/v1/ggml-crisperwhisper-small-q8_0.bin',
    'deps/deps-v1/ffmpeg-windows.zip', 'FFMPEG-WINDOWS.ZIP', 'ffmpeg-windows.zip ', 'ffmpeg-windows.zip/']) {
    const response = await handler(...get(file));
    assert.equal(response.status, 404, JSON.stringify(file));
    assert.equal(response.headers.get('location'), null);
  }
});

test('signing failures never expose server secrets', async () => {
  const handler = createDepsDownloadHandler(async () => { throw new Error('private-secret'); });
  const response = await handler(...get(DEPS_FILES[0]));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('location'), null);
  assert.doesNotMatch(await response.text(), /private-secret|https:/);
});

test('the actual SDK signs the archive under deps/deps-v1/ for one hour, without network calls', async () => {
  const now = new Date('2026-10-19T12:00:00Z');
  const file = 'ffmpeg-windows.zip';
  const result = await signPrivateObject({ key: DEPS_PREFIX + file, file, contentType: 'application/zip' }, {
    R2_ACCOUNT_ID: 'a'.repeat(32), R2_MODEL_BUCKET: 'autotrim-models',
    R2_MODEL_ACCESS_KEY_ID: 'test-access-key', R2_MODEL_SECRET_ACCESS_KEY: 'test-secret-key',
  }, now);
  const url = new URL(result.url);
  assert.equal(url.protocol, 'https:');
  assert.ok(url.hostname.endsWith('.r2.cloudflarestorage.com'));
  assert.ok(decodeURIComponent(url.pathname).endsWith(`/${DEPS_PREFIX}${file}`));
  assert.equal(url.searchParams.get('X-Amz-Expires'), '3600');
  assert.equal(url.searchParams.get('response-content-type'), 'application/zip');
  assert.equal(url.searchParams.get('response-content-disposition'), `attachment; filename="${file}"`);
  // Only the host is signed: the app's Range header can follow the redirect
  assert.equal(url.searchParams.get('X-Amz-SignedHeaders'), 'host');
  assert.doesNotMatch(result.url, /test-secret-key/);
});
