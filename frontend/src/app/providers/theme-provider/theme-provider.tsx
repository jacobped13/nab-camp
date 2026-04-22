import { createContext, useContext, useMemo, useState } from "react";

import {
  STORAGE_KEY,
  ThemeOptions,
  type ThemeProviderState,
} from "@/app/providers/theme-provider/consts";

type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

const applyTheme = (newTheme: ThemeOptions) => {
  const root = globalThis.document.documentElement;
  root.classList.remove("light", "dark");

  if (newTheme === "system") {
    const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(newTheme);
  }
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setReactTheme] = useState<ThemeOptions>(() => {
    const initialTheme =
      (localStorage.getItem(STORAGE_KEY) as ThemeOptions) ||
      ThemeOptions.System;
    applyTheme(initialTheme);
    return initialTheme;
  });

  const isDarkMode = useMemo(
    () =>
      theme === ThemeOptions.Dark ||
      (theme === ThemeOptions.System &&
        globalThis.matchMedia("(prefers-color-scheme: dark)").matches),
    [theme],
  );

  const isLightMode = useMemo(
    () =>
      theme === ThemeOptions.Light ||
      (theme === ThemeOptions.System &&
        globalThis.matchMedia("(prefers-color-scheme: light)").matches),
    [theme],
  );

  const value: ThemeProviderState = useMemo(
    () => ({
      theme,
      isDarkMode,
      isLightMode,
      setTheme: (newTheme: ThemeOptions) => {
        localStorage.setItem(STORAGE_KEY, newTheme);
        applyTheme(newTheme);
        setReactTheme(newTheme);
      },
    }),
    [theme, isDarkMode, isLightMode],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
