import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing CLERK_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      unsafe_metadata,
    } = evt.data;

    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;
    const phone = (unsafe_metadata?.phone as string) || null;
    const restaurantName =
      (unsafe_metadata?.restaurantName as string) || "Il mio ristorante";

    try {
      // Crea Tenant (ristorante) + User in una transazione
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const tenant = await tx.tenant.create({
          data: { name: restaurantName, plan: "FREE" },
        });

        await tx.user.create({
          data: {
            clerkId,
            email,
            name,
            phone,
            primaryTenantId: tenant.id,
            staffMemberships: {
              create: { tenantId: tenant.id, role: "OWNER" },
            },
          },
        });
      });
    } catch (err) {
      console.error("[WEBHOOK] Error creating user in DB:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  if (evt.type === "user.deleted") {
    const { id: clerkId } = evt.data;
    // Soft delete o eliminazione — a te la scelta
    // Per ora logghiamo solo
    console.log(`[WEBHOOK] User deleted: ${clerkId}`);
  }

  return NextResponse.json({ received: true });
}
