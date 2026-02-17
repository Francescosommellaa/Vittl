"use client";

import { useState } from "react";

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    ristorante: "",
    messaggio: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Per ora simuliamo l'invio - poi collegheremo l'API vera
    setTimeout(() => {
      setStatus("success");
      setFormData({ nome: "", email: "", ristorante: "", messaggio: "" });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-6">
            Contatti
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight mb-8">
            Parliamo
            <br />
            <span className="text-gray-400">insieme.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
            Hai domande su Vittl? Vuoi una demo personalizzata? Scrivici, ti
            rispondiamo entro 24 ore.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Info Contatti */}
          <div className="space-y-12">
            {/* Contatti diretti */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Come raggiungerci
              </h2>
              <div className="space-y-6">
                {[
                  {
                    label: "Email",
                    value: "ciao@vittl.it",
                    href: "mailto:ciao@vittl.it",
                    icon: "✉",
                  },
                  {
                    label: "Supporto",
                    value: "supporto@vittl.it",
                    href: "mailto:supporto@vittl.it",
                    icon: "🛟",
                  },
                  {
                    label: "Sede",
                    value: "Italia 🇮🇹",
                    href: null,
                    icon: "📍",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-gray-900 font-medium hover:text-gray-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tempi di risposta */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Tempi di risposta
              </h3>
              <div className="space-y-4">
                {[
                  { tipo: "Richieste generali", tempo: "Entro 24 ore" },
                  { tipo: "Supporto tecnico", tempo: "Entro 4 ore" },
                  { tipo: "Demo personalizzata", tempo: "Entro 48 ore" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600 text-sm">{item.tipo}</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {item.tempo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seguici
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all hover:scale-105"
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all hover:scale-105"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-3xl p-10">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Messaggio inviato!
                </h3>
                <p className="text-gray-500 font-light mb-8">
                  Ti risponderemo entro 24 ore.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Inviaci un messaggio
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Mario Rossi"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="mario@ristorante.it"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    />
                  </div>

                  {/* Ristorante */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome del ristorante
                    </label>
                    <input
                      type="text"
                      name="ristorante"
                      value={formData.ristorante}
                      onChange={handleChange}
                      placeholder="Da Mario"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm"
                    />
                  </div>

                  {/* Messaggio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Raccontaci di te e del tuo ristorante..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Invio in corso...
                      </span>
                    ) : (
                      "Invia messaggio →"
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Inviando il messaggio accetti la nostra{" "}
                    <a
                      href="/privacy"
                      className="underline hover:text-gray-600"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
