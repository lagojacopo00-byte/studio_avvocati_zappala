import { PageShell } from "@/components/PageShell";
import { getImages, getPage } from "@/lib/content";
import { licenseUrl } from "@/lib/licenses";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";

/** Autore, fonte e licenza di ogni fotografia in uso (obbligo delle licenze CC BY e CC BY-SA). */
export function CreditsView({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const c = getPage(lang, "credits");
  const images = getImages().filter((img) => img.status === "approvata");
  return (
    <PageShell tone="ivory">
      <h1 className="page-title">{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      {images.length > 0 ? (
        <ul className="credits-list">
          {images.map((img) => {
            const licUrl = licenseUrl(img.license, lang);
            return (
              <li key={img.id} id={img.id}>
                <p>
                  <strong>{img.alt[lang]}</strong>
                </p>
                <p>
                  {img.author} ·{" "}
                  {licUrl ? (
                    <a href={licUrl} rel="noopener noreferrer">
                      {img.license}
                    </a>
                  ) : (
                    img.license
                  )}{" "}
                  ·{" "}
                  <a href={img.source} rel="noopener noreferrer">
                    {ui.creditsSource}
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pending-note">{c.empty}</p>
      )}
      <p className="prose">{c.modification}</p>
    </PageShell>
  );
}
