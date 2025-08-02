"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
} from "lucide-react";
import BrutalistButton from "../ui/BrutalistButton";

export interface DataPoint {
  id: string;
  label: string;
  value: number;
  category: string;
  subcategory?: string;
  metadata?: Record<string, any>;
  children?: DataPoint[];
  color?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  type: "select" | "range" | "checkbox" | "search";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  value?: any;
}

export interface DataDrillDownProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  filters?: FilterOption[];
  enableSearch?: boolean;
  enableSorting?: boolean;
  enableGrouping?: boolean;
  enableExport?: boolean;
  maxDepth?: number;
  className?: string;
  onDataPointClick?: (point: DataPoint, path: DataPoint[]) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onExport?: (data: DataPoint[], format: string) => void;
}

const DataDrillDown: React.FC<DataDrillDownProps> = ({
  data,
  title,
  subtitle,
  filters = [],
  enableSearch = true,
  enableSorting = true,
  enableGrouping = true,
  enableExport = false,
  maxDepth = 3,
  className,
  onDataPointClick,
  onFilterChange,
  onExport,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedPath, setSelectedPath] = useState<DataPoint[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"label" | "value" | "category">("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "table" | "cards">("tree");

  // Process and filter data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      const filterBySearch = (items: DataPoint[]): DataPoint[] => {
        return items
          .filter((item) => {
            const matchesSearch =
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.subcategory &&
                item.subcategory
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()));

            const hasMatchingChildren =
              item.children && filterBySearch(item.children).length > 0;

            return matchesSearch || hasMatchingChildren;
          })
          .map((item) => ({
            ...item,
            children: item.children ? filterBySearch(item.children) : undefined,
          }));
      };
      filtered = filterBySearch(filtered);
    }

    // Apply custom filters
    Object.entries(currentFilters).forEach(([filterId, value]) => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter || !value) return;

      const applyFilter = (items: DataPoint[]): DataPoint[] => {
        return items
          .filter((item) => {
            switch (filter.type) {
              case "select":
                return item.category === value || item.subcategory === value;
              case "range":
                return item.value >= value.min && item.value <= value.max;
              case "checkbox":
                return value.includes(item.category);
              case "search":
                return item.label.toLowerCase().includes(value.toLowerCase());
              default:
                return true;
            }
          })
          .map((item) => ({
            ...item,
            children: item.children ? applyFilter(item.children) : undefined,
          }));
      };
      filtered = applyFilter(filtered);
    });

    // Apply sorting
    const sortItems = (items: DataPoint[]): DataPoint[] => {
      return items
        .sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case "label":
              comparison = a.label.localeCompare(b.label);
              break;
            case "value":
              comparison = a.value - b.value;
              break;
            case "category":
              comparison = a.category.localeCompare(b.category);
              break;
          }
          return sortOrder === "asc" ? comparison : -comparison;
        })
        .map((item) => ({
          ...item,
          children: item.children ? sortItems(item.children) : undefined,
        }));
    };

    return sortItems(filtered);
  }, [data, searchQuery, currentFilters, sortBy, sortOrder, filters]);

  // Group data if grouping is enabled
  const groupedData = useMemo(() => {
    if (!groupBy || !enableGrouping) return processedData;

    const groups: Record<string, DataPoint[]> = {};
    processedData.forEach((item) => {
      const groupKey = item.metadata?.[groupBy] || item.category;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });

    return Object.entries(groups).map(([groupName, items]) => ({
      id: `group-${groupName}`,
      label: groupName,
      value: items.reduce((sum, item) => sum + item.value, 0),
      category: "group",
      children: items,
      metadata: { isGroup: true },
    }));
  }, [processedData, groupBy, enableGrouping]);

  const finalData = groupBy ? groupedData : processedData;

  // Handle item expansion
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Handle item selection and drill-down
  const handleItemClick = useCallback(
    (item: DataPoint, path: DataPoint[] = []) => {
      const newPath = [...path, item];
      setSelectedPath(newPath);
      onDataPointClick?.(item, newPath);
    },
    [onDataPointClick]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterId: string, value: any) => {
      const newFilters = { ...currentFilters, [filterId]: value };
      setCurrentFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [currentFilters, onFilterChange]
  );

  // Handle export
  const handleExport = useCallback(
    (format: string) => {
      if (onExport) {
        onExport(finalData, format);
      } else {
        // Default export implementation
        const exportData = JSON.stringify(finalData, null, 2);
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `data-export-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    },
    [finalData, onExport]
  );

  // Render filter controls
  const renderFilters = () => (
    <div className="space-y-4">
      {/* Search */}
      {enableSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search data points..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-black" />
            </button>
          )}
        </div>
      )}

      {/* Custom Filters */}
      {filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-2">
              <label className="block font-mono font-bold text-sm uppercase tracking-wider">
                {filter.label}
              </label>
              {filter.type === "select" && (
                <select
                  value={currentFilters[filter.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.id, e.target.value)
                  }
                  className="w-full px-3 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                >
                  <option value="">All</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === "range" && (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min={filter.min}
                    max={filter.max}
                    value={currentFilters[filter.id]?.min || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.id, {
                        ...currentFilters[filter.id],
                        min: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-2 py-1 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min={filter.min}
                    max={filter.max}
                    value={currentFilters[filter.id]?.max || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.id, {
                        ...currentFilters[filter.id],
                        max: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-2 py-1 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sorting and Grouping Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {enableSorting && (
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
            >
              <option value="value">Value</option>
              <option value="label">Label</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1 border-2 border-black hover:bg-brutalist-yellow"
            >
              {sortOrder === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {enableGrouping && (
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm">Group by:</span>
            <select
              value={groupBy || ""}
              onChange={(e) => setGroupBy(e.target.value || null)}
              className="px-2 py-1 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
            >
              <option value="">None</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
            </select>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-sm">View:</span>
          <div className="flex border-2 border-black">
            {["tree", "table", "cards"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={cn(
                  "px-3 py-1 font-mono text-sm capitalize",
                  viewMode === mode
                    ? "bg-brutalist-yellow"
                    : "bg-white hover:bg-gray-100"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {enableExport && (
          <BrutalistButton
            onClick={() => handleExport("json")}
            size="sm"
            variant="secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </BrutalistButton>
        )}
      </div>
    </div>
  );

  // Render tree view
  const renderTreeItem = (
    item: DataPoint,
    depth = 0,
    path: DataPoint[] = []
  ) => {
    if (depth >= maxDepth) return null;

    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const currentPath = [...path, item];

    return (
      <motion.div
        key={item.id}
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={cn(
            "flex items-center space-x-2 p-3 border-2 border-black bg-white cursor-pointer hover:bg-brutalist-yellow transition-colors duration-200",
            selectedPath.some((p) => p.id === item.id) && "bg-brutalist-yellow"
          )}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => handleItemClick(item, path)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="p-1 hover:bg-white rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          <div className="flex-1 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-sm">{item.label}</div>
              <div className="font-mono text-xs text-gray-600">
                {item.category}
                {item.subcategory && ` • ${item.subcategory}`}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-lg">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
              </div>
              {item.metadata && (
                <div className="text-xs font-mono text-gray-500">
                  {Object.entries(item.metadata)
                    .slice(0, 2)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(" • ")}
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {item.children!.map((child) =>
                renderTreeItem(child, depth + 1, currentPath)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Render table view
  const renderTableView = () => {
    const flattenData = (
      items: DataPoint[],
      depth = 0
    ): (DataPoint & { depth: number })[] => {
      return items.reduce((acc, item) => {
        acc.push({ ...item, depth });
        if (item.children && expandedItems.has(item.id)) {
          acc.push(...flattenData(item.children, depth + 1));
        }
        return acc;
      }, [] as (DataPoint & { depth: number })[]);
    };

    const flatData = flattenData(finalData);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-3 border-black">
          <thead>
            <tr className="bg-brutalist-yellow">
              <th className="px-4 py-3 text-left font-mono font-bold text-sm uppercase tracking-wider border-r-2 border-black">
                Item
              </th>
              <th className="px-4 py-3 text-left font-mono font-bold text-sm uppercase tracking-wider border-r-2 border-black">
                Category
              </th>
              <th className="px-4 py-3 text-right font-mono font-bold text-sm uppercase tracking-wider border-r-2 border-black">
                Value
              </th>
              <th className="px-4 py-3 text-left font-mono font-bold text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {flatData.map((item, index) => (
              <motion.tr
                key={item.id}
                className={cn(
                  "border-t-2 border-black hover:bg-brutalist-light-gray cursor-pointer",
                  selectedPath.some((p) => p.id === item.id) &&
                    "bg-brutalist-yellow"
                )}
                onClick={() => handleItemClick(item)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-4 py-3 border-r-2 border-black">
                  <div
                    className="flex items-center space-x-2"
                    style={{ paddingLeft: `${item.depth * 20}px` }}
                  >
                    {item.children && item.children.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(item.id);
                        }}
                        className="p-1 hover:bg-white rounded"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <span className="font-mono font-bold text-sm">
                      {item.label}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 border-r-2 border-black font-mono text-sm">
                  {item.category}
                  {item.subcategory && (
                    <span className="text-gray-600"> • {item.subcategory}</span>
                  )}
                </td>
                <td className="px-4 py-3 border-r-2 border-black font-mono font-bold text-sm text-right">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      className="p-1 hover:bg-brutalist-yellow rounded"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render cards view
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {finalData.map((item, index) => (
        <motion.div
          key={item.id}
          className={cn(
            "p-4 border-3 border-black bg-white cursor-pointer hover:bg-brutalist-yellow transition-colors duration-200",
            selectedPath.some((p) => p.id === item.id) && "bg-brutalist-yellow"
          )}
          onClick={() => handleItemClick(item)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono font-bold text-sm uppercase tracking-wider">
              {item.category}
            </div>
            {item.children && item.children.length > 0 && (
              <div className="text-xs font-mono text-gray-600">
                {item.children.length} items
              </div>
            )}
          </div>

          <div className="mb-3">
            <h3 className="font-mono font-bold text-lg mb-1">{item.label}</h3>
            <div className="font-mono text-2xl font-black">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
            </div>
          </div>

          {item.metadata && (
            <div className="space-y-1">
              {Object.entries(item.metadata)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="text-xs font-mono text-gray-600">
                    <span className="font-bold">{key}:</span> {String(value)}
                  </div>
                ))}
            </div>
          )}

          {item.children && item.children.length > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-black">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(item.id);
                }}
                className="flex items-center space-x-2 text-sm font-mono font-bold hover:text-blue-600"
              >
                {expandedItems.has(item.id) ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Hide Details</span>
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span>Show Details</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center">
          {title && (
            <h2 className="text-2xl md:text-3xl font-black font-mono uppercase tracking-wider mb-2">
              {title}
            </h2>
          )}
          {subtitle && <p className="font-mono text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Breadcrumb */}
      {selectedPath.length > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-brutalist-light-gray border-2 border-black">
          <span className="font-mono font-bold text-sm">Path:</span>
          {selectedPath.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() =>
                  setSelectedPath(selectedPath.slice(0, index + 1))
                }
                className="font-mono text-sm hover:text-blue-600"
              >
                {item.label}
              </button>
              {index < selectedPath.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
          <button
            onClick={() => setSelectedPath([])}
            className="ml-2 p-1 hover:bg-white rounded"
            title="Clear path"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="p-4 bg-white border-3 border-black">
        {renderFilters()}
      </div>

      {/* Data Display */}
      <div className="bg-white border-3 border-black">
        {viewMode === "tree" && (
          <div className="p-4 space-y-2">
            {finalData.map((item) => renderTreeItem(item))}
          </div>
        )}
        {viewMode === "table" && renderTableView()}
        {viewMode === "cards" && <div className="p-4">{renderCardsView()}</div>}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-brutalist-yellow border-3 border-black text-center">
          <div className="text-2xl font-mono font-black">
            {finalData.length}
          </div>
          <div className="text-sm font-mono uppercase tracking-wider">
            Total Items
          </div>
        </div>
        <div className="p-4 bg-white border-3 border-black text-center">
          <div className="text-2xl font-mono font-black">
            {finalData
              .reduce((sum, item) => sum + item.value, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm font-mono uppercase tracking-wider">
            Total Value
          </div>
        </div>
        <div className="p-4 bg-white border-3 border-black text-center">
          <div className="text-2xl font-mono font-black">
            {expandedItems.size}
          </div>
          <div className="text-sm font-mono uppercase tracking-wider">
            Expanded
          </div>
        </div>
        <div className="p-4 bg-white border-3 border-black text-center">
          <div className="text-2xl font-mono font-black">
            {selectedPath.length}
          </div>
          <div className="text-sm font-mono uppercase tracking-wider">
            Drill Depth
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDrillDown;
