"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import BrutalistButton from "./BrutalistButton";
import BrutalistCard from "./BrutalistCard";

interface PricingOption {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  required?: boolean;
}

interface AddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PricingCalculatorProps {
  className?: string;
  onQuoteRequest?: (quote: {
    selectedOptions: string[];
    addons: string[];
    totalPrice: number;
  }) => void;
}

const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "basic-website",
    name: "Basic Website",
    basePrice: 2500,
    description: "5 pages, responsive design, basic SEO",
    required: true,
  },
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    basePrice: 5000,
    description: "Online store with payment integration",
  },
  {
    id: "saas-platform",
    name: "SaaS Platform",
    basePrice: 10000,
    description: "Custom software-as-a-service solution",
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    basePrice: 8000,
    description: "React Native cross-platform app",
  },
];

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: "cms",
    name: "Content Management System",
    price: 1500,
    description: "Easy content editing interface",
  },
  {
    id: "advanced-seo",
    name: "Advanced SEO Package",
    price: 800,
    description: "Comprehensive SEO optimization",
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    price: 1200,
    description: "Custom analytics and reporting",
  },
  {
    id: "multilingual",
    name: "Multi-language Support",
    price: 2000,
    description: "Support for multiple languages",
  },
  {
    id: "api-integration",
    name: "Third-party API Integration",
    price: 1000,
    description: "Connect with external services",
  },
  {
    id: "performance-optimization",
    name: "Performance Optimization",
    price: 600,
    description: "Advanced speed and performance tuning",
  },
];

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  className,
  onQuoteRequest,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("basic-website");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(2500);

  // Calculate total price whenever selections change
  useEffect(() => {
    const baseOption = PRICING_OPTIONS.find((opt) => opt.id === selectedOption);
    const basePrice = baseOption?.basePrice || 0;

    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = ADDON_OPTIONS.find((opt) => opt.id === addonId);
      return total + (addon?.price || 0);
    }, 0);

    setTotalPrice(basePrice + addonsPrice);
  }, [selectedOption, selectedAddons]);

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleQuoteRequest = () => {
    onQuoteRequest?.({
      selectedOptions: [selectedOption],
      addons: selectedAddons,
      totalPrice,
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <Calculator size={32} className="text-brutalist-yellow" />
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono">
            Pricing Calculator
          </h2>
        </div>
        <p className="text-lg font-mono font-bold opacity-80 max-w-3xl mx-auto">
          Get an instant estimate for your project. Select your base service and
          add any additional features you need.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Options */}
        <div className="space-y-8">
          {/* Base Service Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6 border-b-3 border-black pb-2">
              Select Base Service
            </h3>
            <div className="space-y-4">
              {PRICING_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "border-3 border-black p-4 cursor-pointer transition-all duration-300",
                    "hover:bg-brutalist-yellow hover:transform hover:-translate-y-1",
                    selectedOption === option.id
                      ? "bg-brutalist-yellow border-black"
                      : "bg-brutalist-light-gray"
                  )}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono font-bold text-lg mb-1">
                        {option.name}
                      </h4>
                      <p className="font-mono text-sm opacity-80">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-xl">
                        ${option.basePrice.toLocaleString()}
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 border-2 border-black rounded-full flex items-center justify-center mt-2",
                          selectedOption === option.id
                            ? "bg-black"
                            : "bg-brutalist-light-gray"
                        )}
                      >
                        {selectedOption === option.id && (
                          <div className="w-3 h-3 bg-brutalist-yellow rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Add-ons Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-black font-mono uppercase tracking-wider mb-6 border-b-3 border-black pb-2">
              Additional Features
            </h3>
            <div className="space-y-3">
              {ADDON_OPTIONS.map((addon) => (
                <div
                  key={addon.id}
                  className={cn(
                    "border-3 border-black p-4 cursor-pointer transition-all duration-300",
                    "hover:bg-gray-50 hover:transform hover:-translate-y-1",
                    selectedAddons.includes(addon.id)
                      ? "bg-brutalist-yellow border-black"
                      : "bg-brutalist-light-gray"
                  )}
                  onClick={() => handleAddonToggle(addon.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono font-bold mb-1">{addon.name}</h4>
                      <p className="font-mono text-sm opacity-80">
                        {addon.description}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div className="font-mono font-black">
                        +${addon.price.toLocaleString()}
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 border-2 border-black flex items-center justify-center",
                          selectedAddons.includes(addon.id)
                            ? "bg-black text-brutalist-yellow"
                            : "bg-brutalist-light-gray text-black"
                        )}
                      >
                        {selectedAddons.includes(addon.id) ? (
                          <Minus size={16} strokeWidth={3} />
                        ) : (
                          <Plus size={16} strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quote Summary */}
        <motion.div
          className="lg:sticky lg:top-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BrutalistCard
            title="Project Estimate"
            description=""
            className="h-fit"
          >
            <div className="space-y-6">
              {/* Selected Base Service */}
              <div>
                <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3 border-b-2 border-gray-200 pb-2">
                  Base Service
                </h4>
                {(() => {
                  const option = PRICING_OPTIONS.find(
                    (opt) => opt.id === selectedOption
                  );
                  return (
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">{option?.name}</span>
                      <span className="font-mono font-bold">
                        ${option?.basePrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Selected Add-ons */}
              {selectedAddons.length > 0 && (
                <div>
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-3 border-b-2 border-gray-200 pb-2">
                    Additional Features
                  </h4>
                  <div className="space-y-2">
                    {selectedAddons.map((addonId) => {
                      const addon = ADDON_OPTIONS.find(
                        (opt) => opt.id === addonId
                      );
                      return (
                        <div
                          key={addonId}
                          className="flex justify-between items-center"
                        >
                          <span className="font-mono text-sm">
                            {addon?.name}
                          </span>
                          <span className="font-mono font-bold">
                            +${addon?.price.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t-3 border-black pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono font-black text-lg uppercase">
                    Total Estimate
                  </span>
                  <span className="font-mono font-black text-2xl text-brutalist-yellow bg-black px-3 py-1">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-xs font-mono opacity-80">
                    • Estimate includes development, testing, and deployment
                  </div>
                  <div className="text-xs font-mono opacity-80">
                    • Final price may vary based on specific requirements
                  </div>
                  <div className="text-xs font-mono opacity-80">
                    • 50% deposit required to start, 50% on completion
                  </div>
                </div>

                <BrutalistButton
                  variant="accent"
                  size="lg"
                  glow
                  onClick={handleQuoteRequest}
                  className="w-full"
                  ariaLabel="Request detailed quote"
                >
                  Get Detailed Quote
                </BrutalistButton>
              </div>
            </div>
          </BrutalistCard>

          {/* Additional Info */}
          <motion.div
            className="mt-6 p-6 border-3 border-black bg-brutalist-yellow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h4 className="font-mono font-black text-lg mb-3 uppercase tracking-wider">
              What&apos;s Next?
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-black">1.</span>
                <span>
                  Click &quot;Get Detailed Quote&quot; to send your requirements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">2.</span>
                <span>
                  I&apos;ll review and provide a detailed proposal within 24
                  hours
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">3.</span>
                <span>
                  We&apos;ll schedule a call to discuss your project in detail
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">4.</span>
                <span>Once approved, development begins immediately</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingCalculator;
