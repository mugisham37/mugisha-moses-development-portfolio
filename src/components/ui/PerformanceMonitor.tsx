"use client";

import { useEffect } from "react";
import {
  trackWebVitals,
  observePerformance,
  preloadCriticalResources,
  addResourceHints,
} from "@/lib/performance";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    observePerformance();
    preloadCriticalResources();
    addResourceHints();

    // Track web vitals (v5.x API)
    if (typeof window !== "undefined") {
      import("web-vitals")
        .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
          onCLS(trackWebVitals);
          onINP(trackWebVitals);
          onFCP(trackWebVitals);
          onLCP(trackWebVitals);
          onTTFB(trackWebVitals);
        })
        .catch(() => {
          // web-vitals not available, continue without it
        });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
