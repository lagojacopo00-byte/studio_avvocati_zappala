import type { MetadataRoute } from "next";
import { listRoutes } from "@/lib/content";
import { absoluteUrl } from "@/lib/env";
import { LANGS, pathFor } from "@/lib/routes";

/** Solo URL pubblicabili e canonici, con le alternative linguistiche (code.md §7). */
export default function sitemap(): MetadataRoute.Sitemap {
  return listRoutes().map(({ lang, key, slug }) => ({
    url: absoluteUrl(pathFor(lang, key, slug)),
    alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, absoluteUrl(pathFor(l, key, slug))])) },
  }));
}
