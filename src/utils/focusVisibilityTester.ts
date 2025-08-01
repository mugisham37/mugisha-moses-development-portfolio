/**
 * Focus Visibility Testing Utilities
 *
 * This module provides utilities to test and validate focus indicators
 * for accessibility compliance and visibility across different backgrounds.
 */

import { getContrastRatio } from "./colorUtils";

export interface FocusTestResult {
  element: string;
  selector: string;
  isVisible: boolean;
  contrastRatio: number;
  backgroundColor: string;
  focusColor: string;
  recommendations: string[];
  wcagCompliant: boolean;
}

export interface FocusTestOptions {
  minContrastRatio?: number;
  testKeyboardNavigation?: boolean;
  includeHoverStates?: boolean;
  logResults?: boolean;
}

/**
 * Test focus visibility for all interactive elements on the page
 */
export function testFocusVisibility(
  options: FocusTestOptions = {}
): FocusTestResult[] {
  const {
    minContrastRatio = 3.0, // WCAG AA minimum for focus indicators
    testKeyboardNavigation = true,
    includeHoverStates = false,
    logResults = true,
  } = options;

  const results: FocusTestResult[] = [];

  // Define interactive element selectors
  const interactiveSelectors = [
    "button",
    "a[href]",
    'input:not([type="hidden"])',
    "textarea",
    "select",
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    ".brutalist-btn",
    '.brutalist-card[role="button"]',
    ".brutalist-toggle",
    ".nav-item",
    ".mobile-nav-item",
    ".skip-link",
  ];

  interactiveSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      const result = testElementFocusVisibility(
        element as HTMLElement,
        `${selector}[${index}]`,
        minContrastRatio
      );

      if (result) {
        results.push(result);
      }
    });
  });

  if (logResults) {
    logFocusTestResults(results);
  }

  return results;
}

/**
 * Test focus visibility for a specific element
 */
export function testElementFocusVisibility(
  element: HTMLElement,
  identifier: string,
  minContrastRatio: number = 3.0
): FocusTestResult | null {
  if (!element) return null;

  try {
    // Get computed styles
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor || "#ffffff";

    // Simulate focus state to get focus styles
    element.focus();
    const focusStyle = window.getComputedStyle(element, ":focus-visible");
    const outlineColor = focusStyle.outlineColor || "#ffff00"; // Default to yellow

    // Calculate contrast ratio
    const contrastRatio = getContrastRatio(outlineColor, backgroundColor);

    // Check WCAG compliance
    const wcagCompliant = contrastRatio >= minContrastRatio;

    // Generate recommendations
    const recommendations: string[] = [];

    if (!wcagCompliant) {
      recommendations.push(
        `Increase contrast ratio to at least ${minContrastRatio}:1`
      );
    }

    if (contrastRatio < 2.0) {
      recommendations.push(
        "Focus indicator is barely visible - consider using a high contrast color"
      );
    }

    if (!focusStyle.outline || focusStyle.outline === "none") {
      recommendations.push("Add visible outline for focus indicator");
    }

    if (!focusStyle.boxShadow) {
      recommendations.push(
        "Consider adding box-shadow for enhanced visibility"
      );
    }

    // Remove focus after testing
    element.blur();

    return {
      element: element.tagName.toLowerCase(),
      selector: identifier,
      isVisible: contrastRatio >= 2.0, // Minimum visibility threshold
      contrastRatio,
      backgroundColor,
      focusColor: outlineColor,
      recommendations,
      wcagCompliant,
    };
  } catch (error) {
    console.warn(
      `Failed to test focus visibility for element: ${identifier}`,
      error
    );
    return null;
  }
}

/**
 * Test keyboard navigation flow
 */
export function testKeyboardNavigation(): {
  totalElements: number;
  focusableElements: number;
  tabOrder: string[];
  issues: string[];
} {
  const issues: string[] = [];
  const tabOrder: string[] = [];

  // Get all focusable elements
  const focusableElements = document.querySelectorAll(`
    button:not([disabled]),
    a[href],
    input:not([disabled]):not([type="hidden"]),
    textarea:not([disabled]),
    select:not([disabled]),
    [tabindex]:not([tabindex="-1"]):not([disabled]),
    [role="button"]:not([disabled]),
    [role="link"]:not([disabled])
  `);

  const currentIndex = 0;
  const totalElements = focusableElements.length;

  // Test tab order
  focusableElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const tabIndex = htmlElement.tabIndex;
    const identifier = `${htmlElement.tagName.toLowerCase()}[${index}]`;

    tabOrder.push(identifier);

    // Check for tab index issues
    if (tabIndex > 0) {
      issues.push(
        `Element ${identifier} has positive tabindex (${tabIndex}) - may disrupt natural tab order`
      );
    }

    // Check if element is visible
    const rect = htmlElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      issues.push(`Element ${identifier} is not visible but focusable`);
    }

    // Check if element has accessible name
    const accessibleName =
      htmlElement.getAttribute("aria-label") ||
      htmlElement.getAttribute("aria-labelledby") ||
      htmlElement.textContent?.trim();

    if (!accessibleName) {
      issues.push(`Element ${identifier} lacks accessible name`);
    }
  });

  return {
    totalElements: document.querySelectorAll("*").length,
    focusableElements: totalElements,
    tabOrder,
    issues,
  };
}

/**
 * Log focus test results to console
 */
function logFocusTestResults(results: FocusTestResult[]): void {
  console.group("🎯 Focus Visibility Test Results");

  const passed = results.filter((r) => r.wcagCompliant);
  const failed = results.filter((r) => !r.wcagCompliant);

  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📊 Total tested: ${results.length}`);

  if (failed.length > 0) {
    console.group("❌ Failed Elements");
    failed.forEach((result) => {
      console.group(`${result.element} (${result.selector})`);
      console.log(`Contrast Ratio: ${result.contrastRatio.toFixed(2)}:1`);
      console.log(`Background: ${result.backgroundColor}`);
      console.log(`Focus Color: ${result.focusColor}`);
      console.log("Recommendations:", result.recommendations);
      console.groupEnd();
    });
    console.groupEnd();
  }

  if (passed.length > 0) {
    console.group("✅ Passed Elements");
    passed.forEach((result) => {
      console.log(
        `${result.element} (${result.selector}): ${result.contrastRatio.toFixed(
          2
        )}:1`
      );
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Run comprehensive focus visibility tests
 */
export function runFocusVisibilityTests(): void {
  console.log("🔍 Running Focus Visibility Tests...");

  // Test focus visibility
  const focusResults = testFocusVisibility({
    minContrastRatio: 3.0,
    testKeyboardNavigation: true,
    logResults: true,
  });

  // Test keyboard navigation
  const keyboardResults = testKeyboardNavigation();

  console.group("⌨️ Keyboard Navigation Test Results");
  console.log(`Total elements: ${keyboardResults.totalElements}`);
  console.log(`Focusable elements: ${keyboardResults.focusableElements}`);

  if (keyboardResults.issues.length > 0) {
    console.group("⚠️ Issues Found");
    keyboardResults.issues.forEach((issue) => console.warn(issue));
    console.groupEnd();
  } else {
    console.log("✅ No keyboard navigation issues found");
  }

  console.groupEnd();

  // Summary
  const totalIssues =
    focusResults.filter((r) => !r.wcagCompliant).length +
    keyboardResults.issues.length;

  if (totalIssues === 0) {
    console.log("🎉 All focus visibility tests passed!");
  } else {
    console.warn(
      `⚠️ Found ${totalIssues} focus visibility issues that need attention`
    );
  }
}

/**
 * Test focus visibility on different backgrounds
 */
export function testFocusOnBackgrounds(): void {
  const testBackgrounds = [
    "#ffffff", // White
    "#000000", // Black
    "#ffff00", // Yellow
    "#f5f5f5", // Light gray
    "#2a2a2a", // Dark gray
    "#808080", // Medium gray
  ];

  console.group("🎨 Focus Visibility on Different Backgrounds");

  testBackgrounds.forEach((bgColor) => {
    const focusColor = "#ffff00"; // Yellow focus indicator
    const contrastRatio = getContrastRatio(focusColor, bgColor);
    const isVisible = contrastRatio >= 3.0;

    console.log(
      `${
        isVisible ? "✅" : "❌"
      } Background ${bgColor}: ${contrastRatio.toFixed(2)}:1 contrast`
    );
  });

  console.groupEnd();
}

// Auto-run tests in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Run tests after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      runFocusVisibilityTests();
      testFocusOnBackgrounds();
    }, 1000);
  });
}
