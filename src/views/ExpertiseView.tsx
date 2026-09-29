import { PageShell } from "@/components/PageShell";
import { getPage } from "@/lib/content";
import type { Lang } from "@/lib/routes";

export function ExpertiseView({ lang }: { lang: Lang }) {
  const c = getPage(lang, "expertise");
  return (
    <PageShell tone="ivory">
      <h1 className="page-title">{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      <div className="prose">
        {c.items.map((item) => (
          <section key={item.id} id={item.id}>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
