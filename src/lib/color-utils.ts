/**
 * Color utility functions for contrast ratio calculations and accessibility validation
 * Implements WCAG 2.1 AA standards for color contrast
 */

// Color configuration interfaces
export interface ColorConfig {
  name: string;
  hex: string;
  contrastRatio: number;
  safeTextColors: string[];
  safeBackgroundColors: string[];
  hoverStates: {
    background: string;
    text: string;
  };
}

export interface AccessibilityCheck {
  combination: {
    foreground: string;
    background: string;
  };
  contrastRatio: number;
  wcagLevel: "AA" | "AAA" | "FAIL";
  isLargeText: boolean;
  passes: boolean;
}

// Brutalist color constants
export const BRUTALIST_COLORS = {
  BLACK: "#000000",
  WHITE: "#ffffff",
  YELLOW: "#ffff00",
  GRAY: "#808080",
  DARK_GRAY: "#2a2a2a",
  LIGHT_GRAY: "#f5f5f5",
  MEDIUM_GRAY: "#666666",
} as const;

// WCAG contrast ratio thresholds
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (with or without #)
 * @returns RGB object with r, g, b values (0-255)
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  // Remove # if present and ensure 6 characters
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) {
    console.warn(`Invalid hex color: ${hex}`);
    return null;
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color according to WCAG formula
 * @param rgb - RGB color object
 * @returns Relative luminance value (0-1)
 */
export function getRelativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  // Convert RGB to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  // Apply gamma correction
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors according to WCAG formula
 * @param color1 - First color (hex string)
 * @param color2 - Second color (hex string)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    console.warn(`Invalid color format: ${color1} or ${color2}`);
    return 1;
  }

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  // Ensure lighter color is in numerator
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG accessibility standards
 * @param foreground - Foreground color (hex string)
 * @param background - Background color (hex string)
 * @param isLargeText - Whether text is considered large (18pt+ or 14pt+ bold)
 * @returns Accessibility check result
 */
export function isAccessible(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): AccessibilityCheck {
  const contrastRatio = getContrastRatio(foreground, background);

  const aaThreshold = isLargeText
    ? WCAG_THRESHOLDS.AA_LARGE
    : WCAG_THRESHOLDS.AA_NORMAL;
  const aaaThreshold = isLargeText
    ? WCAG_THRESHOLDS.AAA_LARGE
    : WCAG_THRESHOLDS.AAA_NORMAL;

  let wcagLevel: "AA" | "AAA" | "FAIL";
  if (contrastRatio >= aaaThreshold) {
    wcagLevel = "AAA";
  } else if (contrastRatio >= aaThreshold) {
    wcagLevel = "AA";
  } else {
    wcagLevel = "FAIL";
  }

  return {
    combination: {
      foreground,
      background,
    },
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    wcagLevel,
    isLargeText,
    passes: wcagLevel !== "FAIL",
  };
}

/**
 * Get safe text color for a given background color
 * @param background - Background color (hex string)
 * @param isLargeText - Whether text is considered large
 * @returns Safe text color (hex string)
 */
export function getSafeTextColor(
  background: string,
  isLargeText: boolean = false
): string {
  // Test against brutalist color palette
  const textOptions = [
    BRUTALIST_COLORS.BLACK,
    BRUTALIST_COLORS.WHITE,
    BRUTALIST_COLORS.MEDIUM_GRAY,
    BRUTALIST_COLORS.DARK_GRAY,
  ];

  // Find the option with the highest contrast ratio that meets accessibility standards
  let bestOption: string = BRUTALIST_COLORS.BLACK;
  let bestRatio = 0;

  for (const textColor of textOptions) {
    const check = isAccessible(textColor, background, isLargeText);
    if (check.passes && check.contrastRatio > bestRatio) {
      bestOption = textColor;
      bestRatio = check.contrastRatio;
    }
  }

  return bestOption;
}

/**
 * Get safe background color for a given text color
 * @param text - Text color (hex string)
 * @param isLargeText - Whether text is considered large
 * @returns Safe background color (hex string)
 */
export function getSafeBackgroundColor(
  text: string,
  isLargeText: boolean = false
): string {
  // Test against brutalist color palette
  const backgroundOptions = [
    BRUTALIST_COLORS.WHITE,
    BRUTALIST_COLORS.BLACK,
    BRUTALIST_COLORS.LIGHT_GRAY,
    BRUTALIST_COLORS.YELLOW,
    BRUTALIST_COLORS.DARK_GRAY,
  ];

  // Find the option with the highest contrast ratio that meets accessibility standards
  let bestOption: string = BRUTALIST_COLORS.WHITE;
  let bestRatio = 0;

  for (const bgColor of backgroundOptions) {
    const check = isAccessible(text, bgColor, isLargeText);
    if (check.passes && check.contrastRatio > bestRatio) {
      bestOption = bgColor;
      bestRatio = check.contrastRatio;
    }
  }

  return bestOption;
}

/**
 * Get appropriate hover colors for current background and text combination
 * @param currentBg - Current background color (hex string)
 * @param currentText - Current text color (hex string)
 * @returns Object with safe hover background and text colors
 */
export function getHoverColors(
  currentBg: string
): {
  background: string;
  text: string;
} {
  // Brutalist hover patterns
  const hoverPatterns = [
    // White background -> Black background with white text
    {
      from: BRUTALIST_COLORS.WHITE,
      to: { background: BRUTALIST_COLORS.BLACK, text: BRUTALIST_COLORS.WHITE },
    },
    // Yellow background -> Black background with yellow text
    {
      from: BRUTALIST_COLORS.YELLOW,
      to: { background: BRUTALIST_COLORS.BLACK, text: BRUTALIST_COLORS.YELLOW },
    },
    // Black background -> White background with black text
    {
      from: BRUTALIST_COLORS.BLACK,
      to: { background: BRUTALIST_COLORS.WHITE, text: BRUTALIST_COLORS.BLACK },
    },
    // Light gray background -> Dark gray background with white text
    {
      from: BRUTALIST_COLORS.LIGHT_GRAY,
      to: {
        background: BRUTALIST_COLORS.DARK_GRAY,
        text: BRUTALIST_COLORS.WHITE,
      },
    },
  ];

  // Find matching pattern
  const pattern = hoverPatterns.find((p) => p.from === currentBg);
  if (pattern) {
    return pattern.to;
  }

  // Fallback: invert colors if no pattern matches
  if (
    currentBg === BRUTALIST_COLORS.WHITE ||
    currentBg === BRUTALIST_COLORS.LIGHT_GRAY
  ) {
    return {
      background: BRUTALIST_COLORS.BLACK,
      text: BRUTALIST_COLORS.WHITE,
    };
  } else {
    return {
      background: BRUTALIST_COLORS.WHITE,
      text: BRUTALIST_COLORS.BLACK,
    };
  }
}

/**
 * Development-time validation helpers
 */

/**
 * Validate all color combinations in a component and log warnings for accessibility issues
 * @param combinations - Array of color combinations to validate
 * @param componentName - Name of the component being validated (for logging)
 */
export function validateColorCombinations(
  combinations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
  }>,
  componentName: string
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.group(`🎨 Color Accessibility Check: ${componentName}`);

  let hasIssues = false;

  combinations.forEach(
    ({ foreground, background, context, isLargeText = false }) => {
      const check = isAccessible(foreground, background, isLargeText);

      if (!check.passes) {
        hasIssues = true;
        console.warn(
          `❌ ${context}: Insufficient contrast ratio ${
            check.contrastRatio
          }:1 (needs ${
            isLargeText ? WCAG_THRESHOLDS.AA_LARGE : WCAG_THRESHOLDS.AA_NORMAL
          }:1)`,
          {
            foreground,
            background,
            suggestion: `Use ${getSafeTextColor(
              background,
              isLargeText
            )} text on ${background} background`,
          }
        );
      } else {
        console.log(
          `✅ ${context}: Good contrast ratio ${check.contrastRatio}:1 (${check.wcagLevel})`,
          { foreground, background }
        );
      }
    }
  );

  if (!hasIssues) {
    console.log("🎉 All color combinations pass accessibility standards!");
  }

  console.groupEnd();
}

/**
 * Create a development-time color palette validator
 * @param palette - Object containing color definitions
 * @returns Validation results for all possible combinations
 */
export function validateColorPalette(palette: Record<string, string>): {
  totalCombinations: number;
  passingCombinations: number;
  failingCombinations: Array<{
    foreground: string;
    background: string;
    contrastRatio: number;
    suggestion: string;
  }>;
} {
  const colors = Object.entries(palette);
  const results = {
    totalCombinations: 0,
    passingCombinations: 0,
    failingCombinations: [] as Array<{
      foreground: string;
      background: string;
      contrastRatio: number;
      suggestion: string;
    }>,
  };

  // Test all combinations
  for (const [fgName, fgColor] of colors) {
    for (const [bgName, bgColor] of colors) {
      if (fgName === bgName) continue; // Skip same color combinations

      results.totalCombinations++;
      const check = isAccessible(fgColor, bgColor);

      if (check.passes) {
        results.passingCombinations++;
      } else {
        results.failingCombinations.push({
          foreground: `${fgName} (${fgColor})`,
          background: `${bgName} (${bgColor})`,
          contrastRatio: check.contrastRatio,
          suggestion: `Use ${getSafeTextColor(bgColor)} text instead`,
        });
      }
    }
  }

  return results;
}

/**
 * Generate CSS custom properties for safe color combinations
 * @param basePalette - Base color palette
 * @returns CSS custom properties string
 */
export function generateSafeColorCSS(
  basePalette: Record<string, string>
): string {
  let css = ":root {\n";

  // Add base colors
  Object.entries(basePalette).forEach(([name, color]) => {
    css += `  --color-${name.toLowerCase().replace(/_/g, "-")}: ${color};\n`;
  });

  css += "\n  /* Safe text-on-background combinations */\n";

  // Generate safe combinations
  Object.entries(basePalette).forEach(([bgName, bgColor]) => {
    const safeTextColor = getSafeTextColor(bgColor);
    const safeTextName =
      Object.entries(basePalette).find(
        ([, color]) => color === safeTextColor
      )?.[0] || "unknown";

    css += `  --text-on-${bgName
      .toLowerCase()
      .replace(/_/g, "-")}: var(--color-${safeTextName
      .toLowerCase()
      .replace(/_/g, "-")});\n`;
  });

  css += "\n  /* Hover state combinations */\n";

  // Generate hover combinations
  Object.entries(basePalette).forEach(([bgName, bgColor]) => {
    const hoverColors = getHoverColors(bgColor);

    const hoverBgName =
      Object.entries(basePalette).find(
        ([, color]) => color === hoverColors.background
      )?.[0] || "unknown";
    const hoverTextName =
      Object.entries(basePalette).find(
        ([, color]) => color === hoverColors.text
      )?.[0] || "unknown";

    css += `  --hover-bg-from-${bgName
      .toLowerCase()
      .replace(/_/g, "-")}: var(--color-${hoverBgName
      .toLowerCase()
      .replace(/_/g, "-")});\n`;
    css += `  --hover-text-from-${bgName
      .toLowerCase()
      .replace(/_/g, "-")}: var(--color-${hoverTextName
      .toLowerCase()
      .replace(/_/g, "-")});\n`;
  });

  css += "}\n";

  return css;
}

/**
 * Development helper to test color combinations programmatically
 * @param testCases - Array of test cases with expected results
 * @returns Test results
 */
export function testColorCombinations(
  testCases: Array<{
    name: string;
    foreground: string;
    background: string;
    expectedToPass: boolean;
    isLargeText?: boolean;
  }>
): {
  passed: number;
  failed: number;
  results: Array<{
    name: string;
    passed: boolean;
    expected: boolean;
    actual: AccessibilityCheck;
  }>;
} {
  const results = {
    passed: 0,
    failed: 0,
    results: [] as Array<{
      name: string;
      passed: boolean;
      expected: boolean;
      actual: AccessibilityCheck;
    }>,
  };

  testCases.forEach((testCase) => {
    const check = isAccessible(
      testCase.foreground,
      testCase.background,
      testCase.isLargeText
    );
    const testPassed = check.passes === testCase.expectedToPass;

    if (testPassed) {
      results.passed++;
    } else {
      results.failed++;
    }

    results.results.push({
      name: testCase.name,
      passed: testPassed,
      expected: testCase.expectedToPass,
      actual: check,
    });
  });

  return results;
}

/**
 * Log color palette validation results to console (development only)
 * @param palette - Color palette to validate
 * @param paletteName - Name of the palette for logging
 */
export function logPaletteValidation(
  palette: Record<string, string>,
  paletteName: string = "Color Palette"
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const validation = validateColorPalette(palette);

  console.group(`🎨 ${paletteName} Validation`);
  console.log(`Total combinations tested: ${validation.totalCombinations}`);
  console.log(`Passing combinations: ${validation.passingCombinations}`);
  console.log(`Failing combinations: ${validation.failingCombinations.length}`);

  if (validation.failingCombinations.length > 0) {
    console.group("❌ Failing combinations:");
    validation.failingCombinations.forEach((combo) => {
      console.warn(
        `${combo.foreground} on ${combo.background}: ${combo.contrastRatio}:1`,
        {
          suggestion: combo.suggestion,
        }
      );
    });
    console.groupEnd();
  } else {
    console.log("🎉 All combinations pass WCAG AA standards!");
  }

  console.groupEnd();
}
