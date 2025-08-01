"use client";

import { useTheme } from "@/components/providers";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  validateToggleVisibility,
  validateToggleFocusStates,
} from "@/utils/colorUtils";

interface DarkModeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function DarkModeToggle({
  className = "",
  size = "md",
}: DarkModeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate toggle visibility in development
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      validateToggleVisibility(theme);
      validateToggleFocusStates(theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div
        className={`brutalist-toggle-skeleton ${getSizeClasses(
          size
        )} ${className}`}
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        brutalist-toggle
        toggle-enhanced-visibility
        ${getSizeClasses(size)}
        ${isDark ? "brutalist-toggle-dark" : "brutalist-toggle-light"}
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-checked={isDark}
      role="switch"
    >
      {/* Toggle Track */}
      <div className="brutalist-toggle-track">
        {/* Toggle Thumb */}
        <div
          className={`
            brutalist-toggle-thumb
            ${
              isDark
                ? "brutalist-toggle-thumb-dark"
                : "brutalist-toggle-thumb-light"
            }
          `}
        >
          {/* Icon Container */}
          <div className="brutalist-toggle-icon">
            {isDark ? (
              <Moon
                size={getIconSize(size)}
                className="brutalist-toggle-moon"
                data-testid="moon-icon"
              />
            ) : (
              <Sun
                size={getIconSize(size)}
                className="brutalist-toggle-sun"
                data-testid="sun-icon"
              />
            )}
          </div>
        </div>
      </div>

      {/* Background Icons */}
      <div className="brutalist-toggle-bg-icons">
        <Sun
          size={getIconSize(size)}
          className={`brutalist-toggle-bg-sun ${
            !isDark ? "opacity-0" : "opacity-80"
          }`}
          data-testid="bg-sun-icon"
        />
        <Moon
          size={getIconSize(size)}
          className={`brutalist-toggle-bg-moon ${
            isDark ? "opacity-0" : "opacity-80"
          }`}
          data-testid="bg-moon-icon"
        />
      </div>
    </button>
  );
}

function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "brutalist-toggle-sm";
    case "lg":
      return "brutalist-toggle-lg";
    default:
      return "brutalist-toggle-md";
  }
}

function getIconSize(size: "sm" | "md" | "lg"): number {
  switch (size) {
    case "sm":
      return 14;
    case "lg":
      return 20;
    default:
      return 16;
  }
}
