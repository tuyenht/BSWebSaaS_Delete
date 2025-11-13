import type { Payload } from "payload";

import { logger } from "@bsweb/shared/logger";

type AuditAction =
  | "login"
  | "logout"
  | "loginFailed"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "export"
  | "permissionChange";

type RelationshipValue =
  | string
  | { id?: string | number }
  | Array<string | { id?: string | number }>
  | null
  | undefined;

export type AuditEventInput = {
  payload: Payload;
  action: AuditAction;
  collection: string;
  doc: Record<string, unknown>;
  user?: RelationshipValue;
  meta?: Record<string, unknown>;
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

export async function logAuditEvent(input: AuditEventInput): Promise<void> {
  const { payload, action, collection, doc, user, meta } = input;

  const tenantId = extractRelationshipId(doc.tenant as RelationshipValue);
  const siteId = extractRelationshipId(doc.site as RelationshipValue);
  const userId = extractRelationshipId(user);

  const docIdRaw = (doc.id ?? doc.docId ?? doc._id) as string | number | undefined;
  const docId = typeof docIdRaw === "string" ? docIdRaw : docIdRaw != null ? String(docIdRaw) : undefined;

  if (!docId) {
    logger.error("Cannot write audit event because docId is missing.", {
      scope: "audit",
      collection,
    });
    return;
  }

  try {
    await payload.create({
      collection: "audit-events",
      data: {
        tenant: tenantId ?? null,
        site: siteId ?? null,
        user: userId ?? null,
        type: action,
        collection,
        docId,
        meta: meta ?? {},
      },
    });
  } catch (error) {
    logger.error("Failed to write audit event.", {
      scope: "audit",
      collection,
      docId,
      error,
    });
  }
}
