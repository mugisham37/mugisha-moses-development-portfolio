"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  GitBranch,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { Project } from "@/lib/types";
import { ComplexityLevel } from "@/types/enhanced";

interface ProjectCardProps {
  project: Project;
  viewMode: "grid" | "list" | "masonry";
  onSelect?: () => void;
  isFocused?: boolean;
  showMetrics?: boolean;
  showTechnologies?: boolean;
}

// Helper function to determine complexity based on project data
const getProjectComplexity = (project: Project): ComplexityLevel => {
  const techCount = project.technologies.length;
  if (techCount <= 2) return "simple";
  if (techCount <= 4) return "moderate";
  if (techCount <= 6) return "complex";
  return "enterprise";
};

// Helper function to get complexity color
const getComplexityColor = (complexity: ComplexityLevel): string => {
  switch (complexity) {
    case "simple":
      return "bg-green-500";
    case "moderate":
      return "bg-blue-500";
    case "complex":
      return "bg-orange-500";
    case "enterprise":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Helper function to get category icon
const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "react":
      return "⚛️";
    case "vue":
      return "💚";
    case "ecommerce":
      return "🛒";
    case "saas":
      return "☁️";
    case "mobile":
      return "📱";
    default:
      return "💻";
  }
};

export function ProjectCard({
  project,
  viewMode,
  onSelect,
  isFocused = false,
  showMetrics = true,
  showTechnologies = true,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const complexity = getProjectComplexity(project);
  const complexityColor = getComplexityColor(complexity);
  const categoryIcon = getCategoryIcon(project.category);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.();
      }
    },
    [onSelect]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleExternalLink = useCallback(
    (e: React.MouseEvent, url?: string) => {
      e.stopPropagation();
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  // Grid View Component
  if (viewMode === "grid") {
    return (
      <motion.div
        className={`group cursor-pointer h-full ${
          isFocused ? "ring-4 ring-yellow-400" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        role="button"
        aria-label={`View details for ${project.title}`}
      >
        <div className="relative bg-white border-4 border-black h-full overflow-hidden">
          {/* Project Image */}
          <div className="relative aspect-video overflow-hidden bg-gray-200">
            {!imageError ? (
              <>
                <motion.img
                  src={project.images.thumbnail}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-4xl mb-2">{categoryIcon}</div>
                  <div className="text-sm font-mono text-gray-500">
                    Image not available
                  </div>
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-white font-mono font-bold text-lg mb-4">
                      View Project Details
                    </div>
                    <div className="flex gap-2 justify-center">
                      {project.links.live && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) =>
                            handleExternalLink(e, project.links.live)
                          }
                          className="bg-yellow-400 text-black p-2 border-2 border-white font-mono text-xs"
                          aria-label="View live project"
                        >
                          <ExternalLink size={16} />
                        </motion.button>
                      )}
                      {project.links.github && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) =>
                            handleExternalLink(e, project.links.github)
                          }
                          className="bg-white text-black p-2 border-2 border-white font-mono text-xs"
                          aria-label="View source code"
                        >
                          <GitBranch size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.();
                        }}
                        className="bg-black text-white p-2 border-2 border-white font-mono text-xs"
                        aria-label="View case study"
                      >
                        <Eye size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-yellow-400 text-black font-mono font-bold px-2 py-1 border-2 border-black text-xs uppercase">
                {project.category}
              </span>
              {project.featured && (
                <span className="bg-red-500 text-white font-mono font-bold px-2 py-1 border-2 border-black text-xs flex items-center gap-1">
                  <Star size={12} />
                  Featured
                </span>
              )}
            </div>

            {/* Complexity Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`${complexityColor} text-white font-mono font-bold px-2 py-1 border-2 border-black text-xs capitalize`}
              >
                {complexity}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-mono font-bold text-black mb-2 text-lg line-clamp-2">
              {project.title}
            </h3>

            <p className="text-gray-600 font-mono mb-3 text-sm line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            {showTechnologies && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="bg-black text-white font-mono text-xs px-2 py-1 border border-black"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="bg-gray-200 text-black font-mono text-xs px-2 py-1 border border-black">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Metrics */}
            {showMetrics && project.metrics && (
              <div className="mb-3 p-2 bg-yellow-400 border-2 border-black">
                <div className="grid grid-cols-1 gap-1 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    {project.metrics.performance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {project.metrics.users}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.();
              }}
              className="w-full bg-black text-white font-mono font-bold py-2 px-4 border-2 border-black hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
            >
              View Details
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Focus/Hover Border Effect */}
          <motion.div
            className="absolute inset-0 border-4 border-yellow-400 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isFocused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>
    );
  }

  // List View Component
  if (viewMode === "list") {
    return (
      <motion.div
        className={`group cursor-pointer ${
          isFocused ? "ring-4 ring-yellow-400" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        role="button"
        aria-label={`View details for ${project.title}`}
      >
        <div className="bg-white border-4 border-black p-4 flex gap-4 items-center">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-24 h-16 bg-gray-200 border-2 border-black overflow-hidden">
            {!imageError ? (
              <img
                src={project.images.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg">{categoryIcon}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-mono font-bold text-black text-lg truncate pr-4">
                {project.title}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                <span className="bg-yellow-400 text-black font-mono font-bold px-2 py-1 border-2 border-black text-xs uppercase">
                  {project.category}
                </span>
                <span
                  className={`${complexityColor} text-white font-mono font-bold px-2 py-1 border-2 border-black text-xs capitalize`}
                >
                  {complexity}
                </span>
              </div>
            </div>

            <p className="text-gray-600 font-mono mb-2 text-sm line-clamp-2">
              {project.description}
            </p>

            <div className="flex items-center justify-between">
              {/* Tech Stack */}
              {showTechnologies && (
                <div className="flex flex-wrap gap-1">
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
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {project.links.live && (
                  <button
                    onClick={(e) => handleExternalLink(e, project.links.live)}
                    className="bg-yellow-400 text-black p-2 border-2 border-black hover:bg-yellow-500 transition-colors"
                    aria-label="View live project"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
                {project.links.github && (
                  <button
                    onClick={(e) => handleExternalLink(e, project.links.github)}
                    className="bg-white text-black p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                    aria-label="View source code"
                  >
                    <GitBranch size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.();
                  }}
                  className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800 transition-colors"
                  aria-label="View case study"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Hover Indicator */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isHovered || isFocused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.div>
    );
  }

  // Masonry View Component
  return (
    <motion.div
      className={`group cursor-pointer ${
        isFocused ? "ring-4 ring-yellow-400" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      role="button"
      aria-label={`View details for ${project.title}`}
    >
      <div className="bg-white border-4 border-black overflow-hidden">
        {/* Project Image */}
        <div
          className="relative overflow-hidden bg-gray-200"
          style={{ aspectRatio: Math.random() * 0.5 + 1 }}
        >
          {!imageError ? (
            <img
              src={project.images.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{categoryIcon}</div>
                <div className="text-sm font-mono text-gray-500">
                  Image not available
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="bg-yellow-400 text-black font-mono font-bold px-2 py-1 border-2 border-black text-xs uppercase">
              {project.category}
            </span>
            {project.featured && (
              <span className="bg-red-500 text-white font-mono font-bold px-1 py-1 border-2 border-black text-xs">
                <Star size={10} />
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-mono font-bold text-black mb-2 text-base">
            {project.title}
          </h3>

          <p className="text-gray-600 font-mono mb-3 text-sm">
            {project.description}
          </p>

          {/* Tech Stack */}
          {showTechnologies && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="bg-black text-white font-mono text-xs px-2 py-1 border border-black"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="bg-gray-200 text-black font-mono text-xs px-2 py-1 border border-black">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metrics */}
          {showMetrics && project.metrics && (
            <div className="mb-3 p-2 bg-yellow-400 border-2 border-black">
              <div className="text-xs font-mono">
                <div>{project.metrics.performance}</div>
                <div>{project.metrics.users}</div>
              </div>
            </div>
          )}

          {/* Complexity */}
          <div className="flex justify-between items-center">
            <span
              className={`${complexityColor} text-white font-mono font-bold px-2 py-1 border-2 border-black text-xs capitalize`}
            >
              {complexity}
            </span>
            <div className="flex gap-1">
              {project.links.live && (
                <button
                  onClick={(e) => handleExternalLink(e, project.links.live)}
                  className="bg-yellow-400 text-black p-1 border-2 border-black hover:bg-yellow-500 transition-colors"
                  aria-label="View live project"
                >
                  <ExternalLink size={12} />
                </button>
              )}
              {project.links.github && (
                <button
                  onClick={(e) => handleExternalLink(e, project.links.github)}
                  className="bg-white text-black p-1 border-2 border-black hover:bg-gray-100 transition-colors"
                  aria-label="View source code"
                >
                  <GitBranch size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 border-4 border-yellow-400 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
}

export default ProjectCard;
