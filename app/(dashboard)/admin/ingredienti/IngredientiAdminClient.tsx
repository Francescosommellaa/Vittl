"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Upload,
  Download,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  Plus,
  Database,
  ArrowRight,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Euro,
} from "lucide-react";
import type { IngredientCategory, AllergenEU, Unit } from "@/lib/types";

// ─── TIPI ─────────────────────────────────────────────────────────────────────

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

interface IngredientAllergenItem {
  id: string;
  allergen: AllergenEU;
}

interface Ingredient extends NutritionFacts {
  id: string;
  name: string;
  unit: Unit;
  category: IngredientCategory;
  prices: IngredientPrice[];
  allergens: IngredientAllergenItem[];
  createdAt: string;
  updatedAt: string;
}

interface JSONIngredient extends NutritionFacts {
  name: string;
  unit?: string;
  category?: string;
  price?: number;
  allergens?: string[];
}

type PreviewStatus = "new" | "update" | "similar";

interface PreviewItem {
  raw: JSONIngredient;
  status: PreviewStatus;
  existingId?: string;
  existingName?: string;
  similarId?: string;
  similarName?: string;
  similarResolution: "create" | "merge";
  warningDismissed: boolean;
}

// ─── COSTANTI ─────────────────────────────────────────────────────────────────

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
  SALUMI: "🥓 Salumi",
  PESCE: "🐟 Pesce",
  LATTICINI: "🧀 Latticini",
  UOVA: "🥚 Uova",
  CEREALI: "🌾 Cereali",
  LEGUMI: "🫘 Legumi",
  SPEZIE: "🌶️ Spezie",
  CONDIMENTI: "🫙 Condimenti",
  CONSERVE: "🥫 Conserve",
  BEVANDE: "🧃 Bevande",
  DOLCI: "🍬 Dolci",
  OLIO_GRASSI: "🫒 Oli e Grassi",
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function toTitleCase(val: string): string {
  return val.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
}

function findExact(name: string, list: Ingredient[]): Ingredient | null {
  const lower = name.toLowerCase().trim();
  return list.find((i) => i.name.toLowerCase().trim() === lower) ?? null;
}

function findSimilar(name: string, list: Ingredient[]): Ingredient | null {
  const lower = name.toLowerCase().trim();
  let best: Ingredient | null = null;
  let bestDist = Infinity;
  for (const ing of list) {
    const ingLower = ing.name.toLowerCase().trim();
    if (ingLower === lower) return null;
    const dist = levenshtein(lower, ingLower);
    const threshold = Math.max(
      2,
      Math.floor(Math.min(lower.length, ingLower.length) * 0.35),
    );
    if (dist <= threshold && dist < bestDist) {
      bestDist = dist;
      best = ing;
    }
  }
  return best;
}

const emptyForm = (name = "") => ({
  name,
  unit: "KILOGRAM" as Unit,
  category: "ALTRO" as IngredientCategory,
  price: "",
  allergens: [] as AllergenEU[],
  kcal: null as number | null,
  proteins: null as number | null,
  carbs: null as number | null,
  sugars: null as number | null,
  fats: null as number | null,
  saturatedFats: null as number | null,
  fiber: null as number | null,
  salt: null as number | null,
});

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "warning" | "error";
  onClose: () => void;
}) {
  const styles = {
    success: "border-l-green-400",
    warning: "border-l-amber-400",
    error: "border-l-red-400",
  };
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />,
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-l-4 shadow-xl max-w-sm ${styles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-gray-800 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-gray-500 transition-colors ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────

function ConfirmModal({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col gap-5 px-8 py-8">
        {/* Testo */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>

        {/* Bottoni */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-gray-200 hover:bg-gray-400 text-sm font-semibold text-gray-800 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-red-400 hover:bg-red-800 text-sm font-bold text-white transition-colors"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK PRICE CELL ─────────────────────────────────────────────────────────

function QuickPriceCell({
  ingredient,
  onUpdated,
}: {
  ingredient: Ingredient;
  onUpdated: (id: string, newPrice: number) => void;
}) {
  const currentPrice = ingredient.prices[0]?.price;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setValue(currentPrice != null ? Number(currentPrice).toFixed(2) : "");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const handleSave = async () => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) {
      setEditing(false);
      return;
    }
    if (parsed === Number(currentPrice)) {
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
      if (res.ok) onUpdated(ingredient.id, parsed);
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
        <Euro className="w-3 h-3 text-gray-400" strokeWidth={2} />
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
          className="w-20 text-sm font-semibold text-gray-900 bg-transparent outline-none tabular-nums"
          disabled={loading}
          autoFocus
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleEdit}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group/price"
      title="Clicca per modificare il prezzo"
    >
      <span className="text-sm font-semibold text-gray-900 tabular-nums">
        {currentPrice != null ? (
          `€ ${Number(currentPrice).toFixed(2)}`
        ) : (
          <span className="text-gray-300 text-xs font-normal italic">
            — prezzo
          </span>
        )}
      </span>
      <Pencil
        className="w-3 h-3 text-gray-300 group-hover/price:text-gray-600 transition-colors"
        strokeWidth={2.5}
      />
    </button>
  );
}

function normalizePrice(value: string): number | null {
  if (!value || value.trim() === "") return null;
  // sostituisce virgola con punto, rimuove spazi
  const normalized = value.trim().replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}

// ─── INGREDIENT FORM MODAL ────────────────────────────────────────────────────
function IngredientFormModal({
  initial,
  initialName,
  onClose,
  onSaved,
}: {
  initial?: Ingredient | null;
  initialName?: string;
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
        price:
          initial.prices[0]?.price != null
            ? String(Number(initial.prices[0].price).toFixed(4))
            : "",
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
    return emptyForm(initialName ?? "");
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionOpen, setNutritionOpen] = useState(!!initial?.kcal);

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleAllergen = (a: AllergenEU) =>
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a)
        ? f.allergens.filter((x) => x !== a)
        : [...f.allergens, a],
    }));

  const numField = (val: number | null) => (val != null ? String(val) : "");
  const parseNum = (s: string) => (s === "" ? null : parseFloat(s));
  const priceValue = normalizePrice(form.price);
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Il nome è obbligatorio");
      return;
    }
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      unit: form.unit,
      category: form.category,
      ...(priceValue !== null && {
        [isEdit ? "newPrice" : "price"]: priceValue,
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
      const res = await fetch(
        isEdit
          ? `/api/admin/ingredienti/${initial!.id}`
          : "/api/admin/ingredienti",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Errore sconosciuto");
        return;
      }
      onSaved(await res.json());
    } catch {
      setError("Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              {isEdit ? "Modifica" : "Nuovo"}
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEdit ? initial!.name : "Ingrediente"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 pb-2 space-y-5"
        >
          {/* Nome */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", toTitleCase(e.target.value))}
              placeholder="es. Pomodoro San Marzano"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-gray-400 transition-all"
            />
          </div>

          {/* Categoria + Unità */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
                Categoria *
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400 transition-all appearance-none"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
                Unità *
              </label>
              <select
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400 transition-all appearance-none"
              >
                {ALL_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {UNIT_LABELS[u]} — {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prezzo */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
              Prezzo per unità (€)
              {isEdit && (
                <span className="normal-case font-normal ml-1 text-gray-300">
                  · aggiunge voce storica
                </span>
              )}
            </label>
            <div className="flex items-center gap-2 px-4 border border-gray-200 bg-gray-50 rounded-2xl focus-within:bg-white focus-within:border-gray-400 transition-all">
              <span className="text-sm font-semibold text-gray-400 shrink-0 select-none">
                €
              </span>
              <input
                type="number"
                step="0.05"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className="flex-1 py-3 bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Allergeni */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">
              Allergeni EU
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_ALLERGENS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergen(a)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    form.allergens.includes(a)
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {ALLERGEN_LABELS[a]}
                </button>
              ))}
            </div>
          </div>

          {/* Tabella nutrizionale collapsible */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setNutritionOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:bg-gray-50 transition-colors"
            >
              <span>Tabella nutrizionale · per 100g / 100ml</span>
              {nutritionOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {nutritionOpen && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-3 bg-gray-50 border-t border-gray-100 pt-4">
                {(
                  [
                    ["kcal", "Kcal"],
                    ["proteins", "Proteine (g)"],
                    ["carbs", "Carboidrati (g)"],
                    ["sugars", "di cui zuccheri (g)"],
                    ["fats", "Grassi (g)"],
                    ["saturatedFats", "di cui saturi (g)"],
                    ["fiber", "Fibre (g)"],
                    ["salt", "Sale (g)"],
                  ] as [keyof typeof form, string][]
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                      {label}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={numField(form[key] as number | null)}
                      onChange={(e) => set(key, parseNum(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-all"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-5 shrink-0">
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Salvataggio...
              </>
            ) : isEdit ? (
              "Salva modifiche"
            ) : (
              "Crea ingrediente"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SMART SEARCH BAR ─────────────────────────────────────────────────────────

function SmartSearchBar({
  ingredients,
  onSelect,
  onCreateNew,
}: {
  ingredients: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  onCreateNew: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    query.trim().length >= 1
      ? ingredients
          .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 7)
      : [];

  const hasExactMatch = filtered.some(
    (i) => i.name.toLowerCase() === query.toLowerCase().trim(),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className={`bg-white rounded-2xl border transition-all duration-150 overflow-visible ${
          open && query
            ? "border-gray-300 shadow-lg shadow-black/5"
            : "border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <Search className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cerca o crea un ingrediente..."
            value={query}
            onChange={(e) => {
              setQuery(toTitleCase(e.target.value));
              setOpen(true);
            }}
            className="flex-1 text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors shrink-0"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {open && query.trim().length >= 1 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-black/10 z-30 overflow-hidden">
          {/* Risultati esistenti */}
          {filtered.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                Modifica esistente
              </p>
              {filtered.map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => {
                    onSelect(ing);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                >
                  <div className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-base shrink-0">
                    {CATEGORY_LABELS[ing.category]?.split(" ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {ing.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {CATEGORY_LABELS[ing.category]
                        ?.split(" ")
                        .slice(1)
                        .join(" ")}
                      {ing.prices[0]?.price != null && (
                        <span className="ml-2 font-semibold text-gray-600 tabular-nums">
                          € {Number(ing.prices[0].price).toFixed(4)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                    <span className="text-[11px] font-medium">modifica</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Crea nuovo */}
          {!hasExactMatch && (
            <>
              {filtered.length > 0 && <div className="h-px bg-gray-100 mx-4" />}
              <div className="p-2">
                <button
                  onClick={() => {
                    onCreateNew(query.trim());
                    setQuery("");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                >
                  <div className="w-9 h-9 rounded-2xl bg-gray-900 flex items-center justify-center shrink-0 group-hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Crea &ldquo;{query.trim()}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400">
                      Nuovo ingrediente globale
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0"
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── IMPORT PREVIEW MODAL ─────────────────────────────────────────────────────

function ImportPreviewModal({
  items,
  onConfirm,
  onCancel,
  loading,
}: {
  items: PreviewItem[];
  onConfirm: (resolvedItems: PreviewItem[]) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>(items);

  const newCount = previewItems.filter((i) => i.status === "new").length;
  const updateCount = previewItems.filter((i) => i.status === "update").length;
  const warningCount = previewItems.filter(
    (i) => i.status === "similar" && !i.warningDismissed,
  ).length;

  const updateItem = (idx: number, patch: Partial<PreviewItem>) =>
    setPreviewItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    );

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 shrink-0">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Importazione
              </p>
              <h2 className="text-lg font-semibold text-gray-900">
                Anteprima ingredienti
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Pills riassuntive */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-full text-xs font-semibold text-white">
              <Plus className="w-3 h-3" strokeWidth={3} />
              {newCount} nuovi
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
              <RefreshCw className="w-3 h-3" strokeWidth={2.5} />
              {updateCount} aggiornamenti
            </span>
            {warningCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
                <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                {warningCount} da risolvere
              </span>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-7 pb-4 space-y-2">
          {previewItems.map((item, idx) => {
            const isWarning =
              item.status === "similar" && !item.warningDismissed;
            return (
              <div
                key={idx}
                className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                  isWarning
                    ? "border-amber-200 bg-amber-50/50"
                    : item.status === "update"
                      ? "border-gray-100 bg-gray-50"
                      : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-base shrink-0 mt-0.5">
                    {CATEGORY_LABELS[
                      item.raw.category as IngredientCategory
                    ]?.split(" ")[0] ?? "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.raw.name}
                      </p>
                      {item.status === "new" && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wide">
                          Nuovo
                        </span>
                      )}
                      {item.status === "update" && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wide">
                          Aggiorna
                        </span>
                      )}
                      {isWarning && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide">
                          ⚠ Simile a &ldquo;{item.similarName}&rdquo;
                        </span>
                      )}
                      {item.status === "similar" && item.warningDismissed && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wide">
                          {item.similarResolution === "merge"
                            ? `↗ Aggiorna "${item.similarName}"`
                            : "Crea come nuovo"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CATEGORY_LABELS[item.raw.category as IngredientCategory]
                        ?.split(" ")
                        .slice(1)
                        .join(" ") ?? item.raw.category}
                      {item.raw.price != null && (
                        <span className="ml-2 font-semibold text-gray-600 tabular-nums">
                          € {item.raw.price.toFixed(4)}
                        </span>
                      )}
                      {item.raw.unit && (
                        <span className="ml-2">
                          {UNIT_LABELS[item.raw.unit as Unit] ?? item.raw.unit}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {isWarning && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateItem(idx, {
                          warningDismissed: true,
                          similarResolution: "merge",
                        })
                      }
                      className="text-xs px-3 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                      Aggiorna esistente
                    </button>
                    <button
                      onClick={() =>
                        updateItem(idx, {
                          warningDismissed: true,
                          similarResolution: "create",
                        })
                      }
                      className="text-xs px-3 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      Crea nuovo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-gray-100 shrink-0">
          {warningCount > 0 && (
            <p className="text-xs font-medium text-amber-600 mb-4 flex items-center gap-1.5">
              <AlertTriangle
                className="w-3.5 h-3.5 shrink-0"
                strokeWidth={2.5}
              />
              Risolvi {warningCount} avvis{warningCount === 1 ? "o" : "i"} per
              procedere
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl bg-gray-100 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={() => onConfirm(previewItems)}
              disabled={loading || warningCount > 0}
              className="flex-2 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Importando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} /> Conferma
                  importazione
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function IngredientiAdminClient({
  initialIngredients,
}: {
  initialIngredients: Ingredient[];
}) {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [categoryFilter, setCategoryFilter] = useState<
    IngredientCategory | "ALL"
  >("ALL");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warning" | "error";
  } | null>(null);
  const [editTarget, setEditTarget] = useState<Ingredient | null>(null);
  const [createName, setCreateName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[] | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "warning" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), type === "error" ? 8000 : 4000);
    },
    [],
  );

  const filtered =
    categoryFilter === "ALL"
      ? ingredients
      : ingredients.filter((i) => i.category === categoryFilter);

  const handlePriceUpdated = (id: string, newPrice: number) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? {
              ...ing,
              prices: [
                {
                  id: Date.now().toString(),
                  price: newPrice,
                  validFrom: new Date().toISOString(),
                },
                ...ing.prices,
              ],
            }
          : ing,
      ),
    );
    showToast("Prezzo aggiornato", "success");
  };

  const handleSaved = (ingredient: Ingredient) => {
    setIngredients((prev) => {
      const exists = prev.find((i) => i.id === ingredient.id);
      if (exists)
        return prev.map((i) => (i.id === ingredient.id ? ingredient : i));
      return [...prev, ingredient].sort((a, b) => a.name.localeCompare(b.name));
    });
    const wasEdit = !!editTarget;
    setEditTarget(null);
    setCreateName(null);
    showToast(
      wasEdit
        ? `"${ingredient.name}" aggiornato`
        : `"${ingredient.name}" creato`,
      "success",
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/ingredienti/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setIngredients((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" eliminato`, "warning");
    } catch {
      showToast("Errore durante l'eliminazione", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const list: JSONIngredient[] =
        json.ingredients ?? json.ingredienti ?? json;
      if (!Array.isArray(list))
        throw new Error("Formato non valido — nessun array trovato");

      const preview: PreviewItem[] = list.map((item) => {
        const exact = findExact(item.name, ingredients);
        if (exact) {
          return {
            raw: item,
            status: "update",
            existingId: exact.id,
            existingName: exact.name,
            similarResolution: "merge",
            warningDismissed: true,
          };
        }
        const similar = findSimilar(item.name, ingredients);
        if (similar) {
          return {
            raw: item,
            status: "similar",
            similarId: similar.id,
            similarName: similar.name,
            similarResolution: "create",
            warningDismissed: false,
          };
        }
        return {
          raw: item,
          status: "new",
          similarResolution: "create",
          warningDismissed: true,
        };
      });

      setPreviewItems(preview);
    } catch (err) {
      showToast(`Errore nel file: ${(err as Error).message}`, "error");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleConfirmImport = async (resolvedItems: PreviewItem[]) => {
    setImportLoading(true);
    try {
      const toImport = resolvedItems.map((item) => {
        if (item.status === "similar" && item.similarResolution === "merge") {
          return { ...item.raw, name: item.similarName! };
        }
        return item.raw;
      });

      const res = await fetch("/api/admin/ingredienti/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: toImport }),
      });
      const result = await res.json();
      setPreviewItems(null);

      if (result.errors?.length > 0) {
        showToast(
          `Importati con ${result.errors.length} errori. Creati: ${result.created}, Aggiornati: ${result.updated}`,
          "warning",
        );
      } else {
        showToast(
          `Completato — Creati: ${result.created}, Aggiornati: ${result.updated}`,
          "success",
        );
      }
      window.location.reload();
    } catch {
      showToast("Errore durante l'importazione", "error");
    } finally {
      setImportLoading(false);
    }
  };

  // Categorie con almeno un ingrediente
  const activeCategories = ALL_CATEGORIES.filter((cat) =>
    ingredients.some((i) => i.category === cat),
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* ── HEADER ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <Database
                  className="w-5 h-5 text-gray-700"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  Database Ingredienti
                </h1>
                <p className="text-xs text-gray-400">
                  {ingredients.length} ingredient
                  {ingredients.length === 1 ? "e" : "i"} globali
                  <span className="mx-1.5 text-gray-200">·</span>
                  aggiornamento prezzi settimanale
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/ingredienti-example.json"
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 shadow-sm text-xs font-semibold text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={2} />
                Esempio JSON
              </a>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 shadow-sm text-xs font-bold text-white transition-all"
              >
                <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
                Importa JSON
              </button>
            </div>
          </div>

          {/* ── SMART SEARCH BAR ── */}
          <SmartSearchBar
            ingredients={ingredients}
            onSelect={(ing) => setEditTarget(ing)}
            onCreateNew={(name) => setCreateName(name)}
          />

          {/* ── PILL FILTERS ── */}
          {activeCategories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter("ALL")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  categoryFilter === "ALL"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 shadow-sm"
                }`}
              >
                Tutti
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    categoryFilter === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {ingredients.length}
                </span>
              </button>
              {activeCategories.map((cat) => {
                const count = ingredients.filter(
                  (i) => i.category === cat,
                ).length;
                const active = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 shadow-sm"
                    }`}
                  >
                    <span>{CATEGORY_LABELS[cat]?.split(" ")[0]}</span>
                    <span>
                      {CATEGORY_LABELS[cat]?.split(" ").slice(1).join(" ")}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── LISTA INGREDIENTI ── */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <Database
                    className="w-6 h-6 text-gray-300"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  Nessun ingrediente
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {categoryFilter === "ALL"
                    ? "Usa la barra di ricerca qui sopra per crearne uno"
                    : "Nessun ingrediente in questa categoria"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((ing, idx) => (
                  <div
                    key={ing.id}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors group ${
                      idx === 0 ? "" : ""
                    }`}
                  >
                    {/* Emoji categoria */}
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shrink-0">
                      {CATEGORY_LABELS[ing.category]?.split(" ")[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {ing.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {CATEGORY_LABELS[ing.category]
                            ?.split(" ")
                            .slice(1)
                            .join(" ")}
                        </span>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-xs text-gray-400">
                          {UNIT_LABELS[ing.unit]}
                        </span>
                        {ing.allergens.length > 0 && (
                          <>
                            <span className="text-gray-200 text-xs">·</span>
                            <span className="text-xs font-medium text-orange-400">
                              {ing.allergens.length} allergeni
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick price edit */}
                    <div className="shrink-0">
                      <QuickPriceCell
                        ingredient={ing}
                        onUpdated={handlePriceUpdated}
                      />
                    </div>

                    {/* Azioni */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditTarget(ing)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Modifica"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(ing)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input file nascosto */}
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Modali */}
      {(editTarget || createName !== null) && (
        <IngredientFormModal
          initial={editTarget}
          initialName={createName ?? undefined}
          onClose={() => {
            setEditTarget(null);
            setCreateName(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Elimina "${deleteTarget.name}"?`}
          description="L'ingrediente verrà rimosso definitivamente dal database globale. Le ricette che lo usano potrebbero essere impattate. Questa azione non è reversibile."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {previewItems && (
        <ImportPreviewModal
          items={previewItems}
          onConfirm={handleConfirmImport}
          onCancel={() => setPreviewItems(null)}
          loading={importLoading}
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
