// Validazione dei contenuti e guardia di pubblicazione.
//   node scripts/check-content.mjs               → valida schemi e invarianti (anteprima)
//   node scripts/check-content.mjs --production  → in più: nessun segnaposto, immagini approvate, SITE_URL reale
import fs from "node:fs";
import path from "node:path";
import { getAllPeople, getImages, getPage, getStudio, publishIssues } from "../src/lib/content.ts";
import { LANGS, PAGE_KEYS } from "../src/lib/routes.ts";

const production = process.argv.includes("--production");
const errors = [];
const fail = (msg) => errors.push(msg);

try {
  getStudio();
  for (const lang of LANGS) for (const key of PAGE_KEYS) getPage(lang, key);
  getAllPeople();
  getImages();
} catch (e) {
  fail(e instanceof Error ? e.message : String(e));
}

if (errors.length === 0) {
  const people = getAllPeople();
  const dup = (values, what) => {
    const seen = new Set();
    for (const v of values) (seen.has(v) ? fail(`${what} duplicato: ${v}`) : seen.add(v));
  };
  dup(people.map((p) => p.meta.slug), "slug persona");
  dup(people.map((p) => p.meta.id), "id persona");
  dup(people.map((p) => p.meta.order), "ordine persona");

  // Titoli e descrizioni univoci per lingua (code.md §7.4)
  for (const lang of LANGS) {
    dup(PAGE_KEYS.map((k) => getPage(lang, k).metaTitle), `titolo pagina (${lang})`);
    dup(PAGE_KEYS.map((k) => getPage(lang, k).metaDescription), `descrizione pagina (${lang})`);
  }

  const images = getImages();
  dup(images.map((i) => i.id), "id immagine");
  for (const img of images) {
    if (/\b(SA|NC|ND)\b/i.test(img.license)) fail(`images.json: licenza non ammessa per "${img.id}": ${img.license}`);
    if (img.status === "approvata") {
      if (!fs.existsSync(path.join("public", "images", img.file))) fail(`images.json: file mancante public/images/${img.file}`);
      if (!img.alt.it || !img.alt.en) fail(`images.json: testo alternativo IT/EN mancante per "${img.id}"`);
    }
  }
  for (const p of people) {
    if (p.meta.photo && !images.some((i) => i.id === p.meta.photo.imageId)) {
      fail(`people/${p.meta.slug}: imageId "${p.meta.photo.imageId}" assente dal registro immagini`);
    }
  }
}

if (production && errors.length === 0) {
  const issues = publishIssues();
  if (issues.length) fail(`Non pubblicabile: ${issues.length} elementi non pronti:\n  - ${issues.join("\n  - ")}`);
  const url = process.env.SITE_URL ?? "";
  if (!/^https:\/\/[^/]+$/.test(url) || /localhost|127\.0\.0\.1/.test(url)) {
    fail(`SITE_URL deve essere il dominio ufficiale https (valore attuale: "${url}")`);
  }
}

if (errors.length) {
  console.error("✗ Controllo contenuti fallito:\n" + errors.map((e) => "  " + e).join("\n"));
  process.exit(1);
}
const pending = publishIssues().length;
console.log(`✓ Contenuti validi${production ? " e pubblicabili" : ` (${pending} elementi ancora da completare prima della produzione)`}`);
