"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function Home() {
  const router = useRouter();
  const isAuthed = useAppSelector((s) => !!s.auth.current);

  useEffect(() => {
    router.replace(isAuthed ? "/dashboard" : "/login");
  }, [isAuthed, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-ink-500">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink-300 border-r-transparent" />
    </div>
  );
}
