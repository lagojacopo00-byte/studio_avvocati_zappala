import type { Lang } from "./routes.ts";

/** Indirizzo del testo della licenza Creative Commons (per la pagina Crediti); null se non riconosciuta. */
export function licenseUrl(license: string, lang: Lang): string | null {
  const l = license.trim().toUpperCase();
  const deed = lang === "it" ? "deed.it" : "deed.en";
  if (l === "CC0") return `https://creativecommons.org/publicdomain/zero/1.0/${deed}`;
  const m = /^CC BY(-SA)? (\d\.\d)$/.exec(l);
  return m ? `https://creativecommons.org/licenses/by${m[1] ? "-sa" : ""}/${m[2]}/${deed}` : null;
}
