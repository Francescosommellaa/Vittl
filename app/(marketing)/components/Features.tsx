"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Menu Digitale",
    description:
      "Crea e aggiorna il tuo menu in tempo reale. QR code per clienti.",
    icon: "📱",
  },
  {
    title: "Gestione Inventario",
    description: "Traccia ingredienti e scorte. Alert automatici per riordini.",
    icon: "📦",
  },
  {
    title: "Ordini Smart",
    description:
      "Sistema di ordinazione integrato. Cucina e sala sincronizzate.",
    icon: "🍽️",
  },
  {
    title: "Analytics",
    description:
      "Report dettagliati su vendite, piatti popolari e performance.",
    icon: "📊",
  },
];

export default function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 150);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            Tutto ciò che ti serve.
            <br />
            <span className="text-gray-400">Niente di più.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Strumenti essenziali per gestire il tuo ristorante con semplicità.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 bg-gray-50 rounded-3xl transition-all duration-700 hover:bg-gray-100 hover:scale-105 hover:shadow-lg ${
                visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Icon */}
              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
