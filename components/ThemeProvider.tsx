"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light";

/*
 * La clave lleva version a proposito.
 *
 * Cuando el sitio arrancaba en oscuro, todo el que lo visito se llevo un "dark" guardado en
 * su navegador. Al cambiar el defecto a claro, esa gente seguia viendo el sitio en oscuro:
 * su preferencia antigua ganaba al nuevo defecto, y parecia que el cambio no habia surtido
 * efecto. Subir la version de la clave descarta aquellas elecciones y todo el mundo vuelve a
 * empezar en claro. A partir de ahora, el que elija oscuro lo hace sabiendo lo que hace.
 */
const storageKey = "nano-gro-theme-v2";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "light",
  setTheme: () => undefined,
  toggleTheme: () => undefined
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Claro por defecto, no la preferencia del sistema. Debe coincidir con el script de
  // arranque de app/layout.tsx; si divergen, la pagina parpadea al hidratar.
  const [theme, setThemeState] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as Theme | null;
    setThemeState(stored === "dark" ? "dark" : "light");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [ready, theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark"))
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

