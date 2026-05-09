"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useValidation } from "@/hooks/useValidation";
import { validateLogin, type LoginValues } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const initial: LoginValues = { email: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, setValue, handleBlur, validateAll, reset } =
    useValidation<LoginValues>(initial, validateLogin);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!validateAll()) return;

      setSubmitting(true);
      const result = login(values.email, values.password);
      if (result.ok) {
        router.replace("/dashboard");
      } else {
        setSubmitError(result.error);
        reset();
        setSubmitting(false);
      }
    },
    [login, values, validateAll, router, reset]
  );

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your catalog."
      footer={
        <span>
          New to Seepossible?{" "}
          <Link href="/signup" className="font-medium text-accent-700 hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => setValue("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-100"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          }
        />

        {submitError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <Button type="submit" variant="accent" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
