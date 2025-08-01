/**
 * Color utility functions for ensuring proper contrast ratios
 * and theme-aware color selection
 */

import {
  ComponentAccessibilityValidator,
  validateSingleCombination,
  logAccessibilityWarnings,
  validateColorCombinations as validateAccessibility,
} from "./accessibilityValidator";

export interface ColorUtils {
  getContrastRatio(color1: string, color2: string): number;
  isAccessible(foreground: string, background: string): boolean;
  getSafeTextColor(background: string): string;
  getSafeBackgroundColor(text: string): string;
  getHoverColors(
    currentBg: string,
    currentText: string
  ): {
    background: string;
    text: string;
  };
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function isAccessible(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get safe text color for a given background
 */
export function getSafeTextColor(background: string): string {
  const colors = {
    black: "#000000",
    white: "#ffffff",
    darkGray: "#2a2a2a",
    mediumGray: "#666666",
  };

  // Test each color and return the one with best contrast
  let bestColor = colors.black;
  let bestRatio = getContrastRatio(colors.black, background);

  Object.entries(colors).forEach(([, color]) => {
    const ratio = getContrastRatio(color, background);
    if (ratio > bestRatio) {
      bestColor = color;
      bestRatio = ratio;
    }
  });

  return bestColor;
}

/**
 * Get safe background color for a given text color
 */
export function getSafeBackgroundColor(text: string): string {
  const backgrounds = {
    white: "#ffffff",
    lightGray: "#f5f5f5",
    black: "#000000",
    darkGray: "#2a2a2a",
    yellow: "#ffff00",
  };

  let bestBackground = backgrounds.white;
  let bestRatio = getContrastRatio(text, backgrounds.white);

  Object.entries(backgrounds).forEach(([, color]) => {
    const ratio = getContrastRatio(text, color);
    if (ratio > bestRatio) {
      bestBackground = color;
      bestRatio = ratio;
    }
  });

  return bestBackground;
}

/**
 * Get safe hover colors that maintain contrast
 */
export function getHoverColors(
  currentBg: string,
  currentText: string
): {
  background: string;
  text: string;
} {
  const brutalistColors = {
    black: "#000000",
    white: "#ffffff",
    yellow: "#ffff00",
    darkGray: "#2a2a2a",
  };

  // Default hover pattern: invert colors if possible
  if (currentBg === brutalistColors.white) {
    return {
      background: brutalistColors.black,
      text: brutalistColors.white,
    };
  }

  if (currentBg === brutalistColors.yellow) {
    return {
      background: brutalistColors.black,
      text: brutalistColors.yellow,
    };
  }

  if (currentBg === brutalistColors.black) {
    return {
      background: brutalistColors.white,
      text: brutalistColors.black,
    };
  }

  // Fallback: ensure good contrast
  return {
    background: getSafeBackgroundColor(currentText),
    text: getSafeTextColor(currentBg),
  };
}

/**
 * Get theme-aware color based on current theme
 */
export function getThemeAwareColor(
  lightColor: string,
  darkColor: string,
  theme: "light" | "dark"
): string {
  return theme === "dark" ? darkColor : lightColor;
}

/**
 * Validate all color combinations in a component
 */
export function validateColorCombinations(
  combinations: Array<{
    foreground: string;
    background: string;
    context: string;
  }>
): Array<{
  combination: { foreground: string; background: string };
  contrastRatio: number;
  wcagLevel: "AA" | "AAA" | "FAIL";
  isLargeText: boolean;
  passes: boolean;
  context: string;
}> {
  return combinations.map(({ foreground, background, context }) => {
    const contrastRatio = getContrastRatio(foreground, background);
    const passesAA = contrastRatio >= 4.5;
    const passesAAA = contrastRatio >= 7;

    return {
      combination: { foreground, background },
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      wcagLevel: passesAAA ? "AAA" : passesAA ? "AA" : "FAIL",
      isLargeText: false,
      passes: passesAA,
      context,
    };
  });
}

/**
 * Development-time color contrast validation
 */
export function validateNavigationColors(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    background: theme === "dark" ? "#000000" : "#ffffff",
    foreground: theme === "dark" ? "#ffffff" : "#000000",
    yellow: "#ffff00",
    mediumGray: "#666666",
  };

  const combinations = [
    {
      foreground: colors.foreground,
      background: colors.background,
      context: "Navigation text on background",
    },
    {
      foreground: colors.yellow,
      background: colors.background,
      context: "Active navigation item",
    },
    {
      foreground: colors.foreground,
      background: colors.yellow,
      context: "Text on yellow background",
    },
    {
      foreground: colors.mediumGray,
      background: colors.background,
      context: "Secondary text",
    },
  ];

  const results = validateColorCombinations(combinations);
  const failures = results.filter((result) => !result.passes);

  if (failures.length > 0) {
    console.warn("Navigation color contrast issues detected:", failures);
  } else {
    console.log("✅ All navigation color combinations pass WCAG AA standards");
  }
}

/**
 * Validate DarkModeToggle visibility in both themes
 */
export function validateToggleVisibility(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    toggleBg: theme === "dark" ? "#000000" : "#ffffff",
    toggleBorder: theme === "dark" ? "#ffffff" : "#000000",
    thumbBg: "#ffff00",
    thumbBorder: theme === "dark" ? "#ffffff" : "#000000",
    iconColor: theme === "dark" ? "#ffffff" : "#000000",
    bgIconColor: theme === "dark" ? "#ffffff" : "#000000",
  };

  const combinations = [
    {
      foreground: colors.iconColor,
      background: colors.thumbBg,
      context: `Toggle icon on yellow thumb (${theme} mode)`,
    },
    {
      foreground: colors.bgIconColor,
      background: colors.toggleBg,
      context: `Background icons on toggle background (${theme} mode)`,
    },
    {
      foreground: colors.thumbBorder,
      background: colors.thumbBg,
      context: `Thumb border on yellow background (${theme} mode)`,
    },
    {
      foreground: colors.toggleBorder,
      background: colors.toggleBg,
      context: `Toggle border on background (${theme} mode)`,
    },
  ];

  const results = validateColorCombinations(combinations);
  const failures = results.filter((result) => !result.passes);

  if (failures.length > 0) {
    console.warn(
      `DarkModeToggle visibility issues in ${theme} mode:`,
      failures
    );
  } else {
    console.log(
      `✅ DarkModeToggle visibility passes WCAG AA standards in ${theme} mode`
    );
  }
}

/**
 * Validate toggle focus states
 */
export function validateToggleFocusStates(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  const colors = {
    focusOutline: "#ffff00",
    toggleBg: theme === "dark" ? "#000000" : "#ffffff",
  };

  const focusRatio = getContrastRatio(colors.focusOutline, colors.toggleBg);
  const passes = focusRatio >= 3; // Focus indicators need 3:1 ratio

  if (!passes) {
    console.warn(
      `Toggle focus outline contrast insufficient in ${theme} mode: ${focusRatio.toFixed(
        2
      )}:1`
    );
  } else {
    console.log(
      `✅ Toggle focus outline contrast passes in ${theme} mode: ${focusRatio.toFixed(
        2
      )}:1`
    );
  }
}

/**
 * Enhanced component validation using the new accessibility validator
 */
export function validateComponentAccessibility(
  componentName: string,
  colorCombinations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
): void {
  if (process.env.NODE_ENV !== "development") return;

  const validator = new ComponentAccessibilityValidator(componentName);

  colorCombinations.forEach(
    ({ foreground, background, context, ...options }) => {
      validator.addValidation(foreground, background, context, options);
    }
  );

  validator.validate();
}

/**
 * Quick validation with development warnings
 */
export function validateColorPair(
  foreground: string,
  background: string,
  context: string,
  options: {
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  } = {}
): boolean {
  const result = validateSingleCombination(foreground, background, context, {
    ...options,
    logWarnings: process.env.NODE_ENV === "development",
  });

  return result.passes;
}

/**
 * Validate button component colors
 */
export function validateButtonColors(
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

  validateComponentAccessibility(`BrutalistButton-${variant}`, [
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
 * Validate hero section colors
 */
export function validateHeroColors(): void {
  if (process.env.NODE_ENV !== "development") return;

  validateComponentAccessibility("HeroSection", [
    {
      foreground: "#ffffff",
      background: "#000000",
      context: "White text on dark overlay",
      isLargeText: true,
    },
    {
      foreground: "#ffff00",
      background: "#000000",
      context: "Yellow accent text on dark overlay",
      isLargeText: true,
    },
    {
      foreground: "#ffffff",
      background: "#2a2a2a",
      context: "White text on dark gray background",
    },
  ]);
}

/**
 * Validate services grid colors
 */
export function validateServicesColors(): void {
  if (process.env.NODE_ENV !== "development") return;

  validateComponentAccessibility("ServicesGrid", [
    {
      foreground: "#000000",
      background: "#ffffff",
      context: "Service title on white background",
      isLargeText: true,
    },
    {
      foreground: "#666666",
      background: "#ffffff",
      context: "Service description on white background",
    },
    {
      foreground: "#000000",
      background: "#f5f5f5",
      context: "Service text on light gray hover background",
    },
  ]);
}

/**
 * Comprehensive theme validation
 */
export function validateThemeColors(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  console.group(`🎨 Validating ${theme} theme colors`);

  // Validate navigation
  validateNavigationColors(theme);

  // Validate toggle
  validateToggleVisibility(theme);
  validateToggleFocusStates(theme);

  // Validate buttons
  validateButtonColors("primary", theme);
  validateButtonColors("secondary", theme);
  validateButtonColors("accent", theme);

  // Validate hero section
  validateHeroColors();

  // Validate services
  validateServicesColors();

  console.groupEnd();
}
