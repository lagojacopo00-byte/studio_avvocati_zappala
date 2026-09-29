const isProduction = process.env.SITE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Più layout radice (uno per lingua, così <html lang> è esatto): la 404 è un documento completo e statico.
  experimental: { globalNotFound: true },
  async redirects() {
    // Temporaneo (307) finché la lingua principale non è confermata (PIANO.md §11).
    // Nessun rilevamento della lingua del browser.
    return [{ source: "/", destination: "/it/", permanent: false }];
  },
  async headers() {
    // L'anteprima non deve essere indicizzata. Non sostituisce una protezione d'accesso.
    if (isProduction) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
