"use client";

import Link from "next/link";
import { useState } from "react";

const included = [
  "Menu digitale con QR e aggiornamento in tempo reale",
  "Più menu attivi (pranzo, cena, eventi, delivery)",
  "Food cost automatico per piatto e per porzione",
  "Tabella nutrizionale per ricetta (crudo/cotto, kcal, macro)",
  "Gestione allergeni calcolati dagli ingredienti",
  "Feed ricette: scopri, forka e condividi ricette",
  "Aiuto agli acquisti per numero di coperti",
  "Utilizzo completo da mobile (PWA)",
];

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    stripeMonthly: "/signup",
    stripeAnnual: "/signup",
    description: "Per iniziare senza rischi.",
    highlight: false,
    features: [
      "1 utente",
      "1 sede",
      "Max 100 ricette",
      "Max 4 menu digitali attivi",
      "QR con watermark Vittl",
      "Supporto email entro 24h",
    ],
    limitations: ["QR non personalizzabile", "Nessun collaboratore"],
  },
  {
    name: "Start",
    monthlyPrice: 35,
    annualPrice: 350,
    stripeMonthly: "https://buy.stripe.com/aFa8wR3XbfXf7bo44A9R600",
    stripeAnnual: "https://buy.stripe.com/7sY00l2T7dP7eDQeJe9R601",
    description: "Per chi vuole fare sul serio.",
    highlight: true,
    badge: "Più scelto",
    features: [
      "2 utenti (titolare + 1 collaboratore)",
      "1 sede",
      "Max 200 ricette",
      "Max 8 menu digitali attivi",
      "QR personalizzabile (logo, colori)",
      "Nessun watermark",
      "Supporto email/chat entro 24h",
      "Ruolo collaboratore",
      "Pagina menu personalizzata (3 template)",
    ],
    limitations: [],
  },
  {
    name: "Pro",
    monthlyPrice: 100,
    annualPrice: 1000,
    stripeMonthly: "https://buy.stripe.com/fZu4gB3Xb4exbrEcB69R602",
    stripeAnnual: "https://buy.stripe.com/4gM28tfFT5iB9jwfNi9R603",
    description: "Per team su più sedi.",
    highlight: false,
    features: [
      "4 utenti (titolare + 3 collaboratori)",
      "2 sedi",
      "Max 250 ricette per sede",
      "Max 10 menu per sede (20 totali)",
      "QR personalizzabile (logo, colori)",
      "Supporto prioritario entro 6h",
      "Dashboard food cost unificata",
      "Confronto performance tra sedi",
      "Pagina menu personalizzata (3 template)",
    ],
    limitations: [],
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    stripeMonthly: "/contatti",
    stripeAnnual: "/contatti",
    description: "Per catene e brand.",
    highlight: false,
    features: [
      "Utenti illimitati",
      "Sedi illimitate",
      "Ricette illimitate",
      "Menu digitali illimitati",
      "QR personalizzabile",
      "Layout menu completamente custom",
      "Integrazione gestionali e POS",
      "Supporto dedicato con SLA",
      "Onboarding e formazione team",
      "Consulenza menu engineering",
    ],
    limitations: [],
  },
];

const faqs = [
  {
    q: "Come funziona la prova gratuita di 14 giorni?",
    a: "Scegli il piano Start o Pro e accedi a tutte le funzionalità. Dopo 14 giorni scegli se continuare o tornare al piano Free.",
  },
  {
    q: "Posso cambiare piano in qualsiasi momento?",
    a: "Sì. Puoi effettuare upgrade o downgrade in qualsiasi momento e continuerai a usufruire del piano attuale fino alla fine del periodo di fatturazione.",
  },
  {
    q: "Quanto risparmio con il piano annuale?",
    a: "Con il piano annuale risparmi 2 mesi rispetto al mensile: €70 su Start (€350 vs €420) e €200 su Pro (€1000 vs €1200).",
  },
  {
    q: "Come funziona il pagamento?",
    a: "I pagamenti sono gestiti da Stripe. Accettiamo carta di credito, debito e SEPA. Puoi cancellare in qualsiasi momento senza penali.",
  },
  {
    q: "Cosa succede ai miei dati se cancello?",
    a: "I tuoi dati rimangono disponibili per 30 giorni dopo la cancellazione e puoi esportarli in qualsiasi momento. Dopo 30 giorni vengono eliminati definitivamente.",
  },
  {
    q: "C'è un contratto minimo?",
    a: "No. Vittl funziona mese per mese senza contratti a lungo termine. Il piano annuale è prepagato ma puoi richiedere rimborso proporzionale entro 30 giorni.",
  },
];

function CheckIcon({ white }: { white?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 mt-0.5 ${white ? "text-white" : "text-gray-700"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-300 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-base font-semibold text-gray-900 pr-8 group-hover:text-gray-600 transition-colors">
          {q}
        </span>
        <span
          className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${open ? "rotate-45 bg-gray-900" : ""}`}
        >
          <svg
            className={`w-4 h-4 transition-colors ${open ? "text-white" : "text-gray-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-gray-500 font-light leading-relaxed text-sm">{a}</p>
      </div>
    </div>
  );
}

export default function PianiPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-6">
            Piani e Prezzi
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight mb-6">
            Semplice.
            <br />
            <span className="text-gray-400">Trasparente.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed mb-12">
            Nessun costo nascosto. 14 giorni di prova gratuita su tutti i piani
            a pagamento.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-0 bg-gray-100 rounded-full p-1.5">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annuale
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>

          <div
            className={`mt-2 text-sm text-green-600 font-medium transition-all duration-300 ${isAnnual ? "opacity-100" : "opacity-0"}`}
          >
            🎉 Risparmi 2 mesi pagando annualmente
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan) => {
              const isEnterprise = plan.monthlyPrice === null;
              const isFree = plan.monthlyPrice === 0;
              const stripeLink = isAnnual
                ? plan.stripeAnnual
                : plan.stripeMonthly;
              const monthlyEquivalent =
                isAnnual && plan.annualPrice
                  ? Math.round(plan.annualPrice / 12)
                  : null;
              const saving =
                isAnnual && plan.monthlyPrice && plan.annualPrice
                  ? plan.monthlyPrice * 12 - plan.annualPrice
                  : null;

              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlight
                      ? "bg-gray-900 shadow-2xl ring-1 ring-gray-800"
                      : "bg-white shadow-md ring-1 ring-gray-200 hover:shadow-xl"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full shadow-lg border border-gray-700">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Top Section - fixed height */}
                  <div className="p-8 pb-6">
                    {/* Nome + descrizione */}
                    <div className="h-16 mb-6">
                      <h3
                        className={`text-xl font-semibold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-sm font-light ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {plan.description}
                      </p>
                    </div>

                    {/* Prezzo - fixed height */}
                    <div className="h-24 flex flex-col justify-center">
                      {isEnterprise ? (
                        <span
                          className={`text-5xl font-semibold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                        >
                          Custom
                        </span>
                      ) : isFree ? (
                        <span
                          className={`text-5xl font-semibold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                        >
                          Gratis
                        </span>
                      ) : (
                        <>
                          <div className="flex items-end gap-1">
                            <span
                              className={`text-sm font-medium mb-2 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}
                            >
                              €
                            </span>
                            <span
                              className={`text-5xl font-semibold leading-none ${plan.highlight ? "text-white" : "text-gray-900"}`}
                            >
                              {isAnnual ? monthlyEquivalent : plan.monthlyPrice}
                            </span>
                            <span
                              className={`text-sm mb-1.5 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}
                            >
                              /mese
                            </span>
                          </div>
                          <div className="h-6 mt-1">
                            {isAnnual ? (
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className={`text-xs ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}
                                >
                                  €{plan.annualPrice}/anno
                                </span>
                                {saving && (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    risparmi €{saving}
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span
                                className={`text-xs ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}
                              >
                                IVA esclusa • fatturato mensilmente
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6">
                      <a
                        href={stripeLink}
                        target={isEnterprise || isFree ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className={`block text-center py-3.5 px-6 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
                          plan.highlight
                            ? "bg-white text-gray-900 hover:bg-gray-100"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {isEnterprise
                          ? "Contattaci"
                          : isFree
                            ? "Inizia gratis"
                            : "Prova 14 giorni gratis"}
                      </a>
                      <p
                        className={`text-xs text-center mt-2 h-4 ${plan.highlight ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {!isFree && !isEnterprise
                          ? "Nessuna carta richiesta"
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className={`mx-8 border-t ${plan.highlight ? "border-gray-700" : "border-gray-100"}`}
                  />

                  {/* Features */}
                  <div className="p-8 pt-6 flex-1 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckIcon white={plan.highlight} />
                        <span
                          className={`text-sm leading-relaxed ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CrossIcon />
                        <span className="text-sm text-gray-400 leading-relaxed">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Incluso in tutti i piani */}
      <section className="py-2 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-sm ring-1 ring-gray-200">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                ✦ Incluso in tutti i piani
              </h2>
              <p className="text-gray-500 text-sm font-light">
                Da subito, senza limitazioni.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-gray-600 text-sm leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-12">
            Domande frequenti
          </h2>
          <div className="bg-white rounded-3xl px-10 shadow-sm ring-1 ring-gray-200">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-semibold mb-6">Inizia oggi, gratis.</h2>
          <p className="text-xl text-gray-400 font-light mb-10">
            14 giorni di prova. Nessuna carta richiesta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              Inizia gratis →
            </Link>
            <Link
              href="/contatti"
              className="px-8 py-4 border-2 border-gray-700 text-white rounded-full font-medium hover:border-gray-500 hover:bg-gray-800 transition-all"
            >
              Parla con noi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
