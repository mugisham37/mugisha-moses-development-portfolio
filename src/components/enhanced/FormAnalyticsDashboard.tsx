"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  Eye,
  MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormAnalytics } from "@/utils/formValidation";
import BrutalistButton from "../ui/BrutalistButton";

export interface FormAnalyticsDashboardProps {
  analytics: FormAnalytics[];
  className?: string;
  onExport?: (data: any) => void;
}

interface AnalyticsMetrics {
  totalSubmissions: number;
  completionRate: number;
  averageCompletionTime: number;
  mostCommonErrors: Array<{ field: string; count: number }>;
  stepDropoffRates: Array<{ step: string; dropoffRate: number }>;
  fieldInteractionRates: Array<{ field: string; interactions: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  timeToComplete: Array<{ range: string; count: number }>;
}

const FormAnalyticsDashboard: React.FC<FormAnalyticsDashboardProps> = ({
  analytics,
  className,
  onExport,
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "7d" | "30d" | "90d" | "all"
  >("30d");
  const [selectedFormId, setSelectedFormId] = useState<string>("all");

  // Calculate metrics from analytics data
  useEffect(() => {
    if (!analytics.length) return;

    const filteredAnalytics = filterAnalyticsByTimeRange(
      analytics,
      selectedTimeRange
    );
    const formFilteredAnalytics =
      selectedFormId === "all"
        ? filteredAnalytics
        : filteredAnalytics.filter((a) => a.formId === selectedFormId);

    const calculatedMetrics = calculateMetrics(formFilteredAnalytics);
    setMetrics(calculatedMetrics);
  }, [analytics, selectedTimeRange, selectedFormId]);

  const filterAnalyticsByTimeRange = (data: FormAnalytics[], range: string) => {
    if (range === "all") return data;

    const now = new Date();
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return data.filter((item) => new Date(item.startTime) >= cutoff);
  };

  const calculateMetrics = (data: FormAnalytics[]): AnalyticsMetrics => {
    const totalSubmissions = data.length;
    const completedForms = data.filter((item) => item.completed);
    const completionRate =
      totalSubmissions > 0
        ? (completedForms.length / totalSubmissions) * 100
        : 0;

    // Average completion time
    const completionTimes = completedForms
      .filter((item) => item.completionTime)
      .map((item) => {
        const start = new Date(item.startTime);
        const end = new Date(item.completionTime!);
        return end.getTime() - start.getTime();
      });

    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) /
          completionTimes.length
        : 0;

    // Most common errors
    const errorCounts: Record<string, number> = {};
    data.forEach((item) => {
      Object.entries(item.validationErrors).forEach(([field, count]) => {
        errorCounts[field] = (errorCounts[field] || 0) + count;
      });
    });

    const mostCommonErrors = Object.entries(errorCounts)
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Step dropoff rates
    const stepCounts: Record<string, { started: number; completed: number }> =
      {};
    data.forEach((item) => {
      Object.keys(item.stepTimes).forEach((step) => {
        if (!stepCounts[step]) {
          stepCounts[step] = { started: 0, completed: 0 };
        }
        stepCounts[step].started++;
        if (item.completed) {
          stepCounts[step].completed++;
        }
      });
    });

    const stepDropoffRates = Object.entries(stepCounts)
      .map(([step, counts]) => ({
        step,
        dropoffRate:
          counts.started > 0
            ? ((counts.started - counts.completed) / counts.started) * 100
            : 0,
      }))
      .sort((a, b) => b.dropoffRate - a.dropoffRate);

    // Field interaction rates
    const fieldInteractions: Record<string, number> = {};
    data.forEach((item) => {
      Object.entries(item.fieldInteractions).forEach(([field, count]) => {
        fieldInteractions[field] = (fieldInteractions[field] || 0) + count;
      });
    });

    const fieldInteractionRates = Object.entries(fieldInteractions)
      .map(([field, interactions]) => ({ field, interactions }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 10);

    // Device breakdown (simplified from user agent)
    const deviceCounts: Record<string, number> = {};
    data.forEach((item) => {
      const device = getDeviceFromUserAgent(item.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Time to complete ranges
    const timeRanges = [
      { range: "< 5 min", min: 0, max: 5 * 60 * 1000 },
      { range: "5-15 min", min: 5 * 60 * 1000, max: 15 * 60 * 1000 },
      { range: "15-30 min", min: 15 * 60 * 1000, max: 30 * 60 * 1000 },
      { range: "30+ min", min: 30 * 60 * 1000, max: Infinity },
    ];

    const timeToComplete = timeRanges.map((range) => ({
      range: range.range,
      count: completionTimes.filter(
        (time) => time >= range.min && time < range.max
      ).length,
    }));

    return {
      totalSubmissions,
      completionRate,
      averageCompletionTime,
      mostCommonErrors,
      stepDropoffRates,
      fieldInteractionRates,
      deviceBreakdown,
      timeToComplete,
    };
  };

  const getDeviceFromUserAgent = (userAgent: string): string => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return "Mobile";
    if (/Tablet/.test(userAgent)) return "Tablet";
    return "Desktop";
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleExport = () => {
    if (onExport && metrics) {
      const exportData = {
        metrics,
        rawData: analytics,
        generatedAt: new Date().toISOString(),
        filters: {
          timeRange: selectedTimeRange,
          formId: selectedFormId,
        },
      };
      onExport(exportData);
    }
  };

  const uniqueFormIds = [...new Set(analytics.map((a) => a.formId))];

  if (!metrics) {
    return (
      <div className={cn("w-full max-w-7xl mx-auto p-8", className)}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-mono font-bold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Form Analytics Dashboard
        </h2>
        <p className="text-lg font-mono opacity-80">
          Comprehensive insights into form performance and user behavior
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border-3 border-black p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <span className="font-mono font-bold text-sm">Time Range:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="p-2 border-2 border-black font-mono focus:outline-none focus:bg-brutalist-yellow"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={20} />
            <span className="font-mono font-bold text-sm">Form:</span>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="p-2 border-2 border-black font-mono focus:outline-none focus:bg-brutalist-yellow"
            >
              <option value="all">All Forms</option>
              {uniqueFormIds.map((formId) => (
                <option key={formId} value={formId}>
                  {formId}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <BrutalistButton
              onClick={handleExport}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export Data
            </BrutalistButton>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-blue-600" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider">
              Total Submissions
            </h3>
          </div>
          <div className="text-3xl font-black font-mono mb-2">
            {metrics.totalSubmissions.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider">
              Completion Rate
            </h3>
          </div>
          <div className="text-3xl font-black font-mono mb-2">
            {metrics.completionRate.toFixed(1)}%
          </div>
        </motion.div>

        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-orange-600" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider">
              Avg. Completion Time
            </h3>
          </div>
          <div className="text-3xl font-black font-mono mb-2">
            {formatTime(metrics.averageCompletionTime)}
          </div>
        </motion.div>

        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={24} className="text-red-600" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wider">
              Top Error Field
            </h3>
          </div>
          <div className="text-lg font-black font-mono mb-2">
            {metrics.mostCommonErrors[0]?.field || "None"}
          </div>
          <div className="text-sm font-mono opacity-80">
            {metrics.mostCommonErrors[0]?.count || 0} errors
          </div>
        </motion.div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Common Errors */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle size={24} className="text-red-600" />
            <h3 className="text-xl font-black uppercase tracking-wider font-mono">
              Most Common Errors
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.mostCommonErrors.slice(0, 5).map((error, index) => (
              <div
                key={error.field}
                className="flex items-center justify-between"
              >
                <span className="font-mono font-bold text-sm">
                  {error.field}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 border-2 border-black h-4">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${
                          (error.count / metrics.mostCommonErrors[0].count) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-sm w-8 text-right">
                    {error.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Dropoff Rates */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={24} className="text-orange-600" />
            <h3 className="text-xl font-black uppercase tracking-wider font-mono">
              Step Dropoff Rates
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.stepDropoffRates.slice(0, 5).map((step, index) => (
              <div
                key={step.step}
                className="flex items-center justify-between"
              >
                <span className="font-mono font-bold text-sm">{step.step}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 border-2 border-black h-4">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${step.dropoffRate}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-sm w-12 text-right">
                    {step.dropoffRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Field Interactions and Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Field Interactions */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MousePointer size={24} className="text-blue-600" />
            <h3 className="text-xl font-black uppercase tracking-wider font-mono">
              Field Interactions
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.fieldInteractionRates.slice(0, 5).map((field, index) => (
              <div
                key={field.field}
                className="flex items-center justify-between"
              >
                <span className="font-mono font-bold text-sm">
                  {field.field}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 border-2 border-black h-4">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${
                          (field.interactions /
                            metrics.fieldInteractionRates[0].interactions) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-sm w-8 text-right">
                    {field.interactions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={24} className="text-green-600" />
            <h3 className="text-xl font-black uppercase tracking-wider font-mono">
              Device Breakdown
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.deviceBreakdown.map((device, index) => (
              <div
                key={device.device}
                className="flex items-center justify-between"
              >
                <span className="font-mono font-bold text-sm">
                  {device.device}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 border-2 border-black h-4">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (device.count / metrics.totalSubmissions) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-mono font-bold text-sm w-8 text-right">
                    {device.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Time to Complete Distribution */}
      <motion.div
        className="bg-white border-3 border-black p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock size={24} className="text-purple-600" />
          <h3 className="text-xl font-black uppercase tracking-wider font-mono">
            Time to Complete Distribution
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.timeToComplete.map((timeRange, index) => (
            <div key={timeRange.range} className="text-center">
              <div className="bg-gray-200 border-2 border-black h-24 flex items-end justify-center mb-2">
                <div
                  className="bg-purple-500 w-full"
                  style={{
                    height: `${
                      (timeRange.count /
                        Math.max(
                          ...metrics.timeToComplete.map((t) => t.count)
                        )) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="font-mono font-bold text-sm">
                {timeRange.range}
              </div>
              <div className="font-mono text-sm opacity-80">
                {timeRange.count} users
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FormAnalyticsDashboard;
