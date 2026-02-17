"use client";

import { useInView } from "@/app/hooks/useInView";

// ─── Showcase 1: Food Cost ───────────────────
function FoodCostMockup() {
  const dishes = [
    { name: "Spaghetti Carbonara", cost: 28, price: "€11.50", margin: "€8.30" },
    { name: "Risotto al Porcini", cost: 34, price: "€14.00", margin: "€9.24" },
    { name: "Tiramisù", cost: 19, price: "€6.50", margin: "€5.27" },
    {
      name: "Bistecca Fiorentina",
      cost: 42,
      price: "€26.00",
      margin: "€15.08",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden">
      {/* Window chrome */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
        </div>
        <span className="text-sm text-gray-400 font-medium mx-auto">
          Dashboard Food Cost
        </span>
      </div>

      <div className="p-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Food cost medio", value: "31%", trend: "↓ -3%" },
            { label: "Margine medio", value: "69%", trend: "↑ +3%" },
            { label: "Ricette analizzate", value: "47", trend: "" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              {s.trend && (
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  {s.trend}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-2">
          {dishes.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium text-gray-800 flex-1 truncate">
                {d.name}
              </p>
              {/* Progress bar */}
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.cost < 30 ? "bg-green-400" : d.cost < 40 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${d.cost}%` }}
                />
              </div>
              <span
                className={`text-xs font-semibold w-10 text-right ${d.cost < 30 ? "text-green-600" : d.cost < 40 ? "text-amber-600" : "text-red-600"}`}
              >
                {d.cost}%
              </span>
              <span className="text-sm text-gray-400 w-16 text-right">
                {d.price}
              </span>
              <span className="text-sm font-semibold text-gray-700 w-16 text-right">
                {d.margin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 2: Allergeni ──────────────────
function AllergeniMockup() {
  const allAllergens = [
    {
      code: "G",
      name: "Glutine",
      active: true,
      color: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    {
      code: "C",
      name: "Crostacei",
      active: false,
      color: "bg-red-50 text-red-700 ring-red-200",
    },
    {
      code: "U",
      name: "Uova",
      active: true,
      color: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    },
    {
      code: "P",
      name: "Pesce",
      active: false,
      color: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      code: "So",
      name: "Soia",
      active: false,
      color: "bg-green-50 text-green-700 ring-green-200",
    },
    {
      code: "La",
      name: "Latte",
      active: true,
      color: "bg-sky-50 text-sky-700 ring-sky-200",
    },
    {
      code: "F",
      name: "Frutta guscio",
      active: false,
      color: "bg-orange-50 text-orange-700 ring-orange-200",
    },
    {
      code: "Se",
      name: "Sedano",
      active: false,
      color: "bg-lime-50 text-lime-700 ring-lime-200",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
        </div>
        <span className="text-sm text-gray-400 font-medium mx-auto">
          Gestione Allergeni — Carbonara
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Conforme Reg. UE 1169/2011
            </p>
            <p className="text-xs text-gray-400">
              3 allergeni rilevati automaticamente
            </p>
          </div>
          <div className="ml-auto bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-green-100">
            ✓ Aggiornato
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          14 allergeni obbligatori per legge
        </p>

        <div className="grid grid-cols-4 gap-2">
          {allAllergens.map((a, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 text-center ring-1 ${
                a.active ? a.color : "bg-gray-50 text-gray-300 ring-gray-100"
              }`}
            >
              <p className="text-sm font-bold">{a.code}</p>
              <p className="text-[10px] mt-0.5 leading-tight">{a.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-700 font-medium">
            ⚠ Se modifichi gli ingredienti, gli allergeni si aggiornano
            automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Showcase 3: Recipe Feed ────────────────
function FeedMockup() {
  const recipes = [
    {
      chef: "Marco R.",
      city: "Milano",
      dish: "Cacio e Pepe moderna",
      forks: 12,
      time: "2h fa",
    },
    {
      chef: "Sofia G.",
      city: "Roma",
      dish: "Tiramisù al pistacchio",
      forks: 34,
      time: "5h fa",
    },
    {
      chef: "Luca B.",
      city: "Napoli",
      dish: "Pizza fritta contemporanea",
      forks: 8,
      time: "1g fa",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="w-3 h-3 rounded-full bg-gray-200" />
        </div>
        <span className="text-sm text-gray-400 font-medium mx-auto">
          Feed Ricette
        </span>
      </div>

      <div className="p-6 space-y-4">
        {recipes.map((r, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                  {r.chef[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {r.chef}
                  </p>
                  <p className="text-xs text-gray-400">{r.city}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{r.time}</span>
            </div>
            <p className="text-sm font-medium text-gray-800 mt-3 ml-12">
              {r.dish}
            </p>
            <div className="flex items-center gap-4 mt-3 ml-12">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Forka ({r.forks})
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                Visualizza →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Showcase Item ───────────────────────────
type ShowcaseItem = {
  tag: string;
  headline: string;
  headlineAccent: string;
  description: string;
  points: string[];
  mockup: React.ReactNode;
  reverse?: boolean;
};

function ShowcaseBlock({
  tag,
  headline,
  headlineAccent,
  description,
  points,
  mockup,
  reverse = false,
}: ShowcaseItem) {
  const { ref, inView } = useInView(0.15);

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 py-24">
      <div
        className={`grid lg:grid-cols-2 gap-16 items-center ${
          reverse ? "lg:grid-flow-col-dense" : ""
        }`}
      >
        {/* Text */}
        <div
          className={`transition-all duration-700 ${reverse ? "lg:col-start-2" : ""}`}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : reverse
                ? "translateX(24px)"
                : "translateX(-24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
            {tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight mb-5">
            {headline}
            <br />
            <span className="text-gray-400">{headlineAccent}</span>
          </h2>
          <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
            {description}
          </p>
          <ul className="space-y-3">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-gray-900 mt-0.5 shrink-0"
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
                <span className="text-gray-700 text-sm leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mockup */}
        <div
          className={`transition-all duration-700 delay-200 ${reverse ? "lg:col-start-1 lg:row-start-1" : ""}`}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : reverse
                ? "translateX(-24px)"
                : "translateX(24px)",
          }}
        >
          {mockup}
        </div>
      </div>
    </div>
  );
}

export default function FeatureShowcase() {
  return (
    <section className="bg-white overflow-hidden divide-y divide-gray-100">
      <ShowcaseBlock
        tag="Food Cost"
        headline="Sai esattamente"
        headlineAccent="quanto guadagni."
        description="Vittl calcola il food cost di ogni piatto in automatico. Inserisci gli ingredienti, lui fa i conti. Tu prendi le decisioni giuste."
        points={[
          "Costo per porzione calcolato in tempo reale",
          "Margine lordo per ogni piatto del menu",
          "Dashboard con overview su tutti i piatti",
          "Avvisi quando il food cost supera la soglia",
        ]}
        mockup={<FoodCostMockup />}
      />
      <ShowcaseBlock
        tag="Allergeni"
        headline="La conformità legale,"
        headlineAccent="senza lo stress."
        description="I 14 allergeni obbligatori vengono identificati automaticamente dagli ingredienti. Nessun errore umano, nessun rischio legale."
        points={[
          "14 allergeni obbligatori per legge (Reg. UE 1169/2011)",
          "Aggiornamento automatico quando cambi ingredienti",
          "Badge allergeni visibili sul menu digitale",
          "Storico modifiche per audit e controlli",
        ]}
        mockup={<AllergeniMockup />}
        reverse
      />
      <ShowcaseBlock
        tag="Feed Ricette"
        headline="La community"
        headlineAccent="dei chef italiani."
        description="Scopri cosa cucinano gli altri ristoratori in Italia. Forka una ricetta, adattala al tuo ristorante e condividi le tue creazioni."
        points={[
          "Ricette condivise da ristoratori reali",
          "Fork con un click e personalizza liberamente",
          "Calcolo food cost automatico anche sulle ricette forkate",
          "Filtra per tipo di cucina, allergeni, food cost",
        ]}
        mockup={<FeedMockup />}
      />
    </section>
  );
}
