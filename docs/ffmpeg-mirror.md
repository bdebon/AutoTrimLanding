# FFmpeg mirror for the AutoTrim installer

On first launch, AutoTrim downloads FFmpeg and FFprobe from the `deps-v1` release of
[AutoTrimReleases](https://github.com/bdebon/AutoTrimReleases/releases/tag/deps-v1) on GitHub.
Some users can't reach GitHub at all: from mainland China, DNS fails or connections time out
(PostHog `setup_download_failed`). After a network error on GitHub, the app tries this mirror
instead, and nothing after it:

```http
GET https://www.autotrim.app/api/deps/deps-v1/<file>
→ 302 Location: <one-hour signed link to R2>
```

Vercel serves only the redirect. The archive downloads straight from R2, the same Vercel → R2
path as the AI model ([model-download.md](model-download.md)), which works for those users.
Each request, including the app's retries and resumed downloads, gets a fresh link. Only the
host is signed, so the app's `Range` header follows the redirect and a cut download resumes.

## Trust

FFmpeg is free to redistribute, so there is no app marker and no licence check. The app pins
each archive's size and SHA-256 (`ARCHIVES` in AutoTrim's `src-tauri/src/ffmpeg_installer.rs`)
and rejects anything else, whichever host served it. A wrong or tampered object fails the
install; it can never be installed.

## Storage

- Bucket: `autotrim-models`, the private bucket of the AI model. The read-only token Vercel
  already uses covers it, so no new secret is needed.
- Keys: `deps/deps-v1/<file>`, the GitHub release's assets byte for byte:

| File | Size (bytes) | SHA-256 |
| --- | ---: | --- |
| `ffmpeg-macos-arm64.zip` | 19,296,002 | `b87103f82830aceba5664838e39ad83e695f43466f62e0237872d3758542e461` |
| `ffprobe-macos-arm64.zip` | 19,259,524 | `145cddb47f2d849dfe6e1dd5da2875ae30e87b980b2cae7cfb1f2966049888f3` |
| `ffmpeg-macos-x86_64.zip` | 25,436,144 | `263473e7196d12951045fcf623f7b47f616efff4e280992af1ed78dfbe668e48` |
| `ffprobe-macos-x86_64.zip` | 25,382,505 | `a221a067c0d673696a6b2661539b321943520678e6e031ed1f5c03ab151d2247` |
| `ffmpeg-windows.zip` | 35,984,590 | `24f67f9e95b96e5573c3922428046c891e03343aeafbbc46dba8129a0994f562` |
| `ffprobe-windows.zip` | 35,881,055 | `e334532b52deed0b8b2258c819ad6a76465bd2e336f4085f0311a4b0eab48aeb` |

The objects are immutable, like the release: new binaries go to `deps/deps-v2/`, with a new
GitHub tag, a new route and an app update. Never overwrite these objects.

## Uploading

1. Download the six assets from the GitHub release and check them:
   `shasum -a 256 *.zip` must print the hashes above.
2. In the Cloudflare dashboard: R2 → `autotrim-models` → Upload, into the folder
   `deps/deps-v1/` (keys exactly as in the table).

## Rate limit (optional)

Signing is local (no call to R2), so the route is cheap, and R2 egress is free. A Vercel
Firewall rule on the path prefix `/api/deps/` like the model route's would cap abuse. The app
makes one request per archive and attempt (two archives, at most four attempts each), so a
limit of 60 requests per 60 seconds per IP leaves plenty of room.

## Verification

With Node 24 and dependencies installed:

```sh
node --test tests/deps-download.test.mjs tests/model-download.test.mjs
npx eslint lib/deps-download.ts lib/model-download.ts 'app/api/deps/deps-v1/[file]/route.ts'
npx tsc --noEmit --incremental false
```

Against the deployed route, once the objects are uploaded, from the AutoTrim repository:

```sh
cd src-tauri
cargo test --bin autotrim the_mirror_serves_every_pinned_archive -- --ignored
cargo test --bin autotrim installs_from_the_mirror -- --ignored
```

The first checks that every archive answers a `Range` request through the redirect with its
pinned size. The second installs this Mac's two archives from the mirror alone (about 40 MB)
and runs them.
