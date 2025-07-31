// Accessibility utilities and helpers

// Screen reader utilities
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  if (typeof window !== "undefined") {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.setAttribute("class", "sr-only");
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

// Focus management
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }

    if (e.key === "Escape") {
      // Close modal or return focus
      const closeButton = element.querySelector("[data-close]") as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Focus first element
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Skip link functionality
export const createSkipLink = (targetId: string, text: string) => {
  if (typeof window !== "undefined") {
    const skipLink = document.createElement("a");
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = "skip-link";
    skipLink.setAttribute("data-skip-link", "true");

    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });

    return skipLink;
  }
  return null;
};

// Keyboard navigation helpers
export const handleArrowKeyNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (newIndex: number) => void,
  orientation: "horizontal" | "vertical" = "horizontal"
) => {
  const { key } = event;
  let newIndex = currentIndex;

  if (orientation === "horizontal") {
    if (key === "ArrowLeft") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (key === "ArrowRight") {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    }
  } else {
    if (key === "ArrowUp") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (key === "ArrowDown") {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    }
  }

  if (key === "Home") {
    newIndex = 0;
  } else if (key === "End") {
    newIndex = items.length - 1;
  }

  if (newIndex !== currentIndex) {
    event.preventDefault();
    onIndexChange(newIndex);
    items[newIndex]?.focus();
  }
};

// Color contrast checker
export const checkColorContrast = (
  foreground: string,
  background: string
): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
};

// High contrast detection
export const prefersHighContrast = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-contrast: high)").matches;
  }
  return false;
};

// Focus visible utility
export const addFocusVisiblePolyfill = () => {
  if (typeof window !== "undefined") {
    let hadKeyboardEvent = true;

    const focusTriggersKeyboardModality = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return false;
      }

      switch (e.key) {
        case "Control":
        case "Shift":
        case "Meta":
        case "Alt":
          return false;
        default:
          return true;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (focusTriggersKeyboardModality(e)) {
        hadKeyboardEvent = true;
      }
    };

    const onPointerDown = () => {
      hadKeyboardEvent = false;
    };

    const onFocus = (e: FocusEvent) => {
      if (
        hadKeyboardEvent ||
        (e.target as HTMLElement).matches(":focus-visible")
      ) {
        (e.target as HTMLElement).classList.add("focus-visible");
      }
    };

    const onBlur = (e: FocusEvent) => {
      (e.target as HTMLElement).classList.remove("focus-visible");
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);
    document.addEventListener("focus", onFocus, true);
    document.addEventListener("blur", onBlur, true);
  }
};

// ARIA live region manager
class LiveRegionManager {
  private regions: Map<string, HTMLElement> = new Map();

  createRegion(id: string, politeness: "polite" | "assertive" = "polite") {
    if (typeof window === "undefined") return;

    const region = document.createElement("div");
    region.id = id;
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only";
    region.style.position = "absolute";
    region.style.left = "-10000px";
    region.style.width = "1px";
    region.style.height = "1px";
    region.style.overflow = "hidden";

    document.body.appendChild(region);
    this.regions.set(id, region);
  }

  announce(id: string, message: string) {
    const region = this.regions.get(id);
    if (region) {
      region.textContent = message;
    }
  }

  clear(id: string) {
    const region = this.regions.get(id);
    if (region) {
      region.textContent = "";
    }
  }

  destroy(id: string) {
    const region = this.regions.get(id);
    if (region && region.parentNode) {
      region.parentNode.removeChild(region);
      this.regions.delete(id);
    }
  }
}

export const liveRegionManager = new LiveRegionManager();

// Accessibility testing helpers (for development)
export const runAccessibilityChecks = () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Check for missing alt text
    const images = document.querySelectorAll("img:not([alt])");
    if (images.length > 0) {
      console.warn("Images without alt text found:", images);
    }

    // Check for missing form labels
    const inputs = document.querySelectorAll(
      "input:not([aria-label]):not([aria-labelledby])"
    );
    inputs.forEach((input) => {
      const inputElement = input as HTMLInputElement;
      const label = document.querySelector(`label[for="${inputElement.id}"]`);
      if (!label && inputElement.type !== "hidden") {
        console.warn("Input without label found:", input);
      }
    });

    // Check for missing heading hierarchy
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let previousLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        console.warn("Heading hierarchy skip found:", heading);
      }
      previousLevel = level;
    });

    // Check color contrast (basic check)
    const contrastRatio = checkColorContrast("#000000", "#ffffff");
    if (contrastRatio < 4.5) {
      console.warn("Low color contrast detected:", contrastRatio);
    }
  }
};
