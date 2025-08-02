// Memory usage optimization and monitoring utilities

export interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

export interface MemoryLeak {
  id: string;
  component: string;
  type: "event-listener" | "timer" | "observer" | "reference" | "closure";
  description: string;
  severity: "low" | "medium" | "high";
  suggestions: string[];
  detectedAt: Date;
}

export interface ComponentMemoryProfile {
  name: string;
  mountTime: number;
  unmountTime?: number;
  memoryAtMount: number;
  memoryAtUnmount?: number;
  memoryDelta: number;
  eventListeners: number;
  timers: number;
  observers: number;
}

// Memory thresholds (in bytes)
const MEMORY_THRESHOLDS = {
  WARNING: 50 * 1024 * 1024, // 50MB
  CRITICAL: 100 * 1024 * 1024, // 100MB
  LEAK_DETECTION: 10 * 1024 * 1024, // 10MB increase
};

export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private memoryHistory: MemoryMetrics[] = [];
  private componentProfiles: Map<string, ComponentMemoryProfile> = new Map();
  private detectedLeaks: MemoryLeak[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private leakCallbacks: Array<(leak: MemoryLeak) => void> = [];

  static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  // Start memory monitoring
  startMonitoring(interval = 5000): void {
    if (typeof window === "undefined" || this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMemoryMetrics();
      this.detectMemoryLeaks();
    }, interval);

    console.log("🧠 Memory monitoring started");
  }

  // Stop memory monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log("🧠 Memory monitoring stopped");
  }

  // Collect current memory metrics
  private collectMemoryMetrics(): void {
    if (typeof window === "undefined" || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    const metrics: MemoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now(),
    };

    this.memoryHistory.push(metrics);

    // Keep only last 100 measurements
    if (this.memoryHistory.length > 100) {
      this.memoryHistory = this.memoryHistory.slice(-100);
    }

    // Check thresholds
    this.checkMemoryThresholds(metrics);
  }

  // Check memory thresholds and alert
  private checkMemoryThresholds(metrics: MemoryMetrics): void {
    if (metrics.usedJSHeapSize > MEMORY_THRESHOLDS.CRITICAL) {
      this.reportMemoryLeak({
        id: `critical-memory-${Date.now()}`,
        component: "Global",
        type: "reference",
        description: `Critical memory usage: ${this.formatBytes(
          metrics.usedJSHeapSize
        )}`,
        severity: "high",
        suggestions: [
          "Force garbage collection",
          "Check for memory leaks",
          "Reduce component complexity",
          "Clear unused references",
        ],
        detectedAt: new Date(),
      });
    } else if (metrics.usedJSHeapSize > MEMORY_THRESHOLDS.WARNING) {
      console.warn(
        `⚠️ High memory usage: ${this.formatBytes(metrics.usedJSHeapSize)}`
      );
    }
  }

  // Detect memory leaks
  private detectMemoryLeaks(): void {
    if (this.memoryHistory.length < 10) return;

    const recent = this.memoryHistory.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    const memoryIncrease = newest.usedJSHeapSize - oldest.usedJSHeapSize;

    // Check for consistent memory growth
    if (memoryIncrease > MEMORY_THRESHOLDS.LEAK_DETECTION) {
      const growthRate =
        (memoryIncrease / (newest.timestamp - oldest.timestamp)) * 1000; // bytes per second

      if (growthRate > 1000) {
        // More than 1KB/second growth
        this.reportMemoryLeak({
          id: `leak-growth-${Date.now()}`,
          component: "Unknown",
          type: "reference",
          description: `Potential memory leak detected: ${this.formatBytes(
            memoryIncrease
          )} increase in ${(
            (newest.timestamp - oldest.timestamp) /
            1000
          ).toFixed(1)}s`,
          severity: growthRate > 10000 ? "high" : "medium",
          suggestions: [
            "Check for uncleaned event listeners",
            "Verify component cleanup in useEffect",
            "Look for circular references",
            "Check for retained DOM references",
          ],
          detectedAt: new Date(),
        });
      }
    }
  }

  // Profile component memory usage
  profileComponent(componentName: string): {
    onMount: () => void;
    onUnmount: () => void;
  } {
    return {
      onMount: () => {
        const memory = this.getCurrentMemory();
        const profile: ComponentMemoryProfile = {
          name: componentName,
          mountTime: Date.now(),
          memoryAtMount: memory,
          memoryDelta: 0,
          eventListeners: this.countEventListeners(),
          timers: this.countTimers(),
          observers: this.countObservers(),
        };

        this.componentProfiles.set(componentName, profile);
      },

      onUnmount: () => {
        const profile = this.componentProfiles.get(componentName);
        if (profile) {
          const memory = this.getCurrentMemory();
          profile.unmountTime = Date.now();
          profile.memoryAtUnmount = memory;
          profile.memoryDelta = memory - profile.memoryAtMount;

          // Check for potential leaks
          if (profile.memoryDelta > 1024 * 1024) {
            // 1MB increase
            this.reportMemoryLeak({
              id: `component-leak-${componentName}-${Date.now()}`,
              component: componentName,
              type: "reference",
              description: `Component ${componentName} may have caused memory leak: ${this.formatBytes(
                profile.memoryDelta
              )} increase`,
              severity:
                profile.memoryDelta > 5 * 1024 * 1024 ? "high" : "medium",
              suggestions: [
                "Check useEffect cleanup functions",
                "Verify event listener removal",
                "Clear component references",
                "Cancel pending promises",
              ],
              detectedAt: new Date(),
            });
          }
        }
      },
    };
  }

  // Get current memory usage
  private getCurrentMemory(): number {
    if (typeof window === "undefined" || !(performance as any).memory) return 0;
    return (performance as any).memory.usedJSHeapSize;
  }

  // Count active event listeners (approximation)
  private countEventListeners(): number {
    if (typeof window === "undefined") return 0;

    // This is an approximation - actual counting would require patching addEventListener
    const elements = document.querySelectorAll("*");
    let count = 0;

    elements.forEach((element) => {
      // Check for common event properties
      const events = [
        "onclick",
        "onmousedown",
        "onmouseup",
        "onkeydown",
        "onkeyup",
      ];
      events.forEach((event) => {
        if ((element as any)[event]) count++;
      });
    });

    return count;
  }

  // Count active timers (approximation)
  private countTimers(): number {
    // This would require patching setTimeout/setInterval to track accurately
    // For now, return 0 as a placeholder
    return 0;
  }

  // Count active observers (approximation)
  private countObservers(): number {
    // This would require tracking observer creation/destruction
    // For now, return 0 as a placeholder
    return 0;
  }

  // Report memory leak
  private reportMemoryLeak(leak: MemoryLeak): void {
    this.detectedLeaks.push(leak);

    // Keep only last 50 leaks
    if (this.detectedLeaks.length > 50) {
      this.detectedLeaks = this.detectedLeaks.slice(-50);
    }

    // Notify callbacks
    this.leakCallbacks.forEach((callback) => {
      try {
        callback(leak);
      } catch (error) {
        console.error("Error in memory leak callback:", error);
      }
    });

    // Log to console
    const emoji =
      leak.severity === "high"
        ? "🚨"
        : leak.severity === "medium"
        ? "⚠️"
        : "ℹ️";
    console.warn(`${emoji} Memory leak detected:`, leak);
  }

  // Memory optimization utilities
  optimizeMemory(): void {
    // Force garbage collection if available
    if (typeof window !== "undefined" && (window as any).gc) {
      (window as any).gc();
      console.log("🗑️ Forced garbage collection");
    }

    // Clear component profiles for unmounted components
    this.componentProfiles.forEach((profile, name) => {
      if (profile.unmountTime && Date.now() - profile.unmountTime > 300000) {
        // 5 minutes
        this.componentProfiles.delete(name);
      }
    });

    // Clear old memory history
    const fiveMinutesAgo = Date.now() - 300000;
    this.memoryHistory = this.memoryHistory.filter(
      (metric) => metric.timestamp > fiveMinutesAgo
    );

    console.log("🧹 Memory optimization completed");
  }

  // Create memory-efficient React hook
  createMemoryEfficientHook() {
    return {
      useMemoryOptimizedState: <T>(initialValue: T) => {
        const [state, setState] = React.useState(initialValue);
        const stateRef = React.useRef(state);

        // Update ref when state changes
        React.useEffect(() => {
          stateRef.current = state;
        }, [state]);

        // Cleanup function
        React.useEffect(() => {
          return () => {
            stateRef.current = initialValue; // Reset to prevent memory leaks
          };
        }, []);

        return [state, setState] as const;
      },

      useMemoryOptimizedEffect: (
        effect: React.EffectCallback,
        deps?: React.DependencyList
      ) => {
        React.useEffect(() => {
          const cleanup = effect();

          return () => {
            if (cleanup) {
              try {
                cleanup();
              } catch (error) {
                console.error("Error in effect cleanup:", error);
              }
            }
          };
        }, deps);
      },

      useMemoryOptimizedCallback: <T extends (...args: any[]) => any>(
        callback: T,
        deps: React.DependencyList
      ): T => {
        const callbackRef = React.useRef(callback);

        React.useEffect(() => {
          callbackRef.current = callback;
        });

        return React.useCallback(
          ((...args) => callbackRef.current(...args)) as T,
          deps
        );
      },
    };
  }

  // Memory leak detection utilities
  createLeakDetector() {
    const detectors = {
      // Detect uncleaned event listeners
      detectEventListenerLeaks: (element: HTMLElement): string[] => {
        const leaks: string[] = [];
        const events = [
          "click",
          "mousedown",
          "mouseup",
          "keydown",
          "keyup",
          "scroll",
          "resize",
        ];

        events.forEach((event) => {
          if ((element as any)[`on${event}`]) {
            leaks.push(
              `Potential event listener leak: ${event} on ${element.tagName}`
            );
          }
        });

        return leaks;
      },

      // Detect timer leaks
      detectTimerLeaks: (): string[] => {
        // This would require patching setTimeout/setInterval
        return [];
      },

      // Detect observer leaks
      detectObserverLeaks: (): string[] => {
        // This would require tracking observer instances
        return [];
      },

      // Detect DOM reference leaks
      detectDOMReferenceLeaks: (): string[] => {
        const leaks: string[] = [];

        // Check for detached DOM nodes
        if (typeof window !== "undefined") {
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            null
          );

          let node;
          while ((node = walker.nextNode())) {
            if (!node.parentNode) {
              leaks.push(`Detached DOM node: ${(node as Element).tagName}`);
            }
          }
        }

        return leaks;
      },
    };

    return detectors;
  }

  // Public API methods
  getMemoryMetrics(): MemoryMetrics | null {
    return this.memoryHistory.length > 0
      ? this.memoryHistory[this.memoryHistory.length - 1]
      : null;
  }

  getMemoryHistory(): MemoryMetrics[] {
    return [...this.memoryHistory];
  }

  getDetectedLeaks(): MemoryLeak[] {
    return [...this.detectedLeaks];
  }

  getComponentProfiles(): ComponentMemoryProfile[] {
    return Array.from(this.componentProfiles.values());
  }

  clearLeaks(): void {
    this.detectedLeaks = [];
  }

  onMemoryLeak(callback: (leak: MemoryLeak) => void): () => void {
    this.leakCallbacks.push(callback);

    return () => {
      const index = this.leakCallbacks.indexOf(callback);
      if (index > -1) {
        this.leakCallbacks.splice(index, 1);
      }
    };
  }

  // Generate memory report
  generateMemoryReport(): any {
    const currentMetrics = this.getMemoryMetrics();
    const leaks = this.getDetectedLeaks();
    const profiles = this.getComponentProfiles();

    return {
      timestamp: new Date().toISOString(),
      currentMemory: currentMetrics
        ? {
            used: this.formatBytes(currentMetrics.usedJSHeapSize),
            total: this.formatBytes(currentMetrics.totalJSHeapSize),
            limit: this.formatBytes(currentMetrics.jsHeapSizeLimit),
            utilization:
              (
                (currentMetrics.usedJSHeapSize /
                  currentMetrics.jsHeapSizeLimit) *
                100
              ).toFixed(2) + "%",
          }
        : null,
      memoryTrend: this.analyzeMemoryTrend(),
      leaks: leaks.map((leak) => ({
        component: leak.component,
        type: leak.type,
        severity: leak.severity,
        description: leak.description,
        detectedAt: leak.detectedAt.toISOString(),
      })),
      componentProfiles: profiles.map((profile) => ({
        name: profile.name,
        memoryDelta: this.formatBytes(profile.memoryDelta),
        duration: profile.unmountTime
          ? profile.unmountTime - profile.mountTime
          : "Still mounted",
      })),
      recommendations: this.generateMemoryRecommendations(),
    };
  }

  // Analyze memory trend
  private analyzeMemoryTrend(): string {
    if (this.memoryHistory.length < 5) return "Insufficient data";

    const recent = this.memoryHistory.slice(-5);
    const trend =
      recent[recent.length - 1].usedJSHeapSize - recent[0].usedJSHeapSize;

    if (trend > 5 * 1024 * 1024) return "Increasing (potential leak)";
    if (trend < -1 * 1024 * 1024) return "Decreasing (good)";
    return "Stable";
  }

  // Generate memory optimization recommendations
  private generateMemoryRecommendations(): string[] {
    const recommendations: string[] = [];
    const currentMetrics = this.getMemoryMetrics();
    const leaks = this.getDetectedLeaks();

    if (
      currentMetrics &&
      currentMetrics.usedJSHeapSize > MEMORY_THRESHOLDS.WARNING
    ) {
      recommendations.push("Consider reducing component complexity");
      recommendations.push("Implement lazy loading for heavy components");
      recommendations.push("Use React.memo to prevent unnecessary re-renders");
    }

    if (leaks.length > 0) {
      recommendations.push("Fix detected memory leaks");
      recommendations.push("Implement proper cleanup in useEffect hooks");
      recommendations.push("Remove event listeners on component unmount");
    }

    const highMemoryComponents = this.getComponentProfiles().filter(
      (profile) => profile.memoryDelta > 1024 * 1024
    );

    if (highMemoryComponents.length > 0) {
      recommendations.push(
        "Optimize high-memory components: " +
          highMemoryComponents.map((c) => c.name).join(", ")
      );
    }

    return recommendations;
  }

  // Format bytes for display
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// React integration
import React from "react";

// Memory-optimized component wrapper
export const withMemoryOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const MemoryOptimizedComponent = React.memo((props: P) => {
    const optimizer = MemoryOptimizer.getInstance();
    const name =
      componentName || Component.displayName || Component.name || "Unknown";

    React.useEffect(() => {
      const { onMount, onUnmount } = optimizer.profileComponent(name);
      onMount();

      return () => {
        onUnmount();
      };
    }, []);

    return React.createElement(Component, props);
  });

  MemoryOptimizedComponent.displayName = `MemoryOptimized(${
    componentName || Component.displayName || Component.name
  })`;

  return MemoryOptimizedComponent;
};

// Export singleton instance
export const memoryOptimizer = MemoryOptimizer.getInstance();
