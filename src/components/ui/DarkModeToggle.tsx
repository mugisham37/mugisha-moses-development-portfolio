"use client";

import { useTheme } from "@/components/providers";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

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
        ${getSizeClasses(size)}
        ${isDark ? "brutalist-toggle-dark" : "brutalist-toggle-light"}
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
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
              />
            ) : (
              <Sun size={getIconSize(size)} className="brutalist-toggle-sun" />
            )}
          </div>
        </div>
      </div>

      {/* Background Icons */}
      <div className="brutalist-toggle-bg-icons">
        <Sun
          size={getIconSize(size)}
          className={`brutalist-toggle-bg-sun ${
            !isDark ? "opacity-0" : "opacity-30"
          }`}
        />
        <Moon
          size={getIconSize(size)}
          className={`brutalist-toggle-bg-moon ${
            isDark ? "opacity-0" : "opacity-30"
          }`}
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
