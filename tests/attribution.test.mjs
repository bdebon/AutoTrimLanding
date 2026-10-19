import assert from 'node:assert/strict';
import { test } from 'node:test';
import { captureAttribution, readAttribution, ATTRIBUTION_STORAGE_KEY } from '../lib/attribution.ts';

function memoryStorage() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)) };
}

const HOST = 'autotrim.app';

test('UTMs on the home page survive the move to /download, which has none', () => {
  const storage = memoryStorage();
  captureAttribution('?utm_source=youtube&utm_medium=video&utm_campaign=launch', 'https://www.youtube.com/', HOST, storage, 1);
  captureAttribution('', 'https://autotrim.app/en', HOST, storage, 2);

  assert.deepEqual(readAttribution(storage),
    { ts: 1, s: 'youtube', m: 'video', c: 'launch', r: 'https://www.youtube.com/' });
});

test('a first visit without UTMs is still recorded, with its external referrer only', () => {
  const storage = memoryStorage();
  captureAttribution('', 'https://www.google.com/', HOST, storage, 1);
  assert.deepEqual(readAttribution(storage), { ts: 1, r: 'https://www.google.com/' });

  const internal = memoryStorage();
  captureAttribution('', 'https://autotrim.app/en/pricing', HOST, internal, 1);
  assert.deepEqual(readAttribution(internal), { ts: 1 });
});

test('a later visit with new UTMs replaces the campaign (last touch)', () => {
  const storage = memoryStorage();
  captureAttribution('?utm_source=youtube&utm_campaign=launch', '', HOST, storage, 1);
  captureAttribution('?utm_source=newsletter&utm_term=pricing', '', HOST, storage, 2);
  assert.deepEqual(readAttribution(storage), { ts: 2, s: 'newsletter', k: 'pricing' });
});

test('storage that is broken or unavailable never throws', () => {
  const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
  assert.deepEqual(captureAttribution('?utm_source=x', 'not a url', HOST, broken, 1), { ts: 1, s: 'x' });

  const corrupt = memoryStorage();
  corrupt.setItem(ATTRIBUTION_STORAGE_KEY, '{oops');
  assert.equal(readAttribution(corrupt), null);
});
