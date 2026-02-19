import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // ── 1. Secret check ─────────────────────────────────────────────────────────
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("[WEBHOOK] CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Missing CLERK_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  // ── 2. Svix headers ─────────────────────────────────────────────────────────
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("[WEBHOOK] Missing svix headers");
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  // ── 3. Verify signature ─────────────────────────────────────────────────────
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── 4. user.created ─────────────────────────────────────────────────────────
  if (evt.type === "user.created") {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      unsafe_metadata,
    } = evt.data;

    const email = email_addresses[0]?.email_address;
    if (!email) {
      console.error(
        "[WEBHOOK] user.created — missing email for clerkId:",
        clerkId,
      );
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const name =
      [first_name, last_name].filter(Boolean).join(" ").trim() || null;
    const phone = (unsafe_metadata?.phone as string) || null;
    const restaurantName =
      (unsafe_metadata?.restaurantName as string)?.trim() ||
      "Il mio ristorante";

    console.log(
      `[WEBHOOK] user.created → clerkId: ${clerkId}, email: ${email}, ristorante: ${restaurantName}`,
    );

    try {
      // Verifica che l'utente non esista già (idempotenza)
      const existing = await prisma.user.findUnique({ where: { clerkId } });
      if (existing) {
        console.warn("[WEBHOOK] User already exists, skipping:", clerkId);
        return NextResponse.json({ received: true, skipped: true });
      }

      // 1. Crea Tenant
      const tenant = await prisma.tenant.create({
        data: {
          name: restaurantName,
          plan: "FREE",
          currency: "EUR",
        },
      });

      // 2. Crea Location di default (la prima sede del ristorante)
      //    Necessaria per menu, ricette e ingredienti — senza di essa la dashboard non funziona
      const location = await prisma.location.create({
        data: {
          tenantId: tenant.id,
          name: restaurantName, // stessa nome del tenant come default
          country: "IT",
          timezone: "Europe/Rome",
        },
      });

      // 3. Crea User con primaryTenant
      const user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          phone,
          primaryTenantId: tenant.id,
        },
      });

      // 4. Crea StaffMembership come OWNER del tenant + della location
      await prisma.staffMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          locationId: location.id,
          role: "OWNER",
        },
      });

      console.log(
        `[WEBHOOK] ✅ Created: User ${user.id} | Tenant ${tenant.id} | Location ${location.id}`,
      );
    } catch (err) {
      console.error("[WEBHOOK] DB error on user.created:", err);
      // Restituiamo 500 → Clerk ritenterà automaticamente fino a 5 volte
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // ── 5. user.deleted ─────────────────────────────────────────────────────────
  if (evt.type === "user.deleted") {
    const { id: clerkId } = evt.data;
    if (!clerkId) return NextResponse.json({ received: true });

    console.log(`[WEBHOOK] user.deleted → clerkId: ${clerkId}`);

    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        console.warn("[WEBHOOK] user.deleted — user not found in DB:", clerkId);
        return NextResponse.json({ received: true });
      }

      // Elimina memberships e poi user (il tenant rimane per sicurezza dati)
      await prisma.staffMembership.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });

      console.log(`[WEBHOOK] ✅ Deleted user: ${user.id}`);
    } catch (err) {
      console.error("[WEBHOOK] DB error on user.deleted:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// force no-cache — necessario per evitare che Vercel Edge cachi il route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
