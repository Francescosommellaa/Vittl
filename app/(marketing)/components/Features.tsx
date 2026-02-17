"use client";

import { useInView } from "@/app/hooks/useInView";
import {
  QrCode,
  TrendingDown,
  ShieldCheck,
  Users,
  ShoppingBasket,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Menu digitale con QR",
    description:
      "Aggiorna il menu in tempo reale. I clienti scansionano il QR e vedono sempre l'ultima versione. Niente più stampe.",
    tag: "Incluso",
  },
  {
    icon: TrendingDown,
    title: "Food cost automatico",
    description:
      "Inserisci gli ingredienti, Vittl calcola il costo per porzione e il margine. Ogni piatto, ogni giorno.",
    tag: "Incluso",
  },
  {
    icon: ShieldCheck,
    title: "Allergeni calcolati",
    description:
      "I 14 allergeni obbligatori per legge vengono identificati automaticamente dagli ingredienti. Zero errori.",
    tag: "Incluso",
  },
  {
    icon: Users,
    title: "Feed ricette social",
    description:
      "Scopri le ricette di altri chef, forkale e adattale al tuo ristorante. Condividi le tue creazioni.",
    tag: "Incluso",
  },
  {
    icon: ShoppingBasket,
    title: "Aiuto agli acquisti",
    description:
      "Dicci quanti coperti prevedi: Vittl calcola automaticamente le quantità di ingredienti da ordinare.",
    tag: "Incluso",
  },
  {
    icon: Smartphone,
    title: "Mobile-first PWA",
    description:
      "Usalo dal telefono come un'app nativa. Nessun download richiesto, funziona su qualsiasi dispositivo.",
    tag: "Incluso",
  },
];

export default function FeaturesGrid() {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="py-32 px-6 bg-white">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-20 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Funzionalità
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-5">
            Tutto ciò che serve.
            <br />
            <span className="text-gray-400">Niente di superfluo.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-xl mx-auto">
            Ogni funzionalità è inclusa in tutti i piani, dal Free
            all'Enterprise.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-500 hover:-translate-y-1"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, background 0.3s, border-color 0.3s, box-shadow 0.3s, translate 0.3s`,
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-white group-hover:bg-gray-900 rounded-2xl border border-gray-200 group-hover:border-gray-900 flex items-center justify-center mb-6 transition-all duration-300">
                  <Icon
                    className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300"
                    strokeWidth={1.75}
                  />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <span className="shrink-0 text-xs font-medium text-gray-400 bg-gray-100 group-hover:bg-gray-50 px-2.5 py-1 rounded-full transition-colors">
                    {f.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
