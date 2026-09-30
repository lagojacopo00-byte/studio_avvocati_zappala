import assert from "node:assert/strict";
import { test } from "node:test";
import { LANGS, NAV_KEYS, PAGE_KEYS, isLang, otherLang, pathFor, resolveSegments, switchLangPath } from "../src/lib/routes.ts";

const segmentsOf = (lang, key, slug) => pathFor(lang, key, slug).split("/").filter(Boolean).slice(1);

test("ogni pagina, in ogni lingua, ha un URL con slash finale che si risolve nella stessa pagina", () => {
  for (const lang of LANGS) {
    for (const key of PAGE_KEYS) {
      const path = pathFor(lang, key);
      assert.ok(path.startsWith(`/${lang}/`) && path.endsWith("/"), path);
      assert.deepEqual(resolveSegments(lang, segmentsOf(lang, key)), { key });
    }
  }
});

test("i profili hanno lo stesso slug in italiano e in inglese e si risolvono", () => {
  assert.equal(pathFor("it", "people", "andrea-zappala"), "/it/persone/andrea-zappala/");
  assert.equal(pathFor("en", "people", "andrea-zappala"), "/en/people/andrea-zappala/");
  for (const lang of LANGS) {
    assert.deepEqual(resolveSegments(lang, segmentsOf(lang, "people", "x-y")), { key: "people", slug: "x-y" });
  }
});

test("gli indirizzi di una lingua non funzionano nell'altra (niente pagine duplicate)", () => {
  assert.equal(resolveSegments("it", ["firm"]), null);
  assert.equal(resolveSegments("en", ["studio"]), null);
  assert.equal(resolveSegments("it", ["persone", "a", "b"]), null);
  assert.equal(resolveSegments("it", ["studio", "extra"]), null);
  assert.equal(resolveSegments("it", ["nonesiste"]), null);
});

test("in ogni lingua gli slug delle pagine sono distinti", () => {
  for (const lang of LANGS) {
    const segs = PAGE_KEYS.map((k) => pathFor(lang, k));
    assert.equal(new Set(segs).size, segs.length);
  }
});

test("il selettore lingua apre la pagina equivalente e conserva il contesto", () => {
  assert.equal(switchLangPath("/it/", "en"), "/en/");
  assert.equal(switchLangPath("/it/studio/", "en"), "/en/firm/");
  assert.equal(switchLangPath("/en/firm/", "it"), "/it/studio/");
  assert.equal(switchLangPath("/en/people/andrea-zappala/", "it"), "/it/persone/andrea-zappala/");
  for (const lang of LANGS) {
    for (const key of PAGE_KEYS) {
      const there = switchLangPath(pathFor(lang, key), otherLang(lang));
      assert.equal(there, pathFor(otherLang(lang), key));
      assert.equal(switchLangPath(there, lang), pathFor(lang, key), "l'andata e ritorno torna al punto di partenza");
    }
  }
});

test("indirizzi sconosciuti ripiegano sulla home della lingua di destinazione", () => {
  assert.equal(switchLangPath("/it/xyz/", "en"), "/en/");
  assert.equal(switchLangPath("/foo/", "it"), "/it/");
  assert.equal(switchLangPath("/", "en"), "/en/");
});

test("la navigazione principale contiene solo pagine esistenti; le lingue sono riconosciute", () => {
  for (const k of NAV_KEYS) assert.ok(PAGE_KEYS.includes(k));
  assert.ok(isLang("it") && isLang("en") && !isLang("fr"));
  assert.equal(otherLang("it"), "en");
});
