import type { Payload } from "payload";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@bsweb/i18n";

type SiteDocument = {
  id: string;
  slug: string;
  status?: string;
  tenant?: string | { id: string };
  defaultLocale?: string;
  locales?: Array<{
    code?: string;
    isDefault?: boolean;
    licensed?: boolean;
  }>;
};

export type SiteResolution = {
  host: string;
  site: SiteDocument;
  tenantId: string;
  siteId: string;
  siteSlug: string;
  locale: SupportedLocale;
  localeFromUrl?: SupportedLocale;
  pageSlug: string;
  defaultLocale: SupportedLocale;
};

const supportedLocaleSet = new Set(SUPPORTED_LOCALES);

function ensureSupportedLocale(code?: string | null): SupportedLocale | null {
  if (!code) return null;
  const normalized = code.toLowerCase();
  return supportedLocaleSet.has(normalized as SupportedLocale)
    ? (normalized as SupportedLocale)
    : null;
}

function resolveDefaultLocale(site: SiteDocument): SupportedLocale {
  const declaredDefault = ensureSupportedLocale(site.defaultLocale);

  if (declaredDefault) {
    return declaredDefault;
  }

  const locales = site.locales ?? [];
  const fallbackFromLocales = locales.find(
    (entry) => entry?.isDefault && ensureSupportedLocale(entry?.code),
  );

  if (fallbackFromLocales?.code) {
    const normalized = ensureSupportedLocale(fallbackFromLocales.code);
    if (normalized) return normalized;
  }

  const firstLicensed = locales.find(
    (entry) => entry?.licensed !== false && ensureSupportedLocale(entry?.code),
  );

  if (firstLicensed?.code) {
    const normalized = ensureSupportedLocale(firstLicensed.code);
    if (normalized) return normalized;
  }

  return DEFAULT_LOCALE;
}

export async function resolveSiteContext(options: {
  payload: Payload;
  siteSlug: string;
  pathSegments: string[];
  host: string;
}): Promise<SiteResolution> {
  const { payload, siteSlug, pathSegments, host } = options;

  const normalizedSiteSlug = siteSlug.toLowerCase();

  const sites = await payload.find({
    collection: "sites",
    limit: 1,
    where: {
      and: [
        {
          status: {
            equals: "active",
          },
        },
        {
          or: [
            {
              slug: { equals: normalizedSiteSlug },
            },
            {
              "domains.host": { equals: host },
            },
          ],
        },
      ],
    },
  });

  const site = sites.docs[0] as SiteDocument | undefined;

  if (!site) {
    throw new Error("SITE_NOT_FOUND");
  }

  const tenantId =
    typeof site.tenant === "string" ? site.tenant : site.tenant?.id;

  if (!tenantId) {
    throw new Error("SITE_MISSING_TENANT");
  }

  const defaultLocale = resolveDefaultLocale(site);
  const locales = site.locales ?? [];

  const localeSegment = ensureSupportedLocale(pathSegments[0]);
  const isLicensedLocale =
    localeSegment &&
    locales.some(
      (entry) =>
        ensureSupportedLocale(entry?.code) === localeSegment &&
        entry?.licensed !== false,
    );

  let locale = defaultLocale;
  let localeFromUrl: SupportedLocale | undefined;
  let slugSegments = pathSegments;

  if (localeSegment && isLicensedLocale) {
    locale = localeSegment;
    localeFromUrl = localeSegment;
    slugSegments = pathSegments.slice(1);
  }

  const pageSlug =
    slugSegments.length > 0 ? `/${slugSegments.join("/")}` : "/";

  return {
    host,
    site,
    tenantId,
    siteId: site.id,
    siteSlug: site.slug,
    locale,
    localeFromUrl,
    pageSlug,
    defaultLocale,
  };
}

