"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Headphones,
  MapPin,
  Instagram,
  Linkedin,
  Clock,
} from "lucide-react";
import { useInView } from "@/app/hooks/useInView";

const contacts = [
  {
    icon: Mail,
    label: "Email generale",
    value: "ciao@vittl.it",
    href: "mailto:ciao@vittl.it",
    description: "Per qualsiasi domanda",
  },
  {
    icon: Headphones,
    label: "Supporto tecnico",
    value: "supporto@vittl.it",
    href: "mailto:supporto@vittl.it",
    description: "Problemi con la piattaforma",
  },
  {
    icon: MapPin,
    label: "Sede",
    value: "Italia",
    href: null,
    description: "Operiamo in tutta Italia",
  },
];

const responseTimes = [
  { tipo: "Richieste generali", tempo: "Entro 24 ore" },
  { tipo: "Supporto tecnico", tempo: "Entro 4 ore" },
  { tipo: "Demo personalizzata", tempo: "Entro 48 ore" },
];

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  description,
  index,
  inView,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string | null;
  description: string;
  index: number;
  inView: boolean;
}) {
  return (
    <div
      className="group flex items-start gap-5 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, box-shadow 0.3s, border-color 0.3s, translate 0.3s`,
      }}
    >
      <div className="w-11 h-11 bg-gray-50 group-hover:bg-gray-900 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 border border-gray-100 group-hover:border-gray-900">
        <Icon
          className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors duration-300"
          strokeWidth={1.75}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="text-base font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            {value}
          </a>
        ) : (
          <p className="text-base font-semibold text-gray-900">{value}</p>
        )}
        <p className="text-sm text-gray-400 font-light mt-0.5">{description}</p>
      </div>
    </div>
  );
}

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
  const [focused, setFocused] = useState<string | null>(null);

  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: leftRef, inView: leftInView } = useInView(0.1);
  const { ref: formRef, inView: formInView } = useInView(0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setFormData({ nome: "", email: "", ristorante: "", messaggio: "" });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = (name: string) =>
    `w-full px-5 py-3.5 bg-white border rounded-2xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none transition-all duration-200 ${
      focused === name
        ? "border-gray-900 shadow-sm"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 pt-40 pb-24 px-6">
        <div
          ref={heroRef}
          className="max-w-5xl mx-auto transition-all duration-700"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-6">
            Contatti
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight mb-6 leading-none">
            Parliamo
            <br />
            <span className="text-gray-300">insieme.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl">
            Hai domande su Vittl? Vuoi una demo? Ti rispondiamo entro 24 ore.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 pb-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Left */}
          <div ref={leftRef} className="space-y-6">
            {/* Contact cards */}
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <ContactCard key={i} {...c} index={i} inView={leftInView} />
              ))}
            </div>

            {/* Response times */}
            <div
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-700"
              style={{
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "300ms",
              }}
            >
              <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-gray-50">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <Clock className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Tempi di risposta
                </h3>
              </div>
              <div className="px-6 py-2">
                {responseTimes.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-600 font-light">
                      {item.tipo}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
                      {item.tempo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "400ms",
              }}
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">
                Seguici
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/vittl_app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 shadow-sm"
                >
                  <Instagram
                    className="w-4 h-4 group-hover:text-white transition-colors"
                    strokeWidth={1.75}
                  />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/vittl-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 shadow-sm"
                >
                  <Linkedin
                    className="w-4 h-4 group-hover:text-white transition-colors"
                    strokeWidth={1.75}
                  />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div
            ref={formRef}
            className="transition-all duration-700"
            style={{
              opacity: formInView ? 1 : 0,
              transform: formInView ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "150ms",
            }}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-24 px-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                    <svg
                      className="w-7 h-7 text-green-600"
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
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Messaggio inviato
                  </h3>
                  <p className="text-gray-500 font-light mb-8 max-w-xs">
                    Ti risponderemo entro 24 ore all&apos;indirizzo email che
                    hai indicato.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-7 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02]"
                  >
                    Invia un altro messaggio
                  </button>
                </div>
              ) : (
                <>
                  {/* Form header */}
                  <div className="px-8 pt-8 pb-6 border-b border-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      Inviaci un messaggio
                    </h2>
                    <p className="text-sm text-gray-400 font-light">
                      Compila il form e ti risponderemo al più presto.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Nome + Email in griglia */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          onFocus={() => setFocused("nome")}
                          onBlur={() => setFocused(null)}
                          required
                          placeholder="Mario Rossi"
                          className={inputClass("nome")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          required
                          placeholder="mario@ristorante.it"
                          className={inputClass("email")}
                        />
                      </div>
                    </div>

                    {/* Ristorante */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Nome del ristorante
                        <span className="text-gray-300 ml-1 normal-case font-normal tracking-normal">
                          (opzionale)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="ristorante"
                        value={formData.ristorante}
                        onChange={handleChange}
                        onFocus={() => setFocused("ristorante")}
                        onBlur={() => setFocused(null)}
                        placeholder="Da Mario"
                        className={inputClass("ristorante")}
                      />
                    </div>

                    {/* Messaggio */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Messaggio *
                      </label>
                      <textarea
                        name="messaggio"
                        value={formData.messaggio}
                        onChange={handleChange}
                        onFocus={() => setFocused("messaggio")}
                        onBlur={() => setFocused(null)}
                        required
                        rows={5}
                        placeholder="Raccontaci di te e del tuo ristorante..."
                        className={`${inputClass("messaggio")} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group w-full py-4 bg-gray-900 text-white rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-2.5">
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
                        <span className="flex items-center justify-center gap-2">
                          Invia messaggio
                          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center font-light">
                      Inviando accetti la nostra{" "}
                      <Link
                        href="/privacy"
                        className="text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2">
              Preferisci provarlo prima?
            </h2>
            <p className="text-gray-400 font-light">
              Piano Free per sempre, nessuna carta richiesta.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="group shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-100 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10"
          >
            Inizia gratis
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
