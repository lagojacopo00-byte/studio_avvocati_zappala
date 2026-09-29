"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, switchLangPath } from "@/lib/routes";
import type { Lang } from "@/lib/routes";

type Props = { lang: Lang; label: string; names: Record<Lang, string> };

/** Apre la pagina equivalente nell'altra lingua (mantiene il contesto), senza rilevare la lingua del browser. */
export function LangSwitch({ lang, label, names }: Props) {
  const pathname = usePathname();
  return (
    <nav className="lang-switch" aria-label={label}>
      <ul>
        {LANGS.map((l) => (
          <li key={l}>
            <Link
              href={switchLangPath(pathname, l)}
              lang={l}
              hrefLang={l}
              aria-label={names[l]}
              aria-current={l === lang ? "true" : undefined}
            >
              {l.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
