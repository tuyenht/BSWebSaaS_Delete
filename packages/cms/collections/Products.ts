import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from "payload";

import { logAuditEvent } from "../src/services/audit";
import {
  revalidateDocumentCache,
} from "../src/services/cacheRevalidation";
import {
  removeFromSearchIndex,
  upsertSearchIndexFromDoc,
} from "../src/services/searchIndex";

const handleAfterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create" && operation !== "update") {
    return doc;
  }

  await Promise.all([
    upsertSearchIndexFromDoc({
      payload: req.payload,
      collection: "products",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: operation === "create" ? "create" : "update",
      collection: "products",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "products",
      doc,
      operation: operation === "create" ? "create" : "update",
    }),
  ]);

  return doc;
};

const handleAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await Promise.all([
    removeFromSearchIndex({
      payload: req.payload,
      collection: "products",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: "delete",
      collection: "products",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "products",
      doc,
      operation: "delete",
    }),
  ]);

  return doc;
};

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    { name: "tenant", type: "relationship", relationTo: "tenants" },
    { name: "site", type: "relationship", relationTo: "sites" },
    { name: "locale", type: "text" },
    { name: "slug", type: "text", required: true },
    { name: "name", type: "text", required: true },
    { name: "sku", type: "text" },
    { name: "price", type: "number" },
    { name: "currency", type: "text", defaultValue: "VND" },
    { name: "summary", type: "textarea" },
    { name: "description", type: "richText" },
    {
      name: "categories",
      type: "relationship",
      relationTo: "taxonomies",
      hasMany: true,
    },
    {
      name: "thumbnail",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "gallery",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "_status",
      type: "select",
      options: ["draft", "pending", "published"],
      defaultValue: "draft",
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
        { name: "ogImage", type: "relationship", relationTo: "media" },
      ],
    },
    {
      name: "attributes",
      type: "array",
      fields: [
        { name: "label", type: "text" },
        { name: "value", type: "text" },
      ],
    },
  ],
  hooks: {
    afterChange: [handleAfterChange],
    afterDelete: [handleAfterDelete],
  },
  access: {
    read: () => true,
  },
};
