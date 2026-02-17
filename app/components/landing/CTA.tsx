"use client";

export default function CTA() {
  return (
    <section className="py-32 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-5xl md:text-6xl font-semibold mb-6">
          Pronto a iniziare?
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
          Unisciti ai ristoratori che hanno già scelto Vittl per semplificare la
          loro gestione quotidiana.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group px-8 py-4 bg-white text-gray-900 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-xl">
            Inizia gratis ora
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          <button className="px-8 py-4 border-2 border-gray-700 text-white rounded-full font-medium transition-all duration-300 hover:border-gray-500 hover:bg-gray-800">
            Parla con il team
          </button>
        </div>

        {/* Trust Badge */}
        <p className="mt-12 text-sm text-gray-500">
          Nessuna carta di credito richiesta • Setup in 5 minuti
        </p>
      </div>
    </section>
  );
}
