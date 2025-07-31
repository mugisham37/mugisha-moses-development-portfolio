"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TestimonialsCarouselProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  // Star rating component with animation
  const StarRating: React.FC<{ rating: number; animated?: boolean }> = ({
    rating,
    animated = true,
  }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={animated ? { scale: 0, rotate: -180 } : {}}
          animate={animated ? { scale: 1, rotate: 0 } : {}}
          transition={
            animated
              ? {
                  delay: i * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }
              : {}
          }
        >
          <span
            className={cn(
              "text-xl transition-colors duration-300",
              i < rating ? "text-brutalist-yellow" : "text-gray-300"
            )}
          >
            ★
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-4">
            Client Success Stories
          </h2>
          <p className="text-lg font-mono font-bold opacity-80 max-w-2xl mx-auto">
            Real results from real clients who trusted us with their vision
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="border-5 border-black bg-white p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Quote Icon */}
                <div className="flex justify-center">
                  <Quote className="w-12 h-12 text-brutalist-yellow" />
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-lg md:text-xl font-mono font-medium text-center leading-relaxed">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Star Rating */}
                <div className="flex justify-center">
                  <StarRating rating={currentTestimonial.rating} />
                </div>

                {/* Client Info */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  {/* Client Photo */}
                  <div className="relative">
                    <div className="w-20 h-20 border-3 border-black bg-brutalist-yellow flex items-center justify-center">
                      <div className="w-16 h-16 bg-black border-2 border-white"></div>
                    </div>
                    {/* Video Play Button (if video testimonial) */}
                    {currentTestimonial.id === "testimonial-1" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-brutalist-yellow border-2 border-black flex items-center justify-center hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  {/* Client Details */}
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-black font-mono">
                      {currentTestimonial.client_name}
                    </h4>
                    <p className="text-sm font-bold font-mono opacity-80">
                      {currentTestimonial.client_title}
                    </p>
                    <p className="text-sm font-mono font-bold text-brutalist-yellow">
                      {currentTestimonial.company}
                    </p>
                  </div>

                  {/* Company Logo */}
                  <div className="w-16 h-16 border-3 border-black bg-white flex items-center justify-center">
                    <div className="w-12 h-12 bg-brutalist-yellow border border-black"></div>
                  </div>
                </div>

                {/* Results Badge */}
                {currentTestimonial.results && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="bg-black text-brutalist-yellow border-3 border-brutalist-yellow px-6 py-2 font-mono font-bold text-sm uppercase tracking-wider">
                      {currentTestimonial.results}
                    </div>
                  </motion.div>
                )}

                {/* Project Type Badge */}
                <div className="flex justify-center">
                  <span className="bg-brutalist-yellow text-black border-2 border-black px-4 py-1 font-mono font-bold text-xs uppercase tracking-wider">
                    {currentTestimonial.project_type} Project
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border-3 border-black bg-white hover:bg-brutalist-yellow transition-colors duration-300 flex items-center justify-center group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border-3 border-black bg-white hover:bg-brutalist-yellow transition-colors duration-300 flex items-center justify-center group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={cn(
                  "w-4 h-4 border-2 border-black transition-all duration-300",
                  index === currentIndex
                    ? "bg-brutalist-yellow scale-125"
                    : "bg-white hover:bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Grid Preview */}
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-black font-mono uppercase tracking-wider text-center mb-8"
          >
            All Client Reviews
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => goToTestimonial(index)}
                className={cn(
                  "border-3 border-black bg-white p-6 cursor-pointer transition-all duration-300",
                  index === currentIndex && "bg-brutalist-yellow"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={testimonial.rating} animated={false} />
                  <div className="w-8 h-8 border-2 border-black bg-brutalist-yellow"></div>
                </div>

                <p className="text-sm font-mono font-medium mb-4 line-clamp-3">
                  "{testimonial.content}"
                </p>

                <div className="space-y-2">
                  <div className="font-mono font-bold text-sm">
                    {testimonial.client_name}
                  </div>
                  <div className="font-mono text-xs opacity-80">
                    {testimonial.client_title}, {testimonial.company}
                  </div>
                  {testimonial.results && (
                    <div className="text-xs font-bold font-mono bg-black text-brutalist-yellow px-2 py-1 inline-block">
                      {testimonial.results}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Modal (placeholder for video testimonial) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              onClick={() => setIsPlaying(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white border-5 border-brutalist-yellow p-8 max-w-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video bg-black border-3 border-brutalist-yellow flex items-center justify-center mb-4">
                  <div className="text-brutalist-yellow font-mono font-bold text-center">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p>Video Testimonial</p>
                    <p className="text-sm opacity-80">
                      {currentTestimonial.client_name} -{" "}
                      {currentTestimonial.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="w-full bg-brutalist-yellow border-3 border-black py-3 font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                >
                  Close Video
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
