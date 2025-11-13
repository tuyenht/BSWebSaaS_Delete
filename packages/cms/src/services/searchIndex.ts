import type { Payload } from "payload";

import { logger } from "@bsweb/shared/logger";

type IndexableCollection = "pages" | "posts" | "products";

type RelationshipValue =
  | string
  | { id?: string | number }
  | Array<string | { id?: string | number }>
  | null
  | undefined;

type IndexInput = {
  payload: Payload;
  collection: IndexableCollection;
  doc: Record<string, unknown>;
};

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

function derivePath(doc: Record<string, unknown>): string | undefined {
  const slug = doc.slug as string | undefined;
  if (!slug) return undefined;
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function collectTags(doc: Record<string, unknown>): string[] {
  const tags = doc.tags as unknown;
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => {
        if (typeof tag === "string") return tag;
        if (tag && typeof tag === "object" && "value" in tag) {
          const value = (tag as { value?: string }).value;
          if (typeof value === "string") return value;
        }
        return null;
      })
      .filter((tag): tag is string => Boolean(tag));
  }
  return [];
}

export async function upsertSearchIndexFromDoc({
  payload,
  collection,
  doc,
}: IndexInput): Promise<void> {
  const status = doc._status as string | undefined;

  if (status && status !== "published") {
    logger.info("Skip search index update because document is not published.", {
      scope: "search-index",
      collection,
      docId: doc.id,
    });
    return;
  }

  const tenantId = extractRelationshipId(doc.tenant as RelationshipValue);
  const siteId = extractRelationshipId(doc.site as RelationshipValue);
  const docIdRaw = (doc.id ?? doc.docId ?? doc._id) as string | number | undefined;
  const docId = typeof docIdRaw === "string" ? docIdRaw : docIdRaw != null ? String(docIdRaw) : undefined;
  const locale = (doc.locale as string | undefined) ?? "vi";

  if (!tenantId || !siteId || !docId) {
    logger.error("Missing tenant/site/docId. Search index update aborted.", {
      scope: "search-index",
      collection,
      doc,
    });
    return;
  }

  const title = (doc.title as string | undefined) ?? "";
  const excerpt = (doc.description as string | undefined) ?? "";
  const path = derivePath(doc) ?? "/";
  const tags = collectTags(doc);

  try {
    const existing = await payload.find({
      collection: "search-index",
      limit: 1,
      where: {
        and: [
          { collection: { equals: collection } },
          { docId: { equals: docId } },
          { locale: { equals: locale } },
        ],
      },
    });

    const payloadData = {
      tenant: tenantId,
      site: siteId,
      collection,
      docId,
      locale,
      slug: path,
      title,
      excerpt,
      path,
      tags,
      publishedAt: doc.updatedAt ?? new Date().toISOString(),
    };

    if (existing.docs[0]) {
      await payload.update({
        collection: "search-index",
        id: existing.docs[0].id,
        data: payloadData,
      });
    } else {
      await payload.create({
        collection: "search-index",
        data: payloadData,
      });
    }
  } catch (error) {
    logger.error("Search index upsert failed.", {
      scope: "search-index",
      collection,
      docId,
      error,
    });
  }
}

export async function removeFromSearchIndex({
  payload,
  collection,
  doc,
}: IndexInput): Promise<void> {
  const docIdRaw = (doc.id ?? doc.docId ?? doc._id) as string | number | undefined;
  const docId = typeof docIdRaw === "string" ? docIdRaw : docIdRaw != null ? String(docIdRaw) : undefined;
  const locale = (doc.locale as string | undefined) ?? "vi";

  if (!docId) {
    return;
  }

  try {
    const existing = await payload.find({
      collection: "search-index",
      limit: 1,
      where: {
        and: [
          { collection: { equals: collection } },
          { docId: { equals: docId } },
          { locale: { equals: locale } },
        ],
      },
    });

    const record = existing.docs[0];

    if (!record) return;

    await payload.delete({
      collection: "search-index",
      id: record.id as string,
    });
  } catch (error) {
    logger.error("Search index removal failed.", {
      scope: "search-index",
      collection,
      docId,
      error,
    });
  }
}
