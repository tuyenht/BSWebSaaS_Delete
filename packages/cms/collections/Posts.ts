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
      collection: "posts",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: operation === "create" ? "create" : "update",
      collection: "posts",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "posts",
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
      collection: "posts",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: "delete",
      collection: "posts",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "posts",
      doc,
      operation: "delete",
    }),
  ]);

  return doc;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  versions: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "site", "_status", "locale"],
  },
  fields: [
    { name: "tenant", type: "relationship", relationTo: "tenants" },
    { name: "site", type: "relationship", relationTo: "sites" },
    {
      name: "type",
      type: "select",
      options: ["news", "project", "job", "video", "blog"],
      required: true,
    },
    { name: "locale", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "excerpt", type: "textarea" },
    { name: "content", type: "richText" },
    {
      name: "categories",
      type: "relationship",
      relationTo: "taxonomies",
      hasMany: true,
    },
    {
      name: "tags",
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
      name: "publishAt",
      type: "date",
    },
    {
      name: "_status",
      type: "select",
      options: ["draft", "pending", "published"],
      defaultValue: "draft",
    },
    {
      name: "workflowState",
      type: "select",
      options: ["draft", "inReview", "approved", "rejected"],
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
      name: "translations",
      type: "array",
      fields: [
        { name: "locale", type: "text" },
        { name: "linkedPost", type: "relationship", relationTo: "posts" },
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
