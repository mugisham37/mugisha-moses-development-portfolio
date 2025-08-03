"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Layers,
  Filter,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

// Import our new components
import InteractiveChart, { ChartSeries } from "./InteractiveChart";
import ProgressIndicators, { ProgressStep } from "./ProgressIndicators";
import DataDrillDown, { DataPoint, FilterOption } from "./DataDrillDown";
import VisualizationExporter from "./VisualizationExporter";
import BrutalistButton from "../ui/BrutalistButton";

export interface DashboardWidget {
  id: string;
  title: string;
  type: "chart" | "progress" | "drilldown" | "metric" | "timeline";
  data: any;
  config?: any;
  position: { x: number; y: number; width: number; height: number };
  visible: boolean;
}

export interface DataVisualizationDashboardProps {
  widgets: DashboardWidget[];
  title?: string;
  subtitle?: string;
  className?: string;
  enableCustomization?: boolean;
  enableExport?: boolean;
  enableFullscreen?: boolean;
  onWidgetUpdate?: (
    widgetId: string,
    updates: Partial<DashboardWidget>
  ) => void;
  onDataRefresh?: () => Promise<void>;
}

const DataVisualizationDashboard: React.FC<DataVisualizationDashboardProps> = ({
  widgets,
  title = "Data Visualization Dashboard",
  subtitle,
  className,
  enableCustomization = true,
  enableExport = true,
  enableFullscreen = true,
  onWidgetUpdate,
  onDataRefresh,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());

  const dashboardRef = useRef<HTMLDivElement>(null);

  // Sample data for demonstration
  const sampleChartData: ChartSeries[] = [
    {
      name: "Projects Completed",
      data: [
        { label: "Q1 2023", value: 12 },
        { label: "Q2 2023", value: 18 },
        { label: "Q3 2023", value: 15 },
        { label: "Q4 2023", value: 22 },
        { label: "Q1 2024", value: 28 },
      ],
      color: "#3B82F6",
    },
    {
      name: "Client Satisfaction",
      data: [
        { label: "Q1 2023", value: 85 },
        { label: "Q2 2023", value: 92 },
        { label: "Q3 2023", value: 88 },
        { label: "Q4 2023", value: 95 },
        { label: "Q1 2024", value: 97 },
      ],
      color: "#10B981",
    },
  ];

  const sampleProgressSteps: ProgressStep[] = [
    {
      id: "planning",
      label: "Project Planning",
      description: "Initial project setup and requirements gathering",
      status: "completed",
      progress: 100,
      metadata: { duration: "2 weeks", team: "3 members" },
    },
    {
      id: "development",
      label: "Development Phase",
      description: "Core feature implementation and testing",
      status: "in-progress",
      progress: 75,
      metadata: { duration: "6 weeks", team: "5 members" },
    },
    {
      id: "testing",
      label: "Quality Assurance",
      description: "Comprehensive testing and bug fixes",
      status: "pending",
      progress: 0,
      metadata: { duration: "2 weeks", team: "2 members" },
    },
    {
      id: "deployment",
      label: "Deployment",
      description: "Production deployment and monitoring",
      status: "pending",
      progress: 0,
      metadata: { duration: "1 week", team: "2 members" },
    },
  ];

  const sampleDrillDownData: DataPoint[] = [
    {
      id: "frontend",
      label: "Frontend Technologies",
      value: 45,
      category: "technology",
      children: [
        {
          id: "react",
          label: "React",
          value: 25,
          category: "framework",
          metadata: { projects: 15, experience: "5 years" },
        },
        {
          id: "vue",
          label: "Vue.js",
          value: 12,
          category: "framework",
          metadata: { projects: 8, experience: "3 years" },
        },
        {
          id: "angular",
          label: "Angular",
          value: 8,
          category: "framework",
          metadata: { projects: 5, experience: "2 years" },
        },
      ],
    },
    {
      id: "backend",
      label: "Backend Technologies",
      value: 35,
      category: "technology",
      children: [
        {
          id: "nodejs",
          label: "Node.js",
          value: 20,
          category: "runtime",
          metadata: { projects: 12, experience: "4 years" },
        },
        {
          id: "python",
          label: "Python",
          value: 10,
          category: "language",
          metadata: { projects: 6, experience: "3 years" },
        },
        {
          id: "java",
          label: "Java",
          value: 5,
          category: "language",
          metadata: { projects: 3, experience: "2 years" },
        },
      ],
    },
  ];

  const sampleFilters: FilterOption[] = [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "technology", label: "Technology" },
        { value: "framework", label: "Framework" },
        { value: "language", label: "Language" },
      ],
    },
    {
      id: "experience",
      label: "Experience Range",
      type: "range",
      min: 0,
      max: 10,
    },
  ];

  // Default widgets if none provided
  const defaultWidgets: DashboardWidget[] = [
    {
      id: "performance-chart",
      title: "Performance Metrics",
      type: "chart",
      data: sampleChartData,
      config: { type: "line", animated: true, showLegend: true },
      position: { x: 0, y: 0, width: 6, height: 4 },
      visible: true,
    },
    {
      id: "project-progress",
      title: "Project Progress",
      type: "progress",
      data: sampleProgressSteps,
      config: { type: "timeline", showMetadata: true },
      position: { x: 6, y: 0, width: 6, height: 4 },
      visible: true,
    },
    {
      id: "technology-breakdown",
      title: "Technology Breakdown",
      type: "drilldown",
      data: sampleDrillDownData,
      config: { filters: sampleFilters, enableGrouping: true },
      position: { x: 0, y: 4, width: 12, height: 6 },
      visible: true,
    },
  ];

  const displayWidgets = widgets.length > 0 ? widgets : defaultWidgets;
  const visibleWidgets = displayWidgets.filter(
    (widget) => !hiddenWidgets.has(widget.id)
  );

  // Handle widget visibility toggle
  const toggleWidgetVisibility = (widgetId: string) => {
    setHiddenWidgets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onDataRefresh) {
        await onDataRefresh();
      } else {
        // Simulate refresh delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen && dashboardRef.current) {
      dashboardRef.current.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Render individual widget
  const renderWidget = (widget: DashboardWidget) => {
    const isSelected = selectedWidget === widget.id;

    return (
      <motion.div
        key={widget.id}
        className={cn(
          "bg-white border-3 border-black relative",
          isSelected && "ring-4 ring-brutalist-yellow ring-opacity-50"
        )}
        style={{
          gridColumn: `span ${widget.position.width}`,
          gridRow: `span ${widget.position.height}`,
        }}
        onClick={() => setSelectedWidget(widget.id)}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b-3 border-black bg-brutalist-light-gray">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider">
            {widget.title}
          </h3>
          <div className="flex items-center space-x-2">
            {enableExport && (
              <VisualizationExporter
                data={widget.data}
                visualizationRef={dashboardRef}
                title={widget.title}
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWidgetVisibility(widget.id);
              }}
              className="p-1 hover:bg-white rounded"
              title="Hide widget"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Widget Content */}
        <div className="p-4">
          {widget.type === "chart" && (
            <InteractiveChart
              type={widget.config?.type || "bar"}
              data={widget.data}
              animated={widget.config?.animated}
              showLegend={widget.config?.showLegend}
              exportable={enableExport}
              filterable={widget.config?.filterable}
            />
          )}

          {widget.type === "progress" && (
            <ProgressIndicators
              steps={widget.data}
              type={widget.config?.type || "linear"}
              showMetadata={widget.config?.showMetadata}
              animated={widget.config?.animated}
              interactive={widget.config?.interactive}
            />
          )}

          {widget.type === "drilldown" && (
            <DataDrillDown
              data={widget.data}
              filters={widget.config?.filters}
              enableGrouping={widget.config?.enableGrouping}
              enableExport={enableExport}
              maxDepth={widget.config?.maxDepth}
            />
          )}

          {widget.type === "metric" && (
            <div className="text-center">
              <div className="text-4xl font-mono font-black mb-2">
                {widget.data.value}
              </div>
              <div className="font-mono text-sm text-gray-600 uppercase tracking-wider">
                {widget.data.label}
              </div>
              {widget.data.change && (
                <div
                  className={cn(
                    "flex items-center justify-center mt-2 text-sm font-mono",
                    widget.data.change > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {widget.data.change > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                  )}
                  {Math.abs(widget.data.change)}%
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={dashboardRef}
      className={cn(
        "min-h-screen bg-brutalist-light-gray",
        isFullscreen && "fixed inset-0 z-50",
        className
      )}
    >
      {/* Dashboard Header */}
      <div className="bg-white border-b-5 border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-mono uppercase tracking-wider mb-2">
              {title}
            </h1>
            {subtitle && <p className="font-mono text-gray-600">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-3">
            {/* Widget Visibility Controls */}
            {enableCustomization && (
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sm">Widgets:</span>
                {displayWidgets.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={cn(
                      "px-2 py-1 text-xs font-mono border-2 border-black",
                      hiddenWidgets.has(widget.id)
                        ? "bg-gray-200 text-gray-600"
                        : "bg-white hover:bg-brutalist-yellow"
                    )}
                    title={`${hiddenWidgets.has(widget.id) ? "Show" : "Hide"} ${
                      widget.title
                    }`}
                  >
                    {hiddenWidgets.has(widget.id) ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <BrutalistButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="secondary"
              size="sm"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
              </motion.div>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </BrutalistButton>

            {/* Customization Toggle */}
            {enableCustomization && (
              <BrutalistButton
                onClick={() => setIsCustomizing(!isCustomizing)}
                variant={isCustomizing ? "primary" : "secondary"}
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </BrutalistButton>
            )}

            {/* Fullscreen Toggle */}
            {enableFullscreen && (
              <BrutalistButton
                onClick={toggleFullscreen}
                variant="secondary"
                size="sm"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </BrutalistButton>
            )}

            {/* Export Dashboard */}
            {enableExport && (
              <VisualizationExporter
                data={visibleWidgets}
                visualizationRef={dashboardRef}
                title={title}
                subtitle={subtitle}
              />
            )}
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-black">
              {visibleWidgets.length}
            </div>
            <div className="text-sm font-mono text-gray-600 uppercase tracking-wider">
              Active Widgets
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-black">
              {displayWidgets.length}
            </div>
            <div className="text-sm font-mono text-gray-600 uppercase tracking-wider">
              Total Widgets
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-black">
              {selectedWidget ? "1" : "0"}
            </div>
            <div className="text-sm font-mono text-gray-600 uppercase tracking-wider">
              Selected
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-black">
              {isRefreshing ? "..." : "Live"}
            </div>
            <div className="text-sm font-mono text-gray-600 uppercase tracking-wider">
              Data Status
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6 auto-rows-fr">
          <AnimatePresence>
            {visibleWidgets.map((widget) => renderWidget(widget))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {visibleWidgets.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-mono font-bold mb-2">
              No Widgets Visible
            </h3>
            <p className="font-mono text-gray-600 mb-6">
              All widgets are currently hidden. Use the widget controls above to
              show them.
            </p>
            <BrutalistButton
              onClick={() => setHiddenWidgets(new Set())}
              variant="primary"
              size="md"
            >
              Show All Widgets
            </BrutalistButton>
          </motion.div>
        )}
      </div>

      {/* Customization Panel */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l-5 border-black z-40 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono font-bold text-lg uppercase tracking-wider">
                  Customize Dashboard
                </h3>
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                    Widget Visibility
                  </h4>
                  <div className="space-y-2">
                    {displayWidgets.map((widget) => (
                      <label
                        key={widget.id}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!hiddenWidgets.has(widget.id)}
                          onChange={() => toggleWidgetVisibility(widget.id)}
                          className="w-4 h-4"
                        />
                        <span className="font-mono text-sm">
                          {widget.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                    Dashboard Settings
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableExport}
                        onChange={() => {
                          /* Handle setting change */
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-sm">Enable Export</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableFullscreen}
                        onChange={() => {
                          /* Handle setting change */
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-sm">
                        Enable Fullscreen
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataVisualizationDashboard;
