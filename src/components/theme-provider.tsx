"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AureumTheme = "dark" | "light" | "contrast";

type ThemeContextValue = {
  theme: AureumTheme;
  setTheme: (theme: AureumTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "aureum-theme";

function validTheme(value: string | null): value is AureumTheme {
  return value === "dark" || value === "light" || value === "contrast";
}

function applyTheme(theme: AureumTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme =
    theme === "light" ? "light" : "dark";

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AureumTheme>("dark");

  useEffect(() => {
    let initial: AureumTheme = "dark";

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (validTheme(stored)) initial = stored;
    } catch {}

    setThemeState(initial);
    applyTheme(initial);
  }, []);

  function setTheme(next: AureumTheme) {
    setThemeState(next);
    applyTheme(next);
  }

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAureumTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useAureumTheme must be used inside ThemeProvider");
  }
  return value;
}
