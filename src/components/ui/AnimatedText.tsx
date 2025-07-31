"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedTextProps {
  text: string;
  variant: "typing" | "reveal" | "glitch";
  delay?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
  speed?: number; // For typing effect
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = "typing",
  delay = 0,
  className,
  onComplete,
  loop = false,
  speed = 100, // milliseconds per character
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setCurrentIndex] = useState(0);

  // Typing animation effect
  useEffect(() => {
    if (variant === "typing") {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        let index = 0;
        const typingInterval = setInterval(() => {
          if (index <= text.length) {
            setDisplayText(text.slice(0, index));
            setCurrentIndex(index);
            index++;
          } else {
            clearInterval(typingInterval);
            setIsAnimating(false);
            onComplete?.();

            if (loop) {
              setTimeout(() => {
                setDisplayText("");
                setCurrentIndex(0);
                index = 0;
              }, 2000);
            }
          }
        }, speed);

        return () => clearInterval(typingInterval);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [text, variant, delay, speed, onComplete, loop]);

  const getVariantClasses = () => {
    switch (variant) {
      case "typing":
        return "font-mono";
      case "reveal":
        return "overflow-hidden";
      case "glitch":
        return "relative";
      default:
        return "";
    }
  };

  const baseClasses = cn("inline-block", getVariantClasses(), className);

  // Typing variant
  if (variant === "typing") {
    return (
      <span className={baseClasses}>
        {displayText}
        {isAnimating && (
          <motion.span
            className="inline-block w-0.5 h-[1em] bg-current ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </span>
    );
  }

  // Reveal variant
  if (variant === "reveal") {
    return (
      <motion.span
        className={baseClasses}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay,
          ease: "easeOut",
        }}
        onAnimationComplete={onComplete}
      >
        {text}
      </motion.span>
    );
  }

  // Glitch variant
  if (variant === "glitch") {
    return (
      <motion.span
        className={baseClasses}
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 0.8, 1, 0.9, 1],
          x: [0, -2, 2, -1, 0],
        }}
        transition={{
          duration: 0.5,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: 2,
        }}
        onAnimationComplete={onComplete}
      >
        {text}
        {/* Glitch layers */}
        <motion.span
          className="absolute top-0 left-0 text-red-500 opacity-70"
          animate={{
            x: [-1, 1, -1],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 0.1,
            delay: delay + 0.1,
            repeat: loop ? Infinity : 2,
            repeatDelay: 2,
          }}
        >
          {text}
        </motion.span>
        <motion.span
          className="absolute top-0 left-0 text-blue-500 opacity-70"
          animate={{
            x: [1, -1, 1],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 0.1,
            delay: delay + 0.2,
            repeat: loop ? Infinity : 2,
            repeatDelay: 2,
          }}
        >
          {text}
        </motion.span>
      </motion.span>
    );
  }

  return <span className={baseClasses}>{text}</span>;
};

export default AnimatedText;
