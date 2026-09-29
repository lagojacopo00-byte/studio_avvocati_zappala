import type { ReactNode } from "react";
import { sans, serif } from "@/lib/fonts";
import type { Lang } from "@/lib/routes";

/** Documento HTML con lingua corretta: un layout radice per lingua, così <html lang> è sempre esatto. */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
