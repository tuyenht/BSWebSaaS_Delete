export const SUPPORTED_LOCALES = ["vi", "en", "ja"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "vi";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ja: "日本語",
};


