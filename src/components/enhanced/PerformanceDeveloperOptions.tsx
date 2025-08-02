"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUserSettings } from "@/contexts/EnhancedAppContext";
import {
  performanceMonitor,
  formatBytes,
  formatDuration,
  getPerformanceGrade,
  WEB_VITALS_THRESHOLDS,
} from "@/utils/performanceMonitor";
import { featureFlagManager, FeatureFlag } from "@/utils/featureFlags";
import { PerformanceMetrics } from "@/types/enhanced";

interface DebugInfo {
  id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  component?: string;
  message: string;
  data?: Record<string, unknown>;
}

export default function PerformanceDeveloperOptions() {
  const { settings, updateSettings } = useUserSettings();
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [debugFilter, setDebugFilter] = useState<
    "all" | "info" | "warn" | "error" | "debug"
  >("all");
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [performanceBudget, setPerformanceBudget] = useState<{
    passed: boolean;
    results: Record<string, { value: number; budget: number; passed: boolean }>;
  } | null>(null);

  // Initialize feature flags from manager
  useEffect(() => {
    featureFlagManager.loadFlags();
    setFeatureFlags(featureFlagManager.getAllFlags());
  }, []);

  // Collect performance metrics
  const collectPerformanceMetrics = useCallback(() => {
    const metrics = performanceMonitor.getMetrics();
    if (metrics) {
      setPerformanceMetrics(metrics);
    } else {
      performanceMonitor.refreshMetrics();
      setTimeout(() => {
        setPerformanceMetrics(performanceMonitor.getMetrics());
      }, 100);
    }
  }, []);

  // Get debug logs from performance monitor
  const refreshDebugLogs = useCallback(() => {
    setDebugLogs(performanceMonitor.getDebugLogs());
  }, []);

  // Toggle feature flag
  const toggleFeatureFlag = (flagId: string) => {
    const newEnabled = featureFlagManager.toggleFlag(flagId);

    // Update local state
    setFeatureFlags((prev) =>
      prev.map((flag) =>
        flag.id === flagId ? { ...flag, enabled: newEnabled } : flag
      )
    );

    // Update settings context
    const updatedFlags = { ...settings.advanced.featureFlags };
    updatedFlags[flagId] = newEnabled;
    updateSettings({
      advanced: {
        ...settings.advanced,
        featureFlags: updatedFlags,
      },
    });

    performanceMonitor.addDebugLog(
      "info",
      `Feature flag "${flagId}" toggled to ${newEnabled}`,
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();
  };

  // Update performance monitoring setting
  const togglePerformanceMonitoring = () => {
    const newValue = !settings.advanced.performanceMonitoring;
    updateSettings({
      advanced: {
        ...settings.advanced,
        performanceMonitoring: newValue,
      },
    });

    if (newValue) {
      performanceMonitor.startMonitoring();
      collectPerformanceMetrics();
    } else {
      performanceMonitor.stopMonitoring();
    }

    performanceMonitor.addDebugLog(
      "info",
      `Performance monitoring ${newValue ? "enabled" : "disabled"}`,
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();
  };

  // Update debug mode setting
  const toggleDebugMode = () => {
    const newValue = !settings.advanced.debugMode;
    updateSettings({
      advanced: {
        ...settings.advanced,
        debugMode: newValue,
      },
    });

    performanceMonitor.addDebugLog(
      "info",
      `Debug mode ${newValue ? "enabled" : "disabled"}`,
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();
  };

  // Update developer mode setting
  const toggleDeveloperMode = () => {
    const newValue = !settings.advanced.developerMode;
    updateSettings({
      advanced: {
        ...settings.advanced,
        developerMode: newValue,
      },
    });

    performanceMonitor.addDebugLog(
      "info",
      `Developer mode ${newValue ? "enabled" : "disabled"}`,
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();
  };

  // Clear debug logs
  const clearDebugLogs = () => {
    performanceMonitor.clearDebugLogs();
    refreshDebugLogs();
  };

  // Export debug data
  const exportDebugData = () => {
    const debugData = performanceMonitor.exportDebugData();

    const blob = new Blob([JSON.stringify(debugData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debug-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    performanceMonitor.addDebugLog(
      "info",
      "Debug data exported",
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();
  };

  // Check performance budget
  const checkPerformanceBudget = () => {
    const budgetResult = performanceMonitor.checkPerformanceBudget();
    setPerformanceBudget(budgetResult);
    performanceMonitor.addDebugLog(
      "info",
      `Performance budget check: ${budgetResult.passed ? "PASSED" : "FAILED"}`,
      "PerformanceDeveloperOptions",
      budgetResult
    );
    refreshDebugLogs();
  };

  // Initialize performance monitoring if enabled
  useEffect(() => {
    if (settings.advanced.performanceMonitoring) {
      performanceMonitor.startMonitoring();
      collectPerformanceMetrics();
    }

    // Initial debug log
    performanceMonitor.addDebugLog(
      "info",
      "Performance & Developer Options initialized",
      "PerformanceDeveloperOptions"
    );
    refreshDebugLogs();

    return () => {
      if (settings.advanced.performanceMonitoring) {
        performanceMonitor.stopMonitoring();
      }
    };
  }, [
    settings.advanced.performanceMonitoring,
    collectPerformanceMetrics,
    refreshDebugLogs,
  ]);

  // Refresh debug logs periodically
  useEffect(() => {
    const interval = setInterval(refreshDebugLogs, 2000);
    return () => clearInterval(interval);
  }, [refreshDebugLogs]);

  const filteredDebugLogs =
    debugFilter === "all"
      ? debugLogs
      : debugLogs.filter((log) => log.level === debugFilter);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ui":
        return "bg-blue-100 text-blue-800";
      case "performance":
        return "bg-green-100 text-green-800";
      case "experimental":
        return "bg-purple-100 text-purple-800";
      case "analytics":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (
    value: number,
    thresholds: { good: number; poor: number }
  ) => {
    const grade = getPerformanceGrade(value, thresholds);
    switch (grade) {
      case "good":
        return "text-green-600";
      case "needs-improvement":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-2 border-black bg-white p-6">
        <h2 className="text-2xl font-black font-mono uppercase tracking-wider mb-4">
          Performance & Developer Options
        </h2>
        <p className="font-mono text-gray-600 mb-6">
          Advanced tools for performance monitoring, debugging, and feature
          management.
        </p>

        {/* Main Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={toggleDeveloperMode}
            className={`p-4 border-2 border-black font-mono font-bold uppercase tracking-wider transition-colors ${
              settings.advanced.developerMode
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Developer Mode: {settings.advanced.developerMode ? "ON" : "OFF"}
          </button>

          <button
            onClick={toggleDebugMode}
            className={`p-4 border-2 border-black font-mono font-bold uppercase tracking-wider transition-colors ${
              settings.advanced.debugMode
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Debug Mode: {settings.advanced.debugMode ? "ON" : "OFF"}
          </button>

          <button
            onClick={togglePerformanceMonitoring}
            className={`p-4 border-2 border-black font-mono font-bold uppercase tracking-wider transition-colors ${
              settings.advanced.performanceMonitoring
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Performance:{" "}
            {settings.advanced.performanceMonitoring ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Performance Metrics Panel */}
      {settings.advanced.performanceMonitoring && performanceMetrics && (
        <div className="border-2 border-black bg-white p-6">
          <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
            Real-Time Performance Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                Load Time
              </div>
              <div className="font-mono text-2xl font-bold">
                {formatDuration(performanceMetrics.loadTime)}
              </div>
              <div
                className={`text-xs font-mono ${getPerformanceColor(
                  performanceMetrics.loadTime,
                  { good: 3000, poor: 5000 }
                )}`}
              >
                {getPerformanceGrade(performanceMetrics.loadTime, {
                  good: 3000,
                  poor: 5000,
                })}
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                First Contentful Paint
              </div>
              <div className="font-mono text-2xl font-bold">
                {formatDuration(performanceMetrics.firstContentfulPaint)}
              </div>
              <div
                className={`text-xs font-mono ${getPerformanceColor(
                  performanceMetrics.firstContentfulPaint,
                  WEB_VITALS_THRESHOLDS.FCP
                )}`}
              >
                {getPerformanceGrade(
                  performanceMetrics.firstContentfulPaint,
                  WEB_VITALS_THRESHOLDS.FCP
                )}
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                Largest Contentful Paint
              </div>
              <div className="font-mono text-2xl font-bold">
                {formatDuration(performanceMetrics.largestContentfulPaint)}
              </div>
              <div
                className={`text-xs font-mono ${getPerformanceColor(
                  performanceMetrics.largestContentfulPaint,
                  WEB_VITALS_THRESHOLDS.LCP
                )}`}
              >
                {getPerformanceGrade(
                  performanceMetrics.largestContentfulPaint,
                  WEB_VITALS_THRESHOLDS.LCP
                )}
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                Memory Usage
              </div>
              <div className="font-mono text-2xl font-bold">
                {formatBytes(performanceMetrics.memoryUsage)}
              </div>
              <div
                className={`text-xs font-mono ${
                  performanceMetrics.memoryUsage < 50000000
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {performanceMetrics.memoryUsage < 50000000 ? "Good" : "Monitor"}
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                Cumulative Layout Shift
              </div>
              <div className="font-mono text-2xl font-bold">
                {performanceMetrics.cumulativeLayoutShift.toFixed(3)}
              </div>
              <div
                className={`text-xs font-mono ${getPerformanceColor(
                  performanceMetrics.cumulativeLayoutShift,
                  WEB_VITALS_THRESHOLDS.CLS
                )}`}
              >
                {getPerformanceGrade(
                  performanceMetrics.cumulativeLayoutShift,
                  WEB_VITALS_THRESHOLDS.CLS
                )}
              </div>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono text-sm text-gray-600 uppercase">
                Time to Interactive
              </div>
              <div className="font-mono text-2xl font-bold">
                {formatDuration(performanceMetrics.timeToInteractive)}
              </div>
              <div
                className={`text-xs font-mono ${
                  performanceMetrics.timeToInteractive < 3800
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {performanceMetrics.timeToInteractive < 3800
                  ? "Good"
                  : "Needs Improvement"}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={collectPerformanceMetrics}
              className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Refresh Metrics
            </button>
            <button
              onClick={checkPerformanceBudget}
              className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Check Budget
            </button>
            <button
              onClick={exportDebugData}
              className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Export Data
            </button>
          </div>

          {/* Performance Budget Results */}
          {performanceBudget && (
            <div className="mt-6 border border-gray-300 p-4">
              <h4 className="font-mono font-bold mb-3">
                Performance Budget Results
              </h4>
              <div
                className={`mb-2 font-mono text-sm ${
                  performanceBudget.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                Overall Status: {performanceBudget.passed ? "PASSED" : "FAILED"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(performanceBudget.results).map(
                  ([key, result]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono">{key}:</span>
                      <span
                        className={`font-mono ${
                          result.passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.value.toFixed(
                          key === "cumulativeLayoutShift" ? 3 : 0
                        )}
                        {key.includes("Time") || key.includes("Paint")
                          ? "ms"
                          : ""}
                        {result.passed ? " ✓" : " ✗"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Flags Management */}
      <div className="border-2 border-black bg-white p-6">
        <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
          Feature Flags & A/B Testing
        </h3>

        <div className="space-y-4">
          {featureFlags.map((flag) => (
            <div key={flag.id} className="border border-gray-300 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFeatureFlag(flag.id)}
                    className={`w-12 h-6 rounded-full border-2 border-black relative transition-colors ${
                      flag.enabled ? "bg-black" : "bg-white"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white border border-black rounded-full absolute top-0.5 transition-transform ${
                        flag.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div>
                    <div className="font-mono font-bold">{flag.name}</div>
                    <div className="font-mono text-sm text-gray-600">
                      {flag.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-mono font-bold uppercase rounded ${getCategoryColor(
                      flag.category
                    )}`}
                  >
                    {flag.category}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-mono font-bold uppercase rounded ${getImpactColor(
                      flag.impact
                    )}`}
                  >
                    {flag.impact} Impact
                  </span>
                  {flag.abTestGroup && (
                    <span className="px-2 py-1 text-xs font-mono font-bold uppercase rounded bg-purple-100 text-purple-800">
                      Group {flag.abTestGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Information Display */}
      {settings.advanced.debugMode && (
        <div className="border-2 border-black bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black font-mono uppercase tracking-wider">
              Debug Information
            </h3>

            <div className="flex items-center gap-2">
              <select
                value={debugFilter}
                onChange={(e) =>
                  setDebugFilter(
                    e.target.value as
                      | "all"
                      | "info"
                      | "warn"
                      | "error"
                      | "debug"
                  )
                }
                className="px-3 py-1 border-2 border-black font-mono text-sm"
              >
                <option value="all">All Logs</option>
                <option value="info">Info</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors</option>
                <option value="debug">Debug</option>
              </select>

              <button
                onClick={clearDebugLogs}
                className="px-3 py-1 border-2 border-black bg-white text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border border-gray-300">
            {filteredDebugLogs.length === 0 ? (
              <div className="p-4 text-center font-mono text-gray-500">
                No debug logs to display
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDebugLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs font-mono font-bold uppercase rounded ${
                          log.level === "error"
                            ? "bg-red-100 text-red-800"
                            : log.level === "warn"
                            ? "bg-yellow-100 text-yellow-800"
                            : log.level === "debug"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      {log.component && (
                        <span className="font-mono text-xs text-gray-600">
                          [{log.component}]
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm">{log.message}</div>
                    {log.data && (
                      <details className="mt-2">
                        <summary className="font-mono text-xs text-gray-600 cursor-pointer">
                          Show Data
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-100 font-mono text-xs overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Component Inspector */}
      {settings.advanced.developerMode && (
        <div className="border-2 border-black bg-white p-6">
          <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-4">
            Component Inspector
          </h3>

          <div className="space-y-4">
            <div className="border border-gray-300 p-4">
              <div className="font-mono font-bold mb-2">
                React DevTools Integration
              </div>
              <div className="font-mono text-sm text-gray-600 mb-3">
                Enable React DevTools for component inspection and profiling.
              </div>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    console.log(
                      "React DevTools should be available in browser dev tools"
                    );
                    performanceMonitor.addDebugLog(
                      "info",
                      "React DevTools integration accessed",
                      "ComponentInspector"
                    );
                    refreshDebugLogs();
                  }
                }}
                className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                Open DevTools
              </button>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono font-bold mb-2">
                Performance Profiler
              </div>
              <div className="font-mono text-sm text-gray-600 mb-3">
                Profile component render performance and identify bottlenecks.
              </div>
              <button
                onClick={() => {
                  const profileId =
                    performanceMonitor.startComponentProfile("ManualProfile");
                  setTimeout(() => {
                    const duration =
                      performanceMonitor.endComponentProfile(profileId);
                    performanceMonitor.addDebugLog(
                      "info",
                      `Manual profile completed in ${duration.toFixed(2)}ms`,
                      "ComponentInspector"
                    );
                    refreshDebugLogs();
                  }, 1000);
                }}
                className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                Start Profiling
              </button>
            </div>

            <div className="border border-gray-300 p-4">
              <div className="font-mono font-bold mb-2">Bundle Analyzer</div>
              <div className="font-mono text-sm text-gray-600 mb-3">
                Analyze bundle size and identify optimization opportunities.
              </div>
              <button
                onClick={() => {
                  const memoryInfo = performanceMonitor.getMemoryUsage();
                  const networkInfo = performanceMonitor.getNetworkInfo();
                  const bundleInfo = {
                    memory: memoryInfo,
                    network: networkInfo,
                    userAgent: navigator.userAgent,
                    timing: performance.timing,
                  };
                  performanceMonitor.addDebugLog(
                    "info",
                    "Bundle analysis completed",
                    "ComponentInspector",
                    bundleInfo
                  );
                  refreshDebugLogs();
                }}
                className="px-4 py-2 border-2 border-black bg-white text-black font-mono font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                Analyze Bundle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
