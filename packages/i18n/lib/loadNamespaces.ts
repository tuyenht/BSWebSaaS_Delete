import { DEFAULT_LOCALE, type SupportedLocale } from "../config/locales";
import type { LocaleMessages, Messages, Namespace, TranslationBundle } from "./types";

import viCommon from "../locales/vi/common.json";
import viValidation from "../locales/vi/validation.json";
import viDateTime from "../locales/vi/date-time.json";
import viAdminCore from "../locales/vi/admin-core.json";
import viAdminUsers from "../locales/vi/admin-users.json";
import viAdminBilling from "../locales/vi/admin-billing.json";
import viSiteCore from "../locales/vi/site-core.json";
import viSiteLanding from "../locales/vi/site-landing.json";
import viThemeDefault from "../locales/vi/theme-default.json";
import viThemeDark from "../locales/vi/theme-dark.json";

import enCommon from "../locales/en/common.json";
import enValidation from "../locales/en/validation.json";
import enDateTime from "../locales/en/date-time.json";
import enAdminCore from "../locales/en/admin-core.json";
import enAdminUsers from "../locales/en/admin-users.json";
import enAdminBilling from "../locales/en/admin-billing.json";
import enSiteCore from "../locales/en/site-core.json";
import enSiteLanding from "../locales/en/site-landing.json";
import enThemeDefault from "../locales/en/theme-default.json";
import enThemeDark from "../locales/en/theme-dark.json";

import jaCommon from "../locales/ja/common.json";
import jaValidation from "../locales/ja/validation.json";
import jaDateTime from "../locales/ja/date-time.json";
import jaAdminCore from "../locales/ja/admin-core.json";
import jaAdminUsers from "../locales/ja/admin-users.json";
import jaAdminBilling from "../locales/ja/admin-billing.json";
import jaSiteCore from "../locales/ja/site-core.json";
import jaSiteLanding from "../locales/ja/site-landing.json";
import jaThemeDefault from "../locales/ja/theme-default.json";
import jaThemeDark from "../locales/ja/theme-dark.json";

const localeDictionaries: Record<SupportedLocale, LocaleMessages> = {
  vi: {
    "common": viCommon as Messages,
    "validation": viValidation as Messages,
    "date-time": viDateTime as Messages,
    "admin-core": viAdminCore as Messages,
    "admin-users": viAdminUsers as Messages,
    "admin-billing": viAdminBilling as Messages,
    "site-core": viSiteCore as Messages,
    "site-landing": viSiteLanding as Messages,
    "theme-default": viThemeDefault as Messages,
    "theme-dark": viThemeDark as Messages,
  },
  en: {
    "common": enCommon as Messages,
    "validation": enValidation as Messages,
    "date-time": enDateTime as Messages,
    "admin-core": enAdminCore as Messages,
    "admin-users": enAdminUsers as Messages,
    "admin-billing": enAdminBilling as Messages,
    "site-core": enSiteCore as Messages,
    "site-landing": enSiteLanding as Messages,
    "theme-default": enThemeDefault as Messages,
    "theme-dark": enThemeDark as Messages,
  },
  ja: {
    "common": jaCommon as Messages,
    "validation": jaValidation as Messages,
    "date-time": jaDateTime as Messages,
    "admin-core": jaAdminCore as Messages,
    "admin-users": jaAdminUsers as Messages,
    "admin-billing": jaAdminBilling as Messages,
    "site-core": jaSiteCore as Messages,
    "site-landing": jaSiteLanding as Messages,
    "theme-default": jaThemeDefault as Messages,
    "theme-dark": jaThemeDark as Messages,
  },
};

const DEFAULT_NAMESPACES: Namespace[] = [
  "common",
  "validation",
  "date-time",
];

function pickLocale(locale: SupportedLocale) {
  return localeDictionaries[locale] ?? localeDictionaries[DEFAULT_LOCALE];
}

function isNamespace(value: string): value is Namespace {
  return Object.prototype.hasOwnProperty.call(localeDictionaries[DEFAULT_LOCALE], value);
}

function getNamespace(locale: SupportedLocale, namespace: Namespace): Messages {
  const byLocale = pickLocale(locale);
  return byLocale[namespace] ?? pickLocale(DEFAULT_LOCALE)[namespace];
}

function interpolate(template: unknown, variables: Record<string, string | number>): string {
  if (typeof template !== "string") return "";
  return Object.keys(variables).reduce((result, key) => {
    return result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(variables[key]));
  }, template);
}

function getValue(messages: Messages, pathSegments: string[]): unknown {
  return pathSegments.reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, messages);
}

export function loadNamespaces(
  locale: SupportedLocale,
  namespaces: Namespace[] = DEFAULT_NAMESPACES,
): TranslationBundle {
  const uniqueNamespaces = Array.from(new Set([...DEFAULT_NAMESPACES, ...namespaces]));
  const payload: Partial<LocaleMessages> = {};

  uniqueNamespaces.forEach((ns) => {
    payload[ns] = getNamespace(locale, ns);
  });

  return {
    locale,
    namespaces: payload,
  };
}

export function createTranslator({ locale, namespaces }: TranslationBundle) {
  return (key: string, options: Record<string, string | number> = {}) => {
    let namespace: Namespace;
    let rawPath: string;

    if (key.includes(":")) {
      const [ns, rest] = key.split(":", 2);
      namespace = isNamespace(ns) ? ns : "common";
      rawPath = rest ?? "";
    } else {
      namespace = "common";
      rawPath = key;
    }

    if (!rawPath) {
      return key;
    }

    const path = rawPath.split(".");
    const fromBundle = namespaces[namespace];
    const fallbackMessages = getNamespace(DEFAULT_LOCALE, namespace);

    let template: unknown;

    if (fromBundle) {
      template = getValue(fromBundle, path);
    }

    if (template === undefined) {
      template = getValue(fallbackMessages, path);
    }

    if (template === undefined || template === null) {
      const missingKey = `${locale}:${namespace}.${rawPath}`;
      console.warn(`[i18n] Missing translation for key "${missingKey}"`);
      return key;
    }

    if (typeof template === "string") {
      return interpolate(template, options);
    }

    return key;
  };
}

