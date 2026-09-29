import type { ReactNode } from "react";

type Props = {
  id: string;
  tone: "navy" | "slate" | "ivory";
  labelledBy?: string;
  /** Colonna immagine a sinistra (come nel riferimento); assente = solo testo */
  media?: ReactNode;
  children: ReactNode;
};

/** Sezione alta almeno quanto lo schermo, con scorrimento normale (nessuno scroll forzato). */
export function Panel({ id, tone, labelledBy, media, children }: Props) {
  return (
    <section id={id} className={`panel panel--${tone}${media ? " panel--media" : ""}`} aria-labelledby={labelledBy}>
      {media && <div className="panel__media">{media}</div>}
      <div className="panel__body">{children}</div>
    </section>
  );
}
