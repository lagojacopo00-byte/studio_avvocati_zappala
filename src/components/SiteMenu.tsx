"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { key: string; href: string; label: string };
type Props = { items: Item[]; navLabel: string; openLabel: string; closeLabel: string };

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Menu a tutto schermo: stato accessibile, apertura da tastiera, Escape, trappola del focus e ripristino del focus. */
export function SiteMenu({ items, navLabel, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [
        buttonRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((n): n is HTMLElement => n !== null);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? closeLabel : openLabel}
      </button>
      <div id="site-menu" ref={panelRef} className="menu-panel" hidden={!open} role="dialog" aria-modal="true" aria-label={navLabel}>
        <nav aria-label={navLabel}>
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
