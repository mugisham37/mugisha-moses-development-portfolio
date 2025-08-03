"use client";

import React from "react";
import { motion } from "framer-motion";
// import Image from "next/image"; // Uncomment when adding actual headshot
import { VantaBackground } from "@/components/interactive";
import { BrutalistButton, AnimatedText } from "@/components/ui";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ClientOnly from "@/components/ui/ClientOnly";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const handleViewWork = () => {
    // Smooth scroll to portfolio section
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetInTouch = () => {
    // Smooth scroll to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fallback background for SSR
  const fallbackBackground = (
    <div className="absolute inset-0 bg-brutalist-black">
      {/* Fallback background pattern */}
      <div
        className="absolute inset-0 opacity-30 animate-pulse"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #FFD700 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #FFD700 2px, transparent 2px)
          `,
          backgroundSize: "50px 50px",
          backgroundPosition: "0 0, 25px 25px",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1
                  className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none text-safe-on-dark-gray uppercase tracking-tight"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    color: "var(--brutalist-white)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  I BUILD
                </motion.h1>
                <motion.h1
                  className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none uppercase tracking-tight"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                    color: "var(--brutalist-yellow)",
                    WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  DIGITAL
                </motion.h1>
                <motion.h1
                  className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none text-safe-on-dark-gray uppercase tracking-tight"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    color: "var(--brutalist-white)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  EXPERIENCES
                </motion.h1>
                <motion.h1
                  className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none uppercase tracking-tight"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                    color: "var(--brutalist-yellow)",
                    WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  THAT CONVERT
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl font-mono font-bold text-safe-on-dark-gray max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Full-stack web developer specializing in high-converting
                digital experiences that drive real business results.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <BrutalistButton
                  onClick={handleViewWork}
                  className="text-lg px-8 py-4"
                  variant="primary"
                  size="lg"
                >
                  View My Work
                </BrutalistButton>
                <BrutalistButton
                  onClick={handleGetInTouch}
                  className="text-lg px-8 py-4"
                  variant="secondary"
                  size="lg"
                >
                  Get In Touch
                </BrutalistButton>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Code Animation */}
              <div className="relative">
                <div className="border-5 border-brutalist-yellow bg-brutalist-black p-6 md:p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-brutalist-gray text-sm font-mono ml-2">
                        portfolio.tsx
                      </span>
                    </div>
                    <AnimatedText
                      text={`const developer = {
  name: "Mugisha Moses",
  skills: ["React", "Next.js", "TypeScript"],
  focus: "High-converting experiences",
  passion: "Problem-solving"
};`}
                      className="text-brutalist-yellow font-mono text-sm md:text-base"
                      speed={50}
                      variant="typing"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="hero"
      className={cn("relative min-h-screen flex items-center", className)}
    >
      <ErrorBoundary
        fallback={fallbackBackground}
      >
        <ClientOnly fallback={fallbackBackground}>
          <VantaBackground className="absolute inset-0">
            {/* Dark overlay to ensure text contrast */}
            <div
              className="absolute inset-0 z-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.7) 100%)",
                backdropFilter: "brightness(0.8)",
              }}
            />
            <div className="relative z-10 container mx-auto px-4 py-20">
              <div className="max-w-6xl mx-auto">
                {/* Main Hero Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Text Content */}
                  <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Main Heading */}
                    <div className="space-y-4">
                      <motion.h1
                        className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none text-safe-on-dark-gray uppercase tracking-tight"
                        style={{
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                          color: "var(--brutalist-white)",
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        I BUILD
                      </motion.h1>
                      <motion.h1
                        className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none uppercase tracking-tight"
                        style={{
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                          color: "var(--brutalist-yellow)",
                          WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        DIGITAL
                      </motion.h1>
                      <motion.h1
                        className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none text-safe-on-dark-gray uppercase tracking-tight"
                        style={{
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                          color: "var(--brutalist-white)",
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        EXPERIENCES
                      </motion.h1>
                      <motion.h1
                        className="font-mono font-black text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-none uppercase tracking-tight"
                        style={{
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                          color: "var(--brutalist-yellow)",
                          WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        THAT CONVERT
                      </motion.h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                      className="text-xl md:text-2xl font-mono font-bold text-safe-on-dark-gray max-w-2xl leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                    >
                      Full-stack web developer specializing in high-converting
                      digital experiences that drive real business results.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    >
                      <BrutalistButton
                        onClick={handleViewWork}
                        className="text-lg px-8 py-4"
                        variant="primary"
                        size="lg"
                      >
                        View My Work
                      </BrutalistButton>
                      <BrutalistButton
                        onClick={handleGetInTouch}
                        className="text-lg px-8 py-4"
                        variant="secondary"
                        size="lg"
                      >
                        Get In Touch
                      </BrutalistButton>
                    </motion.div>
                  </motion.div>

                  {/* Right Column - Visual Elements */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {/* Code Animation */}
                    <div className="relative">
                      <div className="border-5 border-brutalist-yellow bg-brutalist-black p-6 md:p-8">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-brutalist-gray text-sm font-mono ml-2">
                              portfolio.tsx
                            </span>
                          </div>
                          <AnimatedText
                            text={`const developer = {
  name: "Mugisha Moses",
  skills: ["React", "Next.js", "TypeScript"],
  focus: "High-converting experiences",
  passion: "Problem-solving"
};`}
                            className="text-brutalist-yellow font-mono text-sm md:text-base"
                            speed={50}
                            variant="typing"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </VantaBackground>
        </ClientOnly>
      </ErrorBoundary>
    </section>
  );
};

export default HeroSection;
