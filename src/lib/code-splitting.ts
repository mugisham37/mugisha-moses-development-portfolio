// Simplified code splitting utilities for better AI tool compatibility

import { lazy, ComponentType } from "react";

// Simple lazy component creator
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: { preload?: boolean } = {}
) => {
  const LazyComponent = lazy(importFunc);
  
  // Preload if requested
  if (options.preload) {
    importFunc();
  }
  
  return LazyComponent;
};

// Core lazy-loaded components
export const LazyComponents = {
  // About page components
  InteractiveTimeline: createLazyComponent(
    () => import("../components/enhanced/InteractiveTimeline"),
    { preload: false }
  ),
  SkillsProficiencyMatrix: createLazyComponent(
    () => import("../components/enhanced/SkillsProficiencyMatrix"),
    { preload: false }
  ),

  // Portfolio page components
  InteractiveProjectGrid: createLazyComponent(
    () => import("../components/enhanced/InteractiveProjectGrid"),
    { preload: true }
  ),
  ProjectCaseStudyModal: createLazyComponent(
    () => import("../components/enhanced/ProjectCaseStudyModal"),
    { preload: false }
  ),

  // Services page components
  InteractivePricingCalculator: createLazyComponent(
    () => import("../components/enhanced/InteractivePricingCalculator"),
    { preload: false }
  ),
  ServiceCustomizationBuilder: createLazyComponent(
    () => import("../components/enhanced/ServiceCustomizationBuilder"),
    { preload: false }
  ),

  // Contact page components
  MultiChannelContactHub: createLazyComponent(
    () => import("../components/enhanced/MultiChannelContactHub"),
    { preload: false }
  ),
  IntegratedCalendarBooking: createLazyComponent(
    () => import("../components/enhanced/IntegratedCalendarBooking"),
    { preload: false }
  ),

  // Settings page components
  AccessibilityControlCenter: createLazyComponent(
    () => import("../components/enhanced/AccessibilityControlCenter"),
    { preload: false }
  ),
  ThemeCustomizationStudio: createLazyComponent(
    () => import("../components/enhanced/ThemeCustomizationStudio"),
    { preload: false }
  ),
};

// Simple dynamic import utilities
export const dynamicImport = {
  // Import component with retry logic
  withRetry: async <T>(
    importFunc: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await importFunc();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError!;
  },

  // Import with timeout
  withTimeout: async <T>(
    importFunc: () => Promise<T>,
    timeout = 10000
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Import timeout")), timeout);
    });

    return Promise.race([importFunc(), timeoutPromise]);
  },

  // Conditional import based on feature flags
  conditional: async <T>(
    condition: boolean | (() => boolean),
    importFunc: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T | null> => {
    const shouldImport =
      typeof condition === "function" ? condition() : condition;

    if (shouldImport) {
      return importFunc();
    } else if (fallback) {
      return fallback();
    }

    return null;
  },
};

// Bundle splitting configuration
export const bundleConfig = {
  // Vendor chunks configuration
  vendors: {
    react: ["react", "react-dom"],
    ui: ["framer-motion", "lucide-react"],
    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
    utils: ["clsx", "tailwind-merge"],
  },

  // Chunk splitting strategy
  splitChunks: {
    // Common chunks
    common: {
      name: "common",
      chunks: ["layout", "navigation", "ui"],
      minChunks: 2,
    },

    // Page-specific chunks
    pages: {
      about: ["InteractiveTimeline", "SkillsProficiencyMatrix"],
      portfolio: ["InteractiveProjectGrid", "ProjectCaseStudyModal"],
      services: ["InteractivePricingCalculator", "ServiceCustomizationBuilder"],
      contact: ["MultiChannelContactHub", "IntegratedCalendarBooking"],
      settings: ["AccessibilityControlCenter", "ThemeCustomizationStudio"],
    },
  },
};
