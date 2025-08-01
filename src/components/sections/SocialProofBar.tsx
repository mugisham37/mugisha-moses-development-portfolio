"use client";

import React from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialProofBarProps {
  className?: string;
}

const SocialProofBar: React.FC<SocialProofBarProps> = ({ className }) => {
  // Stats data
  const stats = [
    { label: "Years Experience", value: "2+", suffix: "" },
    { label: "Projects Completed", value: "100", suffix: "+" },
    { label: "Client Satisfaction", value: "98", suffix: "%" },
    { label: "Businesses Served", value: "50", suffix: "+" },
  ];

  // Create duplicated testimonials for seamless scrolling
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className={cn(
        "py-12 bg-brutalist-light-gray border-y-5 border-black",
        className
      )}
    >
      {/* Trust Statement */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black font-mono uppercase tracking-wider mb-2">
            Trusted by 50+ Businesses
          </h2>
          <p className="text-lg font-mono font-bold opacity-80">
            Delivering exceptional results across industries
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-4 border-3 border-black bg-brutalist-yellow"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-2xl md:text-3xl font-black font-mono"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                >
                  {stat.value}
                </motion.span>
                <span>{stat.suffix}</span>
              </motion.div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scrolling Testimonials Ticker */}
      <div className="relative overflow-hidden bg-black py-6">
        <motion.div
          className="flex space-x-8"
          animate={{
            x: [0, -50 * TESTIMONIALS.length + "%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 flex items-center space-x-4 px-4"
            >
              {/* Company Logo */}
              <div className="w-12 h-12 border-2 border-brutalist-yellow bg-brutalist-light-gray flex items-center justify-center">
                <div className="w-8 h-8 bg-brutalist-yellow border border-black"></div>
              </div>

              {/* Testimonial Content */}
              <div className="max-w-md">
                <p className="text-white font-mono text-sm font-medium leading-relaxed">
                  &ldquo;{testimonial.content.substring(0, 120)}...&rdquo;
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-brutalist-yellow font-mono font-bold text-xs">
                    {testimonial.client_name}
                  </span>
                  <span className="text-white font-mono text-xs opacity-80">
                    {testimonial.client_title}, {testimonial.company}
                  </span>
                  {/* Star Rating */}
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-brutalist-yellow text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {testimonial.results && (
                  <div className="mt-1">
                    <span className="text-brutalist-yellow font-mono font-bold text-xs bg-black border border-brutalist-yellow px-2 py-1">
                      {testimonial.results}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Client Logos Section */}
      <div className="container mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-black font-mono uppercase tracking-wider">
            Trusted by Industry Leaders
          </h3>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {TESTIMONIALS.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="aspect-square border-3 border-black bg-brutalist-light-gray flex items-center justify-center p-4 hover:bg-brutalist-yellow transition-colors duration-300"
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-black mx-auto mb-2"></div>
                <div className="text-xs font-bold font-mono uppercase">
                  {testimonial.company.split(" ")[0]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
