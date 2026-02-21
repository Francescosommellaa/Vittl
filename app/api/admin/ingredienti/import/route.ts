import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isVittlAdmin: true },
  });
  return user?.isVittlAdmin ? userId : null;
}

export async function POST(req: NextRequest) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ingredients } = body;

  if (!Array.isArray(ingredients)) {
    return NextResponse.json(
      { error: "Il JSON deve contenere un array 'ingredients'" },
      { status: 400 },
    );
  }

  const results = { created: 0, updated: 0, errors: [] as string[] };

  for (const item of ingredients) {
    try {
      const existing = await prisma.ingredient.findFirst({
        where: { name: item.name, isGlobal: true },
      });

      if (existing) {
        // Update
        await prisma.ingredient.update({
          where: { id: existing.id },
          data: {
            unit: item.unit ?? existing.unit,
            category: item.category ?? existing.category,
            kcal: item.kcal,
            proteins: item.proteins,
            carbs: item.carbs,
            sugars: item.sugars,
            fats: item.fats,
            saturatedFats: item.saturatedFats,
            fiber: item.fiber,
            salt: item.salt,
          },
        });
        if (item.price != null) {
          await prisma.ingredientPrice.create({
            data: {
              ingredientId: existing.id,
              validFrom: new Date(),
              price: item.price,
            },
          });
        }
        results.updated++;
      } else {
        // Create
        await prisma.ingredient.create({
          data: {
            name: item.name,
            unit: item.unit,
            category: item.category ?? "ALTRO",
            isGlobal: true,
            kcal: item.kcal,
            proteins: item.proteins,
            carbs: item.carbs,
            sugars: item.sugars,
            fats: item.fats,
            saturatedFats: item.saturatedFats,
            fiber: item.fiber,
            salt: item.salt,
            prices:
              item.price != null
                ? { create: { validFrom: new Date(), price: item.price } }
                : undefined,
            allergens:
              item.allergens?.length > 0
                ? {
                    create: item.allergens.map((a: string) => ({
                      allergen: a,
                    })),
                  }
                : undefined,
          },
        });
        results.created++;
      }
    } catch (e) {
      results.errors.push(`Errore su "${item.name}": ${(e as Error).message}`);
    }
  }

  return NextResponse.json(results);
}
