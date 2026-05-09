"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCurrentUser, setCurrentUser } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const current = useAppSelector((s) => s.auth.current);
  const users = useAppSelector((s) => s.users.list);

  const login = useCallback(
    (email: string, password: string): { ok: true } | { ok: false; error: string } => {
      const match = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!match) return { ok: false, error: "Invalid email or password." };
      dispatch(
        setCurrentUser({ id: match.id, fullname: match.fullname, email: match.email })
      );
      return { ok: true };
    },
    [users, dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearCurrentUser());
    router.replace("/login");
  }, [dispatch, router]);

  return { current, login, logout, isAuthenticated: !!current };
}
