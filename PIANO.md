# PIANO — Sito Studio Avvocati Zappalà

Versione 0.3 · 29 settembre 2026 · Piano di realizzazione, da eseguire in una seconda fase (coding con loop engineering).
Documenti di riferimento: `PRD.md` (prodotto e direzione artistica) e `code.md` (specifica tecnica). Questo piano non li sostituisce: li traduce in fasi, task e verifiche.

Stato: **bozza con assunzioni esplicite**. Le assunzioni ancora da confermare sono marcate con 🔶 (sezione 11). Le scelte già prese dall'utente sono marcate con ✅.

### Decisioni prese (29 settembre 2026)

| Tema | Decisione |
|---|---|
| Fonte delle foto di architettura | ✅ Archivi a licenza libera (Wikimedia Commons, Unsplash, Pexels), con registro licenze; eventuale sostituzione futura con un fotografo |
| Riferimento WRM | ✅ Dominio sbloccato dall'utente e riferimento ispezionato (§2). Home ripresa dal modello a schermate con frase serif grande; team anche in home |
| Stack | ✅ **Next.js** (scelta dell'utente; la bozza 0.1 raccomandava Astro, vedi §6 per le conseguenze) |
| Aggiornamento contenuti | ✅ Uno sviluppatore, tramite file nel repository; nessun CMS nella v1 |

---

## 1. Cosa stiamo costruendo

Un sito vetrina istituzionale, bilingue (IT/EN), che diventi la fonte ufficiale per chi cerca lo studio o i suoi avvocati. Niente moduli, prenotazioni o funnel. La **home** segue l'impostazione del sito di riferimento (wrmgroup.net): sezioni a pieno schermo con colonna fotografica di architettura e una frase serif molto grande, superfici blu scure, header essenziale con Menu a tutto schermo, **team in primo piano**. Composizione, testi e immagini restano originali.

Priorità dichiarate dall'utente: home sul modello WRM · architetture eleganti di Roma (no Colosseo) · **grande importanza al team** (foto in arrivo).

## 2. Il riferimento (wrmgroup.net): cosa ho visto

Ispezionato il 29 settembre 2026 scaricando HTML e CSS e fotografando le pagine con un browser (desktop 1440 px e mobile 390 px). Cosa fa il sito:

**Home**: 4 “schermate” a pieno schermo, che cambiano con la rotella del mouse (scorrimento forzato).
- Schermate 1–2: colonna immagine a sinistra (~30% della larghezza, fotografia di architettura con velo blu) e, a destra, **una sola frase in serif molto grande** (3 righe). Schermata 3 (ultima): solo testo, titolo enorme in basso a sinistra su fondo pieno.
- Navigazione a **quattro quadratini dorati** sul lato destro con una linea verticale; ogni quadratino porta alla schermata corrispondente.
- Header: marchio a sinistra; a destra **IT/EN** e un pulsante **“Menu”**. Il menu apre un pannello a tutto schermo blu molto scuro con voci grandi in serif (Home, Chi siamo, Cosa facciamo, Team, Contatti…).
- Su mobile: immagine in alto (circa metà schermo), testo sotto, quadratini a destra.
- La home **non contiene il team**: il team ha una pagina a parte.

**Pagina Team**: fondo blu ardesia; a sinistra titolo “The Team” in serif dorato e filtro per sede; a destra **griglia a 3 colonne di ritratti**, formato circa 3:4, sfondo grigio uniforme di studio, mezzo busto, braccia conserte, giacche scure. Sotto ogni foto: **nome in serif bianco e ruolo in maiuscoletto piccolo dorato**. Ogni persona ha un profilo con URL proprio (`/team/nome-cognome/`). Circa 19 persone. Versione italiana sotto `/it/`.

**Stile**: serif Prata per titoli, Lato per il corpo; blu ardesia `#31354b`, blu notte `#0b123a`, accento oro `#cda434`. Il sito mostra anche un avviso e un banner cookie a comparsa: non li riprendiamo.

Nota tecnica: i titoli sono testo HTML normale, quindi il sito resta leggibile dai motori di ricerca nonostante l'effetto a schermate.

### Cosa prendiamo, cosa adattiamo, cosa lasciamo

| | Riferimento | Per Studio Zappalà |
|---|---|---|
| **Prendiamo** | Sezioni a pieno schermo con una frase serif grande; colonna immagine + testo; header essenziale con IT/EN e Menu a tutto schermo; quadratini di navigazione; griglia a 3 colonne di ritratti uniformi con nome serif e ruolo in maiuscoletto | Stessa impostazione, con testi, foto e marchio originali |
| **Adattiamo** | Scorrimento forzato con la rotella | ✅ *Nessuno scroll forzato* (code.md §6): scorrimento normale, sezioni alte almeno a schermo intero, quadratini come semplici link di ancoraggio 🔶 |
| **Adattiamo** | Team solo in una pagina a parte | Il team compare **anche nella home** (richiesta dell'utente: grande importanza al team) |
| **Adattiamo** | Accento oro | Il PRD esclude un oro dominante: usare la palette blu/avorio del PRD; eventuale accento discreto da validare nei contrasti 🔶 |
| **Lasciamo** | Logo, testi, foto, avviso di comparsa, filtro per sede | Il filtro per sede serve solo se lo studio avrà più sedi |

## 3. Home: struttura proposta

Sezioni alte almeno a schermo intero, scorrimento naturale. Contenuti principali sempre nell'HTML.

| # | Blocco | Superficie | Contenuto | Note |
|---|---|---|---|---|
| 1 | Header | trasparente su foto → blu notte allo scroll | Marchio testuale “Studio Avvocati Zappalà” a sinistra; a destra IT/EN e “Menu” (pannello a tutto schermo su mobile; su desktop pannello o voci in linea, da decidere 🔶) | Menu accessibile da tastiera (code.md §6) |
| 2 | Apertura | colonna con foto verticale di architettura (cupola, lanterna, colonnato) a sinistra + fondo blu ardesia | Una frase istituzionale in serif molto grande | Nessun claim, numero o anno inventato; nessun pulsante commerciale |
| 3 | Lo studio | foto in colonna + blu notte | 80–120 parole in serif grande, link “Scopri lo studio” | Testo da redigere dopo chiarimento servizi |
| 4 | Competenze | blu ardesia | Diritto civile · commerciale · aziendale (+ family office solo se confermato), frase serif e breve elenco | Voci solo se confermate |
| 5 | **Persone** | blu notte | Titolo serif + griglia a 3 colonne di ritratti uniformi, nome e ruolo sempre visibili, link a ogni profilo, “Tutte le persone” | **Blocco più importante della home** (vedi §5); differenza voluta rispetto al riferimento |
| 6 | Chiusura | fondo pieno, titolo grande in basso a sinistra (come l'ultima schermata di WRM) | Approccio in una frase + recapiti discreti | Nessun funnel |
| 7 | Footer | blu notte | Denominazione, sedi, recapiti, informative, selettore lingua | Solo dati confermati |

Navigazione laterale a quadratini: 🔶 facoltativa, come link di ancoraggio che non blocca lo scorrimento.

Le fotografie della colonna immagine sono **ritagli verticali**: le architetture alte e strette (lanterna di Sant'Ivo, cupole, colonnati) si adattano meglio di quelle orizzontali. Vedi §4.

Pagine collegate (URL da code.md §3): `/it/studio/`, `/it/competenze/`, `/it/persone/`, `/it/persone/{slug}/`, `/it/contatti/`, 404, informative; gli equivalenti `/en/…`. Family office e dettagli di competenza solo se approvati.

## 4. Fotografie di architettura

### 4.1 Non da Google Immagini

Non posso prendere le foto da Google Immagini, e sconsiglio di farlo anche a mano:

- i risultati di Google **non sono licenziati**: quasi tutte le foto sono protette dal diritto d'autore. Per uno studio legale un contenzioso per uso non autorizzato di immagini è un danno di reputazione;
- il PRD lo vieta già: A08 “nessuna immagine senza autorizzazione”, e il modello dei contenuti richiede per ogni immagine autore, licenza e credito;
- Google Immagini restituisce anteprime e rimandi ai siti di terzi, non file con licenza.

### 4.2 Alternative valutate (scelta: A ✅)

| Opzione | Costo | Pro | Contro |
|---|---|---|---|
| **A. Archivi a licenza libera** (Wikimedia Commons CC0/pubblico dominio o CC BY, Unsplash, Pexels) | 0 | Subito disponibili, licenza chiara per ogni file | Qualità variabile; CC BY richiede il credito; nessuna esclusiva; le foto possono comparire su altri siti |
| **B. Stock a pagamento** (Adobe Stock, Getty, Alamy, ecc.) | basso–medio | Alta qualità, licenza commerciale chiara | Nessuna esclusiva |
| **C. Fotografo a Roma** | medio–alto | Immagini uniche e coerenti con i ritratti del team, esclusiva | Tempi e budget |

Scelta: **A per sviluppare e lanciare la prima versione**, con un registro licenze (§4.4), e C come sostituzione futura se il budget lo consente. Il piano è costruito perché sostituire una foto sia solo cambiare un file e una riga del registro.

Per le licenze: preferire CC0/pubblico dominio e licenze Unsplash/Pexels; usare CC BY solo con credito visibile in pagina; **escludere** CC BY-SA e CC BY-NC (obblighi di condivisione o divieto d'uso commerciale non adatti a un sito professionale).

Nota legale da verificare con il referente del cliente: in Italia la riproduzione a fini commerciali di beni culturali in consegna pubblica può richiedere autorizzazione o canoni (Codice dei beni culturali, artt. 107–108). Una licenza Creative Commons del fotografo non copre necessariamente questo aspetto. Da controllare prima del lancio, soprattutto per interni di edifici statali.

### 4.3 Soggetti da cercare (Roma, elegante, non turistico)

Nessun Colosseo, nessuna cartolina, niente folla. Preferire dettagli, scorci e luce naturale.

- Sant'Ivo alla Sapienza: lanterna a spirale e cortile porticato (Borromini)
- Sant'Andrea al Quirinale: cupola e ovale interno (Bernini)
- Palazzo Spada: galleria prospettica (Borromini)
- Scala elicoidale di Palazzo Barberini (Borromini)
- Cortile di Palazzo Farnese e cortile della Cancelleria
- Piazza del Campidoglio: pavimentazione e facciate (Michelangelo)
- Tempietto di San Pietro in Montorio (Bramante)
- Loggia di Villa Farnesina
- Portico di Palazzo Massimo alle Colonne
- Cupola di Sant'Agnese in Agone; lanterne e tamburi in genere
- Pantheon: solo dettagli (cassettoni, cornici), niente inquadrature da cartolina

Il riferimento usa una **colonna fotografica verticale** (~30% della larghezza) accanto alla frase serif: servono quindi soprattutto immagini o ritagli **verticali** (lanterna, cupola con tamburo, colonnato, scala), con saturazione contenuta e zone scure adatte al velo blu. Min. 2400 px sul lato lungo. Qualche immagine orizzontale ampia può servire per la pagina Lo studio e per le condivisioni social.

### 4.4 Registro immagini

File `content/images.json` (o equivalente) con, per ogni immagine: file, soggetto, autore, fonte (URL), licenza, credito richiesto, data di verifica, dimensioni, testo alternativo, punto focale IT/EN, stato (`candidata` / `approvata`). Il build **fallisce** se una pagina pubblica usa un'immagine non `approvata`.

Processo: io preparo una **short list con URL e licenza esatti**; tu approvi; solo allora vengono scaricate. Serve accesso di rete ai domini scelti (§11).

## 5. Il team come elemento centrale

### 5.1 Dove compare

- **Home §6**: griglia grande di ritratti, non un carosello. Andrea Zappalà è il primo nominativo confermato; l'ordine degli altri segue il campo `ordine`.
- **Pagina Persone**: tutto l'organico pubblico, stessa griglia. Filtri solo se il numero di persone lo giustifica (code.md §6).
- **Profilo nominativo** per ogni avvocato: ritratto a sinistra (sticky su desktop, stesso rapporto della griglia), biografia a destra, ruolo, attività seguite, lingue e qualifiche solo se documentate, collegamenti a studio e competenze, recapiti solo se autorizzati.

### 5.2 Predisposto per l'arrivo delle foto

- Una cartella per persona e un file dati per lingua: `content/people/{slug}/it.md`, `en.md`, più `foto.jpg` in ingresso. Aggiungere una persona = aggiungere una cartella.
- La griglia si adatta a qualsiasi numero (da 1 a molte decine) senza modifiche al codice: 1 colonna su mobile, 2 su tablet, 3 su desktop (base di lavoro, code.md §5).
- **Pipeline foto**: dall'originale genera AVIF/WebP/JPEG a più larghezze, ritaglio con punto focale configurabile (rapporto 3:4 come nel riferimento, oppure 4:5 come proposto nel PRD: 🔶 da scegliere; nel codice è un solo valore), trattamento cromatico uniforme (desaturato, bianco e nero come alternativa da validare) applicato al build, così foto scattate in momenti diversi risultano coerenti.
- **Placeholder** chiari e uniformi: riquadro nel rapporto scelto in tonalità pietra con la dicitura “Foto in arrivo”, stato `placeholder`. Nessun volto sintetico, nessun nome fittizio.
- **Guardia di pubblicazione**: in produzione il build fallisce se una pagina pubblicata contiene ancora un placeholder, un testo segnaposto o un contenuto non `pubblicabile` (criterio A08). Le anteprime sono `noindex` **e** protette da accesso (noindex non è riservatezza, code.md §7).

### 5.3 Indicazioni per lo shooting dei ritratti 🔶

Utili se si vuole risparmiare lavoro di ritocco: stesso fondo e stessa luce per tutti, mezzo busto, stessa distanza e altezza dell'obiettivo, spazio sopra la testa per il ritaglio (3:4 o 4:5), file originali ad alta risoluzione (almeno 1600×2000 px), consenso alla pubblicazione per ciascuna persona.

## 6. Stack e architettura

`code.md` lasciava lo stack aperto. Scelta dell'utente: **Next.js** ✅.

- **Next.js (App Router), con tutte le pagine pre-generate al build** (`generateStaticParams` per `[lang]` e `[slug]`). Coerente con: contenuti presenti nell'HTML, nessun database, nessun endpoint, nessun modulo.
- **Conseguenze da gestire** (Next.js è più pesante di un generatore statico puro):
  - usare Server Component per tutto e Client Component solo dove serve (menu mobile, selettore lingua se richiede stato), per rispettare i budget di LCP e INP;
  - routing i18n con segmento `/[lang]/` (il routing i18n integrato è del vecchio Pages Router): mappa esplicita tra gli slug IT e EN (`/studio` ↔ `/firm`, `/persone` ↔ `/people`, ecc.) e generazione di canonical/hreflang dalla stessa mappa;
  - canonical e hreflang tramite l'API dei metadata; `sitemap` e `robots` tramite i file dedicati di Next.js, diversi per anteprima e produzione;
  - redirect della radice `/` verso la lingua principale configurato a livello di framework/hosting, senza rilevare la lingua del browser;
  - **decisione da prendere con l'hosting**: export completamente statico (`output: 'export'`, hosting statico qualsiasi, ma niente `next/image` ottimizzato a runtime né redirect/middleware lato server) oppure hosting con runtime Next.js (es. Vercel). In caso di export statico le immagini si elaborano con uno script `sharp` al build. Da verificare sulle versioni correnti al momento del coding.
- **Contenuti**: Markdown/MDX + dati strutturati (JSON/YAML) nel repository, letti da un caricatore tipizzato con validazione dello schema (es. Zod), separati dai componenti. Nessun CMS nella v1 ✅; se il cliente vorrà aggiornare in autonomia si aggiunge poi un CMS basato su git senza cambiare i componenti.
- **Stile**: CSS con token centralizzati (palette `#101F33` `#30465D` `#F5F3EF` `#E3DFD8` `#202832` `#FFFFFF`), nessun framework UI pesante.
- **Font**: una serif per i titoli e una sans per il corpo, con licenza verificata (candidati con licenza aperta da scegliere in fase di design), fallback di sistema, pochi pesi.
- **Hosting**: da decidere insieme al dominio (vedi punto sull'export statico). Nessun servizio di backend.
- **Fuori perimetro** (code.md §2): database, e-mail, moduli, calendario, CRM, account utente. Non installarli.

Le versioni esatte delle dipendenze si verificano al momento del coding.

## 7. Design system (sintesi)

Riprende `PRD.md` §7 e `code.md` §5. Punti chiave da rendere token/componenti:

- Colori: alternanza misurata di blu notte e avorio; niente blu elettrico, oro dominante o gradienti vistosi; contrasto verificato per testo, link, hover e focus (pietra mai come testo secondario su avorio).
- Tipografia: corpo 17–18 px, interlinea 1,55–1,7; H1 fluido circa 36–72 px; colonna di lettura controllata.
- Layout: contenitore max ~1280 px; margini 24 px mobile, 48–80 px desktop; spaziatura verticale 56–80 px mobile, 96–144 px desktop.
- Movimento: transizioni 150–250 ms; eventuali comparse 300–500 ms con contenuto visibile anche senza JavaScript; `prefers-reduced-motion` rispettato; niente parallax forzato, video automatico, cursore personalizzato o carosello.
- Componenti: Header/menu mobile, Hero, Sezione editoriale, Riga competenza, Card persona, Griglia persone, Profilo, Blocco contatti, Footer, Selettore lingua, Immagine responsive con credito.

## 8. SEO e contenuti (sintesi operativa)

Da `code.md` §7, come task verificabili nel build:

- canonical autoreferenziale per pagina e lingua; hreflang reciproci (+ `x-default` deciso con la radice); attributo `lang` coerente;
- sitemap con soli URL pubblicabili; `robots` diverso per anteprima e produzione;
- titoli univoci (home “Studio Avvocati Zappalà | Sito ufficiale”, profilo “Andrea Zappalà | Studio Avvocati Zappalà”) e descrizioni editoriali;
- H1 con il nome della persona sui profili; link HTML da Persone a ogni profilo e dai profili allo studio (nessuna pagina orfana);
- dati strutturati per studio e persone, solo con relazioni verificate e dati visibili in pagina; niente recensioni, premi o qualifiche inventati;
- 404 con stato HTTP corretto; censimento dei vecchi URL prima di qualsiasi redirect;
- Search Console e baseline delle ricerche nominative solo quando dominio e titolarità saranno disponibili.

Nessuna promessa di posizionamento né di rimozione di risultati esterni.

## 9. Fasi e task (pensati per loop engineering)

Ogni task ha una **condizione di completamento verificabile da macchina**, così il loop può ripetersi finché la verifica non passa. Gli strumenti di verifica sono una proposta.

### Fase 0 — Decisioni e materiali (prima del coding)
- Risposte alle domande residue del §11.
- ✅ Ispezione del riferimento WRM fatta (§2, §3).
- Short list immagini approvata (§4.3) e registro licenze avviato.
- Aggiornamento di `PRD.md` e `code.md` alla v0.3 con le scelte prese (stack Next.js, fonte immagini, aggiornamenti via repository, lingua principale). Nota: il PRD v0.2 escludeva ogni acquisizione di immagini “in questa fase”: la v0.3 deve autorizzare esplicitamente la selezione e il download delle immagini approvate.
- **Fatto quando**: decisioni registrate nei documenti, short list approvata.

### Fase 1 — Fondamenta
1. Scaffold del progetto, struttura cartelle, script di build e controllo.
2. Token di design, font, stile di base, layout con header/footer.
3. Routing IT/EN, selettore lingua che apre la pagina equivalente, redirect della radice.
4. Schema dei contenuti (Studio, Persona, Competenza, Immagine, Pagina, Configurazione) con validazione: i campi obbligatori mancanti fanno fallire il build.
5. Pipeline immagini e registro licenze.
- **Fatto quando**: `build` passa; una pagina di prova IT/EN si genera con hreflang e canonical corretti.

### Fase 2 — Pagine con contenuti segnaposto
1. Home (blocchi §3), con immagini candidate.
2. Lo studio, Competenze, Contatti (senza modulo), 404, informative segnaposto.
3. Persone (griglia) e profilo nominativo con **almeno 3 persone di prova** in placeholder, incluso Andrea Zappalà con nome reale.
4. Menu mobile, focus, salto al contenuto.
- **Fatto quando**: tutte le pagine IT/EN si generano; screenshot automatici a 320, 390, 768, 1280 e 1440 px senza overflow orizzontale né elementi tagliati.

### Fase 3 — Qualità
1. Controlli automatici: link interni, canonical/hreflang reciproci, sitemap, titoli univoci, un solo H1, `robots` per ambiente.
2. Accessibilità: scansione automatica (es. axe) + verifica manuale di tastiera, zoom 200%, movimento ridotto.
3. Prestazioni: budget immagini (hero mobile ~300 KB, ritratto ~120 KB) e obiettivi LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms in laboratorio.
4. Guardia di pubblicazione (§5.2) e anteprima protetta.
- **Fatto quando**: tutti i controlli passano; i risultati sono salvati come report nel repo. Nessun punteggio automatico viene presentato come “conformità WCAG”.

### Fase 4 — Contenuti reali
1. Inserimento di organico, ruoli, biografie, foto (arrivo previsto più avanti) e traduzioni revisionate.
2. Testi di studio e competenze dopo il chiarimento del family office e delle sedi.
3. Sostituzione immagini con le versioni approvate; verifica diritti e crediti.
- **Fatto quando**: nessun placeholder rimasto; ogni profilo ha bio, ruolo, ritratto autorizzato e traduzione equivalente (A02, A03, A08).

### Fase 5 — Lancio
- Dominio, hosting, informative reali, dati strutturati finali, sitemap, Search Console, baseline ricerche nominative.
- **Fatto quando**: criteri A01–A10 del PRD verificati uno per uno.

## 10. Rischi

| Rischio | Effetto | Mitigazione |
|---|---|---|
| Effetto a schermate del riferimento in conflitto con “nessuno scroll forzato” | Accessibilità e usabilità peggiori, rischio di regressioni su mobile | Scorrimento naturale con sezioni a schermo intero; niente blocco della rotella (§2) |
| Immagini senza licenza | Contestazioni, violazione di A08 | Registro licenze, build che blocca, short list approvata |
| Foto del team in ritardo o disomogenee | Lancio bloccato o sito poco coerente | Placeholder e pipeline di uniformazione, brief di shooting |
| Family office e servizi non definiti | Testi e menu incerti | Voce condizionata; testi dopo chiarimento |
| Placeholder indicizzati | SEO e reputazione | Guardia di pubblicazione, `noindex` + accesso protetto |
| Omonimi e risultati di terzi | Baseline SEO fuorviante | Baseline con distinzione dei risultati, nessuna attribuzione affrettata |
| Sede a Roma solo ipotizzata | Dati errati nel footer e nei dati strutturati | Roma resta riferimento visivo finché non confermata |

## 11. Domande aperte

Già risolte ✅ (29 settembre 2026): fonte foto = archivi a licenza libera; stack = Next.js; aggiornamenti = sviluppatore via repository; riferimento WRM = dominio sbloccato e sito ispezionato (§2).

Ancora da fare / confermare:

1. **Accesso alle foto**: `upload.wikimedia.org` e `images.unsplash.com` rispondono; `commons.wikimedia.org` ha risposto “429 troppe richieste” (limite lato Wikimedia sull'IP condiviso del container, da riprovare) e `www.pexels.com` risponde 403 (protezione anti-bot). Per Pexels e per i casi bloccati le foto possono essere scaricate a mano dall'utente dalla short list.
2. **Approvazione della short list di immagini** (§4.3) prima del download: **pronta in `docs/shortlist-immagini.md`** (14 foto; da decidere se accettare le CC BY-SA).
3. **Lingua principale e radice**: `/` porta a `/it/`? 🔶
4. **Hosting**: export statico o runtime Next.js (§6)? Può essere deciso più avanti, insieme al dominio.
5. **Dettagli della home** (§2–§3): scorrimento naturale al posto delle schermate forzate, quadratini di navigazione sì/no, menu a tutto schermo anche su desktop o voci in linea, rapporto dei ritratti 3:4 o 4:5, accento di colore oltre a blu e avorio. Ho proposto un default per ciascuno, marcato 🔶.

Da PRD §12, da raccogliere senza bloccare la Fase 1:

6. Dominio ufficiale, eventuale vecchio sito e URL da conservare.
7. Sedi reali e area servita; come descrivere il family office e cosa svolge lo studio.
8. Organico, ruoli, ordine, biografie, autorizzazioni; responsabile della revisione inglese.
9. Ritratti a colori o in bianco e nero; shooting.
10. Logo (o conferma del marchio tipografico), referente approvazioni, budget e data di lancio, recapiti pubblici.
