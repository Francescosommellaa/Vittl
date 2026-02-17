"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CookiePreferences = {
  analytics: boolean;
  functional: boolean;
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("vittl_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(
      "vittl_cookie_consent",
      JSON.stringify({ ...prefs, timestamp: Date.now() }),
    );
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ analytics: true, functional: true });
  };

  const rejectAll = () => {
    saveConsent({ analytics: false, functional: false });
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay blur - solo quando showDetails è aperto */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setShowDetails(false)}
        />
      )}

      {/* Banner */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-out ${
          showDetails
            ? "inset-0 flex items-end sm:items-center justify-center p-4 sm:p-6"
            : "bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px]"
        }`}
      >
        <div
          className={`bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-gray-200/80 transition-all duration-500 w-full ${
            showDetails ? "max-w-lg" : ""
          }`}
        >
          {!showDetails ? (
            /* Banner minimale */
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm">V</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    Vittl
                  </span>
                </div>
                <button
                  onClick={rejectAll}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Chiudi e rifiuta"
                >
                  <svg
                    className="w-4 h-4"
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
                </button>
              </div>

              {/* Testo */}
              <p className="text-sm text-gray-600 font-light leading-relaxed mb-5">
                Utilizziamo cookie tecnici (necessari) e analitici (opzionali)
                per migliorare la tua esperienza.{" "}
                <Link
                  href="/cookie"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={acceptAll}
                  className="w-full py-3 bg-gray-900 text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Accetta tutti
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={rejectAll}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Solo necessari
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Personalizza
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Vista dettagliata */
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preferenze cookie
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>

              {/* Toggle Items */}
              <div className="space-y-4 mb-6">
                {/* Tecnici - sempre attivi */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Cookie Tecnici
                      </p>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        Sempre attivi
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Necessari per autenticazione, sicurezza e funzionamento
                      della piattaforma.
                    </p>
                  </div>
                  {/* Toggle disabilitato */}
                  <div className="w-11 h-6 bg-gray-900 rounded-full shrink-0 mt-0.5 relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Analitici */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Cookie Analitici
                    </p>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Ci aiutano a capire come usi Vittl per migliorare il
                      servizio (dati anonimi).
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((p) => ({ ...p, analytics: !p.analytics }))
                    }
                    className={`w-11 h-6 rounded-full shrink-0 mt-0.5 relative transition-all duration-300 ${
                      preferences.analytics ? "bg-gray-900" : "bg-gray-200"
                    }`}
                    aria-label="Toggle cookie analitici"
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        preferences.analytics ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Funzionali */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Cookie Funzionali
                    </p>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Ricordano le tue preferenze UI e lo stato del tuo
                      onboarding.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPreferences((p) => ({
                        ...p,
                        functional: !p.functional,
                      }))
                    }
                    className={`w-11 h-6 rounded-full shrink-0 mt-0.5 relative transition-all duration-300 ${
                      preferences.functional ? "bg-gray-900" : "bg-gray-200"
                    }`}
                    aria-label="Toggle cookie funzionali"
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        preferences.functional ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={acceptAll}
                  className="w-full py-3 bg-gray-900 text-white rounded-2xl text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02]"
                >
                  Accetta tutti
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={rejectAll}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Solo necessari
                  </button>
                  <button
                    onClick={saveCustom}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200 transition-all"
                  >
                    Salva preferenze
                  </button>
                </div>
              </div>

              <p className="text-center mt-4 text-xs text-gray-400">
                <Link
                  href="/cookie"
                  className="hover:text-gray-600 underline underline-offset-2 transition-colors"
                >
                  Cookie Policy completa
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
