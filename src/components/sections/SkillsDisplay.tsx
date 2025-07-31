"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Skill {
  name: string;
  level: number; // 0-100
  category: "frontend" | "backend" | "tools" | "learning";
}

interface TechIcon {
  name: string;
  icon: string; // Using text representation for now, can be replaced with actual icons
  color: string;
}

const skills: Skill[] = [
  // Frontend
  { name: "React/Next.js", level: 95, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Tailwind CSS", level: 88, category: "frontend" },
  { name: "JavaScript", level: 92, category: "frontend" },
  { name: "HTML/CSS", level: 95, category: "frontend" },
  { name: "Vue.js", level: 75, category: "frontend" },

  // Backend
  { name: "Node.js", level: 85, category: "backend" },
  { name: "Python", level: 80, category: "backend" },
  { name: "PostgreSQL", level: 78, category: "backend" },
  { name: "MongoDB", level: 82, category: "backend" },
  { name: "GraphQL", level: 75, category: "backend" },
  { name: "REST APIs", level: 90, category: "backend" },

  // Tools
  { name: "Git/GitHub", level: 92, category: "tools" },
  { name: "Docker", level: 70, category: "tools" },
  { name: "AWS", level: 68, category: "tools" },
  { name: "Vercel", level: 85, category: "tools" },
  { name: "Figma", level: 80, category: "tools" },

  // Learning
  { name: "Rust", level: 35, category: "learning" },
  { name: "Go", level: 40, category: "learning" },
  { name: "Machine Learning", level: 25, category: "learning" },
];

const techIcons: TechIcon[] = [
  { name: "React", icon: "⚛️", color: "#61DAFB" },
  { name: "Next.js", icon: "▲", color: "#000000" },
  { name: "TypeScript", icon: "TS", color: "#3178C6" },
  { name: "JavaScript", icon: "JS", color: "#F7DF1E" },
  { name: "Python", icon: "🐍", color: "#3776AB" },
  { name: "Node.js", icon: "📗", color: "#339933" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791" },
  { name: "MongoDB", icon: "🍃", color: "#47A248" },
  { name: "Docker", icon: "🐳", color: "#2496ED" },
  { name: "AWS", icon: "☁️", color: "#FF9900" },
  { name: "Git", icon: "🌿", color: "#F05032" },
  { name: "Figma", icon: "🎨", color: "#F24E1E" },
];

const SkillBar: React.FC<{ skill: Skill; index: number }> = ({
  skill,
  index,
}) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedLevel(skill.level);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.level, index]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-brutalist-yellow";
      case "backend":
        return "bg-blue-500";
      case "tools":
        return "bg-green-500";
      case "learning":
        return "bg-orange-500";
      default:
        return "bg-brutalist-yellow";
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case "frontend":
        return "border-brutalist-yellow";
      case "backend":
        return "border-blue-500";
      case "tools":
        return "border-green-500";
      case "learning":
        return "border-orange-500";
      default:
        return "border-brutalist-yellow";
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono font-bold text-brutalist-black text-sm uppercase">
          {skill.name}
        </span>
        <span className="font-mono font-black text-brutalist-black text-sm">
          {animatedLevel}%
        </span>
      </div>
      <div className="relative">
        <div className="w-full h-4 bg-brutalist-white border-3 border-brutalist-black">
          <motion.div
            className={`h-full ${getCategoryColor(
              skill.category
            )} border-r-3 ${getCategoryBorder(skill.category)}`}
            initial={{ width: 0 }}
            animate={{ width: `${animatedLevel}%` }}
            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
          />
        </div>
        {/* Skill level indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brutalist-black border-2 border-brutalist-white"></div>
      </div>
    </motion.div>
  );
};

const TechIcon: React.FC<{ tech: TechIcon; index: number }> = ({
  tech,
  index,
}) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.2,
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.3 },
      }}
    >
      <div className="w-16 h-16 bg-brutalist-white border-3 border-brutalist-black flex items-center justify-center font-mono font-black text-2xl group-hover:bg-brutalist-yellow group-hover:border-brutalist-yellow transition-all duration-300">
        {tech.icon}
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-brutalist-black text-brutalist-yellow px-2 py-1 text-xs font-mono font-bold whitespace-nowrap border-2 border-brutalist-yellow">
          {tech.name}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsDisplay: React.FC = () => {
  const frontendSkills = skills.filter(
    (skill) => skill.category === "frontend"
  );
  const backendSkills = skills.filter((skill) => skill.category === "backend");
  const toolsSkills = skills.filter((skill) => skill.category === "tools");
  const learningSkills = skills.filter(
    (skill) => skill.category === "learning"
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-brutalist-black">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-mono font-black text-brutalist-yellow mb-6 uppercase tracking-wider">
            SKILLS & EXPERTISE
          </h2>
          <div className="w-24 h-2 bg-brutalist-yellow mx-auto mb-6"></div>
          <p className="text-lg font-mono text-brutalist-gray max-w-2xl mx-auto">
            TECHNICAL PROFICIENCY ACROSS THE FULL DEVELOPMENT STACK
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Skills Progress Bars */}
          <div className="space-y-12">
            {/* Frontend Skills */}
            <div>
              <h3 className="text-2xl font-mono font-black text-brutalist-yellow mb-6 uppercase flex items-center">
                <div className="w-4 h-4 bg-brutalist-yellow mr-3 border-2 border-brutalist-yellow"></div>
                Frontend Development
              </h3>
              <div className="space-y-4">
                {frontendSkills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div>
              <h3 className="text-2xl font-mono font-black text-blue-400 mb-6 uppercase flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-3 border-2 border-blue-500"></div>
                Backend Development
              </h3>
              <div className="space-y-4">
                {backendSkills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Tools & Learning */}
          <div className="space-y-12">
            {/* Tools Skills */}
            <div>
              <h3 className="text-2xl font-mono font-black text-green-400 mb-6 uppercase flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-3 border-2 border-green-500"></div>
                Tools & Platforms
              </h3>
              <div className="space-y-4">
                {toolsSkills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>

            {/* Learning Skills */}
            <div>
              <h3 className="text-2xl font-mono font-black text-orange-400 mb-6 uppercase flex items-center">
                <div className="w-4 h-4 bg-orange-500 mr-3 border-2 border-orange-500"></div>
                Currently Learning
              </h3>
              <div className="space-y-4">
                {learningSkills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
              <div className="mt-4 p-4 border-3 border-orange-500 bg-orange-500/10">
                <p className="text-sm font-mono text-brutalist-gray">
                  💡{" "}
                  <strong className="text-orange-400">GROWTH MINDSET:</strong>{" "}
                  Always expanding my skillset to stay ahead of industry trends
                  and deliver cutting-edge solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Icons Grid */}
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-3xl font-mono font-black text-brutalist-yellow mb-8 uppercase">
            TECH STACK
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
            {techIcons.map((tech, index) => (
              <TechIcon key={tech.name} tech={tech} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="text-center p-6 border-3 border-brutalist-yellow bg-brutalist-yellow/10">
            <div className="text-4xl font-mono font-black text-brutalist-yellow mb-2">
              2+
            </div>
            <div className="text-sm font-mono text-brutalist-gray uppercase">
              Years Experience
            </div>
          </div>
          <div className="text-center p-6 border-3 border-brutalist-yellow bg-brutalist-yellow/10">
            <div className="text-4xl font-mono font-black text-brutalist-yellow mb-2">
              50+
            </div>
            <div className="text-sm font-mono text-brutalist-gray uppercase">
              Projects Completed
            </div>
          </div>
          <div className="text-center p-6 border-3 border-brutalist-yellow bg-brutalist-yellow/10">
            <div className="text-4xl font-mono font-black text-brutalist-yellow mb-2">
              15+
            </div>
            <div className="text-sm font-mono text-brutalist-gray uppercase">
              Technologies Mastered
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsDisplay;
