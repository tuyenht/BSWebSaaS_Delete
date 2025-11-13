import type { NextRequest } from "next/server";

import { createRequestHandler } from "@payloadcms/next/app";

import payloadConfig from "@/payload.config";

export const runtime = "nodejs";

const handler = createRequestHandler({
  config: payloadConfig,
  secret: process.env.PAYLOAD_SECRET || "change-me",
});

export const GET = (request: NextRequest) => handler(request);
export const POST = (request: NextRequest) => handler(request);
export const PUT = (request: NextRequest) => handler(request);
export const PATCH = (request: NextRequest) => handler(request);
export const DELETE = (request: NextRequest) => handler(request);
