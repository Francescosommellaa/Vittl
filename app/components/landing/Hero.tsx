"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background gradient subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gray-100 rounded-full text-sm text-gray-600 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Per ristoratori italiani
        </div>

        {/* Main Headline */}
        <h1
          className={`text-6xl md:text-8xl font-semibold tracking-tight text-gray-900 mb-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Gestisci il tuo
          <br />
          ristorante con <span className="text-gray-400">intelligenza</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-light leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          La piattaforma che semplifica la gestione quotidiana del tuo locale.
          Menu digitali, inventario, ordini. Tutto in un unico posto.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button className="group px-8 py-4 bg-gray-900 text-white rounded-full font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-xl">
            Inizia gratis
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          <button className="px-8 py-4 text-gray-600 font-medium transition-all duration-300 hover:text-gray-900">
            Guarda la demo
          </button>
        </div>

        {/* Social Proof */}
        <p
          className={`mt-12 text-sm text-gray-400 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Usato da oltre 100+ ristoranti in Italia
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
