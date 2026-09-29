"use client";

import { useEffect, useState } from "react";

type Props = { label: string; sections: { id: string; label: string }[] };

/** Navigazione laterale a quadratini: normali link di ancoraggio, non bloccano lo scorrimento. */
export function SectionDots({ label, sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="section-dots" aria-label={label}>
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} aria-current={s.id === active ? "location" : undefined}>
              <span className="visually-hidden">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
