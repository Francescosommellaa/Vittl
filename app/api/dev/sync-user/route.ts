import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * syncUser
 * --------
 * Garantisce che l'utente Clerk esista nel DB Neon.
 * Chiamata ad ogni accesso alla dashboard come fallback al webhook.
 *
 * Crea in ordine (solo se mancanti):
 *  1. Tenant  (account/billing unit)
 *  2. Location (sede default — nome = nome ristorante)
 *  3. User con StaffMembership OWNER
 *
 * Se l'utente esiste già → noop, ritorna subito.
 * Idempotente: sicuro da chiamare ad ogni render del layout.
 */
export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Cerca l'utente nel DB
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      primaryTenant: {
        include: {
          locations: { orderBy: { createdAt: "asc" }, take: 1 },
        },
      },
    },
  });

  // Utente già sincronizzato → ritorna subito
  if (existing) return existing;

  // ── Nuovo utente: crea Tenant + Location + User ──────────────────────────

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
  const phone = (clerkUser.unsafeMetadata?.phone as string | undefined) ?? null;
  const restaurantName =
    (clerkUser.unsafeMetadata?.restaurantName as string | undefined) ||
    "Il mio ristorante";

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: restaurantName,
      plan: "FREE",
    },
  });

  // 2. Location default (stessa del nome ristorante)
  const location = await prisma.location.create({
    data: {
      tenantId: tenant.id,
      name: restaurantName,
      country: "IT",
      timezone: "Europe/Rome",
    },
  });

  // 3. User con memberships (Tenant + Location)
  const user = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      name,
      phone,
      primaryTenantId: tenant.id,
      staffMemberships: {
        create: [
          // Membership a livello Tenant
          { tenantId: tenant.id, role: "OWNER" },
          // Membership a livello Location
          { tenantId: tenant.id, locationId: location.id, role: "OWNER" },
        ],
      },
    },
    include: {
      primaryTenant: {
        include: {
          locations: { orderBy: { createdAt: "asc" }, take: 1 },
        },
      },
    },
  });

  console.log(
    `[syncUser] Nuovo utente creato: ${email} → Tenant: ${tenant.id} → Location: ${location.id}`,
  );

  return user;
}
