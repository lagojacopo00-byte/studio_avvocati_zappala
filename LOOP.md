# LOOP — Come iterare sul sito con loop engineering

Il progetto è costruito in modo che ogni modifica passi da **controlli automatici**: si modifica, si lancia la verifica, si leggono i fallimenti, si corregge, si ripete finché tutto è verde. Questo file spiega il ciclo e cosa resta da fare.

## Il ciclo

```bash
npm run check      # typecheck → lint → build → verify (circa 1 minuto)
```

Oppure a pezzi, per iterare più in fretta:

| Comando | Cosa controlla | Quando |
|---|---|---|
| `npm run typecheck` | Tipi TypeScript | dopo ogni modifica al codice |
| `npm run lint` | ESLint (regole Next.js e React) | dopo ogni modifica al codice |
| `node scripts/check-content.mjs` | Schemi dei contenuti, slug/id/ordine unici, titoli e descrizioni unici per lingua, immagini nel registro | dopo ogni modifica a `content/` |
| `npm run build` | Compilazione e generazione delle pagine | prima di `verify` |
| `npm run verify` | Sito vero, server avviato: vedi sotto | dopo `build` |
| `npm run build:production` | Come il build, ma **fallisce finché restano segnaposto** o `SITE_URL` non è il dominio reale | prima di ogni pubblicazione |

Ogni comando esce con **codice 0 se tutto è a posto e 1 se qualcosa fallisce**, stampando i fallimenti uno per riga con l'area tra parentesi (`[hreflang]`, `[a11y]`, `[responsive]`…). Il rapporto completo è in `reports/verify.json`; le schermate di lavoro in `reports/screens/` (non versionate).

### Cosa verifica `npm run verify`

- **HTTP e routing**: ogni pagina pubblicabile risponde 200; `/` fa un redirect verso `/it/`; indirizzi sbagliati (anche l'URL italiano con lo slug inglese e viceversa) danno una vera 404 con `noindex`, `lang`, contenuto nell'HTML e link a `/it/` e `/en/`.
- **SEO**: un solo `h1`; `<html lang>` corretto; `title` e `description` presenti e **univoci per lingua**; un `canonical` autoreferenziale e assoluto; **hreflang reciproci** tra le due lingue; `robots` e `sitemap` coerenti con l'ambiente (anteprima: `noindex` e `Disallow: /`; produzione: indicizzabile); sitemap = esattamente le pagine pubblicabili; JSON-LD valido.
- **Perimetro (PRD A05)**: nessun `form`, `input`, `textarea`, `select`.
- **Struttura**: nessun salto di livello nei titoli; ogni `img` ha `alt`; nessun link interno rotto o che fa redirect; nessuna pagina orfana; ogni profilo è linkato dall'elenco Persone.
- **Layout (A06)**: nessuno scorrimento orizzontale a **320, 390, 768, 1280, 1440 px**, su tutte le pagine.
- **Accessibilità (A07)**: scansione **axe** con tag WCAG 2.2 AA a 1280 e 390 px (bloccanti: gravi e critici); menu da tastiera con trappola del focus, Escape e ritorno del focus; selettore lingua che apre la pagina equivalente; **sito utilizzabile senza JavaScript**; `prefers-reduced-motion` rispettato.
- **Contrasti**: rapporti calcolati dai token di `src/app/globals.css` (soglia 4,5:1 per il testo).

> Un punteggio automatico **non** dimostra la conformità WCAG. I controlli manuali (tastiera reale, zoom, lettori di schermo, foto, leggibilità) restano nella fase di collaudo.

## Come lavorare a un'iterazione

1. Scegliere **un** obiettivo piccolo (es. “aggiungere il campo X alla scheda persona”).
2. Modificare il codice o i contenuti.
3. Lanciare `npm run check`. Se fallisce, correggere **la causa** del primo fallimento e rilanciare. Non si disattivano controlli e non si allentano soglie per far passare il ciclo.
4. A verde, fare commit con un messaggio che spieghi il perché.

## Dove sta cosa

| Cosa | Dove |
|---|---|
| Testi delle pagine, persone, studio, registro immagini | `content/` (JSON validati da `src/lib/schema.ts`) |
| Mappa degli URL IT/EN | `src/lib/routes.ts` |
| Etichette dell'interfaccia (menu, 404, ecc.) | `src/lib/ui.ts` |
| Pagine | `src/views/` (una vista per pagina) e `src/app/(it|en)/…` (route) |
| Componenti | `src/components/` |
| Stili e token di colore | `src/app/globals.css` |
| Controlli | `scripts/check-content.mjs`, `scripts/verify.mjs` |

### Aggiungere una persona
1. Creare `content/people/<slug>/` con `person.json`, `it.json`, `en.json` (copiare da `andrea-zappala`). Le persone di esempio hanno `"demo": true` (nome e ruolo dimostrativi, solo anteprima): per una persona reale impostare `"demo": false`, `"nameConfirmed": true` e stato `pubblicabile` quando i dati sono verificati.
2. Foto: aggiungere l'immagine a `public/images/`, registrarla in `content/images.json` (stato `approvata` solo se autorizzata) e impostare `photo` in `person.json`.
3. `npm run check`.

### Aggiungere una foto di architettura
Registrare in `content/images.json`: file, soggetto, autore, fonte (URL), licenza, credito, data di verifica, dimensioni, testo alternativo IT/EN, punto focale, stato. Il file va in `public/images/`. Le immagini `candidata` **non** compaiono nel sito: il componente mostra un segnaposto finché lo stato non è `approvata`.

## Anteprima e produzione

- **Anteprima** (`SITE_ENV=preview`, default): segnaposto visibili e marcati, tutto `noindex`, `robots.txt` con `Disallow: /`. Non è una protezione d'accesso: se contiene materiale riservato va protetta a livello di hosting.
- **Produzione** (`SITE_ENV=production`, `SITE_URL=https://dominio-ufficiale`): compaiono solo i contenuti con stato `pubblicabile`; il build fallisce se resta un segnaposto, una foto non approvata o `SITE_URL` non è valido. Per provare: `npm run build:production` (fallirà finché i contenuti reali non sono pronti: è voluto).

## Stato e prossimi passi

Fatto: fondamenta, tutte le pagine IT/EN con contenuti segnaposto, cicli di verifica.

Da fare (in ordine, ognuno con la sua condizione di completamento):

1. **Foto di architettura**: inserire le immagini approvate dalla short list (`docs/shortlist-immagini.md`) nel registro e nella home. *Fatto quando:* `verify` passa e nella home non compare più il segnaposto delle immagini.
2. **Team**: contenuti e foto reali per ogni persona; ritratti uniformati. *Fatto quando:* nessun `data-placeholder` nelle pagine persone e ogni profilo ha ruolo, biografia IT/EN e foto approvata.
3. **Testi**: studio, competenze, contatti, informativa (dopo il chiarimento di servizi, sedi e family office). *Fatto quando:* tutti gli stati sono `pubblicabile`.
4. **Rifinitura visiva**: confronto con il riferimento su desktop e mobile (schermate in `reports/screens/`).
5. **Pipeline immagini**: script `sharp` per varianti AVIF/WebP, ritaglio con punto focale e trattamento cromatico uniforme (solo se si sceglie l'export statico; altrimenti `next/image`).
6. **Prestazioni**: budget hero mobile ≈ 300 KB e ritratto ≈ 120 KB; LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms in laboratorio.
7. **Lancio**: dominio, `SITE_URL`, hosting, Search Console, baseline delle ricerche nominative.
