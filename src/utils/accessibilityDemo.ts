/**
 * Accessibility validation demonstration
 *
 * This file demonstrates the accessibility validation utilities
 * and can be used to test the implementation.
 */

import {
  checkWCAGCompliance,
  validateBrutalistTheme,
  ComponentAccessibilityValidator,
  runComprehensiveAccessibilityTests,
  generateAccessibilityReport,
  devAccessibilityChecker,
} from "./accessibility";

/**
 * Demonstrate basic WCAG compliance checking
 */
export function demonstrateWCAGChecking(): void {
  console.group("🧪 WCAG Compliance Checking Demo");

  // Test safe combinations
  const safeCheck = checkWCAGCompliance("#000000", "#ffffff");
  console.log("✅ Black on white:", safeCheck);

  // Test unsafe combinations
  const unsafeCheck = checkWCAGCompliance("#ffffff", "#ffff00");
  console.log("❌ White on yellow:", unsafeCheck);

  // Test large text
  const largeTextCheck = checkWCAGCompliance("#666666", "#ffffff", {
    isLargeText: true,
  });
  console.log("📝 Gray on white (large text):", largeTextCheck);

  // Test focus indicator
  const focusCheck = checkWCAGCompliance("#ffff00", "#000000", {
    isFocusIndicator: true,
  });
  console.log("🎯 Yellow focus on black:", focusCheck);

  console.groupEnd();
}

/**
 * Demonstrate component validation
 */
export function demonstrateComponentValidation(): void {
  console.group("🎨 Component Validation Demo");

  const validator = new ComponentAccessibilityValidator("DemoButton");

  validator
    .addTextValidation("#000000", "#ffffff", "Button text")
    .addTextValidation("#ffffff", "#000000", "Button hover text")
    .addFocusValidation("#ffff00", "#000000", "Button focus outline")
    .addNonTextValidation("#666666", "#ffffff", "Button icon");

  const result = validator.validate();
  console.log("Component validation result:", result);

  console.groupEnd();
}

/**
 * Demonstrate brutalist theme validation
 */
export function demonstrateBrutalistValidation(): void {
  console.group("🎭 Brutalist Theme Validation Demo");

  const themeResult = validateBrutalistTheme();
  console.log("Brutalist theme validation:", themeResult);

  console.groupEnd();
}

/**
 * Demonstrate comprehensive testing
 */
export function demonstrateComprehensiveTesting(): void {
  console.group("🔬 Comprehensive Testing Demo");

  const testResults = runComprehensiveAccessibilityTests();
  console.log("Test results summary:");

  testResults.forEach((result) => {
    console.log(
      `${result.summary.overallPassed ? "✅" : "❌"} ${result.suiteName}: ${
        result.passedTests
      }/${result.totalTests}`
    );
  });

  console.groupEnd();
}

/**
 * Demonstrate report generation
 */
export function demonstrateReportGeneration(): void {
  console.group("📊 Report Generation Demo");

  const report = generateAccessibilityReport();
  console.log("Generated accessibility report:");
  console.log(report);

  console.groupEnd();
}

/**
 * Demonstrate development checker
 */
export function demonstrateDevelopmentChecker(): void {
  if (typeof window === "undefined") {
    console.log("⚠️ Development checker requires browser environment");
    return;
  }

  console.group("🔍 Development Checker Demo");

  // Validate some color combinations
  devAccessibilityChecker.validateColors("DemoComponent", [
    {
      foreground: "#000000",
      background: "#ffffff",
      context: "Safe combination",
    },
    {
      foreground: "#ffffff",
      background: "#ffff00",
      context: "Unsafe combination",
    },
  ]);

  // Get validation results
  const results = devAccessibilityChecker.getValidationResults();
  console.log("Development checker results:", results);

  console.groupEnd();
}

/**
 * Run all demonstrations
 */
export function runAllDemonstrations(): void {
  console.log("🚀 Starting Accessibility Validation Demonstrations");
  console.log("=".repeat(50));

  demonstrateWCAGChecking();
  demonstrateComponentValidation();
  demonstrateBrutalistValidation();
  demonstrateComprehensiveTesting();
  demonstrateReportGeneration();
  demonstrateDevelopmentChecker();

  console.log("=".repeat(50));
  console.log("✅ All demonstrations completed");
}

/**
 * Quick validation of brutalist portfolio colors
 */
export function validatePortfolioColors(): void {
  console.group("🎨 Portfolio Color Validation");

  const brutalistColors = {
    black: "#000000",
    white: "#ffffff",
    yellow: "#ffff00",
    darkGray: "#2a2a2a",
    mediumGray: "#666666",
    lightGray: "#f5f5f5",
  };

  // Test common combinations
  const combinations = [
    {
      fg: brutalistColors.black,
      bg: brutalistColors.white,
      name: "Black on white",
    },
    {
      fg: brutalistColors.white,
      bg: brutalistColors.black,
      name: "White on black",
    },
    {
      fg: brutalistColors.black,
      bg: brutalistColors.yellow,
      name: "Black on yellow",
    },
    {
      fg: brutalistColors.white,
      bg: brutalistColors.yellow,
      name: "White on yellow (should fail)",
    },
    {
      fg: brutalistColors.mediumGray,
      bg: brutalistColors.white,
      name: "Medium gray on white",
    },
    {
      fg: brutalistColors.lightGray,
      bg: brutalistColors.white,
      name: "Light gray on white (should fail)",
    },
  ];

  combinations.forEach(({ fg, bg, name }) => {
    const result = checkWCAGCompliance(fg, bg);
    const status = result.passes ? "✅" : "❌";
    console.log(
      `${status} ${name}: ${result.contrastRatio}:1 (${result.wcagLevel})`
    );
  });

  console.groupEnd();
}

// Export for use in browser console during development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).accessibilityDemo = {
    runAll: runAllDemonstrations,
    wcag: demonstrateWCAGChecking,
    component: demonstrateComponentValidation,
    brutalist: demonstrateBrutalistValidation,
    testing: demonstrateComprehensiveTesting,
    report: demonstrateReportGeneration,
    devChecker: demonstrateDevelopmentChecker,
    portfolio: validatePortfolioColors,
  };

  console.log(
    "🔧 Accessibility demo functions available at window.accessibilityDemo"
  );
}
