import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { SiteShell } from "@/components/SiteShell";
import "../globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootDocument lang="en">
      <SiteShell lang="en">{children}</SiteShell>
    </RootDocument>
  );
}
