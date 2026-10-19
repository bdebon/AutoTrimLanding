import { del, get, list, put } from '@vercel/blob';
import type { HandoffStore, StoredEntry } from './download-handoff';

// The production store of lib/download-handoff.ts: a private Vercel Blob store connected
// to the project (BLOB_READ_WRITE_TOKEN). Private: no record is reachable by URL.
export function blobStore(): HandoffStore {
  return {
    async put(pathname, body) {
      await put(pathname, body, {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
    },
    async list(prefix) {
      const entries: StoredEntry[] = [];
      let cursor: string | undefined;
      do {
        const page = await list({ prefix, cursor, limit: 1000 });
        for (const blob of page.blobs) entries.push({ pathname: blob.pathname, uploadedAt: new Date(blob.uploadedAt) });
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return entries;
    },
    async read(pathname) {
      const result = await get(pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      return new Response(result.stream).text();
    },
    async remove(pathnames) {
      if (pathnames.length) await del(pathnames);
    },
  };
}
