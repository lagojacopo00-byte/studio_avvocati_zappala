import { PageShell } from "@/components/PageShell";
import { getPage } from "@/lib/content";
import type { Lang } from "@/lib/routes";

export function FirmView({ lang }: { lang: Lang }) {
  const c = getPage(lang, "firm");
  return (
    <PageShell tone="ivory">
      <h1 className="page-title">{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      <div className="prose">
        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
