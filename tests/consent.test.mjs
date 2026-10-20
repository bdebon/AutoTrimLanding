import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  allows,
  consentRequiredForTimeZone,
  readChoice,
  writeChoice,
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
} from '../lib/consent.ts';

function memoryStorage() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)) };
}

test('European time zones, EU territories elsewhere and an unreadable zone all require consent', () => {
  for (const zone of ['Europe/Paris', 'Europe/London', 'Europe/Zurich', 'Atlantic/Canary', 'Indian/Reunion', 'America/Guadeloupe', 'Asia/Nicosia', 'WET', undefined, '']) {
    assert.equal(consentRequiredForTimeZone(zone), true, String(zone));
  }
  for (const zone of ['America/New_York', 'Asia/Ho_Chi_Minh', 'Asia/Seoul', 'America/Montreal', 'Australia/Sydney']) {
    assert.equal(consentRequiredForTimeZone(zone), false, zone);
  }
});

test('before any answer, trackers run only where nobody has to be asked', () => {
  assert.equal(allows({ required: true, choice: null }, 'analytics'), false);
  assert.equal(allows({ required: true, choice: null }, 'ads'), false);
  assert.equal(allows({ required: false, choice: null }, 'analytics'), true);
  assert.equal(allows({ required: false, choice: null }, 'ads'), true);
});

test('an answer applies purpose by purpose, in every region', () => {
  const choice = { analytics: true, ads: false };
  for (const required of [true, false]) {
    assert.equal(allows({ required, choice }, 'analytics'), true);
    assert.equal(allows({ required, choice }, 'ads'), false);
  }
});

test('a choice is kept for 6 months, then asked again', () => {
  const storage = memoryStorage();
  writeChoice(storage, { analytics: false, ads: true }, 1000);
  assert.deepEqual(readChoice(storage, 1000 + CONSENT_MAX_AGE_MS), { analytics: false, ads: true });
  assert.equal(readChoice(storage, 1001 + CONSENT_MAX_AGE_MS), null);
});

test('a choice from another version of the purposes, or a damaged one, counts as no answer', () => {
  const storage = memoryStorage();
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 0, analytics: true, ads: true, ts: 1 }));
  assert.equal(readChoice(storage, 2), null);
  storage.setItem(CONSENT_STORAGE_KEY, '{not json');
  assert.equal(readChoice(storage, 2), null);
  assert.equal(readChoice(memoryStorage(), 2), null);
});

test('only an explicit true counts as consent', () => {
  const storage = memoryStorage();
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: 1, analytics: 'yes', ads: 1, ts: 1 }));
  assert.deepEqual(readChoice(storage, 2), { analytics: false, ads: false });
});
