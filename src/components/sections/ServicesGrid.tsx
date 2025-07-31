"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Zap,
  Globe,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import BrutalistCard from "@/components/ui/BrutalistCard";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  starting_price: string;
  delivery_time: string;
}

const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern technologies for maximum performance and user experience.",
    icon: <Code className="w-8 h-8" />,
    features: [
      "React/Next.js",
      "TypeScript",
      "Responsive Design",
      "SEO Optimized",
    ],
    starting_price: "$2,500",
    delivery_time: "2-4 weeks",
  },
  {
    id: "ecommerce",
    title: "E-commerce Solutions",
    description:
      "Complete online stores with payment integration, inventory management, and conversion optimization.",
    icon: <ShoppingCart className="w-8 h-8" />,
    features: [
      "Shopify/WooCommerce",
      "Payment Integration",
      "Inventory Management",
      "Analytics",
    ],
    starting_price: "$3,500",
    delivery_time: "3-6 weeks",
  },
  {
    id: "saas-platforms",
    title: "SaaS Platforms",
    description:
      "Scalable software-as-a-service applications with user management, subscriptions, and analytics.",
    icon: <Globe className="w-8 h-8" />,
    features: [
      "User Authentication",
      "Subscription Billing",
      "API Development",
      "Dashboard UI",
    ],
    starting_price: "$5,000",
    delivery_time: "6-12 weeks",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "User-centered design solutions that combine aesthetics with functionality for optimal user experience.",
    icon: <Palette className="w-8 h-8" />,
    features: ["Wireframing", "Prototyping", "User Research", "Design Systems"],
    starting_price: "$1,500",
    delivery_time: "1-3 weeks",
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    description:
      "Speed up your existing website with advanced optimization techniques and best practices.",
    icon: <Zap className="w-8 h-8" />,
    features: [
      "Core Web Vitals",
      "Bundle Optimization",
      "Image Optimization",
      "Caching Strategies",
    ],
    starting_price: "$1,200",
    delivery_time: "1-2 weeks",
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description:
      "Cross-platform mobile applications using React Native for iOS and Android platforms.",
    icon: <Smartphone className="w-8 h-8" />,
    features: [
      "React Native",
      "Cross-platform",
      "App Store Deployment",
      "Push Notifications",
    ],
    starting_price: "$4,000",
    delivery_time: "4-8 weeks",
  },
];

const ServicesGrid: React.FC = () => {
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

  return (
    <section className="py-20 bg-brutalist-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-mono font-black text-brutalist-black mb-6 uppercase tracking-wider">
            SERVICES
          </h2>
          <div className="w-24 h-2 bg-brutalist-yellow mx-auto mb-6"></div>
          <p className="text-lg font-mono text-brutalist-gray max-w-2xl mx-auto">
            COMPREHENSIVE DIGITAL SOLUTIONS TO TRANSFORM YOUR BUSINESS
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <div className="relative">
                {/* Glassmorphism overlay that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brutalist-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none border-5 border-transparent group-hover:border-brutalist-yellow"></div>

                <BrutalistCard
                  title={service.title}
                  description={service.description}
                  hover="glow"
                  className="h-full relative overflow-hidden group-hover:border-brutalist-yellow transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-brutalist-black text-brutalist-yellow mb-4 border-3 border-brutalist-black group-hover:bg-brutalist-yellow group-hover:text-brutalist-black transition-all duration-300">
                    {service.icon}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs font-mono text-brutalist-gray"
                      >
                        <div className="w-2 h-2 bg-brutalist-yellow mr-2 border border-brutalist-black"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Pricing and Timeline */}
                  <div className="border-t-3 border-brutalist-black pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-mono text-brutalist-gray uppercase">
                          Starting at
                        </p>
                        <p className="text-lg font-black text-brutalist-black">
                          {service.starting_price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-brutalist-gray uppercase">
                          Timeline
                        </p>
                        <p className="text-sm font-bold text-brutalist-black">
                          {service.delivery_time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Animated border accent */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-brutalist-yellow group-hover:w-full transition-all duration-500"></div>
                </BrutalistCard>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-lg font-mono text-brutalist-gray mb-6">
            DON&apos;T SEE WHAT YOU NEED? LET&apos;S DISCUSS YOUR PROJECT
          </p>
          <motion.button
            className="bg-brutalist-black text-brutalist-yellow px-8 py-4 border-5 border-brutalist-black font-mono font-black uppercase tracking-wider hover:bg-brutalist-yellow hover:text-brutalist-black transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GET CUSTOM QUOTE
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrid;
