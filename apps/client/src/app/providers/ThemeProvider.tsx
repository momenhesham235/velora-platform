import { createContext, useContext, ReactNode, useEffect } from "react";

/**
 * Velora is intentionally a single-mode dark product (matches the
 * 60/30/10 #0B0F1A indigo system). The provider stays so the rest of the
 * codebase can keep calling `useTheme()`, but mode is locked to 'dark' /
 * the `velora-dark` HeroUI theme.
 */
type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark" });

interface ThemeProviderProps {
  children: ReactNode;
}

const VELORA_THEME_CLASS = "velora-dark";

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark", VELORA_THEME_CLASS);
    root.setAttribute("data-theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
