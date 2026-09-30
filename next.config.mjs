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
    // Header di sicurezza su ogni risposta. HSTS e CSP dipendono dall'hosting (HTTPS, script inline di Next): da configurare con il dominio.
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
    ];
    // L'anteprima non deve essere indicizzata. Non sostituisce una protezione d'accesso.
    const preview = isProduction ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [{ source: "/:path*", headers: [...security, ...preview] }];
  },
};

export default nextConfig;
