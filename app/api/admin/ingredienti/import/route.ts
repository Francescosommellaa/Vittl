import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  IngredientCategory,
  AllergenEU,
  Unit,
} from "@/app/generated/prisma/client";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { isVittlAdmin: true },
  });
  return user?.isVittlAdmin ? userId : null;
}

const VALID_CATEGORIES: IngredientCategory[] = [
  "FRUTTA",
  "VERDURA",
  "ORTAGGI",
  "CARNE",
  "SALUMI",
  "PESCE",
  "LATTICINI",
  "UOVA",
  "CEREALI",
  "LEGUMI",
  "SPEZIE",
  "CONDIMENTI",
  "CONSERVE",
  "BEVANDE",
  "DOLCI",
  "OLIO_GRASSI",
  "ALTRO",
];

const VALID_ALLERGENS: AllergenEU[] = [
  "CEREALS_GLUTEN",
  "CRUSTACEANS",
  "EGGS",
  "FISH",
  "PEANUTS",
  "SOYBEANS",
  "MILK",
  "NUTS",
  "CELERY",
  "MUSTARD",
  "SESAME",
  "SULPHITES",
  "LUPIN",
  "MOLLUSCS",
];

// Solo remap per valori che non esisteranno mai nell'enum
const ALLERGEN_REMAP: Record<string, AllergenEU> = {
  SULPHUR_DIOXIDE: "SULPHITES", // nome alternativo comune
  SULPHUR: "SULPHITES",
  GLUTEN: "CEREALS_GLUTEN", // abbreviazione comune
  TREE_NUTS: "NUTS",
};

export async function POST(req: NextRequest) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { ingredients } = body;

  if (!Array.isArray(ingredients)) {
    return NextResponse.json(
      {
        error: "Il JSON deve contenere un array 'ingredients' o 'ingredienti'",
      },
      { status: 400 },
    );
  }

  const results = { created: 0, updated: 0, errors: [] as string[] };

  for (const item of ingredients) {
    try {
      // Normalizza categoria — se non valida va in ALTRO (mai silenzioso: logga warning)
      const rawCategory = (item.category ?? "ALTRO").toUpperCase();
      let category: IngredientCategory = "ALTRO";
      if (VALID_CATEGORIES.includes(rawCategory as IngredientCategory)) {
        category = rawCategory as IngredientCategory;
      } else {
        results.errors.push(
          `"${item.name}" — categoria "${item.category}" non riconosciuta, impostata su ALTRO. Valori validi: ${VALID_CATEGORIES.join(", ")}`,
        );
      }

      // Normalizza unit
      const unit = (item.unit ?? "KILOGRAM") as Unit;

      // Normalizza allergeni — skippa invalidi con warning
      const rawAllergens: string[] = item.allergens ?? [];
      const allergens: AllergenEU[] = rawAllergens
        .map((a: string) => {
          const upper = a.toUpperCase();
          if (VALID_ALLERGENS.includes(upper as AllergenEU))
            return upper as AllergenEU;
          if (ALLERGEN_REMAP[upper]) return ALLERGEN_REMAP[upper];
          results.errors.push(
            `"${item.name}" — allergene "${a}" non riconosciuto e ignorato. Valori validi: ${VALID_ALLERGENS.join(", ")}`,
          );
          return null;
        })
        .filter(Boolean) as AllergenEU[];

      const existing = await prisma.ingredient.findUnique({
        where: { name: item.name },
      });

      if (existing) {
        await prisma.ingredient.update({
          where: { id: existing.id },
          data: {
            unit,
            category,
            kcal: item.kcal ?? null,
            proteins: item.proteins ?? null,
            carbs: item.carbs ?? null,
            sugars: item.sugars ?? null,
            fats: item.fats ?? null,
            saturatedFats: item.saturatedFats ?? null,
            fiber: item.fiber ?? null,
            salt: item.salt ?? null,
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
        await prisma.ingredient.create({
          data: {
            name: item.name,
            unit,
            category,
            kcal: item.kcal ?? null,
            proteins: item.proteins ?? null,
            carbs: item.carbs ?? null,
            sugars: item.sugars ?? null,
            fats: item.fats ?? null,
            saturatedFats: item.saturatedFats ?? null,
            fiber: item.fiber ?? null,
            salt: item.salt ?? null,
            prices:
              item.price != null
                ? { create: { validFrom: new Date(), price: item.price } }
                : undefined,
            allergens:
              allergens.length > 0
                ? { create: allergens.map((a) => ({ allergen: a })) }
                : undefined,
          },
        });
        results.created++;
      }
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("Unique constraint")) {
        results.errors.push(`"${item.name}" — duplicato, esiste già`);
      } else {
        results.errors.push(`"${item.name}" — ${msg}`);
      }
    }
  }

  return NextResponse.json(results);
}
