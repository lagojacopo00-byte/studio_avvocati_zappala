import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Portrait } from "@/components/PeopleGrid";
import type { Person } from "@/lib/content";
import { displayName, displayRole } from "@/lib/people";
import { pathFor } from "@/lib/routes";
import type { Lang } from "@/lib/routes";
import { personLd } from "@/lib/seo";
import { UI } from "@/lib/ui";

export function PersonView({ lang, person }: { lang: Lang; person: Person }) {
  const ui = UI[lang];
  const loc = person.lang[lang];
  const name = displayName(person, lang);
  const role = displayRole(person, lang);
  return (
    <PageShell tone="navy">
      {person.meta.nameConfirmed && <JsonLd data={personLd(lang, name, person.meta.slug)} />}
      <div className="person-page">
        <Portrait person={person} lang={lang} priority />
        <div>
          <h1 className="page-title">{name}</h1>
          <p className={`person-page__role${role.placeholder ? " is-placeholder" : ""}`}>{role.text}</p>
          {person.meta.demo && <p className="demo-note">{ui.demoProfile}</p>}
          <div className="prose">
            {loc.bio.length > 0 ? loc.bio.map((p) => <p key={p}>{p}</p>) : <p className="is-placeholder">{ui.bioTbd}</p>}
          </div>
          {(loc.expertise.length > 0 || loc.languages.length > 0) && (
            <dl className="meta-list">
              {loc.expertise.length > 0 && (
                <>
                  <dt>{ui.expertiseLabel}</dt>
                  <dd>{loc.expertise.join(", ")}</dd>
                </>
              )}
              {loc.languages.length > 0 && (
                <>
                  <dt>{ui.languagesLabel}</dt>
                  <dd>{loc.languages.join(", ")}</dd>
                </>
              )}
            </dl>
          )}
          <p style={{ marginTop: "2.5rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <Link className="text-link" href={pathFor(lang, "people")}>
              {ui.backToPeople}
            </Link>
            <Link className="text-link" href={pathFor(lang, "firm")}>
              {ui.toFirm}
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
