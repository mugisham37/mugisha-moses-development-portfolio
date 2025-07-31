"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export default function LazyWrapper({
  children,
  fallback,
  className,
  rootMargin = "100px",
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
}: LazyWrapperProps) {
  const [isInView, setIsInView] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          if (delay > 0) {
            setTimeout(() => {
              setShouldRender(true);
            }, delay);
          } else {
            setShouldRender(true);
          }

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
          setShouldRender(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, delay]);

  const defaultFallback = (
    <div className="animate-pulse bg-gray-200 rounded h-32 w-full" />
  );

  return (
    <div ref={elementRef} className={cn("min-h-[1px]", className)}>
      {shouldRender ? (
        <div
          className={cn(
            "transition-opacity duration-500",
            isInView ? "opacity-100" : "opacity-0"
          )}
        >
          {children}
        </div>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
}
