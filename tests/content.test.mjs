import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { getAllPeople, getImages, getPage, getPeople, getSlotImage, listRoutes, publishIssues } from "../src/lib/content.ts";
import { displayName } from "../src/lib/people.ts";
import { LANGS, PAGE_KEYS } from "../src/lib/routes.ts";
import { UI } from "../src/lib/ui.ts";

const withEnv = (value, fn) => {
  const prev = process.env.SITE_ENV;
  process.env.SITE_ENV = value;
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.SITE_ENV;
    else process.env.SITE_ENV = prev;
  }
};

test("ogni persona ha profilo in entrambe le lingue e slug/ordine univoci", () => {
  const people = getAllPeople();
  assert.ok(people.length > 0);
  assert.equal(new Set(people.map((p) => p.meta.slug)).size, people.length);
  assert.equal(new Set(people.map((p) => p.meta.order)).size, people.length);
  for (const p of people) for (const l of LANGS) assert.ok(p.lang[l].metaDescription.length > 0, `${p.meta.slug} ${l}`);
});

test("i nomi pubblici sono univoci per lingua (titoli e URL distinti)", () => {
  for (const l of LANGS) {
    const names = getAllPeople().map((p) => displayName(p, l));
    assert.equal(new Set(names).size, names.length, l);
    assert.ok(names.every((n) => n.length > 0));
  }
});

test("Andrea Zappalà è l'unico nome confermato e compare con il nome reale", () => {
  const confirmed = getAllPeople().filter((p) => p.meta.nameConfirmed);
  assert.deepEqual(confirmed.map((p) => p.meta.slug), ["andrea-zappala"]);
  assert.equal(displayName(confirmed[0], "it"), "Andrea Zappalà");
});

test("le persone di esempio non sono pubblicabili e la produzione non le mostra", () => {
  const demo = getAllPeople().filter((p) => p.meta.demo);
  assert.ok(demo.length > 0);
  const issues = publishIssues();
  for (const p of demo) assert.ok(issues.some((i) => i.includes(p.meta.slug) && i.includes("ESEMPIO")), p.meta.slug);
  withEnv("production", () => {
    assert.equal(getPeople().length, 0, "in produzione, senza contenuti pubblicabili, non compare nessuna persona");
    assert.equal(listRoutes().length, 0);
  });
});

test("in anteprima si generano tutte le pagine in entrambe le lingue", () => {
  withEnv("preview", () => {
    const routes = listRoutes();
    for (const lang of LANGS) {
      for (const key of PAGE_KEYS) assert.ok(routes.some((r) => r.lang === lang && r.key === key && !r.slug), `${lang}/${key}`);
    }
    assert.equal(routes.filter((r) => r.lang === "it").length, routes.filter((r) => r.lang === "en").length);
  });
});

test("le pagine hanno titolo e descrizione unici per lingua", () => {
  for (const l of LANGS) {
    const titles = PAGE_KEYS.map((k) => getPage(l, k).metaTitle);
    const descs = PAGE_KEYS.map((k) => getPage(l, k).metaDescription);
    assert.equal(new Set(titles).size, titles.length, `titoli ${l}`);
    assert.equal(new Set(descs).size, descs.length, `descrizioni ${l}`);
  }
});

test("registro immagini: le approvate hanno file, credito, alt IT/EN e nessuna licenza NC/ND", () => {
  for (const img of getImages()) {
    assert.ok(!/\b(NC|ND)\b/i.test(img.license), img.id);
    if (img.status !== "approvata") continue;
    assert.ok(fs.existsSync(`public/images/${img.file}`), `file mancante per ${img.id}`);
    assert.ok(img.credit && img.alt.it && img.alt.en && img.fileUrl, img.id);
  }
});

test("gli slot delle immagini della home puntano a foto approvate", () => {
  for (const slot of ["home-hero", "home-firm", "home-expertise"]) assert.ok(getSlotImage(slot), slot);
});

test("i dizionari dell'interfaccia hanno le stesse chiavi in italiano e in inglese, nessuna vuota", () => {
  const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (typeof v === "object" ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
  const it = flat(UI.it);
  const en = flat(UI.en);
  assert.deepEqual(it.map(([k]) => k), en.map(([k]) => k));
  for (const [k, v] of [...it, ...en]) assert.ok(typeof v === "string" && v.length > 0, k);
});
