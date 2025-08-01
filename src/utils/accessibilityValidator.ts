/**
 * WCAG 2.1 AA Accessibility Compliance Validation Utility
 *
 * This utility provides comprehensive accessibility validation for color contrast,
 * development warnings, and programmatic testing of color combinations.
 */

import { getContrastRatio } from "./colorUtils";

export interface AccessibilityCheck {
  combination: {
    foreground: string;
    background: string;
  };
  contrastRatio: number;
  wcagLevel: "AA" | "AAA" | "FAIL";
  isLargeText: boolean;
  passes: boolean;
  context?: string;
}

export interface ValidationResult {
  passed: boolean;
  failures: AccessibilityCheck[];
  warnings: AccessibilityCheck[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

/**
 * WCAG 2.1 contrast ratio requirements
 */
export const WCAG_STANDARDS = {
  AA: {
    NORMAL_TEXT: 4.5,
    LARGE_TEXT: 3.0,
    FOCUS_INDICATOR: 3.0,
    NON_TEXT: 3.0,
  },
  AAA: {
    NORMAL_TEXT: 7.0,
    LARGE_TEXT: 4.5,
    FOCUS_INDICATOR: 3.0,
    NON_TEXT: 3.0,
  },
} as const;

/**
 * Check if a color combination meets WCAG 2.1 AA standards
 */
export function checkWCAGCompliance(
  foreground: string,
  background: string,
  options: {
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
    targetLevel?: "AA" | "AAA";
  } = {}
): AccessibilityCheck {
  const {
    isLargeText = false,
    isFocusIndicator = false,
    isNonText = false,
    targetLevel = "AA",
  } = options;

  const contrastRatio = getContrastRatio(foreground, background);

  let requiredRatio: number;

  if (isFocusIndicator || isNonText) {
    requiredRatio = WCAG_STANDARDS[targetLevel].FOCUS_INDICATOR;
  } else if (isLargeText) {
    requiredRatio = WCAG_STANDARDS[targetLevel].LARGE_TEXT;
  } else {
    requiredRatio = WCAG_STANDARDS[targetLevel].NORMAL_TEXT;
  }

  const passes = contrastRatio >= requiredRatio;

  // Determine WCAG level achieved
  let wcagLevel: "AA" | "AAA" | "FAIL";
  if (isLargeText) {
    if (contrastRatio >= WCAG_STANDARDS.AAA.LARGE_TEXT) wcagLevel = "AAA";
    else if (contrastRatio >= WCAG_STANDARDS.AA.LARGE_TEXT) wcagLevel = "AA";
    else wcagLevel = "FAIL";
  } else {
    if (contrastRatio >= WCAG_STANDARDS.AAA.NORMAL_TEXT) wcagLevel = "AAA";
    else if (contrastRatio >= WCAG_STANDARDS.AA.NORMAL_TEXT) wcagLevel = "AA";
    else wcagLevel = "FAIL";
  }

  return {
    combination: { foreground, background },
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    wcagLevel,
    isLargeText,
    passes,
  };
}

/**
 * Validate multiple color combinations
 */
export function validateColorCombinations(
  combinations: Array<{
    foreground: string;
    background: string;
    context?: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
): ValidationResult {
  const results = combinations.map(
    ({ foreground, background, context, ...options }) => ({
      ...checkWCAGCompliance(foreground, background, options),
      context,
    })
  );

  const failures = results.filter((result) => !result.passes);
  const warnings = results.filter(
    (result) => result.wcagLevel === "AA" && result.passes
  );

  return {
    passed: failures.length === 0,
    failures,
    warnings,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.passes).length,
      failed: failures.length,
      warnings: warnings.length,
    },
  };
}

/**
 * Development warning system for insufficient contrast
 */
export function logAccessibilityWarnings(
  validationResult: ValidationResult,
  componentName?: string
): void {
  if (process.env.NODE_ENV !== "development") return;

  const prefix = componentName ? `[${componentName}]` : "[Accessibility]";

  if (validationResult.failures.length > 0) {
    console.group(`🚨 ${prefix} WCAG 2.1 AA Compliance Failures`);
    validationResult.failures.forEach((failure) => {
      console.error(
        `❌ ${failure.context || "Color combination"}: ${
          failure.contrastRatio
        }:1 ratio (requires ${failure.isLargeText ? "3.0" : "4.5"}:1)`,
        {
          foreground: failure.combination.foreground,
          background: failure.combination.background,
          wcagLevel: failure.wcagLevel,
        }
      );
    });
    console.groupEnd();
  }

  if (validationResult.warnings.length > 0) {
    console.group(`⚠️ ${prefix} WCAG 2.1 Warnings (AA only, consider AAA)`);
    validationResult.warnings.forEach((warning) => {
      console.warn(
        `⚠️ ${warning.context || "Color combination"}: ${
          warning.contrastRatio
        }:1 ratio (AA compliant, but below AAA standard)`,
        {
          foreground: warning.combination.foreground,
          background: warning.combination.background,
        }
      );
    });
    console.groupEnd();
  }

  if (validationResult.passed && validationResult.failures.length === 0) {
    console.log(
      `✅ ${prefix} All color combinations pass WCAG 2.1 AA standards`
    );
  }
}

/**
 * Comprehensive component accessibility validator
 */
export class ComponentAccessibilityValidator {
  private componentName: string;
  private validations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }> = [];

  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * Add a color combination to validate
   */
  addValidation(
    foreground: string,
    background: string,
    context: string,
    options: {
      isLargeText?: boolean;
      isFocusIndicator?: boolean;
      isNonText?: boolean;
    } = {}
  ): this {
    this.validations.push({
      foreground,
      background,
      context,
      ...options,
    });
    return this;
  }

  /**
   * Add text color validation
   */
  addTextValidation(
    textColor: string,
    backgroundColor: string,
    context: string,
    isLargeText: boolean = false
  ): this {
    return this.addValidation(textColor, backgroundColor, context, {
      isLargeText,
    });
  }

  /**
   * Add focus indicator validation
   */
  addFocusValidation(
    focusColor: string,
    backgroundColor: string,
    context: string
  ): this {
    return this.addValidation(focusColor, backgroundColor, context, {
      isFocusIndicator: true,
    });
  }

  /**
   * Add non-text element validation (icons, borders, etc.)
   */
  addNonTextValidation(
    elementColor: string,
    backgroundColor: string,
    context: string
  ): this {
    return this.addValidation(elementColor, backgroundColor, context, {
      isNonText: true,
    });
  }

  /**
   * Run all validations and log results
   */
  validate(): ValidationResult {
    const result = validateColorCombinations(this.validations);
    logAccessibilityWarnings(result, this.componentName);
    return result;
  }

  /**
   * Clear all validations
   */
  clear(): this {
    this.validations = [];
    return this;
  }
}

/**
 * Quick validation function for single color combinations
 */
export function validateSingleCombination(
  foreground: string,
  background: string,
  context: string = "Color combination",
  options: {
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
    logWarnings?: boolean;
  } = {}
): AccessibilityCheck {
  const { logWarnings = true, ...checkOptions } = options;
  const result = checkWCAGCompliance(foreground, background, checkOptions);

  if (logWarnings && process.env.NODE_ENV === "development") {
    const validationResult: ValidationResult = {
      passed: result.passes,
      failures: result.passes ? [] : [{ ...result, context }],
      warnings:
        result.wcagLevel === "AA" && result.passes
          ? [{ ...result, context }]
          : [],
      summary: {
        total: 1,
        passed: result.passes ? 1 : 0,
        failed: result.passes ? 0 : 1,
        warnings: result.wcagLevel === "AA" && result.passes ? 1 : 0,
      },
    };
    logAccessibilityWarnings(validationResult);
  }

  return result;
}

/**
 * Programmatic testing utility for automated tests
 */
export function createAccessibilityTestSuite(
  testName: string,
  combinations: Array<{
    foreground: string;
    background: string;
    context: string;
    shouldPass: boolean;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
): {
  testName: string;
  results: Array<{
    context: string;
    expected: boolean;
    actual: boolean;
    passed: boolean;
    contrastRatio: number;
  }>;
  allPassed: boolean;
} {
  const results = combinations.map(({ shouldPass, ...combination }) => {
    const check = checkWCAGCompliance(
      combination.foreground,
      combination.background,
      combination
    );
    return {
      context: combination.context,
      expected: shouldPass,
      actual: check.passes,
      passed: shouldPass === check.passes,
      contrastRatio: check.contrastRatio,
    };
  });

  return {
    testName,
    results,
    allPassed: results.every((r) => r.passed),
  };
}

/**
 * Validate brutalist theme color combinations
 */
export function validateBrutalistTheme(): ValidationResult {
  const brutalistColors = {
    black: "#000000",
    white: "#ffffff",
    yellow: "#ffff00",
    darkGray: "#2a2a2a",
    mediumGray: "#666666",
    lightGray: "#f5f5f5",
  };

  const combinations = [
    // Primary text combinations
    {
      foreground: brutalistColors.black,
      background: brutalistColors.white,
      context: "Black text on white background",
    },
    {
      foreground: brutalistColors.white,
      background: brutalistColors.black,
      context: "White text on black background",
    },
    {
      foreground: brutalistColors.black,
      background: brutalistColors.yellow,
      context: "Black text on yellow background",
    },
    {
      foreground: brutalistColors.black,
      background: brutalistColors.lightGray,
      context: "Black text on light gray background",
    },

    // Secondary text combinations
    {
      foreground: brutalistColors.mediumGray,
      background: brutalistColors.white,
      context: "Medium gray text on white background",
    },
    {
      foreground: brutalistColors.mediumGray,
      background: brutalistColors.lightGray,
      context: "Medium gray text on light gray background",
    },

    // Focus indicators
    {
      foreground: brutalistColors.yellow,
      background: brutalistColors.black,
      context: "Yellow focus indicator on black",
      isFocusIndicator: true,
    },
    {
      foreground: brutalistColors.yellow,
      background: brutalistColors.white,
      context: "Yellow focus indicator on white",
      isFocusIndicator: true,
    },

    // Interactive elements
    {
      foreground: brutalistColors.white,
      background: brutalistColors.darkGray,
      context: "White text on dark gray background",
    },
    {
      foreground: brutalistColors.darkGray,
      background: brutalistColors.lightGray,
      context: "Dark gray text on light gray background",
    },
  ];

  return validateColorCombinations(combinations);
}
