// Caricamento e validazione dei contenuti da /content (JSON) al build. Usato anche da scripts/check-content.mjs.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { LANGS, PAGE_KEYS } from "./routes.ts";
import type { Lang, PageKey } from "./routes.ts";
import {
  ImageRegisterSchema,
  PAGE_SCHEMAS,
  SlotsSchema,
  PersonLangSchema,
  PersonMetaSchema,
  StudioSchema,
} from "./schema.ts";
import type { ImageRecord, PersonLang, PersonMeta, Status, Studio } from "./schema.ts";

const ROOT = path.join(process.cwd(), "content");
const isProduction = () => process.env.SITE_ENV === "production";

function readJson<S extends z.ZodType>(rel: string, schema: S): z.infer<S> {
  const raw: unknown = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) throw new Error(`Contenuto non valido: content/${rel}\n${z.prettifyError(result.error)}`);
  return result.data;
}

/** In produzione compare solo ciò che è "pubblicabile"; in anteprima tutto (i segnaposto sono etichettati). */
export function isVisible(status: Status): boolean {
  return isProduction() ? status === "pubblicabile" : true;
}

export const PAGE_FILES: Record<PageKey, string> = {
  home: "home",
  firm: "firm",
  expertise: "expertise",
  people: "people",
  contact: "contact",
  privacy: "privacy",
  credits: "credits",
};

export type PageContent<K extends PageKey> = z.infer<(typeof PAGE_SCHEMAS)[K]>;

export function getStudio(): Studio {
  return readJson("studio.json", StudioSchema);
}

export function getPage<K extends PageKey>(lang: Lang, key: K): PageContent<K> {
  return readJson(`pages/${lang}/${PAGE_FILES[key]}.json`, PAGE_SCHEMAS[key]) as PageContent<K>;
}

export function getImages(): ImageRecord[] {
  return readJson("images.json", ImageRegisterSchema);
}

export function getApprovedImage(id: string): ImageRecord | undefined {
  return getImages().find((img) => img.id === id && img.status === "approvata");
}

/** Immagine approvata assegnata a uno slot dell'interfaccia; undefined = mostra il segnaposto. */
export function getSlotImage(slot: string): ImageRecord | undefined {
  const id = readJson("slots.json", SlotsSchema)[slot];
  return id ? getApprovedImage(id) : undefined;
}

export type Person = { meta: PersonMeta; lang: Record<Lang, PersonLang> };

function personSlugs(): string[] {
  return fs
    .readdirSync(path.join(ROOT, "people"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export function getAllPeople(): Person[] {
  return personSlugs()
    .map((dir) => {
      const meta = readJson(`people/${dir}/person.json`, PersonMetaSchema);
      if (meta.slug !== dir) throw new Error(`content/people/${dir}: lo slug "${meta.slug}" non coincide con la cartella`);
      const lang = Object.fromEntries(
        LANGS.map((l) => [l, readJson(`people/${dir}/${l}.json`, PersonLangSchema)]),
      ) as Record<Lang, PersonLang>;
      return { meta, lang };
    })
    .sort((a, b) => a.meta.order - b.meta.order);
}

/** Persone visibili nell'ambiente corrente (profilo bilingue completo). */
export function getPeople(): Person[] {
  return getAllPeople().filter((p) => isVisible(p.meta.status) && LANGS.every((l) => isVisible(p.lang[l].status)));
}

export function getPerson(slug: string): Person | undefined {
  return getPeople().find((p) => p.meta.slug === slug);
}

export type RouteEntry = { lang: Lang; key: PageKey; slug?: string };

/** Tutte le pagine pubblicabili nell'ambiente corrente, per lingua. Fonte unica per static params, sitemap e verifiche. */
export function listRoutes(): RouteEntry[] {
  const entries: RouteEntry[] = [];
  for (const lang of LANGS) {
    for (const key of PAGE_KEYS) {
      if (!isVisible(getPage(lang, key).status)) continue;
      entries.push({ lang, key });
    }
    for (const person of getPeople()) entries.push({ lang, key: "people", slug: person.meta.slug });
  }
  return entries;
}

/** Elenca ogni contenuto non ancora "pubblicabile" (per la guardia di pubblicazione). */
export function publishIssues(): string[] {
  const issues: string[] = [];
  const studio = getStudio();
  if (studio.status !== "pubblicabile") issues.push(`studio.json: stato "${studio.status}"`);
  for (const lang of LANGS) {
    for (const key of PAGE_KEYS) {
      const { status } = getPage(lang, key);
      if (status !== "pubblicabile") issues.push(`pages/${lang}/${key}.json: stato "${status}"`);
    }
  }
  for (const p of getAllPeople()) {
    if (p.meta.demo) issues.push(`people/${p.meta.slug}: nome e ruolo di ESEMPIO (demo) — da sostituire con i dati reali`);
    if (p.meta.status !== "pubblicabile") issues.push(`people/${p.meta.slug}/person.json: stato "${p.meta.status}"`);
    for (const l of LANGS) {
      if (p.lang[l].status !== "pubblicabile") issues.push(`people/${p.meta.slug}/${l}.json: stato "${p.lang[l].status}"`);
    }
    if (p.meta.photo && !getApprovedImage(p.meta.photo.imageId)) {
      issues.push(`people/${p.meta.slug}: foto "${p.meta.photo.imageId}" non approvata nel registro immagini`);
    }
    if (!p.meta.photo) issues.push(`people/${p.meta.slug}: manca la foto`);
  }
  for (const img of getImages()) {
    if (img.status !== "approvata") issues.push(`images.json: "${img.id}" non approvata`);
  }
  return issues;
}

