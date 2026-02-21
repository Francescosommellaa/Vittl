import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET env var");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

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
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // ─── user.created ───────────────────────────────────────────────────────────
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    // Idempotenza: se Clerk riprova, non crashare
    const existing = await prisma.user.findUnique({ where: { clerkId: id } });
    if (existing) return new Response("Already processed", { status: 200 });

    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || "Utente";
    const meta = unsafe_metadata as { restaurantName?: string; phone?: string };
    const restaurantName = meta.restaurantName || "Il mio ristorante";
    const phone = meta.phone || null;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { clerkId: id, email, name, phone },
      });
      const tenant = await tx.tenant.create({
        data: { name: restaurantName, plan: "FREE", currency: "EUR" },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { primaryTenantId: tenant.id },
      });
      const location = await tx.location.create({
        data: {
          tenantId: tenant.id,
          name: restaurantName,
          timezone: "Europe/Rome",
        },
      });
      await tx.staffMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          locationId: location.id,
          role: "OWNER",
        },
      });
    });
  }

  // ─── user.updated ───────────────────────────────────────────────────────────
  if (evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    const user = await prisma.user.findUnique({ where: { clerkId: id } });
    if (!user) return new Response("User not found", { status: 200 });

    const email = email_addresses[0]?.email_address;
    const name =
      [first_name, last_name].filter(Boolean).join(" ") ||
      user.name ||
      "Utente";
    const meta = unsafe_metadata as { restaurantName?: string; phone?: string };
    const restaurantName = meta.restaurantName;

    await prisma.$transaction(async (tx) => {
      // Aggiorna dati utente
      await tx.user.update({
        where: { clerkId: id },
        data: { name, email },
      });

      // Se il nome ristorante è cambiato, aggiorna il tenant
      if (restaurantName && user.primaryTenantId) {
        await tx.tenant.update({
          where: { id: user.primaryTenantId },
          data: { name: restaurantName },
        });
      }
    });
  }

  // ─── user.deleted ───────────────────────────────────────────────────────────
  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (!id) return new Response("Missing id", { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId: id } });
    if (!user) return new Response("Already deleted", { status: 200 });

    const tenantId = user.primaryTenantId;

    await prisma.$transaction(async (tx) => {
      // Pulisci dati utente
      await tx.recipeLike.deleteMany({ where: { userId: user.id } });
      await tx.recipeCopyLog.deleteMany({ where: { copiedByUserId: user.id } });
      await tx.staffMembership.deleteMany({ where: { userId: user.id } });
      await tx.user.update({
        where: { id: user.id },
        data: { primaryTenantId: null },
      });
      await tx.user.delete({ where: { id: user.id } });

      // Se era l'unico membro del tenant → elimina il workspace
      if (tenantId) {
        const remainingMembers = await tx.staffMembership.count({
          where: { tenantId },
        });
        if (remainingMembers === 0) {
          await tx.recipe.deleteMany({ where: { tenantId } });
          await tx.location.deleteMany({ where: { tenantId } });
          await tx.tenant.delete({ where: { id: tenantId } });
        }
      }
    });
  }

  return new Response("OK", { status: 200 });
}
