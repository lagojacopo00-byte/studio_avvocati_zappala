import Image from "next/image";
import Link from "next/link";
import { getApprovedImage } from "@/lib/content";
import type { Person } from "@/lib/content";
import { displayName, displayRole } from "@/lib/people";
import { pathFor } from "@/lib/routes";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";

export function Portrait({ person, lang, priority = false }: { person: Person; lang: Lang; priority?: boolean }) {
  const photo = person.meta.photo;
  const record = photo ? getApprovedImage(photo.imageId) : undefined;
  if (!photo || !record) {
    return (
      <div className="portrait portrait--ph" data-placeholder="true" aria-hidden="true">
        <span>{UI[lang].photoSoon}</span>
      </div>
    );
  }
  return (
    <div className="portrait">
      <Image
        src={`/images/${record.file}`}
        alt={record.alt[lang]}
        fill
        priority={priority}
        sizes="(min-width: 900px) 30vw, (min-width: 600px) 45vw, 100vw"
        style={{ objectFit: "cover", objectPosition: `${photo.focal[0] * 100}% ${photo.focal[1] * 100}%` }}
      />
    </div>
  );
}

/** Griglia dell'intero organico pubblico: nome e ruolo sempre visibili; nessun carosello, nessun filtro JavaScript. */
export function PeopleGrid({ people, lang, headingLevel = 3 }: { people: Person[]; lang: Lang; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <ul className="people-grid">
      {people.map((person) => {
        const role = displayRole(person, lang);
        return (
          <li key={person.meta.slug}>
            <Link className="person-card" href={pathFor(lang, "people", person.meta.slug)}>
              <Portrait person={person} lang={lang} />
              <Heading className="person-card__name">{displayName(person, lang)}</Heading>
              <p className={`person-card__role${role.placeholder ? " is-placeholder" : ""}`}>{role.text}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
