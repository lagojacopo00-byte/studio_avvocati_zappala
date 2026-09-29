import { PageShell } from "@/components/PageShell";
import { getPage } from "@/lib/content";
import type { Lang } from "@/lib/routes";

export function PrivacyView({ lang }: { lang: Lang }) {
  const c = getPage(lang, "privacy");
  return (
    <PageShell tone="ivory">
      <h1 className="page-title">{c.h1}</h1>
      <div className="prose">
        {c.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </PageShell>
  );
}
