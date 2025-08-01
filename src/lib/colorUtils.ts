/**
 * Color utility functions for ensuring proper contrast ratios
 * and accessibility compliance according to WCAG 2.1 AA standards
 */

// Color definitions
export const BRUTALIST_COLORS = {
  black: "#000000",
  white: "#ffffff",
  yellow: "#ffff00",
  gray: "#808080",
  darkGray: "#2a2a2a",
  lightGray: "#f5f5f5",
  mediumGray: "#666666",
} as const;

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
function getRelativeLuminance(r: number, g: number, b: number): number {
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

  if (!rgb1 || !rgb2) {
    throw new Error("Invalid color format. Please use hex colors.");
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG 2.1 AA standards
 */
export function isAccessible(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const contrastRatio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  return contrastRatio >= requiredRatio;
}

/**
 * Get safe text color for a given background
 */
export function getSafeTextColor(background: string): string {
  const blackContrast = getContrastRatio(BRUTALIST_COLORS.black, background);
  const whiteContrast = getContrastRatio(BRUTALIST_COLORS.white, background);

  // Return the color with higher contrast ratio
  return blackContrast > whiteContrast
    ? BRUTALIST_COLORS.black
    : BRUTALIST_COLORS.white;
}

/**
 * Get safe background color for a given text color
 */
export function getSafeBackgroundColor(text: string): string {
  const whiteContrast = getContrastRatio(text, BRUTALIST_COLORS.white);
  const blackContrast = getContrastRatio(text, BRUTALIST_COLORS.black);
  const yellowContrast = getContrastRatio(text, BRUTALIST_COLORS.yellow);

  // Find the background with the highest contrast ratio
  const contrasts = [
    { color: BRUTALIST_COLORS.white, ratio: whiteContrast },
    { color: BRUTALIST_COLORS.black, ratio: blackContrast },
    { color: BRUTALIST_COLORS.yellow, ratio: yellowContrast },
  ];

  const bestContrast = contrasts.reduce((prev, current) =>
    prev.ratio > current.ratio ? prev : current
  );

  return bestContrast.color;
}

/**
 * Get hover colors that maintain proper contrast
 */
export function getHoverColors(
  currentBg: string,
  currentText: string
): {
  background: string;
  text: string;
} {
  // Define hover color mappings based on current background
  const hoverMappings: Record<string, { background: string; text: string }> = {
    [BRUTALIST_COLORS.white]: {
      background: BRUTALIST_COLORS.black,
      text: BRUTALIST_COLORS.white,
    },
    [BRUTALIST_COLORS.black]: {
      background: BRUTALIST_COLORS.white,
      text: BRUTALIST_COLORS.black,
    },
    [BRUTALIST_COLORS.yellow]: {
      background: BRUTALIST_COLORS.black,
      text: BRUTALIST_COLORS.yellow,
    },
  };

  return (
    hoverMappings[currentBg] || {
      background: getSafeBackgroundColor(currentText),
      text: getSafeTextColor(currentBg),
    }
  );
}

/**
 * Validate all color combinations and return accessibility report
 */
export function validateColorCombinations(): {
  combination: { foreground: string; background: string };
  contrastRatio: number;
  wcagLevel: "AA" | "AAA" | "FAIL";
  isLargeText: boolean;
  passes: boolean;
}[] {
  const combinations = [
    // Primary combinations
    { fg: BRUTALIST_COLORS.black, bg: BRUTALIST_COLORS.white },
    { fg: BRUTALIST_COLORS.white, bg: BRUTALIST_COLORS.black },
    { fg: BRUTALIST_COLORS.black, bg: BRUTALIST_COLORS.yellow },
    { fg: BRUTALIST_COLORS.yellow, bg: BRUTALIST_COLORS.black },

    // Secondary combinations
    { fg: BRUTALIST_COLORS.mediumGray, bg: BRUTALIST_COLORS.white },
    { fg: BRUTALIST_COLORS.white, bg: BRUTALIST_COLORS.darkGray },
    { fg: BRUTALIST_COLORS.black, bg: BRUTALIST_COLORS.lightGray },
  ];

  return combinations.map(({ fg, bg }) => {
    const contrastRatio = getContrastRatio(fg, bg);
    const passesAA = contrastRatio >= 4.5;
    const passesAAA = contrastRatio >= 7;

    return {
      combination: { foreground: fg, background: bg },
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      wcagLevel: passesAAA ? "AAA" : passesAA ? "AA" : "FAIL",
      isLargeText: false,
      passes: passesAA,
    };
  });
}

/**
 * Development helper to log contrast warnings
 */
export function logContrastWarning(
  foreground: string,
  background: string,
  component: string
): void {
  if (process.env.NODE_ENV === "development") {
    const contrastRatio = getContrastRatio(foreground, background);
    if (contrastRatio < 4.5) {
      console.warn(
        `⚠️ Low contrast ratio (${contrastRatio.toFixed(2)}) in ${component}:`,
        `${foreground} on ${background}`
      );
    }
  }
}
