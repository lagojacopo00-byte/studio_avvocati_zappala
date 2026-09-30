// Ciclo di verifica del sito (PIANO.md §9, Fase 3). Da lanciare dopo `npm run build`.
//   node scripts/verify.mjs [--skip-browser]
// Avvia `next start`, controlla HTML/SEO/link (fetch) e layout/accessibilità/tastiera (Chromium), esce con codice 1 se qualcosa fallisce.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { parse } from "node-html-parser";
import { getImages, listRoutes } from "../src/lib/content.ts";
import { LANGS, pathFor } from "../src/lib/routes.ts";

const PORT = Number(process.env.VERIFY_PORT ?? 4173);
const BASE = `http://127.0.0.1:${PORT}`;
const PRODUCTION = process.env.SITE_ENV === "production";
const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const SKIP_BROWSER = process.argv.includes("--skip-browser");
const WIDTHS = [320, 390, 768, 1280, 1440];

const failures = [];
const warnings = [];
const stats = {};
const step = (m) => console.log(`… ${m} (${((Date.now() - T0) / 1000).toFixed(0)} s)`);
const T0 = Date.now();
const fail = (area, msg) => failures.push(`[${area}] ${msg}`);
const warn = (area, msg) => warnings.push(`[${area}] ${msg}`);
const count = (k) => (stats[k] = (stats[k] ?? 0) + 1);

const attr = (el, name) => {
  for (const [k, v] of Object.entries(el.attributes)) if (k.toLowerCase() === name) return v;
  return undefined;
};

async function get(path, init) {
  return fetch(BASE + path, { redirect: "manual", ...init });
}

// ---------------------------------------------------------------- contrasti dai token del CSS
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
function checkContrast() {
  const css = fs.readFileSync("src/app/globals.css", "utf8");
  const tokens = Object.fromEntries([...css.matchAll(/--([a-z]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
  // [primo piano, sfondo, soglia, uso]
  const pairs = [
    ["ivory", "navy", 4.5, "testo su blu notte"],
    ["white", "navy", 4.5, "wordmark/menu su blu notte"],
    ["mist", "navy", 4.5, "testo secondario su blu notte (ruoli, footer)"],
    ["white", "slate", 4.5, "testo su ardesia (pannelli)"],
    ["mist", "slate", 4.5, "testo secondario su ardesia (eyebrow, competenze)"],
    ["ink", "ivory", 4.5, "testo su avorio"],
    ["navy", "white", 4.5, "salta al contenuto"],
    ["slate", "ivory", 4.5, "ardesia come testo/link su avorio"],
    ["mist", "slate", 3, "bordo segnaposto/quadratini su ardesia (non testuale)"],
  ];
  for (const [fg, bg, min, use] of pairs) {
    const r = ratio(tokens[fg], tokens[bg]);
    count("contrasti verificati");
    if (r < min) fail("contrasto", `${fg} su ${bg} = ${r.toFixed(2)}:1 (< ${min}) — ${use}`);
  }
  // Colore pietra non ammesso come testo secondario su avorio (code.md §5)
  if (ratio(tokens.stone, tokens.ivory) >= 4.5) warn("contrasto", "verifica la regola: pietra su avorio ora supera 4.5:1");
}

// ---------------------------------------------------------------- server
async function startServer() {
  // detached: il server gira in un gruppo di processi proprio, così si chiude per intero (npx lascerebbe vivo il figlio)
  const proc = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: ["ignore", "pipe", "pipe"], env: process.env, detached: true });
  let log = "";
  proc.stdout.on("data", (d) => (log += d));
  proc.stderr.on("data", (d) => (log += d));
  for (let i = 0; i < 60; i++) {
    try {
      const r = await get("/robots.txt");
      if (r.status === 200) return proc;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  stopServer(proc);
  throw new Error("Il server non è partito:\n" + log);
}

function stopServer(proc) {
  try {
    process.kill(-proc.pid, "SIGTERM");
  } catch {}
}

// ---------------------------------------------------------------- controlli HTML/SEO
const imageChecked = new Set();

async function checkHtml(expected) {
  const pages = new Map(); // percorso → { doc, canonical, alternates }
  for (const { lang, key, slug } of expected) {
    const path = pathFor(lang, key, slug);
    const res = await get(path);
    count("pagine controllate");
    if (res.status !== 200) {
      fail("http", `${path} → ${res.status}`);
      continue;
    }
    const doc = parse(await res.text());
    pages.set(path, { doc, lang, key, slug });
    const at = (m) => `${path} ${m}`;

    if (doc.querySelector("html")?.getAttribute("lang") !== lang) fail("lang", at(`<html lang> ≠ "${lang}"`));
    const h1s = doc.querySelectorAll("h1");
    if (h1s.length !== 1) fail("seo", at(`h1 presenti: ${h1s.length} (deve essere 1)`));
    else if (!h1s[0].text.trim()) fail("seo", at("h1 vuoto"));
    if (!doc.querySelector("title")?.text.trim()) fail("seo", at("title mancante"));
    if (!doc.querySelector('meta[name="description"]')?.getAttribute("content")) fail("seo", at("meta description mancante"));

    const canonicals = doc.querySelectorAll('link[rel="canonical"]');
    const expectedCanonical = SITE_URL + path;
    if (canonicals.length !== 1) fail("canonical", at(`link canonical: ${canonicals.length}`));
    else if (canonicals[0].getAttribute("href") !== expectedCanonical) fail("canonical", at(`non autoreferenziale: ${canonicals[0].getAttribute("href")}`));

    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    if (PRODUCTION && /noindex/i.test(robots)) fail("robots", at("noindex in produzione"));
    if (!PRODUCTION && !/noindex/i.test(robots)) fail("robots", at("l'anteprima deve essere noindex"));

    // Perimetro: nessun modulo, prenotazione o funnel (PRD A05)
    if (doc.querySelector("form, input, textarea, select")) fail("perimetro", at("contiene form/campi (fuori ambito)"));

    // Ordine dei titoli
    let prev = 0;
    for (const h of doc.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
      const level = Number(h.tagName[1]);
      if (prev && level > prev + 1) fail("titoli", at(`salto da h${prev} a h${level} ("${h.text.trim().slice(0, 30)}")`));
      prev = level;
    }

    for (const img of doc.querySelectorAll("img")) {
      if (attr(img, "alt") === undefined) fail("immagini", at(`<img> senza alt: ${attr(img, "src")}`));
      const src = attr(img, "src");
      if (src && src.startsWith("/") && !imageChecked.has(src)) {
        // l'immagine deve davvero caricarsi (file presente, ottimizzatore attivo)
        imageChecked.add(src);
        const r = await fetch(BASE + src);
        count("immagini caricate");
        if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) fail("immagini", at(`immagine non caricabile ${src} → ${r.status}`));
      }
    }

    const placeholders = doc.querySelectorAll("[data-placeholder]").length;
    const bracket = /\[[^\]]{3,}\]/.test(doc.querySelector("main")?.text ?? "");
    if (PRODUCTION && (placeholders || bracket)) fail("segnaposto", at(`segnaposto ancora presenti (${placeholders} immagini, testo tra parentesi: ${bracket})`));
    if (!PRODUCTION && (placeholders || bracket)) count("pagine con segnaposto (ok in anteprima)");

    for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        JSON.parse(s.text);
        count("blocchi JSON-LD validi");
      } catch {
        fail("json-ld", at("JSON-LD non valido"));
      }
    }
  }

  // Titoli e descrizioni univoci, hreflang reciproci
  const titles = new Map();
  const descs = new Map();
  const altMap = new Map(); // canonical → { lang: url }
  for (const [path, { doc }] of pages) {
    const t = doc.querySelector("title")?.text.trim();
    const d = doc.querySelector('meta[name="description"]')?.getAttribute("content");
    const lang = path.split("/")[1];
    if (titles.has(lang + t)) fail("seo", `titolo duplicato in ${lang} "${t}": ${path} e ${titles.get(lang + t)}`);
    titles.set(lang + t, path);
    if (descs.has(lang + d)) fail("seo", `descrizione duplicata in ${lang}: ${path} e ${descs.get(lang + d)}`);
    descs.set(lang + d, path);
    const alts = {};
    for (const l of doc.querySelectorAll('link[rel="alternate"]')) {
      const hl = attr(l, "hreflang");
      if (hl) alts[hl] = l.getAttribute("href");
    }
    altMap.set(SITE_URL + path, alts);
  }
  for (const [url, alts] of altMap) {
    for (const lang of LANGS) {
      const target = alts[lang];
      if (!target) {
        fail("hreflang", `${url}: manca hreflang="${lang}"`);
        continue;
      }
      const back = altMap.get(target);
      if (!back) fail("hreflang", `${url}: l'alternativa ${lang} (${target}) non è una pagina del sito`);
      else if (Object.values(back).indexOf(url) === -1) fail("hreflang", `${url} ↔ ${target}: non reciproci`);
      else count("coppie hreflang reciproche");
    }
  }

  // Crediti completi: ogni immagine approvata compare nella pagina Crediti di ogni lingua con la sua fonte
  for (const lang of LANGS) {
    const credits = pages.get(pathFor(lang, "credits"));
    for (const img of getImages().filter((i) => i.status === "approvata")) {
      if (!credits) fail("crediti", `pagina Crediti ${lang} assente ma ci sono immagini approvate`);
      else if (!credits.doc.querySelector(`a[href="${img.source}"]`)) fail("crediti", `${lang}: "${img.id}" non compare nella pagina Crediti`);
      else count("crediti verificati");
    }
  }

  // Link interni: raggiungibili, diretti al canonico, ancore esistenti; nessuna pagina orfana
  const checked = new Map();
  const linkedFrom = new Map();
  for (const [path, { doc }] of pages) {
    for (const a of doc.querySelectorAll("a[href]")) {
      let href = a.getAttribute("href");
      if (!href) continue;
      if (href.startsWith(SITE_URL)) href = href.slice(SITE_URL.length) || "/";
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (id && !doc.querySelector(`[id="${id}"]`)) fail("link", `${path}: ancora ${href} senza destinazione`);
        continue;
      }
      if (!href.startsWith("/") || href.startsWith("//")) continue; // esterni: fuori ambito
      const [clean] = href.split("#");
      if (!linkedFrom.has(clean)) linkedFrom.set(clean, new Set());
      linkedFrom.get(clean).add(path);
      if (!checked.has(clean)) {
        const r = await get(clean);
        checked.set(clean, r.status);
        count("link interni distinti");
        if (r.status !== 200) fail("link", `${clean} → ${r.status} (da ${path})`);
      }
    }
  }
  for (const { lang, key, slug } of expected) {
    const p = pathFor(lang, key, slug);
    if (key !== "home" && !linkedFrom.has(p)) fail("orfane", `${p} non è collegata da nessuna pagina`);
    if (key === "people" && slug && !linkedFrom.get(p)?.has(pathFor(lang, "people"))) fail("orfane", `${p} non è collegata dall'elenco Persone`);
  }
  return pages;
}

async function checkRoutingAndFiles(expected) {
  const root = await get("/");
  if (root.status !== 307 && root.status !== 308) fail("redirect", `/ → ${root.status}, atteso un redirect`);
  else if (!(root.headers.get("location") ?? "").endsWith("/it/")) fail("redirect", `/ → ${root.headers.get("location")}`);
  else count("redirect radice ok");

  for (const p of ["/it/nonesiste/", "/en/nonesiste/", "/foo/", "/it/firm/", "/en/studio/", "/it/persone/inesistente/"]) {
    const r = await get(p);
    if (r.status !== 404) {
      fail("404", `${p} → ${r.status} (atteso 404, niente "soft 404")`);
      continue;
    }
    count("404 corretti");
    const doc = parse(await r.text());
    if (!/noindex/i.test(doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "")) fail("404", `${p}: la pagina 404 deve essere noindex`);
    if (!doc.querySelector("html")?.getAttribute("lang")) fail("404", `${p}: manca <html lang>`);
    if (!doc.querySelector("h1")?.text.trim()) fail("404", `${p}: la 404 non ha contenuto nell'HTML iniziale (h1 vuoto)`);
    const hrefs = doc.querySelectorAll("a[href]").map((a) => a.getAttribute("href"));
    if (!hrefs.includes("/it/") || !hrefs.includes("/en/")) fail("404", `${p}: la 404 deve rimandare a /it/ e /en/`);
  }

  const robots = await (await get("/robots.txt")).text();
  if (PRODUCTION) {
    if (/Disallow:\s*\/\s*$/m.test(robots)) fail("robots", "robots.txt blocca tutto in produzione");
    if (!robots.includes(`${SITE_URL}/sitemap.xml`)) fail("robots", "robots.txt senza sitemap");
  } else if (!/Disallow:\s*\/\s*$/m.test(robots)) fail("robots", "robots.txt di anteprima deve avere Disallow: /");

  const sm = await (await get("/sitemap.xml")).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const want = expected.map((e) => SITE_URL + pathFor(e.lang, e.key, e.slug));
  for (const w of want) if (!locs.includes(w)) fail("sitemap", `manca ${w}`);
  for (const loc of locs) if (!want.includes(loc)) fail("sitemap", `URL non pubblicabile/canonico in sitemap: ${loc}`);
  if (new Set(locs).size !== locs.length) fail("sitemap", "URL duplicati");
  stats["URL in sitemap"] = locs.length;
}

// ---------------------------------------------------------------- browser: layout, tastiera, accessibilità
async function checkBrowser(expected) {
  const { chromium } = await import("playwright-core");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const exe = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
  const browser = await chromium.launch({ executablePath: exe, args: ["--no-proxy-server"] });
  fs.mkdirSync("reports/screens", { recursive: true });
  const shotKeys = new Set(["home", "people"]);
  const routes = expected.map((e) => ({ ...e, path: pathFor(e.lang, e.key, e.slug) }));

  step("browser avviato");
  // 1) Nessun overflow orizzontale ai cinque formati (PRD A06) + schermate di lavoro
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 800 : 900 } });
    const page = await ctx.newPage();
    for (const r of routes) {
      await page.goto(BASE + r.path, { waitUntil: "load" });
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      count("controlli overflow");
      if (m.sw > m.iw + 1) fail("responsive", `${r.path} a ${w}px: scrollWidth ${m.sw} > ${m.iw}`);
      if ((shotKeys.has(r.key) && (!r.slug || r.slug === "andrea-zappala")) && r.lang === "it") {
        await page.screenshot({ path: `reports/screens/${r.key}${r.slug ? "-profilo" : ""}-${w}.png`, fullPage: true });
      }
    }
    await ctx.close();
  }

  step("overflow ai 5 formati");
  // 2) Accessibilità automatica (axe) a desktop e mobile: bloccanti serious/critical
  for (const w of [1280, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    for (const r of routes) {
      await page.goto(BASE + r.path, { waitUntil: "load" });
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      count("scansioni axe");
      for (const v of res.violations) {
        const msg = `${r.path} @${w}: ${v.id} (${v.impact}) — ${v.help} [${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}]`;
        if (v.impact === "serious" || v.impact === "critical") fail("a11y", msg);
        else warn("a11y", msg);
      }
    }
    await ctx.close();
  }

  step("axe");
  // 3) Menu da tastiera, trappola del focus, Escape, selettore lingua
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/it/", { waitUntil: "load" });
    const btn = page.locator("button.menu-toggle");
    await btn.focus();
    await page.keyboard.press("Enter");
    if ((await btn.getAttribute("aria-expanded")) !== "true") fail("menu", "Invio sul pulsante non apre il menu");
    if (!(await page.locator("#site-menu").isVisible())) fail("menu", "il pannello non è visibile dopo l'apertura");
    let escaped = false;
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const a = document.activeElement;
        return !!a && (a.closest("#site-menu") !== null || a.classList.contains("menu-toggle") || a.closest(".site-header") !== null);
      });
      if (!inside) escaped = true;
    }
    if (escaped) fail("menu", "il focus esce dal menu aperto (manca la trappola del focus)");
    await page.keyboard.press("Escape");
    if ((await btn.getAttribute("aria-expanded")) !== "false") fail("menu", "Escape non chiude il menu");
    if (!(await page.evaluate(() => document.activeElement?.classList.contains("menu-toggle")))) fail("menu", "dopo Escape il focus non torna al pulsante");
    await btn.click();
    await page.locator('#site-menu a[href="/it/persone/"]').click();
    await page.waitForURL("**/it/persone/");
    if ((await btn.getAttribute("aria-expanded")) !== "false") fail("menu", "il menu resta aperto dopo la navigazione");
    count("controlli menu");

    await page.goto(BASE + "/it/persone/andrea-zappala/", { waitUntil: "load" });
    const enHref = await page.locator('.lang-switch a[hreflang="en"]').getAttribute("href");
    if (enHref !== "/en/people/andrea-zappala/") fail("lingua", `selettore lingua → ${enHref}`);
    await page.goto(BASE + "/en/firm/", { waitUntil: "load" });
    const itHref = await page.locator('.lang-switch a[hreflang="it"]').getAttribute("href");
    if (itHref !== "/it/studio/") fail("lingua", `selettore lingua (en/firm) → ${itHref}`);
    count("controlli selettore lingua");
    await ctx.close();
  }

  step("menu e lingua");
  // 4) Senza JavaScript: contenuti e navigazione restano disponibili
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(BASE + "/it/", { waitUntil: "load" });
    const n = await page.locator(".noscript-nav a:visible").count();
    if (n < 4) fail("no-js", `navigazione visibile senza JavaScript: ${n} link (attesi ≥ 4)`);
    if (!(await page.locator("h1").first().isVisible())) fail("no-js", "h1 non visibile senza JavaScript");
    if ((await page.locator(".people-grid a").count()) < 1) fail("no-js", "persone assenti senza JavaScript");
    count("controlli senza JavaScript");
    await ctx.close();
  }

  // 5) Movimento ridotto: nessuna animazione/transizione attiva
  {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + "/it/", { waitUntil: "load" });
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    if (behavior !== "auto") fail("movimento", `scroll-behavior con movimento ridotto: ${behavior}`);
    count("controlli movimento ridotto");
    await ctx.close();
  }
  await browser.close();
}

// ---------------------------------------------------------------- main
const started = Date.now();
let server;
try {
  checkContrast();
  step("contrasti");
  const expected = listRoutes();
  stats["pagine attese"] = expected.length;
  server = await startServer();
  step("server avviato");
  await checkRoutingAndFiles(expected);
  step("routing, 404, robots, sitemap");
  await checkHtml(expected);
  step("HTML, SEO, hreflang, link");
  if (!SKIP_BROWSER) await checkBrowser(expected);
} catch (e) {
  fail("verify", e instanceof Error ? e.stack ?? e.message : String(e));
} finally {
  if (server) stopServer(server);
}

fs.mkdirSync("reports", { recursive: true });
fs.writeFileSync("reports/verify.json", JSON.stringify({ env: PRODUCTION ? "production" : "preview", stats, failures, warnings }, null, 2));
console.log("\nStatistiche:", JSON.stringify(stats));
if (warnings.length) console.log(`\n${warnings.length} avvisi (non bloccanti):\n  ${[...new Set(warnings)].slice(0, 15).join("\n  ")}`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} controlli falliti:\n  ${failures.slice(0, 60).join("\n  ")}`);
  process.exit(1);
}
console.log(`\n✓ Tutti i controlli superati in ${((Date.now() - started) / 1000).toFixed(1)} s (${PRODUCTION ? "produzione" : "anteprima"})`);
