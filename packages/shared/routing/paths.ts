type LocalePathConfig = {
    code: string;
    paths: {
      news: string;
      projects: string;
      jobs: string;
      products: string;
    };
    enabled: boolean;
    isDefault: boolean;
  };
  
  export type ListingType = 'news' | 'projects' | 'jobs' | 'products';
  
  export function getListingPath(
    locale: string,
    type: ListingType,
    siteLocales: LocalePathConfig[],
  ): string {
    const loc =
      siteLocales.find((l) => l.code === locale && l.enabled) ||
      siteLocales.find((l) => l.isDefault) ||
      siteLocales[0];
  
    const slug = loc.paths[type];
    return `/${slug}`;
  }
  
  export function getDetailPath(
    locale: string,
    type: ListingType,
    itemSlug: string,
    siteLocales: LocalePathConfig[],
  ): string {
    const base = getListingPath(locale, type, siteLocales);
    return `${base}/${itemSlug}`;
  }
  