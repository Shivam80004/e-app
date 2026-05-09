"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useValidation } from "@/hooks/useValidation";
import {
  passwordStrength,
  validateSignup,
  type SignupValues,
} from "@/lib/validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUser } from "@/store/slices/usersSlice";
import { setCurrentUser } from "@/store/slices/authSlice";

const initial: SignupValues = {
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  mobile: "",
};

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const existingUsers = useAppSelector((s) => s.users.list);
  const [showPw, setShowPw] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { values, errors, setValue, handleBlur, validateAll, reset } =
    useValidation<SignupValues>(initial, validateSignup);

  const strength = useMemo(() => passwordStrength(values.password), [values.password]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!validateAll()) return;

      const emailLower = values.email.trim().toLowerCase();
      if (existingUsers.some((u) => u.email.toLowerCase() === emailLower)) {
        setSubmitError("An account with this email already exists.");
        reset();
        return;
      }

      setSubmitting(true);
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `u_${Date.now()}`;

      dispatch(
        addUser({
          id,
          fullname: values.fullname.trim(),
          email: emailLower,
          password: values.password,
          gender: values.gender as "male" | "female" | "other",
          mobile: values.mobile.trim(),
          createdAt: Date.now(),
        })
      );
      dispatch(
        setCurrentUser({ id, fullname: values.fullname.trim(), email: emailLower })
      );
      router.replace("/dashboard");
    },
    [validateAll, values, existingUsers, dispatch, router, reset]
  );

  const strengthLabel = ["Too weak", "Weak", "Fair", "Strong", "Excellent"][strength];
  const strengthColors = [
    "bg-rose-400",
    "bg-rose-400",
    "bg-amber-400",
    "bg-mint-500",
    "bg-mint-500",
  ];

  return (
    <AuthShell
      title="Create your account"
      subtitle="A few details and you're in. No credit card required."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent-700 hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          name="fullname"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={values.fullname}
          onChange={(e) => setValue("fullname", e.target.value)}
          onBlur={() => handleBlur("fullname")}
          error={errors.fullname}
        />

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

        <div>
          <Input
            label="Password"
            name="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
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
          {values.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength ? strengthColors[strength] : "bg-ink-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink-500">{strengthLabel}</p>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          name="confirmPassword"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={values.confirmPassword}
          onChange={(e) => setValue("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
        />

        <div>
          <span className="label">Gender</span>
          <div className="grid grid-cols-3 gap-2">
            {(["male", "female", "other"] as const).map((g) => (
              <label
                key={g}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium capitalize transition-all ${
                  values.gender === g
                    ? "border-accent-500 bg-accent-50 text-accent-700 shadow-glow"
                    : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  className="sr-only"
                  checked={values.gender === g}
                  onChange={() => setValue("gender", g)}
                  onBlur={() => handleBlur("gender")}
                />
                {g}
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.gender}</p>
          )}
        </div>

        <Input
          label="Mobile"
          name="mobile"
          inputMode="tel"
          autoComplete="tel"
          placeholder="9876543210"
          value={values.mobile}
          onChange={(e) => setValue("mobile", e.target.value.replace(/[^\d+]/g, ""))}
          onBlur={() => handleBlur("mobile")}
          error={errors.mobile}
        />

        {submitError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <Button type="submit" variant="accent" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
