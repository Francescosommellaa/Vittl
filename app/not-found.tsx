"use client";

import Link from "next/link";
import { Home, Mail, CreditCard, Search } from "lucide-react";
import { useEffect, useState } from "react";

const quickLinks = [
  {
    icon: Home,
    label: "Homepage",
    href: "/",
    description: "Torna alla home",
  },
  {
    icon: CreditCard,
    label: "Piani e prezzi",
    href: "/piani",
    description: "Scopri i nostri piani",
  },
  {
    icon: Mail,
    label: "Contatti",
    href: "/contatti",
    description: "Scrivici un messaggio",
  },
  {
    icon: Search,
    label: "Chi siamo",
    href: "/chi-siamo",
    description: "La nostra storia",
  },
];

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      {/* Radial gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0,0,0,0.02) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* 404 Giant */}
        <div
          className="text-center mb-12 transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div
              aria-hidden
              className="absolute inset-0 blur-3xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)",
              }}
            />
            <h1
              className="text-[180px] md:text-[240px] font-bold leading-none tracking-tighter text-gray-900 relative"
              style={{
                background: "linear-gradient(135deg, #1d1d1f 0%, #86868b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </h1>
          </div>
        </div>

        {/* Message */}
        <div
          className="text-center mb-16 transition-all duration-1000 delay-200"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "200ms",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
            Pagina non trovata
          </h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl mx-auto">
            La pagina che stai cercando non esiste o è stata spostata.
            <br />
            Nessun problema, ti aiutiamo a ritrovare la strada.
          </p>
        </div>

        {/* Quick links */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 transition-all duration-1000 delay-400"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "400ms",
          }}
        >
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={i}
                href={link.href}
                className="group flex flex-col items-start gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-200 transition-all duration-300"
              >
                <div className="w-11 h-11 bg-gray-50 group-hover:bg-gray-900 rounded-2xl border border-gray-100 group-hover:border-gray-900 flex items-center justify-center transition-all duration-300">
                  <Icon
                    className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors duration-300"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-400 font-light">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back button */}
        <div
          className="flex justify-center transition-all duration-1000 delay-600"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "600ms",
          }}
        >
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-800 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gray-900/20"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Torna indietro
          </button>
        </div>

        {/* Help text */}
        <div
          className="text-center mt-12 transition-all duration-1000 delay-800"
          style={{
            opacity: mounted ? 1 : 0,
            transitionDelay: "800ms",
          }}
        >
          <p className="text-sm text-gray-400 font-light">
            Hai bisogno di aiuto?{" "}
            <Link
              href="/contatti"
              className="text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
              Contattaci
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
