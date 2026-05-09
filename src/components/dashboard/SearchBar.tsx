"use client";

import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search products…" }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      }
      rightSlot={
        value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100"
            aria-label="Clear search"
          >
            Clear
          </button>
        ) : null
      }
    />
  );
}
