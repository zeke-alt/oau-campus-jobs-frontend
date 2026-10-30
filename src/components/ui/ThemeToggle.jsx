"use client";
// ============================================================================
// SECTION: UI - THEME TOGGLE (Sun / Moon)
// ============================================================================
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "", compact = false }) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    // Skeleton placeholder to prevent layout shift during hydration
    return (
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] opacity-40 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors duration-150 ${className}`}
    >
      {isDark ? (
        <Sun size={16} className="text-amber-400 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon size={16} className="text-[var(--color-ink)] transition-transform duration-200 rotate-0" />
      )}
    </button>
  );
}

// ============================================================================
// SECTION: SEGMENTED THEME PICKER (Light / Dark / System)
// Useful in Settings
// ============================================================================
export function ThemeSegmentedPicker() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  const options = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
      {options.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
              active
                ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs border border-[var(--color-border)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

