"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Maximize2,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "../ui/BrutalistButton";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  visible?: boolean;
}

export interface InteractiveChartProps {
  type: "bar" | "line" | "pie" | "area" | "scatter";
  data: ChartSeries[];
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  animated?: boolean;
  interactive?: boolean;
  exportable?: boolean;
  filterable?: boolean;
  colors?: string[];
  onDataPointClick?: (point: ChartDataPoint, series: ChartSeries) => void;
  onSeriesToggle?: (series: ChartSeries, visible: boolean) => void;
  onExport?: (format: "png" | "svg" | "json") => void;
}

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
];

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  type,
  data,
  title,
  subtitle,
  width = 600,
  height = 400,
  className,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  showAxes = true,
  animated = true,
  interactive = true,
  exportable = false,
  filterable = false,
  colors = DEFAULT_COLORS,
  onDataPointClick,
  onSeriesToggle,
  onExport,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ChartDataPoint;
    series: ChartSeries;
    x: number;
    y: number;
  } | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
    new Set(data.map((series) => series.name))
  );
  const [filterValue, setFilterValue] = useState("");

  // Filter and process data
  const processedData = useMemo(() => {
    return data
      .filter((series) => visibleSeries.has(series.name))
      .map((series) => ({
        ...series,
        data: series.data.filter(
          (point) =>
            !filterValue ||
            point.label.toLowerCase().includes(filterValue.toLowerCase())
        ),
      }))
      .filter((series) => series.data.length > 0);
  }, [data, visibleSeries, filterValue]);

  // Calculate chart dimensions and scales
  const chartDimensions = useMemo(() => {
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Get all values for scaling
    const allValues = processedData.flatMap((series) =>
      series.data.map((d) => d.value)
    );
    const maxValue = Math.max(...allValues, 0);
    const minValue = Math.min(...allValues, 0);

    // Get all labels
    const allLabels = [
      ...new Set(
        processedData.flatMap((series) => series.data.map((d) => d.label))
      ),
    ];

    return {
      margin,
      chartWidth,
      chartHeight,
      maxValue,
      minValue,
      allLabels,
      xScale: (index: number) =>
        (index / Math.max(allLabels.length - 1, 1)) * chartWidth,
      yScale: (value: number) =>
        chartHeight -
        ((value - minValue) / (maxValue - minValue)) * chartHeight,
    };
  }, [processedData, width, height]);

  // Handle series visibility toggle
  const toggleSeries = (seriesName: string) => {
    const newVisibleSeries = new Set(visibleSeries);
    if (newVisibleSeries.has(seriesName)) {
      newVisibleSeries.delete(seriesName);
    } else {
      newVisibleSeries.add(seriesName);
    }
    setVisibleSeries(newVisibleSeries);

    const series = data.find((s) => s.name === seriesName);
    if (series && onSeriesToggle) {
      onSeriesToggle(series, newVisibleSeries.has(seriesName));
    }
  };

  // Handle data point interaction
  const handlePointInteraction = (
    point: ChartDataPoint,
    series: ChartSeries,
    event: React.MouseEvent
  ) => {
    if (!interactive) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setHoveredPoint({
        point,
        series,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }

    if (onDataPointClick) {
      onDataPointClick(point, series);
    }
  };

  // Export functionality
  const handleExport = (format: "png" | "svg" | "json") => {
    if (!exportable || !onExport) return;

    if (format === "json") {
      const exportData = {
        type,
        data: processedData,
        title,
        subtitle,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chart-data-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "svg" && svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chart-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }

    onExport(format);
  };

  // Render different chart types
  const renderChart = () => {
    const { margin, chartWidth, chartHeight, allLabels, xScale, yScale } =
      chartDimensions;

    switch (type) {
      case "bar":
        return renderBarChart();
      case "line":
        return renderLineChart();
      case "pie":
        return renderPieChart();
      case "area":
        return renderAreaChart();
      case "scatter":
        return renderScatterChart();
      default:
        return null;
    }
  };

  const renderBarChart = () => {
    const { margin, chartWidth, chartHeight, allLabels, yScale } =
      chartDimensions;
    const barWidth = (chartWidth / allLabels.length) * 0.8;
    const barSpacing = (chartWidth / allLabels.length) * 0.2;

    return (
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="currentColor"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Bars */}
        {processedData.map((series, seriesIndex) => (
          <g key={series.name}>
            {series.data.map((point, pointIndex) => {
              const labelIndex = allLabels.indexOf(point.label);
              const x =
                (labelIndex / allLabels.length) * chartWidth + barSpacing / 2;
              const y = yScale(point.value);
              const barHeight = chartHeight - y;
              const color =
                point.color ||
                series.color ||
                colors[seriesIndex % colors.length];

              return (
                <motion.rect
                  key={`${series.name}-${point.label}`}
                  x={x}
                  y={animated ? chartHeight : y}
                  width={barWidth / processedData.length}
                  height={animated ? 0 : barHeight}
                  fill={color}
                  className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={(e) => handlePointInteraction(point, series, e)}
                  onMouseEnter={(e) =>
                    showTooltip && handlePointInteraction(point, series, e)
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                  animate={animated ? { y, height: barHeight } : {}}
                  transition={{ duration: 0.8, delay: pointIndex * 0.1 }}
                />
              );
            })}
          </g>
        ))}

        {/* Axes */}
        {showAxes && (
          <>
            {/* X-axis */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
            {/* Y-axis */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />

            {/* X-axis labels */}
            {allLabels.map((label, index) => (
              <text
                key={label}
                x={(index / allLabels.length) * chartWidth + barWidth / 2}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs font-mono fill-current"
              >
                {label}
              </text>
            ))}
          </>
        )}
      </g>
    );
  };

  const renderLineChart = () => {
    const { margin, chartWidth, chartHeight, allLabels, xScale, yScale } =
      chartDimensions;

    return (
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="currentColor"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Lines */}
        {processedData.map((series, seriesIndex) => {
          const color = series.color || colors[seriesIndex % colors.length];
          const pathData = series.data
            .map((point, index) => {
              const labelIndex = allLabels.indexOf(point.label);
              const x = xScale(labelIndex);
              const y = yScale(point.value);
              return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

          return (
            <g key={series.name}>
              <motion.path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={3}
                className="drop-shadow-sm"
                initial={animated ? { pathLength: 0 } : {}}
                animate={animated ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Data points */}
              {series.data.map((point, pointIndex) => {
                const labelIndex = allLabels.indexOf(point.label);
                const x = xScale(labelIndex);
                const y = yScale(point.value);

                return (
                  <motion.circle
                    key={`${series.name}-${point.label}`}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    className="cursor-pointer hover:r-6 transition-all duration-200"
                    onClick={(e) => handlePointInteraction(point, series, e)}
                    onMouseEnter={(e) =>
                      showTooltip && handlePointInteraction(point, series, e)
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    initial={animated ? { scale: 0 } : {}}
                    animate={animated ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: pointIndex * 0.1 }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Axes */}
        {showAxes && (
          <>
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />

            {allLabels.map((label, index) => (
              <text
                key={label}
                x={xScale(index)}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs font-mono fill-current"
              >
                {label}
              </text>
            ))}
          </>
        )}
      </g>
    );
  };

  const renderPieChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Calculate total value
    const totalValue = processedData.reduce(
      (sum, series) =>
        sum +
        series.data.reduce((seriesSum, point) => seriesSum + point.value, 0),
      0
    );

    let currentAngle = -Math.PI / 2; // Start at top

    return (
      <g>
        {processedData.map((series, seriesIndex) =>
          series.data.map((point, pointIndex) => {
            const sliceAngle = (point.value / totalValue) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            const color =
              point.color ||
              series.color ||
              colors[(seriesIndex + pointIndex) % colors.length];

            currentAngle += sliceAngle;

            return (
              <motion.path
                key={`${series.name}-${point.label}`}
                d={pathData}
                fill={color}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                onClick={(e) => handlePointInteraction(point, series, e)}
                onMouseEnter={(e) =>
                  showTooltip && handlePointInteraction(point, series, e)
                }
                onMouseLeave={() => setHoveredPoint(null)}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: 1 } : {}}
                transition={{ duration: 0.8, delay: pointIndex * 0.1 }}
                style={{ transformOrigin: `${centerX}px ${centerY}px` }}
              />
            );
          })
        )}
      </g>
    );
  };

  const renderAreaChart = () => {
    const { margin, chartWidth, chartHeight, allLabels, xScale, yScale } =
      chartDimensions;

    return (
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={0}
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="currentColor"
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Areas */}
        {processedData.map((series, seriesIndex) => {
          const color = series.color || colors[seriesIndex % colors.length];

          const pathData =
            series.data
              .map((point, index) => {
                const labelIndex = allLabels.indexOf(point.label);
                const x = xScale(labelIndex);
                const y = yScale(point.value);
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ") +
            ` L ${xScale(series.data.length - 1)} ${chartHeight} L ${xScale(
              0
            )} ${chartHeight} Z`;

          return (
            <motion.path
              key={series.name}
              d={pathData}
              fill={color}
              fillOpacity={0.3}
              stroke={color}
              strokeWidth={2}
              initial={animated ? { pathLength: 0, fillOpacity: 0 } : {}}
              animate={animated ? { pathLength: 1, fillOpacity: 0.3 } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          );
        })}

        {/* Axes */}
        {showAxes && (
          <>
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
          </>
        )}
      </g>
    );
  };

  const renderScatterChart = () => {
    const { margin, chartWidth, chartHeight, allLabels, xScale, yScale } =
      chartDimensions;

    return (
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <>
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={chartHeight * ratio}
                  x2={chartWidth}
                  y2={chartHeight * ratio}
                  stroke="currentColor"
                  strokeWidth={1}
                />
                <line
                  key={`v-${i}`}
                  x1={chartWidth * ratio}
                  y1={0}
                  x2={chartWidth * ratio}
                  y2={chartHeight}
                  stroke="currentColor"
                  strokeWidth={1}
                />
              </>
            ))}
          </g>
        )}

        {/* Scatter points */}
        {processedData.map((series, seriesIndex) => {
          const color = series.color || colors[seriesIndex % colors.length];

          return series.data.map((point, pointIndex) => {
            const labelIndex = allLabels.indexOf(point.label);
            const x = xScale(labelIndex);
            const y = yScale(point.value);
            const size = point.metadata?.size || 6;

            return (
              <motion.circle
                key={`${series.name}-${point.label}`}
                cx={x}
                cy={y}
                r={size}
                fill={color}
                className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                onClick={(e) => handlePointInteraction(point, series, e)}
                onMouseEnter={(e) =>
                  showTooltip && handlePointInteraction(point, series, e)
                }
                onMouseLeave={() => setHoveredPoint(null)}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: pointIndex * 0.05 }}
              />
            );
          });
        })}

        {/* Axes */}
        {showAxes && (
          <>
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth={2}
            />
          </>
        )}
      </g>
    );
  };

  return (
    <div className={cn("relative bg-white border-3 border-black", className)}>
      {/* Header */}
      {(title || subtitle || exportable || filterable) && (
        <div className="border-b-3 border-black p-4">
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-mono opacity-80 text-sm">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {filterable && (
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="px-2 py-1 border-2 border-black text-sm font-mono focus:outline-none focus:bg-brutalist-yellow"
                  />
                </div>
              )}

              {exportable && (
                <div className="flex items-center gap-1">
                  <BrutalistButton
                    onClick={() => handleExport("svg")}
                    size="sm"
                    variant="secondary"
                    ariaLabel="Export as SVG"
                  >
                    <Download size={14} />
                  </BrutalistButton>
                  <BrutalistButton
                    onClick={() => handleExport("json")}
                    size="sm"
                    variant="secondary"
                    ariaLabel="Export as JSON"
                  >
                    <Download size={14} />
                  </BrutalistButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          style={{ maxWidth: "100%", height: "auto" }}
        >
          {renderChart()}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && hoveredPoint && (
            <motion.div
              className="absolute bg-black text-white p-3 rounded shadow-lg pointer-events-none z-10 font-mono text-sm"
              style={{
                left: hoveredPoint.x + 10,
                top: hoveredPoint.y - 10,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-bold">{hoveredPoint.series.name}</div>
              <div>
                {hoveredPoint.point.label}: {hoveredPoint.point.value}
              </div>
              {hoveredPoint.point.metadata && (
                <div className="text-xs opacity-80 mt-1">
                  {Object.entries(hoveredPoint.point.metadata).map(
                    ([key, value]) => (
                      <div key={key}>
                        {key}: {String(value)}
                      </div>
                    )
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      {showLegend && data.length > 1 && (
        <div className="border-t-3 border-black p-4">
          <div className="flex flex-wrap items-center gap-4">
            {data.map((series, index) => {
              const color = series.color || colors[index % colors.length];
              const isVisible = visibleSeries.has(series.name);

              return (
                <button
                  key={series.name}
                  onClick={() => toggleSeries(series.name)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 border-2 border-black font-mono text-sm transition-all duration-200",
                    isVisible ? "bg-white" : "bg-gray-200 opacity-60"
                  )}
                >
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  <div
                    className="w-3 h-3 border border-black"
                    style={{ backgroundColor: color }}
                  />
                  <span>{series.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveChart;
