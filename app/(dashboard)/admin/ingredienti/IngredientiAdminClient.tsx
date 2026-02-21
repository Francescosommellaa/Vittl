"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Euro,
  ShoppingBasket,
  Database,
} from "lucide-react";

// ─── TIPI ───────────────────────────────────────────────────────

type AllergenEU =
  | "CEREALS_GLUTEN"
  | "CRUSTACEANS"
  | "EGGS"
  | "FISH"
  | "PEANUTS"
  | "SOYBEANS"
  | "MILK"
  | "NUTS"
  | "CELERY"
  | "MUSTARD"
  | "SESAME"
  | "SULPHITES"
  | "LUPIN"
  | "MOLLUSCS";

type Unit = "GRAM" | "KILOGRAM" | "MILLILITER" | "LITER" | "PIECE";

type IngredientCategory =
  | "FRUTTA"
  | "VERDURA"
  | "ORTAGGI"
  | "CARNE"
  | "PESCE"
  | "LATTICINI"
  | "CEREALI"
  | "LEGUMI"
  | "SPEZIE"
  | "CONDIMENTI"
  | "BEVANDE"
  | "ALTRO";

interface NutritionFacts {
  kcal?: number | null;
  proteins?: number | null;
  carbs?: number | null;
  sugars?: number | null;
  fats?: number | null;
  saturatedFats?: number | null;
  fiber?: number | null;
  salt?: number | null;
}

interface IngredientPrice {
  id: string;
  price: number;
  validFrom: string;
}

interface IngredientAllergen {
  id: string;
  allergen: AllergenEU;
}

interface Ingredient extends NutritionFacts {
  id: string;
  name: string;
  unit: Unit;
  category: IngredientCategory;
  prices: IngredientPrice[];
  allergens: IngredientAllergen[];
  createdAt: string;
  updatedAt: string;
}

// ─── COSTANTI ───────────────────────────────────────────────────

const UNIT_LABELS: Record<Unit, string> = {
  GRAM: "g",
  KILOGRAM: "kg",
  MILLILITER: "ml",
  LITER: "L",
  PIECE: "pz",
};

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  FRUTTA: "🍎 Frutta",
  VERDURA: "🥦 Verdura",
  ORTAGGI: "🧅 Ortaggi",
  CARNE: "🥩 Carne",
  PESCE: "🐟 Pesce",
  LATTICINI: "🧀 Latticini",
  CEREALI: "🌾 Cereali",
  LEGUMI: "🫘 Legumi",
  SPEZIE: "🌶️ Spezie",
  CONDIMENTI: "🫙 Condimenti",
  BEVANDE: "🧃 Bevande",
  ALTRO: "📦 Altro",
};

const ALLERGEN_LABELS: Record<AllergenEU, string> = {
  CEREALS_GLUTEN: "Glutine",
  CRUSTACEANS: "Crostacei",
  EGGS: "Uova",
  FISH: "Pesce",
  PEANUTS: "Arachidi",
  SOYBEANS: "Soia",
  MILK: "Latte",
  NUTS: "Frutta a guscio",
  CELERY: "Sedano",
  MUSTARD: "Senape",
  SESAME: "Sesamo",
  SULPHITES: "Solfiti",
  LUPIN: "Lupini",
  MOLLUSCS: "Molluschi",
};

const ALL_ALLERGENS = Object.keys(ALLERGEN_LABELS) as AllergenEU[];
const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as IngredientCategory[];
const ALL_UNITS: Unit[] = ["GRAM", "KILOGRAM", "MILLILITER", "LITER", "PIECE"];

// ─── EMPTY FORM ──────────────────────────────────────────────────

const emptyForm = (): Omit<
  Ingredient,
  "id" | "prices" | "allergens" | "createdAt" | "updatedAt"
> & {
  price: string;
  allergens: AllergenEU[];
} => ({
  name: "",
  unit: "KILOGRAM",
  category: "ALTRO",
  price: "",
  allergens: [],
  kcal: null,
  proteins: null,
  carbs: null,
  sugars: null,
  fats: null,
  saturatedFats: null,
  fiber: null,
  salt: null,
});

// ─── TOAST ───────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "warning" | "error";
  onClose: () => void;
}) {
  const colors = {
    success: "bg-white border-green-200 text-green-700",
    warning: "bg-white border-amber-200 text-amber-700",
    error: "bg-white border-red-200 text-red-700",
  };
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <AlertTriangle className="w-4 h-4 text-red-500" />,
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm ${colors[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────

function ConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
  danger = false,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-md p-6">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${danger ? "bg-red-50" : "bg-amber-50"}`}
        >
          <AlertTriangle
            className={`w-5 h-5 ${danger ? "text-red-500" : "text-amber-500"}`}
            strokeWidth={1.75}
          />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-400 font-light">{description}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-2xl text-sm font-medium text-white transition-colors ${danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK PRICE EDIT ─────────────────────────────────────────────

function QuickPriceCell({
  ingredient,
  onUpdated,
}: {
  ingredient: Ingredient;
  onUpdated: (id: string, newPrice: number) => void;
}) {
  const currentPrice = ingredient.prices[0]?.price;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentPrice?.toFixed(4) ?? "");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setValue(currentPrice?.toFixed(4) ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const handleSave = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) {
      setEditing(false);
      return;
    }
    if (parsed === currentPrice) {
      setEditing(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ingredienti/${ingredient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPrice: parsed }),
      });
      if (res.ok) {
        onUpdated(ingredient.id, parsed);
      }
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">€</span>
        <input
          ref={inputRef}
          type="number"
          step="0.0001"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-24 text-sm font-medium text-gray-900 border border-violet-300 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-200"
          disabled={loading}
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleEdit}
      className="flex items-center gap-1.5 group/price px-2 py-1 rounded-xl hover:bg-violet-50 transition-colors"
      title="Clicca per modificare il prezzo"
    >
      <span className="text-sm font-medium text-gray-900">
        {currentPrice != null ? (
          `€ ${currentPrice.toFixed(4)}`
        ) : (
          <span className="text-gray-300 italic text-xs">—</span>
        )}
      </span>
      <Pencil
        className="w-3 h-3 text-gray-300 group-hover/price:text-violet-500 transition-colors"
        strokeWidth={2}
      />
    </button>
  );
}

// ─── FORM MODAL ───────────────────────────────────────────────────

function IngredientFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Ingredient | null;
  onClose: () => void;
  onSaved: (ingredient: Ingredient) => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        name: initial.name,
        unit: initial.unit,
        category: initial.category,
        price: initial.prices[0]?.price?.toFixed(4) ?? "",
        allergens: initial.allergens.map((a) => a.allergen),
        kcal: initial.kcal ?? null,
        proteins: initial.proteins ?? null,
        carbs: initial.carbs ?? null,
        sugars: initial.sugars ?? null,
        fats: initial.fats ?? null,
        saturatedFats: initial.saturatedFats ?? null,
        fiber: initial.fiber ?? null,
        salt: initial.salt ?? null,
      };
    }
    return emptyForm();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionOpen, setNutritionOpen] = useState(!!initial?.kcal);

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleAllergen = (a: AllergenEU) => {
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a)
        ? f.allergens.filter((x) => x !== a)
        : [...f.allergens, a],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      unit: form.unit,
      category: form.category,
      ...(form.price !== "" && {
        [isEdit ? "newPrice" : "price"]: parseFloat(form.price),
      }),
      allergens: form.allergens,
      kcal: form.kcal,
      proteins: form.proteins,
      carbs: form.carbs,
      sugars: form.sugars,
      fats: form.fats,
      saturatedFats: form.saturatedFats,
      fiber: form.fiber,
      salt: form.salt,
    };

    try {
      const url = isEdit
        ? `/api/admin/ingredienti/${initial!.id}`
        : "/api/admin/ingredienti";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Errore sconosciuto");
        return;
      }
      const saved = await res.json();
      onSaved({
        ...saved,
        prices:
          saved.prices?.map(
            (p: {
              price: unknown;
              validFrom: unknown;
              createdAt: unknown;
            }) => ({
              ...p,
              price: Number(p.price),
              validFrom:
                typeof p.validFrom === "string"
                  ? p.validFrom
                  : new Date(p.validFrom as string).toISOString(),
              createdAt:
                typeof p.createdAt === "string"
                  ? p.createdAt
                  : new Date(p.createdAt as string).toISOString(),
            }),
          ) ?? [],
      });
    } catch {
      setError("Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  const numField = (key: keyof NutritionFacts, label: string, unit: string) => (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.1"
          value={form[key] ?? ""}
          onChange={(e) =>
            set(key, e.target.value === "" ? null : parseFloat(e.target.value))
          }
          placeholder="—"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {isEdit ? "Modifica ingrediente" : "Nuovo ingrediente"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit
                ? `Aggiorna i dati di ${initial!.name}`
                : "Aggiungi un ingrediente al database globale"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Nome *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="es. Pomodoro San Marzano"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
            />
          </div>

          {/* Categoria + Unità + Prezzo */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Categoria *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) =>
                  set("category", e.target.value as IngredientCategory)
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Unità *
              </label>
              <select
                required
                value={form.unit}
                onChange={(e) => set("unit", e.target.value as Unit)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white"
              >
                {ALL_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {isEdit ? "Nuovo prezzo (€)" : "Prezzo (€)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.0000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
              />
            </div>
          </div>

          {/* Allergeni */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Allergeni EU
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ALLERGENS.map((a) => {
                const selected = form.allergens.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selected
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {ALLERGEN_LABELS[a]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabella Nutrizionale — collapsible */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setNutritionOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" strokeWidth={1.75} />
                <span className="text-xs font-semibold text-gray-700">
                  Tabella nutrizionale
                </span>
                <span className="text-xs text-gray-400 font-light">
                  per 100g / 100ml
                </span>
              </div>
              {nutritionOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {nutritionOpen && (
              <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-3 border-t border-gray-50">
                {numField("kcal", "Calorie", "kcal")}
                {numField("proteins", "Proteine", "g")}
                {numField("carbs", "Carboidrati", "g")}
                {numField("sugars", "di cui Zuccheri", "g")}
                {numField("fats", "Grassi", "g")}
                {numField("saturatedFats", "di cui Saturi", "g")}
                {numField("fiber", "Fibre", "g")}
                {numField("salt", "Sale", "g")}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Salvataggio..."
                : isEdit
                  ? "Salva modifiche"
                  : "Crea ingrediente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN CLIENT ──────────────────────────────────────────────────

export default function IngredientiAdminClient({
  initialIngredients,
}: {
  initialIngredients: Ingredient[];
}) {
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    IngredientCategory | "ALL"
  >("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Ingredient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warning" | "error";
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (
    message: string,
    type: "success" | "warning" | "error",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = ingredients.filter((ing) => {
    const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      filterCategory === "ALL" || ing.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleSaved = (saved: Ingredient) => {
    setIngredients((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next.sort((a, b) => a.name.localeCompare(b.name));
      }
      return [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
    });
    setModalOpen(false);
    setEditTarget(null);
    showToast(
      editTarget ? `"${saved.name}" aggiornato` : `"${saved.name}" creato`,
      "success",
    );
  };

  const handlePriceUpdated = (id: string, newPrice: number) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? {
              ...ing,
              prices: [
                {
                  id: `temp-${Date.now()}`,
                  price: newPrice,
                  validFrom: new Date().toISOString(),
                },
                ...ing.prices,
              ],
            }
          : ing,
      ),
    );
    const name = ingredients.find((i) => i.id === id)?.name;
    showToast(
      `Prezzo di "${name}" aggiornato a € ${newPrice.toFixed(4)}`,
      "warning",
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/ingredienti/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIngredients((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        showToast(`"${deleteTarget.name}" eliminato`, "warning");
      } else {
        showToast("Errore durante l'eliminazione", "error");
      }
    } catch {
      showToast("Errore di rete", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDownloadExample = () => {
    const link = document.createElement("a");
    link.href = "/ingredienti-example.json";
    link.download = "ingredienti-example.json";
    link.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const list = json.ingredients ?? json.ingredienti ?? json;
      if (!Array.isArray(list)) throw new Error("Formato non valido");

      const res = await fetch("/api/admin/ingredienti/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: list }),
      });
      const result = await res.json();

      if (result.errors?.length) {
        showToast(
          `Importati con ${result.errors.length} errori. Creati: ${result.created}, Aggiornati: ${result.updated}`,
          "warning",
        );
      } else {
        showToast(
          `Importazione completata. Creati: ${result.created}, Aggiornati: ${result.updated}`,
          "success",
        );
      }

      // Ricarica la pagina per aggiornare la lista
      window.location.reload();
    } catch (err) {
      showToast(`Errore nel file: ${(err as Error).message}`, "error");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Database
                  className="w-4 h-4 text-violet-500"
                  strokeWidth={1.75}
                />
              </div>
              <h1 className="text-sm font-semibold text-gray-900">
                Database Ingredienti
              </h1>
            </div>
            <p className="text-xs text-gray-400 font-light ml-10">
              {ingredients.length} ingredienti globali · aggiornamento prezzi
              settimanale
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadExample}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
              Esempio JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
              Importa JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <button
              onClick={() => {
                setEditTarget(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Nuovo ingrediente
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
              strokeWidth={1.75}
            />
            <input
              type="text"
              placeholder="Cerca ingrediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as IngredientCategory | "ALL")
            }
            className="border border-gray-200 rounded-2xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 bg-white"
          >
            <option value="ALL">Tutte le categorie</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <ShoppingBasket
                  className="w-6 h-6 text-gray-300"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {search || filterCategory !== "ALL"
                  ? "Nessun risultato"
                  : "Nessun ingrediente ancora"}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {search || filterCategory !== "ALL"
                  ? "Prova con altri filtri"
                  : "Crea il primo ingrediente globale"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Unità
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Euro className="w-3 h-3" strokeWidth={2} />
                        Prezzo
                        <span className="text-gray-300 font-light normal-case tracking-normal">
                          · click per modificare
                        </span>
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Allergeni
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Kcal
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((ing) => (
                    <tr
                      key={ing.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900">
                          {ing.name}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {CATEGORY_LABELS[ing.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium text-gray-500">
                          {UNIT_LABELS[ing.unit]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <QuickPriceCell
                          ingredient={ing}
                          onUpdated={handlePriceUpdated}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        {ing.allergens.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-48">
                            {ing.allergens.map((a) => (
                              <span
                                key={a.id}
                                className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full"
                              >
                                {ALLERGEN_LABELS[a.allergen]}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500">
                          {ing.kcal != null ? (
                            `${ing.kcal} kcal`
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditTarget(ing);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded-xl hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors"
                            title="Modifica"
                          >
                            <Pencil
                              className="w-3.5 h-3.5"
                              strokeWidth={1.75}
                            />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ing)}
                            className="p-1.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Elimina"
                          >
                            <Trash2
                              className="w-3.5 h-3.5"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals & Toast ── */}
      {(modalOpen || editTarget) && (
        <IngredientFormModal
          initial={editTarget}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          danger
          title={`Elimina "${deleteTarget.name}"?`}
          description="L'ingrediente verrà rimosso dal database globale. Le ricette che lo usano potrebbero essere impattate. Questa azione non è reversibile."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
