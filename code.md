# code.md — Studio Avvocati Zappalà

Versione 0.3 · 29 settembre 2026 · Specifica per la realizzazione.
Documento complementare a PRD.md. Dalla v0.3 il sito è in sviluppo in anteprima (vedi `PIANO.md` e `LOOP.md`); la pubblicazione non è autorizzata.

## 1. Vincoli di lavoro

**Aggiornamento v0.3.** Lo sviluppo è autorizzato dall'utente (29 settembre 2026) in ambiente di anteprima. Restano fuori dall'incarico: pubblicazione, configurazione del dominio e di Search Console, modifiche a profili esterni. Non modificare il sito Intreia né ereditarne logo, dominio, contatti o hosting.

Versione 0.2 (superata): l'incarico riguardava soltanto due documenti; niente applicazioni, pacchetti, preview o pubblicazione.

Requisiti confermati: sito vetrina di Studio Avvocati Zappalà; italiano e inglese; qualità istituzionale e SEO nominativa; tutti i professionisti rappresentati; nessun form o prenotazione; palette neutra e blu scuro; architetture romane senza Colosseo; logo, foto e biografie provvisori.

## 2. Architettura da scegliere

**Decisioni v0.3 (utente, 29 settembre 2026):** stack **Next.js** (App Router, tutte le pagine pre-generate al build); contenuti come file JSON nel repository, validati con Zod e separati dai componenti; **aggiornamenti a cura di uno sviluppatore tramite il repository, senza CMS nella v1** (un CMS basato su git potrà essere aggiunto senza cambiare i componenti); fonte delle foto di architettura: archivi a licenza libera con registro licenze. Un layout radice per lingua garantisce `<html lang>` esatto; la 404 è un documento completo (`global-not-found`).

Principio invariato: contenuti principali presenti nell'HTML e JavaScript limitato alle interazioni (menu, selettore lingua, indicatore di sezione). Resta aperta la scelta tra export statico e hosting con runtime Next.js, da decidere con dominio e hosting.

Nessun database, servizio email, endpoint per moduli, calendario, CRM o account utente necessario per il perimetro attuale. Non installarli in previsione di un uso ipotetico. Hosting, versioni e dipendenze saranno scelti e verificati nella fase di realizzazione.

## 3. URL e lingue

Schema proposto, da confermare rispetto al dominio e a eventuali URL esistenti:

| Italiano | Inglese |
|---|---|
| /it/ | /en/ |
| /it/studio/ | /en/firm/ |
| /it/competenze/ | /en/expertise/ |
| /it/persone/ | /en/people/ |
| /it/persone/andrea-zappala/ | /en/people/andrea-zappala/ |
| /it/persone/{slug}/ | /en/people/{slug}/ |
| /it/contatti/ | /en/contact/ |

Privacy e 404 localizzate; pagina family office e dettagli delle competenze soltanto se approvati. Lo slug di Andrea Zappalà è una proposta tecnica, non un URL già esistente.

La radice può reindirizzare in modo stabile alla lingua principale concordata. Non forzare reindirizzamenti sulla base della lingua del browser. Il selettore apre la pagina equivalente e conserva il contesto. Ogni pagina pubblicata deve avere la traduzione completa; non pubblicare schede vuote o versioni automaticamente tradotte senza revisione.

## 4. Modello dei contenuti

| Entità | Campi | Vincoli |
|---|---|---|
| Studio | Nome, denominazione completa, descrizione, posizionamento, sedi, recapiti | Solo nome pubblico già confermato |
| Persona | ID, slug, nome, ruolo, ordine, ritratto, bio breve, bio estesa, competenze, lingue, contatti pubblici | Identità stabile tra IT/EN; qualifiche verificate |
| Competenza | ID, slug, titolo, sintesi, contenuto, persone correlate | Attività confermate; niente duplicazioni artificiali |
| Immagine | File, dimensioni, alt, punto focale, varianti, autore, licenza, credito | Nessun materiale pubblico senza verifica dei diritti |
| Pagina | ID, lingua, titolo, testo, metadati, immagine sociale, stato | Collegamento esplicito alla traduzione |
| Configurazione | Navigazione, lingue, recapiti, dominio, identità sociale | Nessun segreto o dato ereditato da Intreia |

Stati editoriali proposti: placeholder, bozza, revisionato, pubblicabile. L'ambiente pubblico deve includere solo contenuti pubblicabili. I segnaposto non sono una fonte di fatti o metadati definitivi.

Per Andrea Zappalà usare il nome confermato; non attribuire il ruolo di fondatore, partner o titolare senza riscontro. Per gli altri usare etichette di lavoro, non identità inventate. **Eccezione v0.3 (solo anteprima):** persone di esempio con `demo: true`, mai pubblicabili (`publishIssues` e `build:production` le bloccano); vedi PRD §1. Non fissare un numero di persone prima della consegna dell'organico.

## 5. Design system proposto

Centralizzare token di colore: navy #101F33, slate #30465D, ivory #F5F3EF, stone #E3DFD8, ink #202832, white #FFFFFF. Verificare contrasto per testo, link, hover e focus; non usare il colore pietra come testo secondario su avorio.

Titoli serif e corpo sans serif; massimo due famiglie con licenza verificata. Dimensioni iniziali da collaudare: corpo 17–18 px, interlinea 1.55–1.7, H1 fluido circa 36–72 px. Contenitore massimo circa 1280 px; margini mobile circa 24 px, desktop 48–80 px; sezioni distanziate di 56–80 px su mobile e 96–144 px su desktop.

Ritratti 4:5 con punto focale configurabile. Griglia a una colonna su schermi stretti, due su tablet e tre su desktop come base di lavoro. Nome e ruolo sempre visibili; schede cliccabili solo se esiste un profilo. Non troncare i nomi lunghi.

Marchio provvisorio: testo “Studio Avvocati Zappalà”. Nessuna bilancia, monogramma o stemma inventato. Sostituzione futura del logo senza cambiare la struttura della navigazione.

## 6. Componenti e interazioni

- Header: logo verso home della lingua corrente, navigazione, indicazione pagina corrente, selettore IT/EN.
- Menu mobile: pulsante con stato accessibile, apertura da tastiera, Escape e ripristino del focus. Se modale, focus contenuto e sfondo non interattivo.
- Hero: immagine responsive, testo leggibile già al caricamento, collegamento istituzionale discreto.
- Sezioni editoriali: larghezza di lettura controllata, gerarchia dei titoli e spazi coerenti.
- Persone: griglia dell'intero organico pubblico; filtri soltanto se il numero e l'organizzazione lo giustificano.
- Profilo nominativo: nome, ruolo, biografia, foto e collegamenti pertinenti; informazioni principali nell'HTML iniziale.
- Contatti: recapiti verificati con link telefono/email, nessun invio simulato o modulo.
- Footer: informazioni confermate e informative.

Nessuno scroll forzato, video automatico, cursore personalizzato o carosello necessario alla consultazione. Transizioni leggere 150–250 ms; eventuali reveal 300–500 ms con contenuto visibile anche se lo script non viene eseguito. Movimento ridotto rispettato.

## 7. SEO nominativa: requisiti tecnici

Queste sono specifiche da verificare con la documentazione dei motori nella futura implementazione, non configurazioni già applicate né promesse di ranking.

1. Un URL canonico per ogni pagina e lingua, con canonical autoreferenziale quando la pagina è originale. Non canonicalizzare le versioni inglesi sulle italiane.
2. Associare le traduzioni con hreflang reciproci e codici coerenti, oltre all'attributo lingua del documento. Eventuale x-default deciso insieme alla gestione della radice.
3. Sitemap contenente solo URL pubblicabili, canonici e con risposta valida; robots coerente con ambiente e strategia di pubblicazione.
4. Titoli univoci e descrizioni editoriali per home, studio e ogni persona. H1 con il nome della persona sul profilo; evitare ripetizioni artificiali.
5. Link HTML dall'elenco Persone a tutti i profili e dai profili allo studio. Nessuna pagina nominativa orfana o accessibile soltanto tramite un filtro JavaScript.
6. Dati strutturati con identità coerenti: organizzazione/studio e persone, collegati fra loro solo con relazioni verificate. Scegliere tipi e proprietà supportati dopo verifica nella fase tecnica. Non inventare recensioni, premi, sedi o qualifiche.
7. Metadati social, immagini autorizzate e URL assoluti sul dominio ufficiale. Riferimenti a profili esterni solo se confermati come appartenenti allo studio o alla persona.
8. Censire vecchi URL prima di stabilire reindirizzamenti permanenti. Evitare catene, duplicati di protocollo/hostname e pagine di errore con stato di successo.
9. Configurare Search Console solo quando dominio, titolarità e accesso saranno disponibili nella fase autorizzata. Controllare sitemap, indicizzazione e ricerche nominative; nessuna credenziale nei documenti.
10. Registrare una baseline per il nome dello studio e per i nominativi confermati, distinguendo omonimi e risultati di terzi. Nessun tentativo di rimozione o contatto esterno compreso nel lavoro attuale.

L'anteprima deve essere esclusa dall'indicizzazione. Se contiene materiali riservati, proteggere anche l'accesso: noindex non equivale a riservatezza. Prima del lancio verificare che l'ambiente pubblico sia indicizzabile e non esponga placeholder.

## 8. Performance e accessibilità

Immagini responsive con dimensioni dichiarate, formati efficienti e fallback appropriati. Hero caricata con priorità; ritratti fuori schermo differiti. Budget iniziali proposti: hero mobile circa 300 KB, ritratto in elenco circa 120 KB, mantenendo qualità fotografica; eccezioni motivate.

Obiettivi proposti: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms. Verificare in laboratorio prima del lancio e con dati reali quando disponibili; non confondere misure di laboratorio con risultati al 75° percentile del traffico reale.

Semantica corretta, titolo principale chiaro, ordine dei titoli, link per saltare al contenuto, focus visibile e navigazione da tastiera. Verificare zoom, nomi lunghi, diacritici, traduzioni e riduzione del movimento. Alt informativi quando necessari, vuoti per immagini decorative. Font con fallback, pochi pesi e testo visibile durante il caricamento.

Target progettuale WCAG 2.2 AA da collaudare. Nessun punteggio automatico è sufficiente a dichiarare conformità.

## 9. Privacy e integrazioni

Nessuna raccolta tramite form. Analytics opzionali e indipendenti dalla misurazione in Search Console; attivarli soltanto dopo una scelta esplicita degli strumenti. Non inviare dati personali nei parametri di eventi. Mappe preferibilmente tramite link se non serve un incorporamento.

Informative e gestione delle preferenze riflettono gli strumenti effettivi, con revisione del referente del cliente. Evitare servizi esterni superflui e segreti nel browser o nel repository.

## 10. Collaudo futuro

| Controllo | Risultato richiesto | PRD |
|---|---|---|
| Identità e contenuti | Dati confrontati con materiali approvati, nessun fatto inventato | A01, A08 |
| IT/EN | Equivalenza dei contenuti, link lingua corretti, nessuna pagina vuota | A02 |
| Profili | Tutti gli avvocati presenti, URL stabili, biografie originali e link interni | A03 |
| Direzione visiva | Blu e neutri, architetture raffinate, ritratti coerenti | A04 |
| Perimetro | Assenza di moduli, prenotazioni e funnel | A05 |
| Responsive | 320, 390, 768, 1280, 1440 px senza overflow o tagli | A06 |
| Accessibilità | Tastiera, focus, menu, lingua, zoom, movimento ridotto | A07 |
| SEO | Canonical, hreflang, sitemap, stati HTTP e robots coerenti | A09 |
| Lancio | Materiali finali, prestazioni, informative e manutenzione verificate | A08, A10 |

Verificare browser desktop e almeno Safari iOS/Chrome Android, usando versioni correnti al collaudo. Automatizzare controlli utili su link, metadati e relazioni linguistiche; controllare manualmente fotografie, leggibilità e tastiera. Non creare test di invio moduli, perché i moduli sono fuori ambito.

## 11. Passaggio alla fase successiva

Servono una futura richiesta di realizzazione, chiarimento dei servizi e del family office, scelta del dominio e della gestione editoriale. Organico, fotografie e biografie sono rinviati dall'utente e restano placeholder nelle bozze; non richiederli come condizione per consegnare questi documenti.

Prima della pubblicazione completare e approvare tutti i contenuti IT/EN, verificare immagini, identità, recapiti, SEO e informative. Il logo può restare tipografico soltanto se questa scelta viene confermata per il sito pubblico. Dalla v0.3 lo sviluppo in anteprima è autorizzato; questo documento non autorizza la pubblicazione. La build di produzione fallisce finché restano segnaposto, immagini non approvate o un `SITE_URL` non valido (`npm run build:production`).
