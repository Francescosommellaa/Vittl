// GET — lista tutti gli ingredienti
export async function GET() {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  return NextResponse.json(ingredients);
}

// POST — crea nuovo ingrediente
export async function POST(req: NextRequest) {
  const adminId = await checkAdmin();
  if (!adminId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    unit,
    category,
    price,
    allergens = [],
    kcal,
    proteins,
    carbs,
    sugars,
    fats,
    saturatedFats,
    fiber,
    salt,
  } = body;

  if (!name || !unit || !category) {
    return NextResponse.json(
      { error: "name, unit e category sono obbligatori" },
      { status: 400 },
    );
  }

  // Controlla duplicati
  const existing = await prisma.ingredient.findUnique({ where: { name } });
  if (existing) {
    return NextResponse.json(
      { error: `Esiste già un ingrediente chiamato "${name}"` },
      { status: 409 },
    );
  }

  const ingredient = await prisma.ingredient.create({
    data: {
      name,
      unit,
      category,
      kcal,
      proteins,
      carbs,
      sugars,
      fats,
      saturatedFats,
      fiber,
      salt,
      prices:
        price != null
          ? {
              create: { validFrom: new Date(), price },
            }
          : undefined,
      allergens:
        allergens.length > 0
          ? {
              create: allergens.map((a: string) => ({ allergen: a })),
            }
          : undefined,
    },
    include: { prices: true, allergens: true },
  });

  return NextResponse.json(ingredient, { status: 201 });
}
