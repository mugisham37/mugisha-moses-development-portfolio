"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BrutalistCardProps {
  title: string;
  description: string;
  accent?: boolean;
  hover?: "invert" | "glow" | "lift";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const BrutalistCard: React.FC<BrutalistCardProps> = ({
  title,
  description,
  accent = false,
  hover = "lift",
  children,
  className,
  onClick,
}) => {
  const getHoverVariants = () => {
    switch (hover) {
      case "invert":
        return {
          hover: {
            backgroundColor: "#000000",
            color: "#ffffff",
            borderColor: "#ffff00",
            scale: 1.02,
            transition: { duration: 0.3 },
          },
        };
      case "glow":
        return {
          hover: {
            boxShadow: "0 0 20px #ffff00, 0 0 40px #ffff00",
            borderColor: "#ffff00",
            scale: 1.02,
            transition: { duration: 0.3 },
          },
        };
      case "lift":
      default:
        return {
          hover: {
            y: -8,
            boxShadow: "8px 8px 0px #000000",
            transition: { duration: 0.3 },
          },
        };
    }
  };

  const baseClasses = cn(
    // Base brutalist styling
    "border-5 border-black bg-white p-6",
    "font-mono font-bold",
    "transition-all duration-300",
    // Accent styling
    accent && "border-brutalist-yellow bg-brutalist-yellow text-black",
    // Interactive styling
    onClick && "cursor-pointer",
    className
  );

  return (
    <motion.div
      className={baseClasses}
      variants={getHoverVariants()}
      whileHover="hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-wider">{title}</h3>
        <p className="text-sm font-medium leading-relaxed opacity-80">
          {description}
        </p>
        {children && (
          <div className="mt-4 border-t-3 border-current pt-4">{children}</div>
        )}
      </div>
    </motion.div>
  );
};

export default BrutalistCard;
