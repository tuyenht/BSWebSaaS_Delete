import path from 'node:path';

export type StorageMode = 'saas' | 'standalone';

const STORAGE_MODE: StorageMode =
  (process.env.APP_MODE as StorageMode) || 'saas';

export type UploadKeyPrefixOptions = {
  tenantId?: string | null;
  siteId?: string | null;
  siteSlug?: string | null;
  folder?: string | null;
};

/**
 * getUploadKeyPrefix:
 * - SaaS: /uploads/{tenantId}/{siteId}/{folder?}
 * - Standalone: /uploads/{siteSlug}/{folder?} (hoặc chỉ /uploads/{folder?})
 */
export function getUploadKeyPrefix(
  opts: UploadKeyPrefixOptions,
): string {
  const safeFolder = opts.folder?.replace(/^\/+/, '').replace(/\.\./g, '');
  const folderPart = safeFolder ? `/${safeFolder}` : '';

  if (STORAGE_MODE === 'standalone') {
    const safeSiteSlug =
      opts.siteSlug?.replace(/[^a-z0-9\-]/gi, '').toLowerCase() ||
      'site';
    return `/uploads/${safeSiteSlug}${folderPart}`;
  }

  // SaaS mode
  const tenantId = (opts.tenantId || 'tenant').toString();
  const siteId = (opts.siteId || 'site').toString();

  return `/uploads/${tenantId}/${siteId}${folderPart}`;
}

/**
 * Resolve physical path on disk for a given relative upload path.
 * ex: /uploads/tenant/site/folder/file.jpg
 */
export function resolveUploadDiskPath(relativePath: string): string {
  const uploadsRoot =
    process.env.UPLOADS_ROOT ||
    path.join(process.cwd(), 'uploads');

  const cleaned = relativePath.replace(/^\/+/, '').replace(/\.\./g, '');
  return path.join(uploadsRoot, cleaned);
}
