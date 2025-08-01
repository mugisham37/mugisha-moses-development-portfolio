/**
 * Accessibility utilities index
 *
 * This file exports all accessibility-related utilities for easy importing
 * throughout the application.
 */

// Core accessibility validation
export {
  checkWCAGCompliance,
  validateColorCombinations,
  ComponentAccessibilityValidator,
  validateSingleCombination,
  createAccessibilityTestSuite,
  validateBrutalistTheme,
  logAccessibilityWarnings,
  WCAG_STANDARDS,
  type AccessibilityCheck,
  type ValidationResult,
} from "./accessibilityValidator";

// Development-time checking
export {
  DevAccessibilityChecker,
  devAccessibilityChecker,
  validateComponentColors,
  checkColorContrast,
  useAccessibilityValidation,
  validateThemeChange,
} from "./devAccessibilityChecker";

// Programmatic testing
export {
  AccessibilityTestRunner,
  accessibilityTestRunner,
  runComprehensiveAccessibilityTests,
  generateAccessibilityReport,
  quickAccessibilityCheck,
  BRUTALIST_TEST_SUITES,
  type TestSuite,
  type TestResults,
} from "./accessibilityTestRunner";

// Enhanced color utilities with accessibility integration
export {
  validateComponentAccessibility,
  validateColorPair,
  validateButtonColors,
  validateHeroColors,
  validateServicesColors,
  validateThemeColors,
} from "./colorUtils";

/**
 * Initialize accessibility checking for the application
 */
export function initializeAccessibilityChecking(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Initializing accessibility checking...");

    // Import the function dynamically to avoid circular dependencies
    import("./accessibilityTestRunner").then(({ quickAccessibilityCheck }) => {
      setTimeout(() => {
        const results = quickAccessibilityCheck();

        if (results.overallPassed) {
          console.log("✅ Initial accessibility check passed");
        } else {
          console.warn("⚠️ Initial accessibility check found issues");
        }
      }, 2000); // Wait for app to initialize
    });
  }
}

/**
 * Validate all components in the application
 */
export function validateAllComponents(): void {
  if (process.env.NODE_ENV !== "development") return;

  console.group("🎨 Validating all component colors");

  // Import the functions dynamically to avoid circular dependencies
  import("./colorUtils").then(
    ({
      validateThemeColors,
      validateButtonColors,
      validateHeroColors,
      validateServicesColors,
    }) => {
      // Validate theme colors
      validateThemeColors("light");
      validateThemeColors("dark");

      // Validate specific components
      validateButtonColors("primary");
      validateButtonColors("secondary");
      validateButtonColors("accent");
      validateHeroColors();
      validateServicesColors();

      console.groupEnd();
    }
  );
}

/**
 * Quick development helper to check a color combination
 */
export function devCheckColors(
  foreground: string,
  background: string,
  context: string = "Manual check"
): void {
  if (process.env.NODE_ENV !== "development") return;

  // Import the function dynamically to avoid circular dependencies
  import("./accessibilityValidator").then(({ validateSingleCombination }) => {
    const result = validateSingleCombination(foreground, background, context);

    console.log(
      `${result.passes ? "✅" : "❌"} ${context}: ${result.contrastRatio}:1 (${
        result.wcagLevel
      })`,
      { foreground, background }
    );
  });
}

/**
 * Export convenience constants
 */
export const BRUTALIST_COLORS = {
  BLACK: "#000000",
  WHITE: "#ffffff",
  YELLOW: "#ffff00",
  DARK_GRAY: "#2a2a2a",
  MEDIUM_GRAY: "#666666",
  LIGHT_GRAY: "#f5f5f5",
} as const;

export const SAFE_COMBINATIONS = [
  { fg: BRUTALIST_COLORS.BLACK, bg: BRUTALIST_COLORS.WHITE },
  { fg: BRUTALIST_COLORS.WHITE, bg: BRUTALIST_COLORS.BLACK },
  { fg: BRUTALIST_COLORS.BLACK, bg: BRUTALIST_COLORS.YELLOW },
  { fg: BRUTALIST_COLORS.WHITE, bg: BRUTALIST_COLORS.DARK_GRAY },
  { fg: BRUTALIST_COLORS.MEDIUM_GRAY, bg: BRUTALIST_COLORS.WHITE },
] as const;

export const UNSAFE_COMBINATIONS = [
  { fg: BRUTALIST_COLORS.WHITE, bg: BRUTALIST_COLORS.YELLOW },
  { fg: BRUTALIST_COLORS.YELLOW, bg: BRUTALIST_COLORS.WHITE },
  { fg: BRUTALIST_COLORS.LIGHT_GRAY, bg: BRUTALIST_COLORS.WHITE },
] as const;
