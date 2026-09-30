# Studio Avvocati Zappalà — sito ufficiale

Sito vetrina istituzionale bilingue (italiano e inglese) di Studio Avvocati Zappalà. Nessun modulo, prenotazione o funnel: è la fonte ufficiale per chi cerca lo studio e i suoi avvocati.

Stato: **anteprima con contenuti segnaposto**. Foto di architettura, ritratti, biografie, sedi e recapiti sono ancora da fornire; nel sito compaiono come segnaposto espliciti e la produzione è bloccata finché ce ne sono.

## Documenti

| File | Cosa contiene |
|---|---|
| [`PRD.md`](PRD.md) | Prodotto, direzione artistica, criteri di accettazione |
| [`code.md`](code.md) | Specifica tecnica: URL, modello dei contenuti, SEO, prestazioni |
| [`PIANO.md`](PIANO.md) | Piano di realizzazione, riferimento analizzato, decisioni |
| [`LOOP.md`](LOOP.md) | Come iterare con i controlli automatici, cosa resta da fare |

## Avvio

Serve Node.js 22.18 o superiore (gli script leggono direttamente i file TypeScript). Per i controlli nel browser serve Chromium (`npx playwright-core install chromium`, oppure `CHROMIUM_PATH`).

```bash
npm install
npm run dev          # http://localhost:3000 → /it/
npm run check        # typecheck + lint + test + build + verifica automatica
npm test             # solo i test unitari
```

## Stack

Next.js (App Router, pagine pre-generate al build), React, TypeScript, Zod per la validazione dei contenuti. CSS con token di colore centralizzati; font Cormorant Garamond e Source Sans 3 (licenza OFL, inclusi in `src/fonts/`). Nessun database, servizio e-mail o backend.

I contenuti sono file JSON in `content/`, separati dai componenti. Ambiente: `SITE_ENV` (`preview` di default, oppure `production`) e `SITE_URL` (vedi `.env.example`).
