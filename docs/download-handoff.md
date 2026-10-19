# Download handoff: the fallback of the clipboard code

How a visit to the site gets linked to the first launch of the app, when the clipboard
can't carry it.

## The normal path

The Download button copies `ATR:<base64>` to the clipboard: the visitor's PostHog id and the
UTMs. On its first launch, the app reads it (AutoTrim's `AttributionService.ts`) and uses the
visitor id as its own PostHog id, so the visit and the app are one person.

This breaks when the user copies anything else before launching the app.

## The fallback

1. **Click.** The Download button also sends `POST /api/download-handoff` with
   `{ visitor_id, utm_* }`.
   - The route only accepts the site's own Origin.
   - It files the click in a **private Vercel Blob store**, under
     `download-handoffs/<HMAC(HANDOFF_IP_SECRET, network)>/<ms>-<visitor_id>.json`.
2. **Claim.** An app whose first launch finds no code sends `POST /api/download-claim` with
   `X-AutoTrim-Client: desktop`. It sends no Origin, because the request comes from the Rust
   side, not the webview.
3. **Rule.** The click is handed over only if, from the same network, **exactly one visitor**
   clicked Download in the **previous 3 hours**.
   - The answer is `200 { visitor_id, utm_* }`, and the network's records are then deleted, so
     a second app from that network gets nothing.
   - Several visitors (an office, a family, a shared connection) or none: `204`.

"Network" means an IPv4 address as it is, or the /64 of an IPv6 address, since the host part
rotates between the browser and the app.

## Privacy

- The IP address itself is never stored, only a keyed hash of the network.
- A record is deleted as soon as it is claimed. Otherwise it is deleted after 24 hours: at the
  next request to either route, and at least once a day by the cron
  (`vercel.json` → `GET /api/cron/purge-download-handoffs`, authenticated by `CRON_SECRET`).
  The Hobby plan only allows daily crons.
- The privacy policy (`app/privacy/page.tsx`) describes this.

## Configuration (production only)

| Variable | What |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Set by Vercel when the private store `autotrim-download-handoffs` (iad1) was connected to the project |
| `HANDOFF_IP_SECRET` | Random key of the network hash. Rotating it orphans the pending records, which is harmless |
| `CRON_SECRET` | Vercel sends it to the cron route as `Authorization: Bearer …` |

Preview deployments have none of these. Both routes then answer `204` and keep nothing.

## Verification

```sh
node --test tests/download-handoff.test.mjs
```

Against production, from one machine:
1. In a browser on autotrim.app, run
   `fetch('/api/download-handoff', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({visitor_id: '<id>'})})`.
2. Then `curl -X POST -H 'X-AutoTrim-Client: desktop' https://autotrim.app/api/download-claim`
   must return that id once, then `204`.
