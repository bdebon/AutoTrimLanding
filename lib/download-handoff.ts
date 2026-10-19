import { createHmac } from 'node:crypto';

// The fallback for the clipboard handoff between the site and the app. The Download button
// copies a code (visitor id + UTMs) that the app reads on its first launch; anything
// copied in between erases it. So the click is also recorded here, under a keyed hash of
// the visitor's network, and an app whose first launch finds no code asks for it from the
// same network: if exactly one visitor clicked Download from there in the last 3 hours,
// the app takes that visitor's id, as the code would have given it.
//
// The IP address itself is never stored, only HMAC(secret, network). Records are deleted
// once claimed, and after 24 hours (at the next request, and at least once a day by cron).

export const HANDOFF_PREFIX = 'download-handoffs/';
export const MATCH_WINDOW_MS = 3 * 60 * 60 * 1000;
export const RETENTION_MS = 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 2048;

export type Handoff = {
  visitor_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type StoredEntry = { pathname: string; uploadedAt: Date };

/** Where the records live: Vercel Blob in production (lib/download-handoff-blob.ts). */
export interface HandoffStore {
  put(pathname: string, body: string): Promise<void>;
  /** Every entry under the prefix, all pages. */
  list(prefix: string): Promise<StoredEntry[]>;
  read(pathname: string): Promise<string | null>;
  remove(pathnames: string[]): Promise<void>;
}

// PostHog's anonymous ids are UUIDs; this also keeps the id safe inside a pathname
const VISITOR_ID = /^[A-Za-z0-9_-]{8,64}$/;

/** The address the request came from, as Vercel reports it. */
export function clientIp(headers: Headers): string | null {
  const ip = headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0];
  return ip?.trim() || null;
}

/**
 * The visitor's network, hashed: an IPv4 address as it is, an IPv6 one by its /64, since
 * the host part rotates (privacy addresses) between the browser's request and the app's.
 */
export function networkKey(ip: string, secret: string): string | null {
  let network: string;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    network = ip;
  } else if (ip.includes(':')) {
    const expanded = expandIpv6(ip);
    if (!expanded) return null;
    network = expanded.slice(0, 4).join(':') + '::/64';
  } else {
    return null;
  }
  return createHmac('sha256', secret).update(network).digest('hex').slice(0, 32);
}

function expandIpv6(ip: string): string[] | null {
  const address = ip.replace(/^\[|\]$/g, '').split('%')[0].toLowerCase();
  const halves = address.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  // An IPv4-mapped tail (::ffff:1.2.3.4) counts as two groups
  const groups = [...head, ...tail].flatMap(g => g.includes('.') ? ['0', '0'] : [g]);
  const missing = 8 - groups.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const full = halves.length === 1 ? head : [...head, ...Array(missing).fill('0'), ...tail];
  if (full.some(g => !/^[0-9a-f.]{1,15}$/.test(g))) return null;
  return full.map(g => (g.includes('.') ? g : g.padStart(4, '0')));
}

/** What the site sends with a click: a visitor id and the campaign, nothing else. */
export function parseHandoff(body: unknown): Handoff | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  if (typeof input.visitor_id !== 'string' || !VISITOR_ID.test(input.visitor_id)) return null;
  if (Object.keys(input).some(key => key !== 'visitor_id' && !(UTM_KEYS as readonly string[]).includes(key))) return null;
  const handoff: Handoff = { visitor_id: input.visitor_id };
  for (const key of UTM_KEYS) {
    const value = input[key];
    if (value === undefined || value === null || value === '') continue;
    if (typeof value !== 'string' || value.length > 200) return null;
    handoff[key] = value;
  }
  return handoff;
}

function entryPath(key: string, now: Date, visitorId: string): string {
  return `${HANDOFF_PREFIX}${key}/${now.getTime()}-${visitorId}.json`;
}

function visitorOf(pathname: string): string | null {
  const name = pathname.split('/').pop() ?? '';
  const match = /^\d+-([A-Za-z0-9_-]{8,64})\.json$/.exec(name);
  return match ? match[1] : null;
}

/**
 * The click to hand over: among this network's clicks of the last 3 hours, one visitor
 * only. Several visitors (an office, a family, a shared connection) or none: no match.
 */
export function pickClaim(entries: StoredEntry[], now: Date): StoredEntry | null {
  const recent = entries.filter(entry => now.getTime() - entry.uploadedAt.getTime() <= MATCH_WINDOW_MS);
  const visitors = new Set(recent.map(entry => visitorOf(entry.pathname)).filter(Boolean));
  if (visitors.size !== 1) return null;
  return recent.reduce((latest, entry) => (entry.uploadedAt > latest.uploadedAt ? entry : latest));
}

/** Removes every record older than 24 hours; returns how many. */
export async function purgeExpired(store: HandoffStore, now: Date, entries?: StoredEntry[]): Promise<number> {
  const all = entries ?? await store.list(HANDOFF_PREFIX);
  const expired = all.filter(entry => now.getTime() - entry.uploadedAt.getTime() > RETENTION_MS);
  if (expired.length) await store.remove(expired.map(entry => entry.pathname));
  return expired.length;
}

const RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};

function respond(status: number, body?: unknown): Response {
  return body === undefined
    ? new Response(null, { status, headers: RESPONSE_HEADERS })
    : Response.json(body, { status, headers: RESPONSE_HEADERS });
}

async function readJson(request: Request): Promise<unknown> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error('too large');
  return JSON.parse(text);
}

type Options = { secret?: string; now?: () => Date; siteOrigins?: string[] };

const SITE_ORIGINS = ['https://autotrim.app', 'https://www.autotrim.app'];

/** POST /api/download-handoff, sent by the site's Download button. */
export function createRecordHandler(store: HandoffStore, options: Options = {}) {
  return async function POST(request: Request): Promise<Response> {
    const origins = options.siteOrigins ?? SITE_ORIGINS;
    if (!origins.includes(request.headers.get('origin') ?? '')) return respond(403);
    const secret = options.secret ?? process.env.HANDOFF_IP_SECRET;
    const ip = clientIp(request.headers);
    let handoff: Handoff | null;
    try {
      handoff = parseHandoff(await readJson(request));
    } catch {
      return respond(400);
    }
    if (!handoff) return respond(400);
    const key = secret && ip ? networkKey(ip, secret) : null;
    // Without a network to file it under, the click cannot be claimed: nothing to keep
    if (!key) return respond(204);
    const now = options.now?.() ?? new Date();
    try {
      await store.put(entryPath(key, now, handoff.visitor_id), JSON.stringify(handoff));
      await purgeExpired(store, now);
    } catch {
      console.error('AutoTrim download handoff storage unavailable');
    }
    return respond(204);
  };
}

/** POST /api/download-claim, sent by the app on a first launch that found no code. */
export function createClaimHandler(store: HandoffStore, options: Options = {}) {
  return async function POST(request: Request): Promise<Response> {
    if (request.headers.get('x-autotrim-client') !== 'desktop' || request.headers.has('origin')) {
      return respond(403);
    }
    const secret = options.secret ?? process.env.HANDOFF_IP_SECRET;
    const ip = clientIp(request.headers);
    const key = secret && ip ? networkKey(ip, secret) : null;
    if (!key) return respond(204);
    const now = options.now?.() ?? new Date();
    try {
      const entries = await store.list(`${HANDOFF_PREFIX}${key}/`);
      const claim = pickClaim(entries, now);
      if (!claim) {
        await purgeExpired(store, now, entries);
        return respond(204);
      }
      const handoff = parseHandoff(JSON.parse((await store.read(claim.pathname)) ?? 'null'));
      // Used up: a second app from this network cannot take the same visit
      await store.remove(entries.map(entry => entry.pathname));
      return handoff ? respond(200, handoff) : respond(204);
    } catch {
      console.error('AutoTrim download claim storage unavailable');
      return respond(204);
    }
  };
}

/** GET /api/cron/purge-download-handoffs, called daily by Vercel Cron with CRON_SECRET. */
export function createPurgeHandler(store: HandoffStore, options: Options & { cronSecret?: string } = {}) {
  return async function GET(request: Request): Promise<Response> {
    const cronSecret = options.cronSecret ?? process.env.CRON_SECRET;
    if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) return respond(401);
    const deleted = await purgeExpired(store, options.now?.() ?? new Date());
    return respond(200, { deleted });
  };
}
