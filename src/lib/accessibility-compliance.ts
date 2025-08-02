// WCAG 2.1 AA Compliance utilities and testing

export interface AccessibilityIssue {
  id: string;
  type: "error" | "warning" | "notice";
  rule: string;
  wcagLevel: "A" | "AA" | "AAA";
  wcagCriteria: string;
  element: string;
  description: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  suggestions: string[];
  xpath?: string;
  selector?: string;
}

export interface AccessibilityReport {
  timestamp: Date;
  url: string;
  totalIssues: number;
  criticalIssues: number;
  seriousIssues: number;
  moderateIssues: number;
  minorIssues: number;
  complianceScore: number;
  issues: AccessibilityIssue[];
  passedRules: string[];
  testedElements: number;
}

export interface ColorContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  level: "pass" | "fail";
  suggestions: string[];
}

// WCAG 2.1 AA compliance checker
export class AccessibilityComplianceChecker {
  private static instance: AccessibilityComplianceChecker;
  private issues: AccessibilityIssue[] = [];
  private passedRules: string[] = [];

  static getInstance(): AccessibilityComplianceChecker {
    if (!AccessibilityComplianceChecker.instance) {
      AccessibilityComplianceChecker.instance =
        new AccessibilityComplianceChecker();
    }
    return AccessibilityComplianceChecker.instance;
  }

  // Run comprehensive accessibility audit
  async runAudit(
    element: HTMLElement = document.body
  ): Promise<AccessibilityReport> {
    this.issues = [];
    this.passedRules = [];

    const startTime = performance.now();

    // Run all WCAG 2.1 AA checks
    await this.checkImages(element);
    await this.checkHeadings(element);
    await this.checkLinks(element);
    await this.checkForms(element);
    await this.checkButtons(element);
    await this.checkColorContrast(element);
    await this.checkKeyboardNavigation(element);
    await this.checkFocusManagement(element);
    await this.checkAriaLabels(element);
    await this.checkSemanticStructure(element);
    await this.checkTextAlternatives(element);
    await this.checkLanguage(element);
    await this.checkTiming(element);
    await this.checkMotion(element);

    const endTime = performance.now();
    console.log(
      `Accessibility audit completed in ${(endTime - startTime).toFixed(2)}ms`
    );

    return this.generateReport();
  }

  // Check images for alt text and accessibility
  private async checkImages(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll("img");

    images.forEach((img, index) => {
      const alt = img.getAttribute("alt");
      const src = img.getAttribute("src");
      const role = img.getAttribute("role");

      // WCAG 1.1.1 - Non-text Content
      if (!alt && role !== "presentation" && role !== "none") {
        this.addIssue({
          type: "error",
          rule: "img-alt",
          wcagLevel: "A",
          wcagCriteria: "1.1.1",
          element: `img[${index}]`,
          description: "Image missing alt attribute",
          impact: "critical",
          suggestions: [
            "Add descriptive alt text",
            'Use alt="" for decorative images',
            'Add role="presentation" for decorative images',
          ],
          selector: this.getSelector(img),
        });
      }

      // Check for empty alt on non-decorative images
      if (
        alt === "" &&
        !src?.includes("decoration") &&
        role !== "presentation"
      ) {
        this.addIssue({
          type: "warning",
          rule: "img-alt-empty",
          wcagLevel: "A",
          wcagCriteria: "1.1.1",
          element: `img[${index}]`,
          description: "Image has empty alt text but may not be decorative",
          impact: "moderate",
          suggestions: [
            "Verify if image is decorative",
            "Add descriptive alt text if informative",
            'Add role="presentation" if decorative',
          ],
          selector: this.getSelector(img),
        });
      }

      // Check alt text quality
      if (
        alt &&
        (alt.toLowerCase().includes("image") ||
          alt.toLowerCase().includes("picture"))
      ) {
        this.addIssue({
          type: "warning",
          rule: "img-alt-quality",
          wcagLevel: "A",
          wcagCriteria: "1.1.1",
          element: `img[${index}]`,
          description:
            'Alt text contains redundant words like "image" or "picture"',
          impact: "minor",
          suggestions: [
            "Remove redundant words from alt text",
            "Focus on describing the content or function",
            "Keep alt text concise and meaningful",
          ],
          selector: this.getSelector(img),
        });
      }
    });

    if (images.length > 0) {
      this.passedRules.push("Images checked for alt text");
    }
  }

  // Check heading structure
  private async checkHeadings(element: HTMLElement): Promise<void> {
    const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headingLevels: number[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);

      // WCAG 1.3.1 - Info and Relationships
      if (heading.textContent?.trim() === "") {
        this.addIssue({
          type: "error",
          rule: "heading-empty",
          wcagLevel: "A",
          wcagCriteria: "1.3.1",
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          description: "Heading is empty",
          impact: "serious",
          suggestions: [
            "Add meaningful heading text",
            "Remove empty heading if not needed",
            "Use CSS for visual spacing instead",
          ],
          selector: this.getSelector(heading),
        });
      }

      // Check heading length
      if (heading.textContent && heading.textContent.length > 120) {
        this.addIssue({
          type: "warning",
          rule: "heading-length",
          wcagLevel: "AA",
          wcagCriteria: "2.4.6",
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          description: "Heading text is very long",
          impact: "minor",
          suggestions: [
            "Keep headings concise and descriptive",
            "Consider breaking into multiple sections",
            "Use subheadings for additional detail",
          ],
          selector: this.getSelector(heading),
        });
      }
    });

    // Check heading hierarchy
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];

      if (current > previous + 1) {
        this.addIssue({
          type: "warning",
          rule: "heading-hierarchy",
          wcagLevel: "AA",
          wcagCriteria: "1.3.1",
          element: `h${current}[${i}]`,
          description: `Heading level skipped from h${previous} to h${current}`,
          impact: "moderate",
          suggestions: [
            "Use sequential heading levels",
            "Don't skip heading levels",
            "Consider restructuring content hierarchy",
          ],
          selector: this.getSelector(headings[i]),
        });
      }
    }

    // Check for multiple h1s
    const h1Count = element.querySelectorAll("h1").length;
    if (h1Count > 1) {
      this.addIssue({
        type: "warning",
        rule: "multiple-h1",
        wcagLevel: "AA",
        wcagCriteria: "1.3.1",
        element: "h1",
        description: "Multiple h1 elements found",
        impact: "moderate",
        suggestions: [
          "Use only one h1 per page",
          "Use h2-h6 for subsections",
          "Consider page structure and hierarchy",
        ],
      });
    }

    if (headings.length > 0) {
      this.passedRules.push("Heading structure checked");
    }
  }

  // Check links for accessibility
  private async checkLinks(element: HTMLElement): Promise<void> {
    const links = element.querySelectorAll("a");

    links.forEach((link, index) => {
      const href = link.getAttribute("href");
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute("aria-label");
      const title = link.getAttribute("title");

      // WCAG 2.4.4 - Link Purpose
      if (!text && !ariaLabel && !title) {
        this.addIssue({
          type: "error",
          rule: "link-text",
          wcagLevel: "A",
          wcagCriteria: "2.4.4",
          element: `a[${index}]`,
          description: "Link has no accessible text",
          impact: "critical",
          suggestions: [
            "Add descriptive link text",
            "Use aria-label for context",
            "Add title attribute if needed",
          ],
          selector: this.getSelector(link),
        });
      }

      // Check for generic link text
      const genericTexts = ["click here", "read more", "more", "link", "here"];
      if (
        text &&
        genericTexts.some((generic) => text.toLowerCase().includes(generic))
      ) {
        this.addIssue({
          type: "warning",
          rule: "link-text-generic",
          wcagLevel: "AA",
          wcagCriteria: "2.4.4",
          element: `a[${index}]`,
          description: "Link text is not descriptive",
          impact: "moderate",
          suggestions: [
            "Use descriptive link text",
            "Describe the link destination",
            'Avoid generic phrases like "click here"',
          ],
          selector: this.getSelector(link),
        });
      }

      // Check external links
      if (
        href &&
        href.startsWith("http") &&
        !href.includes(window.location.hostname)
      ) {
        const hasExternalIndicator =
          link.querySelector('[aria-label*="external"]') ||
          ariaLabel?.includes("external") ||
          text?.includes("external");

        if (!hasExternalIndicator) {
          this.addIssue({
            type: "notice",
            rule: "link-external",
            wcagLevel: "AAA",
            wcagCriteria: "3.2.5",
            element: `a[${index}]`,
            description: "External link not clearly identified",
            impact: "minor",
            suggestions: [
              "Add visual indicator for external links",
              'Include "external" in aria-label',
              'Add target="_blank" with appropriate warning',
            ],
            selector: this.getSelector(link),
          });
        }
      }

      // Check target="_blank" without rel attributes
      if (link.getAttribute("target") === "_blank") {
        const rel = link.getAttribute("rel");
        if (
          !rel ||
          (!rel.includes("noopener") && !rel.includes("noreferrer"))
        ) {
          this.addIssue({
            type: "warning",
            rule: "link-target-blank",
            wcagLevel: "AA",
            wcagCriteria: "3.2.5",
            element: `a[${index}]`,
            description: "Link opens in new window without security attributes",
            impact: "moderate",
            suggestions: [
              'Add rel="noopener noreferrer"',
              "Warn users about new window",
              "Consider if new window is necessary",
            ],
            selector: this.getSelector(link),
          });
        }
      }
    });

    if (links.length > 0) {
      this.passedRules.push("Links checked for accessibility");
    }
  }

  // Check forms for accessibility
  private async checkForms(element: HTMLElement): Promise<void> {
    const forms = element.querySelectorAll("form");
    const inputs = element.querySelectorAll("input, textarea, select");

    inputs.forEach((input, index) => {
      const label = this.findLabel(input);
      const ariaLabel = input.getAttribute("aria-label");
      const ariaLabelledby = input.getAttribute("aria-labelledby");
      const placeholder = input.getAttribute("placeholder");
      const type = input.getAttribute("type");

      // WCAG 1.3.1 - Info and Relationships
      if (!label && !ariaLabel && !ariaLabelledby) {
        this.addIssue({
          type: "error",
          rule: "form-label",
          wcagLevel: "A",
          wcagCriteria: "1.3.1",
          element: `${input.tagName.toLowerCase()}[${index}]`,
          description: "Form control has no associated label",
          impact: "critical",
          suggestions: [
            "Add a label element",
            "Use aria-label attribute",
            "Use aria-labelledby to reference label",
          ],
          selector: this.getSelector(input),
        });
      }

      // Check placeholder as only label
      if (!label && !ariaLabel && !ariaLabelledby && placeholder) {
        this.addIssue({
          type: "warning",
          rule: "form-placeholder-label",
          wcagLevel: "AA",
          wcagCriteria: "1.3.1",
          element: `${input.tagName.toLowerCase()}[${index}]`,
          description: "Using placeholder as only label",
          impact: "serious",
          suggestions: [
            "Add a visible label",
            "Use aria-label in addition to placeholder",
            "Placeholders disappear when typing",
          ],
          selector: this.getSelector(input),
        });
      }

      // Check required fields
      if (input.hasAttribute("required")) {
        const hasRequiredIndicator =
          label?.textContent?.includes("*") ||
          ariaLabel?.includes("required") ||
          input.getAttribute("aria-required") === "true";

        if (!hasRequiredIndicator) {
          this.addIssue({
            type: "warning",
            rule: "form-required",
            wcagLevel: "AA",
            wcagCriteria: "3.3.2",
            element: `${input.tagName.toLowerCase()}[${index}]`,
            description: "Required field not clearly indicated",
            impact: "moderate",
            suggestions: [
              "Add visual indicator for required fields",
              'Use aria-required="true"',
              'Include "required" in label text',
            ],
            selector: this.getSelector(input),
          });
        }
      }

      // Check input type="password" autocomplete
      if (type === "password" && !input.getAttribute("autocomplete")) {
        this.addIssue({
          type: "notice",
          rule: "form-autocomplete",
          wcagLevel: "AA",
          wcagCriteria: "1.3.5",
          element: `input[${index}]`,
          description: "Password field missing autocomplete attribute",
          impact: "minor",
          suggestions: [
            'Add autocomplete="current-password" or "new-password"',
            "Help password managers identify fields",
            "Improve user experience",
          ],
          selector: this.getSelector(input),
        });
      }
    });

    // Check form submission
    forms.forEach((form, index) => {
      const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );
      const hasSubmit =
        submitButton || form.querySelector("button:not([type])");

      if (!hasSubmit) {
        this.addIssue({
          type: "warning",
          rule: "form-submit",
          wcagLevel: "AA",
          wcagCriteria: "3.2.2",
          element: `form[${index}]`,
          description: "Form has no submit button",
          impact: "moderate",
          suggestions: [
            "Add a submit button",
            "Ensure form can be submitted",
            "Consider keyboard users",
          ],
          selector: this.getSelector(form),
        });
      }
    });

    if (inputs.length > 0) {
      this.passedRules.push("Form controls checked for labels");
    }
  }

  // Check buttons for accessibility
  private async checkButtons(element: HTMLElement): Promise<void> {
    const buttons = element.querySelectorAll(
      'button, input[type="button"], input[type="submit"], input[type="reset"]'
    );

    buttons.forEach((button, index) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute("aria-label");
      const title = button.getAttribute("title");
      const value = button.getAttribute("value");

      // WCAG 4.1.2 - Name, Role, Value
      if (!text && !ariaLabel && !title && !value) {
        this.addIssue({
          type: "error",
          rule: "button-text",
          wcagLevel: "A",
          wcagCriteria: "4.1.2",
          element: `${button.tagName.toLowerCase()}[${index}]`,
          description: "Button has no accessible text",
          impact: "critical",
          suggestions: [
            "Add button text",
            "Use aria-label for icon buttons",
            "Add title attribute if needed",
          ],
          selector: this.getSelector(button),
        });
      }

      // Check button purpose
      if (text && text.length < 2) {
        this.addIssue({
          type: "warning",
          rule: "button-text-length",
          wcagLevel: "AA",
          wcagCriteria: "2.4.6",
          element: `${button.tagName.toLowerCase()}[${index}]`,
          description: "Button text is too short to be descriptive",
          impact: "moderate",
          suggestions: [
            "Use descriptive button text",
            "Explain what the button does",
            "Avoid single character buttons",
          ],
          selector: this.getSelector(button),
        });
      }

      // Check disabled buttons
      if (button.hasAttribute("disabled")) {
        const hasAriaDisabled = button.getAttribute("aria-disabled") === "true";
        if (!hasAriaDisabled) {
          this.addIssue({
            type: "notice",
            rule: "button-disabled",
            wcagLevel: "AA",
            wcagCriteria: "4.1.2",
            element: `${button.tagName.toLowerCase()}[${index}]`,
            description: "Disabled button should have aria-disabled",
            impact: "minor",
            suggestions: [
              'Add aria-disabled="true"',
              "Provide feedback about why button is disabled",
              "Consider using aria-describedby for explanation",
            ],
            selector: this.getSelector(button),
          });
        }
      }
    });

    if (buttons.length > 0) {
      this.passedRules.push("Buttons checked for accessibility");
    }
  }

  // Check color contrast
  private async checkColorContrast(element: HTMLElement): Promise<void> {
    const textElements = element.querySelectorAll(
      "p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, li"
    );

    for (const el of Array.from(textElements)) {
      if (el.textContent?.trim()) {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;

        // Skip if transparent background
        if (
          backgroundColor === "rgba(0, 0, 0, 0)" ||
          backgroundColor === "transparent"
        ) {
          continue;
        }

        const contrast = this.calculateColorContrast(color, backgroundColor);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;

        // Determine if text is large (18pt+ or 14pt+ bold)
        const isLargeText =
          fontSize >= 18 ||
          (fontSize >= 14 &&
            (fontWeight === "bold" || parseInt(fontWeight) >= 700));

        // WCAG AA requirements
        const requiredRatio = isLargeText ? 3 : 4.5;

        if (contrast < requiredRatio) {
          this.addIssue({
            type: "error",
            rule: "color-contrast",
            wcagLevel: "AA",
            wcagCriteria: "1.4.3",
            element: el.tagName.toLowerCase(),
            description: `Color contrast ratio ${contrast.toFixed(
              2
            )}:1 is below required ${requiredRatio}:1`,
            impact: "serious",
            suggestions: [
              "Increase color contrast",
              "Use darker text or lighter background",
              "Test with color contrast tools",
              `Current: ${color} on ${backgroundColor}`,
            ],
            selector: this.getSelector(el),
          });
        }
      }
    }

    this.passedRules.push("Color contrast checked");
  }

  // Check keyboard navigation
  private async checkKeyboardNavigation(element: HTMLElement): Promise<void> {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((el, index) => {
      const tabIndex = el.getAttribute("tabindex");

      // WCAG 2.1.1 - Keyboard
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: "warning",
          rule: "tabindex-positive",
          wcagLevel: "A",
          wcagCriteria: "2.1.1",
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: "Positive tabindex can disrupt keyboard navigation",
          impact: "moderate",
          suggestions: [
            'Use tabindex="0" or remove tabindex',
            "Rely on natural tab order",
            "Use CSS for visual order",
          ],
          selector: this.getSelector(el),
        });
      }

      // Check focus visibility
      const styles = window.getComputedStyle(el, ":focus");
      const outline = styles.outline;
      const outlineWidth = styles.outlineWidth;

      if (outline === "none" || outlineWidth === "0px") {
        this.addIssue({
          type: "warning",
          rule: "focus-visible",
          wcagLevel: "AA",
          wcagCriteria: "2.4.7",
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: "Element has no visible focus indicator",
          impact: "serious",
          suggestions: [
            "Add visible focus styles",
            "Use outline or border for focus",
            "Ensure focus is clearly visible",
          ],
          selector: this.getSelector(el),
        });
      }
    });

    if (focusableElements.length > 0) {
      this.passedRules.push("Keyboard navigation checked");
    }
  }

  // Check focus management
  private async checkFocusManagement(element: HTMLElement): Promise<void> {
    // Check for skip links
    const skipLinks = element.querySelectorAll('a[href^="#"]');
    const hasSkipToMain = Array.from(skipLinks).some(
      (link) =>
        link.textContent?.toLowerCase().includes("skip") &&
        link.textContent?.toLowerCase().includes("main")
    );

    if (!hasSkipToMain && element === document.body) {
      this.addIssue({
        type: "warning",
        rule: "skip-link",
        wcagLevel: "A",
        wcagCriteria: "2.4.1",
        element: "body",
        description: "No skip to main content link found",
        impact: "moderate",
        suggestions: [
          "Add skip to main content link",
          "Place at beginning of page",
          "Make visually hidden but focusable",
        ],
      });
    }

    // Check for focus traps in modals
    const modals = element.querySelectorAll(
      '[role="dialog"], [role="alertdialog"], .modal'
    );
    modals.forEach((modal, index) => {
      const focusableInModal = modal.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableInModal.length === 0) {
        this.addIssue({
          type: "warning",
          rule: "modal-focus",
          wcagLevel: "AA",
          wcagCriteria: "2.1.2",
          element: `modal[${index}]`,
          description: "Modal has no focusable elements",
          impact: "serious",
          suggestions: [
            "Add focusable elements to modal",
            "Include close button",
            "Implement focus trap",
          ],
          selector: this.getSelector(modal),
        });
      }
    });

    this.passedRules.push("Focus management checked");
  }

  // Check ARIA labels and attributes
  private async checkAriaLabels(element: HTMLElement): Promise<void> {
    const elementsWithAria = element.querySelectorAll(
      "[aria-label], [aria-labelledby], [aria-describedby], [role]"
    );

    elementsWithAria.forEach((el, index) => {
      const ariaLabel = el.getAttribute("aria-label");
      const ariaLabelledby = el.getAttribute("aria-labelledby");
      const ariaDescribedby = el.getAttribute("aria-describedby");
      const role = el.getAttribute("role");

      // Check aria-labelledby references
      if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        if (!referencedElement) {
          this.addIssue({
            type: "error",
            rule: "aria-labelledby-invalid",
            wcagLevel: "A",
            wcagCriteria: "4.1.2",
            element: `${el.tagName.toLowerCase()}[${index}]`,
            description: `aria-labelledby references non-existent element: ${ariaLabelledby}`,
            impact: "serious",
            suggestions: [
              "Ensure referenced element exists",
              "Check element ID spelling",
              "Use aria-label instead if no reference needed",
            ],
            selector: this.getSelector(el),
          });
        }
      }

      // Check aria-describedby references
      if (ariaDescribedby) {
        const referencedElement = document.getElementById(ariaDescribedby);
        if (!referencedElement) {
          this.addIssue({
            type: "error",
            rule: "aria-describedby-invalid",
            wcagLevel: "A",
            wcagCriteria: "4.1.2",
            element: `${el.tagName.toLowerCase()}[${index}]`,
            description: `aria-describedby references non-existent element: ${ariaDescribedby}`,
            impact: "serious",
            suggestions: [
              "Ensure referenced element exists",
              "Check element ID spelling",
              "Remove aria-describedby if not needed",
            ],
            selector: this.getSelector(el),
          });
        }
      }

      // Check empty aria-label
      if (ariaLabel === "") {
        this.addIssue({
          type: "warning",
          rule: "aria-label-empty",
          wcagLevel: "A",
          wcagCriteria: "4.1.2",
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: "aria-label is empty",
          impact: "moderate",
          suggestions: [
            "Provide meaningful aria-label text",
            "Remove aria-label if not needed",
            "Use aria-labelledby instead",
          ],
          selector: this.getSelector(el),
        });
      }

      // Check invalid roles
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

      if (role && !validRoles.includes(role)) {
        this.addIssue({
          type: "error",
          rule: "aria-role-invalid",
          wcagLevel: "A",
          wcagCriteria: "4.1.2",
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: `Invalid ARIA role: ${role}`,
          impact: "serious",
          suggestions: [
            "Use valid ARIA role",
            "Check ARIA specification",
            "Remove role if not needed",
          ],
          selector: this.getSelector(el),
        });
      }
    });

    if (elementsWithAria.length > 0) {
      this.passedRules.push("ARIA attributes checked");
    }
  }

  // Check semantic structure
  private async checkSemanticStructure(element: HTMLElement): Promise<void> {
    // Check for main landmark
    const main = element.querySelector('main, [role="main"]');
    if (!main && element === document.body) {
      this.addIssue({
        type: "warning",
        rule: "landmark-main",
        wcagLevel: "AA",
        wcagCriteria: "1.3.1",
        element: "body",
        description: "No main landmark found",
        impact: "moderate",
        suggestions: [
          "Add <main> element",
          'Use role="main" on container',
          "Identify main content area",
        ],
      });
    }

    // Check for navigation landmark
    const nav = element.querySelector('nav, [role="navigation"]');
    if (!nav && element === document.body) {
      this.addIssue({
        type: "notice",
        rule: "landmark-navigation",
        wcagLevel: "AA",
        wcagCriteria: "1.3.1",
        element: "body",
        description: "No navigation landmark found",
        impact: "minor",
        suggestions: [
          "Add <nav> element for navigation",
          'Use role="navigation"',
          "Identify navigation areas",
        ],
      });
    }

    // Check list structure
    const lists = element.querySelectorAll("ul, ol");
    lists.forEach((list, index) => {
      const directChildren = Array.from(list.children);
      const nonListItems = directChildren.filter(
        (child) => child.tagName !== "LI"
      );

      if (nonListItems.length > 0) {
        this.addIssue({
          type: "warning",
          rule: "list-structure",
          wcagLevel: "A",
          wcagCriteria: "1.3.1",
          element: `${list.tagName.toLowerCase()}[${index}]`,
          description: "List contains non-list-item children",
          impact: "moderate",
          suggestions: [
            "Only use <li> elements as direct children",
            "Wrap other content in <li>",
            "Use proper list structure",
          ],
          selector: this.getSelector(list),
        });
      }
    });

    this.passedRules.push("Semantic structure checked");
  }

  // Check text alternatives
  private async checkTextAlternatives(element: HTMLElement): Promise<void> {
    // Check for text in images (like logos)
    const images = element.querySelectorAll("img");
    images.forEach((img, index) => {
      const src = img.getAttribute("src");
      if (src && (src.includes("logo") || src.includes("brand"))) {
        const alt = img.getAttribute("alt");
        if (
          !alt ||
          alt.toLowerCase().includes("logo") ||
          alt.toLowerCase().includes("image")
        ) {
          this.addIssue({
            type: "warning",
            rule: "logo-alt-text",
            wcagLevel: "A",
            wcagCriteria: "1.1.1",
            element: `img[${index}]`,
            description: "Logo image needs descriptive alt text",
            impact: "moderate",
            suggestions: [
              "Use company/brand name as alt text",
              "Describe the logo content",
              'Avoid generic terms like "logo"',
            ],
            selector: this.getSelector(img),
          });
        }
      }
    });

    // Check for decorative images
    const decorativeImages = element.querySelectorAll(
      'img[alt=""], img[role="presentation"], img[role="none"]'
    );
    decorativeImages.forEach((img, index) => {
      // Verify if truly decorative
      const parent = img.parentElement;
      const isInLink = parent?.tagName === "A";

      if (isInLink) {
        this.addIssue({
          type: "warning",
          rule: "decorative-image-in-link",
          wcagLevel: "A",
          wcagCriteria: "1.1.1",
          element: `img[${index}]`,
          description: "Decorative image inside link may need alt text",
          impact: "moderate",
          suggestions: [
            "Provide alt text describing link purpose",
            "Ensure link has other accessible text",
            "Consider if image is truly decorative",
          ],
          selector: this.getSelector(img),
        });
      }
    });

    this.passedRules.push("Text alternatives checked");
  }

  // Check language attributes
  private async checkLanguage(element: HTMLElement): Promise<void> {
    if (element === document.body) {
      const html = document.documentElement;
      const lang = html.getAttribute("lang");

      // WCAG 3.1.1 - Language of Page
      if (!lang) {
        this.addIssue({
          type: "error",
          rule: "html-lang",
          wcagLevel: "A",
          wcagCriteria: "3.1.1",
          element: "html",
          description: "Page has no language attribute",
          impact: "serious",
          suggestions: [
            "Add lang attribute to <html>",
            'Use appropriate language code (e.g., "en")',
            "Specify primary language of content",
          ],
        });
      } else if (lang.length < 2) {
        this.addIssue({
          type: "warning",
          rule: "html-lang-valid",
          wcagLevel: "A",
          wcagCriteria: "3.1.1",
          element: "html",
          description: "Language attribute appears invalid",
          impact: "moderate",
          suggestions: [
            "Use valid language code",
            "Check ISO 639-1 language codes",
            'Use format like "en" or "en-US"',
          ],
        });
      }
    }

    // Check for language changes in content
    const elementsWithLang = element.querySelectorAll("[lang]");
    elementsWithLang.forEach((el, index) => {
      const lang = el.getAttribute("lang");
      if (!lang || lang.length < 2) {
        this.addIssue({
          type: "warning",
          rule: "lang-attribute-valid",
          wcagLevel: "AA",
          wcagCriteria: "3.1.2",
          element: `${el.tagName.toLowerCase()}[${index}]`,
          description: "Invalid language attribute",
          impact: "moderate",
          suggestions: [
            "Use valid language code",
            "Remove lang attribute if not needed",
            "Check language code format",
          ],
          selector: this.getSelector(el),
        });
      }
    });

    this.passedRules.push("Language attributes checked");
  }

  // Check timing and auto-updating content
  private async checkTiming(element: HTMLElement): Promise<void> {
    // Check for auto-refresh
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
      this.addIssue({
        type: "warning",
        rule: "meta-refresh",
        wcagLevel: "A",
        wcagCriteria: "2.2.1",
        element: "meta",
        description: "Page uses meta refresh",
        impact: "moderate",
        suggestions: [
          "Avoid automatic page refresh",
          "Provide user control over timing",
          "Use JavaScript with user controls instead",
        ],
      });
    }

    // Check for blinking/scrolling content
    const blinkingElements = element.querySelectorAll(
      '[style*="blink"], blink, marquee'
    );
    blinkingElements.forEach((el, index) => {
      this.addIssue({
        type: "error",
        rule: "no-blinking",
        wcagLevel: "A",
        wcagCriteria: "2.2.2",
        element: `${el.tagName.toLowerCase()}[${index}]`,
        description: "Content blinks or scrolls automatically",
        impact: "serious",
        suggestions: [
          "Remove blinking/scrolling effects",
          "Provide pause/stop controls",
          "Use static content instead",
        ],
        selector: this.getSelector(el),
      });
    });

    this.passedRules.push("Timing and auto-updating content checked");
  }

  // Check motion and animation
  private async checkMotion(element: HTMLElement): Promise<void> {
    // Check for CSS animations
    const animatedElements = element.querySelectorAll("*");
    let hasAnimations = false;

    animatedElements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const animation = styles.animation;
      const transition = styles.transition;

      if (
        (animation && animation !== "none") ||
        (transition && transition !== "none")
      ) {
        hasAnimations = true;
      }
    });

    if (hasAnimations) {
      // Check for prefers-reduced-motion support
      const hasReducedMotionCSS = Array.from(document.styleSheets).some(
        (sheet) => {
          try {
            return Array.from(sheet.cssRules).some((rule) =>
              rule.cssText.includes("prefers-reduced-motion")
            );
          } catch {
            return false;
          }
        }
      );

      if (!hasReducedMotionCSS) {
        this.addIssue({
          type: "warning",
          rule: "prefers-reduced-motion",
          wcagLevel: "AA",
          wcagCriteria: "2.3.3",
          element: "page",
          description:
            "Animations present but no prefers-reduced-motion support",
          impact: "moderate",
          suggestions: [
            "Add @media (prefers-reduced-motion: reduce) CSS",
            "Respect user motion preferences",
            "Provide option to disable animations",
          ],
        });
      }
    }

    this.passedRules.push("Motion and animation checked");
  }

  // Helper methods
  private findLabel(input: Element): HTMLLabelElement | null {
    const id = input.getAttribute("id");
    if (id) {
      return document.querySelector(`label[for="${id}"]`);
    }

    // Check if input is inside a label
    let parent = input.parentElement;
    while (parent) {
      if (parent.tagName === "LABEL") {
        return parent as HTMLLabelElement;
      }
      parent = parent.parentElement;
    }

    return null;
  }

  private getSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(" ").filter((c) => c.trim());
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes.join(".")}`;
      }
    }

    return element.tagName.toLowerCase();
  }

  private calculateColorContrast(
    foreground: string,
    background: string
  ): number {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    const rgb = this.parseColor(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private parseColor(color: string): [number, number, number] | null {
    // Handle rgb() format
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return [
        parseInt(rgbMatch[1]),
        parseInt(rgbMatch[2]),
        parseInt(rgbMatch[3]),
      ];
    }

    // Handle hex format
    const hexMatch = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      return [
        parseInt(hexMatch[1], 16),
        parseInt(hexMatch[2], 16),
        parseInt(hexMatch[3], 16),
      ];
    }

    return null;
  }

  private addIssue(issue: Omit<AccessibilityIssue, "id">): void {
    this.issues.push({
      id: `${issue.rule}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      ...issue,
    });
  }

  private generateReport(): AccessibilityReport {
    const criticalIssues = this.issues.filter(
      (i) => i.impact === "critical"
    ).length;
    const seriousIssues = this.issues.filter(
      (i) => i.impact === "serious"
    ).length;
    const moderateIssues = this.issues.filter(
      (i) => i.impact === "moderate"
    ).length;
    const minorIssues = this.issues.filter((i) => i.impact === "minor").length;

    // Calculate compliance score (0-100)
    const totalChecks = this.issues.length + this.passedRules.length;
    const passedChecks = this.passedRules.length;
    const complianceScore =
      totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    return {
      timestamp: new Date(),
      url: window.location.href,
      totalIssues: this.issues.length,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      complianceScore,
      issues: this.issues,
      passedRules: this.passedRules,
      testedElements: document.querySelectorAll("*").length,
    };
  }

  // Public methods
  getIssues(): AccessibilityIssue[] {
    return this.issues;
  }

  getIssuesByType(type: AccessibilityIssue["type"]): AccessibilityIssue[] {
    return this.issues.filter((issue) => issue.type === type);
  }

  getIssuesByImpact(
    impact: AccessibilityIssue["impact"]
  ): AccessibilityIssue[] {
    return this.issues.filter((issue) => issue.impact === impact);
  }

  clearIssues(): void {
    this.issues = [];
    this.passedRules = [];
  }
}

// Export singleton instance
export const accessibilityChecker =
  AccessibilityComplianceChecker.getInstance();
