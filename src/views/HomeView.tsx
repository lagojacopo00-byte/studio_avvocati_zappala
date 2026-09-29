import Link from "next/link";
import { ArchImage } from "@/components/ArchImage";
import { JsonLd } from "@/components/JsonLd";
import { Panel } from "@/components/Panel";
import { PeopleGrid } from "@/components/PeopleGrid";
import { SectionDots } from "@/components/SectionDots";
import { getPage, getPeople } from "@/lib/content";
import { pathFor } from "@/lib/routes";
import type { Lang } from "@/lib/routes";
import { organizationLd } from "@/lib/seo";
import { UI } from "@/lib/ui";

const HOME_PEOPLE_LIMIT = 6;

/**
 * Home sul modello del riferimento: pannelli a schermo intero con colonna fotografica verticale e frase serif grande.
 * Differenze volute: scorrimento normale e persone in evidenza anche in home.
 */
export function HomeView({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const c = getPage(lang, "home");
  const people = getPeople().slice(0, HOME_PEOPLE_LIMIT);
  const sections = [
    { id: "hero", label: ui.sections.hero },
    { id: "firm", label: ui.sections.firm },
    { id: "expertise", label: ui.sections.expertise },
    { id: "people", label: ui.sections.people },
    { id: "closing", label: ui.sections.closing },
  ];

  return (
    <>
      <JsonLd data={organizationLd(lang)} />
      <SectionDots label={ui.sectionsNav} sections={sections} />

      <Panel id="hero" tone="slate" labelledBy="hero-title" media={<ArchImage imageId="home-hero" lang={lang} priority />}>
        <h1 id="hero-title" className="eyebrow">
          {ui.siteName}
        </h1>
        <p className="statement">{c.hero.statement}</p>
      </Panel>

      <Panel id="firm" tone="navy" media={<ArchImage imageId="home-firm" lang={lang} />}>
        <p className="statement">{c.firm.statement}</p>
        <Link className="text-link" href={pathFor(lang, "firm")}>
          {c.firm.linkLabel}
        </Link>
      </Panel>

      <Panel id="expertise" tone="slate" labelledBy="expertise-title">
        <h2 id="expertise-title" className="section-title">
          {c.expertise.title}
        </h2>
        <p className="statement">{c.expertise.statement}</p>
        <ul className="expertise-list">
          {c.expertise.items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
        <Link className="text-link" href={pathFor(lang, "expertise")}>
          {c.expertise.linkLabel}
        </Link>
      </Panel>

      <Panel id="people" tone="navy" labelledBy="people-title">
        <h2 id="people-title" className="section-title">
          {c.people.title}
        </h2>
        <p>{c.people.intro}</p>
        <PeopleGrid people={people} lang={lang} />
        <Link className="text-link" href={pathFor(lang, "people")}>
          {c.people.allLabel}
        </Link>
      </Panel>

      <Panel id="closing" tone="slate" labelledBy="closing-title">
        <h2 id="closing-title" className="visually-hidden">
          {ui.sections.closing}
        </h2>
        <p className="statement statement--xl">{c.closing.statement}</p>
        <Link className="text-link" href={pathFor(lang, "contact")}>
          {c.closing.linkLabel}
        </Link>
      </Panel>
    </>
  );
}
