"use client";

import { useEffect, useRef, useState } from "react";
import { BRUTALIST_COLORS } from "@/lib/constants";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  size: number;
  id: number;
}

interface CursorTrailProps {
  maxDots?: number;
  dotSize?: number;
  disabled?: boolean;
}

export default function CursorTrail({
  maxDots = 15,
  dotSize = 4,
  disabled = false,
}: CursorTrailProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const trailRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<TrailDot[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const dotIdCounter = useRef(0);

  // Detect mobile devices and user preferences
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    const checkMotionPreference = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setIsEnabled(!isMobile && !prefersReducedMotion && !disabled);
    };

    checkMobile();
    checkMotionPreference();

    window.addEventListener("resize", checkMobile);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkMotionPreference);

    return () => {
      window.removeEventListener("resize", checkMobile);
      mediaQuery.removeEventListener("change", checkMotionPreference);
    };
  }, [disabled, isMobile]);

  // Mouse tracking
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isEnabled]);

  // Animation loop
  useEffect(() => {
    if (!isEnabled) return;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime.current;

      // Throttle to ~60fps for performance
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTime.current = currentTime;

      // Add new dot at mouse position
      if (mousePos.current.x !== 0 || mousePos.current.y !== 0) {
        dotsRef.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          opacity: 1,
          size: dotSize,
          id: dotIdCounter.current++,
        });

        // Remove excess dots
        if (dotsRef.current.length > maxDots) {
          dotsRef.current.shift();
        }
      }

      // Update existing dots
      dotsRef.current = dotsRef.current
        .map((dot, index) => ({
          ...dot,
          opacity: Math.max(0, 1 - (dotsRef.current.length - index) / maxDots),
          size: dotSize * (0.5 + 0.5 * dot.opacity),
        }))
        .filter((dot) => dot.opacity > 0.01);

      // Render dots
      if (trailRef.current) {
        trailRef.current.innerHTML = dotsRef.current
          .map(
            (dot) => `
            <div
              style="
                position: fixed;
                left: ${dot.x - dot.size / 2}px;
                top: ${dot.y - dot.size / 2}px;
                width: ${dot.size}px;
                height: ${dot.size}px;
                background-color: ${BRUTALIST_COLORS.yellow};
                border: 1px solid ${BRUTALIST_COLORS.black};
                opacity: ${dot.opacity};
                pointer-events: none;
                z-index: 9999;
                transform: scale(${dot.opacity});
                transition: transform 0.1s ease-out;
              "
            ></div>
          `
          )
          .join("");
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isEnabled, maxDots, dotSize]);

  // Performance monitoring
  useEffect(() => {
    if (!isEnabled) return;

    let frameCount = 0;
    let lastPerfTime = performance.now();

    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastPerfTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastPerfTime = currentTime;

        // Disable if performance is poor
        if (fps < 45) {
          console.warn(
            `CursorTrail: Low FPS detected (${fps}), disabling effect`
          );
          setIsEnabled(false);
          return;
        }
      }

      if (isEnabled) {
        requestAnimationFrame(monitorPerformance);
      }
    };

    const perfAnimationId = requestAnimationFrame(monitorPerformance);
    return () => cancelAnimationFrame(perfAnimationId);
  }, [isEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      dotsRef.current = [];
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      ref={trailRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "difference" }}
      aria-hidden="true"
    />
  );
}
