/**
 * Accessibility integration examples
 *
 * This file shows how to integrate the accessibility validation utilities
 * into React components and the application.
 */

import { useEffect } from "react";
import {
  validateComponentColors,
  checkColorContrast,
  validateThemeChange,
  devAccessibilityChecker,
} from "./accessibility";

/**
 * React hook for validating component accessibility
 */
export function useComponentAccessibility(
  componentName: string,
  colorCombinations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      validateComponentColors(componentName, colorCombinations);
    }
  }, [componentName, colorCombinations]);
}

/**
 * React hook for theme accessibility validation
 */
export function useThemeAccessibility(theme: "light" | "dark") {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      validateThemeChange(theme);
    }
  }, [theme]);
}

/**
 * Validate button component colors
 */
export function validateButtonAccessibility(
  variant: "primary" | "secondary" | "accent",
  theme: "light" | "dark" = "light"
): void {
  if (process.env.NODE_ENV !== "development") return;

  const buttonColors = {
    primary: {
      bg: theme === "dark" ? "#ffffff" : "#000000",
      text: theme === "dark" ? "#000000" : "#ffffff",
      hoverBg: theme === "dark" ? "#000000" : "#ffffff",
      hoverText: theme === "dark" ? "#ffffff" : "#000000",
    },
    secondary: {
      bg: "#ffffff",
      text: "#000000",
      hoverBg: "#000000",
      hoverText: "#ffffff",
    },
    accent: {
      bg: "#ffff00",
      text: "#000000",
      hoverBg: "#000000",
      hoverText: "#ffff00",
    },
  };

  const colors = buttonColors[variant];

  validateComponentColors(`BrutalistButton-${variant}`, [
    {
      foreground: colors.text,
      background: colors.bg,
      context: `${variant} button default state`,
    },
    {
      foreground: colors.hoverText,
      background: colors.hoverBg,
      context: `${variant} button hover state`,
    },
    {
      foreground: "#ffff00", // Focus outline
      background: colors.bg,
      context: `${variant} button focus outline`,
      isFocusIndicator: true,
    },
  ]);
}

/**
 * Validate navigation component colors
 */
export function validateNavigationAccessibility(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    background: theme === "dark" ? "#000000" : "#ffffff",
    text: theme === "dark" ? "#ffffff" : "#000000",
    accent: "#ffff00",
    secondary: "#666666",
  };

  validateComponentColors("Navigation", [
    {
      foreground: colors.text,
      background: colors.background,
      context: "Navigation text",
    },
    {
      foreground: colors.accent,
      background: colors.background,
      context: "Active navigation item",
    },
    {
      foreground: colors.secondary,
      background: colors.background,
      context: "Secondary navigation text",
    },
  ]);
}

/**
 * Validate hero section colors
 */
export function validateHeroAccessibility(): void {
  if (process.env.NODE_ENV !== "development") return;

  validateComponentColors("HeroSection", [
    {
      foreground: "#ffffff",
      background: "#000000",
      context: "Hero title on dark overlay",
      isLargeText: true,
    },
    {
      foreground: "#ffff00",
      background: "#000000",
      context: "Hero accent text on dark overlay",
      isLargeText: true,
    },
    {
      foreground: "#ffffff",
      background: "#2a2a2a",
      context: "Hero subtitle on dark background",
    },
  ]);
}

/**
 * Validate card component colors
 */
export function validateCardAccessibility(
  variant: "default" | "featured" = "default"
): void {
  if (process.env.NODE_ENV !== "development") return;

  const cardColors = {
    default: {
      bg: "#ffffff",
      text: "#000000",
      secondary: "#666666",
      hoverBg: "#f5f5f5",
    },
    featured: {
      bg: "#ffff00",
      text: "#000000",
      secondary: "#2a2a2a",
      hoverBg: "#000000",
      hoverText: "#ffff00",
    },
  };

  const colors = cardColors[variant];

  const combinations = [
    {
      foreground: colors.text,
      background: colors.bg,
      context: `${variant} card title`,
    },
    {
      foreground: colors.secondary,
      background: colors.bg,
      context: `${variant} card description`,
    },
  ];

  if (variant === "featured" && "hoverText" in colors && "hoverBg" in colors) {
    combinations.push({
      foreground: colors.hoverText,
      background: colors.hoverBg,
      context: `${variant} card hover state`,
    });
  }

  validateComponentColors(`BrutalistCard-${variant}`, combinations);
}

/**
 * Initialize accessibility validation for the entire app
 */
export function initializeAppAccessibility(): void {
  if (process.env.NODE_ENV !== "development") return;

  console.log("🔍 Initializing application accessibility validation...");

  // Validate core theme colors
  validateThemeChange("light");
  validateThemeChange("dark");

  // Validate common components
  validateButtonAccessibility("primary");
  validateButtonAccessibility("secondary");
  validateButtonAccessibility("accent");
  validateNavigationAccessibility("light");
  validateNavigationAccessibility("dark");
  validateHeroAccessibility();
  validateCardAccessibility("default");
  validateCardAccessibility("featured");

  console.log("✅ Application accessibility validation complete");
}

/**
 * Quick color contrast checker for development
 */
export function quickContrastCheck(
  foreground: string,
  background: string,
  context?: string
): boolean {
  return checkColorContrast(foreground, background, context);
}

/**
 * Scan current page for accessibility issues
 */
export function scanPageAccessibility(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development")
    return;

  console.log("🔍 Scanning page for accessibility issues...");
  devAccessibilityChecker.scanDOMForIssues();
}

/**
 * Example usage in a React component:
 *
 * ```tsx
 * import { useComponentAccessibility } from './utils/accessibilityIntegration';
 *
 * function MyButton({ variant, theme }) {
 *   useComponentAccessibility('MyButton', [
 *     {
 *       foreground: getTextColor(variant, theme),
 *       background: getBackgroundColor(variant, theme),
 *       context: `${variant} button in ${theme} theme`
 *     }
 *   ]);
 *
 *   return <button>My Button</button>;
 * }
 * ```
 */

// Export for browser console access during development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).accessibilityIntegration = {
    initApp: initializeAppAccessibility,
    validateButton: validateButtonAccessibility,
    validateNav: validateNavigationAccessibility,
    validateHero: validateHeroAccessibility,
    validateCard: validateCardAccessibility,
    quickCheck: quickContrastCheck,
    scanPage: scanPageAccessibility,
  };

  console.log(
    "🔧 Accessibility integration functions available at window.accessibilityIntegration"
  );
}
