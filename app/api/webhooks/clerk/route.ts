import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET env var");
  }

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

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } =
      evt.data;

    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || "Utente";
    const meta = unsafe_metadata as {
      restaurantName?: string;
      phone?: string;
    };
    const restaurantName = meta.restaurantName || "Il mio ristorante";
    const phone = meta.phone || null;

    await prisma.$transaction(async (tx) => {
      // 1. Crea utente
      const user = await tx.user.create({
        data: { clerkId: id, email, name, phone },
      });

      // 2. Crea tenant (workspace)
      const tenant = await tx.tenant.create({
        data: { name: restaurantName, plan: "FREE", currency: "EUR" },
      });

      // 3. Collega utente al tenant
      await tx.user.update({
        where: { id: user.id },
        data: { primaryTenantId: tenant.id },
      });

      // 4. Crea sede di default
      const location = await tx.location.create({
        data: {
          tenantId: tenant.id,
          name: restaurantName,
          timezone: "Europe/Rome",
        },
      });

      // 5. Crea membership OWNER
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

  return new Response("OK", { status: 200 });
}
