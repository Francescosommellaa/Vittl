import { prisma } from "@/lib/prisma";
import IngredientiAdminClient from "./IngredientiAdminClient";

export default async function AdminIngredientiPage() {
  const ingredients = await prisma.ingredient.findMany({
    include: {
      prices: {
        orderBy: { validFrom: "desc" },
        take: 1,
      },
      allergens: true,
    },
    orderBy: { name: "asc" },
  });

  const serialized = ingredients.map((ing) => ({
    ...ing,
    prices: ing.prices.map((p) => ({
      ...p,
      price: Number(p.price),
      validFrom: p.validFrom.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
    createdAt: ing.createdAt.toISOString(),
    updatedAt: ing.updatedAt.toISOString(),
  }));

  return <IngredientiAdminClient initialIngredients={serialized} />;
}
