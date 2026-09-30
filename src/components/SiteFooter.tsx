import Link from "next/link";
import { getStudio } from "@/lib/content";
import { IS_PRODUCTION } from "@/lib/env";
import { NAV_KEYS, pathFor } from "@/lib/routes";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";

export function SiteFooter({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const studio = getStudio();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__name">{studio.name}</p>
        <nav aria-label={ui.footerNav}>
          <ul>
            {[...NAV_KEYS, "privacy" as const, "credits" as const].map((key) => (
              <li key={key}>
                <Link href={pathFor(lang, key)}>{ui.nav[key]}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {studio.offices.length > 0 && (
          <address>
            {studio.offices.map((o) => (
              <p key={o.label}>
                <strong>{o.label}</strong>
                <br />
                {o.address.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))}
          </address>
        )}
        <p className="site-footer__legal">© {studio.name}</p>
        {!IS_PRODUCTION && <p className="site-footer__legal">{ui.previewNote}</p>}
      </div>
    </footer>
  );
}
