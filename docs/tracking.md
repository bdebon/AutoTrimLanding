# Analytics & Tracking

What the website measures, under which consent, and how a campaign must be tagged so a
purchase can be traced back to the ad that brought it.

## Consent (lib/consent.ts)

Visitors whose device is set to a European time zone (EU, EEA, UK, Switzerland, and the EU
territories elsewhere) are asked first. Two purposes, chosen separately, kept 6 months:

| Purpose | Tools | Without consent |
| --- | --- | --- |
| Audience measurement | PostHog with its cookie: links the visit to the app download and the purchase | PostHog counts visits in cookieless mode; the Download code carries only the campaign; no visitor id in the handoff record or the checkout |
| Advertising | Meta Pixel `2240864149721547`, Google Tag Manager `GTM-MTPT8QGT` | Not loaded at all |

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
