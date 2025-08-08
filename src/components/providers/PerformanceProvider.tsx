"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PerformanceContextType {
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  performanceData: any;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

interface PerformanceProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
  enableLazyLoading?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  autoStart = true,
  enableLazyLoading = true,
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    // Initialize basic performance tracking
    if (typeof window !== "undefined") {
      // Auto-start monitoring if enabled
      if (autoStart) {
        startMonitoring();
      }
    }

    return () => {
      // Cleanup on unmount
      stopMonitoring();
    };
  }, [autoStart]);

  const startMonitoring = () => {
    if (typeof window === "undefined") return;

    try {
      setIsMonitoring(true);
      console.log("🚀 Performance monitoring started");
    } catch (error) {
      console.error("Failed to start performance monitoring:", error);
    }
  };

  const stopMonitoring = () => {
    try {
      setIsMonitoring(false);
      console.log("⏹️ Performance monitoring stopped");
    } catch (error) {
      console.error("Failed to stop performance monitoring:", error);
    }
  };

  const value: PerformanceContextType = {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    performanceData,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
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
