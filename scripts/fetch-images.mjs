// Scarica in public/images/ le immagini APPROVATE del registro (content/images.json), ridimensionate.
//   node scripts/fetch-images.mjs [--force]
// Le immagini "candidata" non vengono scaricate: prima serve l'approvazione. Ogni voce deve avere fileUrl.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getImages } from "../src/lib/content.ts";

const MAX_SIDE = 2400;
const FORCE = process.argv.includes("--force");
// Wikimedia chiede uno User-Agent descrittivo con un riferimento al progetto (nessun dato personale).
const UA = process.env.IMAGE_USER_AGENT ?? "StudioZappalaSite/0.1 (https://github.com/lagojacopo00-byte/studio_avvocati_zappala)";

async function download(url) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 429 || res.status === 503) {
      const wait = Number(res.headers.get("retry-after") ?? 30) + attempt * 10;
      console.log(`  … limite di richieste, riprovo tra ${wait} s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    throw new Error(`HTTP ${res.status} per ${url}`);
  }
  throw new Error(`Troppi tentativi per ${url}`);
}

fs.mkdirSync("public/images", { recursive: true });
let failed = false;
for (const img of getImages()) {
  if (img.status !== "approvata") continue;
  const out = path.join("public", "images", img.file);
  if (fs.existsSync(out) && !FORCE) {
    console.log(`✓ ${img.id}: già presente`);
    continue;
  }
  if (!img.fileUrl) {
    console.error(`✗ ${img.id}: manca fileUrl nel registro`);
    failed = true;
    continue;
  }
  try {
    const original = await download(img.fileUrl);
    const info = await sharp(original)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log(`✓ ${img.id}: ${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB (${img.license}, ${img.author})`);
  } catch (e) {
    console.error(`✗ ${img.id}: ${e.message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
