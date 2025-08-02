"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Code,
  BarChart3,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Award,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Project } from "@/lib/types";
import { EnhancedProject } from "@/types/enhanced";

interface ProjectCaseStudyModalProps {
  project: Project | EnhancedProject;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: "prev" | "next") => void;
  relatedProjects?: Project[];
}

type TabType = "overview" | "technical" | "results" | "process";

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// Image Gallery Component with zoom functionality
function ImageGallery({
  images,
  currentIndex,
  onIndexChange,
}: ImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
    }
  };

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  return (
    <div className="relative">
      {/* Main Image Display */}
      <div className="relative aspect-video bg-gray-100 border-4 border-black overflow-hidden">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Project screenshot ${currentIndex + 1}`}
          className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
          onClick={handleImageClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 hover:bg-black transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 hover:bg-black transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-black/80 text-white p-2 text-sm font-mono">
          <ZoomIn size={16} className="inline mr-1" />
          {isZoomed ? "Click to zoom out" : "Click to zoom in"}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 font-mono text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`flex-shrink-0 w-20 h-12 border-2 overflow-hidden ${
                index === currentIndex
                  ? "border-yellow-400"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Technical Details Section
function TechnicalDetailsSection({
  project,
}: {
  project: Project | EnhancedProject;
}) {
  const codeSnippets = [
    {
      title: "Component Architecture",
      language: "typescript",
      code: `// Example component structure
interface ProjectProps {
  data: ProjectData;
  onUpdate: (data: ProjectData) => void;
}

export const ProjectComponent: React.FC<ProjectProps> = ({ 
  data, 
  onUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="project-container">
      {/* Component implementation */}
    </div>
  );
};`,
    },
    {
      title: "API Integration",
      language: "javascript",
      code: `// API service implementation
const projectService = {
  async fetchProject(id) {
    const response = await fetch(\`/api/projects/\${id}\`);
    return response.json();
  },
  
  async updateProject(id, data) {
    return fetch(\`/api/projects/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Technology Stack */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center">
          <Code className="mr-2" size={20} />
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {project.technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-gray-100 border-2 border-black p-3 text-center"
            >
              <div className="font-mono font-bold text-sm">
                {typeof tech === "string" ? tech : tech.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Overview */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Architecture Overview
        </h3>
        <div className="bg-gray-50 border-4 border-black p-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-yellow-400 border-2 border-black px-4 py-2 font-mono font-bold">
              Frontend Layer
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <ArrowLeft className="transform rotate-90" size={24} />
          </div>
          <div className="text-center mb-4">
            <div className="inline-block bg-blue-400 border-2 border-black px-4 py-2 font-mono font-bold">
              API Layer
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <ArrowLeft className="transform rotate-90" size={24} />
          </div>
          <div className="text-center">
            <div className="inline-block bg-green-400 border-2 border-black px-4 py-2 font-mono font-bold">
              Database Layer
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">Code Examples</h3>
        <div className="space-y-4">
          {codeSnippets.map((snippet, index) => (
            <div key={index} className="border-4 border-black">
              <div className="bg-black text-white px-4 py-2 font-mono font-bold">
                {snippet.title}
              </div>
              <div className="bg-gray-900 text-green-400 p-4 overflow-x-auto">
                <pre className="font-mono text-sm">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-100 border-4 border-black p-4 text-center">
            <div className="text-2xl font-mono font-bold text-green-600">
              95
            </div>
            <div className="font-mono text-sm">Lighthouse Score</div>
          </div>
          <div className="bg-blue-100 border-4 border-black p-4 text-center">
            <div className="text-2xl font-mono font-bold text-blue-600">
              1.2s
            </div>
            <div className="font-mono text-sm">Load Time</div>
          </div>
          <div className="bg-purple-100 border-4 border-black p-4 text-center">
            <div className="text-2xl font-mono font-bold text-purple-600">
              0.1
            </div>
            <div className="font-mono text-sm">CLS Score</div>
          </div>
          <div className="bg-orange-100 border-4 border-black p-4 text-center">
            <div className="text-2xl font-mono font-bold text-orange-600">
              98%
            </div>
            <div className="font-mono text-sm">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Business Results Section
function BusinessResultsSection({
  project,
}: {
  project: Project | EnhancedProject;
}) {
  const metrics =
    "metrics" in project && project.metrics
      ? project.metrics
      : {
          performance: "95% Lighthouse Score",
          conversion: "25% increase",
          users: "10K+ users",
        };

  const chartData = [
    { label: "Before", value: 65, color: "bg-red-400" },
    { label: "After", value: 90, color: "bg-green-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Key Business Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-100 border-4 border-black p-6 text-center">
            <TrendingUp className="mx-auto mb-2" size={32} />
            <div className="text-2xl font-mono font-bold text-yellow-600 mb-1">
              {metrics.performance}
            </div>
            <div className="font-mono text-sm">Performance Score</div>
          </div>
          <div className="bg-green-100 border-4 border-black p-6 text-center">
            <Target className="mx-auto mb-2" size={32} />
            <div className="text-2xl font-mono font-bold text-green-600 mb-1">
              {metrics.conversion}
            </div>
            <div className="font-mono text-sm">Conversion Rate</div>
          </div>
          <div className="bg-blue-100 border-4 border-black p-6 text-center">
            <Users className="mx-auto mb-2" size={32} />
            <div className="text-2xl font-mono font-bold text-blue-600 mb-1">
              {metrics.users}
            </div>
            <div className="font-mono text-sm">Active Users</div>
          </div>
        </div>
      </div>

      {/* Performance Comparison Chart */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Performance Improvement
        </h3>
        <div className="bg-white border-4 border-black p-6">
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 font-mono font-bold text-sm">
                  {item.label}
                </div>
                <div className="flex-1 bg-gray-200 border-2 border-black h-8 relative">
                  <motion.div
                    className={`${item.color} h-full border-r-2 border-black flex items-center justify-end pr-2`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    <span className="font-mono font-bold text-sm text-black">
                      {item.value}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Analysis */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Return on Investment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 border-4 border-black p-6">
            <h4 className="font-mono font-bold mb-4">Investment Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span>Development Cost:</span>
                <span className="font-bold">$15,000</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>Timeline:</span>
                <span className="font-bold">8 weeks</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>Team Size:</span>
                <span className="font-bold">3 developers</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-4 border-black p-6">
            <h4 className="font-mono font-bold mb-4">Business Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span>Revenue Increase:</span>
                <span className="font-bold text-green-600">+$50,000/month</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>Cost Savings:</span>
                <span className="font-bold text-green-600">$20,000/year</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span>ROI:</span>
                <span className="font-bold text-green-600">400%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Testimonial */}
      <div className="bg-yellow-50 border-4 border-black p-6">
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center">
          <Award className="mr-2" size={20} />
          Client Feedback
        </h3>
        <blockquote className="font-mono text-lg italic mb-4">
          "This project exceeded our expectations in every way. The performance
          improvements and user experience enhancements have directly
          contributed to our business growth."
        </blockquote>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 border-2 border-black rounded-full"></div>
          <div>
            <div className="font-mono font-bold">Sarah Johnson</div>
            <div className="font-mono text-sm text-gray-600">
              CEO, TechStart Inc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Development Process Section
function DevelopmentProcessSection({
  project,
}: {
  project: Project | EnhancedProject;
}) {
  const phases = [
    {
      name: "Discovery & Planning",
      duration: "1 week",
      deliverables: [
        "Requirements Analysis",
        "Technical Specification",
        "Project Timeline",
      ],
      status: "completed",
    },
    {
      name: "Design & Prototyping",
      duration: "2 weeks",
      deliverables: ["UI/UX Design", "Interactive Prototype", "Design System"],
      status: "completed",
    },
    {
      name: "Development",
      duration: "4 weeks",
      deliverables: ["Core Features", "API Integration", "Testing Suite"],
      status: "completed",
    },
    {
      name: "Testing & Optimization",
      duration: "1 week",
      deliverables: ["Performance Testing", "Bug Fixes", "Optimization"],
      status: "completed",
    },
    {
      name: "Deployment & Launch",
      duration: "1 week",
      deliverables: [
        "Production Deployment",
        "Monitoring Setup",
        "Documentation",
      ],
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center">
          <Calendar className="mr-2" size={20} />
          Development Timeline
        </h3>
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center font-mono font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 bg-white border-4 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-mono font-bold text-lg">{phase.name}</h4>
                  <span className="bg-black text-white px-2 py-1 font-mono text-xs">
                    {phase.duration}
                  </span>
                </div>
                <div className="space-y-1">
                  {phase.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 font-mono text-sm"
                    >
                      <div className="w-2 h-2 bg-green-400 border border-black"></div>
                      {deliverable}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Development Methodology
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-4 border-black p-6">
            <h4 className="font-mono font-bold mb-4">Agile Approach</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>• 2-week sprints</li>
              <li>• Daily standups</li>
              <li>• Sprint reviews</li>
              <li>• Continuous integration</li>
              <li>• Regular client feedback</li>
            </ul>
          </div>
          <div className="bg-green-50 border-4 border-black p-6">
            <h4 className="font-mono font-bold mb-4">Quality Assurance</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>• Test-driven development</li>
              <li>• Code reviews</li>
              <li>• Automated testing</li>
              <li>• Performance monitoring</li>
              <li>• Security audits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Challenges & Solutions */}
      <div>
        <h3 className="text-xl font-mono font-bold mb-4">
          Challenges & Solutions
        </h3>
        <div className="space-y-4">
          <div className="bg-red-50 border-4 border-black p-6">
            <h4 className="font-mono font-bold text-red-600 mb-2">Challenge</h4>
            <p className="font-mono text-sm mb-4">
              Complex data visualization requirements with real-time updates
              needed to handle large datasets efficiently.
            </p>
            <h4 className="font-mono font-bold text-green-600 mb-2">
              Solution
            </h4>
            <p className="font-mono text-sm">
              Implemented virtual scrolling and data pagination with WebSocket
              connections for real-time updates, reducing memory usage by 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Related Projects Section
function RelatedProjectsSection({
  relatedProjects,
}: {
  relatedProjects?: Project[];
}) {
  if (!relatedProjects || relatedProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-mono text-gray-600">
          No related projects available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedProjects.slice(0, 4).map((project) => (
        <div
          key={project.id}
          className="bg-white border-4 border-black p-4 hover:bg-yellow-50 transition-colors cursor-pointer"
        >
          <div className="aspect-video bg-gray-200 border-2 border-black mb-3 overflow-hidden">
            <img
              src={project.images.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-mono font-bold mb-2">{project.title}</h4>
          <p className="font-mono text-sm text-gray-600 mb-3">
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
      ))}
    </div>
  );
}

export function ProjectCaseStudyModal({
  project,
  isOpen,
  onClose,
  onNavigate,
  relatedProjects,
}: ProjectCaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get all available images
  const allImages = (() => {
    if (Array.isArray(project.images)) {
      // EnhancedProject with ProjectImage[]
      return project.images.map((img) => img.url);
    } else {
      // Regular Project with image object
      return [
        project.images.thumbnail,
        project.images.mockup,
        ...(project.images.screenshots || []),
      ].filter(Boolean);
    }
  })();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (onNavigate) onNavigate("prev");
          break;
        case "ArrowRight":
          if (onNavigate) onNavigate("next");
          break;
        case "Tab":
          // Trap focus within modal
          if (modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[
              focusableElements.length - 1
            ] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "technical", label: "Technical", icon: Code },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "process", label: "Process", icon: Calendar },
  ] as const;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          ref={modalRef}
          className="relative w-full max-w-6xl max-h-[90vh] bg-white border-4 border-black overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-mono font-bold">{project.title}</h2>
              <span className="bg-yellow-400 text-black px-2 py-1 font-mono text-xs uppercase">
                {project.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Navigation buttons */}
              {onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate("prev")}
                    className="p-2 hover:bg-white/20 transition-colors"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => onNavigate("next")}
                    className="p-2 hover:bg-white/20 transition-colors"
                    aria-label="Next project"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b-4 border-black bg-gray-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-mono font-bold whitespace-nowrap border-r-2 border-black transition-colors ${
                      activeTab === tab.id
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Project Description */}
                      <div>
                        <h3 className="text-xl font-mono font-bold mb-4">
                          Project Overview
                        </h3>
                        <p className="font-mono text-gray-700 leading-relaxed mb-6">
                          {project.longDescription}
                        </p>
                      </div>

                      {/* Image Gallery */}
                      <div>
                        <h3 className="text-xl font-mono font-bold mb-4">
                          Project Gallery
                        </h3>
                        <ImageGallery
                          images={allImages}
                          currentIndex={currentImageIndex}
                          onIndexChange={setCurrentImageIndex}
                        />
                      </div>

                      {/* Quick Links */}
                      <div className="flex gap-4">
                        {"links" in project && project.links?.live && (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-yellow-400 border-4 border-black px-4 py-2 font-mono font-bold hover:bg-yellow-500 transition-colors"
                          >
                            <ExternalLink size={16} />
                            View Live
                          </a>
                        )}
                        {"links" in project && project.links?.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-black text-white border-4 border-black px-4 py-2 font-mono font-bold hover:bg-gray-800 transition-colors"
                          >
                            <Github size={16} />
                            View Code
                          </a>
                        )}
                      </div>

                      {/* Related Projects */}
                      {relatedProjects && relatedProjects.length > 0 && (
                        <div>
                          <h3 className="text-xl font-mono font-bold mb-4">
                            Related Projects
                          </h3>
                          <RelatedProjectsSection
                            relatedProjects={relatedProjects}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "technical" && (
                    <TechnicalDetailsSection project={project} />
                  )}
                  {activeTab === "results" && (
                    <BusinessResultsSection project={project} />
                  )}
                  {activeTab === "process" && (
                    <DevelopmentProcessSection project={project} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProjectCaseStudyModal;
