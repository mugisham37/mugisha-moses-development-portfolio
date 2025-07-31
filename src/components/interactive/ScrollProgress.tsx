"use client";

import { useEffect, useState, useRef } from "react";
import { BRUTALIST_COLORS } from "@/lib/constants";

interface ScrollProgressProps {
  height?: number;
  position?: "top" | "bottom";
  showPercentage?: boolean;
  className?: string;
}

export default function ScrollProgress({
  height = 4,
  position = "top",
  showPercentage = false,
  className = "",
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  // Calculate scroll progress
  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const totalScrollableHeight = scrollHeight - clientHeight;
      const progress =
        totalScrollableHeight > 0
          ? (scrollTop / totalScrollableHeight) * 100
          : 0;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(scrollTop > 100); // Show after scrolling 100px
    };

    const handleScroll = () => {
      // Use RAF to throttle scroll events for better performance
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(calculateScrollProgress);
    };

    // Initial calculation
    calculateScrollProgress();

    // Add scroll listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateScrollProgress, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateScrollProgress);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const positionClasses = {
    top: "top-0",
    bottom: "bottom-0",
  };

  return (
    <div
      ref={progressRef}
      className={`
        fixed left-0 right-0 z-50
        ${positionClasses[position]}
        ${className}
      `}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Page scroll progress: ${Math.round(scrollProgress)}%`}
    >
      {/* Background bar */}
      <div
        className="absolute inset-0 bg-gray-800"
        style={{
          backgroundColor: BRUTALIST_COLORS.gray,
          border: `1px solid ${BRUTALIST_COLORS.black}`,
        }}
      />

      {/* Progress bar */}
      <div
        className="absolute inset-0 transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: BRUTALIST_COLORS.yellow,
          border: `1px solid ${BRUTALIST_COLORS.black}`,
          boxShadow: `2px 2px 0px ${BRUTALIST_COLORS.black}`,
        }}
      />

      {/* Percentage indicator */}
      {showPercentage && (
        <div
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold font-mono px-2 py-1"
          style={{
            backgroundColor: BRUTALIST_COLORS.black,
            color: BRUTALIST_COLORS.yellow,
            border: `1px solid ${BRUTALIST_COLORS.yellow}`,
          }}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}

      {/* Brutalist accent elements */}
      <div
        className="absolute left-0 top-0 w-2 h-full"
        style={{
          backgroundColor: BRUTALIST_COLORS.black,
          borderRight: `1px solid ${BRUTALIST_COLORS.yellow}`,
        }}
      />
      <div
        className="absolute right-0 top-0 w-2 h-full"
        style={{
          backgroundColor: BRUTALIST_COLORS.black,
          borderLeft: `1px solid ${BRUTALIST_COLORS.yellow}`,
        }}
      />
    </div>
  );
}
