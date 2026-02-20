"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ChefHat,
  QrCode,
  Users,
  ShoppingBasket,
  X,
  Zap,
  MapPin,
  ChevronUp,
  Check,
  Plus,
  Settings,
  UserCog,
  CreditCard,
  LogOut,
  ChevronRight,
  Activity,
  Database,
  UsersRound,
} from "lucide-react";
import { images } from "@/app/assets/images";
import { useCurrentLocation } from "@/app/hooks/useCurrentLocation";
import {
  isAtLimit,
  getRemainingSlots,
  PLAN_LABELS,
  getLimits,
} from "@/lib/plan-limits";
import type { TenantPlan } from "@/app/generated/prisma/client";

// ─────────────────────────────────────────────────────────────────
// COSTANTI
// ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/ricette", label: "Ricette", icon: ChefHat },
  { href: "/dashboard/menu", label: "Menu digitale", icon: QrCode },
  { href: "/dashboard/feed", label: "Feed", icon: Users },
  { href: "/dashboard/acquisti", label: "Acquisti", icon: ShoppingBasket },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Activity },
  { href: "/admin/ingredienti", label: "Ingredienti DB", icon: Database },
  { href: "/admin/utenti", label: "Utenti", icon: UsersRound },
];

// ─────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  plan: TenantPlan;
  userName: string;
  userImageUrl?: string;
  isVittlAdmin: boolean;
}

// ─────────────────────────────────────────────────────────────────
// LOCATION SWITCHER
// ─────────────────────────────────────────────────────────────────

function LocationSwitcher({ plan }: { plan: TenantPlan }) {
  const { locations, activeLocation, setActiveLocation } = useCurrentLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const limits = getLimits(plan);
  const limit = limits.locations;
  const remaining = getRemainingSlots(plan, "locations", locations.length);
  const canAddMore = !isAtLimit(plan, "locations", locations.length);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!activeLocation) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-2.75 py-2.5 rounded-2xl text-sm transition-colors hover:bg-gray-100"
      >
        <MapPin className="w-5 h-5 shrink-0 text-gray-400" strokeWidth={1.75} />
        <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 flex-1 text-left min-w-0">
          <span className="block text-xs font-medium text-gray-900 truncate leading-none">
            {activeLocation.name}
          </span>
          {activeLocation.city && (
            <span className="block text-xs text-gray-400 font-light truncate mt-0.5">
              {activeLocation.city}
            </span>
          )}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform duration-200
            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
            ${open ? "" : "rotate-180"}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="px-3 pt-3 pb-1.5 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sedi attive
            </p>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              {locations.length}/{limit === Infinity ? "∞" : limit}
              <span className="mx-1 text-gray-300">·</span>
              {PLAN_LABELS[plan]}
              {remaining !== "unlimited" && remaining > 0 && (
                <span className="ml-1 text-gray-300">
                  ({remaining} disponibil{remaining === 1 ? "e" : "i"})
                </span>
              )}
            </p>
          </div>

          <div className="py-1">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocation(loc);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin
                    className="w-3.5 h-3.5 text-gray-500"
                    strokeWidth={1.75}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate leading-none">
                    {loc.name}
                  </p>
                  {loc.city && (
                    <p className="text-xs text-gray-400 font-light truncate mt-0.5">
                      {loc.city}
                    </p>
                  )}
                </div>
                {activeLocation.id === loc.id && (
                  <Check
                    className="w-4 h-4 text-gray-900 shrink-0"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            ))}
          </div>

          {canAddMore ? (
            <Link
              href="/dashboard/impostazioni/sedi/nuova"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                <Plus className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
              </div>
              <span className="text-sm text-gray-500">Aggiungi sede</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/abbonamento"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 border-t border-gray-100 hover:bg-amber-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Zap
                  className="w-3.5 h-3.5 text-amber-500"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-amber-600 font-medium leading-none">
                  Limite raggiunto
                </p>
                <p className="text-xs text-gray-400 font-light mt-0.5">
                  Fai upgrade per più sedi
                </p>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// USER MENU DROPDOWN
// ─────────────────────────────────────────────────────────────────

interface UserMenuProps {
  userName: string;
  restaurantName: string;
  userImageUrl?: string;
  plan: TenantPlan;
  onClose: () => void; // chiude anche la sidebar su mobile
}

function UserMenuDropdown({
  userName,
  restaurantName,
  userImageUrl,
  plan,
  onClose,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openUserProfile, signOut } = useClerk();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({ redirectUrl: "/sign-in" });
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Trigger — user strip cliccabile */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-3 px-2.75 py-2 rounded-2xl
          transition-colors hover:bg-gray-100
          ${open ? "bg-gray-100" : ""}
        `}
      >
        {/* Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
          {userImageUrl ? (
            <Image
              src={userImageUrl}
              alt={userName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-gray-600">
              {initials}
            </span>
          )}
        </div>

        {/* Nome + ristorante */}
        <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 truncate leading-none">
            {userName}
          </p>
          <p className="text-xs text-gray-400 font-light mt-0.5 truncate">
            {restaurantName}
          </p>
        </div>

        {/* Chevron */}
        <ChevronRight
          className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform duration-200
            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
            ${open ? "rotate-90" : ""}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown — apre verso l'alto */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
          {/* Header identità */}
          <div className="px-3 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-400 font-light mt-0.5 truncate">
              {PLAN_LABELS[plan]}
            </p>
          </div>

          {/* Voci menu */}
          <div className="py-1">
            {/* Impostazioni app */}
            <Link
              href="/dashboard/impostazioni"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Settings
                  className="w-3.5 h-3.5 text-gray-500"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  Impostazioni
                </p>
                <p className="text-xs text-gray-400 font-light mt-0.5">
                  Ristorante, team, preferenze
                </p>
              </div>
            </Link>

            {/* Impostazioni account (Clerk) */}
            <button
              onClick={() => {
                setOpen(false);
                openUserProfile();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <UserCog
                  className="w-3.5 h-3.5 text-gray-500"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  Impostazioni account
                </p>
                <p className="text-xs text-gray-400 font-light mt-0.5">
                  Email, password, profilo
                </p>
              </div>
            </button>

            {/* Gestione abbonamento */}
            <Link
              href="/dashboard/abbonamento"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <CreditCard
                  className="w-3.5 h-3.5 text-gray-500"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  Gestione abbonamento
                </p>
                <p className="text-xs text-gray-400 font-light mt-0.5">
                  Limiti, upgrade, fatturazione
                </p>
              </div>
            </Link>
          </div>

          {/* Sign out — separato visivamente */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 transition-colors text-left group/logout"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-100 group-hover/logout:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
                <LogOut
                  className="w-3.5 h-3.5 text-gray-500 group-hover/logout:text-red-500 transition-colors"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-sm font-medium text-gray-500 group-hover/logout:text-red-600 transition-colors leading-none">
                Esci
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────

export default function Sidebar({
  isOpen,
  onClose,
  restaurantName,
  plan,
  userName,
  userImageUrl,
  isVittlAdmin,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
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
          <Link
            href="/dashboard"
            onClick={onClose}
            className="shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
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
          {isVittlAdmin && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="px-3 mb-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                Admin
              </p>
              {ADMIN_NAV_ITEMS.map((item) => {
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
                  ? "bg-violet-600 text-white"
                  : "text-violet-500 hover:bg-violet-50 hover:text-violet-700"
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
            </div>
          )}
        </nav>

        {/* ── Bottom ── */}
        <div className="px-2 pb-2 space-y-0.5 border-t border-gray-100 pt-3 shrink-0">
          {/* Upgrade — solo FREE */}
          {plan === "FREE" && (
            <Link
              href="/dashboard/abbonamento"
              title="Fai upgrade"
              onClick={onClose}
              className="flex items-center gap-3 px-2.75 py-2.5 rounded-2xl text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              <Zap className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                Fai upgrade
              </span>
            </Link>
          )}

          {/* Location Switcher */}
          <div className="border-t border-gray-100 pt-1.5">
            <LocationSwitcher plan={plan} />
          </div>

          {/* User Menu */}
          <div className="border-t border-gray-100 pt-1.5">
            <UserMenuDropdown
              userName={userName}
              restaurantName={restaurantName}
              userImageUrl={userImageUrl}
              plan={plan}
              onClose={onClose}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
