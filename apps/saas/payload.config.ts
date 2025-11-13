// apps/saas/payload.config.ts
import { buildConfig } from "payload";
import path from "path";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { fileURLToPath } from "url";

import { collections } from "@bsweb/cms/collections";
import { logger } from "@bsweb/shared/logger";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET || "change-me",
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ""],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ""],

  collections,

  admin: {
    user: "users",
  },

  db: postgresAdapter({
    idType: "uuid",
    pool: {
      connectionString: (() => {
        const url = process.env.DATABASE_URI;
        if (!url) {
          const message = "Thiếu biến môi trường DATABASE_URI. Payload không thể khởi động.";
          logger.error(message, { scope: "payload" });
          throw new Error(message);
        }
        return url;
      })(),
      max: Number(process.env.DB_POOL_MAX || 10),
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, "../../packages/cms/types/payload-types.ts"),
  },

  onInit: async (payload) => {
    logger.info("Payload initialized", { scope: "payload" });
  },
});
