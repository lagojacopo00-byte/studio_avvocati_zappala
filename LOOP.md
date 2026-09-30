# LOOP — Come iterare sul sito con loop engineering

Il progetto è costruito in modo che ogni modifica passi da **controlli automatici**: si modifica, si lancia la verifica, si leggono i fallimenti, si corregge, si ripete finché tutto è verde. Questo file spiega il ciclo e cosa resta da fare.

## Il ciclo

```bash
npm run check      # typecheck → lint → test → build → verify (circa 1 minuto)
```

Oppure a pezzi, per iterare più in fretta:

| Comando | Cosa controlla | Quando |
|---|---|---|
| `npm run typecheck` | Tipi TypeScript | dopo ogni modifica al codice |
| `npm run lint` | ESLint (regole Next.js e React) | dopo ogni modifica al codice |
| `npm test` | Test unitari (`tests/`, runner di Node): mappa URL IT/EN e selettore lingua, licenze, contenuti, dizionari IT/EN, persone di esempio, guardia di produzione | dopo ogni modifica alla logica |
| `node scripts/check-content.mjs` | Schemi dei contenuti, slug/id/ordine unici, titoli e descrizioni unici per lingua, immagini nel registro | dopo ogni modifica a `content/` |
| `npm run build` | Compilazione e generazione delle pagine | prima di `verify` |
| `npm run verify` | Sito vero, server avviato: vedi sotto (`-- --skip-axe` salta la scansione di accessibilità per iterare più in fretta) | dopo `build` |
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
- **Intestazione e griglia**: il nome dello studio resta su una riga a 360–1280 px; la griglia delle persone ha 2 colonne sotto i 900 px e 3 sopra.
- **Prestazioni in laboratorio (telefono)**: nessuna immagine oltre 300 KB, LCP ≤ 2,5 s, CLS ≤ 0,1. Sono misure locali che proteggono dalle regressioni: non sostituiscono i dati reali (INP si misura solo sul campo).
- **Sicurezza**: header `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; niente `x-powered-by`. HSTS e CSP spettano all'hosting HTTPS.
- **Immagine social e crediti**: `og:image` assoluta e raggiungibile, `twitter:card`; ogni foto approvata compare nella pagina Crediti di entrambe le lingue; le immagini si caricano davvero.

### Integrazione continua

`.github/workflows/check.yml` esegue `npm run check` a ogni push e pull request e salva `reports/` come artefatto. (Il workflow è stato scritto e validato come YAML, ma il primo passaggio reale avviene su GitHub.)

### Regole del ciclo (imparate lavorando)

1. **Rosso prima del verde.** Prima si scrive il controllo e lo si vede fallire, poi si scrive il codice.
2. **Un controllo deve poter fallire.** Un controllo che misurava l'elemento sbagliato (il riquadro di un elemento flex, sempre uno, invece delle righe del testo) è passato quando avrebbe dovuto fallire. Si prova con un «sabotaggio»: budget impossibile per le prestazioni, mutazioni del codice per i test.
3. **Il ciclo trova le regressioni.** Una correzione a 390 px aveva causato 2 px di scorrimento orizzontale a 320 px: l'ha segnalato il controllo sui 5 formati, non l'occhio.

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

Fatto: fondamenta, tutte le pagine IT/EN con contenuti segnaposto, cicli di verifica, tre foto approvate con pagina Crediti, budget di prestazioni, header di sicurezza, immagine social, test unitari, integrazione continua.

Da fare (in ordine, ognuno con la sua condizione di completamento):

1. **Altre foto di architettura**: approvare dalla short list (`docs/shortlist-immagini.md`) le immagini per le pagine interne (Lo studio, Competenze, Contatti). Ogni foto CC BY-SA va approvata caso per caso. *Fatto quando:* `verify` passa e le pagine interne non hanno segnaposto d'immagine.
2. **Team**: contenuti e foto reali per ogni persona; ritratti uniformati. *Fatto quando:* nessun `data-placeholder` nelle pagine persone e ogni profilo ha ruolo, biografia IT/EN e foto approvata.
3. **Testi**: studio, competenze, contatti, informativa (dopo il chiarimento di servizi, sedi e family office). *Fatto quando:* tutti gli stati sono `pubblicabile`.
4. **Rifinitura visiva**: confronto con il riferimento su desktop e mobile (schermate in `reports/screens/`).
5. **Trattamento cromatico uniforme** delle foto di autori diversi (e dei ritratti), applicato al download in `scripts/fetch-images.mjs`. *Fatto quando:* le foto in home risultano omogenee a confronto affiancato.
6. **Prestazioni con ritratti reali**: budget ritratto ≈ 120 KB (oggi il controllo è a 300 KB per ogni immagine) e verifica su dati reali (INP ≤ 200 ms) dopo il lancio.
7. **Lancio**: dominio, `SITE_URL`, hosting, Search Console, baseline delle ricerche nominative.
