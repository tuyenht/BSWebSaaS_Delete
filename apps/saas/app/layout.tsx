import type { ReactNode } from "react";

import { DEFAULT_LOCALE, createTranslator, loadNamespaces } from "@bsweb/i18n";

const defaultBundle = loadNamespaces(DEFAULT_LOCALE, ["site-landing"]);
const translate = createTranslator(defaultBundle);

export const metadata = {
  title: translate("site-landing:hero.title"),
  description: translate("site-landing:hero.subtitle"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
