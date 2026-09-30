import assert from "node:assert/strict";
import { test } from "node:test";
import { licenseUrl } from "../src/lib/licenses.ts";

test("indirizzi delle licenze Creative Commons, nella lingua della pagina", () => {
  assert.equal(licenseUrl("CC0", "it"), "https://creativecommons.org/publicdomain/zero/1.0/deed.it");
  assert.equal(licenseUrl("CC BY 4.0", "en"), "https://creativecommons.org/licenses/by/4.0/deed.en");
  assert.equal(licenseUrl("CC BY-SA 4.0", "it"), "https://creativecommons.org/licenses/by-sa/4.0/deed.it");
  assert.equal(licenseUrl("CC BY-SA 3.0", "en"), "https://creativecommons.org/licenses/by-sa/3.0/deed.en");
});

test("licenze non riconosciute (o non ammesse) non producono un indirizzo", () => {
  assert.equal(licenseUrl("CC BY-NC 4.0", "it"), null);
  assert.equal(licenseUrl("Tutti i diritti riservati", "it"), null);
  assert.equal(licenseUrl("", "en"), null);
});
