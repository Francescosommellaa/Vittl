export const metadata = {
  title: "Privacy Policy - Vittl",
  description: "Informativa sulla privacy di Vittl.",
};

const sections = [
  {
    title: "1. Titolare del trattamento",
    content: `Vittl S.r.l. (di seguito "Vittl", "noi" o "nostro") è il Titolare del trattamento dei dati personali raccolti attraverso la piattaforma vittl.it e i relativi servizi.

Per qualsiasi domanda relativa al trattamento dei tuoi dati, puoi contattarci all'indirizzo: privacy@vittl.it`,
  },
  {
    title: "2. Dati che raccogliamo",
    content: `Raccogliamo le seguenti categorie di dati personali:

**Dati forniti direttamente da te:**
— Nome e cognome
— Indirizzo email
— Nome e indirizzo del ristorante
— Dati di fatturazione (gestiti da Stripe, non archiviati da noi)
— Contenuti che carichi sulla piattaforma (ricette, menu, foto)

**Dati raccolti automaticamente:**
— Indirizzo IP e dati di navigazione
— Tipo di browser e dispositivo
— Pagine visitate e durata della sessione
— Cookie tecnici e analitici (vedi Cookie Policy)`,
  },
  {
    title: "3. Finalità e base giuridica del trattamento",
    content: `Trattiamo i tuoi dati per le seguenti finalità:

**Esecuzione del contratto (art. 6.1.b GDPR):**
— Fornitura del servizio Vittl
— Gestione del tuo account
— Elaborazione dei pagamenti tramite Stripe
— Supporto tecnico e assistenza

**Legittimo interesse (art. 6.1.f GDPR):**
— Sicurezza della piattaforma e prevenzione frodi
— Miglioramento del servizio tramite analytics aggregati
— Comunicazioni di servizio (aggiornamenti, manutenzioni)

**Consenso (art. 6.1.a GDPR):**
— Newsletter e comunicazioni commerciali
— Cookie analitici e di profilazione (vedi Cookie Policy)`,
  },
  {
    title: "4. Conservazione dei dati",
    content: `Conserviamo i tuoi dati personali per il tempo strettamente necessario alle finalità per cui sono stati raccolti:

— **Dati account attivo:** per tutta la durata del contratto
— **Dati post-cancellazione:** 30 giorni dalla cancellazione dell'account, poi eliminati definitivamente
— **Dati di fatturazione:** 10 anni come previsto dalla normativa fiscale italiana
— **Log di sicurezza:** 12 mesi
— **Dati da cookie analitici:** 13 mesi massimo`,
  },
  {
    title: "5. Condivisione dei dati",
    content: `Non vendiamo i tuoi dati personali a terzi. Condividiamo i tuoi dati solo con:

**Fornitori di servizi (responsabili del trattamento):**
— **Stripe Inc.** — gestione pagamenti (USA, Privacy Shield)
— **Neon Inc.** — hosting database (EU, Frankfurt)
— **Vercel Inc.** — hosting applicazione (EU, Frankfurt)
— **Clerk Inc.** — autenticazione (EU)

Tutti i fornitori sono vincolati da accordi di trattamento dati (DPA) conformi al GDPR.

**Autorità competenti:** solo se richiesto dalla legge o da ordini giudiziari.`,
  },
  {
    title: "6. Trasferimento dati extra-UE",
    content: `Alcuni nostri fornitori hanno sede negli Stati Uniti. Tutti i trasferimenti avvengono nel rispetto delle garanzie previste dal GDPR, in particolare tramite:

— Clausole contrattuali standard (SCC) approvate dalla Commissione Europea
— Certificazione Data Privacy Framework (DPF) dove applicabile

I dati sono fisicamente archiviati su server in Europa (Frankfurt, Germania) ove possibile.`,
  },
  {
    title: "7. I tuoi diritti",
    content: `In qualità di interessato, hai il diritto di:

— **Accesso (art. 15):** ottenere conferma del trattamento e copia dei tuoi dati
— **Rettifica (art. 16):** correggere dati inesatti o incompleti
— **Cancellazione (art. 17):** richiedere la cancellazione dei tuoi dati ("diritto all'oblio")
— **Limitazione (art. 18):** limitare il trattamento in determinati casi
— **Portabilità (art. 20):** ricevere i tuoi dati in formato strutturato e leggibile da macchina
— **Opposizione (art. 21):** opporti al trattamento basato su legittimo interesse
— **Revoca del consenso:** in qualsiasi momento, senza effetti retroattivi

Per esercitare i tuoi diritti, scrivi a: privacy@vittl.it
Risponderemo entro 30 giorni dalla ricezione della richiesta.

Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).`,
  },
  {
    title: "8. Sicurezza dei dati",
    content: `Adottiamo misure tecniche e organizzative adeguate a proteggere i tuoi dati personali, tra cui:

— Cifratura dei dati in transito (TLS 1.3) e a riposo
— Accesso ai dati limitato al personale autorizzato
— Autenticazione a due fattori per accessi amministrativi
— Monitoraggio continuo e test di sicurezza periodici
— Procedure di risposta agli incidenti di sicurezza

In caso di violazione dei dati che comporti rischi per i tuoi diritti, ti notificheremo entro 72 ore come previsto dal GDPR.`,
  },
  {
    title: "9. Cookie",
    content: `Utilizziamo cookie tecnici, analitici e di funzionalità. Per informazioni dettagliate sui cookie utilizzati, le loro finalità e come gestirli, consulta la nostra Cookie Policy.`,
  },
  {
    title: "10. Minori",
    content: `I servizi Vittl sono destinati esclusivamente a persone maggiori di 18 anni. Non raccogliamo consapevolmente dati personali di minori. Se veniamo a conoscenza di aver raccolto dati di minori, li elimineremo immediatamente.`,
  },
  {
    title: "11. Modifiche alla Privacy Policy",
    content: `Possiamo aggiornare questa Privacy Policy periodicamente. In caso di modifiche sostanziali, ti informeremo via email almeno 14 giorni prima dell'entrata in vigore. La data dell'ultima modifica è sempre indicata in fondo alla pagina.

Ti invitiamo a consultare periodicamente questa pagina.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-6">
            Legale
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span>
              <span className="text-gray-400">Ultimo aggiornamento:</span>{" "}
              <span className="font-medium text-gray-700">
                17 Febbraio 2026
              </span>
            </span>
            <span>
              <span className="text-gray-400">Versione:</span>{" "}
              <span className="font-medium text-gray-700">1.0</span>
            </span>
            <span>
              <span className="text-gray-400">Applicabile a:</span>{" "}
              <span className="font-medium text-gray-700">vittl.it</span>
            </span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            La tua privacy è importante per noi. Questa informativa descrive
            come Vittl raccoglie, utilizza e protegge i tuoi dati personali in
            conformità al{" "}
            <strong className="font-semibold text-gray-900">
              Regolamento Europeo 2016/679 (GDPR)
            </strong>{" "}
            e al D.Lgs. 196/2003 (Codice Privacy italiano).
          </p>
        </div>
      </section>

      {/* Indice */}
      <section className="py-12 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Indice
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((section, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-1 hover:underline underline-offset-2"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contenuto */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section, i) => (
            <div key={i} id={`section-${i}`} className="scroll-mt-32">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <div key={j}>
                    {paragraph.startsWith("**") && paragraph.endsWith("**") ? (
                      <p className="font-semibold text-gray-900">
                        {paragraph.replace(/\*\*/g, "")}
                      </p>
                    ) : (
                      <div className="text-gray-600 font-light leading-relaxed">
                        {paragraph.split("\n").map((line, k) => {
                          if (line.startsWith("— ")) {
                            const parts = line.replace("— ", "").split("**");
                            return (
                              <div
                                key={k}
                                className="flex items-start gap-3 mt-2"
                              >
                                <span className="text-gray-300 mt-0.5 shrink-0">
                                  —
                                </span>
                                <span>
                                  {parts.map((part, l) =>
                                    l % 2 === 1 ? (
                                      <strong
                                        key={l}
                                        className="font-semibold text-gray-800"
                                      >
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    ),
                                  )}
                                </span>
                              </div>
                            );
                          }
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p
                                key={k}
                                className="font-semibold text-gray-800 mt-4 mb-1"
                              >
                                {line.replace(/\*\*/g, "")}
                              </p>
                            );
                          }
                          return (
                            <p key={k} className={k > 0 ? "mt-2" : ""}>
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contatti DPO */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contatti per la Privacy
            </h2>
            <p className="text-gray-500 font-light mb-8 leading-relaxed">
              Per qualsiasi domanda, richiesta di esercizio dei diritti o
              segnalazione relativa al trattamento dei tuoi dati personali:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">✉</span>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email Privacy</p>
                  <a
                    href="mailto:privacy@vittl.it"
                    className="font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    privacy@vittl.it
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl">🏛</span>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Garante Privacy</p>
                  <a
                    href="https://www.garanteprivacy.it"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    garanteprivacy.it
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Legal Links */}
      <section className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 text-sm">
          <a
            href="/termini"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Termini e Condizioni →
          </a>
          <a
            href="/cookie"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cookie Policy →
          </a>
          <a
            href="/contatti"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Contattaci →
          </a>
        </div>
      </section>
    </main>
  );
}
