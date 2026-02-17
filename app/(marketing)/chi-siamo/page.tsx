export const metadata = {
  title: "Chi siamo - Vittl",
  description: "La storia di Vittl, la piattaforma per ristoratori italiani.",
};

const team = [
  {
    name: "Francesco",
    role: "CEO & Co-founder",
    bio: "Appassionato di ristorazione e tecnologia. Ha lavorato in alcuni dei migliori ristoranti italiani prima di fondare Vittl.",
    emoji: "👨‍💼",
  },
  {
    name: "Marco",
    role: "CTO & Co-founder",
    bio: "Ingegnere software con 10 anni di esperienza. Costruisce sistemi scalabili per il settore food & beverage.",
    emoji: "👨‍💻",
  },
  {
    name: "Sofia",
    role: "Head of Design",
    bio: "Designer con background in UX per applicazioni enterprise. Ossessionata dalla semplicità e dall'esperienza utente.",
    emoji: "👩‍🎨",
  },
];

const values = [
  {
    title: "Semplicità",
    description:
      "Ogni feature che aggiungiamo deve essere immediatamente comprensibile. Se è complicata, non entra.",
    icon: "✦",
  },
  {
    title: "Onestà",
    description:
      "Prezzi trasparenti, nessun costo nascosto. Con i nostri clienti parliamo chiaro, sempre.",
    icon: "◆",
  },
  {
    title: "Qualità",
    description:
      "Preferiamo fare poche cose straordinariamente bene piuttosto che molte cose in modo mediocre.",
    icon: "▲",
  },
];

export default function ChiSiamoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-6">
            Chi siamo
          </p>
          <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight mb-8">
            Nati per
            <br />
            <span className="text-gray-400">la ristorazione.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl">
            Vittl nasce da una frustrazione reale: gestire un ristorante in
            Italia è complicato quanto aprirlo. Abbiamo deciso di cambiarlo.
          </p>
        </div>
      </section>

      {/* Storia */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900 mb-6">
              La nostra storia
            </h2>
            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { number: "100+", label: "Ristoranti" },
              { number: "2024", label: "Anno fondazione" },
              { number: "99%", label: "Soddisfazione" },
              { number: "24/7", label: "Supporto" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-sm text-center"
              >
                <p className="text-4xl font-semibold text-gray-900 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-gray-900 mb-4">
              I nostri valori
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Tre principi che guidano ogni decisione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="group p-10 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <span className="text-2xl text-gray-300 font-light mb-6 block">
                  {value.icon}
                </span>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-gray-900 mb-4">
              Il team
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Persone reali che capiscono la ristorazione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl mb-6">{member.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-semibold mb-6">Unisciti a noi</h2>
          <p className="text-xl text-gray-400 font-light mb-10">
            Costruiamo insieme il futuro della ristorazione italiana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contatti"
              className="group px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105"
            >
              Contattaci
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="/login"
              className="px-8 py-4 border-2 border-gray-700 text-white rounded-full font-medium hover:border-gray-500 hover:bg-gray-800 transition-all"
            >
              Inizia gratis
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
