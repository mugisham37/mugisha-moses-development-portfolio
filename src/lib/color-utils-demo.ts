/**
 * Demo script to test color utility functions
 * Run this in the browser console or Node.js to verify functionality
 */

import {
  getContrastRatio,
  isAccessible,
  getSafeTextColor,
  getHoverColors,
  testColorCombinations,
  validateColorCombinations,
  logPaletteValidation,
  generateSafeColorCSS,
  BRUTALIST_COLORS,
} from "./color-utils";

/**
 * Run comprehensive tests of color utility functions
 */
export function runColorUtilityDemo(): void {
  console.log("🎨 Color Utility Functions Demo");
  console.log("================================");

  // Test 1: Basic contrast ratio calculations
  console.log("\n1. Contrast Ratio Calculations:");
  console.log(
    `Black on White: ${getContrastRatio(
      BRUTALIST_COLORS.BLACK,
      BRUTALIST_COLORS.WHITE
    )}:1`
  );
  console.log(
    `White on Yellow: ${getContrastRatio(
      BRUTALIST_COLORS.WHITE,
      BRUTALIST_COLORS.YELLOW
    )}:1`
  );
  console.log(
    `Black on Yellow: ${getContrastRatio(
      BRUTALIST_COLORS.BLACK,
      BRUTALIST_COLORS.YELLOW
    )}:1`
  );

  // Test 2: Accessibility checks
  console.log("\n2. Accessibility Checks:");
  const combinations = [
    {
      fg: BRUTALIST_COLORS.BLACK,
      bg: BRUTALIST_COLORS.WHITE,
      name: "Black on White",
    },
    {
      fg: BRUTALIST_COLORS.WHITE,
      bg: BRUTALIST_COLORS.YELLOW,
      name: "White on Yellow",
    },
    {
      fg: BRUTALIST_COLORS.BLACK,
      bg: BRUTALIST_COLORS.YELLOW,
      name: "Black on Yellow",
    },
    {
      fg: BRUTALIST_COLORS.WHITE,
      bg: BRUTALIST_COLORS.BLACK,
      name: "White on Black",
    },
  ];

  combinations.forEach(({ fg, bg, name }) => {
    const check = isAccessible(fg, bg);
    console.log(
      `${name}: ${check.passes ? "✅" : "❌"} ${check.contrastRatio}:1 (${
        check.wcagLevel
      })`
    );
  });

  // Test 3: Safe color recommendations
  console.log("\n3. Safe Color Recommendations:");
  const backgrounds = [
    BRUTALIST_COLORS.WHITE,
    BRUTALIST_COLORS.YELLOW,
    BRUTALIST_COLORS.BLACK,
    BRUTALIST_COLORS.LIGHT_GRAY,
  ];

  backgrounds.forEach((bg) => {
    const safeText = getSafeTextColor(bg);
    console.log(`Background ${bg} → Safe text: ${safeText}`);
  });

  // Test 4: Hover color suggestions
  console.log("\n4. Hover Color Suggestions:");
  const currentStates = [
    { bg: BRUTALIST_COLORS.WHITE, text: BRUTALIST_COLORS.BLACK },
    { bg: BRUTALIST_COLORS.YELLOW, text: BRUTALIST_COLORS.BLACK },
    { bg: BRUTALIST_COLORS.BLACK, text: BRUTALIST_COLORS.WHITE },
  ];

  currentStates.forEach(({ bg, text }) => {
    const hover = getHoverColors(bg);
    console.log(
      `${text} on ${bg} → Hover: ${hover.text} on ${hover.background}`
    );
  });

  // Test 5: Palette validation
  console.log("\n5. Brutalist Palette Validation:");
  logPaletteValidation(BRUTALIST_COLORS, "Brutalist Colors");

  // Test 6: Component validation example
  console.log("\n6. Component Validation Example:");
  validateColorCombinations(
    [
      {
        foreground: BRUTALIST_COLORS.BLACK,
        background: BRUTALIST_COLORS.WHITE,
        context: "Button text",
      },
      {
        foreground: BRUTALIST_COLORS.WHITE,
        background: BRUTALIST_COLORS.YELLOW,
        context: "Warning text (problematic)",
      },
      {
        foreground: BRUTALIST_COLORS.BLACK,
        background: BRUTALIST_COLORS.YELLOW,
        context: "Warning text (fixed)",
      },
    ],
    "BrutalistButton"
  );

  // Test 7: Test case runner
  console.log("\n7. Automated Test Cases:");
  const testResults = testColorCombinations([
    {
      name: "Black on white should pass",
      foreground: BRUTALIST_COLORS.BLACK,
      background: BRUTALIST_COLORS.WHITE,
      expectedToPass: true,
    },
    {
      name: "White on yellow should fail",
      foreground: BRUTALIST_COLORS.WHITE,
      background: BRUTALIST_COLORS.YELLOW,
      expectedToPass: false,
    },
    {
      name: "Black on yellow should pass",
      foreground: BRUTALIST_COLORS.BLACK,
      background: BRUTALIST_COLORS.YELLOW,
      expectedToPass: true,
    },
  ]);

  console.log(
    `Test Results: ${testResults.passed} passed, ${testResults.failed} failed`
  );
  testResults.results.forEach((result) => {
    console.log(`${result.passed ? "✅" : "❌"} ${result.name}`);
  });

  // Test 8: Generate CSS
  console.log("\n8. Generated CSS Variables:");
  const css = generateSafeColorCSS(BRUTALIST_COLORS);
  console.log(css);

  console.log("\n🎉 Demo completed! All functions are working correctly.");
}

/**
 * Quick validation for specific component colors
 */
export function validateComponentColors(): void {
  console.log("🔍 Component Color Validation");
  console.log("=============================");

  // Validate common component combinations
  const componentTests = [
    {
      component: "BrutalistButton (accent variant)",
      combinations: [
        {
          foreground: BRUTALIST_COLORS.BLACK,
          background: BRUTALIST_COLORS.YELLOW,
          context: "Normal state",
        },
        {
          foreground: BRUTALIST_COLORS.YELLOW,
          background: BRUTALIST_COLORS.BLACK,
          context: "Hover state",
        },
      ],
    },
    {
      component: "Navigation",
      combinations: [
        {
          foreground: BRUTALIST_COLORS.BLACK,
          background: BRUTALIST_COLORS.WHITE,
          context: "Light theme",
        },
        {
          foreground: BRUTALIST_COLORS.WHITE,
          background: BRUTALIST_COLORS.BLACK,
          context: "Dark theme",
        },
      ],
    },
    {
      component: "ServicesGrid",
      combinations: [
        {
          foreground: BRUTALIST_COLORS.BLACK,
          background: BRUTALIST_COLORS.WHITE,
          context: "Card title",
        },
        {
          foreground: BRUTALIST_COLORS.MEDIUM_GRAY,
          background: BRUTALIST_COLORS.WHITE,
          context: "Card description",
        },
      ],
    },
  ];

  componentTests.forEach(({ component, combinations }) => {
    validateColorCombinations(combinations, component);
  });
}

// Export for use in browser console or Node.js
if (typeof window !== "undefined") {
  // Browser environment
  const globalWindow = window as unknown as Record<string, unknown>;
  globalWindow.runColorUtilityDemo = runColorUtilityDemo;
  globalWindow.validateComponentColors = validateComponentColors;
  console.log("Color utility demo functions available:");
  console.log("- runColorUtilityDemo()");
  console.log("- validateComponentColors()");
}
