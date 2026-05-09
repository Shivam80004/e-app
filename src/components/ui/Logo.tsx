import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-ink-950 shadow-glow">
        <span className="absolute inset-0 rounded-xl bg-mesh opacity-70" />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-white" fill="none">
          <path
            d="M4 14c2-6 6-9 10-9 0 6-3 11-10 13-1-1-1-2 0-4z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="9" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-ink-950">
        Seepossible
      </span>
    </div>
  );
}
