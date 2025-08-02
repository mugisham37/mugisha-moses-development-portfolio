"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Database,
  Smartphone,
  Globe,
  Layers,
  TrendingUp,
  Users,
  Star,
  Filter,
  BarChart3,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { Project } from "@/lib/types";
import { ComplexityLevel, ProjectCategory, Industry } from "@/types/enhanced";

interface TechnologyStats {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "design";
  projectCount: number;
  usagePercentage: number;
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  trendScore: number;
}

interface CategoryStats {
  category: ProjectCategory;
  projectCount: number;
  percentage: number;
  topTechnologies: string[];
  completionRate: number;
  clientSatisfaction: number;
}

interface TechnologyCategoryShowcaseProps {
  projects: readonly Project[];
  onFilterChange?: (filters: {
    technologies?: string[];
    categories?: ProjectCategory[];
    industries?: Industry[];
    complexity?: ComplexityLevel[];
  }) => void;
  className?: string;
}

const TECHNOLOGY_CATEGORIES = {
  frontend: { icon: Globe, color: "bg-blue-500", label: "Frontend" },
  backend: { icon: Code, color: "bg-green-500", label: "Backend" },
  database: { icon: Database, color: "bg-purple-500", label: "Database" },
  devops: { icon: Layers, color: "bg-orange-500", label: "DevOps" },
  mobile: { icon: Smartphone, color: "bg-pink-500", label: "Mobile" },
  design: { icon: Target, color: "bg-yellow-500", label: "Design" },
} as const;

const COMPLEXITY_COLORS = {
  simple: "bg-green-200 text-green-800",
  moderate: "bg-yellow-200 text-yellow-800",
  complex: "bg-orange-200 text-orange-800",
  enterprise: "bg-red-200 text-red-800",
} as const;

export function TechnologyCategoryShowcase({
  projects,
  onFilterChange,
  className = "",
}: TechnologyCategoryShowcaseProps) {
  const [activeView, setActiveView] = useState<
    "technologies" | "categories" | "industries" | "insights"
  >("technologies");
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory | null>(null);
  const [sortBy, setSortBy] = useState<
    "usage" | "complexity" | "trend" | "proficiency"
  >("usage");

  // Helper function to categorize technologies
  const categorizeTechnology = useCallback(
    (tech: string): TechnologyStats["category"] => {
      const frontend = [
        "React",
        "Vue",
        "Angular",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind",
      ];
      const backend = ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "C#"];
      const database = ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"];
      const devops = ["Docker", "AWS", "Azure", "Kubernetes", "Jenkins"];
      const mobile = ["React Native", "Flutter", "Swift", "Kotlin"];

      if (frontend.some((f) => tech.toLowerCase().includes(f.toLowerCase())))
        return "frontend";
      if (backend.some((b) => tech.toLowerCase().includes(b.toLowerCase())))
        return "backend";
      if (database.some((d) => tech.toLowerCase().includes(d.toLowerCase())))
        return "database";
      if (devops.some((d) => tech.toLowerCase().includes(d.toLowerCase())))
        return "devops";
      if (mobile.some((m) => tech.toLowerCase().includes(m.toLowerCase())))
        return "mobile";
      return "design";
    },
    []
  );

  // Calculate technology statistics
  const technologyStats = useMemo((): TechnologyStats[] => {
    const techMap = new Map<string, TechnologyStats>();

    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        if (!techMap.has(tech)) {
          const category = categorizeTechnology(tech);

          techMap.set(tech, {
            name: tech,
            category,
            projectCount: 0,
            usagePercentage: 0,
            proficiencyLevel: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
            trendScore: Math.random() * 100,
          });
        }

        const stat = techMap.get(tech)!;
        stat.projectCount++;
      });
    });

    const totalProjects = projects.length;
    const stats = Array.from(techMap.values()).map((stat) => ({
      ...stat,
      usagePercentage:
        totalProjects > 0 ? (stat.projectCount / totalProjects) * 100 : 0,
    }));

    return stats.sort((a, b) => {
      switch (sortBy) {
        case "usage":
          return b.projectCount - a.projectCount;
        case "trend":
          return b.trendScore - a.trendScore;
        case "proficiency":
          return b.proficiencyLevel - a.proficiencyLevel;
        default:
          return b.projectCount - a.projectCount;
      }
    });
  }, [projects, sortBy, categorizeTechnology]);

  // Calculate category statistics
  const categoryStats = useMemo((): CategoryStats[] => {
    const categoryMap = new Map<ProjectCategory, CategoryStats>();

    projects.forEach((project) => {
      if (!categoryMap.has(project.category)) {
        categoryMap.set(project.category, {
          category: project.category,
          projectCount: 0,
          percentage: 0,
          topTechnologies: [],
          completionRate: Math.random() * 20 + 80,
          clientSatisfaction: Math.random() * 1 + 4,
        });
      }

      const stat = categoryMap.get(project.category)!;
      stat.projectCount++;

      project.technologies.forEach((tech) => {
        if (!stat.topTechnologies.includes(tech)) {
          stat.topTechnologies.push(tech);
        }
      });
    });

    const totalProjects = projects.length;
    return Array.from(categoryMap.values())
      .map((stat) => ({
        ...stat,
        percentage:
          totalProjects > 0 ? (stat.projectCount / totalProjects) * 100 : 0,
        topTechnologies: stat.topTechnologies.slice(0, 5),
      }))
      .sort((a, b) => b.projectCount - a.projectCount);
  }, [projects]);

  const handleTechnologyClick = useCallback(
    (tech: string) => {
      setSelectedTechnology(tech === selectedTechnology ? null : tech);
      if (onFilterChange) {
        onFilterChange({
          technologies: tech === selectedTechnology ? [] : [tech],
        });
      }
    },
    [selectedTechnology, onFilterChange]
  );

  const handleCategoryClick = useCallback(
    (category: ProjectCategory) => {
      setSelectedCategory(category === selectedCategory ? null : category);
      if (onFilterChange) {
        onFilterChange({
          categories: category === selectedCategory ? [] : [category],
        });
      }
    },
    [selectedCategory, onFilterChange]
  );

  const renderTechnologyMatrix = () => (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {(["usage", "trend", "proficiency"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 text-sm font-mono font-bold border-2 border-black transition-colors ${
                sortBy === sort
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-400"
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-sm font-mono text-gray-600">
          {technologyStats.length} technologies
        </div>
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {technologyStats.map((tech, index) => {
          const categoryInfo = TECHNOLOGY_CATEGORIES[tech.category];
          const Icon = categoryInfo.icon;

          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-4 border-black bg-white cursor-pointer transition-all hover:shadow-lg ${
                selectedTechnology === tech.name ? "ring-4 ring-yellow-400" : ""
              }`}
              onClick={() => handleTechnologyClick(tech.name)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${categoryInfo.color} text-white rounded`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg">{tech.name}</h3>
                  <p className="text-xs text-gray-600 capitalize">
                    {categoryInfo.label}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">Projects:</span>
                  <span className="font-bold">{tech.projectCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">Usage:</span>
                  <span className="font-bold">
                    {tech.usagePercentage.toFixed(1)}%
                  </span>
                </div>

                {/* Usage Bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-500 h-2 rounded transition-all duration-500"
                    style={{ width: `${tech.usagePercentage}%` }}
                  />
                </div>

                {/* Proficiency Level */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">Proficiency:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Star
                        key={level}
                        size={12}
                        className={
                          level <= tech.proficiencyLevel
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">Trend:</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      size={12}
                      className={
                        tech.trendScore > 70
                          ? "text-green-500"
                          : tech.trendScore > 40
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    />
                    <span className="text-xs font-bold">
                      {tech.trendScore.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderCategoryShowcase = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 border-4 border-black bg-white cursor-pointer transition-all hover:shadow-lg ${
              selectedCategory === category.category
                ? "ring-4 ring-yellow-400"
                : ""
            }`}
            onClick={() => handleCategoryClick(category.category)}
          >
            <div className="text-center mb-4">
              <h3 className="text-2xl font-mono font-bold capitalize mb-2">
                {category.category}
              </h3>
              <div className="text-4xl font-bold text-blue-600">
                {category.projectCount}
              </div>
              <div className="text-sm text-gray-600">
                {category.percentage.toFixed(1)}% of projects
              </div>
            </div>

            {/* Progress Ring */}
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 30 * (1 - category.percentage / 100)
                    }`}
                    className="text-blue-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {category.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">Completion Rate:</span>
                <span className="font-bold text-green-600">
                  {category.completionRate.toFixed(0)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-mono">Client Rating:</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="font-bold">
                    {category.clientSatisfaction.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Top Technologies */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-mono text-gray-600 mb-2">
                  Top Technologies:
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.topTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-100 px-2 py-1 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-8">
      {/* Technology Combinations */}
      <div className="p-6 border-4 border-black bg-white">
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center gap-2">
          <Zap className="text-yellow-500" />
          Popular Technology Combinations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              combo: ["React", "Node.js", "MongoDB"],
              projects: 8,
              success: 95,
            },
            {
              combo: ["Vue.js", "TypeScript", "PostgreSQL"],
              projects: 5,
              success: 92,
            },
            { combo: ["React Native", "Firebase"], projects: 3, success: 88 },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border-2 border-gray-300"
            >
              <div className="flex flex-wrap gap-1 mb-2">
                {item.combo.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-sm">
                <span>{item.projects} projects</span>
                <span className="text-green-600">{item.success}% success</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="p-6 border-4 border-black bg-white">
        <h3 className="text-xl font-mono font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Complexity Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            ["simple", "moderate", "complex", "enterprise"] as ComplexityLevel[]
          ).map((level) => {
            const count = projects.filter((p) => {
              const complexity =
                p.technologies.length <= 2
                  ? "simple"
                  : p.technologies.length <= 4
                  ? "moderate"
                  : p.technologies.length <= 6
                  ? "complex"
                  : "enterprise";
              return complexity === level;
            }).length;
            const percentage =
              projects.length > 0 ? (count / projects.length) * 100 : 0;

            return (
              <div key={level} className="text-center">
                <div
                  className={`p-4 rounded-lg ${COMPLEXITY_COLORS[level]} mb-2`}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm capitalize">{level}</div>
                </div>
                <div className="text-xs text-gray-600">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b-4 border-black pb-4">
          {[
            { id: "technologies", label: "Technology Matrix", icon: Code },
            { id: "categories", label: "Project Categories", icon: Layers },
            {
              id: "insights",
              label: "Insights & Recommendations",
              icon: Target,
            },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`flex items-center gap-2 px-4 py-2 font-mono font-bold border-2 border-black transition-colors ${
                activeView === id
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-400"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === "technologies" && renderTechnologyMatrix()}
          {activeView === "categories" && renderCategoryShowcase()}
          {activeView === "insights" && renderInsights()}
        </motion.div>
      </AnimatePresence>

      {/* Selected Technology/Category Info */}
      <AnimatePresence>
        {(selectedTechnology || selectedCategory) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 p-4 bg-white border-4 border-black shadow-lg max-w-sm z-50"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-mono font-bold">
                {selectedTechnology || selectedCategory}
              </h4>
              <button
                onClick={() => {
                  setSelectedTechnology(null);
                  setSelectedCategory(null);
                }}
                className="text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedTechnology && (
                <div>
                  <p>Click on related technologies to explore combinations</p>
                  <p className="mt-1">
                    Used in{" "}
                    {
                      technologyStats.find((t) => t.name === selectedTechnology)
                        ?.projectCount
                    }{" "}
                    projects
                  </p>
                </div>
              )}
              {selectedCategory && (
                <div>
                  <p>Filter applied to show {selectedCategory} projects only</p>
                  <p className="mt-1">
                    {
                      categoryStats.find((c) => c.category === selectedCategory)
                        ?.projectCount
                    }{" "}
                    projects in this category
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TechnologyCategoryShowcase;
