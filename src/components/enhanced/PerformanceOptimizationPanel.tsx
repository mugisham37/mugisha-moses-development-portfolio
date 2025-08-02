"use client";

import React, { useState, useEffect } from "react";
import {
  performanceMonitoringSystem,
  getPerformanceReport,
} from "../../lib/performance-monitoring";
import { bundleAnalyzer, BundleAnalysis } from "../../lib/bundle-analyzer";
import {
  memoryOptimizer,
  MemoryMetrics,
  MemoryLeak,
} from "../../lib/memory-optimization";
import { performanceMonitor } from "../../utils/performanceMonitor";

interface PerformanceOptimizationPanelProps {
  className?: string;
}

const PerformanceOptimizationPanel: React.FC<
  PerformanceOptimizationPanelProps
> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<
    "monitoring" | "bundle" | "memory"
  >("monitoring");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(
    null
  );
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics | null>(
    null
  );
  const [memoryLeaks, setMemoryLeaks] = useState<MemoryLeak[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize monitoring
  useEffect(() => {
    const startMonitoring = () => {
      performanceMonitoringSystem.startMonitoring();
      memoryOptimizer.startMonitoring();
      setIsMonitoring(true);
    };

    const stopMonitoring = () => {
      performanceMonitoringSystem.stopMonitoring();
      memoryOptimizer.stopMonitoring();
      setIsMonitoring(false);
    };

    // Auto-start monitoring
    startMonitoring();

    // Setup data refresh interval
    const interval = setInterval(() => {
      if (isMonitoring) {
        refreshData();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      stopMonitoring();
    };
  }, [isMonitoring]);

  // Refresh performance data
  const refreshData = async () => {
    try {
      // Get performance report
      const report = getPerformanceReport();
      setPerformanceData(report);

      // Get memory metrics
      const memory = memoryOptimizer.getMemoryMetrics();
      setMemoryMetrics(memory);

      // Get memory leaks
      const leaks = memoryOptimizer.getDetectedLeaks();
      setMemoryLeaks(leaks);

      // Get bundle analysis (less frequent)
      if (Math.random() < 0.2) {
        // 20% chance to avoid too frequent analysis
        const analysis = await bundleAnalyzer.analyzeCurrent();
        setBundleAnalysis(analysis);
      }
    } catch (error) {
      console.error("Failed to refresh performance data:", error);
    }
  };

  // Toggle monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      performanceMonitoringSystem.stopMonitoring();
      memoryOptimizer.stopMonitoring();
      setIsMonitoring(false);
    } else {
      performanceMonitoringSystem.startMonitoring();
      memoryOptimizer.startMonitoring();
      setIsMonitoring(true);
    }
  };

  // Force garbage collection
  const forceGarbageCollection = () => {
    memoryOptimizer.optimizeMemory();
    refreshData();
  };

  // Export performance data
  const exportData = () => {
    const data = {
      performance: performanceData,
      bundle: bundleAnalysis,
      memory: {
        metrics: memoryMetrics,
        leaks: memoryLeaks,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get performance score color
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      {/* Header */}
      <div className="border-b-4 border-black p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Performance Optimization</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMonitoring}
              className={`px-4 py-2 font-bold border-2 border-black transition-colors ${
                isMonitoring
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 font-bold border-2 border-black bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 font-bold border-2 border-black bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isMonitoring ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {isMonitoring ? "Monitoring Active" : "Monitoring Stopped"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-4 border-black">
        <div className="flex">
          {[
            { id: "monitoring", label: "Performance Monitoring" },
            { id: "bundle", label: "Bundle Analysis" },
            { id: "memory", label: "Memory Optimization" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-bold border-r-4 border-black transition-colors ${
                activeTab === tab.id
                  ? "bg-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Performance Monitoring Tab */}
        {activeTab === "monitoring" && (
          <div className="space-y-6">
            {performanceData ? (
              <>
                {/* Performance Score */}
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h3 className="text-lg font-bold mb-4">Performance Score</h3>
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        performanceData.score
                      )}`}
                    >
                      {performanceData.score}/100
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 border-2 border-black h-4">
                        <div
                          className={`h-full transition-all duration-300 ${
                            performanceData.score >= 90
                              ? "bg-green-500"
                              : performanceData.score >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${performanceData.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Web Vitals */}
                {performanceData.metrics && (
                  <div className="bg-gray-50 border-2 border-black p-4">
                    <h3 className="text-lg font-bold mb-4">Core Web Vitals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border-2 border-black p-3">
                        <div className="text-sm font-medium text-gray-600">
                          LCP
                        </div>
                        <div className="text-xl font-bold">
                          {Math.round(
                            performanceData.metrics.largestContentfulPaint
                          )}
                          ms
                        </div>
                      </div>
                      <div className="bg-white border-2 border-black p-3">
                        <div className="text-sm font-medium text-gray-600">
                          FID
                        </div>
                        <div className="text-xl font-bold">
                          {Math.round(performanceData.metrics.firstInputDelay)}
                          ms
                        </div>
                      </div>
                      <div className="bg-white border-2 border-black p-3">
                        <div className="text-sm font-medium text-gray-600">
                          CLS
                        </div>
                        <div className="text-xl font-bold">
                          {performanceData.metrics.cumulativeLayoutShift.toFixed(
                            3
                          )}
                        </div>
                      </div>
                      <div className="bg-white border-2 border-black p-3">
                        <div className="text-sm font-medium text-gray-600">
                          FCP
                        </div>
                        <div className="text-xl font-bold">
                          {Math.round(
                            performanceData.metrics.firstContentfulPaint
                          )}
                          ms
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {performanceData.recommendations &&
                  performanceData.recommendations.length > 0 && (
                    <div className="bg-gray-50 border-2 border-black p-4">
                      <h3 className="text-lg font-bold mb-4">
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {performanceData.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-yellow-600 font-bold">
                                •
                              </span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  No performance data available
                </div>
                <button
                  onClick={refreshData}
                  className="mt-4 px-4 py-2 font-bold border-2 border-black bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Load Data
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bundle Analysis Tab */}
        {activeTab === "bundle" && (
          <div className="space-y-6">
            {bundleAnalysis ? (
              <>
                {/* Bundle Overview */}
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h3 className="text-lg font-bold mb-4">Bundle Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-black p-3">
                      <div className="text-sm font-medium text-gray-600">
                        Total Size
                      </div>
                      <div className="text-xl font-bold">
                        {formatBytes(bundleAnalysis.totalSize)}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-black p-3">
                      <div className="text-sm font-medium text-gray-600">
                        Gzipped Size
                      </div>
                      <div className="text-xl font-bold">
                        {formatBytes(bundleAnalysis.gzippedSize)}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-black p-3">
                      <div className="text-sm font-medium text-gray-600">
                        Bundle Score
                      </div>
                      <div
                        className={`text-xl font-bold ${getScoreColor(
                          bundleAnalysis.score
                        )}`}
                      >
                        {bundleAnalysis.score}/100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chunks */}
                <div className="bg-gray-50 border-2 border-black p-4">
                  <h3 className="text-lg font-bold mb-4">
                    Chunks ({bundleAnalysis.chunks.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bundleAnalysis.chunks.map((chunk, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-black p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{chunk.name}</div>
                          <div className="text-sm text-gray-600">
                            {chunk.isEntry
                              ? "Entry"
                              : chunk.isAsync
                              ? "Async"
                              : "Sync"}{" "}
                            • Load time: {chunk.loadTime.toFixed(2)}ms
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatBytes(chunk.size)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatBytes(chunk.gzippedSize)} gzipped
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bundle Recommendations */}
                {bundleAnalysis.recommendations.length > 0 && (
                  <div className="bg-gray-50 border-2 border-black p-4">
                    <h3 className="text-lg font-bold mb-4">
                      Bundle Optimization
                    </h3>
                    <ul className="space-y-2">
                      {bundleAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading bundle analysis...</div>
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const analysis = await bundleAnalyzer.analyzeCurrent();
                      setBundleAnalysis(analysis);
                    } catch (error) {
                      console.error("Failed to analyze bundle:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="mt-4 px-4 py-2 font-bold border-2 border-black bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Analyzing..." : "Analyze Bundle"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Memory Optimization Tab */}
        {activeTab === "memory" && (
          <div className="space-y-6">
            {/* Memory Metrics */}
            {memoryMetrics && (
              <div className="bg-gray-50 border-2 border-black p-4">
                <h3 className="text-lg font-bold mb-4">Memory Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-black p-3">
                    <div className="text-sm font-medium text-gray-600">
                      Used Heap
                    </div>
                    <div className="text-xl font-bold">
                      {formatBytes(memoryMetrics.usedJSHeapSize)}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-black p-3">
                    <div className="text-sm font-medium text-gray-600">
                      Total Heap
                    </div>
                    <div className="text-xl font-bold">
                      {formatBytes(memoryMetrics.totalJSHeapSize)}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-black p-3">
                    <div className="text-sm font-medium text-gray-600">
                      Heap Limit
                    </div>
                    <div className="text-xl font-bold">
                      {formatBytes(memoryMetrics.jsHeapSizeLimit)}
                    </div>
                  </div>
                </div>

                {/* Memory utilization bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Memory Utilization
                    </span>
                    <span className="text-sm">
                      {(
                        (memoryMetrics.usedJSHeapSize /
                          memoryMetrics.jsHeapSizeLimit) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 border-2 border-black h-4">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${
                          (memoryMetrics.usedJSHeapSize /
                            memoryMetrics.jsHeapSizeLimit) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Memory Leaks */}
            <div className="bg-gray-50 border-2 border-black p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  Memory Leaks ({memoryLeaks.length})
                </h3>
                <button
                  onClick={forceGarbageCollection}
                  className="px-3 py-1 text-sm font-bold border-2 border-black bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Force GC
                </button>
              </div>

              {memoryLeaks.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {memoryLeaks.map((leak, index) => (
                    <div
                      key={leak.id}
                      className="bg-white border-2 border-black p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-bold border border-black ${
                                leak.severity === "high"
                                  ? "bg-red-500 text-white"
                                  : leak.severity === "medium"
                                  ? "bg-yellow-500 text-black"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {leak.severity.toUpperCase()}
                            </span>
                            <span className="font-medium">
                              {leak.component}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({leak.type})
                            </span>
                          </div>
                          <div className="text-sm mt-1">{leak.description}</div>
                          {leak.suggestions.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs font-medium text-gray-600 mb-1">
                                Suggestions:
                              </div>
                              <ul className="text-xs space-y-1">
                                {leak.suggestions.map((suggestion, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-1"
                                  >
                                    <span className="text-gray-400">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leak.detectedAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No memory leaks detected
                </div>
              )}
            </div>

            {/* Memory Actions */}
            <div className="bg-gray-50 border-2 border-black p-4">
              <h3 className="text-lg font-bold mb-4">Memory Actions</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => memoryOptimizer.clearLeaks()}
                  className="px-4 py-2 font-bold border-2 border-black bg-yellow-500 text-black hover:bg-yellow-600 transition-colors"
                >
                  Clear Leak History
                </button>
                <button
                  onClick={forceGarbageCollection}
                  className="px-4 py-2 font-bold border-2 border-black bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Optimize Memory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOptimizationPanel;
