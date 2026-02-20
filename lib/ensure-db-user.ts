import "server-only";
import { prisma } from "@/lib/prisma";
import { StaffRole, TenantPlan } from "@/app/generated/prisma/client";

// ── Tipi espliciti (workaround Prisma 7 + Accelerate che droppano relations) ──
export type LocationSlim = {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
};

export type TenantWithLocations = {
  id: string;
  name: string;
  plan: TenantPlan;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  locations: LocationSlim[];
};

type DbUser = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  primaryTenantId: string | null;
  isVittlAdmin: boolean;
};

export type EnsureResult = {
  user: DbUser;
  tenant: TenantWithLocations;
};

const LOCATION_SELECT = {
  id: true,
  name: true,
  city: true,
  address: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
export async function ensureDbUserAndTenant(input: {
  clerkId: string;
  email: string;
  name?: string | null;
}): Promise<EnsureResult> {
  // ← return type esplicito: TS valida tutti i branch
  return (await prisma.$transaction(async (tx) => {
    // 1) Upsert user
    let user: DbUser;

    const byClerkId = (await tx.user.findUnique({
      where: { clerkId: input.clerkId },
    })) as unknown as DbUser;

    if (byClerkId) {
      // Caso normale: utente già sincronizzato, aggiorna dati
      user = (await tx.user.update({
        where: { id: byClerkId.id },
        data: { email: input.email, name: input.name ?? null },
      })) as unknown as DbUser;
    } else {
      const byEmail = (await tx.user.findUnique({
        where: { email: input.email },
      })) as unknown as DbUser;

      if (byEmail) {
        // Email esiste ma senza clerkId (es. creato prima del webhook)
        // → linka il clerkId all'utente esistente
        user = (await tx.user.update({
          where: { id: byEmail.id },
          data: { clerkId: input.clerkId, name: input.name ?? null },
        })) as unknown as DbUser;
      } else {
        // Primo accesso assoluto: crea utente
        user = (await tx.user.create({
          data: {
            clerkId: input.clerkId,
            email: input.email,
            name: input.name ?? null,
          },
        })) as unknown as DbUser;
      }
    }

    // 2) Ha già un tenant → sincronizza
    if (user.primaryTenantId) {
      const tenant = (await tx.tenant.findUnique({
        where: { id: user.primaryTenantId },
        include: {
          locations: {
            orderBy: { createdAt: "asc" },
            select: LOCATION_SELECT,
          },
        },
      })) as TenantWithLocations | null;

      // Tenant trovato correttamente
      if (tenant) {
        // Nessuna sede → creane una di default
        if (tenant.locations.length === 0) {
          const loc = (await tx.location.create({
            data: { tenantId: tenant.id, name: "Sede principale" },
            select: LOCATION_SELECT,
          })) as LocationSlim;

          return { user, tenant: { ...tenant, locations: [loc] } };
        }

        return { user, tenant };
      }

      // primaryTenantId punta a un tenant cancellato → ricrea sotto (non ritornare mai undefined)
    }

    // 3) Primo accesso (o tenant orfano): crea tenant + sede + membership OWNER
    const tenant = (await tx.tenant.create({
      data: {
        name: "Il mio ristorante",
        plan: TenantPlan.FREE,
        locations: {
          create: { name: "Sede principale" },
        },
      },
      include: {
        locations: {
          orderBy: { createdAt: "asc" },
          select: LOCATION_SELECT,
        },
      },
    })) as TenantWithLocations;

    const updatedUser = (await tx.user.update({
      where: { id: user.id },
      data: { primaryTenantId: tenant.id },
    })) as unknown as DbUser;

    await tx.staffMembership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        locationId: tenant.locations[0]?.id ?? null,
        role: StaffRole.OWNER,
      },
    });

    return {
      user: updatedUser,
      tenant,
    };
  })) as EnsureResult;
}
