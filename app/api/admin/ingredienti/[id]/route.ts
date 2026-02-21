import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AllergenEU } from "@/app/generated/prisma/client";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isVittlAdmin: true },
  });
  return user?.isVittlAdmin ? userId : null;
}

// PATCH — aggiorna ingrediente
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json();
  const {
    name,
    unit,
    category,
    newPrice,
    allergens,
    kcal,
    proteins,
    carbs,
    sugars,
    fats,
    saturatedFats,
    fiber,
    salt,
  } = body;

  await prisma.ingredient.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(unit && { unit }),
      ...(category && { category }),
      ...(kcal !== undefined && { kcal }),
      ...(proteins !== undefined && { proteins }),
      ...(carbs !== undefined && { carbs }),
      ...(sugars !== undefined && { sugars }),
      ...(fats !== undefined && { fats }),
      ...(saturatedFats !== undefined && { saturatedFats }),
      ...(fiber !== undefined && { fiber }),
      ...(salt !== undefined && { salt }),
    },
  });

  // Aggiorna prezzo: crea nuova entry storica
  if (newPrice != null) {
    await prisma.ingredientPrice.create({
      data: {
        ingredientId: id,
        validFrom: new Date(),
        price: newPrice,
      },
    });
  }

  // Aggiorna allergeni: rimpiazza tutto
  if (Array.isArray(allergens)) {
    await prisma.ingredientAllergen.deleteMany({
      where: { ingredientId: id },
    });
    if (allergens.length > 0) {
      await prisma.ingredientAllergen.createMany({
        data: allergens.map((a: string) => ({
          ingredientId: id,
          allergen: a as AllergenEU,
        })),
      });
    }
  }

  const updated = await prisma.ingredient.findUnique({
    where: { id },
    include: {
      prices: { orderBy: { validFrom: "desc" }, take: 1 },
      allergens: true,
    },
  });

  return NextResponse.json(updated);
}

// DELETE — elimina ingrediente
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.ingredientAllergen.deleteMany({ where: { ingredientId: id } });
  await prisma.ingredientPrice.deleteMany({ where: { ingredientId: id } });
  await prisma.ingredient.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
