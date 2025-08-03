"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Target,
  DollarSign,
  Calendar,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Zap,
  Star,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "../ui/BrutalistButton";

export interface SmartProjectInquiryProps {
  className?: string;
  onInquirySubmit?: (inquiry: ProjectInquiry) => void;
}

interface ProjectInquiry {
  id: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
  };
  projectDetails: {
    type: string;
    industry: string;
    description: string;
    goals: string[];
    targetAudience: string;
    competitors: string[];
  };
  requirements: {
    features: string[];
    platforms: string[];
    integrations: string[];
    designPreferences: string;
    contentStrategy: string;
  };
  budget: {
    range: string;
    priority: "budget" | "timeline" | "quality";
    paymentPreference: string;
  };
  timeline: {
    launchDate: string;
    flexibility: string;
    milestones: string[];
  };
  files: File[];
  status: "draft" | "submitted" | "reviewed";
  estimatedCost: number;
  recommendedServices: string[];
  createdAt: Date;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  validation: (data: any) => boolean;
}

const PROJECT_TYPES = [
  {
    id: "website",
    label: "Business Website",
    description: "Professional website for your business",
  },
  {
    id: "ecommerce",
    label: "E-commerce Store",
    description: "Online store with payment processing",
  },
  {
    id: "webapp",
    label: "Web Application",
    description: "Custom web application with user accounts",
  },
  {
    id: "saas",
    label: "SaaS Platform",
    description: "Software as a Service platform",
  },
  {
    id: "portfolio",
    label: "Portfolio Site",
    description: "Showcase your work and skills",
  },
  {
    id: "blog",
    label: "Blog/Content Site",
    description: "Content-focused website with CMS",
  },
  {
    id: "landing",
    label: "Landing Page",
    description: "Single page for marketing campaigns",
  },
  { id: "other", label: "Other", description: "Custom project requirements" },
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Real Estate",
  "Food & Beverage",
  "Travel",
  "Entertainment",
  "Non-profit",
  "Professional Services",
  "Other",
];

const BUDGET_RANGES = [
  { id: "2500-5000", label: "$2,500 - $5,000", min: 2500, max: 5000 },
  { id: "5000-10000", label: "$5,000 - $10,000", min: 5000, max: 10000 },
  { id: "10000-25000", label: "$10,000 - $25,000", min: 10000, max: 25000 },
  { id: "25000+", label: "$25,000+", min: 25000, max: 100000 },
  { id: "not-sure", label: "Not Sure Yet", min: 0, max: 0 },
];

const COMMON_FEATURES = [
  "Contact Forms",
  "User Authentication",
  "Payment Processing",
  "Content Management",
  "Search Functionality",
  "Social Media Integration",
  "Analytics",
  "SEO Optimization",
  "Mobile App",
  "API Integration",
  "Multi-language Support",
  "Live Chat",
  "Booking System",
  "Inventory Management",
  "Email Marketing",
  "Custom Dashboard",
];

const SmartProjectInquiry: React.FC<SmartProjectInquiryProps> = ({
  className,
  onInquirySubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ProjectInquiry>>({
    clientInfo: {
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
    },
    projectDetails: {
      type: "",
      industry: "",
      description: "",
      goals: [],
      targetAudience: "",
      competitors: [],
    },
    requirements: {
      features: [],
      platforms: ["web"],
      integrations: [],
      designPreferences: "",
      contentStrategy: "",
    },
    budget: {
      range: "",
      priority: "quality",
      paymentPreference: "",
    },
    timeline: {
      launchDate: "",
      flexibility: "",
      milestones: [],
    },
    files: [],
    estimatedCost: 0,
    recommendedServices: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const steps: FormStep[] = [
    {
      id: "contact",
      title: "Contact Information",
      description: "Tell us about yourself and your organization",
      fields: ["name", "email", "company"],
      validation: (data) => {
        return !!(data.clientInfo?.name && data.clientInfo?.email);
      },
    },
    {
      id: "project",
      title: "Project Overview",
      description: "What type of project are you planning?",
      fields: ["type", "industry", "description"],
      validation: (data) => {
        return !!(
          data.projectDetails?.type && data.projectDetails?.description
        );
      },
    },
    {
      id: "requirements",
      title: "Requirements & Features",
      description: "What features and functionality do you need?",
      fields: ["features", "platforms"],
      validation: (data) => {
        return !!(data.requirements?.features?.length > 0);
      },
    },
    {
      id: "budget",
      title: "Budget & Timeline",
      description: "Help us understand your budget and timeline expectations",
      fields: ["range", "priority", "launchDate"],
      validation: (data) => {
        return !!data.budget?.range;
      },
    },
    {
      id: "files",
      title: "Additional Materials",
      description: "Upload any relevant files, mockups, or references",
      fields: [],
      validation: () => true, // Optional step
    },
    {
      id: "review",
      title: "Review & Submit",
      description:
        "Review your project details and get instant recommendations",
      fields: [],
      validation: () => true,
    },
  ];

  // Calculate estimated cost based on project details
  useEffect(() => {
    const calculateEstimate = () => {
      let baseCost = 0;
      const projectType = formData.projectDetails?.type;
      const features = formData.requirements?.features || [];
      const budgetRange = formData.budget?.range;

      // Base cost by project type
      switch (projectType) {
        case "website":
          baseCost = 3000;
          break;
        case "ecommerce":
          baseCost = 8000;
          break;
        case "webapp":
          baseCost = 12000;
          break;
        case "saas":
          baseCost = 25000;
          break;
        case "portfolio":
          baseCost = 2000;
          break;
        case "blog":
          baseCost = 2500;
          break;
        case "landing":
          baseCost = 1500;
          break;
        default:
          baseCost = 5000;
      }

      // Add feature costs
      const featureCosts: Record<string, number> = {
        "User Authentication": 1500,
        "Payment Processing": 2000,
        "Content Management": 1000,
        "Search Functionality": 800,
        "API Integration": 1200,
        "Multi-language Support": 1500,
        "Booking System": 2500,
        "Inventory Management": 3000,
        "Custom Dashboard": 2000,
      };

      features.forEach((feature) => {
        baseCost += featureCosts[feature] || 500;
      });

      // Apply budget range constraints
      if (budgetRange) {
        const range = BUDGET_RANGES.find((r) => r.id === budgetRange);
        if (range && range.max > 0) {
          baseCost = Math.min(baseCost, range.max);
          baseCost = Math.max(baseCost, range.min);
        }
      }

      setFormData((prev) => ({ ...prev, estimatedCost: baseCost }));
    };

    calculateEstimate();
  }, [
    formData.projectDetails?.type,
    formData.requirements?.features,
    formData.budget?.range,
  ]);

  // Generate service recommendations
  useEffect(() => {
    const generateRecommendations = () => {
      const recommendations: string[] = [];
      const projectType = formData.projectDetails?.type;
      const features = formData.requirements?.features || [];
      const budget = formData.budget?.range;

      // Base recommendations by project type
      switch (projectType) {
        case "ecommerce":
          recommendations.push(
            "E-commerce Development",
            "Payment Gateway Integration",
            "Inventory Management"
          );
          break;
        case "saas":
          recommendations.push(
            "SaaS Development",
            "User Management System",
            "Subscription Billing"
          );
          break;
        case "webapp":
          recommendations.push(
            "Web Application Development",
            "Database Design",
            "API Development"
          );
          break;
        default:
          recommendations.push(
            "Website Development",
            "Responsive Design",
            "SEO Optimization"
          );
      }

      // Feature-based recommendations
      if (features.includes("User Authentication")) {
        recommendations.push("Security Audit");
      }
      if (features.includes("Payment Processing")) {
        recommendations.push("PCI Compliance");
      }
      if (features.includes("SEO Optimization")) {
        recommendations.push("Content Strategy");
      }

      // Budget-based recommendations
      const budgetRange = BUDGET_RANGES.find((r) => r.id === budget);
      if (budgetRange && budgetRange.min >= 10000) {
        recommendations.push("Premium Support", "Performance Optimization");
      }

      setFormData((prev) => ({
        ...prev,
        recommendedServices: [...new Set(recommendations)],
      }));
    };

    generateRecommendations();
  }, [
    formData.projectDetails?.type,
    formData.requirements?.features,
    formData.budget?.range,
  ]);

  const handleInputChange = (
    section: keyof ProjectInquiry,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      const currentSection = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        },
      };
    });

    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [`${section}.${field}`]: "",
    }));
  };

  const handleArrayToggle = (
    section: keyof ProjectInquiry,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const currentSection = prev[section] as Record<string, any>;
      const currentArray = currentSection?.[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: newArray,
        },
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      files: [...(prev.files || []), ...files],
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== index),
    }));
  };

  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep];
    const errors: Record<string, string> = {};

    if (!currentStepData.validation(formData)) {
      // Add specific validation errors based on step
      switch (currentStepData.id) {
        case "contact":
          if (!formData.clientInfo?.name)
            errors["clientInfo.name"] = "Name is required";
          if (!formData.clientInfo?.email)
            errors["clientInfo.email"] = "Email is required";
          break;
        case "project":
          if (!formData.projectDetails?.type)
            errors["projectDetails.type"] = "Project type is required";
          if (!formData.projectDetails?.description)
            errors["projectDetails.description"] = "Description is required";
          break;
        case "requirements":
          if (!formData.requirements?.features?.length)
            errors["requirements.features"] =
              "At least one feature is required";
          break;
        case "budget":
          if (!formData.budget?.range)
            errors["budget.range"] = "Budget range is required";
          break;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const inquiry: ProjectInquiry = {
        ...(formData as ProjectInquiry),
        id: `inquiry-${Date.now()}`,
        status: "submitted",
        createdAt: new Date(),
      };

      onInquirySubmit?.(inquiry);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Project Inquiry
        </h2>
        <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
          Tell us about your project and get instant cost estimates and service
          recommendations
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono font-bold text-sm">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-mono font-bold text-sm">
            {Math.round(getStepProgress())}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 border-3 border-black h-4">
          <motion.div
            className="h-full bg-brutalist-yellow border-r-3 border-black"
            initial={{ width: 0 }}
            animate={{ width: `${getStepProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-3 border-black p-8"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-black uppercase tracking-wider font-mono mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="font-mono opacity-80">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step 1: Contact Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientInfo?.name || ""}
                    onChange={(e) =>
                      handleInputChange("clientInfo", "name", e.target.value)
                    }
                    className={cn(
                      "w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300",
                      validationErrors["clientInfo.name"] &&
                      "border-red-500 bg-red-50"
                    )}
                    placeholder="Enter your full name"
                  />
                  {validationErrors["clientInfo.name"] && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {validationErrors["clientInfo.name"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.clientInfo?.email || ""}
                    onChange={(e) =>
                      handleInputChange("clientInfo", "email", e.target.value)
                    }
                    className={cn(
                      "w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300",
                      validationErrors["clientInfo.email"] &&
                      "border-red-500 bg-red-50"
                    )}
                    placeholder="Enter your email address"
                  />
                  {validationErrors["clientInfo.email"] && (
                    <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                      <AlertCircle size={16} />
                      {validationErrors["clientInfo.email"]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.clientInfo?.phone || ""}
                    onChange={(e) =>
                      handleInputChange("clientInfo", "phone", e.target.value)
                    }
                    className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    <Briefcase size={16} className="inline mr-2" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.clientInfo?.company || ""}
                    onChange={(e) =>
                      handleInputChange("clientInfo", "company", e.target.value)
                    }
                    className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  value={formData.clientInfo?.role || ""}
                  onChange={(e) =>
                    handleInputChange("clientInfo", "role", e.target.value)
                  }
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                  placeholder="e.g., CEO, Marketing Manager, Founder"
                />
              </div>
            </div>
          )}

          {/* Step 2: Project Overview */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-4">
                  Project Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() =>
                        handleInputChange("projectDetails", "type", type.id)
                      }
                      className={cn(
                        "p-4 border-3 border-black text-left transition-all duration-300",
                        formData.projectDetails?.type === type.id
                          ? "bg-brutalist-yellow"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="font-mono font-bold mb-1">
                        {type.label}
                      </div>
                      <div className="font-mono text-sm opacity-80">
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
                {validationErrors["projectDetails.type"] && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {validationErrors["projectDetails.type"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  Industry
                </label>
                <select
                  value={formData.projectDetails?.industry || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "projectDetails",
                      "industry",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  <Target size={16} className="inline mr-2" />
                  Project Description *
                </label>
                <textarea
                  value={formData.projectDetails?.description || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "projectDetails",
                      "description",
                      e.target.value
                    )
                  }
                  rows={4}
                  className={cn(
                    "w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300 resize-none",
                    validationErrors["projectDetails.description"] &&
                    "border-red-500 bg-red-50"
                  )}
                  placeholder="Describe your project goals, target audience, and key requirements..."
                />
                {validationErrors["projectDetails.description"] && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {validationErrors["projectDetails.description"]}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Requirements & Features */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-4">
                  <Zap size={16} className="inline mr-2" />
                  Required Features *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMMON_FEATURES.map((feature) => (
                    <button
                      key={feature}
                      onClick={() =>
                        handleArrayToggle("requirements", "features", feature)
                      }
                      className={cn(
                        "p-3 border-3 border-black text-left font-mono font-bold text-sm transition-all duration-300",
                        formData.requirements?.features?.includes(feature)
                          ? "bg-brutalist-yellow"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {formData.requirements?.features?.includes(feature) && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                        {feature}
                      </div>
                    </button>
                  ))}
                </div>
                {validationErrors["requirements.features"] && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {validationErrors["requirements.features"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  Design Preferences
                </label>
                <textarea
                  value={formData.requirements?.designPreferences || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "requirements",
                      "designPreferences",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300 resize-none"
                  placeholder="Describe your design preferences, brand guidelines, or visual inspiration..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-4">
                  <DollarSign size={16} className="inline mr-2" />
                  Budget Range *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() =>
                        handleInputChange("budget", "range", range.id)
                      }
                      className={cn(
                        "p-4 border-3 border-black text-left transition-all duration-300",
                        formData.budget?.range === range.id
                          ? "bg-brutalist-yellow"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="font-mono font-bold text-lg">
                        {range.label}
                      </div>
                    </button>
                  ))}
                </div>
                {validationErrors["budget.range"] && (
                  <p className="mt-2 text-sm text-red-600 font-mono flex items-center gap-2">
                    <AlertCircle size={16} />
                    {validationErrors["budget.range"]}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-4">
                  Project Priority
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "budget",
                      label: "Budget",
                      description: "Keep costs as low as possible",
                    },
                    {
                      id: "timeline",
                      label: "Timeline",
                      description: "Launch as quickly as possible",
                    },
                    {
                      id: "quality",
                      label: "Quality",
                      description: "Best possible result",
                    },
                  ].map((priority) => (
                    <button
                      key={priority.id}
                      onClick={() =>
                        handleInputChange("budget", "priority", priority.id)
                      }
                      className={cn(
                        "p-4 border-3 border-black text-center transition-all duration-300",
                        formData.budget?.priority === priority.id
                          ? "bg-brutalist-yellow"
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <div className="font-mono font-bold mb-1">
                        {priority.label}
                      </div>
                      <div className="font-mono text-sm opacity-80">
                        {priority.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Desired Launch Date
                </label>
                <input
                  type="date"
                  value={formData.timeline?.launchDate || ""}
                  onChange={(e) =>
                    handleInputChange("timeline", "launchDate", e.target.value)
                  }
                  className="w-full p-3 border-3 border-black font-mono focus:outline-none focus:bg-brutalist-yellow transition-colors duration-300"
                />
              </div>
            </div>
          )}

          {/* Step 5: File Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-4">
                  <Upload size={16} className="inline mr-2" />
                  Upload Files (Optional)
                </label>
                <div className="border-3 border-dashed border-black p-8 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.sketch,.fig"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload size={48} className="text-gray-400" />
                    <div>
                      <div className="font-mono font-bold text-lg mb-2">
                        Drop files here or click to upload
                      </div>
                      <div className="font-mono text-sm opacity-80">
                        Supported: PDF, DOC, Images, Sketch, Figma files
                      </div>
                    </div>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-mono font-bold text-sm uppercase tracking-wider">
                      Uploaded Files:
                    </h4>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-3 border-black bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={20} />
                          <div>
                            <div className="font-mono font-bold text-sm">
                              {file.name}
                            </div>
                            <div className="font-mono text-xs opacity-80">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-red-100 transition-colors"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-8">
              {/* Cost Estimate */}
              <div className="bg-brutalist-yellow border-3 border-black p-6">
                <h4 className="font-mono font-black text-xl mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Star size={24} />
                  Estimated Project Cost
                </h4>
                <div className="text-3xl font-black font-mono mb-2">
                  ${formData.estimatedCost?.toLocaleString()}
                </div>
                <p className="font-mono text-sm opacity-80">
                  Based on your requirements and selected features
                </p>
              </div>

              {/* Recommended Services */}
              <div className="bg-white border-3 border-black p-6">
                <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb size={20} />
                  Recommended Services
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.recommendedServices?.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border-2 border-black bg-gray-50"
                    >
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-mono font-bold text-sm">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Summary */}
              <div className="bg-white border-3 border-black p-6">
                <h4 className="font-mono font-black text-lg mb-4 uppercase tracking-wider">
                  Project Summary
                </h4>
                <div className="space-y-4 font-mono text-sm">
                  <div>
                    <span className="font-bold">Project Type:</span>{" "}
                    {
                      PROJECT_TYPES.find(
                        (t) => t.id === formData.projectDetails?.type
                      )?.label
                    }
                  </div>
                  <div>
                    <span className="font-bold">Budget Range:</span>{" "}
                    {
                      BUDGET_RANGES.find((b) => b.id === formData.budget?.range)
                        ?.label
                    }
                  </div>
                  <div>
                    <span className="font-bold">Selected Features:</span>{" "}
                    {formData.requirements?.features?.join(", ")}
                  </div>
                  <div>
                    <span className="font-bold">Files Uploaded:</span>{" "}
                    {uploadedFiles.length} files
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <BrutalistButton
          onClick={prevStep}
          variant="secondary"
          size="md"
          disabled={currentStep === 0}
          className={currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </BrutalistButton>

        {currentStep < steps.length - 1 ? (
          <BrutalistButton onClick={nextStep} variant="accent" size="md" glow>
            Next
            <ArrowRight size={16} className="ml-2" />
          </BrutalistButton>
        ) : (
          <BrutalistButton
            onClick={handleSubmit}
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            glow={!isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle size={20} />
                Submit Inquiry
              </span>
            )}
          </BrutalistButton>
        )}
      </div>
    </div>
  );
};

export default SmartProjectInquiry;
