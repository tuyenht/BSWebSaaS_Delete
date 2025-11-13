import type { SupportedLocale } from "../config/locales";

export type Namespace =
  | "common"
  | "validation"
  | "date-time"
  | "admin-core"
  | "admin-users"
  | "admin-billing"
  | "site-core"
  | "site-landing"
  | "theme-default"
  | "theme-dark";

export type Messages = Record<string, string | Messages>;

export type LocaleMessages = Record<Namespace, Messages>;

export interface TranslationBundle {
  locale: SupportedLocale;
  namespaces: Partial<LocaleMessages>;
}

export type Translator = (key: string, options?: Record<string, string | number>) => string;

