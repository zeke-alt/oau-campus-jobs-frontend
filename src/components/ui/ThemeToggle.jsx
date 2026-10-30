"use client";
// ============================================================================
// SECTION: UI - THEME TOGGLE BUTTON & PICKER
// ============================================================================
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-lg border border-[var(--color-border)] opacity-30 ${className}`}
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
      className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors duration-150 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun size={15} className="text-amber-400" />
      ) : (
        <Moon size={15} className="text-[var(--color-ink)]" />
      )}
    </button>
  );
}

// Segmented picker for Settings (Light / Dark / Auto-System)
export function ThemeSegmentedPicker() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "Auto (System)", icon: Laptop },
  ];

  return (
    <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
              active
                ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs border border-[var(--color-border)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Icon size={13} className={active ? "text-[var(--color-brand)]" : ""} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
