// Performance monitoring utilities for developer options

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  bundleSize: number;
  memoryUsage: number;
}

export interface DebugInfo {
  id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  component?: string;
  message: string;
  data?: Record<string, unknown>;
}

// Performance metrics collector
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics | null = null;
  private observers: PerformanceObserver[] = [];
  private debugLogs: DebugInfo[] = [];
  private isMonitoring = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (typeof window === "undefined" || this.isMonitoring) return;

    this.isMonitoring = true;
    this.collectInitialMetrics();
    this.setupObservers();
    this.addDebugLog(
      "info",
      "Performance monitoring started",
      "PerformanceMonitor"
    );
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.addDebugLog(
      "info",
      "Performance monitoring stopped",
      "PerformanceMonitor"
    );
  }

  private collectInitialMetrics(): void {
    if (typeof window === "undefined" || !("performance" in window)) return;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType("paint");

    this.metrics = {
      loadTime: navigation
        ? navigation.loadEventEnd - navigation.fetchStart
        : 0,
      firstContentfulPaint:
        paintEntries.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0,
      largestContentfulPaint: 0, // Will be updated by observer
      cumulativeLayoutShift: 0, // Will be updated by observer
      firstInputDelay: 0, // Will be updated by observer
      timeToInteractive: navigation
        ? navigation.domInteractive - navigation.fetchStart
        : 0,
      bundleSize: this.estimateBundleSize(),
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    };
  }

  private setupObservers(): void {
    if (typeof window === "undefined" || !("PerformanceObserver" in window))
      return;

    // Largest Contentful Paint observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (this.metrics) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (e) {
      this.addDebugLog(
        "warn",
        "LCP observer not supported",
        "PerformanceMonitor"
      );
    }

    // Cumulative Layout Shift observer
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (this.metrics) {
          this.metrics.cumulativeLayoutShift = clsValue;
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    } catch (e) {
      this.addDebugLog(
        "warn",
        "CLS observer not supported",
        "PerformanceMonitor"
      );
    }

    // First Input Delay observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (this.metrics) {
            this.metrics.firstInputDelay =
              entry.processingStart - entry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (e) {
      this.addDebugLog(
        "warn",
        "FID observer not supported",
        "PerformanceMonitor"
      );
    }
  }

  private estimateBundleSize(): number {
    if (typeof window === "undefined") return 0;

    // Estimate bundle size based on resource entries
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    let totalSize = 0;

    resources.forEach((resource) => {
      if (resource.name.includes(".js") || resource.name.includes(".css")) {
        // Estimate size based on transfer size or encoded body size
        totalSize +=
          (
            resource as PerformanceResourceTiming & {
              transferSize?: number;
              encodedBodySize?: number;
            }
          ).transferSize ||
          (
            resource as PerformanceResourceTiming & {
              transferSize?: number;
              encodedBodySize?: number;
            }
          ).encodedBodySize ||
          0;
      }
    });

    return totalSize;
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  refreshMetrics(): void {
    this.collectInitialMetrics();
    this.addDebugLog(
      "info",
      "Performance metrics refreshed",
      "PerformanceMonitor"
    );
  }

  addDebugLog(
    level: DebugInfo["level"],
    message: string,
    component?: string,
    data?: Record<string, unknown>
  ): void {
    const newLog: DebugInfo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      component,
      message,
      data,
    };

    this.debugLogs = [newLog, ...this.debugLogs.slice(0, 99)]; // Keep last 100 logs
  }

  getDebugLogs(): DebugInfo[] {
    return this.debugLogs;
  }

  clearDebugLogs(): void {
    this.debugLogs = [];
    this.addDebugLog("info", "Debug logs cleared", "PerformanceMonitor");
  }

  exportDebugData(): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      performanceMetrics: this.metrics,
      debugLogs: this.debugLogs.slice(0, 50), // Export last 50 logs
      userAgent:
        typeof window !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      memory:
        typeof window !== "undefined" ? (performance as any).memory : null,
      connection:
        typeof window !== "undefined" ? (navigator as any).connection : null,
    };
  }

  // Web Vitals tracking
  trackWebVital(metric: { name: string; value: number; id: string }): void {
    this.addDebugLog(
      "info",
      `Web Vital: ${metric.name} = ${metric.value}`,
      "WebVitals",
      metric
    );

    // Send to analytics in production
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      // Example: Send to analytics service
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
        this.addDebugLog(
          "error",
          "Failed to send web vitals",
          "WebVitals",
          error
        );
      });
    }
  }

  // Component performance profiling
  startComponentProfile(componentName: string): string {
    const profileId = `${componentName}-${Date.now()}`;
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${profileId}-start`);
    }
    this.addDebugLog(
      "debug",
      `Started profiling ${componentName}`,
      "ComponentProfiler",
      { profileId }
    );
    return profileId;
  }

  endComponentProfile(profileId: string): number {
    let duration = 0;
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${profileId}-end`);
      performance.measure(
        `${profileId}-duration`,
        `${profileId}-start`,
        `${profileId}-end`
      );

      const measures = performance.getEntriesByName(`${profileId}-duration`);
      if (measures.length > 0) {
        duration = measures[0].duration;
      }
    }

    this.addDebugLog("debug", `Completed profiling`, "ComponentProfiler", {
      profileId,
      duration,
    });
    return duration;
  }

  // Memory usage monitoring
  getMemoryUsage(): any {
    if (typeof window !== "undefined" && (performance as any).memory) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Network information
  getNetworkInfo(): any {
    if (typeof window !== "undefined" && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    return null;
  }

  // Performance budget checker
  checkPerformanceBudget(): { passed: boolean; results: any } {
    if (!this.metrics) {
      return { passed: false, results: { error: "No metrics available" } };
    }

    const budget = {
      maxLoadTime: 3000, // 3 seconds
      maxLCP: 2500, // 2.5 seconds
      maxFID: 100, // 100 milliseconds
      maxCLS: 0.1, // 0.1
      maxFCP: 1800, // 1.8 seconds
    };

    const results = {
      loadTime: {
        value: this.metrics.loadTime,
        budget: budget.maxLoadTime,
        passed: this.metrics.loadTime <= budget.maxLoadTime,
      },
      largestContentfulPaint: {
        value: this.metrics.largestContentfulPaint,
        budget: budget.maxLCP,
        passed: this.metrics.largestContentfulPaint <= budget.maxLCP,
      },
      firstInputDelay: {
        value: this.metrics.firstInputDelay,
        budget: budget.maxFID,
        passed: this.metrics.firstInputDelay <= budget.maxFID,
      },
      cumulativeLayoutShift: {
        value: this.metrics.cumulativeLayoutShift,
        budget: budget.maxCLS,
        passed: this.metrics.cumulativeLayoutShift <= budget.maxCLS,
      },
      firstContentfulPaint: {
        value: this.metrics.firstContentfulPaint,
        budget: budget.maxFCP,
        passed: this.metrics.firstContentfulPaint <= budget.maxFCP,
      },
    };

    const passed = Object.values(results).every((result) => result.passed);

    this.addDebugLog(
      "info",
      `Performance budget check: ${passed ? "PASSED" : "FAILED"}`,
      "PerformanceBudget",
      results
    );

    return { passed, results };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

export const getPerformanceGrade = (
  value: number,
  thresholds: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" => {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
};

// Web Vitals thresholds
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};
