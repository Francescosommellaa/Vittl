/**
 * API TEMPORANEA — Sync manuale utente Clerk → DB
 * CANCELLARE dopo l'uso
 *
 * GET https://vittl.it/api/dev/sync-user?clerkId=user_39tXNkxKnt7EsWYMhWpny7Nu0Te&secret=vittl_dev_2026
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEV_SECRET = "vittl_dev_2026";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const clerkId = searchParams.get("clerkId");

  if (secret !== DEV_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!clerkId) {
    return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
  }

  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  if (!CLERK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing CLERK_SECRET_KEY" },
      { status: 500 },
    );
  }

  const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
  });
  if (!clerkRes.ok) {
    return NextResponse.json(
      { error: "Clerk user not found" },
      { status: 404 },
    );
  }

  const cu = await clerkRes.json();
  const email = cu.email_addresses[0]?.email_address as string | undefined;
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) {
    return NextResponse.json({
      ok: true,
      message: "User already in DB",
      userId: existing.id,
    });
  }

  const name =
    [cu.first_name as string, cu.last_name as string]
      .filter(Boolean)
      .join(" ")
      .trim() || null;
  const phone = (cu.unsafe_metadata?.phone as string) || null;
  const restaurantName =
    (cu.unsafe_metadata?.restaurantName as string)?.trim() ||
    "Il mio ristorante";

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

  return NextResponse.json({
    ok: true,
    message: "Utente sincronizzato con successo",
    user: { id: user.id, email, name },
    tenant: { id: tenant.id, name: restaurantName },
    location: { id: location.id },
  });
}
