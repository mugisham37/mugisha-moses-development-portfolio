"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitBranch, Eye, Filter } from "lucide-react";
import { Project } from "@/lib/types";
import { FEATURED_PROJECTS, TESTIMONIALS } from "@/lib/constants";
import BrutalistButton from "@/components/ui/BrutalistButton";
import { ProjectModal } from "@/components/ui/ProjectModal";

interface ProjectGridProps {
  projects?: readonly Project[];
  className?: string;
  showFeatured?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All Projects", count: 0 },
  { id: "react", label: "React", count: 0 },
  { id: "vue", label: "Vue.js", count: 0 },
  { id: "ecommerce", label: "E-commerce", count: 0 },
  { id: "saas", label: "SaaS", count: 0 },
  { id: "mobile", label: "Mobile", count: 0 },
] as const;

function ProjectGrid({
  projects = FEATURED_PROJECTS,
  className = "",
  showFeatured = false,
}: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Filter projects and calculate counts
  const { filteredProjects, categoriesWithCounts } = useMemo(() => {
    const allProjects = showFeatured
      ? projects
      : projects.filter((project) => !project.featured);

    const filtered =
      activeFilter === "all"
        ? allProjects
        : allProjects.filter((project) => project.category === activeFilter);

    // Calculate counts for each category
    const counts = CATEGORIES.map((category) => ({
      ...category,
      count:
        category.id === "all"
          ? allProjects.length
          : allProjects.filter((p) => p.category === category.id).length,
    }));

    return {
      filteredProjects: filtered,
      categoriesWithCounts: counts,
    };
  }, [projects, activeFilter, showFeatured]);

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-mono font-bold text-black mb-4 border-4 border-black bg-yellow-400 inline-block px-8 py-4 transform rotate-1">
            ALL PROJECTS
          </h2>
          <p className="text-xl font-mono text-gray-600 max-w-2xl mx-auto">
            Explore my complete portfolio of web applications and digital
            solutions.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <BrutalistButton
              variant="secondary"
              size="md"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 w-full justify-center"
            >
              <Filter size={20} />
              Filter Projects ({filteredProjects.length})
            </BrutalistButton>
          </div>

          {/* Filter Buttons */}
          <div
            className={`
            ${isFilterOpen ? "block" : "hidden"} md:block
            flex flex-wrap justify-center gap-3
          `}
          >
            {categoriesWithCounts.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setActiveFilter(category.id);
                  setIsFilterOpen(false);
                }}
                className={`
                  font-mono font-bold px-6 py-3 border-4 transition-all duration-300
                  ${
                    activeFilter === category.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black hover:bg-yellow-400"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={category.count === 0}
              >
                {category.label}
                <span className="ml-2 text-sm opacity-75">
                  ({category.count})
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onOpenModal={() => openModal(project)}
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
            <p className="text-gray-600 font-mono">
              Try selecting a different category filter.
            </p>
          </motion.div>
        )}

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-mono text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </motion.div>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeModal}
          testimonials={TESTIMONIALS}
        />
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  onOpenModal: () => void;
}

function ProjectCard({ project, onOpenModal }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Card */}
      <div className="relative bg-white border-4 border-black h-full overflow-hidden">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={project.images.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-white font-mono font-bold text-lg mb-4">
                    View Project
                  </div>
                  <div className="flex gap-3 justify-center">
                    {project.links.live && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.links.live, "_blank");
                        }}
                        className="bg-yellow-400 text-black p-2 border-2 border-white"
                      >
                        <ExternalLink size={20} />
                      </motion.button>
                    )}
                    {project.links.github && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.links.github, "_blank");
                        }}
                        className="bg-white text-black p-2 border-2 border-white"
                      >
                        <GitBranch size={20} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal();
                      }}
                      className="bg-black text-white p-2 border-2 border-white"
                    >
                      <Eye size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-black font-mono font-bold px-3 py-1 border-2 border-black text-sm uppercase">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-mono font-bold text-black mb-3 text-xl">
            {project.title}
          </h3>

          <p className="text-gray-600 font-mono mb-4 text-base line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="bg-black text-white font-mono text-xs px-2 py-1 border border-black"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="bg-gray-200 text-black font-mono text-xs px-2 py-1 border border-black">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Metrics (if available) */}
          {project.metrics && (
            <div className="mb-4 p-3 bg-yellow-400 border-2 border-black">
              <div className="grid grid-cols-1 gap-1 text-xs font-mono">
                <div>📈 {project.metrics.performance}</div>
                <div>💰 {project.metrics.conversion}</div>
                <div>👥 {project.metrics.users}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {project.links.live && (
              <BrutalistButton
                variant="primary"
                size="sm"
                onClick={() => window.open(project.links.live, "_blank")}
                className="flex items-center gap-1 text-xs"
              >
                <ExternalLink size={14} />
                Live
              </BrutalistButton>
            )}

            {project.links.github && (
              <BrutalistButton
                variant="secondary"
                size="sm"
                onClick={() => window.open(project.links.github, "_blank")}
                className="flex items-center gap-1 text-xs"
              >
                <GitBranch size={14} />
                Code
              </BrutalistButton>
            )}

            <BrutalistButton
              variant="accent"
              size="sm"
              onClick={onOpenModal}
              className="flex items-center gap-1 text-xs"
            >
              <Eye size={14} />
              Study
            </BrutalistButton>
          </div>
        </div>

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 border-4 border-yellow-400 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
// Default export for lazy loading
export default ProjectGrid;
