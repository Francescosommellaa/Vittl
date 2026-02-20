"use client";

import Link from "next/link";
import { useInView } from "@/app/hooks/useInView";

export default function PricingTeaser() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="py-32 px-6 bg-gray-50">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div
          className="transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Free */}
              <div className="p-10">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
                  Free
                </p>
                <p className="text-5xl font-bold text-gray-900 mb-2">€0</p>
                <p className="text-sm text-gray-400 mb-8">per sempre</p>
                <ul className="space-y-3 mb-8">
                  {["1 sede", "100 ricette", "4 menu attivi", "QR base"].map(
                    (f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 shrink-0"
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
                        {f}
                      </li>
                    ),
                  )}
                </ul>
                <Link
                  href="/sign-up"
                  className="block text-center py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all"
                >
                  Inizia gratis
                </Link>
              </div>

              {/* Start - highlighted */}
              <div className="p-10 bg-gray-900 text-white">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                    Start
                  </p>
                  <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full font-medium">
                    Più scelto
                  </span>
                </div>
                <p className="text-5xl font-bold text-white mb-2">€35</p>
                <p className="text-sm text-gray-400 mb-8">al mese</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "2 utenti",
                    "200 ricette",
                    "8 menu attivi",
                    "QR personalizzabile",
                    "14 giorni di prova",
                  ].map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-gray-300"
                    >
                      <svg
                        className="w-4 h-4 text-white shrink-0"
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
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://buy.stripe.com/aFa8wR3XbfXf7bo44A9R600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02]"
                >
                  Prova 14 giorni gratis
                </a>
              </div>

              {/* Pro */}
              <div className="p-10">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
                  Pro
                </p>
                <p className="text-5xl font-bold text-gray-900 mb-2">€100</p>
                <p className="text-sm text-gray-400 mb-8">al mese</p>
                <ul className="space-y-3 mb-8">
                  {[
                    "4 utenti",
                    "2 sedi",
                    "500 ricette totali",
                    "Dashboard unificata",
                    "14 giorni di prova",
                  ].map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 shrink-0"
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
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://buy.stripe.com/fZu4gB3Xb4exbrEcB69R602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all"
                >
                  Prova 14 giorni gratis
                </a>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-100 px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
              <p className="text-sm text-gray-500 font-light">
                Nessuna carta richiesta per la prova · Cancella in qualsiasi
                momento
              </p>
              <Link
                href="/piani"
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                Confronta tutti i piani →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
