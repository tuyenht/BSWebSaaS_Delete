import { headers } from "next/headers";
import { cache } from "react";
import type { Payload } from "payload";

import { resolveSiteContext as resolveSiteContextShared } from "@bsweb/shared/routing/resolveSite";
import type { SiteResolution } from "@bsweb/shared/routing/resolveSite";

export type { SiteResolution } from "@bsweb/shared/routing/resolveSite";

const getHeaders = cache(() => headers());

function getHost(): string {
  const headerList = getHeaders();
  return (
    headerList.get("x-forwarded-host") ??
    headerList.get("x-original-host") ??
    headerList.get("host") ??
    ""
  ).toLowerCase();
}

export async function resolveSiteContext(options: {
  payload: Payload;
  siteSlug: string;
  pathSegments: string[];
}): Promise<SiteResolution> {
  const { payload, siteSlug, pathSegments } = options;
  const host = getHost();

  return resolveSiteContextShared({
    payload,
    siteSlug,
    pathSegments,
    host,
  });
}
