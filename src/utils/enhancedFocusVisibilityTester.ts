/**
 * Enhanced Focus Visibility Testing Utilities
 *
 * This module provides comprehensive utilities to test and validate focus indicators
 * for maximum accessibility compliance and visibility across all backgrounds and contexts.
 */

import { getContrastRatio } from "./colorUtils";

export interface EnhancedFocusTestResult {
  element: string;
  selector: string;
  isVisible: boolean;
  contrastRatio: number;
  backgroundColor: string;
  focusColor: string;
  outlineWidth: number;
  outlineOffset: number;
  hasBoxShadow: boolean;
  hasAnimation: boolean;
  recommendations: string[];
  wcagCompliant: boolean;
  accessibilityScore: number; // 0-100 score
  testContext: string;
}

export interface FocusVisibilityTestOptions {
  minContrastRatio?: number;
  testAllBackgrounds?: boolean;
  testHighContrastMode?: boolean;
  testForcedColorsMode?: boolean;
  testReducedMotion?: boolean;
  includeAnimationTests?: boolean;
  logResults?: boolean;
  generateReport?: boolean;
}

/**
 * Comprehensive focus visibility testing for all interactive elements
 */
export function runEnhancedFocusVisibilityTests(
  options: FocusVisibilityTestOptions = {}
): EnhancedFocusTestResult[] {
  const {
    minContrastRatio = 3.0,
    testAllBackgrounds = true,
    testHighContrastMode = true,
    testForcedColorsMode = true,
    testReducedMotion = true,
    includeAnimationTests = true,
    logResults = true,
    generateReport = true,
  } = options;

  console.group("🎯 Enhanced Focus Visibility Testing");
  console.log(
    "Testing focus indicators for maximum accessibility compliance..."
  );

  const results: EnhancedFocusTestResult[] = [];

  // Enhanced interactive element selectors with more comprehensive coverage
  const interactiveSelectors = [
    "button:not([disabled])",
    "a[href]",
    'input:not([type="hidden"]):not([disabled])',
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[role="button"]:not([disabled])',
    '[role="link"]:not([disabled])',
    '[role="menuitem"]:not([disabled])',
    '[role="tab"]:not([disabled])',
    '[role="checkbox"]:not([disabled])',
    '[role="radio"]:not([disabled])',
    ".brutalist-btn",
    '.brutalist-card[role="button"]',
    ".brutalist-toggle",
    ".nav-item",
    ".mobile-nav-item",
    ".nav-focus-safe",
    ".skip-link",
    ".sticky-contact",
    ".sticky-contact-option",
    ".form-field",
    ".focus-contrast-safe",
  ];

  // Test each selector
  interactiveSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      const result = testEnhancedElementFocusVisibility(
        element as HTMLElement,
        `${selector}[${index}]`,
        minContrastRatio,
        {
          testAllBackgrounds,
          testHighContrastMode,
          testForcedColorsMode,
          testReducedMotion,
          includeAnimationTests,
        }
      );

      if (result) {
        results.push(result);
      }
    });
  });

  // Test focus visibility on different background contexts
  if (testAllBackgrounds) {
    testFocusOnAllBackgrounds(results);
  }

  // Test high contrast mode compatibility
  if (testHighContrastMode) {
    testHighContrastModeCompatibility(results);
  }

  // Test forced colors mode compatibility
  if (testForcedColorsMode) {
    testForcedColorsModeCompatibility(results);
  }

  // Test reduced motion compatibility
  if (testReducedMotion) {
    testReducedMotionCompatibility(results);
  }

  if (logResults) {
    logEnhancedFocusTestResults(results);
  }

  if (generateReport) {
    generateFocusAccessibilityReport(results);
  }

  console.groupEnd();
  return results;
}

/**
 * Enhanced focus visibility testing for individual elements
 */
export function testEnhancedElementFocusVisibility(
  element: HTMLElement,
  identifier: string,
  minContrastRatio: number = 3.0,
  options: {
    testAllBackgrounds?: boolean;
    testHighContrastMode?: boolean;
    testForcedColorsMode?: boolean;
    testReducedMotion?: boolean;
    includeAnimationTests?: boolean;
  } = {}
): EnhancedFocusTestResult | null {
  if (!element) return null;

  try {
    // Get computed styles
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor || "#ffffff";

    // Simulate focus state to get focus styles
    element.focus();
    const focusStyle = window.getComputedStyle(element, ":focus-visible");

    // Extract focus indicator properties
    const outlineColor = focusStyle.outlineColor || "#ffff00";
    const outlineWidth = parseFloat(focusStyle.outlineWidth) || 0;
    const outlineOffset = parseFloat(focusStyle.outlineOffset) || 0;
    const boxShadow = focusStyle.boxShadow || "none";
    const hasBoxShadow = boxShadow !== "none";
    const animation = focusStyle.animation || "none";
    const hasAnimation = animation !== "none";

    // Calculate contrast ratio
    const contrastRatio = getContrastRatio(outlineColor, backgroundColor);

    // Check WCAG compliance
    const wcagCompliant = contrastRatio >= minContrastRatio;

    // Calculate accessibility score (0-100)
    let accessibilityScore = 0;

    // Base contrast score (40 points max)
    accessibilityScore += Math.min((contrastRatio / 7.0) * 40, 40);

    // Outline width score (15 points max)
    accessibilityScore += Math.min((outlineWidth / 3.0) * 15, 15);

    // Outline offset score (10 points max)
    accessibilityScore += Math.min((outlineOffset / 2.0) * 10, 10);

    // Box shadow enhancement (15 points max)
    if (hasBoxShadow) accessibilityScore += 15;

    // Animation enhancement (10 points max)
    if (hasAnimation) accessibilityScore += 10;

    // Minimum size compliance (10 points max)
    const rect = element.getBoundingClientRect();
    if (rect.width >= 44 && rect.height >= 44) accessibilityScore += 10;

    // Generate comprehensive recommendations
    const recommendations: string[] = [];

    if (!wcagCompliant) {
      recommendations.push(
        `Increase contrast ratio to at least ${minContrastRatio}:1 (current: ${contrastRatio.toFixed(
          2
        )}:1)`
      );
    }

    if (contrastRatio < 2.0) {
      recommendations.push(
        "Focus indicator is barely visible - use high contrast colors"
      );
    }

    if (outlineWidth < 2) {
      recommendations.push(
        "Increase outline width to at least 2px for better visibility"
      );
    }

    if (outlineOffset < 1) {
      recommendations.push(
        "Add outline offset for better separation from element"
      );
    }

    if (!hasBoxShadow) {
      recommendations.push(
        "Add box-shadow for enhanced visibility on all backgrounds"
      );
    }

    if (!hasAnimation && options.includeAnimationTests) {
      recommendations.push(
        "Consider adding subtle animation for better attention"
      );
    }

    if (rect.width < 44 || rect.height < 44) {
      recommendations.push("Ensure minimum touch target size of 44x44px");
    }

    // Test context-specific visibility
    const testContext = getElementTestContext(element);

    // Remove focus after testing
    element.blur();

    return {
      element: element.tagName.toLowerCase(),
      selector: identifier,
      isVisible: contrastRatio >= 2.0 && outlineWidth >= 1,
      contrastRatio,
      backgroundColor,
      focusColor: outlineColor,
      outlineWidth,
      outlineOffset,
      hasBoxShadow,
      hasAnimation,
      recommendations,
      wcagCompliant,
      accessibilityScore: Math.round(accessibilityScore),
      testContext,
    };
  } catch (error) {
    console.warn(
      `Failed to test enhanced focus visibility for element: ${identifier}`,
      error
    );
    return null;
  }
}

/**
 * Test focus visibility on all background colors
 */
function testFocusOnAllBackgrounds(results: EnhancedFocusTestResult[]): void {
  const testBackgrounds = [
    { color: "#ffffff", name: "White" },
    { color: "#000000", name: "Black" },
    { color: "#ffff00", name: "Yellow" },
    { color: "#f5f5f5", name: "Light Gray" },
    { color: "#2a2a2a", name: "Dark Gray" },
    { color: "#808080", name: "Medium Gray" },
    { color: "#ff0000", name: "Red" },
    { color: "#00ff00", name: "Green" },
    { color: "#0000ff", name: "Blue" },
  ];

  console.group("🎨 Focus Visibility on All Backgrounds");

  testBackgrounds.forEach((bg) => {
    const focusColor = "#ffff00"; // Yellow focus indicator
    const contrastRatio = getContrastRatio(focusColor, bg.color);
    const isVisible = contrastRatio >= 3.0;

    console.log(
      `${isVisible ? "✅" : "❌"} ${bg.name} (${
        bg.color
      }): ${contrastRatio.toFixed(2)}:1 contrast`
    );

    if (!isVisible) {
      console.warn(
        `⚠️ Focus indicator may not be visible on ${bg.name} background`
      );
    }
  });

  console.groupEnd();
}

/**
 * Test high contrast mode compatibility
 */
function testHighContrastModeCompatibility(
  results: EnhancedFocusTestResult[]
): void {
  console.group("🔍 High Contrast Mode Compatibility");

  // Simulate high contrast mode
  const highContrastElements = results.filter(
    (r) => r.accessibilityScore >= 80 && r.contrastRatio >= 4.5
  );

  console.log(
    `✅ ${highContrastElements.length} elements are high contrast ready`
  );

  const needsImprovement = results.filter((r) => r.accessibilityScore < 80);
  if (needsImprovement.length > 0) {
    console.warn(
      `⚠️ ${needsImprovement.length} elements need improvement for high contrast mode`
    );
  }

  console.groupEnd();
}

/**
 * Test forced colors mode compatibility
 */
function testForcedColorsModeCompatibility(
  results: EnhancedFocusTestResult[]
): void {
  console.group("🖥️ Forced Colors Mode Compatibility");

  // Check if elements would work with system colors
  const compatibleElements = results.filter(
    (r) => r.hasBoxShadow && r.outlineWidth >= 2
  );

  console.log(
    `✅ ${compatibleElements.length} elements are forced colors ready`
  );

  const needsWork = results.filter(
    (r) => !r.hasBoxShadow || r.outlineWidth < 2
  );
  if (needsWork.length > 0) {
    console.warn(
      `⚠️ ${needsWork.length} elements need work for forced colors mode`
    );
  }

  console.groupEnd();
}

/**
 * Test reduced motion compatibility
 */
function testReducedMotionCompatibility(
  results: EnhancedFocusTestResult[]
): void {
  console.group("🎭 Reduced Motion Compatibility");

  const animatedElements = results.filter((r) => r.hasAnimation);
  console.log(`📊 ${animatedElements.length} elements have animations`);

  // Check if static focus indicators are still visible
  const staticVisibleElements = results.filter(
    (r) => r.contrastRatio >= 3.0 && r.outlineWidth >= 2
  );

  console.log(
    `✅ ${staticVisibleElements.length} elements remain visible without animation`
  );

  console.groupEnd();
}

/**
 * Get test context for an element
 */
function getElementTestContext(element: HTMLElement): string {
  const classList = Array.from(element.classList);
  const role = element.getAttribute("role");
  const tagName = element.tagName.toLowerCase();

  if (classList.includes("nav-focus-safe") || classList.includes("nav-item")) {
    return "Navigation";
  }
  if (classList.includes("brutalist-btn") || tagName === "button") {
    return "Button";
  }
  if (classList.includes("brutalist-card")) {
    return "Card";
  }
  if (
    classList.includes("form-field") ||
    ["input", "textarea", "select"].includes(tagName)
  ) {
    return "Form";
  }
  if (classList.includes("skip-link")) {
    return "Skip Link";
  }
  if (role) {
    return `Role: ${role}`;
  }

  return tagName;
}

/**
 * Log enhanced focus test results
 */
function logEnhancedFocusTestResults(results: EnhancedFocusTestResult[]): void {
  console.group("📊 Enhanced Focus Test Results");

  const excellent = results.filter((r) => r.accessibilityScore >= 90);
  const good = results.filter(
    (r) => r.accessibilityScore >= 70 && r.accessibilityScore < 90
  );
  const needsWork = results.filter(
    (r) => r.accessibilityScore >= 50 && r.accessibilityScore < 70
  );
  const poor = results.filter((r) => r.accessibilityScore < 50);

  console.log(`🌟 Excellent (90-100): ${excellent.length}`);
  console.log(`✅ Good (70-89): ${good.length}`);
  console.log(`⚠️ Needs Work (50-69): ${needsWork.length}`);
  console.log(`❌ Poor (<50): ${poor.length}`);
  console.log(`📊 Total tested: ${results.length}`);

  // Show average accessibility score
  const averageScore =
    results.reduce((sum, r) => sum + r.accessibilityScore, 0) / results.length;
  console.log(`📈 Average Accessibility Score: ${averageScore.toFixed(1)}/100`);

  if (poor.length > 0) {
    console.group("❌ Elements Needing Immediate Attention");
    poor.forEach((result) => {
      console.group(
        `${result.element} (${result.selector}) - Score: ${result.accessibilityScore}/100`
      );
      console.log(`Context: ${result.testContext}`);
      console.log(`Contrast Ratio: ${result.contrastRatio.toFixed(2)}:1`);
      console.log(`Background: ${result.backgroundColor}`);
      console.log(`Focus Color: ${result.focusColor}`);
      console.log("Recommendations:", result.recommendations);
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Generate comprehensive focus accessibility report
 */
function generateFocusAccessibilityReport(
  results: EnhancedFocusTestResult[]
): void {
  console.group("📋 Focus Accessibility Report");

  const totalElements = results.length;
  const wcagCompliant = results.filter((r) => r.wcagCompliant).length;
  const averageScore =
    results.reduce((sum, r) => sum + r.accessibilityScore, 0) / totalElements;

  console.log("=".repeat(50));
  console.log("FOCUS ACCESSIBILITY REPORT");
  console.log("=".repeat(50));
  console.log(`Total Elements Tested: ${totalElements}`);
  console.log(
    `WCAG Compliant: ${wcagCompliant} (${(
      (wcagCompliant / totalElements) *
      100
    ).toFixed(1)}%)`
  );
  console.log(`Average Accessibility Score: ${averageScore.toFixed(1)}/100`);
  console.log("");

  // Context breakdown
  const contextBreakdown = results.reduce((acc, r) => {
    acc[r.testContext] = (acc[r.testContext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("ELEMENTS BY CONTEXT:");
  Object.entries(contextBreakdown).forEach(([context, count]) => {
    console.log(`  ${context}: ${count}`);
  });
  console.log("");

  // Recommendations summary
  const allRecommendations = results.flatMap((r) => r.recommendations);
  const recommendationCounts = allRecommendations.reduce((acc, rec) => {
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("TOP RECOMMENDATIONS:");
  Object.entries(recommendationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([rec, count]) => {
      console.log(`  ${count}x: ${rec}`);
    });

  console.log("=".repeat(50));
  console.groupEnd();
}

/**
 * Auto-run enhanced tests in development mode
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      runEnhancedFocusVisibilityTests({
        minContrastRatio: 3.0,
        testAllBackgrounds: true,
        testHighContrastMode: true,
        testForcedColorsMode: true,
        testReducedMotion: true,
        includeAnimationTests: true,
        logResults: true,
        generateReport: true,
      });
    }, 2000);
  });
}

const enhancedFocusVisibilityTester = {
  runEnhancedFocusVisibilityTests,
  testEnhancedElementFocusVisibility,
};

export default enhancedFocusVisibilityTester;
