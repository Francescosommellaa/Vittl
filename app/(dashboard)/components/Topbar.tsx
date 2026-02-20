"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Riepilogo del tuo ristorante",
  },
  "/dashboard/ricette": {
    title: "Ricette",
    subtitle: "Gestisci le tue ricette e il food cost",
  },
  "/dashboard/ingredienti": {
    title: "Ingredienti",
    subtitle: "Ingredienti, prezzi e allergeni",
  },
  "/dashboard/menu": {
    title: "Menu digitale",
    subtitle: "Menu QR e pagine pubbliche",
  },
  "/dashboard/feed": {
    title: "Feed",
    subtitle: "Ricette condivise dalla community",
  },
  "/dashboard/acquisti": {
    title: "Acquisti",
    subtitle: "Calcola gli ingredienti per i coperti",
  },
  "/dashboard/impostazioni": {
    title: "Impostazioni",
    subtitle: "Account, team e preferenze",
  },
  "/admin/dashboard": {
    title: "Admin — Dashboard",
    subtitle: "Monitoraggio app e segnalazioni",
  },
  "/admin/ingredienti": {
    title: "Admin — Ingredienti",
    subtitle: "Database globale ingredienti e prezzi",
  },
  "/admin/utenti": {
    title: "Admin — Utenti",
    subtitle: "Gestione utenti, piani e abbonamenti",
  },
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const page = PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES)
      .filter(([key]) => key !== "/dashboard" && pathname.startsWith(key))
      .map(([, val]) => val)[0] ?? { title: "Dashboard" };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 mr-3 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Apri menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="min-w-0">
        <h1 className="text-base font-semibold text-gray-900 tracking-tight leading-none">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xs text-gray-400 font-light mt-0.5 truncate hidden sm:block">
            {page.subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
