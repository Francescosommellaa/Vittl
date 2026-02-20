"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const allergens = [
  {
    code: "G",
    label: "Glutine",
    bg: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  { code: "La", label: "Latte", bg: "bg-blue-50 text-blue-700 ring-blue-200" },
  {
    code: "U",
    label: "Uova",
    bg: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  },
];

const ingredients = [
  { name: "Guanciale", qty: "120g", cost: "€1.20" },
  { name: "Tuorlo d'uovo", qty: "2 pz", cost: "€0.40" },
  { name: "Pecorino Romano", qty: "60g", cost: "€0.80" },
  { name: "Pasta di semola", qty: "200g", cost: "€0.80" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const base = "transition-all duration-700 ease-out";
  const visible = "opacity-100 translate-y-0";
  const hidden = "opacity-0 translate-y-6";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6">
      {/* Radial gradient subtilissimo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,0,0,0.035) 0%, transparent 70%)",
        }}
      />

      {/* Griglia decorativa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto pt-28 pb-16">
        {/* Badge */}
        <div
          className={`flex justify-center mb-8 ${base} ${mounted ? visible : hidden}`}
          style={{ transitionDelay: "0ms" }}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-600">
            <span
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: "pulse-soft 2.5s ease-in-out infinite" }}
            />
            Progettato per la ristorazione italiana
            <span className="text-gray-300 select-none">·</span>
            <span className="text-gray-500">100+ ristoranti</span>
          </div>
        </div>

        {/* Headline */}
        <div
          className={`text-center mb-6 ${base} ${mounted ? visible : hidden}`}
          style={{ transitionDelay: "80ms" }}
        >
          <h1 className="text-7xl md:text-[96px] lg:text-[112px] font-semibold tracking-tight text-gray-900 leading-none">
            Il tuo ristorante,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #d1d1d6 0%, #aeaeb2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              senza caos.
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div
          className={`text-center mb-12 ${base} ${mounted ? visible : hidden}`}
          style={{ transitionDelay: "160ms" }}
        >
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Menu digitali con QR, food cost automatico, allergeni calcolati e un
            feed di ricette condivise tra chef italiani.
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 ${base} ${mounted ? visible : hidden}`}
          style={{ transitionDelay: "240ms" }}
        >
          <Link
            href="/sign-up"
            className="group flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-base transition-all duration-300 hover:bg-gray-800 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gray-900/25"
          >
            Inizia gratis
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="/piani"
            className="flex items-center gap-1 px-8 py-4 text-gray-500 font-medium text-base rounded-full transition-all duration-300 hover:text-gray-900 hover:bg-gray-50"
          >
            Vedi i piani
          </Link>
        </div>

        {/* Social proof micro */}
        <div
          className={`flex justify-center mb-20 ${base} ${mounted ? visible : hidden}`}
          style={{ transitionDelay: "320ms" }}
        >
          <p className="text-sm text-gray-400 font-light">
            Piano Free per sempre · Nessuna carta richiesta · Setup in 5 minuti
          </p>
        </div>

        {/* ─── Product Mockup ─── */}
        <div
          className={`relative ${base} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          style={{ transitionDelay: "480ms", transitionDuration: "1000ms" }}
        >
          {/* Fade bottom */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-1 left-0 right-0 h-48 z-20"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, white 100%)",
            }}
          />

          <div className="relative flex items-start justify-center gap-6">
            {/* Card 1 - floating left */}
            <div
              className="hidden lg:flex flex-col gap-4 pt-16 shrink-0"
              style={{ animation: "float-c 6s ease-in-out infinite" }}
            >
              {/* Mini card: Menu attivi */}
              <div className="w-56 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/60 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Menu attivi
                </p>
                {[
                  { name: "Pranzo", active: true },
                  { name: "Cena", active: true },
                  { name: "Delivery", active: true },
                  { name: "Evento", active: false },
                ].map((menu, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-700">{menu.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${menu.active ? "bg-green-400" : "bg-gray-200"}`}
                    />
                  </div>
                ))}
              </div>

              {/* Mini card: QR */}
              <div className="w-56 bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  QR Menu Pranzo
                </p>
                <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center mb-3">
                  <div className="w-20 h-20 grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${[0, 2, 6, 8, 4, 1, 7].includes(i) ? "bg-gray-900" : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  vittl.it/menu/pranzo
                </p>
              </div>
            </div>

            {/* Card principale - Recipe detail */}
            <div
              className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-300/40 overflow-hidden"
              style={{ animation: "float-a 4s ease-in-out infinite" }}
            >
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-5 max-w-32 mx-auto" />
              </div>

              <div className="p-6">
                {/* Recipe header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
                      Primo piatto
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Spaghetti Carbonara
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">4 porzioni</p>
                  </div>
                  <div className="bg-green-50 ring-1 ring-green-100 rounded-2xl px-4 py-2.5 text-center">
                    <p className="text-xs text-green-600 font-semibold mb-0.5">
                      Food Cost
                    </p>
                    <p className="text-2xl font-bold text-green-700 leading-none">
                      28%
                    </p>
                    <p className="text-xs text-green-500 mt-0.5">€3.20/pz</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    <span>Ingrediente</span>
                    <div className="flex gap-6">
                      <span>Qtà</span>
                      <span>Costo</span>
                    </div>
                  </div>
                  {ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-700">{ing.name}</span>
                      <div className="flex gap-6 text-sm">
                        <span className="text-gray-400 w-12 text-right">
                          {ing.qty}
                        </span>
                        <span className="text-gray-700 font-medium w-12 text-right">
                          {ing.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Allergens */}
                <div className="flex items-center gap-2 mb-5">
                  <p className="text-xs text-gray-400 font-medium mr-1">
                    Allergeni:
                  </p>
                  {allergens.map((a) => (
                    <span
                      key={a.code}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ${a.bg}`}
                    >
                      {a.code}
                    </span>
                  ))}
                </div>

                {/* Nutritional info */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Kcal", value: "580" },
                    { label: "Prot.", value: "38g" },
                    { label: "Carb.", value: "72g" },
                    { label: "Grassi", value: "18g" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-xl p-2.5 text-center"
                    >
                      <p className="text-xs text-gray-400 mb-0.5">{n.label}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {n.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 - floating right */}
            <div
              className="hidden lg:flex flex-col gap-4 pt-6 shrink-0"
              style={{ animation: "float-b 5s ease-in-out infinite" }}
            >
              {/* Margine card */}
              <div className="w-56 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Margine lordo
                  </p>
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    ↑ +4%
                  </span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-3">72%</p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Prezzo vendita: €11.50
                </p>
              </div>

              {/* Feed ricetta card */}
              <div className="w-56 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      Chef Marco R.
                    </p>
                    <p className="text-xs text-gray-400">Milano</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Ha condiviso una ricetta nel feed
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 rounded-xl px-3 py-1.5">
                    <p className="text-xs font-semibold text-gray-600">
                      🍝 Cacio e Pepe
                    </p>
                  </div>
                  <button className="text-xs text-gray-500 font-medium hover:text-gray-900 transition-colors">
                    Forka →
                  </button>
                </div>
              </div>

              {/* Mini stats */}
              <div className="w-56 bg-gray-900 rounded-2xl p-5 text-white">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Questa settimana
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Ricette nel feed", value: "24" },
                    { label: "Ricette forkate", value: "3" },
                    { label: "Menu aggiornati", value: "2" },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-xs text-gray-400">{s.label}</span>
                      <span className="text-xs font-semibold text-white">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
