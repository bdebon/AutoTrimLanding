import { createRecordHandler } from '@/lib/download-handoff';
import { blobStore } from '@/lib/download-handoff-blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const POST = createRecordHandler(blobStore());
