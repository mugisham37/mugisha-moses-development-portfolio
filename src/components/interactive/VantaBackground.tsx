"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BRUTALIST_COLORS } from "@/lib/constants";

// Vanta.js types
interface VantaEffect {
  destroy: () => void;
  resize: () => void;
}

// Vanta options interface
interface VantaDotOptions {
  el: HTMLElement;
  THREE: typeof THREE;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  scale: number;
  scaleMobile: number;
  color: string;
  backgroundColor: string;
  size: number;
  spacing: number;
  showLines: boolean;
}

// Extend window to include VANTA
declare global {
  interface Window {
    VANTA?: {
      DOTS: (options: Partial<VantaDotOptions>) => VantaEffect;
    };
  }
}

interface VantaBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function VantaBackground({
  className = "",
  children,
}: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Vanta.js dynamically
  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      try {
        // Skip Vanta on very low-end mobile devices
        if (
          isMobile &&
          navigator.hardwareConcurrency &&
          navigator.hardwareConcurrency < 4
        ) {
          console.warn("Low-end device detected, skipping Vanta.js");
          setIsLoaded(true);
          return;
        }

        // Dynamically import Vanta.js to avoid SSR issues
        await import("vanta/dist/vanta.dots.min.js");

        if (
          mounted &&
          vantaRef.current &&
          !vantaEffect.current &&
          window.VANTA
        ) {
          // Initialize Vanta effect with brutalist theme
          vantaEffect.current = window.VANTA.DOTS({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: !isMobile,
            touchControls: isMobile,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: isMobile ? 0.8 : 1.0,
            scaleMobile: 0.6,
            color: BRUTALIST_COLORS.yellow,
            backgroundColor: BRUTALIST_COLORS.black,
            size: isMobile ? 2.5 : 4.0,
            spacing: isMobile ? 30.0 : 25.0,
            showLines: !isMobile, // Disable lines on mobile for better performance
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.warn("Failed to load Vanta.js:", error);
        setIsLoaded(true); // Still set loaded to show fallback
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadVanta, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect.current) {
        vantaEffect.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Performance monitoring and optimization
  useEffect(() => {
    if (!isLoaded) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;

    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      // Check FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // If FPS is consistently low on mobile, disable the effect
        if (isMobile && fps < 30) {
          lowFpsCount++;
          console.warn(
            `Low FPS detected on mobile: ${fps}fps (${lowFpsCount}/3)`
          );

          // Disable effect after 3 consecutive low FPS readings
          if (lowFpsCount >= 3 && vantaEffect.current) {
            console.warn("Disabling Vanta effect due to poor performance");
            vantaEffect.current.destroy();
            vantaEffect.current = null;
            return;
          }
        } else {
          lowFpsCount = 0;
        }
      }

      if (vantaEffect.current) {
        requestAnimationFrame(monitorPerformance);
      }
    };

    const animationId = requestAnimationFrame(monitorPerformance);
    return () => cancelAnimationFrame(animationId);
  }, [isLoaded, isMobile]);

  return (
    <div
      ref={vantaRef}
      className={`
        relative w-full h-full min-h-screen
        bg-black
        ${className}
      `}
      style={{
        // Ensure consistent dark background for text contrast
        background: BRUTALIST_COLORS.black,
      }}
    >
      {/* Fallback pattern for mobile or when Vanta fails to load */}
      {(isMobile || !isLoaded || !vantaEffect.current) && (
        <div
          className="absolute inset-0 opacity-30 animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${BRUTALIST_COLORS.yellow} 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, ${BRUTALIST_COLORS.yellow} 2px, transparent 2px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: "0 0, 25px 25px",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      )}

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 text-xs font-mono text-yellow-400 bg-black bg-opacity-75 px-2 py-1 rounded">
          Vanta: {isLoaded ? "Loaded" : "Loading"} | Mobile:{" "}
          {isMobile ? "Yes" : "No"}
        </div>
      )}
    </div>
  );
}
