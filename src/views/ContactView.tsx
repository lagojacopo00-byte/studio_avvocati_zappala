import { PageShell } from "@/components/PageShell";
import { getPage, getStudio } from "@/lib/content";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";

/** Solo recapiti verificati con link telefono/e-mail. Nessun modulo, nessun invio simulato (PRD A05). */
export function ContactView({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const c = getPage(lang, "contact");
  const studio = getStudio();
  const hasDetails = studio.offices.length > 0 || studio.email !== null || studio.phone !== null;
  return (
    <PageShell tone="ivory">
      <h1 className="page-title">{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      {hasDetails ? (
        <div className="contact-list">
          {studio.offices.length > 0 && (
            <div>
              <h2 className="visually-hidden">{ui.officesLabel}</h2>
              {studio.offices.map((o) => (
                <address key={o.label}>
                  <strong>{o.label}</strong>
                  <br />
                  {o.address.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </address>
              ))}
            </div>
          )}
          {studio.email && (
            <p>
              {ui.emailLabel}: <a href={`mailto:${studio.email}`}>{studio.email}</a>
            </p>
          )}
          {studio.phone && (
            <p>
              {ui.phoneLabel}: <a href={`tel:${studio.phone.replace(/\s+/g, "")}`}>{studio.phone}</a>
            </p>
          )}
        </div>
      ) : (
        <p className="pending-note">{c.pending}</p>
      )}
    </PageShell>
  );
}
