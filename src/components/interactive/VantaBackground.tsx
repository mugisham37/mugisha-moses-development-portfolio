"use client";

import React, { useEffect, useRef, useState } from "react";

interface VantaBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export default function VantaBackground({
  className = "",
  children,
}: VantaBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple mobile detection
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Load Vanta.js dynamically with improved error handling
  useEffect(() => {
    if (!isClient) return;

    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const loadVanta = async () => {
      try {
        // Skip Vanta on mobile devices for better performance
        if (isMobile) {
          console.warn("Mobile device detected, skipping Vanta.js");
          setIsLoaded(true);
          return;
        }

        // Dynamically import Vanta.js to avoid SSR issues
        await import("vanta/dist/vanta.dots.min.js");

        // Additional validation after import
        if (!window.VANTA || !window.VANTA.DOTS) {
          throw new Error("VANTA library not properly loaded");
        }

        if (!mounted || !vantaRef.current) return;

        // Initialize Vanta effect
        vantaEffect.current = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xffff00,
          color2: 0x0,
          backgroundColor: 0xffffff,
          size: 3.0,
          spacing: 35.0,
          showLines: true,
        });

        setIsLoaded(true);
        console.log("✨ Vanta.js loaded successfully");
      } catch (error) {
        console.error("Failed to load Vanta.js:", error);
        setHasError(true);
        setIsLoaded(true);

        // Retry logic
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying Vanta.js load (${retryCount}/${maxRetries})`);
          setTimeout(loadVanta, 2000 * retryCount);
        }
      }
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn("Error destroying Vanta effect:", error);
        }
      }
    };
  }, [isClient, isMobile]);

  // Handle resize
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.resize();
        } catch (error) {
          console.warn("Error resizing Vanta effect:", error);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  // Loading state
  if (!isClient) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-background" />
        {children}
      </div>
    );
  }

  // Error state or mobile - fallback
  if (hasError || isMobile) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-background" />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={vantaRef}
        className="absolute inset-0"
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
}
