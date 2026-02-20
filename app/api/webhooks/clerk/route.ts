import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("[WEBHOOK] CLERK_WEBHOOK_SECRET is not set");
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

  // ✅ Leggi il body come testo RAW — non usare req.json() o la firma non corrisponde
  const body = await req.text();

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

  // ── user.created ────────────────────────────────────────────────────────────
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
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const name =
      [first_name, last_name].filter(Boolean).join(" ").trim() || null;
    const phone = (unsafe_metadata?.phone as string) || null;
    const restaurantName =
      (unsafe_metadata?.restaurantName as string)?.trim() ||
      "Il mio ristorante";

    console.log(
      `[WEBHOOK] user.created → ${email} | ristorante: ${restaurantName}`,
    );

    try {
      const existing = await prisma.user.findUnique({ where: { clerkId } });
      if (existing) {
        console.warn("[WEBHOOK] User already exists:", clerkId);
        return NextResponse.json({ received: true, skipped: true });
      }

      const tenant = await prisma.tenant.create({
        data: { name: restaurantName, plan: "FREE", currency: "EUR" },
      });

      const location = await prisma.location.create({
        data: {
          tenantId: tenant.id,
          name: restaurantName,
          country: "IT",
          timezone: "Europe/Rome",
        },
      });

      const user = await prisma.user.create({
        data: { clerkId, email, name, phone, primaryTenantId: tenant.id },
      });

      await prisma.staffMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          locationId: location.id,
          role: "OWNER",
        },
      });

      console.log(
        `[WEBHOOK] ✅ User ${user.id} | Tenant ${tenant.id} | Location ${location.id}`,
      );
    } catch (err) {
      console.error("[WEBHOOK] DB error:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  // ── user.deleted ────────────────────────────────────────────────────────────
  if (evt.type === "user.deleted") {
    const { id: clerkId } = evt.data;
    if (!clerkId) return NextResponse.json({ received: true });

    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) return NextResponse.json({ received: true });

      await prisma.staffMembership.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });

      console.log(`[WEBHOOK] ✅ Deleted user: ${user.id}`);
    } catch (err) {
      console.error("[WEBHOOK] DB error on delete:", err);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
