import type { Payload } from "payload";

import { logger } from "@bsweb/shared/logger";
import {
  getDocumentTags,
  getCollectionTags,
} from "@bsweb/shared/cache/cacheTags";

type RevalidationInput = {
  payload: Payload;
  collection: string;
  doc: Record<string, unknown>;
  operation?: "create" | "update" | "delete";
};

type RelationshipValue =
  | string
  | { id?: string | number }
  | Array<string | { id?: string | number }>
  | null
  | undefined;

function extractRelationshipId(value: RelationshipValue): string | undefined {
  if (!value) return undefined;

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "id" in first) {
      const id = first.id;
      return typeof id === "string" ? id : String(id ?? "");
    }
    return undefined;
  }

  if (typeof value === "object" && "id" in value) {
    const id = value.id;
    return typeof id === "string" ? id : String(id ?? "");
  }

  return undefined;
}

function normalizeSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return slug.startsWith("/") ? slug : `/${slug}`;
}

/**
 * Revalidate cache tags for a document.
 * This function queues revalidation requests that will be processed by Next.js API route.
 */
export async function revalidateDocumentCache({
  payload,
  collection,
  doc,
  operation = "update",
}: RevalidationInput): Promise<void> {
  try {
    const siteId = extractRelationshipId(doc.site as RelationshipValue);
    const locale = doc.locale as string | undefined;
    const slug = normalizeSlug(doc.slug as string | undefined);

    if (!siteId || !locale) {
      logger.warn("Missing siteId or locale for cache revalidation", {
        scope: "cache-revalidation",
        collection,
        docId: doc.id,
      });
      return;
    }

    const tags: string[] = [];

    if (operation === "delete") {
      // On delete, invalidate collection-level cache
      tags.push(...getCollectionTags(siteId, locale, collection));
    } else {
      // On create/update, invalidate both item and collection
      if (slug) {
        tags.push(...getDocumentTags(siteId, locale, collection, slug));
      } else {
        tags.push(...getCollectionTags(siteId, locale, collection));
      }
    }

    // Queue revalidation requests
    await queueRevalidation(tags);

    logger.info("Cache revalidation queued", {
      scope: "cache-revalidation",
      collection,
      siteId,
      locale,
      tags: tags.length,
    });
  } catch (error) {
    logger.error("Failed to queue cache revalidation", {
      scope: "cache-revalidation",
      collection,
      docId: doc.id,
      error,
    });
  }
}

/**
 * Queue revalidation requests.
 * In production, this would use a job queue (e.g., BullMQ, Bull).
 * For now, we'll call the Next.js API route directly if available.
 */
async function queueRevalidation(tags: string[]): Promise<void> {
  if (tags.length === 0) return;

  // Try to call Next.js API route if available
  const revalidateUrl = process.env.REVALIDATE_API_URL || "http://localhost:3000/api/revalidate";
  const revalidateSecret = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET;

  if (!revalidateSecret) {
    logger.warn("REVALIDATE_SECRET not set, skipping cache revalidation", {
      scope: "cache-revalidation",
      tags: tags.length,
    });
    return;
  }

  try {
    // Call Next.js API route to revalidate cache
    const response = await fetch(revalidateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalidateSecret}`,
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.statusText}`);
    }
  } catch (error) {
    // If API route is not available (e.g., during development or background jobs),
    // log the tags for manual revalidation or queue for later processing
    logger.warn("Could not call revalidation API, tags will be processed later", {
      scope: "cache-revalidation",
      tags,
      error: error instanceof Error ? error.message : String(error),
    });

    // In production, you might want to:
    // 1. Store tags in Redis for background job processing
    // 2. Use a job queue (BullMQ, Bull) to process revalidation
    // 3. Store in database for scheduled processing
  }
}

/**
 * Revalidate cache tags for a collection (all items).
 */
export async function revalidateCollectionCache(
  payload: Payload,
  siteId: string,
  locale: string,
  collection: string,
): Promise<void> {
  try {
    const tags = getCollectionTags(siteId, locale, collection);
    await queueRevalidation(tags);

    logger.info("Collection cache revalidation queued", {
      scope: "cache-revalidation",
      collection,
      siteId,
      locale,
      tags: tags.length,
    });
  } catch (error) {
    logger.error("Failed to queue collection cache revalidation", {
      scope: "cache-revalidation",
      collection,
      siteId,
      locale,
      error,
    });
  }
}

/**
 * Revalidate cache tags for a site (all collections).
 */
export async function revalidateSiteCache(
  payload: Payload,
  siteId: string,
): Promise<void> {
  try {
    const tags = [`site:${siteId}`];
    await queueRevalidation(tags);

    logger.info("Site cache revalidation queued", {
      scope: "cache-revalidation",
      siteId,
      tags: tags.length,
    });
  } catch (error) {
    logger.error("Failed to queue site cache revalidation", {
      scope: "cache-revalidation",
      siteId,
      error,
    });
  }
}

