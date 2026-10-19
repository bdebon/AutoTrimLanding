import { createDepsDownloadHandler } from '@/lib/deps-download';
import { signPrivateObject } from '@/lib/model-download';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = createDepsDownloadHandler(object => signPrivateObject(object));
