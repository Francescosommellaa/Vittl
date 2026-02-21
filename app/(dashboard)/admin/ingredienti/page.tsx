import { prisma } from "@/lib/prisma";
import type {
  Unit,
  IngredientCategory,
  AllergenEU,
} from "@/app/generated/prisma/client";
import IngredientiAdminClient from "./IngredientiAdminClient";

export default async function IngredientiAdminPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ingredients: any[] = await prisma.ingredient.findMany({
    orderBy: { name: "asc" },
    include: {
      prices: { orderBy: { validFrom: "desc" } },
      allergens: true,
    },
  });

  const serialized = ingredients.map((ing) => ({
    id: ing.id as string,
    name: ing.name as string,
    unit: ing.unit as Unit,
    category: ing.category as IngredientCategory,
    kcal: ing.kcal as number | null,
    proteins: ing.proteins as number | null,
    carbs: ing.carbs as number | null,
    sugars: ing.sugars as number | null,
    fats: ing.fats as number | null,
    saturatedFats: ing.saturatedFats as number | null,
    fiber: ing.fiber as number | null,
    salt: ing.salt as number | null,
    createdAt: (ing.createdAt as Date).toISOString(),
    updatedAt: (ing.updatedAt as Date).toISOString(),
    prices: (
      ing.prices as {
        id: string;
        price: unknown;
        validFrom: Date;
        createdAt: Date;
      }[]
    ).map((p) => ({
      id: p.id,
      price: Number(p.price),
      validFrom: p.validFrom.toISOString(),
    })),
    allergens: (ing.allergens as { id: string; allergen: AllergenEU }[]).map(
      (a) => ({
        id: a.id,
        allergen: a.allergen,
      }),
    ),
  }));

  return <IngredientiAdminClient initialIngredients={serialized} />;
}
