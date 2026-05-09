import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  side?: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, side, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-50">
      <div className="absolute inset-0 bg-mesh opacity-90" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(17,19,28,0.12) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0) 90%)",
        }}
        aria-hidden
      />
      <main className="flex items-center justify-center px-5 py-[10%] sm:px-8">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <div className="card p-7 sm:p-9">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-600">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-ink-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
