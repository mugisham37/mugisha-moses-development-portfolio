"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  LayoutGrid,
  ChevronDown,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Project } from "@/lib/types";
import { ComplexityLevel, ProjectCategory } from "@/types/enhanced";
import { FEATURED_PROJECTS } from "@/lib/constants";
import { ProjectCard } from "./ProjectCard";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

interface InteractiveProjectGridProps {
  projects?: readonly Project[];
  className?: string;
  enableFiltering?: boolean;
  enableSearch?: boolean;
  enableSorting?: boolean;
  viewMode?: "grid" | "list" | "masonry";
  onProjectSelect?: (project: Project) => void;
  itemsPerPage?: number;
}

type ViewMode = "grid" | "list" | "masonry";
type SortOption = "relevance" | "date" | "title" | "complexity";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 12;

const CATEGORIES: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All Projects" },
  { id: "react", label: "React" },
  { id: "vue", label: "Vue.js" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "saas", label: "SaaS" },
  { id: "mobile", label: "Mobile" },
];

const COMPLEXITY_LEVELS: { id: ComplexityLevel | "all"; label: string }[] = [
  { id: "all", label: "All Levels" },
  { id: "simple", label: "Simple" },
  { id: "moderate", label: "Moderate" },
  { id: "complex", label: "Complex" },
  { id: "enterprise", label: "Enterprise" },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "date", label: "Date" },
  { id: "title", label: "Title" },
  { id: "complexity", label: "Complexity" },
];

export function InteractiveProjectGrid({
  projects = FEATURED_PROJECTS,
  className = "",
  enableFiltering = true,
  enableSearch = true,
  enableSorting = true,
  viewMode: initialViewMode = "grid",
  onProjectSelect,
  itemsPerPage = ITEMS_PER_PAGE,
}: InteractiveProjectGridProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<
    Set<ProjectCategory | "all">
  >(new Set(["all"]));
  const [selectedComplexity, setSelectedComplexity] = useState<
    Set<ComplexityLevel | "all">
  >(new Set(["all"]));
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.longDescription.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    // Apply category filter
    if (!selectedCategories.has("all")) {
      filtered = filtered.filter((project) =>
        selectedCategories.has(project.category)
      );
    }

    // Apply complexity filter (mock implementation since original projects don't have complexity)
    if (!selectedComplexity.has("all")) {
      // For demo purposes, assign complexity based on technology count
      filtered = filtered.filter((project) => {
        const techCount = project.technologies.length;
        let projectComplexity: ComplexityLevel;
        if (techCount <= 2) projectComplexity = "simple";
        else if (techCount <= 4) projectComplexity = "moderate";
        else if (techCount <= 6) projectComplexity = "complex";
        else projectComplexity = "enterprise";

        return selectedComplexity.has(projectComplexity);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          // Mock date sorting based on project ID
          comparison = a.id.localeCompare(b.id);
          break;
        case "complexity":
          // Sort by technology count as complexity proxy
          comparison = a.technologies.length - b.technologies.length;
          break;
        case "relevance":
        default:
          // Featured projects first, then by metrics availability
          if (a.featured && !b.featured) comparison = -1;
          else if (!a.featured && b.featured) comparison = 1;
          else if (a.metrics && !b.metrics) comparison = -1;
          else if (!a.metrics && b.metrics) comparison = 1;
          else comparison = 0;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    projects,
    searchQuery,
    selectedCategories,
    selectedComplexity,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(0, startIndex + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  const hasMore = paginatedProjects.length < filteredAndSortedProjects.length;

  // Infinite scroll hook
  const { loadMore, isLoading } = useInfiniteScroll({
    hasMore,
    onLoadMore: useCallback(() => {
      setCurrentPage((prev) => prev + 1);
    }, []),
  });

  // Keyboard navigation
  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: paginatedProjects.length,
    onSelect: useCallback(
      (index: number) => {
        const project = paginatedProjects[index];
        if (project && onProjectSelect) {
          onProjectSelect(project);
        }
      },
      [paginatedProjects, onProjectSelect]
    ),
  });

  // Filter handlers
  const handleCategoryToggle = useCallback(
    (category: ProjectCategory | "all") => {
      setSelectedCategories((prev) => {
        const newSet = new Set(prev);
        if (category === "all") {
          return new Set(["all"]);
        } else {
          newSet.delete("all");
          if (newSet.has(category)) {
            newSet.delete(category);
          } else {
            newSet.add(category);
          }
          if (newSet.size === 0) {
            newSet.add("all");
          }
        }
        return newSet;
      });
      setCurrentPage(1);
    },
    []
  );

  const handleComplexityToggle = useCallback(
    (complexity: ComplexityLevel | "all") => {
      setSelectedComplexity((prev) => {
        const newSet = new Set(prev);
        if (complexity === "all") {
          return new Set(["all"]);
        } else {
          newSet.delete("all");
          if (newSet.has(complexity)) {
            newSet.delete(complexity);
          } else {
            newSet.add(complexity);
          }
          if (newSet.size === 0) {
            newSet.add("all");
          }
        }
        return newSet;
      });
      setCurrentPage(1);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories(new Set(["all"]));
    setSelectedComplexity(new Set(["all"]));
    setCurrentPage(1);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedComplexity, sortBy]);

  return (
    <div
      className={`w-full ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        {enableSearch && (
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Filter and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filter Controls */}
          {enableFiltering && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-mono font-bold hover:bg-yellow-400 transition-colors"
                aria-expanded={isFilterOpen}
                aria-controls="filter-panel"
              >
                <Filter size={16} />
                Filters
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Filters */}
              <div
                className={`${isFilterOpen ? "block" : "hidden"} lg:block`}
                id="filter-panel"
              >
                <div className="flex flex-wrap gap-2">
                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-1">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`px-3 py-1 text-sm font-mono font-bold border-2 border-black transition-colors ${
                          selectedCategories.has(category.id)
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-yellow-400"
                        }`}
                        aria-pressed={selectedCategories.has(category.id)}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>

                  {/* Complexity Filters */}
                  <div className="flex flex-wrap gap-1">
                    {COMPLEXITY_LEVELS.map((complexity) => (
                      <button
                        key={complexity.id}
                        onClick={() => handleComplexityToggle(complexity.id)}
                        className={`px-3 py-1 text-sm font-mono font-bold border-2 border-black transition-colors ${
                          selectedComplexity.has(complexity.id)
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-yellow-400"
                        }`}
                        aria-pressed={selectedComplexity.has(complexity.id)}
                      >
                        {complexity.label}
                      </button>
                    ))}
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm font-mono font-bold bg-red-500 text-white border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Mode and Sort Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Controls */}
            {enableSorting && (
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Sort by"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="p-2 border-2 border-black bg-white hover:bg-yellow-400 transition-colors"
                  aria-label={`Sort ${
                    sortOrder === "asc" ? "ascending" : "descending"
                  }`}
                >
                  {sortOrder === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                </button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex border-2 border-black">
              {[
                { mode: "grid" as ViewMode, icon: Grid3X3, label: "Grid view" },
                { mode: "list" as ViewMode, icon: List, label: "List view" },
                {
                  mode: "masonry" as ViewMode,
                  icon: LayoutGrid,
                  label: "Masonry view",
                },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 transition-colors ${
                    viewMode === mode
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-yellow-400"
                  }`}
                  aria-label={label}
                  aria-pressed={viewMode === mode}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm font-mono">
          <span>
            Showing {paginatedProjects.length} of{" "}
            {filteredAndSortedProjects.length} projects
          </span>
          {(searchQuery ||
            !selectedCategories.has("all") ||
            !selectedComplexity.has("all")) && (
            <span className="text-gray-600">
              Filtered from {projects.length} total projects
            </span>
          )}
        </div>
      </div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${searchQuery}-${Array.from(
            selectedCategories
          ).join(",")}-${Array.from(selectedComplexity).join(",")}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`
            ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : ""
            }
            ${viewMode === "list" ? "space-y-4" : ""}
            ${
              viewMode === "masonry"
                ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                : ""
            }
          `}
        >
          {paginatedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`
                ${viewMode === "masonry" ? "break-inside-avoid" : ""}
                ${focusedIndex === index ? "ring-4 ring-yellow-400" : ""}
              `}
            >
              <ProjectCard
                project={project}
                viewMode={viewMode}
                onSelect={() => onProjectSelect?.(project)}
                isFocused={focusedIndex === index}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredAndSortedProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-mono font-bold text-black mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 font-mono mb-4">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-yellow-400 border-4 border-black font-mono font-bold hover:bg-yellow-500 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Load More / Infinite Scroll */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-4 bg-black text-white border-4 border-black font-mono font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Loading..." : "Load More Projects"}
          </button>
        </div>
      )}

      {/* Accessibility Instructions */}
      <div className="sr-only" aria-live="polite">
        {filteredAndSortedProjects.length > 0
          ? `${filteredAndSortedProjects.length} projects found. Use arrow keys to navigate, Enter to select.`
          : "No projects found with current filters."}
      </div>
    </div>
  );
}

export default InteractiveProjectGrid;
