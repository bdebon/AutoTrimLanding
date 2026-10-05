import { createModelDownloadHandler } from '@/lib/model-download';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = createModelDownloadHandler();
