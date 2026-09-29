import { PageShell } from "@/components/PageShell";
import { PeopleGrid } from "@/components/PeopleGrid";
import { getPage, getPeople } from "@/lib/content";
import type { Lang } from "@/lib/routes";

export function PeopleView({ lang }: { lang: Lang }) {
  const c = getPage(lang, "people");
  return (
    <PageShell tone="navy">
      <h1 className="page-title">{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      <PeopleGrid people={getPeople()} lang={lang} headingLevel={2} />
    </PageShell>
  );
}
