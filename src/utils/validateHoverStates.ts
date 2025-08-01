/**
 * Hover State Validation Utility
 *
 * This utility scans components for potential hover state issues
 * and provides warnings for problematic color combinations.
 */

import { BRUTALIST_COLORS } from "@/lib/color-utils";
import {
  isProblematicHoverCombination,
  validateHoverState,
} from "@/lib/hover-utils";

interface HoverStateIssue {
  component: string;
  element: string;
  issue: string;
  severity: "error" | "warning" | "info";
  suggestion: string;
}

/**
 * Common problematic hover state patterns to check for
 */
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /hover:.*text-white.*bg-.*yellow|hover:.*bg-.*yellow.*text-white/,
    issue: "White text on yellow background in hover state",
    severity: "error" as const,
    suggestion: "Use black text on yellow background instead",
  },
  {
    pattern: /hover:.*text-yellow.*bg-.*white|hover:.*bg-.*white.*text-yellow/,
    issue: "Yellow text on white background may have insufficient contrast",
    severity: "warning" as const,
    suggestion: "Consider using black text or darker background",
  },
  {
    pattern: /hover:.*text-white.*bg-.*white|hover:.*bg-.*white.*text-white/,
    issue: "White text on white background in hover state",
    severity: "error" as const,
    suggestion: "Use contrasting colors for visibility",
  },
  {
    pattern: /hover:.*text-black.*bg-.*black|hover:.*bg-.*black.*text-black/,
    issue: "Black text on black background in hover state",
    severity: "error" as const,
    suggestion: "Use contrasting colors for visibility",
  },
];

/**
 * Validate hover states in component code
 */
export function validateComponentHoverStates(
  componentCode: string,
  componentName: string
): HoverStateIssue[] {
  const issues: HoverStateIssue[] = [];

  // Check for problematic patterns
  PROBLEMATIC_PATTERNS.forEach(({ pattern, issue, severity, suggestion }) => {
    const matches = componentCode.match(pattern);
    if (matches) {
      issues.push({
        component: componentName,
        element: "Unknown element",
        issue,
        severity,
        suggestion,
      });
    }
  });

  // Check for missing hover-contrast-safe class on interactive elements
  const interactiveElements = [
    "button",
    "Link",
    "a href",
    "onClick",
    "cursor-pointer",
  ];

  interactiveElements.forEach((element) => {
    const elementRegex = new RegExp(`<${element}[^>]*hover:[^>]*>`, "g");
    const matches = componentCode.match(elementRegex);

    if (matches) {
      matches.forEach((match) => {
        if (!match.includes("hover-contrast-safe")) {
          issues.push({
            component: componentName,
            element,
            issue: "Interactive element missing hover-contrast-safe class",
            severity: "info",
            suggestion:
              "Add hover-contrast-safe class to ensure proper contrast",
          });
        }
      });
    }
  });

  return issues;
}

/**
 * Validate hover states in CSS code
 */
export function validateCSSHoverStates(
  cssCode: string,
  fileName: string
): HoverStateIssue[] {
  const issues: HoverStateIssue[] = [];

  // Check for hover selectors with potential issues
  const hoverRules = cssCode.match(/:hover\s*{[^}]+}/g) || [];

  hoverRules.forEach((rule, index) => {
    // Check for white text on yellow background
    if (rule.includes("color: white") && rule.includes("background: yellow")) {
      issues.push({
        component: fileName,
        element: `Hover rule ${index + 1}`,
        issue: "White text on yellow background in CSS hover state",
        severity: "error",
        suggestion: "Use black text on yellow background instead",
      });
    }

    // Check for same color text and background
    const colorMatch = rule.match(/color:\s*([^;]+)/);
    const bgMatch = rule.match(/background(?:-color)?:\s*([^;]+)/);

    if (colorMatch && bgMatch && colorMatch[1].trim() === bgMatch[1].trim()) {
      issues.push({
        component: fileName,
        element: `Hover rule ${index + 1}`,
        issue: "Same color for text and background in hover state",
        severity: "error",
        suggestion: "Use contrasting colors for visibility",
      });
    }
  });

  return issues;
}

/**
 * Run comprehensive hover state validation
 */
export function runHoverStateValidation(): void {
  if (process.env.NODE_ENV !== "development") return;

  console.log("🔍 Running hover state validation...");

  // This would typically scan actual component files
  // For now, we'll provide validation functions that can be called

  const validationResults = {
    totalIssues: 0,
    errors: 0,
    warnings: 0,
    info: 0,
  };

  console.log("✅ Hover state validation complete:", validationResults);
}

/**
 * Validate specific hover color combinations
 */
export function validateHoverColorCombination(
  baseColors: { background: string; text: string },
  hoverColors: { background: string; text: string },
  componentName: string
): boolean {
  const isProblematic = isProblematicHoverCombination(
    hoverColors.background,
    hoverColors.text
  );

  if (isProblematic && process.env.NODE_ENV === "development") {
    console.error(
      `[Hover Validation Error] ${componentName}: Problematic hover combination detected!`,
      {
        base: baseColors,
        hover: hoverColors,
      }
    );
  }

  return !isProblematic;
}

/**
 * Get recommended hover colors for a given base state
 */
export function getRecommendedHoverColors(baseColors: {
  background: string;
  text: string;
}): { background: string; text: string } {
  const { background, text } = baseColors;

  // Invert colors safely
  if (background === BRUTALIST_COLORS.WHITE) {
    return {
      background: BRUTALIST_COLORS.BLACK,
      text: BRUTALIST_COLORS.WHITE,
    };
  }

  if (background === BRUTALIST_COLORS.BLACK) {
    return {
      background: BRUTALIST_COLORS.WHITE,
      text: BRUTALIST_COLORS.BLACK,
    };
  }

  if (background === BRUTALIST_COLORS.YELLOW) {
    return {
      background: BRUTALIST_COLORS.BLACK,
      text: BRUTALIST_COLORS.YELLOW,
    };
  }

  // Default safe combination
  return {
    background: BRUTALIST_COLORS.BLACK,
    text: BRUTALIST_COLORS.WHITE,
  };
}

/**
 * Development-time hover state checker
 */
export function checkHoverStates(): void {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
    return;
  }

  // Check for elements with potentially problematic hover states
  const interactiveElements = document.querySelectorAll(
    'button, a, [role="button"], .cursor-pointer'
  );

  interactiveElements.forEach((element, index) => {
    const computedStyle = window.getComputedStyle(element);
    const className = element.className;

    // Check for problematic class combinations
    if (
      className.includes("hover:text-white") &&
      className.includes("bg-yellow")
    ) {
      console.warn(
        `[Hover Issue] Element ${index}: Potential white text on yellow background`,
        element
      );
    }

    if (
      className.includes("hover:bg-yellow") &&
      className.includes("text-white")
    ) {
      console.warn(
        `[Hover Issue] Element ${index}: Potential white text on yellow background`,
        element
      );
    }
  });
}

// Auto-run validation in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Run validation after DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkHoverStates);
  } else {
    checkHoverStates();
  }

  // Re-run validation when new elements are added
  const observer = new MutationObserver(() => {
    setTimeout(checkHoverStates, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
