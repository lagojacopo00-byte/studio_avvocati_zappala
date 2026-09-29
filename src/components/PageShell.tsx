import type { ReactNode } from "react";

/** Contenitore delle pagine interne: fondo blu notte (team) oppure avorio (testo). */
export function PageShell({ tone, children }: { tone: "navy" | "ivory"; children: ReactNode }) {
  return (
    <div className={`page page--${tone}`}>
      <div className="container">{children}</div>
    </div>
  );
}
