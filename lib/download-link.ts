// "Send me the link": AutoTrim only runs on a computer, so a visitor on a phone leaves their
// email instead of downloading. The address goes to Customer.io (the same EU workspace as the
// purchase webhook, keyed by email): the profile, then a download_link_requested event, whose
// automation sends the email with the link.
//
// The link keeps the campaign the visitor came from, so the desktop visit, the app and a
// purchase are still credited to it (lib/attribution.ts). No visitor id travels: the phone
// and the computer stay two people in PostHog.
//
// Bots are stopped by Cloudflare Turnstile: the form gets a token when it is sent, and the
// request is refused unless Cloudflare confirms it. A hidden field catches the crudest ones.
//
// Needs CIO_SITE_ID and CIO_API_KEY (Customer.io tracking credentials) and
// TURNSTILE_SECRET_KEY in the environment; NEXT_PUBLIC_TURNSTILE_SITE_KEY for the form.

// A Turnstile token alone can take 2048 characters
const MAX_BODY_BYTES = 4096;
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const CIO_TRACK = 'https://track-eu.customer.io/api/v1';
const SITE_URL = 'https://autotrim.app';
const LOCALES = ['en', 'fr', 'es', 'zh'] as const;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
// Short enough for anything we tag, long enough for Meta's {{campaign.name}} placeholders
const UTM_VALUE = /^[\w .:/+-]{1,120}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Locale = (typeof LOCALES)[number];
type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export type LinkRequest = { email: string; locale: Locale; marketing: boolean; utm: Utm; turnstile: string };

/** A send to Customer.io's Track API: true when it accepted it. */
export type CioSend = (path: string, method: 'PUT' | 'POST', body: unknown) => Promise<boolean>;

/** Whether Cloudflare confirms this Turnstile token. */
export type TurnstileVerify = (token: string, ip: string | null) => Promise<boolean>;

const RESPONSE_HEADERS = { 'Cache-Control': 'no-store' };

function respond(status: number): Response {
  return new Response(null, { status, headers: RESPONSE_HEADERS });
}

/** null when the form is unusable; { bot: true } when the hidden field was filled. */
export function parseLinkRequest(body: unknown): LinkRequest | { bot: true } | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  // A field people never see: only a bot fills it
  if (typeof input.website === 'string' && input.website !== '') return { bot: true };
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL.test(email)) return null;
  const locale = LOCALES.includes(input.locale as Locale) ? (input.locale as Locale) : 'en';
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && UTM_VALUE.test(value)) utm[key] = value;
  }
  const turnstile = typeof input.turnstile === 'string' && input.turnstile.length <= 2048 ? input.turnstile : '';
  return { email, locale, marketing: input.marketing === true, utm, turnstile };
}

/** The desktop download page, carrying the visit's campaign, or marking the email as the source. */
export function downloadUrl(locale: Locale, utm: Utm): string {
  const url = new URL(`/${locale}/download`, SITE_URL);
  const campaign = Object.keys(utm).length > 0 ? utm : { utm_source: 'download_link', utm_medium: 'email' };
  for (const [key, value] of Object.entries(campaign)) url.searchParams.set(key, value);
  url.searchParams.set('via', 'mobile_link');
  return url.toString();
}

export function cioTrackSender(siteId: string, apiKey: string): CioSend {
  const auth = 'Basic ' + Buffer.from(`${siteId}:${apiKey}`).toString('base64');
  return async (path, method, body) => {
    try {
      const res = await fetch(`${CIO_TRACK}${path}`, {
        method,
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) console.error('AutoTrim download link: Customer.io answered', res.status, path);
      return res.ok;
    } catch {
      console.error('AutoTrim download link: Customer.io unreachable');
      return false;
    }
  };
}

export function turnstileVerifier(secret: string): TurnstileVerify {
  return async (token, ip) => {
    try {
      const form = new URLSearchParams({ secret, response: token });
      if (ip) form.set('remoteip', ip);
      const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form });
      const result = (await res.json()) as { success?: boolean };
      return result.success === true;
    } catch {
      console.error('AutoTrim download link: Turnstile unreachable');
      return false;
    }
  };
}

type Options = { send?: CioSend | null; verify?: TurnstileVerify | null; now?: () => Date };

/** POST /api/download-link, sent by the mobile Download page. */
export function createLinkHandler(options: Options = {}) {
  return async function POST(request: Request): Promise<Response> {
    // Same-origin only: production, www and Vercel previews alike
    if (request.headers.get('origin') !== new URL(request.url).origin) return respond(403);
    let parsed: ReturnType<typeof parseLinkRequest>;
    try {
      const text = await request.text();
      if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) return respond(400);
      parsed = parseLinkRequest(JSON.parse(text));
    } catch {
      return respond(400);
    }
    if (!parsed) return respond(400);
    if ('bot' in parsed) return respond(204);

    const verify = options.verify !== undefined ? options.verify : defaultVerifier();
    const send = options.send !== undefined ? options.send : defaultSender();
    if (!verify || !send) {
      console.error('AutoTrim download link: TURNSTILE_SECRET_KEY, CIO_SITE_ID or CIO_API_KEY missing');
      return respond(503);
    }
    const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    if (!parsed.turnstile || !(await verify(parsed.turnstile, ip))) return respond(403);
    const { email, locale, marketing, utm } = parsed;
    const id = `/customers/${encodeURIComponent(email)}`;
    const now = Math.floor((options.now?.() ?? new Date()).getTime() / 1000);
    const identified = await send(id, 'PUT', {
      email,
      language: locale === 'fr' ? 'fr' : 'en',
      mobile_link_requested_at: now,
      // Never written as false: it would undo an earlier yes
      ...(marketing ? { marketing_opt_in: true, marketing_opt_in_at: now } : {}),
    });
    if (!identified) return respond(503);
    const sent = await send(`${id}/events`, 'POST', {
      name: 'download_link_requested',
      data: { download_url: downloadUrl(locale, utm), locale, ...utm },
    });
    return respond(sent ? 204 : 503);
  };
}

function defaultVerifier(): TurnstileVerify | null {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  return secret ? turnstileVerifier(secret) : null;
}

function defaultSender(): CioSend | null {
  const siteId = process.env.CIO_SITE_ID;
  const apiKey = process.env.CIO_API_KEY;
  return siteId && apiKey ? cioTrackSender(siteId, apiKey) : null;
}
