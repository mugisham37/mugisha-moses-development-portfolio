"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { performanceMonitoringSystem } from "../../lib/performance-monitoring";
import { bundleAnalyzer } from "../../lib/bundle-analyzer";
import { memoryOptimizer } from "../../lib/memory-optimization";
import { preloadCriticalResources } from "../../lib/lazy-loading";

interface PerformanceContextType {
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  optimizePerformance: () => void;
  getPerformanceReport: () => any;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

interface PerformanceProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  enableLazyLoading?: boolean;
  enableBundleAnalysis?: boolean;
  enableMemoryOptimization?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  autoStart = true,
  enableLazyLoading = true,
  enableBundleAnalysis = true,
  enableMemoryOptimization = true,
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Initialize performance optimizations
    if (typeof window !== "undefined") {
      // Preload critical resources
      if (enableLazyLoading) {
        preloadCriticalResources();
      }

      // Auto-start monitoring if enabled
      if (autoStart) {
        startMonitoring();
      }

      // Setup performance observer for web vitals
      setupWebVitalsTracking();

      // Setup bundle size monitoring
      if (enableBundleAnalysis) {
        setupBundleMonitoring();
      }

      // Setup memory optimization
      if (enableMemoryOptimization) {
        setupMemoryOptimization();
      }
    }

    return () => {
      // Cleanup on unmount
      stopMonitoring();
    };
  }, [
    autoStart,
    enableLazyLoading,
    enableBundleAnalysis,
    enableMemoryOptimization,
  ]);

  const startMonitoring = () => {
    if (typeof window === "undefined") return;

    try {
      performanceMonitoringSystem.startMonitoring();

      if (enableMemoryOptimization) {
        memoryOptimizer.startMonitoring();
      }

      setIsMonitoring(true);
      console.log("🚀 Performance monitoring started");
    } catch (error) {
      console.error("Failed to start performance monitoring:", error);
    }
  };

  const stopMonitoring = () => {
    try {
      performanceMonitoringSystem.stopMonitoring();
      memoryOptimizer.stopMonitoring();
      setIsMonitoring(false);
      console.log("⏹️ Performance monitoring stopped");
    } catch (error) {
      console.error("Failed to stop performance monitoring:", error);
    }
  };

  const optimizePerformance = () => {
    try {
      // Force garbage collection
      memoryOptimizer.optimizeMemory();

      // Clear bundle analysis cache
      bundleAnalyzer.clearCache();

      // Clear performance alerts
      performanceMonitoringSystem.clearAlerts();

      console.log("🧹 Performance optimization completed");
    } catch (error) {
      console.error("Failed to optimize performance:", error);
    }
  };

  const getPerformanceReport = () => {
    try {
      return {
        monitoring: performanceMonitoringSystem.generateReport(),
        memory: memoryOptimizer.generateMemoryReport(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to generate performance report:", error);
      return null;
    }
  };

  // Setup Web Vitals tracking
  const setupWebVitalsTracking = () => {
    if (typeof window === "undefined") return;

    // Import web-vitals dynamically to avoid SSR issues
    import("web-vitals")
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onLCP((metric) => {
          performanceMonitoringSystem.trackWebVital(
            "LCP",
            metric.value,
            metric
          );
        });

        onFID((metric) => {
          performanceMonitoringSystem.trackWebVital(
            "FID",
            metric.value,
            metric
          );
        });

        onCLS((metric) => {
          performanceMonitoringSystem.trackWebVital(
            "CLS",
            metric.value,
            metric
          );
        });

        onFCP((metric) => {
          performanceMonitoringSystem.trackWebVital(
            "FCP",
            metric.value,
            metric
          );
        });

        onTTFB((metric) => {
          performanceMonitoringSystem.trackWebVital(
            "TTFB",
            metric.value,
            metric
          );
        });
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals library:", error);
      });
  };

  // Setup bundle monitoring
  const setupBundleMonitoring = () => {
    if (typeof window === "undefined") return;

    // Monitor bundle size periodically
    const checkBundleSize = async () => {
      try {
        const analysis = await bundleAnalyzer.analyzeCurrent();

        // Log bundle size warnings
        if (analysis.score < 70) {
          console.warn("⚠️ Bundle size optimization needed:", analysis);
        }
      } catch (error) {
        console.error("Bundle analysis error:", error);
      }
    };

    // Check bundle size on page load and periodically
    setTimeout(checkBundleSize, 5000); // After 5 seconds
    setInterval(checkBundleSize, 300000); // Every 5 minutes
  };

  // Setup memory optimization
  const setupMemoryOptimization = () => {
    if (typeof window === "undefined") return;

    // Setup memory leak detection
    const unsubscribe = memoryOptimizer.onMemoryLeak((leak) => {
      console.warn("🧠 Memory leak detected:", leak);

      // Auto-optimize for critical leaks
      if (leak.severity === "high") {
        setTimeout(() => {
          memoryOptimizer.optimizeMemory();
        }, 1000);
      }
    });

    // Cleanup function
    return unsubscribe;
  };

  const contextValue: PerformanceContextType = {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    optimizePerformance,
    getPerformanceReport,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Performance HOC for components
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const PerformanceTrackedComponent = React.memo((props: P) => {
    const name =
      componentName || Component.displayName || Component.name || "Unknown";

    useEffect(() => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        // Log slow components
        if (renderTime > 16) {
          // More than one frame
          console.warn(
            `⚠️ Slow component render: ${name} took ${renderTime.toFixed(2)}ms`
          );
        }
      };
    }, []);

    return <Component {...props} />;
  });

  PerformanceTrackedComponent.displayName = `PerformanceTracked(${name})`;

  return PerformanceTrackedComponent;
};

// Performance hook for manual tracking
export const usePerformanceTracking = (componentName: string) => {
  const [renderTime, setRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const time = endTime - startTime;
      setRenderTime(time);

      // Log performance data
      if (process.env.NODE_ENV === "development") {
        console.log(`📊 ${componentName} render time: ${time.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return { renderTime };
};

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const { getPerformanceReport } = usePerformance();

  useEffect(() => {
    const updateMetrics = () => {
      const report = getPerformanceReport();
      setMetrics(report);
    };

    // Update metrics initially and then every 10 seconds
    updateMetrics();
    const interval = setInterval(updateMetrics, 10000);

    return () => clearInterval(interval);
  }, [getPerformanceReport]);

  return metrics;
};

export default PerformanceProvider;
