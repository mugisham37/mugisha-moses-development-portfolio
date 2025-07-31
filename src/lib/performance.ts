// Performance monitoring utilities

// Global gtag declaration
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Make gtag available globally
const gtag = typeof window !== "undefined" ? window.gtag : undefined;

// Web Vitals tracking
export const trackWebVitals = (metric: {
  name: string;
  value: number;
  id: string;
}) => {
  if (typeof window !== "undefined") {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Web Vital:", metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Replace with your analytics service
      // Example: Google Analytics 4
      if (typeof gtag !== "undefined") {
        gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value
          ),
          non_interaction: true,
        });
      }

      // Example: Custom analytics endpoint
      fetch("/api/analytics/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch((error) => {
        console.error("Failed to send web vitals:", error);
      });
    }
  }
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    // Observe Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (process.env.NODE_ENV === "development") {
        console.log("LCP:", lastEntry.startTime);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      // LCP not supported
    }

    // Observe Interaction to Next Paint (replaces FID in web-vitals v5)
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (process.env.NODE_ENV === "development") {
          console.log("INP:", entry.duration);
        }
      });
    });

    try {
      inpObserver.observe({ entryTypes: ["event"] });
    } catch {
      // INP not supported
    }

    // Observe Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();

      entries.forEach(
        (
          entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }
        ) => {
          if (!entry.hadRecentInput && entry.value) {
            clsValue += entry.value;
          }
        }
      );

      if (process.env.NODE_ENV === "development") {
        console.log("CLS:", clsValue);
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch {
      // CLS not supported
    }
  }
};

// Lazy loading utility for components
export const createLazyComponent = <T extends React.ComponentType>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Critical resource preloading
export const preloadCriticalResources = () => {
  if (typeof window !== "undefined") {
    // Preload critical images
    const criticalImages = [
      "/images/hero-bg.jpg",
      "/images/profile.jpg",
      "/images/logo.png",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
    ];

    criticalFonts.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = href;
      document.head.appendChild(link);
    });
  }
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Log bundle information
    console.group("Bundle Analysis");
    console.log("User Agent:", navigator.userAgent);
    console.log(
      "Connection:",
      (navigator as { connection?: unknown }).connection
    );
    console.log("Memory:", (performance as { memory?: unknown }).memory);
    console.groupEnd();
  }
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  if (typeof window !== "undefined") {
    // Performance budget thresholds
    const budget = {
      maxLCP: 2500, // 2.5 seconds
      maxINP: 200, // 200 milliseconds
      maxCLS: 0.1, // 0.1
    };

    // Check if performance API is available
    if ("performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;

        if (process.env.NODE_ENV === "development") {
          console.group("Performance Budget");
          console.log("Page Load Time:", loadTime + "ms");
          console.log(
            "DOM Content Loaded:",
            navigation.domContentLoadedEventEnd - navigation.fetchStart + "ms"
          );
          console.log(
            "First Paint:",
            performance.getEntriesByName("first-paint")[0]?.startTime + "ms"
          );
          console.log(
            "First Contentful Paint:",
            performance.getEntriesByName("first-contentful-paint")[0]
              ?.startTime + "ms"
          );

          // Check against budget thresholds
          console.log("Performance Budget:", budget);
          console.groupEnd();
        }
      }
    }
  }
};

// Resource hints utility
export const addResourceHints = () => {
  if (typeof window !== "undefined") {
    // DNS prefetch for external domains
    const domains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "www.google-analytics.com",
    ];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical domains
    const criticalDomains = ["fonts.googleapis.com", "fonts.gstatic.com"];

    criticalDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = `https://${domain}`;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Import React for lazy loading utility
import React from "react";
