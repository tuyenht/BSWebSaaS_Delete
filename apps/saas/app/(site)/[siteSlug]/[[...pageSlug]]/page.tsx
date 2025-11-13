import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@bsweb/frontend/SectionRenderer";
import type { SupportedLocale } from "@bsweb/i18n";
import { cacheTags } from "@bsweb/shared/cache/cacheTags";

import { getPayloadClient } from "@/lib/payload";
import { resolveSiteContext } from "@/lib/site-context";

type SitePageProps = {
  params: {
    siteSlug: string;
    pageSlug?: string[];
  };
};

export default async function SitePage({ params }: SitePageProps) {
  const payload = await getPayloadClient();
  const pathSegments = params.pageSlug ?? [];

  let context;
  try {
    context = await resolveSiteContext({
      payload,
      siteSlug: params.siteSlug,
      pathSegments,
    });
  } catch (error) {
    return notFound();
  }

  const baseWhere = [
    {
      site: {
        equals: context.siteId,
      },
    },
    {
      slug: {
        equals: context.pageSlug,
      },
    },
    {
      _status: {
        equals: "published",
      },
    },
  ];

  const pageByLocale = await payload.find({
    collection: "pages",
    limit: 1,
    where: {
      and: [
        ...baseWhere,
        {
          locale: {
            equals: context.locale,
          },
        },
      ],
    },
  });

  let pageDoc = pageByLocale.docs[0];

  if (!pageDoc && context.localeFromUrl) {
    const fallbackPage = await payload.find({
      collection: "pages",
      limit: 1,
      where: {
        and: [
          ...baseWhere,
          {
            locale: {
              equals: context.defaultLocale,
            },
          },
        ],
      },
    });

    pageDoc = fallbackPage.docs[0];
  }

  if (!pageDoc) {
    return notFound();
  }

  const renderedLocale =
    (pageDoc.locale as SupportedLocale | undefined) ?? context.locale;

  // Tag cache for this page
  // Collection-level tag: invalidates all pages for this site/locale
  cacheTag(cacheTags.pages(context.siteId, renderedLocale));
  // Item-level tag: invalidates this specific page
  cacheTag(cacheTags.page(context.siteId, renderedLocale, context.pageSlug));
  // Site-level tag: invalidates entire site cache
  cacheTag(cacheTags.site(context.siteId));

  return (
    <SectionRenderer sections={pageDoc.sections ?? []} locale={renderedLocale} />
  );
}

