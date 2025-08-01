/**
 * Hover State Testing Utility
 *
 * This utility provides functions to test and verify that all hover states
 * maintain proper contrast ratios and don't create visibility issues.
 */

import { BRUTALIST_COLORS, getContrastRatio } from "@/lib/color-utils";

interface HoverTestResult {
  component: string;
  element: string;
  passed: boolean;
  contrastRatio: number;
  issue?: string;
  recommendation?: string;
}

/**
 * Test hover states for a component
 */
export function testComponentHoverStates(
  componentName: string,
  hoverStates: Array<{
    element: string;
    baseColors: { background: string; text: string };
    hoverColors: { background: string; text: string };
  }>
): HoverTestResult[] {
  const results: HoverTestResult[] = [];

  hoverStates.forEach(({ element, baseColors, hoverColors }) => {
    const contrastRatio = getContrastRatio(
      hoverColors.text,
      hoverColors.background
    );
    const passed = contrastRatio >= 4.5;

    let issue: string | undefined;
    let recommendation: string | undefined;

    if (!passed) {
      issue = `Insufficient contrast ratio (${contrastRatio.toFixed(2)}:1)`;
      recommendation = "Use colors with higher contrast ratio (minimum 4.5:1)";
    }

    // Check for specific problematic combinations
    if (
      hoverColors.background === BRUTALIST_COLORS.YELLOW &&
      hoverColors.text === BRUTALIST_COLORS.WHITE
    ) {
      issue = "White text on yellow background - severe visibility issue";
      recommendation = "Use black text on yellow background instead";
    }

    if (hoverColors.background === hoverColors.text) {
      issue = "Text and background are the same color - text will be invisible";
      recommendation = "Use contrasting colors for text and background";
    }

    results.push({
      component: componentName,
      element,
      passed: passed && !issue,
      contrastRatio,
      issue,
      recommendation,
    });
  });

  return results;
}

/**
 * Test all brutalist button hover states
 */
export function testBrutalistButtonHoverStates(): HoverTestResult[] {
  return testComponentHoverStates("BrutalistButton", [
    {
      element: "Primary Button",
      baseColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.WHITE,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.WHITE,
        text: BRUTALIST_COLORS.BLACK,
      },
    },
    {
      element: "Secondary Button",
      baseColors: {
        background: BRUTALIST_COLORS.WHITE,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.WHITE,
      },
    },
    {
      element: "Accent Button",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
  ]);
}

/**
 * Test navigation hover states
 */
export function testNavigationHoverStates(): HoverTestResult[] {
  return testComponentHoverStates("Navigation", [
    {
      element: "Desktop Nav Link",
      baseColors: { background: "transparent", text: BRUTALIST_COLORS.BLACK },
      hoverColors: { background: "transparent", text: BRUTALIST_COLORS.YELLOW },
    },
    {
      element: "Mobile Nav Link",
      baseColors: { background: "transparent", text: BRUTALIST_COLORS.BLACK },
      hoverColors: { background: "transparent", text: BRUTALIST_COLORS.YELLOW },
    },
    {
      element: "Get Quote Button",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
  ]);
}

/**
 * Test card hover states
 */
export function testCardHoverStates(): HoverTestResult[] {
  return testComponentHoverStates("BrutalistCard", [
    {
      element: "Default Card",
      baseColors: {
        background: BRUTALIST_COLORS.WHITE,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.WHITE,
      },
    },
    {
      element: "Accent Card",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
  ]);
}

/**
 * Test service grid hover states
 */
export function testServiceGridHoverStates(): HoverTestResult[] {
  return testComponentHoverStates("ServicesGrid", [
    {
      element: "Service Icon",
      baseColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
    },
    {
      element: "CTA Button",
      baseColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
    },
  ]);
}

/**
 * Test sticky contact button hover states
 */
export function testStickyContactButtonHoverStates(): HoverTestResult[] {
  return testComponentHoverStates("StickyContactButton", [
    {
      element: "Main Button (Yellow)",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
    {
      element: "Contact Option (White)",
      baseColors: {
        background: BRUTALIST_COLORS.WHITE,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.WHITE,
      },
    },
    {
      element: "Contact Option (Yellow)",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
    {
      element: "Get Quote Button",
      baseColors: {
        background: BRUTALIST_COLORS.YELLOW,
        text: BRUTALIST_COLORS.BLACK,
      },
      hoverColors: {
        background: BRUTALIST_COLORS.BLACK,
        text: BRUTALIST_COLORS.YELLOW,
      },
    },
  ]);
}

/**
 * Run comprehensive hover state tests
 */
export function runAllHoverStateTests(): {
  totalTests: number;
  passed: number;
  failed: number;
  results: HoverTestResult[];
} {
  const allResults: HoverTestResult[] = [
    ...testBrutalistButtonHoverStates(),
    ...testNavigationHoverStates(),
    ...testCardHoverStates(),
    ...testServiceGridHoverStates(),
    ...testStickyContactButtonHoverStates(),
  ];

  const passed = allResults.filter((result) => result.passed).length;
  const failed = allResults.filter((result) => !result.passed).length;

  return {
    totalTests: allResults.length,
    passed,
    failed,
    results: allResults,
  };
}

/**
 * Generate hover state test report
 */
export function generateHoverStateReport(): void {
  if (process.env.NODE_ENV !== "development") return;

  console.log("🧪 Running comprehensive hover state tests...");

  const testResults = runAllHoverStateTests();

  console.log("\n📊 Hover State Test Results:");
  console.log(`Total Tests: ${testResults.totalTests}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);

  if (testResults.failed > 0) {
    console.log("\n❌ Failed Tests:");
    testResults.results
      .filter((result) => !result.passed)
      .forEach((result) => {
        console.log(`  • ${result.component} - ${result.element}`);
        console.log(`    Issue: ${result.issue}`);
        console.log(`    Recommendation: ${result.recommendation}`);
        console.log(
          `    Contrast Ratio: ${result.contrastRatio.toFixed(2)}:1\n`
        );
      });
  }

  if (testResults.passed === testResults.totalTests) {
    console.log(
      "🎉 All hover state tests passed! No contrast issues detected."
    );
  }
}

/**
 * Validate hover states in browser (development only)
 */
export function validateBrowserHoverStates(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  console.log("🔍 Validating hover states in browser...");

  // Find all elements with hover classes
  const elementsWithHover = document.querySelectorAll('[class*="hover:"]');

  let issuesFound = 0;

  elementsWithHover.forEach((element, index) => {
    const className = element.className;

    // Check for problematic patterns
    if (
      className.includes("hover:text-white") &&
      className.includes("bg-yellow")
    ) {
      console.warn(
        `⚠️ Element ${index}: Potential white text on yellow background`,
        element
      );
      issuesFound++;
    }

    if (
      className.includes("hover:bg-yellow") &&
      className.includes("text-white")
    ) {
      console.warn(
        `⚠️ Element ${index}: Potential white text on yellow background`,
        element
      );
      issuesFound++;
    }

    // Check for missing hover-contrast-safe class
    if (
      className.includes("hover:") &&
      !className.includes("hover-contrast-safe")
    ) {
      console.info(
        `ℹ️ Element ${index}: Consider adding hover-contrast-safe class`,
        element
      );
    }
  });

  if (issuesFound === 0) {
    console.log("✅ No hover state issues found in browser validation");
  } else {
    console.log(`⚠️ Found ${issuesFound} potential hover state issues`);
  }
}

// Auto-run tests in development
if (process.env.NODE_ENV === "development") {
  // Run tests after a short delay to ensure all modules are loaded
  setTimeout(() => {
    generateHoverStateReport();

    // Run browser validation if in browser environment
    if (typeof window !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener(
          "DOMContentLoaded",
          validateBrowserHoverStates
        );
      } else {
        validateBrowserHoverStates();
      }
    }
  }, 1000);
}
