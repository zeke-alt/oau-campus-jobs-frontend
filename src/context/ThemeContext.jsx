"use client";
// ============================================================================
// SECTION: HYBRID THEME ENGINE (OS Default + Manual Override + LocalStorage)
// ============================================================================
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "oau_campus_jobs_theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "dark" || saved === "light" || saved === "system"
      ? saved
      : "system";
  } catch {
    return "system";
  }
}

// Media query external store
function subscribeToSystemTheme(callback) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemThemeSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getSystemThemeServerSnapshot() {
  return false;
}

// Mounted external store (avoids setState in effect)
const emptySubscribe = () => () => {};
function getMountedSnapshot() {
  return true;
}
function getMountedServerSnapshot() {
  return false;
}

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const systemIsDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot
  );
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  // Determine active theme (manual override takes precedence over OS default)
  const resolvedTheme =
    theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

  // Apply classes to documentElement
  const applyClasses = useCallback((active) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (active === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (active === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      // system: remove manual override classes, letting CSS media query take over
      root.classList.remove("dark", "light");
    }
  }, []);

  // Sync classes whenever theme changes
  useEffect(() => {
    applyClasses(theme);
  }, [theme, applyClasses]);

  const setTheme = useCallback(
    (newTheme) => {
      setThemeState(newTheme);
      try {
        if (newTheme === "system") {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, newTheme);
        }
      } catch {
        // Storage restricted
      }
      applyClasses(newTheme);
    },
    [applyClasses]
  );

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
