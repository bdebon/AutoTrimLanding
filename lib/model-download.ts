import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Keep these values in sync with AutoTrim's src-tauri/src/ai_model.rs.
// Objects are immutable: publish a new key and app version when weights change.
export const MODEL = Object.freeze({
  id: 'crisperwhisper-small-q8_0',
  file: 'ggml-crisperwhisper-small-q8_0.bin',
  key: 'models/crisperwhisper-2.0/small-q8_0/v1/ggml-crisperwhisper-small-q8_0.bin',
  size: 264_464_826,
  sha256: 'a633abddd59a628e189df8ea835e1475f5350129fc63ddb25d1df9f43742948f',
  attribution: 'CrisperWhisper by nyra health',
});

export const DOWNLOAD_TTL_SECONDS = 3600;

type Download = { url: string; expiresAt: string };
type IssueDownload = () => Promise<Download>;

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${key}`);
  return value;
}

export async function issueModelDownload(
  env: NodeJS.ProcessEnv = process.env,
  now = new Date(),
): Promise<Download> {
  const accountId = required(env, 'R2_ACCOUNT_ID');
  if (!/^[a-f0-9]{32}$/.test(accountId)) throw new Error('Invalid R2 account ID');
  const bucket = required(env, 'R2_MODEL_BUCKET');
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) {
    throw new Error('Invalid R2 bucket name');
  }
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required(env, 'R2_MODEL_ACCESS_KEY_ID'),
      secretAccessKey: required(env, 'R2_MODEL_SECRET_ACCESS_KEY'),
    },
  });
  try {
    const url = await getSignedUrl(client, new GetObjectCommand({
      Bucket: bucket,
      Key: MODEL.key,
      ResponseContentType: 'application/octet-stream',
      ResponseContentDisposition: `attachment; filename="${MODEL.file}"`,
      ResponseCacheControl: 'private, no-store',
    }), { expiresIn: DOWNLOAD_TTL_SECONDS, signingDate: now });
    return {
      url,
      expiresAt: new Date(now.getTime() + DOWNLOAD_TTL_SECONDS * 1000).toISOString(),
    };
  } finally {
    client.destroy();
  }
}

const RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: RESPONSE_HEADERS });
}

// Trial users need the model too. The app marker prevents accidental browser use;
// it is NOT authentication or proof of a genuine app (headers can be copied).
// Apply a per-IP rate limit at the Vercel Firewall before enabling this endpoint.
export function createModelDownloadHandler(issue: IssueDownload = issueModelDownload) {
  return async function POST(request: Request): Promise<Response> {
    if (request.headers.get('x-autotrim-client') !== 'desktop' || request.headers.has('origin')) {
      return json({ error: 'Download this model from the AutoTrim application.' }, 403);
    }
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
      return json({ error: 'Expected application/json.' }, 415);
    }
    // Bound the actual stream, not just Content-Length (which clients control).
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Missing request body.' }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 1024) {
          await reader.cancel();
          return json({ error: 'Request too large.' }, 413);
        }
        chunks.push(value);
      }
    } catch {
      return json({ error: 'Unable to read request.' }, 400);
    } finally {
      reader.releaseLock();
    }
    let body: unknown;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Invalid request.' }, 400);
    }
    const input = body as Record<string, unknown>;
    if (input.model !== MODEL.id || typeof input.version !== 'string' ||
        !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(input.version) || input.version.length > 64 ||
        Object.keys(input).some(key => key !== 'model' && key !== 'version')) {
      return json({ error: 'Unsupported model or application version.' }, 400);
    }
    try {
      const download = await issue();
      return json({
        ...download,
        model: { id: MODEL.id, file: MODEL.file, size: MODEL.size,
          sha256: MODEL.sha256, attribution: MODEL.attribution },
      }, 200);
    } catch {
      // Never log credentials or signed URLs, or expose configuration errors to clients.
      console.error('AutoTrim model download signing unavailable');
      return json({ error: 'Model download temporarily unavailable. Please try again later.' }, 503);
    }
  };
}
