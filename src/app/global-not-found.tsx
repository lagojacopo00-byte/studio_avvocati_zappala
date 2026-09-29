import type { Metadata } from "next";
import Link from "next/link";
import { sans, serif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { absolute: "Pagina non trovata · Page not found | Studio Avvocati Zappalà" },
  robots: { index: false, follow: false },
};

// Documento completo e statico per ogni indirizzo che non corrisponde a una pagina (stato HTTP 404).
// Bilingue perché non conosce la lingua dell'indirizzo richiesto.
export default function GlobalNotFound() {
  return (
    <html lang="it" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <main className="page page--ivory">
          <div className="container notfound">
            <h1 className="page-title">
              Pagina non trovata <span lang="en">· Page not found</span>
            </h1>
            <p className="lead">
              La pagina che cerchi non esiste o è stata spostata.{" "}
              <span lang="en">The page you are looking for does not exist or has been moved.</span>
            </p>
            <p>
              <Link className="text-link" href="/it/" lang="it">
                Torna alla home
              </Link>
              {" · "}
              <Link className="text-link" href="/en/" lang="en">
                Back to home
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
