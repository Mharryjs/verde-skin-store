"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    if (mode === "register") payload.name = String(form.get("name") ?? "");

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setPending(false);
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Network hiccup — please try again.");
      setPending(false);
    }
  }

  return (
    <div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <Field label="Full name" name="name" type="text" placeholder="Ayesha Kakar" autoComplete="name" />
        )}
        <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
        <Field
          label={mode === "register" ? "Password (6+ characters)" : "Password"}
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />

        <button
          type="submit"
          disabled={pending}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-pine py-4 text-sm font-semibold text-paper transition hover:bg-forest disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {mode === "register" ? "Create my account" : "Sign in"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-pine/55">
        {mode === "register" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-pine underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New around here?{" "}
            <Link href="/register" className="font-semibold text-pine underline-offset-4 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-fern">
        {label}
      </span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-pine/15 bg-paper px-4 py-3.5 text-sm transition placeholder:text-pine/35 focus:border-fern focus:bg-white"
      />
    </label>
  );
}
