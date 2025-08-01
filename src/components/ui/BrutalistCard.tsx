"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers";
import {
  BRUTALIST_COLORS,
  getHoverColors,
  getSafeTextColor,
  getContrastRatio,
  validateColorCombinations,
} from "@/lib/color-utils";

/**
 * Enhanced BrutalistCard component with improved color contrast and accessibility features
 *
 * Features:
 * - Theme-aware color selection with automatic contrast validation
 * - Custom color support with accessibility warnings
 * - High contrast mode for improved accessibility
 * - Enhanced hover effects that maintain proper contrast ratios
 * - Development-time color validation warnings
 * - Improved focus indicators with proper contrast
 * - Secondary text colors for better visual hierarchy
 *
 * @example
 * // Basic usage
 * <BrutalistCard title="My Card" description="Card description" />
 *
 * // Accent variant with yellow background
 * <BrutalistCard title="Accent Card" description="Description" accent />
 *
 * // High contrast mode for accessibility
 * <BrutalistCard title="Accessible Card" description="Description" highContrast />
 *
 * // Custom colors with automatic validation
 * <BrutalistCard
 *   title="Custom Card"
 *   description="Description"
 *   customColors={{ background: "#2a2a2a", text: "#ffffff", border: "#ffff00" }}
 * />
 */
export interface BrutalistCardProps {
  /** Card title text */
  title: string;
  /** Card description text */
  description: string;
  /** Use accent styling with yellow background */
  accent?: boolean;
  /** Hover animation effect */
  hover?: "invert" | "glow" | "lift";
  /** Additional content to render inside the card */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler - makes the card interactive */
  onClick?: () => void;
  /** Custom color overrides with automatic accessibility validation */
  customColors?: {
    background?: string;
    text?: string;
    border?: string;
  };
  /** Force high contrast mode for better accessibility */
  highContrast?: boolean;
}

const BrutalistCard: React.FC<BrutalistCardProps> = ({
  title,
  description,
  accent = false,
  hover = "lift",
  children,
  className,
  onClick,
  customColors,
  highContrast = false,
}) => {
  // Use theme with fallback for cases where ThemeProvider is not available
  let theme: "light" | "dark" = "light";
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Fallback to light theme if ThemeProvider is not available
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "BrutalistCard: ThemeProvider not found, using light theme fallback"
      );
    }
  }

  // Get theme-aware colors with enhanced contrast validation and custom color support
  const getCardColors = () => {
    let baseColors;

    if (accent) {
      // Yellow accent card with guaranteed safe text color
      const background = customColors?.background || BRUTALIST_COLORS.YELLOW;
      const text = customColors?.text || getSafeTextColor(background);
      const border =
        customColors?.border ||
        (theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK);

      baseColors = {
        background,
        text,
        border,
        // Additional colors for enhanced theme support
        secondaryText: getSafeTextColor(background, false), // For description text
        dividerColor: text, // For internal dividers
      };
    } else {
      // Default card with enhanced theme-aware colors
      const defaultBackground =
        theme === "dark" ? BRUTALIST_COLORS.BLACK : BRUTALIST_COLORS.WHITE;

      // For light theme, use slightly off-white background for better contrast unless custom colors are provided
      const enhancedBackground =
        customColors?.background ||
        (theme === "light" ? BRUTALIST_COLORS.LIGHT_GRAY : defaultBackground);

      const text = customColors?.text || getSafeTextColor(enhancedBackground);
      const border =
        customColors?.border ||
        (theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK);

      baseColors = {
        background: enhancedBackground,
        text,
        border,
        // Additional colors for enhanced theme support
        secondaryText:
          theme === "dark"
            ? BRUTALIST_COLORS.LIGHT_GRAY
            : BRUTALIST_COLORS.MEDIUM_GRAY,
        dividerColor:
          theme === "dark"
            ? BRUTALIST_COLORS.MEDIUM_GRAY
            : BRUTALIST_COLORS.MEDIUM_GRAY,
      };
    }

    // Apply high contrast mode if requested
    if (highContrast) {
      return {
        ...baseColors,
        background:
          theme === "dark" ? BRUTALIST_COLORS.BLACK : BRUTALIST_COLORS.WHITE,
        text:
          theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK,
        border:
          theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK,
        secondaryText:
          theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK,
        dividerColor:
          theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK,
      };
    }

    // Validate custom colors for accessibility if provided
    if (customColors) {
      const textContrastRatio = getContrastRatio(
        baseColors.text,
        baseColors.background
      );
      if (textContrastRatio < 4.5) {
        console.warn(
          `BrutalistCard: Custom color combination has insufficient contrast ratio (${textContrastRatio.toFixed(
            2
          )}:1). Using safe fallback.`
        );
        return {
          ...baseColors,
          text: getSafeTextColor(baseColors.background),
          secondaryText: getSafeTextColor(baseColors.background),
        };
      }
    }

    return baseColors;
  };

  const cardColors = getCardColors();

  // Get theme-aware hover colors with proper contrast validation
  const getHoverVariants = () => {
    const hoverColors = getHoverColors(cardColors.background);
    const shadowColor =
      theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK;

    // Validate hover colors for accessibility
    const validateHoverColors = (bg: string, text: string) => {
      const contrastRatio = getContrastRatio(text, bg);
      if (contrastRatio < 4.5) {
        // Fallback to safe colors if contrast is insufficient
        return {
          background:
            theme === "dark" ? BRUTALIST_COLORS.WHITE : BRUTALIST_COLORS.BLACK,
          text:
            theme === "dark" ? BRUTALIST_COLORS.BLACK : BRUTALIST_COLORS.WHITE,
        };
      }
      return { background: bg, text };
    };

    const safeHoverColors = validateHoverColors(
      hoverColors.background,
      hoverColors.text
    );

    switch (hover) {
      case "invert":
        return {
          hover: {
            backgroundColor: safeHoverColors.background,
            color: safeHoverColors.text,
            borderColor: BRUTALIST_COLORS.YELLOW,
            scale: 1.02,
            transition: { duration: 0.3 },
          },
        };
      case "glow":
        return {
          hover: {
            boxShadow: `0 0 20px ${BRUTALIST_COLORS.YELLOW}, 0 0 40px ${BRUTALIST_COLORS.YELLOW}`,
            borderColor: BRUTALIST_COLORS.YELLOW,
            scale: 1.02,
            transition: { duration: 0.3 },
          },
        };
      case "lift":
      default:
        return {
          hover: {
            y: -8,
            boxShadow: `8px 8px 0px ${shadowColor}`,
            transition: { duration: 0.3 },
          },
        };
    }
  };

  // Enhanced development-time color validation
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const combinations = [
        {
          foreground: cardColors.text,
          background: cardColors.background,
          context: `Title text (${accent ? "accent" : "default"} variant)`,
          isLargeText: true,
        },
        {
          foreground: cardColors.secondaryText || cardColors.text,
          background: cardColors.background,
          context: `Description text (${
            accent ? "accent" : "default"
          } variant)`,
          isLargeText: false,
        },
        {
          foreground: cardColors.border,
          background: cardColors.background,
          context: `Border contrast (${accent ? "accent" : "default"} variant)`,
          isLargeText: false,
        },
      ];

      validateColorCombinations(
        combinations,
        `BrutalistCard ${accent ? "(accent)" : "(default)"} - ${theme} theme`
      );
    }
  }, [cardColors, theme, accent]);

  const baseClasses = cn(
    // Base brutalist styling with theme-aware colors
    "border-5 p-6 font-mono font-bold transition-all duration-300",
    // Interactive styling
    onClick && "cursor-pointer",
    className
  );

  // Dynamic styles for theme-aware colors
  const cardStyle = {
    backgroundColor: cardColors.background,
    color: cardColors.text,
    borderColor: cardColors.border,
    boxShadow: `5px 5px 0px ${cardColors.border}`,
  };

  return (
    <motion.div
      className={baseClasses}
      style={cardStyle}
      variants={getHoverVariants()}
      whileHover="hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      // Accessibility attributes
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      // Enhanced focus styles for accessibility with proper contrast
      whileFocus={{
        outline: `3px solid ${BRUTALIST_COLORS.YELLOW}`,
        outlineOffset: "2px",
        // Add a contrasting background to the focus outline for better visibility
        boxShadow: `0 0 0 6px ${cardColors.background}, 0 0 0 9px ${BRUTALIST_COLORS.YELLOW}`,
      }}
    >
      <div className="space-y-4">
        <h3
          className="text-xl font-black uppercase tracking-wider"
          style={{ color: cardColors.text }}
        >
          {title}
        </h3>
        <p
          className="text-sm font-medium leading-relaxed"
          style={{
            color: cardColors.secondaryText || cardColors.text,
            // Remove opacity to ensure proper contrast
          }}
        >
          {description}
        </p>
        {children && (
          <div
            className="mt-4 border-t-3 pt-4"
            style={{ borderColor: cardColors.dividerColor || cardColors.text }}
          >
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrutalistCard;
