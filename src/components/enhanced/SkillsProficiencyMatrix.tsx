"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Skills data interfaces
interface Skill {
  id: string;
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "devops"
    | "mobile"
    | "design"
    | "testing";
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  lastUsed: Date;
  certifications?: string[];
  relatedProjects: string[];
  learningPath?: LearningMilestone[];
  description: string;
  icon: string;
  color: string;
  trending?: boolean;
}

interface LearningMilestone {
  date: Date;
  level: number;
  achievement: string;
  project?: string;
}

interface SkillsProficiencyMatrixProps {
  className?: string;
  skills?: Skill[];
  enableFiltering?: boolean;
  enableSearch?: boolean;
  showLearningTrajectory?: boolean;
  showProjectConnections?: boolean;
  displayMode?: "grid" | "matrix" | "timeline";
}

const SkillsProficiencyMatrix: React.FC<SkillsProficiencyMatrixProps> = ({
  className,
  skills = defaultSkills,
  enableFiltering = true,
  enableSearch = true,
  showLearningTrajectory = true,
  showProjectConnections = true,
  displayMode = "grid",
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "proficiency" | "experience" | "recent" | "name"
  >("proficiency");
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Filter and sort logic
  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skills.filter((skill) => {
      const matchesCategory =
        filterCategory === "all" || skill.category === filterCategory;
      const matchesSearch =
        searchQuery === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    // Sort skills
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "proficiency":
          return b.proficiencyLevel - a.proficiencyLevel;
        case "experience":
          return b.yearsOfExperience - a.yearsOfExperience;
        case "recent":
          return b.lastUsed.getTime() - a.lastUsed.getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [skills, filterCategory, searchQuery, sortBy]);

  const handleSkillClick = useCallback(
    (skillId: string) => {
      setSelectedSkill(selectedSkill === skillId ? null : skillId);
    },
    [selectedSkill]
  );

  const handleSkillHover = useCallback((skillId: string | null) => {
    setHoveredSkill(skillId);
  }, []);

  const categories = [
    { id: "all", label: "All Skills", icon: "🎯", count: skills.length },
    {
      id: "frontend",
      label: "Frontend",
      icon: "🎨",
      count: skills.filter((s) => s.category === "frontend").length,
    },
    {
      id: "backend",
      label: "Backend",
      icon: "⚙️",
      count: skills.filter((s) => s.category === "backend").length,
    },
    {
      id: "database",
      label: "Database",
      icon: "🗄️",
      count: skills.filter((s) => s.category === "database").length,
    },
    {
      id: "devops",
      label: "DevOps",
      icon: "🚀",
      count: skills.filter((s) => s.category === "devops").length,
    },
    {
      id: "mobile",
      label: "Mobile",
      icon: "📱",
      count: skills.filter((s) => s.category === "mobile").length,
    },
    {
      id: "design",
      label: "Design",
      icon: "✨",
      count: skills.filter((s) => s.category === "design").length,
    },
    {
      id: "testing",
      label: "Testing",
      icon: "🧪",
      count: skills.filter((s) => s.category === "testing").length,
    },
  ];

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Novice";
      case 3:
        return "Intermediate";
      case 4:
        return "Advanced";
      case 5:
        return "Expert";
      default:
        return "Unknown";
    }
  };

  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "border-pink-500 bg-pink-50";
      case "backend":
        return "border-blue-500 bg-blue-50";
      case "database":
        return "border-purple-500 bg-purple-50";
      case "devops":
        return "border-green-500 bg-green-50";
      case "mobile":
        return "border-orange-500 bg-orange-50";
      case "design":
        return "border-red-500 bg-red-50";
      case "testing":
        return "border-teal-500 bg-teal-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  return (
    <section className={cn("py-20 bg-brutalist-light-gray", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
              Skills Proficiency Matrix
            </h2>
            <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
              Interactive exploration of technical expertise, proficiency
              levels, and learning trajectory across the full development stack.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="mb-12 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {enableSearch && (
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 font-mono border-3 border-black bg-white focus:border-brutalist-yellow focus:outline-none"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 font-mono font-bold text-sm border-3 border-black bg-white focus:border-brutalist-yellow focus:outline-none"
                >
                  <option value="proficiency">Sort by Proficiency</option>
                  <option value="experience">Sort by Experience</option>
                  <option value="recent">Sort by Recent Use</option>
                  <option value="name">Sort by Name</option>
                </select>

                {/* View Mode Toggle */}
                <button
                  onClick={() =>
                    setViewMode(
                      viewMode === "overview" ? "detailed" : "overview"
                    )
                  }
                  className={cn(
                    "px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider border-3 transition-all duration-300",
                    viewMode === "detailed"
                      ? "bg-brutalist-yellow border-black text-black"
                      : "bg-white border-black text-black hover:bg-brutalist-yellow"
                  )}
                >
                  {viewMode === "overview" ? "📊 Detailed View" : "📋 Overview"}
                </button>
              </div>
            </div>

            {/* Category Filters */}
            {enableFiltering && (
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setFilterCategory(category.id)}
                    className={cn(
                      "px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider border-3 transition-all duration-300 relative",
                      filterCategory === category.id
                        ? "bg-brutalist-yellow border-black text-black"
                        : "bg-white border-black text-black hover:bg-brutalist-yellow"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                    <span className="ml-2 text-xs opacity-70">
                      ({category.count})
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            <AnimatePresence>
              {filteredAndSortedSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "relative border-5 border-black p-6 cursor-pointer transition-all duration-300",
                    selectedSkill === skill.id
                      ? "bg-brutalist-yellow transform scale-105"
                      : hoveredSkill === skill.id
                      ? "bg-brutalist-light-gray transform -translate-y-2"
                      : "bg-white hover:bg-brutalist-light-gray hover:-translate-y-1",
                    getCategoryColor(skill.category)
                  )}
                  onClick={() => handleSkillClick(skill.id)}
                  onMouseEnter={() => handleSkillHover(skill.id)}
                  onMouseLeave={() => handleSkillHover(null)}
                  whileHover={{ y: -5 }}
                >
                  {/* Trending Badge */}
                  {skill.trending && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-mono font-bold px-2 py-1 border-2 border-black">
                      🔥 HOT
                    </div>
                  )}

                  {/* Skill Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{skill.icon}</div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2 border-black",
                          getProficiencyColor(skill.proficiencyLevel)
                        )}
                      />
                      <div className="text-xs font-mono font-bold mt-1">
                        LVL {skill.proficiencyLevel}
                      </div>
                    </div>
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-lg font-black font-mono uppercase tracking-wider mb-2">
                    {skill.name}
                  </h3>

                  {/* Proficiency Indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold uppercase">
                        {getProficiencyLabel(skill.proficiencyLevel)}
                      </span>
                      <span className="text-xs font-mono text-gray-600">
                        {skill.yearsOfExperience}y exp
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 border-2 border-black">
                      <motion.div
                        className={cn(
                          "h-full",
                          getProficiencyColor(skill.proficiencyLevel)
                        )}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(skill.proficiencyLevel / 5) * 100}%`,
                        }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <div className="font-bold">Last Used</div>
                      <div className="text-gray-600">
                        {skill.lastUsed.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Projects</div>
                      <div className="text-gray-600">
                        {skill.relatedProjects.length}
                      </div>
                    </div>
                  </div>

                  {/* Expand Indicator */}
                  <div className="flex justify-center mt-4">
                    <motion.div
                      animate={{
                        rotate: selectedSkill === skill.id ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-black"
                    >
                      ▼
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detailed Skill View Modal */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSkill(null)}
              >
                <motion.div
                  className="bg-white border-5 border-black p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const skill = skills.find((s) => s.id === selectedSkill);
                    if (!skill) return null;

                    return (
                      <>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{skill.icon}</div>
                            <div>
                              <h3 className="text-2xl font-black font-mono uppercase tracking-wider">
                                {skill.name}
                              </h3>
                              <div className="flex items-center gap-4 mt-2">
                                <span
                                  className={cn(
                                    "px-3 py-1 text-xs font-mono font-bold uppercase border-2",
                                    getCategoryColor(skill.category)
                                  )}
                                >
                                  {skill.category}
                                </span>
                                <span className="text-sm font-mono text-gray-600">
                                  {skill.yearsOfExperience} years experience
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedSkill(null)}
                            className="text-2xl font-bold hover:bg-brutalist-yellow p-2 border-3 border-black bg-white"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Skill Description */}
                        <div className="mb-8">
                          <p className="font-mono text-gray-700 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>

                        {/* Proficiency Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h4 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
                              Proficiency Breakdown
                            </h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="font-mono">Current Level</span>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "w-4 h-4 rounded-full",
                                      getProficiencyColor(
                                        skill.proficiencyLevel
                                      )
                                    )}
                                  />
                                  <span className="font-mono font-bold">
                                    {getProficiencyLabel(
                                      skill.proficiencyLevel
                                    )}{" "}
                                    ({skill.proficiencyLevel}/5)
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-mono">Experience</span>
                                <span className="font-mono font-bold">
                                  {skill.yearsOfExperience} years
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-mono">Last Used</span>
                                <span className="font-mono font-bold">
                                  {skill.lastUsed.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
                              Project Connections
                            </h4>
                            <div className="space-y-2">
                              {skill.relatedProjects
                                .slice(0, 5)
                                .map((project, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 bg-brutalist-yellow" />
                                    <span className="font-mono text-sm">
                                      {project}
                                    </span>
                                  </div>
                                ))}
                              {skill.relatedProjects.length > 5 && (
                                <div className="text-sm font-mono text-gray-600">
                                  +{skill.relatedProjects.length - 5} more
                                  projects
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Learning Trajectory */}
                        {showLearningTrajectory &&
                          skill.learningPath &&
                          skill.learningPath.length > 0 && (
                            <div className="mb-8">
                              <h4 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
                                Learning Trajectory
                              </h4>
                              <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-1 bg-brutalist-yellow" />
                                <div className="space-y-6">
                                  {skill.learningPath.map(
                                    (milestone, index) => (
                                      <div
                                        key={index}
                                        className="relative flex items-start gap-4"
                                      >
                                        <div className="w-8 h-8 bg-brutalist-yellow border-3 border-black flex items-center justify-center font-mono font-bold text-sm">
                                          {milestone.level}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-mono font-bold text-sm">
                                            {milestone.date.toLocaleDateString(
                                              "en-US",
                                              {
                                                month: "short",
                                                year: "numeric",
                                              }
                                            )}
                                          </div>
                                          <div className="font-mono text-sm text-gray-700">
                                            {milestone.achievement}
                                          </div>
                                          {milestone.project && (
                                            <div className="font-mono text-xs text-gray-500 mt-1">
                                              Project: {milestone.project}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Certifications */}
                        {skill.certifications &&
                          skill.certifications.length > 0 && (
                            <div>
                              <h4 className="font-mono font-bold text-lg uppercase tracking-wider mb-4">
                                Certifications & Achievements
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skill.certifications.map((cert, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 border-3 border-black bg-brutalist-light-gray"
                                  >
                                    <div className="text-xl">🏆</div>
                                    <span className="font-mono text-sm">
                                      {cert}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skills Summary */}
          <motion.div
            className="mt-16 bg-brutalist-black border-5 border-brutalist-yellow p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black font-mono uppercase tracking-wider text-white mb-4">
                Skills Overview
              </h3>
              <p className="font-mono text-brutalist-gray">
                Comprehensive breakdown of technical expertise and proficiency
                levels
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                  {skills.length}
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Total Skills
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                  {skills.filter((s) => s.proficiencyLevel >= 4).length}
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Expert Level
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                  {Math.round(
                    skills.reduce((acc, s) => acc + s.yearsOfExperience, 0) /
                      skills.length
                  )}
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Avg Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                  {skills.reduce((acc, s) => acc + s.relatedProjects.length, 0)}
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Project Applications
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Default skills data
const defaultSkills: Skill[] = [
  {
    id: "react",
    name: "React",
    category: "frontend",
    proficiencyLevel: 5,
    yearsOfExperience: 4,
    lastUsed: new Date("2024-01-15"),
    certifications: [
      "React Developer Certification",
      "Advanced React Patterns",
    ],
    relatedProjects: [
      "E-commerce Platform",
      "Portfolio Website",
      "Task Management App",
      "Real-time Chat",
      "Dashboard Analytics",
    ],
    description:
      "Expert-level proficiency in React ecosystem including hooks, context, performance optimization, and modern patterns. Extensive experience building scalable applications.",
    icon: "⚛️",
    color: "#61DAFB",
    trending: true,
    learningPath: [
      {
        date: new Date("2020-03-01"),
        level: 1,
        achievement: "Started learning React fundamentals",
        project: "Todo App",
      },
      {
        date: new Date("2020-08-01"),
        level: 2,
        achievement: "Built first commercial React app",
        project: "Business Website",
      },
      {
        date: new Date("2021-02-01"),
        level: 3,
        achievement: "Mastered React hooks and context",
        project: "E-commerce Platform",
      },
      {
        date: new Date("2022-01-01"),
        level: 4,
        achievement: "Advanced patterns and performance optimization",
        project: "Dashboard Analytics",
      },
      {
        date: new Date("2023-06-01"),
        level: 5,
        achievement: "React ecosystem expertise and mentoring",
        project: "Enterprise Application",
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    proficiencyLevel: 5,
    yearsOfExperience: 3,
    lastUsed: new Date("2024-01-20"),
    certifications: ["TypeScript Advanced Certification"],
    relatedProjects: [
      "Enterprise Dashboard",
      "API Gateway",
      "Component Library",
      "Type-safe Forms",
    ],
    description:
      "Advanced TypeScript developer with expertise in complex type systems, generics, and enterprise-scale applications with strict type safety.",
    icon: "📘",
    color: "#3178C6",
    trending: true,
    learningPath: [
      {
        date: new Date("2021-01-01"),
        level: 1,
        achievement: "Started TypeScript basics",
        project: "Personal Portfolio",
      },
      {
        date: new Date("2021-06-01"),
        level: 2,
        achievement: "Intermediate types and interfaces",
        project: "Task Manager",
      },
      {
        date: new Date("2022-03-01"),
        level: 3,
        achievement: "Advanced generics and utility types",
        project: "Component Library",
      },
      {
        date: new Date("2022-12-01"),
        level: 4,
        achievement: "Complex type systems and patterns",
        project: "Enterprise Dashboard",
      },
      {
        date: new Date("2023-08-01"),
        level: 5,
        achievement: "TypeScript architecture and best practices",
        project: "API Gateway",
      },
    ],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    proficiencyLevel: 4,
    yearsOfExperience: 3,
    lastUsed: new Date("2024-01-10"),
    certifications: ["Node.js Application Developer"],
    relatedProjects: [
      "REST API",
      "GraphQL Server",
      "Microservices",
      "Real-time Chat",
    ],
    description:
      "Proficient in Node.js backend development with Express, database integration, authentication, and scalable architecture patterns.",
    icon: "🟢",
    color: "#339933",
    learningPath: [
      {
        date: new Date("2021-02-01"),
        level: 1,
        achievement: "Node.js fundamentals and npm",
        project: "Simple API",
      },
      {
        date: new Date("2021-08-01"),
        level: 2,
        achievement: "Express.js and middleware",
        project: "Blog API",
      },
      {
        date: new Date("2022-04-01"),
        level: 3,
        achievement: "Database integration and authentication",
        project: "User Management System",
      },
      {
        date: new Date("2023-02-01"),
        level: 4,
        achievement: "Microservices and advanced patterns",
        project: "E-commerce Backend",
      },
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    proficiencyLevel: 5,
    yearsOfExperience: 2,
    lastUsed: new Date("2024-01-18"),
    certifications: ["Next.js Expert Certification"],
    relatedProjects: [
      "Portfolio Website",
      "E-commerce Store",
      "Blog Platform",
      "SaaS Dashboard",
    ],
    description:
      "Expert in Next.js with deep knowledge of SSR, SSG, API routes, performance optimization, and the latest App Router patterns.",
    icon: "▲",
    color: "#000000",
    trending: true,
    learningPath: [
      {
        date: new Date("2022-01-01"),
        level: 1,
        achievement: "Next.js basics and routing",
        project: "Personal Blog",
      },
      {
        date: new Date("2022-06-01"),
        level: 2,
        achievement: "SSR and SSG mastery",
        project: "Company Website",
      },
      {
        date: new Date("2023-01-01"),
        level: 3,
        achievement: "API routes and full-stack development",
        project: "E-commerce Platform",
      },
      {
        date: new Date("2023-08-01"),
        level: 4,
        achievement: "Performance optimization and SEO",
        project: "SaaS Dashboard",
      },
      {
        date: new Date("2024-01-01"),
        level: 5,
        achievement: "App Router and advanced patterns",
        project: "Enterprise Application",
      },
    ],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "database",
    proficiencyLevel: 4,
    yearsOfExperience: 2,
    lastUsed: new Date("2023-12-15"),
    certifications: ["PostgreSQL Administration"],
    relatedProjects: [
      "User Management System",
      "Analytics Platform",
      "E-commerce Backend",
    ],
    description:
      "Advanced PostgreSQL skills including complex queries, performance optimization, indexing strategies, and database design patterns.",
    icon: "🐘",
    color: "#336791",
    learningPath: [
      {
        date: new Date("2022-03-01"),
        level: 1,
        achievement: "SQL basics and CRUD operations",
        project: "Simple Blog",
      },
      {
        date: new Date("2022-08-01"),
        level: 2,
        achievement: "Joins, indexes, and optimization",
        project: "User System",
      },
      {
        date: new Date("2023-02-01"),
        level: 3,
        achievement: "Advanced queries and stored procedures",
        project: "Analytics Platform",
      },
      {
        date: new Date("2023-10-01"),
        level: 4,
        achievement: "Database design and performance tuning",
        project: "E-commerce Backend",
      },
    ],
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "design",
    proficiencyLevel: 5,
    yearsOfExperience: 2,
    lastUsed: new Date("2024-01-22"),
    relatedProjects: [
      "Portfolio Website",
      "Component Library",
      "Dashboard UI",
      "Landing Pages",
    ],
    description:
      "Expert in Tailwind CSS with deep understanding of utility-first design, custom configurations, and building scalable design systems.",
    icon: "🎨",
    color: "#06B6D4",
    trending: true,
    learningPath: [
      {
        date: new Date("2022-04-01"),
        level: 1,
        achievement: "Tailwind basics and utilities",
        project: "Personal Website",
      },
      {
        date: new Date("2022-09-01"),
        level: 2,
        achievement: "Responsive design and components",
        project: "Business Landing",
      },
      {
        date: new Date("2023-03-01"),
        level: 3,
        achievement: "Custom configurations and plugins",
        project: "Design System",
      },
      {
        date: new Date("2023-09-01"),
        level: 4,
        achievement: "Advanced patterns and optimization",
        project: "Dashboard UI",
      },
      {
        date: new Date("2024-01-01"),
        level: 5,
        achievement: "Tailwind architecture and best practices",
        project: "Component Library",
      },
    ],
  },
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    proficiencyLevel: 3,
    yearsOfExperience: 1,
    lastUsed: new Date("2023-11-20"),
    relatedProjects: ["Microservices Deployment", "Development Environment"],
    description:
      "Intermediate Docker skills for containerization, multi-stage builds, and development environment setup with docker-compose.",
    icon: "🐳",
    color: "#2496ED",
    learningPath: [
      {
        date: new Date("2023-01-01"),
        level: 1,
        achievement: "Docker basics and containers",
        project: "Local Development",
      },
      {
        date: new Date("2023-06-01"),
        level: 2,
        achievement: "Docker Compose and networking",
        project: "Full-stack App",
      },
      {
        date: new Date("2023-11-01"),
        level: 3,
        achievement: "Multi-stage builds and optimization",
        project: "Production Deployment",
      },
    ],
  },
  {
    id: "aws",
    name: "AWS",
    category: "devops",
    proficiencyLevel: 3,
    yearsOfExperience: 1,
    lastUsed: new Date("2023-10-30"),
    certifications: ["AWS Cloud Practitioner"],
    relatedProjects: ["Static Site Hosting", "Serverless Functions"],
    description:
      "Growing expertise in AWS services including S3, Lambda, CloudFront, and basic cloud architecture patterns for web applications.",
    icon: "☁️",
    color: "#FF9900",
    learningPath: [
      {
        date: new Date("2023-02-01"),
        level: 1,
        achievement: "AWS basics and S3",
        project: "Static Website",
      },
      {
        date: new Date("2023-07-01"),
        level: 2,
        achievement: "Lambda and serverless patterns",
        project: "API Functions",
      },
      {
        date: new Date("2023-10-01"),
        level: 3,
        achievement: "CloudFront and infrastructure",
        project: "Production Deployment",
      },
    ],
  },
  {
    id: "jest",
    name: "Jest & Testing",
    category: "testing",
    proficiencyLevel: 4,
    yearsOfExperience: 2,
    lastUsed: new Date("2024-01-12"),
    relatedProjects: ["Component Library", "API Testing", "E2E Test Suite"],
    description:
      "Advanced testing skills with Jest, React Testing Library, and end-to-end testing. Focus on test-driven development and comprehensive coverage.",
    icon: "🧪",
    color: "#C21325",
    learningPath: [
      {
        date: new Date("2022-05-01"),
        level: 1,
        achievement: "Unit testing basics",
        project: "Utility Functions",
      },
      {
        date: new Date("2022-10-01"),
        level: 2,
        achievement: "React component testing",
        project: "UI Components",
      },
      {
        date: new Date("2023-04-01"),
        level: 3,
        achievement: "Integration and API testing",
        project: "Full-stack App",
      },
      {
        date: new Date("2023-12-01"),
        level: 4,
        achievement: "E2E testing and TDD practices",
        project: "Enterprise Application",
      },
    ],
  },
  {
    id: "figma",
    name: "Figma",
    category: "design",
    proficiencyLevel: 4,
    yearsOfExperience: 2,
    lastUsed: new Date("2024-01-08"),
    relatedProjects: ["Design System", "UI Mockups", "Prototype Designs"],
    description:
      "Proficient in Figma for UI/UX design, prototyping, design systems, and collaboration with development teams for pixel-perfect implementations.",
    icon: "🎯",
    color: "#F24E1E",
    learningPath: [
      {
        date: new Date("2022-06-01"),
        level: 1,
        achievement: "Figma basics and components",
        project: "Website Mockups",
      },
      {
        date: new Date("2022-12-01"),
        level: 2,
        achievement: "Advanced components and variants",
        project: "Mobile App Design",
      },
      {
        date: new Date("2023-06-01"),
        level: 3,
        achievement: "Design systems and auto-layout",
        project: "Component Library",
      },
      {
        date: new Date("2023-12-01"),
        level: 4,
        achievement: "Advanced prototyping and handoff",
        project: "Enterprise Dashboard",
      },
    ],
  },
];

export default SkillsProficiencyMatrix;
