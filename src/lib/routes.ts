// Mappa degli URL localizzati (code.md §3). Modulo senza dipendenze: usato anche dagli script Node.

export const LANGS = ["it", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "it";

export const PAGE_KEYS = ["home", "firm", "expertise", "people", "contact", "privacy", "credits"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/** Voci di navigazione principale (PRD §4). Family office solo dopo conferma del servizio. */
export const NAV_KEYS = ["firm", "expertise", "people", "contact"] as const satisfies readonly PageKey[];

const SEGMENTS: Record<PageKey, Record<Lang, string>> = {
  home: { it: "", en: "" },
  firm: { it: "studio", en: "firm" },
  expertise: { it: "competenze", en: "expertise" },
  people: { it: "persone", en: "people" },
  contact: { it: "contatti", en: "contact" },
  privacy: { it: "privacy", en: "privacy" },
  credits: { it: "crediti", en: "credits" },
};

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export function otherLang(lang: Lang): Lang {
  return lang === "it" ? "en" : "it";
}

/** Percorso con slash finale, es. /it/persone/andrea-zappala/ */
export function pathFor(lang: Lang, key: PageKey, slug?: string): string {
  const parts = [lang, SEGMENTS[key][lang]];
  if (slug) parts.push(slug);
  return "/" + parts.filter(Boolean).join("/") + "/";
}

export type Resolved = { key: PageKey; slug?: string };

/** Risolve i segmenti dopo /{lang}/ nella pagina corrispondente, oppure null (404). */
export function resolveSegments(lang: Lang, segments: readonly string[] | undefined): Resolved | null {
  const segs = segments ?? [];
  if (segs.length === 0) return { key: "home" };
  const key = PAGE_KEYS.find((k) => k !== "home" && SEGMENTS[k][lang] === segs[0]);
  if (!key) return null;
  if (segs.length === 1) return { key };
  if (key === "people" && segs.length === 2) return { key, slug: segs[1] };
  return null;
}

/** Percorso equivalente nell'altra lingua; ripiega sulla home della lingua di destinazione. */
export function switchLangPath(pathname: string, target: Lang): string {
  const segs = pathname.split("/").filter(Boolean);
  const [first, ...rest] = segs;
  if (first && isLang(first)) {
    const resolved = resolveSegments(first, rest);
    if (resolved) return pathFor(target, resolved.key, resolved.slug);
  }
  return `/${target}/`;
}
