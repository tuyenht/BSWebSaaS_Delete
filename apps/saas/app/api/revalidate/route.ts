import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { logger } from "@bsweb/shared/logger";

export const runtime = "nodejs";

/**
 * API route to revalidate cache tags.
 * 
 * This endpoint is called by Payload hooks to invalidate Next.js cache
 * when content is created, updated, or deleted.
 * 
 * Requires authentication via Bearer token (REVALIDATE_SECRET or PAYLOAD_SECRET).
 * 
 * @example
 * POST /api/revalidate
 * Authorization: Bearer <secret>
 * Content-Type: application/json
 * 
 * {
 *   "tags": ["site:abc:vi:pages", "site:abc:vi:pages:home"]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET;

    if (!secret) {
      logger.error("REVALIDATE_SECRET not configured", {
        scope: "revalidate-api",
        path: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 },
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized revalidation request", {
        scope: "revalidate-api",
        path: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    if (token !== secret) {
      logger.warn("Invalid revalidation token", {
        scope: "revalidate-api",
        path: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { tags } = body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      logger.warn("Invalid revalidation request: missing tags", {
        scope: "revalidate-api",
        path: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Invalid request: tags array required" },
        { status: 400 },
      );
    }

    // Validate tags (must be strings)
    const validTags = tags.filter(
      (tag): tag is string => typeof tag === "string" && tag.length > 0,
    );

    if (validTags.length === 0) {
      logger.warn("Invalid revalidation request: no valid tags", {
        scope: "revalidate-api",
        path: request.nextUrl.pathname,
      });
      return NextResponse.json(
        { error: "Invalid request: no valid tags" },
        { status: 400 },
      );
    }

    // Revalidate all tags
    validTags.forEach((tag) => {
      revalidateTag(tag);
    });

    logger.info("Cache revalidation completed", {
      scope: "revalidate-api",
      tags: validTags.length,
      tagList: validTags,
    });

    return NextResponse.json({
      revalidated: true,
      tags: validTags,
      count: validTags.length,
    });
  } catch (error) {
    logger.error("Revalidation API error", {
      scope: "revalidate-api",
      path: request.nextUrl.pathname,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/revalidate",
    method: "POST",
    description: "Revalidate Next.js cache tags",
  });
}

