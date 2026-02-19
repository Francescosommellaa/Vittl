"use client";

import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"email" | "password" | null>(
    null,
  );
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset errore quando l'utente modifica il campo
    if (errorField === e.target.name) {
      setError("");
      setErrorField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    setErrorField(null);

    try {
      const result = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const clerkError = err as {
        errors?: { code: string; message: string }[];
      };
      const errorCode = clerkError.errors?.[0]?.code;

      if (errorCode === "form_identifier_not_found") {
        setError("Email non trovata. Controlla o registrati.");
        setErrorField("email");
      } else if (errorCode === "form_password_incorrect") {
        setError("Password errata. Riprova.");
        setErrorField("password");
      } else if (errorCode === "session_exists") {
        router.push("/dashboard");
      } else {
        setError("Errore durante l'accesso. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Bentornato
        </h1>
        <p className="text-gray-500 text-sm">Accedi al tuo account Vittl</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="mario@ristorante.it"
            required
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm transition-colors ${
              errorField === "email"
                ? "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-200 focus:ring-gray-900"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm transition-colors ${
              errorField === "password"
                ? "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-200 focus:ring-gray-900"
            }`}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Non hai un account?{" "}
        <Link
          href="/signup"
          className="text-gray-900 font-medium hover:underline"
        >
          Registrati gratis
        </Link>
      </p>
    </div>
  );
}
