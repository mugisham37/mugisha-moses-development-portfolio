"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { EnhancedService, ServiceFeature, FormField } from "@/types/enhanced";

// Extended service data with compatibility and dependencies
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
        dependencies: [],
      },
      {
        id: "state-management",
        name: "State Management",
        description: "Redux/Zustand implementation",
        included: true,
        optional: false,
        estimatedHours: 15,
        dependencies: ["react-components"],
      },
      {
        id: "api-integration",
        name: "API Integration",
        description: "REST/GraphQL API connections",
        included: true,
        optional: false,
        estimatedHours: 12,
        dependencies: ["state-management"],
      },
      {
        id: "responsive-design",
        name: "Responsive Design",
        description: "Mobile-first responsive layouts",
        included: true,
        optional: false,
        estimatedHours: 10,
        dependencies: ["react-components"],
      },
      {
        id: "testing-suite",
        name: "Testing Suite",
        description: "Unit and integration tests",
        included: false,
        optional: true,
        additionalCost: 800,
        estimatedHours: 16,
        dependencies: ["react-components", "state-management"],
      },
      {
        id: "performance-optimization",
        name: "Performance Optimization",
        description: "Code splitting and lazy loading",
        included: false,
        optional: true,
        additionalCost: 600,
        estimatedHours: 12,
        dependencies: ["react-components"],
      },
      {
        id: "seo-optimization",
        name: "SEO Optimization",
        description: "Meta tags and structured data",
        included: false,
        optional: true,
        additionalCost: 400,
        estimatedHours: 8,
        dependencies: [],
      },
      {
        id: "pwa-features",
        name: "PWA Features",
        description: "Progressive Web App capabilities",
        included: false,
        optional: true,
        additionalCost: 1000,
        estimatedHours: 20,
        dependencies: ["performance-optimization"],
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
        dependencies: [],
      },
      {
        id: "shopping-cart",
        name: "Shopping Cart",
        description: "Advanced cart functionality",
        included: true,
        optional: false,
        estimatedHours: 20,
        dependencies: ["product-catalog"],
      },
      {
        id: "payment-gateway",
        name: "Payment Gateway",
        description: "Stripe/PayPal integration",
        included: true,
        optional: false,
        estimatedHours: 18,
        dependencies: ["shopping-cart"],
      },
      {
        id: "user-accounts",
        name: "User Accounts",
        description: "Customer registration and profiles",
        included: true,
        optional: false,
        estimatedHours: 15,
        dependencies: [],
      },
      {
        id: "admin-dashboard",
        name: "Admin Dashboard",
        description: "Order and inventory management",
        included: true,
        optional: false,
        estimatedHours: 30,
        dependencies: ["product-catalog", "user-accounts"],
      },
      {
        id: "inventory-management",
        name: "Advanced Inventory",
        description: "Stock tracking and alerts",
        included: false,
        optional: true,
        additionalCost: 1200,
        estimatedHours: 20,
        dependencies: ["admin-dashboard"],
      },
      {
        id: "multi-vendor",
        name: "Multi-vendor Support",
        description: "Multiple seller marketplace",
        included: false,
        optional: true,
        additionalCost: 2500,
        estimatedHours: 40,
        dependencies: ["admin-dashboard", "user-accounts"],
      },
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        description: "Sales and customer analytics",
        included: false,
        optional: true,
        additionalCost: 1000,
        estimatedHours: 16,
        dependencies: ["admin-dashboard"],
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
];

interface CustomPackage {
  id: string;
  name: string;
  baseService: EnhancedService;
  selectedFeatures: ServiceFeature[];
  customRequirements: string[];
  estimatedPrice: number;
  estimatedTimeline: string;
  compatibilityScore: number;
}

interface RequirementWizardStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  suggestions: string[];
}

interface ServiceCustomizationBuilderProps {
  className?: string;
}

export default function ServiceCustomizationBuilder({
  className = "",
}: ServiceCustomizationBuilderProps) {
  const [selectedService, setSelectedService] = useState<EnhancedService>(
    serviceData[0]
  );
  const [availableFeatures, setAvailableFeatures] = useState<ServiceFeature[]>(
    []
  );
  const [selectedFeatures, setSelectedFeatures] = useState<ServiceFeature[]>(
    []
  );
  const [customPackage, setCustomPackage] = useState<CustomPackage | null>(
    null
  );
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState<
    Record<string, string | string[]>
  >({});
  const [draggedFeature, setDraggedFeature] = useState<ServiceFeature | null>(
    null
  );

  // Requirement gathering wizard steps
  const wizardSteps: RequirementWizardStep[] = [
    {
      id: "project-basics",
      title: "Project Basics",
      description: "Tell us about your project requirements",
      fields: [
        {
          name: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            { value: "new", label: "New Project" },
            { value: "redesign", label: "Redesign Existing" },
            { value: "enhancement", label: "Feature Enhancement" },
          ],
        },
        {
          name: "timeline",
          label: "Desired Timeline",
          type: "select",
          options: [
            { value: "asap", label: "ASAP (Rush Job)" },
            { value: "1-2months", label: "1-2 Months" },
            { value: "3-6months", label: "3-6 Months" },
            { value: "flexible", label: "Flexible" },
          ],
        },
        {
          name: "budget",
          label: "Budget Range",
          type: "select",
          options: [
            { value: "under-5k", label: "Under $5,000" },
            { value: "5k-15k", label: "$5,000 - $15,000" },
            { value: "15k-30k", label: "$15,000 - $30,000" },
            { value: "over-30k", label: "Over $30,000" },
          ],
        },
      ],
      suggestions: [
        "Consider starting with an MVP for faster time-to-market",
        "Budget flexibility allows for better feature optimization",
        "Rush jobs may require additional resources and cost",
      ],
    },
    {
      id: "technical-requirements",
      title: "Technical Requirements",
      description: "Specify your technical needs and preferences",
      fields: [
        {
          name: "integrations",
          label: "Required Integrations",
          type: "checkbox",
          options: [
            { value: "payment", label: "Payment Processing" },
            { value: "crm", label: "CRM System" },
            { value: "analytics", label: "Analytics Platform" },
            { value: "email", label: "Email Marketing" },
            { value: "social", label: "Social Media" },
          ],
        },
        {
          name: "performance",
          label: "Performance Requirements",
          type: "select",
          options: [
            { value: "standard", label: "Standard Performance" },
            { value: "high", label: "High Performance" },
            { value: "enterprise", label: "Enterprise Grade" },
          ],
        },
        {
          name: "scalability",
          label: "Expected User Load",
          type: "select",
          options: [
            { value: "small", label: "< 1,000 users" },
            { value: "medium", label: "1,000 - 10,000 users" },
            { value: "large", label: "10,000+ users" },
          ],
        },
      ],
      suggestions: [
        "Payment integration adds complexity but essential for e-commerce",
        "High performance requirements may need CDN and optimization",
        "Consider future scalability needs in architecture decisions",
      ],
    },
    {
      id: "business-goals",
      title: "Business Goals",
      description: "Help us understand your business objectives",
      fields: [
        {
          name: "primaryGoal",
          label: "Primary Business Goal",
          type: "select",
          options: [
            { value: "sales", label: "Increase Sales" },
            { value: "leads", label: "Generate Leads" },
            { value: "engagement", label: "User Engagement" },
            { value: "efficiency", label: "Operational Efficiency" },
          ],
        },
        {
          name: "targetAudience",
          label: "Target Audience",
          type: "text",
          placeholder: "Describe your target users...",
        },
        {
          name: "competitiveAdvantage",
          label: "Competitive Advantage",
          type: "textarea",
          placeholder: "What makes your project unique?",
        },
      ],
      suggestions: [
        "Clear business goals help prioritize features effectively",
        "Understanding target audience improves UX decisions",
        "Competitive analysis can reveal important feature gaps",
      ],
    },
  ];

  // Initialize available features when service changes
  useEffect(() => {
    const includedFeatures = selectedService.features.filter((f) => f.included);
    const optionalFeatures = selectedService.features.filter((f) => f.optional);

    setSelectedFeatures(includedFeatures);
    setAvailableFeatures(optionalFeatures);
  }, [selectedService]);

  // Calculate compatibility score for selected features
  const compatibilityScore = useMemo(() => {
    if (selectedFeatures.length === 0) return 100;

    let conflicts = 0;
    let totalChecks = 0;

    selectedFeatures.forEach((feature) => {
      selectedFeatures.forEach((otherFeature) => {
        if (feature.id !== otherFeature.id) {
          totalChecks++;
          // Check for dependency conflicts (simplified logic)
          if (
            feature.dependencies?.includes(otherFeature.id) &&
            !selectedFeatures.some((f) => f.id === otherFeature.id)
          ) {
            conflicts++;
          }
        }
      });
    });

    return totalChecks > 0
      ? Math.max(0, 100 - (conflicts / totalChecks) * 100)
      : 100;
  }, [selectedFeatures]);

  // Generate smart recommendations based on selected features
  const recommendations = useMemo(() => {
    const recs: string[] = [];

    // Check for missing dependencies
    selectedFeatures.forEach((feature) => {
      feature.dependencies?.forEach((depId) => {
        if (!selectedFeatures.some((f) => f.id === depId)) {
          const depFeature = selectedService.features.find(
            (f) => f.id === depId
          );
          if (depFeature) {
            recs.push(
              `Consider adding "${depFeature.name}" as it's required for "${feature.name}"`
            );
          }
        }
      });
    });

    // Suggest complementary features
    if (selectedFeatures.some((f) => f.id === "payment-gateway")) {
      if (!selectedFeatures.some((f) => f.id === "analytics-dashboard")) {
        recs.push(
          "Analytics Dashboard is highly recommended for e-commerce projects to track sales performance"
        );
      }
    }

    if (selectedFeatures.some((f) => f.id === "performance-optimization")) {
      if (!selectedFeatures.some((f) => f.id === "testing-suite")) {
        recs.push(
          "Testing Suite pairs well with Performance Optimization to ensure quality"
        );
      }
    }

    return recs;
  }, [selectedFeatures, selectedService]);

  // Handle drag and drop
  const handleDragStart = useCallback((feature: ServiceFeature) => {
    setDraggedFeature(feature);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedFeature(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, target: "selected" | "available") => {
      e.preventDefault();
      if (!draggedFeature) return;

      if (target === "selected" && !selectedFeatures.includes(draggedFeature)) {
        setSelectedFeatures((prev) => [...prev, draggedFeature]);
        setAvailableFeatures((prev) =>
          prev.filter((f) => f.id !== draggedFeature.id)
        );
      } else if (
        target === "available" &&
        !availableFeatures.includes(draggedFeature) &&
        !draggedFeature.included
      ) {
        setAvailableFeatures((prev) => [...prev, draggedFeature]);
        setSelectedFeatures((prev) =>
          prev.filter((f) => f.id !== draggedFeature.id)
        );
      }

      setDraggedFeature(null);
    },
    [draggedFeature, selectedFeatures, availableFeatures]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Calculate estimated price and timeline
  const estimatedPrice = useMemo(() => {
    const baseTier = selectedService.pricing[1]; // Use standard tier as base
    const additionalCost = selectedFeatures
      .filter((f) => f.optional)
      .reduce((sum, f) => sum + (f.additionalCost || 0), 0);
    return baseTier.basePrice + additionalCost;
  }, [selectedFeatures, selectedService]);

  const estimatedTimeline = useMemo(() => {
    const totalHours = selectedFeatures.reduce(
      (sum, f) => sum + (f.estimatedHours || 0),
      0
    );
    const weeks = Math.ceil(totalHours / 40);
    return `${weeks}-${weeks + 2} weeks`;
  }, [selectedFeatures]);

  // Handle wizard navigation
  const nextWizardStep = () => {
    if (wizardStep < wizardSteps.length - 1) {
      setWizardStep(wizardStep + 1);
    } else {
      // Process wizard completion
      generateSmartRecommendations();
      setShowWizard(false);
    }
  };

  const prevWizardStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  const generateSmartRecommendations = () => {
    // Generate recommendations based on wizard data
    const newRecommendations: ServiceFeature[] = [];

    // Budget-based recommendations
    if (wizardData.budget === "over-30k") {
      const premiumFeatures = availableFeatures.filter(
        (f) => (f.additionalCost || 0) > 1000
      );
      newRecommendations.push(...premiumFeatures.slice(0, 2));
    }

    // Goal-based recommendations
    if (wizardData.primaryGoal === "sales") {
      const salesFeatures = availableFeatures.filter((f) =>
        f.name.toLowerCase().includes("analytics")
      );
      newRecommendations.push(...salesFeatures);
    }

    // Add recommended features to selected
    setSelectedFeatures((prev) => [
      ...prev,
      ...newRecommendations.filter((rec) => !prev.some((p) => p.id === rec.id)),
    ]);
    setAvailableFeatures((prev) =>
      prev.filter((f) => !newRecommendations.some((rec) => rec.id === f.id))
    );
  };

  const saveCustomPackage = () => {
    const newPackage: CustomPackage = {
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedService.name} Package`,
      baseService: selectedService,
      selectedFeatures,
      customRequirements: [],
      estimatedPrice,
      estimatedTimeline,
      compatibilityScore,
    };

    setCustomPackage(newPackage);

    // Save to localStorage for persistence
    localStorage.setItem("customServicePackage", JSON.stringify(newPackage));
  };

  return (
    <section
      className={`bg-brutalist-black py-20 border-b-5 border-brutalist-yellow ${className}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-wider text-white mb-6">
            Service Customization Builder
          </h2>
          <p className="text-lg font-mono font-bold text-brutalist-gray max-w-3xl mx-auto">
            Build your perfect service package with drag-and-drop features,
            smart recommendations, and compatibility checking.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Service Selection */}
          <div className="mb-8">
            <div className="border-5 border-brutalist-yellow bg-brutalist-light-gray p-6">
              <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                1. Choose Base Service
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {serviceData.map((service) => (
                  <motion.button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 border-3 font-mono font-bold text-left transition-all duration-300 ${
                      selectedService.id === service.id
                        ? "border-brutalist-yellow bg-brutalist-yellow text-black"
                        : "border-black bg-white hover:bg-brutalist-yellow"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg uppercase tracking-wider mb-2">
                      {service.name}
                    </div>
                    <div className="text-sm opacity-80 mb-2">
                      {service.description}
                    </div>
                    <div className="text-sm opacity-60">
                      From ${service.pricing[0].basePrice.toLocaleString()} •{" "}
                      {service.timeline}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature Builder */}
            <div className="lg:col-span-2 space-y-8">
              {/* Requirement Wizard */}
              <div className="border-5 border-brutalist-yellow bg-brutalist-light-gray p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider">
                    2. Smart Requirements Wizard
                  </h3>
                  <button
                    onClick={() => setShowWizard(true)}
                    className="bg-brutalist-yellow text-black border-3 border-black px-4 py-2 font-mono font-bold hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                  >
                    Start Wizard
                  </button>
                </div>
                <p className="font-mono text-sm opacity-80">
                  Get personalized feature recommendations based on your project
                  requirements and business goals.
                </p>
              </div>

              {/* Drag and Drop Feature Builder */}
              <div className="border-5 border-brutalist-yellow bg-brutalist-light-gray p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  3. Build Your Package
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Available Features */}
                  <div>
                    <h4 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
                      Available Features
                    </h4>
                    <div
                      className="min-h-64 border-3 border-dashed border-gray-400 bg-white p-4 rounded"
                      onDrop={(e) => handleDrop(e, "available")}
                      onDragOver={handleDragOver}
                    >
                      <div className="space-y-3">
                        {availableFeatures.map((feature) => (
                          <motion.div
                            key={feature.id}
                            draggable
                            onDragStart={() => handleDragStart(feature)}
                            onDragEnd={handleDragEnd}
                            className="p-3 border-2 border-gray-300 bg-gray-50 cursor-move hover:bg-gray-100 transition-colors duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileDrag={{ scale: 1.05, rotate: 2 }}
                          >
                            <div className="font-mono font-bold text-sm">
                              {feature.name}
                            </div>
                            <div className="font-mono text-xs opacity-80 mb-1">
                              {feature.description}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-xs font-bold">
                                +$
                                {feature.additionalCost?.toLocaleString() || 0}
                              </span>
                              <span className="font-mono text-xs opacity-60">
                                {feature.estimatedHours}h
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selected Features */}
                  <div>
                    <h4 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
                      Your Package
                    </h4>
                    <div
                      className="min-h-64 border-3 border-dashed border-brutalist-yellow bg-brutalist-yellow p-4 rounded"
                      onDrop={(e) => handleDrop(e, "selected")}
                      onDragOver={handleDragOver}
                    >
                      <Reorder.Group
                        axis="y"
                        values={selectedFeatures}
                        onReorder={setSelectedFeatures}
                        className="space-y-3"
                      >
                        {selectedFeatures.map((feature) => (
                          <Reorder.Item
                            key={feature.id}
                            value={feature}
                            className={`p-3 border-2 bg-white cursor-move hover:bg-gray-50 transition-colors duration-200 ${
                              feature.included
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileDrag={{ scale: 1.05, rotate: -2 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-mono font-bold text-sm flex items-center">
                                  {feature.included && (
                                    <span className="text-green-600 mr-2">
                                      ✓
                                    </span>
                                  )}
                                  {feature.name}
                                </div>
                                <div className="font-mono text-xs opacity-80 mb-1">
                                  {feature.description}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-mono text-xs font-bold">
                                    {feature.included
                                      ? "Included"
                                      : `+$${
                                          feature.additionalCost?.toLocaleString() ||
                                          0
                                        }`}
                                  </span>
                                  <span className="font-mono text-xs opacity-60">
                                    {feature.estimatedHours}h
                                  </span>
                                </div>
                              </div>
                              {!feature.included && (
                                <button
                                  onClick={() => {
                                    setSelectedFeatures((prev) =>
                                      prev.filter((f) => f.id !== feature.id)
                                    );
                                    setAvailableFeatures((prev) => [
                                      ...prev,
                                      feature,
                                    ]);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility Check */}
              <div className="border-5 border-brutalist-yellow bg-brutalist-light-gray p-6">
                <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                  4. Compatibility Analysis
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold">
                      Compatibility Score:
                    </span>
                    <span
                      className={`font-mono font-black text-lg ${
                        compatibilityScore >= 80
                          ? "text-green-600"
                          : compatibilityScore >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {compatibilityScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-4 border-2 border-black">
                    <div
                      className={`h-full transition-all duration-500 ${
                        compatibilityScore >= 80
                          ? "bg-green-500"
                          : compatibilityScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${compatibilityScore}%` }}
                    />
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold font-mono uppercase tracking-wider mb-4">
                      Smart Recommendations
                    </h4>
                    <div className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="p-3 border-2 border-blue-300 bg-blue-50 font-mono text-sm"
                        >
                          <span className="text-blue-600 mr-2">💡</span>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Package Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <motion.div
                  className="border-5 border-brutalist-yellow bg-brutalist-yellow p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6">
                    Package Preview
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Base Service:</span>
                      <span className="font-mono text-sm">
                        {selectedService.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Features:</span>
                      <span className="font-mono text-sm">
                        {selectedFeatures.length}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">
                        Estimated Price:
                      </span>
                      <span className="font-mono font-bold">
                        ${estimatedPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">Timeline:</span>
                      <span className="font-mono text-sm">
                        {estimatedTimeline}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                      <span className="font-mono font-bold">
                        Compatibility:
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          compatibilityScore >= 80
                            ? "text-green-600"
                            : compatibilityScore >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {compatibilityScore.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={saveCustomPackage}
                      className="w-full bg-black text-brutalist-yellow border-3 border-black px-6 py-3 font-mono font-bold hover:bg-brutalist-yellow hover:text-black transition-colors duration-300"
                    >
                      Save Package
                    </button>

                    <a
                      href="/contact"
                      className="block w-full bg-brutalist-light-gray text-black border-3 border-black px-6 py-3 font-mono font-bold text-center hover:bg-white transition-colors duration-300"
                    >
                      Get Quote →
                    </a>
                  </div>
                </motion.div>

                {/* Saved Package */}
                {customPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 border-5 border-black bg-white p-6"
                  >
                    <h4 className="text-lg font-black font-mono uppercase tracking-wider mb-4">
                      Saved Package
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div>
                        <strong>Name:</strong> {customPackage.name}
                      </div>
                      <div>
                        <strong>Price:</strong> $
                        {customPackage.estimatedPrice.toLocaleString()}
                      </div>
                      <div>
                        <strong>Timeline:</strong>{" "}
                        {customPackage.estimatedTimeline}
                      </div>
                      <div>
                        <strong>Features:</strong>{" "}
                        {customPackage.selectedFeatures.length}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Requirement Wizard Modal */}
        <AnimatePresence>
          {showWizard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white border-5 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black font-mono uppercase tracking-wider">
                      Requirements Wizard
                    </h3>
                    <button
                      onClick={() => setShowWizard(false)}
                      className="text-2xl font-bold hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-sm">
                        Step {wizardStep + 1} of {wizardSteps.length}
                      </span>
                      <span className="font-mono text-sm">
                        {Math.round(
                          ((wizardStep + 1) / wizardSteps.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 border-2 border-black">
                      <div
                        className="h-full bg-brutalist-yellow transition-all duration-300"
                        style={{
                          width: `${
                            ((wizardStep + 1) / wizardSteps.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Current Step */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold font-mono mb-2">
                      {wizardSteps[wizardStep].title}
                    </h4>
                    <p className="font-mono text-sm opacity-80 mb-4">
                      {wizardSteps[wizardStep].description}
                    </p>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {wizardSteps[wizardStep].fields.map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="block font-mono font-bold text-sm mb-2"
                          >
                            {field.label}
                          </label>
                          {field.type === "select" && (
                            <select
                              id={field.name}
                              value={wizardData[field.name] || ""}
                              onChange={(e) =>
                                setWizardData((prev) => ({
                                  ...prev,
                                  [field.name]: e.target.value,
                                }))
                              }
                              className="w-full p-3 border-3 border-black font-mono text-sm focus:outline-none focus:border-brutalist-yellow"
                            >
                              <option value="">Select an option...</option>
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {field.type === "text" && (
                            <input
                              id={field.name}
                              type="text"
                              value={wizardData[field.name] || ""}
                              onChange={(e) =>
                                setWizardData((prev) => ({
                                  ...prev,
                                  [field.name]: e.target.value,
                                }))
                              }
                              placeholder={field.placeholder}
                              className="w-full p-3 border-3 border-black font-mono text-sm focus:outline-none focus:border-brutalist-yellow"
                            />
                          )}
                          {field.type === "textarea" && (
                            <textarea
                              id={field.name}
                              value={wizardData[field.name] || ""}
                              onChange={(e) =>
                                setWizardData((prev) => ({
                                  ...prev,
                                  [field.name]: e.target.value,
                                }))
                              }
                              placeholder={field.placeholder}
                              rows={4}
                              className="w-full p-3 border-3 border-black font-mono text-sm resize-none focus:outline-none focus:border-brutalist-yellow"
                            />
                          )}
                          {field.type === "checkbox" && (
                            <div className="space-y-2">
                              {field.options?.map((option) => (
                                <label
                                  key={option.value}
                                  className="flex items-center space-x-2 font-mono text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      Array.isArray(wizardData[field.name]) &&
                                      (
                                        wizardData[field.name] as string[]
                                      ).includes(option.value)
                                    }
                                    onChange={(e) => {
                                      const currentValues = Array.isArray(
                                        wizardData[field.name]
                                      )
                                        ? (wizardData[field.name] as string[])
                                        : [];
                                      const newValues = e.target.checked
                                        ? [...currentValues, option.value]
                                        : currentValues.filter(
                                            (v: string) => v !== option.value
                                          );
                                      setWizardData((prev) => ({
                                        ...prev,
                                        [field.name]: newValues,
                                      }));
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span>{option.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Suggestions */}
                    <div className="mt-6 p-4 border-2 border-blue-300 bg-blue-50">
                      <h5 className="font-mono font-bold text-sm mb-2">
                        💡 Suggestions:
                      </h5>
                      <ul className="space-y-1">
                        {wizardSteps[wizardStep].suggestions.map(
                          (suggestion, index) => (
                            <li
                              key={index}
                              className="font-mono text-xs opacity-80"
                            >
                              • {suggestion}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={prevWizardStep}
                      disabled={wizardStep === 0}
                      className="bg-brutalist-light-gray text-black border-3 border-black px-6 py-3 font-mono font-bold hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextWizardStep}
                      className="bg-brutalist-yellow text-black border-3 border-black px-6 py-3 font-mono font-bold hover:bg-black hover:text-brutalist-yellow transition-colors duration-300"
                    >
                      {wizardStep === wizardSteps.length - 1
                        ? "Finish"
                        : "Next"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
