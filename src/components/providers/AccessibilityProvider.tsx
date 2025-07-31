"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  prefersReducedMotion,
  prefersHighContrast,
  addFocusVisiblePolyfill,
  liveRegionManager,
  runAccessibilityChecks,
} from "@/lib/accessibility";

interface AccessibilityContextType {
  reducedMotion: boolean;
  highContrast: boolean;
  announceToScreenReader: (
    message: string,
    priority?: "polite" | "assertive"
  ) => void;
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export default function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">(
    "normal"
  );

  useEffect(() => {
    // Initialize accessibility features
    setReducedMotion(prefersReducedMotion());
    setHighContrast(prefersHighContrast());

    // Add focus visible polyfill
    addFocusVisiblePolyfill();

    // Create live regions
    liveRegionManager.createRegion("announcements", "polite");
    liveRegionManager.createRegion("alerts", "assertive");

    // Run accessibility checks in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(runAccessibilityChecks, 1000);
    }

    // Listen for media query changes
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    highContrastQuery.addEventListener("change", handleHighContrastChange);

    // Load saved font size preference
    const savedFontSize = localStorage.getItem("fontSize") as
      | "normal"
      | "large"
      | "extra-large";
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    return () => {
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange
      );
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
      liveRegionManager.destroy("announcements");
      liveRegionManager.destroy("alerts");
    };
  }, []);

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-normal", "font-large", "font-extra-large");
    root.classList.add(`font-${fontSize}`);

    // Save preference
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // Apply reduced motion styles
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
  }, [reducedMotion]);

  // Apply high contrast styles
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const announceToScreenReader = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    const regionId = priority === "assertive" ? "alerts" : "announcements";
    liveRegionManager.announce(regionId, message);
  };

  const value: AccessibilityContextType = {
    reducedMotion,
    highContrast,
    announceToScreenReader,
    fontSize,
    setFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
