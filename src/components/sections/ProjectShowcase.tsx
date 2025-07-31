"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";
import { Project } from "@/lib/types";
import { FEATURED_PROJECTS, TESTIMONIALS } from "@/lib/constants";
import BrutalistButton from "@/components/ui/BrutalistButton";
import { ProjectModal } from "@/components/ui/ProjectModal";

interface ProjectShowcaseProps {
  projects?: readonly Project[];
  className?: string;
}

function ProjectShowcase({
  projects = FEATURED_PROJECTS,
  className = "",
}: ProjectShowcaseProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 4);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-mono font-bold text-black mb-4 border-4 border-black bg-yellow-400 inline-block px-8 py-4 transform -rotate-1">
            FEATURED WORK
          </h2>
          <p className="text-xl font-mono text-gray-600 max-w-2xl mx-auto">
            Real projects. Real results. Real impact.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`
                ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
                ${index === 1 ? "lg:row-span-1" : ""}
                ${index === 2 ? "lg:row-span-1" : ""}
                ${index === 3 ? "lg:col-span-2" : ""}
              `}
            >
              <ProjectCard
                project={project}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
                onOpenModal={() => openModal(project)}
                isLarge={index === 0}
              />
            </motion.div>
          ))}
        </div>

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
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpenModal: () => void;
  isLarge?: boolean;
}

function ProjectCard({
  project,
  isHovered,
  onHover,
  onLeave,
  onOpenModal,
  isLarge = false,
}: ProjectCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer h-full"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
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

          {/* Mockup Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
              >
                <motion.img
                  src={project.images.mockup}
                  alt={`${project.title} mockup`}
                  className="max-w-[80%] max-h-[80%] object-contain border-2 border-yellow-400"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
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
        <div className={`p-6 ${isLarge ? "lg:p-8" : ""}`}>
          <h3
            className={`font-mono font-bold text-black mb-3 ${
              isLarge ? "text-2xl lg:text-3xl" : "text-xl"
            }`}
          >
            {project.title}
          </h3>

          <p
            className={`text-gray-600 font-mono mb-4 ${
              isLarge ? "text-lg" : "text-base"
            }`}
          >
            {project.description}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, isLarge ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="bg-black text-white font-mono text-xs px-2 py-1 border border-black"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > (isLarge ? 6 : 4) && (
              <span className="bg-gray-200 text-black font-mono text-xs px-2 py-1 border border-black">
                +{project.technologies.length - (isLarge ? 6 : 4)} more
              </span>
            )}
          </div>

          {/* Business Impact */}
          {project.metrics && (
            <div className="mb-6 p-4 bg-yellow-400 border-2 border-black">
              <h4 className="font-mono font-bold text-black mb-2 text-sm uppercase">
                Impact Metrics
              </h4>
              <div className="grid grid-cols-1 gap-1 text-sm font-mono">
                <div>📈 {project.metrics.performance}</div>
                <div>💰 {project.metrics.conversion}</div>
                <div>👥 {project.metrics.users}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.links.live && (
              <BrutalistButton
                variant="primary"
                size="sm"
                onClick={() => window.open(project.links.live, "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                View Live
              </BrutalistButton>
            )}

            {project.links.github && (
              <BrutalistButton
                variant="secondary"
                size="sm"
                onClick={() => window.open(project.links.github, "_blank")}
                className="flex items-center gap-2"
              >
                <Github size={16} />
                Code
              </BrutalistButton>
            )}

            <BrutalistButton
              variant="accent"
              size="sm"
              onClick={onOpenModal}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              Case Study
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
export default ProjectShowcase;
