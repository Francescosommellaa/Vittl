"use client";

import { useInView } from "@/app/hooks/useInView";

const problems = [
  {
    number: "01",
    title: "Il menu cambia, la carta no.",
    description:
      "Ogni aggiornamento al menu richiede stampe, costi e tempo. Nel frattempo il cliente legge prezzi sbagliati.",
  },
  {
    number: "02",
    title: "Il food cost è un'approssimazione.",
    description:
      "Senza calcoli precisi, stai lavorando senza sapere quanto guadagni davvero su ogni piatto.",
  },
  {
    number: "03",
    title: "Gli allergeni sono un obbligo, non un'opzione.",
    description:
      "Il Reg. UE 1169/2011 ti obbliga a dichiarare 14 allergeni. Gestirli a mano è un rischio ogni giorno.",
  },
];

export default function ProblemSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="py-32 px-6 bg-gray-50">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="max-w-2xl mb-20 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Il problema
          </p>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
            Gestire un ristorante
            <br />
            <span className="text-gray-400">
              non dovrebbe essere così difficile.
            </span>
          </h2>
        </div>

        {/* Problems */}
        <div className="grid md:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden shadow-sm">
          {problems.map((p, i) => (
            <div
              key={i}
              className="bg-gray-50 p-10 transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <span className="text-6xl font-bold text-gray-100 block mb-6 leading-none">
                {p.number}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {p.title}
              </h3>
              <p className="text-gray-500 font-light leading-relaxed text-sm">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Soluzione */}
        <div
          className="mt-12 text-center transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "400ms",
          }}
        >
          <p className="text-lg text-gray-500 font-light">
            Vittl risolve tutto questo.{" "}
            <span className="text-gray-900 font-medium">
              In un unico strumento.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
