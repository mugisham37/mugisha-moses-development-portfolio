"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrutalistCard } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const interests = [
    {
      icon: "🎵",
      label: "Music Production",
      description: "Creating beats and melodies",
    },
    { icon: "🏃‍♂️", label: "Running", description: "Marathon training" },
    {
      icon: "📚",
      label: "Tech Books",
      description: "Always learning new frameworks",
    },
    { icon: "☕", label: "Coffee", description: "Fuel for late-night coding" },
    { icon: "🎮", label: "Gaming", description: "Strategy and puzzle games" },
    {
      icon: "🌱",
      label: "Gardening",
      description: "Growing my own vegetables",
    },
  ];

  return (
    <section
      id="about"
      className={cn(
        "py-20 bg-brutalist-black relative overflow-hidden",
        className
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border-8 border-brutalist-yellow opacity-10 rotate-12" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-brutalist-yellow opacity-10 rotate-45" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-brutalist-white opacity-5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="font-mono font-black text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight mb-4">
              ABOUT
              <span className="text-brutalist-yellow ml-4">ME</span>
            </h2>
            <div className="w-32 h-2 bg-brutalist-yellow mx-auto" />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Photo and Quick Facts */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Professional Photo in Workspace */}
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-brutalist-yellow rounded-lg blur-xl opacity-20"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.2, 0.25, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Photo Container */}
                <div className="relative border-5 border-brutalist-yellow bg-brutalist-black p-3">
                  <div className="aspect-[4/5] relative overflow-hidden bg-brutalist-gray">
                    {/* Placeholder for workspace photo */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brutalist-gray to-brutalist-black">
                      <div className="text-center space-y-4">
                        <div className="w-40 h-40 mx-auto bg-brutalist-yellow rounded-full flex items-center justify-center">
                          <span className="text-5xl font-mono font-black text-brutalist-black">
                            👨‍💻
                          </span>
                        </div>
                        <p className="font-mono text-brutalist-yellow text-sm uppercase tracking-wider">
                          Workspace Photo
                        </p>
                        <p className="font-mono text-brutalist-white text-xs">
                          Professional photo in workspace setting
                        </p>
                      </div>
                    </div>

                    {/* When you have an actual photo, replace the above div with: */}
                    {/* <Image
                      src="/images/workspace-photo.jpg"
                      alt="Developer working in modern workspace"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    /> */}
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -top-3 -right-3 w-6 h-6 bg-brutalist-white"
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-3 -left-3 w-4 h-4 bg-brutalist-yellow"
                    animate={{ rotate: [360, 270, 180, 90, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </div>

              {/* Quick Facts */}
              <BrutalistCard
                title="QUICK FACTS"
                description="Essential information about my background and availability"
                accent={true}
                hover="glow"
                className="bg-brutalist-black border-brutalist-yellow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-brutalist-gray pb-2">
                    <span className="font-mono text-brutalist-gray text-sm uppercase">
                      Location
                    </span>
                    <span className="font-mono text-brutalist-white font-bold">
                      San Francisco, CA
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-brutalist-gray pb-2">
                    <span className="font-mono text-brutalist-gray text-sm uppercase">
                      Experience
                    </span>
                    <span className="font-mono text-brutalist-white font-bold">
                      2+ Years
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-brutalist-gray pb-2">
                    <span className="font-mono text-brutalist-gray text-sm uppercase">
                      Focus
                    </span>
                    <span className="font-mono text-brutalist-white font-bold">
                      Full-Stack
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-brutalist-gray text-sm uppercase">
                      Availability
                    </span>
                    <span className="font-mono text-brutalist-yellow font-bold">
                      OPEN
                    </span>
                  </div>
                </div>
              </BrutalistCard>
            </motion.div>

            {/* Right Column - Story and Narrative */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Personal Story */}
              <div className="space-y-6">
                <h3 className="font-mono font-black text-2xl md:text-3xl text-brutalist-yellow uppercase tracking-tight">
                  MY STORY
                </h3>

                <div className="space-y-4 text-brutalist-gray font-mono leading-relaxed">
                  <p className="text-lg">
                    I&apos;m a{" "}
                    <span className="text-brutalist-white font-bold">
                      problem-solver at heart
                    </span>
                    . Every line of code I write is driven by a simple question:
                    <span className="text-brutalist-yellow">
                      {" "}
                      &ldquo;How can this make someone&apos;s life
                      better?&rdquo;
                    </span>
                  </p>

                  <p>
                    My journey into development started with curiosity and
                    frustration. I was working in marketing and constantly
                    hitting walls with what technology could do for our
                    campaigns. Instead of accepting limitations, I decided to{" "}
                    <span className="text-brutalist-white font-bold">
                      build the solutions myself
                    </span>
                    .
                  </p>

                  <p>
                    What began as weekend tinkering with HTML and CSS quickly
                    evolved into a passion for creating digital experiences that
                    actually convert. I realized that beautiful code means
                    nothing if it doesn&apos;t
                    <span className="text-brutalist-yellow">
                      {" "}
                      drive real business results
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Why I Became a Developer */}
              <BrutalistCard
                title="WHY I CODE"
                description="The driving forces behind my passion for development"
                hover="lift"
                className="bg-brutalist-black border-brutalist-white"
              >
                <div className="space-y-4 text-brutalist-gray font-mono">
                  <div className="flex items-start space-x-3">
                    <span className="text-brutalist-yellow text-xl font-bold">
                      01
                    </span>
                    <div>
                      <h4 className="text-brutalist-white font-bold mb-1">
                        IMPACT
                      </h4>
                      <p className="text-sm">
                        Every project is an opportunity to solve real problems
                        and create measurable value for businesses and users.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-brutalist-yellow text-xl font-bold">
                      02
                    </span>
                    <div>
                      <h4 className="text-brutalist-white font-bold mb-1">
                        CREATIVITY
                      </h4>
                      <p className="text-sm">
                        Coding is my creative outlet. Building something from
                        nothing and watching it come to life never gets old.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-brutalist-yellow text-xl font-bold">
                      03
                    </span>
                    <div>
                      <h4 className="text-brutalist-white font-bold mb-1">
                        GROWTH
                      </h4>
                      <p className="text-sm">
                        Technology evolves daily. I love the constant learning
                        and the challenge of staying ahead of the curve.
                      </p>
                    </div>
                  </div>
                </div>
              </BrutalistCard>

              {/* Current Focus */}
              <div className="space-y-4">
                <h3 className="font-mono font-black text-xl text-brutalist-white uppercase tracking-tight">
                  CURRENTLY FOCUSED ON
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-brutalist-yellow bg-brutalist-black p-4">
                    <h4 className="font-mono font-bold text-brutalist-yellow text-sm uppercase mb-2">
                      LEARNING
                    </h4>
                    <p className="font-mono text-brutalist-gray text-xs">
                      Advanced Next.js patterns, AI integration, and performance
                      optimization
                    </p>
                  </div>
                  <div className="border-2 border-brutalist-white bg-brutalist-black p-4">
                    <h4 className="font-mono font-bold text-brutalist-white text-sm uppercase mb-2">
                      BUILDING
                    </h4>
                    <p className="font-mono text-brutalist-gray text-xs">
                      SaaS platforms that help small businesses scale their
                      operations
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Outside Interests Section */}
          <motion.div className="mt-20" variants={itemVariants}>
            <h3 className="font-mono font-black text-2xl md:text-3xl text-brutalist-yellow uppercase tracking-tight text-center mb-12">
              WHEN I&apos;M NOT CODING
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {interests.map((interest) => (
                <motion.div
                  key={interest.label}
                  className="group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="border-3 border-brutalist-white bg-brutalist-black p-4 text-center hover:border-brutalist-yellow hover:bg-brutalist-yellow hover:text-brutalist-black transition-all duration-300 cursor-pointer">
                    <div className="text-3xl mb-2">{interest.icon}</div>
                    <h4 className="font-mono font-bold text-xs uppercase mb-1 group-hover:text-brutalist-black">
                      {interest.label}
                    </h4>
                    <p className="font-mono text-xs text-brutalist-gray group-hover:text-brutalist-black">
                      {interest.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="mt-20 text-center border-t-5 border-brutalist-yellow pt-12"
            variants={itemVariants}
          >
            <h3 className="font-mono font-black text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">
              LET&apos;S BUILD SOMETHING
              <span className="text-brutalist-yellow ml-2">AMAZING</span>
            </h3>
            <p className="font-mono text-brutalist-gray text-lg mb-8 max-w-2xl mx-auto">
              Ready to turn your ideas into reality? I&apos;m always excited to
              work on projects that challenge me and create real value.
            </p>
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
              GET IN TOUCH
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
