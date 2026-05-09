"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthed = useAppSelector((s) => !!s.auth.current);

  useEffect(() => {
    if (!isAuthed) router.replace("/login");
  }, [isAuthed, router]);

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-500">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink-300 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <DashboardHeader />
      {children}
    </div>
  );
}
