import Link from "next/link";
import { NAV_KEYS, pathFor } from "@/lib/routes";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";
import { LangSwitch } from "./LangSwitch";
import { SiteMenu } from "./SiteMenu";

export function SiteHeader({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const items = NAV_KEYS.map((key) => ({ key, href: pathFor(lang, key), label: ui.nav[key] }));
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href={pathFor(lang, "home")}>
          {ui.siteName}
        </Link>
        <div className="site-header__tools">
          <LangSwitch lang={lang} label={ui.languageNav} names={ui.languageNames} />
          <SiteMenu items={items} navLabel={ui.mainNav} openLabel={ui.menu} closeLabel={ui.closeMenu} />
        </div>
      </div>
      {/* Senza JavaScript il menu a tutto schermo non si apre: la navigazione resta disponibile qui. */}
      <noscript>
        <nav className="noscript-nav" aria-label={ui.mainNav}>
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </header>
  );
}
