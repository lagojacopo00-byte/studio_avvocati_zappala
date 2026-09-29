import type { ReactNode } from "react";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#contenuto">
        {UI[lang].skip}
      </a>
      <SiteHeader lang={lang} />
      <main id="contenuto" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
