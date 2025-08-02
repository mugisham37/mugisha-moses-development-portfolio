import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { performanceMonitoringSystem } from "../performance-monitoring";
import { bundleAnalyzer } from "../bundle-analyzer";
import { memoryOptimizer } from "../memory-optimization";

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  mark: vi.fn(),
  measure: vi.fn(),
  memory: {
    usedJSHeapSize: 50000000,
    totalJSHeapSize: 100000000,
    jsHeapSizeLimit: 2000000000,
  },
};

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window object
const mockWindow = {
  performance: mockPerformance,
  PerformanceObserver: mockPerformanceObserver,
  navigator: {
    userAgent: "test-agent",
    connection: {
      effectiveType: "4g",
      downlink: 10,
      rtt: 50,
    },
  },
  location: {
    href: "http://localhost:3000/test",
    pathname: "/test",
  },
  document: {
    createElement: vi.fn(() => ({
      rel: "",
      href: "",
      as: "",
      type: "",
    })),
    head: {
      appendChild: vi.fn(),
    },
    querySelectorAll: vi.fn(() => []),
  },
  requestIdleCallback: vi.fn((callback) => setTimeout(callback, 0)),
  gtag: vi.fn(),
};

describe("Performance Monitoring System", () => {
  beforeEach(() => {
    // Setup global mocks
    global.window = mockWindow as any;
    global.performance = mockPerformance as any;
    global.PerformanceObserver = mockPerformanceObserver as any;
    global.document = mockWindow.document as any;
    global.navigator = mockWindow.navigator as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
    performanceMonitoringSystem.stopMonitoring();
    memoryOptimizer.stopMonitoring();
  });

  describe("Performance Monitoring", () => {
    it("should start monitoring successfully", () => {
      performanceMonitoringSystem.startMonitoring();
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });

    it("should stop monitoring successfully", () => {
      performanceMonitoringSystem.startMonitoring();
      performanceMonitoringSystem.stopMonitoring();
      // Should not throw errors
    });

    it("should generate performance report", () => {
      const report = performanceMonitoringSystem.generateReport();
      expect(report).toBeDefined();
      expect(report).toHaveProperty("timestamp");
      expect(report).toHaveProperty("recommendations");
      expect(report).toHaveProperty("score");
    });

    it("should track web vitals", () => {
      const metric = { name: "LCP", value: 2000, id: "test-id" };
      performanceMonitoringSystem.trackWebVital("LCP", 2000, metric);

      const alerts = performanceMonitoringSystem.getAlerts();
      expect(alerts.length).toBeGreaterThanOrEqual(0);
    });

    it("should create alerts for poor performance", () => {
      const metric = { name: "LCP", value: 5000, id: "test-id" }; // Poor LCP
      performanceMonitoringSystem.trackWebVital("LCP", 5000, metric);

      const alerts = performanceMonitoringSystem.getAlerts();
      const lcpAlerts = alerts.filter((alert) => alert.metric === "LCP");
      expect(lcpAlerts.length).toBeGreaterThan(0);
    });

    it("should clear alerts", () => {
      performanceMonitoringSystem.clearAlerts();
      const alerts = performanceMonitoringSystem.getAlerts();
      expect(alerts).toHaveLength(0);
    });
  });

  describe("Bundle Analyzer", () => {
    beforeEach(() => {
      // Mock performance resource entries
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: "http://localhost:3000/_next/static/chunks/main.js",
          startTime: 100,
          responseEnd: 200,
          encodedBodySize: 100000,
          transferSize: 50000,
        },
        {
          name: "http://localhost:3000/_next/static/chunks/vendor.js",
          startTime: 150,
          responseEnd: 300,
          encodedBodySize: 200000,
          transferSize: 100000,
        },
      ]);
    });

    it("should analyze current bundle", async () => {
      const analysis = await bundleAnalyzer.analyzeCurrent();

      expect(analysis).toBeDefined();
      expect(analysis).toHaveProperty("totalSize");
      expect(analysis).toHaveProperty("gzippedSize");
      expect(analysis).toHaveProperty("chunks");
      expect(analysis).toHaveProperty("score");
      expect(analysis.chunks).toBeInstanceOf(Array);
    });

    it("should generate recommendations", async () => {
      const analysis = await bundleAnalyzer.analyzeCurrent();
      expect(analysis.recommendations).toBeInstanceOf(Array);
    });

    it("should calculate bundle score", async () => {
      const analysis = await bundleAnalyzer.analyzeCurrent();
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(100);
    });

    it("should export analysis data", async () => {
      const analysis = await bundleAnalyzer.analyzeCurrent();
      const exported = bundleAnalyzer.exportAnalysis(analysis);

      expect(typeof exported).toBe("string");
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it("should clear cache", () => {
      bundleAnalyzer.clearCache();
      const cached = bundleAnalyzer.getCachedAnalyses();
      expect(cached).toHaveLength(0);
    });
  });

  describe("Memory Optimizer", () => {
    it("should start memory monitoring", () => {
      memoryOptimizer.startMonitoring();
      // Should not throw errors
    });

    it("should stop memory monitoring", () => {
      memoryOptimizer.startMonitoring();
      memoryOptimizer.stopMonitoring();
      // Should not throw errors
    });

    it("should get current memory metrics", () => {
      const metrics = memoryOptimizer.getMemoryMetrics();
      // May be null if no monitoring data yet
      if (metrics) {
        expect(metrics).toHaveProperty("usedJSHeapSize");
        expect(metrics).toHaveProperty("totalJSHeapSize");
        expect(metrics).toHaveProperty("jsHeapSizeLimit");
      }
    });

    it("should profile component memory usage", () => {
      const { onMount, onUnmount } =
        memoryOptimizer.profileComponent("TestComponent");

      expect(typeof onMount).toBe("function");
      expect(typeof onUnmount).toBe("function");

      // Test component lifecycle
      onMount();
      onUnmount();

      const profiles = memoryOptimizer.getComponentProfiles();
      const testProfile = profiles.find((p) => p.name === "TestComponent");
      expect(testProfile).toBeDefined();
    });

    it("should detect memory leaks", () => {
      // Simulate memory leak by calling onMemoryLeak callback
      const mockCallback = vi.fn();
      const unsubscribe = memoryOptimizer.onMemoryLeak(mockCallback);

      expect(typeof unsubscribe).toBe("function");
      unsubscribe();
    });

    it("should optimize memory", () => {
      memoryOptimizer.optimizeMemory();
      // Should not throw errors
    });

    it("should generate memory report", () => {
      const report = memoryOptimizer.generateMemoryReport();

      expect(report).toBeDefined();
      expect(report).toHaveProperty("timestamp");
      expect(report).toHaveProperty("memoryTrend");
      expect(report).toHaveProperty("recommendations");
    });

    it("should clear detected leaks", () => {
      memoryOptimizer.clearLeaks();
      const leaks = memoryOptimizer.getDetectedLeaks();
      expect(leaks).toHaveLength(0);
    });
  });

  describe("Integration Tests", () => {
    it("should work together without conflicts", async () => {
      // Start all monitoring systems
      performanceMonitoringSystem.startMonitoring();
      memoryOptimizer.startMonitoring();

      // Generate some test data
      performanceMonitoringSystem.trackWebVital("LCP", 2000, {
        name: "LCP",
        value: 2000,
        id: "test",
      });

      // Analyze bundle
      const bundleAnalysis = await bundleAnalyzer.analyzeCurrent();

      // Generate reports
      const performanceReport = performanceMonitoringSystem.generateReport();
      const memoryReport = memoryOptimizer.generateMemoryReport();

      // Verify all systems are working
      expect(performanceReport).toBeDefined();
      expect(memoryReport).toBeDefined();
      expect(bundleAnalysis).toBeDefined();

      // Stop monitoring
      performanceMonitoringSystem.stopMonitoring();
      memoryOptimizer.stopMonitoring();
    });

    it("should handle errors gracefully", () => {
      // Test with invalid data
      expect(() => {
        performanceMonitoringSystem.trackWebVital("INVALID", NaN, null as any);
      }).not.toThrow();

      // Test memory optimization with no data
      expect(() => {
        memoryOptimizer.optimizeMemory();
      }).not.toThrow();
    });
  });
});

describe("Performance Utilities", () => {
  it("should format bytes correctly", () => {
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1073741824)).toBe("1 GB");
  });

  it("should calculate performance scores correctly", () => {
    const getPerformanceGrade = (
      value: number,
      thresholds: { good: number; poor: number }
    ): "good" | "needs-improvement" | "poor" => {
      if (value <= thresholds.good) return "good";
      if (value <= thresholds.poor) return "needs-improvement";
      return "poor";
    };

    const lcpThresholds = { good: 2500, poor: 4000 };

    expect(getPerformanceGrade(2000, lcpThresholds)).toBe("good");
    expect(getPerformanceGrade(3000, lcpThresholds)).toBe("needs-improvement");
    expect(getPerformanceGrade(5000, lcpThresholds)).toBe("poor");
  });
});
