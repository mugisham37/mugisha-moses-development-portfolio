"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BrutalistButtonProps {
  variant: "primary" | "secondary" | "accent";
  size: "sm" | "md" | "lg";
  glow?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  variant = "primary",
  size = "md",
  glow = false,
  onClick,
  children,
  className,
  disabled = false,
  type = "button",
  ariaLabel,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-brutalist-black text-brutalist-white border-brutalist-black hover:bg-brutalist-white hover:text-brutalist-black";
      case "secondary":
        return "bg-brutalist-white text-brutalist-black border-brutalist-black hover:bg-brutalist-black hover:text-brutalist-white";
      case "accent":
        return "bg-brutalist-yellow text-brutalist-black border-brutalist-black hover:bg-brutalist-black hover:text-brutalist-yellow";
      default:
        return "bg-brutalist-black text-brutalist-white border-brutalist-black";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const getHoverVariants = () => {
    const baseVariants = {
      hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
      },
    };

    if (glow) {
      return {
        ...baseVariants,
        hover: {
          ...baseVariants.hover,
          boxShadow: "0 0 20px #ffff00, 0 0 40px #ffff00",
        },
      };
    }

    return baseVariants;
  };

  const baseClasses = cn(
    // Base brutalist styling
    "border-5 font-mono font-black uppercase tracking-wider",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-4 focus:ring-brutalist-yellow focus:ring-opacity-50",
    "active:transform active:scale-95",
    // Variant classes
    getVariantClasses(),
    // Size classes
    getSizeClasses(),
    // Disabled state
    disabled && "opacity-50 cursor-not-allowed hover:scale-100",
    // Glow effect
    glow && "animate-glow",
    className
  );

  return (
    <motion.button
      className={baseClasses}
      variants={getHoverVariants()}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
};

export default BrutalistButton;
