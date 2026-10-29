# Analytics & Tracking

What the website measures, under which consent, and how a campaign must be tagged so a
purchase can be traced back to the ad that brought it.

## Consent (lib/consent.ts)

Visitors whose device is set to a European time zone (EU, EEA, UK, Switzerland, and the EU
territories elsewhere) are asked first. Two purposes, chosen separately, kept 6 months:

| Purpose | Tools | Without consent |
| --- | --- | --- |
| Audience measurement | PostHog with its cookie: links the visit to the app download and the purchase | PostHog counts visits in cookieless mode; the Download code carries only the campaign; no visitor id in the handoff record or the checkout |
| Advertising | Meta Pixel `1498365729008861` (Autonomous Intelligence Limited), Google Tag Manager `GTM-MTPT8QGT`; the purchase reported to Meta | Not loaded at all; the checkout carries nothing for Meta, so the purchase is not reported |

Elsewhere both run by default. The footer's "Cookies" link reopens the choices everywhere.
Vercel Web Analytics is cookieless and always on.

PostHog's cookieless events are dropped unless cookieless mode is on in the PostHog project
settings (project 218035).

To test from anywhere: `?consent_region=eu` (asked), `?consent_region=world` (not asked),
`?consent_region=auto` (back to the time zone). It holds for the tab.

Files: `app/ConsentBanner.tsx` (the banner), `app/TrackingScripts.tsx` (Meta and GTM),
`app/PostHogProvider.tsx` (PostHog's mode), `lib/attribution-storage.ts` (where the campaign
is kept), `hooks/useAttribution.ts` (what is handed to the app and the checkout).

## Events

| When | PostHog | Meta Pixel | GTM dataLayer |
| --- | --- | --- | --- |
| Every page | `$pageview` | `PageView` | (container) |
| Download click | `download_clicked` | `Lead` | `download_click` |
| Consent saved | `consent_saved` (`analytics`, `ads`) | | |
| Purchase (LemonSqueezy webhook) | `purchase` | | |

Download clicks go through `trackDownload` in `lib/tracking.ts`; the purchase is recorded by
`supabase/functions/lemonsqueezy-webhook`, under the visitor id the checkout carried.

## What the checkout carries

Buy links rebuild their address at click time (`buildLemonSqueezyUrl` in `hooks/useAttribution.ts`),
so they carry what the page knows at that moment, as `checkout[custom][…]`:

| Field | When | What |
| --- | --- | --- |
| `utm_source` … `utm_term` | always, if the visit had a campaign | the last campaign seen |
| `visitor_id` | with consent to audience measurement | the PostHog visitor id |
| `ads_consent` | with consent to ads (always, outside Europe, unless turned off) | `1` |
| `fbc` | same, after a click on a Meta ad in the last 90 days | the ad click, `fb.1.<ms>.<fbclid>` |
| `fbp` | same, once the pixel has loaded | the `_fbp` browser id |
| `ua`, `page` | same | the browser's user agent and the page of the buy link: Meta requires both |

`fbclid` reaches only the page an ad opens, and the pixel loads late, so the site keeps its own
copy of the click (`autotrim_fbc` in localStorage, `lib/meta-click.ts`), erased with the pixel's
cookies when ads are turned off. Where visitors are asked first, the click waits in memory until
they accept ads.

The code the Download button copies for the app carries the same with consent to ads (`a: 1`,
`fc`, `fp` in `lib/attribution.ts`), so the app's own buy links can add `ads_consent`, `fbc` and
`fbp` (AutoTrim `frontend/src/services/checkout.ts`), for 90 days after the download and only with
the app's usage statistics on. The network fallback (`docs/download-handoff.md`) does not carry them.

## Tagging a campaign

Every ad, email or partner link to the site carries UTMs. The site keeps the last ones it saw
(lib/attribution.ts) and hands them to the app (Download code) and to the checkout, so the
`purchase` event carries them too.

### Meta ads

Put this in the ad's URL parameters field (Meta replaces the `{{…}}` placeholders itself):

```
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

- `utm_source` is always `meta`, whatever the placement (Facebook, Instagram, Audience Network).
- Name campaigns and ads so they can be read in a PostHog breakdown: angle and format, for
  example `prospecting-hesitations` and `euh-capsule-9x16-fr`.
- Do not add parameters to the landing URL itself: Meta adds them on top, and duplicates
  confuse the reading.

### Other channels

| Channel | utm_source | utm_medium |
| --- | --- | --- |
| Benjamin's YouTube videos | `youtube` | `video` |
| A sponsored creator | the creator's handle | `sponsor` |
| Email (Customer.io, lemlist) | `customerio` or `lemlist` | `email` |

## Checking a campaign

In PostHog (project 218035), break `purchase` down by `utm_source` / `utm_campaign`, or start
from `$pageview` with `utm_source = meta` and follow the persons. `attribution = visitor_id` on a
purchase means the visit, the app and the purchase are on one person.
