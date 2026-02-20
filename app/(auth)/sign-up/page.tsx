"use client";

import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    password: "",
  });

  const passwordChecks = useMemo(() => {
    const password = form.password;
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [form.password]);

  const passwordStrength = useMemo(() => {
    return Object.values(passwordChecks).filter(Boolean).length;
  }, [passwordChecks]);

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  }, [passwordStrength]);

  const strengthText = useMemo(() => {
    if (form.password.length === 0) return "";
    if (passwordStrength <= 2) return "Debole";
    if (passwordStrength <= 4) return "Media";
    return "Forte";
  }, [passwordStrength, form.password]);

  useEffect(() => {
    if (isSignedIn) {
      router.refresh();
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    if (step !== "verify" || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorField === e.target.name) {
      setError("");
      setErrorField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (passwordStrength < 5) {
      setError("La password non soddisfa tutti i requisiti.");
      setErrorField("password");
      return;
    }

    setLoading(true);
    setError("");
    setErrorField(null);

    try {
      await signUp.create({
        firstName: form.name.split(" ")[0],
        lastName: form.name.split(" ").slice(1).join(" ") || undefined,
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: {
          phone: form.phone,
          restaurantName: form.restaurantName,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setCountdown(60);
      setStep("verify");
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code: string }[] };
      const errorCode = clerkError.errors?.[0]?.code;

      if (errorCode === "form_identifier_exists") {
        setError("Questa email è già registrata. Prova ad accedere.");
        setErrorField("email");
      } else if (errorCode === "form_password_pwned") {
        setError("Password troppo comune. Scegline una più sicura.");
        setErrorField("password");
      } else if (errorCode === "form_password_length_too_short") {
        setError("Password troppo corta. Minimo 8 caratteri.");
        setErrorField("password");
      } else {
        setError("Errore durante la registrazione. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code: string }[] };
      const errorCode = clerkError.errors?.[0]?.code;

      if (errorCode === "form_code_incorrect") {
        setError("Codice errato. Controlla e riprova.");
      } else if (errorCode === "verification_expired") {
        setError("Codice scaduto. Richiedi un nuovo codice.");
      } else if (errorCode === "verification_failed") {
        setError("Verifica fallita. Richiedi un nuovo codice.");
      } else {
        setError("Codice non valido. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || resending || countdown > 0) return;
    setResending(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setCode("");
      setCountdown(60);
    } catch {
      setError("Impossibile inviare il codice. Riprova tra poco.");
    } finally {
      setResending(false);
    }
  };

  if (isSignedIn) return null;

  // ── Step: verifica email ─────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verifica email
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          Abbiamo inviato un codice a <strong>{form.email}</strong>
        </p>

        {/* ← AGGIUNTO: modifica email */}
        <button
          onClick={() => {
            setStep("form");
            setError("");
            setCode("");
          }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2 mb-6 block"
        >
          Email sbagliata? Modifica
        </button>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Codice a 6 cifre"
            className={`w-full px-4 py-3 rounded-xl border text-center text-2xl tracking-widest focus:outline-none focus:ring-2 transition-colors ${
              error
                ? "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-gray-200 focus:ring-gray-900"
            }`}
            maxLength={6}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifica in corso..." : "Verifica"}
          </button>
        </form>

        <div className="text-center mt-6">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              Invia nuovo codice tra{" "}
              <span className="font-medium text-gray-600">{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-gray-900 font-medium text-sm hover:underline disabled:opacity-50"
            >
              {resending ? "Invio in corso..." : "Invia nuovo codice"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step: form registrazione ─────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Crea il tuo account
        </h1>
        <p className="text-gray-500 text-sm">
          Inizia gratis, nessuna carta richiesta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome completo
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Mario Rossi"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

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
            Telefono
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+39 333 1234567"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome ristorante
          </label>
          <input
            name="restaurantName"
            type="text"
            value={form.restaurantName}
            onChange={handleChange}
            placeholder="Trattoria da Mario"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Crea una password sicura"
              required
              className={`w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 text-sm transition-colors ${
                errorField === "password"
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-200 focus:ring-gray-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {form.password.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength <= 2
                      ? "text-red-500"
                      : passwordStrength <= 4
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {strengthText}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2">
                <RequirementItem
                  met={passwordChecks.minLength}
                  text="8+ caratteri"
                />
                <RequirementItem
                  met={passwordChecks.hasUppercase}
                  text="Maiuscola"
                />
                <RequirementItem
                  met={passwordChecks.hasLowercase}
                  text="Minuscola"
                />
                <RequirementItem met={passwordChecks.hasNumber} text="Numero" />
                <RequirementItem
                  met={passwordChecks.hasSymbol}
                  text="Simbolo (!@#$...)"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div id="clerk-captcha" className="mb-4" />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? "Creazione account..." : "Crea account"}
        </button>
      </form>

      {/* ← AGGIUNTO: link home */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Torna alla home
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500 mt-3">
        Hai già un account?{" "}
        <Link
          href="/sign-in"
          className="text-gray-900 font-medium hover:underline"
        >
          Accedi
        </Link>
      </p>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <svg
          className="w-3.5 h-3.5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className={`text-xs ${met ? "text-green-600" : "text-gray-400"}`}>
        {text}
      </span>
    </div>
  );
}
