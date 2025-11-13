export const cacheKeys = {
    page: (siteId: string, locale: string, slug: string) =>
      `page:${siteId}:${locale}:${slug}`,
  
    list: (
      siteId: string,
      locale: string,
      collection: string,
      hash: string,
    ) => `list:${siteId}:${locale}:${collection}:${hash}`,
  
    settings: (siteId: string, locale: string) =>
      `settings:${siteId}:${locale}`,
  };

