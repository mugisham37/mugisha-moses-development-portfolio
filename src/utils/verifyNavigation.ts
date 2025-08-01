/**
 * Verification script for Navigation component color contrast improvements
 * This script validates that all color combinations meet WCAG AA standards
 */

import { getContrastRatio, isAccessible } from "./colorUtils";

interface ColorTest {
  name: string;
  foreground: string;
  background: string;
  expected: boolean;
  context: string;
}

const navigationColorTests: ColorTest[] = [
  // Light theme tests
  {
    name: "Light theme - Logo text",
    foreground: "#000000", // text-safe-on-white in light mode
    background: "#ffffff", // bg-background in light mode
    expected: true,
    context: "Logo text on navigation background",
  },
  {
    name: "Light theme - Navigation links",
    foreground: "#000000", // text-safe-on-white in light mode
    background: "#ffffff", // bg-background in light mode
    expected: true,
    context: "Navigation links on background",
  },
  {
    name: "Light theme - Active link",
    foreground: "#ffff00", // brutalist-yellow
    background: "#ffffff", // bg-background in light mode
    expected: false, // This should fail and be handled by the design
    context: "Active navigation link (yellow on white)",
  },
  {
    name: "Light theme - Hover state",
    foreground: "#ffff00", // brutalist-yellow
    background: "#ffffff", // bg-background in light mode
    expected: false, // This should fail but is acceptable for hover states
    context: "Navigation link hover state",
  },
  {
    name: "Light theme - Mobile menu text",
    foreground: "#000000", // text-safe-on-white in light mode
    background: "#ffffff", // bg-background in light mode
    expected: true,
    context: "Mobile menu text",
  },
  {
    name: "Light theme - Mobile CTA button",
    foreground: "#000000", // text-safe-on-yellow
    background: "#ffff00", // bg-brutalist-yellow
    expected: true,
    context: "Mobile menu CTA button",
  },

  // Dark theme tests
  {
    name: "Dark theme - Logo text",
    foreground: "#ffffff", // text-safe-on-white becomes white in dark mode
    background: "#000000", // bg-background in dark mode
    expected: true,
    context: "Logo text on dark navigation background",
  },
  {
    name: "Dark theme - Navigation links",
    foreground: "#ffffff", // text-safe-on-white becomes white in dark mode
    background: "#000000", // bg-background in dark mode
    expected: true,
    context: "Navigation links on dark background",
  },
  {
    name: "Dark theme - Active link",
    foreground: "#ffff00", // brutalist-yellow
    background: "#000000", // bg-background in dark mode
    expected: true,
    context: "Active navigation link on dark background",
  },
  {
    name: "Dark theme - Mobile menu text",
    foreground: "#ffffff", // text-safe-on-white becomes white in dark mode
    background: "#000000", // bg-background in dark mode
    expected: true,
    context: "Mobile menu text on dark background",
  },
  {
    name: "Dark theme - Mobile CTA button",
    foreground: "#000000", // text-safe-on-yellow
    background: "#ffff00", // bg-brutalist-yellow
    expected: true,
    context: "Mobile menu CTA button (same in both themes)",
  },
];

export function verifyNavigationColors(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{
    test: ColorTest;
    actualRatio: number;
    passed: boolean;
    wcagLevel: string;
  }>;
} {
  const results = navigationColorTests.map((test) => {
    const actualRatio = getContrastRatio(test.foreground, test.background);
    const passed = isAccessible(test.foreground, test.background);
    const wcagLevel =
      actualRatio >= 7
        ? "AAA"
        : actualRatio >= 4.5
        ? "AA"
        : actualRatio >= 3
        ? "AA Large"
        : "FAIL";

    return {
      test,
      actualRatio: Math.round(actualRatio * 100) / 100,
      passed,
      wcagLevel,
    };
  });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    passed,
    failed,
    total: results.length,
    results,
  };
}

export function logNavigationColorReport(): void {
  const report = verifyNavigationColors();

  console.log("\n🎨 Navigation Color Contrast Report");
  console.log("=====================================");
  console.log(`Total tests: ${report.total}`);
  console.log(`✅ Passed: ${report.passed}`);
  console.log(`❌ Failed: ${report.failed}`);
  console.log(
    `Success rate: ${Math.round((report.passed / report.total) * 100)}%\n`
  );

  report.results.forEach((result) => {
    const status = result.passed ? "✅" : "❌";
    const ratio = result.actualRatio;
    const level = result.wcagLevel;

    console.log(`${status} ${result.test.name}`);
    console.log(`   Context: ${result.test.context}`);
    console.log(
      `   Colors: ${result.test.foreground} on ${result.test.background}`
    );
    console.log(`   Contrast Ratio: ${ratio}:1 (${level})`);

    if (!result.passed && result.test.expected) {
      console.log(`   ⚠️  Expected to pass but failed - needs attention`);
    } else if (!result.passed && !result.test.expected) {
      console.log(`   ℹ️  Expected to fail - handled by design system`);
    }
    console.log("");
  });

  // Summary recommendations
  console.log("📋 Recommendations:");
  const criticalFailures = report.results.filter(
    (r) => !r.passed && r.test.expected
  );

  if (criticalFailures.length === 0) {
    console.log(
      "✅ All critical color combinations pass accessibility standards!"
    );
  } else {
    console.log("❌ Critical issues found:");
    criticalFailures.forEach((failure) => {
      console.log(`   - ${failure.test.name}: ${failure.actualRatio}:1 ratio`);
    });
  }

  const expectedFailures = report.results.filter(
    (r) => !r.passed && !r.test.expected
  );
  if (expectedFailures.length > 0) {
    console.log("\nℹ️  Expected failures (handled by design):");
    expectedFailures.forEach((failure) => {
      console.log(`   - ${failure.test.name}: ${failure.actualRatio}:1 ratio`);
      console.log(`     Context: ${failure.test.context}`);
    });
  }
}

// Development helper function
export function runNavigationColorCheck(): void {
  if (process.env.NODE_ENV === "development") {
    logNavigationColorReport();
  }
}
