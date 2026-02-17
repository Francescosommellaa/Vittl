"use client";

import Link from "next/link";
import { Zap, Eye, Award } from "lucide-react";
import { useInView } from "@/app/hooks/useInView";

const stats = [
  { number: "100+", label: "Ristoranti attivi" },
  { number: "2024", label: "Anno di fondazione" },
  { number: "99%", label: "Soddisfazione" },
  { number: "24/7", label: "Supporto" },
];

const values = [
  {
    icon: Zap,
    title: "Semplicità",
    description:
      "Ogni feature che aggiungiamo deve essere immediatamente comprensibile. Se è complicata, non entra.",
  },
  {
    icon: Eye,
    title: "Onestà",
    description:
      "Prezzi trasparenti, nessun costo nascosto. Con i nostri clienti parliamo chiaro, sempre.",
  },
  {
    icon: Award,
    title: "Qualità",
    description:
      "Preferiamo fare poche cose straordinariamente bene piuttosto che molte cose in modo mediocre.",
  },
];

const team = [
  {
    name: "Francesco",
    role: "CEO & Co-founder",
    bio: "Appassionato di ristorazione e tecnologia. Ha lavorato in alcuni dei migliori ristoranti italiani prima di fondare Vittl.",
    initial: "F",
  },
  {
    name: "Marco",
    role: "CTO & Co-founder",
    bio: "Ingegnere software con 10 anni di esperienza. Costruisce sistemi scalabili per il settore food & beverage.",
    initial: "M",
  },
  {
    name: "Sofia",
    role: "Head of Design",
    bio: "Designer con background in UX per applicazioni enterprise. Ossessionata dalla semplicità e dall'esperienza utente.",
    initial: "S",
  },
];

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function ChiSiamoPage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: storiaRef, inView: storiaInView } = useInView(0.15);
  const { ref: valoriRef, inView: valoriInView } = useInView(0.1);
  const { ref: teamRef, inView: teamInView } = useInView(0.1);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────── */}
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
            Chi siamo
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-none mb-8">
            Nati per
            <br />
            <span className="text-gray-300">la ristorazione.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl">
            Vittl nasce da una frustrazione reale: gestire un ristorante in
            Italia è complicato quanto aprirlo. Abbiamo deciso di cambiarlo.
          </p>
        </div>
      </section>

      {/* ── Storia ───────────────────────────────── */}
      <section className="py-24 px-6">
        <div
          ref={storiaRef}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Testo */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: storiaInView ? 1 : 0,
              transform: storiaInView ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-5">
              La nostra storia
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight mb-8">
              Un problema reale.
              <br />
              <span className="text-gray-400">Una soluzione italiana.</span>
            </h2>
            <div className="space-y-5 text-gray-500 font-light leading-relaxed">
              <p>
                Nel 2024, dopo aver lavorato a stretto contatto con decine di
                ristoratori italiani, abbiamo capito una cosa: i software
                esistenti erano troppo complicati, troppo costosi, o pensati per
                il mercato americano.
              </p>
              <p>
                Nessuno aveva costruito qualcosa di specifico per la
                ristorazione italiana, con le sue peculiarità, le sue leggi, il
                suo modo di lavorare.
              </p>
              <p>
                Così abbiamo fondato Vittl. Con un obiettivo chiaro: dare ai
                ristoratori italiani uno strumento che sentano davvero loro.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div
            className="grid grid-cols-2 gap-4 transition-all duration-700 delay-200"
            style={{
              opacity: storiaInView ? 1 : 0,
              transform: storiaInView ? "translateX(0)" : "translateX(24px)",
              transitionDelay: "200ms",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
              >
                <p className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-400 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valori ───────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div ref={valoriRef} className="max-w-6xl mx-auto">
          <div
            className="text-center mb-16 transition-all duration-700"
            style={{
              opacity: valoriInView ? 1 : 0,
              transform: valoriInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-4">
              Valori
            </p>
            <h2 className="text-5xl font-semibold text-gray-900 tracking-tight mb-4">
              Tre principi.
              <br />
              <span className="text-gray-300">Nessun compromesso.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="group p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-gray-900 hover:border-gray-900 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-900/20"
                  style={{
                    opacity: valoriInView ? 1 : 0,
                    transform: valoriInView
                      ? "translateY(0)"
                      : "translateY(28px)",
                    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, background 0.5s, border-color 0.5s, box-shadow 0.5s, translate 0.3s`,
                  }}
                >
                  <div className="w-12 h-12 bg-white group-hover:bg-white/10 rounded-2xl border border-gray-200 group-hover:border-white/20 flex items-center justify-center mb-6 transition-all duration-500">
                    <Icon
                      className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white mb-3 transition-colors duration-500">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-sm font-light leading-relaxed transition-colors duration-500">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div ref={teamRef} className="max-w-6xl mx-auto">
          <div
            className="text-center mb-16 transition-all duration-700"
            style={{
              opacity: teamInView ? 1 : 0,
              transform: teamInView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-4">
              Il team
            </p>
            <h2 className="text-5xl font-semibold text-gray-900 tracking-tight mb-4">
              Persone reali.
              <br />
              <span className="text-gray-300">Problemi reali.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 hover:border-gray-200 transition-all duration-300"
                style={{
                  opacity: teamInView ? 1 : 0,
                  transform: teamInView ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, box-shadow 0.3s, border-color 0.3s, translate 0.3s`,
                }}
              >
                {/* Avatar */}
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">
                    {member.initial}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {member.role}
                </p>

                {/* Divider */}
                <div className="w-8 h-px bg-gray-200 mb-4 group-hover:w-full transition-all duration-500" />

                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto ────────────────────────────── */}
      <AnimatedSection className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {[
                {
                  number: "01",
                  title: "Costruito in Italia",
                  desc: "Pensato per le leggi, le usanze e le esigenze specifiche della ristorazione italiana.",
                },
                {
                  number: "02",
                  title: "Sempre in evoluzione",
                  desc: "Ogni settimana miglioriamo il prodotto basandoci sul feedback reale dei ristoratori.",
                },
                {
                  number: "03",
                  title: "Trasparenza totale",
                  desc: "Nessun costo nascosto, nessun lock-in. Sei libero di andartene quando vuoi.",
                },
              ].map((item, i) => (
                <div key={i} className="p-8 md:p-10">
                  <span className="text-5xl font-bold text-gray-100 block mb-4 leading-none">
                    {item.number}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2">
              Costruiamo insieme.
            </h2>
            <p className="text-gray-400 font-light">
              Il futuro della ristorazione italiana parte da qui.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contatti"
              className="group flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-100 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10"
            >
              Contattaci
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center px-8 py-4 border border-gray-700 text-gray-300 rounded-full font-medium text-sm transition-all duration-300 hover:border-gray-500 hover:text-white hover:bg-white/5"
            >
              Inizia gratis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
