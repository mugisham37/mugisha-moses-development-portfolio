"use client";

import React from "react";
import { motion } from "framer-motion";
// import Image from "next/image"; // Uncomment when adding actual headshot
import { VantaBackground } from "@/components/interactive";
import { BrutalistButton, AnimatedText } from "@/components/ui";
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

  return (
    <section
      id="hero"
      className={cn("relative min-h-screen flex items-center", className)}
    >
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

                {/* Animated Specialties */}
                <motion.div
                  className="text-xl md:text-2xl lg:text-3xl font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <AnimatedText
                    text="React Apps • E-commerce • SaaS Platforms"
                    variant="typing"
                    delay={1500}
                    speed={80}
                    className="text-safe-on-dark-gray"
                    style={{
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                      color: "var(--brutalist-white)",
                    }}
                  />
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-lg md:text-xl max-w-2xl font-mono leading-relaxed text-safe-on-dark-gray"
                  style={{
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
                    color: "var(--brutalist-light-gray)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  Full-stack developer specializing in high-performance web
                  applications that drive business results. From concept to
                  conversion, I build digital solutions that work.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <BrutalistButton
                    variant="accent"
                    size="lg"
                    glow={true}
                    onClick={handleViewWork}
                    className="min-w-[200px]"
                    ariaLabel="View my portfolio work"
                  >
                    VIEW MY WORK
                  </BrutalistButton>
                  <BrutalistButton
                    variant="secondary"
                    size="lg"
                    onClick={handleGetInTouch}
                    className="min-w-[200px]"
                    ariaLabel="Get in touch for project inquiries"
                  >
                    GET IN TOUCH
                  </BrutalistButton>
                </motion.div>
              </motion.div>

              {/* Right Column - Professional Headshot */}
              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="relative">
                  {/* Glow Effect Background */}
                  <motion.div
                    className="absolute inset-0 bg-brutalist-yellow rounded-lg blur-xl opacity-20"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Professional Headshot */}
                  <div className="relative border-5 border-brutalist-yellow bg-brutalist-black p-2">
                    <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] relative overflow-hidden bg-brutalist-gray">
                      {/* Placeholder for professional headshot */}
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brutalist-gray to-brutalist-black">
                        <div className="text-center space-y-4">
                          <div className="w-32 h-32 mx-auto bg-brutalist-yellow rounded-full flex items-center justify-center">
                            <span className="text-4xl font-mono font-black text-brutalist-black">
                              DEV
                            </span>
                          </div>
                          <p className="font-mono text-brutalist-yellow text-sm uppercase tracking-wider">
                            Professional Photo
                          </p>
                          <p className="font-mono text-brutalist-white text-xs">
                            Replace with actual headshot
                          </p>
                        </div>
                      </div>

                      {/* When you have an actual photo, replace the above div with: */}
                      {/* <Image
                        src="/images/professional-headshot.jpg"
                        alt="Professional headshot of developer"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 400px"
                      /> */}
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-brutalist-yellow"
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-brutalist-white"
                    animate={{ rotate: [360, 270, 180, 90, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Stats Row */}
            <motion.div
              className="mt-20 pt-12 border-t-5 border-brutalist-yellow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div
                    className="text-3xl md:text-4xl font-mono font-black"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                      color: "var(--brutalist-yellow)",
                      WebkitTextStroke: "1px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    2+
                  </div>
                  <div
                    className="text-sm font-mono uppercase tracking-wider text-safe-on-dark-gray"
                    style={{
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
                      color: "var(--brutalist-light-gray)",
                    }}
                  >
                    Years Experience
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className="text-3xl md:text-4xl font-mono font-black"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                      color: "var(--brutalist-yellow)",
                      WebkitTextStroke: "1px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    100+
                  </div>
                  <div
                    className="text-sm font-mono uppercase tracking-wider text-safe-on-dark-gray"
                    style={{
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
                      color: "var(--brutalist-light-gray)",
                    }}
                  >
                    Projects Completed
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className="text-3xl md:text-4xl font-mono font-black"
                    style={{
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
                      color: "var(--brutalist-yellow)",
                      WebkitTextStroke: "1px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    98%
                  </div>
                  <div
                    className="text-sm font-mono uppercase tracking-wider text-safe-on-dark-gray"
                    style={{
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
                      color: "var(--brutalist-light-gray)",
                    }}
                  >
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <motion.button
              onClick={() => {
                const portfolioSection = document.getElementById("portfolio");
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex flex-col items-center space-y-2 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50 rounded-lg p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to portfolio section"
            >
              {/* Scroll Text */}
              <motion.span
                className="font-mono text-xs uppercase tracking-wider group-hover:text-brutalist-yellow transition-colors duration-300"
                style={{
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                  color: "var(--brutalist-light-gray)",
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                SCROLL
              </motion.span>

              {/* Animated Arrow */}
              <div className="relative">
                {/* Arrow Container */}
                <motion.div
                  className="w-6 h-10 border-2 border-brutalist-yellow rounded-full flex justify-center"
                  animate={{
                    borderColor: ["#ffff00", "#ffffff", "#ffff00"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Animated Dot */}
                  <motion.div
                    className="w-1 h-1 rounded-full mt-2"
                    style={{
                      backgroundColor: "var(--brutalist-yellow)",
                      boxShadow: "0 0 4px rgba(255, 255, 0, 0.8)",
                    }}
                    animate={{
                      y: [0, 16, 0],
                      backgroundColor: [
                        "var(--brutalist-yellow)",
                        "var(--brutalist-white)",
                        "var(--brutalist-yellow)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Brutalist Arrow Below */}
                <motion.div
                  className="mt-2 flex flex-col items-center"
                  animate={{ y: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent group-hover:border-t-white transition-colors duration-300"
                    style={{
                      borderTopColor: "var(--brutalist-yellow)",
                      filter: "drop-shadow(0 0 2px rgba(255, 255, 0, 0.6))",
                    }}
                  />
                  <div
                    className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent group-hover:border-t-white transition-colors duration-300 -mt-1"
                    style={{
                      borderTopColor: "var(--brutalist-yellow)",
                      filter: "drop-shadow(0 0 2px rgba(255, 255, 0, 0.6))",
                    }}
                  />
                </motion.div>
              </div>

              {/* Additional Brutalist Elements */}
              <motion.div
                className="flex space-x-1 mt-2"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div
                  className="w-1 h-1"
                  style={{
                    backgroundColor: "var(--brutalist-yellow)",
                    boxShadow: "0 0 2px rgba(255, 255, 0, 0.8)",
                  }}
                />
                <div
                  className="w-1 h-1"
                  style={{
                    backgroundColor: "var(--brutalist-white)",
                    boxShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                  }}
                />
                <div
                  className="w-1 h-1"
                  style={{
                    backgroundColor: "var(--brutalist-yellow)",
                    boxShadow: "0 0 2px rgba(255, 255, 0, 0.8)",
                  }}
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </VantaBackground>
    </section>
  );
};

export default HeroSection;
