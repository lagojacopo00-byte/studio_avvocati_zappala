import type { Person } from "./content.ts";
import type { Lang } from "./routes.ts";
import { UI } from "./ui.ts";

/** Nome pubblico: solo il nome confermato; per i segnaposto un'etichetta numerata e univoca. */
export function displayName(person: Person, lang: Lang): string {
  return person.meta.nameConfirmed ? person.meta.fullName : `${UI[lang].personPlaceholder} ${person.meta.order}`;
}

export function displayRole(person: Person, lang: Lang): { text: string; placeholder: boolean } {
  const role = person.lang[lang].role;
  return role ? { text: role, placeholder: false } : { text: UI[lang].roleTbd, placeholder: true };
}
