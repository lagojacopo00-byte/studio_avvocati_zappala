import type { Metadata } from "next";
import { getSlotImage } from "./content.ts";
import { IS_PRODUCTION, SITE_URL, absoluteUrl } from "./env.ts";
import { LANGS, pathFor } from "./routes.ts";
import type { Lang, PageKey } from "./routes.ts";

type Args = { lang: Lang; key: PageKey; slug?: string; title: string; description: string };

/** Un canonical autoreferenziale per pagina e lingua + hreflang reciproci (code.md §7). x-default rinviato alla scelta sulla radice. */
export function buildMetadata({ lang, key, slug, title, description }: Args): Metadata {
  const canonical = absoluteUrl(pathFor(lang, key, slug));
  const languages = Object.fromEntries(LANGS.map((l) => [l, absoluteUrl(pathFor(l, key, slug))]));
  // Immagine social: 1200×630 generata da npm run images dall'immagine dell'apertura (solo se approvata)
  const hero = getSlotImage("home-hero");
  const social = hero ? [{ url: absoluteUrl("/og.jpg"), width: 1200, height: 630, alt: hero.alt[lang] }] : undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: { canonical, languages },
    robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Studio Avvocati Zappalà",
      title,
      description,
      locale: lang === "it" ? "it_IT" : "en_GB",
      alternateLocale: lang === "it" ? ["en_GB"] : ["it_IT"],
      images: social,
    },
    twitter: { card: "summary_large_image", title, description, images: social?.map((i) => i.url) },
  };
}

/** Solo relazioni e dati confermati: nome dello studio e URL. Nessuna sede, recensione o qualifica. */
export function organizationLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Studio Avvocati Zappalà",
    url: absoluteUrl(pathFor(lang, "home")),
  };
}

export function personLd(lang: Lang, name: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: absoluteUrl(pathFor(lang, "people", slug)),
    worksFor: { "@type": "Organization", name: "Studio Avvocati Zappalà" },
  };
}
