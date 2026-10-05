# AutoTrim model delivery

AutoTrim requests a one-hour download URL from `POST /api/model-download`, then downloads
the weights directly from a private Cloudflare R2 Standard bucket. Vercel handles only the
small JSON response. The desktop installer checks the pinned file size and SHA-256 before
renaming its temporary file. Once installed, transcription works offline.

## Access model

The model is available during the free trial; there is intentionally no Lemon Squeezy check.
Only exports require a paid licence in the existing app. This endpoint is not linked from the
website, is POST-only, is excluded from caches and indexing, and accepts only the supported
model. It rejects browser Origin headers and requires the desktop marker below.

These request checks are **not app attestation**. Anyone who reproduces the app's request can
obtain a link, and anyone holding a link can use it until it expires. Do not describe this as
licence authentication, DRM, or prevention of copying downloaded weights. Keeping R2 private
avoids a permanent public object URL; it does not make the issuance endpoint authenticated.

Vercel Firewall limits the exact path `/api/model-download` by source IP to 30 requests per
60 seconds with a 429 response. This rule was published and verified on 2026-10-05.
Do not use a browser challenge, as the native installer cannot complete one. A per-process
JavaScript counter would not enforce a reliable limit across Vercel instances.

## Private storage

- Bucket: `autotrim-models`, Standard storage, location hint Western Europe.
- Public Development URL and custom public domains must remain disabled.
- Object: `models/crisperwhisper-2.0/small-q8_0/v1/ggml-crisperwhisper-small-q8_0.bin`.
- Size: **264,464,826 bytes** (252.21 MiB).
- SHA-256: `a633abddd59a628e189df8ea835e1475f5350129fc63ddb25d1df9f43742948f`.
- Attribution: **CrisperWhisper by nyra health**.

Keep the object immutable. New weights require a new versioned object key and an app update
with the new pinned size/checksum. Never upload model weights into this Git repository or the
landing's `public/` directory.

## Vercel environment

These server-only variables are configured as Secrets for Production only. Preview builds
intentionally have no R2 access. Test a staged production deployment before promoting it:

| Variable | Value |
| --- | --- |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_MODEL_BUCKET` | `autotrim-models` |
| `R2_MODEL_ACCESS_KEY_ID` | Dedicated R2 S3 access key ID |
| `R2_MODEL_SECRET_ACCESS_KEY` | Dedicated R2 S3 secret access key |

Use a dedicated R2 **Object Read only** token restricted to this bucket. Never use
`NEXT_PUBLIC_` variables, commit credentials, or ship them in the desktop app. The uploader's
credentials are not needed by Vercel. Configure these before deploying; missing configuration
returns 503 without leaking details. Redeploy after changing environment variables.

## App contract

```http
POST /api/model-download
Content-Type: application/json
X-AutoTrim-Client: desktop

{"model":"crisperwhisper-small-q8_0","version":"2.0.0"}
```

The JSON response has `url`, `expiresAt` (ISO 8601), and `model` with `id`, `file`, `size`,
`sha256` and `attribution`. The version is the installed app's semver, not the model version.
The app must use HTTPS and validate the manifest against its embedded constants. On a failed
or expired download, retry through this endpoint to obtain a fresh URL. Do not log the URL
or put it in analytics: it contains a temporary bearer signature.

## Verification

With Node 24 and dependencies installed:

```sh
node --test tests/model-download.test.mjs
npx eslint lib/model-download.ts app/api/model-download/route.ts
npx tsc --noEmit --incremental false
```

For the deployed route, verify a native-style POST gives a signed R2 URL, a GET/browser request
does not, an unsigned direct object request fails, and a streamed full download has the size
and SHA-256 above. Check a Range request returns 206 and a tampered signature is rejected.
The landing repository's local instructions leave server/build commands to Benjamin; the
checks above do not launch a development server.

Verified on 2026-10-05 against a staged production deployment: manifest 200, Range 206,
unsigned object 400, altered signature 403, full download 264,464,826 bytes with the pinned
SHA-256. Vercel cloud build, type checking and linting passed. Desktop first-launch and
upgrade flows still require an app release test; the client integration is in AutoTrim PR #89.
