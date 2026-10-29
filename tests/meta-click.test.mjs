import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  adClickFrom,
  latestFbc,
  metaCheckoutData,
  readCookie,
  storeAdClick,
  FBC_MAX_AGE_MS,
  FBC_STORAGE_KEY,
} from '../lib/meta-click.ts';

function memoryStorage() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)) };
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)';
const PAGE = 'https://autotrim.app/en/pricing';

function context(overrides = {}) {
  return { adsAllowed: true, cookies: '', storage: memoryStorage(), userAgent: UA, page: PAGE, now: NOW, ...overrides };
}

test('an ad click is kept in the pixel format, with the time of the click', () => {
  const click = adClickFrom('?utm_source=meta&fbclid=IwAR123abc', NOW - DAY);
  assert.deepEqual(click, { fbclid: 'IwAR123abc', at: NOW - DAY });

  const storage = memoryStorage();
  storeAdClick(click, storage);
  assert.equal(storage.getItem(FBC_STORAGE_KEY), `fb.1.${NOW - DAY}.IwAR123abc`);
  assert.equal(latestFbc('', storage, NOW), `fb.1.${NOW - DAY}.IwAR123abc`);
});

test('a page without fbclid is not an ad click', () => {
  assert.equal(adClickFrom('?utm_source=meta'), null);
  assert.equal(adClickFrom('?fbclid='), null);
  assert.equal(adClickFrom(''), null);
});

test('the latest click wins, between our copy and the pixel cookie, and none older than 90 days', () => {
  const storage = memoryStorage();
  storeAdClick({ fbclid: 'older', at: NOW - 10 * DAY }, storage);
  const cookie = `_fbc=fb.1.${NOW - DAY}.newer; _fbp=fb.1.${NOW - 30 * DAY}.123`;
  assert.equal(latestFbc(cookie, storage, NOW), `fb.1.${NOW - DAY}.newer`);
  assert.equal(latestFbc('', storage, NOW), `fb.1.${NOW - 10 * DAY}.older`);

  const stale = memoryStorage();
  storeAdClick({ fbclid: 'stale', at: NOW - FBC_MAX_AGE_MS - 1 }, stale);
  assert.equal(latestFbc('', stale, NOW), null);
  assert.equal(latestFbc('_fbc=garbage', null, NOW), null);
});

test('without consent to ads, the checkout carries nothing for Meta', () => {
  const storage = memoryStorage();
  storeAdClick({ fbclid: 'abc', at: NOW }, storage);
  assert.deepEqual(metaCheckoutData(context({ adsAllowed: false, storage, cookies: '_fbp=fb.1.1.2' })), {});
});

test('with consent to ads, the checkout carries the consent, the click, the browser and the page', () => {
  const storage = memoryStorage();
  storeAdClick({ fbclid: 'abc', at: NOW - DAY }, storage);
  const data = metaCheckoutData(context({ storage, cookies: `ph_x=1; _fbp=fb.1.${NOW}.987654` }));
  assert.deepEqual(data, {
    ads_consent: '1',
    fbc: `fb.1.${NOW - DAY}.abc`,
    fbp: `fb.1.${NOW}.987654`,
    ua: UA,
    page: PAGE,
  });
});

test('with consent but no ad click and no pixel yet, the consent still goes', () => {
  assert.deepEqual(metaCheckoutData(context({ userAgent: '', page: '' })), { ads_consent: '1' });
});

test('cookies are read by exact name, and broken storage or encoding never throws', () => {
  assert.equal(readCookie('x_fbp=no; _fbp=yes', '_fbp'), 'yes');
  assert.equal(readCookie('_fbp=%E0%A4%A', '_fbp'), null);
  assert.equal(readCookie('', '_fbp'), null);

  const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
  storeAdClick({ fbclid: 'abc', at: NOW }, broken);
  assert.equal(latestFbc('', broken, NOW), null);
});
