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

    // Track web vitals
    if (typeof window !== "undefined") {
      import("web-vitals")
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(trackWebVitals);
          getFID(trackWebVitals);
          getFCP(trackWebVitals);
          getLCP(trackWebVitals);
          getTTFB(trackWebVitals);
        })
        .catch(() => {
          // web-vitals not available, continue without it
        });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
