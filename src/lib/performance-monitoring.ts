// Enhanced performance monitoring and alerting system

import { performanceMonitor } from "../utils/performanceMonitor";

// Performance thresholds and budgets
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)

  // Custom metrics
  BUNDLE_SIZE: { good: 250000, poor: 500000 }, // 250KB / 500KB
  MEMORY_USAGE: { good: 50000000, poor: 100000000 }, // 50MB / 100MB
  COMPONENT_RENDER: { good: 16, poor: 50 }, // Component render time (ms)
  API_RESPONSE: { good: 500, poor: 2000 }, // API response time (ms)
  IMAGE_LOAD: { good: 1000, poor: 3000 }, // Image load time (ms)
};

// Performance alert levels
export type AlertLevel = "info" | "warning" | "critical";

export interface PerformanceAlert {
  id: string;
  timestamp: Date;
  level: AlertLevel;
  metric: string;
  value: number;
  threshold: number;
  message: string;
  suggestions: string[];
  component?: string;
  url?: string;
}

// Performance monitoring class
export class PerformanceMonitoringSystem {
  private static instance: PerformanceMonitoringSystem;
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];

  static getInstance(): PerformanceMonitoringSystem {
    if (!PerformanceMonitoringSystem.instance) {
      PerformanceMonitoringSystem.instance = new PerformanceMonitoringSystem();
    }
    return PerformanceMonitoringSystem.instance;
  }

  // Start comprehensive performance monitoring
  startMonitoring(): void {
    if (typeof window === "undefined" || this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    this.setupMemoryMonitoring();
    this.setupNavigationMonitoring();
    this.setupCustomMetrics();

    console.log("🚀 Performance monitoring started");
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    console.log("⏹️ Performance monitoring stopped");
  }

  // Setup Web Vitals monitoring
  private setupWebVitalsMonitoring(): void {
    // Import and use web-vitals library
    import("web-vitals")
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onLCP((metric) => this.handleWebVital("LCP", metric.value, metric));
        onFID((metric) => this.handleWebVital("FID", metric.value, metric));
        onCLS((metric) => this.handleWebVital("CLS", metric.value, metric));
        onFCP((metric) => this.handleWebVital("FCP", metric.value, metric));
        onTTFB((metric) => this.handleWebVital("TTFB", metric.value, metric));
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals library:", error);
        this.fallbackWebVitalsMonitoring();
      });
  }

  // Fallback Web Vitals monitoring using Performance Observer
  private fallbackWebVitalsMonitoring(): void {
    if (!("PerformanceObserver" in window)) return;

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.handleWebVital("LCP", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn("LCP observer not supported");
    }

    // FCP Observer
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === "first-contentful-paint"
        );
        if (fcpEntry) {
          this.handleWebVital("FCP", fcpEntry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn("FCP observer not supported");
    }

    // CLS Observer
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.handleWebVital("CLS", clsValue);
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn("CLS observer not supported");
    }
  }

  // Setup resource monitoring
  private setupResourceMonitoring(): void {
    if (!("PerformanceObserver" in window)) return;

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];

      entries.forEach((entry) => {
        const loadTime = entry.responseEnd - entry.startTime;

        // Monitor image loading performance
        if (entry.initiatorType === "img") {
          this.checkThreshold("IMAGE_LOAD", loadTime, {
            suggestions: [
              "Consider using WebP format",
              "Implement lazy loading",
              "Optimize image sizes",
              "Use responsive images",
            ],
            url: entry.name,
          });
        }

        // Monitor script loading performance
        if (entry.initiatorType === "script") {
          const size =
            (entry as any).transferSize || (entry as any).encodedBodySize || 0;
          this.checkThreshold("BUNDLE_SIZE", size, {
            suggestions: [
              "Enable code splitting",
              "Remove unused dependencies",
              "Use dynamic imports",
              "Enable compression",
            ],
            url: entry.name,
          });
        }

        // Monitor API calls
        if (entry.name.includes("/api/")) {
          this.checkThreshold("API_RESPONSE", loadTime, {
            suggestions: [
              "Optimize database queries",
              "Implement caching",
              "Use CDN for static assets",
              "Consider pagination",
            ],
            url: entry.name,
          });
        }
      });
    });

    resourceObserver.observe({ entryTypes: ["resource"] });
    this.observers.push(resourceObserver);
  }

  // Setup memory monitoring
  private setupMemoryMonitoring(): void {
    if (typeof window === "undefined" || !(performance as any).memory) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize;

      this.checkThreshold("MEMORY_USAGE", usedMemory, {
        suggestions: [
          "Check for memory leaks",
          "Optimize component cleanup",
          "Reduce bundle size",
          "Use lazy loading",
        ],
      });
    };

    // Check memory every 30 seconds
    const memoryInterval = setInterval(checkMemory, 30000);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      clearInterval(memoryInterval);
    });
  }

  // Setup navigation monitoring
  private setupNavigationMonitoring(): void {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart;
      const domLoad =
        navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const pageLoad = navigation.loadEventEnd - navigation.fetchStart;

      this.checkThreshold("TTFB", ttfb, {
        suggestions: [
          "Optimize server response time",
          "Use CDN",
          "Enable server-side caching",
          "Optimize database queries",
        ],
      });

      // Log navigation metrics
      performanceMonitor.addDebugLog(
        "info",
        "Navigation metrics collected",
        "Navigation",
        {
          ttfb,
          domLoad,
          pageLoad,
        }
      );
    }
  }

  // Setup custom metrics monitoring
  private setupCustomMetrics(): void {
    // Monitor React component render times
    if (typeof window !== "undefined" && (window as any).React) {
      this.setupReactProfiler();
    }

    // Monitor user interactions
    this.setupInteractionMonitoring();

    // Monitor bundle size
    this.monitorBundleSize();
  }

  // Setup React Profiler for component performance
  private setupReactProfiler(): void {
    // This would integrate with React DevTools Profiler API
    // For now, we'll use a simple timing mechanism
    const originalCreateElement = (window as any).React?.createElement;

    if (originalCreateElement) {
      (window as any).React.createElement = (...args: any[]) => {
        const start = performance.now();
        const result = originalCreateElement.apply(this, args);
        const end = performance.now();
        const renderTime = end - start;

        if (renderTime > PERFORMANCE_BUDGETS.COMPONENT_RENDER.good) {
          this.checkThreshold("COMPONENT_RENDER", renderTime, {
            suggestions: [
              "Use React.memo for expensive components",
              "Optimize component re-renders",
              "Use useMemo and useCallback",
              "Consider component splitting",
            ],
            component: args[0]?.name || "Unknown",
          });
        }

        return result;
      };
    }
  }

  // Setup interaction monitoring
  private setupInteractionMonitoring(): void {
    const interactionTypes = ["click", "keydown", "scroll"];

    interactionTypes.forEach((type) => {
      document.addEventListener(
        type,
        (event) => {
          const start = performance.now();

          // Use requestAnimationFrame to measure interaction response time
          requestAnimationFrame(() => {
            const responseTime = performance.now() - start;

            if (responseTime > PERFORMANCE_BUDGETS.FID.good) {
              this.checkThreshold("FID", responseTime, {
                suggestions: [
                  "Optimize event handlers",
                  "Use debouncing for frequent events",
                  "Reduce JavaScript execution time",
                  "Use web workers for heavy computations",
                ],
              });
            }
          });
        },
        { passive: true }
      );
    });
  }

  // Monitor bundle size
  private monitorBundleSize(): void {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    let totalBundleSize = 0;

    resources.forEach((resource) => {
      if (
        resource.name.includes("/_next/static/") &&
        resource.name.endsWith(".js")
      ) {
        const size =
          (resource as any).transferSize ||
          (resource as any).encodedBodySize ||
          0;
        totalBundleSize += size;
      }
    });

    this.checkThreshold("BUNDLE_SIZE", totalBundleSize, {
      suggestions: [
        "Enable code splitting",
        "Use dynamic imports",
        "Remove unused dependencies",
        "Enable tree shaking",
      ],
    });
  }

  // Handle Web Vital measurements
  private handleWebVital(name: string, value: number, metric?: any): void {
    this.checkThreshold(name, value, {
      suggestions: this.getWebVitalSuggestions(name),
      component: metric?.id,
    });

    // Send to analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, {
        event_category: "Web Vitals",
        event_label: metric?.id || "unknown",
        value: Math.round(name === "CLS" ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Log to performance monitor
    performanceMonitor.trackWebVital({
      name,
      value,
      id: metric?.id || "unknown",
    });
  }

  // Check performance threshold and create alerts
  private checkThreshold(
    metric: string,
    value: number,
    options: {
      suggestions?: string[];
      component?: string;
      url?: string;
    } = {}
  ): void {
    const budget =
      PERFORMANCE_BUDGETS[metric as keyof typeof PERFORMANCE_BUDGETS];
    if (!budget) return;

    let level: AlertLevel = "info";
    let message = "";

    if (value > budget.poor) {
      level = "critical";
      message = `${metric} is critically slow (${this.formatValue(
        metric,
        value
      )})`;
    } else if (value > budget.good) {
      level = "warning";
      message = `${metric} needs improvement (${this.formatValue(
        metric,
        value
      )})`;
    } else {
      level = "info";
      message = `${metric} is performing well (${this.formatValue(
        metric,
        value
      )})`;
    }

    const alert: PerformanceAlert = {
      id: `${metric}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      metric,
      value,
      threshold: level === "critical" ? budget.poor : budget.good,
      message,
      suggestions: options.suggestions || [],
      component: options.component,
      url: options.url,
    };

    this.addAlert(alert);
  }

  // Add alert and notify callbacks
  private addAlert(alert: PerformanceAlert): void {
    this.alerts = [alert, ...this.alerts.slice(0, 99)]; // Keep last 100 alerts

    // Notify callbacks
    this.alertCallbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error("Error in alert callback:", error);
      }
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const emoji =
        alert.level === "critical"
          ? "🚨"
          : alert.level === "warning"
          ? "⚠️"
          : "ℹ️";
      console.log(`${emoji} ${alert.message}`, alert);
    }
  }

  // Format values for display
  private formatValue(metric: string, value: number): string {
    switch (metric) {
      case "BUNDLE_SIZE":
      case "MEMORY_USAGE":
        return this.formatBytes(value);
      case "CLS":
        return value.toFixed(3);
      default:
        return `${Math.round(value)}ms`;
    }
  }

  // Format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Get suggestions for Web Vitals
  private getWebVitalSuggestions(metric: string): string[] {
    const suggestions: Record<string, string[]> = {
      LCP: [
        "Optimize images and use modern formats",
        "Preload critical resources",
        "Reduce server response times",
        "Use a CDN",
      ],
      FID: [
        "Reduce JavaScript execution time",
        "Use code splitting",
        "Remove unused JavaScript",
        "Use web workers for heavy tasks",
      ],
      CLS: [
        "Set size attributes on images and videos",
        "Reserve space for ads and embeds",
        "Avoid inserting content above existing content",
        "Use CSS aspect-ratio",
      ],
      FCP: [
        "Eliminate render-blocking resources",
        "Minify CSS and JavaScript",
        "Remove unused CSS",
        "Preload critical fonts",
      ],
      TTFB: [
        "Use a fast hosting provider",
        "Use a CDN",
        "Cache resources",
        "Optimize database queries",
      ],
    };

    return suggestions[metric] || [];
  }

  // Public API methods
  getAlerts(): PerformanceAlert[] {
    return this.alerts;
  }

  getAlertsByLevel(level: AlertLevel): PerformanceAlert[] {
    return this.alerts.filter((alert) => alert.level === level);
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Generate performance report
  generateReport(): any {
    const metrics = performanceMonitor.getMetrics();
    const budgetCheck = performanceMonitor.checkPerformanceBudget();

    return {
      timestamp: new Date().toISOString(),
      metrics,
      budgetCheck,
      alerts: this.alerts.slice(0, 20), // Last 20 alerts
      recommendations: this.generateRecommendations(),
      score: this.calculatePerformanceScore(),
    };
  }

  // Generate performance recommendations
  private generateRecommendations(): string[] {
    const criticalAlerts = this.getAlertsByLevel("critical");
    const warningAlerts = this.getAlertsByLevel("warning");

    const recommendations = new Set<string>();

    [...criticalAlerts, ...warningAlerts].forEach((alert) => {
      alert.suggestions.forEach((suggestion) =>
        recommendations.add(suggestion)
      );
    });

    return Array.from(recommendations);
  }

  // Calculate overall performance score (0-100)
  private calculatePerformanceScore(): number {
    const metrics = performanceMonitor.getMetrics();
    if (!metrics) return 0;

    const scores = {
      lcp: this.getMetricScore("LCP", metrics.largestContentfulPaint),
      fid: this.getMetricScore("FID", metrics.firstInputDelay),
      cls: this.getMetricScore("CLS", metrics.cumulativeLayoutShift),
      fcp: this.getMetricScore("FCP", metrics.firstContentfulPaint),
    };

    // Weighted average (LCP and CLS are more important)
    const totalScore =
      scores.lcp * 0.3 + scores.fid * 0.2 + scores.cls * 0.3 + scores.fcp * 0.2;

    return Math.round(totalScore);
  }

  // Get metric score (0-100)
  private getMetricScore(metric: string, value: number): number {
    const budget =
      PERFORMANCE_BUDGETS[metric as keyof typeof PERFORMANCE_BUDGETS];
    if (!budget) return 100;

    if (value <= budget.good) return 100;
    if (value >= budget.poor) return 0;

    // Linear interpolation between good and poor
    const range = budget.poor - budget.good;
    const position = value - budget.good;
    return Math.max(0, 100 - (position / range) * 100);
  }
}

// Export singleton instance
export const performanceMonitoringSystem =
  PerformanceMonitoringSystem.getInstance();

// Utility functions
export const startPerformanceMonitoring = () => {
  performanceMonitoringSystem.startMonitoring();
};

export const stopPerformanceMonitoring = () => {
  performanceMonitoringSystem.stopMonitoring();
};

export const getPerformanceReport = () => {
  return performanceMonitoringSystem.generateReport();
};
