"use client";

import Link from "next/link";
import { useInView } from "@/app/hooks/useInView";

export default function CTA() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="py-32 px-6 bg-gray-900 overflow-hidden relative">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-4xl mx-auto text-center relative z-10">
        <div
          className="transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Inizia oggi
          </p>
          <h2 className="text-6xl md:text-7xl font-semibold text-white tracking-tight mb-6">
            Il tuo ristorante
            <br />
            <span className="text-gray-500">merita di meglio.</span>
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-xl mx-auto leading-relaxed">
            Gratis per sempre. Setup in 5 minuti. Nessuna carta di credito.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="group px-10 py-4 bg-white text-gray-900 rounded-full font-semibold text-base transition-all duration-300 hover:bg-gray-100 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10"
            >
              Inizia gratis
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/contatti"
              className="px-10 py-4 border border-gray-700 text-gray-300 rounded-full font-medium text-base transition-all duration-300 hover:border-gray-500 hover:text-white hover:bg-white/5"
            >
              Parla con noi
            </Link>
          </div>

          {/* Social proof bottom */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              "100+ ristoranti in Italia",
              "Gratis per sempre",
              "Conforme Reg. UE 1169/2011",
              "Supporto in italiano",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-600"
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
                <span className="text-sm text-gray-500 font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
