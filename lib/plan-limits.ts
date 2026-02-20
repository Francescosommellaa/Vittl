import { TenantPlan } from "@/app/generated/prisma/client";

// ─────────────────────────────────────────────────────────────────
// TIPI
// ─────────────────────────────────────────────────────────────────

export type QrCustomOptions = {
  colors: boolean; // colore primario/sfondo
  pixelShape: boolean; // quadrati, arrotondati, circolari
  logo: boolean; // upload logo
  logoBackground: boolean; // sfondo logo bianco sì/no
};

export type PlanLimits = {
  // Quantitativi
  locations: number; // Infinity = illimitate
  users: number;
  recipesPerLocation: number;
  activeMenusPerLocation: number;

  // QR
  qr: {
    customizable: boolean;
    options: QrCustomOptions | null; // null se non personalizzabile
  };

  // UI
  watermark: boolean; // true = mostra "Powered by Vittl"

  // Features esclusive
  features: {
    unifiedDashboard: boolean; // food cost aggregato multi-sede
    activityLog: boolean; // chi ha cambiato cosa/quando
    monthlyReports: boolean; // report mensili automatici
    apiAccess: boolean; // ricette/menu via API
    customDomain: boolean; // dominio custom menu pubblico
    supplierIntegrations: boolean; // API ISMEA, POS, ecc.
  };

  // Supporto
  support: {
    type: "standard" | "priority" | "dedicated";
    slaHours: number | null; // null = SLA garantito custom
  };
};

// ─────────────────────────────────────────────────────────────────
// DATI PIANI
// ─────────────────────────────────────────────────────────────────

const QR_STANDARD: QrCustomOptions = {
  colors: true,
  pixelShape: true,
  logo: true,
  logoBackground: true,
};

export const PLAN_LIMITS: Record<TenantPlan, PlanLimits> = {
  FREE: {
    locations: 1,
    users: 1,
    recipesPerLocation: 100,
    activeMenusPerLocation: 4,
    qr: {
      customizable: false,
      options: null,
    },
    watermark: true,
    features: {
      unifiedDashboard: false,
      activityLog: false,
      monthlyReports: false,
      apiAccess: false,
      customDomain: false,
      supplierIntegrations: false,
    },
    support: {
      type: "standard",
      slaHours: 24,
    },
  },

  START: {
    locations: 1,
    users: 2,
    recipesPerLocation: 200,
    activeMenusPerLocation: 8,
    qr: {
      customizable: true,
      options: QR_STANDARD,
    },
    watermark: false,
    features: {
      unifiedDashboard: false,
      activityLog: false,
      monthlyReports: false,
      apiAccess: false,
      customDomain: false,
      supplierIntegrations: false,
    },
    support: {
      type: "standard",
      slaHours: 24,
    },
  },

  PRO: {
    locations: 2,
    users: 4,
    recipesPerLocation: 200, // 400 totali su 2 sedi
    activeMenusPerLocation: 8, // 16 totali su 2 sedi
    qr: {
      customizable: true,
      options: QR_STANDARD,
    },
    watermark: false,
    features: {
      unifiedDashboard: true,
      activityLog: true,
      monthlyReports: true,
      apiAccess: false,
      customDomain: false,
      supplierIntegrations: false,
    },
    support: {
      type: "priority",
      slaHours: 6,
    },
  },

  ENTERPRISE: {
    locations: Infinity,
    users: Infinity,
    recipesPerLocation: Infinity,
    activeMenusPerLocation: Infinity,
    qr: {
      customizable: true,
      options: QR_STANDARD,
    },
    watermark: false,
    features: {
      unifiedDashboard: true,
      activityLog: true,
      monthlyReports: true,
      apiAccess: true,
      customDomain: true,
      supplierIntegrations: true,
    },
    support: {
      type: "dedicated",
      slaHours: null, // SLA garantito custom
    },
  },
};

// ─────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────

/** Limiti completi del piano */
export function getLimits(plan: TenantPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

/** Feature booleana abilitata? */
export function canUseFeature(
  plan: TenantPlan,
  feature: keyof PlanLimits["features"],
): boolean {
  return PLAN_LIMITS[plan].features[feature];
}

/** Risorsa al limite? */
export function isAtLimit(
  plan: TenantPlan,
  resource:
    | "locations"
    | "users"
    | "recipesPerLocation"
    | "activeMenusPerLocation",
  currentCount: number,
): boolean {
  const limit = PLAN_LIMITS[plan][resource];
  return limit !== Infinity && currentCount >= (limit as number);
}

/** Slot rimanenti (o "unlimited") */
export function getRemainingSlots(
  plan: TenantPlan,
  resource:
    | "locations"
    | "users"
    | "recipesPerLocation"
    | "activeMenusPerLocation",
  currentCount: number,
): number | "unlimited" {
  const limit = PLAN_LIMITS[plan][resource];
  if (limit === Infinity) return "unlimited";
  return Math.max(0, (limit as number) - currentCount);
}

/** Totale risorse su tutte le sedi (es. ricette totali PRO = 400) */
export function getTotalLimit(
  plan: TenantPlan,
  resource: "recipesPerLocation" | "activeMenusPerLocation",
): number | "unlimited" {
  const limits = PLAN_LIMITS[plan];
  const perSede = limits[resource];
  const sedi = limits.locations;
  if (perSede === Infinity || sedi === Infinity) return "unlimited";
  return (perSede as number) * (sedi as number);
}

// ─────────────────────────────────────────────────────────────────
// LABEL UI
// ─────────────────────────────────────────────────────────────────

export const PLAN_LABELS: Record<TenantPlan, string> = {
  FREE: "Piano Free",
  START: "Piano Start",
  PRO: "Piano Pro",
  ENTERPRISE: "Enterprise",
};

export const PLAN_PRICES: Record<
  TenantPlan,
  { monthly: number | null; annual: number | null }
> = {
  FREE: { monthly: 0, annual: 0 },
  START: { monthly: 35, annual: 350 },
  PRO: { monthly: 100, annual: 1000 },
  ENTERPRISE: { monthly: null, annual: null }, // custom
};
