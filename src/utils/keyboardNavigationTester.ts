/**
 * Comprehensive Keyboard Navigation Testing Utilities
 *
 * This module provides utilities to test keyboard navigation flow,
 * tab order, and accessibility compliance for interactive elements.
 */

export interface KeyboardNavigationTestResult {
  totalElements: number;
  focusableElements: number;
  tabOrder: Array<{
    index: number;
    element: string;
    selector: string;
    tabIndex: number;
    isVisible: boolean;
    hasAccessibleName: boolean;
    accessibleName: string;
    role: string | null;
    context: string;
  }>;
  issues: Array<{
    type: "error" | "warning" | "info";
    element: string;
    message: string;
    recommendation: string;
  }>;
  skipLinks: Array<{
    text: string;
    target: string;
    isValid: boolean;
  }>;
  focusTraps: Array<{
    container: string;
    isValid: boolean;
    firstFocusable: string | null;
    lastFocusable: string | null;
  }>;
  accessibilityScore: number;
}

/**
 * Run comprehensive keyboard navigation tests
 */
export function runKeyboardNavigationTests(): KeyboardNavigationTestResult {
  console.group("⌨️ Comprehensive Keyboard Navigation Testing");
  console.log("Testing keyboard navigation flow and accessibility...");

  const result: KeyboardNavigationTestResult = {
    totalElements: 0,
    focusableElements: 0,
    tabOrder: [],
    issues: [],
    skipLinks: [],
    focusTraps: [],
    accessibilityScore: 0,
  };

  // Get all elements
  const allElements = document.querySelectorAll("*");
  result.totalElements = allElements.length;

  // Get all focusable elements with enhanced selector
  const focusableElements = document.querySelectorAll(`
    button:not([disabled]),
    a[href],
    input:not([disabled]):not([type="hidden"]),
    textarea:not([disabled]),
    select:not([disabled]),
    [tabindex]:not([tabindex="-1"]):not([disabled]),
    [role="button"]:not([disabled]),
    [role="link"]:not([disabled]),
    [role="menuitem"]:not([disabled]),
    [role="tab"]:not([disabled]),
    [role="checkbox"]:not([disabled]),
    [role="radio"]:not([disabled]),
    [contenteditable="true"]:not([disabled]),
    audio[controls],
    video[controls],
    iframe:not([tabindex="-1"]),
    object,
    embed,
    area[href],
    summary
  `);

  result.focusableElements = focusableElements.length;

  // Test each focusable element
  focusableElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const testResult = testFocusableElement(htmlElement, index);

    result.tabOrder.push(testResult);

    // Check for issues
    const issues = validateFocusableElement(htmlElement, testResult);
    result.issues.push(...issues);
  });

  // Test skip links
  result.skipLinks = testSkipLinks();

  // Test focus traps
  result.focusTraps = testFocusTraps();

  // Calculate accessibility score
  result.accessibilityScore = calculateKeyboardAccessibilityScore(result);

  // Log results
  logKeyboardNavigationResults(result);

  console.groupEnd();
  return result;
}

/**
 * Test individual focusable element
 */
function testFocusableElement(element: HTMLElement, index: number) {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  // Get accessible name
  const accessibleName = getAccessibleName(element);

  // Get element context
  const context = getElementContext(element);

  return {
    index,
    element: element.tagName.toLowerCase(),
    selector: getElementSelector(element, index),
    tabIndex: element.tabIndex,
    isVisible:
      rect.width > 0 &&
      rect.height > 0 &&
      computedStyle.visibility !== "hidden",
    hasAccessibleName: !!accessibleName,
    accessibleName: accessibleName || "",
    role: element.getAttribute("role"),
    context,
  };
}

/**
 * Validate focusable element for issues
 */
function validateFocusableElement(
  element: HTMLElement,
  testResult: {
    index: number;
    element: string;
    selector: string;
    tabIndex: number;
    isVisible: boolean;
    hasAccessibleName: boolean;
    accessibleName: string;
    role: string | null;
    context: string;
  }
) {
  const issues: Array<{
    type: "error" | "warning" | "info";
    element: string;
    message: string;
    recommendation: string;
  }> = [];

  // Check tab index issues
  if (testResult.tabIndex > 0) {
    issues.push({
      type: "warning",
      element: testResult.selector,
      message: `Positive tabindex (${testResult.tabIndex}) may disrupt natural tab order`,
      recommendation:
        'Use tabindex="0" or remove tabindex to maintain natural order',
    });
  }

  // Check visibility
  if (!testResult.isVisible) {
    issues.push({
      type: "error",
      element: testResult.selector,
      message: "Element is focusable but not visible",
      recommendation:
        'Make element visible or remove from tab order with tabindex="-1"',
    });
  }

  // Check accessible name
  if (!testResult.hasAccessibleName) {
    issues.push({
      type: "error",
      element: testResult.selector,
      message: "Element lacks accessible name",
      recommendation:
        "Add aria-label, aria-labelledby, or visible text content",
    });
  }

  // Check minimum touch target size
  const rect = element.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    issues.push({
      type: "warning",
      element: testResult.selector,
      message: `Touch target too small (${rect.width}x${rect.height}px)`,
      recommendation: "Ensure minimum 44x44px touch target size",
    });
  }

  // Check for proper ARIA attributes
  const role = element.getAttribute("role");
  if (role && !isValidRole(role)) {
    issues.push({
      type: "error",
      element: testResult.selector,
      message: `Invalid ARIA role: ${role}`,
      recommendation: "Use valid ARIA role or remove role attribute",
    });
  }

  // Check for proper button/link semantics
  if (
    element.tagName.toLowerCase() === "div" &&
    (element.onclick || element.getAttribute("role") === "button")
  ) {
    issues.push({
      type: "info",
      element: testResult.selector,
      message: "Consider using semantic button element instead of div",
      recommendation: "Use <button> element for better accessibility",
    });
  }

  return issues;
}

/**
 * Test skip links functionality
 */
function testSkipLinks() {
  const skipLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  return Array.from(skipLinks).map((link) => {
    const href = link.getAttribute("href") || "";
    const target = document.querySelector(href);

    return {
      text: link.textContent?.trim() || "",
      target: href,
      isValid: !!target,
    };
  });
}

/**
 * Test focus traps in modals and overlays
 */
function testFocusTraps() {
  const potentialTraps = document.querySelectorAll(
    '[role="dialog"], .modal, .overlay, .popup'
  );

  return Array.from(potentialTraps).map((container) => {
    const focusableInside = container.querySelectorAll(`
      button:not([disabled]),
      a[href],
      input:not([disabled]):not([type="hidden"]),
      textarea:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `);

    return {
      container: getElementSelector(container as HTMLElement, 0),
      isValid: focusableInside.length > 0,
      firstFocusable:
        focusableInside.length > 0
          ? getElementSelector(focusableInside[0] as HTMLElement, 0)
          : null,
      lastFocusable:
        focusableInside.length > 0
          ? getElementSelector(
              focusableInside[focusableInside.length - 1] as HTMLElement,
              0
            )
          : null,
    };
  });
}

/**
 * Get accessible name for an element
 */
function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledby = element.getAttribute("aria-labelledby");
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent?.trim() || "";
  }

  // Check associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent?.trim() || "";
  }

  // Check title attribute
  const title = element.getAttribute("title");
  if (title) return title;

  // Check text content for buttons and links
  if (["button", "a"].includes(element.tagName.toLowerCase())) {
    return element.textContent?.trim() || "";
  }

  // Check placeholder for inputs
  if (element.tagName.toLowerCase() === "input") {
    const placeholder = element.getAttribute("placeholder");
    if (placeholder) return placeholder;
  }

  // Check alt text for images
  if (element.tagName.toLowerCase() === "img") {
    const alt = element.getAttribute("alt");
    if (alt) return alt;
  }

  return "";
}

/**
 * Get element context for better reporting
 */
function getElementContext(element: HTMLElement): string {
  const classList = Array.from(element.classList);
  const role = element.getAttribute("role");
  const tagName = element.tagName.toLowerCase();

  // Check for navigation context
  if (element.closest("nav") || classList.some((c) => c.includes("nav"))) {
    return "Navigation";
  }

  // Check for form context
  if (
    element.closest("form") ||
    ["input", "textarea", "select", 'button[type="submit"]'].includes(tagName)
  ) {
    return "Form";
  }

  // Check for modal context
  if (element.closest('[role="dialog"]') || element.closest(".modal")) {
    return "Modal";
  }

  // Check for header context
  if (element.closest("header")) {
    return "Header";
  }

  // Check for footer context
  if (element.closest("footer")) {
    return "Footer";
  }

  // Check for main content context
  if (element.closest("main") || element.closest('[role="main"]')) {
    return "Main Content";
  }

  // Check by role
  if (role) {
    return `Role: ${role}`;
  }

  // Check by component class
  if (classList.includes("brutalist-btn")) return "Brutalist Button";
  if (classList.includes("brutalist-card")) return "Brutalist Card";
  if (classList.includes("brutalist-toggle")) return "Dark Mode Toggle";

  return tagName;
}

/**
 * Get unique selector for an element
 */
function getElementSelector(element: HTMLElement, index: number): string {
  const tagName = element.tagName.toLowerCase();
  const id = element.id;
  const classList = Array.from(element.classList);

  if (id) {
    return `#${id}`;
  }

  if (classList.length > 0) {
    return `${tagName}.${classList[0]}[${index}]`;
  }

  return `${tagName}[${index}]`;
}

/**
 * Check if ARIA role is valid
 */
function isValidRole(role: string): boolean {
  const validRoles = [
    "alert",
    "alertdialog",
    "application",
    "article",
    "banner",
    "button",
    "cell",
    "checkbox",
    "columnheader",
    "combobox",
    "complementary",
    "contentinfo",
    "definition",
    "dialog",
    "directory",
    "document",
    "feed",
    "figure",
    "form",
    "grid",
    "gridcell",
    "group",
    "heading",
    "img",
    "link",
    "list",
    "listbox",
    "listitem",
    "log",
    "main",
    "marquee",
    "math",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "navigation",
    "none",
    "note",
    "option",
    "presentation",
    "progressbar",
    "radio",
    "radiogroup",
    "region",
    "row",
    "rowgroup",
    "rowheader",
    "scrollbar",
    "search",
    "searchbox",
    "separator",
    "slider",
    "spinbutton",
    "status",
    "switch",
    "tab",
    "table",
    "tablist",
    "tabpanel",
    "term",
    "textbox",
    "timer",
    "toolbar",
    "tooltip",
    "tree",
    "treegrid",
    "treeitem",
  ];

  return validRoles.includes(role);
}

/**
 * Calculate keyboard accessibility score
 */
function calculateKeyboardAccessibilityScore(
  result: KeyboardNavigationTestResult
): number {
  let score = 100;

  // Deduct points for errors
  const errors = result.issues.filter((i) => i.type === "error");
  score -= errors.length * 10;

  // Deduct points for warnings
  const warnings = result.issues.filter((i) => i.type === "warning");
  score -= warnings.length * 5;

  // Deduct points for missing accessible names
  const missingNames = result.tabOrder.filter((t) => !t.hasAccessibleName);
  score -= missingNames.length * 8;

  // Deduct points for invisible focusable elements
  const invisibleElements = result.tabOrder.filter((t) => !t.isVisible);
  score -= invisibleElements.length * 15;

  // Bonus points for skip links
  if (result.skipLinks.length > 0) {
    score += 5;
  }

  // Bonus points for valid focus traps
  const validTraps = result.focusTraps.filter((t) => t.isValid);
  score += validTraps.length * 3;

  return Math.max(0, Math.min(100, score));
}

/**
 * Log keyboard navigation test results
 */
function logKeyboardNavigationResults(
  result: KeyboardNavigationTestResult
): void {
  console.group("📊 Keyboard Navigation Test Results");

  console.log(`📈 Accessibility Score: ${result.accessibilityScore}/100`);
  console.log(`📊 Total Elements: ${result.totalElements}`);
  console.log(`⌨️ Focusable Elements: ${result.focusableElements}`);
  console.log(`🔗 Skip Links: ${result.skipLinks.length}`);
  console.log(`🔒 Focus Traps: ${result.focusTraps.length}`);

  // Show issues by type
  const errors = result.issues.filter((i) => i.type === "error");
  const warnings = result.issues.filter((i) => i.type === "warning");
  const info = result.issues.filter((i) => i.type === "info");

  console.log(`❌ Errors: ${errors.length}`);
  console.log(`⚠️ Warnings: ${warnings.length}`);
  console.log(`ℹ️ Info: ${info.length}`);

  // Show critical issues
  if (errors.length > 0) {
    console.group("❌ Critical Issues");
    errors.forEach((issue) => {
      console.error(`${issue.element}: ${issue.message}`);
      console.log(`💡 Recommendation: ${issue.recommendation}`);
    });
    console.groupEnd();
  }

  // Show tab order summary
  console.group("⌨️ Tab Order Summary");
  result.tabOrder.forEach((item, index) => {
    const status = item.isVisible ? "✅" : "❌";
    const name = item.hasAccessibleName ? "🏷️" : "❓";
    console.log(
      `${index + 1}. ${status} ${name} ${item.element} (${item.context})`
    );
  });
  console.groupEnd();

  // Show skip links
  if (result.skipLinks.length > 0) {
    console.group("🔗 Skip Links");
    result.skipLinks.forEach((link) => {
      const status = link.isValid ? "✅" : "❌";
      console.log(`${status} "${link.text}" → ${link.target}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Test keyboard navigation flow interactively
 */
export function testKeyboardNavigationFlow(): Promise<void> {
  return new Promise((resolve) => {
    console.log("🎯 Starting interactive keyboard navigation test...");
    console.log("Press Tab to navigate, Escape to stop testing");

    const focusableElements = document.querySelectorAll(`
      button:not([disabled]),
      a[href],
      input:not([disabled]):not([type="hidden"]),
      textarea:not([disabled]),
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `);

    let currentIndex = 0;
    const testResults: Array<{
      element: string;
      focused: boolean;
      visible: boolean;
      accessible: boolean;
    }> = [];

    function focusNextElement() {
      if (currentIndex < focusableElements.length) {
        const element = focusableElements[currentIndex] as HTMLElement;
        element.focus();

        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const hasAccessibleName = !!getAccessibleName(element);

        testResults.push({
          element: `${element.tagName.toLowerCase()}[${currentIndex}]`,
          focused: document.activeElement === element,
          visible: isVisible,
          accessible: hasAccessibleName,
        });

        console.log(
          `Focused element ${currentIndex + 1}/${focusableElements.length}:`,
          {
            element: element.tagName.toLowerCase(),
            class: element.className,
            visible: isVisible,
            accessible: hasAccessibleName,
          }
        );

        currentIndex++;
        setTimeout(focusNextElement, 1000);
      } else {
        console.log("✅ Keyboard navigation test complete");
        console.table(testResults);
        resolve();
      }
    }

    // Start the test
    focusNextElement();

    // Allow manual escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("⏹️ Test stopped by user");
        document.removeEventListener("keydown", handleKeyDown);
        resolve();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
  });
}

// Auto-run tests in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      runKeyboardNavigationTests();
    }, 3000);
  });
}

const keyboardNavigationTester = {
  runKeyboardNavigationTests,
  testKeyboardNavigationFlow,
};

export default keyboardNavigationTester;
