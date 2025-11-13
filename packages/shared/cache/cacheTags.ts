/**
 * Cache tags for Next.js revalidateTag system.
 * 
 * Tags follow format: `site:{siteId}:{collection}:{locale}:{identifier?}`
 * 
 * Collection-level tags (without identifier) can be used to invalidate all items in a collection.
 * Item-level tags (with identifier) can be used to invalidate specific items.
 */

export const cacheTags = {
  /**
   * Site-level tags (affect entire site)
   */
  site: (siteId: string) => `site:${siteId}`,
  
  /**
   * Collection-level tags (affect all items in a collection)
   * Format: site:{siteId}:{locale}:{collection}
   */
  collection: (siteId: string, locale: string, collection: string) =>
    `site:${siteId}:${locale}:${collection}`,
  
  /**
   * Page tags
   */
  page: (siteId: string, locale: string, slug: string) =>
    `site:${siteId}:${locale}:pages:${slug}`,
  
  pages: (siteId: string, locale: string) =>
    `site:${siteId}:${locale}:pages`,
  
  /**
   * Post tags
   */
  post: (siteId: string, locale: string, slug: string) =>
    `site:${siteId}:${locale}:posts:${slug}`,
  
  posts: (siteId: string, locale: string) =>
    `site:${siteId}:${locale}:posts`,
  
  postsByType: (siteId: string, locale: string, type: string) =>
    `site:${siteId}:${locale}:posts:type:${type}`,
  
  postsByTaxonomy: (siteId: string, locale: string, taxonomyId: string) =>
    `site:${siteId}:${locale}:posts:taxonomy:${taxonomyId}`,
  
  /**
   * Product tags
   */
  product: (siteId: string, locale: string, slug: string) =>
    `site:${siteId}:${locale}:products:${slug}`,
  
  products: (siteId: string, locale: string) =>
    `site:${siteId}:${locale}:products`,
  
  /**
   * Settings tags
   */
  settings: (siteId: string, locale: string) =>
    `site:${siteId}:${locale}:settings`,
  
  themeSettings: (siteId: string) =>
    `site:${siteId}:theme-settings`,
  
  siteConfig: (siteId: string) =>
    `site:${siteId}:config`,
  
  /**
   * Navigation tags
   */
  navigation: (siteId: string, locale: string) =>
    `site:${siteId}:${locale}:nav`,
  
  /**
   * Theme tags
   */
  theme: (themeId: string) =>
    `theme:${themeId}`,
  
  /**
   * i18n tags
   */
  i18n: (locale: string) =>
    `i18n:${locale}`,
};

/**
 * Helper to get all tags for a document (item-level + collection-level)
 * Useful for invalidating both specific item and its collection.
 */
export function getDocumentTags(
  siteId: string,
  locale: string,
  collection: string,
  identifier?: string,
): string[] {
  const tags: string[] = [
    cacheTags.site(siteId),
    cacheTags.collection(siteId, locale, collection),
  ];

  if (identifier) {
    switch (collection) {
      case "pages":
        tags.push(cacheTags.page(siteId, locale, identifier));
        break;
      case "posts":
        tags.push(cacheTags.post(siteId, locale, identifier));
        break;
      case "products":
        tags.push(cacheTags.product(siteId, locale, identifier));
        break;
      default:
        tags.push(`site:${siteId}:${locale}:${collection}:${identifier}`);
    }
  }

  return tags;
}

/**
 * Helper to get collection-level tags only
 */
export function getCollectionTags(
  siteId: string,
  locale: string,
  collection: string,
): string[] {
  return [
    cacheTags.site(siteId),
    cacheTags.collection(siteId, locale, collection),
  ];
}
