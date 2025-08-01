/**
 * Programmatic accessibility test runner
 *
 * This utility provides automated testing capabilities for color contrast
 * and accessibility compliance across the entire application.
 */

import {
  createAccessibilityTestSuite,
  validateBrutalistTheme,
  checkWCAGCompliance,
  type ValidationResult,
  type AccessibilityCheck,
} from "./accessibilityValidator";

export interface TestSuite {
  name: string;
  tests: Array<{
    name: string;
    combinations: Array<{
      foreground: string;
      background: string;
      context: string;
      shouldPass: boolean;
      isLargeText?: boolean;
      isFocusIndicator?: boolean;
      isNonText?: boolean;
    }>;
  }>;
}

export interface TestResults {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: Array<{
    testName: string;
    passed: boolean;
    results: Array<{
      context: string;
      expected: boolean;
      actual: boolean;
      passed: boolean;
      contrastRatio: number;
    }>;
  }>;
  summary: {
    overallPassed: boolean;
    successRate: number;
  };
}

/**
 * Accessibility test runner class
 */
export class AccessibilityTestRunner {
  private testSuites: TestSuite[] = [];

  /**
   * Add a test suite
   */
  addTestSuite(testSuite: TestSuite): this {
    this.testSuites.push(testSuite);
    return this;
  }

  /**
   * Run all test suites
   */
  runAllTests(): TestResults[] {
    return this.testSuites.map((suite) => this.runTestSuite(suite));
  }

  /**
   * Run a specific test suite
   */
  runTestSuite(testSuite: TestSuite): TestResults {
    const testResults = testSuite.tests.map((test) => {
      const suite = createAccessibilityTestSuite(test.name, test.combinations);
      return {
        testName: test.name,
        passed: suite.allPassed,
        results: suite.results,
      };
    });

    const totalTests = testResults.length;
    const passedTests = testResults.filter((r) => r.passed).length;
    const failedTests = totalTests - passedTests;

    return {
      suiteName: testSuite.name,
      totalTests,
      passedTests,
      failedTests,
      testResults,
      summary: {
        overallPassed: failedTests === 0,
        successRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      },
    };
  }

  /**
   * Generate test report
   */
  generateReport(results: TestResults[]): string {
    let report = "# Accessibility Test Report\n\n";

    const overallPassed = results.every((r) => r.summary.overallPassed);
    const totalTests = results.reduce((sum, r) => sum + r.totalTests, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.passedTests, 0);

    report += `## Overall Summary\n`;
    report += `- **Status**: ${overallPassed ? "✅ PASSED" : "❌ FAILED"}\n`;
    report += `- **Total Tests**: ${totalTests}\n`;
    report += `- **Passed**: ${totalPassed}\n`;
    report += `- **Failed**: ${totalTests - totalPassed}\n`;
    report += `- **Success Rate**: ${
      totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0
    }%\n\n`;

    results.forEach((suiteResult) => {
      report += `## ${suiteResult.suiteName}\n`;
      report += `- **Status**: ${
        suiteResult.summary.overallPassed ? "✅ PASSED" : "❌ FAILED"
      }\n`;
      report += `- **Tests**: ${suiteResult.passedTests}/${suiteResult.totalTests} passed\n`;
      report += `- **Success Rate**: ${suiteResult.summary.successRate.toFixed(
        1
      )}%\n\n`;

      suiteResult.testResults.forEach((testResult) => {
        report += `### ${testResult.testName}\n`;
        report += `**Status**: ${
          testResult.passed ? "✅ PASSED" : "❌ FAILED"
        }\n\n`;

        if (!testResult.passed) {
          const failures = testResult.results.filter((r) => !r.passed);
          report += `**Failures**:\n`;
          failures.forEach((failure) => {
            report += `- ${failure.context}: Expected ${
              failure.expected ? "PASS" : "FAIL"
            }, got ${failure.actual ? "PASS" : "FAIL"} (${
              failure.contrastRatio
            }:1)\n`;
          });
          report += "\n";
        }
      });
    });

    return report;
  }

  /**
   * Clear all test suites
   */
  clear(): this {
    this.testSuites = [];
    return this;
  }
}

/**
 * Pre-defined test suites for the brutalist portfolio
 */
export const BRUTALIST_TEST_SUITES: TestSuite[] = [
  {
    name: "Core Brutalist Colors",
    tests: [
      {
        name: "Basic Color Combinations",
        combinations: [
          {
            foreground: "#000000",
            background: "#ffffff",
            context: "Black text on white background",
            shouldPass: true,
          },
          {
            foreground: "#ffffff",
            background: "#000000",
            context: "White text on black background",
            shouldPass: true,
          },
          {
            foreground: "#000000",
            background: "#ffff00",
            context: "Black text on yellow background",
            shouldPass: true,
          },
          {
            foreground: "#ffffff",
            background: "#ffff00",
            context: "White text on yellow background",
            shouldPass: false,
          },
          {
            foreground: "#ffff00",
            background: "#ffffff",
            context: "Yellow text on white background",
            shouldPass: false,
          },
        ],
      },
    ],
  },
  {
    name: "Button Components",
    tests: [
      {
        name: "Primary Button States",
        combinations: [
          {
            foreground: "#ffffff",
            background: "#000000",
            context: "Primary button default",
            shouldPass: true,
          },
          {
            foreground: "#000000",
            background: "#ffffff",
            context: "Primary button hover",
            shouldPass: true,
          },
        ],
      },
      {
        name: "Accent Button States",
        combinations: [
          {
            foreground: "#000000",
            background: "#ffff00",
            context: "Accent button default",
            shouldPass: true,
          },
          {
            foreground: "#ffff00",
            background: "#000000",
            context: "Accent button hover",
            shouldPass: true,
          },
        ],
      },
      {
        name: "Focus Indicators",
        combinations: [
          {
            foreground: "#ffff00",
            background: "#000000",
            context: "Yellow focus on black",
            shouldPass: true,
            isFocusIndicator: true,
          },
          {
            foreground: "#ffff00",
            background: "#ffffff",
            context: "Yellow focus on white",
            shouldPass: false,
            isFocusIndicator: true,
          },
        ],
      },
    ],
  },
  {
    name: "Typography",
    tests: [
      {
        name: "Body Text",
        combinations: [
          {
            foreground: "#000000",
            background: "#ffffff",
            context: "Body text on white",
            shouldPass: true,
          },
          {
            foreground: "#666666",
            background: "#ffffff",
            context: "Secondary text on white",
            shouldPass: true,
          },
          {
            foreground: "#999999",
            background: "#ffffff",
            context: "Light gray text on white",
            shouldPass: false,
          },
        ],
      },
      {
        name: "Large Text",
        combinations: [
          {
            foreground: "#666666",
            background: "#ffffff",
            context: "Large secondary text",
            shouldPass: true,
            isLargeText: true,
          },
          {
            foreground: "#999999",
            background: "#ffffff",
            context: "Large light gray text",
            shouldPass: false,
            isLargeText: true,
          },
        ],
      },
    ],
  },
  {
    name: "Navigation",
    tests: [
      {
        name: "Light Theme Navigation",
        combinations: [
          {
            foreground: "#000000",
            background: "#ffffff",
            context: "Nav text on light background",
            shouldPass: true,
          },
          {
            foreground: "#ffff00",
            background: "#ffffff",
            context: "Active nav item on light",
            shouldPass: false,
          },
        ],
      },
      {
        name: "Dark Theme Navigation",
        combinations: [
          {
            foreground: "#ffffff",
            background: "#000000",
            context: "Nav text on dark background",
            shouldPass: true,
          },
          {
            foreground: "#ffff00",
            background: "#000000",
            context: "Active nav item on dark",
            shouldPass: true,
          },
        ],
      },
    ],
  },
];

/**
 * Run comprehensive accessibility tests
 */
export function runComprehensiveAccessibilityTests(): TestResults[] {
  const runner = new AccessibilityTestRunner();

  BRUTALIST_TEST_SUITES.forEach((suite) => {
    runner.addTestSuite(suite);
  });

  const results = runner.runAllTests();

  // Log results to console in development
  if (process.env.NODE_ENV === "development") {
    console.group("🧪 Accessibility Test Results");

    results.forEach((result) => {
      const status = result.summary.overallPassed ? "✅" : "❌";
      console.log(
        `${status} ${result.suiteName}: ${result.passedTests}/${result.totalTests} tests passed`
      );

      if (!result.summary.overallPassed) {
        const failures = result.testResults.filter((t) => !t.passed);
        failures.forEach((failure) => {
          console.warn(
            `  ❌ ${failure.testName}:`,
            failure.results.filter((r) => !r.passed)
          );
        });
      }
    });

    console.groupEnd();
  }

  return results;
}

/**
 * Generate and log accessibility report
 */
export function generateAccessibilityReport(): string {
  const results = runComprehensiveAccessibilityTests();
  const runner = new AccessibilityTestRunner();
  const report = runner.generateReport(results);

  if (process.env.NODE_ENV === "development") {
    console.log("📊 Accessibility Report Generated");
    console.log(report);
  }

  return report;
}

/**
 * Quick validation function for common scenarios
 */
export function quickAccessibilityCheck(): {
  brutalistTheme: ValidationResult;
  testResults: TestResults[];
  overallPassed: boolean;
} {
  const brutalistTheme = validateBrutalistTheme();
  const testResults = runComprehensiveAccessibilityTests();
  const overallPassed =
    brutalistTheme.passed && testResults.every((r) => r.summary.overallPassed);

  return {
    brutalistTheme,
    testResults,
    overallPassed,
  };
}

/**
 * Export singleton test runner instance
 */
export const accessibilityTestRunner = new AccessibilityTestRunner();
