"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setThemePreference: (preference: ThemePreference) => void;
  systemTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback((): Theme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Update system theme when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);

      // If user preference is system, update the actual theme
      if (themePreference === "system") {
        setTheme(newSystemTheme);
      }
    };

    // Set initial system theme
    setSystemTheme(getSystemTheme());

    // Listen for system theme changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [getSystemTheme, themePreference]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem(
        "theme-preference"
      ) as ThemePreference;
      const currentSystemTheme = getSystemTheme();

      if (
        savedPreference &&
        ["light", "dark", "system"].includes(savedPreference)
      ) {
        setThemePreferenceState(savedPreference);

        if (savedPreference === "system") {
          setTheme(currentSystemTheme);
        } else {
          setTheme(savedPreference);
        }
      } else {
        // Default to system preference
        setThemePreferenceState("system");
        setTheme(currentSystemTheme);
      }

      setSystemTheme(currentSystemTheme);
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn("Failed to load theme preference:", error);
      const currentSystemTheme = getSystemTheme();
      setThemePreferenceState("system");
      setTheme(currentSystemTheme);
      setSystemTheme(currentSystemTheme);
    }

    setMounted(true);
  }, [getSystemTheme]);

  // Apply theme to document and save preference
  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          theme === "dark" ? "#000000" : "#ffffff"
        );
      }

      // Save preference to localStorage
      try {
        localStorage.setItem("theme-preference", themePreference);
      } catch (error) {
        console.warn("Failed to save theme preference:", error);
      }
    }
  }, [theme, themePreference, mounted]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemePreferenceState(newTheme);
  }, [theme]);

  const setThemePreference = useCallback(
    (preference: ThemePreference) => {
      setThemePreferenceState(preference);

      if (preference === "system") {
        setTheme(systemTheme);
      } else {
        setTheme(preference);
      }
    },
    [systemTheme]
  );

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }} suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference,
        toggleTheme,
        setThemePreference,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
