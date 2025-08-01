/**
 * Hover State Utilities
 *
 * This module provides utilities for ensuring proper contrast ratios
 * in hover states and preventing visibility issues like white text
 * on yellow backgrounds.
 */

import { getContrastRatio, BRUTALIST_COLORS } from "./color-utils";

export interface HoverStateConfig {
  baseBackground: string;
  baseText: string;
  hoverBackground?: string;
  hoverText?: string;
}

export interface SafeHoverColors {
  background: string;
  text: string;
  isValid: boolean;
  contrastRatio: number;
}

/**
 * Get safe hover colors that maintain proper contrast ratios
 */
export function getSafeHoverColors(config: HoverStateConfig): SafeHoverColors {
  const { baseBackground, baseText, hoverBackground, hoverText } = config;

  // If hover colors are provided, validate them
  if (hoverBackground && hoverText) {
    const contrastRatio = getContrastRatio(hoverText, hoverBackground);

    if (contrastRatio >= 4.5) {
      return {
        background: hoverBackground,
        text: hoverText,
        isValid: true,
        contrastRatio,
      };
    }
  }

  // Generate safe hover colors based on base colors
  let safeHoverBackground: string;
  let safeHoverText: string;

  // Invert colors for hover state while maintaining contrast
  if (baseBackground === BRUTALIST_COLORS.WHITE) {
    safeHoverBackground = BRUTALIST_COLORS.BLACK;
    safeHoverText = BRUTALIST_COLORS.WHITE;
  } else if (baseBackground === BRUTALIST_COLORS.BLACK) {
    safeHoverBackground = BRUTALIST_COLORS.WHITE;
    safeHoverText = BRUTALIST_COLORS.BLACK;
  } else if (baseBackground === BRUTALIST_COLORS.YELLOW) {
    // CRITICAL: Never use white text on yellow background
    safeHoverBackground = BRUTALIST_COLORS.BLACK;
    safeHoverText = BRUTALIST_COLORS.YELLOW;
  } else {
    // Default safe combination
    safeHoverBackground = BRUTALIST_COLORS.BLACK;
    safeHoverText = BRUTALIST_COLORS.WHITE;
  }

  const contrastRatio = getContrastRatio(safeHoverText, safeHoverBackground);

  return {
    background: safeHoverBackground,
    text: safeHoverText,
    isValid: contrastRatio >= 4.5,
    contrastRatio,
  };
}

/**
 * Validate hover state combinations and warn about issues
 */
export function validateHoverState(
  baseConfig: HoverStateConfig,
  componentName: string
): void {
  if (process.env.NODE_ENV !== "development") return;

  const safeColors = getSafeHoverColors(baseConfig);

  if (!safeColors.isValid) {
    console.warn(
      `[Hover State Warning] ${componentName}: Insufficient contrast ratio (${safeColors.contrastRatio.toFixed(
        2
      )}:1) in hover state. Consider using safer color combinations.`
    );
  }

  // Check for specific problematic combinations
  if (
    baseConfig.hoverBackground === BRUTALIST_COLORS.YELLOW &&
    baseConfig.hoverText === BRUTALIST_COLORS.WHITE
  ) {
    console.error(
      `[Critical Hover Issue] ${componentName}: White text on yellow background detected in hover state! This creates severe visibility issues.`
    );
  }

  if (
    baseConfig.hoverBackground === BRUTALIST_COLORS.WHITE &&
    baseConfig.hoverText === BRUTALIST_COLORS.WHITE
  ) {
    console.error(
      `[Critical Hover Issue] ${componentName}: White text on white background detected in hover state! Text will be invisible.`
    );
  }
}

/**
 * Generate CSS classes for safe hover states
 */
export function generateHoverClasses(config: HoverStateConfig): string {
  const safeColors = getSafeHoverColors(config);

  return `hover:bg-[${safeColors.background}] hover:text-[${safeColors.text}]`;
}

/**
 * Common hover state patterns for brutalist design
 */
export const HOVER_PATTERNS = {
  // Button patterns
  PRIMARY_BUTTON: {
    baseBackground: BRUTALIST_COLORS.BLACK,
    baseText: BRUTALIST_COLORS.WHITE,
    hoverBackground: BRUTALIST_COLORS.WHITE,
    hoverText: BRUTALIST_COLORS.BLACK,
  },

  SECONDARY_BUTTON: {
    baseBackground: BRUTALIST_COLORS.WHITE,
    baseText: BRUTALIST_COLORS.BLACK,
    hoverBackground: BRUTALIST_COLORS.BLACK,
    hoverText: BRUTALIST_COLORS.WHITE,
  },

  ACCENT_BUTTON: {
    baseBackground: BRUTALIST_COLORS.YELLOW,
    baseText: BRUTALIST_COLORS.BLACK,
    hoverBackground: BRUTALIST_COLORS.BLACK,
    hoverText: BRUTALIST_COLORS.YELLOW,
  },

  // Card patterns
  DEFAULT_CARD: {
    baseBackground: BRUTALIST_COLORS.WHITE,
    baseText: BRUTALIST_COLORS.BLACK,
    hoverBackground: BRUTALIST_COLORS.BLACK,
    hoverText: BRUTALIST_COLORS.WHITE,
  },

  ACCENT_CARD: {
    baseBackground: BRUTALIST_COLORS.YELLOW,
    baseText: BRUTALIST_COLORS.BLACK,
    hoverBackground: BRUTALIST_COLORS.BLACK,
    hoverText: BRUTALIST_COLORS.YELLOW,
  },

  // Navigation patterns
  NAV_LINK: {
    baseBackground: "transparent",
    baseText: BRUTALIST_COLORS.BLACK,
    hoverBackground: "transparent",
    hoverText: BRUTALIST_COLORS.YELLOW,
  },
} as const;

/**
 * Validate all hover patterns on module load (development only)
 */
if (process.env.NODE_ENV === "development") {
  Object.entries(HOVER_PATTERNS).forEach(([patternName, config]) => {
    validateHoverState(config, `HOVER_PATTERNS.${patternName}`);
  });
}

/**
 * React hook for safe hover colors
 */
export function useSafeHoverColors(config: HoverStateConfig) {
  const safeColors = getSafeHoverColors(config);

  // Validate in development
  if (process.env.NODE_ENV === "development") {
    validateHoverState(config, "useSafeHoverColors");
  }

  return safeColors;
}

/**
 * Utility to check if a hover state combination is problematic
 */
export function isProblematicHoverCombination(
  hoverBackground: string,
  hoverText: string
): boolean {
  // White text on yellow background
  if (
    hoverBackground === BRUTALIST_COLORS.YELLOW &&
    hoverText === BRUTALIST_COLORS.WHITE
  ) {
    return true;
  }

  // Same color text and background
  if (hoverBackground === hoverText) {
    return true;
  }

  // Low contrast combinations
  const contrastRatio = getContrastRatio(hoverText, hoverBackground);
  return contrastRatio < 4.5;
}

/**
 * Get hover state CSS variables for dynamic styling
 */
export function getHoverStateVariables(
  config: HoverStateConfig
): Record<string, string> {
  const safeColors = getSafeHoverColors(config);

  return {
    "--hover-bg": safeColors.background,
    "--hover-text": safeColors.text,
    "--hover-contrast-ratio": safeColors.contrastRatio.toString(),
  };
}
