"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnhancedService,
  ServiceFeature,
  EnhancedPricingTier,
} from "@/types/enhanced";

// Service data for the pricing calculator
const serviceData: EnhancedService[] = [
  {
    id: "react-development",
    name: "React Development",
    description: "Modern, interactive web applications",
    detailedDescription:
      "Custom React applications with state management, API integration, and responsive design",
    category: "development",
    complexity: "moderate",
    availability: true,
    timeline: "2-4 weeks",
    features: [
      {
        id: "react-components",
        name: "Custom React Components",
        description: "Reusable, modular components",
        included: true,
        optional: false,
        estimatedHours: 20,
      },
      {
        id: "state-management",
        name: "State Management",
        description: "Redux/Zustand implementation",
        included: true,
        optional: false,
        estimatedHours: 15,
      },
      {
        id: "api-integration",
        name: "API Integration",
        description: "REST/GraphQL API connections",
        included: true,
        optional: false,
        estimatedHours: 12,
      },
      {
        id: "responsive-design",
        name: "Responsive Design",
        description: "Mobile-first responsive layouts",
        included: true,
        optional: false,
        estimatedHours: 10,
      },
      {
        id: "testing-suite",
        name: "Testing Suite",
        description: "Unit and integration tests",
        included: false,
        optional: true,
        additionalCost: 800,
        estimatedHours: 16,
      },
      {
        id: "performance-optimization",
        name: "Performance Optimization",
        description: "Code splitting and lazy loading",
        included: false,
        optional: true,
        additionalCost: 600,
        estimatedHours: 12,
      },
      {
        id: "seo-optimization",
        name: "SEO Optimization",
        description: "Meta tags and structured data",
        included: false,
        optional: true,
        additionalCost: 400,
        estimatedHours: 8,
      },
    ],
    pricing: [
      {
        id: "basic",
        name: "Basic",
        basePrice: 2500,
        description: "Essential React application",
        features: [],
        customizable: true,
        estimatedTimeline: "2-3 weeks",
        supportLevel: "basic",
        revisions: 2,
        supportDuration: "30 days",
      },
      {
        id: "standard",
        name: "Standard",
        basePrice: 4500,
        description: "Full-featured React application",
        features: [],
        popular: true,
        customizable: true,
        estimatedTimeline: "3-4 weeks",
        supportLevel: "standard",
        revisions: 3,
        supportDuration: "60 days",
      },
      {
        id: "premium",
        name: "Premium",
        basePrice: 7500,
        description: "Enterprise-grade React application",
        features: [],
        customizable: true,
        estimatedTimeline: "4-6 weeks",
        supportLevel: "premium",
        revisions: 5,
        supportDuration: "90 days",
      },
    ],
    deliverables: [],
    process: [],
    requirements: [],
    addOns: [],
    testimonials: [],
    relatedProjects: [],
    faq: [],
  },
  {
    id: "ecommerce-development",
    name: "E-commerce Platform",
    description: "High-converting online stores",
    detailedDescription:
      "Complete e-commerce solution with payment processing, inventory management, and admin dashboard",
    category: "development",
    complexity: "complex",
    availability: true,
    timeline: "4-8 weeks",
    features: [
      {
        id: "product-catalog",
        name: "Product Catalog",
        description: "Product management system",
        included: true,
        optional: false,
        estimatedHours: 25,
      },
      {
        id: "shopping-cart",
        name: "Shopping Cart",
        description: "Advanced cart functionality",
        included: true,
        optional: false,
        estimatedHours: 20,
      },
      {
        id: "payment-gateway",
        name: "Payment Gateway",
        description: "Stripe/PayPal integration",
        included: true,
        optional: false,
        estimatedHours: 18,
      },
      {
        id: "user-accounts",
        name: "User Accounts",
        description: "Customer registration and profiles",
        included: true,
        optional: false,
        estimatedHours: 15,
      },
      {
        id: "admin-dashboard",
        name: "Admin Dashboard",
        description: "Order and inventory management",
        included: true,
        optional: false,
        estimatedHours: 30,
      },
      {
        id: "inventory-management",
        name: "Advanced Inventory",
        description: "Stock tracking and alerts",
        included: false,
        optional: true,
        additionalCost: 1200,
        estimatedHours: 20,
      },
      {
        id: "multi-vendor",
        name: "Multi-vendor Support",
        description: "Multiple seller marketplace",
        included: false,
        optional: true,
        additionalCost: 2500,
        estimatedHours: 40,
      },
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        description: "Sales and customer analytics",
        included: false,
        optional: true,
        additionalCost: 1000,
        estimatedHours: 16,
      },
    ],
    pricing: [
      {
        id: "basic",
        name: "Basic Store",
        basePrice: 5000,
        description: "Essential e-commerce features",
        features: [],
        customizable: true,
        estimatedTimeline: "4-5 weeks",
        supportLevel: "basic",
        revisions: 2,
        supportDuration: "30 days",
      },
      {
        id: "standard",
        name: "Professional Store",
        basePrice: 8500,
        description: "Full-featured online store",
        features: [],
        popular: true,
        customizable: true,
        estimatedTimeline: "5-7 weeks",
        supportLevel: "standard",
        revisions: 3,
        supportDuration: "60 days",
      },
      {
        id: "premium",
        name: "Enterprise Store",
        basePrice: 15000,
        description: "Advanced e-commerce platform",
        features: [],
        customizable: true,
        estimatedTimeline: "7-10 weeks",
        supportLevel: "premium",
        revisions: 5,
        supportDuration: "90 days",
      },
    ],
    deliverables: [],
    process: [],
    requirements: [],
    addOns: [],
    testimonials: [],
    relatedProjects: [],
    faq: [],
  },
  {
    id: "saas-development",
    name: "SaaS Platform",
    description: "Scalable software solutions",
    detailedDescription:
      "Multi-tenant SaaS platform with user management, billing, and analytics",
    category: "development",
    complexity: "enterprise",
    availability: true,
    timeline: "8-16 weeks",
    features: [
      {
        id: "multi-tenant",
        name: "Multi-tenant Architecture",
        description: "Scalable tenant isolation",
        included: true,
        optional: false,
        estimatedHours: 40,
      },
      {
        id: "user-auth",
        name: "User Authentication",
        description: "JWT-based auth system",
        included: true,
        optional: false,
        estimatedHours: 25,
      },
      {
        id: "billing-system",
        name: "Subscription Billing",
        description: "Automated billing and invoicing",
        included: true,
        optional: false,
        estimatedHours: 35,
      },
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        description: "Real-time metrics and reporting",
        included: true,
        optional: false,
        estimatedHours: 30,
      },
      {
        id: "api-development",
        name: "REST API",
        description: "Comprehensive API with documentation",
        included: true,
        optional: false,
        estimatedHours: 45,
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics",
        description: "Custom reporting and insights",
        included: false,
        optional: true,
        additionalCost: 2000,
        estimatedHours: 32,
      },
      {
        id: "white-labeling",
        name: "White Labeling",
        description: "Custom branding options",
        included: false,
        optional: true,
        additionalCost: 1500,
        estimatedHours: 24,
      },
      {
        id: "mobile-app",
        name: "Mobile App",
        description: "React Native companion app",
        included: false,
        optional: true,
        additionalCost: 5000,
        estimatedHours: 80,
      },
    ],
    pricing: [
      {
        id: "basic",
        name: "Startup SaaS",
        basePrice: 10000,
        description: "MVP SaaS platform",
        features: [],
        customizable: true,
        estimatedTimeline: "8-10 weeks",
        supportLevel: "basic",
        revisions: 3,
        supportDuration: "60 days",
      },
      {
        id: "standard",
        name: "Professional SaaS",
        basePrice: 20000,
        description: "Full-featured SaaS platform",
        features: [],
        popular: true,
        customizable: true,
        estimatedTimeline: "10-14 weeks",
        supportLevel: "standard",
        revisions: 4,
        supportDuration: "90 days",
      },
      {
        id: "premium",
        name: "Enterprise SaaS",
        basePrice: 35000,
        description: "Enterprise-grade SaaS solution",
        features: [],
        customizable: true,
        estimatedTimeline: "14-20 weeks",
        supportLevel: "enterprise",
        revisions: 6,
        supportDuration: "120 days",
      },
    ],
    deliverables: [],
    process: [],
    requirements: [],
    addOns: [],
    testimonials: [],
    relatedProjects: [],
    faq: [],
  },
];

interface PriceEstimate {
  basePrice: number;
  addOnsCost: number;
  totalPrice: number;
  estimatedHours: number;
  timeline: string;
  selectedFeatures: ServiceFeature[];
  selectedTier: EnhancedPricingTier;
}

interface InteractivePricingCalculatorProps {
  className?: string;
}

export default function InteractivePricingCalculator({
  className = "",
}: InteractivePricingCalculatorProps) {
  const [selectedService, setSelectedService] = useState<EnhancedService>(
    serviceData[0]
  );
  const [selectedTier, setSelectedTier] = useState<EnhancedPricingTier>(
    serviceData[0].pricing[1]
  );
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set()
  );
  const [customRequirements, setCustomRequirements] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  // Calculate price estimate
  const priceEstimate = useMemo((): PriceEstimate => {
    const basePrice = selectedTier.basePrice;
    const selectedOptionalFeatures = selectedService.features.filter(
      (feature) => feature.optional && selectedFeatures.has(feature.id)
    );

    const addOnsCost = selectedOptionalFeatures.reduce(
      (total, feature) => total + (feature.additionalCost || 0),
      0
    );

    const totalHours = selectedOptionalFeatures.reduce(
      (total, feature) => total + (feature.estimatedHours || 0),
      0
    );

    // Base hours estimation (rough calculation)
    const baseHours = Math.floor(basePrice / 50); // Assuming $50/hour base rate
    const estimatedHours = baseHours + totalHours;

    // Timeline calculation based on hours
    let timeline = selectedTier.estimatedTimeline;
    if (totalHours > 40) {
      const weeks = Math.ceil((baseHours + totalHours) / 40);
      timeline = `${weeks}-${weeks + 2} weeks`;
    }

    return {
      basePrice,
      addOnsCost,
      totalPrice: basePrice + addOnsCost,
      estimatedHours,
      timeline,
      selectedFeatures: selectedOptionalFeatures,
      selectedTier,
    };
  }, [selectedService, selectedTier, selectedFeatures]);

  // Reset selections when service changes
  useEffect(() => {
    setSelectedTier(selectedService.pricing[1] || selectedService.pricing[0]);
    setSelectedFeatures(new Set());
  }, [selectedService]);

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = new Set(selectedFeatures);
    if (newFeatures.has(featureId)) {
      newFeatures.delete(featureId);
    } else {
      newFeatures.add(featureId);
    }
    setSelectedFeatures(newFeatures);
  };

  const handleExportEstimate = () => {
    const estimateData = {
      service: selectedService.name,
      tier: selectedTier.name,
      basePrice: priceEstimate.basePrice,
      addOns: priceEstimate.selectedFeatures.map((f) => ({
        name: f.name,
        cost: f.additionalCost || 0,
      })),
      totalPrice: priceEstimate.totalPrice,
      timeline: priceEstimate.timeline,
      customRequirements,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(estimateData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `price-estimate-${selectedService.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className={`bg-brutalist-light-gray py-20 border-b-5 border-black ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider mb-6">
            Interactive Pricing Calculator
          </h2>
          <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
            Get an instant estimate for your project. Customize features and see
            real-time pricing updates.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Type Selection */}
              <div className="border-5 border-black bg-white p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  1. Select Service Type
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {serviceData.map((service) => (
                    <motion.button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 border-3 font-mono font-bold text-left transition-all duration-300 ${
                        selectedService.id === service.id
                          ? "border-brutalist-yellow bg-brutalist-yellow text-black"
                          : "border-black bg-brutalist-light-gray hover:bg-brutalist-yellow"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm uppercase tracking-wider mb-2">
                        {service.name}
                      </div>
                      <div className="text-xs opacity-80">
                        {service.description}
                      </div>
                      <div className="text-xs mt-2 opacity-60">
                        From ${service.pricing[0].basePrice.toLocaleString()}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tier Selection */}
              <div className="border-5 border-black bg-white p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  2. Choose Package Tier
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedService.pricing.map((tier) => (
                    <motion.button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-4 border-3 font-mono text-left transition-all duration-300 relative ${
                        selectedTier.id === tier.id
                          ? "border-brutalist-yellow bg-brutalist-yellow text-black"
                          : "border-black bg-brutalist-light-gray hover:bg-brutalist-yellow"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2 -right-2 bg-black text-brutalist-yellow px-2 py-1 text-xs font-bold">
                          POPULAR
                        </div>
                      )}
                      <div className="text-sm font-bold uppercase tracking-wider mb-2">
                        {tier.name}
                      </div>
                      <div className="text-2xl font-black mb-2">
                        ${tier.basePrice.toLocaleString()}
                      </div>
                      <div className="text-xs opacity-80 mb-2">
                        {tier.description}
                      </div>
                      <div className="text-xs opacity-60">
                        {tier.estimatedTimeline} • {tier.revisions} revisions
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feature Selection */}
              <div className="border-5 border-black bg-white p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  3. Add Optional Features
                </h3>

                {/* Included Features */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold font-mono uppercase tracking-wider mb-4 text-green-600">
                    ✓ Included Features
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedService.features
                      .filter((feature) => feature.included)
                      .map((feature) => (
                        <div
                          key={feature.id}
                          className="p-3 border-2 border-green-600 bg-green-50 font-mono text-sm"
                        >
                          <div className="font-bold text-green-800">
                            {feature.name}
                          </div>
                          <div className="text-green-600 text-xs">
                            {feature.description}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Optional Features */}
                <div>
                  <h4 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
                    Optional Add-ons
                  </h4>
                  <div className="space-y-3">
                    {selectedService.features
                      .filter((feature) => feature.optional)
                      .map((feature) => (
                        <motion.label
                          key={feature.id}
                          className={`flex items-start space-x-4 p-4 border-3 cursor-pointer transition-all duration-300 ${
                            selectedFeatures.has(feature.id)
                              ? "border-brutalist-yellow bg-brutalist-yellow"
                              : "border-black bg-brutalist-light-gray hover:bg-gray-100"
                          }`}
                          whileHover={{ scale: 1.01 }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.has(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="font-mono font-bold text-sm">
                              {feature.name}
                            </div>
                            <div className="font-mono text-xs opacity-80 mb-2">
                              {feature.description}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-sm font-bold">
                                +$
                                {feature.additionalCost?.toLocaleString() || 0}
                              </span>
                              <span className="font-mono text-xs opacity-60">
                                ~{feature.estimatedHours}h
                              </span>
                            </div>
                          </div>
                        </motion.label>
                      ))}
                  </div>
                </div>
              </div>

              {/* Custom Requirements */}
              <div className="border-5 border-black bg-white p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  4. Custom Requirements
                </h3>
                <textarea
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="Describe any specific requirements, integrations, or custom features you need..."
                  className="w-full h-32 p-4 border-3 border-black font-mono text-sm resize-none focus:outline-none focus:border-brutalist-yellow"
                />
                <p className="font-mono text-xs opacity-60 mt-2">
                  Custom requirements may affect final pricing and timeline
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <motion.div
                  className="border-5 border-brutalist-yellow bg-brutalist-yellow p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`${selectedService.id}-${selectedTier.id}-${Array.from(
                    selectedFeatures
                  ).join(",")}`}
                >
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                    Price Estimate
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Service:</span>
                      <span className="font-mono text-sm">
                        {selectedService.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Package:</span>
                      <span className="font-mono text-sm">
                        {selectedTier.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Base Price:</span>
                      <span className="font-mono font-bold">
                        ${priceEstimate.basePrice.toLocaleString()}
                      </span>
                    </div>

                    {priceEstimate.selectedFeatures.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-mono font-bold text-sm">
                          Add-ons:
                        </div>
                        {priceEstimate.selectedFeatures.map((feature) => (
                          <div
                            key={feature.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="font-mono">{feature.name}</span>
                            <span className="font-mono">
                              +${feature.additionalCost?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                          <span className="font-mono font-bold">
                            Add-ons Total:
                          </span>
                          <span className="font-mono font-bold">
                            ${priceEstimate.addOnsCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-2xl font-black font-mono pt-4 border-t-4 border-black">
                      <span>Total:</span>
                      <span>${priceEstimate.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="opacity-80">Estimated Hours:</span>
                      <span className="font-bold">
                        {priceEstimate.estimatedHours}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Timeline:</span>
                      <span className="font-bold">
                        {priceEstimate.timeline}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Support:</span>
                      <span className="font-bold">
                        {selectedTier.supportDuration}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleExportEstimate}
                      className="w-full bg-black text-brutalist-yellow border-3 border-black px-6 py-3 font-mono font-bold hover:bg-brutalist-yellow hover:text-black transition-colors duration-300"
                    >
                      Export Estimate
                    </button>

                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="w-full bg-brutalist-light-gray text-black border-3 border-black px-6 py-3 font-mono font-bold hover:bg-white transition-colors duration-300"
                    >
                      {showComparison ? "Hide" : "Show"} Comparison
                    </button>

                    <a
                      href="/contact"
                      className="block w-full bg-brutalist-yellow text-black border-3 border-black px-6 py-3 font-mono font-bold text-center hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                    >
                      Get Started →
                    </a>
                  </div>
                </motion.div>

                {/* Package Comparison */}
                <AnimatePresence>
                  {showComparison && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 border-5 border-black bg-white p-6"
                    >
                      <h4 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                        Package Comparison
                      </h4>
                      <div className="space-y-4">
                        {selectedService.pricing.map((tier) => (
                          <div
                            key={tier.id}
                            className={`p-3 border-2 font-mono text-sm ${
                              tier.id === selectedTier.id
                                ? "border-brutalist-yellow bg-brutalist-yellow"
                                : "border-gray-300 bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold">{tier.name}</span>
                              <span className="font-bold">
                                ${tier.basePrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs opacity-80">
                              {tier.estimatedTimeline} • {tier.revisions}{" "}
                              revisions • {tier.supportDuration} support
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
