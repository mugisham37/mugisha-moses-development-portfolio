"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/lib/constants";
import { PricingTier } from "@/lib/types";
import BrutalistButton from "./BrutalistButton";

export interface PricingCardsProps {
  className?: string;
  onSelectPlan?: (planId: string) => void;
}

const PricingCard: React.FC<{
  tier: PricingTier;
  onSelect?: (planId: string) => void;
  index: number;
}> = ({ tier, onSelect, index }) => {
  const isPopular = tier.popular;

  return (
    <motion.div
      className={cn(
        "relative bg-white border-5 border-black p-8 font-mono",
        "transition-all duration-300 hover:transform hover:-translate-y-2",
        "hover:shadow-[8px_8px_0px_#000000]",
        isPopular && "border-brutalist-yellow bg-brutalist-yellow",
        "flex flex-col h-full"
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        boxShadow: "8px 8px 0px #000000",
        transition: { duration: 0.3 },
      }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black text-brutalist-yellow px-4 py-2 border-3 border-black font-black uppercase text-sm tracking-wider flex items-center gap-2">
            <Star size={16} fill="currentColor" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black uppercase tracking-wider mb-2">
          {tier.name}
        </h3>
        <div className="text-4xl font-black mb-4">{tier.price}</div>
        <p className="text-sm font-medium opacity-80 leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Features */}
      <div className="flex-grow mb-8">
        <ul className="space-y-3">
          {tier.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              className="flex items-start gap-3 text-sm font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + featureIndex * 0.05,
              }}
            >
              <Check
                size={16}
                className="mt-0.5 flex-shrink-0 text-black"
                strokeWidth={3}
              />
              <span className="leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Delivery time */}
      <div className="mb-6 p-4 border-3 border-current bg-white/50">
        <div className="text-xs font-black uppercase tracking-wider opacity-60 mb-1">
          Delivery Time
        </div>
        <div className="text-sm font-bold">{tier.delivery}</div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <BrutalistButton
          variant={isPopular ? "accent" : "primary"}
          size="lg"
          glow={isPopular}
          onClick={() => onSelect?.(tier.id)}
          className="w-full"
          ariaLabel={`Select ${tier.name} plan`}
        >
          {tier.cta}
        </BrutalistButton>
      </div>
    </motion.div>
  );
};

const PricingCards: React.FC<PricingCardsProps> = ({
  className,
  onSelectPlan,
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-6 font-mono">
          Pricing Plans
        </h2>
        <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto font-mono leading-relaxed">
          Choose the perfect plan for your project. All plans include brutalist
          design, responsive development, and my signature attention to detail.
        </p>
      </motion.div>

      {/* Pricing Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols
-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {PRICING_TIERS.map((tier, index) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            onSelect={onSelectPlan}
            index={index}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center mt-16 p-8 border-5 border-black bg-brutalist-yellow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-black uppercase tracking-wider mb-4 font-mono">
          Need Something Custom?
        </h3>
        <p className="text-lg font-medium mb-6 font-mono leading-relaxed">
          Every project is unique. Let&apos;s discuss your specific requirements
          and create a custom solution.
        </p>
        <BrutalistButton
          variant="primary"
          size="lg"
          onClick={() => onSelectPlan?.("custom")}
          ariaLabel="Contact for custom pricing"
        >
          Get Custom Quote
        </BrutalistButton>
      </motion.div>
    </div>
  );
};

export default PricingCards;
