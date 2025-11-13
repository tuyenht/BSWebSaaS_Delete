import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from "payload";

import {
  logAuditEvent,
} from "../src/services/audit";
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
      collection: "pages",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: operation === "create" ? "create" : "update",
      collection: "pages",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "pages",
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
      collection: "pages",
      doc,
    }),
    logAuditEvent({
      payload: req.payload,
      action: "delete",
      collection: "pages",
      doc,
      user: req.user ?? undefined,
    }),
    revalidateDocumentCache({
      payload: req.payload,
      collection: "pages",
      doc,
      operation: "delete",
    }),
  ]);

  return doc;
};

export const Pages: CollectionConfig = {
  slug: "pages",
  versions: true,
  admin: {
    useAsTitle: "title",
  },
  fields: [
    { name: "tenant", type: "relationship", relationTo: "tenants" },
    { name: "site", type: "relationship", relationTo: "sites" },
    { name: "locale", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "template",
      type: "select",
      options: ["default", "landing", "blog-index"],
      defaultValue: "default",
    },
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "key", type: "text", required: true },
        { name: "data", type: "json" },
        {
          name: "visibility",
          type: "group",
          fields: [
            { name: "desktop", type: "checkbox", defaultValue: true },
            { name: "tablet", type: "checkbox", defaultValue: true },
            { name: "mobile", type: "checkbox", defaultValue: true },
          ],
        },
        {
          name: "layout",
          type: "group",
          fields: [
            {
              name: "type",
              type: "select",
              options: ["row", "grid", "slider"],
              defaultValue: "row",
            },
            { name: "columns", type: "number" },
          ],
        },
        {
          name: "animation",
          type: "group",
          fields: [
            {
              name: "preset",
              type: "select",
              options: ["fadeIn", "slideUp", "zoom", "parallax"],
            },
            { name: "delayMs", type: "number" },
          ],
        },
      ],
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
  ],
  hooks: {
    afterChange: [handleAfterChange],
    afterDelete: [handleAfterDelete],
  },
  access: {
    read: () => true,
  },
};
