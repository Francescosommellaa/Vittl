"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useInView } from "@/app/hooks/useInView";

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
    a: "Scegli il piano Start o Pro e accedi a tutte le funzionalità senza inserire la carta di credito. Dopo 14 giorni scegli se continuare o tornare al piano Free.",
  },
  {
    q: "Posso cambiare piano in qualsiasi momento?",
    a: "Sì. Upgrade e downgrade sono immediati. Il costo viene calcolato in modo proporzionale ai giorni rimanenti del periodo.",
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

function FaqItem({
  q,
  a,
  index,
  inView,
}: {
  q: string;
  a: string;
  index: number;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-gray-100 last:border-0 transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-base font-semibold text-gray-900 pr-8 group-hover:text-gray-600 transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${
            open ? "rotate-45 bg-gray-900" : ""
          }`}
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
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: cardsRef, inView: cardsInView } = useInView(0.05);
  const { ref: includedRef, inView: includedInView } = useInView(0.15);
  const { ref: faqRef, inView: faqInView } = useInView(0.1);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 pt-40 pb-20 px-6">
        <div
          ref={heroRef}
          className="max-w-4xl mx-auto text-center transition-all duration-700"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6">
            Piani e Prezzi
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-none mb-6">
            Semplice.
            <br />
            <span className="text-gray-300">Trasparente.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            Nessun costo nascosto. 14 giorni di prova gratuita su tutti i piani
            a pagamento.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-0 bg-gray-100 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                !isAnnual
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annuale
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>

          <div
            className={`mt-2 text-sm font-medium transition-all duration-300 ${
              isAnnual
                ? "opacity-100 text-green-600"
                : "opacity-0 text-transparent"
            }`}
          >
            🎉 Risparmi 2 mesi pagando annualmente
          </div>
        </div>
      </section>

      {/* ── Cards ────────────────────────────────── */}
      <section ref={cardsRef} className="py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan, planIndex) => {
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
                  className={`relative flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-1 ${
                    plan.highlight
                      ? "bg-gray-900 shadow-2xl ring-1 ring-gray-800"
                      : "bg-white shadow-md ring-1 ring-gray-200 hover:shadow-xl"
                  }`}
                  style={{
                    opacity: cardsInView ? 1 : 0,
                    transform: cardsInView
                      ? "translateY(0) scale(1)"
                      : "translateY(24px) scale(0.95)",
                    transitionDelay: `${planIndex * 80}ms`,
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full shadow-lg border border-gray-800">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Top Section */}
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

                    {/* Prezzo */}
                    <div className="h-24 flex flex-col justify-center">
                      {isEnterprise ? (
                        <span
                          className={`text-5xl font-semibold tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}
                        >
                          Custom
                        </span>
                      ) : isFree ? (
                        <span
                          className={`text-5xl font-semibold tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}
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
                              className={`text-5xl font-bold leading-none tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}
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

                    {/* CTA */}
                    <div className="mt-6">
                      <a
                        href={stripeLink}
                        target={isEnterprise || isFree ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className={`block text-center py-3.5 px-6 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.03] ${
                          plan.highlight
                            ? "bg-white text-gray-900 hover:bg-gray-100 shadow-md"
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
                        className={`text-xs text-center mt-2.5 h-4 ${plan.highlight ? "text-gray-600" : "text-gray-400"}`}
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
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-white" : "text-gray-700"}`}
                          strokeWidth={2.5}
                        />
                        <span
                          className={`text-sm leading-relaxed ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X
                          className="w-4 h-4 text-gray-300 mt-0.5 shrink-0"
                          strokeWidth={2}
                        />
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

      {/* ── Incluso ─────────────────────────────── */}
      <section ref={includedRef} className="py-12 px-6">
        <div
          className="max-w-5xl mx-auto transition-all duration-700"
          style={{
            opacity: includedInView ? 1 : 0,
            transform: includedInView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="bg-white rounded-3xl p-10 shadow-sm ring-1 ring-gray-200">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-full px-5 py-2 mb-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ✦ Incluso in tutti i piani
                </span>
              </div>
              <p className="text-sm text-gray-500 font-light">
                Da subito, senza limitazioni.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check
                    className="w-4 h-4 text-gray-700 mt-0.5 shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="text-gray-600 text-sm leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ────────────────────────── */}
      <section className="py-2 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🔒",
                title: "Pagamenti sicuri",
                desc: "Gestiti da Stripe, leader mondiale",
              },
              {
                icon: "🇪🇺",
                title: "GDPR compliant",
                desc: "Server in Europa, dati protetti",
              },
              {
                icon: "✓",
                title: "Supporto italiano",
                desc: "Team in Italia, risposta in 24h",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section ref={faqRef} className="py-16 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div
            className="text-center mb-12 transition-all duration-700"
            style={{
              opacity: faqInView ? 1 : 0,
              transform: faqInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Domande frequenti
            </h2>
          </div>
          <div className="bg-white rounded-3xl px-10 shadow-sm ring-1 ring-gray-200">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                index={i}
                inView={faqInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2">
              Inizia oggi, gratis.
            </h2>
            <p className="text-gray-400 font-light">
              14 giorni di prova. Nessuna carta richiesta.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-100 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10"
            >
              Inizia gratis
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/contatti"
              className="flex items-center justify-center px-8 py-4 border border-gray-700 text-gray-300 rounded-full font-medium text-sm transition-all duration-300 hover:border-gray-500 hover:text-white hover:bg-white/5"
            >
              Parla con noi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
