"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrutalistCard } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ProcessTimelineProps {
  className?: string;
}

interface ProcessStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  timeframe: string;
  icon: string;
  details: string[];
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ className }) => {
  const processSteps: ProcessStep[] = [
    {
      id: "discovery",
      phase: "01",
      title: "DISCOVERY",
      description: "Understanding your vision, goals, and requirements",
      timeframe: "1-2 WEEKS",
      icon: "🔍",
      details: [
        "Project scope analysis",
        "Target audience research",
        "Technical requirements gathering",
        "Competitive analysis",
        "Success metrics definition",
      ],
    },
    {
      id: "strategy",
      phase: "02",
      title: "STRATEGY",
      description: "Creating the roadmap and technical architecture",
      timeframe: "1-2 WEEKS",
      icon: "🎯",
      details: [
        "Information architecture",
        "Technology stack selection",
        "User experience planning",
        "Performance optimization strategy",
        "Timeline and milestone planning",
      ],
    },
    {
      id: "development",
      phase: "03",
      title: "DEVELOPMENT",
      description: "Building your solution with precision and care",
      timeframe: "4-8 WEEKS",
      icon: "⚡",
      details: [
        "Agile development approach",
        "Regular progress updates",
        "Code reviews and testing",
        "Performance optimization",
        "Quality assurance",
      ],
    },
    {
      id: "launch",
      phase: "04",
      title: "LAUNCH",
      description: "Deploying and optimizing for maximum impact",
      timeframe: "1 WEEK",
      icon: "🚀",
      details: [
        "Production deployment",
        "Performance monitoring setup",
        "SEO optimization",
        "Analytics implementation",
        "Final testing and optimization",
      ],
    },
    {
      id: "support",
      phase: "05",
      title: "SUPPORT",
      description: "Ongoing maintenance and continuous improvement",
      timeframe: "ONGOING",
      icon: "🛠️",
      details: [
        "Bug fixes and updates",
        "Performance monitoring",
        "Feature enhancements",
        "Security updates",
        "Technical consultation",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: { scaleY: 1 },
  };

  return (
    <section
      id="process"
      className={cn(
        "py-20 bg-brutalist-black relative overflow-hidden",
        className
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-40 h-40 border-8 border-brutalist-yellow opacity-5 rotate-45" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-brutalist-white opacity-5 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 border-4 border-brutalist-yellow opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-mono font-black text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight mb-4">
              MY
              <span className="text-brutalist-yellow ml-4">PROCESS</span>
            </h2>
            <div className="w-32 h-2 bg-brutalist-yellow mx-auto mb-6" />
            <p className="font-mono text-brutalist-gray text-lg max-w-3xl mx-auto leading-relaxed">
              A systematic approach to turning your ideas into high-performing
              digital solutions. Every project follows this proven methodology
              to ensure quality and success.
            </p>
          </motion.div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-brutalist-yellow origin-top"
              variants={lineVariants}
              style={{ transformOrigin: "top" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Process Steps */}
            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={cn(
                    "relative flex items-center",
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                  variants={stepVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Timeline Node */}
                  <motion.div
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-brutalist-yellow border-4 border-brutalist-black flex items-center justify-center">
                      <span className="text-2xl">{step.icon}</span>
                    </div>

                    {/* Phase Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brutalist-black border-2 border-brutalist-yellow flex items-center justify-center">
                      <span className="font-mono font-black text-xs text-brutalist-yellow">
                        {step.phase}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <div
                    className={cn(
                      "w-full md:w-5/12 ml-20 md:ml-0",
                      index % 2 === 0
                        ? "md:mr-auto md:pr-12"
                        : "md:ml-auto md:pl-12"
                    )}
                  >
                    <BrutalistCard
                      title={step.title}
                      description={step.description}
                      accent={index % 2 === 0}
                      hover="lift"
                      className={cn(
                        "bg-brutalist-black",
                        index % 2 === 0
                          ? "border-brutalist-yellow"
                          : "border-brutalist-white"
                      )}
                    >
                      <div className="space-y-4">
                        {/* Timeframe Badge */}
                        <div
                          className={cn(
                            "inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-wider",
                            index % 2 === 0
                              ? "border-brutalist-yellow text-brutalist-yellow bg-brutalist-black"
                              : "border-brutalist-white text-brutalist-white bg-brutalist-black"
                          )}
                        >
                          {step.timeframe}
                        </div>

                        {/* Description */}
                        <p className="font-mono text-brutalist-gray leading-relaxed">
                          {step.description}
                        </p>

                        {/* Details List */}
                        <div className="space-y-2">
                          <h4
                            className={cn(
                              "font-mono font-bold text-sm uppercase tracking-wider",
                              index % 2 === 0
                                ? "text-brutalist-yellow"
                                : "text-brutalist-white"
                            )}
                          >
                            KEY ACTIVITIES
                          </h4>
                          <ul className="space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="font-mono text-sm text-brutalist-gray flex items-start"
                              >
                                <span
                                  className={cn(
                                    "inline-block w-2 h-2 mt-2 mr-3 flex-shrink-0",
                                    index % 2 === 0
                                      ? "bg-brutalist-yellow"
                                      : "bg-brutalist-white"
                                  )}
                                />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Decorative Element */}
                        <motion.div
                          className={cn(
                            "w-full h-1 mt-4",
                            index % 2 === 0
                              ? "bg-brutalist-yellow"
                              : "bg-brutalist-white"
                          )}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                    </BrutalistCard>
                  </div>

                  {/* Mobile Timeline Connector */}
                  <div className="md:hidden absolute left-8 top-16 w-1 h-16 bg-brutalist-yellow" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            className="mt-20 text-center border-t-5 border-brutalist-yellow pt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-mono font-black text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
              READY TO START
              <span className="text-brutalist-yellow ml-2">YOUR PROJECT?</span>
            </h3>
            <p className="font-mono text-brutalist-gray text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project and create a custom timeline that
              fits your needs and goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                className="font-mono font-bold text-brutalist-black bg-brutalist-yellow px-8 py-4 border-3 border-brutalist-yellow hover:bg-brutalist-black hover:text-brutalist-yellow transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                START YOUR PROJECT
              </motion.button>

              <motion.button
                className="font-mono font-bold text-brutalist-white bg-brutalist-black px-8 py-4 border-3 border-brutalist-white hover:bg-brutalist-white hover:text-brutalist-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const portfolioSection = document.getElementById("portfolio");
                  if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                VIEW MY WORK
              </motion.button>
            </div>

            {/* Process Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-black text-brutalist-yellow mb-2">
                  100%
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  On-Time Delivery
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-black text-brutalist-yellow mb-2">
                  24H
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Response Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-black text-brutalist-yellow mb-2">
                  98%
                </div>
                <div className="text-sm font-mono text-brutalist-gray uppercase tracking-wider">
                  Client Satisfaction
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
