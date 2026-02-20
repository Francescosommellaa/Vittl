import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ChefHat,
  QrCode,
  Users,
  ArrowRight,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Stat {
  label: string;
  value: number;
  href: string;
  suffix?: string;
}

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

// ── FIX 1: rimosso "Aggiungi ingrediente" da QUICK_ACTIONS ──
const QUICK_ACTIONS: QuickAction[] = [
  {
    href: "/dashboard/ricette",
    label: "Nuova ricetta",
    description: "Food cost e allergeni calcolati in automatico",
    icon: ChefHat,
  },
  {
    href: "/dashboard/menu",
    label: "Crea menu digitale",
    description: "QR code pronto da condividere subito",
    icon: QrCode,
  },
  {
    href: "/dashboard/feed",
    label: "Esplora il feed",
    description: "Scopri e forka ricette di altri chef",
    icon: Users,
  },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let firstName = "";
  // ── FIX 2: rimosso stat "Ingredienti" ──
  let stats: Stat[] = [
    { label: "Ricette", value: 0, href: "/dashboard/ricette" },
    { label: "Menu attivi", value: 0, href: "/dashboard/menu" },
  ];

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        primaryTenant: {
          include: {
            recipes: { select: { id: true } },
            locations: {
              include: {
                menus: { where: { isPublished: true }, select: { id: true } },
              },
            },
          },
        },
      },
    });

    firstName = dbUser?.name?.split(" ")[0] ?? "";

    const tenant = dbUser?.primaryTenant;
    if (tenant) {
      const menuCount = tenant.locations.flatMap(
        (l: { menus: { id: string }[] }) => l.menus,
      ).length;
      stats = [
        {
          label: "Ricette",
          value: tenant.recipes.length,
          href: "/dashboard/ricette",
        },
        {
          label: "Menu attivi",
          value: menuCount,
          href: "/dashboard/menu",
        },
      ];
    }
  } catch {
    // DB non sincronizzato → mostra zeri, non crashare
  }

  const hasNoData = stats.every((s) => s.value === 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* ── Welcome ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
          Benvenuto
        </p>
        <h2 className="text-4xl font-semibold text-gray-900 tracking-tight leading-none">
          {firstName ? `Ciao, ${firstName}.` : "Ciao."}
        </h2>
        <p className="text-gray-400 font-light mt-2 text-lg">
          Ecco cosa sta succedendo nel tuo ristorante.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-5xl font-bold text-gray-900 tracking-tight tabular-nums">
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl text-gray-400">{stat.suffix}</span>
                )}
              </p>
              <p className="text-sm text-gray-400 font-light mt-2">
                {stat.label}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-300 group-hover:text-gray-500 transition-colors">
                <span>Vedi tutti</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Onboarding / Azioni rapide ── */}
      {hasNoData ? (
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
            Inizia da qui
          </p>
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            {/* Banner */}
            <div className="bg-gray-900 px-8 py-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-2xl">
                  <TrendingUp
                    className="w-5 h-5 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-white/60 text-sm font-medium">
                  Setup iniziale
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight mb-2">
                Il tuo ristorante è pronto.
              </h3>
              {/* ── FIX 3: descrizione aggiornata ── */}
              <p className="text-white/60 font-light leading-relaxed max-w-md">
                Crea la tua prima ricetta, costruisci il menu, pubblicalo e
                genera il QR per i tuoi clienti.
              </p>
            </div>

            {/* ── FIX 4: steps aggiornati ── */}
            <div className="divide-y divide-gray-100">
              {[
                {
                  step: "01",
                  label: "Crea la prima ricetta",
                  description:
                    "Food cost e allergeni calcolati automaticamente",
                  href: "/dashboard/ricette",
                },
                {
                  step: "02",
                  label: "Crea un menu digitale",
                  description: "Organizza le ricette in sezioni e categorie",
                  href: "/dashboard/menu",
                },
                {
                  step: "03",
                  label: "Pubblica il menu",
                  description: "Rendilo accessibile ai clienti in un click",
                  href: "/dashboard/menu",
                },
                {
                  step: "04",
                  label: "Crea e associa un QR al menu",
                  description: "Genera il QR e collegalo al menu pubblicato",
                  href: "/dashboard/menu",
                },
              ].map((s) => (
                <Link key={s.step} href={s.href}>
                  <div className="flex items-center gap-6 px-8 py-5 hover:bg-gray-50 transition-colors group">
                    <span className="text-xs font-bold text-gray-200 tabular-nums shrink-0">
                      {s.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {s.label}
                      </p>
                      <p className="text-xs text-gray-400 font-light mt-0.5">
                        {s.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
            Azioni rapide
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-2xl group-hover:bg-gray-900 transition-colors duration-300 shrink-0">
                      <Icon
                        className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {action.label}
                      </p>
                      <p className="text-xs text-gray-400 font-light mt-0.5 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Acquisti shortcut ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
            <ShoppingBasket
              className="w-5 h-5 text-gray-700"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              Aiuto acquisti
            </p>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Inserisci i coperti previsti, Vittl calcola gli ingredienti da
              ordinare
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/acquisti"
          className="shrink-0 flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          Calcola
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
