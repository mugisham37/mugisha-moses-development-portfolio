"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, List, X } from "lucide-react";
import { Project } from "@/lib/types";
import { FEATURED_PROJECTS } from "@/lib/constants";
import { ProjectCaseStudyModal } from "./ProjectCaseStudyModal";

interface SimpleInteractiveProjectGridProps {
  projects?: readonly Project[];
  className?: string;
}

type ViewMode = "grid" | "list";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "react", label: "React" },
  { id: "vue", label: "Vue.js" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "saas", label: "SaaS" },
  { id: "mobile", label: "Mobile" },
] as const;

// Simple Project Card Component
interface SimpleProjectCardProps {
  project: Project;
  viewMode: ViewMode;
  onClick: () => void;
}

function SimpleProjectCard({
  project,
  viewMode,
  onClick,
}: SimpleProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === "list") {
    return (
      <div
        className="bg-white border-4 border-black p-4 flex gap-4 items-center hover:bg-yellow-50 transition-colors cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="flex-shrink-0 w-24 h-16 bg-gray-200 border-2 border-black overflow-hidden">
          <img
            src={project.images.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-mono font-bold text-black text-lg mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 font-mono text-sm mb-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="bg-black text-white font-mono text-xs px-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="group cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative bg-white border-4 border-black h-full overflow-hidden">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={project.images.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-400 text-black font-mono font-bold px-2 py-1 border-2 border-black text-xs uppercase">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-mono font-bold text-black mb-2 text-lg">
            {project.title}
          </h3>
          <p className="text-gray-600 font-mono mb-3 text-sm">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="bg-black text-white font-mono text-xs px-2 py-1"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="bg-gray-200 text-black font-mono text-xs px-2 py-1">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="mb-3 p-2 bg-yellow-400 border-2 border-black">
              <div className="text-xs font-mono">
                <div>📈 {project.metrics.performance}</div>
                <div>👥 {project.metrics.users}</div>
              </div>
            </div>
          )}
        </div>

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 border-4 border-yellow-400 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
}

export function SimpleInteractiveProjectGrid({
  projects = FEATURED_PROJECTS,
  className = "",
}: SimpleInteractiveProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    return filtered;
  }, [projects, searchQuery, selectedCategory]);

  // Handle project selection
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle modal navigation
  const handleModalNavigation = (direction: "prev" | "next") => {
    if (!selectedProject) return;

    const currentIndex = filteredProjects.findIndex(
      (p) => p.id === selectedProject.id
    );
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex === 0 ? filteredProjects.length - 1 : currentIndex - 1;
    } else {
      newIndex =
        currentIndex === filteredProjects.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedProject(filteredProjects[newIndex]);
  };

  // Get related projects (same category, excluding current)
  const getRelatedProjects = (currentProject: Project) => {
    return projects
      .filter(
        (p) =>
          p.id !== currentProject.id && p.category === currentProject.category
      )
      .slice(0, 4);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-mono font-bold hover:bg-yellow-400 transition-colors"
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className={`${isFilterOpen ? "block" : "hidden"} lg:block`}>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 text-sm font-mono font-bold border-2 border-black transition-colors ${
                      selectedCategory === category.id
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-yellow-400"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border-2 border-black">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-400"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-400"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm font-mono">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
      </div>

      {/* Project Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${searchQuery}-${selectedCategory}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <SimpleProjectCard
                project={project}
                viewMode={viewMode}
                onClick={() => handleProjectClick(project)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
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
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-6 py-3 bg-yellow-400 border-4 border-black font-mono font-bold hover:bg-yellow-500 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Project Case Study Modal */}
      {selectedProject && (
        <ProjectCaseStudyModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
          onNavigate={handleModalNavigation}
          relatedProjects={getRelatedProjects(selectedProject)}
        />
      )}
    </div>
  );
}

export default SimpleInteractiveProjectGrid;
