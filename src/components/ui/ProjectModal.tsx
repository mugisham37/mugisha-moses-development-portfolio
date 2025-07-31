"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Project, Testimonial } from "@/lib/types";
import BrutalistButton from "./BrutalistButton";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  testimonials?: Testimonial[];
}

export function ProjectModal({
  project,
  isOpen,
  onClose,
  testimonials = [],
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "technical" | "results"
  >("overview");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setActiveTab("overview");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = [project.images.mockup, ...project.images.screenshots];
  const projectTestimonials = testimonials.filter(
    (t) => t.project_type.toLowerCase() === project.category
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-80" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white border-4 border-black max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-4 border-black bg-yellow-400">
              <div>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-black">
                  {project.title}
                </h2>
                <span className="inline-block mt-2 bg-black text-white font-mono font-bold px-3 py-1 text-sm uppercase">
                  {project.category}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-black text-white p-2 border-2 border-black hover:bg-white hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Tab Navigation */}
              <div className="flex border-b-4 border-black">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "technical", label: "Technical" },
                  { id: "results", label: "Results" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-4 px-6 font-mono font-bold border-r-4 border-black last:border-r-0 transition-colors ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-yellow-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <OverviewTab
                    project={project}
                    images={images}
                    currentImageIndex={currentImageIndex}
                    onNextImage={nextImage}
                    onPrevImage={prevImage}
                    setCurrentImageIndex={setCurrentImageIndex}
                  />
                )}

                {activeTab === "technical" && (
                  <TechnicalTab project={project} />
                )}

                {activeTab === "results" && (
                  <ResultsTab
                    project={project}
                    testimonials={projectTestimonials}
                  />
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap gap-4 p-6 border-t-4 border-black bg-gray-100">
              {project.links.live && (
                <BrutalistButton
                  variant="primary"
                  size="md"
                  onClick={() => window.open(project.links.live, "_blank")}
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={20} />
                  View Live Site
                </BrutalistButton>
              )}

              {project.links.github && (
                <BrutalistButton
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(project.links.github, "_blank")}
                  className="flex items-center gap-2"
                >
                  <Github size={20} />
                  View Code
                </BrutalistButton>
              )}

              <BrutalistButton
                variant="accent"
                size="md"
                onClick={onClose}
                className="ml-auto"
              >
                Close
              </BrutalistButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface OverviewTabProps {
  project: Project;
  images: string[];
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  setCurrentImageIndex: (index: number) => void;
}

function OverviewTab({
  project,
  images,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  setCurrentImageIndex,
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="relative">
        <div className="relative aspect-video bg-gray-100 border-4 border-black overflow-hidden">
          <motion.div
            key={currentImageIndex}
            className="w-full h-full relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={onPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 border-2 border-white hover:bg-yellow-400 hover:text-black transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={onNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 border-2 border-white hover:bg-yellow-400 hover:text-black transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black text-white font-mono px-3 py-1 border-2 border-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-12 border-2 overflow-hidden relative ${
                  index === currentImageIndex
                    ? "border-yellow-400"
                    : "border-black hover:border-yellow-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Problem → Solution → Results Format */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Problem */}
        <div className="bg-red-100 border-4 border-black p-6">
          <h3 className="font-mono font-bold text-black mb-4 text-xl flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Problem
          </h3>
          <p className="font-mono text-gray-700">
            The challenge was to create a {project.category} solution that
            addresses modern user needs while maintaining high performance and
            scalability. Traditional approaches often fall short in delivering
            the seamless experience users expect.
          </p>
        </div>

        {/* Solution */}
        <div className="bg-blue-100 border-4 border-black p-6">
          <h3 className="font-mono font-bold text-black mb-4 text-xl flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Solution
          </h3>
          <p className="font-mono text-gray-700 mb-4">
            {project.longDescription}
          </p>
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-black text-sm uppercase">
              Key Features:
            </h4>
            <ul className="font-mono text-sm text-gray-600 space-y-1">
              <li>• Responsive design across all devices</li>
              <li>• Optimized performance and loading times</li>
              <li>• Modern UI/UX with accessibility in mind</li>
              <li>• Scalable architecture for future growth</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="bg-green-100 border-4 border-black p-6">
          <h3 className="font-mono font-bold text-black mb-4 text-xl flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Results
          </h3>
          {project.metrics ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-600" size={16} />
                <span className="font-mono text-sm">
                  {project.metrics.performance}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={16} />
                <span className="font-mono text-sm">
                  {project.metrics.conversion}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-blue-600" size={16} />
                <span className="font-mono text-sm">
                  {project.metrics.users}
                </span>
              </div>
            </div>
          ) : (
            <p className="font-mono text-gray-700">
              Successfully delivered a high-quality solution that meets all
              project requirements and exceeds client expectations.
            </p>
          )}
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-yellow-400 border-4 border-black p-6">
        <h3 className="font-mono font-bold text-black mb-4 text-xl">
          Project Overview
        </h3>
        <p className="font-mono text-black text-lg leading-relaxed">
          {project.description}
        </p>
      </div>
    </div>
  );
}

interface TechnicalTabProps {
  project: Project;
}

function TechnicalTab({ project }: TechnicalTabProps) {
  return (
    <div className="space-y-8">
      {/* Tech Stack */}
      <div>
        <h3 className="font-mono font-bold text-black mb-6 text-2xl border-b-4 border-black pb-2">
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {project.technologies.map((tech) => (
            <div
              key={tech}
              className="bg-black text-white font-mono font-bold p-4 border-4 border-black text-center hover:bg-yellow-400 hover:text-black transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Architecture */}
        <div className="bg-gray-100 border-4 border-black p-6">
          <h4 className="font-mono font-bold text-black mb-4 text-xl">
            Architecture
          </h4>
          <ul className="font-mono text-gray-700 space-y-2">
            <li>• Component-based architecture</li>
            <li>• Responsive design patterns</li>
            <li>• Performance optimization</li>
            <li>• SEO-friendly structure</li>
            <li>• Accessibility compliance</li>
          </ul>
        </div>

        {/* Development Process */}
        <div className="bg-gray-100 border-4 border-black p-6">
          <h4 className="font-mono font-bold text-black mb-4 text-xl">
            Development Process
          </h4>
          <ul className="font-mono text-gray-700 space-y-2">
            <li>• Agile development methodology</li>
            <li>• Test-driven development</li>
            <li>• Code review and quality assurance</li>
            <li>• Continuous integration/deployment</li>
            <li>• Performance monitoring</li>
          </ul>
        </div>
      </div>

      {/* Code Quality Metrics */}
      <div className="bg-yellow-400 border-4 border-black p-6">
        <h4 className="font-mono font-bold text-black mb-4 text-xl">
          Code Quality & Performance
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-black">95%</div>
            <div className="font-mono text-sm text-black">Test Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-black">A+</div>
            <div className="font-mono text-sm text-black">Code Grade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-black">
              &lt;3s
            </div>
            <div className="font-mono text-sm text-black">Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-black">100%</div>
            <div className="font-mono text-sm text-black">Accessibility</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResultsTabProps {
  project: Project;
  testimonials: Testimonial[];
}

function ResultsTab({ project, testimonials }: ResultsTabProps) {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      {project.metrics && (
        <div>
          <h3 className="font-mono font-bold text-black mb-6 text-2xl border-b-4 border-black pb-2">
            Performance Metrics
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-100 border-4 border-black p-6 text-center">
              <Zap className="mx-auto mb-4 text-yellow-600" size={48} />
              <div className="text-2xl font-mono font-bold text-black mb-2">
                {project.metrics.performance}
              </div>
              <div className="font-mono text-sm text-gray-600">
                Performance Score
              </div>
            </div>
            <div className="bg-blue-100 border-4 border-black p-6 text-center">
              <TrendingUp className="mx-auto mb-4 text-green-600" size={48} />
              <div className="text-2xl font-mono font-bold text-black mb-2">
                {project.metrics.conversion}
              </div>
              <div className="font-mono text-sm text-gray-600">
                Business Impact
              </div>
            </div>
            <div className="bg-purple-100 border-4 border-black p-6 text-center">
              <Users className="mx-auto mb-4 text-blue-600" size={48} />
              <div className="text-2xl font-mono font-bold text-black mb-2">
                {project.metrics.users}
              </div>
              <div className="font-mono text-sm text-gray-600">
                User Engagement
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Testimonials */}
      {testimonials.length > 0 && (
        <div>
          <h3 className="font-mono font-bold text-black mb-6 text-2xl border-b-4 border-black pb-2">
            Client Testimonials
          </h3>
          <div className="space-y-6">
            {testimonials.slice(0, 2).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border-4 border-black p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center">
                      <Image
                        src={testimonial.company_logo}
                        alt={testimonial.company}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                      <span className="font-mono font-bold text-xl text-black hidden">
                        {testimonial.client_name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-400 fill-current"
                          size={16}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-gray-700 mb-4 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-black">
                          {testimonial.client_name}
                        </div>
                        <div className="font-mono text-sm text-gray-600">
                          {testimonial.client_title} at {testimonial.company}
                        </div>
                      </div>
                      {testimonial.results && (
                        <div className="bg-yellow-400 border-2 border-black px-3 py-1">
                          <div className="font-mono text-xs font-bold text-black">
                            {testimonial.results}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Impact Summary */}
      <div className="bg-yellow-400 border-4 border-black p-6">
        <h3 className="font-mono font-bold text-black mb-4 text-xl">
          Project Impact Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono font-bold text-black mb-3">
              Technical Achievements
            </h4>
            <ul className="font-mono text-black space-y-1">
              <li>• Delivered on time and within budget</li>
              <li>• Exceeded performance requirements</li>
              <li>• Implemented best practices and standards</li>
              <li>• Achieved high code quality metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono font-bold text-black mb-3">
              Business Results
            </h4>
            <ul className="font-mono text-black space-y-1">
              <li>• Improved user experience and engagement</li>
              <li>• Increased conversion rates and revenue</li>
              <li>• Enhanced brand presence and credibility</li>
              <li>• Provided scalable foundation for growth</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
