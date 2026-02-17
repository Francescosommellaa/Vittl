export const metadata = {
  title: "Cookie Policy - Vittl",
  description: "Informativa sull'utilizzo dei cookie da parte di Vittl.",
};

const cookieTypes = [
  {
    category: "Cookie Tecnici",
    required: true,
    description:
      "Necessari per il funzionamento della piattaforma. Non possono essere disabilitati.",
    examples: [
      {
        name: "vittl_session",
        purpose: "Mantiene la sessione dell'utente autenticato",
        duration: "Sessione",
      },
      {
        name: "vittl_csrf",
        purpose: "Protezione contro attacchi CSRF",
        duration: "Sessione",
      },
      {
        name: "__clerk_db_jwt",
        purpose: "Autenticazione utente (Clerk)",
        duration: "7 giorni",
      },
      {
        name: "vittl_preferences",
        purpose: "Salva preferenze UI (tema, lingua)",
        duration: "12 mesi",
      },
    ],
  },
  {
    category: "Cookie Analitici",
    required: false,
    description:
      "Ci aiutano a capire come gli utenti interagiscono con la piattaforma, in forma anonima e aggregata.",
    examples: [
      {
        name: "_ga",
        purpose: "Google Analytics - distingue gli utenti",
        duration: "24 mesi",
      },
      {
        name: "_ga_*",
        purpose: "Google Analytics - mantiene lo stato della sessione",
        duration: "24 mesi",
      },
      {
        name: "vittl_analytics",
        purpose: "Analytics interno Vittl (anonimizzato)",
        duration: "13 mesi",
      },
    ],
  },
  {
    category: "Cookie Funzionali",
    required: false,
    description:
      "Abilitano funzionalità avanzate e personalizzazione dell'esperienza.",
    examples: [
      {
        name: "vittl_onboarding",
        purpose: "Traccia i passi dell'onboarding completati",
        duration: "30 giorni",
      },
      {
        name: "vittl_tour",
        purpose: "Ricorda i tour e i tooltip già visualizzati",
        duration: "6 mesi",
      },
    ],
  },
];

const sections = [
  {
    title: "1. Cosa sono i cookie",
    content: `I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell'utente (computer, tablet, smartphone) quando vengono visitati. Permettono al sito di ricordare le azioni e preferenze dell'utente per un certo periodo di tempo, evitando di doverle reinserire ad ogni visita.

I cookie non danneggiano il dispositivo e non contengono virus. Non raccolgono informazioni personali identificabili senza il tuo esplicito consenso.`,
  },
  {
    title: "2. Come utilizziamo i cookie",
    content: `Vittl utilizza cookie propri e di terze parti per le seguenti finalità:

— **Funzionamento della piattaforma:** autenticazione, sicurezza e preferenze di navigazione
— **Analisi e miglioramento:** capire come gli utenti utilizzano il servizio per migliorarlo
— **Personalizzazione:** ricordare le tue impostazioni e preferenze UI

Non utilizziamo cookie di profilazione o pubblicitari.`,
  },
  {
    title: "3. Cookie di terze parti",
    content: `Alcuni cookie sono impostati da servizi di terze parti che utilizziamo:

— **Clerk Inc.** — autenticazione e gestione sessioni (clerk.com)
— **Google Analytics** — analisi del traffico in forma anonima (google.com/analytics)
— **Stripe Inc.** — elaborazione pagamenti (stripe.com) — solo nelle pagine di checkout

Ciascuno di questi servizi ha una propria cookie policy che ti invitiamo a consultare.`,
  },
  {
    title: "4. Gestione dei cookie",
    content: `Puoi gestire i cookie in qualsiasi momento tramite:

**Banner cookie Vittl**
Al primo accesso, ti mostriamo un banner che ti permette di accettare o rifiutare i cookie non tecnici. Puoi modificare le tue preferenze in qualsiasi momento cliccando su "Gestisci cookie" nel footer.

**Impostazioni del browser**
Puoi configurare il tuo browser per bloccare o eliminare i cookie. Tieni presente che disabilitare i cookie tecnici potrebbe compromettere il funzionamento della piattaforma.

— Chrome: Impostazioni → Privacy e sicurezza → Cookie
— Firefox: Impostazioni → Privacy e sicurezza → Cookie e dati dei siti
— Safari: Preferenze → Privacy → Cookie
— Edge: Impostazioni → Cookie e autorizzazioni sito`,
  },
  {
    title: "5. Durata dei cookie",
    content: `I cookie possono essere:

— **Cookie di sessione:** vengono eliminati automaticamente alla chiusura del browser. Utilizzati per mantenere la sessione autenticata.
— **Cookie persistenti:** rimangono sul dispositivo per un periodo definito (indicato nella tabella). Utilizzati per ricordare preferenze e per analytics.

Puoi eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser.`,
  },
  {
    title: "6. Aggiornamenti alla Cookie Policy",
    content: `Possiamo aggiornare questa Cookie Policy periodicamente per riflettere cambiamenti nei cookie utilizzati o nella normativa applicabile. La data dell'ultima modifica è sempre indicata in cima alla pagina.

In caso di modifiche sostanziali, ti informeremo tramite banner o email.`,
  },
];

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-6">
            Legale
          </p>
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-6">
            Cookie Policy
          </h1>
          <div className="flex flex-wrap gap-6 text-sm">
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
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Questa Cookie Policy spiega come Vittl utilizza i cookie e
            tecnologie simili sul sito vittl.it, in conformità alla Direttiva
            ePrivacy (2002/58/CE) e al GDPR.
          </p>
        </div>
      </section>

      {/* Sezioni testuali */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.slice(0, 3).map((section, i) => (
            <div key={i} id={`section-${i}`} className="scroll-mt-32">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <div
                    key={j}
                    className="text-gray-600 font-light leading-relaxed"
                  >
                    {paragraph.split("\n").map((line, k) => {
                      if (line.startsWith("— ")) {
                        const parts = line.replace("— ", "").split("**");
                        return (
                          <div key={k} className="flex items-start gap-3 mt-2">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabella Cookie */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Cookie utilizzati da Vittl
          </h2>
          <p className="text-gray-500 font-light mb-12">
            Elenco dettagliato di tutti i cookie presenti sulla piattaforma.
          </p>

          <div className="space-y-8">
            {cookieTypes.map((type, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200"
              >
                {/* Header categoria */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {type.category}
                      </h3>
                      {type.required ? (
                        <span className="px-3 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          Sempre attivi
                        </span>
                      ) : (
                        <span className="px-3 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Opzionali
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-light">
                      {type.description}
                    </p>
                  </div>
                </div>

                {/* Tabella cookie */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-8 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-8 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Finalità
                        </th>
                        <th className="px-8 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Durata
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {type.examples.map((cookie, j) => (
                        <tr
                          key={j}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-8 py-4">
                            <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                              {cookie.name}
                            </code>
                          </td>
                          <td className="px-8 py-4 text-sm text-gray-600 font-light">
                            {cookie.purpose}
                          </td>
                          <td className="px-8 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {cookie.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sezioni finali */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.slice(3).map((section, i) => (
            <div key={i} className="scroll-mt-32">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.split("\n\n").map((paragraph, j) => (
                  <div
                    key={j}
                    className="text-gray-600 font-light leading-relaxed"
                  >
                    {paragraph.split("\n").map((line, k) => {
                      if (line.startsWith("— ")) {
                        const parts = line.replace("— ", "").split("**");
                        return (
                          <div key={k} className="flex items-start gap-3 mt-2">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Legal Links */}
      <section className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 text-sm">
          <a
            href="/privacy"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Privacy Policy →
          </a>
          <a
            href="/termini"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Termini e Condizioni →
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
