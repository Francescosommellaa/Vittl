"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ── Countdown per reinvio ──
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // ── Validazione password ──
  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }),
    [password],
  );

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const strengthColor =
    passwordStrength <= 2
      ? "bg-red-500"
      : passwordStrength <= 4
        ? "bg-yellow-500"
        : "bg-green-500";

  const strengthText =
    password.length === 0
      ? ""
      : passwordStrength <= 2
        ? "Debole"
        : passwordStrength <= 4
          ? "Media"
          : "Forte";

  // ── Step 1: invio codice ──
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setCountdown(60);
      setStep("reset");
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code: string }[] };
      const errorCode = clerkError.errors?.[0]?.code;

      if (errorCode === "form_identifier_not_found") {
        setError("Nessun account trovato con questa email.");
      } else {
        setError("Errore nell'invio del codice. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: reset con codice + nuova password ──
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (passwordStrength < 5) {
      setError("La password non soddisfa tutti i requisiti.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code: string }[] };
      const errorCode = clerkError.errors?.[0]?.code;

      if (errorCode === "form_code_incorrect") {
        setError("Codice errato. Controlla e riprova.");
      } else if (errorCode === "verification_expired") {
        setError("Codice scaduto. Torna indietro e richiedi un nuovo codice.");
      } else if (errorCode === "form_password_pwned") {
        setError("Password troppo comune. Scegline una più sicura.");
      } else {
        setError("Errore durante il reset. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || countdown > 0) return;
    setError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setCode("");
      setCountdown(60);
    } catch {
      setError("Impossibile reinviare il codice. Riprova.");
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────

  if (step === "email") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Password dimenticata
          </h1>
          <p className="text-gray-500 text-sm">
            Inserisci la tua email, ti inviamo un codice per reimpostarla.
          </p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="mario@ristorante.it"
              required
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm transition-colors ${
                error
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-200 focus:ring-gray-900"
              }`}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Invio codice..." : "Invia codice"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/sign-in"
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
            Torna al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Reimposta password
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          Abbiamo inviato un codice a <strong>{email}</strong>
        </p>
        <button
          onClick={() => {
            setStep("email");
            setError("");
            setCode("");
          }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
        >
          Email sbagliata? Modifica
        </button>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        {/* Codice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Codice di verifica
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Codice a 6 cifre"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-center text-2xl tracking-widest text-sm transition-colors"
            maxLength={6}
            required
          />
        </div>

        {/* Nuova password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nuova password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Crea una password sicura"
              required
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-colors"
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

          {password.length > 0 && (
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Reset in corso..." : "Reimposta password"}
        </button>
      </form>

      {/* Reinvio codice */}
      <div className="text-center mt-6">
        {countdown > 0 ? (
          <p className="text-sm text-gray-400">
            Reinvia codice tra{" "}
            <span className="font-medium text-gray-600">{countdown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Non hai ricevuto il codice? Reinvia
          </button>
        )}
      </div>
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
