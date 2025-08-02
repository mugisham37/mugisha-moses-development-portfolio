// Code splitting utilities for enhanced page features

import { lazy, ComponentType } from "react";
import { createLazyComponent } from "./lazy-loading";

// Route-based code splitting
export const createRouteComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  preload = false
) => {
  return createLazyComponent(importFunc, {
    preload,
    timeout: 15000, // Longer timeout for routes
  });
};

// Feature-based code splitting for enhanced components
export const EnhancedComponents = {
  // About page enhanced components
  InteractiveTimeline: createLazyComponent(
    () => import("../components/enhanced/InteractiveTimeline"),
    { preload: false }
  ),
  SkillsProficiencyMatrix: createLazyComponent(
    () => import("../components/enhanced/SkillsProficiencyMatrix"),
    { preload: false }
  ),
  MethodologyDeepDive: createLazyComponent(
    () => import("../components/enhanced/MethodologyDeepDive"),
    { preload: false }
  ),
  PersonalInterestsShowcase: createLazyComponent(
    () => import("../components/enhanced/PersonalInterestsShowcase"),
    { preload: false }
  ),

  // Portfolio page enhanced components
  InteractiveProjectGrid: createLazyComponent(
    () => import("../components/enhanced/InteractiveProjectGrid"),
    { preload: true } // Preload as it's commonly used
  ),
  ProjectCaseStudyModal: createLazyComponent(
    () => import("../components/enhanced/ProjectCaseStudyModal"),
    { preload: false }
  ),
  AdvancedSearchEngine: createLazyComponent(
    () => import("../components/enhanced/AdvancedSearchEngine"),
    { preload: false }
  ),
  TechnologyShowcase: createLazyComponent(
    () => import("../components/enhanced/TechnologyShowcase"),
    { preload: false }
  ),

  // Services page enhanced components
  InteractivePricingCalculator: createLazyComponent(
    () => import("../components/enhanced/InteractivePricingCalculator"),
    { preload: false }
  ),
  ServiceCustomizationBuilder: createLazyComponent(
    () => import("../components/enhanced/ServiceCustomizationBuilder"),
    { preload: false }
  ),
  ProcessVisualization: createLazyComponent(
    () => import("../components/enhanced/ProcessVisualization"),
    { preload: false }
  ),
  AdvancedFAQSystem: createLazyComponent(
    () => import("../components/enhanced/AdvancedFAQSystem"),
    { preload: false }
  ),

  // Contact page enhanced components
  MultiChannelContactHub: createLazyComponent(
    () => import("../components/enhanced/MultiChannelContactHub"),
    { preload: false }
  ),
  IntegratedCalendarBooking: createLazyComponent(
    () => import("../components/enhanced/IntegratedCalendarBooking"),
    { preload: false }
  ),
  SmartProjectInquiry: createLazyComponent(
    () => import("../components/enhanced/SmartProjectInquiry"),
    { preload: false }
  ),
  CommunicationPreferencesCenter: createLazyComponent(
    () => import("../components/enhanced/CommunicationPreferencesCenter"),
    { preload: false }
  ),

  // Settings page enhanced components
  AccessibilityControlCenter: createLazyComponent(
    () => import("../components/enhanced/AccessibilityControlCenter"),
    { preload: false }
  ),
  ThemeCustomizationStudio: createLazyComponent(
    () => import("../components/enhanced/ThemeCustomizationStudio"),
    { preload: false }
  ),
  PrivacyDataManagement: createLazyComponent(
    () => import("../components/enhanced/PrivacyDataManagement"),
    { preload: false }
  ),
  PerformanceOptimizationPanel: createLazyComponent(
    () => import("../components/enhanced/PerformanceOptimizationPanel"),
    { preload: false }
  ),

  // Interactive features
  EnhancedFormSystems: createLazyComponent(
    () => import("../components/interactive/EnhancedFormSystems"),
    { preload: false }
  ),
  ModalOverlayManager: createLazyComponent(
    () => import("../components/interactive/ModalOverlayManager"),
    { preload: false }
  ),
  InteractiveDataVisualization: createLazyComponent(
    () => import("../components/interactive/InteractiveDataVisualization"),
    { preload: false }
  ),

  // Cross-page integration
  ContextAwareNavigation: createLazyComponent(
    () => import("../components/navigation/ContextAwareNavigation"),
    { preload: true } // Preload as it's used across pages
  ),
  GlobalSearchDiscovery: createLazyComponent(
    () => import("../components/search/GlobalSearchDiscovery"),
    { preload: false }
  ),
  UserPreferenceSynchronization: createLazyComponent(
    () => import("../components/preferences/UserPreferenceSynchronization"),
    { preload: false }
  ),
};

// Page-level code splitting
export const Pages = {
  About: createRouteComponent(() => import("../app/about/page"), false),
  Portfolio: createRouteComponent(
    () => import("../app/portfolio/page"),
    true // Preload popular page
  ),
  Services: createRouteComponent(() => import("../app/services/page"), false),
  Contact: createRouteComponent(() => import("../app/contact/page"), false),
  Settings: createRouteComponent(() => import("../app/settings/page"), false),
};

// Utility components code splitting
export const UtilityComponents = {
  LoadingSpinner: createLazyComponent(
    () => import("../components/ui/LoadingSpinner"),
    { preload: true } // Preload as it's commonly used
  ),
  ErrorBoundary: createLazyComponent(
    () => import("../components/ui/ErrorBoundary"),
    { preload: true }
  ),
  SkeletonLoader: createLazyComponent(
    () => import("../components/ui/SkeletonLoader"),
    { preload: true }
  ),
  Toast: createLazyComponent(() => import("../components/ui/Toast"), {
    preload: false,
  }),
  Modal: createLazyComponent(() => import("../components/ui/Modal"), {
    preload: false,
  }),
};

// Third-party library code splitting
export const ThirdPartyComponents = {
  Chart: createLazyComponent(() => import("../components/charts/Chart"), {
    preload: false,
  }),
  Calendar: createLazyComponent(
    () => import("../components/calendar/Calendar"),
    { preload: false }
  ),
  CodeEditor: createLazyComponent(
    () => import("../components/editor/CodeEditor"),
    { preload: false }
  ),
  ImageGallery: createLazyComponent(
    () => import("../components/gallery/ImageGallery"),
    { preload: false }
  ),
};

// Dynamic import utilities
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

  // Batch import with progress tracking
  batch: async <T>(
    importFuncs: Array<() => Promise<T>>,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<T[]> => {
    const results: T[] = [];
    const total = importFuncs.length;

    for (let i = 0; i < importFuncs.length; i++) {
      try {
        const result = await importFuncs[i]();
        results.push(result);
        onProgress?.(i + 1, total);
      } catch (error) {
        console.error(`Failed to import component ${i}:`, error);
        throw error;
      }
    }

    return results;
  },
};

// Preloading strategies
export const preloadingStrategies = {
  // Preload on hover
  onHover: (importFunc: () => Promise<any>) => {
    let preloaded = false;

    return {
      onMouseEnter: () => {
        if (!preloaded) {
          preloaded = true;
          importFunc().catch(console.error);
        }
      },
    };
  },

  // Preload on idle
  onIdle: (importFunc: () => Promise<any>) => {
    if (typeof window !== "undefined") {
      const preload = () => importFunc().catch(console.error);

      if ("requestIdleCallback" in window) {
        requestIdleCallback(preload);
      } else {
        setTimeout(preload, 100);
      }
    }
  },

  // Preload on intersection
  onIntersection: (
    importFunc: () => Promise<any>,
    options: IntersectionObserverInit = {}
  ) => {
    return (element: HTMLElement | null) => {
      if (!element || typeof window === "undefined") return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            importFunc().catch(console.error);
            observer.unobserve(element);
          }
        },
        { threshold: 0.1, ...options }
      );

      observer.observe(element);
    };
  },

  // Preload based on user behavior
  onUserIntent: (importFunc: () => Promise<any>) => {
    if (typeof window === "undefined") return;

    let preloaded = false;
    const preload = () => {
      if (!preloaded) {
        preloaded = true;
        importFunc().catch(console.error);
      }
    };

    // Preload on first user interaction
    const events = ["mousedown", "touchstart", "keydown"];
    const handleInteraction = () => {
      preload();
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
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
    three: ["three", "vanta", "@types/three"],
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

    // Feature-specific chunks
    features: {
      search: ["AdvancedSearchEngine", "GlobalSearchDiscovery"],
      forms: ["EnhancedFormSystems", "SmartProjectInquiry"],
      visualization: ["InteractiveDataVisualization", "ProcessVisualization"],
      preferences: [
        "UserPreferenceSynchronization",
        "CommunicationPreferencesCenter",
      ],
    },
  },
};

// Performance monitoring for code splitting
export const codeSplittingMetrics = {
  trackChunkLoad: (chunkName: string, startTime: number) => {
    const loadTime = performance.now() - startTime;

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "chunk_load", {
        event_category: "Performance",
        event_label: chunkName,
        value: Math.round(loadTime),
      });
    }

    console.log(`Chunk ${chunkName} loaded in ${loadTime.toFixed(2)}ms`);
  },

  trackChunkError: (chunkName: string, error: Error) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "chunk_error", {
        event_category: "Error",
        event_label: chunkName,
        value: 1,
      });
    }

    console.error(`Failed to load chunk ${chunkName}:`, error);
  },
};
