"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Timeline data interfaces
interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: "career" | "achievement" | "technology" | "milestone";
  icon: string;
  details: {
    role?: string;
    company?: string;
    technologies?: string[];
    achievements?: string[];
    metrics?: Record<string, string>;
    impact?: string;
    learnings?: string[];
  };
  featured?: boolean;
}

interface InteractiveTimelineProps {
  className?: string;
  events?: TimelineEvent[];
  enableFiltering?: boolean;
  enableSearch?: boolean;
  showMetrics?: boolean;
}

const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  className,
  events = defaultTimelineEvents,
  enableFiltering = true,
  enableSearch = true,
  showMetrics = true,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Filter and search logic
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      filterCategory === "all" || event.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.details.company
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      event.details.role?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleEventClick = useCallback(
    (eventId: string) => {
      setExpandedEvent(expandedEvent === eventId ? null : eventId);
    },
    [expandedEvent]
  );

  const handleEventHover = useCallback((eventId: string | null) => {
    setSelectedEvent(eventId);
  }, []);

  const categories = [
    { id: "all", label: "All Events", icon: "📅" },
    { id: "career", label: "Career", icon: "💼" },
    { id: "achievement", label: "Achievements", icon: "🏆" },
    { id: "technology", label: "Technology", icon: "⚡" },
    { id: "milestone", label: "Milestones", icon: "🎯" },
  ];

  return (
    <section className={cn("py-20 bg-brutalist-light-gray", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
              Interactive Career Timeline
            </h2>
            <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
              Explore my professional journey, key achievements, and technology
              evolution through an interactive timeline experience.
            </p>
          </motion.div>

          {/* Controls */}
          {(enableFiltering || enableSearch) && (
            <motion.div
              className="mb-12 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Search */}
              {enableSearch && (
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search timeline events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 font-mono border-3 border-black bg-white focus:border-brutalist-yellow focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Filters */}
              {enableFiltering && (
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setFilterCategory(category.id)}
                      className={cn(
                        "px-4 py-2 font-mono font-bold text-sm uppercase tracking-wider border-3 transition-all duration-300",
                        filterCategory === category.id
                          ? "bg-brutalist-yellow border-black text-black"
                          : "bg-white border-black text-black hover:bg-brutalist-yellow"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-brutalist-yellow"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />

            {/* Timeline Events */}
            <div className="space-y-12">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={cn(
                      "relative flex items-start",
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Timeline Node */}
                    <motion.div
                      className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div
                        className={cn(
                          "w-16 h-16 border-4 border-black flex items-center justify-center cursor-pointer",
                          event.featured ? "bg-brutalist-yellow" : "bg-white",
                          selectedEvent === event.id &&
                            "ring-4 ring-brutalist-yellow ring-opacity-50"
                        )}
                        onMouseEnter={() => handleEventHover(event.id)}
                        onMouseLeave={() => handleEventHover(null)}
                        onClick={() => handleEventClick(event.id)}
                      >
                        <span className="text-2xl">{event.icon}</span>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-black text-brutalist-yellow px-2 py-1 text-xs font-mono font-bold">
                          {event.date.getFullYear()}
                        </div>
                      </div>
                    </motion.div>

                    {/* Event Content */}
                    <div
                      className={cn(
                        "w-full md:w-5/12 ml-20 md:ml-0",
                        index % 2 === 0
                          ? "md:mr-auto md:pr-12"
                          : "md:ml-auto md:pl-12"
                      )}
                    >
                      <motion.div
                        className={cn(
                          "border-5 border-black p-6 cursor-pointer transition-all duration-300",
                          expandedEvent === event.id
                            ? "bg-brutalist-yellow"
                            : "bg-white hover:bg-brutalist-light-gray"
                        )}
                        onClick={() => handleEventClick(event.id)}
                        whileHover={{ y: -5 }}
                        layout
                      >
                        {/* Event Header */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={cn(
                                "px-2 py-1 text-xs font-mono font-bold uppercase tracking-wider border-2",
                                getCategoryStyles(event.category)
                              )}
                            >
                              {event.category}
                            </span>
                            <span className="text-sm font-mono text-gray-600">
                              {event.date.toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-2">
                            {event.title}
                          </h3>

                          {event.details.role && event.details.company && (
                            <p className="font-mono text-sm text-gray-700 mb-2">
                              {event.details.role} at {event.details.company}
                            </p>
                          )}

                          <p className="font-mono text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Expandable Details */}
                        <AnimatePresence>
                          {expandedEvent === event.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t-3 border-black pt-4 mt-4 space-y-4"
                            >
                              {/* Technologies */}
                              {event.details.technologies &&
                                event.details.technologies.length > 0 && (
                                  <div>
                                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                      Technologies Used
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {event.details.technologies.map(
                                        (tech, techIndex) => (
                                          <span
                                            key={techIndex}
                                            className="px-2 py-1 bg-black text-brutalist-yellow text-xs font-mono font-bold"
                                          >
                                            {tech}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Achievements */}
                              {event.details.achievements &&
                                event.details.achievements.length > 0 && (
                                  <div>
                                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                      Key Achievements
                                    </h4>
                                    <ul className="space-y-1">
                                      {event.details.achievements.map(
                                        (achievement, achIndex) => (
                                          <li
                                            key={achIndex}
                                            className="font-mono text-sm flex items-start"
                                          >
                                            <span className="w-2 h-2 bg-black mt-2 mr-3 flex-shrink-0" />
                                            {achievement}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Metrics */}
                              {showMetrics &&
                                event.details.metrics &&
                                Object.keys(event.details.metrics).length >
                                  0 && (
                                  <div>
                                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                      Impact Metrics
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      {Object.entries(
                                        event.details.metrics
                                      ).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                          <div className="text-2xl font-mono font-black text-black mb-1">
                                            {value}
                                          </div>
                                          <div className="text-xs font-mono text-gray-600 uppercase tracking-wider">
                                            {key}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Impact */}
                              {event.details.impact && (
                                <div>
                                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                    Business Impact
                                  </h4>
                                  <p className="font-mono text-sm text-gray-700 leading-relaxed">
                                    {event.details.impact}
                                  </p>
                                </div>
                              )}

                              {/* Learnings */}
                              {event.details.learnings &&
                                event.details.learnings.length > 0 && (
                                  <div>
                                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-2">
                                      Key Learnings
                                    </h4>
                                    <ul className="space-y-1">
                                      {event.details.learnings.map(
                                        (learning, learnIndex) => (
                                          <li
                                            key={learnIndex}
                                            className="font-mono text-sm flex items-start"
                                          >
                                            <span className="w-2 h-2 bg-black mt-2 mr-3 flex-shrink-0" />
                                            {learning}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand Indicator */}
                        <div className="flex justify-center mt-4">
                          <motion.div
                            animate={{
                              rotate: expandedEvent === event.id ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="text-black"
                          >
                            ▼
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Timeline Summary */}
          {showMetrics && (
            <motion.div
              className="mt-16 bg-brutalist-black border-5 border-brutalist-yellow p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black font-mono uppercase tracking-wider text-white mb-4">
                  Career Progression Summary
                </h3>
                <p className="font-mono text-brutalist-gray">
                  Key metrics and milestones from my professional journey
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                    {events.length}
                  </div>
                  <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                    Career Events
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                    {events.filter((e) => e.category === "technology").length}
                  </div>
                  <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                    Tech Milestones
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                    {events.filter((e) => e.category === "achievement").length}
                  </div>
                  <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                    Achievements
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-black text-brutalist-yellow mb-2">
                    {new Date().getFullYear() -
                      Math.min(...events.map((e) => e.date.getFullYear()))}
                  </div>
                  <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper function for category styles
const getCategoryStyles = (category: string) => {
  switch (category) {
    case "career":
      return "border-blue-500 text-blue-500 bg-blue-50";
    case "achievement":
      return "border-green-500 text-green-500 bg-green-50";
    case "technology":
      return "border-purple-500 text-purple-500 bg-purple-50";
    case "milestone":
      return "border-red-500 text-red-500 bg-red-50";
    default:
      return "border-gray-500 text-gray-500 bg-gray-50";
  }
};

// Default timeline events data
const defaultTimelineEvents: TimelineEvent[] = [
  {
    id: "start-journey",
    date: new Date("2020-01-01"),
    title: "Started Web Development Journey",
    description:
      "Began learning web development fundamentals and modern JavaScript frameworks",
    category: "milestone",
    icon: "🚀",
    details: {
      technologies: ["HTML", "CSS", "JavaScript", "React"],
      achievements: [
        "Completed first full-stack application",
        "Built personal portfolio website",
        "Learned responsive design principles",
      ],
      learnings: [
        "Importance of clean, semantic code",
        "User experience design principles",
        "Modern development workflows",
      ],
    },
    featured: true,
  },
  {
    id: "first-client",
    date: new Date("2020-06-15"),
    title: "First Client Project",
    description:
      "Successfully delivered first commercial web application for a local business",
    category: "career",
    icon: "💼",
    details: {
      role: "Freelance Developer",
      company: "Local Business",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      achievements: [
        "Delivered project on time and under budget",
        "Increased client's online presence by 300%",
        "Implemented secure payment processing",
      ],
      metrics: {
        "Revenue Increase": "150%",
        "Load Time": "2.3s",
        "User Satisfaction": "95%",
      },
      impact:
        "Helped a local business establish their online presence and increase revenue by 150% within the first quarter.",
      learnings: [
        "Client communication best practices",
        "Project management skills",
        "Importance of thorough testing",
      ],
    },
  },
  {
    id: "react-mastery",
    date: new Date("2021-03-10"),
    title: "React Ecosystem Mastery",
    description:
      "Achieved advanced proficiency in React and its ecosystem including Redux, Next.js, and testing",
    category: "technology",
    icon: "⚛️",
    details: {
      technologies: [
        "React",
        "Redux",
        "Next.js",
        "Jest",
        "React Testing Library",
        "TypeScript",
      ],
      achievements: [
        "Built 5+ production React applications",
        "Contributed to open source React projects",
        "Mentored junior developers in React best practices",
      ],
      metrics: {
        "Projects Built": "12",
        "Performance Score": "98/100",
        "Code Coverage": "95%",
      },
      learnings: [
        "Advanced React patterns and hooks",
        "State management best practices",
        "Performance optimization techniques",
      ],
    },
    featured: true,
  },
  {
    id: "fullstack-achievement",
    date: new Date("2021-09-20"),
    title: "Full-Stack Development Certification",
    description:
      "Completed comprehensive full-stack development program with focus on modern web technologies",
    category: "achievement",
    icon: "🏆",
    details: {
      achievements: [
        "Graduated with honors from full-stack program",
        "Built capstone e-commerce platform",
        "Received recognition for code quality",
      ],
      technologies: [
        "React",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Docker",
        "GraphQL",
      ],
      metrics: {
        "Final Score": "98%",
        "Projects Completed": "15",
        "Peer Rating": "4.9/5",
      },
      impact:
        "Gained comprehensive understanding of modern web development stack and best practices.",
      learnings: [
        "Database design and optimization",
        "Cloud deployment strategies",
        "API design principles",
      ],
    },
  },
  {
    id: "agency-role",
    date: new Date("2022-02-01"),
    title: "Senior Developer at Digital Agency",
    description:
      "Joined a leading digital agency as Senior Full-Stack Developer, leading client projects",
    category: "career",
    icon: "🏢",
    details: {
      role: "Senior Full-Stack Developer",
      company: "Digital Innovation Agency",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "AWS",
        "Prisma",
      ],
      achievements: [
        "Led development team of 4 developers",
        "Delivered 8 major client projects",
        "Improved team productivity by 40%",
        "Established code review processes",
      ],
      metrics: {
        "Projects Delivered": "8",
        "Team Size": "4",
        "Client Satisfaction": "96%",
        "Code Quality Score": "A+",
      },
      impact:
        "Led successful delivery of high-profile client projects, resulting in 96% client satisfaction and repeat business.",
      learnings: [
        "Team leadership and mentoring",
        "Enterprise-level architecture",
        "Client relationship management",
      ],
    },
    featured: true,
  },
  {
    id: "performance-expert",
    date: new Date("2022-08-15"),
    title: "Web Performance Optimization Expert",
    description:
      "Specialized in web performance optimization, achieving significant improvements across client projects",
    category: "technology",
    icon: "⚡",
    details: {
      technologies: [
        "Lighthouse",
        "WebPageTest",
        "Core Web Vitals",
        "Webpack",
        "Vite",
        "CDN",
      ],
      achievements: [
        "Improved average page load times by 60%",
        "Achieved perfect Lighthouse scores on 10+ sites",
        "Developed performance monitoring dashboard",
        "Created performance optimization guidelines",
      ],
      metrics: {
        "Avg Load Time Improvement": "60%",
        "Perfect Lighthouse Scores": "10",
        "Bundle Size Reduction": "45%",
      },
      impact:
        "Performance optimizations resulted in 25% increase in user engagement and 15% improvement in conversion rates across client projects.",
      learnings: [
        "Advanced performance profiling techniques",
        "Image optimization strategies",
        "Critical rendering path optimization",
      ],
    },
  },
  {
    id: "freelance-success",
    date: new Date("2023-01-10"),
    title: "Independent Consultant Launch",
    description:
      "Launched independent consulting practice, focusing on high-performance web applications",
    category: "milestone",
    icon: "🎯",
    details: {
      achievements: [
        "Established successful consulting practice",
        "Built portfolio of 15+ satisfied clients",
        "Developed signature development methodology",
        "Created comprehensive client onboarding process",
      ],
      metrics: {
        "Client Projects": "15",
        "Revenue Growth": "200%",
        "Client Retention": "90%",
        "Referral Rate": "75%",
      },
      impact:
        "Successfully transitioned to independent consulting, achieving 200% revenue growth and 90% client retention rate.",
      learnings: [
        "Business development and marketing",
        "Client acquisition strategies",
        "Service pricing and packaging",
      ],
    },
    featured: true,
  },
  {
    id: "ai-integration",
    date: new Date("2023-07-01"),
    title: "AI Integration Specialist",
    description:
      "Expanded expertise to include AI integration in web applications, staying ahead of industry trends",
    category: "technology",
    icon: "🤖",
    details: {
      technologies: [
        "OpenAI API",
        "LangChain",
        "Vector Databases",
        "Python",
        "TensorFlow",
        "Hugging Face",
      ],
      achievements: [
        "Integrated AI features in 5+ client projects",
        "Built custom AI-powered chatbots",
        "Developed AI content generation tools",
        "Created AI integration best practices guide",
      ],
      metrics: {
        "AI Projects": "5",
        "User Engagement": "+40%",
        "Processing Speed": "3x faster",
      },
      impact:
        "AI integrations increased user engagement by 40% and provided clients with competitive advantages in their markets.",
      learnings: [
        "AI/ML model integration techniques",
        "Prompt engineering best practices",
        "Ethical AI implementation",
      ],
    },
  },
];

export default InteractiveTimeline;
