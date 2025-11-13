"use client";

import React, { useMemo } from "react";

import { createTranslator, loadNamespaces, type SupportedLocale } from "@bsweb/i18n";
import { HeroSection } from "./sections/HeroSection";

type Section = {
  key: string;
  data?: Record<string, unknown>;
  id?: string;
};

type Props = {
  sections: Section[];
  locale?: SupportedLocale;
};

const DEFAULT_LOCALE: SupportedLocale = "vi";
const DEFAULT_SECTION_NAMESPACES = ["site-core", "site-landing", "theme-default"] as const;

export const SectionRenderer: React.FC<Props> = ({ sections, locale = DEFAULT_LOCALE }) => {
  const bundle = useMemo(
    () => loadNamespaces(locale, [...DEFAULT_SECTION_NAMESPACES]),
    [locale],
  );

  const t = useMemo(() => createTranslator(bundle), [bundle]);

  return (
    <>
      {sections.map((section, index) => {
        const key = section.id ?? `${section.key}-${index}`;

        switch (section.key) {
          case "hero":
            return <HeroSection key={key} data={section.data} t={t} />;
          default:
            return (
              <section key={key} className="py-8">
                <div className="container mx-auto text-sm text-slate-400">
                  {t("common:messages.unknownSection", { key: section.key })}
                </div>
              </section>
            );
        }
      })}
    </>
  );
};