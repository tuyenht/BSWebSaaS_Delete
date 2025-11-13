"use client";

import type { Translator } from "@bsweb/i18n";

type HeroSectionProps = {
  data?: {
    title?: string;
    subtitle?: string;
    ctaPrimaryLabel?: string;
    ctaPrimaryHref?: string;
    ctaSecondaryLabel?: string;
    ctaSecondaryHref?: string;
  };
  t: Translator;
};

export function HeroSection({ data, t }: HeroSectionProps) {
  return (
    <section className="py-20 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6">
        <h1 className="text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
          {data?.title ?? t("site-landing:hero.title")}
        </h1>
        <p className="text-lg text-slate-300 md:text-xl">
          {data?.subtitle ?? t("site-landing:hero.subtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            href={data?.ctaPrimaryHref ?? "#get-started"}
          >
            {data?.ctaPrimaryLabel ?? t("site-landing:cta.primary")}
          </a>
          <a
            className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            href={data?.ctaSecondaryHref ?? "#learn-more"}
          >
            {data?.ctaSecondaryLabel ?? t("site-landing:cta.secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
