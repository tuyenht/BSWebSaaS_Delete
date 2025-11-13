import { DEFAULT_LOCALE, createTranslator, loadNamespaces } from "@bsweb/i18n";

export default function LandingPage() {
  const bundle = loadNamespaces(DEFAULT_LOCALE, ["site-landing"]);
  const t = createTranslator(bundle);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-slate-50">{t("site-landing:hero.title")}</h1>
      <p className="max-w-2xl text-center text-slate-300">
        {t("site-landing:hero.subtitle")}
      </p>
    </main>
  );
}
