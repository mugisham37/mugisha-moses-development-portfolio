"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StickyContactButtonProps {
  className?: string;
  onQuoteClick?: () => void;
}

const StickyContactButton: React.FC<StickyContactButtonProps> = ({
  className,
  onQuoteClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }
      // Hide button when scrolling down (but not if expanded)
      else if (currentScrollY > lastScrollY && !isExpanded) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isExpanded]);

  // Track clicks for conversion optimization
  const handleClick = (action: string) => {
    // Analytics tracking would go here
    console.log(`Sticky button clicked: ${action}`);

    if (action === "quote" && onQuoteClick) {
      onQuoteClick();
    }
  };

  const contactOptions = [
    {
      icon: <Phone size={20} />,
      label: "Call",
      action: () => {
        handleClick("phone");
        window.open("tel:+15551234567", "_self");
      },
      color: "bg-brutalist-yellow",
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      action: () => {
        handleClick("email");
        window.open("mailto:hello@yourname.dev", "_self");
      },
      color: "bg-brutalist-white",
    },
    {
      icon: <Calendar size={20} />,
      label: "Book Call",
      action: () => {
        handleClick("calendar");
        window.open("https://calendly.com/yourname", "_blank");
      },
      color: "bg-brutalist-yellow",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3",
            className
          )}
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Contact Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, staggerChildren: 0.05 }}
              >
                {contactOptions.map((option, index) => (
                  <motion.button
                    key={option.label}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 border-3 border-black font-mono font-black uppercase text-sm tracking-wider",
                      "transition-all duration-300 hover:scale-105",
                      "shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000]",
                      option.color,
                      option.color === "bg-brutalist-white"
                        ? "text-black hover:bg-black hover:text-white"
                        : "text-black hover:bg-black hover:text-brutalist-yellow"
                    )}
                    onClick={option.action}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: -4, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.icon}
                    <span className="whitespace-nowrap">{option.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            className={cn(
              "relative flex items-center justify-center w-16 h-16 border-5 border-black font-mono font-black",
              "transition-all duration-300",
              "shadow-[6px_6px_0px_#000000] hover:shadow-[8px_8px_0px_#000000]",
              isExpanded
                ? "bg-brutalist-black text-brutalist-yellow"
                : "bg-brutalist-yellow text-black hover:bg-black hover:text-brutalist-yellow"
            )}
            onClick={() => {
              if (isExpanded) {
                setIsExpanded(false);
              } else {
                setIsExpanded(true);
                handleClick("expand");
              }
            }}
            whileHover={{
              scale: 1.05,
              x: -4,
              y: -4,
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotate: isExpanded ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}

            {/* Pulse animation when not expanded */}
            {!isExpanded && (
              <motion.div
                className="absolute inset-0 border-5 border-brutalist-yellow rounded-none"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>

          {/* Get Quote Button - appears when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                className={cn(
                  "px-6 py-3 border-5 border-black bg-brutalist-yellow text-black font-mono font-black uppercase text-sm tracking-wider",
                  "transition-all duration-300 hover:bg-black hover:text-brutalist-yellow",
                  "shadow-[6px_6px_0px_#000000] hover:shadow-[8px_8px_0px_#000000]",
                  "whitespace-nowrap"
                )}
                onClick={() => {
                  handleClick("quote");
                  // Scroll to contact section or open modal
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsExpanded(false);
                }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{
                  scale: 1.05,
                  x: -4,
                  y: -4,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Quote
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyContactButton;
