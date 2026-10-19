import type { PrivateObject } from './model-download';

// A mirror of the deps-v1 release of AutoTrimReleases on GitHub, for users who cannot reach
// GitHub (from mainland China, its DNS fails or its connections time out). The objects are
// the release's archives byte for byte. The app pins every archive's size and SHA-256
// (ARCHIVES in AutoTrim's src-tauri/src/ffmpeg_installer.rs) and checks each download
// against them, so the mirror needs no more trust than GitHub. Keep this list in sync
// with those pins; new binaries go to a new prefix (deps-v2), never over these objects.
export const DEPS_PREFIX = 'deps/deps-v1/';
export const DEPS_FILES: readonly string[] = Object.freeze([
  'ffmpeg-macos-arm64.zip',
  'ffprobe-macos-arm64.zip',
  'ffmpeg-macos-x86_64.zip',
  'ffprobe-macos-x86_64.zip',
  'ffmpeg-windows.zip',
  'ffprobe-windows.zip',
]);

type Sign = (object: PrivateObject) => Promise<{ url: string }>;
type Context = { params: Promise<{ file: string }> };

const RESPONSE_HEADERS = {
  // The redirect carries a signed link: never cache it
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};

// FFmpeg is free to redistribute: no app marker, no licence check. Only the six known
// archives can be signed, whatever the path asks for. Each request, including the app's
// retries and resumed downloads (Range survives the redirect), gets a fresh one-hour link.
export function createDepsDownloadHandler(sign: Sign) {
  return async function GET(_request: Request, { params }: Context): Promise<Response> {
    const { file } = await params;
    if (!DEPS_FILES.includes(file)) {
      return Response.json({ error: 'Not found.' }, { status: 404, headers: RESPONSE_HEADERS });
    }
    try {
      const { url } = await sign({ key: DEPS_PREFIX + file, file, contentType: 'application/zip' });
      return new Response(null, { status: 302, headers: { ...RESPONSE_HEADERS, Location: url } });
    } catch {
      // Never log credentials or signed URLs, or expose configuration errors to clients.
      console.error('AutoTrim deps mirror signing unavailable');
      return Response.json({ error: 'Download temporarily unavailable. Please try again later.' },
        { status: 503, headers: RESPONSE_HEADERS });
    }
  };
}
