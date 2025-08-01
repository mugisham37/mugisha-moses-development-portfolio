/**
 * Development-time accessibility checker
 *
 * This utility provides real-time accessibility checking during development,
 * including DOM scanning and live validation of color combinations.
 */

import {
  ComponentAccessibilityValidator,
  validateSingleCombination,
  checkWCAGCompliance,
  type AccessibilityCheck,
} from "./accessibilityValidator";

/**
 * Development accessibility checker class
 */
export class DevAccessibilityChecker {
  private static instance: DevAccessibilityChecker;
  private isEnabled: boolean = process.env.NODE_ENV === "development";
  private validationResults: Map<string, AccessibilityCheck[]> = new Map();

  private constructor() {
    if (this.isEnabled) {
      this.initializeChecker();
    }
  }

  static getInstance(): DevAccessibilityChecker {
    if (!DevAccessibilityChecker.instance) {
      DevAccessibilityChecker.instance = new DevAccessibilityChecker();
    }
    return DevAccessibilityChecker.instance;
  }

  private initializeChecker(): void {
    // Add global accessibility checking functions to window for debugging
    if (typeof window !== "undefined") {
      (window as any).checkAccessibility = {
        validateColors: this.validateColors.bind(this),
        scanDOM: this.scanDOMForIssues.bind(this),
        checkElement: this.checkElement.bind(this),
        getResults: this.getValidationResults.bind(this),
        clearResults: this.clearResults.bind(this),
      };

      console.log(
        "🔍 Accessibility checker initialized. Use window.checkAccessibility for debugging."
      );
    }
  }

  /**
   * Validate color combinations and store results
   */
  validateColors(
    componentName: string,
    combinations: Array<{
      foreground: string;
      background: string;
      context: string;
      isLargeText?: boolean;
      isFocusIndicator?: boolean;
      isNonText?: boolean;
    }>
  ): AccessibilityCheck[] {
    if (!this.isEnabled) return [];

    const results = combinations.map(
      ({ foreground, background, context, ...options }) => {
        const check = checkWCAGCompliance(foreground, background, options);
        return { ...check, context };
      }
    );

    this.validationResults.set(componentName, results);

    // Log failures immediately
    const failures = results.filter((r) => !r.passes);
    if (failures.length > 0) {
      console.group(`🚨 [${componentName}] Accessibility Issues`);
      failures.forEach((failure) => {
        console.error(
          `❌ ${failure.context}: ${failure.contrastRatio}:1 (needs ${
            failure.isLargeText ? "3.0" : "4.5"
          }:1)`,
          {
            foreground: failure.combination.foreground,
            background: failure.combination.background,
          }
        );
      });
      console.groupEnd();
    }

    return results;
  }

  /**
   * Scan DOM for potential accessibility issues
   */
  scanDOMForIssues(): void {
    if (!this.isEnabled || typeof window === "undefined") return;

    console.group("🔍 Scanning DOM for accessibility issues...");

    const elements = document.querySelectorAll("*");
    const issues: Array<{
      element: Element;
      issue: string;
      severity: "error" | "warning";
    }> = [];

    elements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // Skip elements with transparent or inherit values
      if (
        backgroundColor === "rgba(0, 0, 0, 0)" ||
        backgroundColor === "transparent" ||
        color === "inherit"
      ) {
        return;
      }

      // Convert RGB to hex for validation
      const colorHex = this.rgbToHex(color);
      const bgHex = this.rgbToHex(backgroundColor);

      if (colorHex && bgHex) {
        const check = checkWCAGCompliance(colorHex, bgHex);
        if (!check.passes) {
          issues.push({
            element,
            issue: `Low contrast: ${check.contrastRatio}:1 (needs ${
              check.isLargeText ? "3.0" : "4.5"
            }:1)`,
            severity: "error",
          });
        }
      }
    });

    if (issues.length > 0) {
      console.warn(`Found ${issues.length} accessibility issues:`);
      issues.forEach(({ element, issue, severity }) => {
        if (severity === "error") {
          console.error(`❌ ${issue}`, element);
        } else {
          console.warn(`⚠️ ${issue}`, element);
        }
      });
    } else {
      console.log("✅ No accessibility issues found in current DOM");
    }

    console.groupEnd();
  }

  /**
   * Check a specific DOM element for accessibility issues
   */
  checkElement(element: Element): AccessibilityCheck | null {
    if (!this.isEnabled || typeof window === "undefined") return null;

    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    const colorHex = this.rgbToHex(color);
    const bgHex = this.rgbToHex(backgroundColor);

    if (!colorHex || !bgHex) return null;

    const check = checkWCAGCompliance(colorHex, bgHex);

    if (!check.passes) {
      console.warn(
        `Element accessibility issue: ${check.contrastRatio}:1 contrast ratio`,
        element
      );
    }

    return check;
  }

  /**
   * Get all validation results
   */
  getValidationResults(): Map<string, AccessibilityCheck[]> {
    return this.validationResults;
  }

  /**
   * Clear all validation results
   */
  clearResults(): void {
    this.validationResults.clear();
    console.log("🧹 Accessibility validation results cleared");
  }

  /**
   * Convert RGB color to hex
   */
  private rgbToHex(rgb: string): string | null {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;

    const [, r, g, b] = match;
    return `#${parseInt(r).toString(16).padStart(2, "0")}${parseInt(g)
      .toString(16)
      .padStart(2, "0")}${parseInt(b).toString(16).padStart(2, "0")}`;
  }

  /**
   * Enable or disable the checker
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled && process.env.NODE_ENV === "development";
  }

  /**
   * Check if the checker is enabled
   */
  isCheckerEnabled(): boolean {
    return this.isEnabled;
  }
}

/**
 * Global accessibility checker instance
 */
export const devAccessibilityChecker = DevAccessibilityChecker.getInstance();

/**
 * Convenience function to validate component colors during development
 */
export function validateComponentColors(
  componentName: string,
  combinations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
): void {
  devAccessibilityChecker.validateColors(componentName, combinations);
}

/**
 * Convenience function to check a single color combination
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  context: string = "Color combination"
): boolean {
  if (process.env.NODE_ENV !== "development") return true;

  const result = validateSingleCombination(foreground, background, context);
  return result.passes;
}

/**
 * React hook for component accessibility validation
 */
export function useAccessibilityValidation(
  componentName: string,
  combinations: Array<{
    foreground: string;
    background: string;
    context: string;
    isLargeText?: boolean;
    isFocusIndicator?: boolean;
    isNonText?: boolean;
  }>
): void {
  if (process.env.NODE_ENV === "development") {
    // Use useEffect equivalent for validation
    if (typeof window !== "undefined") {
      setTimeout(() => {
        validateComponentColors(componentName, combinations);
      }, 0);
    }
  }
}

/**
 * Validate theme colors on theme change
 */
export function validateThemeChange(theme: "light" | "dark"): void {
  if (process.env.NODE_ENV !== "development") return;

  console.group(`🎨 Validating ${theme} theme accessibility`);

  const themeColors = {
    light: {
      background: "#ffffff",
      text: "#000000",
      secondary: "#666666",
      accent: "#ffff00",
    },
    dark: {
      background: "#000000",
      text: "#ffffff",
      secondary: "#cccccc",
      accent: "#ffff00",
    },
  };

  const colors = themeColors[theme];

  validateComponentColors(`Theme-${theme}`, [
    {
      foreground: colors.text,
      background: colors.background,
      context: "Primary text on background",
    },
    {
      foreground: colors.secondary,
      background: colors.background,
      context: "Secondary text on background",
    },
    {
      foreground: colors.accent,
      background: colors.background,
      context: "Accent color on background",
    },
    {
      foreground: colors.background,
      background: colors.accent,
      context: "Background on accent (for buttons)",
    },
  ]);

  console.groupEnd();
}

/**
 * Initialize accessibility checking on page load
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      devAccessibilityChecker.scanDOMForIssues();
    }, 1000); // Wait for components to render
  });
}
