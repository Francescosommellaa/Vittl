"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ChefHat,
  Package,
  QrCode,
  Users,
  ShoppingBasket,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { images } from "@/app/assets/images";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/ricette", label: "Ricette", icon: ChefHat },
  { href: "/dashboard/ingredienti", label: "Ingredienti", icon: Package },
  { href: "/dashboard/menu", label: "Menu digitale", icon: QrCode },
  { href: "/dashboard/feed", label: "Feed", icon: Users },
  { href: "/dashboard/acquisti", label: "Acquisti", icon: ShoppingBasket },
];

const BOTTOM_ITEMS = [
  { href: "/dashboard/impostazioni", label: "Impostazioni", icon: Settings },
];

const PLAN_LABELS: Record<string, string> = {
  FREE: "Piano Free",
  START: "Piano Start",
  PRO: "Piano Pro",
  ENTERPRISE: "Enterprise",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  plan: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  restaurantName,
  plan,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50
          flex flex-col overflow-hidden
          transition-[width,transform] duration-300 ease-in-out
          w-64 group
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-17 lg:hover:w-64
        `}
      >
        {/* ── Logo ── */}
        <div className="h-16 flex items-center border-b border-gray-100 shrink-0 px-3.5 gap-3 overflow-hidden">
          {/* Icona quadrata (sempre visibile, sfondo trasparente su bg bianco) */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="shrink-0"
            title="Vittl"
          >
            <Image
              src={images.icon.dark}
              alt="Vittl icon"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
          </Link>

          {/* Logo full (appare quando espansa) */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className="
              shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100
              transition-opacity duration-200 pointer-events-auto
            "
          >
            <Image
              src={images.logo.dark}
              alt="Vittl"
              width={72}
              height={24}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>

          {/* Close — solo mobile */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`
                  flex items-center gap-3 px-2.75 py-2.5 rounded-2xl text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  className="w-5 h-5 shrink-0"
                  strokeWidth={active ? 2.5 : 1.75}
                />
                <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom ── */}
        <div className="px-2 pb-3 space-y-0.5 border-t border-gray-100 pt-3 shrink-0">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.label}
                className={`
                  flex items-center gap-3 px-2.75 py-2.5 rounded-2xl text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {plan === "FREE" && (
            <Link
              href="/piani"
              title="Fai upgrade"
              className="flex items-center gap-3 px-2.75 py-2.5 rounded-2xl text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              <Zap className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                Fai upgrade
              </span>
            </Link>
          )}

          {/* Ristorante info */}
          <div className="mt-2 mx-1 px-3 py-2.5 bg-gray-50 rounded-2xl overflow-hidden opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {restaurantName}
            </p>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              {PLAN_LABELS[plan] ?? plan}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
