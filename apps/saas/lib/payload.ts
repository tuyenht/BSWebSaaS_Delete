import type { Payload } from "payload";
import { getPayload } from "payload";

import payloadConfig from "../payload.config";

let client: Payload | null = null;

export async function getPayloadClient(): Promise<Payload> {
  if (client) return client;

  client = await getPayload({
    config: payloadConfig,
  });

  return client;
}
