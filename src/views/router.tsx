import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPerson, isVisible, listRoutes } from "@/lib/content";
import { displayName } from "@/lib/people";
import { pathFor, resolveSegments } from "@/lib/routes";
import type { Lang, PageKey } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { ContactView } from "./ContactView";
import { ExpertiseView } from "./ExpertiseView";
import { FirmView } from "./FirmView";
import { HomeView } from "./HomeView";
import { PeopleView } from "./PeopleView";
import { PersonView } from "./PersonView";
import { PrivacyView } from "./PrivacyView";

const SITE_NAME = "Studio Avvocati Zappalà";

/** Parametri statici {slug} per la lingua: una voce per ogni pagina pubblicabile nell'ambiente corrente. */
export function staticParams(lang: Lang): { slug: string[] }[] {
  return listRoutes()
    .filter((r) => r.lang === lang)
    .map((r) => ({ slug: pathFor(lang, r.key, r.slug).split("/").filter(Boolean).slice(1) }));
}

function resolveOrNotFound(lang: Lang, slug: string[] | undefined) {
  const resolved = resolveSegments(lang, slug);
  if (!resolved) notFound();
  return resolved;
}

/**
 * Metadati della pagina. Per indirizzi sconosciuti NON si lancia notFound() qui: lo fa renderPage dentro il layout della lingua,
 * così la 404 esce con <html lang> corretto e nella lingua giusta.
 */
export function pageMetadata(lang: Lang, slug: string[] | undefined): Metadata {
  const resolved = resolveSegments(lang, slug);
  if (!resolved) return {};
  const { key, slug: personSlug } = resolved;
  if (key === "people" && personSlug) {
    const person = getPerson(personSlug);
    if (!person) return {};
    return buildMetadata({
      lang,
      key,
      slug: personSlug,
      title: `${displayName(person, lang)} | ${SITE_NAME}`,
      description: person.lang[lang].metaDescription,
    });
  }
  const page = getPage(lang, key);
  if (!isVisible(page.status)) return {};
  return buildMetadata({ lang, key, title: page.metaTitle, description: page.metaDescription });
}

export function renderPage(lang: Lang, slug: string[] | undefined) {
  const { key, slug: personSlug } = resolveOrNotFound(lang, slug);
  if (key === "people" && personSlug) {
    const person = getPerson(personSlug);
    if (!person) notFound();
    return <PersonView lang={lang} person={person} />;
  }
  if (!isVisible(getPage(lang, key).status)) notFound();
  const views: Record<PageKey, () => React.ReactElement> = {
    home: () => <HomeView lang={lang} />,
    firm: () => <FirmView lang={lang} />,
    expertise: () => <ExpertiseView lang={lang} />,
    people: () => <PeopleView lang={lang} />,
    contact: () => <ContactView lang={lang} />,
    privacy: () => <PrivacyView lang={lang} />,
  };
  return views[key]();
}
