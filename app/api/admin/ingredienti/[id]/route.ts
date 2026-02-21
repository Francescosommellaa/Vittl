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

// PATCH — aggiorna ingrediente (incluso aggiornamento prezzo)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    unit,
    category,
    newPrice, // se presente, crea un nuovo IngredientPrice
    allergens, // array di AllergenEU, se presente rimpiazza tutti
    kcal,
    proteins,
    carbs,
    sugars,
    fats,
    saturatedFats,
    fiber,
    salt,
  } = body;

  const ingredient = await prisma.ingredient.update({
    where: { id: params.id },
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
        ingredientId: params.id,
        validFrom: new Date(),
        price: newPrice,
      },
    });
  }

  // Aggiorna allergeni: rimpiazza tutto
  if (Array.isArray(allergens)) {
    await prisma.ingredientAllergen.deleteMany({
      where: { ingredientId: params.id },
    });
    if (allergens.length > 0) {
      await prisma.ingredientAllergen.createMany({
        data: allergens.map((a: string) => ({
          ingredientId: params.id,
          allergen: a,
        })),
      });
    }
  }

  const updated = await prisma.ingredient.findUnique({
    where: { id: params.id },
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
  { params }: { params: { id: string } },
) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Elimina cascata manuale (allergens, prices)
  await prisma.ingredientAllergen.deleteMany({
    where: { ingredientId: params.id },
  });
  await prisma.ingredientPrice.deleteMany({
    where: { ingredientId: params.id },
  });
  await prisma.ingredient.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
